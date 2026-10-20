import type { MediaItem } from '../../types/media';
import { acceptFor, describeLimit } from '../../uploadService';
import { resolveMediaManagerConfig } from '../../constants';
import { makeDropzoneKeyboardAccessible } from '../dialogKit';
import { icons } from './icons';
import { UploadQueue, type QueueEntry } from '../../uploadQueue';
import { checkBadge, el, kindBadge, nameOverlay, thumbnail } from './tile';
import { kindNoun, type PickerContext } from './types';

/** Drop zone and the list of uploads under way: several files at once, each with progress, cancel and retry. */
export class UploadView {
  readonly element = el('div', 'rte-mp-view');
  readonly queue: UploadQueue;
  private readonly dropzone = el('div', 'rte-mp-dropzone dropzone');
  private readonly input = el('input');
  private readonly list = el('ul', 'rte-mp-grid rte-mp-queue');
  private readonly tiles = new Map<string, HTMLElement>();
  private readonly selectedOnce = new Set<string>();

  constructor(
    private readonly ctx: PickerContext,
    /** An upload finished: the library is out of date. */
    private readonly onUploaded: () => void,
  ) {
    this.queue = new UploadQueue({ config: ctx.config, onChange: () => this.sync() });

    this.element.setAttribute('role', 'tabpanel');
    this.element.id = 'rte-mp-panel-upload';
    this.element.hidden = true;

    const limit = resolveMediaManagerConfig(ctx.config).maxFileSize;
    const noun = ctx.kinds.length === 1 ? kindNoun(ctx.kinds) : 'file';
    const limitText = limit ? ` Max file size: ${describeLimit(limit)}` : '';
    this.dropzone.setAttribute('role', 'button');
    this.dropzone.tabIndex = 0;
    this.dropzone.setAttribute('aria-label', `Drag and drop your ${kindNoun(ctx.kinds, true)} here or click to browse.${limitText}`);
    this.dropzone.innerHTML = `
      <span class="rte-mp-dropzone-icon" aria-hidden="true">${icons.upload.replace('width="18" height="18"', 'width="30" height="30"')}</span>
      <strong>Drag and drop your ${ctx.selection.multiple ? kindNoun(ctx.kinds, true) : noun} here</strong>
      <span>or click to browse</span>
      ${limit ? `<span class="rte-media-hint">${limitText.trim()}</span>` : ''}`;

    this.input.type = 'file';
    this.input.id = 'file-input';
    this.input.multiple = ctx.selection.multiple;
    this.input.style.display = 'none';
    this.input.accept = [...new Set(ctx.kinds.flatMap((kind) => acceptFor(kind, ctx.config).split(',')))].join(',');
    this.input.setAttribute('aria-label', ctx.kinds.length === 1 ? `Choose ${ctx.kinds[0] === 'image' ? 'an image' : ctx.kinds[0] === 'video' ? 'a video' : 'an audio'} file` : 'Choose files');

    this.dropzone.addEventListener('click', () => this.input.click());
    makeDropzoneKeyboardAccessible(this.dropzone, this.input);
    this.dropzone.addEventListener('dragover', (event) => {
      event.preventDefault();
      this.dropzone.classList.add('is-dragover');
    });
    this.dropzone.addEventListener('dragleave', () => this.dropzone.classList.remove('is-dragover'));
    this.dropzone.addEventListener('drop', () => this.dropzone.classList.remove('is-dragover'));
    this.input.addEventListener('change', () => {
      if (this.input.files?.length) this.add([...this.input.files]);
      // Cleared, so choosing the same file again after a failure fires `change` again.
      this.input.value = '';
    });

    this.list.setAttribute('role', 'list');
    this.list.setAttribute('aria-label', 'Uploads');
    this.list.hidden = true;

    const scroll = el('div', 'rte-mp-scroll');
    scroll.append(this.dropzone, this.input, this.list);
    this.element.append(scroll);
  }

  /** Files from anywhere (drop on the dialog, paste, the chooser). */
  add(files: File[]): void {
    const wanted = this.ctx.selection.multiple ? files : files.slice(0, 1);
    if (wanted.length) this.queue.add(wanted);
  }

  focusDropzone(): void {
    this.dropzone.focus({ preventScroll: true });
  }

  syncSelection(): void {
    this.tiles.forEach((tile, id) => {
      const entry = this.queue.entries.find((candidate) => candidate.id === id);
      const selected = Boolean(entry?.item && this.ctx.selection.has(entry.item.id));
      tile.classList.toggle('is-selected', selected);
      tile.querySelector('.rte-mp-tile-pick')?.setAttribute('aria-pressed', String(selected));
    });
  }

  dispose(): void {
    this.queue.dispose();
  }

  private sync(): void {
    const entries = this.queue.entries;
    this.list.hidden = entries.length === 0;

    for (const [id, tile] of this.tiles) {
      if (!entries.some((entry) => entry.id === id)) {
        tile.remove();
        this.tiles.delete(id);
      }
    }
    entries.forEach((entry, index) => {
      let tile = this.tiles.get(entry.id);
      if (!tile) {
        tile = this.createTile(entry);
        this.tiles.set(entry.id, tile);
      }
      if (this.list.children[index] !== tile) this.list.insertBefore(tile, this.list.children[index] ?? null);
      this.update(tile, entry);
    });
    this.syncSelection();
  }

  private createTile(entry: QueueEntry): HTMLElement {
    const tile = el('li', 'rte-mp-tile');
    tile.dataset.upload = entry.id;
    const kind = entry.file.type.startsWith('video/') ? 'video' : entry.file.type.startsWith('audio/') ? 'audio' : 'image';
    tile.append(thumbnail({ type: kind, src: '', thumbnailUrl: undefined }, entry.previewUrl));
    if (kind === 'video' || kind === 'audio') tile.append(kindBadge(kind));
    return tile;
  }

  /** Bring one tile to the state of its entry without rebuilding it, so the preview image does not flicker. */
  private update(tile: HTMLElement, entry: QueueEntry): void {
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
      const status = label(entry.status === 'queued' ? 'Waiting…' : `${percent}%`);
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
      actions.append(iconButton('Cancel upload of', icons.close, () => this.queue.remove(entry.id)));
      tile.append(status, bar, actions);
    } else if (entry.status === 'error') {
      const status = label(entry.error ?? "Couldn't upload this file.");
      status.setAttribute('role', 'alert');
      const actions = el('div', 'rte-mp-tile-actions');
      if (entry.retryable !== false) actions.append(iconButton('Retry', icons.retry, () => this.queue.retry(entry.id)));
      actions.append(iconButton('Remove', icons.close, () => this.queue.remove(entry.id)));
      tile.append(status, actions);
    } else if (entry.item) {
      const item: MediaItem = entry.item;
      const pick = el('button', 'rte-mp-tile-pick');
      pick.type = 'button';
      pick.setAttribute('aria-label', item.name);
      pick.setAttribute('aria-pressed', 'false');
      pick.addEventListener('click', () => {
        this.ctx.selection.toggle(item);
        this.ctx.setActive(this.ctx.selection.has(item.id) ? item : this.ctx.selection.items.at(-1) ?? null);
      });
      pick.addEventListener('dblclick', () => this.ctx.commit([item]));
      tile.append(nameOverlay(item.name), checkBadge(), pick);

      // A finished upload is what the person came to insert: choose it, once, without being asked.
      if (!this.selectedOnce.has(entry.id)) {
        this.selectedOnce.add(entry.id);
        this.ctx.selection.toggle(item);
        this.ctx.setActive(item);
        this.onUploaded();
        this.ctx.announce(`${item.name} uploaded`);
      }
    }
  }
}
