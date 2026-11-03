import { flattenToInlines, normalizeInlines, paragraph, type Block, type Doc, type Inline, type ListItemNode, type ListNode, type Mark } from '../ast';
import type { Report } from '../report';

/** Sanity's Portable Text: an array of blocks with spans, decorators and mark definitions. */
export interface PTSpan {
  _type: 'span';
  _key?: string;
  text: string;
  marks?: string[];
}

export interface PTBlock {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Array<PTSpan | Record<string, unknown>>;
  markDefs?: Array<{ _key: string; _type: string; [key: string]: unknown }>;
  [key: string]: unknown;
}

const DECORATORS: Record<string, Mark> = { strong: 'bold', em: 'italic', underline: 'underline', 'strike-through': 'strike', code: 'code', sub: 'subscript', sup: 'superscript', highlight: 'highlight' };
const WRITE_DECORATORS: Record<Mark, string> = { bold: 'strong', italic: 'em', underline: 'underline', strike: 'strike-through', code: 'code', subscript: 'sub', superscript: 'sup', highlight: 'highlight' };
const STANDARD = new Set(['strong', 'em', 'underline', 'strike-through', 'code']);

// ---- reading ----------------------------------------------------------------------------

function readSpans(block: PTBlock, report: Report): Inline[] {
  const defs = new Map((block.markDefs ?? []).map((def) => [def._key, def]));
  const out: Inline[] = [];
  for (const child of block.children ?? []) {
    if (child._type !== 'span') {
      report.warn(`Inline object "${String(child._type)}" was dropped`);
      continue;
    }
    const span = child as PTSpan;
    const marks: Mark[] = [];
    let link: { href: string } | undefined;
    for (const mark of span.marks ?? []) {
      if (DECORATORS[mark]) marks.push(DECORATORS[mark]);
      else {
        const def = defs.get(mark);
        if (def?._type === 'link') link = { href: String(def.href ?? '') };
        else if (def) report.warn(`Annotation "${def._type}" was dropped`);
        else report.warn(`Unknown decorator "${mark}" was dropped`);
      }
    }
    // A newline inside a span is a soft break.
    span.text.split('\n').forEach((part, index) => {
      if (index > 0) out.push({ type: 'break' });
      out.push({ type: 'text', text: part, ...(marks.length ? { marks } : {}), ...(link ? { link } : {}) });
    });
  }
  return normalizeInlines(out);
}

function textBlock(block: PTBlock, report: Report): Block {
  const children = readSpans(block, report);
  const style = block.style ?? 'normal';
  if (/^h[1-6]$/.test(style)) return { type: 'heading', level: Number(style[1]) as 1, children };
  if (style === 'blockquote') return { type: 'blockquote', children: [paragraph(children)] };
  if (style !== 'normal') report.warn(`Block style "${style}" was read as a paragraph`);
  return paragraph(children);
}

export function readPortableText(input: PTBlock[], report: Report): Doc {
  if (!Array.isArray(input)) throw new Error('Expected Portable Text: an array of blocks.');
  const out: Block[] = [];
  // Open lists by level, to rebuild nesting from flat list blocks.
  let stack: ListNode[] = [];

  for (const block of input) {
    if (block._type === 'block' && block.listItem) {
      const level = Math.max(1, Number(block.level ?? 1));
      const ordered = block.listItem === 'number';
      while (stack.length > level) stack.pop();
      if (stack.length === level && stack[level - 1].ordered !== ordered) stack.pop();
      while (stack.length < level) {
        const list: ListNode = { type: 'list', ordered, items: [] };
        const parent = stack[stack.length - 1];
        if (parent) {
          if (parent.items.length === 0) parent.items.push({ children: [] });
          parent.items[parent.items.length - 1].children.push(list);
        } else out.push(list);
        stack.push(list);
      }
      const item: ListItemNode = { children: [paragraph(readSpans(block, report))] };
      if (block.listItem === 'checkbox' || block.checked !== undefined) item.checked = Boolean(block.checked);
      stack[level - 1].items.push(item);
      continue;
    }
    stack = [];
    if (block._type === 'block') {
      const result = textBlock(block, report);
      const previous = out[out.length - 1];
      // Consecutive blockquote blocks are one quote.
      if (result.type === 'blockquote' && previous?.type === 'blockquote') previous.children.push(...result.children);
      else out.push(result);
    } else if (block._type === 'code') {
      out.push({ type: 'code', text: String(block.code ?? ''), ...(block.language ? { language: String(block.language) } : {}) });
    } else if (block._type === 'image') {
      const src = String(block.url ?? (block.asset as { url?: string } | undefined)?.url ?? '');
      if (!src) report.warn('An image that only references a Sanity asset was kept without a URL');
      out.push({ type: 'image', src, ...(block.alt ? { alt: String(block.alt) } : {}) });
    } else if (block._type === 'horizontalRule' || block._type === 'break') {
      out.push({ type: 'rule' });
    } else if (block._type === 'table' && Array.isArray(block.rows)) {
      out.push({
        type: 'table',
        rows: (block.rows as Array<{ cells?: unknown[] }>).map((row, index) => ({
          cells: (row.cells ?? []).map((cell) => ({ ...(index === 0 && block.headerRow ? { header: true } : {}), children: [paragraph([{ type: 'text', text: String(cell ?? '') }])] })),
        })),
      });
    } else {
      report.warn(`Block type "${block._type}" was dropped`);
    }
  }
  return { type: 'doc', children: out };
}

// ---- writing ----------------------------------------------------------------------------

function keyMaker() {
  let counter = 0;
  return () => `k${(counter++).toString(36)}`;
}

function spans(inlines: Inline[], key: () => string, report: Report): Pick<PTBlock, 'children' | 'markDefs'> {
  const markDefs: NonNullable<PTBlock['markDefs']> = [];
  const linkKeys = new Map<string, string>();
  const children: PTSpan[] = [];
  for (const node of inlines) {
    if (node.type === 'break') {
      const last = children[children.length - 1];
      if (last && !last.marks?.length) last.text += '\n';
      else children.push({ _type: 'span', _key: key(), text: '\n', marks: [] });
      continue;
    }
    if (node.type === 'image') {
      report.warn('Inline images were dropped (Portable Text images are blocks)');
      continue;
    }
    const marks = (node.marks ?? []).map((mark) => WRITE_DECORATORS[mark]);
    marks.filter((mark) => !STANDARD.has(mark)).forEach((mark) => report.warn(`"${mark}" is not a standard decorator; add it to your schema's decorators`));
    if (node.link) {
      let linkKey = linkKeys.get(node.link.href);
      if (!linkKey) {
        linkKey = key();
        linkKeys.set(node.link.href, linkKey);
        markDefs.push({ _key: linkKey, _type: 'link', href: node.link.href });
      }
      marks.push(linkKey);
    }
    children.push({ _type: 'span', _key: key(), text: node.text, marks });
  }
  if (children.length === 0) children.push({ _type: 'span', _key: key(), text: '', marks: [] });
  return { children, markDefs };
}

export function writePortableText(doc: Doc, report: Report): PTBlock[] {
  const key = keyMaker();
  const out: PTBlock[] = [];
  const block = (style: string, inlines: Inline[], extra: Partial<PTBlock> = {}): PTBlock => ({ _type: 'block', _key: key(), style, ...extra, ...spans(inlines, key, report) });

  const writeList = (list: ListNode, level: number) => {
    if (list.start && list.start !== 1) report.warn('Portable Text lists have no start number; the numbering restarts at 1');
    for (const item of list.items) {
      const nested = item.children.filter((child): child is ListNode => child.type === 'list');
      const rest = item.children.filter((child) => child.type !== 'list');
      const { inlines, lossy } = flattenToInlines(rest);
      if (lossy || rest.length > 1) report.warn('Portable Text list items hold one block; extra content was joined with line breaks');
      if (item.checked !== undefined) report.warn('Portable Text has no checkboxes; checklist items became bullets');
      out.push(block('normal', inlines, { listItem: list.ordered ? 'number' : 'bullet', level }));
      nested.forEach((child) => writeList(child, level + 1));
    }
  };

  const write = (blocks: Block[], quoted: boolean) => {
    for (const node of blocks) {
      switch (node.type) {
        case 'paragraph':
          out.push(block(quoted ? 'blockquote' : 'normal', node.children));
          break;
        case 'heading':
          if (quoted) report.warn('Headings inside quotes became quote paragraphs');
          out.push(block(quoted ? 'blockquote' : `h${node.level}`, node.children));
          break;
        case 'blockquote':
          write(node.children, true);
          break;
        case 'list':
          if (quoted) report.warn('Lists inside quotes lost the quote');
          writeList(node, 1);
          break;
        case 'code':
          out.push({ _type: 'code', _key: key(), code: node.text, ...(node.language ? { language: node.language } : {}) });
          break;
        case 'rule':
          report.warn('Horizontal rules became "horizontalRule" blocks; add that type to your schema');
          out.push({ _type: 'horizontalRule', _key: key() });
          break;
        case 'image':
          report.warn('Images became { _type: "image", url } blocks; upload them as Sanity assets to use the image type');
          out.push({ _type: 'image', _key: key(), url: node.src, ...(node.alt ? { alt: node.alt } : {}) });
          break;
        case 'table': {
          report.warn('Tables became @sanity/table "table" blocks with plain-text cells');
          out.push({
            _type: 'table',
            _key: key(),
            rows: node.rows.map((row) => ({ _type: 'tableRow', _key: key(), cells: row.cells.map((cell) => flattenToInlines(cell.children).inlines.map((inline) => (inline.type === 'text' ? inline.text : inline.type === 'break' ? '\n' : inline.alt ?? '')).join('')) })),
          });
          break;
        }
      }
    }
  };
  write(doc.children, false);
  return out;
}
