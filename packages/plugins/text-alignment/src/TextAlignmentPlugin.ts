import { Plugin } from '@editora/core';
// import { TextAlignmentProvider } from './TextAlignmentProvider';

/**
 * Text Alignment Plugin for Rich Text Editor
 *
 * Allows users to set text alignment (left, center, right, justify)
 * for selected paragraphs by applying CSS styles directly to <p> elements
 */
export const TextAlignmentPlugin = (): Plugin => ({
  name: 'textAlignment',
  toolbar: [
    {
      label: 'Text Alignment',
      command: 'setTextAlignment',
      type: 'inline-menu',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' }
      ]
    }
  ],
  // context: {
  //   provider: TextAlignmentProvider
  // }
});

/**
 * Text Alignment Commands
 * Applies CSS text-align styles directly to paragraph elements
 */

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
    if (startParagraph) paragraphs.push(startParagraph);
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

// Set text alignment command
export const setTextAlignmentCommand = (alignment?: string) => {
  if (!alignment) return;

  const validAlignments = ['left', 'center', 'right', 'justify'];
  if (!validAlignments.includes(alignment)) return;

  // Get current selection
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const paragraphs = getParagraphsInRange(range);

  // Apply text alignment to each paragraph
  paragraphs.forEach(paragraph => {
    if (paragraph) {
      paragraph.style.textAlign = alignment;
    }
  });

  // Restore the selection
  selection.removeAllRanges();
  selection.addRange(range);
};
