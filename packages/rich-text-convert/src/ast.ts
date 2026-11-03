/**
 * The shared document model every format converts through. It covers what
 * the common rich-text editors have in common; anything a format cannot hold
 * is reported, never silently dropped.
 */

export type Mark = 'bold' | 'italic' | 'underline' | 'strike' | 'code' | 'subscript' | 'superscript' | 'highlight';

export const MARKS: Mark[] = ['bold', 'italic', 'underline', 'strike', 'code', 'subscript', 'superscript', 'highlight'];

export interface Link {
  href: string;
  title?: string;
}

export interface TextNode {
  type: 'text';
  text: string;
  marks?: Mark[];
  /** Links are a property of text, so a link can span text with different marks. */
  link?: Link;
}

export interface BreakNode {
  type: 'break';
}

export interface ImageNode {
  type: 'image';
  src: string;
  alt?: string;
  title?: string;
}

export type Inline = TextNode | BreakNode | ImageNode;

export interface ParagraphNode {
  type: 'paragraph';
  children: Inline[];
}

export interface HeadingNode {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: Inline[];
}

export interface BlockquoteNode {
  type: 'blockquote';
  children: Block[];
}

export interface ListItemNode {
  children: Block[];
  /** Task lists: true/false; plain lists: undefined. */
  checked?: boolean;
}

export interface ListNode {
  type: 'list';
  ordered: boolean;
  start?: number;
  items: ListItemNode[];
}

export interface CodeNode {
  type: 'code';
  text: string;
  language?: string;
}

export interface RuleNode {
  type: 'rule';
}

export interface TableCellNode {
  header?: boolean;
  colspan?: number;
  rowspan?: number;
  children: Block[];
}

export interface TableNode {
  type: 'table';
  rows: Array<{ cells: TableCellNode[] }>;
}

export type Block = ParagraphNode | HeadingNode | BlockquoteNode | ListNode | CodeNode | RuleNode | ImageNode | TableNode;

export interface Doc {
  type: 'doc';
  children: Block[];
}

// ---- helpers ------------------------------------------------------------------------

export const text = (value: string, marks?: Mark[], link?: Link): TextNode => {
  const node: TextNode = { type: 'text', text: value };
  if (marks && marks.length) node.marks = sortMarks(marks);
  if (link) node.link = link;
  return node;
};

export const paragraph = (children: Inline[] = []): ParagraphNode => ({ type: 'paragraph', children });

export function sortMarks(marks: Mark[]): Mark[] {
  return MARKS.filter((mark) => marks.includes(mark));
}

const sameLink = (a?: Link, b?: Link) => (a?.href ?? null) === (b?.href ?? null) && (a?.title ?? null) === (b?.title ?? null);
const sameMarks = (a?: Mark[], b?: Mark[]) => (a ?? []).join() === (b ?? []).join();

/** Merge neighbouring text with the same formatting and drop empty text. */
export function normalizeInlines(inlines: Inline[]): Inline[] {
  const out: Inline[] = [];
  for (const node of inlines) {
    if (node.type === 'text') {
      if (!node.text) continue;
      const previous = out[out.length - 1];
      if (previous?.type === 'text' && sameMarks(previous.marks, node.marks) && sameLink(previous.link, node.link)) {
        previous.text += node.text;
        continue;
      }
      const copy: TextNode = { type: 'text', text: node.text };
      if (node.marks?.length) copy.marks = sortMarks(node.marks);
      if (node.link) copy.link = { ...node.link };
      out.push(copy);
    } else {
      out.push({ ...node });
    }
  }
  return out;
}

/** Deep-normalize a document so documents that mean the same thing compare equal. */
export function normalize(doc: Doc): Doc {
  const block = (node: Block): Block => {
    switch (node.type) {
      case 'paragraph': {
        const children = normalizeInlines(node.children);
        // A paragraph holding only an image is a block image: formats disagree on which they write.
        return children.length === 1 && children[0].type === 'image' ? block(children[0]) : { type: 'paragraph', children };
      }
      case 'heading':
        return { ...node, children: normalizeInlines(node.children) };
      case 'blockquote':
        return { type: 'blockquote', children: node.children.map(block) };
      case 'list': {
        const list: ListNode = { type: 'list', ordered: node.ordered, items: node.items.map((item) => {
          const copy: ListItemNode = { children: item.children.map(block) };
          if (item.checked !== undefined) copy.checked = item.checked;
          return copy;
        }) };
        if (node.ordered && node.start !== undefined && node.start !== 1) list.start = node.start;
        return list;
      }
      case 'table':
        return {
          type: 'table',
          rows: node.rows.map((row) => ({
            cells: row.cells.map((cell) => {
              const copy: TableCellNode = { children: cell.children.map(block) };
              if (cell.header) copy.header = true;
              if (cell.colspan && cell.colspan > 1) copy.colspan = cell.colspan;
              if (cell.rowspan && cell.rowspan > 1) copy.rowspan = cell.rowspan;
              return copy;
            }),
          })),
        };
      case 'code': {
        const code: CodeNode = { type: 'code', text: node.text };
        if (node.language) code.language = node.language;
        return code;
      }
      case 'image': {
        const image: ImageNode = { type: 'image', src: node.src };
        if (node.alt) image.alt = node.alt;
        if (node.title) image.title = node.title;
        return image;
      }
      default:
        return { ...node };
    }
  };
  return { type: 'doc', children: doc.children.map(block) };
}

/** Plain text of inline content (for formats that cannot hold structure there). */
export function inlineText(inlines: Inline[]): string {
  return inlines.map((node) => (node.type === 'text' ? node.text : node.type === 'break' ? '\n' : node.alt ?? '')).join('');
}

/** Inline content of a block list, joining paragraphs with line breaks (for cells and items of flat formats). */
export function flattenToInlines(blocks: Block[]): { inlines: Inline[]; lossy: boolean } {
  const inlines: Inline[] = [];
  let lossy = false;
  blocks.forEach((child, index) => {
    if (index > 0) inlines.push({ type: 'break' });
    if (child.type === 'paragraph' || child.type === 'heading') {
      inlines.push(...child.children);
      if (child.type === 'heading') lossy = true;
    } else if (child.type === 'image') {
      inlines.push(child);
    } else {
      lossy = true;
      const flat = child.type === 'code' ? [text(child.text, ['code'])] : child.type === 'rule' ? [] : flattenToInlines(blockChildren(child)).inlines;
      inlines.push(...flat);
    }
  });
  return { inlines, lossy };
}

function blockChildren(block: Block): Block[] {
  if (block.type === 'blockquote') return block.children;
  if (block.type === 'list') return block.items.flatMap((item) => item.children);
  if (block.type === 'table') return block.rows.flatMap((row) => row.cells.flatMap((cell) => cell.children));
  return [];
}
