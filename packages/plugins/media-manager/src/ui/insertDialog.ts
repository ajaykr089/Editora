import type { MediaManagerConfig } from '../types/media';
import { openMediaPicker } from './picker/mediaPicker';
import { resolveMediaManagerConfig } from '../constants';
import { adoptFigure, captionStyleFor } from '../model/figure';
import { buildGallery } from '../model/gallery';
import { buildMediaElement, buildMediaNode, insertAtSelection } from './picker/insertMedia';

/** Insert Image / Insert Video: the picker, and what to do with what it returns. */
export const showMediaDialog = (
  type: 'image' | 'video' | 'audio',
  contextElement?: HTMLElement | null,
  config?: Partial<MediaManagerConfig>,
) => {
  document.querySelectorAll('.rte-media-overlay').forEach((el) => el.remove());

  // Opening the dialog moves the focus out of the text; remember where the caret was.
  let savedSelection: Range | null = null;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) savedSelection = selection.getRangeAt(0).cloneRange();

  openMediaPicker({
    mode: 'insert',
    kinds: [type],
    title: `Insert ${type === 'image' ? 'Image' : type === 'video' ? 'Video' : 'Audio'}`,
    contextElement,
    config,
    onPick: (specs, extra) => {
      const figure = resolveMediaManagerConfig(config).wrapInFigure !== false;
      // Several pictures asked for as one gallery: a grid in one figure.
      if (extra?.gallery && figure && specs.length > 1) {
        const pictures = specs
          .map((spec) => buildMediaElement(spec))
          .filter((element): element is HTMLImageElement => element instanceof HTMLImageElement);
        const gallery = buildGallery(pictures);
        // The credits of the photos (stock photos have them) go under the gallery, since there is one caption.
        const credits = [...new Set(specs.map((spec) => spec.caption).filter((text): text is string => Boolean(text)))];
        if (credits.length) {
          const caption = document.createElement('figcaption');
          caption.style.cssText = captionStyleFor(gallery);
          caption.textContent = credits.join(' · ');
          gallery.append(caption);
          adoptFigure(gallery);
        }
        insertAtSelection([gallery], { savedSelection, contextElement });
        return;
      }
      const elements = specs.map((spec) => buildMediaNode(spec, { figure })).filter((element): element is HTMLElement => element !== null);
      insertAtSelection(elements, { savedSelection, contextElement });
    },
  });
};
