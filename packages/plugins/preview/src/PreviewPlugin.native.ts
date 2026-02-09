import { Plugin } from '@editora/core';

/**
 * Preview Plugin - Native Implementation
 * 
 * Features:
 * - In-page modal preview dialog
 * - Read-only content display
 * - Clean, sanitized HTML output
 * - Responsive design
 * - Escape key to close
 */

// Module-level flag to prevent multiple dialogs
let isPreviewDialogOpen = false;

/**
 * Inject preview dialog styles into document head
 */
const injectStyles = (): void => {
  if (typeof document === 'undefined') return;
  
  const styleId = 'rte-preview-plugin-styles';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* Preview Editor Dialog Styles */
    .rte-preview-editor-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background-color: rgba(0, 0, 0, 0.6) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 10000 !important;
      padding: 20px !important;
      box-sizing: border-box !important;
      margin: 0 !important;
    }

    .rte-preview-editor-modal {
      background: white;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      width: 100%;
      max-width: 1200px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .rte-preview-editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid #e1e5e9;
      background: #f8f9fa;
      border-radius: 8px 8px 0 0;
    }

    .rte-preview-editor-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .rte-preview-editor-header-actions {
      display: flex;
      gap: 8px;
    }

    .rte-preview-editor-close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      color: #666;
      font-size: 16px;
      line-height: 1;
      transition: all 0.2s ease;
    }

    .rte-preview-editor-close-btn:hover {
      background: #e1e5e9;
      color: #1a1a1a;
    }

    .rte-preview-editor-body {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      padding: 25px;
    }

    .rte-preview-editor-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .rte-preview-editor-light-editor {
      flex: 1;
      overflow: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #1a1a1a;
      padding: 20px;
      background: #fafafa;
      border: 1px solid #e1e5e9;
      border-radius: 4px;
      min-height: 400px;
    }

    .rte-preview-editor-light-editor h1,
    .rte-preview-editor-light-editor h2,
    .rte-preview-editor-light-editor h3,
    .rte-preview-editor-light-editor h4,
    .rte-preview-editor-light-editor h5,
    .rte-preview-editor-light-editor h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }

    .rte-preview-editor-light-editor h1 {
      font-size: 2em;
    }

    .rte-preview-editor-light-editor h2 {
      font-size: 1.5em;
    }

    .rte-preview-editor-light-editor h3 {
      font-size: 1.25em;
    }

    .rte-preview-editor-light-editor p {
      margin: 1em 0;
    }

    .rte-preview-editor-light-editor ul,
    .rte-preview-editor-light-editor ol {
      padding-left: 2em;
      margin: 1em 0;
    }

    .rte-preview-editor-light-editor li {
      margin: 0.5em 0;
    }

    .rte-preview-editor-light-editor table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }

    .rte-preview-editor-light-editor table td,
    .rte-preview-editor-light-editor table th {
      border: 1px solid #ddd;
      padding: 0.5em;
    }

    .rte-preview-editor-light-editor table th {
      background: #f5f5f5;
      font-weight: 600;
    }

    .rte-preview-editor-light-editor blockquote {
      border-left: 4px solid #ddd;
      margin: 1em 0;
      padding-left: 1em;
      color: #666;
    }

    .rte-preview-editor-light-editor code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
      font-size: 0.9em;
    }

    .rte-preview-editor-light-editor pre {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
      margin: 1em 0;
    }

    .rte-preview-editor-light-editor pre code {
      background: none;
      padding: 0;
    }

    .rte-preview-editor-light-editor img {
      max-width: 100%;
      height: auto;
    }

    .rte-preview-editor-light-editor a {
      color: #007acc;
      text-decoration: underline;
    }

    .rte-preview-editor-light-editor a:hover {
      color: #0056b3;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .rte-preview-editor-overlay {
        padding: 10px;
      }

      .rte-preview-editor-modal {
        max-height: 95vh;
      }

      .rte-preview-editor-header {
        padding: 12px 16px;
      }

      .rte-preview-editor-body {
        padding: 16px;
      }

      .rte-preview-editor-light-editor {
        padding: 12px;
        font-size: 14px;
      }
    }
  `;
  
  document.head.appendChild(style);
};

/**
 * Find the active editor based on current selection or focus
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
};

/**
 * Serialize editor content to clean HTML
 */
const serializeEditorContent = (): string => {
  const editorElement = findActiveEditor();
  if (!editorElement) return '';

  // Clone the content to avoid modifying the original
  const clonedContent = editorElement.cloneNode(true) as HTMLElement;

  // Remove RTE-specific elements that shouldn't be in the preview
  const elementsToRemove = [
    '.rte-floating-toolbar',
    '.rte-selection-marker',
    '.rte-toolbar',
    '.rte-resize-handle',
    '[data-rte-internal]'
  ];
  
  elementsToRemove.forEach(selector => {
    clonedContent.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Return the clean HTML
  return clonedContent.innerHTML;
};

/**
 * Sanitize HTML to prevent XSS attacks
 */
const sanitizeHTML = (html: string): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Remove dangerous elements
  const dangerousElements = tempDiv.querySelectorAll(
    'script, iframe[src^="javascript:"], object, embed, form[action^="javascript:"]'
  );
  dangerousElements.forEach(el => el.remove());

  // Remove dangerous attributes
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    // Remove event handlers (onclick, onload, etc.)
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
      // Remove javascript: URLs
      if ((attr.name === 'href' || attr.name === 'src') && 
          attr.value.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return tempDiv.innerHTML;
};

/**
 * Show the preview dialog
 */
const showPreviewDialog = (): void => {
  if (typeof window === 'undefined' || isPreviewDialogOpen) return;
  
  isPreviewDialogOpen = true;
  injectStyles();

  // Serialize and sanitize content
  const rawHtml = serializeEditorContent();
  const cleanHtml = sanitizeHTML(rawHtml);

  // Create dialog overlay
  const overlay = document.createElement('div');
  overlay.className = 'rte-preview-editor-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'preview-editor-title');

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'rte-preview-editor-modal';

  // Create header
  const header = document.createElement('div');
  header.className = 'rte-preview-editor-header';
  header.innerHTML = `
    <h2 id="preview-editor-title">Preview Editor</h2>
    <div class="rte-preview-editor-header-actions">
      <button class="rte-preview-editor-close-btn" aria-label="Close preview editor">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  `;

  // Create body
  const body = document.createElement('div');
  body.className = 'rte-preview-editor-body';

  const content = document.createElement('div');
  content.className = 'rte-preview-editor-content';

  const editor = document.createElement('div');
  editor.className = 'rte-preview-editor-light-editor';
  editor.innerHTML = cleanHtml;

  content.appendChild(editor);
  body.appendChild(content);

  // Assemble modal
  modal.appendChild(header);
  modal.appendChild(body);
  overlay.appendChild(modal);

  // Close dialog function
  const closeDialog = () => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
    isPreviewDialogOpen = false;
    document.removeEventListener('keydown', handleEscape);
  };

  // Handle escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeDialog();
    }
  };

  // Event listeners
  const closeBtn = header.querySelector('.rte-preview-editor-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeDialog();
    });
  }

  // Close on overlay click (but not modal click)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDialog();
    }
  });

  // Add escape key listener
  document.addEventListener('keydown', handleEscape);

  // Add to DOM
  document.body.appendChild(overlay);
};

export const PreviewPlugin = (): Plugin => ({
  name: 'preview',
  
  toolbar: [
    {
      label: 'Preview',
      command: 'togglePreview',
      icon: '<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 92 92" enable-background="new 0 0 92 92" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_1239_" d="M91.3,43.8C90.6,42.8,74.4,19,46,19C17.6,19,1.4,42.8,0.7,43.8c-0.9,1.3-0.9,3.1,0,4.5 C1.4,49.2,17.6,73,46,73c28.4,0,44.6-23.8,45.3-24.8C92.2,46.9,92.2,45.1,91.3,43.8z M46,65C26.7,65,13.5,51.4,9,46 c4.5-5.5,17.6-19,37-19c19.3,0,32.5,13.6,37,19C78.4,51.5,65.3,65,46,65z M48.3,29.6c-4.4-0.6-8.7,0.5-12.3,3.2c0,0,0,0,0,0 c-7.3,5.5-8.8,15.9-3.3,23.2c2.7,3.6,6.5,5.8,10.9,6.5c0.8,0.1,1.6,0.2,2.3,0.2c3.6,0,7-1.2,9.9-3.3c7.3-5.5,8.8-15.9,3.3-23.2 C56.6,32.5,52.7,30.2,48.3,29.6z M52.3,54.5c-2.2,1.7-5,2.4-7.8,2c-2.8-0.4-5.3-1.9-7-4.1C34.1,47.7,35,41,39.7,37.5 c2.2-1.7,5-2.4,7.8-2c2.8,0.4,5.3,1.9,7,4.1C57.9,44.3,57,51,52.3,54.5z M51.9,40c0.8,0.7,1.2,1.8,1.2,2.8c0,1-0.4,2.1-1.2,2.8 c-0.7,0.7-1.8,1.2-2.8,1.2c-1.1,0-2.1-0.4-2.8-1.2c-0.8-0.8-1.2-1.8-1.2-2.8c0-1.1,0.4-2.1,1.2-2.8c0.7-0.8,1.8-1.2,2.8-1.2 C50.2,38.9,51.2,39.3,51.9,40z"></path> </g></svg>'
    }
  ],
  
  commands: {
    togglePreview: () => {
      showPreviewDialog();
      return true;
    }
  },
  
  keymap: {}
});
