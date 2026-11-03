import { flattenToInlines, normalizeInlines, paragraph, type Block, type Doc, type Inline, type Link, type ListItemNode, type Mark, type TableCellNode } from '../ast';
import { decodeEntities } from '../html-parser';
import type { Report } from '../report';
import { readBlocks as readHtmlBlocks } from './html';
import { parseHtml } from '../html-parser';

// ---- reading ----------------------------------------------------------------------------

interface Delim {
  marks: Mark[];
  open: string;
  close: string;
}

const PAIRS: Delim[] = [
  { marks: ['bold', 'italic'], open: '***', close: '***' },
  { marks: ['bold'], open: '**', close: '**' },
  { marks: ['bold'], open: '__', close: '__' },
  { marks: ['strike'], open: '~~', close: '~~' },
  { marks: ['italic'], open: '*', close: '*' },
  { marks: ['italic'], open: '_', close: '_' },
  { marks: ['highlight'], open: '==', close: '==' },
];

const INLINE_HTML: Record<string, Mark> = { u: 'underline', ins: 'underline', sub: 'subscript', sup: 'superscript', mark: 'highlight', s: 'strike', del: 'strike', b: 'bold', strong: 'bold', i: 'italic', em: 'italic', code: 'code' };

/** Inline Markdown to inline nodes. Handles escapes, code, links, images, emphasis and inline HTML marks. */
export function readMarkdownInlines(source: string, marks: Mark[] = [], link?: Link, report?: Report): Inline[] {
  const out: Inline[] = [];
  let buffer = '';
  const push = (value: string) => {
    buffer += value;
  };
  const flush = () => {
    if (buffer) out.push({ type: 'text', text: buffer, ...(marks.length ? { marks: [...marks] } : {}), ...(link ? { link } : {}) });
    buffer = '';
  };

  let index = 0;
  while (index < source.length) {
    const rest = source.slice(index);
    const char = source[index];

    if (char === '\\' && /^\\[\\`*_{}[\]()#+\-.!|~<>=]/.test(rest)) {
      push(source[index + 1]);
      index += 2;
      continue;
    }
    if (char === '\\' && source[index + 1] === '\n') {
      flush();
      out.push({ type: 'break' });
      index += 2;
      continue;
    }
    if (char === '\n') {
      // Two trailing spaces mean a hard break; a plain newline is a space.
      if (/ {2,}$/.test(buffer)) {
        buffer = buffer.replace(/ +$/, '');
        flush();
        out.push({ type: 'break' });
      } else push(' ');
      index += 1;
      continue;
    }
    const code = rest.match(/^(`+)([\s\S]*?[^`])\1(?!`)/);
    if (code) {
      flush();
      const value = code[2].replace(/^ (.*) $/, '$1');
      out.push({ type: 'text', text: value, marks: [...new Set([...marks, 'code' as Mark])], ...(link ? { link } : {}) });
      index += code[0].length;
      continue;
    }
    const image = rest.match(/^!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+"([^"]*)")?\s*\)/);
    if (image) {
      flush();
      out.push({ type: 'image', src: image[2], ...(image[1] ? { alt: image[1] } : {}), ...(image[3] ? { title: image[3] } : {}) });
      index += image[0].length;
      continue;
    }
    const anchor = !link && rest.match(/^\[((?:\\.|[^\]\\])*)\]\(\s*<?((?:[^\s()<>]|\([^\s()]*\))+)>?(?:\s+"([^"]*)")?\s*\)/);
    if (anchor) {
      flush();
      out.push(...readMarkdownInlines(anchor[1], marks, { href: anchor[2], ...(anchor[3] ? { title: anchor[3] } : {}) }, report));
      index += anchor[0].length;
      continue;
    }
    const autolink = !link && rest.match(/^<((?:https?|mailto):[^\s>]+)>/);
    if (autolink) {
      flush();
      out.push({ type: 'text', text: autolink[1], ...(marks.length ? { marks: [...marks] } : {}), link: { href: autolink[1] } });
      index += autolink[0].length;
      continue;
    }
    const html = rest.match(/^<(\/?)([a-z]+)\s*\/?>/i);
    if (html && (INLINE_HTML[html[2].toLowerCase()] || html[2].toLowerCase() === 'br')) {
      const tag = html[2].toLowerCase();
      if (tag === 'br') {
        flush();
        out.push({ type: 'break' });
        index += html[0].length;
        continue;
      }
      if (!html[1]) {
        const close = source.toLowerCase().indexOf(`</${tag}>`, index + html[0].length);
        if (close !== -1) {
          flush();
          const inner = source.slice(index + html[0].length, close);
          out.push(...readMarkdownInlines(inner, [...new Set([...marks, INLINE_HTML[tag]])], link, report));
          index = close + tag.length + 3;
          continue;
        }
      }
    }
    let matched = false;
    for (const pair of PAIRS) {
      if (!rest.startsWith(pair.open)) continue;
      const after = source[index + pair.open.length];
      if (!after || /\s/.test(after)) continue;
      // Underscores inside words (snake_case) are not emphasis.
      if (pair.open[0] === '_' && /\w/.test(source[index - 1] ?? '')) continue;
      const close = findClose(source, index + pair.open.length, pair.close);
      if (close === -1) continue;
      flush();
      out.push(...readMarkdownInlines(source.slice(index + pair.open.length, close), [...new Set([...marks, ...pair.marks])], link, report));
      index = close + pair.close.length;
      matched = true;
      break;
    }
    if (matched) continue;
    push(char === '&' ? decodeEntities(rest.match(/^&(#x[0-9a-f]+|#\d+|[a-z]+);/i)?.[0] ?? '&') : char);
    index += char === '&' ? (rest.match(/^&(#x[0-9a-f]+|#\d+|[a-z]+);/i)?.[0].length ?? 1) : 1;
  }
  flush();
  return out;
}

function findClose(source: string, from: number, close: string): number {
  let index = from;
  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2;
      continue;
    }
    if (source[index] === '`') {
      const code = source.slice(index).match(/^(`+)[\s\S]*?\1/);
      if (code) {
        index += code[0].length;
        continue;
      }
    }
    if (source.startsWith(close, index) && !/\s/.test(source[index - 1]) && (close[0] !== '_' || !/\w/.test(source[index + close.length] ?? ''))) {
      // `*` must not be the start of `**`.
      if (close.length === 1 && source[index + 1] === close) {
        index += 2;
        continue;
      }
      return index;
    }
    index += 1;
  }
  return -1;
}

const LIST_ITEM = /^( {0,3})([-*+]|\d{1,9}[.)])( +|$)(.*)$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})\s*([^`\s]*)[^`]*$/;
const TABLE_DIVIDER = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/;

function splitRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '');
  return trimmed.split(/(?<!\\)\|/).map((cell) => cell.trim().replace(/\\\|/g, '|'));
}

function readMarkdownBlocks(lines: string[], report: Report): Block[] {
  const out: Block[] = [];
  let index = 0;
  const isBlank = (line: string | undefined) => line === undefined || !line.trim();

  while (index < lines.length) {
    const line = lines[index];
    if (isBlank(line)) {
      index += 1;
      continue;
    }

    const fence = line.match(FENCE);
    if (fence) {
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}\\s*$`).test(lines[index])) body.push(lines[index++]);
      index += 1;
      out.push({ type: 'code', text: body.join('\n'), ...(fence[2] ? { language: fence[2] } : {}) });
      continue;
    }

    if (/^( {4}|\t)/.test(line)) {
      const body: string[] = [];
      while (index < lines.length && (/^( {4}|\t)/.test(lines[index]) || (isBlank(lines[index]) && /^( {4}|\t)/.test(lines[index + 1] ?? '')))) {
        body.push(lines[index++].replace(/^( {4}|\t)/, ''));
      }
      out.push({ type: 'code', text: body.join('\n') });
      continue;
    }

    const heading = line.match(/^ {0,3}(#{1,6})(?:\s+(.*?))?\s*#*\s*$/);
    if (heading) {
      out.push({ type: 'heading', level: heading[1].length as 1, children: normalizeInlines(readMarkdownInlines(heading[2] ?? '', [], undefined, report)) });
      index += 1;
      continue;
    }

    if (/^ {0,3}([-*_])( *\1){2,} *$/.test(line)) {
      out.push({ type: 'rule' });
      index += 1;
      continue;
    }

    if (/^ {0,3}>/.test(line)) {
      const quoted: string[] = [];
      while (index < lines.length && !isBlank(lines[index]) && (/^ {0,3}>/.test(lines[index]) || quoted.length > 0)) {
        quoted.push(lines[index].replace(/^ {0,3}> ?/, ''));
        index += 1;
        if (!/^ {0,3}>/.test(lines[index] ?? '') && !isBlank(lines[index])) break;
      }
      out.push({ type: 'blockquote', children: readMarkdownBlocks(quoted, report) });
      continue;
    }

    if (line.includes('|') && TABLE_DIVIDER.test(lines[index + 1] ?? '') && lines[index + 1].includes('-')) {
      const header = splitRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && !isBlank(lines[index]) && lines[index].includes('|')) rows.push(splitRow(lines[index++]));
      const cell = (value: string, header: boolean): TableCellNode => ({ ...(header ? { header: true } : {}), children: [paragraph(normalizeInlines(readMarkdownInlines(value, [], undefined, report)))] });
      out.push({ type: 'table', rows: [{ cells: header.map((value) => cell(value, true)) }, ...rows.map((row) => ({ cells: header.map((_h, column) => cell(row[column] ?? '', false)) }))] });
      continue;
    }

    const item = line.match(LIST_ITEM);
    if (item) {
      const { block, next } = readList(lines, index, report);
      out.push(block);
      index = next;
      continue;
    }

    if (/^ {0,3}<(?:p|div|table|ul|ol|h[1-6]|blockquote|pre|figure|hr)\b/i.test(line)) {
      const body: string[] = [];
      while (index < lines.length && !isBlank(lines[index])) body.push(lines[index++]);
      // Raw HTML blocks are read with the HTML reader.
      out.push(...readHtmlBlocks(parseHtml(body.join('\n')).children, report));
      continue;
    }

    const body: string[] = [];
    while (index < lines.length && !isBlank(lines[index]) && !FENCE.test(lines[index]) && !/^ {0,3}(#{1,6}\s|>)/.test(lines[index]) && !(body.length > 0 && LIST_ITEM.test(lines[index]) && !/^\s{4}/.test(lines[index]))) {
      const setext = lines[index + 1]?.match(/^ {0,3}(=+|-+)\s*$/);
      if (setext && body.length === 0) {
        out.push({ type: 'heading', level: setext[1][0] === '=' ? 1 : 2, children: normalizeInlines(readMarkdownInlines(lines[index].trim(), [], undefined, report)) });
        index += 2;
        break;
      }
      body.push(lines[index++].replace(/^ {0,3}/, ''));
    }
    if (body.length) {
      const inlines = normalizeInlines(readMarkdownInlines(body.join('\n'), [], undefined, report));
      out.push(inlines.length === 1 && inlines[0].type === 'image' ? inlines[0] : paragraph(inlines));
    }
  }
  return out;
}

function readList(lines: string[], start: number, report: Report): { block: Block; next: number } {
  const first = lines[start].match(LIST_ITEM)!;
  const ordered = /\d/.test(first[2]);
  const indent = first[1].length;
  const items: ListItemNode[] = [];
  let index = start;
  let checkedSeen = false;

  while (index < lines.length) {
    const match = lines[index].match(LIST_ITEM);
    if (!match || match[1].length !== indent || /\d/.test(match[2]) !== ordered) break;
    const contentIndent = match[1].length + match[2].length + Math.max(1, Math.min(4, match[3].length || 1));
    const body: string[] = [match[4]];
    index += 1;
    while (index < lines.length) {
      const line = lines[index];
      if (!line.trim()) {
        // A blank line continues the item only if the next line is indented into it.
        const next = lines[index + 1];
        if (next !== undefined && next.trim() && leadingSpaces(next) >= contentIndent) {
          body.push('');
          index += 1;
          continue;
        }
        break;
      }
      if (leadingSpaces(line) >= contentIndent) {
        body.push(line.slice(contentIndent));
        index += 1;
        continue;
      }
      const sibling = line.match(LIST_ITEM);
      if (sibling) {
        // A nested list indented a little less than the content still belongs to this item.
        if (sibling[1].length > indent) {
          body.push(line.slice(Math.min(leadingSpaces(line), contentIndent)));
          index += 1;
          continue;
        }
        break;
      }
      // A lazy continuation line.
      if (!/^ {0,3}(#{1,6}\s|>|```|~~~)/.test(line)) {
        body.push(line.trim());
        index += 1;
        continue;
      }
      break;
    }
    let checked: boolean | undefined;
    const task = body[0].match(/^\[([ xX])\]\s+/);
    if (task) {
      checked = task[1] !== ' ';
      body[0] = body[0].slice(task[0].length);
      checkedSeen = true;
    }
    const children = readMarkdownBlocks(body, report);
    items.push({ children: children.length ? children : [paragraph()], ...(checked !== undefined ? { checked } : {}) });
  }
  if (checkedSeen) items.forEach((item) => (item.checked ??= false));
  const startNumber = ordered ? parseInt(first[2], 10) : undefined;
  return { block: { type: 'list', ordered, ...(startNumber !== undefined && startNumber !== 1 ? { start: startNumber } : {}), items }, next: index };
}

function leadingSpaces(line: string): number {
  return line.match(/^ */)![0].length;
}

export function readMarkdown(markdown: string, report: Report): Doc {
  const lines = markdown.replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n');
  return { type: 'doc', children: readMarkdownBlocks(lines, report) };
}

// ---- writing ----------------------------------------------------------------------------

const MD_MARKS: Partial<Record<Mark, [string, string]>> = {
  bold: ['**', '**'],
  italic: ['_', '_'],
  strike: ['~~', '~~'],
  underline: ['<u>', '</u>'],
  subscript: ['<sub>', '</sub>'],
  superscript: ['<sup>', '</sup>'],
  highlight: ['<mark>', '</mark>'],
};

function escapeMarkdown(value: string, atLineStart: boolean): string {
  let escaped = value.replace(/([\\`*_[\]<>~|])/g, '\\$1');
  if (atLineStart) escaped = escaped.replace(/^(\s*)(#{1,6}\s|[-+]\s|\d+[.)]\s|>)/, (_match, space: string, marker: string) => `${space}\\${marker}`);
  return escaped;
}

function codeSpan(value: string): string {
  const longest = Math.max(0, ...(value.match(/`+/g) ?? []).map((run) => run.length));
  const fence = '`'.repeat(longest + 1);
  const pad = value.startsWith('`') || value.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${value}${pad}${fence}`;
}

export function writeMarkdownInlines(inlines: Inline[]): string {
  let out = '';
  let index = 0;
  while (index < inlines.length) {
    const node = inlines[index];
    if (node.type === 'text' && node.link) {
      const group: Inline[] = [];
      while (index < inlines.length) {
        const next = inlines[index];
        if (next.type !== 'text' || next.link?.href !== node.link.href) break;
        group.push({ ...next, link: undefined });
        index += 1;
      }
      const label = writeMarkdownInlines(group);
      const href = /[\s()]/.test(node.link.href) ? `<${node.link.href}>` : node.link.href;
      out += `[${label}](${href}${node.link.title ? ` "${node.link.title.replace(/"/g, '\\"')}"` : ''})`;
      continue;
    }
    index += 1;
    if (node.type === 'break') out += '\\\n';
    else if (node.type === 'image') out += `![${(node.alt ?? '').replace(/[[\]]/g, '\\$&')}](${node.src}${node.title ? ` "${node.title}"` : ''})`;
    else {
      const marks = node.marks ?? [];
      let value = marks.includes('code') ? codeSpan(node.text) : escapeMarkdown(node.text, out === '' || out.endsWith('\n'));
      // Emphasis cannot start or end with whitespace: keep it outside the markers.
      const lead = marks.length && !marks.includes('code') ? value.match(/^\s*/)![0] : '';
      const trail = marks.length && !marks.includes('code') ? value.match(/\s*$/)![0] : '';
      value = value.slice(lead.length, value.length - trail.length);
      for (const mark of marks) {
        const pair = MD_MARKS[mark];
        if (pair && value) value = `${pair[0]}${value}${pair[1]}`;
      }
      out += lead + value + trail;
    }
  }
  return out;
}

function indent(text: string, prefix: string, first = prefix): string {
  return text
    .split('\n')
    .map((line, index) => (index === 0 ? first : line ? prefix : prefix.trimEnd()) + line)
    .join('\n');
}

function writeMarkdownBlock(block: Block, report: Report): string {
  switch (block.type) {
    case 'paragraph':
      return writeMarkdownInlines(block.children);
    case 'heading':
      return `${'#'.repeat(block.level)} ${writeMarkdownInlines(block.children).replace(/\\\n/g, ' ')}`;
    case 'blockquote':
      return indent(writeMarkdownBlocks(block.children, report), '> ');
    case 'list': {
      let number = block.start ?? 1;
      const tight = block.items.every((item) => item.children.length <= 1 || (item.children.length === 2 && item.children[1].type === 'list'));
      return block.items
        .map((item) => {
          const marker = block.ordered ? `${number++}. ` : '- ';
          const box = item.checked === undefined ? '' : item.checked ? '[x] ' : '[ ] ';
          const body = item.children.map((child) => writeMarkdownBlock(child, report)).join(tight ? '\n' : '\n\n') || '';
          return indent(body, ' '.repeat(marker.length), marker + box);
        })
        .join(tight ? '\n' : '\n\n');
    }
    case 'code': {
      const longest = Math.max(2, ...(block.text.match(/^`+/gm) ?? []).map((run) => run.length));
      const fence = '`'.repeat(longest + 1);
      return `${fence}${block.language ?? ''}\n${block.text}\n${fence}`;
    }
    case 'rule':
      return '---';
    case 'image':
      return writeMarkdownInlines([block]);
    case 'table': {
      if (block.rows.length === 0) return '';
      const width = Math.max(...block.rows.map((row) => row.cells.length));
      const cellText = (cell: TableCellNode | undefined) => {
        if (!cell) return '';
        if (cell.colspan || cell.rowspan) report.warn('Markdown tables cannot merge cells; merged cells were split');
        const { inlines, lossy } = flattenToInlines(cell.children);
        if (lossy || inlines.some((node) => node.type === 'break')) report.warn('Markdown table cells hold one line of text; cell content was flattened');
        return writeMarkdownInlines(inlines.map((node) => (node.type === 'break' ? { type: 'text', text: ' ' } : node))).replace(/\|/g, '\\|').replace(/\\\n/g, ' ');
      };
      const [head, ...body] = block.rows;
      if (!head.cells.every((cell) => cell.header)) report.warn('Markdown tables need a header row; the first row was used');
      const line = (cells: TableCellNode[]) => `| ${Array.from({ length: width }, (_v, index) => cellText(cells[index])).join(' | ')} |`;
      return [line(head.cells), `| ${Array.from({ length: width }, () => '---').join(' | ')} |`, ...body.map((row) => line(row.cells))].join('\n');
    }
  }
}

function writeMarkdownBlocks(blocks: Block[], report: Report): string {
  return blocks.map((block) => writeMarkdownBlock(block, report)).join('\n\n');
}

export function writeMarkdown(doc: Doc, report: Report): string {
  const text = writeMarkdownBlocks(doc.children, report);
  return text ? `${text}\n` : '';
}

