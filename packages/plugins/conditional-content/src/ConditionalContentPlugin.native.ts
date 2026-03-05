import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const BLOCK_SELECTOR = '.rte-conditional-block[data-conditional-content="true"]';
const DARK_THEME_SELECTOR =':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';
const ACME_THEME_SELECTOR =':is([data-theme="acme"], .editora-theme-acme, .rte-theme-acme)';
const LOCAL_DARK_THEME_SCOPE = ':is(.rte-content.rte-conditional-theme-dark, .editora-content.rte-conditional-theme-dark)';
const LOCAL_ACME_THEME_SCOPE = ':is(.rte-content.rte-conditional-theme-acme, .editora-content.rte-conditional-theme-acme)';
const STYLE_ID = 'rte-conditional-content-styles';
const DIALOG_OVERLAY_CLASS = 'rte-conditional-dialog-overlay';
const FLOATING_TOOLBAR_CLASS = 'rte-conditional-floating-toolbar';

export interface ConditionalContentLabels {
  dialogTitleInsert?: string;
  dialogTitleEdit?: string;
  conditionLabel?: string;
  conditionPlaceholder?: string;
  audienceLabel?: string;
  audiencePlaceholder?: string;
  localeLabel?: string;
  localePlaceholder?: string;
  elseLabel?: string;
  saveText?: string;
  cancelText?: string;
  blockIfLabel?: string;
  blockElseLabel?: string;
  allAudiencesText?: string;
  allLocalesText?: string;
}

export interface ConditionalBlockConfig {
  condition?: string;
  audience?: string[];
  locale?: string[];
  hasElse?: boolean;
}

export interface ConditionalContentDialogArgs extends ConditionalBlockConfig {
  target?: 'insert' | 'edit';
}

export interface ConditionalContentPluginOptions {
  defaultCondition?: string;
  defaultAudience?: string[];
  defaultLocale?: string[];
  enableElseByDefault?: boolean;
  labels?: ConditionalContentLabels;
  context?: Record<string, unknown> | (() => Record<string, unknown>);
  getContext?: (context: { editor: HTMLElement; editorRoot: HTMLElement }) => Record<string, unknown> | Promise<Record<string, unknown>>;
  currentAudience?: string | string[];
  currentLocale?: string | string[];
  evaluateCondition?: (condition: string, context: Record<string, unknown>) => boolean;
}

interface ResolvedConditionalContentPluginOptions {
  defaultCondition: string;
  defaultAudience: string[];
  defaultLocale: string[];
  enableElseByDefault: boolean;
  labels: Required<ConditionalContentLabels>;
  context?: Record<string, unknown> | (() => Record<string, unknown>);
  getContext?: (context: { editor: HTMLElement; editorRoot: HTMLElement }) => Record<string, unknown> | Promise<Record<string, unknown>>;
  currentAudience?: string | string[];
  currentLocale?: string | string[];
  evaluateCondition: (condition: string, context: Record<string, unknown>) => boolean;
}

interface ConditionalDialogState {
  cleanup: () => void;
}

const previewEnabledByEditor = new WeakMap<HTMLElement, boolean>();
const overrideContextByEditor = new WeakMap<HTMLElement, Record<string, unknown>>();
const optionsByEditor = new WeakMap<HTMLElement, ResolvedConditionalContentPluginOptions>();
const floatingToolbarByEditor = new Map<HTMLElement, HTMLDivElement>();
const floatingToolbarBlockByEditor = new Map<HTMLElement, HTMLElement | null>();
let activeDialogState: ConditionalDialogState | null = null;
let pluginInstanceCount = 0;
let globalKeydownHandler: ((event: KeyboardEvent) => void) | null = null;
let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let globalClickHandler: ((event: MouseEvent) => void) | null = null;
let globalMouseDownHandler: ((event: MouseEvent) => void) | null = null;
let globalSelectionChangeHandler: (() => void) | null = null;
let globalInputHandler: ((event: Event) => void) | null = null;
let globalScrollResizeHandler: (() => void) | null = null;
let lastActiveEditor: HTMLElement | null = null;
let fallbackOptions: ResolvedConditionalContentPluginOptions | null = null;

const defaultLabels: Required<ConditionalContentLabels> = {
  dialogTitleInsert: 'Insert Conditional Content',
  dialogTitleEdit: 'Edit Conditional Content',
  conditionLabel: 'Condition',
  conditionPlaceholder: 'user.role == "admin"',
  audienceLabel: 'Audience (comma separated)',
  audiencePlaceholder: 'all',
  localeLabel: 'Locale (comma separated)',
  localePlaceholder: 'all',
  elseLabel: 'Enable Else Block',
  saveText: 'Save',
  cancelText: 'Cancel',
  blockIfLabel: 'IF',
  blockElseLabel: 'ELSE',
  allAudiencesText: 'all audiences',
  allLocalesText: 'all locales',
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseCsv(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function toCsv(values: string[] | undefined): string {
  if (!values || values.length === 0) return '';
  return values.join(', ');
}

function normalizeValues(values: string[] | undefined): string[] {
  if (!values) return [];
  return values.map((value) => value.trim()).filter(Boolean);
}

function mergeLabels(labels?: ConditionalContentLabels): Required<ConditionalContentLabels> {
  return {
    ...defaultLabels,
    ...(labels || {}),
  };
}

function isEditorReadonly(editor: HTMLElement): boolean {
  return editor.getAttribute('contenteditable') === 'false' || editor.getAttribute('data-readonly') === 'true';
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const root = editor.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor');
  return (root as HTMLElement) || editor;
}

function isDarkThemeElement(element: Element | null): boolean {
  if (!element) return false;

  const themeAttr = element.getAttribute('data-theme') || element.getAttribute('theme');
  if (themeAttr && themeAttr.toLowerCase() === 'dark') return true;

  return (
    element.classList.contains('dark') ||
    element.classList.contains('editora-theme-dark') ||
    element.classList.contains('rte-theme-dark')
  );
}

function shouldUseDarkTheme(editor: HTMLElement): boolean {
  const root = resolveEditorRoot(editor);
  if (isDarkThemeElement(root)) return true;

  const scoped = root.closest('[data-theme], [theme], .dark, .editora-theme-dark, .rte-theme-dark');
  if (isDarkThemeElement(scoped)) return true;

  return isDarkThemeElement(document.documentElement) || isDarkThemeElement(document.body);
}

function isAcmeThemeElement(element: Element | null): boolean {
  if (!element) return false;

  const themeAttr = element.getAttribute('data-theme') || element.getAttribute('theme');
  if (themeAttr && themeAttr.toLowerCase() === 'acme') return true;

  return element.classList.contains('editora-theme-acme') || element.classList.contains('rte-theme-acme');
}

function shouldUseAcmeTheme(editor: HTMLElement): boolean {
  const root = resolveEditorRoot(editor);
  if (isAcmeThemeElement(root)) return true;

  const scoped = root.closest('[data-theme], [theme], .editora-theme-acme, .rte-theme-acme');
  if (isAcmeThemeElement(scoped)) return true;

  return isAcmeThemeElement(document.documentElement) || isAcmeThemeElement(document.body);
}

function resolveThemeVariant(editor: HTMLElement): 'light' | 'dark' | 'acme' {
  if (shouldUseDarkTheme(editor)) return 'dark';
  if (shouldUseAcmeTheme(editor)) return 'acme';
  return 'light';
}

function applyThemeClass(target: HTMLElement, editor: HTMLElement): void {
  const variant = resolveThemeVariant(editor);
  target.classList.remove('rte-conditional-theme-dark', 'rte-conditional-theme-acme');

  if (variant === 'dark') {
    target.classList.add('rte-conditional-theme-dark');
  } else if (variant === 'acme') {
    target.classList.add('rte-conditional-theme-acme');
  }
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
    // History plugin may not be loaded.
  }
}

function placeCaretAtEnd(editor: HTMLElement, element: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  setSelectionRange(editor, range);
}

function getPathValue(source: unknown, path: string): unknown {
  if (!path) return undefined;

  return path
    .split('.')
    .filter(Boolean)
    .reduce<unknown>((current, key) => {
      if (current == null) return undefined;
      if (typeof current !== 'object') return undefined;
      return (current as Record<string, unknown>)[key];
    }, source);
}

function parseLiteral(raw: string): unknown {
  const trimmed = raw.trim();

  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;

  const numeric = Number(trimmed);
  if (!Number.isNaN(numeric) && trimmed !== '') return numeric;

  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function defaultEvaluateCondition(condition: string, context: Record<string, unknown>): boolean {
  const expression = condition.trim();
  if (!expression) return true;

  if (expression.startsWith('!')) {
    const key = expression.slice(1).trim();
    return !Boolean(getPathValue(context, key));
  }

  const operatorMatch = expression.match(/^([a-zA-Z_$][\w.$]*)\s*(==|!=|>=|<=|>|<|in|contains|~=)\s*(.+)$/);

  if (!operatorMatch) {
    return Boolean(getPathValue(context, expression));
  }

  const [, leftPath, operator, rawRight] = operatorMatch;
  const leftValue = getPathValue(context, leftPath);
  const rightValue = parseLiteral(rawRight);

  switch (operator) {
    case '==':
      return leftValue == rightValue;
    case '!=':
      return leftValue != rightValue;
    case '>':
      return Number(leftValue) > Number(rightValue);
    case '<':
      return Number(leftValue) < Number(rightValue);
    case '>=':
      return Number(leftValue) >= Number(rightValue);
    case '<=':
      return Number(leftValue) <= Number(rightValue);
    case 'in': {
      if (Array.isArray(rightValue)) {
        return rightValue.some((item) => item == leftValue);
      }
      if (typeof rightValue === 'string') {
        return rightValue.split(',').map((v) => v.trim()).includes(String(leftValue));
      }
      return false;
    }
    case 'contains':
    case '~=': {
      if (Array.isArray(leftValue)) {
        return leftValue.some((item) => String(item).toLowerCase() === String(rightValue).toLowerCase());
      }
      if (typeof leftValue === 'string') {
        return leftValue.toLowerCase().includes(String(rightValue).toLowerCase());
      }
      return false;
    }
    default:
      return false;
  }
}

function ensureStylesInjected(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .rte-conditional-block {
      border: 1px solid #dbe3ec;
      border-radius: 8px;
      margin: 10px 0;
      background: #f8fafc;
      overflow: hidden;
    }

    .rte-conditional-header,
    .rte-conditional-else-label {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #eef2f7;
      border-bottom: 1px solid #dbe3ec;
      padding: 8px 10px;
      user-select: none;
    }

    .rte-conditional-else-label {
      border-top: 1px solid #dbe3ec;
      border-bottom: 1px solid #dbe3ec;
    }

    .rte-conditional-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 20px;
      border-radius: 999px;
      border: 1px solid #bfdbfe;
      background: #dbeafe;
      color: #1e3a8a;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      padding: 0 7px;
      flex: 0 0 auto;
    }

    .rte-conditional-chip-else {
      border-color: #fecaca;
      background: #fee2e2;
      color: #991b1b;
    }

    .rte-conditional-summary {
      font-size: 12px;
      color: #0f172a;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    .rte-conditional-meta {
      font-size: 11px;
      color: #64748b;
      white-space: nowrap;
      flex: 0 0 auto;
    }

    .rte-conditional-body {
      padding: 10px;
      background: #ffffff;
      min-height: 44px;
    }

    .rte-conditional-hidden {
      display: none !important;
    }

    .rte-toolbar-group-items.conditional-content,
    .editora-toolbar-group-items.conditional-content {
      display: flex;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
    }

    .rte-toolbar-group-items.conditional-content .rte-toolbar-item,
    .editora-toolbar-group-items.conditional-content .editora-toolbar-item {
      display: flex;
    }

    .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.conditional-content .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.conditional-content .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="toggleConditionalPreview"].active,
    .editora-toolbar-button[data-command="toggleConditionalPreview"].active {
      background: rgba(37, 99, 235, 0.14);
    }

    .rte-conditional-block.rte-conditional-preview {
      border-style: dashed;
    }

    .rte-conditional-block.rte-conditional-preview .rte-conditional-body[contenteditable="false"] {
      cursor: default;
    }

    .${DIALOG_OVERLAY_CLASS} {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .rte-conditional-dialog {
      width: min(560px, 96vw);
      max-height: min(88vh, 760px);
      border: 1px solid #dbe3ec;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0 24px 50px rgba(15, 23, 42, 0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .rte-conditional-dialog-header,
    .rte-conditional-dialog-footer {
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .rte-conditional-dialog-footer {
      border-top: 1px solid #e2e8f0;
      border-bottom: none;
      justify-content: flex-end;
    }

    .rte-conditional-dialog-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .rte-conditional-dialog-body {
      padding: 14px;
      overflow: auto;
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .rte-conditional-field {
      display: grid;
      gap: 6px;
    }

    .rte-conditional-field label {
      font-size: 12px;
      font-weight: 600;
      color: #334155;
    }

    .rte-conditional-field input[type="text"] {
      width: 100%;
      min-height: 36px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      font-size: 13px;
      line-height: 1.4;
      box-sizing: border-box;
      color: #0f172a;
      background: #ffffff;
    }

    .rte-conditional-field input[type="text"]:focus-visible,
    .rte-conditional-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .rte-conditional-checkbox {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #334155;
      min-height: 36px;
    }

    .rte-conditional-help {
      margin: 0;
      font-size: 12px;
      color: #64748b;
    }

    .rte-conditional-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 34px;
      padding: 6px 12px;
      background: #ffffff;
      color: #0f172a;
      font-size: 13px;
      cursor: pointer;
    }

    .rte-conditional-btn-primary {
      border-color: #2563eb;
      background: #2563eb;
      color: #ffffff;
    }

    .rte-conditional-btn-primary:hover {
      background: #1d4ed8;
    }

    .${FLOATING_TOOLBAR_CLASS} {
      position: fixed;
      z-index: 2147483645;
      display: none;
      align-items: center;
      gap: 6px;
      padding: 6px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 14px 30px rgba(15, 23, 42, 0.2);
      backdrop-filter: blur(6px);
    }

    .${FLOATING_TOOLBAR_CLASS}.show {
      display: inline-flex;
    }

    .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      min-height: 30px;
      min-width: 30px;
      padding: 0 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: #ffffff;
      color: #0f172a;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
    }

    .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn:hover {
      background: #f8fafc;
    }

    .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn[data-action="delete"] {
      border-color: #fecaca;
      color: #991b1b;
      background: #fff5f5;
    }

    .rte-conditional-preview-on ${BLOCK_SELECTOR} {
      border-width: 2px;
    }

    .rte-conditional-preview-on ${BLOCK_SELECTOR} .rte-conditional-header {
      background: #ecfeff;
      border-color: #bae6fd;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-block,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-block,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-block {
      background: #111827;
      border-color: #334155;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-header,
    ${DARK_THEME_SELECTOR} .rte-conditional-else-label,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-header,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-else-label,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-header,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-else-label {
      background: #0f172a;
      border-color: #334155;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-summary,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-summary,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-summary {
      color: #e2e8f0;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-meta,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-meta,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-meta {
      color: #94a3b8;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-chip,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-chip,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-chip {
      background: #1e3a8a;
      border-color: #3b82f6;
      color: #dbeafe;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-chip-else,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-chip-else,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-chip-else {
      background: #7f1d1d;
      border-color: #ef4444;
      color: #fee2e2;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-body,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-body,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-body {
      background: #1f2937;
      color: #e2e8f0;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-dialog,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-dialog,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-dialog {
      background: #1f2937;
      border-color: #334155;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-dialog-header,
    ${DARK_THEME_SELECTOR} .rte-conditional-dialog-footer,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-dialog-header,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-dialog-footer,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-dialog-header,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-dialog-footer {
      background: #111827;
      border-color: #334155;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-dialog-title,
    ${DARK_THEME_SELECTOR} .rte-conditional-field label,
    ${DARK_THEME_SELECTOR} .rte-conditional-checkbox,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-dialog-title,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-field label,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-checkbox,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-dialog-title,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-field label,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-checkbox {
      color: #e2e8f0;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-help,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-help,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-help {
      color: #94a3b8;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-field input[type="text"],
    ${DARK_THEME_SELECTOR} .rte-conditional-btn,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-field input[type="text"],
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-btn,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-field input[type="text"],
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${DARK_THEME_SELECTOR} .rte-conditional-btn-primary,
    ${LOCAL_DARK_THEME_SCOPE} .rte-conditional-btn-primary,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-conditional-btn-primary {
      border-color: #3b82f6;
      background: #2563eb;
      color: #ffffff;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.conditional-content,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .rte-toolbar-group-items.conditional-content,
    ${LOCAL_DARK_THEME_SCOPE} .rte-toolbar-group-items.conditional-content,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.conditional-content {
      border-color: #566275;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${LOCAL_DARK_THEME_SCOPE} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border-right-color: #566275;
    }

    ${DARK_THEME_SELECTOR} .${FLOATING_TOOLBAR_CLASS},
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .${FLOATING_TOOLBAR_CLASS},
    .${FLOATING_TOOLBAR_CLASS}.rte-conditional-theme-dark {
      background: rgba(17, 24, 39, 0.98);
      border-color: #334155;
      box-shadow: 0 14px 30px rgba(2, 6, 23, 0.5);
    }

    ${DARK_THEME_SELECTOR} .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn,
    .${FLOATING_TOOLBAR_CLASS}.rte-conditional-theme-dark .rte-conditional-float-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    ${DARK_THEME_SELECTOR} .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn[data-action="delete"],
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-dark .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn[data-action="delete"],
    .${FLOATING_TOOLBAR_CLASS}.rte-conditional-theme-dark .rte-conditional-float-btn[data-action="delete"] {
      border-color: #ef4444;
      color: #fecaca;
      background: rgba(127, 29, 29, 0.45);
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-block,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-block,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-block {
      background: #f8fbff;
      border-color: #cbd8e8;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-header,
    ${ACME_THEME_SELECTOR} .rte-conditional-else-label,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-header,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-else-label,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-header,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-else-label {
      background: linear-gradient(180deg, #eef4fb 0%, #e6eef8 100%);
      border-color: #cbd8e8;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-summary,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-summary,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-summary {
      color: #0f172a;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-meta,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-meta,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-meta {
      color: #587089;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-chip,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-chip,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-chip {
      background: #d9f5ee;
      border-color: #66c6b3;
      color: #0f4f4a;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-chip-else,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-chip-else,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-chip-else {
      background: #fde8ea;
      border-color: #f1a7b2;
      color: #8b1f2f;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-body,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-body,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-body {
      background: #fcfeff;
      color: #0f172a;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-dialog,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-dialog,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-dialog {
      background: #ffffff;
      border-color: #cbd8e8;
      box-shadow: 0 20px 44px rgba(15, 23, 42, 0.18);
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-dialog-header,
    ${ACME_THEME_SELECTOR} .rte-conditional-dialog-footer,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-dialog-header,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-dialog-footer,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-dialog-header,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-dialog-footer {
      background: #f3f8fd;
      border-color: #d8e4f1;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-dialog-title,
    ${ACME_THEME_SELECTOR} .rte-conditional-field label,
    ${ACME_THEME_SELECTOR} .rte-conditional-checkbox,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-dialog-title,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-field label,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-checkbox,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-dialog-title,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-field label,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-checkbox {
      color: #1f334a;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-help,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-help,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-help {
      color: #5f738d;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-field input[type="text"],
    ${ACME_THEME_SELECTOR} .rte-conditional-btn,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-field input[type="text"],
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-btn,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-field input[type="text"],
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-btn {
      background: #ffffff;
      border-color: #bfd0e2;
      color: #0f172a;
    }

    ${ACME_THEME_SELECTOR} .rte-conditional-btn-primary,
    ${LOCAL_ACME_THEME_SCOPE} .rte-conditional-btn-primary,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-conditional-btn-primary {
      border-color: #0f766e;
      background: #0f766e;
      color: #ffffff;
    }

    ${ACME_THEME_SELECTOR} .rte-toolbar-group-items.conditional-content,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .rte-toolbar-group-items.conditional-content,
    ${LOCAL_ACME_THEME_SCOPE} .rte-toolbar-group-items.conditional-content,
    ${ACME_THEME_SELECTOR} .editora-toolbar-group-items.conditional-content {
      border-color: #bfd0e2;
    }

    ${ACME_THEME_SELECTOR} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${LOCAL_ACME_THEME_SCOPE} .rte-toolbar-group-items.conditional-content .rte-toolbar-button,
    ${ACME_THEME_SELECTOR} .editora-toolbar-group-items.conditional-content .editora-toolbar-button {
      border-right-color: #bfd0e2;
    }

    ${ACME_THEME_SELECTOR} .${FLOATING_TOOLBAR_CLASS},
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .${FLOATING_TOOLBAR_CLASS},
    .${FLOATING_TOOLBAR_CLASS}.rte-conditional-theme-acme {
      background: rgba(255, 255, 255, 0.98);
      border-color: #bfd0e2;
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.16);
    }

    ${ACME_THEME_SELECTOR} .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn,
    .${FLOATING_TOOLBAR_CLASS}.rte-conditional-theme-acme .rte-conditional-float-btn {
      background: #ffffff;
      border-color: #bfd0e2;
      color: #1f334a;
    }

    ${ACME_THEME_SELECTOR} .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn:hover,
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn:hover,
    .${FLOATING_TOOLBAR_CLASS}.rte-conditional-theme-acme .rte-conditional-float-btn:hover {
      background: #eef7f5;
      color: #0f4f4a;
    }

    ${ACME_THEME_SELECTOR} .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn[data-action="delete"],
    .${DIALOG_OVERLAY_CLASS}.rte-conditional-theme-acme .${FLOATING_TOOLBAR_CLASS} .rte-conditional-float-btn[data-action="delete"],
    .${FLOATING_TOOLBAR_CLASS}.rte-conditional-theme-acme .rte-conditional-float-btn[data-action="delete"] {
      border-color: #f1a7b2;
      color: #8b1f2f;
      background: #fff4f6;
    }
  `;

  document.head.appendChild(style);
}

function normalizeOptions(raw: ConditionalContentPluginOptions): ResolvedConditionalContentPluginOptions {
  return {
    defaultCondition: raw.defaultCondition || '',
    defaultAudience: normalizeValues(raw.defaultAudience || []),
    defaultLocale: normalizeValues(raw.defaultLocale || []),
    enableElseByDefault: raw.enableElseByDefault === true,
    labels: mergeLabels(raw.labels),
    context: raw.context,
    getContext: raw.getContext,
    currentAudience: raw.currentAudience,
    currentLocale: raw.currentLocale,
    evaluateCondition: raw.evaluateCondition || defaultEvaluateCondition,
  };
}

function ensureNoActiveDialog(): void {
  if (activeDialogState) {
    activeDialogState.cleanup();
    activeDialogState = null;
  }
}

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function isNodeInsideConditionalBody(node: Node | null): boolean {
  const element = getElementFromNode(node);
  return Boolean(element?.closest('.rte-conditional-body'));
}

function enforceBlockEditability(block: HTMLElement, previewEnabled: boolean): void {
  block.setAttribute('contenteditable', 'false');
  block.setAttribute('spellcheck', 'false');
  const header = block.querySelector<HTMLElement>('.rte-conditional-header');
  if (header) {
    header.setAttribute('contenteditable', 'false');
    header.setAttribute('tabindex', '0');
    header.setAttribute('role', 'button');
    header.setAttribute('aria-label', 'Edit conditional rule');
  }

  const elseLabel = block.querySelector<HTMLElement>('.rte-conditional-else-label');
  if (elseLabel) {
    elseLabel.setAttribute('contenteditable', 'false');
  }

  setBodiesEditable(block, !previewEnabled);
}

function normalizeOrphanNodesIntoIfBody(block: HTMLElement): void {
  const ifBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="if"]');
  if (!ifBody) return;

  const allowed = new Set<HTMLElement>();
  const header = block.querySelector<HTMLElement>('.rte-conditional-header');
  const elseLabel = block.querySelector<HTMLElement>('.rte-conditional-else-label');
  const elseBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="else"]');
  if (header) allowed.add(header);
  allowed.add(ifBody);
  if (elseLabel) allowed.add(elseLabel);
  if (elseBody) allowed.add(elseBody);

  const nodes = Array.from(block.childNodes);
  nodes.forEach((node) => {
    if (node instanceof HTMLElement && allowed.has(node)) return;
    if (node.nodeType === Node.TEXT_NODE && !(node.textContent || '').trim()) {
      node.remove();
      return;
    }
    ifBody.appendChild(node);
  });
}

function findSelectedConditionalBlock(editor: HTMLElement): HTMLElement | null {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const node = selection.getRangeAt(0).startContainer;
    const element = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    const block = element?.closest(BLOCK_SELECTOR) as HTMLElement | null;
    if (block && editor.contains(block)) return block;
  }

  const active = document.activeElement as HTMLElement | null;
  const activeBlock = active?.closest(BLOCK_SELECTOR) as HTMLElement | null;
  if (activeBlock && editor.contains(activeBlock)) return activeBlock;

  return null;
}

function ensureElseNodes(block: HTMLElement, labels: Required<ConditionalContentLabels>): void {
  let elseLabel = block.querySelector<HTMLElement>('.rte-conditional-else-label');
  let elseBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="else"]');

  if (!elseLabel) {
    elseLabel = document.createElement('div');
    elseLabel.className = 'rte-conditional-else-label';
    elseLabel.setAttribute('contenteditable', 'false');
    elseLabel.innerHTML = `
      <span class="rte-conditional-chip rte-conditional-chip-else">${escapeHtml(labels.blockElseLabel)}</span>
      <span class="rte-conditional-summary">Else branch</span>
    `;
    block.appendChild(elseLabel);
  }

  if (!elseBody) {
    elseBody = document.createElement('div');
    elseBody.className = 'rte-conditional-body rte-conditional-else-body';
    elseBody.setAttribute('data-slot', 'else');
    elseBody.innerHTML = '<p><br></p>';
    block.appendChild(elseBody);
  }
}

function setElseVisibility(block: HTMLElement, hasElse: boolean): void {
  block.setAttribute('data-has-else', hasElse ? 'true' : 'false');

  const elseLabel = block.querySelector<HTMLElement>('.rte-conditional-else-label');
  const elseBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="else"]');

  if (elseLabel) elseLabel.classList.toggle('rte-conditional-hidden', !hasElse);
  if (elseBody) elseBody.classList.toggle('rte-conditional-hidden', !hasElse);
}

function setBodiesEditable(block: HTMLElement, editable: boolean): void {
  const bodies = Array.from(block.querySelectorAll<HTMLElement>('.rte-conditional-body'));
  bodies.forEach((body) => {
    body.setAttribute('contenteditable', editable ? 'true' : 'false');
  });
  block.setAttribute('contenteditable', 'false');
}

function updateBlockHeader(block: HTMLElement, labels: Required<ConditionalContentLabels>): void {
  const condition = block.getAttribute('data-condition') || '';
  const audience = parseCsv(block.getAttribute('data-audience'));
  const locale = parseCsv(block.getAttribute('data-locale'));

  let header = block.querySelector<HTMLElement>('.rte-conditional-header');
  if (!header) {
    header = document.createElement('div');
    header.className = 'rte-conditional-header';
    block.prepend(header);
  }

  header.setAttribute('contenteditable', 'false');
  header.setAttribute('tabindex', '0');
  header.setAttribute('role', 'button');
  header.setAttribute('aria-label', 'Edit conditional rule');
  const safeCondition = condition || '(always true)';
  const audienceText = audience.length > 0 ? audience.join(', ') : labels.allAudiencesText;
  const localeText = locale.length > 0 ? locale.join(', ') : labels.allLocalesText;

  header.innerHTML = `
    <span class="rte-conditional-chip">${escapeHtml(labels.blockIfLabel)}</span>
    <span class="rte-conditional-summary">${escapeHtml(safeCondition)}</span>
    <span class="rte-conditional-meta">${escapeHtml(audienceText)} · ${escapeHtml(localeText)}</span>
  `;

  const ifBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="if"]');
  if (!ifBody) {
    const newIfBody = document.createElement('div');
    newIfBody.className = 'rte-conditional-body';
    newIfBody.setAttribute('data-slot', 'if');
    newIfBody.innerHTML = '<p><br></p>';
    block.insertBefore(newIfBody, block.children[1] || null);
  }

  const hasElse = block.getAttribute('data-has-else') === 'true';
  if (hasElse) {
    ensureElseNodes(block, labels);
  }
  normalizeOrphanNodesIntoIfBody(block);
  setElseVisibility(block, hasElse);
}

function createConditionalBlock(config: ConditionalBlockConfig, labels: Required<ConditionalContentLabels>): HTMLElement {
  const block = document.createElement('section');
  block.className = 'rte-conditional-block';
  block.setAttribute('data-conditional-content', 'true');
  block.setAttribute('data-condition', (config.condition || '').trim());
  block.setAttribute('data-audience', normalizeValues(config.audience).join(','));
  block.setAttribute('data-locale', normalizeValues(config.locale).join(','));
  block.setAttribute('data-has-else', config.hasElse ? 'true' : 'false');
  block.setAttribute('role', 'group');
  block.setAttribute('aria-label', 'Conditional content block');
  block.setAttribute('contenteditable', 'false');
  block.setAttribute('spellcheck', 'false');

  const header = document.createElement('div');
  header.className = 'rte-conditional-header';
  header.setAttribute('contenteditable', 'false');

  const ifBody = document.createElement('div');
  ifBody.className = 'rte-conditional-body';
  ifBody.setAttribute('data-slot', 'if');
  ifBody.innerHTML = '<p><br></p>';

  block.appendChild(header);
  block.appendChild(ifBody);

  if (config.hasElse) {
    ensureElseNodes(block, labels);
  }

  updateBlockHeader(block, labels);
  enforceBlockEditability(block, false);
  return block;
}

function restoreRangeSafely(editor: HTMLElement, savedRange: Range | null): void {
  if (!savedRange) return;

  try {
    if (!editor.isConnected) return;
    const startInEditor = editor.contains(savedRange.startContainer);
    const endInEditor = editor.contains(savedRange.endContainer);
    if (!startInEditor || !endInEditor) return;
    setSelectionRange(editor, savedRange);
  } catch {
    // Ignore if restoration is no longer possible.
  }
}

function hasMeaningfulFragmentContent(fragment: DocumentFragment): boolean {
  const text = (fragment.textContent || '').replace(/\u200B/g, '').trim();
  if (text.length > 0) return true;
  return fragment.querySelector('img, video, table, iframe, hr, pre, blockquote, ul, ol') !== null;
}

function insertBlockAtSelection(editor: HTMLElement, block: HTMLElement, baseRange?: Range | null): void {
  let range: Range | null = null;
  if (baseRange) {
    try {
      const cloned = baseRange.cloneRange();
      if (editor.contains(cloned.commonAncestorContainer)) {
        range = cloned;
      }
    } catch {
      range = null;
    }
  }

  if (!range) {
    range = getSelectionRangeInEditor(editor);
  }

  if (!range) {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
  }

  let extracted: DocumentFragment | null = null;
  if (!range.collapsed) {
    extracted = range.extractContents();
  }

  range.insertNode(block);

  const ifBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="if"]');
  if (ifBody && extracted && hasMeaningfulFragmentContent(extracted)) {
    ifBody.innerHTML = '';
    ifBody.appendChild(extracted);
  }

  if (ifBody) {
    placeCaretAtEnd(editor, ifBody);
  } else {
    placeCaretAtEnd(editor, block);
  }

  editor.normalize();
}

function extractCurrentBlockConfig(block: HTMLElement): ConditionalBlockConfig {
  return {
    condition: block.getAttribute('data-condition') || '',
    audience: parseCsv(block.getAttribute('data-audience')),
    locale: parseCsv(block.getAttribute('data-locale')),
    hasElse: block.getAttribute('data-has-else') === 'true',
  };
}

function applyBlockConfig(block: HTMLElement, config: ConditionalBlockConfig, labels: Required<ConditionalContentLabels>): void {
  block.setAttribute('data-condition', (config.condition || '').trim());
  block.setAttribute('data-audience', normalizeValues(config.audience).join(','));
  block.setAttribute('data-locale', normalizeValues(config.locale).join(','));
  block.setAttribute('data-has-else', config.hasElse ? 'true' : 'false');

  if (config.hasElse) {
    ensureElseNodes(block, labels);
  }

  updateBlockHeader(block, labels);
  enforceBlockEditability(block, block.classList.contains('rte-conditional-preview'));
}

function normalizeConditionalBlocks(editor: HTMLElement, labels: Required<ConditionalContentLabels>): HTMLElement[] {
  applyThemeClass(editor, editor);
  const blocks = Array.from(editor.querySelectorAll<HTMLElement>(BLOCK_SELECTOR));
  const previewEnabled = previewEnabledByEditor.get(editor) === true;
  blocks.forEach((block) => {
    block.classList.add('rte-conditional-block');
    block.setAttribute('data-conditional-content', 'true');

    if (!block.hasAttribute('data-condition')) {
      block.setAttribute('data-condition', '');
    }

    if (!block.hasAttribute('data-audience')) {
      block.setAttribute('data-audience', '');
    }

    if (!block.hasAttribute('data-locale')) {
      block.setAttribute('data-locale', '');
    }

    if (!block.hasAttribute('data-has-else')) {
      block.setAttribute('data-has-else', 'false');
    }

    block.setAttribute('role', 'group');
    block.setAttribute('aria-label', 'Conditional content block');
    block.setAttribute('contenteditable', 'false');
    block.setAttribute('spellcheck', 'false');
    updateBlockHeader(block, labels);
    enforceBlockEditability(block, previewEnabled);
  });

  return blocks;
}

async function resolveContext(editor: HTMLElement, options: ResolvedConditionalContentPluginOptions): Promise<Record<string, unknown>> {
  const override = overrideContextByEditor.get(editor);
  if (override) {
    return override;
  }

  if (typeof options.getContext === 'function') {
    try {
      const root = resolveEditorRoot(editor);
      const context = await Promise.resolve(options.getContext({ editor, editorRoot: root }));
      if (context && typeof context === 'object') {
        return context;
      }
    } catch {
      return {};
    }
  }

  if (typeof options.context === 'function') {
    try {
      const resolved = options.context();
      if (resolved && typeof resolved === 'object') {
        return resolved;
      }
    } catch {
      return {};
    }
  }

  if (options.context && typeof options.context === 'object') {
    return options.context;
  }

  return {};
}

function toNormalizedDimension(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => v.trim().toLowerCase()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

function matchesDimension(requirements: string[], currentValues: string[]): boolean {
  if (requirements.length === 0) return true;
  if (requirements.includes('all')) return true;
  if (currentValues.length === 0) return false;

  return requirements.some((required) => currentValues.includes(required));
}

async function applyPreviewState(
  editor: HTMLElement,
  options: ResolvedConditionalContentPluginOptions,
  enabled: boolean,
): Promise<void> {
  const labels = options.labels;
  const blocks = normalizeConditionalBlocks(editor, labels);

  previewEnabledByEditor.set(editor, enabled);
  syncPreviewButtonState(editor, enabled);

  const root = resolveEditorRoot(editor);
  root.classList.toggle('rte-conditional-preview-on', enabled);

  if (!enabled) {
    blocks.forEach((block) => {
      block.classList.remove('rte-conditional-preview');
      enforceBlockEditability(block, false);

      const ifBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="if"]');
      const elseBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="else"]');
      const elseLabel = block.querySelector<HTMLElement>('.rte-conditional-else-label');
      const hasElse = block.getAttribute('data-has-else') === 'true';

      if (ifBody) {
        ifBody.classList.remove('rte-conditional-hidden');
        ifBody.removeAttribute('aria-hidden');
      }

      if (elseBody) {
        elseBody.classList.toggle('rte-conditional-hidden', !hasElse);
        elseBody.setAttribute('aria-hidden', hasElse ? 'false' : 'true');
      }

      if (elseLabel) {
        elseLabel.classList.toggle('rte-conditional-hidden', !hasElse);
      }
    });
    return;
  }

  const context = await resolveContext(editor, options);
  const configuredAudience = toNormalizedDimension(options.currentAudience);
  const configuredLocale = toNormalizedDimension(options.currentLocale);

  const contextAudience = toNormalizedDimension(
    (context.audience as string | string[] | undefined) ??
      ((context.user as Record<string, unknown> | undefined)?.audience as string | string[] | undefined),
  );
  const contextLocale = toNormalizedDimension(
    (context.locale as string | string[] | undefined) ??
      ((context.user as Record<string, unknown> | undefined)?.locale as string | string[] | undefined),
  );

  const activeAudience = configuredAudience.length > 0 ? configuredAudience : contextAudience;
  const activeLocale = configuredLocale.length > 0 ? configuredLocale : contextLocale;

  blocks.forEach((block) => {
    const condition = block.getAttribute('data-condition') || '';
    const audienceRules = parseCsv(block.getAttribute('data-audience')).map((v) => v.toLowerCase());
    const localeRules = parseCsv(block.getAttribute('data-locale')).map((v) => v.toLowerCase());
    const hasElse = block.getAttribute('data-has-else') === 'true';

    const matchesCondition = options.evaluateCondition(condition, context);
    const matchesAudience = matchesDimension(audienceRules, activeAudience);
    const matchesLocale = matchesDimension(localeRules, activeLocale);

    const isTrueBranchVisible = matchesCondition && matchesAudience && matchesLocale;

    const ifBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="if"]');
    const elseBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="else"]');
    const elseLabel = block.querySelector<HTMLElement>('.rte-conditional-else-label');

    block.classList.add('rte-conditional-preview');
    enforceBlockEditability(block, true);

    if (ifBody) {
      ifBody.classList.toggle('rte-conditional-hidden', !isTrueBranchVisible);
      ifBody.setAttribute('aria-hidden', isTrueBranchVisible ? 'false' : 'true');
    }

    if (elseBody) {
      const showElse = hasElse && !isTrueBranchVisible;
      elseBody.classList.toggle('rte-conditional-hidden', !showElse);
      elseBody.setAttribute('aria-hidden', showElse ? 'false' : 'true');
    }

    if (elseLabel) {
      const showElseLabel = hasElse && !isTrueBranchVisible;
      elseLabel.classList.toggle('rte-conditional-hidden', !showElseLabel);
    }
  });
}

function syncPreviewButtonState(editor: HTMLElement, enabled: boolean): void {
  const root = resolveEditorRoot(editor);
  const buttons = Array.from(
    root.querySelectorAll<HTMLElement>('[data-command="toggleConditionalPreview"], [data-command="conditionalPreview"]'),
  );
  buttons.forEach((button) => {
    button.setAttribute('data-active', enabled ? 'true' : 'false');
    button.classList.toggle('active', enabled);
    button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  });
}

function ensureFloatingToolbar(editor: HTMLElement): HTMLDivElement {
  const existing = floatingToolbarByEditor.get(editor);
  if (existing && existing.isConnected) return existing;

  const toolbar = document.createElement('div');
  toolbar.className = FLOATING_TOOLBAR_CLASS;
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Conditional block actions');
  toolbar.innerHTML = `
    <button type="button" class="rte-conditional-float-btn" data-action="edit" title="Edit Condition" aria-label="Edit Condition">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 17.3V20h2.7l9.7-9.7-2.7-2.7L4 17.3Zm14.7-9.4a1 1 0 0 0 0-1.4l-1.2-1.2a1 1 0 0 0-1.4 0l-1.1 1.1 2.7 2.7 1-1.2Z" fill="currentColor"></path></svg>
    </button>
    <button type="button" class="rte-conditional-float-btn" data-action="delete" title="Delete Block" aria-label="Delete Block">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8 4h8l1 2h4v2H3V6h4l1-2Zm1 6h2v8H9v-8Zm4 0h2v8h-2v-8Z" fill="currentColor"></path></svg>
    </button>
  `;

  toolbar.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  toolbar.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const action = target?.closest<HTMLElement>('[data-action]')?.getAttribute('data-action');
    if (!action) return;

    const options = optionsByEditor.get(editor) || fallbackOptions;
    if (!options) return;
    const block = floatingToolbarBlockByEditor.get(editor);
    if (!block || !editor.contains(block)) return;

    if (action === 'edit') {
      openConditionalDialog(editor, options, 'edit', undefined, block);
      return;
    }

    if (action === 'delete') {
      removeConditionalBlock(editor, block);
      floatingToolbarBlockByEditor.set(editor, null);
      hideFloatingToolbar(editor);
    }
  });

  document.body.appendChild(toolbar);
  floatingToolbarByEditor.set(editor, toolbar);
  return toolbar;
}

function hideFloatingToolbar(editor: HTMLElement): void {
  const toolbar = floatingToolbarByEditor.get(editor);
  if (!toolbar) return;
  toolbar.classList.remove('show');
}

function positionFloatingToolbar(toolbar: HTMLElement, block: HTMLElement): void {
  const rect = block.getBoundingClientRect();
  toolbar.style.left = '0px';
  toolbar.style.top = '0px';
  toolbar.classList.add('show');

  const barRect = toolbar.getBoundingClientRect();
  const margin = 8;
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let top = rect.top - barRect.height - margin;
  if (top < margin) {
    top = rect.bottom + margin;
  }
  top = Math.min(top, viewportH - barRect.height - margin);

  let left = rect.right - barRect.width;
  left = Math.max(margin, Math.min(left, viewportW - barRect.width - margin));

  toolbar.style.left = `${left}px`;
  toolbar.style.top = `${top}px`;
}

function showFloatingToolbar(editor: HTMLElement, block: HTMLElement): void {
  const toolbar = ensureFloatingToolbar(editor);
  applyThemeClass(toolbar, editor);
  floatingToolbarBlockByEditor.set(editor, block);
  positionFloatingToolbar(toolbar, block);
}

function updateFloatingToolbarForEditor(editor: HTMLElement): void {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;
  const block = findSelectedConditionalBlock(editor);
  if (!block || !editor.contains(block) || isEditorReadonly(editor)) {
    floatingToolbarBlockByEditor.set(editor, null);
    hideFloatingToolbar(editor);
    return;
  }

  normalizeConditionalBlocks(editor, options.labels);
  showFloatingToolbar(editor, block);
}

function refreshFloatingToolbarPosition(): void {
  floatingToolbarByEditor.forEach((toolbar, editor) => {
    if (!editor.isConnected || !toolbar.isConnected) {
      toolbar.remove();
      floatingToolbarByEditor.delete(editor);
      floatingToolbarBlockByEditor.delete(editor);
      return;
    }
    if (!toolbar.classList.contains('show')) return;
    applyThemeClass(toolbar, editor);
    const block = floatingToolbarBlockByEditor.get(editor);
    if (!block || !editor.contains(block)) {
      hideFloatingToolbar(editor);
      return;
    }
    positionFloatingToolbar(toolbar, block);
  });
}

function removeConditionalBlock(editor: HTMLElement, block: HTMLElement): boolean {
  if (!editor.contains(block)) return false;

  const beforeHTML = editor.innerHTML;
  const parent = block.parentNode;
  const nextSibling = block.nextSibling;
  block.remove();

  if (parent === editor && editor.innerHTML.trim() === '') {
    editor.innerHTML = '<p><br></p>';
  }

  const range = document.createRange();
  if (nextSibling && editor.contains(nextSibling)) {
    range.setStartBefore(nextSibling);
  } else {
    range.selectNodeContents(editor);
    range.collapse(false);
  }
  range.collapse(true);
  setSelectionRange(editor, range);

  dispatchEditorInput(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
  return true;
}

function isCaretAtBlockBoundary(range: Range, body: HTMLElement, direction: 'start' | 'end'): boolean {
  const test = range.cloneRange();
  const compare = document.createRange();
  compare.selectNodeContents(body);
  compare.collapse(direction === 'start');
  return (
    test.startContainer === compare.startContainer &&
    test.startOffset === compare.startOffset &&
    test.endContainer === compare.endContainer &&
    test.endOffset === compare.endOffset
  );
}

function openConditionalDialog(
  editor: HTMLElement,
  options: ResolvedConditionalContentPluginOptions,
  mode: 'insert' | 'edit',
  initialConfig?: ConditionalBlockConfig,
  targetBlock?: HTMLElement,
): void {
  ensureNoActiveDialog();

  const labels = options.labels;
  const savedRange = mode === 'insert' ? getSelectionRangeInEditor(editor) : null;

  const overlay = document.createElement('div');
  overlay.className = DIALOG_OVERLAY_CLASS;
  applyThemeClass(overlay, editor);

  const dialog = document.createElement('section');
  dialog.className = 'rte-conditional-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'rte-conditional-dialog-title');

  const blockConfig = targetBlock ? extractCurrentBlockConfig(targetBlock) : undefined;
  const seed = initialConfig || blockConfig || {};

  const condition = seed.condition ?? options.defaultCondition;
  const audience = seed.audience ?? options.defaultAudience;
  const locale = seed.locale ?? options.defaultLocale;
  const hasElse = seed.hasElse ?? options.enableElseByDefault;

  dialog.innerHTML = `
    <header class="rte-conditional-dialog-header">
      <h2 id="rte-conditional-dialog-title" class="rte-conditional-dialog-title">${escapeHtml(
        mode === 'edit' ? labels.dialogTitleEdit : labels.dialogTitleInsert,
      )}</h2>
      <button type="button" class="rte-conditional-btn" data-action="cancel" aria-label="${escapeHtml(labels.cancelText)}">✕</button>
    </header>
    <div class="rte-conditional-dialog-body">
      <div class="rte-conditional-field">
        <label for="rte-conditional-condition">${escapeHtml(labels.conditionLabel)}</label>
        <input id="rte-conditional-condition" class="rte-conditional-input-condition" type="text" value="${escapeHtml(
          condition || '',
        )}" placeholder="${escapeHtml(labels.conditionPlaceholder)}" />
      </div>
      <div class="rte-conditional-field">
        <label for="rte-conditional-audience">${escapeHtml(labels.audienceLabel)}</label>
        <input id="rte-conditional-audience" class="rte-conditional-input-audience" type="text" value="${escapeHtml(
          toCsv(audience),
        )}" placeholder="${escapeHtml(labels.audiencePlaceholder)}" />
      </div>
      <div class="rte-conditional-field">
        <label for="rte-conditional-locale">${escapeHtml(labels.localeLabel)}</label>
        <input id="rte-conditional-locale" class="rte-conditional-input-locale" type="text" value="${escapeHtml(
          toCsv(locale),
        )}" placeholder="${escapeHtml(labels.localePlaceholder)}" />
      </div>
      <label class="rte-conditional-checkbox">
        <input class="rte-conditional-input-else" type="checkbox" ${hasElse ? 'checked' : ''} />
        <span>${escapeHtml(labels.elseLabel)}</span>
      </label>
      <p class="rte-conditional-help">Example condition: <code>user.role == "admin"</code>, <code>locale == "en-US"</code>, <code>!feature.beta</code></p>
    </div>
    <footer class="rte-conditional-dialog-footer">
      <button type="button" class="rte-conditional-btn" data-action="cancel">${escapeHtml(labels.cancelText)}</button>
      <button type="button" class="rte-conditional-btn rte-conditional-btn-primary" data-action="save">${escapeHtml(labels.saveText)}</button>
    </footer>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const conditionInput = dialog.querySelector<HTMLInputElement>('.rte-conditional-input-condition');
  const audienceInput = dialog.querySelector<HTMLInputElement>('.rte-conditional-input-audience');
  const localeInput = dialog.querySelector<HTMLInputElement>('.rte-conditional-input-locale');
  const elseInput = dialog.querySelector<HTMLInputElement>('.rte-conditional-input-else');

  const closeDialog = () => {
    overlay.removeEventListener('click', onOverlayClick);
    overlay.removeEventListener('keydown', onDialogKeyDown, true);
    document.removeEventListener('keydown', onDocumentEscape, true);
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    activeDialogState = null;
    editor.focus({ preventScroll: true });
    updateFloatingToolbarForEditor(editor);
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
    const nextConfig: ConditionalBlockConfig = {
      condition: conditionInput?.value?.trim() || '',
      audience: parseCsv(audienceInput?.value),
      locale: parseCsv(localeInput?.value),
      hasElse: elseInput?.checked || false,
    };
    const beforeHTML = editor.innerHTML;

    if (targetBlock) {
      applyBlockConfig(targetBlock, nextConfig, labels);
      enforceBlockEditability(targetBlock, previewEnabledByEditor.get(editor) === true);
    } else {
      restoreRangeSafely(editor, savedRange);
      const block = createConditionalBlock(nextConfig, labels);
      try {
        insertBlockAtSelection(editor, block);
      } catch {
        editor.appendChild(block);
        const ifBody = block.querySelector<HTMLElement>('.rte-conditional-body[data-slot="if"]');
        if (ifBody) {
          placeCaretAtEnd(editor, ifBody);
        } else {
          placeCaretAtEnd(editor, block);
        }
      }
    }

    const previewEnabled = previewEnabledByEditor.get(editor) === true;
    if (previewEnabled) {
      await applyPreviewState(editor, options, true);
    }

    dispatchEditorInput(editor);
    recordDomHistoryTransaction(editor, beforeHTML);
    updateFloatingToolbarForEditor(editor);

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
    const target = event.target as HTMLElement;
    const action = target.getAttribute('data-action');

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
  conditionInput?.focus();
}

function isOpenDialogShortcut(event: KeyboardEvent): boolean {
  const hasPrimary = event.metaKey || event.ctrlKey;
  const rawKey = typeof event.key === 'string' ? event.key : '';
  const key = rawKey.toLowerCase();
  const code = typeof event.code === 'string' ? event.code.toLowerCase() : '';
  const modShortcut = hasPrimary && event.altKey && event.shiftKey && (key === 'c' || code === 'keyc');
  const fallbackShortcut = !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && (key === 'f9' || code === 'f9');
  return modShortcut || fallbackShortcut;
}

function isTogglePreviewShortcut(event: KeyboardEvent): boolean {
  const hasPrimary = event.metaKey || event.ctrlKey;
  const rawKey = typeof event.key === 'string' ? event.key : '';
  const key = rawKey.toLowerCase();
  const code = typeof event.code === 'string' ? event.code.toLowerCase() : '';
  const modShortcut = hasPrimary && event.altKey && event.shiftKey && (key === 'p' || code === 'keyp');
  const fallbackShortcut = !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey && (key === 'f10' || code === 'f10');
  return modShortcut || fallbackShortcut;
}

function bindGlobalHandlers(options: ResolvedConditionalContentPluginOptions): void {
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
      normalizeConditionalBlocks(editor, resolvedOptions.labels);
      syncPreviewButtonState(editor, previewEnabledByEditor.get(editor) === true);
      updateFloatingToolbarForEditor(editor);
    };

    document.addEventListener('focusin', globalFocusInHandler, true);
  }

  if (!globalKeydownHandler) {
    globalKeydownHandler = (event: KeyboardEvent) => {
      const overlayOpen = document.querySelector(`.${DIALOG_OVERLAY_CLASS}`);
      if (overlayOpen) return;

      const target = event.target as HTMLElement | null;
      const editableField = !!target?.closest('input, textarea, select');
      if (editableField) return;

      const editorFromTarget = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      const editor = editorFromTarget || resolveEditorFromContext(undefined, false) || lastActiveEditor;
      if (!editor || isEditorReadonly(editor)) return;

      const resolvedOptions = optionsByEditor.get(editor) || fallbackOptions || options;

      const activeElement = document.activeElement as HTMLElement | null;
      const header =
        (target?.closest('.rte-conditional-header') as HTMLElement | null) ||
        (activeElement?.closest('.rte-conditional-header') as HTMLElement | null);
      if (header && (event.key === 'Enter' || event.key === ' ')) {
        const block = header.closest(BLOCK_SELECTOR) as HTMLElement | null;
        if (block && editor.contains(block)) {
          event.preventDefault();
          event.stopPropagation();
          openConditionalDialog(editor, resolvedOptions, 'edit', undefined, block);
          return;
        }
      }

      if (isOpenDialogShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();

        const selected = findSelectedConditionalBlock(editor);
        if (selected) {
          openConditionalDialog(editor, resolvedOptions, 'edit', undefined, selected);
        } else {
          openConditionalDialog(editor, resolvedOptions, 'insert');
        }
        return;
      }

      if (isTogglePreviewShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();

        const nextEnabled = !(previewEnabledByEditor.get(editor) === true);
        void applyPreviewState(editor, resolvedOptions, nextEnabled);
        updateFloatingToolbarForEditor(editor);
        return;
      }

      if ((event.key === 'Backspace' || event.key === 'Delete') && !event.altKey && !event.ctrlKey && !event.metaKey) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        const range = selection.getRangeAt(0);
        if (!range.collapsed || !editor.contains(range.commonAncestorContainer)) return;

        const body = getElementFromNode(range.startContainer)?.closest('.rte-conditional-body') as HTMLElement | null;
        if (!body || !editor.contains(body)) return;

        if (event.key === 'Backspace' && isCaretAtBlockBoundary(range, body, 'start')) {
          event.preventDefault();
          return;
        }

        if (event.key === 'Delete' && isCaretAtBlockBoundary(range, body, 'end')) {
          event.preventDefault();
          return;
        }
      }
    };

    document.addEventListener('keydown', globalKeydownHandler, true);
  }

  if (!globalMouseDownHandler) {
    globalMouseDownHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(`.${FLOATING_TOOLBAR_CLASS}`)) return;

      const editor = target.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) {
        if (lastActiveEditor) hideFloatingToolbar(lastActiveEditor);
        return;
      }

      if (isEditorReadonly(editor)) return;
      lastActiveEditor = editor;

      if (!optionsByEditor.has(editor)) {
        optionsByEditor.set(editor, options);
      }

      const block = target.closest(BLOCK_SELECTOR) as HTMLElement | null;
      if (!block) {
        hideFloatingToolbar(editor);
        return;
      }

      requestAnimationFrame(() => {
        if (!editor.isConnected || !editor.contains(block)) return;
        showFloatingToolbar(editor, block);
      });
    };

    document.addEventListener('mousedown', globalMouseDownHandler, true);
  }

  if (!globalClickHandler) {
    globalClickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(`.${FLOATING_TOOLBAR_CLASS}`)) return;

      const editor = target.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) {
        if (lastActiveEditor) hideFloatingToolbar(lastActiveEditor);
        return;
      }

      if (isEditorReadonly(editor)) return;
      lastActiveEditor = editor;

      if (!optionsByEditor.has(editor)) {
        optionsByEditor.set(editor, options);
      }
      const resolvedOptions = optionsByEditor.get(editor) || options;

      const block = target.closest(BLOCK_SELECTOR) as HTMLElement | null;
      const onHeader = !!target.closest('.rte-conditional-header, .rte-conditional-summary, .rte-conditional-meta, .rte-conditional-else-label');
      if (block && onHeader) {
        event.preventDefault();
        event.stopPropagation();
        openConditionalDialog(editor, resolvedOptions, 'edit', undefined, block);
        showFloatingToolbar(editor, block);
        return;
      }

      if (block) {
        showFloatingToolbar(editor, block);
      } else {
        hideFloatingToolbar(editor);
      }
    };

    document.addEventListener('click', globalClickHandler, true);
  }

  if (!globalSelectionChangeHandler) {
    globalSelectionChangeHandler = () => {
      const editor = resolveEditorFromContext(undefined, false) || lastActiveEditor;
      if (!editor) return;
      if (!editor.isConnected) return;
      updateFloatingToolbarForEditor(editor);
    };
    document.addEventListener('selectionchange', globalSelectionChangeHandler);
  }

  if (!globalInputHandler) {
    globalInputHandler = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;
      const resolvedOptions = optionsByEditor.get(editor) || fallbackOptions || options;
      normalizeConditionalBlocks(editor, resolvedOptions.labels);
      updateFloatingToolbarForEditor(editor);
    };
    document.addEventListener('input', globalInputHandler, true);
  }

  if (!globalScrollResizeHandler) {
    globalScrollResizeHandler = () => {
      refreshFloatingToolbarPosition();
    };
    window.addEventListener('scroll', globalScrollResizeHandler, true);
    window.addEventListener('resize', globalScrollResizeHandler);
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

  if (globalClickHandler) {
    document.removeEventListener('click', globalClickHandler, true);
    globalClickHandler = null;
  }

  if (globalMouseDownHandler) {
    document.removeEventListener('mousedown', globalMouseDownHandler, true);
    globalMouseDownHandler = null;
  }

  if (globalSelectionChangeHandler) {
    document.removeEventListener('selectionchange', globalSelectionChangeHandler);
    globalSelectionChangeHandler = null;
  }

  if (globalInputHandler) {
    document.removeEventListener('input', globalInputHandler, true);
    globalInputHandler = null;
  }

  if (globalScrollResizeHandler) {
    window.removeEventListener('scroll', globalScrollResizeHandler, true);
    window.removeEventListener('resize', globalScrollResizeHandler);
    globalScrollResizeHandler = null;
  }

  floatingToolbarByEditor.forEach((toolbar) => {
    toolbar.remove();
  });
  floatingToolbarByEditor.clear();
  floatingToolbarBlockByEditor.clear();

  fallbackOptions = null;
  lastActiveEditor = null;
}

export const ConditionalContentPlugin = (rawOptions: ConditionalContentPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  ensureStylesInjected();

  return {
    name: 'conditionalContent',

    toolbar: [
      {
        id: 'conditionalContentGroup',
        label: 'Conditional Content',
        type: 'group',
        command: 'conditionalContent',
        items: [
          {
            id: 'conditionalContent',
            label: 'Conditional Rule',
            command: 'openConditionalDialog',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M6 5h12a1 1 0 0 1 1 1v3h-2V7H7v3H5V6a1 1 0 0 1 1-1Zm-1 9h2v3h10v-3h2v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4Zm3-2a1 1 0 0 1 1-1h2.6l1.8-2.4a1 1 0 1 1 1.6 1.2L13.8 11H15a1 1 0 1 1 0 2h-2.7l-1.9 2.5a1 1 0 1 1-1.6-1.2L10.1 13H9a1 1 0 0 1-1-1Z" fill="currentColor"></path></svg>',
            shortcut: 'Mod-Alt-Shift-c',
          },
          {
            id: 'conditionalPreview',
            label: 'Conditional Preview',
            command: 'toggleConditionalPreview',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4 6h16a1 1 0 0 1 1 1v3h-2V8H5v8h14v-2h2v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm5 3h2v2H9V9Zm0 4h2v2H9v-2Zm4-4h6v2h-6V9Zm0 4h6v2h-6v-2Z" fill="currentColor"></path></svg>',
            shortcut: 'Mod-Alt-Shift-p',
          },
        ],
      },
    ],

    commands: {
      conditionalContent: (args?: ConditionalContentDialogArgs, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        lastActiveEditor = editor;
        optionsByEditor.set(editor, options);
        normalizeConditionalBlocks(editor, options.labels);

        const explicitTarget = args?.target;
        if (explicitTarget === 'insert') {
          openConditionalDialog(editor, options, 'insert', args);
          return true;
        }

        const selected = findSelectedConditionalBlock(editor);
        if (explicitTarget === 'edit' || selected) {
          if (!selected && explicitTarget === 'edit') return false;
          openConditionalDialog(editor, options, 'edit', args, selected || undefined);
          return true;
        }

        openConditionalDialog(editor, options, 'insert', args);
        return true;
      },

      openConditionalDialog: (args?: ConditionalContentDialogArgs, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        lastActiveEditor = editor;
        optionsByEditor.set(editor, options);
        normalizeConditionalBlocks(editor, options.labels);

        const explicitTarget = args?.target;
        if (explicitTarget === 'insert') {
          openConditionalDialog(editor, options, 'insert', args);
          return true;
        }

        const selected = findSelectedConditionalBlock(editor);
        if (explicitTarget === 'edit' || selected) {
          if (!selected && explicitTarget === 'edit') return false;
          openConditionalDialog(editor, options, 'edit', args, selected || undefined);
          return true;
        }

        openConditionalDialog(editor, options, 'insert', args);
        return true;
      },

      conditionalPreview: async (
        value?: boolean,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        lastActiveEditor = editor;
        optionsByEditor.set(editor, options);

        const nextEnabled = typeof value === 'boolean' ? value : !(previewEnabledByEditor.get(editor) === true);
        await applyPreviewState(editor, options, nextEnabled);
        updateFloatingToolbarForEditor(editor);
        return true;
      },

      editConditionalBlock: (args?: ConditionalBlockConfig, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        lastActiveEditor = editor;
        optionsByEditor.set(editor, options);

        const selected = findSelectedConditionalBlock(editor);
        if (!selected) return false;

        openConditionalDialog(editor, options, 'edit', args, selected);
        return true;
      },

      deleteConditionalBlock: (_args?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        const selected = findSelectedConditionalBlock(editor);
        if (!selected) return false;
        const removed = removeConditionalBlock(editor, selected);
        if (removed) {
          updateFloatingToolbarForEditor(editor);
        }
        return removed;
      },

      insertConditionalBlock: (args?: ConditionalBlockConfig, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor || isEditorReadonly(editor)) return false;

        lastActiveEditor = editor;
        optionsByEditor.set(editor, options);

        const config: ConditionalBlockConfig = {
          condition: args?.condition ?? options.defaultCondition,
          audience: args?.audience ?? options.defaultAudience,
          locale: args?.locale ?? options.defaultLocale,
          hasElse: args?.hasElse ?? options.enableElseByDefault,
        };

        const block = createConditionalBlock(config, options.labels);
        insertBlockAtSelection(editor, block);

        const previewEnabled = previewEnabledByEditor.get(editor) === true;
        if (previewEnabled) {
          void applyPreviewState(editor, options, true);
        }

        return true;
      },

      toggleConditionalPreview: async (
        value?: boolean,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        lastActiveEditor = editor;
        optionsByEditor.set(editor, options);

        const nextEnabled = typeof value === 'boolean' ? value : !(previewEnabledByEditor.get(editor) === true);
        await applyPreviewState(editor, options, nextEnabled);
        return true;
      },

      setConditionalContext: (value?: Record<string, unknown>, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        lastActiveEditor = editor;

        if (!value || typeof value !== 'object') {
          overrideContextByEditor.delete(editor);
        } else {
          overrideContextByEditor.set(editor, value);
        }

        const previewEnabled = previewEnabledByEditor.get(editor) === true;
        if (previewEnabled) {
          void applyPreviewState(editor, options, true);
        }

        return true;
      },
    },

    keymap: {
      'Mod-Alt-Shift-c': 'openConditionalDialog',
      'Mod-Alt-Shift-C': 'openConditionalDialog',
      'Mod-Alt-Shift-p': 'toggleConditionalPreview',
      'Mod-Alt-Shift-P': 'toggleConditionalPreview',
      F9: 'openConditionalDialog',
      F10: 'toggleConditionalPreview',
    },

    init: () => {
      pluginInstanceCount += 1;
      bindGlobalHandlers(options);
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
