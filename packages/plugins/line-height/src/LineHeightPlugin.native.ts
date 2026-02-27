import type { Plugin } from '@editora/core';

/**
 * LineHeight Plugin - Native Implementation
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 * 
 * Provides line height formatting with:
 * - Inline menu dropdown with predefined values
 * - Applies to entire paragraph or selected block
 * - Smart unit handling (numeric values)
 * - Current value detection and display
 */

declare global {
  interface Window {
    execEditorCommand?: (command: string, ...args: any[]) => any;
    executeEditorCommand?: (command: string, ...args: any[]) => any;
  }
}

/**
 * Predefined line height options
 */
const lineHeights = [
  { label: '1.0', value: '1.0' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2.0' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3.0' }
];

const BLOCK_ELEMENTS = new Set([
  'P',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'LI',
  'BLOCKQUOTE',
  'PRE',
]);

const isBlockElement = (element: HTMLElement): boolean => {
  return (
    BLOCK_ELEMENTS.has(element.tagName) &&
    element.getAttribute('contenteditable') !== 'true'
  );
};

const findActiveEditor = (): HTMLElement | null => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let node: Node | null = selection.getRangeAt(0).startContainer;
    while (node && node !== document.body) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.getAttribute('contenteditable') === 'true') {
          return element;
        }
      }
      node = node.parentNode;
    }
  }

  const activeElement = document.activeElement;
  if (activeElement) {
    if (activeElement.getAttribute('contenteditable') === 'true') {
      return activeElement as HTMLElement;
    }
    const editor = activeElement.closest('[contenteditable="true"]');
    if (editor) return editor as HTMLElement;
  }

  return document.querySelector('[contenteditable="true"]');
};

/**
 * Find the containing block element for line height
 */
const findBlockElement = (node: Node): HTMLElement | null => {
  let current: Node | null = node;

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (isBlockElement(element)) {
        return element;
      }
      if (element.getAttribute('contenteditable') === 'true') break;
    }
    current = current.parentNode;
  }

  return null;
};

const getSelectedBlocks = (range: Range, editor: HTMLElement): HTMLElement[] => {
  const blocks: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();

  const pushBlock = (element: HTMLElement | null) => {
    if (!element || seen.has(element)) return;
    if (!editor.contains(element)) return;
    if (!isBlockElement(element)) return;
    seen.add(element);
    blocks.push(element);
  };

  if (range.collapsed) {
    pushBlock(findBlockElement(range.startContainer));
    return blocks;
  }

  const walker = document.createTreeWalker(
    editor,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node: Node) => {
        const element = node as HTMLElement;
        if (!isBlockElement(element)) return NodeFilter.FILTER_SKIP;

        if (typeof range.intersectsNode === 'function') {
          return range.intersectsNode(element)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }

        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(element);
        const intersects =
          range.compareBoundaryPoints(Range.END_TO_START, nodeRange) > 0 &&
          range.compareBoundaryPoints(Range.START_TO_END, nodeRange) < 0;
        return intersects ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    },
  );

  let current = walker.nextNode();
  while (current) {
    pushBlock(current as HTMLElement);
    current = walker.nextNode();
  }

  if (blocks.length === 0) {
    pushBlock(findBlockElement(range.commonAncestorContainer));
  }

  return blocks;
};

const dispatchEditorInput = (editor: HTMLElement) => {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
};

const recordDomHistoryTransaction = (editor: HTMLElement, beforeHTML: string): void => {
  if (beforeHTML === editor.innerHTML) return;
  const executor = window.execEditorCommand || window.executeEditorCommand;
  if (typeof executor !== 'function') return;

  try {
    executor('recordDomTransaction', editor, beforeHTML, editor.innerHTML);
  } catch {
    // History plugin may be unavailable.
  }
};

/**
 * Get current line height value
 */
const getCurrentLineHeight = (): string => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return '1.5';

  const range = selection.getRangeAt(0);
  const element = findBlockElement(range.commonAncestorContainer);

  if (element) {
    const lineHeight = window.getComputedStyle(element).lineHeight;
    if (lineHeight && lineHeight !== 'normal') {
      // Convert px to numeric if needed
      const fontSize = window.getComputedStyle(element).fontSize;
      if (fontSize && lineHeight.endsWith('px')) {
        const lh = parseFloat(lineHeight);
        const fs = parseFloat(fontSize);
        return (lh / fs).toFixed(2);
      }
      return lineHeight;
    }
  }

  return '1.5';
};

/**
 * Set line height on selected block element
 */
export const setLineHeight = (height?: string): boolean => {
  if (!height) return false;

  try {
    const editor = findActiveEditor();
    if (!editor) return false;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return false;

    const blocks = getSelectedBlocks(range, editor);
    if (blocks.length === 0) return false;
    const beforeHTML = editor.innerHTML;

    blocks.forEach((block) => {
      block.style.lineHeight = height;
    });

    recordDomHistoryTransaction(editor, beforeHTML);
    dispatchEditorInput(editor);
    return true;
  } catch (error) {
    console.error('Failed to set line height:', error);
    return false;
  }
};

/**
 * Register commands globally
 */
const registerCommand = (command: string, handler: (...args: any[]) => void): void => {
  if (typeof window !== 'undefined') {
    (window as any).registerEditorCommand?.(command, handler);
  }
};

/**
 * Initialize global command registration
 */
const initializeCommands = (): void => {
  registerCommand('setLineHeight', setLineHeight);
};

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommands);
  } else {
    initializeCommands();
  }
}

export const LineHeightPlugin = (): Plugin => ({
  name: 'lineHeight',

  marks: {
    lineHeight: {
      attrs: {
        height: { default: null }
      },
      parseDOM: [
        {
          tag: 'span[style*="line-height"]',
          getAttrs: (dom) => {
            const element = dom as HTMLElement;
            const height = element.style.lineHeight;
            return height ? { height } : false;
          }
        }
      ],
      toDOM: (mark) => {
        return ['span', { style: `line-height: ${mark.attrs.height}` }, 0];
      }
    }
  },

  toolbar: [
    {
      label: 'Line Height',
      command: 'setLineHeight',
      type: 'inline-menu',
      options: lineHeights,
      icon: '<svg width="24" height="24" focusable="false"><path d="M21 5a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zm0 4a1 1 0 0 1 .1 2H13a1 1 0 0 1-.1-2H21zM7 3.6l3.7 3.7a1 1 0 0 1-1.3 1.5h-.1L8 7.3v9.2l1.3-1.3a1 1 0 0 1 1.3 0h.1c.4.4.4 1 0 1.3v.1L7 20.4l-3.7-3.7a1 1 0 0 1 1.3-1.5h.1L6 16.7V7.4L4.7 8.7a1 1 0 0 1-1.3 0h-.1a1 1 0 0 1 0-1.3v-.1L7 3.6z"></path></svg>'
    }
  ],

  commands: {
    setLineHeight
  }
});
