import { normalizeInlines, paragraph, type Block, type Doc, type Inline, type Link, type Mark, type TableCellNode } from '../ast';
import type { Report } from '../report';

/**
 * Slate has no fixed schema. `slate` uses the element names from Slate's own
 * examples (heading-one, bulleted-list, block-quote...); `plate` uses Plate's
 * plugin keys (p, h1, ul, lic, code_block...). Reading accepts both.
 */
export type SlateFlavor = 'slate' | 'plate';

export interface SlateNode {
  type?: string;
  text?: string;
  children?: SlateNode[];
  [key: string]: unknown;
}

const LEAF_MARKS: Record<string, Mark> = {
  bold: 'bold', italic: 'italic', underline: 'underline', strikethrough: 'strike', strike: 'strike', code: 'code',
  subscript: 'subscript', superscript: 'superscript', highlight: 'highlight',
};
const WRITE_MARKS: Record<Mark, string> = {
  bold: 'bold', italic: 'italic', underline: 'underline', strike: 'strikethrough', code: 'code',
  subscript: 'subscript', superscript: 'superscript', highlight: 'highlight',
};
const HEADINGS = ['heading-one', 'heading-two', 'heading-three', 'heading-four', 'heading-five', 'heading-six'];

const NAMES = {
  slate: { p: 'paragraph', quote: 'block-quote', ul: 'bulleted-list', ol: 'numbered-list', li: 'list-item', code: 'code-block', line: 'code-line', hr: 'horizontal-rule', img: 'image', a: 'link', table: 'table', tr: 'table-row', td: 'table-cell', th: 'table-cell' },
  plate: { p: 'p', quote: 'blockquote', ul: 'ul', ol: 'ol', li: 'li', code: 'code_block', line: 'code_line', hr: 'hr', img: 'img', a: 'a', table: 'table', tr: 'tr', td: 'td', th: 'th' },
};

// ---- reading ----------------------------------------------------------------------------

const isText = (node: SlateNode) => typeof node.text === 'string' && !node.type;

function readInlines(nodes: SlateNode[] = [], report: Report, link?: Link): Inline[] {
  const out: Inline[] = [];
  for (const node of nodes) {
    if (isText(node)) {
      const marks = Object.keys(LEAF_MARKS).filter((key) => node[key] === true).map((key) => LEAF_MARKS[key]);
      // Soft breaks are newlines inside text.
      String(node.text).split('\n').forEach((part, index) => {
        if (index > 0) out.push({ type: 'break' });
        out.push({ type: 'text', text: part, ...(marks.length ? { marks: [...new Set(marks)] } : {}), ...(link ? { link } : {}) });
      });
    } else if (node.type === 'link' || node.type === 'a') {
      out.push(...readInlines(node.children, report, { href: String(node.url ?? node.href ?? ''), ...(node.title ? { title: String(node.title) } : {}) }));
    } else if (node.type === 'image' || node.type === 'img') {
      out.push({ type: 'image', src: String(node.url ?? node.src ?? ''), ...(node.alt ? { alt: String(node.alt) } : {}) });
    } else if (node.type === 'mention') {
      out.push({ type: 'text', text: `@${String(node.value ?? node.character ?? '')}` });
    } else if (node.children) {
      report.warn(`Unsupported inline element "${node.type}" was unwrapped`);
      out.push(...readInlines(node.children, report, link));
    }
  }
  return normalizeInlines(out);
}

const listTypes = new Set(['bulleted-list', 'numbered-list', 'ul', 'ol']);

function readBlocks(nodes: SlateNode[] = [], report: Report): Block[] {
  const out: Block[] = [];
  for (const node of nodes) {
    const type = node.type ?? 'paragraph';
    if (isText(node)) {
      out.push(paragraph(readInlines([node], report)));
      continue;
    }
    if (type === 'paragraph' || type === 'p') {
      const inlines = readInlines(node.children, report);
      out.push(inlines.length === 1 && inlines[0].type === 'image' ? inlines[0] : paragraph(inlines));
    } else if (HEADINGS.includes(type) || /^h[1-6]$/.test(type)) {
      const level = HEADINGS.includes(type) ? HEADINGS.indexOf(type) + 1 : Number(type[1]);
      out.push({ type: 'heading', level: level as 1, children: readInlines(node.children, report) });
    } else if (type === 'block-quote' || type === 'blockquote') {
      const children = node.children ?? [];
      out.push({ type: 'blockquote', children: children.every((child) => isText(child) || ['link', 'a'].includes(String(child.type))) ? [paragraph(readInlines(children, report))] : readBlocks(children, report) });
    } else if (listTypes.has(type)) {
      const ordered = type === 'numbered-list' || type === 'ol';
      out.push({
        type: 'list',
        ordered,
        items: (node.children ?? []).map((item) => {
          const children: Block[] = [];
          let inline: SlateNode[] = [];
          const flush = () => {
            if (inline.length) children.push(paragraph(readInlines(inline, report)));
            inline = [];
          };
          for (const child of item.children ?? []) {
            if (child.type === 'lic') children.push(paragraph(readInlines(child.children, report)));
            else if (isText(child) || child.type === 'link' || child.type === 'a') inline.push(child);
            else {
              flush();
              children.push(...readBlocks([child], report));
            }
          }
          flush();
          return { children: children.length ? children : [paragraph()], ...(item.checked !== undefined ? { checked: Boolean(item.checked) } : {}) };
        }),
      });
    } else if (type === 'check-list-item' || type === 'action_item' || type === 'todo_li') {
      // Checklists are flat item elements: group consecutive ones into one list.
      const previous = out[out.length - 1];
      const item = { children: [paragraph(readInlines(node.children, report))], checked: Boolean(node.checked) };
      if (previous?.type === 'list' && previous.items.every((entry) => entry.checked !== undefined)) previous.items.push(item);
      else out.push({ type: 'list', ordered: false, items: [item] });
    } else if (type === 'code-block' || type === 'code_block' || type === 'code') {
      const lines = (node.children ?? []).map((line) => (isText(line) ? String(line.text) : (line.children ?? []).map((leaf) => String(leaf.text ?? '')).join('')));
      out.push({ type: 'code', text: lines.join('\n'), ...(node.lang || node.language ? { language: String(node.lang ?? node.language) } : {}) });
    } else if (type === 'horizontal-rule' || type === 'hr' || type === 'divider') {
      out.push({ type: 'rule' });
    } else if (type === 'image' || type === 'img') {
      out.push({ type: 'image', src: String(node.url ?? node.src ?? ''), ...(node.alt ? { alt: String(node.alt) } : {}) });
    } else if (type === 'table') {
      out.push({
        type: 'table',
        rows: (node.children ?? []).map((row) => ({
          cells: (row.children ?? []).map((cell) => {
            const children = cell.children ?? [];
            const blocks = children.every((child) => isText(child)) ? [paragraph(readInlines(children, report))] : readBlocks(children, report);
            const result: TableCellNode = { children: blocks };
            if (cell.type === 'th' || cell.header === true) result.header = true;
            const colspan = Number(cell.colSpan ?? cell.colspan ?? 1);
            if (colspan > 1) result.colspan = colspan;
            return result;
          }),
        })),
      });
    } else if (node.children) {
      report.warn(`Unsupported element "${type}" was unwrapped`);
      out.push(...readBlocks(node.children, report));
    }
  }
  return out;
}

export function readSlate(input: SlateNode[] | { children: SlateNode[] }, report: Report): Doc {
  const nodes = Array.isArray(input) ? input : input?.children;
  if (!Array.isArray(nodes)) throw new Error('Expected a Slate/Plate value: an array of elements.');
  return { type: 'doc', children: readBlocks(nodes, report) };
}

// ---- writing ----------------------------------------------------------------------------

function leaf(node: Extract<Inline, { type: 'text' }>): SlateNode {
  const out: SlateNode = { text: node.text };
  for (const mark of node.marks ?? []) out[WRITE_MARKS[mark]] = true;
  return out;
}

function writeInlines(inlines: Inline[], flavor: SlateFlavor): SlateNode[] {
  const names = NAMES[flavor];
  const out: SlateNode[] = [];
  let index = 0;
  while (index < inlines.length) {
    const node = inlines[index];
    if (node.type === 'text' && node.link) {
      const group: SlateNode[] = [];
      while (index < inlines.length) {
        const next = inlines[index];
        if (next.type !== 'text' || next.link?.href !== node.link.href) break;
        group.push(leaf(next));
        index += 1;
      }
      out.push({ type: names.a, url: node.link.href, ...(node.link.title ? { title: node.link.title } : {}), children: group });
      continue;
    }
    index += 1;
    if (node.type === 'text') out.push(leaf(node));
    else if (node.type === 'break') {
      // Slate's convention for a soft break is a newline in the text.
      const previous = out[out.length - 1];
      if (previous && typeof previous.text === 'string') previous.text += '\n';
      else out.push({ text: '\n' });
    } else out.push({ type: names.img, url: node.src, ...(node.alt ? { alt: node.alt } : {}), children: [{ text: '' }] });
  }
  // Every element needs a text child, and inline elements need text around them.
  if (out.length === 0 || out[0].type) out.unshift({ text: '' });
  if (out[out.length - 1].type) out.push({ text: '' });
  return out;
}

function writeBlocks(blocks: Block[], flavor: SlateFlavor, report: Report): SlateNode[] {
  const names = NAMES[flavor];
  const out: SlateNode[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        out.push({ type: names.p, children: writeInlines(block.children, flavor) });
        break;
      case 'heading':
        out.push({ type: flavor === 'plate' ? `h${block.level}` : HEADINGS[block.level - 1], children: writeInlines(block.children, flavor) });
        break;
      case 'blockquote':
        out.push({ type: names.quote, children: writeBlocks(block.children, flavor, report) });
        break;
      case 'list': {
        const task = block.items.some((item) => item.checked !== undefined);
        if (task && flavor === 'slate') {
          for (const item of block.items) {
            const first = item.children[0];
            out.push({ type: 'check-list-item', checked: Boolean(item.checked), children: writeInlines(first && (first.type === 'paragraph' || first.type === 'heading') ? first.children : [], flavor) });
            if (item.children.length > 1) report.warn('Slate check-list items hold one line; extra content was dropped');
          }
          break;
        }
        if (task) report.warn('Plate list checkboxes were dropped (Plate stores to-dos as separate "action_item" blocks)');
        out.push({
          type: block.ordered ? names.ol : names.ul,
          children: block.items.map((item) => ({
            type: names.li,
            children: item.children.flatMap((child) =>
              child.type === 'paragraph' ? [flavor === 'plate' ? { type: 'lic', children: writeInlines(child.children, flavor) } : { type: names.p, children: writeInlines(child.children, flavor) }] : writeBlocks([child], flavor, report),
            ),
          })),
        });
        if (block.start && block.start !== 1) report.warn('Slate lists have no start number; the numbering restarts at 1');
        break;
      }
      case 'code':
        out.push({
          type: names.code,
          ...(block.language ? { lang: block.language } : {}),
          children: block.text.split('\n').map((line) => ({ type: names.line, children: [{ text: line }] })),
        });
        break;
      case 'rule':
        out.push({ type: names.hr, children: [{ text: '' }] });
        break;
      case 'image':
        out.push({ type: names.img, url: block.src, ...(block.alt ? { alt: block.alt } : {}), children: [{ text: '' }] });
        break;
      case 'table':
        out.push({
          type: names.table,
          children: block.rows.map((row) => ({
            type: names.tr,
            children: row.cells.map((cell) => ({
              type: cell.header ? names.th : names.td,
              ...(flavor === 'slate' && cell.header ? { header: true } : {}),
              ...(cell.colspan ? { colSpan: cell.colspan } : {}),
              ...(cell.rowspan ? { rowSpan: cell.rowspan } : {}),
              children: writeBlocks(cell.children.length ? cell.children : [paragraph()], flavor, report),
            })),
          })),
        });
        break;
    }
  }
  return out;
}

export function writeSlate(doc: Doc, report: Report, flavor: SlateFlavor = 'slate'): SlateNode[] {
  const out = writeBlocks(doc.children, flavor, report);
  return out.length ? out : [{ type: NAMES[flavor].p, children: [{ text: '' }] }];
}
