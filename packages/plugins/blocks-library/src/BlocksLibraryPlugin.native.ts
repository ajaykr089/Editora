import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_HOST_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';
const STYLE_ID = 'rte-blocks-library-styles';
const PANEL_CLASS = 'rte-blocks-library-panel';
const TOOLBAR_GROUP_CLASS = 'blocks-library';
const LEGACY_TOOLBAR_GROUP_CLASS = 'blocksLibrary';
const DARK_THEME_SELECTOR = ':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';
const FILTER_CACHE_LIMIT = 80;

const BLOCKED_TAGS = new Set(['script', 'style', 'meta', 'link', 'object', 'embed', 'iframe']);
const SAFE_URL_PROTOCOL = /^(https?:|mailto:|tel:|#|\/)/i;
const SAFE_DATA_IMAGE = /^data:image\/(?:png|gif|jpeg|jpg|webp);base64,/i;

export interface BlocksLibraryItem {
  id: string;
  label: string;
  html: string;
  description?: string;
  category?: string;
  tags?: string[];
  keywords?: string[];
}

export interface BlocksLibraryItemInput {
  id?: string;
  label: string;
  html: string;
  description?: string;
  category?: string;
  tags?: string[];
  keywords?: string[];
}

export interface BlocksLibraryLabels {
  panelTitle?: string;
  panelAriaLabel?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  categoryLabel?: string;
  allCategoriesText?: string;
  recentHeading?: string;
  insertText?: string;
  closeText?: string;
  noResultsText?: string;
  summaryPrefix?: string;
  loadingText?: string;
  loadErrorText?: string;
  readonlyMessage?: string;
  shortcutText?: string;
  helperText?: string;
  lastInsertedPrefix?: string;
  resultsListLabel?: string;
}

export interface BlocksLibraryRequestContext {
  editor: HTMLElement;
  editorRoot: HTMLElement;
  signal: AbortSignal;
}

export interface BlocksLibraryPluginOptions {
  blocks?: BlocksLibraryItemInput[];
  defaultCategory?: string;
  maxResults?: number;
  maxRecentBlocks?: number;
  debounceMs?: number;
  cacheTtlMs?: number;
  labels?: BlocksLibraryLabels;
  normalizeText?: (value: string) => string;
  sanitizeBlockHtml?: (html: string, block: BlocksLibraryItemInput) => string;
  getBlocks?: (
    context: BlocksLibraryRequestContext,
  ) => BlocksLibraryItemInput[] | Promise<BlocksLibraryItemInput[]>;
}

export interface BlocksLibraryRuntimeState {
  query: string;
  category: string;
  selectedBlockId: string | null;
  totalMatches: number;
  visibleMatches: number;
  recentBlockIds: string[];
  lastInsertedBlockId: string | null;
  loading: boolean;
  loadError: string | null;
}

interface ResolvedBlocksLibraryItem {
  id: string;
  label: string;
  html: string;
  description: string;
  category: string;
  categoryKey: string;
  tags: string[];
  keywords: string[];
  previewText: string;
  searchBlob: string;
}

interface ResolvedBlocksLibraryOptions {
  blocks: ResolvedBlocksLibraryItem[];
  defaultCategory: string;
  maxResults: number;
  maxRecentBlocks: number;
  debounceMs: number;
  cacheTtlMs: number;
  labels: Required<BlocksLibraryLabels>;
  normalizeText: (value: string) => string;
  sanitizeBlockHtml: (html: string, block: BlocksLibraryItemInput) => string;
  getBlocks?: (
    context: BlocksLibraryRequestContext,
  ) => BlocksLibraryItemInput[] | Promise<BlocksLibraryItemInput[]>;
}

interface BlocksLibraryEditorState {
  query: string;
  category: string;
  selectedBlockId: string | null;
  recentBlockIds: string[];
  lastInsertedBlockId: string | null;
  loading: boolean;
  loadError: string | null;
  totalMatches: number;
  visibleMatches: number;
  filterCache: Map<string, { ids: string[]; total: number }>;
  debounceTimer: number | null;
}

const defaultLabels: Required<BlocksLibraryLabels> = {
  panelTitle: 'Blocks Library',
  panelAriaLabel: 'Blocks library panel',
  searchLabel: 'Search blocks',
  searchPlaceholder: 'Search by name, category, or keyword',
  categoryLabel: 'Category',
  allCategoriesText: 'All categories',
  recentHeading: 'Recent inserts',
  insertText: 'Insert Selected',
  closeText: 'Close',
  noResultsText: 'No matching blocks found.',
  summaryPrefix: 'Blocks',
  loadingText: 'Loading blocks...',
  loadErrorText: 'Unable to load blocks right now.',
  readonlyMessage: 'Editor is read-only. Block insertion is disabled.',
  shortcutText: 'Shortcuts: Ctrl/Cmd+Alt+Shift+B (panel), Ctrl/Cmd+Alt+Shift+L (insert last)',
  helperText: 'Use Arrow keys to move through blocks, Enter to insert, Esc to close.',
  lastInsertedPrefix: 'Last inserted',
  resultsListLabel: 'Block results',
};

const optionsByEditor = new WeakMap<HTMLElement, ResolvedBlocksLibraryOptions>();
const rawOptionsByEditor = new WeakMap<HTMLElement, BlocksLibraryPluginOptions>();
const stateByEditor = new WeakMap<HTMLElement, BlocksLibraryEditorState>();
const blocksByEditor = new WeakMap<HTMLElement, ResolvedBlocksLibraryItem[]>();
const blocksCacheTimeByEditor = new WeakMap<HTMLElement, number>();
const pendingLoadByEditor = new WeakMap<HTMLElement, Promise<void>>();
const loadControllerByEditor = new WeakMap<HTMLElement, AbortController>();
const loadRequestIdByEditor = new WeakMap<HTMLElement, number>();
const savedSelectionRangeByEditor = new WeakMap<HTMLElement, Range>();
const selectionCaptureHandlerByEditor = new WeakMap<HTMLElement, () => void>();
const panelByEditor = new Map<HTMLElement, HTMLElement>();
const panelVisibleByEditor = new WeakMap<HTMLElement, boolean>();
const trackedEditors = new Set<HTMLElement>();

let pluginInstanceCount = 0;
let panelSequence = 0;
let blockIdSequence = 0;
let fallbackOptions: ResolvedBlocksLibraryOptions | null = null;
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

function normalizeTextDefault(value: string): string {
  return value.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
}

function sanitizeBlockId(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function sanitizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (SAFE_URL_PROTOCOL.test(trimmed)) return trimmed;
  if (SAFE_DATA_IMAGE.test(trimmed)) return trimmed;
  return '';
}

function sanitizeBlockHtmlByRegex(html: string): string {
  let sanitized = html;

  BLOCKED_TAGS.forEach((tag) => {
    const blockPattern = new RegExp(`<${tag}[\\s\\S]*?>[\\s\\S]*?<\\/${tag}>`, 'gi');
    const selfClosingPattern = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
    sanitized = sanitized.replace(blockPattern, '').replace(selfClosingPattern, '');
  });

  sanitized = sanitized
    .replace(/\son\w+=(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(xmlns|xml:[^=\s>]+)\s*=\s*(\"[^\"]*\"|'[^']*'|[^\s>]+)/gi, '')
    .replace(
      /\s(href|src|xlink:href)\s*=\s*("|\')\s*(?:javascript:|vbscript:|data:text\/html)[^"']*\2/gi,
      '',
    )
    .replace(/\s(href|src|xlink:href)\s*=\s*(?:javascript:|vbscript:|data:text\/html)[^\s>]*/gi, '')
    .replace(
      /\s(href|src|xlink:href)\s*=\s*("([^"]*)"|'([^']*)')/gi,
      (_match, attrName: string, rawQuoted: string, dblQuoted: string, singleQuoted: string) => {
        const rawUrl = typeof dblQuoted === 'string' && dblQuoted.length > 0 ? dblQuoted : singleQuoted || '';
        const safe = sanitizeUrl(rawUrl);
        if (!safe) return '';
        const quote = rawQuoted.startsWith('"') ? '"' : "'";
        return ` ${attrName}=${quote}${safe}${quote}`;
      },
    )
    .replace(/\s(href|src|xlink:href)\s*=\s*([^\s>]+)/gi, (_match, attrName: string, rawUrl: string) => {
      const safe = sanitizeUrl(rawUrl);
      if (!safe) return '';
      return ` ${attrName}="${safe}"`;
    })
    .replace(/\sstyle\s*=\s*("([^"]*)"|'([^']*)')/gi, (_match, rawQuoted: string, dblQuoted: string, singleQuoted: string) => {
      const styleValue = typeof dblQuoted === 'string' && dblQuoted.length > 0 ? dblQuoted : singleQuoted || '';
      if (/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(styleValue)) {
        return '';
      }
      const quote = rawQuoted.startsWith('"') ? '"' : "'";
      return ` style=${quote}${styleValue}${quote}`;
    })
    .trim();

  return sanitized;
}

function sanitizeBlockHtmlDefault(html: string): string {
  if (!html) return '';

  if (typeof document === 'undefined') {
    return sanitizeBlockHtmlByRegex(html);
  }

  const template = document.createElement('template');
  template.innerHTML = html;
  const content = (template as any).content;
  if (!content || typeof content.querySelectorAll !== 'function') {
    return sanitizeBlockHtmlByRegex(html);
  }

  const elements = Array.from(content.querySelectorAll('*')) as HTMLElement[];
  elements.forEach((element) => {
    const tag = element.tagName.toLowerCase();
    if (BLOCKED_TAGS.has(tag)) {
      element.remove();
      return;
    }

    const attributes = Array.from(element.attributes);
    attributes.forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value;

      if (name.startsWith('on')) {
        element.removeAttribute(attribute.name);
        return;
      }

      if (name === 'style') {
        // Styles are allowed for block fidelity, but strip dangerous payloads.
        if (/expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(/i.test(value)) {
          element.removeAttribute(attribute.name);
        }
        return;
      }

      if (name === 'href' || name === 'src' || name === 'xlink:href') {
        const sanitized = sanitizeUrl(value);
        if (!sanitized) {
          element.removeAttribute(attribute.name);
          return;
        }

        if (sanitized !== value) {
          element.setAttribute(attribute.name, sanitized);
        }
      }
    });
  });

  return template.innerHTML.trim();
}

function toCategoryKey(value: string): string {
  return value.trim().toLowerCase();
}

function extractTextFromHTML(value: string): string {
  if (!value) return '';
  if (typeof document === 'undefined') {
    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const template = document.createElement('template');
  template.innerHTML = value;
  const content = (template as any).content;
  if (!content || typeof content.textContent !== 'string') {
    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  return content.textContent.replace(/\s+/g, ' ').trim();
}

function normalizeBlockItems(
  blocks: BlocksLibraryItemInput[] | undefined,
  options: Pick<ResolvedBlocksLibraryOptions, 'normalizeText' | 'sanitizeBlockHtml'>,
): ResolvedBlocksLibraryItem[] {
  if (!Array.isArray(blocks) || blocks.length === 0) return [];

  const seenIds = new Set<string>();
  const normalized: ResolvedBlocksLibraryItem[] = [];

  blocks.forEach((block) => {
    const rawLabel = options.normalizeText(block.label || '');
    const sanitizedHtml = options.sanitizeBlockHtml(block.html || '', block).trim();
    if (!rawLabel || !sanitizedHtml) return;

    const normalizedCategory = options.normalizeText(block.category || 'General') || 'General';
    const categoryKey = toCategoryKey(normalizedCategory);

    const baseId = sanitizeBlockId(options.normalizeText(block.id || rawLabel));
    let id = baseId || `block-${blockIdSequence++}`;
    while (seenIds.has(id)) {
      id = `${id}-${blockIdSequence++}`;
    }
    seenIds.add(id);

    const tags = (block.tags || []).map((tag) => options.normalizeText(tag)).filter(Boolean);
    const keywords = (block.keywords || []).map((keyword) => options.normalizeText(keyword)).filter(Boolean);
    const description = options.normalizeText(block.description || '');
    const previewText = extractTextFromHTML(sanitizedHtml);

    const searchBlob = [rawLabel, description, normalizedCategory, ...tags, ...keywords, previewText]
      .join(' ')
      .toLowerCase();

    normalized.push({
      id,
      label: rawLabel,
      html: sanitizedHtml,
      description,
      category: normalizedCategory,
      categoryKey,
      tags,
      keywords,
      previewText,
      searchBlob,
    });
  });

  return normalized;
}

function normalizeOptions(raw: BlocksLibraryPluginOptions = {}): ResolvedBlocksLibraryOptions {
  const normalizeText = raw.normalizeText || normalizeTextDefault;
  const sanitizeBlockHtml = raw.sanitizeBlockHtml || sanitizeBlockHtmlDefault;

  const baseOptions: ResolvedBlocksLibraryOptions = {
    blocks: [],
    defaultCategory: normalizeText(raw.defaultCategory || ''),
    maxResults: Math.max(4, Math.min(300, Number(raw.maxResults ?? 80))),
    maxRecentBlocks: Math.max(1, Math.min(20, Number(raw.maxRecentBlocks ?? 6))),
    debounceMs: Math.max(0, Math.min(700, Number(raw.debounceMs ?? 90))),
    cacheTtlMs: Math.max(0, Number(raw.cacheTtlMs ?? 60_000)),
    labels: {
      ...defaultLabels,
      ...(raw.labels || {}),
    },
    normalizeText,
    sanitizeBlockHtml,
    getBlocks: typeof raw.getBlocks === 'function' ? raw.getBlocks : undefined,
  };

  baseOptions.blocks = normalizeBlockItems(raw.blocks, baseOptions);
  return baseOptions;
}

function toRawOptions(options: ResolvedBlocksLibraryOptions): BlocksLibraryPluginOptions {
  return {
    blocks: options.blocks.map((block) => ({
      id: block.id,
      label: block.label,
      html: block.html,
      description: block.description || undefined,
      category: block.category || undefined,
      tags: block.tags.length ? [...block.tags] : undefined,
      keywords: block.keywords.length ? [...block.keywords] : undefined,
    })),
    defaultCategory: options.defaultCategory,
    maxResults: options.maxResults,
    maxRecentBlocks: options.maxRecentBlocks,
    debounceMs: options.debounceMs,
    cacheTtlMs: options.cacheTtlMs,
    labels: { ...options.labels },
    normalizeText: options.normalizeText,
    sanitizeBlockHtml: options.sanitizeBlockHtml,
    getBlocks: options.getBlocks,
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
    const fromHost = resolveContentFromHost(host);
    if (fromHost) return fromHost;
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

function pruneDisconnectedEditors(): void {
  const editors = Array.from(trackedEditors);
  editors.forEach((editor) => {
    if (editor.isConnected) return;
    cleanupEditor(editor);
  });
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

  const explicit = consumeCommandEditorContext();
  if (explicit) return explicit;

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const element = getElementFromNode(selection.getRangeAt(0).startContainer);
    const fromSelection = element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (fromSelection) return fromSelection;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active) {
    if (active.matches(EDITOR_CONTENT_SELECTOR)) return active;
    const fromActive = active.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
    if (fromActive) return fromActive;
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
  target.classList.remove('rte-blocks-library-theme-dark');
  if (shouldUseDarkTheme(editor)) {
    target.classList.add('rte-blocks-library-theme-dark');
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

function setPanelLiveMessage(panel: HTMLElement, message: string): void {
  const live = panel.querySelector<HTMLElement>('.rte-blocks-library-live');
  if (live) {
    live.textContent = message;
  }
}

function rememberEditorSelection(editor: HTMLElement): void {
  const range = getSelectionRangeInEditor(editor);
  if (!range) return;

  try {
    savedSelectionRangeByEditor.set(editor, range.cloneRange());
  } catch {
    // Ignore selection snapshot failures.
  }
}

function getRememberedSelectionRange(editor: HTMLElement): Range | null {
  const savedRange = savedSelectionRangeByEditor.get(editor);
  if (!savedRange) return null;

  if (!editor.isConnected) {
    savedSelectionRangeByEditor.delete(editor);
    return null;
  }

  try {
    const range = savedRange.cloneRange();
    if (!editor.contains(range.commonAncestorContainer)) {
      savedSelectionRangeByEditor.delete(editor);
      return null;
    }

    return range;
  } catch {
    savedSelectionRangeByEditor.delete(editor);
    return null;
  }
}

function restoreRememberedSelection(editor: HTMLElement): boolean {
  const range = getRememberedSelectionRange(editor);
  if (!range) return false;
  setSelectionRange(editor, range);
  return true;
}

function bindEditorSelectionCapture(editor: HTMLElement): void {
  if (selectionCaptureHandlerByEditor.has(editor)) return;

  const syncSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return;

    rememberEditorSelection(editor);
  };

  editor.addEventListener('keyup', syncSelection);
  editor.addEventListener('mouseup', syncSelection);
  editor.addEventListener('touchend', syncSelection);

  selectionCaptureHandlerByEditor.set(editor, syncSelection);
}

function unbindEditorSelectionCapture(editor: HTMLElement): void {
  const syncSelection = selectionCaptureHandlerByEditor.get(editor);
  if (!syncSelection) return;

  editor.removeEventListener('keyup', syncSelection);
  editor.removeEventListener('mouseup', syncSelection);
  editor.removeEventListener('touchend', syncSelection);
  selectionCaptureHandlerByEditor.delete(editor);
}

function ensureState(editor: HTMLElement, options: ResolvedBlocksLibraryOptions): BlocksLibraryEditorState {
  if (!optionsByEditor.has(editor)) {
    optionsByEditor.set(editor, options);
  }

  if (!blocksByEditor.has(editor)) {
    blocksByEditor.set(editor, options.blocks);
    blocksCacheTimeByEditor.set(editor, Date.now());
  }

  let state = stateByEditor.get(editor);
  if (!state) {
    state = {
      query: '',
      category: options.defaultCategory ? toCategoryKey(options.defaultCategory) : 'all',
      selectedBlockId: null,
      recentBlockIds: [],
      lastInsertedBlockId: null,
      loading: false,
      loadError: null,
      totalMatches: 0,
      visibleMatches: 0,
      filterCache: new Map<string, { ids: string[]; total: number }>(),
      debounceTimer: null,
    };
    stateByEditor.set(editor, state);
  }

  trackedEditors.add(editor);
  bindEditorSelectionCapture(editor);
  return state;
}

function clearEditorDebounceTimer(editor: HTMLElement): void {
  const state = stateByEditor.get(editor);
  if (!state || state.debounceTimer === null) return;
  window.clearTimeout(state.debounceTimer);
  state.debounceTimer = null;
}

function cleanupEditor(editor: HTMLElement): void {
  clearEditorDebounceTimer(editor);
  unbindEditorSelectionCapture(editor);
  savedSelectionRangeByEditor.delete(editor);

  const controller = loadControllerByEditor.get(editor);
  if (controller) {
    controller.abort();
    loadControllerByEditor.delete(editor);
  }
  pendingLoadByEditor.delete(editor);
  loadRequestIdByEditor.delete(editor);

  panelByEditor.get(editor)?.remove();
  panelByEditor.delete(editor);
  panelVisibleByEditor.delete(editor);

  optionsByEditor.delete(editor);
  rawOptionsByEditor.delete(editor);
  stateByEditor.delete(editor);
  blocksByEditor.delete(editor);
  blocksCacheTimeByEditor.delete(editor);

  trackedEditors.delete(editor);

  if (lastActiveEditor === editor) {
    lastActiveEditor = null;
  }
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

function positionPanel(editor: HTMLElement, panel: HTMLElement): void {
  if (!panel.classList.contains('show')) return;

  const rect = resolveEditorRoot(editor).getBoundingClientRect();
  const panelWidth = Math.min(window.innerWidth - 20, 420);
  const maxLeft = Math.max(10, window.innerWidth - panelWidth - 10);
  const left = Math.min(Math.max(10, rect.right - panelWidth), maxLeft);
  const top = Math.max(10, Math.min(window.innerHeight - 10, rect.top + 12));

  panel.style.width = `${panelWidth}px`;
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
  panel.style.maxHeight = `${Math.max(260, window.innerHeight - 20)}px`;
}

function getBlocksForEditor(editor: HTMLElement): ResolvedBlocksLibraryItem[] {
  return blocksByEditor.get(editor) || optionsByEditor.get(editor)?.blocks || [];
}

function getCategoryOptions(editor: HTMLElement, options: ResolvedBlocksLibraryOptions): Array<{ value: string; label: string }> {
  const categories = new Map<string, string>();

  getBlocksForEditor(editor).forEach((block) => {
    if (!categories.has(block.categoryKey)) {
      categories.set(block.categoryKey, block.category);
    }
  });

  const categoryItems = Array.from(categories.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([value, label]) => ({ value, label }));

  return [{ value: 'all', label: options.labels.allCategoriesText }, ...categoryItems];
}

function resolveVisibleBlocks(editor: HTMLElement, options: ResolvedBlocksLibraryOptions): ResolvedBlocksLibraryItem[] {
  const state = ensureState(editor, options);
  const blocks = getBlocksForEditor(editor);

  const queryKey = state.query.trim().toLowerCase();
  const categoryKey = state.category || 'all';
  const cacheKey = `${queryKey}|${categoryKey}|${options.maxResults}`;

  const cachedIds = state.filterCache.get(cacheKey);
  if (cachedIds) {
    const idToBlock = new Map(blocks.map((block) => [block.id, block]));
    const fromCache = cachedIds.ids.map((id) => idToBlock.get(id)).filter(Boolean) as ResolvedBlocksLibraryItem[];
    state.totalMatches = cachedIds.total;
    state.visibleMatches = fromCache.length;
    return fromCache;
  }

  const result: ResolvedBlocksLibraryItem[] = [];
  let totalMatches = 0;

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];

    if (categoryKey !== 'all' && block.categoryKey !== categoryKey) continue;

    if (queryKey && !block.searchBlob.includes(queryKey)) continue;

    totalMatches += 1;
    if (result.length < options.maxResults) {
      result.push(block);
    }
  }

  state.totalMatches = totalMatches;
  state.visibleMatches = result.length;
  state.filterCache.set(cacheKey, {
    ids: result.map((block) => block.id),
    total: totalMatches,
  });
  if (state.filterCache.size > FILTER_CACHE_LIMIT) {
    const firstKey = state.filterCache.keys().next().value;
    if (typeof firstKey === 'string') {
      state.filterCache.delete(firstKey);
    }
  }

  return result;
}

function ensureSelection(editor: HTMLElement, visibleBlocks: ResolvedBlocksLibraryItem[]): void {
  const state = stateByEditor.get(editor);
  if (!state) return;

  if (visibleBlocks.length === 0) {
    state.selectedBlockId = null;
    return;
  }

  const selectedExists = visibleBlocks.some((block) => block.id === state.selectedBlockId);
  if (!selectedExists) {
    state.selectedBlockId = visibleBlocks[0].id;
  }
}

function updateToolbarState(editor: HTMLElement): void {
  const state = stateByEditor.get(editor);
  setCommandButtonActiveState(editor, 'toggleBlocksLibraryPanel', isPanelVisible(editor));
  setCommandButtonActiveState(editor, 'insertLastBlockSnippet', Boolean(state?.lastInsertedBlockId));
}

function refreshPanel(editor: HTMLElement): void {
  const panel = panelByEditor.get(editor);
  const options = optionsByEditor.get(editor) || fallbackOptions;
  const state = stateByEditor.get(editor);
  if (!panel || !options || !state) return;

  applyThemeClass(panel, editor);

  const title = panel.querySelector<HTMLElement>('.rte-blocks-library-title');
  if (title) title.textContent = options.labels.panelTitle;

  const close = panel.querySelector<HTMLButtonElement>('[data-action="close"]');
  if (close) {
    close.setAttribute('aria-label', options.labels.closeText);
    close.textContent = options.labels.closeText;
  }

  const searchLabel = panel.querySelector<HTMLElement>('.rte-blocks-library-search-label');
  if (searchLabel) searchLabel.textContent = options.labels.searchLabel;

  const searchInput = panel.querySelector<HTMLInputElement>('[data-field="query"]');
  if (searchInput) {
    searchInput.setAttribute('placeholder', options.labels.searchPlaceholder);
    if (searchInput.value !== state.query) {
      searchInput.value = state.query;
    }
  }

  const categoryLabel = panel.querySelector<HTMLElement>('.rte-blocks-library-category-label');
  if (categoryLabel) categoryLabel.textContent = options.labels.categoryLabel;

  const categorySelect = panel.querySelector<HTMLSelectElement>('[data-field="category"]');
  if (categorySelect) {
    const categoryOptions = getCategoryOptions(editor, options);
    categorySelect.innerHTML = categoryOptions
      .map((entry) => `<option value="${escapeHtml(entry.value)}">${escapeHtml(entry.label)}</option>`)
      .join('');

    if (!categoryOptions.some((entry) => entry.value === state.category)) {
      state.category = 'all';
    }
    categorySelect.value = state.category;
  }

  const helper = panel.querySelector<HTMLElement>('.rte-blocks-library-helper');
  if (helper) helper.textContent = options.labels.helperText;

  const resultsList = panel.querySelector<HTMLElement>('.rte-blocks-library-list[role="listbox"]');
  if (resultsList) {
    resultsList.setAttribute('aria-label', options.labels.resultsListLabel);
  }

  const shortcut = panel.querySelector<HTMLElement>('.rte-blocks-library-shortcut');
  if (shortcut) shortcut.textContent = options.labels.shortcutText;

  const insertSelected = panel.querySelector<HTMLButtonElement>('[data-action="insert-selected"]');
  if (insertSelected) {
    insertSelected.textContent = options.labels.insertText;
    const canInsert = !isEditorReadonly(editor) && Boolean(state.selectedBlockId);
    insertSelected.disabled = !canInsert;
    insertSelected.setAttribute('aria-disabled', canInsert ? 'false' : 'true');
  }

  const empty = panel.querySelector<HTMLElement>('.rte-blocks-library-empty');
  const list = panel.querySelector<HTMLElement>('.rte-blocks-library-list');

  const visibleBlocks = resolveVisibleBlocks(editor, options);
  ensureSelection(editor, visibleBlocks);

  const status = panel.querySelector<HTMLElement>('.rte-blocks-library-status');
  if (status) {
    if (state.loading) {
      status.textContent = options.labels.loadingText;
    } else if (state.loadError) {
      status.textContent = state.loadError;
    } else {
      status.textContent = `${options.labels.summaryPrefix}: ${state.visibleMatches}/${state.totalMatches}`;
    }
  }

  if (list) {
    const recentSet = new Set(state.recentBlockIds);
    list.innerHTML = visibleBlocks
      .map((block) => {
        const selected = state.selectedBlockId === block.id;
        const tagText = block.tags.length ? ` • ${block.tags.join(', ')}` : '';
        const recent = recentSet.has(block.id);
        const preview = block.previewText.slice(0, 180);

        return `
          <li class="rte-blocks-library-item-wrapper" role="presentation">
            <button
              type="button"
              class="rte-blocks-library-item${selected ? ' active' : ''}"
              data-block-id="${escapeHtml(block.id)}"
              role="option"
              aria-selected="${selected ? 'true' : 'false'}"
              aria-label="${escapeHtml(block.label)}"
              tabindex="${selected ? '0' : '-1'}"
            >
              <span class="rte-blocks-library-item-head">
                <span class="rte-blocks-library-item-label">${escapeHtml(block.label)}</span>
                ${recent ? `<span class="rte-blocks-library-recent-pill">${escapeHtml(options.labels.recentHeading)}</span>` : ''}
              </span>
              <span class="rte-blocks-library-item-meta">${escapeHtml(block.category)}${escapeHtml(tagText)}</span>
              ${block.description ? `<span class="rte-blocks-library-item-description">${escapeHtml(block.description)}</span>` : ''}
              ${preview ? `<span class="rte-blocks-library-item-preview">${escapeHtml(preview)}</span>` : ''}
            </button>
          </li>
        `;
      })
      .join('');
  }

  if (empty) {
    empty.hidden = visibleBlocks.length > 0;
    empty.textContent = options.labels.noResultsText;
  }

  const recent = panel.querySelector<HTMLElement>('.rte-blocks-library-last-inserted');
  if (recent) {
    if (state.lastInsertedBlockId) {
      const block = getBlocksForEditor(editor).find((entry) => entry.id === state.lastInsertedBlockId);
      if (block) {
        recent.hidden = false;
        recent.textContent = `${options.labels.lastInsertedPrefix}: ${block.label}`;
      } else {
        recent.hidden = true;
      }
    } else {
      recent.hidden = true;
    }
  }

  panel.setAttribute('aria-label', options.labels.panelAriaLabel);
}

function hidePanel(editor: HTMLElement, focusEditor = false): void {
  const panel = panelByEditor.get(editor);
  if (!panel) return;

  panel.classList.remove('show');
  panelVisibleByEditor.set(editor, false);
  updateToolbarState(editor);

  if (focusEditor) {
    editor.focus({ preventScroll: true });
    restoreRememberedSelection(editor);
  }
}

function focusSelectedItem(panel: HTMLElement): void {
  const selected = panel.querySelector<HTMLButtonElement>('.rte-blocks-library-item.active');
  selected?.focus();
}

function cycleSelection(editor: HTMLElement, delta: number): void {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;

  const state = stateByEditor.get(editor);
  if (!state) return;

  const visibleBlocks = resolveVisibleBlocks(editor, options);
  if (visibleBlocks.length === 0) return;

  const currentIndex = Math.max(
    0,
    visibleBlocks.findIndex((block) => block.id === state.selectedBlockId),
  );

  const nextIndex = (currentIndex + delta + visibleBlocks.length) % visibleBlocks.length;
  state.selectedBlockId = visibleBlocks[nextIndex].id;
  refreshPanel(editor);

  const panel = panelByEditor.get(editor);
  if (panel) {
    focusSelectedItem(panel);
  }
}

function showPanel(editor: HTMLElement): void {
  const panel = ensurePanel(editor);
  rememberEditorSelection(editor);

  panelByEditor.forEach((_currentPanel, currentEditor) => {
    if (currentEditor !== editor) {
      hidePanel(currentEditor, false);
    }
  });

  panel.classList.add('show');
  panelVisibleByEditor.set(editor, true);

  refreshPanel(editor);
  positionPanel(editor, panel);
  updateToolbarState(editor);

  const input = panel.querySelector<HTMLInputElement>('[data-field="query"]');
  input?.focus();

  ensureBlocksLoaded(editor, false);
}

function togglePanel(editor: HTMLElement, explicit?: boolean): boolean {
  const visible = isPanelVisible(editor);
  const nextVisible = typeof explicit === 'boolean' ? explicit : !visible;

  if (nextVisible) {
    showPanel(editor);
  } else {
    hidePanel(editor, false);
  }

  return true;
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

function insertHTMLAtRange(editor: HTMLElement, range: Range, html: string): boolean {
  const workingRange = range.cloneRange();
  if (!editor.contains(workingRange.commonAncestorContainer)) return false;

  workingRange.deleteContents();
  const template = document.createElement('template');
  template.innerHTML = html;
  const fragment = (template as HTMLTemplateElement).content;
  if (!fragment) return false;

  const lastNode = fragment.lastChild;
  workingRange.insertNode(fragment);

  if (lastNode) {
    const next = document.createRange();
    next.setStartAfter(lastNode);
    next.collapse(true);
    setSelectionRange(editor, next);
  }

  rememberEditorSelection(editor);
  return true;
}

function insertHTMLAtSelection(editor: HTMLElement, html: string): boolean {
  editor.focus({ preventScroll: true });

  const rememberedRange = getRememberedSelectionRange(editor);
  if (rememberedRange && insertHTMLAtRange(editor, rememberedRange, html)) {
    return true;
  }

  try {
    if (document.execCommand('insertHTML', false, html)) {
      rememberEditorSelection(editor);
      return true;
    }
  } catch {
    // fallback below
  }

  const range = getSelectionRangeInEditor(editor);
  if (!range) return false;
  return insertHTMLAtRange(editor, range, html);
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

function dispatchEditorInput(editor: HTMLElement): void {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function insertBlockById(editor: HTMLElement, blockId: string): boolean {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return false;

  const state = ensureState(editor, options);
  const panel = panelByEditor.get(editor);

  if (isEditorReadonly(editor)) {
    if (panel) {
      setPanelLiveMessage(panel, options.labels.readonlyMessage);
    }
    return false;
  }

  const block = getBlocksForEditor(editor).find((entry) => entry.id === blockId);
  if (!block) return false;

  const beforeHTML = editor.innerHTML;
  const applied = insertHTMLAtSelection(editor, block.html);
  if (!applied) return false;

  state.lastInsertedBlockId = block.id;
  state.selectedBlockId = block.id;
  state.recentBlockIds = [block.id, ...state.recentBlockIds.filter((id) => id !== block.id)].slice(
    0,
    options.maxRecentBlocks,
  );

  recordDomHistoryTransaction(editor, beforeHTML);
  dispatchEditorInput(editor);
  updateToolbarState(editor);

  editor.dispatchEvent(
    new CustomEvent('editora:blocks-library-insert', {
      bubbles: true,
      detail: {
        blockId: block.id,
        label: block.label,
        category: block.category,
      },
    }),
  );

  refreshPanel(editor);
  if (panel) {
    setPanelLiveMessage(panel, `${options.labels.lastInsertedPrefix}: ${block.label}`);
  }

  return true;
}

function insertLastBlock(editor: HTMLElement): boolean {
  const state = stateByEditor.get(editor);
  if (!state?.lastInsertedBlockId) return false;
  return insertBlockById(editor, state.lastInsertedBlockId);
}

function scheduleFilterRefresh(editor: HTMLElement): void {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options) return;

  const state = stateByEditor.get(editor);
  if (!state) return;

  clearEditorDebounceTimer(editor);

  const run = () => {
    state.debounceTimer = null;
    state.filterCache.clear();
    refreshPanel(editor);
  };

  if (options.debounceMs <= 0) {
    run();
    return;
  }

  state.debounceTimer = window.setTimeout(run, options.debounceMs);
}

function ensurePanel(editor: HTMLElement): HTMLElement {
  const existing = panelByEditor.get(editor);
  if (existing) return existing;

  const options = optionsByEditor.get(editor) || fallbackOptions || normalizeOptions();
  const state = ensureState(editor, options);

  const panelId = `rte-blocks-library-panel-${panelSequence++}`;
  const queryInputId = `${panelId}-query`;
  const categorySelectId = `${panelId}-category`;

  const panel = document.createElement('section');
  panel.className = PANEL_CLASS;
  panel.id = panelId;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', options.labels.panelAriaLabel);

  panel.innerHTML = `
    <header class="rte-blocks-library-header">
      <h2 class="rte-blocks-library-title">${escapeHtml(options.labels.panelTitle)}</h2>
      <button type="button" class="rte-blocks-library-icon-btn" data-action="close" aria-label="${escapeHtml(options.labels.closeText)}"></button>
    </header>
    <div class="rte-blocks-library-body">
      <label class="rte-blocks-library-search-label" for="${escapeHtml(queryInputId)}"></label>
      <input id="${escapeHtml(queryInputId)}" class="rte-blocks-library-input" type="text" data-field="query" autocomplete="off" />
      <label class="rte-blocks-library-category-label" for="${escapeHtml(categorySelectId)}"></label>
      <select id="${escapeHtml(categorySelectId)}" class="rte-blocks-library-select" data-field="category"></select>
      <p class="rte-blocks-library-status" aria-live="polite"></p>
      <p class="rte-blocks-library-helper"></p>
      <p class="rte-blocks-library-last-inserted" hidden></p>
      <div class="rte-blocks-library-list-wrap">
        <ul class="rte-blocks-library-list" role="listbox" aria-label="${escapeHtml(options.labels.resultsListLabel)}"></ul>
        <p class="rte-blocks-library-empty" hidden></p>
      </div>
      <div class="rte-blocks-library-actions">
        <button type="button" class="rte-blocks-library-btn rte-blocks-library-btn-primary" data-action="insert-selected"></button>
      </div>
      <p class="rte-blocks-library-shortcut"></p>
    </div>
    <div class="rte-blocks-library-live" aria-live="polite" aria-atomic="true"></div>
  `;

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;

    const actionEl = target?.closest<HTMLElement>('[data-action]');
    if (actionEl) {
      const action = actionEl.getAttribute('data-action');
      if (action === 'close') {
        hidePanel(editor, true);
        return;
      }

      if (action === 'insert-selected') {
        if (!state.selectedBlockId) return;
        const inserted = insertBlockById(editor, state.selectedBlockId);
        if (inserted) {
          hidePanel(editor, true);
        }
      }

      return;
    }

    const item = target?.closest<HTMLButtonElement>('[data-block-id]');
    if (!item) return;

    const blockId = item.getAttribute('data-block-id');
    if (!blockId) return;

    state.selectedBlockId = blockId;
    refreshPanel(editor);

    if (event.detail >= 2) {
      const inserted = insertBlockById(editor, blockId);
      if (inserted) {
        hidePanel(editor, true);
      }
    }
  });

  panel.addEventListener('input', (event) => {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement) || target.getAttribute('data-field') !== 'query') return;

    state.query = options.normalizeText(target.value).toLowerCase();
    state.filterCache.clear();
    scheduleFilterRefresh(editor);
  });

  panel.addEventListener('change', (event) => {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLSelectElement) || target.getAttribute('data-field') !== 'category') return;

    state.category = toCategoryKey(target.value || 'all') || 'all';
    state.filterCache.clear();
    refreshPanel(editor);
  });

  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      hidePanel(editor, true);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      cycleSelection(editor, 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      cycleSelection(editor, -1);
      return;
    }

    if (event.key === 'Enter') {
      const target = event.target as HTMLElement | null;
      const isSearchField = target?.matches('[data-field="query"], [data-field="category"], [data-block-id]');
      if (!isSearchField) return;

      if (!state.selectedBlockId) return;
      event.preventDefault();
      const inserted = insertBlockById(editor, state.selectedBlockId);
      if (inserted) {
        hidePanel(editor, true);
      }
    }
  });

  applyThemeClass(panel, editor);
  document.body.appendChild(panel);

  panelByEditor.set(editor, panel);
  panelVisibleByEditor.set(editor, false);

  refreshPanel(editor);
  return panel;
}

function getRuntimeStateSnapshot(editor: HTMLElement): BlocksLibraryRuntimeState {
  const state = stateByEditor.get(editor);
  return {
    query: state?.query || '',
    category: state?.category || 'all',
    selectedBlockId: state?.selectedBlockId || null,
    totalMatches: state?.totalMatches || 0,
    visibleMatches: state?.visibleMatches || 0,
    recentBlockIds: state?.recentBlockIds ? [...state.recentBlockIds] : [],
    lastInsertedBlockId: state?.lastInsertedBlockId || null,
    loading: state?.loading === true,
    loadError: state?.loadError || null,
  };
}

async function ensureBlocksLoaded(editor: HTMLElement, force: boolean): Promise<void> {
  const options = optionsByEditor.get(editor) || fallbackOptions;
  if (!options || typeof options.getBlocks !== 'function') return;

  const state = ensureState(editor, options);
  const lastLoadedAt = blocksCacheTimeByEditor.get(editor) || 0;

  if (!force && options.cacheTtlMs > 0 && Date.now() - lastLoadedAt < options.cacheTtlMs) {
    return;
  }

  const existingPending = pendingLoadByEditor.get(editor);
  if (existingPending && !force) {
    return existingPending;
  }

  const currentController = loadControllerByEditor.get(editor);
  if (currentController) {
    currentController.abort();
  }
  if (force && existingPending) {
    pendingLoadByEditor.delete(editor);
  }

  const controller = new AbortController();
  loadControllerByEditor.set(editor, controller);
  const requestId = (loadRequestIdByEditor.get(editor) || 0) + 1;
  loadRequestIdByEditor.set(editor, requestId);

  state.loading = true;
  state.loadError = null;
  refreshPanel(editor);

  const run = Promise.resolve()
    .then(async () => {
      const context: BlocksLibraryRequestContext = {
        editor,
        editorRoot: resolveEditorRoot(editor),
        signal: controller.signal,
      };

      const rawBlocks = await options.getBlocks?.(context);
      if (controller.signal.aborted || loadRequestIdByEditor.get(editor) !== requestId) return;

      const nextBlocks = normalizeBlockItems(rawBlocks || [], options);
      blocksByEditor.set(editor, nextBlocks);
      blocksCacheTimeByEditor.set(editor, Date.now());

      const current = stateByEditor.get(editor);
      if (current) {
        current.loading = false;
        current.loadError = null;
        current.filterCache.clear();
      }
    })
    .catch(() => {
      if (controller.signal.aborted || loadRequestIdByEditor.get(editor) !== requestId) return;

      const current = stateByEditor.get(editor);
      if (current) {
        current.loading = false;
        current.loadError = options.labels.loadErrorText;
      }
    })
    .finally(() => {
      if (loadRequestIdByEditor.get(editor) === requestId) {
        pendingLoadByEditor.delete(editor);
        loadControllerByEditor.delete(editor);
      }
      refreshPanel(editor);
    });

  pendingLoadByEditor.set(editor, run);
  return run;
}

function isTogglePanelShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'b';
}

function isInsertLastShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  return (event.metaKey || event.ctrlKey) && event.altKey && event.shiftKey && key === 'l';
}

function bindGlobalHandlers(options: ResolvedBlocksLibraryOptions): void {
  fallbackOptions = options;

  if (!globalFocusInHandler) {
    globalFocusInHandler = (event: FocusEvent) => {
      pruneDisconnectedEditors();

      const target = event.target as HTMLElement | null;
      const editor = target?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || options;
      ensureState(editor, resolved);
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

      const panelInputSelector = `.${PANEL_CLASS} input, .${PANEL_CLASS} textarea, .${PANEL_CLASS} select`;
      const target = event.target as HTMLElement | null;
      if (target?.closest(panelInputSelector)) {
        if (event.key === 'Escape') {
          const panel = target.closest(`.${PANEL_CLASS}`) as HTMLElement | null;
          const editorEntry = Array.from(panelByEditor.entries()).find(([, candidate]) => candidate === panel);
          if (editorEntry) {
            event.preventDefault();
            hidePanel(editorEntry[0], true);
          }
        }
        return;
      }

      const editor = resolveEditorFromKeyboardEvent(event);
      if (!editor) return;

      const resolved = optionsByEditor.get(editor) || fallbackOptions || options;
      ensureState(editor, resolved);
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

      if (isInsertLastShortcut(event)) {
        event.preventDefault();
        event.stopPropagation();
        insertLastBlock(editor);
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

  const editors = Array.from(trackedEditors);
  editors.forEach((editor) => cleanupEditor(editor));

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
      border: 1px solid #cbd5e1;
      border-radius: 4px;
    }

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-button {
      border: none;
      border-right: 1px solid #cbd5e1;
      border-radius: 0;
    }

    .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button,
    .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .rte-toolbar-item:last-child .rte-toolbar-button,
    .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} .editora-toolbar-item:last-child .editora-toolbar-button {
      border-right: none;
    }

    .rte-toolbar-button[data-command="insertLastBlockSnippet"].active,
    .editora-toolbar-button[data-command="insertLastBlockSnippet"].active {
      background: rgba(15, 118, 110, 0.12);
    }

    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .rte-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS},
    ${DARK_THEME_SELECTOR} .editora-toolbar-group-items.${LEGACY_TOOLBAR_GROUP_CLASS} {
      border-color: rgba(100, 116, 139, 0.45);
    }

    .${PANEL_CLASS} {
      position: fixed;
      z-index: 12000;
      display: none;
      width: min(420px, calc(100vw - 20px));
      max-height: calc(100vh - 20px);
      border: 1px solid #d1d5db;
      border-radius: 14px;
      background: #ffffff;
      color: #0f172a;
      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.24);
      overflow: hidden;
    }

    .${PANEL_CLASS}.show {
      display: flex;
      flex-direction: column;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark {
      border-color: #334155;
      background: #0f172a;
      color: #e2e8f0;
      box-shadow: 0 24px 52px rgba(2, 6, 23, 0.68);
    }

    .rte-blocks-library-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-header {
      border-color: #1e293b;
      background: linear-gradient(180deg, #111827 0%, #0f172a 100%);
    }

    .rte-blocks-library-title {
      margin: 0;
      font-size: 15px;
      line-height: 1.2;
      font-weight: 700;
    }

    .rte-blocks-library-icon-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 30px;
      padding: 0 10px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      line-height: 1;
      font-weight: 600;
      cursor: pointer;
    }

    .rte-blocks-library-icon-btn:hover,
    .rte-blocks-library-icon-btn:focus-visible {
      border-color: #94a3b8;
      background: #f8fafc;
      outline: none;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-icon-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-icon-btn:hover,
    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-icon-btn:focus-visible {
      border-color: #475569;
      background: #1e293b;
    }

    .rte-blocks-library-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 12px;
      overflow: auto;
    }

    .rte-blocks-library-search-label,
    .rte-blocks-library-category-label {
      font-size: 12px;
      line-height: 1.3;
      font-weight: 700;
      color: #334155;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-search-label,
    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-category-label {
      color: #cbd5e1;
    }

    .rte-blocks-library-input,
    .rte-blocks-library-select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 10px;
      font-size: 13px;
      background: #ffffff;
      color: inherit;
    }

    .rte-blocks-library-input:focus-visible,
    .rte-blocks-library-select:focus-visible {
      border-color: #0f766e;
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.18);
      outline: none;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-input,
    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-select {
      border-color: #334155;
      background: #0b1220;
      color: #e2e8f0;
    }

    .rte-blocks-library-status,
    .rte-blocks-library-helper,
    .rte-blocks-library-shortcut,
    .rte-blocks-library-last-inserted {
      margin: 0;
      font-size: 12px;
      line-height: 1.35;
      color: #475569;
    }

    .rte-blocks-library-last-inserted {
      font-weight: 600;
      color: #0f766e;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-status,
    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-helper,
    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-shortcut {
      color: #94a3b8;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-last-inserted {
      color: #5eead4;
    }

    .rte-blocks-library-list-wrap {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 6px;
      background: #f8fafc;
      max-height: min(44vh, 360px);
      overflow: auto;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-list-wrap {
      border-color: #334155;
      background: #0b1220;
    }

    .rte-blocks-library-list {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 6px;
    }

    .rte-blocks-library-item-wrapper {
      margin: 0;
      padding: 0;
    }

    .rte-blocks-library-item {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      background: #ffffff;
      color: inherit;
      text-align: left;
      padding: 8px;
      display: grid;
      gap: 3px;
      cursor: pointer;
    }

    .rte-blocks-library-item:hover,
    .rte-blocks-library-item:focus-visible {
      border-color: #0f766e;
      outline: none;
    }

    .rte-blocks-library-item.active {
      border-color: #0f766e;
      background: rgba(15, 118, 110, 0.12);
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-item {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-item.active {
      border-color: #2dd4bf;
      background: rgba(45, 212, 191, 0.15);
    }

    .rte-blocks-library-item-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .rte-blocks-library-item-label {
      font-size: 13px;
      line-height: 1.3;
      font-weight: 700;
    }

    .rte-blocks-library-recent-pill {
      font-size: 10px;
      line-height: 1;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      color: #0f766e;
      border: 1px solid rgba(15, 118, 110, 0.38);
      border-radius: 999px;
      padding: 2px 6px;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-recent-pill {
      color: #5eead4;
      border-color: rgba(94, 234, 212, 0.45);
    }

    .rte-blocks-library-item-meta,
    .rte-blocks-library-item-description,
    .rte-blocks-library-item-preview {
      font-size: 11px;
      line-height: 1.3;
      color: #64748b;
    }

    .rte-blocks-library-item-preview {
      color: #334155;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-item-meta,
    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-item-description {
      color: #94a3b8;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-item-preview {
      color: #cbd5e1;
    }

    .rte-blocks-library-empty {
      margin: 8px;
      font-size: 12px;
      color: #64748b;
    }

    .rte-blocks-library-actions {
      display: flex;
      gap: 8px;
    }

    .rte-blocks-library-btn {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      min-height: 34px;
      padding: 0 12px;
      background: #ffffff;
      color: inherit;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }

    .rte-blocks-library-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .rte-blocks-library-btn-primary {
      border-color: #0f766e;
      background: #0f766e;
      color: #f8fafc;
    }

    .rte-blocks-library-btn-primary:hover,
    .rte-blocks-library-btn-primary:focus-visible {
      border-color: #115e59;
      background: #115e59;
      outline: none;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-btn {
      border-color: #334155;
      background: #111827;
      color: #e2e8f0;
    }

    .${PANEL_CLASS}.rte-blocks-library-theme-dark .rte-blocks-library-btn-primary {
      border-color: #14b8a6;
      background: #0f766e;
      color: #f0fdfa;
    }

    .rte-blocks-library-live {
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
    }
  `;

  document.head.appendChild(style);
}

export const BlocksLibraryPlugin = (rawOptions: BlocksLibraryPluginOptions = {}): Plugin => {
  const options = normalizeOptions(rawOptions);
  const instanceEditors = new Set<HTMLElement>();

  ensureStylesInjected();

  return {
    name: 'blocksLibrary',

    toolbar: [
      {
        id: 'blocksLibraryGroup',
        label: 'Blocks Library',
        type: 'group',
        command: 'blocksLibrary',
        items: [
          {
            id: 'blocksLibraryPanel',
            label: 'Blocks Library Panel',
            command: 'toggleBlocksLibraryPanel',
            shortcut: 'Mod-Alt-Shift-b',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><rect x="4" y="5" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="5" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="4" y="13" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="13" y="13" width="7" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6"/></svg>',
          },
          {
            id: 'insertLastBlockSnippet',
            label: 'Insert Last Block',
            command: 'insertLastBlockSnippet',
            shortcut: 'Mod-Alt-Shift-l',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true"><path d="M7 5.5h10a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 17 18.5H7A1.5 1.5 0 0 1 5.5 17V7A1.5 1.5 0 0 1 7 5.5Z" stroke="currentColor" stroke-width="1.6"/><path d="M12 8.5v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8.5 12h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
          },
        ],
      },
    ],

    commands: {
      blocksLibrary: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        showPanel(editor);
        return true;
      },

      openBlocksLibraryPanel: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        showPanel(editor);
        return true;
      },

      toggleBlocksLibraryPanel: (
        value?: boolean,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        return togglePanel(editor, typeof value === 'boolean' ? value : undefined);
      },

      insertBlockSnippet: (
        value?: string | { id?: string },
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        const blockId = typeof value === 'string' ? value : value?.id;
        if (!blockId) return false;

        lastActiveEditor = editor;
        return insertBlockById(editor, blockId);
      },

      insertLastBlockSnippet: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        lastActiveEditor = editor;
        return insertLastBlock(editor);
      },

      refreshBlocksLibraryData: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);
        optionsByEditor.set(editor, resolved);

        void ensureBlocksLoaded(editor, true);
        return true;
      },

      setBlocksLibraryOptions: (
        value?: Partial<BlocksLibraryPluginOptions>,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor || !value || typeof value !== 'object') return false;

        const current = optionsByEditor.get(editor) || options;
        const currentRaw = rawOptionsByEditor.get(editor) || toRawOptions(current);

        const mergedRaw: BlocksLibraryPluginOptions = {
          ...currentRaw,
          ...value,
          labels: {
            ...(currentRaw.labels || {}),
            ...(value.labels || {}),
          },
          blocks: Array.isArray(value.blocks) ? value.blocks : currentRaw.blocks,
          normalizeText: value.normalizeText || current.normalizeText,
          sanitizeBlockHtml: value.sanitizeBlockHtml || current.sanitizeBlockHtml,
          getBlocks: value.getBlocks || current.getBlocks,
        };

        const merged = normalizeOptions(mergedRaw);
        const hasBlocksOverride = Array.isArray(value.blocks);
        const getBlocksChanged = value.getBlocks !== undefined;

        optionsByEditor.set(editor, merged);
        rawOptionsByEditor.set(editor, mergedRaw);

        if (hasBlocksOverride || getBlocksChanged || !blocksByEditor.has(editor)) {
          blocksByEditor.set(editor, merged.blocks);
          blocksCacheTimeByEditor.set(editor, getBlocksChanged ? 0 : Date.now());
        }

        const state = ensureState(editor, merged);
        state.filterCache.clear();

        if (typeof value.defaultCategory === 'string') {
          state.category = toCategoryKey(merged.defaultCategory) || 'all';
        }

        refreshPanel(editor);
        updateToolbarState(editor);
        if (getBlocksChanged) {
          void ensureBlocksLoaded(editor, true);
        }

        return true;
      },

      getBlocksLibraryState: (
        value?: ((state: BlocksLibraryRuntimeState) => void) | unknown,
        context?: { editorElement?: unknown; contentElement?: unknown },
      ) => {
        const editor = resolveEditorFromContext(context, false, false);
        if (!editor) return false;

        const resolved = optionsByEditor.get(editor) || options;
        ensureState(editor, resolved);

        const snapshot = getRuntimeStateSnapshot(editor);

        if (typeof value === 'function') {
          try {
            (value as (state: BlocksLibraryRuntimeState) => void)(snapshot);
          } catch {
            // Ignore callback errors.
          }
        }

        (editor as any).__blocksLibraryState = snapshot;
        editor.dispatchEvent(
          new CustomEvent('editora:blocks-library-state', {
            bubbles: true,
            detail: snapshot,
          }),
        );

        return true;
      },
    },

    keymap: {
      'Mod-Alt-Shift-b': 'toggleBlocksLibraryPanel',
      'Mod-Alt-Shift-B': 'toggleBlocksLibraryPanel',
      'Mod-Alt-Shift-l': 'insertLastBlockSnippet',
      'Mod-Alt-Shift-L': 'insertLastBlockSnippet',
    },

    init: function init(this: any, context?: { editorElement?: HTMLElement }) {
      pluginInstanceCount += 1;

      const runtimeRaw =
        this && typeof this.__pluginConfig === 'object'
          ? ({ ...rawOptions, ...(this.__pluginConfig as BlocksLibraryPluginOptions) } as BlocksLibraryPluginOptions)
          : rawOptions;

      const runtimeConfig = normalizeOptions(runtimeRaw);
      bindGlobalHandlers(runtimeConfig);

      const editor = resolveEditorFromContext(
        context?.editorElement ? { editorElement: context.editorElement } : undefined,
        false,
        false,
      );

      if (!editor) return;

      lastActiveEditor = editor;
      instanceEditors.add(editor);

      ensureState(editor, runtimeConfig);
      optionsByEditor.set(editor, runtimeConfig);
      rawOptionsByEditor.set(editor, runtimeRaw);
      blocksByEditor.set(editor, runtimeConfig.blocks);
      blocksCacheTimeByEditor.set(editor, Date.now());
      updateToolbarState(editor);
    },

    destroy: () => {
      instanceEditors.forEach((editor) => cleanupEditor(editor));
      instanceEditors.clear();

      pluginInstanceCount = Math.max(0, pluginInstanceCount - 1);
      if (pluginInstanceCount > 0) return;

      unbindGlobalHandlers();
    },
  };
};
