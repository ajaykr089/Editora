/**
 * What captioned, aligned media is in the document:
 *
 *   <figure class="rte-media" data-align="center" style="display: table; margin: 1em auto; max-width: 100%">
 *     <img src alt width height>            (or <video>, or <a><img></a>)
 *     <figcaption>Caption</figcaption>      (only when there is one)
 *   </figure>
 *
 * `display: table` makes the figure as wide as the picture, so the caption (a `table-caption`) wraps at the picture's
 * width, and the alignment is plain margins: it renders the same on a page that has none of the editor's CSS.
 * While editing, the figure is `contenteditable="false"` with only the caption editable; core strips that
 * from emitted HTML (see `stripEditorUiArtifacts`) and `adoptFigure` puts it back on content that was loaded.
 */
export type MediaElement = HTMLImageElement | HTMLVideoElement;
export type Align = 'left' | 'center' | 'right';

export const FIGURE_CLASS = 'rte-media';
export const FIGURE_SELECTOR = `figure.${FIGURE_CLASS}`;

const MARGINS: Record<Align, string> = {
  left: '1em auto 1em 0',
  center: '1em auto',
  right: '1em 0 1em auto',
};

const CAPTION_STYLE =
  'display: table-caption; caption-side: bottom; padding-top: 0.5em; text-align: center; font-size: 0.875em; opacity: 0.75;';

export const isMedia = (node: Node | null | undefined): node is MediaElement =>
  node instanceof HTMLElement && (node.tagName === 'IMG' || node.tagName === 'VIDEO');

/** The element that is the media's whole presence in the block: its link when the link holds nothing else. */
export const mediaRootOf = (media: MediaElement): HTMLElement => {
  const link = media.parentElement;
  return link && link.tagName === 'A' && link.children.length === 1 && !link.textContent?.trim() ? link : media;
};

export const figureOf = (media: HTMLElement): HTMLElement | null => media.closest<HTMLElement>(FIGURE_SELECTOR);

export const captionOf = (figure: HTMLElement): HTMLElement | null =>
  figure.querySelector<HTMLElement>(':scope > figcaption');

export const getAlign = (media: MediaElement): Align => {
  const figure = figureOf(media);
  const value = figure?.getAttribute('data-align');
  if (value === 'left' || value === 'center' || value === 'right') return value;
  // Media from before figures: block-level with auto margins.
  const style = media.style;
  if (style.marginLeft === 'auto' && style.marginRight === 'auto') return 'center';
  if (style.marginLeft === 'auto') return 'right';
  return 'left';
};

/** The figure's own look: shrink-wrapped to the picture, aligned with margins. */
export const styleFigure = (figure: HTMLElement, align: Align): void => {
  figure.className = FIGURE_CLASS;
  figure.setAttribute('data-align', align);
  figure.style.cssText = `display: table; max-width: 100%; margin: ${MARGINS[align]};`;
};

/** Inside a figure the picture sits flush: the figure carries the margins. */
const flushMedia = (media: MediaElement): void => {
  media.style.removeProperty('margin');
  media.style.removeProperty('margin-left');
  media.style.removeProperty('margin-right');
  media.style.display = 'block';
  if (!media.style.maxWidth) media.style.maxWidth = '100%';
};

/** Make a figure atomic for editing: only its caption takes the caret. Idempotent. */
export const adoptFigure = (figure: HTMLElement): void => {
  if (figure.getAttribute('contenteditable') !== 'false') figure.setAttribute('contenteditable', 'false');
  const caption = captionOf(figure);
  if (caption && caption.getAttribute('contenteditable') !== 'true') caption.setAttribute('contenteditable', 'true');
};

/** Every figure of an editor, made atomic; content loaded from storage has none of the editing attributes. */
export const adoptFigures = (host: HTMLElement): void => {
  host.querySelectorAll<HTMLElement>(FIGURE_SELECTOR).forEach(adoptFigure);
};

/** A new figure around a media element that is not in the document yet. */
export const buildFigure = (media: MediaElement, align: Align = 'left'): HTMLElement => {
  const figure = document.createElement('figure');
  styleFigure(figure, align);
  flushMedia(media);
  figure.append(media);
  adoptFigure(figure);
  return figure;
};

/**
 * The figure around `media`, made if it has none (media from before figures, or inserted as a plain image).
 * Wrapping happens in place; a link that holds only the media goes inside the figure with it.
 */
export const ensureFigure = (media: MediaElement): HTMLElement => {
  const existing = figureOf(media);
  if (existing) return existing;

  const root = mediaRootOf(media);
  const align = getAlign(media);
  const figure = document.createElement('figure');
  styleFigure(figure, align);
  root.replaceWith(figure);
  figure.append(root);
  flushMedia(media);
  adoptFigure(figure);
  return figure;
};

export const setAlign = (media: MediaElement, align: Align): void => {
  styleFigure(ensureFigure(media), align);
};

/** Add a caption (returned, to be focused) or take it away (`null`). */
export const toggleCaption = (media: MediaElement): HTMLElement | null => {
  const figure = ensureFigure(media);
  const existing = captionOf(figure);
  if (existing) {
    existing.remove();
    return null;
  }
  const caption = document.createElement('figcaption');
  caption.style.cssText = CAPTION_STYLE;
  caption.append(document.createElement('br'));
  figure.append(caption);
  adoptFigure(figure);
  return caption;
};

/** Give an existing caption its look (media that was loaded without the inline style). */
export const styleCaption = (caption: HTMLElement): void => {
  if (!caption.style.cssText) caption.style.cssText = CAPTION_STYLE;
};

/** Set the displayed width, keeping the proportions. */
export const setWidth = (media: MediaElement, width: number | null): void => {
  if (width === null) {
    media.removeAttribute('width');
    media.removeAttribute('height');
    media.style.removeProperty('width');
    media.style.removeProperty('height');
    return;
  }
  const rect = media.getBoundingClientRect();
  const ratio = rect.width && rect.height ? rect.height / rect.width : null;
  const w = Math.max(1, Math.round(width));
  media.style.width = `${w}px`;
  media.setAttribute('width', String(w));
  if (ratio) {
    const h = Math.round(w * ratio);
    media.style.height = `${h}px`;
    media.setAttribute('height', String(h));
  }
};
