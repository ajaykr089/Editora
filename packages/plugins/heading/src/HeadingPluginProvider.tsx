import React, { useEffect } from 'react';

/**
 * HeadingPluginProvider
 * Registers the setBlockType command with proper edge case handling
 */
export const HeadingPluginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Store the last saved selection
    let savedSelection: { range: Range; container: HTMLElement } | null = null;

    /**
     * Save the current selection when the editor is active
     */
    const saveSelection = () => {
      const contentEl = document.querySelector('.rte-content') as HTMLElement;
      if (!contentEl) return;

      // Only save if the editor actually has focus
      if (document.activeElement !== contentEl) {
        console.log('Editor not focused, skipping selection save');
        return;
      }

      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        try {
          const range = selection.getRangeAt(0).cloneRange();
          
          // Only save if selection is inside the content element
          if (!contentEl.contains(range.startContainer) || !contentEl.contains(range.endContainer)) {
            console.log('Selection not in content element, skipping');
            return;
          }
          
          savedSelection = {
            range: range,
            container: contentEl
          };
        } catch (e) {
          console.error('Error saving selection:', e);
        }
      }
    };

    /**
     * Set block type command with comprehensive edge case handling
     */
    const setBlockTypeCommand = (blockType: string) => {
      const contentEl = document.querySelector('.rte-content') as HTMLElement;
      if (!contentEl) {
        console.error('Content element not found');
        return;
      }

      // Use the saved selection instead of current one
      if (!savedSelection) {
        console.error('No saved selection available');
        return;
      }

      const range = savedSelection.range;

      console.log('Selection details:', {
        startOffset: range.startOffset,
        endOffset: range.endOffset
      });
      
      // Find all block-level elements in the selection
      const blocksToConvert = getBlocksInSelection(range, contentEl);
      
      console.log('Blocks to convert:', blocksToConvert.map(b => ({
        tag: b.tagName,
        text: b.textContent?.substring(0, 50),
        element: b
      })));
      
      if (blocksToConvert.length === 0) {
        console.error('No blocks found to convert');
        return;
      }
      
      // Convert each block and track the new elements
      const newElements: HTMLElement[] = [];
      blocksToConvert.forEach(block => {
        const newElement = convertBlockType(block, blockType);
        if (newElement) {
          newElements.push(newElement);
        }
      });

      // Restore selection
      if (newElements.length > 0) {
        try {
          const selection = window.getSelection();
          if (!selection) return;

          const newRange = document.createRange();
          const startOffset = range.startOffset;
          const endOffset = range.endOffset;
          
          // Find the text node in the new element that corresponds to the old position
          const firstNewElement = newElements[0];
          const lastNewElement = newElements[newElements.length - 1];
          
          // Get first text node in first element
          const firstTextNode = getFirstTextNode(firstNewElement);
          const lastTextNode = getLastTextNode(lastNewElement);
          
          if (firstTextNode && lastTextNode) {
            // Restore the offsets if possible
            const safeStartOffset = Math.min(startOffset, firstTextNode.length);
            const safeEndOffset = Math.min(endOffset, lastTextNode.length);
            
            newRange.setStart(firstTextNode, safeStartOffset);
            newRange.setEnd(lastTextNode, safeEndOffset);
            
            selection.removeAllRanges();
            selection.addRange(newRange);
          } else {
            // Fallback: just place cursor at start of first element
            newRange.selectNodeContents(firstNewElement);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          }
        } catch (e) {
          console.error('Failed to restore selection:', e);
        }
      }

      // Restore focus
      contentEl.focus();
    };

    /**
     * Get all block-level elements within a selection range
     */
    function getBlocksInSelection(range: Range, container: HTMLElement): HTMLElement[] {
      const blockTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'DIV'];

      // Debug: log the actual startContainer
      console.log('StartContainer details:', {
        nodeType: range.startContainer.nodeType,
        nodeName: (range.startContainer as any).nodeName,
        parentElement: (range.startContainer.parentNode as any)?.tagName,
        parentParentElement: (range.startContainer.parentNode?.parentNode as any)?.tagName,
        textContent: range.startContainer.textContent?.substring(0, 50)
      });

      // Find the block containing the start of the selection
      let startBlock = getParentBlock(range.startContainer, container);
      
      // If no parent block found, check if startContainer is directly a child of container
      if (!startBlock && range.startContainer.parentNode === container) {
        // The text node is a direct child of container (not wrapped in a block)
        // This shouldn't happen, but let's handle it by finding the first block element
        const firstBlock = container.querySelector(blockTags.join(',')) as HTMLElement;
        if (firstBlock) {
          console.log('Using first block element as fallback');
          startBlock = firstBlock;
        }
      }
      
      console.log('Start block found:', startBlock ? {
        tag: startBlock.tagName,
        text: startBlock.textContent?.substring(0, 50)
      } : 'null');
      
      if (!startBlock) {
        console.error('Could not find start block');
        return [];
      }

      // Find the block containing the end of the selection
      const endBlock = getParentBlock(range.endContainer, container);
      
      console.log('End block found:', endBlock ? {
        tag: endBlock.tagName,
        text: endBlock.textContent?.substring(0, 50)
      } : 'null');
      
      if (!endBlock) {
        console.error('Could not find end block');
        return [];
      }

      // If selection is within a single block, just return that block
      if (startBlock === endBlock) {
        console.log('Single block selection');
        return [startBlock];
      }

      // Multiple blocks: we need to find all blocks between start and end
      console.log('Multiple blocks selected');
      
      // Get all direct child blocks in the container
      const allBlocks: HTMLElement[] = [];
      const childNodes = Array.from(container.childNodes);
      
      childNodes.forEach(child => {
        if (child instanceof HTMLElement && blockTags.includes(child.tagName)) {
          allBlocks.push(child);
        }
      });
      
      console.log('All direct child blocks:', allBlocks.map(b => ({
        tag: b.tagName,
        text: b.textContent?.substring(0, 30)
      })));
      
      // Find the indices of start and end blocks
      const startIndex = allBlocks.indexOf(startBlock);
      const endIndex = allBlocks.indexOf(endBlock);
      
      console.log('Start index:', startIndex, 'End index:', endIndex);
      
      if (startIndex === -1 || endIndex === -1) {
        // Fallback: just return the start block
        console.warn('Block not found in direct children, returning start block only');
        return [startBlock];
      }

      // Return all blocks from start to end (inclusive)
      const selectedBlocks = allBlocks.slice(startIndex, endIndex + 1);
      console.log('Selected blocks:', selectedBlocks.length);
      return selectedBlocks;
    }

    /**
     * Helper to get first text node in an element
     */
    function getFirstTextNode(element: HTMLElement): Text | null {
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
      );
      return walker.nextNode() as Text | null;
    }

    /**
     * Helper to get last text node in an element
     */
    function getLastTextNode(element: HTMLElement): Text | null {
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
      );
      let lastNode: Text | null = null;
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        lastNode = node;
      }
      return lastNode;
    }

    /**
     * Get the parent block-level element of a node
     */
    function getParentBlock(node: Node, container: HTMLElement): HTMLElement | null {
      const blockTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'DIV'];
      
      let current = node;
      
      while (current && current !== container) {
        if (current instanceof HTMLElement && blockTags.includes(current.tagName)) {
          return current;
        }
        current = current.parentNode as Node;
      }

      return null;
    }

    /**
     * Convert a block element to a different type
     * Returns the new element
     */
    function convertBlockType(block: HTMLElement, newType: string): HTMLElement | null {
      // Get the inner HTML to preserve content and formatting
      const innerHTML = block.innerHTML;
      
      // Handle empty blocks
      const content = innerHTML.trim() || '<br>';

      // Create new element
      const newElement = document.createElement(newType.toUpperCase());
      newElement.innerHTML = content;

      // Copy relevant attributes (class, style, id, data-*)
      const attributesToCopy = ['class', 'style', 'id'];
      attributesToCopy.forEach(attr => {
        const value = block.getAttribute(attr);
        if (value) {
          newElement.setAttribute(attr, value);
        }
      });

      // Copy data-* attributes
      Array.from(block.attributes).forEach(attr => {
        if (attr.name.startsWith('data-')) {
          newElement.setAttribute(attr.name, attr.value);
        }
      });

      // Replace the old block with the new one
      block.parentNode?.replaceChild(newElement, block);

      return newElement;
    }

    // Register the command
    if (typeof window !== 'undefined' && (window as any).registerEditorCommand) {
      (window as any).registerEditorCommand('setBlockType', setBlockTypeCommand);
    }

    // Add event listeners to save selection when editor is active
    const contentEl = document.querySelector('.rte-content') as HTMLElement;
    if (contentEl) {
      contentEl.addEventListener('mouseup', saveSelection);
      contentEl.addEventListener('keyup', saveSelection);
      // Don't listen to focus - it can overwrite selection when toolbar is clicked
    }

    // Cleanup on unmount
    return () => {
      if (contentEl) {
        contentEl.removeEventListener('mouseup', saveSelection);
        contentEl.removeEventListener('keyup', saveSelection);
      }
    };
  }, []);

  return <>{children}</>;
};
