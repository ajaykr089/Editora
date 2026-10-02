import type { Plugin } from '@editora/core';
import { normalizeOptions } from './SlashCommandsOptions';
import { ensureStylesInjected } from './SlashCommandsStyles';
import type {
  SlashCommandActionContext,
  SlashCommandItem,
  SlashCommandsPluginOptions,
} from './SlashCommands.types';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark, .rte-theme-dark';

interface SlashState {
  editor: HTMLElement;
  panel: HTMLDivElement | null;
  list: HTMLDivElement | null;
  replaceRange: Range | null;
  items: SlashCommandItem[];
  filteredItems: SlashCommandItem[];
  activeIndex: number;
  query: string;
  trigger: string;
  isOpen: boolean;
  instanceId: number;
  anchorRange: Range | null;
  /** Trigger position the user last dismissed with Escape, so an unrelated `input` event (e.g. from another plugin's programmatic edit) doesn't resurrect the panel at the same spot. */
  dismissedNode: Node | null;
  dismissedOffset: number;
}

interface SlashHandlers {
  input: () => void;
  keydown: (event: KeyboardEvent) => void;
  blur: () => void;
  mousedown: (event: MouseEvent) => void;
  selectionchange: () => void;
  reposition: () => void;
}

const editorStates = new WeakMap<HTMLElement, SlashState>();
const editorHandlers = new WeakMap<HTMLElement, SlashHandlers>();
let globalFocusInBound = false;
let globalFocusInHandler: ((event: FocusEvent) => void) | null = null;
let pluginInstanceCount = 0;
let slashStateSequence = 0;

function getElementFromNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
}

function resolveEditorRoot(editor: HTMLElement): HTMLElement {
  const root = editor.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor');
  return (root as HTMLElement) || editor;
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

function isBoundaryChar(ch: string | undefined): boolean {
  if (!ch) return true;
  return /\s|[([{"'`]/.test(ch);
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

function detectSlashQuery(
  textBefore: string,
  triggerChar: string,
  maxQueryLength: number,
  requireBoundary: boolean,
): { trigger: string; query: string; startOffset: number } | null {
  const idx = textBefore.lastIndexOf(triggerChar);
  if (idx < 0) return null;

  if (requireBoundary && !isBoundaryChar(textBefore[idx - 1])) {
    return null;
  }

  const query = textBefore.slice(idx + 1);
  if (/\s/.test(query)) return null;
  if (query.length > maxQueryLength) return null;

  return {
    trigger: triggerChar,
    query,
    startOffset: idx,
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
  clone.insertNode(marker);
  const rect = marker.getBoundingClientRect();
  marker.remove();
  editor.normalize();
  return rect;
}

function positionPanel(state: SlashState, range: Range): void {
  if (!state.panel) return;

  const caretRect = getCaretRect(state.editor, range);
  const panel = state.panel;

  panel.classList.toggle('rte-slash-theme-dark', Boolean(state.editor.closest(DARK_THEME_SELECTOR)));
  panel.style.display = 'block';
  panel.classList.add('show');
  panel.style.left = '0px';
  panel.style.top = '0px';

  const panelRect = panel.getBoundingClientRect();
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  const left = Math.max(8, Math.min(caretRect.left, viewportW - panelRect.width - 8));
  let top = caretRect.bottom + 8;

  if (top + panelRect.height > viewportH - 8) {
    top = Math.max(8, caretRect.top - panelRect.height - 8);
  }

  panel.style.position = 'fixed';
  panel.style.left = `${left}px`;
  panel.style.top = `${top}px`;
}

function highlightMatch(text: string, query: string): string {
  if (!query) return escapeHtml(text);

  const lower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  const idx = lower.indexOf(queryLower);
  if (idx < 0) return escapeHtml(text);

  const start = escapeHtml(text.slice(0, idx));
  const match = escapeHtml(text.slice(idx, idx + query.length));
  const end = escapeHtml(text.slice(idx + query.length));
  return `${start}<mark>${match}</mark>${end}`;
}

function ensurePanel(state: SlashState, options: Required<SlashCommandsPluginOptions>): void {
  if (state.panel && state.list) return;

  const panel = document.createElement('div');
  panel.className = 'rte-slash-panel';
  panel.style.display = 'none';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');

  const list = document.createElement('div');
  list.className = 'rte-slash-list';
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', options.panelLabel);

  panel.appendChild(list);
  document.body.appendChild(panel);

  state.panel = panel;
  state.list = list;

  panel.addEventListener('mousedown', (event) => {
    event.preventDefault();
  });

  panel.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const row = target.closest('.rte-slash-item') as HTMLElement | null;
    if (!row) return;

    const index = Number(row.getAttribute('data-index'));
    if (!Number.isFinite(index)) return;
    void selectItemAtIndex(state, index);
  });
}

function closePanel(state: SlashState): void {
  if (!state.panel) return;
  state.panel.style.display = 'none';
  state.panel.classList.remove('show');
  state.isOpen = false;
  state.filteredItems = [];
  state.activeIndex = 0;
  state.query = '';
  state.replaceRange = null;
  state.anchorRange = null;
}

function filterItems(items: SlashCommandItem[], query: string, maxSuggestions: number): SlashCommandItem[] {
  if (!query) return items.slice(0, maxSuggestions);

  const q = query.toLowerCase();
  const result = items.filter((item) => {
    const haystack = [
      item.id,
      item.label,
      item.description || '',
      item.command || '',
      ...(item.keywords || []),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });

  return result.slice(0, maxSuggestions);
}

function renderList(state: SlashState, options: Required<SlashCommandsPluginOptions>): void {
  if (!state.list) return;

  const list = state.list;
  list.innerHTML = '';

  if (state.filteredItems.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'rte-slash-empty';
    empty.textContent = options.emptyStateText;
    list.appendChild(empty);
    list.removeAttribute('aria-activedescendant');
    return;
  }

  state.filteredItems.forEach((item, index) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'rte-slash-item';
    row.setAttribute('role', 'option');
    row.setAttribute('data-index', String(index));
    row.setAttribute('id', `rte-slash-item-${state.instanceId}-${index}`);
    row.setAttribute('aria-selected', index === state.activeIndex ? 'true' : 'false');
    row.setAttribute('aria-label', item.description ? `${item.label} - ${item.description}` : item.label);

    if (index === state.activeIndex) {
      row.classList.add('active');
    }

    if (options.itemRenderer) {
      row.innerHTML = options.itemRenderer(item, state.query);
    } else {
      row.innerHTML = `
        <span class="rte-slash-item-title">${highlightMatch(item.label, state.query)}</span>
        ${item.description ? `<span class="rte-slash-item-description">${highlightMatch(item.description, state.query)}</span>` : ''}
      `;
    }

    list.appendChild(row);
  });

  if (state.filteredItems.length > 0) {
    list.setAttribute('aria-activedescendant', `rte-slash-item-${state.instanceId}-${state.activeIndex}`);
  }
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

function insertHTMLAtSelection(editor: HTMLElement, html: string): boolean {
  editor.focus({ preventScroll: true });

  try {
    if (document.execCommand('insertHTML', false, html)) {
      return true;
    }
  } catch {
    // Fallback below.
  }

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return false;

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

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) return false;

  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  const next = document.createRange();
  next.setStart(node, node.length);
  next.collapse(true);
  setSelectionRange(editor, next);
  return true;
}

function executeMappedCommand(command: string, value?: any): boolean {
  const normalized = command.toLowerCase();

  switch (normalized) {
    case 'paragraph':
    case 'p':
      return document.execCommand('formatBlock', false, '<p>');
    case 'heading1':
    case 'h1':
      return document.execCommand('formatBlock', false, '<h1>');
    case 'heading2':
    case 'h2':
      return document.execCommand('formatBlock', false, '<h2>');
    case 'heading3':
    case 'h3':
      return document.execCommand('formatBlock', false, '<h3>');
    case 'blockquote':
    case 'toggleblockquote':
      return document.execCommand('formatBlock', false, '<blockquote>');
    case 'bulletlist':
    case 'togglebulletlist':
    case 'insertunorderedlist':
      return document.execCommand('insertUnorderedList');
    case 'numberedlist':
    case 'toggleorderedlist':
    case 'insertorderedlist':
      return document.execCommand('insertOrderedList');
    case 'horizontalrule':
    case 'divider':
    case 'inserthorizontalrule':
      return document.execCommand('insertHorizontalRule');
    case 'bold':
    case 'togglebold':
      return document.execCommand('bold');
    case 'italic':
    case 'toggleitalic':
      return document.execCommand('italic');
    case 'underline':
    case 'toggleunderline':
      return document.execCommand('underline');
    case 'strikethrough':
    case 'togglestrikethrough':
      return document.execCommand('strikeThrough');
    case 'clearformatting':
    case 'removeformat':
      return document.execCommand('removeFormat');
    default:
      try {
        return document.execCommand(command, false, value);
      } catch {
        return false;
      }
  }
}

function executeCommand(editor: HTMLElement, command: string, value?: any): boolean {
  const editorRoot = resolveEditorRoot(editor);

  if (editorRoot && typeof (editorRoot as any).execCommand === 'function') {
    try {
      const result = (editorRoot as any).execCommand(command, value);
      if (result !== false) return true;
    } catch {
      // Fall through to other strategies.
    }
  }

  const executor = (window as any).execEditorCommand || (window as any).executeEditorCommand;
  if (typeof executor === 'function') {
    try {
      const commandContext = {
        editorElement: editorRoot,
        contentElement: editor,
      };
      const result = executor(command, value, commandContext);
      if (result !== false) return true;
    } catch {
      // Fall through to mapped commands.
    }
  }

  return executeMappedCommand(command, value);
}

async function executeItem(state: SlashState, item: SlashCommandItem): Promise<boolean> {
  const editor = state.editor;
  const editorRoot = resolveEditorRoot(editor);
  const actionContext: SlashCommandActionContext = {
    editor,
    editorRoot,
    query: state.query,
    trigger: state.trigger,
    executeCommand: (command: string, value?: any) => executeCommand(editor, command, value),
    insertHTML: (html: string) => insertHTMLAtSelection(editor, html),
  };

  if (item.action) {
    const result = await Promise.resolve(item.action(actionContext));
    return result !== false;
  }

  if (item.insertHTML) {
    return insertHTMLAtSelection(editor, item.insertHTML);
  }

  if (item.command) {
    return executeCommand(editor, item.command, item.commandValue);
  }

  return false;
}

async function selectItemAtIndex(
  state: SlashState,
  index: number,
): Promise<void> {
  if (index < 0 || index >= state.filteredItems.length) return;
  if (!state.replaceRange) return;

  const item = state.filteredItems[index];
  const editor = state.editor;
  const beforeHTML = editor.innerHTML;
  const invocationText = `${state.trigger}${state.query}`;

  const selection = window.getSelection();
  if (!selection) return;

  const replaceRange = state.replaceRange.cloneRange();
  if (!editor.contains(replaceRange.commonAncestorContainer)) return;

  replaceRange.deleteContents();
  const caret = replaceRange.cloneRange();
  caret.collapse(true);
  setSelectionRange(editor, caret);

  let executed = false;
  try {
    executed = await executeItem(state, item);
  } catch {
    executed = false;
  }
  closePanel(state);

  if (executed) {
    dispatchEditorInput(editor);
    recordDomHistoryTransaction(editor, beforeHTML);
  } else if (invocationText) {
    // Keep user input intact when a command cannot execute in current setup.
    insertTextAtSelection(editor, invocationText);
  }

  // Keep focus in editor for continuous typing.
  editor.focus({ preventScroll: true });
}

function moveActive(state: SlashState, delta: number): void {
  if (state.filteredItems.length === 0) return;
  const count = state.filteredItems.length;
  state.activeIndex = ((state.activeIndex + delta) % count + count) % count;

  if (!state.list) return;
  const rows = Array.from(state.list.querySelectorAll('.rte-slash-item')) as HTMLElement[];
  rows.forEach((row, idx) => {
    const isActive = idx === state.activeIndex;
    row.classList.toggle('active', isActive);
    row.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  const active = rows[state.activeIndex];
  if (active) {
    state.list.setAttribute('aria-activedescendant', active.id);
    active.scrollIntoView({ block: 'nearest' });
  }
}

function refreshPanelPosition(state: SlashState): void {
  if (!state.isOpen || !state.panel || !state.anchorRange) return;
  if (!state.editor.isConnected) {
    closePanel(state);
    return;
  }
  positionPanel(state, state.anchorRange);
}

function updatePanel(
  state: SlashState,
  options: Required<SlashCommandsPluginOptions>,
  range: Range,
  query: string,
  trigger: string,
  replaceRange: Range,
): void {
  ensurePanel(state, options);

  state.query = query;
  state.trigger = trigger;
  state.replaceRange = replaceRange.cloneRange();
  state.anchorRange = range.cloneRange();
  state.filteredItems = filterItems(state.items, query, options.maxSuggestions);
  state.activeIndex = 0;
  state.isOpen = true;

  if (!state.panel) return;

  renderList(state, options);
  positionPanel(state, range);
}

function handleEditorInput(state: SlashState, options: Required<SlashCommandsPluginOptions>): void {
  const editor = state.editor;
  if (editor.getAttribute('contenteditable') === 'false') {
    closePanel(state);
    return;
  }

  const range = getSelectionRangeInEditor(editor);
  if (!range || !range.collapsed) {
    closePanel(state);
    return;
  }

  const context = getTextContextForCaret(range);
  if (!context) {
    closePanel(state);
    return;
  }

  const detected = detectSlashQuery(
    context.textBefore,
    options.triggerChar,
    options.maxQueryLength,
    options.requireBoundary,
  );

  if (!detected) {
    closePanel(state);
    return;
  }

  if (detected.query.length < options.minChars) {
    closePanel(state);
    return;
  }

  if (state.dismissedNode === context.node && state.dismissedOffset === detected.startOffset) {
    return;
  }
  state.dismissedNode = null;
  state.dismissedOffset = -1;

  const replaceRange = range.cloneRange();
  replaceRange.setStart(context.node, detected.startOffset);
  replaceRange.setEnd(context.node, context.caretOffset);

  updatePanel(state, options, range, detected.query, detected.trigger, replaceRange);
}

function openSlashPanelAtSelection(state: SlashState, options: Required<SlashCommandsPluginOptions>): boolean {
  const editor = state.editor;

  if (editor.getAttribute('contenteditable') === 'false') {
    return false;
  }

  let range = getSelectionRangeInEditor(editor);
  if (!range) {
    range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    setSelectionRange(editor, range);
  }

  const replaceRange = range.cloneRange();
  replaceRange.collapse(true);

  updatePanel(state, options, range, '', options.triggerChar, replaceRange);
  return true;
}

function isOpenSlashShortcut(event: KeyboardEvent): boolean {
  const hasPrimaryModifier = event.metaKey || event.ctrlKey;
  if (!hasPrimaryModifier || event.altKey) return false;
  return event.key === '/' || event.code === 'Slash';
}


function createState(editor: HTMLElement, options: Required<SlashCommandsPluginOptions>): SlashState {
  return {
    editor,
    panel: null,
    list: null,
    replaceRange: null,
    items: options.items,
    filteredItems: [],
    activeIndex: 0,
    query: '',
    trigger: options.triggerChar,
    isOpen: false,
    instanceId: ++slashStateSequence,
    anchorRange: null,
    dismissedNode: null,
    dismissedOffset: -1,
  };
}

function getOrCreateState(editor: HTMLElement, options: Required<SlashCommandsPluginOptions>): SlashState {
  const existing = editorStates.get(editor);
  if (existing) {
    existing.items = options.items;
    return existing;
  }

  const created = createState(editor, options);
  editorStates.set(editor, created);
  return created;
}

function destroyState(editor: HTMLElement): void {
  const state = editorStates.get(editor);
  if (!state) return;

  if (state.panel?.parentNode) {
    state.panel.parentNode.removeChild(state.panel);
  }

  editorStates.delete(editor);
}

function attachEditorHandlers(editor: HTMLElement, state: SlashState, options: Required<SlashCommandsPluginOptions>): void {
  if (editorHandlers.has(editor)) return;

  const handlers: SlashHandlers = {
    input: () => {
      handleEditorInput(state, options);
    },
    keydown: (event: KeyboardEvent) => {
      if (state.editor.getAttribute('contenteditable') === 'false') {
        closePanel(state);
        return;
      }

      if (!state.isOpen && isOpenSlashShortcut(event)) {
        event.preventDefault();
        openSlashPanelAtSelection(state, options);
        return;
      }

      if (state.isOpen) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          moveActive(state, 1);
          return;
        }

        if (event.key === 'ArrowUp') {
          event.preventDefault();
          moveActive(state, -1);
          return;
        }

        if (event.key === 'Enter' || event.key === 'Tab') {
          if (state.filteredItems.length === 0) {
            if (event.key === 'Tab') {
              event.preventDefault();
            }
            closePanel(state);
            return;
          }
          event.preventDefault();
          void selectItemAtIndex(state, state.activeIndex);
          return;
        }

        if (event.key === 'Escape') {
          event.preventDefault();
          if (state.replaceRange) {
            state.dismissedNode = state.replaceRange.startContainer;
            state.dismissedOffset = state.replaceRange.startOffset;
          }
          closePanel(state);
          return;
        }
      }
    },
    blur: () => {
      window.setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        if (state.panel && active && state.panel.contains(active)) return;
        closePanel(state);
      }, 0);
    },
    mousedown: (event: MouseEvent) => {
      if (!state.isOpen || !state.panel) return;
      const target = event.target as Node | null;
      if (!target) return;
      if (!state.panel.contains(target) && !editor.contains(target)) {
        closePanel(state);
      }
    },
    selectionchange: () => {
      if (!state.isOpen) return;
      const range = getSelectionRangeInEditor(editor);
      if (!range || !range.collapsed) {
        closePanel(state);
        return;
      }
      state.anchorRange = range.cloneRange();
      refreshPanelPosition(state);
    },
    reposition: () => {
      refreshPanelPosition(state);
    },
  };

  editor.addEventListener('input', handlers.input);
  editor.addEventListener('keydown', handlers.keydown);
  editor.addEventListener('blur', handlers.blur);
  document.addEventListener('mousedown', handlers.mousedown, true);
  document.addEventListener('selectionchange', handlers.selectionchange);
  window.addEventListener('resize', handlers.reposition, { passive: true });
  window.addEventListener('scroll', handlers.reposition, true);
  editorHandlers.set(editor, handlers);
}

function detachEditorHandlers(editor: HTMLElement): void {
  const handlers = editorHandlers.get(editor);
  if (!handlers) return;

  editor.removeEventListener('input', handlers.input);
  editor.removeEventListener('keydown', handlers.keydown);
  editor.removeEventListener('blur', handlers.blur);
  document.removeEventListener('mousedown', handlers.mousedown, true);
  document.removeEventListener('selectionchange', handlers.selectionchange);
  window.removeEventListener('resize', handlers.reposition);
  window.removeEventListener('scroll', handlers.reposition, true);
  editorHandlers.delete(editor);
}

function bindGlobalFocusIn(options: Required<SlashCommandsPluginOptions>): void {
  if (globalFocusInBound) return;
  globalFocusInBound = true;

  globalFocusInHandler = (event: FocusEvent) => {
    const target = event.target as Node | null;
    if (!(target instanceof Node)) return;

    const element = getElementFromNode(target);
    const editor = (element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null) || null;
    if (!editor) return;

    const state = getOrCreateState(editor, options);
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

export const SlashCommandsPlugin = (rawOptions: SlashCommandsPluginOptions = {}): Plugin => {
  ensureStylesInjected();
  const options = normalizeOptions(rawOptions);

  return {
    name: 'slashCommands',

    toolbar: [
      {
        id: 'slashCommands',
        label: 'Slash Commands',
        command: 'openSlashCommands',
        icon: '<svg width="24" height="24" focusable="false" aria-hidden="true"><path d="M8.7 20a1 1 0 0 1-.7-.3c-.4-.4-.4-1 0-1.4L15.6 5a1 1 0 0 1 1.4 1.4L9.4 19.7a1 1 0 0 1-.7.3Zm7.8 0c-.3 0-.5 0-.7-.3l-1.8-1.8a1 1 0 1 1 1.4-1.4l1.8 1.8a1 1 0 0 1-.7 1.7Zm-9-12a1 1 0 0 1-.7-1.7L8.6 4.5A1 1 0 1 1 10 6L8.2 7.8a1 1 0 0 1-.7.3Z"></path></svg>',
      },
    ],

    commands: {
      openSlashCommands: (_value?: unknown, context?: { editorElement?: unknown; contentElement?: unknown }) => {
        const editor = resolveEditorFromContext(context);
        if (!editor) return false;

        const state = getOrCreateState(editor, options);
        attachEditorHandlers(editor, state, options);
        return openSlashPanelAtSelection(state, options);
      },
    },

    keymap: {
      'Mod-/': 'openSlashCommands',
      'Mod-Shift-7': 'openSlashCommands',
    },

    init: () => {
      pluginInstanceCount += 1;
      bindGlobalFocusIn(options);

      const editors = Array.from(document.querySelectorAll(EDITOR_CONTENT_SELECTOR)) as HTMLElement[];
      editors.forEach((editor) => {
        const state = getOrCreateState(editor, options);
        attachEditorHandlers(editor, state, options);
      });
    },

    destroy: () => {
      pluginInstanceCount = Math.max(0, pluginInstanceCount - 1);

      const editors = Array.from(document.querySelectorAll(EDITOR_CONTENT_SELECTOR)) as HTMLElement[];
      editors.forEach((editor) => {
        const state = editorStates.get(editor);
        if (!state) return;
        closePanel(state);
        detachEditorHandlers(editor);
        destroyState(editor);
      });

      if (pluginInstanceCount === 0) {
        unbindGlobalFocusIn();
      }
    },
  };
};
