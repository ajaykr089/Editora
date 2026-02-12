import { Plugin } from '@editora/core';

/**
 * Link Plugin - Native Implementation
 * Author: Ajay Kumar <ajaykr089@gmail.com>
 * 
 * Provides hyperlink functionality with:
 * - Dialog-based link insertion/editing
 * - Link text, URL, title, and target options
 * - Edit existing links
 * - Smart link detection
 * - Security (rel="noopener noreferrer" for _blank)
 */

interface LinkData {
  text: string;
  url: string;
  target: '_blank' | '_self';
  title?: string;
}

let selectionRange: Range | null = null;
let isEditingLink = false;
let editingLinkElement: HTMLAnchorElement | null = null;

/**
 * Find editor content element
 */
const findContentElement = (element: HTMLElement | null): HTMLElement | null => {
  if (!element) return null;
  
  let current: HTMLElement | null = element;
  while (current) {
    if (current.hasAttribute('contenteditable') && current.getAttribute('contenteditable') === 'true') {
      return current;
    }
    if (current.hasAttribute('data-editora-content')) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
};

/**
 * Insert or update link
 */
const handleInsertLink = (linkData: LinkData): void => {
  if (!selectionRange) {
    console.warn('No selection range stored');
    return;
  }

  const rangeNode = selectionRange.startContainer;
  const element = rangeNode.nodeType === Node.TEXT_NODE 
    ? rangeNode.parentElement 
    : rangeNode as HTMLElement;

  const contentEl = findContentElement(element);
  if (!contentEl) return;

  if (isEditingLink && editingLinkElement) {
    // Edit existing link
    editingLinkElement.href = linkData.url;
    editingLinkElement.textContent = linkData.text;
    editingLinkElement.target = linkData.target;
    
    if (linkData.target === '_blank') {
      editingLinkElement.setAttribute('rel', 'noopener noreferrer');
    } else {
      editingLinkElement.removeAttribute('rel');
    }
    
    if (linkData.title) {
      editingLinkElement.title = linkData.title;
    } else {
      editingLinkElement.removeAttribute('title');
    }

    // Select the edited link
    const range = document.createRange();
    range.selectNodeContents(editingLinkElement);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } else {
    // Create new link
    const linkElement = document.createElement('a');
    linkElement.href = linkData.url;
    linkElement.textContent = linkData.text;
    linkElement.target = linkData.target;
    
    if (linkData.target === '_blank') {
      linkElement.setAttribute('rel', 'noopener noreferrer');
    }
    
    if (linkData.title) {
      linkElement.title = linkData.title;
    }

    // Insert the link
    selectionRange.deleteContents();
    selectionRange.insertNode(linkElement);

    // Move cursor after the link
    selectionRange.setStartAfter(linkElement);
    selectionRange.setEndAfter(linkElement);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(selectionRange);
    }
  }

  // Focus back to editor
  contentEl.focus();

  // Reset state
  selectionRange = null;
  isEditingLink = false;
  editingLinkElement = null;
};

/**
 * Create and show link dialog
 */
const showLinkDialog = (initialData: Partial<LinkData> & { isEditing?: boolean }): void => {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'link-dialog-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  // Create dialog
  const dialog = document.createElement('div');
  dialog.className = 'link-dialog';
  dialog.style.cssText = `
    background: white;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;

  // Dialog HTML
  dialog.innerHTML = `
    <div class="link-dialog-header" style="padding: 16px 20px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0; font-size: 18px;">${initialData.isEditing ? 'Edit Link' : 'Insert Link'}</h3>
      <button class="link-dialog-close" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px;">×</button>
    </div>
    <form id="link-form">
      <div class="link-dialog-body" style="padding: 20px;">
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="link-text" style="display: block; margin-bottom: 6px; font-weight: 500;">Link Text:</label>
          <input
            id="link-text"
            type="text"
            value="${initialData.text || ''}"
            placeholder="Enter link text"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;"
          />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="link-url" style="display: block; margin-bottom: 6px; font-weight: 500;">URL:</label>
          <input
            id="link-url"
            type="url"
            value="${initialData.url || ''}"
            placeholder="https://example.com"
            required
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;"
          />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="link-title" style="display: block; margin-bottom: 6px; font-weight: 500;">Title (optional):</label>
          <input
            id="link-title"
            type="text"
            value="${initialData.title || ''}"
            placeholder="Link tooltip text"
            style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;"
          />
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label style="display: flex; align-items: center; cursor: pointer;">
            <input
              id="link-target"
              type="checkbox"
              ${initialData.target === '_blank' ? 'checked' : ''}
              style="margin-right: 8px;"
            />
            Open in new window/tab
          </label>
        </div>
      </div>
      <div class="link-dialog-footer" style="padding: 12px 20px; border-top: 1px solid #ddd; display: flex; justify-content: flex-end; gap: 10px;">
        <button type="button" class="btn-cancel" style="padding: 8px 16px; border: 1px solid #ccc; background: white; border-radius: 4px; cursor: pointer;">Cancel</button>
        <button type="submit" class="btn-submit" style="padding: 8px 16px; border: none; background: #007bff; color: white; border-radius: 4px; cursor: pointer;">
          ${initialData.isEditing ? 'Update Link' : 'Insert Link'}
        </button>
      </div>
    </form>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Get form elements
  const form = dialog.querySelector('#link-form') as HTMLFormElement;
  const textInput = dialog.querySelector('#link-text') as HTMLInputElement;
  const urlInput = dialog.querySelector('#link-url') as HTMLInputElement;
  const titleInput = dialog.querySelector('#link-title') as HTMLInputElement;
  const targetCheckbox = dialog.querySelector('#link-target') as HTMLInputElement;
  const closeBtn = dialog.querySelector('.link-dialog-close') as HTMLButtonElement;
  const cancelBtn = dialog.querySelector('.btn-cancel') as HTMLButtonElement;

  // Close dialog function
  const closeDialog = () => {
    document.body.removeChild(overlay);
  };

  // Event listeners
  closeBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDialog();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = urlInput.value.trim();
    if (url) {
      handleInsertLink({
        text: textInput.value.trim() || url,
        url,
        target: targetCheckbox.checked ? '_blank' : '_self',
        title: titleInput.value.trim() || undefined
      });
      closeDialog();
    }
  });

  // Focus first input
  setTimeout(() => textInput.focus(), 100);
};

/**
 * Open link dialog
 */
export const openLinkDialog = (): boolean => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return false;

  const range = selection.getRangeAt(0).cloneRange();
  selectionRange = range;

  const selectedText = selection.toString() || '';

  // Check if selection is within a link
  const startContainer = range.startContainer;
  const startElement = startContainer.nodeType === Node.TEXT_NODE
    ? startContainer.parentElement
    : startContainer as HTMLElement;

  const linkElement = startElement?.closest('a') as HTMLAnchorElement;

  if (linkElement) {
    // Edit mode
    isEditingLink = true;
    editingLinkElement = linkElement;
    showLinkDialog({
      text: linkElement.textContent || '',
      url: linkElement.href,
      target: (linkElement.target as '_blank' | '_self') || '_self',
      title: linkElement.title || '',
      isEditing: true
    });
  } else {
    // Insert mode
    isEditingLink = false;
    editingLinkElement = null;
    showLinkDialog({
      text: selectedText,
      url: '',
      target: '_self',
      isEditing: false
    });
  }

  return true;
};

/**
 * Remove link from selection
 */
export const removeLink = (): boolean => {
  document.execCommand('unlink', false);
  return true;
};

/**
 * Register commands globally
 */
const registerCommand = (command: string, handler: (...args: any[]) => void): void => {
  if (typeof window !== 'undefined') {
    (window as any).registerEditorCommand?.(command, handler);
  }
};

/**
 * Initialize global command registration
 */
const initializeCommands = (): void => {
  registerCommand('openLinkDialog', openLinkDialog);
  registerCommand('removeLink', removeLink);
  registerCommand('createLink', (url?: string) => {
    if (url) document.execCommand('createLink', false, url);
  });
};

// Initialize on load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCommands);
  } else {
    initializeCommands();
  }
}

export const LinkPlugin = (): Plugin => ({
  name: 'link',

  marks: {
    link: {
      attrs: {
        href: {},
        title: { default: null },
        target: { default: null }
      },
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: (dom: HTMLElement) => ({
            href: dom.getAttribute('href'),
            title: dom.getAttribute('title'),
            target: dom.getAttribute('target')
          })
        }
      ],
      toDOM: (mark: any) => [
        'a',
        {
          href: mark.attrs.href,
          title: mark.attrs.title,
          target: mark.attrs.target,
          rel: mark.attrs.target === '_blank' ? 'noopener noreferrer' : null
        },
        0
      ]
    }
  },

  toolbar: [
    {
      label: 'Link',
      command: 'openLinkDialog',
      type: 'button',
      icon: '<svg width="24" height="24" focusable="false"><path d="M6.2 12.3a1 1 0 0 1 1.4 1.4l-2 2a2 2 0 1 0 2.6 2.8l4.8-4.8a1 1 0 0 0 0-1.4 1 1 0 1 1 1.4-1.3 2.9 2.9 0 0 1 0 4L9.6 20a3.9 3.9 0 0 1-5.5-5.5l2-2Zm11.6-.6a1 1 0 0 1-1.4-1.4l2-2a2 2 0 1 0-2.6-2.8L11 10.3a1 1 0 0 0 0 1.4A1 1 0 1 1 9.6 13a2.9 2.9 0 0 1 0-4L14.4 4a3.9 3.9 0 0 1 5.5 5.5l-2 2Z" fill-rule="nonzero"></path></svg>',
      shortcut: 'Mod-k'
    }
  ],

  commands: {
    openLinkDialog,
    removeLink
  },

  keymap: {
    'Mod-k': 'openLinkDialog'
  }
});
