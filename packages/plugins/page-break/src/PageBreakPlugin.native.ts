import { Plugin } from '@editora/core';

/**
 * Page Break Plugin - Native Implementation
 *
 * Improvements:
 * - Editor-scoped insertion and selection handling for multi-instance safety
 * - Delegated click/keyboard handlers (no per-node listener churn)
 * - Reliable insertion even when selection is inside inline formatting
 * - Atomic delete behavior for selected/adjacent page breaks
 * - Adjacent-page-break collapse and caret recovery
 */

const PAGE_BREAK_SELECTOR = '.rte-page-break[data-type="page-break"]';
const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content';

let pageBreakStyles: HTMLStyleElement | null = null;
let interactionsInitialized = false;

const recordDomHistoryTransaction = (editor: HTMLElement, beforeHTML: string): void => {
  if (beforeHTML === editor.innerHTML) return;
  const executor = (window as any).execEditorCommand || (window as any).executeEditorCommand;
  if (typeof executor !== 'function') return;
  try {
    executor('recordDomTransaction', editor, beforeHTML, editor.innerHTML);
  } catch {
    // History plugin may be unavailable.
  }
};

const BLOCK_TAGS = new Set([
  'DIV',
  'P',
  'BLOCKQUOTE',
  'PRE',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'LI',
  'TD',
  'TH',
]);

const injectStyles = (): void => {
  if (pageBreakStyles || typeof document === 'undefined') return;

  pageBreakStyles = document.createElement('style');
  pageBreakStyles.textContent = `
    .rte-page-break {
      display: block;
      position: relative;
      height: 12px;
      margin: 8px 0;
      background: linear-gradient(90deg, #ccc 0%, transparent 100%);
      border-top: 2px dashed #999;
      border-bottom: none;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      outline: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    .rte-page-break::before {
      content: '⎙ PAGE BREAK';
      position: absolute;
      top: -12px;
      left: 0;
      font-size: 10px;
      font-weight: bold;
      color: #666;
      background: white;
      padding: 2px 6px;
      letter-spacing: 0.5px;
      opacity: 0.7;
      pointer-events: none;
    }

    .rte-page-break:hover {
      background: linear-gradient(90deg, #999 0%, transparent 100%);
      border-top-color: #666;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    .rte-page-break:hover::before {
      opacity: 1;
      color: #333;
    }

    .rte-page-break:focus,
    .rte-page-break:focus-visible,
    .rte-page-break-selected {
      outline: 2px solid #0066cc;
      outline-offset: -2px;
      border-top-color: #0066cc;
      background: linear-gradient(90deg, #0066cc 0%, transparent 100%);
    }

    .rte-page-break * {
      user-select: none;
    }

    @media print {
      .rte-page-break {
        display: block;
        height: 0;
        margin: 0;
        background: none;
        border: none;
        page-break-after: always;
      }

      .rte-page-break::before {
        display: none;
      }
    }
  `;

  document.head.appendChild(pageBreakStyles);
};

const getEditorContentFromSelection = (): HTMLElement | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const element = range.startContainer.nodeType === Node.ELEMENT_NODE
    ? (range.startContainer as HTMLElement)
    : range.startContainer.parentElement;

  return (element?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null) || null;
};

const resolveActiveEditorContent = (): HTMLElement | null => {
  const fromSelection = getEditorContentFromSelection();
  if (fromSelection) return fromSelection;

  const active = document.activeElement as HTMLElement | null;
  const fromActive = active?.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
  if (fromActive) return fromActive;

  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
};

const getContainingBlock = (node: Node, editorContent: HTMLElement): HTMLElement | null => {
  let current: Node | null = node;

  while (current && current !== editorContent) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (BLOCK_TAGS.has(element.tagName)) {
        return element;
      }
    }
    current = current.parentNode;
  }

  return null;
};

const createPageBreakNode = (): HTMLDivElement => {
  const pageBreak = document.createElement('div');
  pageBreak.className = 'rte-page-break';
  pageBreak.setAttribute('data-page-break', 'true');
  pageBreak.setAttribute('data-type', 'page-break');
  pageBreak.setAttribute('contenteditable', 'false');
  pageBreak.setAttribute('tabindex', '0');
  pageBreak.setAttribute('role', 'separator');
  pageBreak.setAttribute('aria-label', 'Page break');
  return pageBreak;
};

const collapseAdjacentPageBreaks = (pageBreak: HTMLElement): void => {
  let next = pageBreak.nextElementSibling;
  while (next && next.matches(PAGE_BREAK_SELECTOR)) {
    const toRemove = next;
    next = next.nextElementSibling;
    toRemove.remove();
  }

  let prev = pageBreak.previousElementSibling;
  while (prev && prev.matches(PAGE_BREAK_SELECTOR)) {
    const toRemove = prev;
    prev = prev.previousElementSibling;
    toRemove.remove();
  }
};

const ensureParagraphAfter = (pageBreak: HTMLElement): HTMLElement => {
  const next = pageBreak.nextElementSibling as HTMLElement | null;
  if (next && !next.matches(PAGE_BREAK_SELECTOR)) {
    return next;
  }

  const paragraph = document.createElement('p');
  paragraph.innerHTML = '<br>';
  pageBreak.parentNode?.insertBefore(paragraph, pageBreak.nextSibling);
  return paragraph;
};

const setCaretAtStart = (target: Node): void => {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  if (target.nodeType === Node.TEXT_NODE) {
    range.setStart(target, 0);
  } else {
    range.setStart(target, 0);
  }
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

const setCaretAtEnd = (target: Node): void => {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  if (target.nodeType === Node.TEXT_NODE) {
    const text = target as Text;
    range.setStart(text, text.data.length);
  } else {
    range.selectNodeContents(target);
    range.collapse(false);
  }
  selection.removeAllRanges();
  selection.addRange(range);
};

const getAdjacentNonPageBreakNode = (
  start: Node | null,
  direction: 'previous' | 'next',
): Node | null => {
  let current: Node | null = start;
  while (current) {
    if (!(current instanceof HTMLElement && current.matches(PAGE_BREAK_SELECTOR))) {
      return current;
    }
    current = direction === 'previous' ? current.previousSibling : current.nextSibling;
  }
  return null;
};

const selectPageBreakNode = (pageBreak: HTMLElement): void => {
  const selection = window.getSelection();
  if (!selection || !pageBreak.parentNode) return;

  const parent = pageBreak.parentNode;
  const index = Array.from(parent.childNodes).indexOf(pageBreak);
  if (index < 0) return;

  const range = document.createRange();
  range.setStart(parent, index);
  range.setEnd(parent, index + 1);
  selection.removeAllRanges();
  selection.addRange(range);
  pageBreak.focus({ preventScroll: true });
};

const resolveSelectedPageBreak = (range: Range): HTMLElement | null => {
  if (range.collapsed) return null;
  if (range.startContainer !== range.endContainer) return null;
  if (range.endOffset !== range.startOffset + 1) return null;
  if (!(range.startContainer instanceof Element || range.startContainer instanceof DocumentFragment)) return null;

  const node = range.startContainer.childNodes[range.startOffset];
  if (!(node instanceof HTMLElement)) return null;
  return node.matches(PAGE_BREAK_SELECTOR) ? node : null;
};

const findPageBreakForCaretDeletion = (
  range: Range,
  editorContent: HTMLElement,
  key: 'Backspace' | 'Delete',
): HTMLElement | null => {
  if (!range.collapsed) return null;

  const { startContainer, startOffset } = range;

  const asPageBreak = (node: Node | null): HTMLElement | null => (
    node instanceof HTMLElement && node.matches(PAGE_BREAK_SELECTOR) ? node : null
  );

  const resolveAdjacentBoundarySibling = (direction: 'previous' | 'next'): Node | null => {
    if (startContainer.nodeType === Node.ELEMENT_NODE) {
      const container = startContainer as Element;
      if (direction === 'previous') {
        if (startOffset > 0) {
          return container.childNodes[startOffset - 1] || null;
        }
      } else if (startOffset < container.childNodes.length) {
        return container.childNodes[startOffset] || null;
      }
    }

    if (startContainer.nodeType === Node.TEXT_NODE) {
      const text = startContainer as Text;
      if (direction === 'previous' && startOffset < text.data.length) return null;
      if (direction === 'next' && startOffset > 0) return null;
    }

    let current: Node | null = startContainer;

    while (current && current !== editorContent) {
      const sibling = direction === 'previous' ? current.previousSibling : current.nextSibling;
      if (sibling) return sibling;
      current = current.parentNode;
    }

    return null;
  };

  if (startContainer.nodeType === Node.ELEMENT_NODE) {
    const container = startContainer as HTMLElement;
    if (key === 'Backspace' && startOffset > 0) {
      return asPageBreak(container.childNodes[startOffset - 1] || null);
    }
    if (key === 'Delete') {
      return asPageBreak(container.childNodes[startOffset] || null);
    }
    return null;
  }

  if (startContainer.nodeType === Node.TEXT_NODE) {
    const text = startContainer as Text;
    if (key === 'Backspace' && startOffset === 0) {
      const direct = asPageBreak(text.previousSibling);
      if (direct) return direct;
      return asPageBreak(resolveAdjacentBoundarySibling('previous'));
    }
    if (key === 'Delete' && startOffset === text.data.length) {
      const direct = asPageBreak(text.nextSibling);
      if (direct) return direct;
      return asPageBreak(resolveAdjacentBoundarySibling('next'));
    }
  }

  if (key === 'Backspace') {
    return asPageBreak(resolveAdjacentBoundarySibling('previous'));
  }
  return asPageBreak(resolveAdjacentBoundarySibling('next'));
};

const removePageBreakNode = (pageBreak: HTMLElement, key: 'Backspace' | 'Delete'): boolean => {
  const editorContent = pageBreak.closest(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
  const beforeHTML = editorContent?.innerHTML ?? '';
  const previous = pageBreak.previousSibling;
  const next = pageBreak.nextSibling;

  pageBreak.remove();

  const previousCaretTarget = getAdjacentNonPageBreakNode(previous, 'previous');
  const nextCaretTarget = getAdjacentNonPageBreakNode(next, 'next');

  if (key === 'Backspace') {
    if (previousCaretTarget) {
      setCaretAtEnd(previousCaretTarget);
    } else if (nextCaretTarget) {
      setCaretAtStart(nextCaretTarget);
    } else if (editorContent) {
      const fallback = document.createElement('p');
      fallback.innerHTML = '<br>';
      editorContent.appendChild(fallback);
      setCaretAtStart(fallback);
    }
  } else {
    if (nextCaretTarget) {
      setCaretAtStart(nextCaretTarget);
    } else if (previousCaretTarget) {
      setCaretAtEnd(previousCaretTarget);
    } else if (editorContent) {
      const fallback = document.createElement('p');
      fallback.innerHTML = '<br>';
      editorContent.appendChild(fallback);
      setCaretAtStart(fallback);
    }
  }

  if (editorContent) {
    recordDomHistoryTransaction(editorContent, beforeHTML);
    editorContent.dispatchEvent(new Event('input', { bubbles: true }));
  }

  return true;
};

const insertPageBreak = (): boolean => {
  const editorContent = resolveActiveEditorContent();
  if (!editorContent) return false;
  const beforeHTML = editorContent.innerHTML;

  const selection = window.getSelection();
  if (!selection) return false;

  let range: Range;
  if (selection.rangeCount > 0 && editorContent.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    range = selection.getRangeAt(0);
  } else {
    range = document.createRange();
    range.selectNodeContents(editorContent);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  const block = getContainingBlock(range.endContainer, editorContent)
    || getContainingBlock(range.startContainer, editorContent);

  const pageBreak = createPageBreakNode();

  if (block && block.parentNode) {
    block.parentNode.insertBefore(pageBreak, block.nextSibling);
  } else {
    editorContent.appendChild(pageBreak);
  }

  collapseAdjacentPageBreaks(pageBreak);

  const nextEditable = ensureParagraphAfter(pageBreak);
  setCaretAtStart(nextEditable);

  recordDomHistoryTransaction(editorContent, beforeHTML);
  editorContent.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
};

const initializeInteractions = (): void => {
  if (interactionsInitialized || typeof document === 'undefined') return;
  interactionsInitialized = true;

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const pageBreak = target?.closest(PAGE_BREAK_SELECTOR) as HTMLElement | null;
    if (!pageBreak) return;

    event.preventDefault();
    event.stopPropagation();
    selectPageBreakNode(pageBreak);
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (!['Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const editorContent = resolveActiveEditorContent();
    if (!editorContent || !editorContent.contains(range.commonAncestorContainer)) return;

    const selectedPageBreak = resolveSelectedPageBreak(range);

    if (selectedPageBreak) {
      if (key === 'Backspace' || key === 'Delete') {
        event.preventDefault();
        event.stopPropagation();
        removePageBreakNode(selectedPageBreak, key);
        return;
      }

      if (key === 'ArrowRight' || key === 'ArrowDown') {
        event.preventDefault();
        const next = getAdjacentNonPageBreakNode(selectedPageBreak.nextSibling, 'next')
          || ensureParagraphAfter(selectedPageBreak);
        setCaretAtStart(next);
        return;
      }

      if (key === 'ArrowLeft' || key === 'ArrowUp') {
        event.preventDefault();
        const prev = getAdjacentNonPageBreakNode(selectedPageBreak.previousSibling, 'previous');
        if (prev) {
          setCaretAtEnd(prev);
        } else {
          setCaretAtStart(editorContent);
        }
        return;
      }
    }

    if (key === 'Backspace' || key === 'Delete') {
      const adjacentPageBreak = findPageBreakForCaretDeletion(
        range,
        editorContent,
        key as 'Backspace' | 'Delete',
      );
      if (!adjacentPageBreak) return;

      event.preventDefault();
      event.stopPropagation();
      removePageBreakNode(adjacentPageBreak, key as 'Backspace' | 'Delete');
    }
  });
};

export const PageBreakPlugin = (): Plugin => {
  injectStyles();
  initializeInteractions();

  return {
    name: 'pageBreak',

    toolbar: [
      {
        label: 'Page Break',
        command: 'insertPageBreak',
        icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M5 5H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5 9H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M5 15H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-dasharray="3.2 3.2"/><path d="M5 19H19" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
        shortcut: 'Mod-Enter',
      },
    ],

    commands: {
      insertPageBreak,
    },

    keymap: {
      'Mod-Enter': 'insertPageBreak',
    },
  };
};
