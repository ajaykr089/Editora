import { escapeHtml } from '../../../shared/escapeHtml';
import { resolveMediaManagerConfig } from '../constants';
import { isAbort } from '../providers';
import { acceptFor, describeLimit, uploadMedia } from '../uploadService';
import type { MediaItem, MediaManagerConfig } from '../types/media';
import { makeDropzoneKeyboardAccessible } from './dialogKit';

type Kind = 'image' | 'video';

/** The "Upload" half of the insert and replace dialogs: a drop zone, a progress bar that is true, and a message when it fails. */
export const uploadSectionHTML = (kind: Kind, config?: Partial<MediaManagerConfig>): string => {
  const limit = resolveMediaManagerConfig(config).maxFileSize;
  const limitText = limit ? ` Max file size: ${describeLimit(limit)}` : '';
  return `
    <div id="upload-section">
      <div class="dropzone rte-media-dropzone" role="button" tabindex="0" aria-label="Drag and drop your ${kind} here or click to browse.${escapeHtml(limitText)}">
        <div class="rte-media-dropzone-icon" aria-hidden="true">📁</div>
        <p class="rte-media-dropzone-title">Drag and drop your ${kind} here</p>
        <p class="rte-media-muted">or click to browse</p>
        ${limit ? `<p class="rte-media-hint">${escapeHtml(limitText.trim())}</p>` : ''}
      </div>
      <input type="file" id="file-input" aria-label="Choose ${kind === 'image' ? 'an image' : 'a video'} file" accept="${escapeHtml(acceptFor(kind, config))}" style="display: none;">
      <div id="upload-progress" class="rte-media-progress" style="display: none;">
        <div class="rte-media-progress-track" role="progressbar" aria-label="Upload progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div id="progress-bar" class="rte-media-progress-bar"></div>
        </div>
        <p id="progress-text" class="rte-media-progress-text" role="status">Uploading…</p>
        <div class="rte-media-progress-actions">
          <button type="button" class="cancel-upload-btn rte-media-btn rte-media-btn-secondary">Cancel upload</button>
        </div>
      </div>
      <p id="upload-error" class="rte-media-error" role="alert" hidden></p>
    </div>
  `;
};

export interface UploadSectionHandle {
  /** Stops an upload that is under way. The dialog calls this when it closes. */
  abort(): void;
}

/**
 * Wires the section made by `uploadSectionHTML`. Call again after the dialog has been re-rendered; the upload that is
 * running is not tied to the elements, so it carries on and reports into whichever section is on screen.
 */
export const bindUploadSection = (
  dialog: HTMLElement,
  options: {
    config?: Partial<MediaManagerConfig>;
    /** Called with the stored file once the provider has it. */
    onUploaded: (item: MediaItem) => void;
    state: { controller: AbortController | null };
  },
): void => {
  const { state } = options;
  const q = <T extends HTMLElement>(selector: string) => dialog.querySelector<T>(selector);

  const showError = (message: string) => {
    const error = q<HTMLElement>('#upload-error');
    if (!error) return;
    error.textContent = message;
    error.hidden = !message;
  };
  const showProgress = (fraction: number | null, text: string) => {
    const wrap = q<HTMLElement>('#upload-progress');
    const bar = q<HTMLElement>('#progress-bar');
    const track = q<HTMLElement>('.rte-media-progress-track');
    const label = q<HTMLElement>('#progress-text');
    if (wrap) wrap.style.display = text ? 'block' : 'none';
    if (bar && fraction !== null) bar.style.width = `${Math.round(fraction * 100)}%`;
    if (track && fraction !== null) track.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
    if (label) label.textContent = text;
  };

  const start = async (file: File) => {
    state.controller?.abort();
    const controller = new AbortController();
    state.controller = controller;

    showError('');
    showProgress(0, 'Uploading…');
    try {
      const item = await uploadMedia(file, {
        config: options.config,
        signal: controller.signal,
        onProgress: ({ fraction }) => {
          if (state.controller !== controller) return;
          showProgress(fraction, fraction >= 1 ? 'Finishing…' : `Uploading… ${Math.round(fraction * 100)}%`);
        },
      });
      if (state.controller !== controller) return;
      state.controller = null;
      options.onUploaded(item);
    } catch (error) {
      if (state.controller !== controller) return;
      state.controller = null;
      showProgress(null, '');
      if (!isAbort(error)) {
        showError(error instanceof Error && error.message ? error.message : "Couldn't upload the file.");
      }
    }
  };

  q<HTMLButtonElement>('.cancel-upload-btn')?.addEventListener('click', () => state.controller?.abort());

  const dropzone = q<HTMLElement>('.dropzone');
  const fileInput = q<HTMLInputElement>('#file-input');

  dropzone?.addEventListener('click', () => fileInput?.click());
  makeDropzoneKeyboardAccessible(dropzone, fileInput);
  dropzone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('is-dragover');
  });
  dropzone?.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
  dropzone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('is-dragover');
    const file = e.dataTransfer?.files[0];
    if (file) void start(file);
  });
  fileInput?.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    // Cleared, so choosing the same file again after a failure fires `change` again.
    if (file) void start(file);
    input.value = '';
  });
};
