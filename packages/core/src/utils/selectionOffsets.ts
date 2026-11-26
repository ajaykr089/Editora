/**
 * The selection as character offsets of an element's text, so it can be put back after the element's content has
 * been replaced (the nodes it pointed into are gone by then).
 */

export interface TextOffsets {
  start: number;
  end: number;
}

function textOffset(root: HTMLElement, node: Node, offset: number): number {
  const range = document.createRange();
  range.selectNodeContents(root);
  range.setEnd(node, offset);
  return range.toString().length;
}

function pointAt(root: HTMLElement, offset: number): { node: Node; offset: number } {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = Math.max(0, offset);
  let last: Text | null = null;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node as Text;
    last = text;
    if (remaining <= text.data.length) return { node: text, offset: remaining };
    remaining -= text.data.length;
  }
  return last ? { node: last, offset: last.data.length } : { node: root, offset: root.childNodes.length };
}

/** The selection inside `root` as character offsets of its text, or null when the selection is elsewhere. */
export function saveSelectionOffsets(root: HTMLElement): TextOffsets | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) return null;
  try {
    return {
      start: textOffset(root, range.startContainer, range.startOffset),
      end: textOffset(root, range.endContainer, range.endOffset),
    };
  } catch {
    return null;
  }
}

/** Puts a selection saved by `saveSelectionOffsets` back on the same characters of the (replaced) content. */
export function restoreSelectionOffsets(root: HTMLElement, offsets: TextOffsets | null): void {
  const selection = window.getSelection();
  if (!offsets || !selection) return;
  try {
    const start = pointAt(root, offsets.start);
    const end = offsets.end === offsets.start ? start : pointAt(root, offsets.end);
    const range = document.createRange();
    range.setStart(start.node, start.offset);
    range.setEnd(end.node, end.offset);
    selection.removeAllRanges();
    selection.addRange(range);
  } catch {
    // The text changed too much to find the same place again; leave the browser's caret.
  }
}
