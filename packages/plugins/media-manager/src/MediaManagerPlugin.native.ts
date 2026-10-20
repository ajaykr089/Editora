import type { Plugin } from '@editora/core';
import type { MediaManagerConfig } from './types/media';
import { resolveMediaManagerConfig } from './constants';
import { showMediaDialog } from './ui/insertDialog';
import { getMediaController } from './ui/mediaController';

/**
 * Media Manager Plugin - Native Implementation
 *
 * - Insert images and videos: upload (to a server, through a callback, or into the document as a data URL),
 *   or by URL, with alt text and size
 * - Real upload progress, cancel, and clear errors
 * - Select media in the editor: resize handles on the corners, and a toolbar to align, describe, link,
 *   replace and remove it
 *
 * Create it with `MediaManagerPlugin({ uploadHandler })`, or configure everything at once with
 * `setMediaManagerConfig()`; settings given here win over the global ones.
 */

const IMAGE_ICON = '<svg width="24px" height="24px" viewBox="0 0 32 32" enable-background="new 0 0 32 32"><g><rect fill="none" height="22" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2" width="30" x="1" y="5"></rect><polygon fill="none" points="31,27 21,17 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><polygon fill="none" points="18,20 9,11 1,19 1,27 11,27" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></polygon><circle cx="19" cy="11" fill="none" r="2" stroke="#000000" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="2"></circle></g></svg>';
const VIDEO_ICON = '<svg width="24" height="24" focusable="false"><path d="M4 3h16c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1H4a1 1 0 0 1-1-1V4c0-.6.4-1 1-1Zm1 2v14h14V5H5Zm4.8 2.6 5.6 4a.5.5 0 0 1 0 .8l-5.6 4A.5.5 0 0 1 9 16V8a.5.5 0 0 1 .8-.4Z" fill-rule="nonzero"></path></svg>';

const AUDIO_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><path d="M9 18V6l10-2v12"></path><circle cx="6.5" cy="18" r="2.5"></circle><circle cx="16.5" cy="16" r="2.5"></circle></svg>';

const contextElementOf = (context: any): HTMLElement | undefined =>
  context?.contentElement instanceof HTMLElement ? context.contentElement : undefined;

export const MediaManagerPlugin = (config?: Partial<MediaManagerConfig>): Plugin => {
  const controller = getMediaController();
  const ensureController = () => {
    controller.setConfigSource(() => config);
    controller.attach();
  };

  // Importing the plugin has always been enough to make images selectable, whichever host runs it
  // (the web component never calls `initialize`), so it is attached here and not only in `initialize`.
  if (typeof window !== 'undefined') ensureController();

  return {
    name: 'image',

    initialize: () => {
      ensureController();
    },

    destroy: () => {
      controller.detach();
    },

    toolbar: [
      { label: 'Image', command: 'insertImage', icon: IMAGE_ICON },
      { label: 'Video', command: 'insertVideo', icon: VIDEO_ICON },
      ...(resolveMediaManagerConfig(config).audio ? [{ label: 'Audio', command: 'insertAudio', icon: AUDIO_ICON }] : []),
    ],

    commands: {
      insertImage: (_args, context) => {
        ensureController();
        showMediaDialog('image', contextElementOf(context), config);
        return true;
      },

      insertVideo: (_args, context) => {
        ensureController();
        showMediaDialog('video', contextElementOf(context), config);
        return true;
      },

      insertAudio: (_args, context) => {
        ensureController();
        showMediaDialog('audio', contextElementOf(context), config);
        return true;
      },
    },

    keymap: {
      'Mod-Shift-i': 'insertImage',
    },
  };
};
