import type { MediaManagerConfig } from '../types/media';
import { openMediaPicker } from './picker/mediaPicker';
import { resolveMediaManagerConfig } from '../constants';
import { buildMediaNode, insertAtSelection } from './picker/insertMedia';

/** Insert Image / Insert Video: the picker, and what to do with what it returns. */
export const showMediaDialog = (
  type: 'image' | 'video',
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
    title: `Insert ${type === 'image' ? 'Image' : 'Video'}`,
    contextElement,
    config,
    onPick: (specs) => {
      const figure = resolveMediaManagerConfig(config).wrapInFigure !== false;
      const elements = specs.map((spec) => buildMediaNode(spec, { figure })).filter((element): element is HTMLElement => element !== null);
      insertAtSelection(elements, { savedSelection, contextElement });
    },
  });
};
