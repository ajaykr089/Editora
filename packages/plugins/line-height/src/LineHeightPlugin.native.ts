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

/**
 * Find the containing block element for line height
 */
const findBlockElement = (node: Node): HTMLElement | null => {
  let current: Node | null = node;

  // Block-level elements that can have line-height
  const blockElements = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'PRE'];

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (blockElements.includes(element.tagName)) {
        return element;
      }
    }
    current = current.parentNode;
  }

  return null;
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
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    const element = findBlockElement(range.commonAncestorContainer);

    if (element) {
      element.style.lineHeight = height;
      return true;
    }

    return false;
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
