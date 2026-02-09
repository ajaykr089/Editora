import { Plugin } from '@editora/core';

/**
 * Footnote Plugin - Native Implementation
 * 
 * Features:
 * - Auto-numbering and renumbering
 * - Bidirectional links (reference ↔ footnote)
 * - Editable footnote content
 * - Semantic HTML structure
 * - Print support
 * 
 * Structure:
 * - References: <sup class="rte-footnote-ref" data-footnote-id="fn-xxx">[1]</sup>
 * - Container: <section class="rte-footnotes"><ol><li id="fn-xxx">...</li></ol></section>
 * 
 * Icon: Document lines with superscript "1" indicating footnote reference
 */
export const FootnotePlugin = (): Plugin => ({
  name: 'footnote',
  
  toolbar: [
    {
      label: 'Footnote',
      command: 'insertFootnote',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="14" height="2" rx="1" /><rect x="3" y="8" width="18" height="2" rx="1" /><rect x="3" y="12" width="16" height="2" rx="1" /><rect x="3" y="16" width="10" height="1.5" rx="0.75" /><text x="19" y="11" font-size="9" font-weight="600" fill="currentColor" font-family="system-ui, sans-serif">1</text></svg>',
      type: 'button'
    }
  ],
  
  commands: {
    insertFootnote: () => {
      insertFootnoteCommand();
      return null;
    }
  },
  
  keymap: {}
});

/**
 * Footnote registry to track footnotes
 */
interface FootnoteData {
  id: string;
  number: number;
  content: string;
}

const footnoteRegistry = new Map<string, FootnoteData>();

/**
 * Find the active editor based on current selection or focus
 */
function findActiveEditor(): HTMLElement | null {
  // Try to find editor from current selection
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    let node: Node | null = selection.getRangeAt(0).startContainer;
    while (node && node !== document.body) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.getAttribute('contenteditable') === 'true') {
          return element;
        }
      }
      node = node.parentNode;
    }
  }
  
  // Try to find focused editor
  const activeElement = document.activeElement;
  if (activeElement) {
    if (activeElement.getAttribute('contenteditable') === 'true') {
      return activeElement as HTMLElement;
    }
    const editor = activeElement.closest('[contenteditable="true"]');
    if (editor) return editor as HTMLElement;
  }
  
  // Fallback to first editor
  return document.querySelector('[contenteditable="true"]');
}

/**
 * Get or create footnote container
 * Always at the end of the content area
 */
function getFootnoteContainer(): HTMLElement {
  const contentElement = findActiveEditor();
  if (!contentElement) {
    throw new Error('Contenteditable element not found');
  }
  
  let container = contentElement.querySelector('.rte-footnotes') as HTMLElement;
  
  if (!container) {
    container = document.createElement('section');
    container.className = 'rte-footnotes';
    container.setAttribute('data-type', 'footnotes');
    container.setAttribute('contenteditable', 'true');
    
    const ol = document.createElement('ol');
    container.appendChild(ol);
    
    contentElement.appendChild(container);
  }
  
  return container;
}

/**
 * Insert Footnote Command
 */
export const insertFootnoteCommand = (content: string = '') => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);

  // Generate unique footnote ID
  const footnoteId = `fn-${Date.now()}`;
  const nextNumber = getNextFootnoteNumber();

  // Create reference element
  const reference = document.createElement('sup');
  reference.className = 'rte-footnote-ref';
  reference.setAttribute('data-footnote-id', footnoteId);
  reference.setAttribute('data-number', nextNumber.toString());
  reference.textContent = nextNumber.toString();
  
  // Style the reference inline (will be enhanced by CSS)
  reference.style.cursor = 'pointer';

  // Insert reference at cursor and collapse selection after it
  try {
    range.insertNode(reference);
    range.setStartAfter(reference);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  } catch (e) {
    console.error('Error inserting footnote reference:', e);
    return;
  }

  // Get or create footnote container
  const container = getFootnoteContainer();
  const ol = container.querySelector('ol');

  // Create footnote item
  const li = document.createElement('li');
  li.id = footnoteId;
  li.className = 'rte-footnote-item';
  li.setAttribute('data-type', 'footnote');
  li.setAttribute('data-number', nextNumber.toString());

  // Add content
  const contentDiv = document.createElement('div');
  contentDiv.className = 'rte-footnote-content';
  contentDiv.setAttribute('contenteditable', 'true');
  contentDiv.textContent = content || `Footnote ${nextNumber}`;
  li.appendChild(contentDiv);

  // Add back reference
  const backRef = document.createElement('a');
  backRef.className = 'rte-footnote-backref';
  backRef.href = `#ref-${footnoteId}`;
  backRef.setAttribute('aria-label', `Back to reference ${nextNumber}`);
  backRef.textContent = '↩';
  li.appendChild(backRef);

  // Append to footnote list
  ol?.appendChild(li);

  // Register footnote
  footnoteRegistry.set(footnoteId, {
    id: footnoteId,
    number: nextNumber,
    content
  });

  // Setup click handlers
  setupFootnoteInteractions();
};

/**
 * Get next footnote number
 */
function getNextFootnoteNumber(): number {
  const contentElement = findActiveEditor();
  const container = contentElement?.querySelector('.rte-footnotes');
  if (!container) return 1;

  const items = container.querySelectorAll('li[data-type="footnote"]');
  return items.length + 1;
}

/**
 * Renumber all footnotes
 * Called when a footnote is deleted or reordered
 */
export const renumberAllFootnotes = () => {
  const contentElement = findActiveEditor();
  const container = contentElement?.querySelector('.rte-footnotes');
  if (!container) return;

  const items = container.querySelectorAll('li[data-type="footnote"]');
  let number = 1;

  items.forEach(item => {
    const footnoteId = item.id;
    
    // Update footnote item
    item.setAttribute('data-number', number.toString());
    
    // Update reference
    const ref = contentElement?.querySelector(`.rte-footnote-ref[data-footnote-id="${footnoteId}"]`);
    if (ref) {
      ref.setAttribute('data-number', number.toString());
      ref.textContent = number.toString();
    }

    // Update registry
    const footnoteData = footnoteRegistry.get(footnoteId);
    if (footnoteData) {
      footnoteData.number = number;
    }

    number++;
  });
};

/**
 * Delete footnote and its reference
 */
export const deleteFootnote = (footnoteId: string) => {
  const contentElement = findActiveEditor();
  const reference = contentElement?.querySelector(`.rte-footnote-ref[data-footnote-id="${footnoteId}"]`);
  const footnoteItem = document.getElementById(footnoteId);

  if (reference) reference.remove();
  if (footnoteItem) footnoteItem.remove();

  footnoteRegistry.delete(footnoteId);
  renumberAllFootnotes();
};

/**
 * Setup interactions (scrolling between references and footnotes)
 */
function setupFootnoteInteractions() {
  const contentElement = findActiveEditor();
  if (!contentElement) return;

  // Click on reference -> scroll to footnote
  contentElement.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('rte-footnote-ref')) {
      const footnoteId = target.getAttribute('data-footnote-id');
      if (footnoteId) {
        const footnote = document.getElementById(footnoteId);
        if (footnote) {
          footnote.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the footnote briefly
          footnote.style.backgroundColor = '#fff3cd';
          setTimeout(() => {
            footnote.style.backgroundColor = '';
          }, 1500);
        }
      }
    }
  });

  // Click on back reference -> scroll to reference
  contentElement.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('rte-footnote-backref')) {
      e.preventDefault();
      const footnoteId = target.closest('li')?.id;
      if (footnoteId) {
        const reference = contentElement.querySelector(`.rte-footnote-ref[data-footnote-id="${footnoteId}"]`);
        if (reference) {
          reference.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the reference briefly
          (reference as HTMLElement).style.backgroundColor = '#fff3cd';
          setTimeout(() => {
            (reference as HTMLElement).style.backgroundColor = '';
          }, 1500);
        }
      }
    }
  });
}

// Initialize interactions on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFootnoteInteractions);
  } else {
    setupFootnoteInteractions();
  }
}
