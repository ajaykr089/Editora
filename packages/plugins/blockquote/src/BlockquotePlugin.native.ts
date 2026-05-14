import { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content, [contenteditable="true"]';
const ROOT_EDITOR_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const BLOCK_SELECTOR = [
  'p',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'ul',
  'ol',
  'blockquote',
  'pre',
  'table',
].join(',');

function getElementForNode(node: Node | null): HTMLElement | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE ? node as HTMLElement : node.parentElement;
}

function resolveEditorContent(context?: any): HTMLElement | null {
  const contextContent = context?.contentElement;
  if (contextContent instanceof HTMLElement) return contextContent;

  const contextEditor = context?.editorElement;
  if (contextEditor instanceof HTMLElement) {
    const content = contextEditor.querySelector(EDITOR_CONTENT_SELECTOR);
    if (content instanceof HTMLElement) return content;
    if (contextEditor.getAttribute('contenteditable') === 'true') return contextEditor;
  }

  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const selectedElement = getElementForNode(selection.getRangeAt(0).startContainer);
    const content = selectedElement?.closest(EDITOR_CONTENT_SELECTOR);
    if (content instanceof HTMLElement) return content;

    const editorRoot = selectedElement?.closest(ROOT_EDITOR_SELECTOR);
    const rootContent = editorRoot?.querySelector(EDITOR_CONTENT_SELECTOR);
    if (rootContent instanceof HTMLElement) return rootContent;
  }

  const activeElement = document.activeElement as HTMLElement | null;
  const activeContent = activeElement?.closest(EDITOR_CONTENT_SELECTOR);
  if (activeContent instanceof HTMLElement) return activeContent;

  return document.querySelector(EDITOR_CONTENT_SELECTOR) as HTMLElement | null;
}

function getSelectionRangeInEditor(editor: HTMLElement): Range | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  if (
    !editor.contains(range.startContainer) ||
    !editor.contains(range.endContainer)
  ) {
    return null;
  }

  return range;
}

function getTopLevelBlock(editor: HTMLElement, node: Node): HTMLElement | null {
  let element = getElementForNode(node);
  if (!element || element === editor || !editor.contains(element)) return null;

  while (element.parentElement && element.parentElement !== editor) {
    element = element.parentElement;
  }

  if (element.parentElement !== editor) return null;
  if (element.matches(BLOCK_SELECTOR)) return element;

  const closestBlock = element.closest(BLOCK_SELECTOR);
  return closestBlock instanceof HTMLElement && closestBlock.parentElement === editor
    ? closestBlock
    : element;
}

function rangeIntersectsElement(range: Range, element: HTMLElement): boolean {
  if (typeof range.intersectsNode === 'function') {
    try {
      return range.intersectsNode(element);
    } catch {
      return false;
    }
  }

  const elementRange = document.createRange();
  elementRange.selectNode(element);
  return range.compareBoundaryPoints(Range.END_TO_START, elementRange) < 0
    && range.compareBoundaryPoints(Range.START_TO_END, elementRange) > 0;
}

function getSelectedTopLevelBlocks(editor: HTMLElement, range: Range): HTMLElement[] {
  const startBlock = getTopLevelBlock(editor, range.startContainer);
  const endBlock = getTopLevelBlock(editor, range.endContainer);

  if (!startBlock) return [];
  if (!endBlock || startBlock === endBlock) return [startBlock];

  const children = Array.from(editor.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );

  const blocks = children.filter((child) => rangeIntersectsElement(range, child));
  return blocks.length > 0 ? blocks : [startBlock];
}

function getBlockquoteAncestor(editor: HTMLElement, node: Node): HTMLQuoteElement | null {
  const element = getElementForNode(node);
  const blockquote = element?.closest('blockquote');
  return blockquote instanceof HTMLQuoteElement && editor.contains(blockquote) ? blockquote : null;
}

function isGeneratedEmptyParagraph(element: Element): boolean {
  if (element.tagName !== 'P') return false;
  if (element.attributes.length > 0) return false;
  if ((element.textContent || '').trim() !== '') return false;
  return !element.querySelector('img, video, table, iframe, hr, pre, ul, ol');
}

function removeGeneratedEmptyParagraphs(blockquote: HTMLElement): void {
  Array.from(blockquote.children).forEach((child) => {
    if (isGeneratedEmptyParagraph(child)) {
      child.remove();
    }
  });
}

function unwrapBlockquote(blockquote: HTMLElement): void {
  removeGeneratedEmptyParagraphs(blockquote);

  const parent = blockquote.parentNode;
  if (!parent) return;

  const replacementNodes = Array.from(blockquote.childNodes);
  replacementNodes.forEach((child) => {
    parent.insertBefore(child, blockquote);
  });
  parent.removeChild(blockquote);
}

function isWhitespaceTextNode(node: Node): boolean {
  return node.nodeType === Node.TEXT_NODE && (node.textContent || '').trim() === '';
}

function getOnlyContentBlockquote(item: HTMLLIElement): HTMLQuoteElement | null {
  const meaningfulNodes = Array.from(item.childNodes).filter((node) => !isWhitespaceTextNode(node));
  if (meaningfulNodes.length !== 1) return null;

  const onlyNode = meaningfulNodes[0];
  return onlyNode instanceof HTMLQuoteElement ? onlyNode : null;
}

function wrapListItemContents(item: HTMLLIElement): HTMLQuoteElement {
  const blockquote = document.createElement('blockquote');
  const nodesToWrap = Array.from(item.childNodes).filter((node) => !isWhitespaceTextNode(node));

  nodesToWrap.forEach((node) => {
    blockquote.appendChild(node);
  });

  if (!blockquote.childNodes.length) {
    blockquote.innerHTML = '<br>';
  }

  item.appendChild(blockquote);
  return blockquote;
}

function getSelectedListItems(editor: HTMLElement, range: Range): HTMLLIElement[] {
  const selectedItems = Array.from(editor.querySelectorAll('li')).filter(
    (item): item is HTMLLIElement => item instanceof HTMLLIElement && rangeIntersectsElement(range, item),
  );
  const selectedSet = new Set(selectedItems);

  return selectedItems.filter((item) => {
    let parent = item.parentElement?.closest('li') as HTMLLIElement | null;
    while (parent) {
      if (selectedSet.has(parent)) return false;
      parent = parent.parentElement?.closest('li') as HTMLLIElement | null;
    }
    return true;
  });
}

function placeCaretInNode(node: Node): void {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  const target =
    node instanceof HTMLElement
      ? (node.querySelector('p,li,h1,h2,h3,h4,h5,h6') || node)
      : node;

  range.selectNodeContents(target);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function dispatchEditorInput(editor: HTMLElement): void {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function recordDomTransaction(editor: HTMLElement, beforeHTML: string, afterHTML: string): void {
  const execEditorCommand = (window as any).execEditorCommand;
  if (typeof execEditorCommand === 'function') {
    execEditorCommand('recordDomTransaction', editor, beforeHTML, afterHTML);
    return;
  }

  const executeEditorCommand = (window as any).executeEditorCommand;
  if (typeof executeEditorCommand !== 'function') return;

  executeEditorCommand('recordDomTransaction', { editor, beforeHTML, afterHTML });
}

function toggleSelectedBlockquote(context?: any): boolean {
  const editor = resolveEditorContent(context);
  if (!editor) return false;

  const range = getSelectionRangeInEditor(editor);
  if (!range) return false;

  const beforeHTML = editor.innerHTML;
  const startQuote = getBlockquoteAncestor(editor, range.startContainer);
  const endQuote = getBlockquoteAncestor(editor, range.endContainer);
  const selectedListItems = getSelectedListItems(editor, range);
  const selectedBlocks = getSelectedTopLevelBlocks(editor, range);
  const allSelectedBlocksAreQuotes =
    selectedBlocks.length > 0 && selectedBlocks.every((block) => block.tagName === 'BLOCKQUOTE');

  if (startQuote && startQuote === endQuote) {
    const nextCaretTarget = startQuote.firstChild || startQuote;
    unwrapBlockquote(startQuote);
    placeCaretInNode(nextCaretTarget);
  } else if (selectedListItems.length > 0) {
    const selectedItemQuotes = selectedListItems.map(getOnlyContentBlockquote);
    const allSelectedItemsAreQuoted = selectedItemQuotes.every(Boolean);

    if (allSelectedItemsAreQuoted) {
      const nextCaretTarget = selectedItemQuotes[0]?.firstChild || selectedListItems[0];
      selectedItemQuotes.forEach((blockquote) => {
        if (blockquote) {
          unwrapBlockquote(blockquote);
        }
      });
      placeCaretInNode(nextCaretTarget);
    } else {
      const nextCaretTarget = selectedListItems[0];
      selectedListItems.forEach((item) => {
        if (!getOnlyContentBlockquote(item)) {
          wrapListItemContents(item);
        }
      });
      placeCaretInNode(nextCaretTarget);
    }
  } else if (allSelectedBlocksAreQuotes) {
    const nextCaretTarget = selectedBlocks[0].firstChild || selectedBlocks[0];
    selectedBlocks.forEach(unwrapBlockquote);
    placeCaretInNode(nextCaretTarget);
  } else {
    const blocksToWrap = selectedBlocks.filter((block) => block.tagName !== 'BLOCKQUOTE');
    if (blocksToWrap.length === 0) return false;

    const blockquote = document.createElement('blockquote');
    const firstBlock = blocksToWrap[0];
    firstBlock.parentNode?.insertBefore(blockquote, firstBlock);
    blocksToWrap.forEach((block) => {
      blockquote.appendChild(block);
    });
    placeCaretInNode(blockquote);
  }

  const afterHTML = editor.innerHTML;
  if (beforeHTML === afterHTML) return false;

  recordDomTransaction(editor, beforeHTML, afterHTML);
  dispatchEditorInput(editor);
  return true;
}

/**
 * Blockquote Plugin - Framework Agnostic
 * 
 * Adds blockquote support with native command implementation.
 * No React dependency required.
 */
export const BlockquotePlugin = (): Plugin => ({
  name: "blockquote",

  // Schema definition for blockquote node
  nodes: {
    blockquote: {
      content: "block+",
      group: "block",
      parseDOM: [{ tag: "blockquote" }],
      toDOM: () => ["blockquote", 0],
    },
  },

  // Toolbar button configuration
  toolbar: [
    {
      label: "Quote",
      command: "toggleBlockquote",
      icon: '<svg fill="#000000" height="24px" width="24px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M13,11c0.6,0,1-0.4,1-1s-0.4-1-1-1c-5,0-9,4-9,9c0,2.8,2.2,5,5,5s5-2.2,5-5s-2.2-5-5-5c-0.3,0-0.7,0-1,0.1 C9.3,11.8,11,11,13,11z"></path> <path d="M23,13c-0.3,0-0.7,0-1,0.1c1.3-1.3,3-2.1,5-2.1c0.6,0,1-0.4,1-1s-0.4-1-1-1c-5,0-9,4-9,9c0,2.8,2.2,5,5,5s5-2.2,5-5 S25.8,13,23,13z"></path> </g> </g></svg>',
      shortcut: "Mod-Shift-9",
    },
  ],

  // Native command implementations
  commands: {
    /**
     * Toggle blockquote formatting on current selection
     */
    toggleBlockquote: (_params?: unknown, context?: any) => toggleSelectedBlockquote(context),
  },

  // Keyboard shortcuts
  keymap: {
    "Mod-Shift-9": "toggleBlockquote",
  },
});
