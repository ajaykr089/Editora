import type { Plugin } from '@editora/core';

/**
 * DirectionPlugin - Native implementation for text direction (LTR/RTL)
 * 
 * Features:
 * - Set text direction to Left-to-Right (LTR) - removes dir attribute (default)
 * - Set text direction to Right-to-Left (RTL) - sets dir="rtl"
 * - Essential for multilingual content (Arabic, Hebrew, Persian, Urdu, etc.)
 * 
 * Commands:
 * - setDirectionLTR: Remove dir attribute (default LTR behavior)
 * - setDirectionRTL: Set dir="rtl" on nearest block element
 * 
 * UI/UX Features:
 * - Detailed SVG icons matching React implementation
 * - Works on block-level elements (P, DIV, H1-H6, LI, BLOCKQUOTE)
 * - Keyboard shortcuts: Cmd/Ctrl+Shift+L (LTR), Cmd/Ctrl+Shift+R (RTL)
 * - Clean attribute-only approach (no inline styles)
 */

declare global {
  interface Window {
    execEditorCommand?: (command: string, ...args: any[]) => any;
    executeEditorCommand?: (command: string, ...args: any[]) => any;
  }
}

// List of block-level elements that can have direction attributes
const BLOCK_LEVEL_TAGS = new Set([
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
    BLOCK_LEVEL_TAGS.has(element.tagName) &&
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

const findContainingBlock = (node: Node): HTMLElement | null => {
  let current: Node | null = node;
  while (current && current !== document.body) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (isBlockElement(element)) return element;
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
    pushBlock(findContainingBlock(range.startContainer));
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
    pushBlock(findContainingBlock(range.commonAncestorContainer));
  }

  return blocks;
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

const applyDirectionToSelection = (dir: 'rtl' | null): boolean => {
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
    if (dir === 'rtl') {
      block.setAttribute('dir', 'rtl');
    } else {
      block.removeAttribute('dir');
    }
  });

  recordDomHistoryTransaction(editor, beforeHTML);
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
};

export const DirectionPlugin = (): Plugin => {
  return {
    name: 'direction',
    
    toolbar: [
      {
        label: 'Left to Right',
        command: 'setDirectionLTR',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 18H3M21 18L18 21M21 18L18 15M13 3V12M13 3H7M13 3C13.4596 3 13.9148 3.0776 14.3394 3.22836C14.764 3.37913 15.1499 3.6001 15.4749 3.87868C15.7999 4.15726 16.0577 4.48797 16.2336 4.85195C16.4095 5.21593 16.5 5.60603 16.5 6C16.5 6.39397 16.4095 6.78407 16.2336 7.14805C16.0577 7.51203 15.7999 7.84274 15.4749 8.12132C15.1499 8.3999 14.764 8.62087 14.3394 8.77164C13.9148 8.9224 13.4596 9 13 9V3ZM9 3V12" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
        shortcut: 'Mod-Shift-l'
      },
      {
        label: 'Right to Left',
        command: 'setDirectionRTL',
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 18H21M3 18L6 21M3 18L6 15M11 12V3H17M15 3V12M10.5 3C10.0404 3 9.58525 3.0776 9.16061 3.22836C8.73597 3.37913 8.35013 3.6001 8.02513 3.87868C7.70012 4.15726 7.44231 4.48797 7.26642 4.85195C7.09053 5.21593 7 5.60603 7 6C7 6.39397 7.09053 6.78407 7.26642 7.14805C7.44231 7.51203 7.70012 7.84274 8.02513 8.12132C8.35013 8.3999 8.73597 8.62087 9.16061 8.77164C9.58525 8.9224 10.0404 9 10.5 9L10.5 3Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`,
        shortcut: 'Mod-Shift-r'
      }
    ],

    commands: {
      setDirectionLTR: () => {
        try {
          return applyDirectionToSelection(null);
        } catch (error) {
          console.error('Failed to set LTR direction:', error);
          return false;
        }
      },

      setDirectionRTL: () => {
        try {
          return applyDirectionToSelection('rtl');
        } catch (error) {
          console.error('Failed to set RTL direction:', error);
          return false;
        }
      }
    },

    keymap: {
      'Mod-Shift-l': 'setDirectionLTR',
      'Mod-Shift-r': 'setDirectionRTL'
    }
  };
};
