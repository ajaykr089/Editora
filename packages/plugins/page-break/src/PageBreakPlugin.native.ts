import { Plugin } from '@editora/core';

/**
 * Page Break Plugin - Native Implementation
 * 
 * Features:
 * - Visual page break markers with dashed border
 * - Print integration (page-break-after: always)
 * - Block-level enforcement (no inline contexts)
 * - Click to select page break
 * - Keyboard navigation support
 * - Collapse adjacent page breaks
 * - Delete key removes page break
 * - Hover effects for better UX
 * - Accessibility compliant (ARIA labels, focus states)
 */

let pageBreakStyles: HTMLStyleElement | null = null;

const injectStyles = () => {
  if (pageBreakStyles) return;

  pageBreakStyles = document.createElement('style');
  pageBreakStyles.textContent = `
    .rte-page-break {
      display: block;
      position: relative;
      height: 12px;
      margin: 8px 0;
      background: linear-gradient(90deg, #ccc 0%, transparent 100%);
      border-top: 2px dashed #999;
      border-bottom: none;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s ease;
      outline: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
    }

    .rte-page-break::before {
      content: '⎙ PAGE BREAK';
      position: absolute;
      top: -12px;
      left: 0;
      font-size: 10px;
      font-weight: bold;
      color: #666;
      background: white;
      padding: 2px 6px;
      letter-spacing: 0.5px;
      opacity: 0.7;
      pointer-events: none;
    }

    .rte-page-break:hover {
      background: linear-gradient(90deg, #999 0%, transparent 100%);
      border-top-color: #666;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    .rte-page-break:hover::before {
      opacity: 1;
      color: #333;
    }

    .rte-page-break:focus,
    .rte-page-break:focus-visible,
    .rte-page-break-selected {
      outline: 2px solid #0066cc;
      outline-offset: -2px;
      border-top-color: #0066cc;
      background: linear-gradient(90deg, #0066cc 0%, transparent 100%);
    }

    .rte-page-break * {
      user-select: none;
    }

    @media print {
      .rte-page-break {
        display: block;
        height: 0;
        margin: 0;
        background: none;
        border: none;
        page-break-after: always;
      }

      .rte-page-break::before {
        display: none;
      }
    }
  `;
  document.head.appendChild(pageBreakStyles);
};

const isInlineContext = (node: Node): boolean => {
  const inlineElements = ['SPAN', 'A', 'STRONG', 'EM', 'B', 'I', 'U', 'SUP', 'SUB', 'CODE'];
  
  let current: HTMLElement | null = node.nodeType === Node.TEXT_NODE 
    ? (node.parentElement as HTMLElement) 
    : (node as HTMLElement);

  while (current && !current.hasAttribute('contenteditable')) {
    if (inlineElements.includes(current.tagName)) {
      return true;
    }
    current = current.parentElement;
  }

  return false;
};

const getContainingBlock = (node: Node): HTMLElement | null => {
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
};

const collapseAdjacentPageBreaks = (pageBreak: HTMLElement) => {
  let next = pageBreak.nextElementSibling;
  
  while (next) {
    if (next.classList.contains('rte-page-break')) {
      next.remove();
      next = pageBreak.nextElementSibling;
    } else {
      break;
    }
  }

  let prev = pageBreak.previousElementSibling;
  while (prev) {
    if (prev.classList.contains('rte-page-break')) {
      const toRemove = prev;
      prev = prev.previousElementSibling;
      toRemove.remove();
    } else {
      break;
    }
  }
};

const insertPageBreak = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer as HTMLElement;

  // Check if we're in an inline context
  if (isInlineContext(container)) {
    console.warn('Page breaks cannot be inserted in inline contexts');
    return false;
  }

  // Get the block element containing the selection
  const blockElement = getContainingBlock(container);
  if (!blockElement) {
    console.warn('No block element found for page break insertion');
    return false;
  }

  // Create page break element
  const pageBreak = document.createElement('div');
  pageBreak.className = 'rte-page-break';
  pageBreak.setAttribute('data-page-break', 'true');
  pageBreak.setAttribute('data-type', 'page-break');
  pageBreak.setAttribute('contenteditable', 'false');
  pageBreak.setAttribute('tabindex', '0');
  pageBreak.setAttribute('role', 'separator');
  pageBreak.setAttribute('aria-label', 'Page break');

  // Handle click to select the page break
  pageBreak.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    pageBreak.focus();
    
    const newRange = document.createRange();
    newRange.selectNode(pageBreak);
    selection.removeAllRanges();
    selection.addRange(newRange);
  });

  // Handle keyboard navigation
  pageBreak.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      const next = pageBreak.nextElementSibling || pageBreak.previousElementSibling;
      pageBreak.remove();
      
      if (next) {
        const newRange = document.createRange();
        newRange.selectNode(next);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = pageBreak.nextElementSibling;
      if (next) {
        const newRange = document.createRange();
        newRange.setStart(next, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = pageBreak.previousElementSibling;
      if (prev) {
        const newRange = document.createRange();
        newRange.selectNodeContents(prev);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  });

  // Insert after the block element
  blockElement.parentNode?.insertBefore(pageBreak, blockElement.nextSibling);

  // Collapse adjacent page breaks
  collapseAdjacentPageBreaks(pageBreak);

  // Move cursor after the page break
  const newRange = document.createRange();
  const nextNode = pageBreak.nextSibling;
  if (nextNode) {
    newRange.setStart(nextNode, 0);
  } else {
    // Create a new paragraph after the page break if nothing exists
    const p = document.createElement('p');
    p.innerHTML = '<br>';
    pageBreak.parentNode?.insertBefore(p, pageBreak.nextSibling);
    newRange.setStart(p, 0);
  }
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);

  return true;
};

export const PageBreakPlugin = (): Plugin => {
  // Inject styles on plugin initialization
  injectStyles();

  return {
    name: 'pageBreak',
    
    toolbar: [
      {
        label: 'Page Break',
        command: 'insertPageBreak',
        icon: '<svg fill="#000000" width="24px" height="24px" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M1,6 L3,6 C3.55228475,6 4,6.44771525 4,7 C4,7.55228475 3.55228475,8 3,8 L1,8 C0.44771525,8 0,7.55228475 0,7 C0,6.44771525 0.44771525,6 1,6 Z M11,6 L13,6 C13.5522847,6 14,6.44771525 14,7 C14,7.55228475 13.5522847,8 13,8 L11,8 C10.4477153,8 10,7.55228475 10,7 C10,6.44771525 10.4477153,6 11,6 Z M6,6 L8,6 C8.55228475,6 9,6.44771525 9,7 C9,7.55228475 8.55228475,8 8,8 L6,8 C5.44771525,8 5,7.55228475 5,7 C5,6.44771525 5.44771525,6 6,6 Z M0,1 C0,0.44771525 0.44771525,-2.26485497e-13 1,-2.26485497e-13 C1.55228475,-2.26485497e-13 2,0.44771525 2,1 L2,3.0142458 L12,3.0142458 L12,1 C12,0.44771525 12.4477153,-2.26485497e-13 13,-2.26485497e-13 C13.5522847,-2.26485497e-13 14,0.44771525 14,1 L14,3.0142458 C14,4.1188153 13.1045695,5.0142458 12,5.0142458 L2,5.0142458 C0.8954305,5.0142458 0,4.1188153 0,3.0142458 L0,1 Z M0,13.0142458 L0,11 C0,9.8954305 0.8954305,9 2,9 L12,9 C13.1045695,9 14,9.8954305 14,11 L14,13.0142458 C14,13.5665305 13.5522847,14.0142458 13,14.0142458 C12.4477153,14.0142458 12,13.5665305 12,13.0142458 L12,11 L2,11 L2,13.0142458 C2,13.5665305 1.55228475,14.0142458 1,14.0142458 C0.44771525,14.0142458 0,13.5665305 0,13.0142458 Z"></path></g></svg>',
        shortcut: 'Mod-Enter'
      }
    ],
    
    commands: {
      insertPageBreak
    },
    
    keymap: {
      'Mod-Enter': 'insertPageBreak'
    }
  };
};
