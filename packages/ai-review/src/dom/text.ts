/**
 * Plain-text view of contenteditable blocks, mapped back to DOM nodes so
 * changes computed on text can be applied without touching formatting.
 *
 * One character of text is one character of DOM: text nodes map 1:1 (with
 * non-breaking spaces and source newlines read as spaces) and a <br> is "\n".
 * Uneditable islands (mentions, images, contenteditable="false") and nested
 * blocks are skipped; they stay where they are.
 */

export const BLOCK_SELECTOR = 'p,h1,h2,h3,h4,h5,h6,li,blockquote,pre,td,th,dt,dd,figcaption,caption,div,address';

export interface TextSegment {
  node: Text | HTMLBRElement;
  start: number;
  end: number;
}

export interface TextMap {
  text: string;
  segments: TextSegment[];
}

/** A piece of one block to rewrite: `block`'s text from `start` to `end`. */
export interface ReviewTarget {
  block: HTMLElement;
  start: number;
  end: number;
}

const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'IMG', 'SVG', 'VIDEO', 'AUDIO', 'IFRAME', 'CANVAS', 'MATH', 'INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'OBJECT']);

function isBlock(element: Element): boolean {
  return element.matches(BLOCK_SELECTOR);
}

function isSkipped(element: Element): boolean {
  return SKIPPED_TAGS.has(element.tagName) || element.getAttribute('contenteditable') === 'false' || element.hasAttribute('data-air-ui');
}

export function readText(data: string): string {
  return data.replace(/[\u00a0\n\r\t]/g, ' ');
}

export function buildTextMap(block: HTMLElement): TextMap {
  const segments: TextSegment[] = [];
  let text = '';

  const walk = (parent: Node) => {
    for (let child = parent.firstChild; child; child = child.nextSibling) {
      if (child.nodeType === Node.TEXT_NODE) {
        const data = (child as Text).data;
        if (!data) continue;
        segments.push({ node: child as Text, start: text.length, end: text.length + data.length });
        text += readText(data);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as HTMLElement;
        if (element.tagName === 'BR') {
          segments.push({ node: element as HTMLBRElement, start: text.length, end: text.length + 1 });
          text += '\n';
        } else if (!isSkipped(element) && !isBlock(element)) {
          walk(element);
        }
      }
    }
  };

  walk(block);
  // A trailing <br> is a placeholder that keeps an empty line visible, not content.
  const last = segments[segments.length - 1];
  if (last && last.node.nodeType === Node.ELEMENT_NODE && last.end === text.length) {
    segments.pop();
    text = text.slice(0, -1);
  }
  return { text, segments };
}

/** Blocks inside `root` whose own text (outside nested blocks) is not blank. */
export function textBlocks(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(BLOCK_SELECTOR)).filter(
    (block) => !block.closest('[contenteditable="false"],[data-air-ui]') && buildTextMap(block).text.trim() !== '',
  );
}

/** Text offset of a DOM boundary point inside `block`. */
export function offsetOf(block: HTMLElement, container: Node, offset: number): number {
  const map = buildTextMap(block);
  const probe = document.createRange();
  probe.setStart(container, offset);
  probe.collapse(true);

  for (const segment of map.segments) {
    if (segment.node === container) return segment.start + Math.min(offset, segment.end - segment.start);
    const nodeRange = document.createRange();
    nodeRange.selectNode(segment.node);
    // Boundary is before this segment: it sits at the segment's start.
    if (probe.compareBoundaryPoints(Range.START_TO_START, nodeRange) <= 0) return segment.start;
  }
  return map.text.length;
}

function widenToWords(text: string, start: number, end: number): [number, number] {
  while (start > 0 && /\S/.test(text[start - 1]) && /\S/.test(text[start] ?? ' ')) start -= 1;
  while (end < text.length && /\S/.test(text[end]) && end > 0 && /\S/.test(text[end - 1])) end += 1;
  while (start < end && /\s/.test(text[start])) start += 1;
  while (end > start && /\s/.test(text[end - 1])) end -= 1;
  return [start, end];
}

/**
 * What to rewrite for a selection: the selected text widened to whole words,
 * one target per block. A collapsed selection means the caret's whole block.
 */
export function targetsForRange(root: HTMLElement, range: Range | null): ReviewTarget[] {
  const blocks = textBlocks(root);
  if (!range || !root.contains(range.commonAncestorContainer)) return [];

  const touched = blocks.filter((block) => range.intersectsNode(block) || block.contains(range.startContainer));
  // Keep the innermost blocks only (a <li> rather than the <div> around a list).
  const leaves = touched.filter((block) => !touched.some((other) => other !== block && block.contains(other) && buildTextMap(other).text.trim()));
  const candidates = leaves.length > 0 ? leaves : touched.slice(-1);

  if (range.collapsed) {
    const block = candidates[candidates.length - 1];
    if (!block) return [];
    const { text } = buildTextMap(block);
    const [start, end] = widenToWords(text, 0, text.length);
    return start < end ? [{ block, start, end }] : [];
  }

  const targets: ReviewTarget[] = [];
  for (const block of candidates) {
    const { text } = buildTextMap(block);
    let start = 0;
    let end = text.length;
    if (block.contains(range.startContainer)) start = offsetOf(block, range.startContainer, range.startOffset);
    if (block.contains(range.endContainer)) end = offsetOf(block, range.endContainer, range.endOffset);
    [start, end] = widenToWords(text, start, end);
    if (start < end) targets.push({ block, start, end });
  }
  return targets;
}

export function targetText(target: ReviewTarget): string {
  return buildTextMap(target.block).text.slice(target.start, target.end);
}
