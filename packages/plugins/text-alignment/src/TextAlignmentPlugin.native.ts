import { Plugin } from '@editora/core';

/**
 * Text Alignment Plugin - Native Implementation
 *
 * Allows users to set text alignment (left, center, right, justify)
 * for selected text by applying CSS styles to block-level elements
 * or wrapping inline content in a div with alignment
 * 
 * Uses modern CSS manipulation instead of deprecated execCommand for:
 * - More reliable behavior across browsers
 * - Better control over styling
 * - Consistent results
 */

// Block-level elements that can have text-align applied
const BLOCK_LEVEL_TAGS = ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'PRE', 'TD', 'TH'];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Helper function to find the containing block-level element
 */
function findContainingBlock(node: Node): HTMLElement | null {
  let current: Node | null = node;

  // If the node itself is a block element, return it
  if (current.nodeType === Node.ELEMENT_NODE) {
    const element = current as HTMLElement;
    if (BLOCK_LEVEL_TAGS.includes(element.tagName)) {
      return element;
    }
  }

  // Traverse up the DOM tree to find the nearest block element
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE) {
      const element = current as HTMLElement;
      if (BLOCK_LEVEL_TAGS.includes(element.tagName)) {
        return element;
      }
      // Stop at contenteditable boundary
      if (element.hasAttribute('contenteditable')) {
        return null;
      }
    }
    current = current.parentNode;
  }

  return null;
}

/**
 * Helper function to find all block elements that intersect with the range
 */
function getBlocksInRange(range: Range): HTMLElement[] {
  const blocks: HTMLElement[] = [];
  const startBlock = findContainingBlock(range.startContainer);
  const endBlock = findContainingBlock(range.endContainer);

  // If no block elements found, return empty array
  if (!startBlock && !endBlock) return blocks;

  // If range is collapsed (just cursor), return the block containing the cursor
  if (range.collapsed) {
    if (startBlock) blocks.push(startBlock);
    return blocks;
  }

  // For actual selections, find all blocks between start and end
  if (startBlock === endBlock) {
    // Selection is within a single block
    if (startBlock) blocks.push(startBlock);
  } else {
    // Selection spans multiple blocks - find all blocks in between
    let current: HTMLElement | null = startBlock;
    const visited = new Set<HTMLElement>();
    
    if (startBlock) {
      blocks.push(startBlock);
      visited.add(startBlock);
    }
    
    while (current && current !== endBlock && !visited.has(endBlock as HTMLElement)) {
      let nextSibling = current.nextElementSibling as HTMLElement | null;
      
      // Find the next block-level element
      while (nextSibling) {
        if (BLOCK_LEVEL_TAGS.includes(nextSibling.tagName)) {
          current = nextSibling;
          if (!visited.has(current)) {
            blocks.push(current);
            visited.add(current);
          }
          break;
        }
        nextSibling = nextSibling.nextElementSibling as HTMLElement | null;
      }
      
      // If no more siblings, break
      if (!nextSibling) break;
    }
    
    // Add the end block if it's different and not already included
    if (endBlock && !blocks.includes(endBlock)) {
      blocks.push(endBlock);
    }
  }

  return blocks;
}

/**
 * Set text alignment command
 * Applies CSS text-align styles to block-level elements
 * If no block element found, wraps selection in a div with alignment
 */
export const setTextAlignmentCommand = (alignment?: string) => {
  if (!alignment) return false;

  const validAlignments = ['left', 'center', 'right', 'justify'];
  if (!validAlignments.includes(alignment)) return false;

  // Get current selection
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0).cloneRange();
  const blocks = getBlocksInRange(range);

  // If we found block elements, apply alignment to them
  if (blocks.length > 0) {
    blocks.forEach(block => {
      if (block) {
        block.style.textAlign = alignment;
      }
    });
    
    // Restore the selection
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event to update editor state
    const contentElement = range.commonAncestorContainer.parentElement?.closest('[contenteditable="true"]');
    if (contentElement) {
      contentElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } else {
    // No block elements found - wrap selection in a div with alignment
    try {
      const div = document.createElement('div');
      div.style.textAlign = alignment;
      
      // Extract the selected content
      const contents = range.extractContents();
      div.appendChild(contents);
      
      // Insert the div at the range position
      range.insertNode(div);
      
      // Update the range to select the content inside the div
      const newRange = document.createRange();
      newRange.selectNodeContents(div);
      selection.removeAllRanges();
      selection.addRange(newRange);
      
      // Trigger input event
      const contentElement = div.closest('[contenteditable="true"]');
      if (contentElement) {
        contentElement.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (error) {
      console.error('Failed to wrap content for alignment:', error);
      return false;
    }
  }

  return true;
};

// ============================================================================
// Plugin Definition
// ============================================================================

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
      ],
      icon: '<svg width="24" height="24" focusable="false"><path d="M5 5h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 4h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 1 1 0-2Zm0 8h8c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Zm0-4h14c.6 0 1 .4 1 1s-.4 1-1 1H5a1 1 0 0 1 0-2Z" fill-rule="evenodd"></path></svg>'
    }
  ],

  commands: {
    setTextAlignment: setTextAlignmentCommand
  },

  keymap: {}
});
