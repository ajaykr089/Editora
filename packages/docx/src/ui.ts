/**
 * Ready-made import/export UI for any editor: drag a Word file onto the
 * editor (or pick one), see a short report of what changed, and download a
 * .docx. Framework-free; styles are injected once and can be themed with CSS
 * custom properties (--docx-ui-*), or left out with `injectStyles: false`.
 */
import type { Doc } from './ast';
import { readDocx, writeDocx } from './index';
import type { ReadOptions } from './read';
import type { WriteOptions } from './write';
import { DocxError } from './zip';

export interface DocxUiLabels {
  dropHere: string;
  importing: (name: string) => string;
  imported: (name: string) => string;
  exported: (name: string) => string;
  allKept: string;
  changed: (count: number) => string;
  formatting: (items: string[]) => string;
  inferred: (items: string[]) => string;
  onlyAdjusted: string;
  failed: (name: string) => string;
  notWord: (name: string) => string;
  dismiss: string;
  details: string;
}

export const defaultLabels: DocxUiLabels = {
  dropHere: 'Drop a Word file to import it',
  importing: (name) => `Importing ${name}…`,
  imported: (name) => `Imported ${name}`,
  exported: (name) => `Saved ${name}`,
  allKept: 'Everything came through.',
  changed: (count) => (count === 1 ? '1 thing could not be kept:' : `${count} things could not be kept:`),
  formatting: (items) => `Formatting simplified: ${items.join(', ')}.`,
  inferred: (items) => `Structure added: ${items.join(' and ')}.`,
  onlyAdjusted: 'All content came through.',
  failed: (name) => `Could not import ${name}`,
  notWord: (name) => `${name} is not a Word (.docx) file.`,
  dismiss: 'Dismiss',
  details: 'What changed',
};

export interface ImportResult {
  doc: Doc;
  warnings: string[];
  file: File;
}

export interface DocxImportOptions {
  /** Element that accepts dropped files and shows the drop overlay; usually the editor. */
  dropTarget?: HTMLElement;
  /** Put the imported document into your editor. */
  onImport: (result: ImportResult) => void | Promise<void>;
  /** Called with the error when a file cannot be imported (after the report shows it). */
  onError?: (error: Error, file: File) => void;
  readOptions?: ReadOptions;
  /** Show the report card after importing. Default true. */
  report?: boolean;
  labels?: Partial<DocxUiLabels>;
  injectStyles?: boolean;
}

export interface DocxImporter {
  /** Open the file picker. */
  open(): void;
  /** Import a file you already have (from your own input or drop zone). */
  importFile(file: File): Promise<ImportResult | undefined>;
  destroy(): void;
}

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const isDocx = (file: File) => file.type === DOCX_MIME || /\.docx$/i.test(file.name);

/** Blob.arrayBuffer is missing in Safari before 14; FileReader works everywhere. */
function fileBytes(file: File): Promise<ArrayBuffer> {
  if (typeof file.arrayBuffer === 'function') return file.arrayBuffer();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${file.name}.`));
    reader.readAsArrayBuffer(file);
  });
}

export const docxUiCss = `
.docx-ui-overlay{position:absolute;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;pointer-events:none;
  background:color-mix(in srgb,var(--docx-ui-accent,#0b57d0) 8%,transparent);border:2px dashed var(--docx-ui-accent,#0b57d0);border-radius:var(--docx-ui-radius,10px);
  font:600 15px/1.4 var(--docx-ui-font,system-ui,-apple-system,"Segoe UI",sans-serif);color:var(--docx-ui-accent,#0b57d0);opacity:0;transition:opacity .12s}
.docx-ui-overlay[data-visible]{opacity:1}
.docx-ui-overlay span{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:999px;background:var(--docx-ui-surface,#fff);box-shadow:0 4px 16px rgb(0 0 0/.12)}
.docx-ui-stack{position:fixed;right:16px;bottom:16px;z-index:2147483001;display:flex;flex-direction:column;gap:8px;width:min(380px,calc(100vw - 32px));pointer-events:none}
.docx-ui-card{pointer-events:auto;box-sizing:border-box;padding:14px 16px;border-radius:var(--docx-ui-radius,10px);border:1px solid var(--docx-ui-border,#d0d7de);
  background:var(--docx-ui-surface,#fff);color:var(--docx-ui-text,#1f2328);box-shadow:0 8px 28px rgb(0 0 0/.14);font:14px/1.45 var(--docx-ui-font,system-ui,-apple-system,"Segoe UI",sans-serif);
  animation:docx-ui-in .16s ease-out}
.docx-ui-card header{display:flex;align-items:flex-start;gap:10px}
.docx-ui-card h2{margin:0;font-size:14px;font-weight:600;line-height:1.4;flex:1;overflow-wrap:anywhere}
.docx-ui-icon{flex:none;width:18px;height:18px;margin-top:1px}
.docx-ui-card[data-kind="success"] .docx-ui-icon{color:var(--docx-ui-success,#1a7f37)}
.docx-ui-card[data-kind="warning"] .docx-ui-icon{color:var(--docx-ui-warning,#9a6700)}
.docx-ui-card[data-kind="error"] .docx-ui-icon{color:var(--docx-ui-error,#cf222e)}
.docx-ui-card[data-kind="busy"] .docx-ui-icon{color:var(--docx-ui-accent,#0b57d0);animation:docx-ui-spin .8s linear infinite}
.docx-ui-card p{margin:6px 0 0 28px;color:var(--docx-ui-muted,#59636e)}
.docx-ui-card ul{margin:6px 0 0 28px;padding:0 0 0 16px;color:var(--docx-ui-text,#1f2328);max-height:180px;overflow:auto}
.docx-ui-card li{margin:2px 0}
.docx-ui-card .docx-ui-note{font-size:13px;margin-top:6px}
.docx-ui-close{flex:none;appearance:none;border:0;background:transparent;color:var(--docx-ui-muted,#59636e);width:28px;height:28px;margin:-5px -6px 0 0;border-radius:6px;cursor:pointer;font:inherit;line-height:1}
.docx-ui-close:hover{background:var(--docx-ui-hover,#f3f4f6);color:var(--docx-ui-text,#1f2328)}
.docx-ui-close:focus-visible{outline:2px solid var(--docx-ui-accent,#0b57d0);outline-offset:1px}
@keyframes docx-ui-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@keyframes docx-ui-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.docx-ui-card,.docx-ui-card[data-kind="busy"] .docx-ui-icon{animation:none}.docx-ui-overlay{transition:none}}
@media (max-width:480px){.docx-ui-stack{right:8px;left:8px;bottom:8px;width:auto}}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .docx-ui-card,:root:not([data-theme="light"]) .docx-ui-overlay span{
  --docx-ui-surface:#1f2428;--docx-ui-text:#e6edf3;--docx-ui-muted:#9198a1;--docx-ui-border:#3d444d;--docx-ui-hover:#2d333b;--docx-ui-success:#3fb950;--docx-ui-warning:#d29922;--docx-ui-error:#f85149;--docx-ui-accent:#4493f8}}
[data-theme="dark"] .docx-ui-card,[data-theme="dark"] .docx-ui-overlay span{
  --docx-ui-surface:#1f2428;--docx-ui-text:#e6edf3;--docx-ui-muted:#9198a1;--docx-ui-border:#3d444d;--docx-ui-hover:#2d333b;--docx-ui-success:#3fb950;--docx-ui-warning:#d29922;--docx-ui-error:#f85149;--docx-ui-accent:#4493f8}
`;

const ICONS = {
  success: '<path d="M20 6 9 17l-5-5"/>',
  warning: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
  error: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  busy: '<path d="M21 12a9 9 0 1 1-6.2-8.6"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
};
const icon = (name: keyof typeof ICONS) => `<svg class="docx-ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

function injectStyles(enabled = true): void {
  if (!enabled || typeof document === 'undefined' || document.getElementById('editora-docx-ui')) return;
  const style = document.createElement('style');
  style.id = 'editora-docx-ui';
  style.textContent = docxUiCss;
  document.head.append(style);
}

function stack(): HTMLElement {
  let element = document.querySelector<HTMLElement>('.docx-ui-stack');
  if (!element) {
    element = document.createElement('div');
    element.className = 'docx-ui-stack';
    document.body.append(element);
  }
  return element;
}

export interface ReportCard {
  /** Replace the card's content (for example from "Importing…" to the result). */
  update(report: ReportContent): void;
  close(): void;
}

export interface ReportContent {
  kind: 'success' | 'warning' | 'error' | 'busy';
  title: string;
  message?: string;
  items?: string[];
  /** Short lines after the list, in a quieter style. */
  notes?: string[];
}

/**
 * Show a report card in the corner of the page. Success cards close themselves
 * after a few seconds; warnings and errors stay until dismissed (Escape or the
 * close button). Screen readers hear the title and message.
 */
export function showDocxReport(content: ReportContent, options: { labels?: Partial<DocxUiLabels>; injectStyles?: boolean } = {}): ReportCard {
  injectStyles(options.injectStyles);
  const labels = { ...defaultLabels, ...options.labels };
  const card = document.createElement('section');
  card.className = 'docx-ui-card';
  let timer: ReturnType<typeof setTimeout> | undefined;
  const close = () => {
    clearTimeout(timer);
    card.removeEventListener('keydown', onKey);
    card.remove();
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };
  card.addEventListener('keydown', onKey);
  const render = (report: ReportContent) => {
    clearTimeout(timer);
    card.dataset.kind = report.kind;
    // Errors interrupt; everything else waits for a pause.
    card.setAttribute('role', report.kind === 'error' ? 'alert' : 'status');
    card.setAttribute('aria-live', report.kind === 'error' ? 'assertive' : 'polite');
    card.setAttribute('aria-label', report.title);
    card.replaceChildren();
    const header = document.createElement('header');
    header.innerHTML = icon(report.kind);
    const title = document.createElement('h2');
    title.textContent = report.title;
    header.append(title);
    if (report.kind !== 'busy') {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'docx-ui-close';
      button.setAttribute('aria-label', labels.dismiss);
      button.textContent = '✕';
      button.addEventListener('click', close);
      header.append(button);
    }
    card.append(header);
    if (report.message) card.append(Object.assign(document.createElement('p'), { textContent: report.message }));
    if (report.items?.length) {
      const list = document.createElement('ul');
      list.setAttribute('aria-label', labels.details);
      for (const item of report.items) list.append(Object.assign(document.createElement('li'), { textContent: item }));
      card.append(list);
    }
    for (const note of report.notes ?? []) card.append(Object.assign(document.createElement('p'), { className: 'docx-ui-note', textContent: note }));
    // A plain success goes away by itself; one with notes stays a little longer to be read.
    if (report.kind === 'success') timer = setTimeout(close, report.notes?.length ? 8000 : 4000);
  };
  render(content);
  stack().append(card);
  return { update: render, close };
}

// Warnings that are only about looks, or about structure the reader added, are not losses of content.
const FORMATTING: Array<[RegExp, string]> = [
  [/^Font sizes were not kept/, 'font sizes'],
  [/^Text colours were not kept/, 'text colours'],
  [/^Paragraph alignment was not kept/, 'alignment'],
  [/^Page and column breaks were dropped/, 'page breaks'],
];
const INFERRED: Array<[RegExp, string]> = [
  [/^Headings were inferred/, 'headings from text size'],
  [/^Lists were inferred/, 'lists from typed bullets'],
];

/** Group warnings for people: real losses as a list, formatting and inferred structure as one line each. */
export function summarizeWarnings(warnings: string[], labels: DocxUiLabels = defaultLabels): Pick<ReportContent, 'kind' | 'message' | 'items' | 'notes'> {
  const formatting: string[] = [];
  const inferred: string[] = [];
  const lost: string[] = [];
  for (const warning of warnings) {
    const format = FORMATTING.find(([pattern]) => pattern.test(warning));
    const infer = INFERRED.find(([pattern]) => pattern.test(warning));
    if (format) formatting.push(format[1]);
    else if (infer) inferred.push(infer[1]);
    else lost.push(warning);
  }
  const notes = [formatting.length ? labels.formatting(formatting) : '', inferred.length ? labels.inferred(inferred) : ''].filter(Boolean);
  if (lost.length) return { kind: 'warning', message: labels.changed(lost.length), items: lost, notes };
  return { kind: 'success', message: notes.length ? labels.onlyAdjusted : labels.allKept, notes };
}

const summary = summarizeWarnings;

/**
 * Wire up Word import: a file picker, and drag-and-drop onto `dropTarget`
 * with an overlay while a file is over it.
 *
 *   const importer = createDocxImport({
 *     dropTarget: editorElement,
 *     onImport: ({ doc }) => editor.setContent(convert(doc, { from: 'ast', to: 'html' }).output),
 *   });
 *   importButton.onclick = () => importer.open();
 */
export function createDocxImport(options: DocxImportOptions): DocxImporter {
  injectStyles(options.injectStyles);
  const labels = { ...defaultLabels, ...options.labels };
  const showReport = options.report !== false;

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = `.docx,${DOCX_MIME}`;
  input.hidden = true;
  document.body.append(input);
  const onPick = () => {
    const file = input.files?.[0];
    input.value = '';
    if (file) void importFile(file);
  };
  input.addEventListener('change', onPick);

  async function importFile(file: File): Promise<ImportResult | undefined> {
    const card = showReport ? showDocxReport({ kind: 'busy', title: labels.importing(file.name) }, { labels, injectStyles: false }) : undefined;
    try {
      if (!isDocx(file)) throw new DocxError(labels.notWord(file.name), 'not-docx');
      const { doc, warnings } = await readDocx(await fileBytes(file), options.readOptions);
      const result = { doc, warnings, file };
      await options.onImport(result);
      card?.update({ title: labels.imported(file.name), ...summary(warnings, labels) });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      card?.update({ kind: 'error', title: labels.failed(file.name), message: err.message });
      options.onError?.(err, file);
      return undefined;
    }
  }

  // Drag and drop. dragenter/leave fire for every child, so count them.
  const target = options.dropTarget;
  let overlay: HTMLElement | undefined;
  let depth = 0;
  let restorePosition: string | undefined;
  const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer?.types ?? []).includes('Files');
  const showOverlay = () => {
    if (!target || overlay) return;
    // The overlay is positioned against the target.
    const position = getComputedStyle(target).position;
    if (!position || position === 'static') {
      restorePosition = target.style.position;
      target.style.position = 'relative';
    }
    overlay = document.createElement('div');
    overlay.className = 'docx-ui-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `<span>${icon('file')}${labels.dropHere}</span>`;
    target.append(overlay);
    requestAnimationFrame(() => overlay?.setAttribute('data-visible', ''));
  };
  const hideOverlay = () => {
    depth = 0;
    overlay?.remove();
    overlay = undefined;
    if (target && restorePosition !== undefined) {
      target.style.position = restorePosition;
      restorePosition = undefined;
    }
  };
  const onEnter = (event: DragEvent) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    depth += 1;
    showOverlay();
  };
  const onOver = (event: DragEvent) => {
    if (!hasFiles(event)) return;
    // Required for the drop to be allowed.
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  };
  const onLeave = (event: DragEvent) => {
    if (!hasFiles(event)) return;
    depth -= 1;
    if (depth <= 0) hideOverlay();
  };
  const onDrop = (event: DragEvent) => {
    if (!hasFiles(event)) return;
    // Take over the drop only for files; text and HTML drops stay with the editor.
    event.preventDefault();
    event.stopPropagation();
    hideOverlay();
    const file = Array.from(event.dataTransfer?.files ?? [])[0];
    if (file) void importFile(file);
  };
  if (target) {
    target.addEventListener('dragenter', onEnter);
    target.addEventListener('dragover', onOver);
    target.addEventListener('dragleave', onLeave);
    target.addEventListener('drop', onDrop, true);
  }

  return {
    open: () => input.click(),
    importFile,
    destroy() {
      hideOverlay();
      input.removeEventListener('change', onPick);
      input.remove();
      if (target) {
        target.removeEventListener('dragenter', onEnter);
        target.removeEventListener('dragover', onOver);
        target.removeEventListener('dragleave', onLeave);
        target.removeEventListener('drop', onDrop, true);
      }
    },
  };
}

/**
 * Write a .docx and hand it to the browser as a download, with a report card.
 *
 *   await downloadDocx(read(editor.getContent(), 'html'), 'report.docx', { title: 'Report' });
 */
export async function downloadDocx(doc: Doc, filename: string, options: WriteOptions & { report?: boolean; labels?: Partial<DocxUiLabels>; injectStyles?: boolean } = {}): Promise<{ data: Uint8Array; warnings: string[] }> {
  const labels = { ...defaultLabels, ...options.labels };
  const name = /\.docx$/i.test(filename) ? filename : `${filename}.docx`;
  const { data, warnings } = await writeDocx(doc, options);
  const url = URL.createObjectURL(new Blob([data as Uint8Array<ArrayBuffer>], { type: DOCX_MIME }));
  const link = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  if (options.report !== false) showDocxReport({ title: labels.exported(name), ...summary(warnings, labels) }, { labels, injectStyles: options.injectStyles });
  return { data, warnings };
}
