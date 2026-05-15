import { Plugin } from '@editora/core';

const EDITOR_CONTENT_SELECTOR = '.rte-content, .editora-content, [contenteditable="true"]';
const ROOT_EDITOR_SELECTOR = '[data-editora-editor], .rte-editor, .editora-editor, editora-editor';
const TEXT_BLOCK_TAGS = new Set(['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'PRE']);
const BLOCK_SELECTOR = 'p,div,h1,h2,h3,h4,h5,h6,ul,ol,blockquote,pre,table';
const TARGET_BLOCK_TAGS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

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
  if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) {
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

function copyAttributes(from: Element, to: HTMLElement): void {
  Array.from(from.attributes).forEach((attribute) => {
    to.setAttribute(attribute.name, attribute.value);
  });
}

function moveChildNodes(from: Node, to: Node): void {
  while (from.firstChild) {
    to.appendChild(from.firstChild);
  }
}

function isGeneratedEmptyParagraph(element: Element): boolean {
  if (element.tagName !== 'P') return false;
  if (element.attributes.length > 0) return false;
  if ((element.textContent || '').trim() !== '') return false;
  return !element.querySelector('img, video, table, iframe, hr, pre, ul, ol');
}

function createTargetBlock(tagName: string, source?: Element): HTMLElement {
  const block = document.createElement(tagName);
  if (source) {
    copyAttributes(source, block);
  }
  return block;
}

function createBlockFromListItem(item: HTMLLIElement, tagName: string): HTMLElement {
  const block = createTargetBlock(tagName, item);
  moveChildNodes(item, block);
  if (!block.innerHTML.trim()) {
    block.innerHTML = '<br>';
  }
  return block;
}

function cloneListShell(list: HTMLElement): HTMLElement {
  const clone = list.cloneNode(false);
  return clone instanceof HTMLElement ? clone : document.createElement(list.tagName.toLowerCase());
}

function replaceListItemsWithBlocks(list: HTMLElement, selectedItems: Set<HTMLLIElement>, tagName: string): HTMLElement[] {
  const parent = list.parentNode;
  if (!parent) return [];

  const fragment = document.createDocumentFragment();
  const insertedBlocks: HTMLElement[] = [];
  let pendingList: HTMLElement | null = null;

  const flushPendingList = () => {
    if (pendingList && pendingList.children.length > 0) {
      fragment.appendChild(pendingList);
    }
    pendingList = null;
  };

  Array.from(list.children).forEach((child) => {
    if (!(child instanceof HTMLLIElement)) return;

    if (selectedItems.has(child)) {
      flushPendingList();
      const block = createBlockFromListItem(child, tagName);
      fragment.appendChild(block);
      insertedBlocks.push(block);
      return;
    }

    if (!pendingList) {
      pendingList = cloneListShell(list);
    }
    pendingList.appendChild(child);
  });

  flushPendingList();
  parent.insertBefore(fragment, list);
  parent.removeChild(list);

  return insertedBlocks;
}

function convertTextBlock(block: HTMLElement, tagName: string): HTMLElement[] {
  if (block.tagName.toLowerCase() === tagName) return [block];

  const nextBlock = createTargetBlock(tagName, block);
  moveChildNodes(block, nextBlock);
  if (!nextBlock.innerHTML.trim()) {
    nextBlock.innerHTML = '<br>';
  }
  block.parentNode?.replaceChild(nextBlock, block);
  return [nextBlock];
}

function convertInvalidBlockContents(block: HTMLElement, tagName: string): HTMLElement[] {
  const parent = block.parentNode;
  if (!parent) return [];

  const fragment = document.createDocumentFragment();
  const insertedBlocks: HTMLElement[] = [];

  Array.from(block.childNodes).forEach((child) => {
    if (child instanceof HTMLElement && isGeneratedEmptyParagraph(child)) {
      child.remove();
      return;
    }

    if (child instanceof HTMLUListElement || child instanceof HTMLOListElement) {
      Array.from(child.children).forEach((item) => {
        if (!(item instanceof HTMLLIElement)) return;
        const nextBlock = createBlockFromListItem(item, tagName);
        fragment.appendChild(nextBlock);
        insertedBlocks.push(nextBlock);
      });
      child.remove();
      return;
    }

    if (child instanceof HTMLElement && TEXT_BLOCK_TAGS.has(child.tagName)) {
      const nextBlock = createTargetBlock(tagName, child);
      moveChildNodes(child, nextBlock);
      fragment.appendChild(nextBlock);
      insertedBlocks.push(nextBlock);
      return;
    }

    if (child.nodeType === Node.TEXT_NODE && (child.textContent || '').trim() === '') {
      child.remove();
      return;
    }

    const nextBlock = createTargetBlock(tagName, block);
    nextBlock.appendChild(child);
    fragment.appendChild(nextBlock);
    insertedBlocks.push(nextBlock);
  });

  parent.insertBefore(fragment, block);
  parent.removeChild(block);
  return insertedBlocks;
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

function getSelectedListItems(editor: HTMLElement, range: Range): Map<HTMLElement, Set<HTMLLIElement>> {
  const itemsByList = new Map<HTMLElement, Set<HTMLLIElement>>();
  const selectedItems = Array.from(editor.querySelectorAll('li')).filter(
    (item): item is HTMLLIElement => item instanceof HTMLLIElement && rangeIntersectsElement(range, item),
  );

  selectedItems.forEach((item) => {
    const list = item.parentElement;
    if (!(list instanceof HTMLUListElement || list instanceof HTMLOListElement)) return;
    if (list.parentElement !== editor) return;
    if (!itemsByList.has(list)) {
      itemsByList.set(list, new Set());
    }
    itemsByList.get(list)?.add(item);
  });

  return itemsByList;
}

function setBlockTypeImpl(level: string, context?: any): boolean {
  const tagName = level.toLowerCase();
  if (!TARGET_BLOCK_TAGS.has(tagName)) return false;

  const editor = resolveEditorContent(context);
  if (!editor) return false;

  const range = getSelectionRangeInEditor(editor);
  if (!range) return false;

  const beforeHTML = editor.innerHTML;
  const insertedBlocks: HTMLElement[] = [];
  const selectedListItems = getSelectedListItems(editor, range);

  if (selectedListItems.size > 0) {
    selectedListItems.forEach((items, list) => {
      insertedBlocks.push(...replaceListItemsWithBlocks(list, items, tagName));
    });
  } else {
    const blocks = getSelectedTopLevelBlocks(editor, range);
    blocks.forEach((block) => {
      if (block instanceof HTMLUListElement || block instanceof HTMLOListElement) {
        const items = new Set(Array.from(block.children).filter(
          (child): child is HTMLLIElement => child instanceof HTMLLIElement,
        ));
        insertedBlocks.push(...replaceListItemsWithBlocks(block, items, tagName));
        return;
      }

      if (TEXT_BLOCK_TAGS.has(block.tagName)) {
        const hasInvalidBlockChildren = block.querySelector(':scope > ul, :scope > ol, :scope > blockquote, :scope > table');
        insertedBlocks.push(
          ...(hasInvalidBlockChildren
            ? convertInvalidBlockContents(block, tagName)
            : convertTextBlock(block, tagName)),
        );
      }
    });
  }

  const afterHTML = editor.innerHTML;
  if (beforeHTML === afterHTML || insertedBlocks.length === 0) return false;

  recordDomTransaction(editor, beforeHTML, afterHTML);
  dispatchEditorInput(editor);
  placeCaretInNode(insertedBlocks[0]);
  return true;
}

/**
 * Heading Plugin - Framework Agnostic
 * 
 * Adds heading support (H1-H6) with native command implementation.
 * No React dependency required.
 */
export const HeadingPlugin = (): Plugin => {
  return {
    name: 'heading',
    
    // Toolbar button configuration with dropdown
    toolbar: [
      {
        label: 'P',
        command: 'setBlockType',
        type: 'dropdown',
        options: [
          { value: 'p', label: 'P' },
          { value: 'h1', label: 'H1' },
          { value: 'h2', label: 'H2' },
          { value: 'h3', label: 'H3' },
          { value: 'h4', label: 'H4' },
          { value: 'h5', label: 'H5' },
          { value: 'h6', label: 'H6' }
        ],
        icon: '<svg width="24" height="24" focusable="false"><path d="M16.1 8.6 14.2 4l-1.4.5 2.8 7.4c.1.4.5.6.9.6h.1c.4-.1.6-.5.6-.9l1.8-4.8-1.4-.5-1.5 2.3ZM4 11.5h6V10H4v1.5ZM18.5 3v1L17 7l.9.9L20.7 3h-2.2ZM5.5 12h1v7h1v-7h1v-.5h-3V12Zm4 0h1v7h1v-7h1v-.5h-3V12Zm10 1.5a2 2 0 0 0-2-2h-1v7.5h1v-2.7h1a2 2 0 0 0 2-2v-.8Zm-2 1.3h-1v-2.3h1a.8.8 0 1 1 0 1.6v.7Z" fill-rule="evenodd"></path></svg>'
      }
    ],
    
    // Native command implementations
    commands: {
      /**
       * Set block type to specific heading level or paragraph
       */
      setBlockType: (level?: string, context?: any) => {
        if (!level) return false;
        return setBlockTypeImpl(level, context);
      },
      
      /**
       * Set heading level 1
       */
      setHeading1: (_params?: unknown, context?: any) => setBlockTypeImpl('h1', context),
      
      /**
       * Set heading level 2
       */
      setHeading2: (_params?: unknown, context?: any) => setBlockTypeImpl('h2', context),
      
      /**
       * Set heading level 3
       */
      setHeading3: (_params?: unknown, context?: any) => setBlockTypeImpl('h3', context),
      
      /**
       * Set to paragraph
       */
      setParagraph: (_params?: unknown, context?: any) => setBlockTypeImpl('p', context)
    },
    
    // Keyboard shortcuts
    keymap: {
      'Mod-Alt-1': 'setHeading1',
      'Mod-Alt-2': 'setHeading2',
      'Mod-Alt-3': 'setHeading3',
      'Mod-Alt-0': 'setParagraph'
    }
  };
};
