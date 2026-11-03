/**
 * Summary panel: share of text per origin (each a highlight toggle), the
 * origin at the cursor (announced politely for screen readers), pastes, AI
 * inserts, writing time, and buttons for replay and export.
 */
import type { AuthorshipReport } from '../core/report.js';
import type { OriginKind } from '../core/types.js';
import { ORIGIN_KINDS } from '../core/types.js';
import type { AuthorshipController } from './attach.js';
import type { Highlighter } from './highlight.js';
import { describeOrigin, formatDuration, formatTime, mergeLabels, type AuthorshipLabels } from './labels.js';
import { applyTheme, ensureStyles } from './styles.js';
import { offsetOfPoint } from './text.js';

export interface PanelOptions {
  labels?: Partial<AuthorshipLabels>;
  /** Called by the Replay button; leave out to hide it. */
  onReplay?: () => void;
  /** Called by the Export button with the serialized state (default: download a .json file). */
  onExport?: (json: string) => void;
  /** Called after the panel closes. */
  onClose?: () => void;
}

export interface AuthorshipPanel {
  readonly open: boolean;
  show(anchor?: Element | null): void;
  close(): void;
  toggle(anchor?: Element | null): void;
  destroy(): void;
}

const percent = (share: number) => (share > 0 && share < 0.005 ? '<1%' : `${Math.round(share * 100)}%`);

function el<K extends keyof HTMLElementTagNameMap>(doc: Document, tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function download(doc: Document, json: string): void {
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
  const link = doc.createElement('a');
  link.href = url;
  link.download = `authorship-${new Date().toISOString().slice(0, 10)}.json`;
  doc.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function createAuthorshipPanel(controller: AuthorshipController, highlighter: Highlighter, options: PanelOptions = {}): AuthorshipPanel {
  const root = controller.root;
  const doc = root.ownerDocument;
  const win = doc.defaultView ?? window;
  const labels = mergeLabels(options.labels);
  let panel: HTMLElement | null = null;
  let anchor: Element | null = null;
  let returnFocus: HTMLElement | null = null;
  let caretLine: HTMLElement | null = null;
  let body: HTMLElement | null = null;
  let offChange: (() => void) | null = null;
  let frame = 0;

  const kindRow = (report: AuthorshipReport, kind: OriginKind) => {
    const item = el(doc, 'li');
    const label = el(doc, 'label');
    const box = el(doc, 'input');
    box.type = 'checkbox';
    box.checked = highlighter.kinds.includes(kind);
    box.addEventListener('change', () => {
      const next = box.checked ? [...highlighter.kinds, kind] : highlighter.kinds.filter((value) => value !== kind);
      highlighter.setKinds(next);
    });
    label.append(box, el(doc, 'span', `eda-swatch eda-swatch-${kind}`), el(doc, 'span', '', labels.kinds[kind]));
    item.append(label, el(doc, 'span', 'eda-share', percent(report.byKind[kind].share)));
    return item;
  };

  const render = () => {
    frame = 0;
    if (!panel || !body) return;
    const report = controller.getReport();
    body.replaceChildren();

    const status = el(doc, 'p', 'eda-status', controller.recording ? labels.recording : labels.notRecording);
    status.dataset.recording = String(controller.recording);
    body.append(status);

    const bar = el(doc, 'div', 'eda-bar');
    bar.setAttribute('aria-hidden', 'true');
    const kinds = ORIGIN_KINDS.filter((kind) => report.byKind[kind].chars > 0);
    for (const kind of kinds) {
      const piece = el(doc, 'span', `eda-swatch-${kind}`);
      piece.style.width = `${report.byKind[kind].share * 100}%`;
      bar.append(piece);
    }
    const list = el(doc, 'ul', 'eda-kinds');
    list.setAttribute('aria-label', 'Highlight text by origin');
    for (const kind of kinds.length ? kinds : (['typed'] as OriginKind[])) list.append(kindRow(report, kind));
    body.append(bar, list);

    caretLine = el(doc, 'p', 'eda-caret');
    caretLine.setAttribute('aria-live', 'polite');
    body.append(caretLine);
    updateCaret();

    const section = (title: string, items: string[]) => {
      if (!items.length) return;
      const wrap = el(doc, 'div', 'eda-section');
      wrap.append(el(doc, 'h3', '', title));
      const ul = el(doc, 'ul');
      for (const text of items) ul.append(el(doc, 'li', '', text));
      wrap.append(ul);
      body!.append(wrap);
    };
    section(
      'Pasted',
      report.pastes.slice(0, 5).map((paste) => `${describeOrigin(paste.origin, labels)}: ${paste.chars} characters, ${formatTime(paste.origin.t)}`),
    );
    section(
      'AI',
      report.ai.slice(0, 5).map((ai) => `${describeOrigin(ai.origin, labels)}: ${ai.chars} characters${ai.origin.author ? `, accepted by ${ai.origin.author}` : ''}`),
    );
    if (report.sessions.length) {
      const wrap = el(doc, 'div', 'eda-section');
      wrap.append(el(doc, 'h3', '', 'Writing time'));
      wrap.append(el(doc, 'p', '', `${formatDuration(report.activeMs)} active over ${report.sessions.length} session${report.sessions.length === 1 ? '' : 's'}`));
      body.append(wrap);
    }

    const actions = el(doc, 'div', 'eda-actions');
    if (options.onReplay && controller.engine.log) {
      const replay = el(doc, 'button', 'eda-btn eda-btn-primary', 'Replay writing');
      replay.type = 'button';
      replay.addEventListener('click', () => options.onReplay!());
      actions.append(replay);
    }
    const exportButton = el(doc, 'button', 'eda-btn', 'Export record');
    exportButton.type = 'button';
    exportButton.addEventListener('click', () => {
      const json = JSON.stringify(controller.serialize(), null, 2);
      if (options.onExport) options.onExport(json);
      else download(doc, json);
    });
    const close = el(doc, 'button', 'eda-btn', 'Close');
    close.type = 'button';
    close.addEventListener('click', () => api.close());
    actions.append(exportButton, close);
    body.append(actions);
  };

  const updateCaret = () => {
    if (!caretLine) return;
    const selection = doc.getSelection();
    const node = selection?.focusNode;
    // The character just before the cursor, as typing continues its origin.
    const offset = node && root.contains(node) ? offsetOfPoint(controller.getMap(), node, selection!.focusOffset) : -1;
    const docText = controller.getText();
    // Skip a line break before the cursor (start of a paragraph): read the paragraph's own text.
    const at = offset > 0 && docText[offset - 1] !== '\n' ? offset - 1 : Math.min(Math.max(offset, 0), docText.length - 1);
    const origin = offset >= 0 && docText ? controller.originAt(at) : undefined;
    const text = origin ? `At the cursor: ${describeOrigin(origin, labels)}${origin.author ? `, ${origin.author}` : ''}` : 'Put the cursor in the text to see where it came from.';
    if (caretLine.textContent !== text) caretLine.textContent = text;
  };

  const schedule = () => {
    if (panel && !frame) frame = win.requestAnimationFrame(render);
  };

  const place = () => {
    if (!panel) return;
    const rect = (anchor ?? root).getBoundingClientRect();
    const width = panel.offsetWidth;
    const left = Math.max(16, Math.min(rect.left, win.innerWidth - width - 16));
    const below = rect.bottom + 6;
    panel.style.left = `${left}px`;
    panel.style.top = `${Math.max(16, Math.min(below, win.innerHeight - panel.offsetHeight - 16))}px`;
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      api.close();
    }
  };
  const onPointer = (event: Event) => {
    const target = event.target as Node | null;
    if (!panel || !target || panel.contains(target) || anchor?.contains(target) || root.contains(target)) return;
    api.close();
  };

  const api: AuthorshipPanel = {
    get open() {
      return Boolean(panel);
    },
    show(nextAnchor) {
      anchor = nextAnchor ?? null;
      if (panel) return place();
      ensureStyles(doc);
      returnFocus = doc.activeElement as HTMLElement | null;
      panel = el(doc, 'section', 'eda-panel');
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Authorship');
      panel.setAttribute('data-authorship-ignore', '');
      applyTheme(panel, root);
      const title = el(doc, 'h2', '', 'Authorship');
      title.tabIndex = -1;
      body = el(doc, 'div');
      panel.append(title, body);
      doc.body.appendChild(panel);
      highlighter.show();
      render();
      place();
      title.focus({ preventScroll: true });
      offChange = controller.on('change', schedule);
      panel.addEventListener('keydown', onKey);
      doc.addEventListener('selectionchange', updateCaret);
      doc.addEventListener('pointerdown', onPointer, true);
      win.addEventListener('resize', place);
    },
    close() {
      if (!panel) return;
      if (frame) win.cancelAnimationFrame(frame);
      frame = 0;
      offChange?.();
      doc.removeEventListener('selectionchange', updateCaret);
      doc.removeEventListener('pointerdown', onPointer, true);
      win.removeEventListener('resize', place);
      const hadFocus = panel.contains(doc.activeElement);
      panel.remove();
      panel = null;
      body = null;
      caretLine = null;
      highlighter.hide();
      if (hadFocus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      options.onClose?.();
    },
    toggle(nextAnchor) {
      if (panel) api.close();
      else api.show(nextAnchor);
    },
    destroy() {
      api.close();
    },
  };
  return api;
}
