import { el } from './tile';
import type { PickerKind } from './types';
import type { MediaSpec } from './insertMedia';

const VIDEO_EXTENSION = /\.(mp4|webm|ogv|ogg|mov|m4v)(\?|#|$)/i;
const AUDIO_EXTENSION = /\.(mp3|wav|m4a|aac|oga|opus|flac)(\?|#|$)/i;

/** From an address: a video when it ends like one, else an image; the dialog's own kind decides when it is unclear. */
export const guessType = (url: string, fallback: PickerKind): PickerKind =>
  AUDIO_EXTENSION.test(url) || url.startsWith('data:audio/')
    ? 'audio'
    : VIDEO_EXTENSION.test(url)
      ? 'video'
      : /\.(jpe?g|png|gif|webp|avif|svg|bmp)(\?|#|$)/i.test(url) || url.startsWith('data:image/')
        ? 'image'
        : fallback;

/** "Insert from an address": the URL, a preview, alt text and a size. */
export class UrlView {
  readonly element = el('div', 'rte-mp-view');
  private readonly urlInput = el('input', 'rte-media-input');
  private readonly altInput = el('input', 'rte-media-input');
  private readonly widthInput = el('input', 'rte-media-input');
  private readonly heightInput = el('input', 'rte-media-input');
  private readonly previewBox = el('div', 'rte-media-field rte-media-preview-field');
  private previewTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly kinds: PickerKind[],
    private readonly initialUrl: string,
    private readonly initialAlt: string | undefined,
    private readonly onChange: () => void,
    private readonly onSubmit: () => void,
    /** What an address that does not say is taken for, and what the example in the field shows. */
    private readonly preferred: PickerKind = kinds[0] ?? 'image',
  ) {
    this.element.setAttribute('role', 'tabpanel');
    this.element.id = 'rte-mp-panel-url';
    this.element.hidden = true;

    const form = el('div', 'rte-mp-form');
    const noun = preferred === 'audio' ? 'clip' : preferred;
    const field = (labelText: string, input: HTMLInputElement, id: string, extra: Partial<HTMLInputElement> = {}) => {
      const wrap = el('div', 'rte-media-field');
      const label = el('label', 'rte-media-label');
      label.htmlFor = id;
      label.textContent = labelText;
      input.id = id;
      Object.assign(input, extra);
      wrap.append(label, input);
      return wrap;
    };

    const ext = preferred === 'video' ? 'mp4' : preferred === 'audio' ? 'mp3' : 'jpg';
    form.append(
      field('URL', this.urlInput, 'url-input', { type: 'text', placeholder: `https://example.com/${noun}.${ext}`, value: initialUrl }),
      ...(kinds.includes('image')
        ? [field('Alt Text (for accessibility)', this.altInput, 'alt-input', { type: 'text', placeholder: 'Describe the image', value: initialAlt ?? '' })]
        : []),
    );
    const sizes = el('div', 'rte-media-grid');
    sizes.append(
      field('Width (px)', this.widthInput, 'width-input', { type: 'number', placeholder: 'Auto' }),
      field('Height (px)', this.heightInput, 'height-input', { type: 'number', placeholder: 'Auto' }),
    );
    form.append(sizes, this.previewBox);
    this.previewBox.hidden = true;
    this.element.append(form);

    this.urlInput.addEventListener('input', () => {
      this.onChange();
      clearTimeout(this.previewTimer);
      this.previewTimer = setTimeout(() => this.renderPreview(), 400);
    });
    this.urlInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && this.url) {
        event.preventDefault();
        this.onSubmit();
      }
    });
    if (initialUrl) this.renderPreview();
  }

  get url(): string {
    return this.urlInput.value.trim();
  }

  focus(): void {
    this.urlInput.focus({ preventScroll: true });
  }

  /** The element to insert, or null while there is no address. */
  spec(): MediaSpec | null {
    if (!this.url) return null;
    const type = guessType(this.url, this.preferred);
    return {
      src: this.url,
      type,
      alt: type === 'image' && this.altInput.value ? this.altInput.value : undefined,
      width: this.widthInput.value || undefined,
      height: this.heightInput.value || undefined,
    };
  }

  dispose(): void {
    clearTimeout(this.previewTimer);
  }

  private renderPreview(): void {
    const url = this.url;
    if (!url) {
      this.previewBox.hidden = true;
      this.previewBox.replaceChildren();
      return;
    }
    const existing = this.previewBox.querySelector<HTMLElement>('img, video, audio');
    const type = guessType(url, this.preferred);
    const tag = type === 'image' ? 'img' : type === 'video' ? 'video' : 'audio';
    if (existing && existing.tagName.toLowerCase() === tag) {
      existing.setAttribute('src', url);
    } else {
      const label = el('span', 'rte-media-label');
      label.textContent = 'Preview';
      const frame = el('div', 'rte-media-preview');
      const media = type === 'image' ? el('img') : type === 'video' ? el('video') : el('audio');
      media.setAttribute('src', url);
      if (media instanceof HTMLImageElement) media.alt = 'Preview';
      else media.controls = true;
      frame.append(media);
      this.previewBox.replaceChildren(label, frame);
    }
    this.previewBox.hidden = false;
  }
}
