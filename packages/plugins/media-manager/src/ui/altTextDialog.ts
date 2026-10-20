import { escapeHtml } from '../../../shared/escapeHtml';
import type { MediaManagerConfig } from '../types/media';
import { attachEscapeCloseHandler, createDialogOverlay, createDialogShell } from './dialogKit';
import { canSuggestAlt, createSuggestControl } from './suggestAlt';

// Show Alt Text dialog
export const showAltTextDialog = (img: HTMLImageElement, onChanged?: () => void, config?: Partial<MediaManagerConfig>) => {
  const overlay = createDialogOverlay(img);
  const dialog = createDialogShell(true);

  dialog.innerHTML = `
    <div class="rte-media-header">
      <h2 class="rte-media-title">Edit Alt Text</h2>
      <button class="close-btn rte-media-close-btn" type="button" aria-label="Close">×</button>
    </div>
    <div class="rte-media-body">
      <label class="rte-media-label">Alternative Text (for accessibility)</label>
      <textarea id="alt-text-input" class="rte-media-textarea" placeholder="Describe the image for screen readers...">${escapeHtml(img.alt || '')}</textarea>
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
  let abortSuggestion = () => {};
  if (canSuggestAlt(config)) {
    const control = createSuggestControl({ config, image: () => ({ src: img.currentSrc || img.src }), input });
    abortSuggestion = control.abort;
    const label = dialog.querySelector('.rte-media-label')!;
    const row = document.createElement('div');
    row.className = 'rte-mp-label-row';
    label.replaceWith(row);
    row.append(label, control.button);
    input.after(control.status);
  }
  const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement;
  const cancelBtn = dialog.querySelector('.cancel-btn') as HTMLButtonElement;
  const saveBtn = dialog.querySelector('.save-btn') as HTMLButtonElement;

  let cleanupEscape = () => {};
  const closeDialog = () => {
    abortSuggestion();
    cleanupEscape();
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };
  cleanupEscape = attachEscapeCloseHandler(overlay, closeDialog);

  closeBtn.addEventListener('click', closeDialog);
  cancelBtn.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDialog(); });

  saveBtn.addEventListener('click', () => {
    const changed = img.alt !== input.value;
    img.alt = input.value;
    closeDialog();
    if (changed) onChanged?.();
  });

  input.focus();
  input.select();
};
