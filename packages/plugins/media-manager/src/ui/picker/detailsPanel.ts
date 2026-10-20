import type { MediaItem, MediaManagerConfig } from '../../types/media';
import { canSuggestAlt, createSuggestControl } from '../suggestAlt';
import { icons } from './icons';
import { el, formatBytes, thumbnail } from './tile';
import type { SelectionModel } from './selection';

interface AltState {
  text: string;
  decorative: boolean;
}

/** The side panel: a preview of the item last touched, what is known about it, its alt text, and (library) delete. */
export class DetailsPanel {
  readonly element = el('aside', 'rte-mp-details');
  private readonly alts = new Map<string, AltState>();
  private readonly captions = new Map<string, string>();
  private shown: MediaItem | null = null;
  private suggest: { abort: () => void } | null = null;

  constructor(
    private readonly selection: SelectionModel<MediaItem>,
    private readonly options: {
      /** Alt text of the image being replaced, offered when the new file has none of its own. */
      defaultAlt?: string;
      /** The settings, for the Suggest button (shown when `generateAltText` is configured). */
      config?: Partial<MediaManagerConfig>;
      /** Whether media goes in a figure, which is what a caption needs. */
      captions?: boolean;
      canDelete: (item: MediaItem) => boolean;
      onDelete: (item: MediaItem) => void;
    },
  ) {
    this.element.setAttribute('aria-label', 'Details');
    this.element.hidden = true;
  }

  /** The dialog is closing: stop a suggestion that is still being waited for. */
  dispose(): void {
    this.suggest?.abort();
    this.suggest = null;
  }

  /** The alt attribute for an item: `''` when marked decorative, the text, or nothing. */
  altFor(item: MediaItem): string | undefined {
    if (item.type !== 'image') return undefined;
    const state = this.alts.get(item.id);
    if (state) return state.decorative ? '' : state.text || undefined;
    return item.alt || this.options.defaultAlt || undefined;
  }

  /** The caption for an item: what was typed, else the one kept with it (a photo credit). */
  captionFor(item: MediaItem): string | undefined {
    if (this.options.captions === false) return undefined;
    const typed = this.captions.get(item.id);
    const text = typed ?? (typeof item.metadata?.caption === 'string' ? item.metadata.caption : '');
    return text.trim() || undefined;
  }

  show(item: MediaItem | null): void {
    // Someone typing in the alt field must not have it rebuilt under them by an upload that just finished.
    if (item && this.shown?.id === item.id && this.element.contains(document.activeElement)) return;
    this.shown = item;
    this.suggest?.abort();
    this.suggest = null;
    this.element.replaceChildren();
    if (!item) {
      this.element.hidden = true;
      return;
    }
    this.element.hidden = false;

    const preview = el('div', 'rte-mp-preview');
    preview.append(this.previewMedia(item));
    this.element.append(preview);

    const heading = el('div');
    const name = el('p', 'rte-mp-meta-name');
    name.textContent = item.name;
    const meta = el('p', 'rte-mp-meta');
    this.element.append(heading);
    heading.append(name, meta);
    this.fillMeta(meta, item);

    if (this.selection.size > 1) {
      const more = el('p', 'rte-mp-hint');
      more.textContent = `${this.selection.size} items selected. Choose one of them to describe it.`;
      this.element.append(more);
    }

    if (item.type === 'image') this.element.append(this.altField(item));
    if (this.options.captions !== false) this.element.append(this.captionField(item));

    if (this.options.canDelete(item)) {
      const button = el('button', 'rte-media-btn rte-media-btn-secondary');
      button.type = 'button';
      button.innerHTML = `${icons.trash}<span style="margin-left:6px">Delete from library</span>`;
      button.addEventListener('click', () => this.options.onDelete(item));
      this.element.append(button);
    }
  }

  private previewMedia(item: MediaItem): HTMLElement {
    if (item.type === 'audio') {
      const audio = el('audio');
      audio.src = item.src;
      audio.controls = true;
      audio.preload = 'none';
      audio.style.width = '100%';
      return audio;
    }
    if (item.type === 'video') {
      const video = el('video');
      video.src = item.src;
      video.controls = true;
      video.preload = 'metadata';
      video.setAttribute('playsinline', '');
      return video;
    }
    const picture = thumbnail({ ...item, thumbnailUrl: item.src });
    return picture;
  }

  private fillMeta(target: HTMLElement, item: MediaItem): void {
    const render = (width?: number, height?: number) => {
      const parts = [width && height ? `${width} × ${height}` : '', formatBytes(item.size), item.mime.split('/')[1]?.toUpperCase() ?? ''];
      target.textContent = parts.filter(Boolean).join(' · ');
    };
    render(item.width, item.height);
    if (item.type === 'image' && !(item.width && item.height) && typeof Image !== 'undefined') {
      const probe = new Image();
      probe.onload = () => {
        if (this.shown === item && target.isConnected) render(probe.naturalWidth, probe.naturalHeight);
      };
      probe.src = item.src;
    }
  }

  private captionField(item: MediaItem): HTMLElement {
    const wrap = el('div', 'rte-media-field');
    const label = el('label', 'rte-media-label');
    label.htmlFor = 'detail-caption';
    label.textContent = 'Caption';
    const input = el('input', 'rte-media-input');
    input.type = 'text';
    input.id = 'detail-caption';
    input.placeholder = 'Shown under the media';
    input.value = this.captions.get(item.id) ?? (typeof item.metadata?.caption === 'string' ? item.metadata.caption : '');
    input.addEventListener('input', () => this.captions.set(item.id, input.value));
    wrap.append(label, input);
    return wrap;
  }

  private altField(item: MediaItem): HTMLElement {
    const state: AltState = this.alts.get(item.id) ?? {
      text: item.alt || this.options.defaultAlt || '',
      decorative: false,
    };

    const wrap = el('div', 'rte-media-field');
    const labelRow = el('div', 'rte-mp-label-row');
    const label = el('label', 'rte-media-label');
    label.htmlFor = 'detail-alt';
    label.textContent = 'Alt text';
    labelRow.append(label);
    const input = el('textarea', 'rte-media-textarea');
    input.id = 'detail-alt';
    input.rows = 3;
    input.placeholder = 'Describe the image';
    input.value = state.text;
    input.disabled = state.decorative;

    const hint = el('p', 'rte-mp-hint');
    const decorativeLabel = el('label', 'rte-media-checkbox-label');
    const decorative = el('input');
    decorative.type = 'checkbox';
    decorative.id = 'detail-decorative';
    decorative.checked = state.decorative;
    decorativeLabel.append(decorative, document.createTextNode('This image is decorative'));

    const refreshHint = () => {
      const missing = !decorative.checked && !input.value.trim();
      hint.classList.toggle('is-warning', missing);
      hint.textContent = decorative.checked
        ? 'Screen readers will skip it.'
        : missing
          ? "Add a description so people who can't see the image know what it shows."
          : 'Read aloud by screen readers and shown if the image does not load.';
    };
    const save = () => {
      this.alts.set(item.id, { text: input.value, decorative: decorative.checked });
      input.disabled = decorative.checked;
      refreshHint();
    };
    input.addEventListener('input', save);
    decorative.addEventListener('change', save);
    refreshHint();

    wrap.append(labelRow, input, hint, decorativeLabel);

    if (canSuggestAlt(this.options.config)) {
      const control = createSuggestControl({
        config: this.options.config,
        image: () => ({ src: item.src, name: item.name }),
        input,
        // A description fills the field, so the picture is no longer decorative.
        onFilled: () => {
          decorative.checked = false;
          save();
        },
      });
      this.suggest = control;
      labelRow.append(control.button);
      hint.after(control.status);
    }
    return wrap;
  }
}
