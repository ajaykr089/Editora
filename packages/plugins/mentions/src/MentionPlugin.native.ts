import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const EDITOR_HOST_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const MENTION_SELECTOR = '.rte-mention[data-mention="true"]';
const DARK_THEME_SELECTOR =
  ':is([data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark)';

export interface MentionItem {
  id: string;
  label: string;
  value?: string;
  meta?: string;
}

export interface MentionPluginOptions {
  triggerChars?: string[];
  minChars?: number;
  maxQueryLength?: number;
  maxSuggestions?: number;
  items?: MentionItem[];
  api?: MentionApiConfig;
  search?: (query: string, trigger: string) => MentionItem[] | Promise<MentionItem[]>;
  itemRenderer?: (item: MentionItem, query: string) => string;
  emptyStateText?: string;
  noResultsText?: string;
  loadingText?: string;
  insertSpaceAfterMention?: boolean;
}

export interface MentionApiRequestContext {
  query: string;
  trigger: string;
  limit: number;
  signal: AbortSignal;
}

export interface MentionApiConfig {
  url: string;
  method?: string;
  headers?: Record<string, string> | ((ctx: MentionApiRequestContext) => Record<string, string>);
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
  queryParam?: string;
  triggerParam?: string;
  limitParam?: string;
  staticParams?: Record<string, string>;
  body?: Record<string, unknown> | BodyInit | ((ctx: MentionApiRequestContext) => Record<string, unknown> | BodyInit | undefined);
  buildRequest?: (ctx: MentionApiRequestContext) => { url: string; init?: RequestInit };
  responseType?: 'json' | 'text';
  responsePath?: string;
  mapItem?: (raw: unknown, index: number) => MentionItem | null;
  transformResponse?: (response: unknown, ctx: MentionApiRequestContext) => MentionItem[];
  debounceMs?: number;
  timeoutMs?: number;
  onError?: (error: unknown, ctx: MentionApiRequestContext) => void;
}

interface MentionState {
  editor: HTMLElement;
  panel: HTMLDivElement | null;
  list: HTMLDivElement | null;
  replaceRange: Range | null;
  items: MentionItem[];
  activeIndex: number;
  query: string;
  trigger: string;
  loading: boolean;
  isOpen: boolean;
  requestId: number;
  debounceHandle: number | null;
  abortController: AbortController | null;
}

interface MentionHandlers {
  beforeInput: (event: InputEvent) => void;
  input: (event: Event) => void;
  keydown: (event: KeyboardEvent) => void;
  click: (event: MouseEvent) => void;
  blur: () => void;
  mousedown: (event: MouseEvent) => void;
}

const editorStates = new WeakMap<HTMLElement, MentionState>();
const editorHandlers = new WeakMap<HTMLElement, MentionHandlers>();
let stylesInjected = false;
let globalFocusInBound = false;
let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let pluginInstanceCount = 0;

function recordDomHistoryTransaction(editor: HTMLElement, beforeHTML: string): void {
  if (beforeHTML === editor.innerHTML) return;
  const executor = (window as any).execEditorCommand || (window as any).executeEditorCommand;
  if (typeof executor !== 'function') return;
  try {
    executor('recordDomTransaction', editor, beforeHTML, editor.innerHTML);
  } catch {
    // History plugin might not be loaded.
  }
}

function dispatchEditorInput(editor: HTMLElement): void {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function setSelectionRange(editor: HTMLElement, range: Range): void {
  const selection = window.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
  editor.focus({ preventScroll: true });
}

function rangesEqual(a: Range, b: Range): boolean {
  return (
    a.startContainer === b.startContainer &&
    a.startOffset === b.startOffset &&
    a.endContainer === b.endContainer &&
    a.endOffset === b.endOffset
  );
}

function getSelectionRangeInEditor(editor: HTMLElement): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return null;
  return range.cloneRange();
}

function normalizeMentionNodes(editor: HTMLElement): void {
  const mentions = Array.from(editor.querySelectorAll(MENTION_SELECTOR)) as HTMLElement[];
  mentions.forEach((mention) => {
    mention.setAttribute('data-mention', 'true');
    mention.setAttribute('contenteditable', 'false');
    mention.setAttribute('spellcheck', 'false');
    mention.setAttribute('draggable', 'false');
    mention.classList.add('rte-mention');
  });
}

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const host = editor.closest(EDITOR_HOST_SELECTOR) as HTMLElement | null;
  return host || editor;
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

function applyPanelThemeClass(panel: HTMLElement, editor: HTMLElement): void {
  panel.classList.remove('rte-mention-theme-dark');
  if (shouldUseDarkTheme(editor)) {
    panel.classList.add('rte-mention-theme-dark');
  }
}

function resolveEditorFromContext(context?: { editorElement?: unknown; contentElement?: unknown }): HTMLElement | null {
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

  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

function isBoundaryChar(ch: string | undefined): boolean {
  if (!ch) return true;
  return /\s|[([{"'`]/.test(ch);
}

function getTextContextForCaret(range: Range): { node: Text; textBefore: string; caretOffset: number } | null {
  if (!range.collapsed) return null;

  const container = range.startContainer;
  const offset = range.startOffset;

  if (container.nodeType === Node.TEXT_NODE) {
    const node = container as Text;
    return {
      node,
      textBefore: node.data.slice(0, offset),
      caretOffset: offset,
    };
  }

  if (container.nodeType === Node.ELEMENT_NODE) {
    const element = container as Element;
    if (offset > 0) {
      const prevNode = element.childNodes[offset - 1];
      if (prevNode && prevNode.nodeType === Node.TEXT_NODE) {
        const node = prevNode as Text;
        return {
          node,
          textBefore: node.data,
          caretOffset: node.length,
        };
      }
    }
  }

  return null;
}

function detectMentionQuery(
  textBefore: string,
  triggerChars: string[],
  maxQueryLength: number,
): { trigger: string; query: string; startOffset: number } | null {
  let bestIndex = -1;
  let bestTrigger = '';

  triggerChars.forEach((trigger) => {
    const idx = textBefore.lastIndexOf(trigger);
    if (idx > bestIndex) {
      bestIndex = idx;
      bestTrigger = trigger;
    }
  });

  if (bestIndex < 0) return null;
  if (!isBoundaryChar(textBefore[bestIndex - 1])) return null;

  const query = textBefore.slice(bestIndex + 1);
  if (/\s/.test(query)) return null;
  if (query.length > maxQueryLength) return null;

  return {
    trigger: bestTrigger,
    query,
    startOffset: bestIndex,
  };
}

function getCaretRect(editor: HTMLElement, range: Range): DOMRect {
  const clone = range.cloneRange();
  clone.collapse(false);

  const rects = clone.getClientRects();
  if (rects.length > 0) {
    return rects[rects.length - 1] as DOMRect;
  }

  const marker = document.createElement('span');
  marker.textContent = '\u200b';
  marker.style.position = 'relative';
  clone.insertNode(marker);
  const rect = marker.getBoundingClientRect();
  marker.remove();
  editor.normalize();
  return rect;
}

function ensurePanel(state: MentionState, options: Required<MentionPluginOptions>): void {
  if (state.panel && state.list) return;

  const panel = document.createElement('div');
  panel.className = 'rte-mention-panel';
  panel.style.display = 'none';

  const list = document.createElement('div');
  list.className = 'rte-mention-list';

  panel.appendChild(list);
  document.body.appendChild(panel);
  applyPanelThemeClass(panel, state.editor);

  state.panel = panel;
  state.list = list;

  panel.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const itemEl = target.closest('.rte-mention-item') as HTMLElement | null;
    if (!itemEl) return;

    const index = Number(itemEl.getAttribute('data-index'));
    if (!Number.isFinite(index)) return;
    selectMentionAtIndex(state, options, index);
  });
}

function closeMentionPanel(state: MentionState): void {
  if (!state.panel) return;
  if (state.debounceHandle !== null) {
    window.clearTimeout(state.debounceHandle);
    state.debounceHandle = null;
  }
  if (state.abortController) {
    state.abortController.abort();
    state.abortController = null;
  }
  state.panel.style.display = 'none';
  state.panel.classList.remove('show');
  state.isOpen = false;
  state.loading = false;
  state.items = [];
  state.activeIndex = 0;
  state.query = '';
  state.replaceRange = null;
}

function positionPanel(state: MentionState, range: Range): void {
  if (!state.panel) return;
  applyPanelThemeClass(state.panel, state.editor);
  const caretRect = getCaretRect(state.editor, range);

  const panel = state.panel;
  panel.style.display = 'block';
  panel.classList.add('show');
  panel.style.left = '0px';
  panel.style.top = '0px';

  const panelRect = panel.getBoundingClientRect();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let left = Math.max(8, Math.min(caretRect.left, viewportW - panelRect.width - 8));
  let top = caretRect.bottom + 8;

  if (top + panelRect.height > viewportH - 8) {
    top = Math.max(8, caretRect.top - panelRect.height - 8);
  }

  panel.style.position = 'fixed';
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function highlightMatch(label: string, query: string): string {
  if (!query) return escapeHtml(label);
  const lower = label.toLowerCase();
  const queryLower = query.toLowerCase();
  const idx = lower.indexOf(queryLower);
  if (idx < 0) return escapeHtml(label);

  const start = escapeHtml(label.slice(0, idx));
  const match = escapeHtml(label.slice(idx, idx + query.length));
  const end = escapeHtml(label.slice(idx + query.length));
  return `${start}<mark>${match}</mark>${end}`;
}

function renderMentionList(state: MentionState, options: Required<MentionPluginOptions>): void {
  if (!state.list) return;

  const list = state.list;
  list.innerHTML = '';

  if (state.loading) {
    const loading = document.createElement('div');
    loading.className = 'rte-mention-empty';
    loading.textContent = options.loadingText;
    list.appendChild(loading);
    return;
  }

  if (state.items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'rte-mention-empty';
    empty.textContent = state.query.length > 0 ? options.noResultsText : options.emptyStateText;
    list.appendChild(empty);
    return;
  }

  state.items.forEach((item, index) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'rte-mention-item';
    if (index === state.activeIndex) {
      row.classList.add('active');
    }
    row.setAttribute('data-index', String(index));

    const contentHtml = options.itemRenderer
      ? options.itemRenderer(item, state.query)
      : `<span class="rte-mention-item-label">${highlightMatch(item.label, state.query)}</span>${
          item.meta ? `<span class="rte-mention-item-meta">${escapeHtml(item.meta)}</span>` : ''
        }`;

    row.innerHTML = contentHtml;
    list.appendChild(row);
  });
}

function normalizeMentionItems(items: MentionItem[], maxSuggestions: number): MentionItem[] {
  const seen = new Set<string>();
  const result: MentionItem[] = [];

  items.forEach((item) => {
    const id = (item.id || '').trim();
    if (!id || seen.has(id)) return;
    seen.add(id);
    result.push({
      id,
      label: item.label || id,
      value: item.value,
      meta: item.meta,
    });
  });

  return result.slice(0, maxSuggestions);
}

function buildMentionApiRequest(
  api: MentionApiConfig,
  ctx: MentionApiRequestContext,
): { url: string; init: RequestInit } {
  if (api.buildRequest) {
    const built = api.buildRequest(ctx);
    return {
      url: built.url,
      init: built.init || {},
    };
  }

  const method = (api.method || 'GET').toUpperCase();
  const headers = typeof api.headers === 'function' ? api.headers(ctx) : (api.headers || {});
  const queryParam = api.queryParam || 'q';
  const triggerParam = api.triggerParam || 'trigger';
  const limitParam = api.limitParam || 'limit';
  const staticParams = api.staticParams || {};

  const init: RequestInit = {
    method,
    headers: { ...headers },
    credentials: api.credentials,
    mode: api.mode,
    cache: api.cache,
    signal: ctx.signal,
  };

  const url = new URL(api.url, window.location.origin);

  if (method === 'GET' || method === 'HEAD') {
    const params = new URLSearchParams(url.search);
    Object.entries(staticParams).forEach(([key, value]) => params.set(key, String(value)));
    params.set(queryParam, ctx.query);
    params.set(triggerParam, ctx.trigger);
    params.set(limitParam, String(ctx.limit));
    url.search = params.toString();
  } else {
    const providedBody =
      typeof api.body === 'function'
        ? api.body(ctx)
        : api.body;

    const defaultBody: Record<string, unknown> = {
      [queryParam]: ctx.query,
      [triggerParam]: ctx.trigger,
      [limitParam]: ctx.limit,
      ...staticParams,
    };

    const body = providedBody ?? defaultBody;
    if (isPlainObject(body)) {
      init.body = JSON.stringify(body);
      const normalizedHeaders = init.headers as Record<string, string>;
      if (!normalizedHeaders['Content-Type'] && !normalizedHeaders['content-type']) {
        normalizedHeaders['Content-Type'] = 'application/json';
      }
    } else {
      init.body = body as BodyInit;
    }
  }

  return { url: url.toString(), init };
}

async function fetchMentionItemsFromApi(
  state: MentionState,
  options: Required<MentionPluginOptions>,
  query: string,
  trigger: string,
): Promise<MentionItem[]> {
  const api = options.api;
  if (!api) return [];

  if (state.abortController) {
    state.abortController.abort();
  }

  const controller = new AbortController();
  state.abortController = controller;

  const ctx: MentionApiRequestContext = {
    query,
    trigger,
    limit: options.maxSuggestions,
    signal: controller.signal,
  };

  const timeoutMs = Math.max(0, api.timeoutMs ?? 10000);
  let timeoutHandle: number | null = null;
  if (timeoutMs > 0) {
    timeoutHandle = window.setTimeout(() => controller.abort(), timeoutMs);
  }

  try {
    const { url, init } = buildMentionApiRequest(api, ctx);
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Mention API request failed: ${response.status}`);
    }

    const responseType = api.responseType || 'json';
    const rawResponse = responseType === 'text' ? await response.text() : await response.json();

    let items: MentionItem[] = [];
    if (api.transformResponse) {
      items = api.transformResponse(rawResponse, ctx) || [];
    } else {
      const payload = getValueByPath(rawResponse, api.responsePath);
      const arrayPayload = Array.isArray(payload) ? payload : Array.isArray(rawResponse) ? rawResponse : [];
      items = arrayPayload
        .map((raw, index) => {
          if (api.mapItem) {
            return api.mapItem(raw, index);
          }
          if (!isPlainObject(raw)) return null;
          const id = String((raw as any).id ?? (raw as any).value ?? (raw as any).key ?? '').trim();
          if (!id) return null;
          const label = String((raw as any).label ?? (raw as any).name ?? id).trim();
          return {
            id,
            label,
            value: (raw as any).value ? String((raw as any).value) : undefined,
            meta: (raw as any).meta ? String((raw as any).meta) : undefined,
          } as MentionItem;
        })
        .filter((item): item is MentionItem => Boolean(item));
    }

    return normalizeMentionItems(items, options.maxSuggestions);
  } catch (error) {
    if ((error as any)?.name !== 'AbortError') {
      api.onError?.(error, ctx);
    }
    return [];
  } finally {
    if (timeoutHandle !== null) {
      window.clearTimeout(timeoutHandle);
    }
    if (state.abortController === controller) {
      state.abortController = null;
    }
  }
}

async function resolveSuggestions(
  state: MentionState,
  options: Required<MentionPluginOptions>,
  query: string,
  trigger: string,
): Promise<MentionItem[]> {
  const requestId = ++state.requestId;
  let items: MentionItem[] = [];

  if (options.search) {
    const result = await options.search(query, trigger);
    items = Array.isArray(result) ? result : [];
  } else if (options.api) {
    items = await fetchMentionItemsFromApi(state, options, query, trigger);
  } else {
    const queryLower = query.toLowerCase();
    items = options.items.filter((item) => {
      if (!queryLower) return true;
      return item.label.toLowerCase().includes(queryLower) || item.id.toLowerCase().includes(queryLower);
    });
  }

  if (requestId !== state.requestId) {
    return [];
  }

  return normalizeMentionItems(items, options.maxSuggestions);
}

function insertMentionToken(state: MentionState, options: Required<MentionPluginOptions>, item: MentionItem): boolean {
  const editor = state.editor;
  normalizeMentionNodes(editor);
  const selection = window.getSelection();
  if (!selection) return false;

  const beforeHTML = editor.innerHTML;

  let range = state.replaceRange ? state.replaceRange.cloneRange() : getSelectionRangeInEditor(editor);
  if (!range) return false;

  if (!editor.contains(range.commonAncestorContainer)) {
    range = getSelectionRangeInEditor(editor);
    if (!range) return false;
  }

  const safeRange = normalizeRangeOutsideMention(editor, range.cloneRange(), 'after');
  if (!rangesEqual(safeRange, range)) {
    setSelectionRange(editor, safeRange);
    range = safeRange;
  }

  range.deleteContents();

  const mention = document.createElement('span');
  mention.className = 'rte-mention';
  mention.setAttribute('data-mention', 'true');
  mention.setAttribute('data-mention-id', item.id);
  mention.setAttribute('contenteditable', 'false');
  mention.textContent = item.value || `${state.trigger}${item.label}`;

  range.insertNode(mention);

  let caretNode: Node = mention;
  let caretOffset = 1;

  if (options.insertSpaceAfterMention) {
    const space = document.createTextNode(' ');
    mention.after(space);
    caretNode = space;
    caretOffset = 1;
  }

  const nextRange = document.createRange();
  nextRange.setStart(caretNode, caretOffset);
  nextRange.collapse(true);
  setSelectionRange(editor, nextRange);

  closeMentionPanel(state);
  normalizeMentionNodes(editor);
  dispatchEditorInput(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
  return true;
}

function selectMentionAtIndex(state: MentionState, options: Required<MentionPluginOptions>, index: number): void {
  if (index < 0 || index >= state.items.length) return;
  const item = state.items[index];
  insertMentionToken(state, options, item);
}

function getSingleSelectedNode(range: Range): Node | null {
  if (range.startContainer !== range.endContainer) return null;
  if (range.startContainer.nodeType !== Node.ELEMENT_NODE) return null;
  if (range.endOffset - range.startOffset !== 1) return null;
  const container = range.startContainer as Element;
  return container.childNodes[range.startOffset] || null;
}

function getSelectedMentionNode(range: Range, editor: HTMLElement): HTMLElement | null {
  const node = getSingleSelectedNode(range);
  if (!(node instanceof HTMLElement)) return null;
  if (!node.matches(MENTION_SELECTOR)) return null;
  if (!editor.contains(node)) return null;
  return node;
}

function getMentionFromRange(range: Range, editor: HTMLElement): HTMLElement | null {
  const selectedMention = getSelectedMentionNode(range, editor);
  if (selectedMention) return selectedMention;

  const startElement = getElementFromNode(range.startContainer);
  const startMention = startElement?.closest(MENTION_SELECTOR) as HTMLElement | null;
  if (startMention && editor.contains(startMention)) return startMention;

  const endElement = getElementFromNode(range.endContainer);
  const endMention = endElement?.closest(MENTION_SELECTOR) as HTMLElement | null;
  if (endMention && editor.contains(endMention)) return endMention;

  return null;
}

function normalizeRangeOutsideMention(editor: HTMLElement, range: Range, direction: 'before' | 'after' = 'after'): Range {
  const mention = getMentionFromRange(range, editor);
  if (!mention) return range;

  const normalized = document.createRange();
  if (direction === 'before') {
    normalized.setStartBefore(mention);
  } else {
    normalized.setStartAfter(mention);
  }
  normalized.collapse(true);
  return normalized;
}

function moveCaretOutsideMentionNode(editor: HTMLElement, mention: HTMLElement, direction: 'before' | 'after' = 'after'): void {
  const range = document.createRange();
  if (direction === 'before') {
    range.setStartBefore(mention);
  } else {
    range.setStartAfter(mention);
  }
  range.collapse(true);
  setSelectionRange(editor, range);
}

function getAdjacentMention(range: Range, direction: 'backward' | 'forward', editor: HTMLElement): HTMLElement | null {
  if (!range.collapsed) return null;

  const container = range.startContainer;
  const offset = range.startOffset;
  let node: Node | null = null;

  if (container.nodeType === Node.TEXT_NODE) {
    const textNode = container as Text;
    if (direction === 'backward' && offset === 0) {
      node = textNode.previousSibling;
    } else if (direction === 'forward' && offset === textNode.length) {
      node = textNode.nextSibling;
    }
  } else if (container.nodeType === Node.ELEMENT_NODE) {
    const element = container as Element;
    if (direction === 'backward' && offset > 0) {
      node = element.childNodes[offset - 1] || null;
    } else if (direction === 'forward' && offset < element.childNodes.length) {
      node = element.childNodes[offset] || null;
    }
  }

  if (!(node instanceof HTMLElement)) return null;
  if (!node.matches(MENTION_SELECTOR)) return null;
  if (!editor.contains(node)) return null;
  return node;
}

function removeAdjacentMention(editor: HTMLElement, direction: 'backward' | 'forward'): boolean {
  const range = getSelectionRangeInEditor(editor);
  if (!range) return false;

  const mention = getAdjacentMention(range, direction, editor);
  if (!mention) return false;

  const parent = mention.parentNode;
  if (!parent) return false;

  const beforeHTML = editor.innerHTML;
  const index = Array.prototype.indexOf.call(parent.childNodes, mention) as number;
  mention.remove();

  const nextRange = document.createRange();
  nextRange.setStart(parent, Math.max(0, index));
  nextRange.collapse(true);
  setSelectionRange(editor, nextRange);

  dispatchEditorInput(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
  return true;
}

function updateMentionPanel(
  state: MentionState,
  options: Required<MentionPluginOptions>,
  range: Range,
  query: string,
  trigger: string,
  replaceRange: Range,
): void {
  ensurePanel(state, options);
  state.query = query;
  state.trigger = trigger;
  state.replaceRange = replaceRange.cloneRange();
  state.loading = Boolean(options.api && !options.search);

  if (state.debounceHandle !== null) {
    window.clearTimeout(state.debounceHandle);
    state.debounceHandle = null;
  }

  if (!state.panel) return;

  if (!state.isOpen) {
    state.panel.style.display = 'block';
    state.panel.classList.add('show');
    state.isOpen = true;
  }

  renderMentionList(state, options);
  positionPanel(state, range);

  const runQuery = () => {
    state.debounceHandle = null;
    void resolveSuggestions(state, options, query, trigger).then((items) => {
      state.loading = false;
      state.items = items;
      state.activeIndex = 0;

      if (!state.panel) return;
      renderMentionList(state, options);
      positionPanel(state, range);
    });
  };

  const debounceMs = options.api && !options.search
    ? Math.max(0, options.api.debounceMs ?? 180)
    : 0;

  if (debounceMs > 0) {
    state.debounceHandle = window.setTimeout(runQuery, debounceMs);
  } else {
    runQuery();
  }
}

function handleEditorInput(state: MentionState, options: Required<MentionPluginOptions>): void {
  const editor = state.editor;
  normalizeMentionNodes(editor);
  let range = getSelectionRangeInEditor(editor);
  if (!range || !range.collapsed) {
    closeMentionPanel(state);
    return;
  }

  const normalized = normalizeRangeOutsideMention(editor, range.cloneRange(), 'after');
  if (!rangesEqual(normalized, range)) {
    setSelectionRange(editor, normalized);
    range = normalized;
    closeMentionPanel(state);
    return;
  }

  const context = getTextContextForCaret(range);
  if (!context) {
    closeMentionPanel(state);
    return;
  }

  const detected = detectMentionQuery(context.textBefore, options.triggerChars, options.maxQueryLength);
  if (!detected) {
    closeMentionPanel(state);
    return;
  }

  if (detected.query.length < options.minChars) {
    closeMentionPanel(state);
    return;
  }

  const replaceRange = range.cloneRange();
  replaceRange.setStart(context.node, detected.startOffset);
  replaceRange.setEnd(context.node, context.caretOffset);

  updateMentionPanel(state, options, range, detected.query, detected.trigger, replaceRange);
}

function moveActiveMention(state: MentionState, delta: number): void {
  if (state.items.length === 0) return;
  const count = state.items.length;
  state.activeIndex = ((state.activeIndex + delta) % count + count) % count;

  if (!state.list) return;
  const rows = Array.from(state.list.querySelectorAll('.rte-mention-item')) as HTMLElement[];
  rows.forEach((row, idx) => row.classList.toggle('active', idx === state.activeIndex));
  const active = rows[state.activeIndex];
  active?.scrollIntoView({ block: 'nearest' });
}

function createMentionState(editor: HTMLElement): MentionState {
  return {
    editor,
    panel: null,
    list: null,
    replaceRange: null,
    items: [],
    activeIndex: 0,
    query: '',
    trigger: '@',
    loading: false,
    isOpen: false,
    requestId: 0,
    debounceHandle: null,
    abortController: null,
  };
}

function destroyMentionState(editor: HTMLElement): void {
  const state = editorStates.get(editor);
  if (!state) return;

  if (state.panel?.parentNode) {
    state.panel.parentNode.removeChild(state.panel);
  }

  editorStates.delete(editor);
}

function attachEditorHandlers(editor: HTMLElement, state: MentionState, options: Required<MentionPluginOptions>): void {
  if (editorHandlers.has(editor)) return;
  normalizeMentionNodes(editor);

  const handlers: MentionHandlers = {
    beforeInput: (event: InputEvent) => {
      normalizeMentionNodes(editor);
      const range = getSelectionRangeInEditor(editor);
      if (!range) return;

      const mention = getMentionFromRange(range, editor);
      if (!mention) return;

      const inputType = event.inputType || '';
      if (!inputType.startsWith('insert')) return;

      event.preventDefault();
      moveCaretOutsideMentionNode(editor, mention, 'after');

      if (inputType === 'insertParagraph' || inputType === 'insertLineBreak') {
        const command = inputType === 'insertLineBreak' ? 'insertLineBreak' : 'insertParagraph';
        document.execCommand(command, false);
        return;
      }

      if (inputType === 'insertText' || inputType === 'insertCompositionText') {
        const text = event.data || '';
        if (!text) return;
        document.execCommand('insertText', false, text);
      }
    },
    input: () => {
      handleEditorInput(state, options);
    },
    keydown: (event: KeyboardEvent) => {
      if (state.isOpen) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          moveActiveMention(state, 1);
          return;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          moveActiveMention(state, -1);
          return;
        }

        if (event.key === 'Enter' || event.key === 'Tab') {
          event.preventDefault();
          selectMentionAtIndex(state, options, state.activeIndex);
          return;
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          closeMentionPanel(state);
          return;
        }
      }

      const currentRange = getSelectionRangeInEditor(editor);
      if (currentRange) {
        const normalized = normalizeRangeOutsideMention(editor, currentRange.cloneRange(), 'after');
        if (!rangesEqual(normalized, currentRange)) {
          if (event.key === 'Enter') {
            event.preventDefault();
            setSelectionRange(editor, normalized);
            document.execCommand('insertParagraph', false);
            return;
          }

          const isPrintable = event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey;
          if (isPrintable) {
            setSelectionRange(editor, normalized);
          }
        }
      }

      if (event.key === 'Backspace') {
        if (removeAdjacentMention(editor, 'backward')) {
          event.preventDefault();
          return;
        }
      }

      if (event.key === 'Delete') {
        if (removeAdjacentMention(editor, 'forward')) {
          event.preventDefault();
          return;
        }
      }
    },
    click: (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const element = target.nodeType === Node.ELEMENT_NODE ? (target as HTMLElement) : target.parentElement;
      const mention = element?.closest(MENTION_SELECTOR) as HTMLElement | null;
      if (!mention || !editor.contains(mention)) return;

      event.preventDefault();
      event.stopPropagation();
      moveCaretOutsideMentionNode(editor, mention, 'after');
      closeMentionPanel(state);
    },
    blur: () => {
      window.setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        if (state.panel && active && state.panel.contains(active)) return;
        closeMentionPanel(state);
      }, 0);
    },
    mousedown: (event: MouseEvent) => {
      if (!state.isOpen || !state.panel) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (!state.panel.contains(target) && !editor.contains(target)) {
        closeMentionPanel(state);
      }
    },
  };

  editor.addEventListener('beforeinput', handlers.beforeInput as EventListener);
  editor.addEventListener('input', handlers.input);
  editor.addEventListener('keydown', handlers.keydown);
  editor.addEventListener('click', handlers.click);
  editor.addEventListener('blur', handlers.blur);
  document.addEventListener('mousedown', handlers.mousedown, true);
  editorHandlers.set(editor, handlers);
}

function detachEditorHandlers(editor: HTMLElement): void {
  const handlers = editorHandlers.get(editor);
  if (!handlers) return;

  editor.removeEventListener('beforeinput', handlers.beforeInput as EventListener);
  editor.removeEventListener('input', handlers.input);
  editor.removeEventListener('keydown', handlers.keydown);
  editor.removeEventListener('click', handlers.click);
  editor.removeEventListener('blur', handlers.blur);
  document.removeEventListener('mousedown', handlers.mousedown, true);
  editorHandlers.delete(editor);
}

function ensureStylesInjected(): void {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.id = 'rte-mention-plugin-styles';
  style.textContent = `
    .rte-mention {
      display: inline-block;
      padding: 0 6px;
      margin: 0 1px;
      border-radius: 10px;
      background: #e8f0ff;
      color: #1d4ed8;
      font-weight: 600;
      line-height: 1.6;
      white-space: nowrap;
      cursor: pointer;
    }

    .rte-mention-panel {
      width: min(320px, calc(100vw - 16px));
      max-height: min(320px, calc(100vh - 32px));
      overflow: hidden;
      border: 1px solid #d9dfeb;
      border-radius: 3px;
      background: #ffffff;
      box-shadow: 0 18px 40px rgba(15, 23, 42, 0.2);
      z-index: 2147483646;
    }

    .rte-mention-list {
      max-height: min(300px, calc(100vh - 56px));
      overflow: auto;
      padding: 0px;
    }

    .rte-mention-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      border: none;
      background: transparent;
      padding: 10px 12px;
      border-radius: 0px;
      color: #0f172a;
      text-align: left;
      cursor: pointer;
      font: inherit;
    }

    .rte-mention-item:hover,
    .rte-mention-item.active {
      background: #eff6ff;
      color: #1d4ed8;
    }

    .rte-mention-item-label mark {
      background: rgba(59, 130, 246, 0.16);
      color: inherit;
      padding: 0 2px;
      border-radius: 3px;
    }

    .rte-mention-item-meta {
      font-size: 12px;
      color: #64748b;
      white-space: nowrap;
    }

    .rte-mention-empty {
      padding: 12px;
      color: #64748b;
      font-size: 13px;
      text-align: center;
    }

    ${DARK_THEME_SELECTOR} .rte-mention {
      background: rgba(37, 99, 235, 0.25);
      color: #bfdbfe;
    }

    ${DARK_THEME_SELECTOR} .rte-mention-panel,
    .rte-mention-panel.rte-mention-theme-dark {
      border-color: #364152;
      background: #1f2937;
      box-shadow: 0 22px 44px rgba(0, 0, 0, 0.48);
    }

    ${DARK_THEME_SELECTOR} .rte-mention-item,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item {
      color: #e5e7eb;
    }

    ${DARK_THEME_SELECTOR} .rte-mention-item:hover,
    ${DARK_THEME_SELECTOR} .rte-mention-item.active,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item:hover,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item.active {
      background: #334155;
      color: #bfdbfe;
    }

    ${DARK_THEME_SELECTOR} .rte-mention-item-meta,
    ${DARK_THEME_SELECTOR} .rte-mention-empty,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-item-meta,
    .rte-mention-panel.rte-mention-theme-dark .rte-mention-empty {
      color: #9ca3af;
    }
  `;

  document.head.appendChild(style);
}

function normalizeOptions(options: MentionPluginOptions): Required<MentionPluginOptions> {
  const triggerChars = (options.triggerChars || ['@'])
    .filter((value) => typeof value === 'string' && value.length > 0)
    .map((value) => value[0]);

  return {
    triggerChars: triggerChars.length > 0 ? triggerChars : ['@'],
    minChars: Math.max(0, options.minChars ?? 1),
    maxQueryLength: Math.max(1, options.maxQueryLength ?? 32),
    maxSuggestions: Math.max(1, options.maxSuggestions ?? 8),
    items: options.items || [
      { id: 'john.doe', label: 'John Doe', meta: 'john@acme.com' },
      { id: 'sarah.lee', label: 'Sarah Lee', meta: 'sarah@acme.com' },
      { id: 'alex.chen', label: 'Alex Chen', meta: 'alex@acme.com' },
    ],
    api: options.api,
    search: options.search,
    itemRenderer: options.itemRenderer,
    emptyStateText: options.emptyStateText || 'Type to search mentions',
    noResultsText: options.noResultsText || 'No matching mentions',
    loadingText: options.loadingText || 'Loading...',
    insertSpaceAfterMention: options.insertSpaceAfterMention !== false,
  };
}

function getOrCreateState(editor: HTMLElement): MentionState {
  const existing = editorStates.get(editor);
  if (existing) return existing;
  const created = createMentionState(editor);
  editorStates.set(editor, created);
  return created;
}

function bindGlobalFocusIn(options: Required<MentionPluginOptions>): void {
  if (globalFocusInBound) return;
  globalFocusInBound = true;

  globalFocusInHandler = (event: FocusEvent) => {
    const target = event.target as Node | null;
    if (!(target instanceof Node)) return;

    const element = target.nodeType === Node.ELEMENT_NODE ? (target as HTMLElement) : target.parentElement;
    const editor = (element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null) || null;
    if (!editor) return;

    const state = getOrCreateState(editor);
    attachEditorHandlers(editor, state, options);
  };

  document.addEventListener('focusin', globalFocusInHandler, true);
}

function unbindGlobalFocusIn(): void {
  if (!globalFocusInBound || !globalFocusInHandler) return;
  document.removeEventListener('focusin', globalFocusInHandler, true);
  globalFocusInBound = false;
  globalFocusInHandler = null;
}

export const MentionPlugin = (rawOptions: MentionPluginOptions = {}): Plugin => {
  ensureStylesInjected();
  const options = normalizeOptions(rawOptions);

  return {
    name: 'mentions',

    toolbar: [
      {
        label: 'Mention',
        command: 'insertMention',
        icon: '<svg width="24" height="24" focusable="false"><path d="M12.1 4a7.9 7.9 0 0 0-8 8c0 4.4 3.6 8 8 8 1.6 0 3-.4 4.4-1.3.4-.3.5-.9.2-1.3a1 1 0 0 0-1.3-.3 6 6 0 0 1-3.3.9 6 6 0 1 1 6-6v1.6c0 .8-.5 1.4-1.2 1.4-.8 0-1.2-.6-1.2-1.4V12c0-2-1.6-3.5-3.7-3.5s-3.8 1.6-3.8 3.6c0 2 1.7 3.6 3.8 3.6 1 0 1.9-.4 2.6-1 .5 1 1.4 1.6 2.5 1.6 1.8 0 3.2-1.5 3.2-3.4V12A7.9 7.9 0 0 0 12 4Zm0 9.7c-1 0-1.8-.8-1.8-1.7s.8-1.7 1.8-1.7c1 0 1.7.8 1.7 1.7s-.8 1.7-1.7 1.7Z"></path></svg>',
      },
    ],

    commands: {
      insertMention: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const state = getOrCreateState(editor);
        attachEditorHandlers(editor, state, options);

        let range = getSelectionRangeInEditor(editor);
        if (!range) {
          range = document.createRange();
          range.selectNodeContents(editor);
          range.collapse(false);
          setSelectionRange(editor, range);
        }

        const safeRange = normalizeRangeOutsideMention(editor, range.cloneRange(), 'after');
        if (!rangesEqual(safeRange, range)) {
          setSelectionRange(editor, safeRange);
          range = safeRange;
        }

        state.query = '';
        const replaceRange = range.cloneRange();

        state.trigger = options.triggerChars[0];
        updateMentionPanel(state, options, range, '', state.trigger, replaceRange);
        return true;
      },
    },

    init: () => {
      pluginInstanceCount += 1;
      bindGlobalFocusIn(options);
      const editors = Array.from(document.querySelectorAll(EDITOR_CONTENT_SELECTOR)) as HTMLElement[];
      editors.forEach((editor) => {
        const state = getOrCreateState(editor);
        attachEditorHandlers(editor, state, options);
      });
    },

    destroy: () => {
      pluginInstanceCount = Math.max(0, pluginInstanceCount - 1);
      const editors = Array.from(document.querySelectorAll(EDITOR_CONTENT_SELECTOR)) as HTMLElement[];
      editors.forEach((editor) => {
        closeMentionPanel(getOrCreateState(editor));
        detachEditorHandlers(editor);
        destroyMentionState(editor);
      });
      if (pluginInstanceCount === 0) {
        unbindGlobalFocusIn();
      }
    },
  };
};
