import { Plugin } from '@editora/core';
import { PageBreakPluginProvider } from './PageBreakPluginProvider';

/**
 * Page Break Plugin for Rich Text Editor
 *
 * Provides pagination boundaries with:
 * - Visual markers in editor
 * - Block-level enforcement (no nesting, no inline contexts)
 * - Automatic collapse of adjacent page breaks
 * - Smart deletion/navigation
 * - Print integration via CSS (page-break-after: always)
 *
 * Rules:
 * - Page breaks are block-level elements
 * - Cannot exist inside inline contexts
 * - Cannot be nested
 * - Multiple adjacent breaks collapse into one
 *
 * Integrations:
 * - Print: Converts to page-break-after CSS
 * - Footnote: Cannot split footnote list
 * - Code Sample: Cannot exist inside <pre>
 * - Anchor: May exist before/after
 */
export const PageBreakPlugin = (): Plugin => ({
  name: 'pageBreak',
  toolbar: [
    {
      label: 'Page Break',
      command: 'insertPageBreak',
      type: 'button',
      icon: '⎙'
    }
  ],
  context: {
    provider: PageBreakPluginProvider
  }
});

/**
 * Insert Page Break Command
 *
 * Creates a new page break at the current cursor position.
 * Enforces structural rules:
 * - Collapses adjacent page breaks
 * - Prevents insertion in inline contexts
 * - Maintains block-level structure
 */
export const insertPageBreakCommand = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer as HTMLElement;

  // Check if we're in an inline context
  if (isInlineContext(container)) {
    console.warn('Page breaks cannot be inserted in inline contexts');
    return;
  }

  // Get the block element containing the selection
  const blockElement = getContainingBlock(container);
  if (!blockElement) return;

  // Create page break element
  const pageBreak = document.createElement('div');
  pageBreak.className = 'rte-page-break';
  pageBreak.setAttribute('data-page-break', 'true');
  pageBreak.setAttribute('data-type', 'page-break');
  
  // Insert after the current block
  blockElement.parentNode?.insertBefore(pageBreak, blockElement.nextSibling);

  // Collapse adjacent page breaks
  collapseAdjacentPageBreaks(pageBreak);

  // Move cursor after the page break
  range.setStart(pageBreak.nextSibling || blockElement.parentNode, 0);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};

/**
 * Check if element is in an inline context
 * Page breaks cannot exist inside inline elements like <span>, <a>, etc.
 */
function isInlineContext(node: HTMLElement): boolean {
  const inlineElements = ['SPAN', 'A', 'STRONG', 'EM', 'B', 'I', 'U', 'SUP', 'SUB', 'CODE'];
  let current: HTMLElement | null = node;

  while (current && current.getAttribute('data-editora-editor') === null) {
    if (inlineElements.includes(current.tagName)) {
      return true;
    }
    current = current.parentElement;
  }

  return false;
}

/**
 * Get the containing block element
 * Traverses up DOM tree to find the nearest block element
 */
function getContainingBlock(node: Node): HTMLElement | null {
  const blockElements = ['DIV', 'P', 'BLOCKQUOTE', 'PRE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'TD', 'TH'];
  let current: Node | null = node;

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
}

/**
 * Collapse adjacent page breaks
 * Multiple consecutive page breaks should be collapsed into one
 */
function collapseAdjacentPageBreaks(pageBreak: HTMLElement) {
  let next = pageBreak.nextElementSibling;
  
  while (next) {
    if (next.classList.contains('rte-page-break')) {
      next.remove();
      next = pageBreak.nextElementSibling;
    } else {
      break;
    }
  }
}

/**
 * Handle page break deletion
 * When backspace is pressed on a page break, remove it
 */
export const handlePageBreakDeletion = (element: HTMLElement) => {
  if (element.classList.contains('rte-page-break')) {
    element.remove();
    return true;
  }
  return false;
};

/**
 * Handle page break navigation
 * Cursor should skip over page breaks when navigating with arrow keys
 */
export const handlePageBreakNavigation = (element: HTMLElement): boolean => {
  if (element.classList.contains('rte-page-break')) {
    return true; // Skip this element during navigation
  }
  return false;
};
