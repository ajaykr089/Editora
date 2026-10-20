import { GALLERY_CLASS, adoptFigure, captionOf, styleCaption, type MediaElement } from './figure';

export const GALLERY_COLUMNS = [2, 3, 4, 5] as const;
export const DEFAULT_COLUMNS = 3;

/** Every picture the same shape, so that the rows line up; `cover` crops what does not fit. */
const ITEM_STYLE = 'display: block; width: 100%; height: auto; aspect-ratio: 4 / 3; object-fit: cover; max-width: 100%;';

const clampColumns = (columns: number): number => Math.min(5, Math.max(2, Math.round(columns) || DEFAULT_COLUMNS));

/** A gallery with this many pictures looks best in this many columns, never more than there are pictures. */
export const columnsFor = (count: number): number => clampColumns(Math.min(count, count >= 5 ? 3 : count));

const styleGallery = (figure: HTMLElement, columns: number): void => {
  figure.classList.add(GALLERY_CLASS);
  figure.setAttribute('data-columns', String(columns));
  figure.style.cssText = `display: grid; grid-template-columns: repeat(${columns}, minmax(0, 1fr)); gap: 8px; max-width: 100%; margin: 1em 0;`;
};

export const getColumns = (figure: HTMLElement): number => clampColumns(Number(figure.getAttribute('data-columns')));

export const setColumns = (figure: HTMLElement, columns: number): void => {
  styleGallery(figure, clampColumns(columns));
};

/** Pictures in a grid, in the order given. A caption can be added to the gallery afterwards. */
export const buildGallery = (images: HTMLImageElement[], columns: number = columnsFor(images.length)): HTMLElement => {
  const figure = document.createElement('figure');
  figure.classList.add('rte-media');
  styleGallery(figure, clampColumns(columns));
  figure.setAttribute('data-align', 'center');
  for (const image of images) {
    image.style.cssText = ITEM_STYLE;
    figure.append(image);
  }
  adoptFigure(figure);
  const caption = captionOf(figure);
  if (caption) styleCaption(caption);
  return figure;
};

export const pictures = (figure: HTMLElement): HTMLImageElement[] =>
  [...figure.querySelectorAll<HTMLImageElement>(':scope > img, :scope > a > img')];

/**
 * Take one picture out of its gallery. A gallery with nothing left goes too (returns `true`); what remains with a
 * single picture is still a gallery, so that adding to it later is not a different thing.
 */
export const removeFromGallery = (media: MediaElement): boolean => {
  const figure = media.closest<HTMLElement>(`figure.${GALLERY_CLASS}`);
  if (!figure) return false;
  (media.parentElement?.tagName === 'A' && media.parentElement.children.length === 1 ? media.parentElement : media).remove();
  if (pictures(figure).length === 0) {
    figure.remove();
    return true;
  }
  return false;
};
