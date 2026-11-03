/**
 * Record authorship for any contenteditable element.
 *
 * Listeners never change an edit; they only note what kind of edit comes
 * next (typing, a paste, a drop, undo). After the DOM changes, the editor's
 * text is compared with the last known text and the inserted ranges get
 * that origin. Text that changes with no known cause is "external".
 */
import { sealBatch } from '../core/chain';
import { AuthorshipEngine, type ChangeRecord, type EngineOptions, type Fragment, type Piece } from '../core/engine';
import { textHash } from '../core/hash';
import { buildReport, type AuthorshipReport, type ReportOptions } from '../core/report';
import { runsLength, scaleRuns } from '../core/runs';
import type { AuthorshipState, ChangeCause, LogBatch, Origin, OriginKind, OriginSpec, Run, WitnessReceipt } from '../core/types';
import { detectPasteSource } from './detect';
import { buildDocMap, offsetOfPoint, offsetsOfRange, type DocMap } from './text';

/** Attribute that marks inserted text's origin: `data-provenance="ai"` plus `data-provenance-model` etc. */
export const PROVENANCE_ATTR = 'data-provenance';
/** Event a tool dispatches on (or inside) the editor right before it inserts text. */
export const EXPECT_EVENT = 'provenance:expect';

export interface WitnessOptions {
  /** Endpoint made with `createAuthorshipWitness` from `@editora/authorship/server`. */
  url: string;
  /** Stable id for this document; it goes on every receipt. */
  doc: string;
  /** How often to seal and send a batch (default 15 seconds). */
  intervalMs?: number;
  headers?: Record<string, string>;
  fetch?: typeof fetch;
}

export interface AttachAuthorshipOptions extends EngineOptions {
  /** Start recording right away (default false: call `start()`). */
  autoStart?: boolean;
  /** A state saved earlier with `serialize()`, applied when recording starts. */
  state?: AuthorshipState;
  /** Send hash-chained batches to a witness server. Only hashes are sent, never text. */
  witness?: WitnessOptions;
  /** Called after each recorded change. */
  onChange?: (change: AuthorshipChange) => void;
}

export interface AuthorshipChange extends ChangeRecord {
  text: string;
}

export interface ExpectOptions {
  /** How long the expectation waits for a change (default 2 seconds). */
  timeoutMs?: number;
}

type Events = {
  change: AuthorshipChange;
  receipt: WitnessReceipt;
  error: Error;
  start: void;
  stop: void;
};

export interface AuthorshipController {
  readonly root: HTMLElement;
  readonly engine: AuthorshipEngine;
  readonly recording: boolean;
  /** Start recording; `state` restores a saved record for the current content. */
  start(state?: AuthorshipState): void;
  /** Stop recording (the record is kept; `start()` picks up from the current text). */
  stop(): void;
  /** The next text change comes from `origin` (for tools that insert text directly). */
  expect(origin: OriginSpec, options?: ExpectOptions): void;
  /** Bring the record up to date with the DOM now. */
  sync(): void;
  getText(): string;
  getMap(): DocMap;
  getRuns(): Run[];
  getOrigins(): Origin[];
  originAt(offset: number): Origin | undefined;
  /** Origin of the text under a DOM point (e.g. from caretPositionFromPoint). */
  originAtPoint(node: Node, offset: number): Origin | undefined;
  getReport(options?: ReportOptions): AuthorshipReport;
  serialize(options?: { text?: boolean; log?: boolean }): AuthorshipState;
  /** Seal and send pending batches to the witness now. */
  flush(): Promise<void>;
  on<K extends keyof Events>(event: K, listener: (value: Events[K]) => void): () => void;
  destroy(): void;
}

interface Pending {
  cause: ChangeCause;
  origin: OriginSpec | 'inherit';
  hint?: number;
  fragment?: Fragment;
  until: number;
  sticky?: boolean;
}

const KINDS = new Set<OriginKind>(['existing', 'typed', 'pasted', 'ai', 'tool', 'collaborator', 'external']);
const TYPING = /^(insertText|insertCompositionText|insertParagraph|insertLineBreak|insertTranspose|insertFromYank|insertOrderedList|insertUnorderedList|insertHorizontalRule|delete(Content|Word|SoftLine|HardLine|Entire)\w*)$/;
const PENDING_MS = 600;
const TOOL_WINDOW_MS = 800;
const SNAPSHOTS = 200;
const FRAGMENTS = 20;
const FRAGMENT_MS = 10 * 60_000;

// Shared by every editor on the page: copy in one, paste in another keeps origins.
const recentFragments: Array<{ key: string; fragment: Fragment; t: number }> = [];

const fragmentKey = (text: string) => text.replace(/￼/g, '').replace(/\s+/g, ' ').trim();

function rememberFragment(fragment: Fragment): void {
  const key = fragmentKey(fragment.text);
  if (key.length < 2) return;
  const existing = recentFragments.findIndex((entry) => entry.key === key);
  if (existing >= 0) recentFragments.splice(existing, 1);
  recentFragments.push({ key, fragment, t: Date.now() });
  if (recentFragments.length > FRAGMENTS) recentFragments.shift();
}

function findFragment(text: string): Fragment | undefined {
  const key = fragmentKey(text);
  if (key.length < 2) return undefined;
  const now = Date.now();
  for (let i = recentFragments.length - 1; i >= 0; i -= 1) {
    const entry = recentFragments[i];
    if (now - entry.t <= FRAGMENT_MS && entry.key === key) return entry.fragment;
  }
  return undefined;
}

/** Origin described by a `data-provenance` element. */
function specFromElement(element: Element, author: string | undefined): OriginSpec | null {
  const kind = element.getAttribute(PROVENANCE_ATTR) as OriginKind;
  if (!KINDS.has(kind)) return null;
  const read = (name: string) => element.getAttribute(`${PROVENANCE_ATTR}-${name}`) || undefined;
  return { kind, author: read('author') ?? author, source: read('source'), model: read('model'), provider: read('provider'), label: read('label') };
}

const isApple = () => typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);

export function attachAuthorship(root: HTMLElement, options: AttachAuthorshipOptions = {}): AuthorshipController {
  const engine = new AuthorshipEngine(options);
  const doc = root.ownerDocument;
  const win = doc.defaultView ?? window;
  const listeners = new Map<keyof Events, Set<(value: never) => void>>();
  const snapshots = new Map<string, Run[]>();
  let recording = false;
  let destroyed = false;
  let map: DocMap = buildDocMap(root);
  let pending: Pending | null = null;
  let composing = false;
  let lastOutside = 0;
  let lastKey = 0;
  let lastCommand: string | undefined;
  let dragFragment: Fragment | null = null;
  let witnessTimer: ReturnType<typeof setInterval> | null = null;
  let sending: Promise<void> | null = null;

  const emit = <K extends keyof Events>(event: K, value: Events[K]) => {
    listeners.get(event)?.forEach((listener) => {
      try {
        (listener as (value: Events[K]) => void)(value);
      } catch (error) {
        if (event !== 'error') emit('error', error instanceof Error ? error : new Error(String(error)));
      }
    });
  };

  const author = () => engine.author;
  const typed = (): OriginSpec => ({ kind: 'typed', author: author() });
  const now = () => Date.now();

  const setPending = (next: Omit<Pending, 'until'> & { until?: number }) => {
    if (pending?.sticky && pending.until >= now() && !next.sticky) return;
    pending = { until: now() + PENDING_MS, ...next };
  };

  const remember = (text: string) => {
    snapshots.delete(text.length + ':' + textHash(text));
    snapshots.set(text.length + ':' + textHash(text), engine.runs.map((run) => [...run] as Run));
    if (snapshots.size > SNAPSHOTS) snapshots.delete(snapshots.keys().next().value as string);
  };

  const assignFor = (next: DocMap, origin: OriginSpec | 'inherit', fragment: Fragment | undefined, allowReuse: boolean) => {
    const cache = new Map<Element, OriginSpec | null>();
    const provenanceOf = (node: Node): OriginSpec | null => {
      const parent = node.parentElement;
      if (!parent) return null;
      if (!cache.has(parent)) {
        const marker = parent.closest(`[${PROVENANCE_ATTR}]`);
        cache.set(parent, marker && root.contains(marker) ? specFromElement(marker, author()) : null);
      }
      return cache.get(parent)!;
    };
    return (start: number, end: number): Piece[] => {
    const inserted = next.text.slice(start, end);
    if (allowReuse) {
      const source = fragment && fragmentKey(fragment.text) === fragmentKey(inserted) ? fragment : findFragment(inserted);
      if (source) return scaleRuns(engine.adoptFragment(source), inserted.length).map(([len, id]) => ({ len, origin: id }));
    }
    const pieces: Piece[] = [];
    const add = (len: number, spec: OriginSpec | 'inherit') => {
      if (len <= 0) return;
      const last = pieces[pieces.length - 1];
      if (last && (last.origin === spec || (typeof last.origin === 'object' && typeof spec === 'object' && JSON.stringify(last.origin) === JSON.stringify(spec)))) last.len += len;
      else pieces.push({ len, origin: spec });
    };
    let pos = start;
    for (const segment of next.segments) {
      if (segment.end <= start) continue;
      if (segment.start >= end) break;
      const from = Math.max(start, segment.start);
      const to = Math.min(end, segment.end);
      add(from - pos, origin);
      add(to - from, provenanceOf(segment.node) ?? origin);
      pos = to;
    }
    add(end - pos, origin);
    return pieces;
    };
  };

  const reconcile = () => {
    if (!recording || composing || destroyed) return;
    const next = buildDocMap(root);
    map = next;
    if (next.text === engine.text) return;

    const t = now();
    const current = pending && pending.until >= t ? pending : null;
    pending = null;
    let cause: ChangeCause;
    let origin: OriginSpec | 'inherit';
    if (current) {
      cause = current.cause;
      origin = current.origin;
    } else if (t - lastOutside < TOOL_WINDOW_MS || t - lastKey < TOOL_WINDOW_MS) {
      cause = 'tool';
      origin = { kind: 'tool', author: author(), source: lastCommand };
    } else {
      cause = 'external';
      origin = { kind: 'external' };
    }

    // Undo (Editora's history restores HTML without beforeinput): reuse the origins that text had.
    const snapshot = cause === 'undo' || cause === 'tool' || cause === 'external' ? snapshots.get(next.text.length + ':' + textHash(next.text)) : undefined;
    if (snapshot && runsLength(snapshot) === next.text.length) cause = 'undo';
    const allowReuse = !snapshot && cause !== 'type' && cause !== 'correct';

    let change: ChangeRecord | null = null;
    try {
      change = engine.update(next.text, {
        cause,
        hint: current?.hint,
        now: t,
        ...(snapshot ? { runs: snapshot } : { assign: assignFor(next, origin, current?.fragment, allowReuse) }),
      });
    } catch (error) {
      emit('error', error instanceof Error ? error : new Error(String(error)));
      engine.reset(next.text, { kind: 'external' });
    }
    remember(next.text);
    if (!change) return;
    for (const fragment of change.removed) if (fragment.text.length >= 2) rememberFragment(fragment);
    const record: AuthorshipChange = { ...change, text: next.text };
    options.onChange?.(record);
    emit('change', record);
  };

  const observer = typeof MutationObserver !== 'undefined' ? new MutationObserver(() => reconcile()) : null;

  /** Apply DOM changes not seen yet, so `map` matches the DOM before reading offsets. */
  const catchUp = () => {
    if (observer?.takeRecords().length) reconcile();
  };

  const selectionFragment = (): Fragment | null => {
    const selection = doc.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
    const range = selection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return null;
    catchUp();
    const [start, end] = offsetsOfRange(map, range);
    return end > start ? engine.fragment(start, end) : null;
  };

  const caretHint = (event: InputEvent): number | undefined => {
    const target = event.getTargetRanges?.()[0];
    if (target) return offsetOfPoint(map, target.startContainer, target.startOffset);
    const selection = doc.getSelection();
    if (selection && selection.rangeCount > 0 && root.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      return offsetOfPoint(map, range.startContainer, range.startOffset);
    }
    return undefined;
  };

  const inRoot = (target: EventTarget | null) => target instanceof Node && root.contains(target);

  const onBeforeInput = (event: Event) => {
    if (!recording) return;
    const input = event as InputEvent;
    catchUp();
    const type = input.inputType || '';
    const hint = caretHint(input);
    if (TYPING.test(type)) setPending({ cause: 'type', origin: typed(), hint });
    else if (type === 'insertReplacementText') setPending({ cause: 'correct', origin: 'inherit', hint });
    else if (type === 'insertFromPaste' || type === 'insertFromPasteAsQuotation') {
      if (pending?.cause !== 'paste' || pending.until < now()) {
        const data = input.dataTransfer;
        const info = detectPasteSource(data?.getData('text/html') ?? '', data?.getData('text/plain') ?? '', data ? Array.from(data.types) : []);
        setPending({ cause: 'paste', origin: { kind: 'pasted', author: author(), source: info.source, via: 'paste', label: info.url }, hint });
      } else pending.hint = hint;
    } else if (type === 'insertFromDrop') {
      if (pending?.cause !== 'drop' && pending?.cause !== 'move') setPending({ cause: 'drop', origin: { kind: 'pasted', author: author(), source: 'web', via: 'drop' }, hint });
      else pending.hint = hint;
    } else if (type === 'deleteByDrag' || type === 'deleteByCut') setPending({ cause: 'move', origin: typed(), hint });
    else if (type === 'historyUndo' || type === 'historyRedo') setPending({ cause: 'undo', origin: { kind: 'external' }, hint });
  };

  const onInput = () => {
    catchUp();
    reconcile();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!recording) return;
    const mod = isApple() ? event.metaKey : event.ctrlKey;
    const key = event.key.toLowerCase();
    if (mod && (key === 'z' || key === 'y')) {
      setPending({ cause: 'undo', origin: { kind: 'external' } });
      return;
    }
    // Keys the editor handles itself (slash menus, shortcuts) may change text without beforeinput.
    if (mod || event.altKey || key === 'enter' || key === 'tab' || key === 'escape') {
      lastKey = now();
      lastCommand = undefined;
    }
  };

  const onOutsideInteraction = (event: Event) => {
    if (!recording || inRoot(event.target)) return;
    lastOutside = now();
    const command = (event.target as Element | null)?.closest?.('[data-command]')?.getAttribute('data-command');
    lastCommand = command ?? undefined;
  };

  const onPaste = (event: ClipboardEvent) => {
    if (!recording || !inRoot(event.target)) return;
    const data = event.clipboardData;
    const html = data?.getData('text/html') ?? '';
    const text = data?.getData('text/plain') ?? '';
    const internal = findFragment(text);
    const info = detectPasteSource(html, text, data ? Array.from(data.types) : []);
    catchUp();
    setPending({
      cause: 'paste',
      origin: { kind: 'pasted', author: author(), source: info.source, via: 'paste', label: info.url },
      fragment: internal,
      until: now() + 2000,
    });
  };

  const onDragStart = (event: DragEvent) => {
    dragFragment = inRoot(event.target) ? selectionFragment() : null;
  };

  const onDrop = (event: DragEvent) => {
    if (!recording || !inRoot(event.target)) return;
    const data = event.dataTransfer;
    if (dragFragment) {
      setPending({ cause: 'move', origin: typed(), fragment: dragFragment, until: now() + 2000 });
      dragFragment = null;
      return;
    }
    const info = detectPasteSource(data?.getData('text/html') ?? '', data?.getData('text/plain') ?? '', data ? Array.from(data.types) : []);
    setPending({ cause: 'drop', origin: { kind: 'pasted', author: author(), source: info.source, via: 'drop', label: info.url }, until: now() + 2000 });
  };

  const onCopy = () => {
    const fragment = selectionFragment();
    if (fragment) rememberFragment(fragment);
  };

  const onCompositionStart = () => {
    composing = true;
  };
  const onCompositionEnd = () => {
    composing = false;
    setPending({ cause: 'type', origin: typed() });
    win.setTimeout(() => reconcile(), 0);
  };

  const onExpect = (event: Event) => {
    const detail = (event as CustomEvent<OriginSpec & { timeoutMs?: number }>).detail;
    if (detail && KINDS.has(detail.kind)) controller.expect(detail, { timeoutMs: detail.timeoutMs });
  };

  root.addEventListener('beforeinput', onBeforeInput);
  root.addEventListener('input', onInput);
  root.addEventListener('keydown', onKeyDown);
  root.addEventListener('dragstart', onDragStart);
  root.addEventListener('copy', onCopy);
  root.addEventListener('cut', onCopy);
  root.addEventListener('compositionstart', onCompositionStart);
  root.addEventListener('compositionend', onCompositionEnd);
  root.addEventListener(EXPECT_EVENT, onExpect);
  // Window capture runs before any document-level paste handler (paste cleaners stop the event there).
  win.addEventListener('paste', onPaste, true);
  win.addEventListener('drop', onDrop, true);
  doc.addEventListener('pointerdown', onOutsideInteraction, true);
  doc.addEventListener('keydown', onOutsideInteraction, true);

  // Witness: seal batches on a timer and post their hashes in order.
  const sendBatches = async () => {
    const witness = options.witness;
    const log = engine.log;
    if (!witness || !log) return;
    await sealBatch(log);
    const doFetch = witness.fetch ?? fetch;
    for (const batch of log.batches ?? []) {
      if (batch.receipt) continue;
      const previous: LogBatch | undefined = log.batches![batch.seq - 1];
      const response = await doFetch(witness.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...witness.headers },
        body: JSON.stringify({ doc: witness.doc, seq: batch.seq, prev: batch.prev, hash: batch.hash, prevReceipt: previous?.receipt ?? null }),
      });
      if (!response.ok) throw new Error(`Witness answered ${response.status}: ${(await response.text()).slice(0, 200)}`);
      const receipt = (await response.json()) as WitnessReceipt;
      if (receipt.hash !== batch.hash || receipt.seq !== batch.seq) throw new Error('Witness receipt does not match the batch.');
      batch.receipt = receipt;
      emit('receipt', receipt);
    }
  };

  const flush = (): Promise<void> => {
    const run = async () => {
      if (sending) await sending.catch(() => undefined);
      catchUp();
      await sendBatches();
    };
    const promise = run().catch((error) => {
      emit('error', error instanceof Error ? error : new Error(String(error)));
      throw error;
    });
    sending = promise.finally(() => {
      if (sending === promise) sending = null;
    });
    return promise;
  };

  const controller: AuthorshipController = {
    root,
    engine,
    get recording() {
      return recording;
    },
    start(state) {
      if (destroyed || recording) return;
      map = buildDocMap(root);
      const saved = state ?? options.state;
      if (saved) engine.load(saved, map.text);
      else if (!engine.log && !engine.origins.length) engine.reset(map.text);
      else if (engine.text !== map.text) engine.update(map.text, { cause: 'external', origin: { kind: 'external' } });
      recording = true;
      remember(map.text);
      observer?.observe(root, { childList: true, characterData: true, subtree: true });
      if (options.witness) witnessTimer = setInterval(() => void flush().catch(() => undefined), options.witness.intervalMs ?? 15_000);
      emit('start', undefined);
    },
    stop() {
      if (!recording) return;
      catchUp();
      recording = false;
      observer?.disconnect();
      if (witnessTimer) clearInterval(witnessTimer);
      witnessTimer = null;
      emit('stop', undefined);
    },
    expect(origin, expectOptions = {}) {
      const cause: ChangeCause = origin.kind === 'ai' ? 'ai' : origin.kind === 'pasted' ? 'paste' : origin.kind === 'collaborator' ? 'remote' : origin.kind === 'typed' ? 'type' : 'tool';
      catchUp();
      pending = { cause, origin: { author: origin.kind === 'collaborator' ? undefined : author(), ...origin }, until: now() + (expectOptions.timeoutMs ?? 2000), sticky: true };
    },
    sync() {
      catchUp();
      reconcile();
    },
    getText: () => engine.text,
    getMap: () => {
      catchUp();
      return map;
    },
    getRuns: () => engine.runs.map((run) => [...run] as Run),
    getOrigins: () => engine.origins.map((origin) => ({ ...origin })),
    originAt: (offset) => engine.originAt(offset),
    originAtPoint(node, offset) {
      if (!root.contains(node)) return undefined;
      catchUp();
      return engine.originAt(offsetOfPoint(map, node, offset));
    },
    getReport: (reportOptions) => buildReport(engine.serialize(), reportOptions),
    serialize: (serializeOptions) => {
      catchUp();
      return engine.serialize(serializeOptions);
    },
    flush,
    on(event, listener) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(listener as (value: never) => void);
      return () => listeners.get(event)?.delete(listener as (value: never) => void);
    },
    destroy() {
      if (destroyed) return;
      controller.stop();
      destroyed = true;
      root.removeEventListener('beforeinput', onBeforeInput);
      root.removeEventListener('input', onInput);
      root.removeEventListener('keydown', onKeyDown);
      root.removeEventListener('dragstart', onDragStart);
      root.removeEventListener('copy', onCopy);
      root.removeEventListener('cut', onCopy);
      root.removeEventListener('compositionstart', onCompositionStart);
      root.removeEventListener('compositionend', onCompositionEnd);
      root.removeEventListener(EXPECT_EVENT, onExpect);
      win.removeEventListener('paste', onPaste, true);
      win.removeEventListener('drop', onDrop, true);
      doc.removeEventListener('pointerdown', onOutsideInteraction, true);
      doc.removeEventListener('keydown', onOutsideInteraction, true);
      listeners.clear();
    },
  };

  if (options.autoStart) controller.start();
  return controller;
}

/** Tell a recording editor that the next text change comes from `origin` (no import of this package needed). */
export function announceProvenance(target: Element, origin: OriginSpec & { timeoutMs?: number }): void {
  target.dispatchEvent(new CustomEvent(EXPECT_EVENT, { detail: origin, bubbles: true }));
}
