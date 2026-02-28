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

declare global {
  interface Window {
    __checklistPluginClickInitialized?: boolean;
    execEditorCommand?: (command: string, ...args: any[]) => any;
    executeEditorCommand?: (command: string, ...args: any[]) => any;
  }
}

const COMMAND_EDITOR_CONTEXT_KEY = '__editoraCommandEditorRoot';

const getEditorContentFromHost = (host: Element | null): HTMLElement | null => {
  if (!host) return null;
  const content = host.querySelector('[contenteditable="true"]');
  return content instanceof HTMLElement ? content : null;
};

const consumeCommandEditorContextEditor = (): HTMLElement | null => {
  if (typeof window === 'undefined') return null;

  const explicitContext = (window as any)[COMMAND_EDITOR_CONTEXT_KEY] as HTMLElement | null | undefined;
  if (!(explicitContext instanceof HTMLElement)) return null;

  (window as any)[COMMAND_EDITOR_CONTEXT_KEY] = null;

  const root =
    (explicitContext.closest('[data-editora-editor], .rte-editor, .editora-editor, editora-editor') as HTMLElement | null) ||
    (explicitContext.matches('[data-editora-editor], .rte-editor, .editora-editor, editora-editor')
      ? explicitContext
      : null);

  if (root) {
    const content = getEditorContentFromHost(root);
    if (content) return content;
    if (root.getAttribute('contenteditable') === 'true') return root;
  }

  if (explicitContext.getAttribute('contenteditable') === 'true') {
    return explicitContext;
  }

  const nearestEditable = explicitContext.closest('[contenteditable="true"]');
  return nearestEditable instanceof HTMLElement ? nearestEditable : null;
};

/**
 * Find the active editor element
 */
const findActiveEditor = (): HTMLElement | null => {
  const explicitContextEditor = consumeCommandEditorContextEditor();
  if (explicitContextEditor && document.contains(explicitContextEditor)) {
    return explicitContextEditor;
  }

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

const getElementFromNode = (node: Node | null): HTMLElement | null => {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE
    ? (node as HTMLElement)
    : node.parentElement;
};

const getSelectionRangeInEditor = (editor: HTMLElement): Range | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  return editor.contains(range.commonAncestorContainer) ? range : null;
};

const dispatchEditorInput = (editor: HTMLElement): void => {
  editor.dispatchEvent(new Event('input', { bubbles: true }));
};

const recordDomHistoryTransaction = (editor: HTMLElement, beforeHTML: string): void => {
  if (beforeHTML === editor.innerHTML) return;

  const executor = window.execEditorCommand || window.executeEditorCommand;
  if (typeof executor !== 'function') return;

  try {
    executor('recordDomTransaction', editor, beforeHTML, editor.innerHTML);
  } catch {
    // History plugin may be unavailable; ignore.
  }
};

const placeCaretAtEnd = (element: HTMLElement, editor: HTMLElement): void => {
  if (!element.isConnected) {
    editor.focus({ preventScroll: true });
    return;
  }

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  try {
    selection.addRange(range);
  } catch {
    editor.focus({ preventScroll: true });
    return;
  }
  editor.focus({ preventScroll: true });
};

const ensureChecklistItemParagraph = (item: HTMLLIElement): HTMLParagraphElement => {
  let paragraph = item.querySelector(':scope > p') as HTMLParagraphElement | null;

  if (!paragraph) {
    paragraph = document.createElement('p');

    const nodesToMove: Node[] = [];
    item.childNodes.forEach((node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        ['UL', 'OL'].includes((node as HTMLElement).tagName)
      ) {
        return;
      }
      nodesToMove.push(node);
    });

    nodesToMove.forEach((node) => paragraph!.appendChild(node));
    item.insertBefore(paragraph, item.firstChild);
  }

  if (!paragraph.innerHTML.trim()) {
    paragraph.innerHTML = '<br>';
  }

  return paragraph;
};

const createChecklistItemFromHTML = (html: string): HTMLLIElement => {
  const item = document.createElement('li');
  item.setAttribute('data-type', 'checklist-item');
  item.setAttribute('data-checked', 'false');

  const paragraph = document.createElement('p');
  paragraph.innerHTML = html.trim() || '<br>';
  item.appendChild(paragraph);

  return item;
};

const getDirectListItems = (list: HTMLElement): HTMLLIElement[] =>
  Array.from(list.children).filter(
    (child): child is HTMLLIElement => child instanceof HTMLLIElement
  );

const CHECKLIST_BLOCK_TAGS = new Set([
  'P',
  'DIV',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'BLOCKQUOTE',
  'PRE',
  'LI',
]);

const isChecklistConvertibleBlock = (element: HTMLElement): boolean => (
  CHECKLIST_BLOCK_TAGS.has(element.tagName) &&
  element.getAttribute('contenteditable') !== 'true'
);

const getChecklistConvertibleBlocks = (range: Range, editor: HTMLElement): HTMLElement[] => {
  const blocks: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();

  const pushBlock = (element: HTMLElement | null) => {
    if (!element || seen.has(element)) return;
    if (!editor.contains(element)) return;
    if (!isChecklistConvertibleBlock(element)) return;

    // Ignore blocks already inside lists; those are handled by list-specific branches.
    if (element.closest('ul, ol')) return;

    seen.add(element);
    blocks.push(element);
  };

  const findContainingBlock = (node: Node): HTMLElement | null => {
    let current: Node | null = node;
    while (current && current !== document.body) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as HTMLElement;
        if (isChecklistConvertibleBlock(element)) return element;
        if (element.getAttribute('contenteditable') === 'true') break;
      }
      current = current.parentNode;
    }
    return null;
  };

  if (range.collapsed) {
    pushBlock(findContainingBlock(range.startContainer));
    return blocks;
  }

  const walker = document.createTreeWalker(
    editor,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode: (node: Node) => {
        const element = node as HTMLElement;
        if (!isChecklistConvertibleBlock(element)) return NodeFilter.FILTER_SKIP;
        if (element.closest('ul, ol')) return NodeFilter.FILTER_SKIP;

        if (typeof range.intersectsNode === 'function') {
          return range.intersectsNode(element)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
        }

        const nodeRange = document.createRange();
        nodeRange.selectNodeContents(element);
        const intersects =
          range.compareBoundaryPoints(Range.END_TO_START, nodeRange) > 0 &&
          range.compareBoundaryPoints(Range.START_TO_END, nodeRange) < 0;
        return intersects ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      },
    },
  );

  let current = walker.nextNode();
  while (current) {
    pushBlock(current as HTMLElement);
    current = walker.nextNode();
  }

  if (blocks.length === 0) {
    pushBlock(findContainingBlock(range.commonAncestorContainer));
  }

  if (blocks.length <= 1) {
    return blocks;
  }

  // Prefer leaf-level blocks in the selection. This avoids converting a parent
  // container (e.g. a wrapping DIV) into one checklist item that swallows all lines.
  const leafBlocks = blocks.filter((block) => (
    !blocks.some((other) => other !== block && block.contains(other))
  ));

  return leafBlocks.length > 0 ? leafBlocks : blocks;
};

const extractChecklistItemParagraphs = (item: HTMLLIElement): HTMLParagraphElement[] => {
  const paragraphs: HTMLParagraphElement[] = [];
  const inlineBuffer = document.createElement('div');

  const flushInlineBuffer = () => {
    const html = inlineBuffer.innerHTML.trim();
    if (!html) return;
    const paragraph = document.createElement('p');
    paragraph.innerHTML = html;
    paragraphs.push(paragraph);
    inlineBuffer.innerHTML = '';
  };

  item.childNodes.forEach((node) => {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      ['UL', 'OL'].includes((node as HTMLElement).tagName)
    ) {
      flushInlineBuffer();
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'P') {
      flushInlineBuffer();
      const html = (node as HTMLElement).innerHTML.trim();
      const paragraph = document.createElement('p');
      paragraph.innerHTML = html || '<br>';
      paragraphs.push(paragraph);
      return;
    }

    if (node.nodeType === Node.TEXT_NODE && !(node.textContent || '').trim()) {
      return;
    }

    inlineBuffer.appendChild(node.cloneNode(true));
  });

  flushInlineBuffer();

  if (paragraphs.length === 0) {
    const paragraph = document.createElement('p');
    paragraph.innerHTML = '<br>';
    paragraphs.push(paragraph);
  }

  return paragraphs;
};

export const ChecklistPlugin = (): Plugin => {
  return {
    name: 'checklist',
    
    // Initialize click handler when plugin is loaded
    init: () => {
      if (typeof document === 'undefined' || typeof window === 'undefined') return;
      if (window.__checklistPluginClickInitialized) return;
      window.__checklistPluginClickInitialized = true;

      const handleChecklistClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const checklistItem = target.closest('li[data-type="checklist-item"]') as HTMLLIElement | null;
        if (!checklistItem) return;

        const rect = checklistItem.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const isCheckboxArea = clickX < 32;

        if (!isCheckboxArea) return;

        event.preventDefault();
        event.stopPropagation();

        const editor = checklistItem.closest('[contenteditable], .rte-content, .editora-content') as HTMLElement | null;
        const isReadonlyEditor =
          editor?.getAttribute('contenteditable') === 'false' ||
          !!editor?.closest('[data-readonly="true"], .editora-editor[readonly], editora-editor[readonly]');
        if (isReadonlyEditor) return;

        const beforeHTML = editor?.innerHTML || '';

        const isChecked = checklistItem.getAttribute('data-checked') === 'true';
        checklistItem.setAttribute('data-checked', (!isChecked).toString());

        if (editor) {
          recordDomHistoryTransaction(editor, beforeHTML);
          dispatchEditorInput(editor);
        }
      };

      document.addEventListener('click', handleChecklistClick);
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

          const beforeHTML = editorElement.innerHTML;
          const commit = (): boolean => {
            recordDomHistoryTransaction(editorElement, beforeHTML);
            dispatchEditorInput(editorElement);
            return true;
          };

          const range = getSelectionRangeInEditor(editorElement);
          if (!range) return false;

          const container = getElementFromNode(range.startContainer);
          if (!container) return false;

          const checklistList = container.closest('ul[data-type="checklist"]') as HTMLUListElement | null;
          if (checklistList && editorElement.contains(checklistList)) {
            const topItems = getDirectListItems(checklistList);

            if (topItems.length === 0) return false;

            const fragment = document.createDocumentFragment();
            let targetParagraph: HTMLParagraphElement | null = null;

            topItems.forEach((item, index) => {
              const extractedParagraphs = extractChecklistItemParagraphs(item);
              extractedParagraphs.forEach((paragraph) => {
                fragment.appendChild(paragraph);
                if (
                  !targetParagraph &&
                  (item.contains(range.startContainer) || index === 0)
                ) {
                  targetParagraph = paragraph;
                }
              });

              if (!targetParagraph && index === 0 && extractedParagraphs[0]) {
                targetParagraph = extractedParagraphs[0];
              }
            });

            checklistList.replaceWith(fragment);
            if (targetParagraph) {
              placeCaretAtEnd(targetParagraph, editorElement);
            }
            return commit();
          }

          const regularList = container.closest('ul, ol') as HTMLElement | null;
          if (regularList && editorElement.contains(regularList)) {
            let checklistContainer: HTMLUListElement;

            if (regularList.tagName.toLowerCase() === 'ul') {
              checklistContainer = regularList as HTMLUListElement;
            } else {
              checklistContainer = document.createElement('ul');
              while (regularList.firstChild) {
                checklistContainer.appendChild(regularList.firstChild);
              }
              regularList.replaceWith(checklistContainer);
            }

            checklistContainer.setAttribute('data-type', 'checklist');

            let directItems = getDirectListItems(checklistContainer);
            if (directItems.length === 0) {
              checklistContainer.appendChild(createChecklistItemFromHTML(''));
              directItems = getDirectListItems(checklistContainer);
            }

            let activeParagraph: HTMLParagraphElement | null = null;

            directItems.forEach((checklistItem) => {
              checklistItem.setAttribute('data-type', 'checklist-item');
              if (!checklistItem.hasAttribute('data-checked')) {
                checklistItem.setAttribute('data-checked', 'false');
              }

              const paragraph = ensureChecklistItemParagraph(checklistItem);
              if (checklistItem.contains(range.startContainer)) {
                activeParagraph = paragraph;
              }
            });

            const fallbackParagraph = checklistContainer.querySelector(':scope > li[data-type="checklist-item"] > p') as HTMLParagraphElement | null;
            placeCaretAtEnd(activeParagraph || fallbackParagraph || checklistContainer, editorElement);
            return commit();
          }

          const selectedBlocks = getChecklistConvertibleBlocks(range, editorElement);
          if (selectedBlocks.length > 1) {
            const checklist = document.createElement('ul');
            checklist.setAttribute('data-type', 'checklist');

            selectedBlocks.forEach((block) => {
              checklist.appendChild(createChecklistItemFromHTML(block.innerHTML));
            });

            const firstBlock = selectedBlocks[0];
            firstBlock.replaceWith(checklist);
            selectedBlocks.slice(1).forEach((block) => {
              if (block.isConnected) {
                block.remove();
              }
            });

            const paragraph = checklist.querySelector(':scope > li[data-type="checklist-item"] > p') as HTMLParagraphElement | null;
            if (paragraph) {
              placeCaretAtEnd(paragraph, editorElement);
            }
            return commit();
          }

          const blockElement = selectedBlocks[0] || (container.closest('p, h1, h2, h3, h4, h5, h6, blockquote, pre') as HTMLElement | null);
          if (blockElement && blockElement !== editorElement) {
            const checklist = document.createElement('ul');
            checklist.setAttribute('data-type', 'checklist');
            const checklistItem = createChecklistItemFromHTML(blockElement.innerHTML);
            checklist.appendChild(checklistItem);

            blockElement.replaceWith(checklist);

            const paragraph = checklistItem.querySelector(':scope > p') as HTMLParagraphElement | null;
            if (paragraph) {
              placeCaretAtEnd(paragraph, editorElement);
            }
            return commit();
          }

          const checklist = document.createElement('ul');
          checklist.setAttribute('data-type', 'checklist');
          const checklistItem = createChecklistItemFromHTML('');
          checklist.appendChild(checklistItem);

          range.deleteContents();
          range.insertNode(checklist);

          const paragraph = checklistItem.querySelector(':scope > p') as HTMLParagraphElement | null;
          if (paragraph) {
            placeCaretAtEnd(paragraph, editorElement);
          }
          return commit();
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
