/**
 * Read a contenteditable into agent blocks. Ids are handed out in document
 * order for one run; the elements stay in a map, never in the HTML.
 * Pending ai-review suggestions are read as if accepted (struck-out text is
 * skipped), so an agent sees what the document will say.
 */
import { buildTextMap, textBlocks } from '@editora/ai-review';
import { DraftDocument, type Selection } from '../core/draft.js';
import type { BlockType, DocBlock } from '../core/types.js';

export interface EditorSnapshot {
  draft: DraftDocument;
  /** Block element for each original id. */
  elements: Map<string, HTMLElement>;
}

const PENDING_DELETE = 'del.air-del';

export function blockType(element: Element): { type: BlockType; level?: number; ordered?: boolean } {
  const tag = element.tagName;
  if (/^H[1-6]$/.test(tag)) return { type: 'heading', level: Number(tag[1]) };
  if (tag === 'LI') return { type: 'list-item', ordered: element.parentElement?.tagName === 'OL' };
  if (tag === 'PRE') return { type: 'code' };
  if (tag === 'TD' || tag === 'TH') return { type: 'table-cell' };
  if (tag === 'FIGCAPTION' || tag === 'CAPTION') return { type: 'caption' };
  if (tag === 'BLOCKQUOTE' || element.parentElement?.closest('blockquote')) return { type: 'quote' };
  if (tag === 'P' || tag === 'DIV' || tag === 'ADDRESS' || tag === 'DT' || tag === 'DD') return { type: 'paragraph' };
  return { type: 'other' };
}

/** A block's text with pending suggestions read as accepted. */
export function blockText(block: HTMLElement): string {
  const map = buildTextMap(block);
  if (!block.querySelector(PENDING_DELETE)) return map.text;
  let text = '';
  for (const segment of map.segments) {
    if (segment.node.parentElement?.closest(PENDING_DELETE)) continue;
    text += map.text.slice(segment.start, segment.end);
  }
  return text;
}

export function hasPendingSuggestions(root: HTMLElement): boolean {
  return Boolean(root.querySelector('[data-air-hunk]'));
}

function selectionFor(root: HTMLElement, elements: Map<string, HTMLElement>): Selection | null {
  const selection = root.ownerDocument.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.commonAncestorContainer)) return null;
  const ids: string[] = [];
  for (const [id, element] of elements) {
    if (range.collapsed ? element.contains(range.startContainer) : range.intersectsNode(element)) ids.push(id);
  }
  return { text: range.toString(), blockIds: ids };
}

export function readEditor(root: HTMLElement): EditorSnapshot {
  const elements = new Map<string, HTMLElement>();
  const blocks: DocBlock[] = [];
  textBlocks(root).forEach((element, index) => {
    const id = `b${index + 1}`;
    elements.set(id, element);
    blocks.push({ id, ...blockType(element), text: blockText(element) });
  });
  return { draft: new DraftDocument(blocks, selectionFor(root, elements)), elements };
}
