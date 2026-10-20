import type { MediaManagerConfig } from '../types/media';
import { openMediaPicker } from './picker/mediaPicker';
import { replaceImageSource } from './picker/insertMedia';

/** Replace Image: the same picker, taking one file, which becomes the image's source. */
export const showReplaceImageDialog = (
  img: HTMLImageElement,
  config?: Partial<MediaManagerConfig>,
  onChanged?: () => void,
) => {
  openMediaPicker({
    mode: 'replace',
    kinds: ['image'],
    title: 'Replace Image',
    contextElement: img,
    config,
    initialUrl: img.src.startsWith('data:') ? '' : img.src,
    initialAlt: img.alt,
    onPick: ([spec]) => {
      if (!spec) return;
      replaceImageSource(img, spec);
      onChanged?.();
    },
  });
};
