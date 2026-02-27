import { Plugin } from '@editora/core';

/**
 * Media Manager Plugin - Native Implementation
 * 
 * Features:
 * - Insert images and videos with full dialog UI
 * - Drag & drop file upload
 * - URL input with dimensions
 * - Inline resize handles (drag corners to resize)
 * - Floating toolbar on image selection
 * - Link images
 */

let savedSelection: Range | null = null;
let selectedMedia: HTMLImageElement | HTMLVideoElement | null = null;
let floatingToolbar: HTMLDivElement | null = null;
let resizeHandles: HTMLDivElement[] = [];
let isResizing = false;
let currentHandle: string | null = null;
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let aspectRatio = 1;
let editorElement: HTMLElement | null = null; // Editor instance context

declare global {
  interface Window {
    __mediaManagerInitialized?: boolean;
  }
}

const DARK_THEME_SELECTOR = '[data-theme="dark"], .dark, .editora-theme-dark';

const injectMediaDialogStyles = (): void => {
  if (typeof document === 'undefined' || document.getElementById('rte-media-dialog-styles')) return;

  const style = document.createElement('style');
  style.id = 'rte-media-dialog-styles';
  style.textContent = `
    .rte-media-overlay {
      --rte-media-overlay-bg: rgba(15, 23, 36, 0.56);
      --rte-media-bg: #ffffff;
      --rte-media-text: #101828;
      --rte-media-muted: #5f6b7d;
      --rte-media-border: #d6dbe4;
      --rte-media-surface: #f7f9fc;
      --rte-media-surface-hover: #eef2f7;
      --rte-media-accent: #1f75fe;
      --rte-media-accent-hover: #165fd6;
      --rte-media-danger: #dc3545;
      --rte-media-danger-hover: #b92735;
      --rte-media-ring: rgba(31, 117, 254, 0.18);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--rte-media-overlay-bg);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 16px;
      box-sizing: border-box;
    }

    .rte-media-overlay.rte-ui-theme-dark {
      --rte-media-overlay-bg: rgba(2, 8, 20, 0.72);
      --rte-media-bg: #202938;
      --rte-media-text: #e8effc;
      --rte-media-muted: #a5b1c5;
      --rte-media-border: #49566c;
      --rte-media-surface: #2a3444;
      --rte-media-surface-hover: #344256;
      --rte-media-accent: #58a6ff;
      --rte-media-accent-hover: #4598f4;
      --rte-media-danger: #ff7b72;
      --rte-media-danger-hover: #ff645b;
      --rte-media-ring: rgba(88, 166, 255, 0.22);
    }

    .rte-media-dialog {
      width: min(92vw, 640px);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: var(--rte-media-bg);
      color: var(--rte-media-text);
      border: 1px solid var(--rte-media-border);
      border-radius: 12px;
      box-shadow: 0 24px 48px rgba(10, 15, 24, 0.28);
    }

    .rte-media-dialog.rte-media-dialog-compact {
      width: min(92vw, 520px);
    }

    .rte-media-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--rte-media-border);
      background: linear-gradient(180deg, rgba(127, 154, 195, 0.08) 0%, rgba(127, 154, 195, 0) 100%);
    }

    .rte-media-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--rte-media-text);
    }

    .rte-media-close-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: transparent;
      color: var(--rte-media-muted);
      font-size: 24px;
      line-height: 1;
      cursor: pointer;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .rte-media-close-btn:hover {
      background: var(--rte-media-surface-hover);
      color: var(--rte-media-text);
    }

    .rte-media-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid var(--rte-media-border);
      gap: 0;
    }

    .rte-media-tab {
      border: none;
      border-right: 1px solid var(--rte-media-border);
      padding: 12px 14px;
      background: var(--rte-media-surface);
      color: var(--rte-media-muted);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.16s ease, color 0.16s ease;
    }

    .rte-media-tab:last-child {
      border-right: none;
    }

    .rte-media-tab:hover {
      background: var(--rte-media-surface-hover);
      color: var(--rte-media-text);
    }

    .rte-media-tab.active {
      background: var(--rte-media-accent);
      color: #fff;
    }

    .rte-media-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    .rte-media-field {
      margin-bottom: 16px;
    }

    .rte-media-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }

    .rte-media-label {
      display: block;
      margin-bottom: 8px;
      color: var(--rte-media-text);
      font-size: 14px;
      font-weight: 600;
    }

    .rte-media-input,
    .rte-media-textarea {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px;
      border: 1px solid var(--rte-media-border);
      border-radius: 8px;
      background: var(--rte-media-surface);
      color: var(--rte-media-text);
      font-size: 14px;
      transition: border-color 0.16s ease, box-shadow 0.16s ease;
    }

    .rte-media-input::placeholder,
    .rte-media-textarea::placeholder {
      color: var(--rte-media-muted);
    }

    .rte-media-input:focus,
    .rte-media-textarea:focus {
      outline: none;
      border-color: var(--rte-media-accent);
      box-shadow: 0 0 0 3px var(--rte-media-ring);
    }

    .rte-media-textarea {
      min-height: 92px;
      resize: vertical;
      font-family: inherit;
    }

    .rte-media-dropzone {
      border: 2px dashed var(--rte-media-border);
      border-radius: 12px;
      padding: 36px 18px;
      text-align: center;
      cursor: pointer;
      background: var(--rte-media-surface);
      transition: border-color 0.16s ease, background-color 0.16s ease;
    }

    .rte-media-dropzone:hover,
    .rte-media-dropzone.is-dragover {
      border-color: var(--rte-media-accent);
      background: var(--rte-media-surface-hover);
    }

    .rte-media-dropzone-icon {
      font-size: 40px;
      margin-bottom: 10px;
      line-height: 1;
    }

    .rte-media-dropzone-title {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--rte-media-text);
    }

    .rte-media-muted {
      margin: 0 0 8px 0;
      color: var(--rte-media-muted);
      font-size: 14px;
    }

    .rte-media-hint {
      margin: 0;
      color: var(--rte-media-muted);
      font-size: 12px;
    }

    .rte-media-progress {
      margin-top: 16px;
    }

    .rte-media-progress-track {
      height: 8px;
      border-radius: 999px;
      background: var(--rte-media-surface);
      overflow: hidden;
      border: 1px solid var(--rte-media-border);
    }

    .rte-media-progress-bar {
      height: 100%;
      width: 0;
      background: var(--rte-media-accent);
      transition: width 0.3s ease;
    }

    .rte-media-progress-text {
      margin-top: 8px;
      text-align: center;
      color: var(--rte-media-muted);
      font-size: 13px;
    }

    .rte-media-preview {
      border: 1px solid var(--rte-media-border);
      border-radius: 10px;
      padding: 10px;
      text-align: center;
      background: var(--rte-media-surface);
    }

    .rte-media-preview img,
    .rte-media-preview video {
      max-width: 100%;
      max-height: 240px;
    }

    .rte-media-helper {
      margin-top: 8px;
      margin-bottom: 0;
      font-size: 12px;
      color: var(--rte-media-muted);
      line-height: 1.5;
    }

    .rte-media-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      padding: 16px 20px;
      border-top: 1px solid var(--rte-media-border);
      background: var(--rte-media-surface);
    }

    .rte-media-footer.rte-media-footer-spread {
      justify-content: space-between;
      align-items: center;
    }

    .rte-media-btn {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease;
    }

    .rte-media-btn-secondary {
      background: var(--rte-media-bg);
      border-color: var(--rte-media-border);
      color: var(--rte-media-text);
    }

    .rte-media-btn-secondary:hover {
      background: var(--rte-media-surface-hover);
    }

    .rte-media-btn-primary {
      background: var(--rte-media-accent);
      color: #fff;
    }

    .rte-media-btn-primary:hover {
      background: var(--rte-media-accent-hover);
    }

    .rte-media-btn-primary:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .rte-media-btn-danger {
      background: var(--rte-media-danger);
      color: #fff;
    }

    .rte-media-btn-danger:hover {
      background: var(--rte-media-danger-hover);
    }

    .rte-media-checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--rte-media-text);
      font-size: 14px;
      cursor: pointer;
    }

    .rte-media-checkbox-label input {
      accent-color: var(--rte-media-accent);
    }

    .rte-media-actions {
      display: flex;
      gap: 10px;
    }

    .rte-media-spacer {
      flex: 1;
    }

    .media-floating-toolbar {
      --rte-media-toolbar-bg: #ffffff;
      --rte-media-toolbar-border: #d6dbe4;
      --rte-media-toolbar-text: #344054;
      --rte-media-toolbar-hover-bg: #f3f6fb;
      --rte-media-toolbar-hover-text: #101828;
      --rte-media-toolbar-active-bg: #e6edf7;
      --rte-media-toolbar-separator: #d9e1eb;
      --rte-media-toolbar-danger-hover-bg: #fee2e2;
      --rte-media-toolbar-danger-hover-text: #b42318;
      position: absolute;
      display: none;
      align-items: center;
      gap: 2px;
      padding: 4px;
      border: 1px solid var(--rte-media-toolbar-border);
      border-radius: 8px;
      background: var(--rte-media-toolbar-bg);
      color: var(--rte-media-toolbar-text);
      box-shadow: 0 10px 24px rgba(15, 23, 36, 0.18);
      z-index: 10000;
      pointer-events: auto;
      backdrop-filter: blur(6px);
    }

    .media-floating-toolbar.rte-ui-theme-dark,
    ${DARK_THEME_SELECTOR} .media-floating-toolbar {
      --rte-media-toolbar-bg: #24303f;
      --rte-media-toolbar-border: #4a5a71;
      --rte-media-toolbar-text: #d9e6fb;
      --rte-media-toolbar-hover-bg: #33445a;
      --rte-media-toolbar-hover-text: #f4f8ff;
      --rte-media-toolbar-active-bg: #415875;
      --rte-media-toolbar-separator: #566884;
      --rte-media-toolbar-danger-hover-bg: #5f2a32;
      --rte-media-toolbar-danger-hover-text: #ffd7d5;
      box-shadow: 0 16px 30px rgba(2, 8, 20, 0.42);
    }

    .media-floating-toolbar-btn {
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: inherit;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.16s ease, color 0.16s ease, transform 0.12s ease;
    }

    .media-floating-toolbar-btn:hover {
      background: var(--rte-media-toolbar-hover-bg);
      color: var(--rte-media-toolbar-hover-text);
    }

    .media-floating-toolbar-btn:active {
      background: var(--rte-media-toolbar-active-bg);
      transform: scale(0.96);
    }

    .media-floating-toolbar-btn.btn-remove:hover {
      background: var(--rte-media-toolbar-danger-hover-bg);
      color: var(--rte-media-toolbar-danger-hover-text);
    }

    .media-floating-toolbar-separator {
      width: 1px;
      height: 20px;
      margin: 0 2px;
      background: var(--rte-media-toolbar-separator);
    }
  `;

  document.head.appendChild(style);
};

const getSelectionEditor = (): HTMLElement | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const anchor = selection.anchorNode;
  const anchorElement = anchor instanceof HTMLElement ? anchor : anchor?.parentElement;
  return (anchorElement?.closest('.rte-content, .editora-content') as HTMLElement | null) || null;
};

const resolveDialogContext = (contextElement?: HTMLElement | null): HTMLElement | null => {
  if (contextElement) return contextElement;
  const fromSelection = getSelectionEditor();
  if (fromSelection) return fromSelection;
  if (editorElement) return editorElement;
  const active = document.activeElement as HTMLElement | null;
  if (!active) return null;
  return (active.closest('.rte-content, .editora-content') as HTMLElement | null) || active;
};

const isDarkThemeContext = (contextElement?: HTMLElement | null): boolean => {
  const source = resolveDialogContext(contextElement);
  if (!source) return false;
  return Boolean(source.closest(DARK_THEME_SELECTOR));
};

const createDialogOverlay = (contextElement?: HTMLElement | null): HTMLDivElement => {
  injectMediaDialogStyles();
  const overlay = document.createElement('div');
  overlay.className = 'rte-media-overlay';
  if (isDarkThemeContext(contextElement)) {
    overlay.classList.add('rte-ui-theme-dark');
  }
  return overlay;
};

const createDialogShell = (compact = false): HTMLDivElement => {
  const dialog = document.createElement('div');
  dialog.className = compact ? 'rte-media-dialog rte-media-dialog-compact' : 'rte-media-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  return dialog;
};

const showMediaDialog = (type: 'image' | 'video', contextElement?: HTMLElement | null) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    savedSelection = selection.getRangeAt(0).cloneRange();
  }

  const overlay = createDialogOverlay(contextElement);
  const dialog = createDialogShell();

  let activeTab: 'upload' | 'url' = 'upload';
  let urlValue = '';
  let widthValue = '';
  let heightValue = '';
  let altValue = '';

  const renderDialog = () => {
    dialog.innerHTML = `
      <div class="rte-media-header">
        <h2 class="rte-media-title">Insert ${type === 'image' ? 'Image' : 'Video'}</h2>
        <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
      </div>

      <div class="rte-media-tabs">
        <button class="tab-upload rte-media-tab ${activeTab === 'upload' ? 'active' : ''}" type="button">Upload</button>
        <button class="tab-url rte-media-tab ${activeTab === 'url' ? 'active' : ''}" type="button">URL</button>
      </div>

      <div class="rte-media-body">
        ${activeTab === 'upload' ? `
          <div id="upload-section">
            <div class="dropzone rte-media-dropzone">
              <div class="rte-media-dropzone-icon">📁</div>
              <p class="rte-media-dropzone-title">Drag and drop your ${type} here</p>
              <p class="rte-media-muted">or click to browse</p>
              <p class="rte-media-hint">Max file size: 50MB</p>
            </div>
            <input type="file" id="file-input" accept="${type === 'image' ? 'image/*' : 'video/*'}" style="display: none;">
            <div id="upload-progress" class="rte-media-progress" style="display: none;">
              <div class="rte-media-progress-track">
                <div id="progress-bar" class="rte-media-progress-bar"></div>
              </div>
              <p id="progress-text" class="rte-media-progress-text">Uploading...</p>
            </div>
          </div>
        ` : `
          <div id="url-section">
            <div class="rte-media-field">
              <label class="rte-media-label">URL</label>
              <input type="text" id="url-input" class="rte-media-input" placeholder="https://example.com/${type}.${type === 'image' ? 'jpg' : 'mp4'}" value="${urlValue}">
            </div>
            ${type === 'image' ? `
              <div class="rte-media-field">
                <label class="rte-media-label">Alt Text (for accessibility)</label>
                <input type="text" id="alt-input" class="rte-media-input" placeholder="Describe the image" value="${altValue}">
              </div>
            ` : ''}
            <div class="rte-media-grid">
              <div class="rte-media-field">
                <label class="rte-media-label">Width (px)</label>
                <input type="number" id="width-input" class="rte-media-input" placeholder="Auto" value="${widthValue}">
              </div>
              <div class="rte-media-field">
                <label class="rte-media-label">Height (px)</label>
                <input type="number" id="height-input" class="rte-media-input" placeholder="Auto" value="${heightValue}">
              </div>
            </div>
            ${urlValue ? `
              <div class="rte-media-field">
                <label class="rte-media-label">Preview</label>
                <div class="rte-media-preview">
                  ${type === 'image' ? `<img src="${urlValue}" alt="Preview">` : `<video src="${urlValue}" controls></video>`}
                </div>
              </div>
            ` : ''}
          </div>
        `}
      </div>

      <div class="rte-media-footer">
        <button class="cancel-btn rte-media-btn rte-media-btn-secondary" type="button">Cancel</button>
        <button id="insert-btn" class="rte-media-btn rte-media-btn-primary" type="button" ${!urlValue && activeTab === 'url' ? 'disabled' : ''}>Insert</button>
      </div>
    `;
  };

  renderDialog();
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const closeDialog = () => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };

  const insertMedia = () => {
    if (!urlValue) return;

    const mediaEl = type === 'image' ? document.createElement('img') : document.createElement('video');
    mediaEl.src = urlValue;
    mediaEl.setAttribute('data-media-type', type);

    if (type === 'image' && altValue) {
      (mediaEl as HTMLImageElement).alt = altValue;
    }
    if (widthValue) {
      mediaEl.style.width = `${widthValue}px`;
      mediaEl.setAttribute('width', widthValue);
    }
    if (heightValue) {
      mediaEl.style.height = `${heightValue}px`;
      mediaEl.setAttribute('height', heightValue);
    }

    if (type === 'video') {
      (mediaEl as HTMLVideoElement).controls = true;
    }

    if (!widthValue && !heightValue) {
      mediaEl.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 1em 0; cursor: pointer;';
    } else {
      mediaEl.style.cssText = `display: block; margin: 1em 0; cursor: pointer; ${widthValue ? `width: ${widthValue}px;` : 'max-width: 100%;'} ${heightValue ? `height: ${heightValue}px;` : 'height: auto;'}`;
    }

    if (savedSelection) {
      savedSelection.deleteContents();
      savedSelection.insertNode(mediaEl);
    }

    closeDialog();
  };

  const handleFileUpload = async (file: File) => {
    const progressDiv = dialog.querySelector('#upload-progress') as HTMLDivElement;
    const progressBar = dialog.querySelector('#progress-bar') as HTMLDivElement;
    const progressText = dialog.querySelector('#progress-text') as HTMLParagraphElement;

    if (progressDiv && progressBar && progressText) {
      progressDiv.style.display = 'block';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        progressBar.style.width = `${progress}%`;
      }, 200);

      try {
        const reader = new FileReader();
        reader.onload = () => {
          clearInterval(interval);
          progressBar.style.width = '100%';
          progressText.textContent = 'Upload complete';

          setTimeout(() => {
            urlValue = reader.result as string;
            activeTab = 'url';
            renderDialog();
            attachEventHandlers();
          }, 500);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        clearInterval(interval);
        progressText.textContent = 'Upload failed';
      }
    }
  };

  const attachEventHandlers = () => {
    const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
    const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
    const insertBtn = dialog.querySelector('#insert-btn') as HTMLButtonElement;
    const tabUpload = dialog.querySelector('.tab-upload') as HTMLButtonElement;
    const tabUrl = dialog.querySelector('.tab-url') as HTMLButtonElement;

    closeBtn?.addEventListener('click', closeDialog);
    cancelBtn?.addEventListener('click', closeDialog);
    insertBtn?.addEventListener('click', insertMedia);

    tabUpload?.addEventListener('click', () => {
      activeTab = 'upload';
      renderDialog();
      attachEventHandlers();
    });

    tabUrl?.addEventListener('click', () => {
      activeTab = 'url';
      renderDialog();
      attachEventHandlers();
    });

    if (activeTab === 'upload') {
      const dropzone = dialog.querySelector('.dropzone') as HTMLDivElement;
      const fileInput = dialog.querySelector('#file-input') as HTMLInputElement;

      dropzone?.addEventListener('click', () => fileInput?.click());

      dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('is-dragover');
      });

      dropzone?.addEventListener('dragleave', () => {
        dropzone.classList.remove('is-dragover');
      });

      dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('is-dragover');
        const file = e.dataTransfer?.files[0];
        if (file) handleFileUpload(file);
      });

      fileInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFileUpload(file);
      });
    }

    if (activeTab === 'url') {
      const urlInput = dialog.querySelector('#url-input') as HTMLInputElement;
      const altInput = dialog.querySelector('#alt-input') as HTMLInputElement;
      const widthInput = dialog.querySelector('#width-input') as HTMLInputElement;
      const heightInput = dialog.querySelector('#height-input') as HTMLInputElement;

      urlInput?.addEventListener('input', () => {
        urlValue = urlInput.value;
        renderDialog();
        attachEventHandlers();
      });

      altInput?.addEventListener('input', () => {
        altValue = altInput.value;
      });

      widthInput?.addEventListener('input', () => {
        widthValue = widthInput.value;
      });

      heightInput?.addEventListener('input', () => {
        heightValue = heightInput.value;
      });
    }
  };

  attachEventHandlers();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
};

// Create resize handles
const createResizeHandles = () => {
  const positions = ['nw', 'ne', 'sw', 'se'];
  positions.forEach(pos => {
    const handle = document.createElement('div');
    handle.className = `media-resize-handle-${pos}`;
    handle.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: #007bff;
      border: 2px solid white;
      border-radius: 50%;
      cursor: ${pos}-resize;
      z-index: 10001;
      display: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    `;
    handle.setAttribute('data-position', pos);
    document.body.appendChild(handle);
    resizeHandles.push(handle);
  });
};

// Update resize handle positions
const updateResizeHandles = () => {
  if (!selectedMedia) {
    resizeHandles.forEach(h => h.style.display = 'none');
    return;
  }

  const rect = selectedMedia.getBoundingClientRect();
  const positions = {
    nw: { x: rect.left - 5, y: rect.top - 5 },
    ne: { x: rect.right - 5, y: rect.top - 5 },
    sw: { x: rect.left - 5, y: rect.bottom - 5 },
    se: { x: rect.right - 5, y: rect.bottom - 5 }
  };

  resizeHandles.forEach(handle => {
    const pos = handle.getAttribute('data-position') as keyof typeof positions;
    const coord = positions[pos];
    handle.style.left = `${coord.x}px`;
    handle.style.top = `${coord.y}px`;
    handle.style.display = 'block';
  });
};

// Show Alt Text dialog
const showAltTextDialog = (img: HTMLImageElement) => {
  const overlay = createDialogOverlay(img);
  const dialog = createDialogShell(true);

  dialog.innerHTML = `
    <div class="rte-media-header">
      <h2 class="rte-media-title">Edit Alt Text</h2>
      <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
    </div>
    <div class="rte-media-body">
      <label class="rte-media-label">Alternative Text (for accessibility)</label>
      <textarea id="alt-text-input" class="rte-media-textarea" placeholder="Describe the image for screen readers...">${img.alt || ''}</textarea>
      <p class="rte-media-helper">Good alt text is descriptive and concise. It helps users with visual impairments understand your content.</p>
    </div>
    <div class="rte-media-footer">
      <button class="cancel-btn rte-media-btn rte-media-btn-secondary" type="button">Cancel</button>
      <button class="save-btn rte-media-btn rte-media-btn-primary" type="button">Save</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const input = dialog.querySelector('#alt-text-input') as HTMLTextAreaElement;
  const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
  const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
  const saveBtn = dialog.querySelector('.save-btn') as HTMLButtonElement;

  const closeDialog = () => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };

  closeBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

  saveBtn.addEventListener('click', () => {
    img.alt = input.value;
    closeDialog();
  });

  input.focus();
  input.select();
};

// Show Link dialog for media
const showLinkDialogForMedia = (media: HTMLImageElement | HTMLVideoElement) => {
  const existingLink = (media as HTMLElement).closest('a');
  const currentHref = existingLink?.getAttribute('href') || '';
  const currentTarget = existingLink?.getAttribute('target') || '_self';
  const currentTitle = existingLink?.getAttribute('title') || '';

  const overlay = createDialogOverlay(media);
  const dialog = createDialogShell(true);

  dialog.innerHTML = `
    <div class="rte-media-header">
      <h2 class="rte-media-title">${existingLink ? 'Edit Link' : 'Add Link'}</h2>
      <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
    </div>
    <div class="rte-media-body">
      <div class="rte-media-field">
        <label class="rte-media-label">URL</label>
        <input id="link-url" type="url" class="rte-media-input" value="${currentHref}" placeholder="https://example.com" />
      </div>
      <div class="rte-media-field">
        <label class="rte-media-label">Title (tooltip)</label>
        <input id="link-title" type="text" class="rte-media-input" value="${currentTitle}" placeholder="Optional tooltip text" />
      </div>
      <label class="rte-media-checkbox-label">
        <input id="link-target" type="checkbox" ${currentTarget === '_blank' ? 'checked' : ''} />
        Open in new window/tab
      </label>
    </div>
    <div class="rte-media-footer rte-media-footer-spread">
      ${existingLink
        ? '<button class="remove-link-btn rte-media-btn rte-media-btn-danger" type="button">Remove Link</button>'
        : '<span class="rte-media-spacer"></span>'}
      <div class="rte-media-actions">
        <button class="cancel-btn rte-media-btn rte-media-btn-secondary" type="button">Cancel</button>
        <button class="save-btn rte-media-btn rte-media-btn-primary" type="button">Save</button>
      </div>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const urlInput = dialog.querySelector('#link-url') as HTMLInputElement;
  const titleInput = dialog.querySelector('#link-title') as HTMLInputElement;
  const targetCheckbox = dialog.querySelector('#link-target') as HTMLInputElement;
  const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
  const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
  const saveBtn = dialog.querySelector('.save-btn') as HTMLButtonElement;
  const removeLinkBtn = dialog.querySelector('.remove-link-btn') as HTMLButtonElement;

  const closeDialog = () => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };

  closeBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

  saveBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
      const normalized = url.startsWith('http') ? url : `https://${url}`;
      
      if (existingLink) {
        existingLink.setAttribute('href', normalized);
        existingLink.setAttribute('target', targetCheckbox.checked ? '_blank' : '_self');
        if (targetCheckbox.checked) {
          existingLink.setAttribute('rel', 'noopener noreferrer');
        } else {
          existingLink.removeAttribute('rel');
        }
        if (titleInput.value.trim()) {
          existingLink.setAttribute('title', titleInput.value.trim());
        } else {
          existingLink.removeAttribute('title');
        }
      } else {
        const link = document.createElement('a');
        link.href = normalized;
        link.target = targetCheckbox.checked ? '_blank' : '_self';
        if (targetCheckbox.checked) {
          link.rel = 'noopener noreferrer';
        }
        if (titleInput.value.trim()) {
          link.title = titleInput.value.trim();
        }
        media.replaceWith(link);
        link.appendChild(media);
      }
      
      closeDialog();
      
      // Update toolbar to reflect link state
      if (floatingToolbar && selectedMedia) {
        showFloatingToolbar(selectedMedia);
      }
    }
  });

  removeLinkBtn?.addEventListener('click', () => {
    if (existingLink && confirm('Remove link from this media?')) {
      existingLink.replaceWith(media);
      closeDialog();
      
      // Update toolbar
      if (floatingToolbar && selectedMedia) {
        showFloatingToolbar(selectedMedia);
      }
    }
  });

  urlInput.focus();
};

// Show Replace Image dialog
const showReplaceImageDialog = (img: HTMLImageElement) => {
  const overlay = createDialogOverlay(img);
  const dialog = createDialogShell();

  let activeTab: 'upload' | 'url' = 'url';
  let urlValue = img.src;

  const renderDialog = () => {
    dialog.innerHTML = `
      <div class="rte-media-header">
        <h2 class="rte-media-title">Replace Image</h2>
        <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
      </div>

      <div class="rte-media-tabs">
        <button class="tab-upload rte-media-tab ${activeTab === 'upload' ? 'active' : ''}" type="button">Upload</button>
        <button class="tab-url rte-media-tab ${activeTab === 'url' ? 'active' : ''}" type="button">URL</button>
      </div>

      <div class="rte-media-body">
        ${activeTab === 'upload' ? `
          <div id="upload-section">
            <div class="dropzone rte-media-dropzone">
              <div class="rte-media-dropzone-icon">📁</div>
              <p class="rte-media-dropzone-title">Drag and drop your image here</p>
              <p class="rte-media-muted">or click to browse</p>
            </div>
            <input type="file" id="file-input" accept="image/*" style="display: none;">
            <div id="upload-progress" class="rte-media-progress" style="display: none;">
              <div class="rte-media-progress-track">
                <div id="progress-bar" class="rte-media-progress-bar"></div>
              </div>
              <p id="progress-text" class="rte-media-progress-text">Uploading...</p>
            </div>
          </div>
        ` : `
          <div id="url-section">
            <div class="rte-media-field">
              <label class="rte-media-label">Image URL</label>
              <input type="text" id="url-input" class="rte-media-input" placeholder="https://example.com/image.jpg" value="${urlValue}">
            </div>
            ${urlValue ? `
              <div class="rte-media-field">
                <label class="rte-media-label">Preview</label>
                <div class="rte-media-preview">
                  <img src="${urlValue}" alt="Preview" onerror="this.parentElement.innerHTML='<p class=&quot;rte-media-muted&quot;>Failed to load image</p>'">
                </div>
              </div>
            ` : ''}
          </div>
        `}
      </div>

      <div class="rte-media-footer">
        <button class="cancel-btn rte-media-btn rte-media-btn-secondary" type="button">Cancel</button>
        <button id="replace-btn" class="rte-media-btn rte-media-btn-primary" type="button" ${!urlValue && activeTab === 'url' ? 'disabled' : ''}>Replace</button>
      </div>
    `;
  };

  renderDialog();
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const closeDialog = () => {
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };

  const replaceImage = () => {
    if (urlValue) {
      img.src = urlValue;
      closeDialog();
    }
  };

  const handleFileUpload = async (file: File) => {
    const progressDiv = dialog.querySelector('#upload-progress') as HTMLDivElement;
    const progressBar = dialog.querySelector('#progress-bar') as HTMLDivElement;
    const progressText = dialog.querySelector('#progress-text') as HTMLParagraphElement;

    if (progressDiv && progressBar && progressText) {
      progressDiv.style.display = 'block';

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 90) progress = 90;
        progressBar.style.width = `${progress}%`;
      }, 200);

      try {
        const reader = new FileReader();
        reader.onload = () => {
          clearInterval(interval);
          progressBar.style.width = '100%';
          progressText.textContent = 'Upload complete';
          
          setTimeout(() => {
            urlValue = reader.result as string;
            activeTab = 'url';
            renderDialog();
            attachEventHandlers();
          }, 500);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        clearInterval(interval);
        progressText.textContent = 'Upload failed';
      }
    }
  };

  const attachEventHandlers = () => {
    const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
    const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
    const replaceBtn = dialog.querySelector('#replace-btn') as HTMLButtonElement;
    const tabUpload = dialog.querySelector('.tab-upload') as HTMLButtonElement;
    const tabUrl = dialog.querySelector('.tab-url') as HTMLButtonElement;

    closeBtn?.addEventListener('click', closeDialog);
    cancelBtn?.addEventListener('click', closeDialog);
    replaceBtn?.addEventListener('click', replaceImage);

    tabUpload?.addEventListener('click', () => {
      activeTab = 'upload';
      renderDialog();
      attachEventHandlers();
    });

    tabUrl?.addEventListener('click', () => {
      activeTab = 'url';
      renderDialog();
      attachEventHandlers();
    });

    if (activeTab === 'upload') {
      const dropzone = dialog.querySelector('.dropzone') as HTMLDivElement;
      const fileInput = dialog.querySelector('#file-input') as HTMLInputElement;

      dropzone?.addEventListener('click', () => fileInput?.click());
      
      dropzone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('is-dragover');
      });

      dropzone?.addEventListener('dragleave', () => {
        dropzone.classList.remove('is-dragover');
      });

      dropzone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('is-dragover');
        const file = e.dataTransfer?.files[0];
        if (file) handleFileUpload(file);
      });

      fileInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) handleFileUpload(file);
      });
    }

    if (activeTab === 'url') {
      const urlInput = dialog.querySelector('#url-input') as HTMLInputElement;

      urlInput?.addEventListener('input', () => {
        urlValue = urlInput.value;
        renderDialog();
        attachEventHandlers();
      });
    }
  };

  attachEventHandlers();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
};

const updatePosition = () => {
  if (!floatingToolbar || !selectedMedia) return;

  const toolbarHeight = floatingToolbar.offsetHeight || 40;
  const mediaTop = selectedMedia.offsetTop;
  const mediaLeft = selectedMedia.offsetLeft;
  const mediaWidth = selectedMedia.offsetWidth;

  // Position above the image, centered
  const top = mediaTop - toolbarHeight - 8;
  const left = mediaLeft + (mediaWidth / 2) - ((floatingToolbar.offsetWidth || 120) / 2);

  floatingToolbar.style.top = `${top}px`;
  floatingToolbar.style.left = `${left}px`;
  setTimeout(() => {  
    if (floatingToolbar) floatingToolbar.style.display = "flex";
  },100);
};

// Show floating toolbar
const showFloatingToolbar = (media: HTMLImageElement | HTMLVideoElement) => {
  // Clean up existing toolbar
  if (floatingToolbar) {
    if ((floatingToolbar as any)._cleanup) {
      (floatingToolbar as any)._cleanup();
    }
    floatingToolbar.remove();
  }

  // Ensure parent has relative positioning
  const mediaParent = media.parentElement;
  if (mediaParent) {
    const originalPosition = mediaParent.style.position;
    if (!originalPosition || originalPosition === 'static') {
      mediaParent.style.position = 'relative';
      (mediaParent as any)._originalPosition = originalPosition; // Store for cleanup
    }

    floatingToolbar = document.createElement('div');
    floatingToolbar.className = 'media-floating-toolbar';
    if (isDarkThemeContext(media)) {
      floatingToolbar.classList.add('rte-ui-theme-dark');
    }

    // Insert toolbar as first child of parent
    mediaParent.insertBefore(floatingToolbar, mediaParent.firstChild);

    // Position the toolbar
    updatePosition();
  }

  const isImage = media.tagName === 'IMG';
  const existingLink = (media as HTMLElement).closest('a');

  floatingToolbar.innerHTML = `
    <button class="media-floating-toolbar-btn btn-align-left" title="Align Left" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>
    </button>
    <button class="media-floating-toolbar-btn btn-align-center" title="Align Center" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>
    </button>
    <button class="media-floating-toolbar-btn btn-align-right" title="Align Right" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>
    </button>
    <div class="media-floating-toolbar-separator" aria-hidden="true"></div>
    ${isImage ? `
    <button class="media-floating-toolbar-btn btn-alt" title="Edit Alt Text" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
    </button>` : ''}
    <button class="media-floating-toolbar-btn btn-link" title="${existingLink ? 'Edit/Remove Link' : 'Add Link'}" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
    </button>
    ${isImage ? `
    <button class="media-floating-toolbar-btn btn-replace" title="Replace Image" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
    </button>` : ''}
    <div class="media-floating-toolbar-separator" aria-hidden="true"></div>
    <button class="media-floating-toolbar-btn btn-remove" title="Remove" type="button">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
    </button>
  `;



  // Position the toolbar after it's rendered
  setTimeout(() => {
    updatePosition();
  }, 0);

  // Add event listeners for repositioning
  const handleReposition = () => updatePosition();
  
  // Listen for scroll events on parent elements and window
  let currentElement: Element | null = selectedMedia.parentElement;
  while (currentElement) {
    currentElement.addEventListener('scroll', handleReposition);
    currentElement = currentElement.parentElement;
  }
  
  window.addEventListener('scroll', handleReposition);
  window.addEventListener('resize', handleReposition);
  
  // Store cleanup function
  (floatingToolbar as any)._cleanup = () => {
    let element: Element | null = selectedMedia?.parentElement;
    while (element) {
      element.removeEventListener('scroll', handleReposition);
      element = element.parentElement;
    }
    window.removeEventListener('scroll', handleReposition);
    window.removeEventListener('resize', handleReposition);
  };

  // Align Left
  floatingToolbar.querySelector('.btn-align-left')?.addEventListener('click', () => {
    media.style.display = 'block';
    media.style.marginLeft = '0';
    media.style.marginRight = 'auto';
    updatePosition();
  });

  // Align Center
  floatingToolbar.querySelector('.btn-align-center')?.addEventListener('click', () => {
    media.style.display = 'block';
    media.style.marginLeft = 'auto';
    media.style.marginRight = 'auto';
    updatePosition();
  });

  // Align Right
  floatingToolbar.querySelector('.btn-align-right')?.addEventListener('click', () => {
    media.style.display = 'block';
    media.style.marginLeft = 'auto';
    media.style.marginRight = '0';
    updatePosition();
  });

  // Edit Alt Text (Images only)
  floatingToolbar.querySelector('.btn-alt')?.addEventListener('click', () => {
    if (media.tagName === 'IMG') {
      showAltTextDialog(media as HTMLImageElement);
    }
  });

  // Add/Edit Link
  floatingToolbar.querySelector('.btn-link')?.addEventListener('click', () => {
    showLinkDialogForMedia(media);
  });

  // Replace Image
  floatingToolbar.querySelector('.btn-replace')?.addEventListener('click', () => {
    if (media.tagName === 'IMG') {
      showReplaceImageDialog(media as HTMLImageElement);
    }
  });

  floatingToolbar.querySelector('.btn-resize')?.addEventListener('click', () => {
    const width = prompt('Enter width in pixels:', String(media.width || media.offsetWidth));
    if (width && !isNaN(parseInt(width))) {
      const w = parseInt(width);
      media.style.width = `${w}px`;
      media.setAttribute('width', String(w));
      updateResizeHandles();
      updatePosition();
    }
  });

  floatingToolbar.querySelector('.btn-remove')?.addEventListener('click', () => {
    if (confirm('Remove this media?')) {
      media.remove();
      if (floatingToolbar) {
        if ((floatingToolbar as any)._cleanup) {
          (floatingToolbar as any)._cleanup();
        }
        floatingToolbar.remove();
        floatingToolbar = null;
      }
      selectedMedia = null;
      updateResizeHandles();
    }
  });

  // Add scroll and resize event listeners (matching resize handles approach)
  // Store cleanup function for later removal
  (floatingToolbar as any)._cleanup = () => {
    window.removeEventListener('scroll', updatePosition);
    window.removeEventListener('resize', updatePosition);
  };
};

// Initialize media manager function (moved outside conditional for plugin access)
const initMediaManager = (editorEl?: HTMLElement) => {
  // Store the editor element for scoping
  editorElement = editorEl || null;

  createResizeHandles();

  // Add click listener - global but scoped to this editor instance
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
      const media = target as HTMLImageElement | HTMLVideoElement;

      // Check if media is within this editor's contenteditable area
      let isInThisEditor = false;
      if (editorElement) {
        // For web component, check if media is within this editor element
        isInThisEditor = editorElement.contains(media);
      } else {
        // Fallback to global behavior
        isInThisEditor = !!media.closest('[contenteditable="true"]');
      }

      if (isInThisEditor) {
        e.preventDefault();
        e.stopPropagation();
        selectedMedia = media;
        selectedMedia.style.display = 'block'; // Ensure block display for alignment
        showFloatingToolbar(media);
        updateResizeHandles();
        return;
      }
    }

    if (!target.closest('.btn-link, .btn-resize, .btn-remove')) {
      if (floatingToolbar && !target.closest('button')) {
        if ((floatingToolbar as any)._cleanup) {
          (floatingToolbar as any)._cleanup();
        }
        floatingToolbar.remove();
        floatingToolbar = null;
        
        // Restore parent position
        if (selectedMedia && selectedMedia.parentElement) {
          const parent = selectedMedia.parentElement;
          if ((parent as any)._originalPosition !== undefined) {
            parent.style.position = (parent as any)._originalPosition;
            delete (parent as any)._originalPosition;
          }
        }
        
        selectedMedia = null;
        updateResizeHandles();
      }
    }
  });

  resizeHandles.forEach(handle => {
    handle.addEventListener('mousedown', (e) => {
      if (!selectedMedia) return;
      e.preventDefault();
      e.stopPropagation();

      isResizing = true;
      currentHandle = handle.getAttribute('data-position');
      startX = e.clientX;
      startY = e.clientY;

      const rect = selectedMedia.getBoundingClientRect();
      startWidth = rect.width;
      startHeight = rect.height;
      aspectRatio = startWidth / startHeight;

      document.body.style.userSelect = 'none';
      document.body.style.cursor = `${currentHandle}-resize`;
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing || !selectedMedia || !currentHandle) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    switch (currentHandle) {
      case 'se':
        newWidth = startWidth + deltaX;
        newHeight = startHeight + deltaY;
        break;
      case 'sw':
        newWidth = startWidth - deltaX;
        newHeight = startHeight + deltaY;
        break;
      case 'ne':
        newWidth = startWidth + deltaX;
        newHeight = startHeight - deltaY;
        break;
      case 'nw':
        newWidth = startWidth - deltaX;
        newHeight = startHeight - deltaY;
        break;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      newHeight = newWidth / aspectRatio;
    } else {
      newWidth = newHeight * aspectRatio;
    }

    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);

    selectedMedia.style.width = `${newWidth}px`;
    selectedMedia.style.height = `${newHeight}px`;
    selectedMedia.setAttribute('width', String(Math.round(newWidth)));
    selectedMedia.setAttribute('height', String(Math.round(newHeight)));

    updateResizeHandles();
    updatePosition();
  });

  document.addEventListener('mouseup', () => {
    if (isResizing) {
      isResizing = false;
      currentHandle = null;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  });

  window.addEventListener('scroll', updateResizeHandles);
  window.addEventListener('resize', updateResizeHandles);
};

// Initialize media manager
if (typeof window !== 'undefined' && !window.__mediaManagerInitialized) {
  window.__mediaManagerInitialized = true;

  // Call initMediaManager without parameters for global initialization
  initMediaManager();
}

export const MediaManagerPlugin = (): Plugin => ({
  name: 'image',
  
  initialize: (config?: any) => {
    // Get the editor element from config (passed by web component)
    const editorEl = config?.editorElement;
    initMediaManager(editorEl);
  },
  
  toolbar: [
    {
      label: 'Image',
      command: 'insertImage',
      icon: '<svg width="24px" height="24px" viewBox="0 0 32 32" enable-background="new 0 0 32 32"><g><rect fill="none" height="22" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" width="30" x="1" y="5"></rect><polygon fill="none" points="31,27 21,17 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><polygon fill="none" points="18,20 9,11 1,19 1,27 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><circle cx="19" cy="11" fill="none" r="2" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></circle></g></svg>'
    },
    {
      label: 'Video',
      command: 'insertVideo',
      icon: '<svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg>'
    }
  ],
  
  commands: {
    insertImage: (_args, context) => {
      const contextElement = context?.contentElement instanceof HTMLElement
        ? context.contentElement
        : undefined;
      showMediaDialog('image', contextElement);
      return true;
    },
    
    insertVideo: (_args, context) => {
      const contextElement = context?.contentElement instanceof HTMLElement
        ? context.contentElement
        : undefined;
      showMediaDialog('video', contextElement);
      return true;
    }
  },
  
  keymap: {
    'Mod-Shift-i': 'insertImage'
  }
});
