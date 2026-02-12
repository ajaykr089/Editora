import { Plugin } from '@editora/core';
// import { PageBreakPluginProvider } from './PageBreakPluginProvider';
import { findEditorContainerFromSelection, findEditorContainer } from '../../shared/editorContainerHelpers';

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
  name: "pageBreak",
  toolbar: [
    {
      label: "Page Break",
      command: "insertPageBreak",
      type: "button",
      icon: '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M1,6 L3,6 C3.55228475,6 4,6.44771525 4,7 C4,7.55228475 3.55228475,8 3,8 L1,8 C0.44771525,8 0,7.55228475 0,7 C0,6.44771525 0.44771525,6 1,6 Z M11,6 L13,6 C13.5522847,6 14,6.44771525 14,7 C14,7.55228475 13.5522847,8 13,8 L11,8 C10.4477153,8 10,7.55228475 10,7 C10,6.44771525 10.4477153,6 11,6 Z M6,6 L8,6 C8.55228475,6 9,6.44771525 9,7 C9,7.55228475 8.55228475,8 8,8 L6,8 C5.44771525,8 5,7.55228475 5,7 C5,6.44771525 5.44771525,6 6,6 Z M0,1 C0,0.44771525 0.44771525,-2.26485497e-13 1,-2.26485497e-13 C1.55228475,-2.26485497e-13 2,0.44771525 2,1 L2,3.0142458 L12,3.0142458 L12,1 C12,0.44771525 12.4477153,-2.26485497e-13 13,-2.26485497e-13 C13.5522847,-2.26485497e-13 14,0.44771525 14,1 L14,3.0142458 C14,4.1188153 13.1045695,5.0142458 12,5.0142458 L2,5.0142458 C0.8954305,5.0142458 0,4.1188153 0,3.0142458 L0,1 Z M0,13.0142458 L0,11 C0,9.8954305 0.8954305,9 2,9 L12,9 C13.1045695,9 14,9.8954305 14,11 L14,13.0142458 C14,13.5665305 13.5522847,14.0142458 13,14.0142458 C12.4477153,14.0142458 12,13.5665305 12,13.0142458 L12,11 L2,11 L2,13.0142458 C2,13.5665305 1.55228475,14.0142458 1,14.0142458 C0.44771525,14.0142458 0,13.5665305 0,13.0142458 Z"></path></g></svg>',
    },
  ],
  // context: {
  //   provider: PageBreakPluginProvider,
  // },
});

/**
 * Insert Page Break Command
 *
 * Creates a new page break at the current cursor position.
 * Enforces structural rules:
 * - Collapses adjacent page breaks
 * - Prevents insertion in inline contexts
 * - Maintains block-level structure
 * - Only inserts within editor container
 */
export const insertPageBreakCommand = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  // Find the editor container from the current selection
  const editorContainer = findEditorContainerFromSelection();
  if (!editorContainer) {
    console.warn('Selection not in editor container, skipping page break insertion');
    return;
  }

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer as HTMLElement;

  // Check if we're in an inline context
  if (isInlineContext(container)) {
    console.warn('Page breaks cannot be inserted in inline contexts');
    return;
  }

  // Get the block element containing the selection
  const blockElement = getContainingBlock(container);
  if (!blockElement) {
    console.warn('No block element found for page break insertion');
    return;
  }

  // Verify the block element is within the editor
  if (!editorContainer.contains(blockElement)) {
    console.warn('Selection block is not within editor container');
    return;
  }

  // Create page break element
  const pageBreak = document.createElement('div');
  pageBreak.className = 'rte-page-break';
  pageBreak.setAttribute('data-page-break', 'true');
  pageBreak.setAttribute('data-type', 'page-break');
  pageBreak.setAttribute('contenteditable', 'false');
  pageBreak.setAttribute('tabindex', '0');
  pageBreak.setAttribute('role', 'img');
  pageBreak.setAttribute('aria-label', 'Page break');
  
  // Handle click to select the page break
  pageBreak.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    pageBreak.focus();
    
    // Select the page break element
    const range = document.createRange();
    range.selectNode(pageBreak);
    selection.removeAllRanges();
    selection.addRange(range);
  });
  
  // Insert the page break inside the editor container
  // Find the content element to ensure insertion happens within the editor
  const contentElement = editorContainer.querySelector('.rte-content');
  if (contentElement) {
    // Insert after the current block
    blockElement.parentNode?.insertBefore(pageBreak, blockElement.nextSibling);
    
    // Ensure the page break is inside the editor content
    if (!contentElement.contains(pageBreak)) {
      contentElement.appendChild(pageBreak);
    }
  } else {
    // Fallback: insert after the block element
    blockElement.parentNode?.insertBefore(pageBreak, blockElement.nextSibling);
  }

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
function isInlineContext(node: Node): boolean {
  const inlineElements = ['SPAN', 'A', 'STRONG', 'EM', 'B', 'I', 'U', 'SUP', 'SUB', 'CODE'];
  
  // Convert text node to its parent element
  let current: HTMLElement | null = node.nodeType === Node.TEXT_NODE 
    ? (node.parentElement as HTMLElement) 
    : (node as HTMLElement);

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
