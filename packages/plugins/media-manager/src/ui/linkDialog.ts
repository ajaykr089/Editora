import { escapeHtml } from '../../../shared/escapeHtml';
import { confirmAction } from '../../../shared/confirmDialog';
import { attachEscapeCloseHandler, createDialogOverlay, createDialogShell } from './dialogKit';

// Show Link dialog for media
/** `onChanged` runs after the link was added, edited or removed, so the caller can refresh what shows its state. */
export const showLinkDialogForMedia = (
  media: HTMLElement,
  onChanged?: () => void,
) => {
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
        <input id="link-url" type="url" class="rte-media-input" value="${escapeHtml(currentHref)}" placeholder="https://example.com" />
      </div>
      <div class="rte-media-field">
        <label class="rte-media-label">Title (tooltip)</label>
        <input id="link-title" type="text" class="rte-media-input" value="${escapeHtml(currentTitle)}" placeholder="Optional tooltip text" />
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

  let cleanupEscape = () => {};
  const closeDialog = () => {
    cleanupEscape();
    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  };
  cleanupEscape = attachEscapeCloseHandler(overlay, closeDialog);

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
      onChanged?.();
    }
  });

  removeLinkBtn?.addEventListener('click', async () => {
    if (!existingLink) return;
    const confirmed = await confirmAction('Remove link from this media?', {
      title: 'Remove link',
      confirmText: 'Remove link',
      danger: true,
      context: media,
    });
    if (!confirmed || !existingLink.isConnected) return;

    existingLink.replaceWith(media);
    closeDialog();
    onChanged?.();
  });

  urlInput.focus();
};
