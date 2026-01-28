import React, { ReactNode } from 'react';

interface ChecklistPluginProviderProps {
  children: ReactNode;
}

export const ChecklistPluginProvider: React.FC<ChecklistPluginProviderProps> = ({ children }) => {
  const registerCommand = (command: string, handler: () => void) => {
    if (typeof window !== 'undefined') {
      (window as any).registerEditorCommand?.(command, handler);
    }
  };

  React.useEffect(() => {
    // Register the toggle checklist command
    registerCommand('toggleChecklist', () => {
      // Get current selection
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const range = selection.getRangeAt(0);
      const editorElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement
        : range.commonAncestorContainer as Element;

      // Find the closest editor content area
      const editorContent = editorElement?.closest('[contenteditable="true"]') as HTMLElement;
      if (!editorContent) return;

      // Check if we're currently inside a checklist and handle toggling
      const currentListItem = editorElement?.closest('li');
      const currentList = currentListItem?.closest('ul, ol');

      if (currentList) {
        // We're inside a list, check what type it is
        const isChecklist = currentList.hasAttribute('data-type') && currentList.getAttribute('data-type') === 'checklist';
        const isOrderedList = currentList.tagName.toLowerCase() === 'ol';
        const isBulletList = currentList.tagName.toLowerCase() === 'ul' && !currentList.hasAttribute('data-type');

        if (isChecklist) {
          // Already a checklist, convert back to regular paragraph
          // Convert each checklist item back to a paragraph
          const checklistItems = currentList.querySelectorAll('li[data-type="checklist-item"]');
          const paragraphsHTML = Array.from(checklistItems)
            .map(item => `<p>${item.innerHTML}</p>`)
            .join('');

          // Replace the entire checklist with paragraphs
          currentList.outerHTML = paragraphsHTML;

          // Restore selection at the cursor position within the checklist
          setTimeout(() => {
            const newSelection = window.getSelection();
            if (newSelection && editorContent) {
              try {
                // Find the paragraph that corresponds to where the cursor was
                const paragraphs = editorContent.querySelectorAll('p');
                const currentListItem = editorElement?.closest('li[data-type="checklist-item"]');
                const listItemIndex = currentListItem ? Array.from(checklistItems).indexOf(currentListItem) : -1;

                if (paragraphs[listItemIndex] && listItemIndex >= 0) {
                  const targetParagraph = paragraphs[listItemIndex];
                  const range = document.createRange();
                  range.setStart(targetParagraph, targetParagraph.childNodes.length);
                  range.setEnd(targetParagraph, targetParagraph.childNodes.length);
                  newSelection.removeAllRanges();
                  newSelection.addRange(range);
                }
              } catch (e) {
                console.warn('Could not restore selection after checklist removal');
              }
            }
          }, 10);

          return;
        } else if (isOrderedList || isBulletList) {
          // Convert existing list to checklist by changing the parent list type
          currentList.setAttribute('data-type', 'checklist');

          // Update all list items in this list to be checklist items
          const listItems = currentList.querySelectorAll('li');
          listItems.forEach(item => {
            item.setAttribute('data-type', 'checklist-item');
            item.setAttribute('data-checked', 'false');
          });

          return;
        }
      }

      // No existing list, create a new checklist
      // Check if cursor is at beginning, end, or middle of content
      const selectedText = range.toString().trim();
      const isCursorAtBoundary = selectedText === '';

      if (isCursorAtBoundary) {
        // Cursor is at beginning, end, or middle of content - wrap the parent element
        const currentBlock = editorElement?.closest('p, div, h1, h2, h3, h4, h5, h6') as HTMLElement;
        if (currentBlock && currentBlock.textContent?.trim()) {
          // Wrap the existing content in a checklist
          const blockContent = currentBlock.innerHTML;
          const checklistHTML = `
            <ul data-type="checklist">
              <li data-type="checklist-item" data-checked="false">
                <p>${blockContent}</p>
              </li>
            </ul>
          `;

          // Replace the block with the checklist
          currentBlock.outerHTML = checklistHTML;

          // Restore selection inside the new checklist item
          setTimeout(() => {
            const newSelection = window.getSelection();
            if (newSelection && editorContent) {
              try {
                const newChecklistItem = editorContent.querySelector('li[data-type="checklist-item"]');
                if (newChecklistItem) {
                  const textNode = newChecklistItem.querySelector('p');
                  if (textNode) {
                    const range = document.createRange();
                    range.setStart(textNode, textNode.childNodes.length);
                    range.setEnd(textNode, textNode.childNodes.length);
                    newSelection.removeAllRanges();
                    newSelection.addRange(range);
                  }
                }
              } catch (e) {
                console.warn('Could not restore selection after checklist insertion');
              }
            }
          }, 10);

          return;
        }
      }

      // Regular behavior: create checklist with selected text or empty item
      const savedRange = range.cloneRange();
      let checklistHTML;
      if (selectedText) {
        // Wrap the selected text in a checklist item
        checklistHTML = `
          <ul data-type="checklist">
            <li data-type="checklist-item" data-checked="false">
              <p>${selectedText}</p>
            </li>
          </ul>
        `;
      } else {
        // No text selected, create empty checklist item
        checklistHTML = `
          <ul data-type="checklist">
            <li data-type="checklist-item" data-checked="false">
              <p><br></p>
            </li>
          </ul>
        `;
      }

      // Insert the checklist
      document.execCommand('insertHTML', false, checklistHTML.trim());

      // Restore selection inside the new checklist item
      setTimeout(() => {
        const newSelection = window.getSelection();
        if (newSelection && editorContent) {
          try {
            const newChecklistItem = editorContent.querySelector('li[data-type="checklist-item"]');
            if (newChecklistItem) {
              const textNode = newChecklistItem.querySelector('p');
              if (textNode) {
                const range = document.createRange();
                range.setStart(textNode, textNode.childNodes.length);
                range.setEnd(textNode, textNode.childNodes.length);
                newSelection.removeAllRanges();
                newSelection.addRange(range);
              }
            }
          } catch (e) {
            console.warn('Could not restore selection after checklist insertion');
          }
        }
      }, 10);
    });

    // Add event listener for checkbox clicks
    const handleCheckboxClick = (event: Event) => {
      const target = event.target as HTMLElement;

      // Check if the clicked element is a checklist item (before pseudo-element)
      if (target.matches('li[data-type="checklist-item"]')) {
        event.preventDefault();
        event.stopPropagation();

        // Toggle the checked state
        const currentChecked = target.getAttribute('data-checked') === 'true';
        const newChecked = !currentChecked;

        target.setAttribute('data-checked', newChecked.toString());

        // Move cursor to end of the checklist item for better UX
        const textNode = target.querySelector('p');
        if (textNode && textNode.textContent) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.setStart(textNode, textNode.childNodes.length);
          range.setEnd(textNode, textNode.childNodes.length);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
      }
    };

    // Add the event listener to the document for checklist interactions
    document.addEventListener('click', handleCheckboxClick);

    // Cleanup function
    return () => {
      document.removeEventListener('click', handleCheckboxClick);
    };
  }, []);

  return <>{children}</>;
};
