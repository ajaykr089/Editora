import React, { ReactNode } from 'react';

interface IndentPluginProviderProps {
  children: ReactNode;
}

export const IndentPluginProvider: React.FC<IndentPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  // Helper function to find all paragraphs that intersect with the range
  const getParagraphsInRange = (range: Range): HTMLElement[] => {
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
  };

  // Helper function to find the containing paragraph element
  const findContainingParagraph = (node: Node): HTMLElement | null => {
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
  };

  // Helper function to get current padding-left value
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

  React.useEffect(() => {
    registerCommand('increaseIndent', () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const paragraphs = getParagraphsInRange(range);

      // Apply indentation to all selected paragraphs
      paragraphs.forEach(paragraph => {
        const currentPadding = getCurrentPadding(paragraph);
        const newPadding = currentPadding + 40; // Increase by 40px
        paragraph.style.paddingLeft = `${newPadding}px`;
      });
    });

    registerCommand('decreaseIndent', () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const paragraphs = getParagraphsInRange(range);

      // Apply indentation to all selected paragraphs
      paragraphs.forEach(paragraph => {
        const currentPadding = getCurrentPadding(paragraph);
        const newPadding = Math.max(0, currentPadding - 40); // Decrease by 40px, minimum 0
        paragraph.style.paddingLeft = `${newPadding}px`;
      });
    });
  }, []);

  return <>{children}</>;
};
