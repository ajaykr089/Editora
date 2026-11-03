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
export const OBJECT_CHAR = '\ufffc';

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
  return data.replace(/[\u00a0\n\r\t]/g, ' ');
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

/** The text of one child of the root, read on its own so it can be cached until that child changes. */
interface Piece {
  text: string;
  /** Offsets relative to the piece. */
  segments: TextSegment[];
  /** The piece starts / ends with a block boundary. */
  breakBefore: boolean;
  breakAfter: boolean;
}

function readPiece(child: Node, root: HTMLElement): Piece {
  const segments: TextSegment[] = [];
  let text = '';
  let pendingBreak = false;
  let breakBefore = false;
  let started = false;

  const push = (value: string) => {
    if (!started) {
      started = true;
      breakBefore = pendingBreak;
    }
    // Checks the last character rather than text.endsWith, which flattens a string grown with +=.
    if (pendingBreak && text && text.charCodeAt(text.length - 1) !== 10) text += '\n';
    pendingBreak = false;
    text += value;
  };

  const visit = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const data = (node as Text).data;
      if (!data) return;
      push('');
      segments.push({ node: node as Text, start: text.length, end: text.length + data.length });
      text += readText(data);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const element = node as HTMLElement;
    if (SKIPPED_TAGS.has(element.tagName) || element.matches(IGNORE_SELECTOR)) return;
    if (element.tagName === 'BR') {
      if (!isPlaceholderBr(element, root)) push('\n');
      return;
    }
    if (OBJECT_TAGS.has(element.tagName) || element.getAttribute('contenteditable') === 'false') {
      push(OBJECT_CHAR);
      return;
    }
    const block = element.matches(BLOCK_SELECTOR);
    if (block) pendingBreak = true;
    for (let inner = element.firstChild; inner; inner = inner.nextSibling) visit(inner);
    if (block) pendingBreak = true;
  };

  visit(child);
  const block = child.nodeType === Node.ELEMENT_NODE && (child as Element).matches(BLOCK_SELECTOR);
  return { text, segments, breakBefore: block || breakBefore, breakAfter: block || pendingBreak };
}

/**
 * Reads the root child by child, reusing the text of children that have not
 * changed since the last read. Feed it MutationObserver records.
 */
export interface DocMapper {
  build(): DocMap;
  invalidate(records: readonly MutationRecord[]): void;
  reset(): void;
}

export function createDocMapper(root: HTMLElement): DocMapper {
  let cache = new Map<Node, Piece>();
  return {
    build() {
      const segments: TextSegment[] = [];
      // Parts joined once at the end: `endsWith` on a string grown with += flattens it every time.
      const parts: string[] = [];
      let length = 0;
      let lastChar = '';
      let pendingBreak = false;
      const next = new Map<Node, Piece>();
      for (let child = root.firstChild; child; child = child.nextSibling) {
        // Only blocks are cached: an inline child's <br> placeholders depend on its siblings.
        const cacheable = child.nodeType === Node.ELEMENT_NODE && (child as Element).matches(BLOCK_SELECTOR);
        const piece = (cacheable && cache.get(child)) || readPiece(child, root);
        if (cacheable) next.set(child, piece);
        if (piece.breakBefore) pendingBreak = true;
        if (piece.text) {
          if (pendingBreak && length && lastChar !== '\n') {
            parts.push('\n');
            length += 1;
          }
          pendingBreak = false;
          const offset = length;
          for (const segment of piece.segments) segments.push({ node: segment.node, start: segment.start + offset, end: segment.end + offset });
          parts.push(piece.text);
          length += piece.text.length;
          lastChar = piece.text[piece.text.length - 1];
        }
        if (piece.breakAfter) pendingBreak = true;
      }
      cache = next;
      return { text: parts.join(''), segments };
    },
    invalidate(records) {
      for (const record of records) {
        let node: Node | null = record.target;
        while (node && node.parentNode !== root && node !== root) node = node.parentNode;
        if (node && node !== root) cache.delete(node);
      }
    },
    reset() {
      cache = new Map();
    },
  };
}

export function buildDocMap(root: HTMLElement): DocMap {
  return createDocMapper(root).build();
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
