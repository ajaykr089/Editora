import { normalizeInlines, paragraph, type Block, type Doc, type Inline, type Link, type Mark, type TableCellNode } from '../ast';
import type { Report } from '../report';

/**
 * Tiptap and ProseMirror JSON. `tiptap` uses Tiptap's StarterKit names
 * (bulletList, codeBlock, bold...); `prosemirror` uses prosemirror-schema-basic
 * and -list names (bullet_list, code_block, strong...). Reading accepts both.
 */
export type ProseMirrorFlavor = 'tiptap' | 'prosemirror';

export interface PMNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: PMNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

const READ_MARKS: Record<string, Mark> = {
  bold: 'bold', strong: 'bold', italic: 'italic', em: 'italic', underline: 'underline', strike: 'strike',
  strikethrough: 'strike', code: 'code', subscript: 'subscript', superscript: 'superscript', highlight: 'highlight',
};

const NAMES = {
  tiptap: {
    bulletList: 'bulletList', orderedList: 'orderedList', listItem: 'listItem', taskList: 'taskList', taskItem: 'taskItem',
    codeBlock: 'codeBlock', rule: 'horizontalRule', hardBreak: 'hardBreak', bold: 'bold', italic: 'italic',
  },
  prosemirror: {
    bulletList: 'bullet_list', orderedList: 'ordered_list', listItem: 'list_item', taskList: 'bullet_list', taskItem: 'list_item',
    codeBlock: 'code_block', rule: 'horizontal_rule', hardBreak: 'hard_break', bold: 'strong', italic: 'em',
  },
};

// ---- reading ----------------------------------------------------------------------------

function readInlineContent(nodes: PMNode[] = [], report: Report): Inline[] {
  const out: Inline[] = [];
  for (const node of nodes) {
    if (node.type === 'text') {
      const marks: Mark[] = [];
      let link: Link | undefined;
      for (const mark of node.marks ?? []) {
        if (mark.type === 'link') link = { href: String(mark.attrs?.href ?? ''), ...(mark.attrs?.title ? { title: String(mark.attrs.title) } : {}) };
        else if (READ_MARKS[mark.type]) marks.push(READ_MARKS[mark.type]);
        else report.warn(`Unsupported mark "${mark.type}" was dropped`);
      }
      out.push({ type: 'text', text: node.text ?? '', ...(marks.length ? { marks } : {}), ...(link ? { link } : {}) });
    } else if (node.type === 'hardBreak' || node.type === 'hard_break') out.push({ type: 'break' });
    else if (node.type === 'image') out.push(image(node));
    else if (node.type === 'mention') out.push({ type: 'text', text: `@${String(node.attrs?.label ?? node.attrs?.id ?? '')}` });
    else report.warn(`Unsupported inline node "${node.type}" was dropped`);
  }
  return normalizeInlines(out);
}

function image(node: PMNode): Inline & Block {
  const attrs = node.attrs ?? {};
  return { type: 'image', src: String(attrs.src ?? ''), ...(attrs.alt ? { alt: String(attrs.alt) } : {}), ...(attrs.title ? { title: String(attrs.title) } : {}) };
}

function readBlockContent(nodes: PMNode[] = [], report: Report): Block[] {
  const out: Block[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case 'paragraph':
        out.push(paragraph(readInlineContent(node.content, report)));
        break;
      case 'heading':
        out.push({ type: 'heading', level: Math.min(6, Math.max(1, Number(node.attrs?.level ?? 1))) as 1, children: readInlineContent(node.content, report) });
        break;
      case 'blockquote':
        out.push({ type: 'blockquote', children: readBlockContent(node.content, report) });
        break;
      case 'bulletList':
      case 'bullet_list':
      case 'orderedList':
      case 'ordered_list':
      case 'taskList': {
        const ordered = node.type === 'orderedList' || node.type === 'ordered_list';
        const start = Number(node.attrs?.start ?? node.attrs?.order ?? 1);
        out.push({
          type: 'list',
          ordered,
          ...(ordered && start !== 1 ? { start } : {}),
          items: (node.content ?? []).map((item) => ({
            children: readBlockContent(item.content, report),
            ...(item.type === 'taskItem' || item.attrs?.checked !== undefined ? { checked: Boolean(item.attrs?.checked) } : {}),
          })),
        });
        break;
      }
      case 'codeBlock':
      case 'code_block': {
        const language = node.attrs?.language ?? node.attrs?.params;
        out.push({ type: 'code', text: (node.content ?? []).map((child) => child.text ?? '').join(''), ...(language ? { language: String(language) } : {}) });
        break;
      }
      case 'horizontalRule':
      case 'horizontal_rule':
        out.push({ type: 'rule' });
        break;
      case 'image':
        out.push(image(node));
        break;
      case 'table':
        out.push({
          type: 'table',
          rows: (node.content ?? []).map((row) => ({
            cells: (row.content ?? []).map((cell) => {
              const result: TableCellNode = { children: readBlockContent(cell.content, report) };
              if (cell.type === 'tableHeader' || cell.type === 'table_header') result.header = true;
              const colspan = Number(cell.attrs?.colspan ?? 1);
              const rowspan = Number(cell.attrs?.rowspan ?? 1);
              if (colspan > 1) result.colspan = colspan;
              if (rowspan > 1) result.rowspan = rowspan;
              return result;
            }),
          })),
        });
        break;
      default:
        if (node.content?.length) {
          report.warn(`Unsupported block "${node.type}" was unwrapped`);
          out.push(...readBlockContent(node.content, report));
        } else report.warn(`Unsupported block "${node.type}" was dropped`);
    }
  }
  return out;
}

export function readProseMirror(input: PMNode, report: Report): Doc {
  if (input?.type !== 'doc') throw new Error('Expected ProseMirror/Tiptap JSON with type "doc".');
  return { type: 'doc', children: readBlockContent(input.content, report) };
}

// ---- writing ----------------------------------------------------------------------------

const WRITE_MARKS: Record<ProseMirrorFlavor, Record<Mark, string | null>> = {
  tiptap: { bold: 'bold', italic: 'italic', underline: 'underline', strike: 'strike', code: 'code', subscript: 'subscript', superscript: 'superscript', highlight: 'highlight' },
  prosemirror: { bold: 'strong', italic: 'em', underline: null, strike: null, code: 'code', subscript: null, superscript: null, highlight: null },
};

function writeInlineContent(inlines: Inline[], flavor: ProseMirrorFlavor, report: Report): PMNode[] {
  const names = NAMES[flavor];
  return inlines.map((node): PMNode => {
    if (node.type === 'break') return { type: names.hardBreak };
    if (node.type === 'image') return { type: 'image', attrs: { src: node.src, alt: node.alt ?? null, title: node.title ?? null } };
    const marks: NonNullable<PMNode['marks']> = [];
    for (const mark of node.marks ?? []) {
      const name = WRITE_MARKS[flavor][mark];
      if (name) marks.push({ type: name });
      else report.warn(`The basic ProseMirror schema has no "${mark}" mark; it was dropped`);
    }
    if (node.link) marks.push({ type: 'link', attrs: { href: node.link.href, title: node.link.title ?? null } });
    return { type: 'text', text: node.text, ...(marks.length ? { marks } : {}) };
  });
}

function textBlock(type: string, inlines: Inline[], flavor: ProseMirrorFlavor, report: Report, attrs?: Record<string, unknown>): PMNode {
  const content = writeInlineContent(inlines, flavor, report);
  return { type, ...(attrs ? { attrs } : {}), ...(content.length ? { content } : {}) };
}

function writeBlockContent(blocks: Block[], flavor: ProseMirrorFlavor, report: Report): PMNode[] {
  const names = NAMES[flavor];
  const out: PMNode[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph': {
        if (flavor === 'tiptap' && block.children.some((node) => node.type === 'image')) {
          // Tiptap's Image node is a block: split the paragraph around it.
          let run: Inline[] = [];
          const flush = () => {
            if (run.length) out.push(textBlock('paragraph', run, flavor, report));
            run = [];
          };
          for (const node of block.children) {
            if (node.type === 'image') {
              flush();
              out.push({ type: 'image', attrs: { src: node.src, alt: node.alt ?? null, title: node.title ?? null } });
            } else run.push(node);
          }
          flush();
        } else out.push(textBlock('paragraph', block.children, flavor, report));
        break;
      }
      case 'heading':
        out.push(textBlock('heading', block.children, flavor, report, { level: block.level }));
        break;
      case 'blockquote':
        out.push({ type: 'blockquote', content: writeBlockContent(block.children, flavor, report) });
        break;
      case 'list': {
        const task = block.items.some((item) => item.checked !== undefined);
        if (task && flavor === 'prosemirror') report.warn('The basic ProseMirror schema has no task lists; checkboxes were dropped');
        const type = task && flavor === 'tiptap' ? names.taskList : block.ordered ? names.orderedList : names.bulletList;
        const attrs = block.ordered && !task ? (flavor === 'tiptap' ? { start: block.start ?? 1 } : { order: block.start ?? 1 }) : undefined;
        out.push({
          type,
          ...(attrs ? { attrs } : {}),
          content: block.items.map((item) => ({
            type: task && flavor === 'tiptap' ? names.taskItem : names.listItem,
            ...(task && flavor === 'tiptap' ? { attrs: { checked: Boolean(item.checked) } } : {}),
            content: writeBlockContent(item.children.length ? item.children : [paragraph()], flavor, report),
          })),
        });
        break;
      }
      case 'code':
        out.push({ type: names.codeBlock, attrs: flavor === 'tiptap' ? { language: block.language ?? null } : { params: block.language ?? '' }, ...(block.text ? { content: [{ type: 'text', text: block.text }] } : {}) });
        break;
      case 'rule':
        out.push({ type: names.rule });
        break;
      case 'image':
        if (flavor === 'tiptap') out.push({ type: 'image', attrs: { src: block.src, alt: block.alt ?? null, title: block.title ?? null } });
        else out.push({ type: 'paragraph', content: [{ type: 'image', attrs: { src: block.src, alt: block.alt ?? null, title: block.title ?? null } }] });
        break;
      case 'table':
        if (flavor === 'prosemirror') {
          // prosemirror-tables uses snake_case names.
          out.push({
            type: 'table',
            content: block.rows.map((row) => ({
              type: 'table_row',
              content: row.cells.map((cell) => ({
                type: cell.header ? 'table_header' : 'table_cell',
                attrs: { colspan: cell.colspan ?? 1, rowspan: cell.rowspan ?? 1, colwidth: null },
                content: writeBlockContent(cell.children.length ? cell.children : [paragraph()], flavor, report),
              })),
            })),
          });
        } else {
          out.push({
            type: 'table',
            content: block.rows.map((row) => ({
              type: 'tableRow',
              content: row.cells.map((cell) => ({
                type: cell.header ? 'tableHeader' : 'tableCell',
                attrs: { colspan: cell.colspan ?? 1, rowspan: cell.rowspan ?? 1, colwidth: null },
                content: writeBlockContent(cell.children.length ? cell.children : [paragraph()], flavor, report),
              })),
            })),
          });
        }
        break;
    }
  }
  return out;
}

export function writeProseMirror(doc: Doc, report: Report, flavor: ProseMirrorFlavor = 'tiptap'): PMNode {
  const content = writeBlockContent(doc.children, flavor, report);
  return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] };
}
