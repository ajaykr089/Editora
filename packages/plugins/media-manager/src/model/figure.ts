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
export type MediaElement = HTMLImageElement | HTMLVideoElement | HTMLAudioElement | HTMLIFrameElement;
/** Pictures and videos have a size that can be dragged; audio, embedded players and gallery pictures do not. */
export type ResizableMedia = HTMLImageElement | HTMLVideoElement;
export type Align = 'left' | 'center' | 'right';
export type FigureKind = 'media' | 'embed' | 'gallery';

export const FIGURE_CLASS = 'rte-media';
export const EMBED_CLASS = 'rte-embed';
export const GALLERY_CLASS = 'rte-gallery';
export const FIGURE_SELECTOR = `figure.${FIGURE_CLASS}`;

const MARGINS: Record<Align, string> = {
  left: '1em auto 1em 0',
  center: '1em auto',
  right: '1em 0 1em auto',
};

/** The widest an embedded player is drawn until it is resized. */
export const EMBED_MAX_WIDTH = '720px';

const CAPTION_STYLE =
  'display: table-caption; caption-side: bottom; padding-top: 0.5em; text-align: center; font-size: 0.875em; opacity: 0.75;';
/** In a gallery the caption is a row of the grid, under all the pictures. */
const GALLERY_CAPTION_STYLE = 'grid-column: 1 / -1; padding-top: 0.25em; text-align: center; font-size: 0.875em; opacity: 0.75;';

export const isEmbed = (node: Node | null | undefined): node is HTMLIFrameElement =>
  node instanceof HTMLElement && node.tagName === 'IFRAME' && Boolean(node.closest(`figure.${EMBED_CLASS}`));

export const isMedia = (node: Node | null | undefined): node is MediaElement =>
  node instanceof HTMLElement && (node.tagName === 'IMG' || node.tagName === 'VIDEO' || node.tagName === 'AUDIO' || isEmbed(node));

export const isGalleryItem = (media: HTMLElement): boolean => Boolean(media.closest(`figure.${GALLERY_CLASS}`));

export const isResizable = (media: MediaElement): media is ResizableMedia =>
  (media.tagName === 'IMG' || media.tagName === 'VIDEO') && !isGalleryItem(media);

export const kindOfFigure = (figure: HTMLElement): FigureKind =>
  figure.classList.contains(EMBED_CLASS) ? 'embed' : figure.classList.contains(GALLERY_CLASS) ? 'gallery' : 'media';

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

/**
 * The figure's own look, by kind. Media shrinks to the picture and is aligned with margins; an embedded player
 * is a block as wide as it is allowed to be (`max-width`, which the Size menu changes); a gallery is a grid and
 * has no alignment (see `buildGallery`).
 */
export const styleFigure = (figure: HTMLElement, align: Align): void => {
  figure.classList.add(FIGURE_CLASS);
  figure.setAttribute('data-align', align);
  const kind = kindOfFigure(figure);
  if (kind === 'gallery') return;
  if (kind === 'embed') {
    const maxWidth = figure.style.maxWidth || EMBED_MAX_WIDTH;
    figure.style.cssText = `display: block; width: 100%; max-width: ${maxWidth}; margin: ${MARGINS[align]};`;
    return;
  }
  figure.style.cssText = `display: table; max-width: 100%; margin: ${MARGINS[align]};`;
};

/** Inside a figure a picture or video sits flush: the figure carries the margins. */
const flushMedia = (media: MediaElement): void => {
  if (media.tagName === 'IFRAME') return;
  media.style.removeProperty('margin');
  media.style.removeProperty('margin-left');
  media.style.removeProperty('margin-right');
  media.style.display = 'block';
  if (media.tagName !== 'AUDIO' && !media.style.maxWidth) media.style.maxWidth = '100%';
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

/** Align a figure. A gallery fills the width of the text, so there is nothing to align. */
export const setAlign = (media: MediaElement, align: Align): void => {
  const figure = ensureFigure(media);
  if (kindOfFigure(figure) !== 'gallery') styleFigure(figure, align);
};

/** The look of a caption in this figure. */
export const captionStyleFor = (figure: HTMLElement): string =>
  kindOfFigure(figure) === 'gallery' ? GALLERY_CAPTION_STYLE : CAPTION_STYLE;

/** Add a caption (returned, to be focused) or take it away (`null`). */
export const toggleCaption = (media: MediaElement): HTMLElement | null => {
  const figure = ensureFigure(media);
  const existing = captionOf(figure);
  if (existing) {
    existing.remove();
    return null;
  }
  const caption = document.createElement('figcaption');
  caption.style.cssText = captionStyleFor(figure);
  caption.append(document.createElement('br'));
  figure.append(caption);
  adoptFigure(figure);
  return caption;
};

/** Give an existing caption its look (media that was loaded without the inline style). */
export const styleCaption = (caption: HTMLElement): void => {
  const figure = caption.parentElement;
  if (!caption.style.cssText) caption.style.cssText = figure ? captionStyleFor(figure) : CAPTION_STYLE;
};

/**
 * Set the displayed width, keeping the proportions. An embedded player has its figure's `max-width` set (its
 * height follows from its shape); audio and gallery pictures have no size to set.
 */
export const setWidth = (media: MediaElement, width: number | null): void => {
  if (isEmbed(media)) {
    const figure = figureOf(media);
    if (figure) figure.style.maxWidth = width === null ? EMBED_MAX_WIDTH : `${Math.max(1, Math.round(width))}px`;
    return;
  }
  if (!isResizable(media)) return;
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
