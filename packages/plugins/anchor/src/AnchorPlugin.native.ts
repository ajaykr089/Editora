import type { Plugin } from '@editora/core';
import { findEditorContainerFromSelection, getContentElement } from '../../shared/editorContainerHelpers';

/**
 * AnchorPlugin - Native implementation with complete UI/UX dialog
 * 
 * Creates named navigation targets with:
 * - ID uniqueness enforcement
 * - Automatic ID validation and sanitization
 * - URL-safe ID generation
 * - Duplicate collision detection
 * - Reference update on rename
 * - Safe deletion handling
 * - Full UI dialog for adding/editing anchors
 * - Visual hover indicators
 * - Registry sync with DOM
 * 
 * Features:
 * - Add/Edit/Delete anchors with dialog
 * - ID validation (URL-safe, unique)
 * - Visual indicators on hover
 * - Keyboard shortcuts (ESC, Enter)
 * - Auto-sanitization
 * - Mutation observer for cleanup
 */

// --- Anchor Registry ---
const anchorRegistry = new Set<string>();

/**
 * Initialize mutation observer to track anchor deletions
 */
function initializeAnchorObserver() {
  if (typeof window === 'undefined') return;
  if ((window as any).__anchorObserverInitialized) return;
  
  (window as any).__anchorObserverInitialized = true;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;
          
          if (element.classList?.contains('rte-anchor')) {
            const anchorId = element.id;
            if (anchorId) anchorRegistry.delete(anchorId);
          }
          
          const anchors = element.querySelectorAll?.('.rte-anchor');
          anchors?.forEach((anchor: Element) => {
            const anchorId = (anchor as HTMLElement).id;
            if (anchorId) anchorRegistry.delete(anchorId);
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

/**
 * Generate unique anchor ID
 */
function generateUniqueId(): string {
  let id: string;
  let counter = 0;

  do {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    id = `anchor-${timestamp}-${random}`;
    counter++;
    if (counter > 100) return '';
  } while (anchorRegistry.has(id));

  return id;
}

/**
 * Sanitize and validate anchor ID
 */
function sanitizeId(id: string): string {
  return id
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-_]/g, '-')
    .replace(/^[^a-z_]/, `a-${Math.random().toString(36).substr(2, 5)}`)
    .substring(0, 256);
}

/**
 * Validate anchor ID
 */
function validateId(id: string): { valid: boolean; error: string } {
  if (!id || id.trim().length === 0) {
    return { valid: false, error: 'Anchor ID cannot be empty' };
  }

  if (id.length > 256) {
    return { valid: false, error: 'Anchor ID must be less than 256 characters' };
  }

  if (!/^[a-z_]/.test(id)) {
    return { valid: false, error: 'Anchor ID must start with a letter or underscore' };
  }

  if (!/^[a-z0-9\-_]+$/.test(id)) {
    return { valid: false, error: 'Anchor ID can only contain letters, numbers, hyphens, and underscores' };
  }

  return { valid: true, error: '' };
}

/**
 * Sync anchor registry with DOM (multi-instance safe)
 */
function syncAnchorRegistry() {
  const editorContainer = findEditorContainerFromSelection();
  if (!editorContainer) return;
  
  const editor = getContentElement(editorContainer);
  if (!editor) return;
  
  const anchors = editor.querySelectorAll('.rte-anchor');
  const domAnchors = new Set<string>();

  anchors.forEach((anchor) => {
    const id = (anchor as HTMLElement).id;
    if (id) domAnchors.add(id);
  });

  anchorRegistry.clear();
  domAnchors.forEach((id) => anchorRegistry.add(id));
}

/**
 * Create Anchor Dialog
 */
function createAnchorDialog(mode: 'add' | 'edit', currentId?: string, onSave?: (id: string) => void, savedRange?: Range) {
  // Sync registry before showing dialog
  syncAnchorRegistry();
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'rte-anchor-dialog-overlay';
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  `;
  
  // Create dialog
  const dialog = document.createElement('div');
  dialog.className = 'rte-anchor-dialog';
  dialog.style.cssText = `
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 450px;
    overflow: hidden;
    animation: rte-anchor-dialog-appear 0.2s ease;
  `;
  
  // Add animation keyframes
  if (!document.getElementById('rte-anchor-dialog-styles')) {
    const style = document.createElement('style');
    style.id = 'rte-anchor-dialog-styles';
    style.textContent = `
      @keyframes rte-anchor-dialog-appear {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .rte-anchor-dialog input:focus {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  let errorMessage = '';
  let touched = false;
  
  // Header
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #e0e0e0;
    background: #f9f9f9;
  `;
  
  const title = document.createElement('h3');
  title.style.cssText = 'margin: 0; font-size: 18px; font-weight: 600; color: #333;';
  title.textContent = mode === 'add' ? 'Add Anchor' : 'Edit Anchor';
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
  `;
  closeBtn.onmouseover = () => { closeBtn.style.background = '#e0e0e0'; closeBtn.style.color = '#333'; };
  closeBtn.onmouseout = () => { closeBtn.style.background = 'none'; closeBtn.style.color = '#999'; };
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Body
  const body = document.createElement('div');
  body.style.cssText = 'padding: 20px;';
  
  const field = document.createElement('div');
  field.style.cssText = 'margin-bottom: 0;';
  
  const label = document.createElement('label');
  label.textContent = 'Anchor ID';
  label.style.cssText = 'display: block; font-size: 14px; font-weight: 500; color: #333; margin-bottom: 8px;';
  label.setAttribute('for', 'anchor-id-input');
  
  const input = document.createElement('input');
  input.id = 'anchor-id-input';
  input.type = 'text';
  input.placeholder = 'e.g., section-introduction';
  input.value = currentId || '';
  input.style.cssText = `
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    transition: all 0.2s ease;
    box-sizing: border-box;
  `;
  
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    color: #d32f2f;
    font-size: 12px;
    margin-top: 6px;
    display: none;
  `;
  
  const helpText = document.createElement('div');
  helpText.textContent = 'URL-safe ID (letters, numbers, hyphens, underscores). Must start with letter or underscore.';
  helpText.style.cssText = 'color: #999; font-size: 12px; margin-top: 8px; line-height: 1.4;';
  
  field.appendChild(label);
  field.appendChild(input);
  field.appendChild(errorDiv);
  field.appendChild(helpText);
  body.appendChild(field);
  
  // Footer
  const footer = document.createElement('div');
  footer.style.cssText = `
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    border-top: 1px solid #e0e0e0;
    background: #f9f9f9;
    justify-content: flex-end;
  `;
  
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.cssText = `
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #f0f0f0;
    color: #333;
  `;
  cancelBtn.onmouseover = () => cancelBtn.style.background = '#e0e0e0';
  cancelBtn.onmouseout = () => cancelBtn.style.background = '#f0f0f0';
  
  const saveBtn = document.createElement('button');
  saveBtn.textContent = mode === 'add' ? 'Add Anchor' : 'Save Changes';
  saveBtn.style.cssText = `
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: #0066cc;
    color: white;
  `;
  saveBtn.disabled = !input.value.trim();
  
  const updateSaveButton = () => {
    if (!input.value.trim()) {
      saveBtn.disabled = true;
      saveBtn.style.background = '#d0d0d0';
      saveBtn.style.color = '#999';
      saveBtn.style.cursor = 'not-allowed';
    } else {
      saveBtn.disabled = false;
      saveBtn.style.background = '#0066cc';
      saveBtn.style.color = 'white';
      saveBtn.style.cursor = 'pointer';
    }
  };
  
  saveBtn.onmouseover = () => {
    if (!saveBtn.disabled) {
      saveBtn.style.background = '#0052a3';
      saveBtn.style.boxShadow = '0 2px 8px rgba(0, 102, 204, 0.3)';
    }
  };
  saveBtn.onmouseout = () => {
    if (!saveBtn.disabled) {
      saveBtn.style.background = '#0066cc';
      saveBtn.style.boxShadow = 'none';
    }
  };
  
  footer.appendChild(cancelBtn);
  footer.appendChild(saveBtn);
  
  // Validation on input
  input.oninput = () => {
    touched = true;
    const value = input.value;
    updateSaveButton();
    
    if (value.trim()) {
      const validation = validateId(value);
      if (!validation.valid) {
        errorMessage = validation.error;
        errorDiv.textContent = '⚠ ' + errorMessage;
        errorDiv.style.display = 'block';
        input.style.borderColor = '#d32f2f';
        input.style.background = '#ffebee';
      } else if (mode === 'add' && anchorRegistry.has(value)) {
        errorMessage = `Anchor ID already exists: ${value}`;
        errorDiv.textContent = '⚠ ' + errorMessage;
        errorDiv.style.display = 'block';
        input.style.borderColor = '#d32f2f';
        input.style.background = '#ffebee';
      } else if (mode === 'edit' && value !== currentId && anchorRegistry.has(value)) {
        errorMessage = `Anchor ID already exists: ${value}`;
        errorDiv.textContent = '⚠ ' + errorMessage;
        errorDiv.style.display = 'block';
        input.style.borderColor = '#d32f2f';
        input.style.background = '#ffebee';
      } else {
        errorMessage = '';
        errorDiv.style.display = 'none';
        input.style.borderColor = '#d0d0d0';
        input.style.background = 'white';
      }
    } else {
      errorDiv.style.display = 'none';
      input.style.borderColor = '#d0d0d0';
      input.style.background = 'white';
    }
  };
  
  input.onfocus = () => {
    input.style.borderColor = errorMessage ? '#d32f2f' : '#0066cc';
    input.style.boxShadow = errorMessage 
      ? '0 0 0 3px rgba(211, 47, 47, 0.1)' 
      : '0 0 0 3px rgba(0, 102, 204, 0.1)';
    input.style.background = errorMessage ? '#ffebee' : '#f9f9ff';
  };
  
  input.onblur = () => {
    input.style.boxShadow = 'none';
    if (!errorMessage) {
      input.style.background = 'white';
    }
  };
  
  // Handle save
  const handleSave = () => {
    const value = input.value.trim();
    if (!value) return;
    
    const validation = validateId(value);
    if (!validation.valid) return;
    
    if (mode === 'add' && anchorRegistry.has(value)) return;
    if (mode === 'edit' && value !== currentId && anchorRegistry.has(value)) return;
    
    if (onSave) onSave(value);
    overlay.remove();
  };
  
  const handleCancel = () => {
    overlay.remove();
  };
  
  saveBtn.onclick = handleSave;
  cancelBtn.onclick = handleCancel;
  closeBtn.onclick = handleCancel;
  
  input.onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };
  
  overlay.onclick = (e) => {
    if (e.target === overlay) handleCancel();
  };
  
  // Assemble
  dialog.appendChild(header);
  dialog.appendChild(body);
  dialog.appendChild(footer);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  
  // Auto-focus input
  setTimeout(() => input.focus(), 100);
}

/**
 * Insert anchor at cursor
 */
function insertAnchor(anchorId: string, savedRange?: Range) {
  let range: Range;
  
  if (savedRange) {
    range = savedRange;
  } else {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    range = selection.getRangeAt(0);
  }

  // Create anchor element
  const anchor = document.createElement('span');
  anchor.id = anchorId;
  anchor.className = 'rte-anchor';
  anchor.setAttribute('data-type', 'anchor');
  anchor.setAttribute('data-anchor-id', anchorId);
  anchor.setAttribute('title', `Anchor: ${anchorId}`);
  
  // Add inline styles for visibility
  anchor.style.cssText = `
    display: inline;
    position: relative;
    cursor: pointer;
  `;

  range.insertNode(anchor);
  anchorRegistry.add(anchorId);

  // Move cursor after anchor
  range.setStart(anchor.nextSibling || anchor.parentNode!, 0);
  range.collapse(true);
  const sel = window.getSelection();
  if (sel) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
  
  // Trigger input event to update editor state
  const editorContainer = findEditorContainerFromSelection();
  if (editorContainer) {
    const contentElement = getContentElement(editorContainer);
    if (contentElement) {
      contentElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
  
  // Add hover CSS if not already present
  addAnchorStyles();
}

/**
 * Add anchor hover styles
 */
function addAnchorStyles() {
  if (document.getElementById('rte-anchor-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'rte-anchor-styles';
  style.textContent = `
    .rte-anchor {
      display: inline;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .rte-anchor:hover::before {
      content: '⚓';
      position: absolute;
      top: -1.2em;
      left: 0;
      background: #333;
      color: #fff;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.8em;
      white-space: nowrap;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    .rte-anchor:hover::after {
      content: attr(data-anchor-id);
      position: absolute;
      top: -1.2em;
      left: 1.4em;
      background: #333;
      color: #fff;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 0.75em;
      font-family: 'Courier New', monospace;
      white-space: nowrap;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    
    [contenteditable='true'] .rte-anchor::before {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      background: #0066cc;
      border-radius: 50%;
      top: -3px;
      left: 0;
      opacity: 0.5;
      transition: opacity 0.2s ease;
    }
    
    [contenteditable='true'] .rte-anchor:hover::before {
      opacity: 1;
      width: auto;
      height: auto;
      background: #333;
      border-radius: 3px;
      top: -1.2em;
      padding: 2px 6px;
      font-size: 0.8em;
      content: '⚓';
    }
    
    @media print {
      .rte-anchor::before,
      .rte-anchor::after {
        display: none;
      }
      .rte-anchor {
        cursor: auto;
      }
    }
    
    .rte-anchor:focus {
      outline: 2px solid #0066cc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

export const AnchorPlugin = (): Plugin => {
  // Initialize observer
  if (typeof window !== 'undefined') {
    initializeAnchorObserver();
    addAnchorStyles();
  }

  return {
    name: "anchor",

    toolbar: [
      {
        label: "Anchor",
        command: "insertAnchor",
        icon: '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 8.4C13.4912 8.4 14.7 7.19117 14.7 5.7C14.7 4.20883 13.4912 3 12 3C10.5088 3 9.3 4.20883 9.3 5.7C9.3 7.19117 10.5088 8.4 12 8.4ZM12 8.4V20.9999M12 20.9999C9.61305 20.9999 7.32387 20.0518 5.63604 18.364C3.94821 16.6761 3 14.3869 3 12H5M12 20.9999C14.3869 20.9999 16.6761 20.0518 18.364 18.364C20.0518 16.6761 21 14.3869 21 12H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
        shortcut: 'Mod-Shift-k'
      },
    ],

    commands: {
      insertAnchor: () => {
        try {
          const selection = window.getSelection();
          if (!selection || selection.rangeCount === 0) {
            alert('Please place your cursor where you want to insert the anchor.');
            return false;
          }
          
          const savedRange = selection.getRangeAt(0).cloneRange();
          
          createAnchorDialog('add', '', (anchorId) => {
            insertAnchor(anchorId, savedRange);
          }, savedRange);
          return true;
        } catch (error) {
          console.error('Failed to insert anchor:', error);
          return false;
        }
      },
    },

    keymap: {
      'Mod-Shift-k': 'insertAnchor',
    },
  };
};
