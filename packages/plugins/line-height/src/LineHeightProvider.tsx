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
 * Line Height Commands - Applies line height to the currently selected paragraph
 */

// Set line height command
const setLineHeightCommand = (lineHeight?: string) => {
  if (!lineHeight) return;

  // Store the current selection before any operations
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const savedRange = selection.getRangeAt(0).cloneRange();

  // Apply line height
  applyLineHeightToCurrentParagraph(lineHeight, savedRange);
};

// Helper function to apply line height to the currently selected paragraph(s)
function applyLineHeightToCurrentParagraph(lineHeight: string, savedRange: Range) {
  const paragraphs = getParagraphsInRange(savedRange);

  paragraphs.forEach(paragraph => {
    if (paragraph) {
      paragraph.style.lineHeight = lineHeight;
    }
  });

  // Restore the selection using the saved range
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
    selection.addRange(savedRange);
  }
}

// Helper function to find all paragraphs that intersect with the range
function getParagraphsInRange(range: Range): HTMLElement[] {
  const paragraphs: HTMLElement[] = [];
  const startParagraph = findContainingParagraph(range.startContainer);
  const endParagraph = findContainingParagraph(range.endContainer);

  if (!startParagraph && !endParagraph) return paragraphs;

  // If range is collapsed (just cursor), return the paragraph containing the cursor
  if (range.collapsed) {
    if (startParagraph) paragraphs.push(startParagraph);
    return paragraphs;
  }

  // For actual selections, find all paragraphs between start and end
  if (startParagraph === endParagraph) {
    // Selection is within a single paragraph
    paragraphs.push(startParagraph);
  } else {
    // Selection spans multiple paragraphs - find all paragraphs in between
    let current: HTMLElement | null = startParagraph;
    while (current && current !== endParagraph) {
      paragraphs.push(current);
      let nextSibling = current.nextElementSibling as HTMLElement | null;
      // If we hit a non-paragraph element, continue until we find the next paragraph
      while (nextSibling && nextSibling.tagName !== 'P') {
        nextSibling = nextSibling.nextElementSibling as HTMLElement | null;
      }
      current = nextSibling;
    }
    // Add the end paragraph if it's different
    if (endParagraph && endParagraph !== startParagraph) {
      paragraphs.push(endParagraph);
    }
  }

  return paragraphs;
}

// Helper function to find the containing paragraph element
function findContainingParagraph(node: Node): HTMLElement | null {
  let current: Node | null = node;

  // If the node itself is a paragraph, return it
  if (current.nodeType === Node.ELEMENT_NODE) {
    const element = current as HTMLElement;
    if (element.tagName === 'P') {
      return element;
    }
  }

  // Traverse up the DOM tree to find the nearest paragraph
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (element.tagName === 'P') {
        return element;
      }
    }
    current = current.parentNode;
  }

  return null;
}
