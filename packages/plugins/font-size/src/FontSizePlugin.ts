import { Plugin } from '@editora/core';

/**
 * Font Size Plugin for Rich Text Editor
 *
 * Allows users to increase, decrease, and manually set font sizes
 * for selected text using execCommand API
 */
export const FontSizePlugin = (): Plugin => ({
  name: 'fontSize',
  toolbar: [
    {
      label: 'Decrease Font Size',
      command: 'decreaseFontSize',
      icon: '−'
    },
    {
      label: 'Font Size',
      command: 'setFontSize',
      type: 'input',
      placeholder: '14'
    },
    {
      label: 'Increase Font Size',
      command: 'increaseFontSize',
      icon: '+'
    }
  ]
});

/**
 * Font Size Commands
 * Uses execCommand for font size manipulation
 */

// Decrease font size command
export const decreaseFontSizeCommand = () => {
  applyFontSizeChange(-2);
  updateFontSizeInput();
};

// Increase font size command
export const increaseFontSizeCommand = () => {
  applyFontSizeChange(2);
  updateFontSizeInput();
};

// Set font size command (for manual input)
export const setFontSizeCommand = (size?: string) => {
  if (!size) return;

  const sizeNum = parseInt(size, 10);
  if (isNaN(sizeNum) || sizeNum < 8 || sizeNum > 72) return;

  applyFontSizeToSelection(sizeNum);
};

// Helper function to apply relative font size change
function applyFontSizeChange(delta: number) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  // Get current font size from selection
  const currentSize = getCurrentFontSizeFromSelection();

  // Calculate new size with bounds
  const newSize = delta < 0
    ? Math.max(8, currentSize + delta)   // Decrease: min 8px
    : Math.min(72, currentSize + delta); // Increase: max 72px

  applyFontSizeToSelection(newSize);
}

// Helper function to get current font size from selection
function getCurrentFontSizeFromSelection(): number {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return 14; // default

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const element = startContainer.nodeType === Node.TEXT_NODE
    ? startContainer.parentElement
    : startContainer as Element;

  if (element) {
    const computedStyle = window.getComputedStyle(element);
    const fontSize = computedStyle.fontSize;
    const match = fontSize.match(/(\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }

  return 14; // default fallback
}

// Helper function to apply font size to current selection
function applyFontSizeToSelection(size: number) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // If there's no actual selection (just cursor), apply to future text
  if (range.collapsed) {
    return; // Can't apply font size to collapsed selection
  }

  // Check if the entire selection is within a single font-size span
  const commonAncestor = range.commonAncestorContainer;
  const fontSizeSpan = findFontSizeSpanAncestor(commonAncestor);

  if (fontSizeSpan && isSelectionEntirelyWithinSpan(range, fontSizeSpan)) {
    // Update existing span's font-size
    fontSizeSpan.style.fontSize = size + 'px';

    // Restore selection
    const newRange = document.createRange();
    newRange.selectNodeContents(fontSizeSpan);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    // Create new span wrapper
    const span = document.createElement('span');
    span.style.fontSize = size + 'px';

    // Wrap the selected content
    try {
      range.surroundContents(span);
    } catch (e) {
      // surroundContents fails if the range spans multiple elements
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
    }

    // Restore selection to the inserted span
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}

// Helper function to find if there's a font-size span ancestor
function findFontSizeSpanAncestor(node: Node): HTMLElement | null {
  let current: Node | null = node;

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.tagName === 'SPAN' && element.style.fontSize) {
        return element;
      }
    }
    current = current.parentNode;
  }

  return null;
}

// Helper function to check if selection is entirely within a span
function isSelectionEntirelyWithinSpan(range: Range, span: HTMLElement): boolean {
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;

  // Check if both start and end are within the span
  const startInSpan = span.contains(startContainer) ||
    (startContainer.nodeType === Node.TEXT_NODE &&
     startContainer.parentElement === span);

  const endInSpan = span.contains(endContainer) ||
    (endContainer.nodeType === Node.TEXT_NODE &&
     endContainer.parentElement === span);

  return startInSpan && endInSpan;
}

// Helper function to update the font size input field
function updateFontSizeInput() {
  const currentSize = getCurrentFontSizeFromSelection();
  const input = document.querySelector('.rte-toolbar-input') as HTMLInputElement;
  if (input) {
    input.value = currentSize.toString();
  }
}
