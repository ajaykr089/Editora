import { flattenToInlines, normalizeInlines, paragraph, type Block, type Doc, type Inline, type Link, type ListItemNode, type Mark, type TableCellNode } from '../ast';
import type { Report } from '../report';

/** Lexical's serialized editor state (`editor.getEditorState().toJSON()`). */
export interface LexicalNode {
  type: string;
  version?: number;
  children?: LexicalNode[];
  [key: string]: unknown;
}

export interface LexicalState {
  root: LexicalNode;
}

export interface LexicalWriteOptions {
  /** Write images as `{ type: 'image', src, altText }` nodes. Lexical has no built-in image node, so the default drops them with a warning. */
  imageNodes?: boolean;
  /** Write horizontal rules as `horizontalrule` nodes (HorizontalRuleNode from @lexical/react). Default true. */
  horizontalRules?: boolean;
}

// Lexical's text format bits.
const FORMAT: Record<Mark, number> = { bold: 1, italic: 2, strike: 4, underline: 8, code: 16, subscript: 32, superscript: 64, highlight: 128 };
const ROW_HEADER = 1;
const COLUMN_HEADER = 2;

// ---- reading ----------------------------------------------------------------------------

function marksFromFormat(format: unknown): Mark[] {
  const value = typeof format === 'number' ? format : 0;
  return (Object.keys(FORMAT) as Mark[]).filter((mark) => value & FORMAT[mark]);
}

function readInlines(nodes: LexicalNode[] = [], report: Report, link?: Link): Inline[] {
  const out: Inline[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case 'text':
      case 'code-highlight': {
        const marks = marksFromFormat(node.format);
        out.push({ type: 'text', text: String(node.text ?? ''), ...(marks.length ? { marks } : {}), ...(link ? { link } : {}) });
        break;
      }
      case 'tab':
        out.push({ type: 'text', text: '\t', ...(link ? { link } : {}) });
        break;
      case 'linebreak':
        out.push({ type: 'break' });
        break;
      case 'link':
      case 'autolink':
        out.push(...readInlines(node.children, report, { href: String(node.url ?? ''), ...(node.title ? { title: String(node.title) } : {}) }));
        break;
      case 'image':
        out.push({ type: 'image', src: String(node.src ?? ''), ...(node.altText ? { alt: String(node.altText) } : {}) });
        break;
      case 'hashtag':
      case 'mention':
        out.push({ type: 'text', text: String(node.text ?? '') });
        break;
      default:
        if (node.children) out.push(...readInlines(node.children, report, link));
        else report.warn(`Unsupported inline node "${node.type}" was dropped`);
    }
  }
  return normalizeInlines(out);
}

const isInlineNode = (node: LexicalNode) => ['text', 'linebreak', 'link', 'autolink', 'tab', 'code-highlight', 'hashtag', 'mention'].includes(node.type);

function readList(node: LexicalNode, report: Report): Block {
  const items: ListItemNode[] = [];
  const check = node.listType === 'check';
  for (const item of node.children ?? []) {
    const children = item.children ?? [];
    // A nested list sits in its own "holder" item that belongs to the item before it.
    if (children.length > 0 && children.every((child) => child.type === 'list')) {
      const nested = children.map((child) => readList(child, report));
      if (items.length) items[items.length - 1].children.push(...nested);
      else items.push({ children: nested });
      continue;
    }
    const blocks: Block[] = [];
    let inline: LexicalNode[] = [];
    const flush = () => {
      if (inline.length) blocks.push(paragraph(readInlines(inline, report)));
      inline = [];
    };
    for (const child of children) {
      if (isInlineNode(child)) inline.push(child);
      else {
        flush();
        blocks.push(...readBlocks([child], report));
      }
    }
    flush();
    items.push({ children: blocks.length ? blocks : [paragraph()], ...(check ? { checked: Boolean(item.checked) } : {}) });
  }
  const ordered = node.listType === 'number';
  const start = Number(node.start ?? 1);
  return { type: 'list', ordered, ...(ordered && start !== 1 ? { start } : {}), items };
}

function readBlocks(nodes: LexicalNode[] = [], report: Report): Block[] {
  const out: Block[] = [];
  for (const node of nodes) {
    switch (node.type) {
      case 'paragraph':
        out.push(paragraph(readInlines(node.children, report)));
        break;
      case 'heading':
        out.push({ type: 'heading', level: Math.min(6, Math.max(1, Number(String(node.tag ?? 'h1').slice(1)))) as 1, children: readInlines(node.children, report) });
        break;
      case 'quote': {
        const children = node.children ?? [];
        out.push({ type: 'blockquote', children: children.length && children.every(isInlineNode) ? [paragraph(readInlines(children, report))] : readBlocks(children, report) });
        break;
      }
      case 'list':
        out.push(readList(node, report));
        break;
      case 'code': {
        // HTML import can nest a code node in a code node.
        const flat = (list: LexicalNode[] = []): LexicalNode[] => list.flatMap((child) => (child.type === 'code' ? flat(child.children) : [child]));
        const text = flat(node.children).map((child) => (child.type === 'linebreak' ? '\n' : child.type === 'tab' ? '\t' : String(child.text ?? ''))).join('');
        out.push({ type: 'code', text, ...(node.language ? { language: String(node.language) } : {}) });
        break;
      }
      case 'horizontalrule':
        out.push({ type: 'rule' });
        break;
      case 'image':
        out.push({ type: 'image', src: String(node.src ?? ''), ...(node.altText ? { alt: String(node.altText) } : {}) });
        break;
      case 'table':
        out.push({
          type: 'table',
          rows: (node.children ?? []).map((row) => ({
            cells: (row.children ?? []).map((cell) => {
              const result: TableCellNode = { children: readBlocks(cell.children, report) };
              if (Number(cell.headerState ?? 0) & (ROW_HEADER | COLUMN_HEADER)) result.header = true;
              if (Number(cell.colSpan ?? 1) > 1) result.colspan = Number(cell.colSpan);
              if (Number(cell.rowSpan ?? 1) > 1) result.rowspan = Number(cell.rowSpan);
              return result;
            }),
          })),
        });
        break;
      default:
        if (isInlineNode(node)) out.push(paragraph(readInlines([node], report)));
        else if (node.children?.length) {
          report.warn(`Unsupported node "${node.type}" was unwrapped`);
          out.push(...readBlocks(node.children, report));
        } else report.warn(`Unsupported node "${node.type}" was dropped`);
    }
  }
  return out;
}

export function readLexical(input: LexicalState, report: Report): Doc {
  if (input?.root?.type !== 'root') throw new Error('Expected Lexical JSON: { root: { type: "root", ... } }.');
  return { type: 'doc', children: readBlocks(input.root.children, report) };
}

// ---- writing ----------------------------------------------------------------------------

const element = (type: string, children: LexicalNode[], extra: Record<string, unknown> = {}): LexicalNode => ({
  children,
  direction: null,
  format: '',
  indent: 0,
  type,
  version: 1,
  ...extra,
});

function textNode(value: string, marks: Mark[] = []): LexicalNode {
  return { detail: 0, format: marks.reduce((bits, mark) => bits | FORMAT[mark], 0), mode: 'normal', style: '', text: value, type: 'text', version: 1 };
}

function writeInlines(inlines: Inline[], report: Report, options: LexicalWriteOptions): LexicalNode[] {
  const out: LexicalNode[] = [];
  let index = 0;
  while (index < inlines.length) {
    const node = inlines[index];
    if (node.type === 'text' && node.link) {
      const group: LexicalNode[] = [];
      while (index < inlines.length) {
        const next = inlines[index];
        if (next.type !== 'text' || next.link?.href !== node.link.href) break;
        group.push(textNode(next.text, next.marks));
        index += 1;
      }
      out.push(element('link', group, { rel: null, target: null, title: node.link.title ?? null, url: node.link.href }));
      continue;
    }
    index += 1;
    if (node.type === 'break') out.push({ type: 'linebreak', version: 1 });
    else if (node.type === 'image') {
      if (options.imageNodes) out.push({ type: 'image', version: 1, src: node.src, altText: node.alt ?? '' });
      else report.warn('Lexical has no built-in image node; images were dropped (pass imageNodes: true if your editor registers one)');
    } else out.push(textNode(node.text, node.marks));
  }
  return out;
}

const paragraphNode = (children: LexicalNode[]) => element('paragraph', children, { textFormat: 0, textStyle: '' });

function writeList(list: Extract<Block, { type: 'list' }>, report: Report, options: LexicalWriteOptions, depth: number): LexicalNode {
  const check = list.items.some((item) => item.checked !== undefined);
  const listType = check ? 'check' : list.ordered ? 'number' : 'bullet';
  const items: LexicalNode[] = [];
  let value = list.start ?? 1;
  for (const item of list.items) {
    const nested = item.children.filter((child): child is Extract<Block, { type: 'list' }> => child.type === 'list');
    const rest = item.children.filter((child) => child.type !== 'list');
    const { inlines, lossy } = flattenToInlines(rest);
    if (lossy || rest.length > 1) report.warn('Lexical list items hold one line of inline content; extra blocks were joined with line breaks');
    items.push(element('listitem', writeInlines(inlines, report, options), { indent: depth, value, ...(check ? { checked: Boolean(item.checked) } : {}) }));
    value += 1;
    // Nested lists go in a holder item after it, numbered like the next item, as Lexical does.
    for (const child of nested) items.push(element('listitem', [writeList(child, report, options, depth + 1)], { indent: depth, value }));
  }
  return element('list', items, { listType, start: list.start ?? 1, tag: list.ordered ? 'ol' : 'ul' });
}

function writeBlocks(blocks: Block[], report: Report, options: LexicalWriteOptions): LexicalNode[] {
  const out: LexicalNode[] = [];
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        out.push(paragraphNode(writeInlines(block.children, report, options)));
        break;
      case 'heading':
        out.push(element('heading', writeInlines(block.children, report, options), { tag: `h${block.level}` }));
        break;
      case 'blockquote': {
        // Lexical's QuoteNode holds inline content.
        const { inlines, lossy } = flattenToInlines(block.children);
        if (lossy) report.warn('Lexical quotes hold inline content; nested blocks in a quote were flattened');
        out.push(element('quote', writeInlines(inlines, report, options)));
        break;
      }
      case 'list':
        out.push(writeList(block, report, options, 0));
        break;
      case 'code': {
        const children: LexicalNode[] = [];
        block.text.split('\n').forEach((line, index) => {
          if (index > 0) children.push({ type: 'linebreak', version: 1 });
          if (line) children.push(textNode(line));
        });
        out.push(element('code', children, { language: block.language ?? null }));
        break;
      }
      case 'rule':
        if (options.horizontalRules === false) report.warn('Horizontal rules were dropped (horizontalRules: false)');
        else out.push({ type: 'horizontalrule', version: 1 });
        break;
      case 'image':
        if (options.imageNodes) out.push(paragraphNode([{ type: 'image', version: 1, src: block.src, altText: block.alt ?? '' }]));
        else report.warn('Lexical has no built-in image node; images were dropped (pass imageNodes: true if your editor registers one)');
        break;
      case 'table':
        out.push(
          element(
            'table',
            block.rows.map((row) =>
              element(
                'tablerow',
                row.cells.map((cell) =>
                  element('tablecell', writeBlocks(cell.children.length ? cell.children : [paragraph()], report, options), {
                    backgroundColor: null,
                    colSpan: cell.colspan ?? 1,
                    headerState: cell.header ? ROW_HEADER : 0,
                    rowSpan: cell.rowspan ?? 1,
                  }),
                ),
              ),
            ),
          ),
        );
        break;
    }
  }
  return out;
}

export function writeLexical(doc: Doc, report: Report, options: LexicalWriteOptions = {}): LexicalState {
  const children = writeBlocks(doc.children, report, options);
  return { root: element('root', children.length ? children : [paragraphNode([])]) };
}
