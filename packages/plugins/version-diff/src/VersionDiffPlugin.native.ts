import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark';
const OVERLAY_CLASS = 'rte-version-diff-overlay';
const STYLE_ID = 'rte-version-diff-styles';

export type VersionDiffMode = 'word' | 'line';

export interface VersionDiffLabels {
  title?: string;
  baseline?: string;
  current?: string;
  noChanges?: string;
  loading?: string;
  tabInline?: string;
  tabSideBySide?: string;
  refresh?: string;
  setBaseline?: string;
  close?: string;
  mode?: string;
  ignoreWhitespace?: string;
  largeDocFallback?: string;
}

export interface VersionDiffOpenArgs {
  baselineHtml?: string;
  mode?: VersionDiffMode;
  ignoreWhitespace?: boolean;
}

export interface VersionDiffPluginOptions {
  baselineHtml?: string;
  getBaselineHtml?: (context: { editor: HTMLElement; editorRoot: HTMLElement }) => string | Promise<string>;
  mode?: VersionDiffMode;
  ignoreWhitespace?: boolean;
  maxTokens?: number;
  maxMatrixSize?: number;
  labels?: VersionDiffLabels;
}

interface ResolvedVersionDiffPluginOptions {
  baselineHtml?: string;
  getBaselineHtml?: (context: { editor: HTMLElement; editorRoot: HTMLElement }) => string | Promise<string>;
  mode: VersionDiffMode;
  ignoreWhitespace: boolean;
  maxTokens: number;
  maxMatrixSize: number;
  labels: Required<VersionDiffLabels>;
}

type SegmentType = 'equal' | 'insert' | 'delete';

interface DiffSegment {
  type: SegmentType;
  value: string;
  count: number;
}

interface DiffResult {
  segments: DiffSegment[];
  insertedCount: number;
  deletedCount: number;
  equalCount: number;
  usedFallback: boolean;
}

const defaultLabels: Required<VersionDiffLabels> = {
  title: 'Version Diff',
  baseline: 'Baseline',
  current: 'Current',
  noChanges: 'No changes detected between baseline and current content.',
  loading: 'Preparing diff...',
  tabInline: 'Inline Diff',
  tabSideBySide: 'Side by Side',
  refresh: 'Refresh',
  setBaseline: 'Set Current as Baseline',
  close: 'Close',
  mode: 'Mode',
  ignoreWhitespace: 'Ignore whitespace',
  largeDocFallback: 'Large document fallback mode applied for performance.',
};

const baselineByEditor = new WeakMap<HTMLElement, string>();
const optionsByEditor = new WeakMap<HTMLElement, ResolvedVersionDiffPluginOptions>();
let pluginInstanceCount = 0;
let globalShortcutHandler: ((event: KeyboardEvent) => void) | null = null;
let activeDialogCleanup: (() => void) | null = null;
let fallbackShortcutOptions: ResolvedVersionDiffPluginOptions | null = null;
let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let globalBeforeInputHandler: ((event: Event) => void) | null = null;
let lastActiveEditor: HTMLElement | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mergeLabels(labels?: VersionDiffLabels): Required<VersionDiffLabels> {
  return {
    ...defaultLabels,
    ...(labels || {}),
  };
}

function resolveEditorFromContext(
  context?: { editorElement?: unknown; contentElement?: unknown },
  allowFirstMatch = true,
): HTMLElement | null {
  if (context?.contentElement instanceof HTMLElement) return context.contentElement;

  if (context?.editorElement instanceof HTMLElement) {
    const host = context.editorElement;
    if (host.matches(EDITOR_CONTENT_SELECTOR)) return host;
    const content = host.querySelector(EDITOR_CONTENT_SELECTOR);
    if (content instanceof HTMLElement) return content;
  }

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    const content = element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    if (active.matches(EDITOR_CONTENT_SELECTOR)) return active;
    const content = active.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  if (lastActiveEditor && lastActiveEditor.isConnected) {
    return lastActiveEditor;
  }

  if (!allowFirstMatch) return null;
  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const root = editor.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor');
  return (root as HTMLElement) || editor;
}

function isDarkThemeElement(element: Element | null): boolean {
  if (!element) return false;

  const themeAttr = element.getAttribute('data-theme') || element.getAttribute('theme');
  if (themeAttr && themeAttr.toLowerCase() === 'dark') return true;

  const classList = element.classList;
  return classList.contains('dark') || classList.contains('editora-theme-dark') || classList.contains('rte-theme-dark');
}

function shouldUseDarkTheme(editor: HTMLElement): boolean {
  const root = resolveEditorRoot(editor);
  if (isDarkThemeElement(root)) return true;

  const closestThemeHost = root.closest('[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark');
  if (isDarkThemeElement(closestThemeHost)) return true;

  if (isDarkThemeElement(document.documentElement) || isDarkThemeElement(document.body)) return true;

  return false;
}

function decodeHtmlEntities(encoded: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = encoded;
  return textarea.value;
}

function resolveInitialBaseline(editor: HTMLElement): string {
  const root = resolveEditorRoot(editor);
  const encodedInitial = root.getAttribute('data-initial-content');
  if (encodedInitial) {
    return decodeHtmlEntities(encodedInitial);
  }
  return editor.innerHTML;
}

function normalizeLineEndings(value: string): string {
  return value.replace(/\r\n?/g, '\n');
}

function htmlToText(html: string): string {
  const container = document.createElement('div');
  const normalizedHtml = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h1|h2|h3|h4|h5|h6|li|tr|blockquote|pre|section|article)>/gi, '$&\n');
  container.innerHTML = normalizedHtml;
  const text = container.textContent || '';
  return normalizeLineEndings(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function tokenize(text: string, mode: VersionDiffMode, ignoreWhitespace: boolean): string[] {
  let source = normalizeLineEndings(text);
  if (ignoreWhitespace) {
    source = source.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  }

  if (!source) return [];

  if (mode === 'line') {
    return source.split('\n');
  }

  if (ignoreWhitespace) {
    return source.split(/\s+/).filter(Boolean);
  }

  // For readable inline diffs, match by words/newlines instead of raw whitespace tokens.
  // Raw whitespace token matching tends to produce interleaved delete/insert runs.
  const tokens: string[] = [];
  const lines = source.split('\n');
  lines.forEach((line, index) => {
    const words = line.split(/[ \t]+/).filter(Boolean);
    tokens.push(...words);
    if (index < lines.length - 1) {
      tokens.push('\n');
    }
  });
  return tokens;
}

function joinTokens(tokens: string[], mode: VersionDiffMode, ignoreWhitespace: boolean): string {
  if (tokens.length === 0) return '';
  if (mode === 'line') return tokens.join('\n');
  if (ignoreWhitespace) return tokens.join(' ');

  let output = '';
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (token === '\n') {
      output = output.replace(/[ \t]+$/g, '');
      output += '\n';
      continue;
    }

    if (output.length > 0 && !output.endsWith('\n')) {
      output += ' ';
    }
    output += token;
  }

  return output;
}

function toSegments(
  ops: Array<{ type: SegmentType; token: string }>,
  mode: VersionDiffMode,
  ignoreWhitespace: boolean,
): DiffSegment[] {
  const merged: Array<{ type: SegmentType; tokens: string[] }> = [];

  ops.forEach((op) => {
    const last = merged[merged.length - 1];
    if (last && last.type === op.type) {
      last.tokens.push(op.token);
      return;
    }
    merged.push({ type: op.type, tokens: [op.token] });
  });

  return merged.map((entry) => ({
    type: entry.type,
    value: joinTokens(entry.tokens, mode, ignoreWhitespace),
    count: entry.tokens.length,
  }));
}

function diffPrefixSuffix(
  a: string[],
  b: string[],
): {
  prefix: string[];
  suffix: string[];
  aMiddle: string[];
  bMiddle: string[];
} {
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) {
    start += 1;
  }

  let endA = a.length - 1;
  let endB = b.length - 1;
  while (endA >= start && endB >= start && a[endA] === b[endB]) {
    endA -= 1;
    endB -= 1;
  }

  const prefix = a.slice(0, start);
  const suffix = endA < a.length - 1 ? a.slice(endA + 1) : [];
  const aMiddle = start <= endA ? a.slice(start, endA + 1) : [];
  const bMiddle = start <= endB ? b.slice(start, endB + 1) : [];

  return { prefix, suffix, aMiddle, bMiddle };
}

function computeDiff(
  baseline: string[],
  current: string[],
  mode: VersionDiffMode,
  ignoreWhitespace: boolean,
  maxMatrixSize: number,
  maxTokens: number,
): DiffResult {
  if (baseline.length === 0 && current.length === 0) {
    return { segments: [], insertedCount: 0, deletedCount: 0, equalCount: 0, usedFallback: false };
  }

  const { prefix, suffix, aMiddle, bMiddle } = diffPrefixSuffix(baseline, current);

  let ops: Array<{ type: SegmentType; token: string }> = [];
  prefix.forEach((token) => ops.push({ type: 'equal', token }));

  const matrixSize = aMiddle.length * bMiddle.length;
  const shouldFallback =
    aMiddle.length > maxTokens ||
    bMiddle.length > maxTokens ||
    matrixSize > maxMatrixSize;

  if (shouldFallback) {
    aMiddle.forEach((token) => ops.push({ type: 'delete', token }));
    bMiddle.forEach((token) => ops.push({ type: 'insert', token }));
  } else {
    const rows: Uint32Array[] = Array.from({ length: aMiddle.length + 1 }, () => new Uint32Array(bMiddle.length + 1));

    for (let i = aMiddle.length - 1; i >= 0; i -= 1) {
      const row = rows[i];
      const nextRow = rows[i + 1];
      for (let j = bMiddle.length - 1; j >= 0; j -= 1) {
        row[j] = aMiddle[i] === bMiddle[j]
          ? nextRow[j + 1] + 1
          : Math.max(nextRow[j], row[j + 1]);
      }
    }

    let i = 0;
    let j = 0;
    while (i < aMiddle.length && j < bMiddle.length) {
      if (aMiddle[i] === bMiddle[j]) {
        ops.push({ type: 'equal', token: aMiddle[i] });
        i += 1;
        j += 1;
      } else if (rows[i + 1][j] >= rows[i][j + 1]) {
        ops.push({ type: 'delete', token: aMiddle[i] });
        i += 1;
      } else {
        ops.push({ type: 'insert', token: bMiddle[j] });
        j += 1;
      }
    }

    while (i < aMiddle.length) {
      ops.push({ type: 'delete', token: aMiddle[i] });
      i += 1;
    }

    while (j < bMiddle.length) {
      ops.push({ type: 'insert', token: bMiddle[j] });
      j += 1;
    }
  }

  suffix.forEach((token) => ops.push({ type: 'equal', token }));

  const segments = toSegments(ops, mode, ignoreWhitespace);
  let insertedCount = 0;
  let deletedCount = 0;
  let equalCount = 0;
  segments.forEach((segment) => {
    if (segment.type === 'insert') insertedCount += segment.count;
    if (segment.type === 'delete') deletedCount += segment.count;
    if (segment.type === 'equal') equalCount += segment.count;
  });

  return {
    segments,
    insertedCount,
    deletedCount,
    equalCount,
    usedFallback: shouldFallback,
  };
}

function formatSegmentValue(segment: DiffSegment): string {
  return escapeHtml(segment.value).replace(/\n/g, '\n');
}

function renderInlineDiffHtml(segments: DiffSegment[], labels: Required<VersionDiffLabels>): string {
  if (segments.length === 0) {
    return `<p class="rte-version-diff-empty">${escapeHtml(labels.noChanges)}</p>`;
  }

  return segments
    .map((segment) => {
      const cls = segment.type === 'equal'
        ? 'rte-version-diff-equal'
        : segment.type === 'insert'
          ? 'rte-version-diff-insert'
          : 'rte-version-diff-delete';
      return `<span class="${cls}">${formatSegmentValue(segment)}</span>`;
    })
    .join('');
}

function renderSideDiffHtml(
  segments: DiffSegment[],
  labels: Required<VersionDiffLabels>,
): { baselineHtml: string; currentHtml: string } {
  if (segments.length === 0) {
    const empty = `<p class="rte-version-diff-empty">${escapeHtml(labels.noChanges)}</p>`;
    return { baselineHtml: empty, currentHtml: empty };
  }

  const baselineParts: string[] = [];
  const currentParts: string[] = [];

  segments.forEach((segment) => {
    const value = formatSegmentValue(segment);
    if (segment.type === 'equal') {
      baselineParts.push(`<span class="rte-version-diff-equal">${value}</span>`);
      currentParts.push(`<span class="rte-version-diff-equal">${value}</span>`);
      return;
    }
    if (segment.type === 'delete') {
      baselineParts.push(`<span class="rte-version-diff-delete">${value}</span>`);
      return;
    }
    currentParts.push(`<span class="rte-version-diff-insert">${value}</span>`);
  });

  return {
    baselineHtml: baselineParts.join(''),
    currentHtml: currentParts.join(''),
  };
}

function isOpenVersionDiffShortcut(event: KeyboardEvent): boolean {
  const hasPrimaryModifier = event.metaKey || event.ctrlKey;
  const key = event.key.toLowerCase();
  const modAltD = hasPrimaryModifier && event.altKey && !event.shiftKey && key === 'd';
  const fallbackF8 = !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && key === 'f8';
  return modAltD || fallbackF8;
}

function ensureStylesInjected(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .${OVERLAY_CLASS} {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.55);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .rte-version-diff-dialog {
      width: min(980px, 96vw);
      max-height: min(90vh, 860px);
      background: #ffffff;
      color: #0f172a;
      border: 1px solid #d7dee8;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.3);
      overflow: hidden;
    }

    .rte-version-diff-header,
    .rte-version-diff-footer {
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .rte-version-diff-footer {
      border-top: 1px solid #e2e8f0;
      border-bottom: none;
      justify-content: space-between;
    }

    .rte-version-diff-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      flex: 1;
    }

    .rte-version-diff-controls {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .rte-version-diff-select,
    .rte-version-diff-btn {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      border-radius: 6px;
      min-height: 34px;
      padding: 6px 10px;
      font-size: 13px;
      cursor: pointer;
    }

    .rte-version-diff-btn:hover,
    .rte-version-diff-btn:focus-visible,
    .rte-version-diff-select:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .rte-version-diff-btn-primary {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }

    .rte-version-diff-btn-primary:hover {
      background: #1d4ed8;
    }

    .rte-version-diff-tabs {
      display: flex;
      gap: 6px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 8px 14px;
    }

    .rte-version-diff-tab {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      border-radius: 6px;
      min-height: 32px;
      padding: 4px 10px;
      font-size: 13px;
      cursor: pointer;
    }

    .rte-version-diff-tab[aria-selected="true"] {
      background: #dbeafe;
      border-color: #60a5fa;
      color: #1e3a8a;
    }

    .rte-version-diff-body {
      flex: 1;
      overflow: auto;
      padding: 10px 14px 14px;
      background: #ffffff;
    }

    .rte-version-diff-summary {
      font-size: 12px;
      color: #475569;
      margin-bottom: 10px;
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
    }

    .rte-version-diff-panel {
      display: none;
    }

    .rte-version-diff-panel.active {
      display: block;
    }

    .rte-version-diff-inline,
    .rte-version-diff-side-pane {
      border: 1px solid #dbe3ec;
      border-radius: 6px;
      padding: 10px;
      min-height: 140px;
      max-height: 50vh;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 12px;
      line-height: 1.5;
      background: #ffffff;
    }

    .rte-version-diff-side-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .rte-version-diff-pane-title {
      margin: 0 0 6px;
      font-size: 12px;
      font-weight: 700;
      color: #334155;
    }

    .rte-version-diff-equal { color: inherit; }
    .rte-version-diff-insert {
      background: rgba(22, 163, 74, 0.18);
      color: #14532d;
      border-radius: 2px;
    }
    .rte-version-diff-delete {
      background: rgba(220, 38, 38, 0.18);
      color: #7f1d1d;
      text-decoration: line-through;
      border-radius: 2px;
    }

    .rte-version-diff-empty {
      margin: 0;
      color: #64748b;
      font-size: 13px;
    }

    ${DARK_THEME_SELECTOR} .rte-version-diff-dialog,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-dialog {
      background: #1f2937;
      color: #e5e7eb;
      border-color: #334155;
    }

    ${DARK_THEME_SELECTOR} .rte-version-diff-header,
    ${DARK_THEME_SELECTOR} .rte-version-diff-footer,
    ${DARK_THEME_SELECTOR} .rte-version-diff-tabs,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-header,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-footer,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-tabs {
      background: #111827;
      border-color: #334155;
    }

    ${DARK_THEME_SELECTOR} .rte-version-diff-body,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-body {
      background: #1f2937;
    }

    ${DARK_THEME_SELECTOR} .rte-version-diff-select,
    ${DARK_THEME_SELECTOR} .rte-version-diff-btn,
    ${DARK_THEME_SELECTOR} .rte-version-diff-tab,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-select,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-btn,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-tab {
      background: #0f172a;
      color: #e5e7eb;
      border-color: #475569;
    }

    ${DARK_THEME_SELECTOR} .rte-version-diff-tab[aria-selected="true"],
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-tab[aria-selected="true"] {
      background: #1e3a8a;
      border-color: #3b82f6;
      color: #dbeafe;
    }

    ${DARK_THEME_SELECTOR} .rte-version-diff-inline,
    ${DARK_THEME_SELECTOR} .rte-version-diff-side-pane,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-inline,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-side-pane {
      background: #0f172a;
      border-color: #334155;
      color: #e5e7eb;
    }

    ${DARK_THEME_SELECTOR} .rte-version-diff-pane-title,
    ${DARK_THEME_SELECTOR} .rte-version-diff-summary,
    ${DARK_THEME_SELECTOR} .rte-version-diff-empty,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-pane-title,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-summary,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-empty {
      color: #94a3b8;
    }

    ${DARK_THEME_SELECTOR} .rte-version-diff-insert,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-insert {
      background: rgba(22, 163, 74, 0.25);
      color: #bbf7d0;
    }

    ${DARK_THEME_SELECTOR} .rte-version-diff-delete,
    .${OVERLAY_CLASS}.rte-version-diff-theme-dark .rte-version-diff-delete {
      background: rgba(220, 38, 38, 0.25);
      color: #fecaca;
    }
  `;

  document.head.appendChild(style);
}

async function resolveBaselineHtml(
  editor: HTMLElement,
  options: ResolvedVersionDiffPluginOptions,
  inlineBaseline?: string,
): Promise<string> {
  if (inlineBaseline != null) return inlineBaseline;

  if (typeof options.getBaselineHtml === 'function') {
    const root = resolveEditorRoot(editor);
    const dynamic = await Promise.resolve(options.getBaselineHtml({ editor, editorRoot: root }));
    if (typeof dynamic === 'string') return dynamic;
  }

  const existing = baselineByEditor.get(editor);
  if (typeof existing === 'string') return existing;

  if (typeof options.baselineHtml === 'string') return options.baselineHtml;

  const initial = resolveInitialBaseline(editor);
  baselineByEditor.set(editor, initial);
  return initial;
}

function focusFirstFocusable(root: HTMLElement): void {
  const first = root.querySelector<HTMLElement>(
    'button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  first?.focus();
}

function trapFocus(event: KeyboardEvent, root: HTMLElement): void {
  if (event.key !== 'Tab') return;
  const focusable = Array.from(root.querySelectorAll<HTMLElement>(
    'button:not([disabled]), select:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )).filter((el) => !el.hasAttribute('disabled'));

  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function ensureNoActiveDialog(): void {
  if (activeDialogCleanup) {
    activeDialogCleanup();
    activeDialogCleanup = null;
  }
}

function captureInitialBaseline(editor: HTMLElement): void {
  if (!editor || baselineByEditor.has(editor)) return;
  baselineByEditor.set(editor, resolveInitialBaseline(editor));
}

function normalizeOptions(raw: VersionDiffPluginOptions): ResolvedVersionDiffPluginOptions {
  return {
    baselineHtml: raw.baselineHtml,
    getBaselineHtml: raw.getBaselineHtml,
    mode: raw.mode || 'word',
    ignoreWhitespace: raw.ignoreWhitespace !== false,
    maxTokens: Math.max(200, raw.maxTokens ?? 1200),
    maxMatrixSize: Math.max(50_000, raw.maxMatrixSize ?? 1_000_000),
    labels: mergeLabels(raw.labels),
  };
}

function renderDialog(
  editor: HTMLElement,
  options: ResolvedVersionDiffPluginOptions,
  openArgs?: VersionDiffOpenArgs,
): void {
  ensureNoActiveDialog();
  lastActiveEditor = editor;
  optionsByEditor.set(editor, options);

  const overlay = document.createElement('div');
  overlay.className = OVERLAY_CLASS;
  if (shouldUseDarkTheme(editor)) {
    overlay.classList.add('rte-version-diff-theme-dark');
  }

  const dialog = document.createElement('section');
  dialog.className = 'rte-version-diff-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'rte-version-diff-title');

  const labels = options.labels;
  let currentMode: VersionDiffMode = openArgs?.mode || options.mode;
  let ignoreWhitespace = openArgs?.ignoreWhitespace ?? options.ignoreWhitespace;
  let currentTab: 'inline' | 'side' = 'inline';

  dialog.innerHTML = `
    <header class="rte-version-diff-header">
      <h2 id="rte-version-diff-title" class="rte-version-diff-title">${escapeHtml(labels.title)}</h2>
      <div class="rte-version-diff-controls">
        <label>
          <span>${escapeHtml(labels.mode)}:</span>
          <select class="rte-version-diff-select" aria-label="${escapeHtml(labels.mode)}">
            <option value="word">Word</option>
            <option value="line">Line</option>
          </select>
        </label>
        <label class="rte-version-diff-checkbox">
          <input type="checkbox" class="rte-version-diff-ignore-ws" ${ignoreWhitespace ? 'checked' : ''}>
          ${escapeHtml(labels.ignoreWhitespace)}
        </label>
        <button type="button" class="rte-version-diff-btn rte-version-diff-set-baseline" aria-label="${escapeHtml(labels.setBaseline)}">${escapeHtml(labels.setBaseline)}</button>
        <button type="button" class="rte-version-diff-btn" data-action="refresh" aria-label="${escapeHtml(labels.refresh)}">${escapeHtml(labels.refresh)}</button>
        <button type="button" class="rte-version-diff-btn" data-action="close" aria-label="${escapeHtml(labels.close)}">${escapeHtml(labels.close)}</button>
      </div>
    </header>

    <div class="rte-version-diff-tabs" role="tablist" aria-label="Diff views">
      <button type="button" role="tab" class="rte-version-diff-tab" data-tab="inline" aria-selected="true">${escapeHtml(labels.tabInline)}</button>
      <button type="button" role="tab" class="rte-version-diff-tab" data-tab="side" aria-selected="false">${escapeHtml(labels.tabSideBySide)}</button>
    </div>

    <main class="rte-version-diff-body">
      <div class="rte-version-diff-summary" aria-live="polite"></div>
      <section class="rte-version-diff-panel active" data-panel="inline" role="tabpanel">
        <div class="rte-version-diff-inline" aria-label="Inline diff result"></div>
      </section>
      <section class="rte-version-diff-panel" data-panel="side" role="tabpanel">
        <div class="rte-version-diff-side-grid">
          <div>
            <h3 class="rte-version-diff-pane-title">${escapeHtml(labels.baseline)}</h3>
            <div class="rte-version-diff-side-pane" data-side="baseline" aria-label="${escapeHtml(labels.baseline)}"></div>
          </div>
          <div>
            <h3 class="rte-version-diff-pane-title">${escapeHtml(labels.current)}</h3>
            <div class="rte-version-diff-side-pane" data-side="current" aria-label="${escapeHtml(labels.current)}"></div>
          </div>
        </div>
      </section>
    </main>

    <footer class="rte-version-diff-footer">
      <small>Shortcut: Ctrl/Cmd + Alt + D (fallback: F8)</small>
      <small>Esc: close</small>
    </footer>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const selectMode = dialog.querySelector('.rte-version-diff-select') as HTMLSelectElement;
  selectMode.value = currentMode;

  const ignoreWsInput = dialog.querySelector('.rte-version-diff-ignore-ws') as HTMLInputElement;
  const summary = dialog.querySelector('.rte-version-diff-summary') as HTMLDivElement;
  const inlinePane = dialog.querySelector('.rte-version-diff-inline') as HTMLDivElement;
  const baselinePane = dialog.querySelector('[data-side="baseline"]') as HTMLDivElement;
  const currentPane = dialog.querySelector('[data-side="current"]') as HTMLDivElement;
  let refreshRequestId = 0;

  const setLoading = () => {
    const loading = `<p class="rte-version-diff-empty">${escapeHtml(labels.loading)}</p>`;
    inlinePane.innerHTML = loading;
    baselinePane.innerHTML = loading;
    currentPane.innerHTML = loading;
    summary.textContent = '';
  };

  const refresh = async (manualBaseline?: string) => {
    refreshRequestId += 1;
    const requestId = refreshRequestId;
    overlay.classList.toggle('rte-version-diff-theme-dark', shouldUseDarkTheme(editor));
    setLoading();

    const currentHtml = editor.innerHTML;
    let baselineHtml = '';
    try {
      baselineHtml = await resolveBaselineHtml(editor, options, manualBaseline ?? openArgs?.baselineHtml);
    } catch {
      baselineHtml = baselineByEditor.get(editor) ?? resolveInitialBaseline(editor);
    }

    if (requestId !== refreshRequestId || !overlay.isConnected) return;

    const baselineText = htmlToText(baselineHtml);
    const currentText = htmlToText(currentHtml);

    const baselineTokens = tokenize(baselineText, currentMode, ignoreWhitespace);
    const currentTokens = tokenize(currentText, currentMode, ignoreWhitespace);

    const result = computeDiff(
      baselineTokens,
      currentTokens,
      currentMode,
      ignoreWhitespace,
      options.maxMatrixSize,
      options.maxTokens,
    );

    const side = renderSideDiffHtml(result.segments, labels);
    inlinePane.innerHTML = renderInlineDiffHtml(result.segments, labels);
    baselinePane.innerHTML = side.baselineHtml;
    currentPane.innerHTML = side.currentHtml;

    const summaryParts = [
      `+${result.insertedCount} inserted`,
      `-${result.deletedCount} deleted`,
      `${result.equalCount} unchanged`,
    ];

    if (result.usedFallback) {
      summaryParts.push(labels.largeDocFallback);
    }

    summary.textContent = summaryParts.join(' | ');
  };

  const setTab = (tab: 'inline' | 'side') => {
    currentTab = tab;
    dialog.querySelectorAll<HTMLElement>('.rte-version-diff-tab').forEach((button) => {
      const selected = button.getAttribute('data-tab') === tab;
      button.setAttribute('aria-selected', selected ? 'true' : 'false');
      button.tabIndex = selected ? 0 : -1;
    });
    dialog.querySelectorAll<HTMLElement>('.rte-version-diff-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.getAttribute('data-panel') === tab);
    });
  };

  const closeDialog = () => {
    overlay.removeEventListener('keydown', onKeyDown, true);
    overlay.removeEventListener('click', onOverlayClick);
    document.removeEventListener('keydown', onDocumentEscape, true);
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    activeDialogCleanup = null;
    editor.focus({ preventScroll: true });
  };

  const onDocumentEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeDialog();
  };

  const onOverlayClick = (event: MouseEvent) => {
    if (event.target === overlay) closeDialog();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }

    trapFocus(event, dialog);

    if (event.target && (event.target as HTMLElement).classList.contains('rte-version-diff-tab')) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const next = currentTab === 'inline' ? 'side' : 'inline';
        setTab(next);
        const target = dialog.querySelector<HTMLElement>(`.rte-version-diff-tab[data-tab="${next}"]`);
        target?.focus();
      }
    }
  };

  dialog.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const action = target.getAttribute('data-action');
    if (action === 'close') {
      closeDialog();
      return;
    }
    if (action === 'refresh') {
      void refresh();
      return;
    }

    const tab = target.getAttribute('data-tab');
    if (tab === 'inline' || tab === 'side') {
      setTab(tab);
    }
  });

  selectMode.addEventListener('change', () => {
    currentMode = selectMode.value === 'line' ? 'line' : 'word';
    void refresh();
  });

  ignoreWsInput.addEventListener('change', () => {
    ignoreWhitespace = ignoreWsInput.checked;
    void refresh();
  });

  const setBaselineBtn = dialog.querySelector('.rte-version-diff-set-baseline') as HTMLButtonElement;
  setBaselineBtn.addEventListener('click', () => {
    baselineByEditor.set(editor, editor.innerHTML);
    void refresh(editor.innerHTML);
  });

  overlay.addEventListener('keydown', onKeyDown, true);
  overlay.addEventListener('click', onOverlayClick);
  document.addEventListener('keydown', onDocumentEscape, true);

  activeDialogCleanup = closeDialog;
  focusFirstFocusable(dialog);
  void refresh();
}

function bindGlobalShortcut(options: ResolvedVersionDiffPluginOptions): void {
  fallbackShortcutOptions = options;
  if (globalShortcutHandler) return;

  globalShortcutHandler = (event: KeyboardEvent) => {
    if (!isOpenVersionDiffShortcut(event)) return;

    if (document.querySelector(`.${OVERLAY_CLASS}`)) {
      event.preventDefault();
      return;
    }

    const target = event.target as HTMLElement | null;
    const editableField = !!target?.closest('input, textarea, select');
    if (editableField) return;

    const editor = resolveEditorFromContext(undefined, false);
    if (!editor || editor.getAttribute('contenteditable') === 'false') return;

    event.preventDefault();
    event.stopPropagation();
    const resolvedOptions = optionsByEditor.get(editor) || fallbackShortcutOptions || options;
    renderDialog(editor, resolvedOptions);
  };

  document.addEventListener('keydown', globalShortcutHandler, true);
}

function unbindGlobalShortcut(): void {
  if (!globalShortcutHandler) return;
  document.removeEventListener('keydown', globalShortcutHandler, true);
  globalShortcutHandler = null;
  fallbackShortcutOptions = null;
}

function bindGlobalBaselineCapture(): void {
  if (!globalFocusInHandler) {
    globalFocusInHandler = (event: FocusEvent) => {
    const target = event.target as HTMLElement | null;
    const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (!editor) return;
    lastActiveEditor = editor;
    captureInitialBaseline(editor);
  };
    document.addEventListener('focusin', globalFocusInHandler, true);
  }

  if (!globalBeforeInputHandler) {
    globalBeforeInputHandler = (event: Event) => {
      const inputEvent = event as InputEvent;
      const target = inputEvent.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;
      if (editor.getAttribute('contenteditable') === 'false') return;
      lastActiveEditor = editor;
      captureInitialBaseline(editor);
    };
    document.addEventListener('beforeinput', globalBeforeInputHandler, true);
  }
}

function unbindGlobalBaselineCapture(): void {
  if (globalFocusInHandler) {
    document.removeEventListener('focusin', globalFocusInHandler, true);
    globalFocusInHandler = null;
  }
  if (globalBeforeInputHandler) {
    document.removeEventListener('beforeinput', globalBeforeInputHandler, true);
    globalBeforeInputHandler = null;
  }
}

export const VersionDiffPlugin = (rawOptions: VersionDiffPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  ensureStylesInjected();

  return {
    name: 'versionDiff',

    toolbar: [
      {
        id: 'versionDiff',
        label: 'Version Diff',
        command: 'openVersionDiff',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3.5" y="4.5" width="7" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect><rect x="13.5" y="4.5" width="7" height="15" rx="1.5" stroke="currentColor" stroke-width="1.8"></rect><path d="M5.5 12h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path><path d="M15.5 12h3m-1.5-1.5v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>',
      },
    ],

    commands: {
      openVersionDiff: (value?: VersionDiffOpenArgs, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;
        optionsByEditor.set(editor, options);
        renderDialog(editor, options, value);
        return true;
      },
      setVersionDiffBaseline: (value?: string | { html?: string }, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;
        optionsByEditor.set(editor, options);

        const html = typeof value === 'string'
          ? value
          : typeof value?.html === 'string'
            ? value.html
            : editor.innerHTML;

        baselineByEditor.set(editor, html);
        return true;
      },
    },

    keymap: {
      'Mod-Alt-d': 'openVersionDiff',
      'Mod-Alt-D': 'openVersionDiff',
      'F8': 'openVersionDiff',
    },

    init: () => {
      pluginInstanceCount += 1;
      bindGlobalShortcut(options);
      bindGlobalBaselineCapture();
    },

    destroy: () => {
      pluginInstanceCount = Math.max(0, pluginInstanceCount - 1);
      if (pluginInstanceCount === 0) {
        ensureNoActiveDialog();
        unbindGlobalShortcut();
        unbindGlobalBaselineCapture();
      }
    },
  };
};
