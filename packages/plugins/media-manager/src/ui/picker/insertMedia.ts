import { recordDomHistory } from '../../../../shared/historyHelpers';
import type { MediaItem } from '../../types/media';
import { buildFigure, type Align, type MediaElement } from '../../model/figure';
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

/** What goes into the document for a chosen file: a figure around it by default, or the bare element. */
export const buildMediaNode = (spec: MediaSpec, options: { figure: boolean; align?: Align }): HTMLElement | null => {
  const element = buildMediaElement(spec);
  if (!element) return null;
  return options.figure ? buildFigure(element as MediaElement, options.align) : element;
};

const TEXT_BLOCKS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']);
const hasContent = (element: HTMLElement) =>
  Boolean(element.textContent?.trim()) || Boolean(element.querySelector('img, video, figure, iframe, table, hr'));

/**
 * Put block-level nodes (figures) at a caret. A figure may not sit inside a paragraph or a heading, and a browser
 * that parses the saved HTML again would tear it out, so the block is split around the caret: what is before it
 * stays, the nodes go in after it, and what was after it moves to a new block of the same kind (an empty one when
 * there was nothing, so that there is somewhere to type below the media). Returns that block, for the caret.
 */
export const insertBlocks = (range: Range, host: HTMLElement, nodes: HTMLElement[]): HTMLElement | null => {
  range.deleteContents();

  let block: HTMLElement | null = range.startContainer instanceof HTMLElement ? range.startContainer : range.startContainer.parentElement;
  while (block && block !== host && !TEXT_BLOCKS.has(block.tagName)) block = block.parentElement;

  if (!block || block === host || !host.contains(block)) {
    const fragment = document.createDocumentFragment();
    nodes.forEach((node) => fragment.appendChild(node));
    const last = nodes[nodes.length - 1];
    range.insertNode(fragment);
    // Media at the very end of the editor leaves nowhere to type after it.
    if (last && !last.nextSibling && last.parentElement) {
      const tail = document.createElement('p');
      tail.innerHTML = '<br>';
      last.after(tail);
      return tail;
    }
    return null;
  }

  const rest = document.createRange();
  rest.setStart(range.startContainer, range.startOffset);
  rest.setEnd(block, block.childNodes.length);
  const tail = block.cloneNode(false) as HTMLElement;
  tail.removeAttribute('id');
  tail.append(rest.extractContents());
  if (!hasContent(tail)) tail.innerHTML = '<br>';

  const headIsEmpty = !hasContent(block);
  block.after(...nodes, tail);
  if (headIsEmpty) block.remove();
  return tail;
};

/**
 * Put the nodes where the dialog was opened from: at the selection it was opened with, else at the end of the
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
  const last = elements[elements.length - 1];
  const isBlock = elements.some((element) => element.tagName === 'FIGURE');
  let tail: HTMLElement | null = null;

  if (savedSelection && host.contains(savedSelection.commonAncestorContainer)) {
    if (isBlock) tail = insertBlocks(savedSelection, host, elements);
    else {
      const fragment = document.createDocumentFragment();
      elements.forEach((element) => fragment.appendChild(element));
      savedSelection.deleteContents();
      savedSelection.insertNode(fragment);
    }
  } else {
    const end = document.createRange();
    end.selectNodeContents(host);
    end.collapse(false);
    if (isBlock) tail = insertBlocks(end, host, elements);
    else host.appendChild(elements.reduce((fragment, element) => (fragment.appendChild(element), fragment), document.createDocumentFragment()));
  }
  if (!last.isConnected) return false;

  host.focus({ preventScroll: true });
  const selection = window.getSelection();
  if (selection) {
    const after = document.createRange();
    if (tail) after.setStart(tail, 0);
    else after.setStartAfter(last);
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
