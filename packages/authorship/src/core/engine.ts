/**
 * Headless authorship engine: plain text in, origin runs and an event log
 * out. It never looks at the DOM, so it runs the same in a browser, a worker
 * or on a server (e.g. to rebuild a document from a log).
 */
import { diffText, type TextEdit } from './diff';
import { textHash } from './hash';
import { normalizeRuns, originIdAt, runsLength, sliceRuns, spliceRuns } from './runs';
import type { AuthorshipLog, AuthorshipState, ChangeCause, LogEvent, Origin, OriginKind, OriginSpec, Run } from './types';

/** Part of an insertion: `len` characters from one origin. */
export interface Piece {
  len: number;
  /** A new origin to register, an existing origin id, or "inherit" (the origin of the character before). */
  origin: OriginSpec | number | 'inherit';
}

export interface UpdateOptions {
  cause: ChangeCause;
  /** Caret offset before the change; settles ambiguous diffs. */
  hint?: number;
  /** Origin for every inserted character (default `{ kind: 'external' }`). */
  origin?: OriginSpec;
  /** Per-range origins: called with each inserted range in the new text. */
  assign?: (start: number, end: number) => Piece[];
  /** Runs for the whole new text to take inserted origins from (undo restoring an earlier state). */
  runs?: Run[];
  now?: number;
}

export interface ChangeRecord {
  cause: ChangeCause;
  t: number;
  edits: TextEdit[];
  /** Text the change removed, with its origins. */
  removed: Fragment[];
}

/** A copied stretch of text with its origins, for moving text between places. */
export interface Fragment {
  text: string;
  runs: Array<[number, Omit<Origin, 'id'>]>;
}

export interface EngineOptions {
  /** Name recorded for typed text. */
  author?: string;
  now?: () => number;
  /** "burst" (default) merges a run of keystrokes into one event; "keystroke" keeps every one. */
  timing?: 'burst' | 'keystroke';
  /** Keep an event log for replay and reports (default true). */
  log?: boolean;
  /** A pause longer than this starts a new writing session (default 30 minutes). */
  sessionGapMs?: number;
  /** Keystrokes closer than this merge into one burst (default 2 seconds). */
  burstGapMs?: number;
}

const SHARED_KINDS = new Set<OriginKind>(['typed', 'existing', 'external', 'tool', 'collaborator']);
const ORIGIN_FIELDS = ['kind', 'author', 'source', 'via', 'model', 'provider', 'label'] as const;

const sharedKey = (spec: OriginSpec, session: number) =>
  [...ORIGIN_FIELDS.map((field) => spec[field] ?? ''), spec.kind === 'typed' ? session : ''].join('\u0001');

const exactKey = (origin: Omit<Origin, 'id'>) => [...ORIGIN_FIELDS.map((field) => origin[field] ?? ''), origin.t, origin.session ?? ''].join('\u0001');

export class AuthorshipEngine {
  text = '';
  runs: Run[] = [];
  origins: Origin[] = [];
  log: AuthorshipLog | null = null;
  author: string | undefined;

  private readonly now: () => number;
  private readonly timing: 'burst' | 'keystroke';
  private readonly keepLog: boolean;
  private readonly sessionGapMs: number;
  private readonly burstGapMs: number;
  private shared = new Map<string, number>();
  private exact = new Map<string, number>();
  private session = 1;
  private lastTyped = 0;
  private updates = 0;

  constructor(options: EngineOptions = {}) {
    this.author = options.author;
    this.now = options.now ?? (() => Date.now());
    this.timing = options.timing ?? 'burst';
    this.keepLog = options.log ?? true;
    this.sessionGapMs = options.sessionGapMs ?? 30 * 60_000;
    this.burstGapMs = options.burstGapMs ?? 2000;
  }

  /** Start over: all of `text` gets one origin (default "existing": it was there before recording). */
  reset(text: string, origin: OriginSpec = { kind: 'existing' }): void {
    this.origins = [];
    this.shared.clear();
    this.exact.clear();
    this.session = 1;
    this.lastTyped = 0;
    this.text = text;
    const t = this.now();
    this.runs = text ? [[text.length, this.register(origin, t)]] : [];
    this.log = this.keepLog ? { base: { t, text, runs: this.runs.map((run) => [...run] as Run) }, events: [] } : null;
  }

  origin(id: number): Origin | undefined {
    return this.origins[id];
  }

  /** Origin of the character at `offset`. */
  originAt(offset: number): Origin | undefined {
    const id = originIdAt(this.runs, offset);
    return id === undefined ? undefined : this.origins[id];
  }

  /** Register (or reuse) an origin and return its id. */
  register(spec: OriginSpec, t = this.now(), perUpdate = false): number {
    if (spec.kind === 'typed') {
      if (this.lastTyped && t - this.lastTyped > this.sessionGapMs) this.session += 1;
      this.lastTyped = t;
    }
    const key = SHARED_KINDS.has(spec.kind) && !perUpdate ? sharedKey(spec, this.session) : `${this.updates}\u0002${sharedKey(spec, 0)}`;
    const known = this.shared.get(key);
    if (known !== undefined) return known;
    const origin: Origin = { ...clean(spec), id: this.origins.length, t: spec.t ?? t };
    if (spec.kind === 'typed') origin.session = this.session;
    this.origins.push(origin);
    this.shared.set(key, origin.id);
    this.exact.set(exactKey(origin), origin.id);
    return origin.id;
  }

  /** Reuse an origin from another document or an earlier copy, matching every field. */
  adopt(origin: Omit<Origin, 'id'>): number {
    const key = exactKey(origin);
    const known = this.exact.get(key);
    if (known !== undefined) return known;
    const copy: Origin = { ...clean(origin), id: this.origins.length, t: origin.t };
    if (origin.session !== undefined) copy.session = origin.session;
    this.origins.push(copy);
    this.exact.set(key, copy.id);
    return copy.id;
  }

  fragment(start: number, end: number): Fragment {
    return this.toFragment(this.text, this.runs, start, end);
  }

  private toFragment(text: string, runs: Run[], start: number, end: number): Fragment {
    return {
      text: text.slice(start, end),
      runs: sliceRuns(runs, start, end).map(([length, id]) => {
        const { id: _id, ...origin } = this.origins[id];
        return [length, origin];
      }),
    };
  }

  /** Runs for a fragment in this engine's ids. */
  adoptFragment(fragment: Fragment): Run[] {
    return normalizeRuns(fragment.runs.map(([length, origin]) => [length, this.adopt(origin)] as Run));
  }

  /** Bring the engine to `next`, giving inserted text the origins `options` describe. */
  update(next: string, options: UpdateOptions): ChangeRecord | null {
    if (next === this.text) return null;
    const t = options.now ?? this.now();
    this.updates += 1;
    const edits = diffText(this.text, next, options.hint);
    let runs = this.runs;
    let text = this.text;
    const removed: Fragment[] = [];

    for (const edit of edits) {
      if (edit.del) removed.push(this.toFragment(text, runs, edit.at, edit.at + edit.del));
      const end = edit.at + edit.ins.length;
      let inserted: Run[] = [];
      if (edit.ins) {
        if (options.runs) inserted = sliceRuns(options.runs, edit.at, end);
        else {
          const pieces = options.assign?.(edit.at, end) ?? [{ len: edit.ins.length, origin: options.origin ?? { kind: 'external' } }];
          inserted = pieces.map((piece) => [piece.len, this.resolve(piece.origin, runs, edit.at, t)] as Run);
        }
        inserted = fitRuns(inserted, edit.ins.length, () => this.register({ kind: 'external' }, t));
      }
      runs = spliceRuns(runs, edit.at, edit.del, inserted);
      text = text.slice(0, edit.at) + edit.ins + text.slice(edit.at + edit.del);
      this.record({ t, c: options.cause, at: edit.at, del: edit.del, ins: edit.ins, ...(inserted.length ? { o: inserted.length === 1 ? inserted[0][1] : inserted } : {}) });
    }

    this.text = next;
    this.runs = runs;
    return { cause: options.cause, t, edits, removed };
  }

  private resolve(origin: Piece['origin'], runs: Run[], at: number, t: number): number {
    if (typeof origin === 'number') return origin;
    if (origin === 'inherit') return (at > 0 ? originIdAt(runs, at - 1) : originIdAt(runs, 0)) ?? this.register({ kind: 'typed', author: this.author }, t);
    return this.register(origin, t, !SHARED_KINDS.has(origin.kind));
  }

  private record(event: LogEvent): void {
    const log = this.log;
    if (!log) return;
    const sealed = log.batches?.length ? log.batches[log.batches.length - 1].to : 0;
    const last = log.events.length > sealed ? log.events[log.events.length - 1] : undefined;
    if (this.timing === 'burst' && last && last.c === 'type' && event.c === 'type' && event.t - (last.t + (last.d ?? 0)) <= this.burstGapMs) {
      const lastEnd = last.at + last.ins.length;
      const sameOrigin = event.o === undefined || event.o === last.o;
      // Typing on at the end of the burst.
      if (last.del === 0 && event.del === 0 && event.at === lastEnd && sameOrigin && typeof last.o === 'number') {
        last.ins += event.ins;
        last.d = event.t - last.t;
        return;
      }
      // Backspacing over what the burst just typed.
      if (!event.ins && event.at >= last.at && event.at + event.del === lastEnd) {
        last.ins = last.ins.slice(0, event.at - last.at);
        last.d = event.t - last.t;
        return;
      }
    }
    log.events.push(event);
  }

  serialize(options: { text?: boolean; log?: boolean } = {}): AuthorshipState {
    const state: AuthorshipState = {
      format: 'editora-authorship',
      version: 1,
      updated: this.now(),
      length: this.text.length,
      textHash: textHash(this.text),
      origins: this.origins.map((origin) => ({ ...origin })),
      runs: this.runs.map((run) => [...run] as Run),
    };
    if (options.text !== false) state.text = this.text;
    if (options.log !== false && this.log) state.log = JSON.parse(JSON.stringify(this.log));
    return state;
  }

  /**
   * Restore a saved state for the document's current text. Text changed since
   * the save (edited somewhere that did not record authorship) is "external".
   */
  load(state: AuthorshipState, currentText: string): void {
    if (state?.format !== 'editora-authorship' || state.version !== 1) throw new Error('Not an Editora authorship state (format "editora-authorship", version 1).');
    this.origins = state.origins.map((origin) => ({ ...origin }));
    this.shared.clear();
    this.exact.clear();
    for (const origin of this.origins) {
      this.exact.set(exactKey(origin), origin.id);
      if (SHARED_KINDS.has(origin.kind) && origin.kind !== 'typed') this.shared.set(sharedKey(origin, 0), origin.id);
    }
    this.session = Math.max(0, ...this.origins.map((origin) => origin.session ?? 0)) + 1;
    this.lastTyped = 0;
    this.runs = normalizeRuns(state.runs);
    this.log = this.keepLog ? (state.log ? JSON.parse(JSON.stringify(state.log)) : { base: { t: this.now(), text: currentText, runs: [] }, events: [] }) : null;

    if (state.text !== undefined && runsLength(this.runs) === state.text.length) {
      this.text = state.text;
      this.update(currentText, { cause: 'load', origin: { kind: 'external' } });
    } else if (state.length === currentText.length && state.textHash === textHash(currentText) && runsLength(this.runs) === currentText.length) {
      this.text = currentText;
    } else {
      this.text = currentText;
      this.runs = currentText ? [[currentText.length, this.register({ kind: 'external' })]] : [];
    }
    if (this.log && !state.log) this.log.base.runs = this.runs.map((run) => [...run] as Run);
  }
}

function clean<T extends object>(value: T): T {
  const out = {} as T;
  for (const key of Object.keys(value) as Array<keyof T>) if (value[key] !== undefined && value[key] !== '') out[key] = value[key];
  return out;
}

/** Make runs cover exactly `length` characters. */
function fitRuns(runs: Run[], length: number, fallback: () => number): Run[] {
  const out = normalizeRuns(runs);
  let total = runsLength(out);
  while (total > length && out.length) {
    const last = out[out.length - 1];
    const cut = Math.min(last[0], total - length);
    last[0] -= cut;
    total -= cut;
    if (last[0] === 0) out.pop();
  }
  if (total < length) out.push([length - total, out.length ? out[out.length - 1][1] : fallback()]);
  return normalizeRuns(out);
}
