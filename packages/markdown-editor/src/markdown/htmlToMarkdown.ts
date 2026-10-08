/**
 * HTML -> markdown, for the rich editing surface.
 *
 * This walks a parsed DOM instead of rewriting the HTML string with regexes. The regex version dropped
 * anything it had no rule for: link URLs, `~~strikethrough~~`, images, tables, horizontal rules,
 * ordered-list numbering, list nesting and fenced code (which became inline backticks), and it
 * leaked HTML entities (`&lt;`, `&amp;`) into the stored markdown because it never decoded text.
 *
 * Output goes through `marked` (gfm, breaks) again for the preview, so it follows that dialect: a
 * single newline inside a paragraph is a line break.
 */

type BlockKind = 'text' | 'list' | 'other';

interface Block {
  kind: BlockKind;
  text: string;
}

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

const BLOCK_TAGS = new Set([
  'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'DETAILS', 'DIV', 'DL', 'FIELDSET', 'FIGCAPTION',
  'FIGURE', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN',
  'NAV', 'OL', 'P', 'PRE', 'SECTION', 'TABLE', 'UL',
]);

const PLAIN_LANGUAGES = new Set(['', 'plaintext', 'plain', 'text', 'txt']);

export function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return joinBlocks(blocksOf(doc.body)).trim();
}

const joinBlocks = (blocks: Block[]): string => blocks.map((block) => block.text).join('\n\n');

// ---------------------------------------------------------------------------------------------
// Blocks
// ---------------------------------------------------------------------------------------------

function blocksOf(parent: ParentNode): Block[] {
  const blocks: Block[] = [];
  let run: Node[] = [];

  // Consecutive inline content (text, <strong>, <a>, ...) between block elements is one paragraph.
  const flush = () => {
    if (run.length === 0) return;
    const text = paragraphOf(run);
    if (text) blocks.push({ kind: 'text', text });
    run = [];
  };

  for (const node of Array.from(parent.childNodes)) {
    if (node.nodeType === TEXT_NODE) {
      run.push(node);
    } else if (node.nodeType === ELEMENT_NODE) {
      const element = node as Element;
      if (BLOCK_TAGS.has(element.tagName)) {
        flush();
        blocks.push(...blockOf(element));
      } else {
        run.push(element);
      }
    }
  }
  flush();
  return blocks;
}

function blockOf(element: Element): Block[] {
  const tag = element.tagName;

  if (/^H[1-6]$/.test(tag)) {
    const level = Number(tag.charAt(1));
    // A trailing " #" would be read back as the closing sequence of the heading.
    const text = inlineOf(element.childNodes)
      .replace(/\s*\n\s*/g, ' ')
      .trim()
      .replace(/(\s)(#+)$/, '$1\\$2');
    return text ? [{ kind: 'other', text: `${'#'.repeat(level)} ${text}` }] : [];
  }

  switch (tag) {
    case 'P': {
      const text = paragraphOf(Array.from(element.childNodes));
      return text ? [{ kind: 'text', text }] : [];
    }
    case 'UL':
    case 'OL':
      return listOf(element);
    case 'BLOCKQUOTE': {
      const inner = joinBlocks(blocksOf(element));
      if (!inner) return [];
      const quoted = inner
        .split('\n')
        .map((line) => (line ? `> ${line}` : '>'))
        .join('\n');
      return [{ kind: 'other', text: quoted }];
    }
    case 'PRE':
      return codeBlockOf(element);
    case 'HR':
      return [{ kind: 'other', text: '---' }];
    case 'TABLE':
      return tableOf(element);
    default:
      // DIV, SECTION, FIGURE, stray LI, ...: transparent containers.
      return blocksOf(element);
  }
}

function paragraphOf(nodes: Node[]): string {
  const raw = inlineOf(nodes);
  const tidy = raw
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .trim();
  return tidy ? escapeLineStarts(tidy) : '';
}

// ---------------------------------------------------------------------------------------------
// Lists
// ---------------------------------------------------------------------------------------------

function taskStateOf(item: Element): boolean | null {
  if (item.getAttribute('data-type') === 'checklist-item') {
    return item.getAttribute('data-checked') === 'true';
  }
  const first = item.firstElementChild;
  if (first && first.tagName === 'INPUT' && first.getAttribute('type') === 'checkbox') {
    return first.hasAttribute('checked');
  }
  return null;
}

function listOf(list: Element): Block[] {
  const ordered = list.tagName === 'OL';
  const start = ordered ? parseInt(list.getAttribute('start') || '1', 10) || 1 : 1;
  const items = Array.from(list.children).filter((child) => child.tagName === 'LI');
  if (items.length === 0) return [];

  let loose = false;
  const rendered = items.map((item, index) => {
    const marker = ordered ? `${start + index}.` : '-';
    const blocks = blocksOf(item);
    if (blocks.filter((block) => block.kind !== 'list').length > 1) loose = true;

    let body = '';
    blocks.forEach((block, i) => {
      if (i > 0) body += block.kind === 'list' ? '\n' : '\n\n';
      body += block.text;
    });

    const task = taskStateOf(item);
    if (task !== null) body = `${task ? '[x]' : '[ ]'}${body ? ' ' : ''}${body}`;

    // Continuation lines line up under the item text so nested lists and extra paragraphs stay
    // inside the item.
    const indent = ' '.repeat(marker.length + 1);
    const lines = body
      .split('\n')
      .map((line, n) => (n === 0 || line === '' ? line : indent + line))
      .join('\n');
    return `${marker} ${lines}`.trimEnd();
  });

  return [{ kind: 'list', text: rendered.join(loose ? '\n\n' : '\n') }];
}

// ---------------------------------------------------------------------------------------------
// Code
// ---------------------------------------------------------------------------------------------

function languageOf(pre: Element, code: Element | null): string {
  const declared = (pre.getAttribute('data-lang') || code?.getAttribute('data-lang') || '').trim();
  const fromClass = /(?:^|\s)(?:language|lang)-([^\s]+)/.exec(`${code?.className || ''} ${pre.className || ''}`);
  const language = (declared || fromClass?.[1] || '').toLowerCase();
  if (PLAIN_LANGUAGES.has(language)) return '';
  return language.replace(/[^\w+#.-]/g, '');
}

function codeBlockOf(pre: Element): Block[] {
  const code = pre.querySelector('code');
  const text = ((code ?? pre).textContent || '')
    .replace(/[\u200b\ufeff]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n$/, '');

  const longestFence = (text.match(/`{3,}/g) || []).reduce((max, run) => Math.max(max, run.length), 0);
  const fence = '`'.repeat(Math.max(3, longestFence + 1));
  return [{ kind: 'other', text: `${fence}${languageOf(pre, code)}\n${text}\n${fence}` }];
}

function inlineCodeOf(text: string): string {
  const value = text.replace(/\n/g, ' ');
  if (!value) return '';
  const longest = (value.match(/`+/g) || []).reduce((max, run) => Math.max(max, run.length), 0);
  const fence = '`'.repeat(longest + 1);
  const pad = /^`|`$/.test(value) || (/^ .* $/.test(value) && value.trim() !== '') ? ' ' : '';
  return `${fence}${pad}${value}${pad}${fence}`;
}

// ---------------------------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------------------------

function cellAlignment(cell: Element | undefined): string {
  if (!cell) return '---';
  const align = (cell.getAttribute('align') || (cell as HTMLElement).style?.textAlign || '').toLowerCase();
  if (align === 'center') return ':---:';
  if (align === 'right') return '---:';
  if (align === 'left') return ':---';
  return '---';
}

function tableOf(table: Element): Block[] {
  const rows = Array.from(table.querySelectorAll('tr'))
    .filter((row) => row.closest('table') === table)
    .map((row) => Array.from(row.children).filter((cell) => cell.tagName === 'TD' || cell.tagName === 'TH'));
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
  if (width === 0) return [];

  const cellText = (cell: Element | undefined): string => {
    if (!cell) return '';
    return joinBlocks(blocksOf(cell)).replace(/\n+/g, '<br>').replace(/\|/g, '\\|');
  };
  const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
  const pad = (row: Element[]) => Array.from({ length: width }, (_, i) => row[i]);

  const [header, ...body] = rows.map(pad);
  const lines = [
    line(header.map(cellText)),
    line(header.map(cellAlignment)),
    ...body.map((row) => line(row.map(cellText))),
  ];
  return [{ kind: 'other', text: lines.join('\n') }];
}

// ---------------------------------------------------------------------------------------------
// Inline
// ---------------------------------------------------------------------------------------------

function inlineOf(nodes: ArrayLike<Node>): string {
  let out = '';
  for (const node of Array.from(nodes)) out += inlineNode(node);
  return out;
}

function inlineNode(node: Node): string {
  if (node.nodeType === TEXT_NODE) {
    return escapeText(((node as Text).data || '').replace(/[\u200b\ufeff]/g, '').replace(/\s+/g, ' '));
  }
  if (node.nodeType !== ELEMENT_NODE) return '';

  const element = node as Element;
  switch (element.tagName) {
    case 'BR':
      return '\n';
    case 'STRONG':
    case 'B':
      return emphasis('**', inlineOf(element.childNodes));
    case 'EM':
    case 'I':
      return emphasis('*', inlineOf(element.childNodes));
    case 'DEL':
    case 'S':
    case 'STRIKE':
      return emphasis('~~', inlineOf(element.childNodes));
    // Markdown has no underline or super/subscript; inline HTML is the portable spelling.
    case 'U':
    case 'SUP':
    case 'SUB': {
      const tag = element.tagName.toLowerCase();
      const inner = inlineOf(element.childNodes);
      return inner.trim() ? `<${tag}>${inner}</${tag}>` : inner;
    }
    case 'CODE':
      return inlineCodeOf(element.textContent || '');
    case 'A':
      return linkOf(element);
    case 'IMG':
      return imageOf(element);
    case 'INPUT':
    case 'SCRIPT':
    case 'STYLE':
    case 'TEMPLATE':
      return '';
    default:
      return inlineOf(element.childNodes);
  }
}

/** Markers must hug the text: `** bold **` is not emphasis, so whitespace moves outside. */
function emphasis(mark: string, inner: string): string {
  const core = inner.trim();
  if (!core) return inner;
  const lead = /^\s*/.exec(inner)?.[0] ?? '';
  const trail = /\s*$/.exec(inner)?.[0] ?? '';
  return `${lead}${mark}${core}${mark}${trail}`;
}

const destinationOf = (url: string): string =>
  /[\s()<>]/.test(url) ? `<${url.replace(/[<>]/g, encodeURIComponent)}>` : url;

const titleOf = (element: Element): string => {
  const title = element.getAttribute('title');
  return title ? ` "${title.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : '';
};

function linkOf(anchor: Element): string {
  const text = inlineOf(anchor.childNodes);
  const href = (anchor.getAttribute('href') || '').trim();
  if (!href) return text;
  if (!text.trim()) return '';
  return `[${text}](${destinationOf(href)}${titleOf(anchor)})`;
}

function imageOf(image: Element): string {
  const src = (image.getAttribute('src') || '').trim();
  if (!src) return '';
  const alt = (image.getAttribute('alt') || '').replace(/[\\[\]]/g, '\\$&');
  return `![${alt}](${destinationOf(src)}${titleOf(image)})`;
}

// ---------------------------------------------------------------------------------------------
// Escaping: text typed in the rich editor must not become markup when the markdown is read back.
// ---------------------------------------------------------------------------------------------

function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/[*`[\]]/g, '\\$&')
    // A bare `<` is just text; it only matters when it could open a tag, comment or autolink.
    .replace(/<(?=[A-Za-z/!?])/g, '\\<')
    .replace(/~{2,}/g, (run) => run.replace(/~/g, '\\~'))
    // `snake_case` is not emphasis, so only escape underscores that are not between word characters.
    .replace(/_/g, (match, offset: number, whole: string) =>
      /\w/.test(whole[offset - 1] ?? '') && /\w/.test(whole[offset + 1] ?? '') ? match : '\\_',
    )
    // `&amp;` typed as text would otherwise be read back as an entity.
    .replace(/&(?=#?\w+;)/g, '\\&');
}

/** Block syntax only matters at the start of a line, where text can be mistaken for it. */
function escapeLineStarts(text: string): string {
  return text
    .split('\n')
    .map((line) =>
      line
        .replace(/^(\s*)(#{1,6})(?=\s|$)/, '$1\\$2')
        .replace(/^(\s*)([-+])(?=\s|$)/, '$1\\$2')
        .replace(/^(\s*)(-{2,}|={1,})\s*$/, (_m, space: string, run: string) => `${space}\\${run}`)
        .replace(/^(\s*)(\d{1,9})([.)])(?=\s|$)/, '$1$2\\$3')
        .replace(/^(\s*)>/, '$1\\>'),
    )
    .join('\n');
}
