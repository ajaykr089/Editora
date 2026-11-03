/**
 * Plain-text view of a whole contenteditable, mapped back to its text nodes.
 *
 * Text nodes map 1:1 (non-breaking spaces and source newlines read as
 * spaces), a <br> is "\n", block boundaries are "\n", and an uneditable
 * island (mention, image, contenteditable="false") is one U+FFFC. Editor UI
 * marked `data-authorship-ignore` or `data-air-ui` is skipped entirely.
 */

export const BLOCK_SELECTOR = 'p,h1,h2,h3,h4,h5,h6,li,ul,ol,blockquote,pre,td,th,tr,table,dt,dd,dl,figure,figcaption,caption,div,address,section,article,header,footer,hr';
export const IGNORE_SELECTOR = '[data-authorship-ignore],[data-air-ui]';
export const OBJECT_CHAR = '￼';

const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEMPLATE']);
const OBJECT_TAGS = new Set(['IMG', 'SVG', 'VIDEO', 'AUDIO', 'IFRAME', 'CANVAS', 'MATH', 'INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'OBJECT', 'EMBED']);

export interface TextSegment {
  node: Text;
  start: number;
  end: number;
}

export interface DocMap {
  text: string;
  segments: TextSegment[];
}

export function readText(data: string): string {
  return data.replace(/[ \n\r\t]/g, ' ');
}

/** A <br> with nothing after it in its block only keeps an empty line open. */
function isPlaceholderBr(br: Element, root: Element): boolean {
  let node: Node | null = br;
  while (node && node !== root) {
    for (let next = node.nextSibling; next; next = next.nextSibling) {
      if (next.nodeType === Node.TEXT_NODE ? (next as Text).data !== '' : next.nodeType === Node.ELEMENT_NODE) return false;
    }
    const parent: Element | null = node.parentElement;
    if (!parent || parent === root || parent.matches(BLOCK_SELECTOR)) return true;
    node = parent;
  }
  return true;
}

export function buildDocMap(root: HTMLElement): DocMap {
  const segments: TextSegment[] = [];
  let text = '';
  let pendingBreak = false;

  const push = (value: string) => {
    if (pendingBreak && text && !text.endsWith('\n')) text += '\n';
    pendingBreak = false;
    text += value;
  };

  const walk = (parent: Node) => {
    for (let child = parent.firstChild; child; child = child.nextSibling) {
      if (child.nodeType === Node.TEXT_NODE) {
        const data = (child as Text).data;
        if (!data) continue;
        push('');
        segments.push({ node: child as Text, start: text.length, end: text.length + data.length });
        text += readText(data);
        continue;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) continue;
      const element = child as HTMLElement;
      if (SKIPPED_TAGS.has(element.tagName) || element.matches(IGNORE_SELECTOR)) continue;
      if (element.tagName === 'BR') {
        if (!isPlaceholderBr(element, root)) push('\n');
        continue;
      }
      if (OBJECT_TAGS.has(element.tagName) || element.getAttribute('contenteditable') === 'false') {
        push(OBJECT_CHAR);
        continue;
      }
      const block = element.matches(BLOCK_SELECTOR);
      if (block) pendingBreak = true;
      walk(element);
      if (block) pendingBreak = true;
    }
  };

  walk(root);
  return { text, segments };
}

/** Index of the last segment starting at or before `offset`. */
function segmentIndex(map: DocMap, offset: number): number {
  let lo = 0;
  let hi = map.segments.length - 1;
  let found = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (map.segments[mid].start <= offset) {
      found = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}

/** Text offset of a DOM boundary point (selection, target range) inside the mapped root. */
export function offsetOfPoint(map: DocMap, container: Node, offset: number): number {
  if (container.nodeType === Node.TEXT_NODE) {
    const segment = map.segments.find((candidate) => candidate.node === container);
    if (segment) return segment.start + Math.min(offset, segment.end - segment.start);
  }
  const doc = container.ownerDocument ?? document;
  const probe = doc.createRange();
  try {
    probe.setStart(container, offset);
  } catch {
    return map.text.length;
  }
  probe.collapse(true);
  // First segment at or after the point.
  let lo = 0;
  let hi = map.segments.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const cmp = probe.comparePoint(map.segments[mid].node, 0);
    if (cmp < 0) lo = mid + 1;
    else hi = mid;
  }
  if (lo === map.segments.length) return map.text.length;
  const next = map.segments[lo];
  // A point at the end of a block belongs to that block's text, not to the next block's start.
  const prev = map.segments[lo - 1];
  if (prev && next.start > prev.end) {
    const element = container.nodeType === Node.ELEMENT_NODE ? (container as Element) : container.parentElement;
    const block = element?.closest(BLOCK_SELECTOR);
    if (block && block.contains(prev.node) && !block.contains(next.node)) return prev.end;
  }
  return next.start;
}

/** DOM point for a text offset; `bias` picks the segment when the offset sits between two. */
export function pointAt(map: DocMap, offset: number, bias: 'start' | 'end'): { node: Text; offset: number } | null {
  if (!map.segments.length) return null;
  const index = segmentIndex(map, offset);
  if (index < 0) return { node: map.segments[0].node, offset: 0 };
  const segment = map.segments[index];
  const next = map.segments[index + 1];
  // A range starting at (or in the gap after) the end of a text node starts in the next one.
  if (bias === 'start' && offset >= segment.end && next) return { node: next.node, offset: 0 };
  return { node: segment.node, offset: Math.min(offset, segment.end) - segment.start };
}

/** A DOM range for text `[start, end)`, or null when it covers no text node. */
export function rangeFor(map: DocMap, start: number, end: number): Range | null {
  const from = pointAt(map, start, 'start');
  const to = pointAt(map, end, 'end');
  if (!from || !to) return null;
  const range = from.node.ownerDocument.createRange();
  try {
    range.setStart(from.node, from.offset);
    range.setEnd(to.node, to.offset);
  } catch {
    return null;
  }
  return range.collapsed ? null : range;
}

/** Text offsets of a selection range. */
export function offsetsOfRange(map: DocMap, range: Range): [number, number] {
  return [offsetOfPoint(map, range.startContainer, range.startOffset), offsetOfPoint(map, range.endContainer, range.endOffset)];
}
