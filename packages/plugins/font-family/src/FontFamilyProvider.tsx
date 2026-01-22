import React, { ReactNode } from 'react';

/**
 * Font Family Provider - Isolated plugin functionality
 *
 * Allows users to change font family for selected text
 * using DOM manipulation with common web-safe fonts
 */

interface FontFamilyProviderProps {
  children: ReactNode;
}

export const FontFamilyProvider: React.FC<FontFamilyProviderProps> = ({ children }) => {
  React.useEffect(() => {
    // Register commands with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('setFontFamily', setFontFamilyCommand);
    }
  }, []);

  return <>{children}</>;
};

/**
 * Font Family Commands - Restored from FontFamilyPlugin
 * Uses DOM manipulation for reliable font family application
 */

// Set font family command
const setFontFamilyCommand = (fontFamily: any) => {
  if (!fontFamily) return;

  const fontFamilyStr = String(fontFamily);
  applyFontFamilyToSelection(fontFamilyStr);
};

// Helper function to apply font family to current selection
function applyFontFamilyToSelection(fontFamily: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // If there's no actual selection (just cursor), apply to future text
  if (range.collapsed) {
    return; // Can't apply font family to collapsed selection
  }

  // Check if the entire selection is within a single font-family span
  const commonAncestor = range.commonAncestorContainer;
  const fontFamilySpan = findFontFamilySpanAncestor(commonAncestor);

  if (fontFamilySpan && isSelectionEntirelyWithinSpan(range, fontFamilySpan)) {
    // Update existing span's font-family
    fontFamilySpan.style.fontFamily = fontFamily;

    // Restore selection
    const newRange = document.createRange();
    newRange.selectNodeContents(fontFamilySpan);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    // Create new span wrapper
    const span = document.createElement('span');
    span.style.fontFamily = fontFamily;

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

// Helper function to find if there's a font-family span ancestor
function findFontFamilySpanAncestor(node: Node): HTMLElement | null {
  let current: Node | null = node;

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.tagName === 'SPAN' && element.style.fontFamily) {
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
