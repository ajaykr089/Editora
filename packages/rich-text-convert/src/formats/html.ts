import { normalizeInlines, paragraph, type Block, type Doc, type Inline, type Link, type Mark, type TableCellNode } from '../ast';
import { escapeAttr, escapeText, parseHtml, type HElement, type HNode } from '../html-parser';
import type { Report } from '../report';

const MARK_TAGS: Record<string, Mark> = {
  strong: 'bold', b: 'bold', em: 'italic', i: 'italic', cite: 'italic', u: 'underline', ins: 'underline',
  s: 'strike', del: 'strike', strike: 'strike', code: 'code', kbd: 'code', samp: 'code', tt: 'code',
  sub: 'subscript', sup: 'superscript', mark: 'highlight',
};
const SKIP = new Set(['script', 'style', 'template', 'noscript', 'head', 'title', 'meta', 'link', 'iframe', 'object', 'embed', 'svg', 'canvas', 'form', 'input', 'button', 'select', 'textarea', 'video', 'audio']);
const BLOCKS = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'ul', 'ol', 'li', 'pre', 'hr', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'div', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'figure', 'figcaption', 'dl', 'dt', 'dd', 'address', 'body', 'html', '#root']);

const isElement = (node: HNode): node is HElement => typeof node !== 'string';

function styleMarks(element: HElement): Mark[] {
  const style = element.attrs.style ?? '';
  const marks: Mark[] = [];
  if (/font-weight\s*:\s*(bold|[6-9]00)/i.test(style)) marks.push('bold');
  if (/font-style\s*:\s*italic/i.test(style)) marks.push('italic');
  if (/text-decoration[^;]*underline/i.test(style)) marks.push('underline');
  if (/text-decoration[^;]*line-through/i.test(style)) marks.push('strike');
  return marks;
}

// ---- reading ----------------------------------------------------------------------------

/** Inline content of `nodes`; whitespace collapses as a browser would show it. */
export function readInlines(nodes: HNode[], report: Report, marks: Mark[] = [], link?: Link, pre = false): Inline[] {
  const out: Inline[] = [];
  for (const node of nodes) {
    if (!isElement(node)) {
      const value = pre ? node : node.replace(/[\t\n\r ]+/g, ' ');
      if (value) out.push({ type: 'text', text: value, ...(marks.length ? { marks: [...marks] } : {}), ...(link ? { link } : {}) });
      continue;
    }
    const tag = node.tag;
    if (SKIP.has(tag)) {
      if (['iframe', 'video', 'audio', 'embed', 'object'].includes(tag)) report.warn(`Embedded <${tag}> was dropped`);
      continue;
    }
    if (tag === 'br') out.push({ type: 'break' });
    else if (tag === 'img') {
      const src = node.attrs.src ?? '';
      if (src) out.push({ type: 'image', src, ...(node.attrs.alt ? { alt: node.attrs.alt } : {}), ...(node.attrs.title ? { title: node.attrs.title } : {}) });
    } else if (tag === 'a' && node.attrs.href) {
      const next: Link = { href: node.attrs.href, ...(node.attrs.title ? { title: node.attrs.title } : {}) };
      out.push(...readInlines(node.children, report, marks, next, pre));
    } else {
      const added = [...(MARK_TAGS[tag] ? [MARK_TAGS[tag]] : []), ...styleMarks(node)];
      out.push(...readInlines(node.children, report, [...new Set([...marks, ...added])], link, pre));
    }
  }
  return out;
}

function trimInlines(inlines: Inline[]): Inline[] {
  const out = normalizeInlines(inlines);
  while (out[0]?.type === 'text' && !out[0].text.trim() && out.length > 1) out.shift();
  while (out.length && out[out.length - 1].type === 'break') out.pop();
  const first = out[0];
  if (first?.type === 'text') first.text = first.text.replace(/^\s+/, '');
  const last = out[out.length - 1];
  if (last?.type === 'text') last.text = last.text.replace(/\s+$/, '');
  return out.filter((node) => node.type !== 'text' || node.text !== '');
}

function textOf(node: HNode): string {
  // Lexical and others write code lines as spans separated by <br>.
  if (isElement(node)) return node.tag === 'br' ? '\n' : node.children.map(textOf).join('');
  return node;
}

/** Block content of `nodes`: runs of inline content become paragraphs. */
export function readBlocks(nodes: HNode[], report: Report): Block[] {
  const out: Block[] = [];
  let pending: HNode[] = [];
  const flush = () => {
    if (pending.length === 0) return;
    const inlines = trimInlines(readInlines(pending, report));
    pending = [];
    if (inlines.length === 0) return;
    // A lone image is a block image.
    if (inlines.length === 1 && inlines[0].type === 'image') out.push(inlines[0]);
    else out.push(paragraph(inlines));
  };

  for (const node of nodes) {
    if (!isElement(node) || !BLOCKS.has(node.tag)) {
      if (isElement(node) && SKIP.has(node.tag)) {
        if (['iframe', 'video', 'audio', 'embed', 'object'].includes(node.tag)) report.warn(`Embedded <${node.tag}> was dropped`);
        continue;
      }
      pending.push(node);
      continue;
    }
    flush();
    const tag = node.tag;
    if (tag === 'p' || tag === 'dt' || tag === 'dd' || tag === 'address' || tag === 'figcaption') {
      const inlines = trimInlines(readInlines(node.children, report));
      if (inlines.length === 1 && inlines[0].type === 'image') out.push(inlines[0]);
      else if (inlines.length) out.push(paragraph(inlines));
    } else if (/^h[1-6]$/.test(tag)) {
      out.push({ type: 'heading', level: Number(tag[1]) as 1, children: trimInlines(readInlines(node.children, report)) });
    } else if (tag === 'blockquote') {
      out.push({ type: 'blockquote', children: readBlocks(node.children, report) });
    } else if (tag === 'ul' || tag === 'ol') {
      const checks = node.children.filter(isElement).some((item) => item.attrs['data-checked'] !== undefined || item.children.some((child) => isElement(child) && child.tag === 'input'));
      const items = node.children.filter(isElement).filter((item) => item.tag === 'li').map((item) => {
        const box = findInput(item);
        const checked = item.attrs['data-checked'] !== undefined ? item.attrs['data-checked'] === 'true' : box ? 'checked' in box.attrs : undefined;
        const children = readBlocks(item.children.filter((child) => !(isElement(child) && child.tag === 'input')), report);
        return { children: children.length ? children : [paragraph()], ...(checks && checked !== undefined ? { checked } : {}) };
      });
      const start = Number(node.attrs.start);
      out.push({ type: 'list', ordered: tag === 'ol', ...(tag === 'ol' && Number.isFinite(start) && start !== 1 ? { start } : {}), items });
    } else if (tag === 'li') {
      out.push({ type: 'list', ordered: false, items: [{ children: readBlocks(node.children, report) }] });
    } else if (tag === 'pre') {
      const code = node.children.find((child): child is HElement => isElement(child) && child.tag === 'code');
      const language = (code?.attrs.class ?? node.attrs.class ?? '').match(/(?:language|lang)-([\w+#-]+)/)?.[1] ?? code?.attrs['data-language'] ?? node.attrs['data-language'];
      out.push({ type: 'code', text: textOf(code ?? node).replace(/\n$/, ''), ...(language ? { language } : {}) });
    } else if (tag === 'hr') {
      out.push({ type: 'rule' });
    } else if (tag === 'table') {
      out.push(readTable(node, report));
    } else if (tag === 'figure') {
      out.push(...readBlocks(node.children, report));
    } else {
      // div, section, body...: transparent.
      out.push(...readBlocks(node.children, report));
    }
  }
  flush();
  return out;
}

function findInput(item: HElement): HElement | undefined {
  for (const child of item.children) {
    if (!isElement(child)) continue;
    if (child.tag === 'input' && (child.attrs.type ?? '').toLowerCase() === 'checkbox') return child;
    if (child.tag === 'label' || child.tag === 'p') {
      const nested = findInput(child);
      if (nested) return nested;
    }
  }
  return undefined;
}

function readTable(table: HElement, report: Report): Block {
  const rows: Array<{ cells: TableCellNode[] }> = [];
  const walk = (element: HElement) => {
    for (const child of element.children) {
      if (!isElement(child)) continue;
      if (child.tag === 'tr') {
        rows.push({
          cells: child.children.filter(isElement).filter((cell) => cell.tag === 'td' || cell.tag === 'th').map((cell) => {
            const blocks = readBlocks(cell.children, report);
            const node: TableCellNode = { children: blocks.length ? blocks : [paragraph()] };
            if (cell.tag === 'th') node.header = true;
            const colspan = Number(cell.attrs.colspan);
            const rowspan = Number(cell.attrs.rowspan);
            if (colspan > 1) node.colspan = colspan;
            if (rowspan > 1) node.rowspan = rowspan;
            return node;
          }),
        });
      } else if (['thead', 'tbody', 'tfoot'].includes(child.tag)) walk(child);
      else if (child.tag === 'caption') report.warn('Table captions were dropped');
    }
  };
  walk(table);
  return { type: 'table', rows };
}

export function readHtml(html: string, report: Report): Doc {
  return { type: 'doc', children: readBlocks(parseHtml(html).children, report) };
}

// ---- writing ----------------------------------------------------------------------------

const MARK_HTML: Record<Mark, string> = {
  bold: 'strong', italic: 'em', underline: 'u', strike: 's', code: 'code', subscript: 'sub', superscript: 'sup', highlight: 'mark',
};

export interface InlineHtmlOptions {
  /** Tag (and attributes) to use for each mark, e.g. Editor.js uses <b> and <i>. */
  markTags?: Partial<Record<Mark, string>>;
}

export function writeInlines(inlines: Inline[], options: InlineHtmlOptions = {}): string {
  let html = '';
  let index = 0;
  while (index < inlines.length) {
    const node = inlines[index];
    if (node.type === 'text' && node.link) {
      // Group neighbours that share the link into one <a>.
      const group: Inline[] = [];
      while (index < inlines.length) {
        const next = inlines[index];
        if (next.type !== 'text' || next.link?.href !== node.link.href || next.link?.title !== node.link.title) break;
        group.push({ ...next, link: undefined });
        index += 1;
      }
      html += `<a href="${escapeAttr(node.link.href)}"${node.link.title ? ` title="${escapeAttr(node.link.title)}"` : ''}>${writeInlines(group, options)}</a>`;
      continue;
    }
    index += 1;
    if (node.type === 'break') html += '<br>';
    else if (node.type === 'image') html += `<img src="${escapeAttr(node.src)}" alt="${escapeAttr(node.alt ?? '')}"${node.title ? ` title="${escapeAttr(node.title)}"` : ''}>`;
    else {
      let value = escapeText(node.text);
      for (const mark of [...(node.marks ?? [])].reverse()) {
        const tag = options.markTags?.[mark] ?? MARK_HTML[mark];
        const name = tag.split(/\s/)[0];
        value = `<${tag}>${value}</${name}>`;
      }
      html += value;
    }
  }
  return html;
}

export function writeBlocks(blocks: Block[]): string {
  return blocks.map(writeBlock).join('');
}

function writeBlock(block: Block): string {
  switch (block.type) {
    case 'paragraph':
      return `<p>${writeInlines(block.children)}</p>`;
    case 'heading':
      return `<h${block.level}>${writeInlines(block.children)}</h${block.level}>`;
    case 'blockquote':
      return `<blockquote>${writeBlocks(block.children)}</blockquote>`;
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul';
      const start = block.ordered && block.start && block.start !== 1 ? ` start="${block.start}"` : '';
      const items = block.items
        .map((item) => {
          const check = item.checked === undefined ? '' : ` data-checked="${item.checked}"`;
          // A single paragraph renders without <p>, as most editors do.
          const inner = item.children.length === 1 && item.children[0].type === 'paragraph' ? writeInlines(item.children[0].children) : writeBlocks(item.children);
          return `<li${check}>${inner}</li>`;
        })
        .join('');
      return `<${tag}${start}>${items}</${tag}>`;
    }
    case 'code':
      return `<pre><code${block.language ? ` class="language-${escapeAttr(block.language)}"` : ''}>${escapeText(block.text)}</code></pre>`;
    case 'rule':
      return '<hr>';
    case 'image':
      return `<img src="${escapeAttr(block.src)}" alt="${escapeAttr(block.alt ?? '')}"${block.title ? ` title="${escapeAttr(block.title)}"` : ''}>`;
    case 'table': {
      const rows = block.rows.map((row) => `<tr>${row.cells
        .map((cell) => {
          const tag = cell.header ? 'th' : 'td';
          const spans = `${cell.colspan ? ` colspan="${cell.colspan}"` : ''}${cell.rowspan ? ` rowspan="${cell.rowspan}"` : ''}`;
          const inner = cell.children.length === 1 && cell.children[0].type === 'paragraph' ? writeInlines(cell.children[0].children) : writeBlocks(cell.children);
          return `<${tag}${spans}>${inner}</${tag}>`;
        })
        .join('')}</tr>`);
      return `<table><tbody>${rows.join('')}</tbody></table>`;
    }
  }
}

export function writeHtml(doc: Doc): string {
  return writeBlocks(doc.children);
}
