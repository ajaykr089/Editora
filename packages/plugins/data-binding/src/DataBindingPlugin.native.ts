import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const TOKEN_SELECTOR = '.rte-data-binding[data-binding="true"]';
const STYLE_ID = 'rte-data-binding-styles';
const DIALOG_OVERLAY_CLASS = 'rte-data-binding-dialog-overlay';
const DARK_THEME_SELECTOR =':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';

export type DataBindingFormat = 'text' | 'number' | 'currency' | 'date' | 'json';

export interface DataBindingLabels {
  dialogTitleInsert?: string;
  dialogTitleEdit?: string;
  keyLabel?: string;
  keyPlaceholder?: string;
  fallbackLabel?: string;
  fallbackPlaceholder?: string;
  formatLabel?: string;
  currencyLabel?: string;
  currencyPlaceholder?: string;
  saveText?: string;
  cancelText?: string;
  previewOnText?: string;
  previewOffText?: string;
  tokenAriaPrefix?: string;
}

export interface DataBindingTokenConfig {
  key: string;
  fallback?: string;
  format?: DataBindingFormat;
  currency?: string;
}

export interface DataBindingDialogArgs extends Partial<DataBindingTokenConfig> {
  target?: 'insert' | 'edit';
}

export interface DataBindingApiRequestContext {
  editor: HTMLElement;
  editorRoot: HTMLElement;
  signal: AbortSignal;
}

export interface DataBindingApiConfig {
  url: string;
  method?: string;
  headers?: Record<string, string> | ((ctx: DataBindingApiRequestContext) => Record<string, string>);
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
  params?: Record<string, string> | ((ctx: DataBindingApiRequestContext) => Record<string, string>);
  body?:
    | Record<string, unknown>
    | BodyInit
    | ((ctx: DataBindingApiRequestContext) => Record<string, unknown> | BodyInit | undefined);
  buildRequest?: (ctx: DataBindingApiRequestContext) => { url: string; init?: RequestInit };
  responseType?: 'json' | 'text';
  responsePath?: string;
  transformResponse?: (response: unknown, ctx: DataBindingApiRequestContext) => Record<string, unknown>;
  timeoutMs?: number;
  onError?: (error: unknown, ctx: DataBindingApiRequestContext) => void;
}

export interface DataBindingPluginOptions {
  data?: Record<string, unknown> | (() => Record<string, unknown> | Promise<Record<string, unknown>>);
  getData?: (context: { editor: HTMLElement; editorRoot: HTMLElement }) => Record<string, unknown> | Promise<Record<string, unknown>>;
  api?: DataBindingApiConfig;
  cacheTtlMs?: number;
  labels?: DataBindingLabels;
  defaultFormat?: DataBindingFormat;
  defaultFallback?: string;
  locale?: string;
  numberFormatOptions?: Intl.NumberFormatOptions;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
}

interface ResolvedDataBindingOptions {
  data?: Record<string, unknown> | (() => Record<string, unknown> | Promise<Record<string, unknown>>);
  getData?: (context: { editor: HTMLElement; editorRoot: HTMLElement }) => Record<string, unknown> | Promise<Record<string, unknown>>;
  api?: DataBindingApiConfig;
  cacheTtlMs: number;
  labels: Required<DataBindingLabels>;
  defaultFormat: DataBindingFormat;
  defaultFallback: string;
  locale: string;
  numberFormatOptions: Intl.NumberFormatOptions;
  dateFormatOptions: Intl.DateTimeFormatOptions;
}

interface DialogState {
  cleanup: () => void;
}

interface DataCacheEntry {
  timestamp: number;
  data: Record<string, unknown>;
}

const defaultLabels: Required<DataBindingLabels> = {
  dialogTitleInsert: 'Insert Data Binding',
  dialogTitleEdit: 'Edit Data Binding',
  keyLabel: 'Data Key',
  keyPlaceholder: 'user.firstName',
  fallbackLabel: 'Fallback Text',
  fallbackPlaceholder: 'Guest',
  formatLabel: 'Format',
  currencyLabel: 'Currency',
  currencyPlaceholder: 'USD',
  saveText: 'Save',
  cancelText: 'Cancel',
  previewOnText: 'Preview On',
  previewOffText: 'Preview Off',
  tokenAriaPrefix: 'Data binding token',
};

const previewEnabledByEditor = new WeakMap<HTMLElement, boolean>();
const overrideDataByEditor = new WeakMap<HTMLElement, Record<string, unknown>>();
const optionsByEditor = new WeakMap<HTMLElement, ResolvedDataBindingOptions>();
const dataCacheByEditor = new WeakMap<HTMLElement, DataCacheEntry>();
const pendingFetchByEditor = new WeakMap<HTMLElement, Promise<Record<string, unknown>>>();

let activeDialogState: DialogState | null = null;
let lastActiveEditor: HTMLElement | null = null;
let pluginInstanceCount = 0;
let globalKeydownHandler: ((event: KeyboardEvent) => void) | null = null;
let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let globalTokenClickHandler: ((event: MouseEvent) => void) | null = null;
let fallbackOptions: ResolvedDataBindingOptions | null = null;

function mergeLabels(labels?: DataBindingLabels): Required<DataBindingLabels> {
  return {
    ...defaultLabels,
    ...(labels || {}),
  };
}

function normalizeOptions(raw: DataBindingPluginOptions = {}): ResolvedDataBindingOptions {
  const locale = (raw.locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US')).trim() || 'en-US';
  return {
    data: raw.data,
    getData: raw.getData,
    api: raw.api,
    cacheTtlMs: Math.max(0, Number(raw.cacheTtlMs ?? 30000)),
    labels: mergeLabels(raw.labels),
    defaultFormat: raw.defaultFormat || 'text',
    defaultFallback: raw.defaultFallback || '',
    locale,
    numberFormatOptions: raw.numberFormatOptions || {},
    dateFormatOptions: raw.dateFormatOptions || { year: 'numeric', month: 'short', day: '2-digit' },
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const root = editor.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor');
  return (root as HTMLElement) || editor;
}

function isThemeDarkFromElement(element: Element | null): boolean {
  if (!element) return false;
  const themeAttr = (element.getAttribute('data-theme') || element.getAttribute('theme') || '').toLowerCase();
  if (themeAttr === 'dark') return true;
  return (
    element.classList.contains('dark') ||
    element.classList.contains('editora-theme-dark') ||
    element.classList.contains('rte-theme-dark')
  );
}

function shouldUseDarkTheme(editor: HTMLElement): boolean {
  const root = resolveEditorRoot(editor);
  if (isThemeDarkFromElement(root)) return true;
  const scoped = root.closest('[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark');
  if (isThemeDarkFromElement(scoped)) return true;
  return isThemeDarkFromElement(document.documentElement) || isThemeDarkFromElement(document.body);
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
    const element = getElementFromNode(node);
    const content = element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    if (active.matches(EDITOR_CONTENT_SELECTOR)) return active;
    const content = active.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  if (lastActiveEditor && lastActiveEditor.isConnected) return lastActiveEditor;
  if (!allowFirstMatch) return null;
  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function isEditorReadonly(editor: HTMLElement): boolean {
  return editor.getAttribute('contenteditable') === 'false' || editor.getAttribute('data-readonly') === 'true';
}

function getSelectionRangeInEditor(editor: HTMLElement): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return null;
  return range.cloneRange();
}

function setSelectionRange(editor: HTMLElement, range: Range): void {
  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
  editor.focus({ preventScroll: true });
}

function getPathValue(source: unknown, path: string): unknown {
  const cleanPath = (path || '').trim();
  if (!cleanPath) return undefined;
  return cleanPath
    .split('.')
    .filter(Boolean)
    .reduce<unknown>((current, key) => {
      if (current == null || typeof current !== 'object') return undefined;
      return (current as Record<string, unknown>)[key];
    }, source);
}

function ensureStylesInjected(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .rte-data-binding {
      display: inline-flex;
      align-items: center;
      max-width: 100%;
      gap: 5px;
      padding: 2px 8px 2px 7px;
      border-radius: 999px;
      border: 1px dashed #8b5cf6;
      background: linear-gradient(180deg, #f9f7ff 0%, #f1edff 100%);
      color: #4c1d95;
      font-size: 0.88em;
      font-weight: 600;
      line-height: 1.3;
      vertical-align: baseline;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: all;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      cursor: pointer;
    }

    .rte-data-binding::before {
      content: '{}';
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 14px;
      height: 14px;
      border-radius: 999px;
      background: rgba(139, 92, 246, 0.16);
      color: #5b21b6;
      font-size: 10px;
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.2px;
      flex: 0 0 auto;
    }

    .rte-data-binding.rte-data-binding-preview {
      border-style: solid;
      background: #ecfdf5;
      border-color: #34d399;
      color: #065f46;
      user-select: text;
    }

    .rte-data-binding.rte-data-binding-preview::before {
      content: '=';
      background: rgba(16, 185, 129, 0.15);
      color: #047857;
      letter-spacing: 0;
    }

    .rte-data-binding.rte-data-binding-missing {
      border-style: dashed;
      border-color: #f87171;
      background: #fef2f2;
      color: #991b1b;
    }

    .rte-data-binding-dialog-overlay {
      position: fixed;
      inset: 0;
      z-index: 2147483646;
      background: rgba(15, 23, 42, 0.54);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .rte-data-binding-dialog {
      width: min(560px, 96vw);
      max-height: min(86vh, 720px);
      border: 1px solid #dbe3ec;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 24px 50px rgba(15, 23, 42, 0.26);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .rte-data-binding-header,
    .rte-data-binding-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 14px;
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
    }

    .rte-data-binding-footer {
      justify-content: flex-end;
      border-bottom: 0;
      border-top: 1px solid #e2e8f0;
    }

    .rte-data-binding-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .rte-data-binding-body {
      padding: 14px;
      overflow: auto;
      display: grid;
      gap: 12px;
      grid-template-columns: 1fr;
    }

    .rte-data-binding-field {
      display: grid;
      gap: 6px;
    }

    .rte-data-binding-field label {
      font-size: 12px;
      font-weight: 600;
      color: #334155;
    }

    .rte-data-binding-field input,
    .rte-data-binding-field select {
      width: 100%;
      min-height: 36px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 13px;
      line-height: 1.4;
      color: #0f172a;
      background: #ffffff;
      box-sizing: border-box;
    }

    .rte-data-binding-help {
      margin: 0;
      font-size: 12px;
      color: #64748b;
    }

    .rte-data-binding-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 34px;
      padding: 6px 12px;
      background: #ffffff;
      color: #0f172a;
      font-size: 13px;
      cursor: pointer;
    }

    .rte-data-binding-btn-primary {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }

    .rte-data-binding-btn-primary:hover {
      background: #1d4ed8;
    }

    .rte-toolbar-group-items.data-binding,
    .editora-toolbar-group-items.data-binding {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      background: #ffffff;
    }

    .rte-toolbar-group-items.data-binding .rte-toolbar-item,
    .editora-toolbar-group-items.data-binding .editora-toolbar-item {
      display: flex;
    }

    .rte-toolbar-group-items.data-binding .rte-toolbar-button,
    .editora-toolbar-group-items.data-binding .editora-toolbar-button {
      border: 0;
      border-radius: 0;
      border-right: 1px solid #cbd5e1;
    }

    .rte-toolbar-group-items.data-binding .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.data-binding .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: 0;
    }

    .rte-data-binding-btn:focus-visible,
    .rte-data-binding-field input:focus-visible,
    .rte-data-binding-field select:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding {
      background: linear-gradient(180deg, #3b0764 0%, #2e1065 100%);
      border-color: #a78bfa;
      color: #ede9fe;
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding::before,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding::before {
      background: rgba(167, 139, 250, 0.22);
      color: #ddd6fe;
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding.rte-data-binding-preview,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding.rte-data-binding-preview {
      background: #064e3b;
      border-color: #10b981;
      color: #d1fae5;
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding.rte-data-binding-missing,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding.rte-data-binding-missing {
      background: #7f1d1d;
      border-color: #ef4444;
      color: #fee2e2;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.data-binding,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-toolbar-group-items.data-binding,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.data-binding {
      border-color: #566275;
      background: #111827;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.data-binding .rte-toolbar-button,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.data-binding .editora-toolbar-button {
      border-right-color: #566275;
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding-dialog,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-dialog {
      background: #1f2937;
      border-color: #334155;
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding-header,
    ${DARK_THEME_SELECTOR} .rte-data-binding-footer,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-header,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-footer {
      background: #111827;
      border-color: #334155;
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding-title,
    ${DARK_THEME_SELECTOR} .rte-data-binding-field label,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-title,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-field label {
      color: #e2e8f0;
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding-help,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-help {
      color: #94a3b8;
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding-field input,
    ${DARK_THEME_SELECTOR} .rte-data-binding-field select,
    ${DARK_THEME_SELECTOR} .rte-data-binding-btn,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-field input,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-field select,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${DARK_THEME_SELECTOR} .rte-data-binding-btn-primary,
    .${DIALOG_OVERLAY_CLASS}.rte-data-binding-theme-dark .rte-data-binding-btn-primary {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }
  `;

  document.head.appendChild(style);
}

function dispatchEditorInput(editor: HTMLElement): void {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function recordDomHistoryTransaction(editor: HTMLElement, beforeHTML: string): void {
  if (beforeHTML === editor.innerHTML) return;
  const executor = (window as any).execEditorCommand || (window as any).executeEditorCommand;
  if (typeof executor !== 'function') return;
  try {
    executor('recordDomTransaction', editor, beforeHTML, editor.innerHTML);
  } catch {
    // History plugin not loaded.
  }
}

function normalizeTokenConfig(config: Partial<DataBindingTokenConfig>, options: ResolvedDataBindingOptions): DataBindingTokenConfig {
  return {
    key: String(config.key || '').trim(),
    fallback: String(config.fallback ?? options.defaultFallback ?? ''),
    format: (config.format || options.defaultFormat || 'text') as DataBindingFormat,
    currency: String(config.currency || 'USD').trim().toUpperCase() || 'USD',
  };
}

function formatTokenLabel(config: DataBindingTokenConfig): string {
  return `{{${config.key}}}`;
}

function createTokenElement(config: DataBindingTokenConfig, labels: Required<DataBindingLabels>): HTMLElement {
  const token = document.createElement('span');
  token.className = 'rte-data-binding';
  token.setAttribute('data-binding', 'true');
  token.setAttribute('data-binding-key', config.key);
  token.setAttribute('data-binding-fallback', config.fallback || '');
  token.setAttribute('data-binding-format', config.format || 'text');
  token.setAttribute('data-binding-currency', config.currency || 'USD');
  token.setAttribute('contenteditable', 'false');
  token.setAttribute('spellcheck', 'false');
  token.setAttribute('draggable', 'false');
  token.setAttribute('tabindex', '0');
  token.setAttribute('role', 'button');
  token.setAttribute('aria-label', `${labels.tokenAriaPrefix}: ${config.key}. Press Enter to edit.`);
  token.textContent = formatTokenLabel(config);
  return token;
}

function extractTokenConfig(token: HTMLElement, options: ResolvedDataBindingOptions): DataBindingTokenConfig {
  return normalizeTokenConfig(
    {
      key: token.getAttribute('data-binding-key') || '',
      fallback: token.getAttribute('data-binding-fallback') || options.defaultFallback,
      format: (token.getAttribute('data-binding-format') as DataBindingFormat) || options.defaultFormat,
      currency: token.getAttribute('data-binding-currency') || 'USD',
    },
    options,
  );
}

function applyTokenConfig(token: HTMLElement, config: DataBindingTokenConfig, labels: Required<DataBindingLabels>): void {
  token.classList.add('rte-data-binding');
  token.setAttribute('data-binding', 'true');
  token.setAttribute('data-binding-key', config.key);
  token.setAttribute('data-binding-fallback', config.fallback || '');
  token.setAttribute('data-binding-format', config.format || 'text');
  token.setAttribute('data-binding-currency', config.currency || 'USD');
  token.setAttribute('contenteditable', 'false');
  token.setAttribute('spellcheck', 'false');
  token.setAttribute('draggable', 'false');
  token.setAttribute('tabindex', '0');
  token.setAttribute('role', 'button');
  token.setAttribute('aria-label', `${labels.tokenAriaPrefix}: ${config.key}. Press Enter to edit.`);
}

function normalizeTokens(editor: HTMLElement, options: ResolvedDataBindingOptions): HTMLElement[] {
  const tokens = Array.from(editor.querySelectorAll<HTMLElement>(TOKEN_SELECTOR));
  tokens.forEach((token) => {
    const config = extractTokenConfig(token, options);
    applyTokenConfig(token, config, options.labels);
  });
  return tokens;
}

function findSelectedToken(editor: HTMLElement): HTMLElement | null {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = getElementFromNode(node);
    const token = element?.closest(TOKEN_SELECTOR) as HTMLElement | null;
    if (token && editor.contains(token)) return token;
  }

  const active = document.activeElement as HTMLElement | null;
  const activeToken = active?.closest(TOKEN_SELECTOR) as HTMLElement | null;
  if (activeToken && editor.contains(activeToken)) return activeToken;

  return null;
}

function ensureNoActiveDialog(): void {
  if (activeDialogState) {
    activeDialogState.cleanup();
    activeDialogState = null;
  }
}

function setPreviewButtonState(
  editor: HTMLElement,
  enabled: boolean,
  options?: ResolvedDataBindingOptions,
): void {
  const root = resolveEditorRoot(editor);
  const buttons = Array.from(root.querySelectorAll<HTMLElement>('[data-command="toggleDataBindingPreview"]'));
  buttons.forEach((button) => {
    button.setAttribute('data-active', enabled ? 'true' : 'false');
    button.classList.toggle('active', enabled);
    button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    if (options) {
      const title = enabled ? options.labels.previewOnText : options.labels.previewOffText;
      button.setAttribute('title', title);
      button.setAttribute('aria-label', title);
    }
  });
}

function formatValue(
  value: unknown,
  config: DataBindingTokenConfig,
  options: ResolvedDataBindingOptions,
): string {
  const format = config.format || 'text';

  if (value == null) return config.fallback || '';

  if (format === 'json') {
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  if (format === 'date') {
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) return String(value);
    try {
      return new Intl.DateTimeFormat(options.locale, options.dateFormatOptions).format(date);
    } catch {
      return date.toISOString();
    }
  }

  if (format === 'number' || format === 'currency') {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(numeric)) return String(value);

    const numberOpts = { ...options.numberFormatOptions };
    if (format === 'currency') {
      const currency = (config.currency || 'USD').toUpperCase();
      Object.assign(numberOpts, { style: 'currency', currency });
    }

    try {
      return new Intl.NumberFormat(options.locale, numberOpts).format(numeric);
    } catch {
      return String(numeric);
    }
  }

  return String(value);
}

function applyTokenDisplay(
  token: HTMLElement,
  options: ResolvedDataBindingOptions,
  previewEnabled: boolean,
  data?: Record<string, unknown>,
): void {
  const config = extractTokenConfig(token, options);
  const key = config.key;

  token.classList.remove('rte-data-binding-preview', 'rte-data-binding-missing');

  if (!previewEnabled) {
    token.textContent = formatTokenLabel(config);
    token.setAttribute('aria-label', `${options.labels.tokenAriaPrefix}: ${key}. Press Enter to edit.`);
    return;
  }

  const resolved = getPathValue(data, key);
  const missing = resolved == null;
  const value = missing ? config.fallback || '' : formatValue(resolved, config, options);

  token.textContent = value || config.fallback || '';
  token.classList.add('rte-data-binding-preview');
  if (missing && !(config.fallback || '').trim()) {
    token.classList.add('rte-data-binding-missing');
  }
  token.setAttribute('aria-label', `${options.labels.tokenAriaPrefix}: ${key} = ${token.textContent || ''}. Press Enter to edit.`);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getValueByPath(source: unknown, path: string | undefined): unknown {
  if (!path) return source;
  return path
    .split('.')
    .filter(Boolean)
    .reduce<unknown>((current, key) => {
      if (!isPlainObject(current) && !Array.isArray(current)) return undefined;
      return (current as any)[key];
    }, source);
}

function buildApiRequest(
  editor: HTMLElement,
  options: ResolvedDataBindingOptions,
  signal: AbortSignal,
): { url: string; init: RequestInit } {
  const api = options.api!;
  const root = resolveEditorRoot(editor);
  const ctx: DataBindingApiRequestContext = { editor, editorRoot: root, signal };

  if (api.buildRequest) {
    const built = api.buildRequest(ctx);
    return { url: built.url, init: { ...(built.init || {}), signal } };
  }

  const method = (api.method || 'GET').toUpperCase();
  const headers = typeof api.headers === 'function' ? api.headers(ctx) : (api.headers || {});
  const params = typeof api.params === 'function' ? api.params(ctx) : api.params;

  const url = new URL(api.url, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v == null) return;
      url.searchParams.set(k, String(v));
    });
  }

  const init: RequestInit = {
    method,
    headers: { ...headers },
    credentials: api.credentials,
    mode: api.mode,
    cache: api.cache,
    signal,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    const bodyCandidate = typeof api.body === 'function' ? api.body(ctx) : api.body;
    if (bodyCandidate != null) {
      if (isPlainObject(bodyCandidate)) {
        init.body = JSON.stringify(bodyCandidate);
        const normalizedHeaders = init.headers as Record<string, string>;
        if (!normalizedHeaders['Content-Type'] && !normalizedHeaders['content-type']) {
          normalizedHeaders['Content-Type'] = 'application/json';
        }
      } else {
        init.body = bodyCandidate as BodyInit;
      }
    }
  }

  return { url: url.toString(), init };
}

async function fetchDataFromApi(editor: HTMLElement, options: ResolvedDataBindingOptions): Promise<Record<string, unknown>> {
  const api = options.api;
  if (!api) return {};

  const controller = new AbortController();
  const root = resolveEditorRoot(editor);
  const ctx: DataBindingApiRequestContext = { editor, editorRoot: root, signal: controller.signal };

  const timeoutMs = Math.max(0, Number(api.timeoutMs ?? 10000));
  let timeoutHandle: number | null = null;
  if (timeoutMs > 0) {
    timeoutHandle = window.setTimeout(() => controller.abort(), timeoutMs);
  }

  try {
    const { url, init } = buildApiRequest(editor, options, controller.signal);
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Data binding API request failed: ${response.status}`);
    }

    const responseType = api.responseType || 'json';
    const raw = responseType === 'text' ? await response.text() : await response.json();

    if (api.transformResponse) {
      const transformed = api.transformResponse(raw, ctx);
      return isPlainObject(transformed) ? transformed : {};
    }

    const payload = getValueByPath(raw, api.responsePath);
    if (isPlainObject(payload)) return payload;
    if (isPlainObject(raw)) return raw;

    return { value: payload };
  } catch (error) {
    if ((error as any)?.name !== 'AbortError') {
      api.onError?.(error, ctx);
    }
    return {};
  } finally {
    if (timeoutHandle !== null) {
      window.clearTimeout(timeoutHandle);
    }
  }
}

async function resolveRuntimeData(editor: HTMLElement, options: ResolvedDataBindingOptions): Promise<Record<string, unknown>> {
  const override = overrideDataByEditor.get(editor);
  if (override) return override;

  const cached = dataCacheByEditor.get(editor);
  const now = Date.now();
  if (cached && now - cached.timestamp <= options.cacheTtlMs) {
    return cached.data;
  }

  const pending = pendingFetchByEditor.get(editor);
  if (pending) return pending;

  const task = (async (): Promise<Record<string, unknown>> => {
    try {
      if (typeof options.getData === 'function') {
        const result = await Promise.resolve(options.getData({ editor, editorRoot: resolveEditorRoot(editor) }));
        if (isPlainObject(result)) return result;
      }

      if (options.api) {
        const result = await fetchDataFromApi(editor, options);
        if (isPlainObject(result)) return result;
      }

      if (typeof options.data === 'function') {
        const result = await Promise.resolve(options.data());
        if (isPlainObject(result)) return result;
      }

      if (isPlainObject(options.data)) {
        return options.data;
      }

      return {};
    } finally {
      pendingFetchByEditor.delete(editor);
    }
  })();

  pendingFetchByEditor.set(editor, task);
  const data = await task;
  dataCacheByEditor.set(editor, { timestamp: now, data });
  return data;
}

async function applyPreviewState(editor: HTMLElement, options: ResolvedDataBindingOptions, enabled: boolean): Promise<void> {
  const tokens = normalizeTokens(editor, options);
  previewEnabledByEditor.set(editor, enabled);
  setPreviewButtonState(editor, enabled, options);

  if (!enabled) {
    tokens.forEach((token) => applyTokenDisplay(token, options, false));
    return;
  }

  const data = await resolveRuntimeData(editor, options);
  tokens.forEach((token) => applyTokenDisplay(token, options, true, data));
}

function insertTokenAtSelection(editor: HTMLElement, token: HTMLElement): void {
  let range = getSelectionRangeInEditor(editor);
  if (!range) {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
  }

  if (!range.collapsed) {
    range.deleteContents();
  }

  range.insertNode(token);

  const spacer = document.createTextNode(' ');
  token.after(spacer);

  const next = document.createRange();
  next.setStart(spacer, 1);
  next.collapse(true);
  setSelectionRange(editor, next);

  editor.normalize();
}

function isOpenDialogShortcut(event: KeyboardEvent): boolean {
  const hasPrimary = event.metaKey || event.ctrlKey;
  const key = event.key.toLowerCase();
  const modShortcut = hasPrimary && event.altKey && event.shiftKey && key === 'd';
  const fallbackShortcut = !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && key === 'f7';
  return modShortcut || fallbackShortcut;
}

function isTogglePreviewShortcut(event: KeyboardEvent): boolean {
  const hasPrimary = event.metaKey || event.ctrlKey;
  const key = event.key.toLowerCase();
  const modShortcut = hasPrimary && event.altKey && event.shiftKey && key === 'b';
  const fallbackShortcut = !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && key === 'f8';
  return modShortcut || fallbackShortcut;
}

function openDataBindingDialog(
  editor: HTMLElement,
  options: ResolvedDataBindingOptions,
  mode: 'insert' | 'edit',
  initialArgs?: DataBindingDialogArgs,
  targetToken?: HTMLElement,
): void {
  ensureNoActiveDialog();

  const savedRange = mode === 'insert' ? getSelectionRangeInEditor(editor) : null;
  const labels = options.labels;
  const seed = targetToken ? extractTokenConfig(targetToken, options) : normalizeTokenConfig(initialArgs || {}, options);

  const overlay = document.createElement('div');
  overlay.className = DIALOG_OVERLAY_CLASS;
  if (shouldUseDarkTheme(editor)) {
    overlay.classList.add('rte-data-binding-theme-dark');
  }

  const dialog = document.createElement('section');
  dialog.className = 'rte-data-binding-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'rte-data-binding-dialog-title');
  dialog.innerHTML = `
    <header class="rte-data-binding-header">
      <h2 id="rte-data-binding-dialog-title" class="rte-data-binding-title">${escapeHtml(
        mode === 'edit' ? labels.dialogTitleEdit : labels.dialogTitleInsert,
      )}</h2>
      <button type="button" class="rte-data-binding-btn" data-action="cancel" aria-label="${escapeHtml(labels.cancelText)}">✕</button>
    </header>
    <div class="rte-data-binding-body">
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-key">${escapeHtml(labels.keyLabel)}</label>
        <input id="rte-data-binding-key" class="rte-data-binding-key" type="text" value="${escapeHtml(seed.key)}" placeholder="${escapeHtml(
          labels.keyPlaceholder,
        )}" />
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-fallback">${escapeHtml(labels.fallbackLabel)}</label>
        <input id="rte-data-binding-fallback" class="rte-data-binding-fallback" type="text" value="${escapeHtml(
          seed.fallback || '',
        )}" placeholder="${escapeHtml(labels.fallbackPlaceholder)}" />
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-format">${escapeHtml(labels.formatLabel)}</label>
        <select id="rte-data-binding-format" class="rte-data-binding-format">
          <option value="text" ${seed.format === 'text' ? 'selected' : ''}>Text</option>
          <option value="number" ${seed.format === 'number' ? 'selected' : ''}>Number</option>
          <option value="currency" ${seed.format === 'currency' ? 'selected' : ''}>Currency</option>
          <option value="date" ${seed.format === 'date' ? 'selected' : ''}>Date</option>
          <option value="json" ${seed.format === 'json' ? 'selected' : ''}>JSON</option>
        </select>
      </div>
      <div class="rte-data-binding-field">
        <label for="rte-data-binding-currency">${escapeHtml(labels.currencyLabel)}</label>
        <input id="rte-data-binding-currency" class="rte-data-binding-currency" type="text" maxlength="3" value="${escapeHtml(
          seed.currency || 'USD',
        )}" placeholder="${escapeHtml(labels.currencyPlaceholder)}" />
      </div>
      <p class="rte-data-binding-help">Use dot paths like <code>user.name</code> or <code>order.total</code>.</p>
    </div>
    <footer class="rte-data-binding-footer">
      <button type="button" class="rte-data-binding-btn" data-action="cancel">${escapeHtml(labels.cancelText)}</button>
      <button type="button" class="rte-data-binding-btn rte-data-binding-btn-primary" data-action="save">${escapeHtml(labels.saveText)}</button>
    </footer>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const keyInput = dialog.querySelector<HTMLInputElement>('.rte-data-binding-key');
  const fallbackInput = dialog.querySelector<HTMLInputElement>('.rte-data-binding-fallback');
  const formatInput = dialog.querySelector<HTMLSelectElement>('.rte-data-binding-format');
  const currencyInput = dialog.querySelector<HTMLInputElement>('.rte-data-binding-currency');

  const updateCurrencyVisibility = () => {
    const isCurrency = formatInput?.value === 'currency';
    const currencyField = currencyInput?.closest('.rte-data-binding-field') as HTMLElement | null;
    if (!currencyField) return;
    currencyField.style.display = isCurrency ? 'grid' : 'none';
  };

  updateCurrencyVisibility();
  formatInput?.addEventListener('change', updateCurrencyVisibility);

  const closeDialog = () => {
    overlay.removeEventListener('click', onOverlayClick);
    overlay.removeEventListener('keydown', onDialogKeyDown, true);
    document.removeEventListener('keydown', onDocumentEscape, true);
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    activeDialogState = null;
    editor.focus({ preventScroll: true });
  };

  const onDocumentEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeDialog();
  };

  const onOverlayClick = (event: MouseEvent) => {
    if (event.target === overlay) {
      closeDialog();
    }
  };

  const trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const saveDialog = async () => {
    const key = (keyInput?.value || '').trim();
    if (!key) {
      keyInput?.focus();
      return;
    }

    const config = normalizeTokenConfig(
      {
        key,
        fallback: (fallbackInput?.value || '').trim(),
        format: (formatInput?.value as DataBindingFormat) || options.defaultFormat,
        currency: (currencyInput?.value || 'USD').trim().toUpperCase(),
      },
      options,
    );

    const beforeHTML = editor.innerHTML;

    if (targetToken) {
      applyTokenConfig(targetToken, config, labels);
      const previewEnabled = previewEnabledByEditor.get(editor) === true;
      const data = previewEnabled ? await resolveRuntimeData(editor, options) : undefined;
      applyTokenDisplay(targetToken, options, previewEnabled, data);
    } else {
      if (savedRange) {
        try {
          setSelectionRange(editor, savedRange);
        } catch {
          // ignore invalid saved range
        }
      }

      const token = createTokenElement(config, labels);
      insertTokenAtSelection(editor, token);

      const previewEnabled = previewEnabledByEditor.get(editor) === true;
      if (previewEnabled) {
        const data = await resolveRuntimeData(editor, options);
        applyTokenDisplay(token, options, true, data);
      }
    }

    dispatchEditorInput(editor);
    recordDomHistoryTransaction(editor, beforeHTML);
    closeDialog();
  };

  const onDialogKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }

    trapFocus(event);

    if (event.key === 'Enter' && !event.shiftKey && event.target instanceof HTMLInputElement) {
      event.preventDefault();
      void saveDialog();
    }
  };

  dialog.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const action = target?.getAttribute('data-action');
    if (!action) return;
    if (action === 'cancel') {
      closeDialog();
      return;
    }
    if (action === 'save') {
      void saveDialog();
    }
  });

  overlay.addEventListener('click', onOverlayClick);
  overlay.addEventListener('keydown', onDialogKeyDown, true);
  document.addEventListener('keydown', onDocumentEscape, true);

  activeDialogState = { cleanup: closeDialog };
  keyInput?.focus();
}

function bindGlobalHandlers(options: ResolvedDataBindingOptions): void {
  fallbackOptions = options;

  if (!globalFocusInHandler) {
    globalFocusInHandler = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      lastActiveEditor = editor;
      if (!optionsByEditor.has(editor)) {
        optionsByEditor.set(editor, options);
      }
      const resolvedOptions = optionsByEditor.get(editor) || options;

      normalizeTokens(editor, resolvedOptions);
      const previewEnabled = previewEnabledByEditor.get(editor) === true;
      setPreviewButtonState(editor, previewEnabled, resolvedOptions);
      if (!previewEnabled) {
        const tokens = Array.from(editor.querySelectorAll<HTMLElement>(TOKEN_SELECTOR));
        tokens.forEach((token) => applyTokenDisplay(token, resolvedOptions, false));
      }
    };

    document.addEventListener('focusin', globalFocusInHandler, true);
  }

  if (!globalKeydownHandler) {
    globalKeydownHandler = (event: KeyboardEvent) => {
      if (document.querySelector(`.${DIALOG_OVERLAY_CLASS}`)) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;

      const editor = resolveEditorFromContext(undefined, false);
      if (!editor || isEditorReadonly(editor)) return;

      const resolvedOptions = optionsByEditor.get(editor) || fallbackOptions || options;
      const focusedToken = target?.closest(TOKEN_SELECTOR) as HTMLElement | null;

      if (focusedToken && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        event.stopPropagation();
        lastActiveEditor = editor;
        openDataBindingDialog(editor, resolvedOptions, 'edit', undefined, focusedToken);
        return;
      }

      if (isOpenDialogShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();

        const token = findSelectedToken(editor);
        if (token) {
          openDataBindingDialog(editor, resolvedOptions, 'edit', undefined, token);
        } else {
          openDataBindingDialog(editor, resolvedOptions, 'insert');
        }
        return;
      }

      if (isTogglePreviewShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();

        const nextEnabled = !(previewEnabledByEditor.get(editor) === true);
        void applyPreviewState(editor, resolvedOptions, nextEnabled);
      }
    };

    document.addEventListener('keydown', globalKeydownHandler, true);
  }

  if (!globalTokenClickHandler) {
    globalTokenClickHandler = (event: MouseEvent) => {
      if (document.querySelector(`.${DIALOG_OVERLAY_CLASS}`)) return;
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

      const target = event.target as HTMLElement | null;
      const token = target?.closest(TOKEN_SELECTOR) as HTMLElement | null;
      if (!token) return;

      const editor = token.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor || isEditorReadonly(editor)) return;

      const resolvedOptions = optionsByEditor.get(editor) || fallbackOptions || options;
      optionsByEditor.set(editor, resolvedOptions);
      lastActiveEditor = editor;

      event.preventDefault();
      event.stopPropagation();

      token.focus({ preventScroll: true });
      openDataBindingDialog(editor, resolvedOptions, 'edit', undefined, token);
    };

    document.addEventListener('click', globalTokenClickHandler, true);
  }
}

function unbindGlobalHandlers(): void {
  if (globalFocusInHandler) {
    document.removeEventListener('focusin', globalFocusInHandler, true);
    globalFocusInHandler = null;
  }

  if (globalKeydownHandler) {
    document.removeEventListener('keydown', globalKeydownHandler, true);
    globalKeydownHandler = null;
  }

  if (globalTokenClickHandler) {
    document.removeEventListener('click', globalTokenClickHandler, true);
    globalTokenClickHandler = null;
  }

  fallbackOptions = null;
  lastActiveEditor = null;
}

export const DataBindingPlugin = (rawOptions: DataBindingPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  ensureStylesInjected();

  return {
    name: 'dataBinding',

    toolbar: [
      {
        id: 'dataBindingTools',
        label: 'Data Binding',
        type: 'group',
        command: 'openDataBindingDialog',
        items: [
          {
            id: 'dataBinding',
            label: 'Data Binding',
            command: 'openDataBindingDialog',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 4a3 3 0 0 0-3 3v3h2V7a1 1 0 0 1 1-1h3V4H7Zm10 0h-3v2h3a1 1 0 0 1 1 1v3h2V7a3 3 0 0 0-3-3ZM4 14v3a3 3 0 0 0 3 3h3v-2H7a1 1 0 0 1-1-1v-3H4Zm14 0v3a1 1 0 0 1-1 1h-3v2h3a3 3 0 0 0 3-3v-3h-2ZM8.5 12a1.5 1.5 0 1 1 0-3h7a1.5 1.5 0 0 1 0 3h-7Zm0 4a1.5 1.5 0 1 1 0-3h4a1.5 1.5 0 0 1 0 3h-4Z" fill="currentColor"></path></svg>',
          },
          {
            id: 'dataBindingPreview',
            label: 'Data Preview',
            command: 'toggleDataBindingPreview',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M12 3c-4.4 0-8 1.3-8 3v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0-1.7-3.6-3-8-3Zm0 2c3.9 0 6 .9 6 1s-2.1 1-6 1-6-.9-6-1 2.1-1 6-1Zm0 4c3 0 5.6-.5 7-1.3V11c0 .9-2.7 2-7 2s-7-1.1-7-2V7.7C6.4 8.5 9 9 12 9Zm0 6c-4.3 0-7-1.1-7-2v3c0 .9 2.7 2 7 2s7-1.1 7-2v-3c0 .9-2.7 2-7 2Z" fill="currentColor"></path><path d="M16.5 9.4a1 1 0 0 1 1.4 0l1.1 1.1 1.8-1.8a1 1 0 1 1 1.4 1.4l-2.5 2.5a1 1 0 0 1-1.4 0l-1.8-1.8a1 1 0 0 1 0-1.4Z" fill="currentColor"></path></svg>',
          },
        ],
      },
    ],

    commands: {
      openDataBindingDialog: (args?: DataBindingDialogArgs, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        lastActiveEditor = editor;
        const resolvedOptions = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolvedOptions);
        normalizeTokens(editor, resolvedOptions);

        const explicitTarget = args?.target;
        if (explicitTarget === 'insert') {
          openDataBindingDialog(editor, resolvedOptions, 'insert', args);
          return true;
        }

        const selected = findSelectedToken(editor);
        if (explicitTarget === 'edit' || selected) {
          if (!selected && explicitTarget === 'edit') return false;
          openDataBindingDialog(editor, resolvedOptions, 'edit', args, selected || undefined);
          return true;
        }

        openDataBindingDialog(editor, resolvedOptions, 'insert', args);
        return true;
      },

      insertDataBindingToken: async (
        args?: DataBindingTokenConfig,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        lastActiveEditor = editor;
        const resolvedOptions = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolvedOptions);

        const config = normalizeTokenConfig(args || {}, resolvedOptions);
        if (!config.key) return false;

        const beforeHTML = editor.innerHTML;
        const token = createTokenElement(config, resolvedOptions.labels);
        insertTokenAtSelection(editor, token);

        const previewEnabled = previewEnabledByEditor.get(editor) === true;
        if (previewEnabled) {
          const data = await resolveRuntimeData(editor, resolvedOptions);
          applyTokenDisplay(token, resolvedOptions, true, data);
        }

        dispatchEditorInput(editor);
        recordDomHistoryTransaction(editor, beforeHTML);
        return true;
      },

      editDataBindingToken: async (
        args?: Partial<DataBindingTokenConfig>,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        lastActiveEditor = editor;
        const resolvedOptions = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolvedOptions);

        const token = findSelectedToken(editor);
        if (!token) return false;

        const base = extractTokenConfig(token, resolvedOptions);
        const next = normalizeTokenConfig({ ...base, ...(args || {}) }, resolvedOptions);
        if (!next.key) return false;

        const beforeHTML = editor.innerHTML;
        applyTokenConfig(token, next, resolvedOptions.labels);

        const previewEnabled = previewEnabledByEditor.get(editor) === true;
        const data = previewEnabled ? await resolveRuntimeData(editor, resolvedOptions) : undefined;
        applyTokenDisplay(token, resolvedOptions, previewEnabled, data);

        dispatchEditorInput(editor);
        recordDomHistoryTransaction(editor, beforeHTML);
        return true;
      },

      toggleDataBindingPreview: async (
        value?: boolean,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        lastActiveEditor = editor;
        const resolvedOptions = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolvedOptions);

        const nextEnabled = typeof value === 'boolean' ? value : !(previewEnabledByEditor.get(editor) === true);
        await applyPreviewState(editor, resolvedOptions, nextEnabled);
        return true;
      },

      setDataBindingData: async (
        value?: Record<string, unknown>,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        lastActiveEditor = editor;

        if (value && typeof value === 'object') {
          overrideDataByEditor.set(editor, value);
          dataCacheByEditor.set(editor, { timestamp: Date.now(), data: value });
        } else {
          overrideDataByEditor.delete(editor);
          dataCacheByEditor.delete(editor);
        }

        if (previewEnabledByEditor.get(editor) === true) {
          const resolvedOptions = optionsByEditor.get(editor) || options;
          await applyPreviewState(editor, resolvedOptions, true);
        }

        return true;
      },

      refreshDataBindings: async (
        _value?: unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        lastActiveEditor = editor;
        dataCacheByEditor.delete(editor);

        const resolvedOptions = optionsByEditor.get(editor) || options;
        optionsByEditor.set(editor, resolvedOptions);

        const previewEnabled = previewEnabledByEditor.get(editor) === true;
        await applyPreviewState(editor, resolvedOptions, previewEnabled);
        return true;
      },
    },

    keymap: {
      'Mod-Alt-Shift-d': 'openDataBindingDialog',
      'Mod-Alt-Shift-D': 'openDataBindingDialog',
      'Mod-Alt-Shift-b': 'toggleDataBindingPreview',
      'Mod-Alt-Shift-B': 'toggleDataBindingPreview',
      F7: 'openDataBindingDialog',
      F8: 'toggleDataBindingPreview',
    },

    init: function init(this: any, context?: { editorElement?: HTMLElement }) {
      pluginInstanceCount += 1;

      const runtimeConfig = this && typeof this.__pluginConfig === 'object'
        ? normalizeOptions({ ...options, ...(this.__pluginConfig as DataBindingPluginOptions) })
        : options;

      bindGlobalHandlers(runtimeConfig);

      const editor = resolveEditorFromContext(
        context && context.editorElement
          ? { editorElement: context.editorElement }
          : undefined,
        false,
      );

      if (editor) {
        lastActiveEditor = editor;
        optionsByEditor.set(editor, runtimeConfig);
        normalizeTokens(editor, runtimeConfig);
        const previewEnabled = previewEnabledByEditor.get(editor) === true;
        setPreviewButtonState(editor, previewEnabled, runtimeConfig);
      }
    },

    destroy: () => {
      pluginInstanceCount = Math.max(0, pluginInstanceCount - 1);
      if (pluginInstanceCount === 0) {
        ensureNoActiveDialog();
        unbindGlobalHandlers();
      }
    },
  };
};
