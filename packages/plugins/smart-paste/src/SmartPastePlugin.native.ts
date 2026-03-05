import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_HOST_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';
const STYLE_ID = 'rte-smart-paste-styles';
const PANEL_CLASS = 'rte-smart-paste-panel';
const TOOLBAR_GROUP_CLASS = 'smart-paste';
const LEGACY_TOOLBAR_GROUP_CLASS = 'smartPaste';
const DARK_THEME_SELECTOR = ':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';
const SHOW_COMMENT_NODE_FILTER = typeof NodeFilter !== 'undefined' ? NodeFilter.SHOW_COMMENT : 128;
const SMART_PASTE_HANDLED_KEY = '__editoraSmartPasteHandled';

const BLOCKED_TAGS = new Set([
  'script',
  'style',
  'meta',
  'link',
  'object',
  'embed',
  'iframe',
  'svg',
  'canvas',
  'math',
  'form',
  'input',
  'button',
  'textarea',
  'select',
  'option',
]);

const TABLE_TAGS = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'colgroup', 'col']);
const SEMANTIC_INLINE_TAGS = new Set(['span', 'font']);
const SAFE_URL_PROTOCOL = /^(https?:|mailto:|tel:|#|\/)/i;
const SAFE_DATA_IMAGE = /^data:image\/(?:png|gif|jpeg|jpg|webp);base64,/i;
const SAFE_STYLE_PROP = new Set([
  'color',
  'background-color',
  'font-weight',
  'font-style',
  'text-decoration',
  'text-align',
  'font-size',
  'font-family',
  'line-height',
  'letter-spacing',
  'word-spacing',
  'white-space',
  'vertical-align',
  'margin-left',
  'margin-right',
  'margin-top',
  'margin-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'padding-bottom',
  'text-indent',
  'border',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-color',
  'border-width',
  'border-style',
  'list-style-type',
]);

export type SmartPasteProfile = 'fidelity' | 'balanced' | 'plain';
export type SmartPasteSource = 'word' | 'google-docs' | 'html' | 'plain';

export interface SmartPasteLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  enabledText?: string;
  disabledText?: string;
  toggleOnText?: string;
  toggleOffText?: string;
  cycleProfileText?: string;
  profileLabel?: string;
  fidelityText?: string;
  balancedText?: string;
  plainText?: string;
  lastPasteHeading?: string;
  lastPasteEmptyText?: string;
  lastPasteSourceLabel?: string;
  lastPasteProfileLabel?: string;
  lastPasteRemovedLabel?: string;
  lastPasteCharsLabel?: string;
  closeText?: string;
  shortcutText?: string;
  readonlyMessage?: string;
}

export interface SmartPasteProfileOptions {
  keepStyles?: boolean;
  keepClasses?: boolean;
  keepDataAttributes?: boolean;
  preserveTables?: boolean;
}

export interface SmartPastePluginOptions {
  enabled?: boolean;
  defaultProfile?: SmartPasteProfile;
  maxHtmlLength?: number;
  removeComments?: boolean;
  normalizeWhitespace?: boolean;
  profileOptions?: Partial<Record<SmartPasteProfile, SmartPasteProfileOptions>>;
  labels?: SmartPasteLabels;
  normalizeText?: (value: string) => string;
}

interface ResolvedSmartPasteProfileOptions {
  keepStyles: boolean;
  keepClasses: boolean;
  keepDataAttributes: boolean;
  preserveTables: boolean;
}

interface ResolvedSmartPasteOptions {
  enabled: boolean;
  defaultProfile: SmartPasteProfile;
  maxHtmlLength: number;
  removeComments: boolean;
  normalizeWhitespace: boolean;
  labels: Required<SmartPasteLabels>;
  normalizeText: (value: string) => string;
  profileOptions: Record<SmartPasteProfile, ResolvedSmartPasteProfileOptions>;
}

export interface SmartPasteReport {
  source: SmartPasteSource;
  profile: SmartPasteProfile;
  inputHtmlLength: number;
  outputHtmlLength: number;
  outputTextLength: number;
  removedElements: number;
  removedAttributes: number;
  removedComments: number;
  normalizedStyles: number;
  createdAt: string;
}

interface SmartPasteRuntimeState {
  enabled: boolean;
  profile: SmartPasteProfile;
  lastReport: SmartPasteReport | null;
}

interface SanitizeCounters {
  removedElements: number;
  removedAttributes: number;
  removedComments: number;
  normalizedStyles: number;
}

interface ProcessedPasteResult {
  mode: 'html' | 'text';
  value: string;
  report: SmartPasteReport;
}

const defaultLabels: Required<SmartPasteLabels> = {
  panelTitle: 'Smart Paste',
  panelAriaLabel: 'Smart paste panel',
  enabledText: 'Smart paste is enabled',
  disabledText: 'Smart paste is disabled',
  toggleOnText: 'Disable Smart Paste',
  toggleOffText: 'Enable Smart Paste',
  cycleProfileText: 'Cycle Profile',
  profileLabel: 'Profile',
  fidelityText: 'Fidelity',
  balancedText: 'Balanced',
  plainText: 'Plain Text',
  lastPasteHeading: 'Last Paste Result',
  lastPasteEmptyText: 'Paste content to see cleanup metrics.',
  lastPasteSourceLabel: 'Source',
  lastPasteProfileLabel: 'Profile',
  lastPasteRemovedLabel: 'Removed',
  lastPasteCharsLabel: 'Output Chars',
  closeText: 'Close',
  shortcutText: 'Shortcuts: Ctrl/Cmd+Alt+Shift+S/V/G',
  readonlyMessage: 'Editor is read-only. Smart paste was skipped.',
};

const defaultProfileOptions: Record<SmartPasteProfile, ResolvedSmartPasteProfileOptions> = {
  fidelity: {
    keepStyles: true,
    keepClasses: false,
    keepDataAttributes: false,
    preserveTables: true,
  },
  balanced: {
    keepStyles: false,
    keepClasses: false,
    keepDataAttributes: false,
    preserveTables: true,
  },
  plain: {
    keepStyles: false,
    keepClasses: false,
    keepDataAttributes: false,
    preserveTables: false,
  },
};

const optionsByEditor = new WeakMap<HTMLElement, ResolvedSmartPasteOptions>();
const stateByEditor = new WeakMap<HTMLElement, SmartPasteRuntimeState>();
const panelByEditor = new Map<HTMLElement, HTMLElement>();
const panelVisibleByEditor = new WeakMap<HTMLElement, boolean>();
const pasteHandlerByEditor = new WeakMap<HTMLElement, (event: ClipboardEvent) => void>();
const trackedEditors = new Set<HTMLElement>();

let pluginInstanceCount = 0;
let panelSequence = 0;
let fallbackOptions: ResolvedSmartPasteOptions | null = null;
let lastActiveEditor: HTMLElement | null = null;

let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let globalKeydownHandler: ((event: KeyboardEvent) => void) | null = null;
let globalViewportHandler: (() => void) | null = null;
let globalMutationObserver: MutationObserver | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function defaultNormalizeText(value: string): string {
  return value.replace(/\u00A0/g, ' ').replace(/\r\n?/g, '\n');
}

function normalizeProfile(value: unknown): SmartPasteProfile {
  if (value === 'balanced' || value === 'plain') return value;
  return 'fidelity';
}

function normalizeProfileOptions(
  raw: SmartPasteProfileOptions | undefined,
  fallback: ResolvedSmartPasteProfileOptions,
): ResolvedSmartPasteProfileOptions {
  return {
    keepStyles: raw?.keepStyles ?? fallback.keepStyles,
    keepClasses: raw?.keepClasses ?? fallback.keepClasses,
    keepDataAttributes: raw?.keepDataAttributes ?? fallback.keepDataAttributes,
    preserveTables: raw?.preserveTables ?? fallback.preserveTables,
  };
}

function normalizeOptions(raw: SmartPastePluginOptions = {}): ResolvedSmartPasteOptions {
  const profileOptions = raw.profileOptions || {};

  return {
    enabled: raw.enabled !== false,
    defaultProfile: normalizeProfile(raw.defaultProfile),
    maxHtmlLength: Math.max(8_000, Math.min(800_000, Number(raw.maxHtmlLength ?? 220_000))),
    removeComments: raw.removeComments !== false,
    normalizeWhitespace: raw.normalizeWhitespace !== false,
    labels: {
      ...defaultLabels,
      ...(raw.labels || {}),
    },
    normalizeText: raw.normalizeText || defaultNormalizeText,
    profileOptions: {
      fidelity: normalizeProfileOptions(profileOptions.fidelity, defaultProfileOptions.fidelity),
      balanced: normalizeProfileOptions(profileOptions.balanced, defaultProfileOptions.balanced),
      plain: normalizeProfileOptions(profileOptions.plain, defaultProfileOptions.plain),
    },
  };
}

function toRawOptions(options: ResolvedSmartPasteOptions): SmartPastePluginOptions {
  return {
    enabled: options.enabled,
    defaultProfile: options.defaultProfile,
    maxHtmlLength: options.maxHtmlLength,
    removeComments: options.removeComments,
    normalizeWhitespace: options.normalizeWhitespace,
    labels: { ...options.labels },
    normalizeText: options.normalizeText,
    profileOptions: {
      fidelity: { ...options.profileOptions.fidelity },
      balanced: { ...options.profileOptions.balanced },
      plain: { ...options.profileOptions.plain },
    },
  };
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const root = editor.closest(EDITOR_HOST_SELECTOR);
  return (root as HTMLElement) || editor;
}

function resolveContentFromHost(host: Element | null): HTMLElement | null {
  if (!host) return null;
  if (host.matches(EDITOR_CONTENT_SELECTOR)) return host as HTMLElement;
  const content = host.querySelector(EDITOR_CONTENT_SELECTOR);
  return content instanceof HTMLElement ? content : null;
}

function consumeCommandEditorContext(): HTMLElement | null {
  if (typeof window === 'undefined') return null;
  const explicitContext = (window as any)[COMMAND_EDITOR_CONTEXT_KEY] as HTMLElement | null | undefined;
  if (!(explicitContext instanceof HTMLElement)) return null;
  (window as any)[COMMAND_EDITOR_CONTEXT_KEY] = null;

  const direct = resolveContentFromHost(explicitContext);
  if (direct) return direct;

  const host = explicitContext.closest(EDITOR_HOST_SELECTOR);
  if (host) {
    const content = resolveContentFromHost(host);
    if (content) return content;
  }

  const nearestEditable = explicitContext.closest(EDITOR_CONTENT_SELECTOR);
  return nearestEditable instanceof HTMLElement ? nearestEditable : null;
}

function resolveToolbarScopeRoot(editor: HTMLElement): HTMLElement {
  const dataHost = editor.closest('[data-editora-editor]') as HTMLElement | null;
  if (dataHost && resolveContentFromHost(dataHost) === editor) {
    return dataHost;
  }

  let current: HTMLElement | null = editor;
  while (current) {
    if (current.matches(EDITOR_HOST_SELECTOR)) {
      if (current === editor || resolveContentFromHost(current) === editor) {
        return current;
      }
    }
    current = current.parentElement;
  }

  return resolveEditorRoot(editor);
}

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function resolveEditorFromContext(
  context?: { editorElement?: unknown; contentElement?: unknown },
  allowFirstMatch = true,
  allowLastActive = true,
): HTMLElement | null {
  pruneDisconnectedEditors();

  if (context?.contentElement instanceof HTMLElement) return context.contentElement;

  if (context?.editorElement instanceof HTMLElement) {
    const content = resolveContentFromHost(context.editorElement);
    if (content) return content;
  }

  const explicitContext = consumeCommandEditorContext();
  if (explicitContext) return explicitContext;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const element = getElementFromNode(selection.getRangeAt(0).startContainer);
    const content = element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    if (active.matches(EDITOR_CONTENT_SELECTOR)) return active;
    const content = active.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (content) return content;
  }

  if (allowLastActive) {
    if (lastActiveEditor && lastActiveEditor.isConnected) return lastActiveEditor;
    if (lastActiveEditor && !lastActiveEditor.isConnected) lastActiveEditor = null;
  }

  if (!allowFirstMatch) return null;
  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function resolveEditorFromKeyboardEvent(event: KeyboardEvent): HTMLElement | null {
  const target = event.target as HTMLElement | null;
  if (target) {
    const fromTarget = target.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (fromTarget) return fromTarget;
  }

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const element = getElementFromNode(selection.getRangeAt(0).startContainer);
    const fromSelection = element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (fromSelection) return fromSelection;
  }

  return null;
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

function applyThemeClass(target: HTMLElement, editor: HTMLElement): void {
  target.classList.remove('rte-smart-paste-theme-dark');
  if (shouldUseDarkTheme(editor)) {
    target.classList.add('rte-smart-paste-theme-dark');
  }
}

function isEditorReadonly(editor: HTMLElement): boolean {
  return editor.getAttribute('contenteditable') === 'false' || editor.getAttribute('data-readonly') === 'true';
}

function setCommandButtonActiveState(editor: HTMLElement, command: string, active: boolean): void {
  const root = resolveToolbarScopeRoot(editor);
  const buttons = Array.from(
    root.querySelectorAll(
      `.rte-toolbar-button[data-command="${command}"], .editora-toolbar-button[data-command="${command}"]`,
    ),
  ) as HTMLElement[];

  buttons.forEach((button) => {
    button.classList.toggle('active', active);
    button.setAttribute('data-active', active ? 'true' : 'false');
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function ensureEditorState(editor: HTMLElement, options: ResolvedSmartPasteOptions): SmartPasteRuntimeState {
  if (!optionsByEditor.has(editor)) {
    optionsByEditor.set(editor, options);
  }

  let state = stateByEditor.get(editor);
  if (!state) {
    state = {
      enabled: options.enabled,
      profile: options.defaultProfile,
      lastReport: null,
    };
    stateByEditor.set(editor, state);
  }

  attachEditorPasteHandler(editor);
  trackedEditors.add(editor);
  return state;
}

function detachEditorPasteHandler(editor: HTMLElement): void {
  const handler = pasteHandlerByEditor.get(editor);
  if (!handler) return;

  editor.removeEventListener('paste', handler as EventListener, true);
  pasteHandlerByEditor.delete(editor);
}

function cleanupEditorState(editor: HTMLElement): void {
  detachEditorPasteHandler(editor);

  panelByEditor.get(editor)?.remove();
  panelByEditor.delete(editor);
  panelVisibleByEditor.delete(editor);
  optionsByEditor.delete(editor);
  stateByEditor.delete(editor);
  trackedEditors.delete(editor);

  if (lastActiveEditor === editor) {
    lastActiveEditor = null;
  }
}

function pruneDisconnectedEditors(): void {
  const editors = Array.from(trackedEditors);
  editors.forEach((editor) => {
    if (editor.isConnected) return;
    cleanupEditorState(editor);
  });
}

function mutationTouchesEditorRemoval(records: MutationRecord[]): boolean {
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (record.type !== 'childList' || record.removedNodes.length === 0) continue;

    for (let nodeIndex = 0; nodeIndex < record.removedNodes.length; nodeIndex += 1) {
      const node = record.removedNodes[nodeIndex];
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      const element = node as Element;
      if (
        element.matches?.(EDITOR_CONTENT_SELECTOR) ||
        element.matches?.(`.${PANEL_CLASS}`) ||
        element.querySelector?.(EDITOR_CONTENT_SELECTOR) ||
        element.querySelector?.(`.${PANEL_CLASS}`)
      ) {
        return true;
      }
    }
  }

  return false;
}

function isPanelVisible(editor: HTMLElement): boolean {
  return panelVisibleByEditor.get(editor) === true;
}

function setPanelLiveMessage(panel: HTMLElement, message: string): void {
  const live = panel.querySelector<HTMLElement>('.rte-smart-paste-live');
  if (live) live.textContent = message;
}

function normalizePlainText(
  value: string,
  options: ResolvedSmartPasteOptions,
): string {
  const base = options.normalizeText(value);
  if (!options.normalizeWhitespace) return base;

  const collapsed = base
    .split('\n')
    .map((line) => line.replace(/[\t ]+/g, ' ').trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n');

  return collapsed.trim();
}

function isWordLikeHTML(html: string): boolean {
  return /class=["'][^"']*Mso|xmlns:w=|urn:schemas-microsoft-com:office|<o:p\b/i.test(html);
}

function isGoogleDocsHTML(html: string): boolean {
  return /id=["']docs-internal-guid|docs-\w+|data-sheets-value|data-sheets-userformat/i.test(html);
}

function detectSource(html: string, plainText: string): SmartPasteSource {
  if (!html) return plainText ? 'plain' : 'html';
  if (isWordLikeHTML(html)) return 'word';
  if (isGoogleDocsHTML(html)) return 'google-docs';
  return 'html';
}

function sanitizeClassValue(value: string): string {
  const tokens = value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => !/^mso/i.test(token))
    .filter((token) => !/^docs-/i.test(token))
    .filter((token) => !/^c\d+$/i.test(token));

  return tokens.join(' ');
}

function sanitizeStyleValue(value: string): { value: string; changed: boolean } {
  if (!value) return { value: '', changed: false };

  const declarations = value.split(';');
  const safe: string[] = [];
  let changed = false;

  declarations.forEach((declaration) => {
    const separator = declaration.indexOf(':');
    if (separator <= 0) {
      if (declaration.trim()) changed = true;
      return;
    }

    const property = declaration.slice(0, separator).trim().toLowerCase();
    const cssValue = declaration.slice(separator + 1).trim();
    if (!property || !cssValue) {
      changed = true;
      return;
    }

    if (!SAFE_STYLE_PROP.has(property)) {
      changed = true;
      return;
    }

    if (/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(cssValue)) {
      changed = true;
      return;
    }

    safe.push(`${property}: ${cssValue}`);
  });

  return {
    value: safe.join('; '),
    changed,
  };
}

function sanitizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (SAFE_URL_PROTOCOL.test(trimmed)) return trimmed;
  if (SAFE_DATA_IMAGE.test(trimmed)) return trimmed;
  return '';
}

function unwrapElement(element: HTMLElement): void {
  const parent = element.parentNode;
  if (!parent) return;

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  parent.removeChild(element);
}

function sanitizeHTMLElement(
  element: HTMLElement,
  profileOptions: ResolvedSmartPasteProfileOptions,
  source: SmartPasteSource,
  counters: SanitizeCounters,
): void {
  const tag = element.tagName.toLowerCase();

  if (BLOCKED_TAGS.has(tag)) {
    counters.removedElements += 1;
    element.remove();
    return;
  }

  if (!profileOptions.preserveTables && TABLE_TAGS.has(tag)) {
    const text = element.textContent || '';
    const replacement = document.createTextNode(text);
    element.replaceWith(replacement);
    counters.removedElements += 1;
    return;
  }

  const attributes = Array.from(element.attributes);
  attributes.forEach((attribute) => {
    const name = attribute.name.toLowerCase();
    const value = attribute.value;

    if (name.startsWith('on')) {
      element.removeAttribute(attribute.name);
      counters.removedAttributes += 1;
      return;
    }

    if (name === 'style') {
      if (!profileOptions.keepStyles) {
        element.removeAttribute(attribute.name);
        counters.removedAttributes += 1;
        return;
      }

      const nextStyle = sanitizeStyleValue(value);
      if (!nextStyle.value) {
        element.removeAttribute(attribute.name);
        counters.removedAttributes += 1;
        if (nextStyle.changed) counters.normalizedStyles += 1;
        return;
      }

      if (nextStyle.changed || nextStyle.value !== value) {
        element.setAttribute('style', nextStyle.value);
        counters.normalizedStyles += 1;
      }
      return;
    }

    if (name === 'class') {
      if (!profileOptions.keepClasses) {
        element.removeAttribute(attribute.name);
        counters.removedAttributes += 1;
        return;
      }

      const next = sanitizeClassValue(value);
      if (!next) {
        element.removeAttribute(attribute.name);
        counters.removedAttributes += 1;
        return;
      }

      if (next !== value) {
        element.setAttribute('class', next);
        counters.removedAttributes += 1;
      }
      return;
    }

    if (name.startsWith('data-') && !profileOptions.keepDataAttributes) {
      element.removeAttribute(attribute.name);
      counters.removedAttributes += 1;
      return;
    }

    if (name === 'id' || name === 'xmlns' || name.startsWith('xml')) {
      element.removeAttribute(attribute.name);
      counters.removedAttributes += 1;
      return;
    }

    if ((source === 'word' || source === 'google-docs') && (name === 'lang' || name === 'dir')) {
      element.removeAttribute(attribute.name);
      counters.removedAttributes += 1;
      return;
    }

    if (name === 'href' || name === 'src' || name === 'xlink:href') {
      const sanitizedUrl = sanitizeUrl(value);
      if (!sanitizedUrl) {
        element.removeAttribute(attribute.name);
        counters.removedAttributes += 1;
        return;
      }

      if (sanitizedUrl !== value) {
        element.setAttribute(attribute.name, sanitizedUrl);
      }
    }
  });

  if (tag === 'a') {
    const href = element.getAttribute('href');
    if (!href) {
      unwrapElement(element);
      counters.removedElements += 1;
      return;
    }

    const target = element.getAttribute('target');
    if (target === '_blank') {
      element.setAttribute('rel', 'noopener noreferrer');
    }
  }

  if (tag === 'img') {
    const src = element.getAttribute('src');
    if (!src || !sanitizeUrl(src)) {
      counters.removedElements += 1;
      element.remove();
      return;
    }
  }

  if (SEMANTIC_INLINE_TAGS.has(tag) && !element.attributes.length && !element.className && !element.style.cssText) {
    const hasElementChildren = element.children.length > 0;
    const hasText = (element.textContent || '').trim().length > 0;
    if (!hasElementChildren && !hasText) {
      element.remove();
      counters.removedElements += 1;
      return;
    }

    if (!hasElementChildren && hasText) {
      unwrapElement(element);
      counters.removedElements += 1;
    }
  }
}

function sanitizeHTML(
  html: string,
  profileOptions: ResolvedSmartPasteProfileOptions,
  source: SmartPasteSource,
  options: ResolvedSmartPasteOptions,
  profile: SmartPasteProfile,
): { html: string; textLength: number; counters: SanitizeCounters } {
  const template = document.createElement('template');
  template.innerHTML = html;

  const counters: SanitizeCounters = {
    removedElements: 0,
    removedAttributes: 0,
    removedComments: 0,
    normalizedStyles: 0,
  };

  if (options.removeComments) {
    try {
      const walker = document.createTreeWalker(template.content, SHOW_COMMENT_NODE_FILTER, null);
      const comments: Comment[] = [];
      let current = walker.nextNode();
      while (current) {
        comments.push(current as Comment);
        current = walker.nextNode();
      }

      comments.forEach((comment) => {
        comment.remove();
        counters.removedComments += 1;
      });
    } catch {
      // Some non-browser environments may not support comment walkers.
    }
  }

  const elements = Array.from(template.content.querySelectorAll('*')) as HTMLElement[];
  elements.forEach((element) => {
    if (!element.isConnected) return;
    sanitizeHTMLElement(element, profileOptions, source, counters);
  });

  let outputHTML = template.innerHTML;
  if (options.normalizeWhitespace && profile !== 'fidelity') {
    outputHTML = outputHTML.replace(/\s{2,}/g, ' ').replace(/>\s+</g, '><').trim();
  } else if (options.normalizeWhitespace) {
    outputHTML = outputHTML.trim();
  }

  const textLength = (template.content.textContent || '').trim().length;
  return {
    html: outputHTML,
    textLength,
    counters,
  };
}

function getSelectionRangeInEditor(editor: HTMLElement): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return null;
  return range;
}

function setSelectionRange(editor: HTMLElement, range: Range): void {
  if (!editor.isConnected) return;
  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

function insertHTMLAtSelection(editor: HTMLElement, html: string): boolean {
  editor.focus({ preventScroll: true });

  try {
    if (document.execCommand('insertHTML', false, html)) {
      return true;
    }
  } catch {
    // Fallback below.
  }

  const range = getSelectionRangeInEditor(editor);
  if (!range) return false;

  range.deleteContents();
  const template = document.createElement('template');
  template.innerHTML = html;
  const fragment = template.content;
  const lastNode = fragment.lastChild;
  range.insertNode(fragment);

  if (lastNode) {
    const next = document.createRange();
    next.setStartAfter(lastNode);
    next.collapse(true);
    setSelectionRange(editor, next);
  }

  return true;
}

function insertTextAtSelection(editor: HTMLElement, text: string): boolean {
  editor.focus({ preventScroll: true });

  try {
    if (document.execCommand('insertText', false, text)) {
      return true;
    }
  } catch {
    // Fallback below.
  }

  const range = getSelectionRangeInEditor(editor);
  if (!range) return false;

  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  const next = document.createRange();
  next.setStart(node, node.length);
  next.collapse(true);
  setSelectionRange(editor, next);
  return true;
}

function recordDomHistoryTransaction(editor: HTMLElement, beforeHTML: string): void {
  if (beforeHTML === editor.innerHTML) return;

  const executor = (window as any).execEditorCommand || (window as any).executeEditorCommand;
  if (typeof executor !== 'function') return;

  try {
    executor('recordDomTransaction', editor, beforeHTML, editor.innerHTML);
  } catch {
    // History plugin may not be installed.
  }
}

function dispatchEditorInput(editor: HTMLElement): void {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function createReport(
  source: SmartPasteSource,
  profile: SmartPasteProfile,
  inputHtmlLength: number,
  outputHtmlLength: number,
  outputTextLength: number,
  counters: SanitizeCounters,
): SmartPasteReport {
  return {
    source,
    profile,
    inputHtmlLength,
    outputHtmlLength,
    outputTextLength,
    removedElements: counters.removedElements,
    removedAttributes: counters.removedAttributes,
    removedComments: counters.removedComments,
    normalizedStyles: counters.normalizedStyles,
    createdAt: new Date().toISOString(),
  };
}

function processClipboardContent(
  html: string,
  plainText: string,
  profile: SmartPasteProfile,
  options: ResolvedSmartPasteOptions,
): ProcessedPasteResult {
  const source = detectSource(html, plainText);

  if (profile === 'plain') {
    const fallbackText = plainText || html.replace(/<[^>]*>/g, ' ');
    const output = normalizePlainText(fallbackText, options);
    return {
      mode: 'text',
      value: output,
      report: createReport(
        source,
        profile,
        html.length,
        0,
        output.length,
        {
          removedElements: 0,
          removedAttributes: 0,
          removedComments: 0,
          normalizedStyles: 0,
        },
      ),
    };
  }

  if (!html || html.length > options.maxHtmlLength) {
    const fallbackText = normalizePlainText(plainText || html.replace(/<[^>]*>/g, ' '), options);
    return {
      mode: 'text',
      value: fallbackText,
      report: createReport(
        source,
        profile,
        html.length,
        0,
        fallbackText.length,
        {
          removedElements: 0,
          removedAttributes: 0,
          removedComments: 0,
          normalizedStyles: 0,
        },
      ),
    };
  }

  const profileOptions = options.profileOptions[profile];
  const sanitized = sanitizeHTML(html, profileOptions, source, options, profile);

  if (!sanitized.html) {
    const fallbackText = normalizePlainText(plainText || html.replace(/<[^>]*>/g, ' '), options);
    return {
      mode: 'text',
      value: fallbackText,
      report: createReport(source, profile, html.length, 0, fallbackText.length, sanitized.counters),
    };
  }

  return {
    mode: 'html',
    value: sanitized.html,
    report: createReport(
      source,
      profile,
      html.length,
      sanitized.html.length,
      sanitized.textLength,
      sanitized.counters,
    ),
  };
}

function getProfileLabel(profile: SmartPasteProfile, labels: Required<SmartPasteLabels>): string {
  if (profile === 'balanced') return labels.balancedText;
  if (profile === 'plain') return labels.plainText;
  return labels.fidelityText;
}

function cycleProfile(profile: SmartPasteProfile): SmartPasteProfile {
  if (profile === 'fidelity') return 'balanced';
  if (profile === 'balanced') return 'plain';
  return 'fidelity';
}

function applyPanelLabels(panel: HTMLElement, options: ResolvedSmartPasteOptions): void {
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);

  const title = panel.querySelector<HTMLElement>('.rte-smart-paste-title');
  if (title) title.textContent = options.labels.panelTitle;

  const close = panel.querySelector<HTMLButtonElement>('[data-action="close"]');
  if (close) close.setAttribute('aria-label', options.labels.closeText);

  const toggle = panel.querySelector<HTMLButtonElement>('[data-action="toggle-enabled"]');
  if (toggle) {
    const enabled = toggle.getAttribute('data-enabled') === 'true';
    toggle.textContent = enabled ? options.labels.toggleOnText : options.labels.toggleOffText;
  }

  const cycle = panel.querySelector<HTMLButtonElement>('[data-action="cycle-profile"]');
  if (cycle) cycle.textContent = options.labels.cycleProfileText;

  const profileHeading = panel.querySelector<HTMLElement>('.rte-smart-paste-profile-heading');
  if (profileHeading) profileHeading.textContent = options.labels.profileLabel;
  const profileGroup = panel.querySelector<HTMLElement>('.rte-smart-paste-profile[role="group"]');
  if (profileGroup) profileGroup.setAttribute('aria-label', options.labels.profileLabel);

  const fidelity = panel.querySelector<HTMLButtonElement>('[data-action="set-profile"][data-profile="fidelity"]');
  if (fidelity) fidelity.textContent = options.labels.fidelityText;

  const balanced = panel.querySelector<HTMLButtonElement>('[data-action="set-profile"][data-profile="balanced"]');
  if (balanced) balanced.textContent = options.labels.balancedText;

  const plain = panel.querySelector<HTMLButtonElement>('[data-action="set-profile"][data-profile="plain"]');
  if (plain) plain.textContent = options.labels.plainText;

  const reportTitle = panel.querySelector<HTMLElement>('.rte-smart-paste-report-title');
  if (reportTitle) reportTitle.textContent = options.labels.lastPasteHeading;

  const empty = panel.querySelector<HTMLElement>('.rte-smart-paste-empty');
  if (empty) empty.textContent = options.labels.lastPasteEmptyText;

  const sourceLabel = panel.querySelector<HTMLElement>('[data-key="source-label"]');
  if (sourceLabel) sourceLabel.textContent = options.labels.lastPasteSourceLabel;

  const profileLabel = panel.querySelector<HTMLElement>('[data-key="profile-label"]');
  if (profileLabel) profileLabel.textContent = options.labels.lastPasteProfileLabel;

  const removedLabel = panel.querySelector<HTMLElement>('[data-key="removed-label"]');
  if (removedLabel) removedLabel.textContent = options.labels.lastPasteRemovedLabel;

  const charsLabel = panel.querySelector<HTMLElement>('[data-key="chars-label"]');
  if (charsLabel) charsLabel.textContent = options.labels.lastPasteCharsLabel;

  const shortcut = panel.querySelector<HTMLElement>('.rte-smart-paste-shortcut');
  if (shortcut) shortcut.textContent = options.labels.shortcutText;
}

function refreshPanel(editor: HTMLElement): void {
  const panel = panelByEditor.get(editor);
  const options = optionsByEditor.get(editor) || fallbackOptions;
  const state = stateByEditor.get(editor);
  if (!panel || !options || !state) return;

  applyPanelLabels(panel, options);

  const status = panel.querySelector<HTMLElement>('.rte-smart-paste-status');
  if (status) {
    status.textContent = state.enabled ? options.labels.enabledText : options.labels.disabledText;
  }

  const toggle = panel.querySelector<HTMLButtonElement>('[data-action="toggle-enabled"]');
  if (toggle) {
    toggle.setAttribute('data-enabled', state.enabled ? 'true' : 'false');
    toggle.textContent = state.enabled ? options.labels.toggleOnText : options.labels.toggleOffText;
    toggle.setAttribute('aria-pressed', state.enabled ? 'true' : 'false');
  }

  const profileButtons = Array.from(
    panel.querySelectorAll<HTMLButtonElement>('[data-action="set-profile"][data-profile]'),
  );

  profileButtons.forEach((button) => {
    const profile = normalizeProfile(button.getAttribute('data-profile'));
    const active = profile === state.profile;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const empty = panel.querySelector<HTMLElement>('.rte-smart-paste-empty');
  const report = panel.querySelector<HTMLElement>('.rte-smart-paste-report');
  const sourceValue = panel.querySelector<HTMLElement>('[data-key="source-value"]');
  const profileValue = panel.querySelector<HTMLElement>('[data-key="profile-value"]');
  const removedValue = panel.querySelector<HTMLElement>('[data-key="removed-value"]');
  const charsValue = panel.querySelector<HTMLElement>('[data-key="chars-value"]');

  if (!state.lastReport) {
    if (empty) empty.hidden = false;
    if (report) report.hidden = true;
    return;
  }

  if (empty) empty.hidden = true;
  if (report) report.hidden = false;

  if (sourceValue) sourceValue.textContent = state.lastReport.source;
  if (profileValue) profileValue.textContent = getProfileLabel(state.lastReport.profile, options.labels);
  if (removedValue) {
    const removedTotal =
      state.lastReport.removedElements +
      state.lastReport.removedAttributes +
      state.lastReport.removedComments +
      state.lastReport.normalizedStyles;
    removedValue.textContent = String(removedTotal);
  }
  if (charsValue) charsValue.textContent = String(state.lastReport.outputTextLength);
}

function positionPanel(editor: HTMLElement, panel: HTMLElement): void {
  if (!panel.classList.contains('show')) return;

  const rect = resolveEditorRoot(editor).getBoundingClientRect();
  const panelWidth = Math.min(window.innerWidth - 20, 360);
  const maxLeft = Math.max(10, window.innerWidth - panelWidth - 10);
  const left = Math.min(Math.max(10, rect.right - panelWidth), maxLeft);
  const top = Math.max(10, Math.min(window.innerHeight - 10, rect.top + 12));

  panel.style.width = `${panelWidth}px`;
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.maxHeight = `${Math.max(240, window.innerHeight - 20)}px`;
}

function hidePanel(editor: HTMLElement, focusEditor = false): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  panel.classList.remove('show');
  panelVisibleByEditor.set(editor, false);
  setCommandButtonActiveState(editor, 'toggleSmartPastePanel', false);

  if (focusEditor) {
    editor.focus({ preventScroll: true });
  }
}

function ensurePanel(editor: HTMLElement): HTMLElement {
  const existing = panelByEditor.get(editor);
  if (existing) return existing;

  const options = optionsByEditor.get(editor) || fallbackOptions || normalizeOptions();

  const panelId = `rte-smart-paste-panel-${panelSequence++}`;
  const panel = document.createElement('section');
  panel.className = PANEL_CLASS;
  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);

  panel.innerHTML = `
    <header class="rte-smart-paste-header">
      <h2 class="rte-smart-paste-title">${escapeHtml(options.labels.panelTitle)}</h2>
      <button type="button" class="rte-smart-paste-icon-btn" data-action="close" aria-label="${escapeHtml(options.labels.closeText)}">✕</button>
    </header>
    <div class="rte-smart-paste-body">
      <p class="rte-smart-paste-status"></p>
      <div class="rte-smart-paste-controls">
        <button type="button" class="rte-smart-paste-btn rte-smart-paste-btn-primary" data-action="toggle-enabled" data-enabled="true"></button>
        <button type="button" class="rte-smart-paste-btn" data-action="cycle-profile"></button>
      </div>
      <div class="rte-smart-paste-profile" role="group" aria-label="${escapeHtml(options.labels.profileLabel)}">
        <p class="rte-smart-paste-profile-heading"></p>
        <div class="rte-smart-paste-profile-grid">
          <button type="button" class="rte-smart-paste-chip" data-action="set-profile" data-profile="fidelity" aria-pressed="false"></button>
          <button type="button" class="rte-smart-paste-chip" data-action="set-profile" data-profile="balanced" aria-pressed="false"></button>
          <button type="button" class="rte-smart-paste-chip" data-action="set-profile" data-profile="plain" aria-pressed="false"></button>
        </div>
      </div>
      <section class="rte-smart-paste-metrics" aria-live="polite">
        <h3 class="rte-smart-paste-report-title"></h3>
        <p class="rte-smart-paste-empty"></p>
        <dl class="rte-smart-paste-report" hidden>
          <div class="rte-smart-paste-line"><dt data-key="source-label"></dt><dd data-key="source-value"></dd></div>
          <div class="rte-smart-paste-line"><dt data-key="profile-label"></dt><dd data-key="profile-value"></dd></div>
          <div class="rte-smart-paste-line"><dt data-key="removed-label"></dt><dd data-key="removed-value"></dd></div>
          <div class="rte-smart-paste-line"><dt data-key="chars-label"></dt><dd data-key="chars-value"></dd></div>
        </dl>
      </section>
      <p class="rte-smart-paste-shortcut"></p>
    </div>
    <div class="rte-smart-paste-live" aria-live="polite" aria-atomic="true"></div>
  `;

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const actionEl = target?.closest<HTMLElement>('[data-action]');
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action');
    if (!action) return;

    if (action === 'close') {
      hidePanel(editor, true);
      return;
    }

    if (action === 'toggle-enabled') {
      const state = ensureEditorState(editor, optionsByEditor.get(editor) || options);
      state.enabled = !state.enabled;
      setCommandButtonActiveState(editor, 'toggleSmartPasteEnabled', state.enabled);
      refreshPanel(editor);
      setPanelLiveMessage(panel, state.enabled ? options.labels.enabledText : options.labels.disabledText);
      return;
    }

    if (action === 'cycle-profile') {
      const state = ensureEditorState(editor, optionsByEditor.get(editor) || options);
      state.profile = cycleProfile(state.profile);
      refreshPanel(editor);
      setPanelLiveMessage(panel, `${options.labels.profileLabel}: ${getProfileLabel(state.profile, options.labels)}`);
      return;
    }

    if (action === 'set-profile') {
      const state = ensureEditorState(editor, optionsByEditor.get(editor) || options);
      state.profile = normalizeProfile(actionEl.getAttribute('data-profile'));
      refreshPanel(editor);
      setPanelLiveMessage(panel, `${options.labels.profileLabel}: ${getProfileLabel(state.profile, options.labels)}`);
    }
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      hidePanel(editor, true);
      return;
    }

    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;

    const focusable = Array.from(
      panel.querySelectorAll<HTMLButtonElement>('[data-action="set-profile"][data-profile]'),
    );
    if (focusable.length === 0) return;

    const currentIndex = focusable.findIndex((button) => button === document.activeElement);
    if (currentIndex < 0) return;

    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + delta + focusable.length) % focusable.length;
    event.preventDefault();
    focusable[nextIndex].focus();
  });

  applyThemeClass(panel, editor);
  document.body.appendChild(panel);

  panelByEditor.set(editor, panel);
  panelVisibleByEditor.set(editor, false);

  refreshPanel(editor);
  return panel;
}

function showPanel(editor: HTMLElement): void {
  const panel = ensurePanel(editor);

  panelByEditor.forEach((_panel, currentEditor) => {
    if (currentEditor !== editor) {
      hidePanel(currentEditor, false);
    }
  });

  panel.classList.add('show');
  panelVisibleByEditor.set(editor, true);
  setCommandButtonActiveState(editor, 'toggleSmartPastePanel', true);
  applyThemeClass(panel, editor);
  positionPanel(editor, panel);

  const firstButton = panel.querySelector<HTMLButtonElement>('[data-action="toggle-enabled"]');
  firstButton?.focus();
}

function togglePanel(editor: HTMLElement, explicit?: boolean): boolean {
  const currentlyVisible = isPanelVisible(editor);
  const nextVisible = typeof explicit === 'boolean' ? explicit : !currentlyVisible;

  if (nextVisible) {
    showPanel(editor);
  } else {
    hidePanel(editor, false);
  }

  return true;
}

function getRuntimeStateSnapshot(state: SmartPasteRuntimeState): SmartPasteRuntimeState {
  return {
    enabled: state.enabled,
    profile: state.profile,
    lastReport: state.lastReport ? { ...state.lastReport } : null,
  };
}

function executeSmartPaste(editor: HTMLElement, event: ClipboardEvent): boolean {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return false;

  const state = ensureEditorState(editor, options);
  if (!state.enabled || isEditorReadonly(editor)) {
    const panel = panelByEditor.get(editor);
    if (panel && isEditorReadonly(editor)) {
      setPanelLiveMessage(panel, options.labels.readonlyMessage);
    }
    return false;
  }

  const clipboard = event.clipboardData;
  if (!clipboard) return false;

  const html = clipboard.getData('text/html') || '';
  const text = clipboard.getData('text/plain') || '';
  if (!html && !text) return false;

  const result = processClipboardContent(html, text, state.profile, options);
  if (!result.value) return false;

  const beforeHTML = editor.innerHTML;
  const applied = result.mode === 'html' ? insertHTMLAtSelection(editor, result.value) : insertTextAtSelection(editor, result.value);
  if (!applied) return false;

  state.lastReport = { ...result.report };
  stateByEditor.set(editor, state);

  recordDomHistoryTransaction(editor, beforeHTML);
  dispatchEditorInput(editor);

  editor.dispatchEvent(
    new CustomEvent('editora:smart-paste', {
      bubbles: true,
      detail: getRuntimeStateSnapshot(state),
    }),
  );

  refreshPanel(editor);
  const panel = panelByEditor.get(editor);
  if (panel) {
    const removedTotal =
      result.report.removedElements +
      result.report.removedAttributes +
      result.report.removedComments +
      result.report.normalizedStyles;
    setPanelLiveMessage(
      panel,
      `${options.labels.panelTitle}: ${getProfileLabel(state.profile, options.labels)}. ${options.labels.lastPasteRemovedLabel}: ${removedTotal}.`,
    );
  }

  return true;
}

function handlePasteFactory(editor: HTMLElement): (event: ClipboardEvent) => void {
  return (event: ClipboardEvent): void => {
    if (event.defaultPrevented || (event as any)[SMART_PASTE_HANDLED_KEY] === true) return;

    lastActiveEditor = editor;
    const handled = executeSmartPaste(editor, event);
    if (!handled) return;

    (event as any)[SMART_PASTE_HANDLED_KEY] = true;
    event.preventDefault();
    if (typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    } else {
      event.stopPropagation();
    }
  };
}

function attachEditorPasteHandler(editor: HTMLElement): void {
  if (pasteHandlerByEditor.has(editor)) return;

  const handler = handlePasteFactory(editor);
  editor.addEventListener('paste', handler as EventListener, true);
  pasteHandlerByEditor.set(editor, handler);
}

function updateToolbarState(editor: HTMLElement): void {
  const state = stateByEditor.get(editor);
  setCommandButtonActiveState(editor, 'toggleSmartPastePanel', isPanelVisible(editor));
  setCommandButtonActiveState(editor, 'toggleSmartPasteEnabled', state?.enabled === true);
}

function isTogglePanelShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 's';
}

function isCycleProfileShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'v';
}

function isToggleEnabledShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'g';
}

function bindGlobalHandlers(options: ResolvedSmartPasteOptions): void {
  fallbackOptions = options;

  if (!globalFocusInHandler) {
    globalFocusInHandler = (event: FocusEvent) => {
      pruneDisconnectedEditors();

      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || options;
      ensureEditorState(editor, resolved);
      optionsByEditor.set(editor, resolved);
      lastActiveEditor = editor;

      updateToolbarState(editor);

      const panel = panelByEditor.get(editor);
      if (panel) {
        applyThemeClass(panel, editor);
        positionPanel(editor, panel);
        refreshPanel(editor);
      }
    };

    document.addEventListener('focusin', globalFocusInHandler, true);
  }

  if (!globalKeydownHandler) {
    globalKeydownHandler = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      const target = event.target as HTMLElement | null;
      if (target?.closest(`.${PANEL_CLASS} input, .${PANEL_CLASS} textarea, .${PANEL_CLASS} select`)) return;

      const editor = resolveEditorFromKeyboardEvent(event);
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || fallbackOptions || options;
      ensureEditorState(editor, resolved);
      optionsByEditor.set(editor, resolved);
      lastActiveEditor = editor;

      if (event.key === 'Escape' && isPanelVisible(editor)) {
        event.preventDefault();
        hidePanel(editor, true);
        return;
      }

      if (isTogglePanelShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        togglePanel(editor);
        return;
      }

      if (isCycleProfileShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        const state = ensureEditorState(editor, resolved);
        state.profile = cycleProfile(state.profile);
        refreshPanel(editor);
        return;
      }

      if (isToggleEnabledShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        const state = ensureEditorState(editor, resolved);
        state.enabled = !state.enabled;
        updateToolbarState(editor);
        refreshPanel(editor);
      }
    };

    document.addEventListener('keydown', globalKeydownHandler, true);
  }

  if (!globalViewportHandler) {
    globalViewportHandler = () => {
      pruneDisconnectedEditors();

      panelByEditor.forEach((panel, editor) => {
        if (!editor.isConnected || !panel.isConnected) return;
        applyThemeClass(panel, editor);
        positionPanel(editor, panel);
      });
    };

    window.addEventListener('scroll', globalViewportHandler, true);
    window.addEventListener('resize', globalViewportHandler);
  }

  if (!globalMutationObserver && typeof MutationObserver !== 'undefined' && document.body) {
    globalMutationObserver = new MutationObserver((records) => {
      if (!mutationTouchesEditorRemoval(records)) return;
      pruneDisconnectedEditors();
    });

    globalMutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
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

  if (globalViewportHandler) {
    window.removeEventListener('scroll', globalViewportHandler, true);
    window.removeEventListener('resize', globalViewportHandler);
    globalViewportHandler = null;
  }

  if (globalMutationObserver) {
    globalMutationObserver.disconnect();
    globalMutationObserver = null;
  }

  panelByEditor.forEach((panel) => panel.remove());
  panelByEditor.clear();

  trackedEditors.forEach((editor) => detachEditorPasteHandler(editor));
  trackedEditors.clear();

  fallbackOptions = null;
  lastActiveEditor = null;
}

function ensureStylesInjected(): void {
  if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: #fff;
    }

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #ccc;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="toggleSmartPasteEnabled"].active,
    .editora-toolbar-button[data-command="toggleSmartPasteEnabled"].active {
      background-color: rgba(14, 165, 233, 0.14);
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    .${PANEL_CLASS}.rte-smart-paste-theme-dark {
      border-color: #566275;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-button svg,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-button svg,
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-button svg,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-button svg {
      fill: none;
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-button
    {
      border-color: #566275;
    }
    
    .${PANEL_CLASS} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(360px, calc(100vw - 20px));
      max-height: calc(100vh - 20px);
      border: 1px solid #d1d5db;
      border-radius: 14px;
      background: #ffffff;
      color: #111827;
      box-shadow: 0 18px 45px rgba(15, 23, 42, 0.25);
      overflow: hidden;
    }

    .${PANEL_CLASS}.show {
      display: flex;
      flex-direction: column;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 20px 46px rgba(2, 6, 23, 0.68);
    }

    .rte-smart-paste-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-smart-paste-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-smart-paste-icon-btn {
      width: 34px;
      height: 34px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      background: #ffffff;
      color: #0f172a;
      font-size: 16px;
      line-height: 1;
      font-weight: 600;
      padding: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .rte-smart-paste-icon-btn:hover,
    .rte-smart-paste-icon-btn:focus-visible {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-icon-btn {
      background: #0f172a;
      border-color: #475569;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-icon-btn:hover,
    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-icon-btn:focus-visible {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.24);
    }

    .rte-smart-paste-body {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 12px;
      overflow: auto;
    }

    .rte-smart-paste-status {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
      font-weight: 600;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-status {
      color: #94a3b8;
    }

    .rte-smart-paste-controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .rte-smart-paste-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      height: 34px;
      padding: 0 10px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-smart-paste-btn:hover,
    .rte-smart-paste-btn:focus-visible {
      border-color: #94a3b8;
      background: #f8fafc;
      outline: none;
    }

    .rte-smart-paste-btn-primary {
      border-color: #0284c7;
      background: #0ea5e9;
      color: #f8fafc;
    }

    .rte-smart-paste-btn-primary:hover,
    .rte-smart-paste-btn-primary:focus-visible {
      border-color: #0369a1;
      background: #0284c7;
      color: #ffffff;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-btn:hover,
    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-btn:focus-visible {
      border-color: #475569;
      background: #1e293b;
    }

    .rte-smart-paste-profile {
      display: grid;
      gap: 6px;
    }

    .rte-smart-paste-profile-heading {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      font-weight: 700;
      color: #334155;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-profile-heading {
      color: #cbd5e1;
    }

    .rte-smart-paste-profile-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
    }

    .rte-smart-paste-chip {
      height: 34px;
      border-radius: 9px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-smart-paste-chip:hover,
    .rte-smart-paste-chip:focus-visible {
      border-color: #0284c7;
      outline: none;
    }

    .rte-smart-paste-chip.active {
      border-color: #0284c7;
      background: rgba(14, 165, 233, 0.14);
      color: #0c4a6e;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-chip {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-chip.active {
      border-color: #38bdf8;
      background: rgba(14, 165, 233, 0.2);
      color: #e0f2fe;
    }

    .rte-smart-paste-metrics {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px;
      background: #f8fafc;
      display: grid;
      gap: 8px;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-metrics {
      border-color: #334155;
      background: #0b1220;
    }

    .rte-smart-paste-report-title {
      margin: 0;
      font-size: 12px;
      line-height: 1.3;
      font-weight: 700;
    }

    .rte-smart-paste-empty {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-empty {
      color: #94a3b8;
    }

    .rte-smart-paste-report {
      margin: 0;
      display: grid;
      gap: 6px;
    }

    .rte-smart-paste-line {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      font-size: 12px;
      line-height: 1.3;
    }

    .rte-smart-paste-line dt {
      margin: 0;
      color: #475569;
      font-weight: 600;
    }

    .rte-smart-paste-line dd {
      margin: 0;
      font-weight: 700;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-line dt {
      color: #94a3b8;
    }

    .rte-smart-paste-shortcut {
      margin: 2px 0 0;
      font-size: 11px;
      color: #64748b;
    }

    .${PANEL_CLASS}.rte-smart-paste-theme-dark .rte-smart-paste-shortcut {
      color: #94a3b8;
    }

    .rte-smart-paste-live {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      border: 0;
    }

    @media (max-width: 768px) {
      .${PANEL_CLASS} {
        left: 10px !important;
        right: 10px;
        top: 10px !important;
        width: auto !important;
        max-height: calc(100vh - 20px);
      }

      .rte-smart-paste-profile-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);
}

export const SmartPastePlugin = (rawOptions: SmartPastePluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  const instanceEditors = new Set<HTMLElement>();

  ensureStylesInjected();

  return {
    name: 'smartPaste',

    toolbar: [
      {
        id: 'smartPasteGroup',
        label: 'Smart Paste',
        type: 'group',
        command: 'smartPaste',
        items: [
          {
            id: 'smartPaste',
            label: 'Smart Paste Panel',
            command: 'toggleSmartPastePanel',
            shortcut: 'Mod-Alt-Shift-s',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M8.5 4.5h7l3 3V18a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 6.5 18V7a2.5 2.5 0 0 1 2-2.45Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15.5 4.5V8h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.3 12h5.4M9.3 15h5.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
          },
          {
            id: 'smartPasteProfile',
            label: 'Cycle Smart Paste Profile',
            command: 'cycleSmartPasteProfile',
            shortcut: 'Mod-Alt-Shift-v',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M4.5 7.5h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="17.5" cy="7.5" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 12h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12.5" cy="12" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M4.5 16.5h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="9.5" cy="16.5" r="2" stroke="currentColor" stroke-width="1.6"/></svg>',
          },
          {
            id: 'smartPasteToggle',
            label: 'Toggle Smart Paste',
            command: 'toggleSmartPasteEnabled',
            shortcut: 'Mod-Alt-Shift-g',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="3.5" y="8" width="17" height="8" rx="4" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="12" r="2.6" fill="currentColor"/><path d="M14.5 12h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
          },
        ],
      },
    ],

    commands: {
      smartPaste: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        showPanel(editor);
        return true;
      },

      toggleSmartPastePanel: (
        value?: boolean,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        return togglePanel(editor, typeof value === 'boolean' ? value : undefined);
      },

      cycleSmartPasteProfile: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        const state = ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        state.profile = cycleProfile(state.profile);
        refreshPanel(editor);
        return true;
      },

      setSmartPasteProfile: (value?: SmartPasteProfile, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        const state = ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        state.profile = normalizeProfile(value);
        refreshPanel(editor);
        return true;
      },

      toggleSmartPasteEnabled: (
        value?: boolean,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        const state = ensureEditorState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        state.enabled = typeof value === 'boolean' ? value : !state.enabled;
        updateToolbarState(editor);
        refreshPanel(editor);
        return true;
      },

      setSmartPasteOptions: (
        value?: Partial<SmartPastePluginOptions>,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor || !value || typeof value !== 'object') return false;

        const current = optionsByEditor.get(editor) || options;
        const currentRaw = toRawOptions(current);

        const merged = normalizeOptions({
          ...currentRaw,
          ...value,
          labels: {
            ...current.labels,
            ...(value.labels || {}),
          },
          profileOptions: {
            ...currentRaw.profileOptions,
            ...(value.profileOptions || {}),
            fidelity: {
              ...(currentRaw.profileOptions?.fidelity || {}),
              ...(value.profileOptions?.fidelity || {}),
            },
            balanced: {
              ...(currentRaw.profileOptions?.balanced || {}),
              ...(value.profileOptions?.balanced || {}),
            },
            plain: {
              ...(currentRaw.profileOptions?.plain || {}),
              ...(value.profileOptions?.plain || {}),
            },
          },
          normalizeText: value.normalizeText || current.normalizeText,
        });

        optionsByEditor.set(editor, merged);
        const state = ensureEditorState(editor, merged);
        if (typeof value.enabled === 'boolean') {
          state.enabled = value.enabled;
        }
        if (value.defaultProfile) {
          state.profile = normalizeProfile(value.defaultProfile);
        }

        refreshPanel(editor);
        updateToolbarState(editor);
        return true;
      },

      getSmartPasteState: (
        value?: ((state: SmartPasteRuntimeState) => void) | unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        const state = ensureEditorState(editor, resolved);
        const snapshot = getRuntimeStateSnapshot(state);

        if (typeof value === 'function') {
          try {
            (value as (state: SmartPasteRuntimeState) => void)(snapshot);
          } catch {
            // Ignore callback errors.
          }
        }

        (editor as any).__smartPasteState = snapshot;
        editor.dispatchEvent(
          new CustomEvent('editora:smart-paste-state', {
            bubbles: true,
            detail: snapshot,
          }),
        );

        return true;
      },
    },

    keymap: {
      'Mod-Alt-Shift-s': 'toggleSmartPastePanel',
      'Mod-Alt-Shift-S': 'toggleSmartPastePanel',
      'Mod-Alt-Shift-v': 'cycleSmartPasteProfile',
      'Mod-Alt-Shift-V': 'cycleSmartPasteProfile',
      'Mod-Alt-Shift-g': 'toggleSmartPasteEnabled',
      'Mod-Alt-Shift-G': 'toggleSmartPasteEnabled',
    },

    init: function init(this: any, context?: { editorElement?: HTMLElement }) {
      pluginInstanceCount += 1;

      const runtimeConfig =
        this && typeof this.__pluginConfig === 'object'
          ? normalizeOptions({ ...toRawOptions(options), ...(this.__pluginConfig as SmartPastePluginOptions) })
          : options;

      bindGlobalHandlers(runtimeConfig);

      const editor = resolveEditorFromContext(
        context?.editorElement ? { editorElement: context.editorElement } : undefined,
        false,
        false,
      );

      if (!editor) return;

      lastActiveEditor = editor;
      instanceEditors.add(editor);
      const state = ensureEditorState(editor, runtimeConfig);
      state.enabled = runtimeConfig.enabled;
      state.profile = runtimeConfig.defaultProfile;
      optionsByEditor.set(editor, runtimeConfig);
      updateToolbarState(editor);
    },

    destroy: () => {
      instanceEditors.forEach((editor) => cleanupEditorState(editor));
      instanceEditors.clear();

      pluginInstanceCount = Math.max(0, pluginInstanceCount - 1);
      if (pluginInstanceCount > 0) return;

      unbindGlobalHandlers();
    },
  };
};
