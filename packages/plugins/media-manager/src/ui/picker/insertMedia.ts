import { recordDomHistory } from '../../../../shared/historyHelpers';
import type { MediaItem } from '../../types/media';
import { resolveDialogContext } from '../dialogKit';

export interface MediaSpec {
  src: string;
  type: MediaItem['type'];
  /** `''` is deliberate (a decorative image); `undefined` leaves the attribute off. */
  alt?: string;
  width?: string;
  height?: string;
}

/** What goes into the document for a chosen file. Only images and videos can be inserted. */
export const buildMediaElement = (spec: MediaSpec): HTMLImageElement | HTMLVideoElement | null => {
  if (spec.type !== 'image' && spec.type !== 'video') return null;
  const isImage = spec.type === 'image';
  const element = document.createElement(isImage ? 'img' : 'video');
  element.src = spec.src;
  element.setAttribute('data-media-type', spec.type);

  if (isImage && spec.alt !== undefined) (element as HTMLImageElement).alt = spec.alt;
  if (spec.width) element.setAttribute('width', spec.width);
  if (spec.height) element.setAttribute('height', spec.height);
  if (!isImage) (element as HTMLVideoElement).controls = true;

  if (!spec.width && !spec.height) {
    element.style.cssText = 'max-width: 100%; height: auto; display: block; margin: 1em 0; cursor: pointer;';
  } else {
    element.style.cssText = `display: block; margin: 1em 0; cursor: pointer; ${spec.width ? `width: ${spec.width}px;` : 'max-width: 100%;'} ${spec.height ? `height: ${spec.height}px;` : 'height: auto;'}`;
  }
  return element;
};

/**
 * Put the elements where the dialog was opened from: at the selection it was opened with, else at the end of the
 * editor it was opened for. The editor is told, the insertion can be undone, and the caret goes after the last one.
 */
export const insertAtSelection = (
  elements: HTMLElement[],
  options: { savedSelection: Range | null; contextElement?: HTMLElement | null },
): boolean => {
  const { savedSelection } = options;
  if (elements.length === 0) return false;

  const host =
    (savedSelection
      ? (savedSelection.commonAncestorContainer instanceof HTMLElement
          ? savedSelection.commonAncestorContainer
          : savedSelection.commonAncestorContainer.parentElement
        )?.closest<HTMLElement>('[contenteditable="true"]')
      : null) ??
    resolveDialogContext(options.contextElement)?.closest<HTMLElement>('[contenteditable="true"]') ??
    null;
  if (!host) return false;

  const beforeHTML = host.innerHTML;
  const fragment = document.createDocumentFragment();
  elements.forEach((element) => fragment.appendChild(element));
  const last = elements[elements.length - 1];

  if (savedSelection && host.contains(savedSelection.commonAncestorContainer)) {
    savedSelection.deleteContents();
    savedSelection.insertNode(fragment);
  } else {
    host.appendChild(fragment);
  }
  if (!last.isConnected) return false;

  host.focus({ preventScroll: true });
  const selection = window.getSelection();
  if (selection) {
    const after = document.createRange();
    after.setStartAfter(last);
    after.collapse(true);
    selection.removeAllRanges();
    selection.addRange(after);
  }
  recordDomHistory(host, beforeHTML);
  host.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
};

/** Point an existing image at another file. */
export const replaceImageSource = (img: HTMLImageElement, spec: MediaSpec): void => {
  img.src = spec.src;
  if (spec.alt !== undefined) img.alt = spec.alt;
};
