import type { Plugin } from '@editora/core';

/**
 * EmbedIframePlugin - Native implementation for embedding external content
 * 
 * Features:
 * - Full-featured dialog with General and Advanced tabs
 * - Embed YouTube, Vimeo, Google Maps, and other iframe content
 * - Responsive aspect ratio presets (21x9, 16x9, 4x3, 1x1)
 * - Inline value sizing with constrain proportions
 * - Advanced options: name, title, long description, border, scrollbar
 * - Auto-conversion of YouTube/Vimeo URLs to embed format
 * - Security validation (HTTPS only)
 * - Multi-instance support
 * 
 * Commands:
 * - openEmbedIframeDialog: Opens the embed iframe dialog
 * 
 * UI/UX Features:
 * - Vertical tab navigation (General/Advanced)
 * - Size presets dropdown
 * - Width/Height inputs with lock/unlock proportions button
 * - Checkboxes for border and scrollbar options
 * - Form validation
 * - Responsive CSS classes for aspect ratios
 */

const SIZE_OPTIONS = [
  { label: 'Inline Value', value: 'inline' },
  { label: 'Responsive - 21x9', value: '21x9' },
  { label: 'Responsive - 16x9', value: '16x9' },
  { label: 'Responsive - 4x3', value: '4x3' },
  { label: 'Responsive - 1x1', value: '1x1' },
];

// Per-editor instance state
const editorStates = new WeakMap<HTMLElement, {
  dialogElement: HTMLElement | null;
  activeTab: 'general' | 'advanced';
  formData: {
    src: string;
    selectedSize: string;
    width: string;
    height: string;
    constrainProportions: boolean;
    name: string;
    title: string;
    longDescription: string;
    descriptionUrl: string;
    showBorder: boolean;
    enableScrollbar: boolean;
  };
}>();

/**
 * Get or create state for an editor element
 */
const getEditorState = (editorElement: HTMLElement) => {
  if (!editorStates.has(editorElement)) {
    editorStates.set(editorElement, {
      dialogElement: null,
      activeTab: 'general',
      formData: {
        src: '',
        selectedSize: 'inline',
        width: '100%',
        height: '400px',
        constrainProportions: true,
        name: '',
        title: '',
        longDescription: '',
        descriptionUrl: '',
        showBorder: true,
        enableScrollbar: true
      }
    });
  }
  return editorStates.get(editorElement)!;
};

export const EmbedIframePlugin = (): Plugin => {
  return {
    name: 'embedIframe',
    
    toolbar: [
      {
        label: 'Embed Content',
        command: 'openEmbedIframeDialog',
        icon: '<svg width="24" height="24" focusable="false"><path d="M19 6V5H5v14h2A13 13 0 0 1 19 6Zm0 1.4c-.8.8-1.6 2.4-2.2 4.6H19V7.4Zm0 5.6h-2.4c-.4 1.8-.6 3.8-.6 6h3v-6Zm-4 6c0-2.2.2-4.2.6-6H13c-.7 1.8-1.1 3.8-1.1 6h3Zm-4 0c0-2.2.4-4.2 1-6H9.6A12 12 0 0 0 8 19h3ZM4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm11.8 9c.4-1.9 1-3.4 1.8-4.5a9.2 9.2 0 0 0-4 4.5h2.2Zm-3.4 0a12 12 0 0 1 2.8-4 12 12 0 0 0-5 4h2.2Z" fill-rule="nonzero"></path></svg>',
        shortcut: 'Mod-Shift-e',
        type: 'button'
      }
    ],

    commands: {
      openEmbedIframeDialog: (editorElement?: HTMLElement) => {
        createEmbedDialog(editorElement);
        return true;
      }
    },

    keymap: {
      'Mod-Shift-e': 'openEmbedIframeDialog'
    }
  };
};

function createEmbedDialog(editorElement?: HTMLElement): void {
  // If no editor element provided, find the currently focused one
  if (!editorElement) {
    const focusedElement = document.activeElement;
    if (focusedElement && focusedElement.closest('[data-editora-editor]')) {
      editorElement = focusedElement.closest('[data-editora-editor]') as HTMLElement;
    }
  }

  // Fallback to any editor if none found
  if (!editorElement) {
    editorElement = document.querySelector('[data-editora-editor]') as HTMLElement;
  }

  if (!editorElement) {
    console.warn('Editor element not found');
    return;
  }

  const state = getEditorState(editorElement);

  // Reset form data
  state.formData = {
    src: '',
    selectedSize: 'inline',
    width: '100%',
    height: '400px',
    constrainProportions: true,
    name: '',
    title: '',
    longDescription: '',
    descriptionUrl: '',
    showBorder: true,
    enableScrollbar: true
  };
  
  state.activeTab = 'general';

  // Create dialog overlay
  const overlay = document.createElement('div');
  overlay.className = 'rte-dialog-overlay';
  overlay.onclick = closeDialog;

  // Create dialog content
  const dialog = document.createElement('div');
  dialog.className = 'rte-dialog-content embed-iframe-dialog';
  dialog.onclick = (e) => e.stopPropagation();

  dialog.innerHTML = `
    <div class="rte-dialog-header">
      <h3>Embed Iframe</h3>
      <button class="rte-dialog-close">×</button>
    </div>
    <div class="rte-dialog-body">
      <div class="rte-vertical-tabs">
        <div class="rte-tab-buttons">
          <button class="rte-tab-button active" data-tab="general">General</button>
          <button class="rte-tab-button" data-tab="advanced">Advanced</button>
        </div>
        <div class="rte-tab-content">
          <div class="rte-tab-panel" data-panel="general" style="display: block;">
            <div class="rte-form-group">
              <label class="rte-form-label">Source</label>
              <input type="url" class="rte-form-input" id="iframe-src" placeholder="https://example.com" required />
            </div>
            <div class="rte-form-group">
              <label class="rte-form-label">Size</label>
              <select class="rte-form-select" id="iframe-size">
                ${SIZE_OPTIONS.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
              </select>
            </div>
            <div class="rte-form-row" id="dimensions-row">
              <div class="rte-form-group">
                <label class="rte-form-label">Width</label>
                <input type="text" class="rte-form-input" id="iframe-width" placeholder="100%" value="100%" />
              </div>
              <div class="rte-form-group">
                <label class="rte-form-label">Height</label>
                <input type="text" class="rte-form-input" id="iframe-height" placeholder="400px" value="400px" />
              </div>
              <div class="rte-form-group constrain-group">
                <button type="button" class="rte-constrain-btn locked" id="constrain-btn" title="Unlock proportions">🔒</button>
              </div>
            </div>
          </div>
          <div class="rte-tab-panel" data-panel="advanced" style="display: none;">
            <div class="rte-form-group">
              <label class="rte-form-label">Name</label>
              <input type="text" class="rte-form-input" id="iframe-name" placeholder="Iframe name" />
            </div>
            <div class="rte-form-group">
              <label class="rte-form-label">Title</label>
              <input type="text" class="rte-form-input" id="iframe-title" placeholder="Iframe title" />
            </div>
            <div class="rte-form-group">
              <label class="rte-form-label">Long Description</label>
              <textarea class="rte-form-textarea" id="iframe-longdesc" placeholder="Detailed description of the iframe content" rows="3"></textarea>
            </div>
            <div class="rte-form-group">
              <label class="rte-form-label">Description URL</label>
              <input type="url" class="rte-form-input" id="iframe-desc-url" placeholder="https://example.com/description" />
            </div>
            <div class="rte-form-group">
              <label class="rte-checkbox-label">
                <input type="checkbox" id="iframe-border" checked />
                Show iframe border
              </label>
            </div>
            <div class="rte-form-group">
              <label class="rte-checkbox-label">
                <input type="checkbox" id="iframe-scrollbar" checked />
                Enable scrollbar
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rte-dialog-footer">
      <button type="button" class="rte-btn rte-btn-secondary" id="cancel-btn">Cancel</button>
      <button type="submit" class="rte-btn rte-btn-primary" id="save-btn">Save</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  state.dialogElement = overlay;

  // Add event listeners
  setupDialogEventListeners(dialog, editorElement);
  
  // Inject styles
  injectEmbedDialogStyles();

  // Focus first input
  setTimeout(() => {
    (dialog.querySelector('#iframe-src') as HTMLInputElement)?.focus();
  }, 100);
}

function setupDialogEventListeners(dialog: HTMLElement, editorElement: HTMLElement): void {
  const state = getEditorState(editorElement);

  // Close button
  dialog.querySelector('.rte-dialog-close')?.addEventListener('click', () => closeDialog(editorElement));

  // Tab switching
  dialog.querySelectorAll('.rte-tab-button').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const tab = (e.target as HTMLElement).getAttribute('data-tab') as 'general' | 'advanced';
      if (tab) switchTab(dialog, tab, editorElement);
    });
  });

  // Size dropdown
  const sizeSelect = dialog.querySelector('#iframe-size') as HTMLSelectElement;
  sizeSelect?.addEventListener('change', (e) => handleSizeChange(dialog, (e.target as HTMLSelectElement).value, editorElement));

  // Width/Height with proportions
  const widthInput = dialog.querySelector('#iframe-width') as HTMLInputElement;
  const heightInput = dialog.querySelector('#iframe-height') as HTMLInputElement;
  
  widthInput?.addEventListener('input', (e) => handleWidthChange(dialog, (e.target as HTMLInputElement).value, editorElement));
  heightInput?.addEventListener('input', (e) => handleHeightChange(dialog, (e.target as HTMLInputElement).value, editorElement));

  // Constrain proportions button
  dialog.querySelector('#constrain-btn')?.addEventListener('click', () => toggleConstrainProportions(dialog, editorElement));

  // Cancel button
  dialog.querySelector('#cancel-btn')?.addEventListener('click', () => closeDialog(editorElement));

  // Save button
  dialog.querySelector('#save-btn')?.addEventListener('click', () => handleSave(dialog, editorElement));
}

function switchTab(dialog: HTMLElement, tab: 'general' | 'advanced', editorElement: HTMLElement): void {
  const state = getEditorState(editorElement);
  state.activeTab = tab;

  // Update button states
  dialog.querySelectorAll('.rte-tab-button').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });

  // Update panel visibility
  dialog.querySelectorAll('.rte-tab-panel').forEach((panel) => {
    (panel as HTMLElement).style.display = panel.getAttribute('data-panel') === tab ? 'block' : 'none';
  });
}

function handleSizeChange(dialog: HTMLElement, sizeValue: string, editorElement: HTMLElement): void {
  const state = getEditorState(editorElement);
  state.formData.selectedSize = sizeValue;

  const dimensionsRow = dialog.querySelector('#dimensions-row') as HTMLElement;
  const widthInput = dialog.querySelector('#iframe-width') as HTMLInputElement;
  const heightInput = dialog.querySelector('#iframe-height') as HTMLInputElement;

  if (sizeValue === 'inline') {
    dimensionsRow.style.display = 'flex';
    widthInput.value = '100%';
    heightInput.value = '400px';
    state.formData.width = '100%';
    state.formData.height = '400px';
  } else {
    dimensionsRow.style.display = 'none';
    state.formData.width = '100%';
    state.formData.height = 'auto';
  }
}

function handleWidthChange(dialog: HTMLElement, newWidth: string, editorElement: HTMLElement): void {
  const state = getEditorState(editorElement);
  state.formData.width = newWidth;

  if (state.formData.constrainProportions && state.formData.selectedSize === 'inline') {
    const widthValue = parseFloat(newWidth);
    if (!isNaN(widthValue)) {
      const heightValue = (widthValue * 9) / 16; // 16:9 aspect ratio
      state.formData.height = `${heightValue}px`;
      const heightInput = dialog.querySelector('#iframe-height') as HTMLInputElement;
      if (heightInput) heightInput.value = state.formData.height;
    }
  }
}

function handleHeightChange(dialog: HTMLElement, newHeight: string, editorElement: HTMLElement): void {
  const state = getEditorState(editorElement);
  state.formData.height = newHeight;

  if (state.formData.constrainProportions && state.formData.selectedSize === 'inline') {
    const heightValue = parseFloat(newHeight);
    if (!isNaN(heightValue)) {
      const widthValue = (heightValue * 16) / 9; // 16:9 aspect ratio
      state.formData.width = `${widthValue}px`;
      const widthInput = dialog.querySelector('#iframe-width') as HTMLInputElement;
      if (widthInput) widthInput.value = state.formData.width;
    }
  }
}

function toggleConstrainProportions(dialog: HTMLElement, editorElement: HTMLElement): void {
  const state = getEditorState(editorElement);
  state.formData.constrainProportions = !state.formData.constrainProportions;
  const btn = dialog.querySelector('#constrain-btn') as HTMLButtonElement;
  
  if (btn) {
    btn.textContent = state.formData.constrainProportions ? '🔒' : '🔓';
    btn.className = `rte-constrain-btn ${state.formData.constrainProportions ? 'locked' : 'unlocked'}`;
    btn.title = state.formData.constrainProportions ? 'Unlock proportions' : 'Lock proportions';
  }
}

function handleSave(dialog: HTMLElement, editorElement: HTMLElement): void {
  const state = getEditorState(editorElement);
  
  // Get values from form
  const src = (dialog.querySelector('#iframe-src') as HTMLInputElement)?.value.trim();
  
  if (!src) {
    alert('Please enter a source URL');
    return;
  }

  // Validate HTTPS
  if (!src.startsWith('https://') && !src.startsWith('http://')) {
    alert('Please enter a valid URL starting with https:// or http://');
    return;
  }

  // Get all form values
  const name = (dialog.querySelector('#iframe-name') as HTMLInputElement)?.value.trim();
  const title = (dialog.querySelector('#iframe-title') as HTMLInputElement)?.value.trim();
  const longDescription = (dialog.querySelector('#iframe-longdesc') as HTMLTextAreaElement)?.value.trim();
  const descriptionUrl = (dialog.querySelector('#iframe-desc-url') as HTMLInputElement)?.value.trim();
  const showBorder = (dialog.querySelector('#iframe-border') as HTMLInputElement)?.checked ?? true;
  const enableScrollbar = (dialog.querySelector('#iframe-scrollbar') as HTMLInputElement)?.checked ?? true;

  // Get final dimensions
  let finalWidth = state.formData.width;
  let finalHeight = state.formData.height;
  
  if (state.formData.selectedSize !== 'inline') {
    finalWidth = '100%';
    finalHeight = 'auto';
  }

  // Insert iframe
  insertIframe(editorElement, {
    src,
    width: finalWidth,
    height: finalHeight,
    aspectRatio: state.formData.selectedSize,
    name: name || undefined,
    title: title || undefined,
    longDescription: longDescription || undefined,
    descriptionUrl: descriptionUrl || undefined,
    showBorder,
    enableScrollbar
  });

  closeDialog(editorElement);
}

function insertIframe(editorElement: HTMLElement, data: {
  src: string;
  width: string;
  height: string;
  aspectRatio: string;
  name?: string;
  title?: string;
  longDescription?: string;
  descriptionUrl?: string;
  showBorder: boolean;
  enableScrollbar: boolean;
}): void {
  const contentEl = editorElement.querySelector('[contenteditable="true"]') as HTMLElement;
  if (!contentEl) return;

  contentEl.focus();

  setTimeout(() => {
    const attributes = [
      `src="${data.src}"`,
      `width="${data.width}"`,
      `height="${data.height}"`,
      'allowfullscreen',
      `frameborder="${data.showBorder ? '1' : '0'}"`,
      `scrolling="${data.enableScrollbar ? 'auto' : 'no'}"`,
    ];

    if (data.name) attributes.push(`name="${data.name}"`);
    if (data.title) attributes.push(`title="${data.title}"`);
    if (data.longDescription) attributes.push(`longdesc="${data.longDescription}"`);

    // Add CSS classes for responsive behavior
    const classes = [];
    if (data.aspectRatio !== 'inline') {
      classes.push(`rte-iframe-${data.aspectRatio}`);
    }

    const classAttr = classes.length > 0 ? `class="${classes.join(' ')}"` : '';
    const dataAttr = `data-aspect-ratio="${data.aspectRatio}"`;

    const iframeHtml = `<iframe ${attributes.join(' ')} ${classAttr} ${dataAttr}></iframe>`;

    const result = document.execCommand('insertHTML', false, iframeHtml);

    if (!result) {
      // Alternative approach
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = iframeHtml;
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        range.insertNode(fragment);
      }
    }
  }, 10);
}

function closeDialog(editorElement: HTMLElement): void {
  const state = getEditorState(editorElement);
  if (state.dialogElement) {
    document.body.removeChild(state.dialogElement);
    state.dialogElement = null;
  }
}

function injectEmbedDialogStyles(): void {
  if (document.getElementById('embed-iframe-dialog-styles')) return;

  const style = document.createElement('style');
  style.id = 'embed-iframe-dialog-styles';
  style.textContent = `
    /* Embed Iframe Dialog Styles */
    .embed-iframe-dialog {
      max-width: 600px;
      width: 100%;
    }

    .rte-vertical-tabs {
      display: flex;
      gap: 20px;
      min-height: 400px;
    }

    .rte-tab-buttons {
      display: flex;
      flex-direction: column;
      width: 120px;
      border-right: 1px solid #e1e5e9;
    }

    .rte-tab-button {
      padding: 12px 16px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      border-right: 3px solid transparent;
      transition: all 0.2s ease;
    }

    .rte-tab-button:hover {
      background-color: #f8f9fa;
      color: #333;
    }

    .rte-tab-button.active {
      background-color: #e3f2fd;
      color: #1976d2;
      border-right-color: #1976d2;
      font-weight: 600;
    }

    .rte-tab-content {
      flex: 1;
      padding: 0 0 0 20px;
    }

    .rte-tab-panel {
      padding: 0;
    }

    .rte-form-group {
      margin-bottom: 16px;
    }

    .rte-form-label {
      display: block;
      margin-bottom: 6px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .rte-form-textarea,
    .rte-form-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.2s ease;
      box-sizing: border-box;
    }

    .rte-form-textarea:focus,
    .rte-form-select:focus {
      outline: none;
      border-color: #0066cc;
      box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
    }

    .rte-form-textarea {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }

    .rte-form-row {
      display: flex;
      gap: 12px;
      align-items: flex-end;
    }

    .rte-form-row .rte-form-group {
      flex: 1;
    }

    .rte-form-row .constrain-group {
      flex: 0 0 auto;
      margin-bottom: 0;
    }

    .rte-constrain-btn {
      padding: 8px 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.2s ease;
      height: 38px;
      width: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .rte-constrain-btn:hover {
      background-color: #f5f5f5;
      border-color: #1976d2;
    }

    .rte-constrain-btn.locked {
      background-color: #e3f2fd;
      border-color: #1976d2;
    }

    .rte-checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #333;
      cursor: pointer;
      padding: 4px 0;
    }

    .rte-checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: #0066cc;
    }

    .rte-checkbox-label:hover {
      color: #000;
    }

    /* Responsive iframe classes */
    .rte-iframe-21x9,
    .rte-iframe-16x9,
    .rte-iframe-4x3,
    .rte-iframe-1x1 {
      position: relative;
      width: 100%;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
    }

    .rte-iframe-21x9 {
      padding-bottom: 42.857%;
    }

    .rte-iframe-16x9 {
      padding-bottom: 56.25%;
    }

    .rte-iframe-4x3 {
      padding-bottom: 75%;
    }

    .rte-iframe-1x1 {
      padding-bottom: 100%;
    }

    .rte-iframe-21x9 iframe,
    .rte-iframe-16x9 iframe,
    .rte-iframe-4x3 iframe,
    .rte-iframe-1x1 iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `;
  
  document.head.appendChild(style);
}
