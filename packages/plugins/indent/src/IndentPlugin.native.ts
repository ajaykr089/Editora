import { Plugin } from '@editora/core';

/**
 * Indent Plugin - Native Implementation
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 * 
 * Provides advanced indentation with:
 * - Custom padding-based indentation (40px increments)
 * - Multi-paragraph selection support
 * - Smart paragraph detection
 * - Unit conversion (px, em)
 * - Keyboard shortcuts (Tab, Shift-Tab, Cmd-[, Cmd-])
 */

declare global {
  interface Window {
    execEditorCommand?: (command: string, ...args: any[]) => any;
    executeEditorCommand?: (command: string, ...args: any[]) => any;
  }
}

const INDENT_AMOUNT = 40; // pixels

/**
 * Check if an element is a block-level element that can be indented
 */
const isBlockElement = (element: HTMLElement): boolean => {
  const blockTags = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'PRE'];
  return (
    blockTags.includes(element.tagName) &&
    element.getAttribute('contenteditable') !== 'true'
  );
};

/**
 * Find the active editor element
 */
const findActiveEditor = (): HTMLElement | null => {
  // Try to find editor from current selection
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
  
  // Try active element
  const activeElement = document.activeElement;
  if (activeElement) {
    if (activeElement.getAttribute('contenteditable') === 'true') {
      return activeElement as HTMLElement;
    }
    const editor = activeElement.closest('[contenteditable="true"]');
    if (editor) return editor as HTMLElement;
  }
  
  // Fallback to first editor
  return document.querySelector('[contenteditable="true"]');
};

/**
 * Find the containing block element (paragraph, div, heading, etc.)
 */
const findContainingParagraph = (node: Node): HTMLElement | null => {
  let current: Node | null = node;

  // If the node itself is a block element, return it
  if (current.nodeType === Node.ELEMENT_NODE) {
    const element = current as HTMLElement;
    if (isBlockElement(element)) {
      return element;
    }
  }

  // Traverse up the DOM tree to find the nearest block element
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (isBlockElement(element)) {
        return element;
      }
      // Stop if we hit the contenteditable boundary
      if (element.getAttribute('contenteditable') === 'true') {
        break;
      }
    }
    current = current.parentNode;
  }

  return null;
};

/**
 * Find all block elements that intersect with the range
 */
const getBlocksInRange = (range: Range, editor: HTMLElement): HTMLElement[] => {
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
    pushBlock(findContainingParagraph(range.startContainer));
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
    pushBlock(findContainingParagraph(range.commonAncestorContainer));
  }

  return blocks;
};

/**
 * Get current padding-left value in pixels
 */
const getCurrentPadding = (element: HTMLElement): number => {
  const computedStyle = window.getComputedStyle(element);
  const paddingLeft = computedStyle.paddingLeft;
  
  // Convert to pixels (assuming px or em units)
  if (paddingLeft.endsWith('px')) {
    return parseFloat(paddingLeft);
  } else if (paddingLeft.endsWith('em')) {
    const fontSize = parseFloat(computedStyle.fontSize);
    return parseFloat(paddingLeft) * fontSize;
  }
  
  return 0;
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
 * Increase indentation level
 */
export const increaseIndent = (): boolean => {
  const editor = findActiveEditor();
  if (!editor) return false;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  
  // Verify selection is within the active editor
  if (!editor.contains(range.commonAncestorContainer)) return false;

  const paragraphs = getBlocksInRange(range, editor);

  if (paragraphs.length === 0) return false;
  const beforeHTML = editor.innerHTML;

  // Apply indentation to all selected paragraphs
  paragraphs.forEach(paragraph => {
    const currentPadding = getCurrentPadding(paragraph);
    const newPadding = currentPadding + INDENT_AMOUNT;
    paragraph.style.paddingLeft = `${newPadding}px`;
  });

  recordDomHistoryTransaction(editor, beforeHTML);
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
};

/**
 * Decrease indentation level
 */
export const decreaseIndent = (): boolean => {
  const editor = findActiveEditor();
  if (!editor) return false;

  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  
  // Verify selection is within the active editor
  if (!editor.contains(range.commonAncestorContainer)) return false;

  const paragraphs = getBlocksInRange(range, editor);

  if (paragraphs.length === 0) return false;
  const beforeHTML = editor.innerHTML;

  // Apply indentation to all selected paragraphs
  paragraphs.forEach(paragraph => {
    const currentPadding = getCurrentPadding(paragraph);
    const newPadding = Math.max(0, currentPadding - INDENT_AMOUNT); // Minimum 0
    paragraph.style.paddingLeft = `${newPadding}px`;
  });

  recordDomHistoryTransaction(editor, beforeHTML);
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
};

/**
 * Register commands globally
 */
const registerCommand = (command: string, handler: () => void): void => {
  if (typeof window !== 'undefined') {
    (window as any).registerEditorCommand?.(command, handler);
  }
};

/**
 * Initialize global command registration
 */
const initializeCommands = (): void => {
  registerCommand('increaseIndent', increaseIndent);
  registerCommand('decreaseIndent', decreaseIndent);
};

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommands);
  } else {
    initializeCommands();
  }
}

export const IndentPlugin = (): Plugin => ({
  name: 'indent',
  
  toolbar: [
    {
      label: 'Increase Indent',
      command: 'increaseIndent',
      type: 'button',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm8-7h10v2H11v-2zm0 4h10v2H11v-2zM3 8l4 4-4 4V8z"/></svg>',
      shortcut: 'Mod-]'
    },
    {
      label: 'Decrease Indent',
      command: 'decreaseIndent',
      type: 'button',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4h18v2H3V4zm0 14h18v2H3v-2zm8-7h10v2H11v-2zm0 4h10v2H11v-2zM7 8v8l-4-4 4-4z"/></svg>',
      shortcut: 'Mod-['
    }
  ],
  
  commands: {
    increaseIndent,
    decreaseIndent
  },
  
  keymap: {
    'Mod-]': 'increaseIndent',
    'Mod-[': 'decreaseIndent',
    'Tab': 'increaseIndent',
    'Shift-Tab': 'decreaseIndent'
  }
});
