import { escapeHtml } from '../../../shared/escapeHtml';
import type { MediaManagerConfig } from '../types/media';
import {
  attachEscapeCloseHandler,
  createDialogOverlay,
  createDialogShell,
  focusActiveTab,
} from './dialogKit';
import { bindUploadSection, uploadSectionHTML } from './uploadSection';

// Show Replace Image dialog
export const showReplaceImageDialog = (
  img: HTMLImageElement,
  config?: Partial<MediaManagerConfig>,
  onChanged?: () => void,
) => {
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

      <div class="rte-media-tabs" role="tablist" aria-label="Where to get the image from">
        <button class="tab-upload rte-media-tab ${activeTab === 'upload' ? 'active' : ''}" type="button" role="tab" aria-selected="${activeTab === 'upload'}">Upload</button>
        <button class="tab-url rte-media-tab ${activeTab === 'url' ? 'active' : ''}" type="button" role="tab" aria-selected="${activeTab === 'url'}">URL</button>
      </div>

      <div class="rte-media-body">
        ${activeTab === 'upload' ? `
          ${uploadSectionHTML('image', config)}
        ` : `
          <div id="url-section">
            <div class="rte-media-field">
              <label class="rte-media-label" for="url-input">Image URL</label>
              <input type="text" id="url-input" class="rte-media-input" placeholder="https://example.com/image.jpg" value="${escapeHtml(urlValue)}">
            </div>
            ${urlValue ? `
              <div class="rte-media-field">
                <span class="rte-media-label">Preview</span>
                <div class="rte-media-preview">
                  <img src="${escapeHtml(urlValue)}" alt="Preview" onerror="this.parentElement.innerHTML='<p class=&quot;rte-media-muted&quot;>Failed to load image</p>'">
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

  const uploadState: { controller: AbortController | null } = { controller: null };
  let cleanupEscape = () => {};
  const closeDialog = () => {
    uploadState.controller?.abort();
    cleanupEscape();
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };
  cleanupEscape = attachEscapeCloseHandler(overlay, closeDialog);

  const replaceImage = () => {
    if (urlValue) {
      img.src = urlValue;
      closeDialog();
      onChanged?.();
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
      focusActiveTab(dialog, activeTab);
    });

    tabUrl?.addEventListener('click', () => {
      activeTab = 'url';
      renderDialog();
      attachEventHandlers();
      focusActiveTab(dialog, activeTab);
    });

    if (activeTab === 'upload') {
      bindUploadSection(dialog, {
        config,
        state: uploadState,
        onUploaded: (item) => {
          urlValue = item.src;
          activeTab = 'url';
          renderDialog();
          attachEventHandlers();
          focusActiveTab(dialog, activeTab);
        },
      });
    }

    if (activeTab === 'url') {
      const urlInput = dialog.querySelector('#url-input') as HTMLInputElement;

      // As in the insert dialog: keep the field (a rebuild took the focus after every letter).
      urlInput?.addEventListener('input', () => {
        urlValue = urlInput.value;
        const replaceButton = dialog.querySelector<HTMLButtonElement>('#replace-btn');
        if (replaceButton) replaceButton.disabled = !urlValue;
      });
    }
  };

  attachEventHandlers();
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });
};
