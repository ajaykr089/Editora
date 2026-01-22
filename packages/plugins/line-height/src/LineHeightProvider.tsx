import React, { ReactNode } from 'react';

/**
 * Line Height Provider - Isolated plugin functionality
 *
 * Allows users to set line height for selected text
 * using DOM manipulation with predefined line height values
 */

interface LineHeightProviderProps {
  children: ReactNode;
}

export const LineHeightProvider: React.FC<LineHeightProviderProps> = ({ children }) => {
  React.useEffect(() => {
    // Register commands with global system
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.('setLineHeight', setLineHeightCommand);
    }
  }, []);

  return <>{children}</>;
};

/**
 * Line Height Commands - Uses DOM manipulation for line height application
 */

// Set line height command
const setLineHeightCommand = (lineHeight?: string) => {
  if (!lineHeight) return;

  applyLineHeightToSelection(lineHeight);
};

// Helper function to apply line height to current selection
function applyLineHeightToSelection(lineHeight: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // If there's no actual selection (just cursor), apply to future text
  if (range.collapsed) {
    return; // Can't apply line height to collapsed selection
  }

  // Check if the entire selection is within a single line-height span
  const commonAncestor = range.commonAncestorContainer;
  const lineHeightSpan = findLineHeightSpanAncestor(commonAncestor);

  if (lineHeightSpan && isSelectionEntirelyWithinSpan(range, lineHeightSpan)) {
    // Update existing span's line-height
    lineHeightSpan.style.lineHeight = lineHeight;

    // Restore selection
    const newRange = document.createRange();
    newRange.selectNodeContents(lineHeightSpan);
    selection.removeAllRanges();
    selection.addRange(newRange);
  } else {
    // Create new span wrapper
    const span = document.createElement('span');
    span.style.lineHeight = lineHeight;

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

// Helper function to find if there's a line-height span ancestor
function findLineHeightSpanAncestor(node: Node): HTMLElement | null {
  let current: Node | null = node;

  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.tagName === 'SPAN' && element.style.lineHeight) {
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
