import { parseEmbedUrl, type EmbedProvider, type EmbedSpec } from '../../embeds/providers';
import { icons } from './icons';
import { el } from './tile';

/**
 * "Embed a video": a YouTube or Vimeo link (or the iframe snippet a site offers) becomes a player. What was typed
 * is only read for the video's id; the player's address is built from that (see `parseEmbedUrl`). Nothing is
 * loaded from the video service until the player is in the document.
 */
export class EmbedView {
  readonly element = el('div', 'rte-mp-view');
  private readonly urlInput = el('input', 'rte-media-input');
  private readonly titleInput = el('input', 'rte-media-input');
  private readonly status = el('p', 'rte-mp-embed-status');
  private parsed: EmbedSpec | null = null;

  constructor(
    private readonly providers: EmbedProvider[],
    private readonly onChange: () => void,
    private readonly onSubmit: () => void,
  ) {
    this.element.setAttribute('role', 'tabpanel');
    this.element.id = 'rte-mp-panel-embed';
    this.element.hidden = true;

    const form = el('div', 'rte-mp-form');
    const field = (labelText: string, input: HTMLInputElement, id: string, extra: Partial<HTMLInputElement>) => {
      const wrap = el('div', 'rte-media-field');
      const label = el('label', 'rte-media-label');
      label.htmlFor = id;
      label.textContent = labelText;
      input.id = id;
      Object.assign(input, extra);
      wrap.append(label, input);
      return wrap;
    };

    const intro = el('p', 'rte-mp-hint');
    intro.textContent = 'Paste a link to a YouTube or Vimeo video, or the embed code the site gives you.';
    form.append(
      intro,
      field('Video link', this.urlInput, 'embed-url', { type: 'text', placeholder: 'https://www.youtube.com/watch?v=…' }),
      field('Title (for screen readers)', this.titleInput, 'embed-title', { type: 'text', placeholder: 'What the video is about' }),
    );

    this.status.setAttribute('role', 'status');
    form.append(this.status);
    this.element.append(form);
    this.renderStatus();

    this.urlInput.addEventListener('input', () => {
      this.parsed = parseEmbedUrl(this.urlInput.value, this.providers);
      this.renderStatus();
      this.onChange();
    });
    this.urlInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && this.parsed) {
        event.preventDefault();
        this.onSubmit();
      }
    });
  }

  /** What would be embedded, or null while the link is empty or not one that can be. */
  get spec(): EmbedSpec | null {
    return this.parsed;
  }

  get title(): string {
    return this.titleInput.value.trim();
  }

  focus(): void {
    this.urlInput.focus({ preventScroll: true });
  }

  private renderStatus(): void {
    const typed = this.urlInput.value.trim();
    this.status.className = 'rte-mp-embed-status';
    this.status.replaceChildren();
    if (!typed) return;
    if (this.parsed) {
      this.status.classList.add('is-ok');
      this.status.innerHTML = `<span aria-hidden="true">${icons.embed}</span>`;
      const text = el('span');
      text.textContent = `${this.parsed.label} found. It loads when you insert it.`;
      this.status.append(text);
    } else {
      this.status.classList.add('is-error');
      this.status.textContent = "That isn't a link to a video this can embed. YouTube and Vimeo links work.";
    }
  }
}
