import type { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';
const FOOTNOTE_CONTAINER_SELECTOR = '.rte-footnotes[data-type="footnotes"]';
const FOOTNOTE_REF_SELECTOR = '.rte-footnote-ref[data-footnote-id]';
const FOOTNOTE_ITEM_SELECTOR = 'li.rte-footnote-item[data-type="footnote"]';
const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';

let stylesInjected = false;
let interactionsInitialized = false;
let footnoteIdCounter = 0;

declare global {
  interface Window {
    execEditorCommand?: (command: string, ...args: any[]) => any;
    executeEditorCommand?: (command: string, ...args: any[]) => any;
  }
}

function injectFootnoteStyles(): void {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.id = 'editora-footnote-plugin-styles';
  style.textContent = `
    .rte-footnote-ref {
      display: inline-block;
      font-size: 0.72em;
      line-height: 1;
      vertical-align: super;
      margin-left: 1px;
      color: #1f4dbd;
      cursor: pointer;
      user-select: none;
      border-radius: 4px;
      padding: 0 2px;
      outline: none;
      font-weight: 600;
    }

    .rte-footnote-ref:focus,
    .rte-footnote-ref:focus-visible,
    .rte-footnote-ref.rte-footnote-selected {
      background: rgba(31, 77, 189, 0.12);
      box-shadow: 0 0 0 2px rgba(31, 77, 189, 0.24);
    }

    .rte-footnotes {
      margin-top: 16px;
      padding-top: 10px;
      border-top: 1px solid #d1d5db;
    }

    .rte-footnotes ol {
      margin: 0;
      padding-left: 24px;
    }

    .rte-footnote-item {
      margin: 0 0 8px;
      color: inherit;
    }

    .rte-footnote-content {
      display: inline;
      outline: none;
    }

    .rte-footnote-backref {
      margin-left: 8px;
      color: #1f4dbd;
      text-decoration: none;
      font-size: 0.9em;
      user-select: none;
    }

    .rte-footnote-backref:hover,
    .rte-footnote-backref:focus {
      text-decoration: underline;
    }

    .rte-footnote-highlighted {
      animation: rte-footnote-flash 1s ease;
    }

    @keyframes rte-footnote-flash {
      0% { background-color: rgba(255, 234, 143, 0.9); }
      100% { background-color: transparent; }
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-ref {
      color: #8ab4ff;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-ref:focus,
    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-ref:focus-visible,
    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-ref.rte-footnote-selected {
      background: rgba(138, 180, 255, 0.16);
      box-shadow: 0 0 0 2px rgba(138, 180, 255, 0.3);
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnotes {
      border-top-color: #4b5563;
    }

    :is([data-theme="dark"], .dark, .editora-theme-dark) .rte-footnote-backref {
      color: #8ab4ff;
    }
  `;

  document.head.appendChild(style);
}

function getElementForNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  if (node.nodeType === Node.ELEMENT_NODE) return node as HTMLElement;
  return node.parentElement;
}

function getEditorContentFromHost(host: Element | null): HTMLElement | null {
  if (!host) return null;
  const content = host.querySelector('[contenteditable="true"]');
  return content instanceof HTMLElement ? content : null;
}

function consumeCommandEditorContextEditor(): HTMLElement | null {
  if (typeof window === 'undefined') return null;

  const explicitContext = (window as any)[COMMAND_EDITOR_CONTEXT_KEY] as HTMLElement | null | undefined;
  if (!(explicitContext instanceof HTMLElement)) return null;

  (window as any)[COMMAND_EDITOR_CONTEXT_KEY] = null;

  const root =
    (explicitContext.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor') as HTMLElement | null) ||
    (explicitContext.matches('[data-editora-editor], .rte-editor, .editora-editor, editora-editor')
      ? explicitContext
      : null);

  if (root) {
    const content = getEditorContentFromHost(root);
    if (content) return content;
    if (root.getAttribute('contenteditable') === 'true') return root;
  }

  if (explicitContext.getAttribute('contenteditable') === 'true') {
    return explicitContext;
  }

  const nearestEditable = explicitContext.closest('[contenteditable="true"]');
  return nearestEditable instanceof HTMLElement ? nearestEditable : null;
}

function getOutermostEditable(start: HTMLElement): HTMLElement | null {
  const nearestEditable = start.closest('[contenteditable="true"]') as HTMLElement | null;
  if (!nearestEditable) return null;

  let outermost = nearestEditable;
  let parent = outermost.parentElement;

  while (parent) {
    const isEditable = parent.getAttribute('contenteditable') === 'true';
    if (isEditable) {
      outermost = parent;
    }
    parent = parent.parentElement;
  }

  return outermost;
}

function resolveEditorFromNode(node: Node | null): HTMLElement | null {
  const element = getElementForNode(node);
  if (!element) return null;

  const explicitEditor = element.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
  if (explicitEditor) return explicitEditor;

  return getOutermostEditable(element);
}

function resolveEditorFromSelection(): HTMLElement | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return resolveEditorFromNode(selection.getRangeAt(0).startContainer);
}

function resolveActiveEditor(): HTMLElement | null {
  const explicitContextEditor = consumeCommandEditorContextEditor();
  if (explicitContextEditor && document.contains(explicitContextEditor)) {
    return explicitContextEditor;
  }

  const fromSelection = resolveEditorFromSelection();
  if (fromSelection) return fromSelection;

  const active = document.activeElement as HTMLElement | null;
  const fromActive = active ? resolveEditorFromNode(active) : null;
  if (fromActive) return fromActive;

  const explicitEditor = document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
  if (explicitEditor) return explicitEditor;

  return document.querySelector('[contenteditable="true"]') as HTMLElement | null;
}

function createFootnoteContainer(): HTMLElement {
  const container = document.createElement('section');
  container.className = 'rte-footnotes';
  container.setAttribute('data-type', 'footnotes');
  container.setAttribute('contenteditable', 'false');

  const list = document.createElement('ol');
  container.appendChild(list);

  return container;
}

function getOrCreateFootnoteContainer(editor: HTMLElement, create: boolean): HTMLElement | null {
  let container = editor.querySelector(FOOTNOTE_CONTAINER_SELECTOR) as HTMLElement | null;
  if (!container && create) {
    container = createFootnoteContainer();
    editor.appendChild(container);
  }

  if (!container) return null;

  if (!container.querySelector('ol')) {
    container.appendChild(document.createElement('ol'));
  }

  return container;
}

function getFootnoteList(container: HTMLElement): HTMLOListElement {
  let list = container.querySelector('ol') as HTMLOListElement | null;
  if (!list) {
    list = document.createElement('ol');
    container.appendChild(list);
  }
  return list;
}

function createFootnoteReference(footnoteId: string): HTMLElement {
  const reference = document.createElement('sup');
  reference.className = 'rte-footnote-ref';
  reference.setAttribute('data-footnote-id', footnoteId);
  reference.setAttribute('data-number', '0');
  reference.setAttribute('contenteditable', 'false');
  reference.setAttribute('tabindex', '0');
  reference.setAttribute('role', 'doc-noteref');
  reference.id = `ref-${footnoteId}`;
  reference.textContent = '0';
  return reference;
}

function createFootnoteItem(footnoteId: string, content: string): HTMLLIElement {
  const item = document.createElement('li');
  item.id = footnoteId;
  item.className = 'rte-footnote-item';
  item.setAttribute('data-type', 'footnote');
  item.setAttribute('data-number', '0');
  item.setAttribute('contenteditable', 'false');

  const contentDiv = document.createElement('div');
  contentDiv.className = 'rte-footnote-content';
  contentDiv.setAttribute('contenteditable', 'true');
  contentDiv.textContent = content;

  const backRef = document.createElement('a');
  backRef.className = 'rte-footnote-backref';
  backRef.href = `#ref-${footnoteId}`;
  backRef.setAttribute('aria-label', 'Back to reference');
  backRef.setAttribute('contenteditable', 'false');
  backRef.textContent = '↩';

  item.appendChild(contentDiv);
  item.appendChild(backRef);
  return item;
}

function generateFootnoteId(editor: HTMLElement): string {
  let footnoteId = '';
  do {
    footnoteIdCounter += 1;
    footnoteId = `fn-${Date.now().toString(36)}-${footnoteIdCounter.toString(36)}`;
  } while (editor.querySelector(`#${CSS.escape(footnoteId)}`));
  return footnoteId;
}

function flashElement(target: HTMLElement): void {
  target.classList.remove('rte-footnote-highlighted');
  target.classList.add('rte-footnote-highlighted');
  window.setTimeout(() => {
    target.classList.remove('rte-footnote-highlighted');
  }, 1000);
}

function dispatchEditorInput(editor: HTMLElement | null): void {
  if (!editor) return;
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function recordDomHistoryTransaction(editor: HTMLElement | null, beforeHTML: string): void {
  if (!editor) return;
  if (beforeHTML === editor.innerHTML) return;

  const executor = window.execEditorCommand || window.executeEditorCommand;
  if (typeof executor !== 'function') return;

  try {
    executor('recordDomTransaction', editor, beforeHTML, editor.innerHTML);
  } catch {
    // History plugin may not be loaded.
  }
}

function findReferenceById(editor: HTMLElement, footnoteId: string): HTMLElement | null {
  const refs = Array.from(editor.querySelectorAll(FOOTNOTE_REF_SELECTOR)) as HTMLElement[];
  return refs.find((ref) => ref.getAttribute('data-footnote-id') === footnoteId) || null;
}

function normalizeSelectionForInsertion(editor: HTMLElement): Range {
  const selection = window.getSelection();
  if (!selection) {
    throw new Error('Selection unavailable');
  }

  let range: Range | null = null;
  if (selection.rangeCount > 0) {
    const candidate = selection.getRangeAt(0);
    if (editor.contains(candidate.commonAncestorContainer)) {
      range = candidate.cloneRange();
    }
  }

  if (!range) {
    range = document.createRange();
    const footnotes = getOrCreateFootnoteContainer(editor, false);
    if (footnotes) {
      range.setStartBefore(footnotes);
      range.collapse(true);
    } else {
      range.selectNodeContents(editor);
      range.collapse(false);
    }
  }

  const rangeElement = getElementForNode(range.commonAncestorContainer);
  if (rangeElement?.closest(FOOTNOTE_CONTAINER_SELECTOR)) {
    const footnotes = getOrCreateFootnoteContainer(editor, true);
    if (footnotes) {
      range.setStartBefore(footnotes);
      range.collapse(true);
    }
  }

  selection.removeAllRanges();
  selection.addRange(range);
  return range;
}

function selectAtomicNode(node: HTMLElement): void {
  const parent = node.parentNode;
  if (!parent) return;

  const index = Array.from(parent.childNodes).indexOf(node);
  if (index < 0) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.setStart(parent, index);
  range.setEnd(parent, index + 1);
  selection.removeAllRanges();
  selection.addRange(range);
  node.focus({ preventScroll: true });
}

function setCaretAt(parent: Node, offset: number): void {
  const selection = window.getSelection();
  if (!selection) return;

  const safeOffset = Math.max(0, Math.min(offset, parent.childNodes.length));
  const range = document.createRange();
  range.setStart(parent, safeOffset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function resolveSelectedFootnoteReference(range: Range): HTMLElement | null {
  if (range.collapsed) return null;
  if (range.startContainer !== range.endContainer) return null;
  if (range.endOffset !== range.startOffset + 1) return null;
  if (!(range.startContainer instanceof Element || range.startContainer instanceof DocumentFragment)) {
    return null;
  }

  const node = range.startContainer.childNodes[range.startOffset];
  if (!(node instanceof HTMLElement)) return null;
  if (!node.matches(FOOTNOTE_REF_SELECTOR)) return null;
  return node;
}

function findAdjacentBoundarySibling(
  range: Range,
  editor: HTMLElement,
  direction: 'previous' | 'next',
): Node | null {
  const { startContainer, startOffset } = range;

  if (startContainer.nodeType === Node.ELEMENT_NODE) {
    const element = startContainer as Element;
    if (direction === 'previous') {
      if (startOffset > 0) return element.childNodes[startOffset - 1] || null;
    } else if (startOffset < element.childNodes.length) {
      return element.childNodes[startOffset] || null;
    }
  }

  if (startContainer.nodeType === Node.TEXT_NODE) {
    const text = startContainer as Text;
    if (direction === 'previous' && startOffset < text.data.length) return null;
    if (direction === 'next' && startOffset > 0) return null;
  }

  let current: Node | null = startContainer;
  while (current && current !== editor) {
    const sibling = direction === 'previous' ? current.previousSibling : current.nextSibling;
    if (sibling) return sibling;
    current = current.parentNode;
  }

  return null;
}

function findFootnoteReferenceForCaretDeletion(
  range: Range,
  editor: HTMLElement,
  key: 'Backspace' | 'Delete',
): HTMLElement | null {
  if (!range.collapsed) return null;

  const asRef = (node: Node | null): HTMLElement | null => (
    node instanceof HTMLElement && node.matches(FOOTNOTE_REF_SELECTOR) ? node : null
  );

  const { startContainer, startOffset } = range;

  if (startContainer.nodeType === Node.ELEMENT_NODE) {
    const element = startContainer as Element;
    if (key === 'Backspace' && startOffset > 0) {
      return asRef(element.childNodes[startOffset - 1] || null);
    }
    if (key === 'Delete') {
      return asRef(element.childNodes[startOffset] || null);
    }
    return null;
  }

  if (startContainer.nodeType === Node.TEXT_NODE) {
    const text = startContainer as Text;
    if (key === 'Backspace' && startOffset === 0) {
      const direct = asRef(text.previousSibling);
      if (direct) return direct;
      return asRef(findAdjacentBoundarySibling(range, editor, 'previous'));
    }
    if (key === 'Delete' && startOffset === text.data.length) {
      const direct = asRef(text.nextSibling);
      if (direct) return direct;
      return asRef(findAdjacentBoundarySibling(range, editor, 'next'));
    }
  }

  if (key === 'Backspace') {
    return asRef(findAdjacentBoundarySibling(range, editor, 'previous'));
  }
  return asRef(findAdjacentBoundarySibling(range, editor, 'next'));
}

function renumberEditorFootnotes(editor: HTMLElement): void {
  const refs = (Array.from(editor.querySelectorAll(FOOTNOTE_REF_SELECTOR)) as HTMLElement[])
    .filter((ref) => !ref.closest(FOOTNOTE_CONTAINER_SELECTOR));

  const container = getOrCreateFootnoteContainer(editor, refs.length > 0);
  if (!container) return;
  const list = getFootnoteList(container);

  const existingItems = Array.from(list.querySelectorAll(FOOTNOTE_ITEM_SELECTOR)) as HTMLLIElement[];
  const itemById = new Map<string, HTMLLIElement>();
  existingItems.forEach((item) => itemById.set(item.id, item));

  const orderedItems: HTMLLIElement[] = [];

  refs.forEach((ref, index) => {
    const footnoteId = ref.getAttribute('data-footnote-id');
    if (!footnoteId) return;

    const number = index + 1;
    ref.setAttribute('data-number', String(number));
    ref.id = `ref-${footnoteId}`;
    ref.textContent = String(number);

    let item = itemById.get(footnoteId);
    if (!item) {
      item = createFootnoteItem(footnoteId, `Footnote ${number}`);
    }

    item.setAttribute('data-number', String(number));

    const content = item.querySelector('.rte-footnote-content') as HTMLElement | null;
    if (content && !(content.textContent || '').trim()) {
      content.textContent = `Footnote ${number}`;
    }

    const backRef = item.querySelector('.rte-footnote-backref') as HTMLAnchorElement | null;
    if (backRef) {
      backRef.href = `#ref-${footnoteId}`;
      backRef.setAttribute('aria-label', `Back to reference ${number}`);
    }

    orderedItems.push(item);
  });

  list.innerHTML = '';
  orderedItems.forEach((item) => list.appendChild(item));

  if (orderedItems.length === 0) {
    container.remove();
  }
}

function removeFootnoteReference(reference: HTMLElement, key: 'Backspace' | 'Delete'): boolean {
  const editor = resolveEditorFromNode(reference);
  const parent = reference.parentNode;
  if (!editor || !parent) return false;

  const beforeHTML = editor.innerHTML;

  const index = Array.from(parent.childNodes).indexOf(reference);
  if (index < 0) return false;

  const footnoteId = reference.getAttribute('data-footnote-id') || '';
  reference.remove();

  if (footnoteId) {
    const item = editor.querySelector(
      `${FOOTNOTE_ITEM_SELECTOR}#${CSS.escape(footnoteId)}`,
    ) as HTMLLIElement | null;
    item?.remove();
  }

  if (key === 'Backspace') {
    setCaretAt(parent, index);
  } else {
    setCaretAt(parent, index);
  }

  renumberEditorFootnotes(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
  dispatchEditorInput(editor);
  return true;
}

function initializeInteractions(): void {
  if (interactionsInitialized || typeof document === 'undefined') return;
  interactionsInitialized = true;

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const reference = target.closest(FOOTNOTE_REF_SELECTOR) as HTMLElement | null;
    if (reference) {
      const editor = resolveEditorFromNode(reference);
      if (!editor || !editor.contains(reference)) return;

      event.preventDefault();
      event.stopPropagation();
      selectAtomicNode(reference);
      reference.classList.add('rte-footnote-selected');
      window.setTimeout(() => reference.classList.remove('rte-footnote-selected'), 1200);

      const footnoteId = reference.getAttribute('data-footnote-id');
      if (!footnoteId) return;

      const item = editor.querySelector(
        `${FOOTNOTE_ITEM_SELECTOR}#${CSS.escape(footnoteId)}`,
      ) as HTMLElement | null;
      if (!item) return;

      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flashElement(item);
      return;
    }

    const backRef = target.closest('.rte-footnote-backref') as HTMLAnchorElement | null;
    if (!backRef) return;

    const item = backRef.closest(FOOTNOTE_ITEM_SELECTOR) as HTMLElement | null;
    if (!item) return;
    const editor = resolveEditorFromNode(item);
    if (!editor || !editor.contains(item)) return;

    event.preventDefault();
    event.stopPropagation();

    const footnoteId = item.id;
    if (!footnoteId) return;

    const ref = findReferenceById(editor, footnoteId);
    if (!ref) return;
    ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
    flashElement(ref);
    selectAtomicNode(ref);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Backspace' && event.key !== 'Delete') return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const editor = resolveEditorFromNode(range.commonAncestorContainer);
    if (!editor || !editor.contains(range.commonAncestorContainer)) return;

    const selectedReference = resolveSelectedFootnoteReference(range);
    if (selectedReference) {
      event.preventDefault();
      event.stopPropagation();
      removeFootnoteReference(selectedReference, event.key as 'Backspace' | 'Delete');
      return;
    }

    const adjacentReference = findFootnoteReferenceForCaretDeletion(
      range,
      editor,
      event.key as 'Backspace' | 'Delete',
    );
    if (!adjacentReference) return;

    event.preventDefault();
    event.stopPropagation();
    removeFootnoteReference(adjacentReference, event.key as 'Backspace' | 'Delete');
  });
}

export const insertFootnoteCommand = (content = ''): boolean => {
  const editor = resolveActiveEditor();
  if (!editor) return false;
  const beforeHTML = editor.innerHTML;

  const selection = window.getSelection();
  if (!selection) return false;

  let range: Range;
  try {
    range = normalizeSelectionForInsertion(editor);
  } catch {
    return false;
  }

  if (!range.collapsed) {
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  const footnoteId = generateFootnoteId(editor);
  const reference = createFootnoteReference(footnoteId);

  try {
    range.insertNode(reference);
  } catch {
    return false;
  }

  const caret = document.createRange();
  caret.setStartAfter(reference);
  caret.collapse(true);
  selection.removeAllRanges();
  selection.addRange(caret);

  const container = getOrCreateFootnoteContainer(editor, true);
  if (!container) return false;
  const list = getFootnoteList(container);
  const initialContent = content.trim() || 'Footnote';
  list.appendChild(createFootnoteItem(footnoteId, initialContent));

  renumberEditorFootnotes(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
  dispatchEditorInput(editor);
  return true;
};

export const renumberAllFootnotes = (): void => {
  const active = resolveActiveEditor();
  if (active) {
    renumberEditorFootnotes(active);
    return;
  }

  const editors = Array.from(document.querySelectorAll(EDITOR_CONTENT_SELECTOR)) as HTMLElement[];
  if (editors.length > 0) {
    editors.forEach((editor) => renumberEditorFootnotes(editor));
    return;
  }

  const fallback = document.querySelector('[contenteditable="true"]') as HTMLElement | null;
  if (fallback) {
    renumberEditorFootnotes(fallback);
  }
};

export const deleteFootnote = (footnoteId: string): void => {
  if (!footnoteId) return;

  const ref = (Array.from(document.querySelectorAll(FOOTNOTE_REF_SELECTOR)) as HTMLElement[])
    .find((candidate) => candidate.getAttribute('data-footnote-id') === footnoteId) || null;

  const item = document.getElementById(footnoteId);
  const editor = resolveEditorFromNode(ref || item);
  if (!editor) return;
  const beforeHTML = editor.innerHTML;

  ref?.remove();
  item?.remove();
  renumberEditorFootnotes(editor);
  recordDomHistoryTransaction(editor, beforeHTML);
  dispatchEditorInput(editor);
};

export const FootnotePlugin = (): Plugin => {
  injectFootnoteStyles();
  initializeInteractions();

  return {
    name: 'footnote',
    toolbar: [
      {
        label: 'Footnote',
        command: 'insertFootnote',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="14" height="2" rx="1"></rect><rect x="3" y="8" width="18" height="2" rx="1"></rect><rect x="3" y="12" width="16" height="2" rx="1"></rect><rect x="3" y="16" width="10" height="1.5" rx="0.75"></rect><text x="19" y="11" font-size="9" font-weight="600" fill="currentColor" font-family="system-ui, sans-serif">1</text></svg>',
      },
    ],
    commands: {
      insertFootnote: () => insertFootnoteCommand(),
    },
    keymap: {},
  };
};
