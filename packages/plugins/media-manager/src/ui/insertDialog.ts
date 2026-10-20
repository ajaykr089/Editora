import { escapeHtml } from '../../../shared/escapeHtml';
import { recordDomHistory } from '../../../shared/historyHelpers';
import type { MediaManagerConfig } from '../types/media';
import {
  attachEscapeCloseHandler,
  createDialogOverlay,
  createDialogShell,
  focusActiveTab,
  resolveDialogContext,
} from './dialogKit';
import { bindUploadSection, uploadSectionHTML } from './uploadSection';

export const showMediaDialog = (
  type: 'image' | 'video',
  contextElement?: HTMLElement | null,
  config?: Partial<MediaManagerConfig>,
) => {
  document.querySelectorAll('.rte-media-overlay').forEach((el) => el.remove());

  let savedSelection: Range | null = null;
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

  const previewFieldHTML = () => `
    <div class="rte-media-field rte-media-preview-field">
      <span class="rte-media-label">Preview</span>
      <div class="rte-media-preview">
        ${type === 'image' ? `<img src="${escapeHtml(urlValue)}" alt="Preview">` : `<video src="${escapeHtml(urlValue)}" controls></video>`}
      </div>
    </div>
  `;

  const renderDialog = () => {
    dialog.innerHTML = `
      <div class="rte-media-header">
        <h2 class="rte-media-title">Insert ${type === 'image' ? 'Image' : 'Video'}</h2>
        <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
      </div>

      <div class="rte-media-tabs" role="tablist" aria-label="Where to get the ${type === 'image' ? 'image' : 'video'} from">
        <button class="tab-upload rte-media-tab ${activeTab === 'upload' ? 'active' : ''}" type="button" role="tab" aria-selected="${activeTab === 'upload'}">Upload</button>
        <button class="tab-url rte-media-tab ${activeTab === 'url' ? 'active' : ''}" type="button" role="tab" aria-selected="${activeTab === 'url'}">URL</button>
      </div>

      <div class="rte-media-body">
        ${activeTab === 'upload' ? `
          ${uploadSectionHTML(type, config)}
        ` : `
          <div id="url-section">
            <div class="rte-media-field">
              <label class="rte-media-label" for="url-input">URL</label>
              <input type="text" id="url-input" class="rte-media-input" placeholder="https://example.com/${type}.${type === 'image' ? 'jpg' : 'mp4'}" value="${escapeHtml(urlValue)}">
            </div>
            ${type === 'image' ? `
              <div class="rte-media-field">
                <label class="rte-media-label" for="alt-input">Alt Text (for accessibility)</label>
                <input type="text" id="alt-input" class="rte-media-input" placeholder="Describe the image" value="${escapeHtml(altValue)}">
              </div>
            ` : ''}
            <div class="rte-media-grid">
              <div class="rte-media-field">
                <label class="rte-media-label" for="width-input">Width (px)</label>
                <input type="number" id="width-input" class="rte-media-input" placeholder="Auto" value="${escapeHtml(widthValue)}">
              </div>
              <div class="rte-media-field">
                <label class="rte-media-label" for="height-input">Height (px)</label>
                <input type="number" id="height-input" class="rte-media-input" placeholder="Auto" value="${escapeHtml(heightValue)}">
              </div>
            </div>
            ${urlValue ? previewFieldHTML() : ''}
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

  const uploadState: { controller: AbortController | null } = { controller: null };
  let cleanupEscape = () => {};
  const closeDialog = () => {
    uploadState.controller?.abort();
    cleanupEscape();
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };
  cleanupEscape = attachEscapeCloseHandler(overlay, closeDialog);

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

    // Where it goes: the selection the dialog was opened from, else the end of the editor it was opened for.
    const host =
      (savedSelection
        ? (savedSelection.commonAncestorContainer instanceof HTMLElement
            ? savedSelection.commonAncestorContainer
            : savedSelection.commonAncestorContainer.parentElement
          )?.closest<HTMLElement>('[contenteditable="true"]')
        : null) ??
      resolveDialogContext(contextElement)?.closest<HTMLElement>('[contenteditable="true"]') ??
      null;
    const beforeHTML = host?.innerHTML ?? '';

    if (savedSelection && host?.contains(savedSelection.commonAncestorContainer)) {
      savedSelection.deleteContents();
      savedSelection.insertNode(mediaEl);
    } else if (host) {
      host.appendChild(mediaEl);
    }

    closeDialog();

    if (host && mediaEl.isConnected) {
      // The editor has to hear about it (its change callback, and Undo), and the caret goes after the new media
      // so that what is typed next follows it.
      host.focus({ preventScroll: true });
      const selection = window.getSelection();
      if (selection) {
        const after = document.createRange();
        after.setStartAfter(mediaEl);
        after.collapse(true);
        selection.removeAllRanges();
        selection.addRange(after);
      }
      recordDomHistory(host, beforeHTML);
      host.dispatchEvent(new Event('input', { bubbles: true }));
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
      const altInput = dialog.querySelector('#alt-input') as HTMLInputElement;
      const widthInput = dialog.querySelector('#width-input') as HTMLInputElement;
      const heightInput = dialog.querySelector('#height-input') as HTMLInputElement;

      // Rebuilding the dialog here took the focus out of the field after every letter, so a URL could
      // only be pasted. Keep the field, and bring the button and the preview up to date around it.
      let previewTimer: ReturnType<typeof setTimeout> | undefined;
      urlInput?.addEventListener('input', () => {
        urlValue = urlInput.value;
        const insertButton = dialog.querySelector<HTMLButtonElement>('#insert-btn');
        if (insertButton) insertButton.disabled = !urlValue;

        clearTimeout(previewTimer);
        previewTimer = setTimeout(() => {
          const section = dialog.querySelector('#url-section');
          const existing = section?.querySelector('.rte-media-preview-field');
          if (!section) return;
          if (!urlValue) {
            existing?.remove();
            return;
          }
          if (existing) {
            const media = existing.querySelector<HTMLElement>('img, video');
            if (media) media.setAttribute('src', urlValue);
            return;
          }
          const grid = section.querySelector('.rte-media-grid');
          grid?.insertAdjacentHTML('afterend', previewFieldHTML());
        }, 400);
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
