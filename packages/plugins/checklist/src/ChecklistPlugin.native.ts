import type { Plugin } from '@editora/core';

/**
 * ChecklistPlugin - Native implementation for interactive todo lists
 * 
 * Features:
 * - Creates checkbox list items
 * - Toggle checkboxes on/off
 * - Convert regular list to checklist
 * - Useful for task lists, requirements, shopping lists
 * 
 * Commands:
 * - toggleChecklist: Convert to/from checklist
 */

/**
 * Find the active editor element
 */
const findActiveEditor = (): HTMLElement | null => {
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
  
  // Try active element
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
};

export const ChecklistPlugin = (): Plugin => {
  return {
    name: 'checklist',
    
    // Initialize click handler when plugin is loaded
    init: () => {
      if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        const handleChecklistClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          
          // Find the closest checklist item
          const checklistItem = target.closest('li[data-type="checklist-item"]') as HTMLElement;
          
          if (checklistItem) {
            // Calculate if click is in the checkbox area (left 2em where checkbox is positioned)
            const rect = checklistItem.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            
            // Checkbox is in the first 2em (approximately 32px at default font size)
            const isCheckboxArea = clickX < 32;
            
            if (isCheckboxArea) {
              event.preventDefault();
              event.stopPropagation();
              
              // Toggle the checked state
              const isChecked = checklistItem.getAttribute("data-checked") === "true";
              checklistItem.setAttribute("data-checked", (!isChecked).toString());
            }
          }
        };
        
        // Set up the click handler
        document.addEventListener("click", handleChecklistClick);
      }
    },
    
    // Schema definition for checklist nodes
    nodes: {
      checklist: {
        content: "checklistItem+",
        group: "block",
        parseDOM: [{ tag: 'ul[data-type="checklist"]' }],
        toDOM: () => ["ul", { "data-type": "checklist" }, 0],
      },
      checklistItem: {
        content: "paragraph",
        attrs: {
          checked: { default: false },
        },
        parseDOM: [
          {
            tag: 'li[data-type="checklist-item"]',
            getAttrs: (dom) => ({
              checked: (dom as HTMLElement).getAttribute("data-checked") === "true",
            }),
          },
        ],
        toDOM: (node) => [
          "li",
          {
            "data-type": "checklist-item",
            "data-checked": node?.attrs?.checked ? "true" : "false",
          },
          0,
        ],
      },
    },

    toolbar: [
      {
        label: 'Checklist',
        command: 'toggleChecklist',
        icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 4.48h-.71L2 3.43l.71-.7.69.68L4.81 2l.71.71-1.77 1.77zM6.99 3h8v1h-8V3zm0 3h8v1h-8V6zm8 3h-8v1h8V9zm-8 3h8v1h-8v-1zM3.04 7.48h.71l1.77-1.77-.71-.7L3.4 6.42l-.69-.69-.71.71 1.04 1.04zm.71 3.01h-.71L2 9.45l.71-.71.69.69 1.41-1.42.71.71-1.77 1.77zm-.71 3.01h.71l1.77-1.77-.71-.71-1.41 1.42-.69-.69-.71.7 1.04 1.05z"></path></g></svg>',
        shortcut: 'Mod-Shift-9'
      }
    ],

    commands: {
      toggleChecklist: () => {
        try {
          const editorElement = findActiveEditor();
          if (!editorElement) return false;

          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) return false;

          const range = selection.getRangeAt(0);
          
          // Verify selection is within the active editor
          if (!editorElement.contains(range.commonAncestorContainer)) return false;

          const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? (range.commonAncestorContainer.parentElement as HTMLElement)
            : (range.commonAncestorContainer as HTMLElement);

          // Check if we're in a list
          const listElement = container?.closest("li")?.closest("ul, ol");
          
          if (listElement) {
            const isChecklist = listElement.hasAttribute("data-type") && 
                               listElement.getAttribute("data-type") === "checklist";
            const isOrderedList = listElement.tagName.toLowerCase() === "ol";
            const isBulletList = listElement.tagName.toLowerCase() === "ul" && 
                                !listElement.hasAttribute("data-type");

            // Convert checklist back to paragraphs
            if (isChecklist) {
              const checklistItems = listElement.querySelectorAll('li[data-type="checklist-item"]');
              const paragraphs = Array.from(checklistItems)
                .map((item) => `<p>${item.innerHTML}</p>`)
                .join("");
              
              listElement.outerHTML = paragraphs;
              
              // Restore selection
              setTimeout(() => {
                const sel = window.getSelection();
                if (sel && editorElement) {
                  try {
                    const allParagraphs = editorElement.querySelectorAll("p");
                    const originalItem = container?.closest('li[data-type="checklist-item"]');
                    const itemIndex = originalItem ? Array.from(checklistItems).indexOf(originalItem) : -1;
                    
                    if (allParagraphs[itemIndex] && itemIndex >= 0) {
                      const targetP = allParagraphs[itemIndex];
                      const newRange = document.createRange();
                      newRange.setStart(targetP, targetP.childNodes.length);
                      newRange.setEnd(targetP, targetP.childNodes.length);
                      sel.removeAllRanges();
                      sel.addRange(newRange);
                    }
                  } catch {
                    console.warn("Could not restore selection after checklist removal");
                  }
                }
              }, 10);
              return true;
            } 
            // Convert ordered/bullet list to checklist
            else if (isOrderedList || isBulletList) {
              listElement.setAttribute("data-type", "checklist");
              listElement.querySelectorAll("li").forEach((li) => {
                li.setAttribute("data-type", "checklist-item");
                li.setAttribute("data-checked", "false");
              });
              return true;
            }
          }

          // Convert paragraph to checklist or create new checklist
          const selectedText = range.toString().trim();
          
          // Find the block element containing the selection
          const blockElement = container?.closest("p, div, h1, h2, h3, h4, h5, h6");
          
          if (blockElement) {
            // Use selected text if any, otherwise use block content
            const contentHTML = selectedText || blockElement.innerHTML;
            const checklistHTML = `<ul data-type="checklist"><li data-type="checklist-item" data-checked="false"><p>${contentHTML}</p></li></ul>`;
            
            // Create the checklist element
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = checklistHTML;
            const checklistElement = tempDiv.firstElementChild as HTMLElement;
            
            // Replace the block element
            blockElement.parentNode?.replaceChild(checklistElement, blockElement);
            
            // Restore selection
            setTimeout(() => {
              const sel = window.getSelection();
              if (sel) {
                try {
                  const checklistItem = checklistElement.querySelector('li[data-type="checklist-item"]');
                  if (checklistItem) {
                    const p = checklistItem.querySelector("p");
                    if (p && p.firstChild) {
                      const newRange = document.createRange();
                      newRange.setStart(p.firstChild, p.textContent?.length || 0);
                      newRange.collapse(true);
                      sel.removeAllRanges();
                      sel.addRange(newRange);
                    }
                  }
                } catch (e) {
                  console.warn("Could not restore selection after checklist insertion:", e);
                }
              }
            }, 10);
            return true;
          } else {
            console.warn('[ChecklistPlugin] No block element found');
            return false;
          }

          return true;
        } catch (error) {
          console.error('Failed to toggle checklist:', error);
          return false;
        }
      }
    },

    keymap: {
      'Mod-Shift-9': 'toggleChecklist'
    }
  };
};
