import { initDialogOverlay } from '../../shared/dialogHelpers';
import { Plugin } from '@editora/core';
import { recordDomHistory } from '../../shared/historyHelpers';

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
let selectionText = '';
let isEditingLink = false;
let editingLinkElement: HTMLAnchorElement | null = null;
const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

const ALLOWED_LINK_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:', 'sms:', 'ftp:']);
const LINK_URL_HINT = 'Enter a valid URL, e.g. https://example.com, /page, #section or mailto:name@example.com';

/**
 * Validate and normalise what the user typed into the URL field.
 *
 * The field used to be type="url", which makes the browser reject anything that
 * isn't an absolute URL - so in-page links (#anchor, the whole point of the Anchor
 * plugin), site-relative paths and mailto: links couldn't be entered at all - while
 * the plugin itself never checked the scheme. This accepts those forms, upgrades a
 * bare domain / email address, and refuses scripting schemes such as javascript:.
 */
const normalizeLinkUrl = (raw: string): { url: string } | { error: string } => {
  const value = raw.trim();
  if (!value) return { error: 'Please enter a URL.' };
  if (/\s/.test(value)) return { error: 'The URL cannot contain spaces.' };

  // In-page, site-relative and relative links.
  if (/^(#|\/(?!\/)|\?|\.{1,2}\/)/.test(value)) return { url: value };

  // host:port (and localhost) look like a scheme to the check below.
  if (/^localhost(:\d+)?([/?#]|$)/i.test(value) || /^[^\s/:@]+:\d+([/?#]|$)/.test(value)) {
    return { url: `https://${value}` };
  }

  const scheme = value.match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme) {
    const protocol = `${scheme[1].toLowerCase()}:`;
    if (!ALLOWED_LINK_PROTOCOLS.has(protocol)) {
      return { error: 'Links must use http, https, mailto or tel.' };
    }
    if (protocol === 'http:' || protocol === 'https:' || protocol === 'ftp:') {
      try {
        if (!new URL(value).hostname) return { error: LINK_URL_HINT };
      } catch {
        return { error: LINK_URL_HINT };
      }
    }
    return { url: value };
  }

  // Protocol-relative //host/path
  if (value.startsWith('//')) return { url: `https:${value}` };

  if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(value)) return { url: `mailto:${value}` };
  if (/^[^\s/]+\.[^\s/]+/.test(value)) return { url: `https://${value}` };

  return { error: LINK_URL_HINT };
};

const dispatchContentInput = (contentEl: HTMLElement | null): void => {
  contentEl?.dispatchEvent(new Event('input', { bubbles: true }));
};

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

const isDarkThemeFromRange = (range: Range | null): boolean => {
  if (range) {
    const startNode = range.startContainer;
    const startElement = startNode.nodeType === Node.ELEMENT_NODE
      ? (startNode as HTMLElement)
      : startNode.parentElement;
    if (startElement?.closest(DARK_THEME_SELECTOR)) return true;
  }

  const active = document.activeElement as HTMLElement | null;
  if (active?.closest(DARK_THEME_SELECTOR)) return true;

  return document.body.matches(DARK_THEME_SELECTOR) || document.documentElement.matches(DARK_THEME_SELECTOR);
};

const injectLinkDialogStyles = (): void => {
  if (document.getElementById('rte-link-dialog-theme-styles')) return;

  const style = document.createElement('style');
  style.id = 'rte-link-dialog-theme-styles';
  style.textContent = `
    .link-dialog-overlay.rte-theme-dark .link-dialog {
      background: #1f2937 !important;
      border: 1px solid #4b5563 !important;
      color: #e2e8f0 !important;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.6) !important;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-header {
      border-bottom-color: #3b4657 !important;
      background: #222d3a !important;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-header h3,
    .link-dialog-overlay.rte-theme-dark label {
      color: #e2e8f0 !important;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-close {
      color: #94a3b8 !important;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-close:hover {
      background: #334155 !important;
      color: #f8fafc !important;
      border-radius: 4px;
    }

    .link-dialog-overlay.rte-theme-dark .link-dialog-footer {
      border-top-color: #3b4657 !important;
      background: #222d3a !important;
    }

    .link-dialog-overlay.rte-theme-dark input[type='text'],
    .link-dialog-overlay.rte-theme-dark input[type='url'] {
      background: #111827 !important;
      border-color: #4b5563 !important;
      color: #e2e8f0 !important;
    }

    .link-dialog-overlay.rte-theme-dark input[type='text']::placeholder,
    .link-dialog-overlay.rte-theme-dark input[type='url']::placeholder {
      color: #94a3b8 !important;
    }

    .link-dialog-overlay.rte-theme-dark .btn-cancel {
      background: #334155 !important;
      border-color: #4b5563 !important;
      color: #e2e8f0 !important;
    }

    .link-dialog-overlay.rte-theme-dark .btn-cancel:hover {
      background: #475569 !important;
      border-color: #64748b !important;
    }

    .link-dialog-overlay.rte-theme-dark .btn-submit {
      background: #3b82f6 !important;
    }

    .link-dialog-overlay.rte-theme-dark .btn-submit:hover {
      background: #2563eb !important;
    }
  `;
  document.head.appendChild(style);
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

  // Link edits are direct DOM changes the history plugin never sees.
  const beforeHTML = contentEl.innerHTML;

  if (isEditingLink && editingLinkElement) {
    // Edit existing link
    editingLinkElement.setAttribute('href', linkData.url);
    // Leave the content alone when only the URL/title changed, so formatting inside
    // the link (bold, italic, ...) isn't flattened to plain text.
    if (editingLinkElement.textContent !== linkData.text) {
      editingLinkElement.textContent = linkData.text;
    }
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
    linkElement.setAttribute('href', linkData.url);
    linkElement.textContent = linkData.text;
    linkElement.target = linkData.target;
    
    if (linkData.target === '_blank') {
      linkElement.setAttribute('rel', 'noopener noreferrer');
    }
    
    if (linkData.title) {
      linkElement.title = linkData.title;
    }

    // Insert the link. When the text wasn't changed in the dialog, wrap the selected
    // content instead of replacing it with plain text, so bold/italic inside it
    // survives. Only done for single-block selections: wrapping across blocks
    // would nest block elements inside the <a>.
    const keepsSelectedContent =
      !selectionRange.collapsed &&
      linkData.text === selectionText &&
      !selectionRange.cloneContents().querySelector('p, div, ul, ol, li, table, blockquote, pre, h1, h2, h3, h4, h5, h6');
    if (keepsSelectedContent) {
      linkElement.textContent = '';
      linkElement.appendChild(selectionRange.extractContents());
    } else {
      selectionRange.deleteContents();
    }
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

  recordDomHistory(contentEl, beforeHTML);
  dispatchContentInput(contentEl);

  // Reset state
  selectionRange = null;
  selectionText = '';
  isEditingLink = false;
  editingLinkElement = null;
};

/**
 * Create and show link dialog
 */
const showLinkDialog = (
  initialData: Partial<LinkData> & { isEditing?: boolean },
  isDarkTheme: boolean
): void => {
  document.querySelectorAll('.link-dialog-overlay').forEach((el) => el.remove());

  injectLinkDialogStyles();

  // Create overlay
  const overlay = document.createElement('div');
  initDialogOverlay(overlay);
  overlay.className = 'link-dialog-overlay';
  if (isDarkTheme) overlay.classList.add('rte-theme-dark');
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
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'link-dialog-title');
  dialog.style.cssText = `
    background: white;
    color: #1f2937;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  `;

  // Dialog HTML
  dialog.innerHTML = `
    <div class="link-dialog-header" style="padding: 16px 20px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
      <h3 id="link-dialog-title" style="margin: 0; font-size: 18px;">${initialData.isEditing ? 'Edit Link' : 'Insert Link'}</h3>
      <button type="button" class="link-dialog-close" aria-label="Close" style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px;">×</button>
    </div>
    <form id="link-form" novalidate>
      <div class="link-dialog-body" style="padding: 20px;">
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="link-text" style="display: block; margin-bottom: 6px; font-weight: 500;">Link Text:</label>
          <input
            id="link-text"
            type="text"
            placeholder="Enter link text"
            style="width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; line-height: 1.45; box-sizing: border-box;"
          />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="link-url" style="display: block; margin-bottom: 6px; font-weight: 500;">URL:</label>
          <input
            id="link-url"
            type="text"
            inputmode="url"
            autocapitalize="off"
            spellcheck="false"
            placeholder="https://example.com"
            aria-describedby="link-url-error"
            style="width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; line-height: 1.45; box-sizing: border-box;"
          />
          <div id="link-url-error" role="alert" hidden style="margin-top: 4px; font-size: 12px; color: #c62828;"></div>
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label for="link-title" style="display: block; margin-bottom: 6px; font-weight: 500;">Title (optional):</label>
          <input
            id="link-title"
            type="text"
            placeholder="Link tooltip text"
            style="width: 100%; padding: 10px 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 14px; line-height: 1.45; box-sizing: border-box;"
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
        ${initialData.isEditing ? '<button type="button" class="btn-remove" style="padding: 8px 16px; border: 1px solid #dc3545; background: white; color: #dc3545; border-radius: 4px; cursor: pointer; margin-right: auto;">Remove Link</button>' : ''}
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
  const removeBtn = dialog.querySelector('.btn-remove') as HTMLButtonElement | null;
  const urlError = dialog.querySelector('#link-url-error') as HTMLElement;

  // Link text/URL/title come from the document, so assign them as properties instead
  // of interpolating into the markup above (a quote in a title used to break out of
  // its attribute).
  textInput.value = initialData.text || '';
  urlInput.value = initialData.url || '';
  titleInput.value = initialData.title || '';

  urlInput.addEventListener('input', () => {
    urlError.hidden = true;
    urlInput.removeAttribute('aria-invalid');
  });

  // Close dialog function
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeDialog();
  };

  const closeDialog = () => {
    document.removeEventListener('keydown', handleEscape, true);
    overlay.remove();
  };

  // Event listeners
  closeBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  removeBtn?.addEventListener('click', () => {
    // Unwrap editingLinkElement directly rather than relying on document.execCommand('unlink')
    // against the live selection - focus has moved into the dialog's own inputs by now, so the
    // selection no longer reliably points at the link being edited.
    if (editingLinkElement) {
      const contentEl = findContentElement(editingLinkElement);
      const beforeHTML = contentEl ? contentEl.innerHTML : '';
      const parent = editingLinkElement.parentNode;
      if (parent) {
        while (editingLinkElement.firstChild) {
          parent.insertBefore(editingLinkElement.firstChild, editingLinkElement);
        }
        parent.removeChild(editingLinkElement);
      }
      if (contentEl) {
        recordDomHistory(contentEl, beforeHTML);
        dispatchContentInput(contentEl);
      }
    }
    selectionRange = null;
    selectionText = '';
    isEditingLink = false;
    editingLinkElement = null;
    closeDialog();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDialog();
  });
  document.addEventListener('keydown', handleEscape, true);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const normalized = normalizeLinkUrl(urlInput.value);
    if ('error' in normalized) {
      urlError.textContent = normalized.error;
      urlError.hidden = false;
      urlInput.setAttribute('aria-invalid', 'true');
      urlInput.focus();
      return;
    }

    const url = normalized.url;
    urlInput.value = url;
    handleInsertLink({
      text: textInput.value.trim() || url,
      url,
      target: targetCheckbox.checked ? '_blank' : '_self',
      title: titleInput.value.trim() || undefined
    });
    closeDialog();
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
  const isDarkTheme = isDarkThemeFromRange(range);

  const selectedText = selection.toString() || '';
  selectionText = selectedText;

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
      // The attribute, not the resolved .href - otherwise editing a relative or
      // in-page link silently rewrites it to an absolute URL.
      url: linkElement.getAttribute('href') || '',
      target: (linkElement.target as '_blank' | '_self') || '_self',
      title: linkElement.title || '',
      isEditing: true
    }, isDarkTheme);
  } else {
    // Insert mode
    isEditingLink = false;
    editingLinkElement = null;
    showLinkDialog({
      text: selectedText,
      url: '',
      target: '_self',
      isEditing: false
    }, isDarkTheme);
  }

  return true;
};

/**
 * Remove link from selection
 */
export const removeLink = (): boolean => {
  const selection = window.getSelection();
  const anchorNode = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).startContainer : null;
  const anchorElement = anchorNode && anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : (anchorNode as HTMLElement | null);
  const contentEl = findContentElement(anchorElement);
  const beforeHTML = contentEl ? contentEl.innerHTML : '';

  document.execCommand('unlink', false);

  if (contentEl) {
    recordDomHistory(contentEl, beforeHTML);
    dispatchContentInput(contentEl);
  }
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
    if (!url) return;
    const normalized = normalizeLinkUrl(url);
    if ('error' in normalized) return;

    const selection = window.getSelection();
    const anchorNode = selection && selection.rangeCount > 0 ? selection.getRangeAt(0).startContainer : null;
    const anchorElement = anchorNode && anchorNode.nodeType === Node.TEXT_NODE ? anchorNode.parentElement : (anchorNode as HTMLElement | null);
    const contentEl = findContentElement(anchorElement);
    const beforeHTML = contentEl ? contentEl.innerHTML : '';

    document.execCommand('createLink', false, normalized.url);

    if (contentEl) {
      recordDomHistory(contentEl, beforeHTML);
      dispatchContentInput(contentEl);
    }
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
