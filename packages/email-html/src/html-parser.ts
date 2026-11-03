/**
 * A small, forgiving HTML parser: enough to read editor output (and the
 * inline HTML inside Editor.js blocks) on a server, with no DOM and no
 * dependencies. It is not a browser-grade parser and does not try to be.
 */

export interface HElement {
  tag: string;
  attrs: Record<string, string>;
  children: HNode[];
}

export type HNode = HElement | string;

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const RAW_TEXT = new Set(['script', 'style', 'textarea', 'title']);
/** Opening one of these closes an open <p> (and similar implied closes). */
const CLOSES_P = new Set(['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'pre', 'blockquote', 'table', 'hr', 'figure', 'section', 'article', 'header', 'footer', 'dl']);

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', copy: '©', reg: '®', trade: '™',
  hellip: '…', mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  bull: '•', middot: '·', laquo: '«', raquo: '»', times: '×', divide: '÷', euro: '€',
};

export function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);?/gi, (match, entity: string) => {
    if (entity[0] === '#') {
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

export function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\u00a0/g, '&nbsp;');
}

export function escapeAttr(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;');
}

const ATTR = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  let match: RegExpExecArray | null;
  ATTR.lastIndex = 0;
  while ((match = ATTR.exec(source))) {
    attrs[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attrs;
}

/** Parse HTML into a tree. Unclosed tags are closed at the end; stray closing tags are ignored. */
export function parseHtml(html: string): HElement {
  const root: HElement = { tag: '#root', attrs: {}, children: [] };
  const stack: HElement[] = [root];
  const top = () => stack[stack.length - 1];
  const closeTo = (tag: string) => {
    for (let index = stack.length - 1; index > 0; index -= 1) {
      if (stack[index].tag === tag) {
        stack.length = index;
        return true;
      }
    }
    return false;
  };

  let position = 0;
  const pattern = /<!--[\s\S]*?(?:-->|$)|<!\[CDATA\[[\s\S]*?\]\]>|<![^>]*>|<\?[^>]*>|<\/?([a-zA-Z][\w:-]*)([^>]*)>/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html))) {
    if (match.index > position) top().children.push(decodeEntities(html.slice(position, match.index)));
    position = pattern.lastIndex;
    const [whole, rawTag, rawAttrs = ''] = match;
    if (!rawTag) continue; // Comment, doctype, processing instruction.
    const tag = rawTag.toLowerCase();

    if (whole[1] === '/') {
      if (tag === 'p' && !stack.some((element) => element.tag === 'p')) top().children.push({ tag: 'p', attrs: {}, children: [] });
      else closeTo(tag);
      continue;
    }

    if (CLOSES_P.has(tag) && stack.some((element) => element.tag === 'p')) closeTo('p');
    if (tag === 'li') closeImplied(stack, 'li', ['ul', 'ol']);
    if (tag === 'dt' || tag === 'dd') closeImplied(stack, tag, ['dl']);
    if (tag === 'tr') closeImplied(stack, 'tr', ['table', 'thead', 'tbody', 'tfoot']);
    if (tag === 'td' || tag === 'th') {
      closeImplied(stack, 'td', ['tr']);
      closeImplied(stack, 'th', ['tr']);
    }

    const element: HElement = { tag, attrs: parseAttrs(rawAttrs), children: [] };
    top().children.push(element);
    if (VOID.has(tag) || /\/\s*$/.test(rawAttrs)) continue;

    if (RAW_TEXT.has(tag)) {
      const end = html.toLowerCase().indexOf(`</${tag}`, position);
      const stop = end === -1 ? html.length : end;
      element.children.push(html.slice(position, stop));
      const close = html.indexOf('>', stop);
      position = close === -1 ? html.length : close + 1;
      pattern.lastIndex = position;
      continue;
    }
    stack.push(element);
  }
  if (position < html.length) top().children.push(decodeEntities(html.slice(position)));
  return root;
}

/** Close an open `tag` unless one of `scopes` is open closer to the top. */
function closeImplied(stack: HElement[], tag: string, scopes: string[]): void {
  for (let index = stack.length - 1; index > 0; index -= 1) {
    if (scopes.includes(stack[index].tag)) return;
    if (stack[index].tag === tag) {
      stack.length = index;
      return;
    }
  }
}
