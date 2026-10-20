import type { MediaManagerConfig } from '../../types/media';
import { openImageEditor, type ImageEditorDeps } from './imageEditor';

const ORIGINAL_ATTRIBUTE = 'data-original-src';

/** An address that will still mean the same picture later: not an inline data URL, not a blob that dies with the page. */
const isDurable = (src: string): boolean => !src.startsWith('data:') && !src.startsWith('blob:');

const nameFromSrc = (src: string): string => {
  if (src.startsWith('data:') || src.startsWith('blob:')) return 'image';
  try {
    const last = new URL(src, document.baseURI).pathname.split('/').filter(Boolean).pop();
    return last ? decodeURIComponent(last) : 'image';
  } catch {
    return 'image';
  }
};

/** Point the image at a new file. Its width stays; its height follows the new proportions. */
const setSource = (img: HTMLImageElement, src: string): void => {
  img.src = src;
  img.removeAttribute('height');
  img.style.removeProperty('height');
};

/**
 * Edit an image in the document. The edited picture is stored as a new file, so the original is still where it was,
 * and the image remembers it (`data-original-src`) for "Restore original". `onChanged` runs once the image has
 * been changed, so that the editor can be told and the change recorded.
 */
export const editImage = (
  img: HTMLImageElement,
  config: Partial<MediaManagerConfig> | undefined,
  onChanged: () => void,
  deps?: ImageEditorDeps,
): void => {
  const current = img.currentSrc || img.src;
  const original = img.getAttribute(ORIGINAL_ATTRIBUTE);

  openImageEditor({
    src: current,
    name: nameFromSrc(original ?? current),
    config,
    contextElement: img,
    canRestore: Boolean(original),
    deps,
    onApply: ({ item }) => {
      if (!original && isDurable(current)) img.setAttribute(ORIGINAL_ATTRIBUTE, current);
      setSource(img, item.src);
      onChanged();
    },
    onRestore: () => {
      if (!original) return;
      setSource(img, original);
      img.removeAttribute(ORIGINAL_ATTRIBUTE);
      onChanged();
    },
  });
};
