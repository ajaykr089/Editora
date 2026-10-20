import type { QueueEntry, UploadQueue } from '../../uploadQueue';
import { icons } from './icons';
import { el, kindBadge, thumbnail } from './tile';

/** A tile for a file that is going up (or failed to), with a preview of the file itself. */
export const createUploadTile = (entry: QueueEntry, tag: 'li' | 'div' = 'li'): HTMLElement => {
  const tile = el(tag, 'rte-mp-tile');
  tile.dataset.upload = entry.id;
  const kind = entry.file.type.startsWith('video/') ? 'video' : entry.file.type.startsWith('audio/') ? 'audio' : 'image';
  tile.append(thumbnail({ type: kind, src: '', thumbnailUrl: undefined }, entry.previewUrl));
  if (kind === 'video' || kind === 'audio') tile.append(kindBadge(kind));
  return tile;
};

/**
 * Bring a tile to the state of an entry that is waiting, uploading or failed, without rebuilding the tile so the
 * preview does not flicker. Returns false for a finished entry, which is the caller's to show.
 */
export const updateUploadTile = (tile: HTMLElement, entry: QueueEntry, queue: UploadQueue): boolean => {
  tile.classList.toggle('is-uploading', entry.status === 'uploading' || entry.status === 'queued');
  tile.classList.toggle('is-failed', entry.status === 'error');
  tile.querySelectorAll('.rte-mp-progress, .rte-mp-tile-status, .rte-mp-tile-pick, .rte-mp-tile-check, .rte-mp-tile-name, .rte-mp-tile-actions').forEach((n) => n.remove());

  const label = (text: string) => {
    const status = el('div', 'rte-mp-tile-status');
    const line = el('span');
    line.textContent = text;
    status.append(line);
    return status;
  };
  const iconButton = (name: string, svg: string, onClick: () => void) => {
    const button = el('button', 'rte-mp-icon-btn');
    button.type = 'button';
    button.setAttribute('aria-label', `${name} ${entry.file.name}`);
    button.innerHTML = svg;
    button.addEventListener('click', onClick);
    return button;
  };

  if (entry.status === 'queued' || entry.status === 'uploading') {
    const percent = Math.round(entry.fraction * 100);
    const status = label(entry.status === 'queued' ? 'Waiting…' : `Uploading ${percent}%`);
    status.setAttribute('role', 'status');
    const bar = el('div', 'rte-mp-progress');
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-label', `Uploading ${entry.file.name}`);
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '100');
    bar.setAttribute('aria-valuenow', String(percent));
    const fill = el('span');
    fill.style.width = `${percent}%`;
    bar.append(fill);
    const actions = el('div', 'rte-mp-tile-actions');
    actions.append(iconButton('Cancel upload of', icons.close, () => queue.remove(entry.id)));
    tile.append(status, bar, actions);
    return true;
  }
  if (entry.status === 'error') {
    const status = label(entry.error ?? "Couldn't upload this file.");
    status.setAttribute('role', 'alert');
    const actions = el('div', 'rte-mp-tile-actions');
    if (entry.retryable !== false) actions.append(iconButton('Retry', icons.retry, () => queue.retry(entry.id)));
    actions.append(iconButton('Remove', icons.close, () => queue.remove(entry.id)));
    tile.append(status, actions);
    return true;
  }
  return false;
};
