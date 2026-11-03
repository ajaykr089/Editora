import { flattenToInlines, paragraph, type Block, type Doc, type Inline, type ListItemNode, type ListNode, type Mark } from '../ast';
import { parseHtml } from '../html-parser';
import type { Report } from '../report';
import { readBlocks, readInlines, writeInlines } from './html';

/** Editor.js output: `{ time, blocks: [{ id, type, data }], version }`. Block text is inline HTML. */
export interface EditorJsBlock {
  id?: string;
  type: string;
  data: Record<string, any>;
}

export interface EditorJsData {
  time?: number;
  blocks: EditorJsBlock[];
  version?: string;
}

export interface EditorJsWriteOptions {
  /** `nested` is @editorjs/list 2.x ({ content, meta, items }); `strings` is the 1.x flat format. Default nested. */
  lists?: 'nested' | 'strings';
}

// The tags Editor.js's inline tools write. Bold, Italic and Link are built in; the others are plugins.
const MARK_TAGS = { bold: 'b', italic: 'i', underline: 'u class="cdx-underline"', highlight: 'mark class="cdx-marker"', code: 'code class="inline-code"' } as const;

// Editor.js strips any inline tag that no registered inline tool allows.
const MARK_TOOLS: Partial<Record<Mark, string>> = {
  underline: 'Underline (@editorjs/underline)',
  highlight: 'Marker (@editorjs/marker)',
  code: 'InlineCode (@editorjs/inline-code)',
};

function usedMarks(blocks: Block[], out = new Set<Mark>()): Set<Mark> {
  const inlines = (list: Inline[]) => list.forEach((node) => node.type === 'text' && node.marks?.forEach((mark) => out.add(mark)));
  for (const block of blocks) {
    if (block.type === 'paragraph' || block.type === 'heading') inlines(block.children);
    else if (block.type === 'blockquote') usedMarks(block.children, out);
    else if (block.type === 'list') block.items.forEach((item) => usedMarks(item.children, out));
    else if (block.type === 'table') block.rows.forEach((row) => row.cells.forEach((cell) => usedMarks(cell.children, out)));
  }
  return out;
}

const fromHtml = (html: unknown, report: Report): Inline[] => readInlines(parseHtml(String(html ?? '')).children, report);
const toHtml = (inlines: Inline[]) => writeInlines(inlines, { markTags: MARK_TAGS });

// ---- reading ----------------------------------------------------------------------------

function readListItems(items: unknown[], report: Report, ordered: boolean, checklist: boolean): ListItemNode[] {
  return items.map((item) => {
    if (typeof item === 'string') return { children: [paragraph(fromHtml(item, report))] };
    const entry = item as { content?: string; text?: string; items?: unknown[]; meta?: { checked?: boolean }; checked?: boolean };
    const children: Block[] = [paragraph(fromHtml(entry.content ?? entry.text ?? '', report))];
    if (entry.items?.length) children.push({ type: 'list', ordered, items: readListItems(entry.items, report, ordered, checklist) });
    const checked = entry.meta?.checked ?? entry.checked;
    return { children, ...(checklist ? { checked: Boolean(checked) } : {}) };
  });
}

export function readEditorJs(input: EditorJsData, report: Report): Doc {
  if (!Array.isArray(input?.blocks)) throw new Error('Expected Editor.js data: { blocks: [...] }.');
  const out: Block[] = [];
  for (const block of input.blocks) {
    const data = block.data ?? {};
    switch (block.type) {
      case 'paragraph':
        out.push(paragraph(fromHtml(data.text, report)));
        break;
      case 'header':
        out.push({ type: 'heading', level: Math.min(6, Math.max(1, Number(data.level ?? 2))) as 1, children: fromHtml(data.text, report) });
        break;
      case 'list':
      case 'nestedList': {
        const style = String(data.style ?? 'unordered');
        const start = Number(data.meta?.start ?? data.start ?? 1);
        out.push({ type: 'list', ordered: style === 'ordered', ...(style === 'ordered' && start !== 1 ? { start } : {}), items: readListItems(data.items ?? [], report, style === 'ordered', style === 'checklist') });
        break;
      }
      case 'checklist':
        out.push({ type: 'list', ordered: false, items: (data.items ?? []).map((item: { text?: string; checked?: boolean }) => ({ children: [paragraph(fromHtml(item.text, report))], checked: Boolean(item.checked) })) });
        break;
      case 'quote':
        out.push({ type: 'blockquote', children: [paragraph(fromHtml(data.text, report)), ...(data.caption ? [paragraph(fromHtml(`— ${data.caption}`, report))] : [])] });
        break;
      case 'code':
        out.push({ type: 'code', text: String(data.code ?? ''), ...(data.language ? { language: String(data.language) } : {}) });
        break;
      case 'delimiter':
        out.push({ type: 'rule' });
        break;
      case 'image':
      case 'simpleImage': {
        const src = String(data.file?.url ?? data.url ?? '');
        out.push({ type: 'image', src, ...(data.caption ? { alt: String(data.caption).replace(/<[^>]+>/g, '') } : {}) });
        break;
      }
      case 'table': {
        const rows: string[][] = data.content ?? [];
        out.push({ type: 'table', rows: rows.map((row, index) => ({ cells: row.map((cell) => ({ ...(index === 0 && data.withHeadings ? { header: true } : {}), children: [paragraph(fromHtml(cell, report))] })) })) });
        break;
      }
      case 'raw': {
        report.warn('Raw HTML blocks were parsed as content');
        out.push(...readBlocks(parseHtml(String(data.html ?? '')).children, report));
        break;
      }
      default:
        report.warn(`Editor.js block "${block.type}" was dropped`);
    }
  }
  return { type: 'doc', children: out };
}

// ---- writing ----------------------------------------------------------------------------

function writeListItems(list: ListNode, report: Report, nested: boolean): unknown[] {
  return list.items.map((item) => {
    const sublists = item.children.filter((child): child is ListNode => child.type === 'list');
    const rest = item.children.filter((child) => child.type !== 'list');
    const { inlines, lossy } = flattenToInlines(rest);
    if (lossy || rest.length > 1) report.warn('Editor.js list items hold one line; extra content was joined with line breaks');
    const content = toHtml(inlines);
    if (!nested) {
      if (sublists.length) report.warn('Nested lists were flattened (lists: "strings")');
      return content;
    }
    if (sublists.some((sub) => sub.ordered !== list.ordered)) report.warn('Editor.js nested lists share their parent list style; mixed bullet/numbered nesting was unified');
    return {
      content,
      meta: item.checked !== undefined ? { checked: item.checked } : {},
      items: sublists.flatMap((sub) => writeListItems(sub, report, nested)),
    };
  });
}

export function writeEditorJs(doc: Doc, report: Report, options: EditorJsWriteOptions = {}): EditorJsData {
  const nested = options.lists !== 'strings';
  let counter = 0;
  const id = () => `b${(counter++).toString(36).padStart(4, '0')}`;
  const blocks: EditorJsBlock[] = [];

  for (const mark of usedMarks(doc.children)) {
    if (mark === 'bold' || mark === 'italic') continue;
    const tool = MARK_TOOLS[mark];
    if (tool) report.warn(`Editor.js keeps "${mark}" only when the ${tool} inline tool is registered`);
    else report.warn(`Editor.js has no official "${mark}" inline tool; the mark is lost unless you register one that allows <${mark === 'strike' ? 's' : mark === 'subscript' ? 'sub' : 'sup'}>`);
  }

  const write = (nodes: Block[]) => {
    for (const node of nodes) {
      switch (node.type) {
        case 'paragraph':
          if (node.children.some((child) => child.type === 'image')) report.warn('Inline images were dropped (Editor.js images are blocks)');
          blocks.push({ id: id(), type: 'paragraph', data: { text: toHtml(node.children.filter((child) => child.type !== 'image')) } });
          break;
        case 'heading':
          blocks.push({ id: id(), type: 'header', data: { text: toHtml(node.children), level: node.level } });
          break;
        case 'blockquote': {
          const { inlines, lossy } = flattenToInlines(node.children);
          if (lossy) report.warn('Editor.js quotes hold one block of text; nested content was flattened');
          blocks.push({ id: id(), type: 'quote', data: { text: toHtml(inlines), caption: '', alignment: 'left' } });
          break;
        }
        case 'list': {
          const checklist = node.items.some((item) => item.checked !== undefined);
          const style = checklist ? 'checklist' : node.ordered ? 'ordered' : 'unordered';
          if (checklist && !nested) {
            blocks.push({ id: id(), type: 'checklist', data: { items: node.items.map((item) => ({ text: toHtml(flattenToInlines(item.children).inlines), checked: Boolean(item.checked) })) } });
            break;
          }
          blocks.push({ id: id(), type: 'list', data: { style, ...(nested ? { meta: node.ordered && node.start ? { start: node.start } : {} } : {}), items: writeListItems(node, report, nested) } });
          break;
        }
        case 'code':
          blocks.push({ id: id(), type: 'code', data: { code: node.text } });
          if (node.language) report.warn('The Editor.js code tool has no language; it was dropped');
          break;
        case 'rule':
          blocks.push({ id: id(), type: 'delimiter', data: {} });
          break;
        case 'image':
          blocks.push({ id: id(), type: 'image', data: { file: { url: node.src }, caption: node.alt ?? '', withBorder: false, stretched: false, withBackground: false } });
          break;
        case 'table': {
          if (node.rows.some((row) => row.cells.some((cell) => cell.colspan || cell.rowspan))) report.warn('Editor.js tables cannot merge cells; merged cells were split');
          const withHeadings = node.rows[0]?.cells.every((cell) => cell.header) ?? false;
          blocks.push({ id: id(), type: 'table', data: { withHeadings, content: node.rows.map((row) => row.cells.map((cell) => toHtml(flattenToInlines(cell.children).inlines))) } });
          break;
        }
      }
    }
  };
  write(doc.children);
  return { time: 0, blocks, version: '2.30.0' };
}
