import type { ReviewHunk } from '../core/review';
import { BLOCK_SELECTOR, buildTextMap, readText, type ReviewTarget, type TextSegment } from './text';

export const HUNK_ATTR = 'data-air-hunk';
export const DEL_CLASS = 'air-del';
export const INS_CLASS = 'air-ins';
export const NEW_BLOCK_ATTR = 'data-air-new-block';

/** Escape a value for a double-quoted attribute selector. */
const quote = (value: string) => value.replace(/["\\]/g, '\\$&');

function createMark(tag: 'del' | 'ins', id: string, provisional: boolean): HTMLElement {
  const mark = document.createElement(tag);
  mark.className = tag === 'del' ? DEL_CLASS : INS_CLASS;
  mark.setAttribute(HUNK_ATTR, id);
  if (provisional) mark.setAttribute('data-air-provisional', '');
  return mark;
}

function fillInserted(mark: HTMLElement, text: string): void {
  text.split('\n').forEach((line, index) => {
    if (index > 0) mark.appendChild(document.createElement('br'));
    if (line) mark.appendChild(document.createTextNode(line));
  });
}

/** Wrap `[start, end)` of a block (text offsets) in <del> marks, one per DOM piece; returns the last one. */
function wrapRange(segments: TextSegment[], start: number, end: number, id: string, provisional: boolean): HTMLElement | null {
  let last: HTMLElement | null = null;
  const overlapping = segments.filter((segment) => segment.start < end && segment.end > start);
  // Right to left so splitting a text node never shifts a piece still to come.
  for (let index = overlapping.length - 1; index >= 0; index -= 1) {
    const segment = overlapping[index];
    let piece: Node = segment.node;
    if (segment.node.nodeType === Node.TEXT_NODE) {
      const node = segment.node as Text;
      const from = Math.max(0, start - segment.start);
      const to = Math.min(node.length, end - segment.start);
      if (to < node.length) node.splitText(to);
      piece = from > 0 ? node.splitText(from) : node;
    }
    const mark = createMark('del', id, provisional);
    piece.parentNode!.insertBefore(mark, piece);
    mark.appendChild(piece);
    last ??= mark;
  }
  return last;
}

/** Insert `node` at text offset `at`, after the preceding text so it picks up that text's formatting. */
function insertAt(block: HTMLElement, segments: TextSegment[], at: number, node: Node): void {
  const before = [...segments].reverse().find((segment) => segment.start < at && segment.end >= at);
  if (before) {
    if (before.node.nodeType === Node.TEXT_NODE) {
      const text = before.node as Text;
      const local = at - before.start;
      if (local < text.length) text.splitText(local);
    }
    before.node.parentNode!.insertBefore(node, before.node.nextSibling);
    return;
  }
  const after = segments.find((segment) => segment.start >= at);
  if (after) after.node.parentNode!.insertBefore(node, after.node);
  else block.appendChild(node);
}

/**
 * Mark one target's hunks in the DOM. Offsets in the hunks are relative to
 * the target's text, which starts at `target.start` in its block.
 */
export function markInlineHunks(target: ReviewTarget, hunks: ReviewHunk[]): void {
  const { segments } = buildTextMap(target.block);
  const ordered = [...hunks].sort((a, b) => b.start - a.start);
  for (const hunk of ordered) {
    const start = target.start + hunk.start;
    const end = target.start + hunk.end;
    const lastDeleted = end > start ? wrapRange(segments, start, end, hunk.id, hunk.provisional) : null;
    if (!hunk.inserted) continue;
    const ins = createMark('ins', hunk.id, hunk.provisional);
    fillInserted(ins, hunk.inserted);
    if (lastDeleted) lastDeleted.parentNode!.insertBefore(ins, lastDeleted.nextSibling);
    else insertAt(target.block, segments, start, ins);
  }
}

/** Mark a whole-selection replacement: every target struck out, new paragraphs added after the last one. */
export function markBlockReplacement(targets: ReviewTarget[], hunk: ReviewHunk): void {
  for (const target of targets) {
    const { segments } = buildTextMap(target.block);
    wrapRange(segments, target.start, target.end, hunk.id, false);
  }

  const blocks = hunk.insertedBlocks ?? [hunk.inserted];
  const last = targets[targets.length - 1];
  if (targets.length === 1) {
    // Inside one paragraph the new text stays in that paragraph, lines kept as line breaks.
    const ins = createMark('ins', hunk.id, false);
    fillInserted(ins, blocks.join('\n'));
    const { segments } = buildTextMap(last.block);
    const marks = last.block.querySelectorAll(`del[${HUNK_ATTR}="${quote(hunk.id)}"]`);
    const anchor = marks[marks.length - 1];
    if (anchor) anchor.parentNode!.insertBefore(ins, anchor.nextSibling);
    else insertAt(last.block, segments, last.end, ins);
    return;
  }

  let anchor: Element = last.block;
  for (const text of blocks) {
    const block = document.createElement(last.block.tagName === 'LI' ? 'li' : targets[0].block.tagName.toLowerCase());
    block.setAttribute(NEW_BLOCK_ATTR, hunk.id);
    const ins = createMark('ins', hunk.id, false);
    fillInserted(ins, text);
    block.appendChild(ins);
    anchor.parentNode!.insertBefore(block, anchor.nextSibling);
    anchor = block;
  }
}

export function marksFor(root: ParentNode, id: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(`[${HUNK_ATTR}="${quote(id)}"]`));
}

function markText(marks: HTMLElement[]): string {
  return marks
    .map((mark) => {
      let text = '';
      mark.childNodes.forEach(function collect(node: ChildNode) {
        if (node.nodeType === Node.TEXT_NODE) text += readText((node as Text).data);
        else if ((node as Element).tagName === 'BR') text += '\n';
        else node.childNodes.forEach(collect);
      });
      return text;
    })
    .join('');
}

/** True when the marked text no longer matches the suggestion (someone edited inside it). */
export function isStale(root: ParentNode, hunk: ReviewHunk): boolean {
  const marks = marksFor(root, hunk.id);
  const deleted = marks.filter((mark) => mark.classList.contains(DEL_CLASS));
  const inserted = marks.filter((mark) => mark.classList.contains(INS_CLASS));
  if (marks.length === 0) return true;

  if (hunk.kind === 'blocks') {
    const expected = (hunk.insertedBlocks ?? [hunk.inserted]).join('');
    return markText(inserted).replace(/\n/g, '') !== expected.replace(/\n/g, '');
  }
  return markText(deleted) !== hunk.deleted || markText(inserted) !== hunk.inserted;
}

function unwrap(element: Element): void {
  const parent = element.parentNode;
  if (!parent) return;
  while (element.firstChild) parent.insertBefore(element.firstChild, element);
  parent.removeChild(element);
}

function removeEmptyNewBlock(mark: Element): void {
  const block = mark.closest(`[${NEW_BLOCK_ATTR}]`);
  mark.remove();
  if (block && !block.textContent?.trim()) block.remove();
}

/** Keep the suggestion: drop the struck-out text, keep the new text. */
export function applyHunk(root: ParentNode, id: string): void {
  for (const mark of marksFor(root, id)) {
    if (mark.classList.contains(DEL_CLASS)) {
      const block = mark.closest(BLOCK_SELECTOR);
      let parent = mark.parentElement;
      mark.remove();
      // Formatting wrappers left empty (<strong></strong>) go too.
      while (parent && parent !== block && !parent.hasChildNodes()) {
        const next: HTMLElement | null = parent.parentElement;
        parent.remove();
        parent = next;
      }
      // A paragraph the suggestion emptied completely goes away with it.
      if (block && block.matches('p,li,h1,h2,h3,h4,h5,h6') && !block.textContent?.trim() && !block.querySelector('img,video,iframe,[contenteditable="false"]')) {
        block.remove();
      }
    } else {
      unwrap(mark);
    }
  }
  for (const block of Array.from(root.querySelectorAll(`[${NEW_BLOCK_ATTR}="${quote(id)}"]`))) {
    block.removeAttribute(NEW_BLOCK_ATTR);
  }
}

/** Keep the original: restore the struck-out text, drop the new text. With `keepEdited`, new text someone edited is kept. */
export function revertHunk(root: ParentNode, hunk: ReviewHunk, keepEdited = false): void {
  for (const mark of marksFor(root, hunk.id)) {
    if (mark.classList.contains(DEL_CLASS)) unwrap(mark);
    else if (keepEdited && markText([mark]) !== hunk.inserted) unwrap(mark);
    else removeEmptyNewBlock(mark);
  }
  for (const block of Array.from(root.querySelectorAll(`[${NEW_BLOCK_ATTR}="${quote(hunk.id)}"]`))) {
    if (block.textContent?.trim()) block.removeAttribute(NEW_BLOCK_ATTR);
    else block.remove();
  }
}

/**
 * HTML of `root` as if every open suggestion were rejected. Use it to save
 * while a review is still open.
 */
export function htmlWithoutSuggestions(root: HTMLElement): string {
  const copy = root.cloneNode(true) as HTMLElement;
  copy.querySelectorAll('[data-air-ui]').forEach((element) => element.remove());
  copy.querySelectorAll(`[${NEW_BLOCK_ATTR}]`).forEach((element) => element.remove());
  copy.querySelectorAll(`ins.${INS_CLASS}`).forEach((element) => element.remove());
  copy.querySelectorAll(`del.${DEL_CLASS}`).forEach((element) => unwrap(element));
  copy.querySelectorAll('[data-air-active-block]').forEach((element) => element.removeAttribute('data-air-active-block'));
  copy.normalize();
  return copy.innerHTML;
}
