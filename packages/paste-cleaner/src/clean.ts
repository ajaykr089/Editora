import { detectSource, type PasteSource } from './detect';
import { textToHtml } from './text';
import { fontSizeInPoints, ownStyle, parseStyleSheets, type StyleSheetInfo } from './styles';

export interface CleanPasteOptions {
  /** Keep text and highlight colours as inline styles (default false). */
  keepColors?: boolean;
  /** Keep text-align on paragraphs, headings and cells (default true). */
  keepAlignment?: boolean;
  /** Keep tables; when false their cells become paragraphs (default true). */
  keepTables?: boolean;
  /** Keep images (default true). Local-file images (Word's file:/// paths) are always dropped and reported. */
  keepImages?: boolean;
  /** Allow data: URL images (default true). Turn off if your editor uploads them separately. */
  allowDataImages?: boolean;
  /** Keep links (default true). */
  keepLinks?: boolean;
  /** Turn large, short paragraphs into headings when the source styled them by size only (default true). */
  inferHeadings?: boolean;
  /** Make the first table row a header row when every cell in it is bold (default true). */
  detectHeaderRows?: boolean;
  /** Plain text that looks like Markdown becomes headings, lists, tables... (default true). */
  markdown?: boolean;
  /** Turn bare URLs in plain text into links (default true). */
  linkify?: boolean;
  /** Return plain text only: formatting is dropped, paragraphs kept (default false). */
  plainText?: boolean;
  /** Parse HTML into a Document. Defaults to the browser's DOMParser; on a server pass one from jsdom or linkedom. */
  parse?: (html: string) => Document;
}

export interface PastedImage {
  src: string;
  alt: string;
  /** `kept`, or why it was removed. */
  status: 'kept' | 'local-file' | 'data-url-blocked' | 'unsafe' | 'images-off';
}

export interface CleanPasteResult {
  /** Clean, semantic HTML to insert. */
  html: string;
  /** The same content as plain text. */
  text: string;
  source: PasteSource;
  /** True when the HTML has no block elements (a phrase pasted mid-sentence). */
  inline: boolean;
  images: PastedImage[];
  /** Human-readable notes about content that could not be kept. */
  warnings: string[];
}

export type PasteInput = string | { html?: string | null; text?: string | null };

const REMOVED_TAGS = new Set([
  'script', 'style', 'meta', 'link', 'title', 'head', 'xml', 'template', 'noscript', 'iframe', 'frame', 'frameset',
  'object', 'embed', 'applet', 'svg', 'math', 'canvas', 'audio', 'video', 'source', 'track', 'picture', 'form',
  'input', 'button', 'select', 'textarea', 'option', 'optgroup', 'datalist', 'dialog', 'base', 'map', 'area',
  'portal', 'slot', 'param',
]);

const BLOCK_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'table', 'thead', 'tbody',
  'tfoot', 'tr', 'td', 'th', 'caption', 'hr', 'figure', 'figcaption', 'div', 'section', 'article', 'header',
  'footer', 'aside', 'nav', 'main', 'dl', 'dt', 'dd', 'address', 'center',
]);

const OUTPUT_TAGS = new Set([
  'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'hr', 'br', 'strong',
  'em', 'u', 's', 'sub', 'sup', 'mark', 'a', 'img', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
  'caption', 'span', 'figure', 'figcaption',
]);

const RENAMED: Record<string, string> = {
  b: 'strong', i: 'em', cite: 'em', dfn: 'em', var: 'em', strike: 's', tt: 'code', kbd: 'code', samp: 'code',
  ins: 'u', dt: 'p', dd: 'p', address: 'p', listing: 'pre', xmp: 'pre', plaintext: 'pre',
};

const HEADINGS = /^h[1-6]$/;
const FORMAT_ORDER = ['strong', 'em', 'u', 's', 'sup', 'sub', 'code'] as const;
type FormatTag = (typeof FORMAT_ORDER)[number];

const MONOSPACE = /\b(courier|consolas|menlo|monaco|monospace|source code|roboto mono|fira (?:code|mono)|jetbrains mono|sf mono|lucida console)/i;

const isElement = (node: Node | null): node is Element => node?.nodeType === 1;
const tagOf = (node: Node) => (node as Element).tagName.toLowerCase();

function unwrap(element: Element): void {
  const parent = element.parentNode;
  if (!parent) return;
  while (element.firstChild) parent.insertBefore(element.firstChild, element);
  element.remove();
}

function rename(element: Element, tag: string): Element {
  const replacement = element.ownerDocument.createElement(tag);
  for (const attribute of Array.from(element.attributes)) {
    try {
      replacement.setAttribute(attribute.name, attribute.value);
    } catch {
      // Namespaced or malformed attribute names: drop them.
    }
  }
  while (element.firstChild) replacement.appendChild(element.firstChild);
  element.replaceWith(replacement);
  return replacement;
}

function wrapChildren(element: Element, tag: string): Element {
  const wrapper = element.ownerDocument.createElement(tag);
  while (element.firstChild) wrapper.appendChild(element.firstChild);
  element.appendChild(wrapper);
  return wrapper;
}

function hasVisibleContent(element: Element): boolean {
  return (element.textContent ?? '').replace(/[\s\u00a0\u200b]/g, '') !== '' || element.querySelector('img,hr,table') !== null;
}

function defaultParse(html: string): Document {
  if (typeof DOMParser === 'undefined') {
    throw new Error('cleanPaste: no DOMParser here. Pass `parse` (for example from jsdom or linkedom) to run on a server.');
  }
  return new DOMParser().parseFromString(html, 'text/html');
}

/** Clean clipboard content into semantic HTML. */
export function cleanPaste(input: PasteInput, options: CleanPasteOptions = {}): CleanPasteResult {
  const html = typeof input === 'string' ? input : input.html ?? '';
  const text = typeof input === 'string' ? '' : input.text ?? '';

  if (!html.trim()) {
    // Text needs no HTML parser, so this path also runs on a server without `parse`.
    const converted = textToHtml(text, { markdown: options.markdown !== false && !options.plainText, linkify: options.linkify !== false && !options.plainText });
    return {
      html: converted.html,
      text: text.replace(/\r\n?/g, '\n').trim(),
      source: converted.markdown ? 'markdown' : 'plain',
      inline: !/^<(p|h[1-6]|ul|ol|pre|blockquote|table|hr)\b/.test(converted.html),
      images: [],
      warnings: [],
    };
  }

  const doc = (options.parse ?? defaultParse)(html);
  const root = doc.body;
  const source = detectSource(html);
  const sheet = parseStyleSheets(doc);
  const warnings: string[] = [];
  const images: PastedImage[] = [];

  if (source === 'vscode') {
    const pre = doc.createElement('pre');
    const code = doc.createElement('code');
    code.textContent = codeText(root);
    pre.appendChild(code);
    root.replaceChildren(pre);
    return finish(root.innerHTML, source, images, warnings, options, doc);
  }

  removeComments(root);
  removeJunk(root, sheet);
  convertWordLists(root, sheet);
  root.querySelectorAll('[style*="mso-list" i]').forEach((element) => {
    if (/mso-list:\s*ignore/i.test(element.getAttribute('style') ?? '')) element.remove();
  });
  unwrapGoogleDocs(root);
  if (options.inferHeadings !== false) inferHeadings(root, sheet);
  applyFormatting(root, sheet, options);
  renameTags(root, source);
  normalizeDivs(root);
  normalizeLists(root);
  if (options.keepTables === false) flattenTables(root);
  else cleanTables(root, options);
  sanitize(root, options, images, warnings);
  normalizeWhitespace(root);
  removeEmpty(root);
  mergeAdjacent(root);
  tidyHeadings(root);
  wrapLooseInline(root);

  const localImages = images.filter((image) => image.status === 'local-file').length;
  if (localImages > 0) {
    warnings.push(
      `${localImages} image${localImages === 1 ? '' : 's'} pointed at files on the author's computer and could not be pasted. Copy ${localImages === 1 ? 'it' : 'them'} separately.`,
    );
  }

  return finish(root.innerHTML, source, images, warnings, options, doc);
}

function finish(
  html: string,
  source: PasteSource,
  images: PastedImage[],
  warnings: string[],
  options: CleanPasteOptions,
  doc?: Document,
): CleanPasteResult {
  const container = (doc ?? (options.parse ?? defaultParse)('')).createElement('div');
  container.innerHTML = html;
  const plain = blockText(container).replace(/\n{3,}/g, '\n\n').trim();
  const inline = !Array.from(container.querySelectorAll('*')).some((element) => BLOCK_TAGS.has(tagOf(element)));

  if (options.plainText) {
    const plainHtml = textToHtml(plain, { markdown: false, linkify: false }).html;
    return { html: plainHtml, text: plain, source, inline: !plain.includes('\n'), images: [], warnings };
  }
  return { html: html.trim(), text: plain, source, inline, images, warnings };
}

// ---- removal ----------------------------------------------------------------

function removeComments(root: Element): void {
  const walker = root.ownerDocument.createTreeWalker(root, 128 /* NodeFilter.SHOW_COMMENT */);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((comment) => comment.parentNode?.removeChild(comment));
}

function removeJunk(root: Element, sheet: StyleSheetInfo): void {
  for (const element of Array.from(root.querySelectorAll('*'))) {
    if (!root.contains(element)) continue;
    const tag = tagOf(element);
    if (REMOVED_TAGS.has(tag)) {
      element.remove();
      continue;
    }
    if (tag.includes(':')) {
      // Office namespaces: VML shapes go, <o:p> and friends keep their text.
      if (tag.startsWith('v:')) element.remove();
      else unwrap(element);
      continue;
    }
    const style = ownStyle(element, sheet);
    if (style.get('display') === 'none' || style.get('mso-hide') === 'all' || style.get('visibility') === 'hidden') {
      element.remove();
    } else if (element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true') {
      element.remove();
    } else if (tag === 'br' && /Apple-interchange-newline/.test(element.getAttribute('class') ?? '')) {
      element.remove();
    }
  }
}

// ---- Word lists -------------------------------------------------------------

interface WordListItem {
  element: Element;
  list: string;
  level: number;
  ordered: boolean;
}

function wordListInfo(element: Element, sheet: StyleSheetInfo): WordListItem | null {
  const msoList = ownStyle(element, sheet).get('mso-list');
  const match = msoList?.match(/(l\d+)\s+level(\d+)/i);
  if (!match) return null;
  const list = match[1].toLowerCase();
  const level = parseInt(match[2], 10);
  let format = sheet.wordListFormats.get(`${list}:level${level}`);
  if (!format) {
    // No stylesheet (some Mac Word pastes): read the marker Word renders.
    const marker = element.querySelector('[style*="mso-list" i]')?.textContent?.replace(/[\s\u00a0]/g, '') ?? '';
    format = /^[(]?[0-9a-zA-Z]{1,4}[.)]$/.test(marker) ? 'decimal' : 'bullet';
  }
  return { element, list, level, ordered: format !== 'bullet' && format !== 'image' };
}

/** Word pastes lists as flat paragraphs tagged `mso-list: l0 level2 lfo1`; rebuild real nested lists. */
function convertWordLists(root: Element, sheet: StyleSheetInfo): void {
  const doc = root.ownerDocument;
  const paragraphs = Array.from(root.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div'));
  const processed = new Set<Element>();

  for (const first of paragraphs) {
    if (processed.has(first)) continue;
    const firstInfo = wordListInfo(first, sheet);
    if (!firstInfo) continue;

    // Consecutive siblings that are list paragraphs form one run.
    const run: WordListItem[] = [firstInfo];
    processed.add(first);
    let next = nextElementSkippingBlank(first);
    while (next) {
      const info = wordListInfo(next, sheet);
      if (!info) break;
      run.push(info);
      processed.add(next);
      next = nextElementSkippingBlank(next);
    }

    const stack: Array<{ list: Element; level: number; li: Element | null }> = [];
    let topList: Element | null = null;
    for (const item of run) {
      const tag = item.ordered ? 'ol' : 'ul';
      while (stack.length > 0 && stack[stack.length - 1].level > item.level) stack.pop();
      let current = stack[stack.length - 1];
      if (current && current.level === item.level && tagOf(current.list) !== tag) {
        // Same depth, different list type: close it and start a new list.
        stack.pop();
        current = stack[stack.length - 1];
      }
      if (!current || current.level < item.level) {
        const list = doc.createElement(tag);
        if (current?.li) current.li.appendChild(list);
        else if (current) current.list.appendChild(list);
        else if (topList) topList.after(list);
        else item.element.before(list);
        if (!current) topList = list;
        stack.push({ list, level: item.level, li: null });
        current = stack[stack.length - 1];
      }
      const li = doc.createElement('li');
      while (item.element.firstChild) li.appendChild(item.element.firstChild);
      current.list.appendChild(li);
      current.li = li;
      item.element.remove();
    }
  }
}

function nextElementSkippingBlank(element: Element): Element | null {
  let node = element.nextSibling;
  while (node && node.nodeType === 3 && !(node.textContent ?? '').trim()) node = node.nextSibling;
  return isElement(node) ? node : null;
}

// ---- Google Docs --------------------------------------------------------------

function unwrapGoogleDocs(root: Element): void {
  // The whole paste is wrapped in <b style="font-weight:normal" id="docs-internal-guid-...">.
  root.querySelectorAll('b[id^="docs-internal-guid"], b[style*="font-weight:normal" i], b[style*="font-weight: normal" i]').forEach(unwrap);
  root.querySelectorAll('[id^="docs-internal-guid"]').forEach((element) => element.removeAttribute('id'));
  // Links are rewritten to https://www.google.com/url?q=<real url>&sa=...
  root.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    const match = href.match(/^https?:\/\/(?:www\.)?google\.[a-z.]+\/url\?(.*)$/i);
    if (!match) return;
    const target = new URLSearchParams(match[1].replace(/&amp;/g, '&')).get('q');
    if (target) link.setAttribute('href', target);
  });
}

// ---- headings ---------------------------------------------------------------

function dominantFontSize(block: Element, sheet: StyleSheetInfo): number | null {
  const sizes = new Map<number, number>();
  const walker = block.ownerDocument.createTreeWalker(block, 4 /* SHOW_TEXT */);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const length = (node.textContent ?? '').trim().length;
    if (!length) continue;
    let size: number | null = null;
    for (let element = node.parentElement; element && size === null; element = element === block ? null : element.parentElement) {
      size = fontSizeInPoints(ownStyle(element, sheet).get('font-size'));
    }
    if (size !== null) sizes.set(size, (sizes.get(size) ?? 0) + length);
  }
  let best: number | null = null;
  sizes.forEach((count, size) => {
    if (best === null || count > (sizes.get(best) ?? 0)) best = size;
  });
  return best;
}

/** Sources that style headings by size only (Pages, TextEdit, a Google Docs "Title") get real headings. */
function inferHeadings(root: Element, sheet: StyleSheetInfo): void {
  root.querySelectorAll('p.MsoTitle, p.msotitle').forEach((title) => rename(title, 'h1'));
  root.querySelectorAll('p.MsoSubtitle, p.msosubtitle').forEach((subtitle) => rename(subtitle, 'h2'));

  const paragraphs = Array.from(root.querySelectorAll('p, div')).filter(
    (block) => !block.closest('li, td, th, table') && !block.querySelector('p, div, ul, ol, table') && hasVisibleContent(block),
  );
  const measured = paragraphs.map((block) => ({ block, size: dominantFontSize(block, sheet), length: (block.textContent ?? '').trim().length }));
  const weights = new Map<number, number>();
  measured.forEach(({ size, length }) => size !== null && weights.set(size, (weights.get(size) ?? 0) + length));
  let body: number | null = null;
  weights.forEach((weight, size) => {
    if (body === null || weight > (weights.get(body) ?? 0)) body = size;
  });
  if (body === null) return;

  for (const { block, size, length } of measured) {
    if (size === null || length > 160 || /[.!?:;,]$/.test((block.textContent ?? '').trim())) continue;
    const ratio = size / body;
    const level = ratio >= 1.8 ? 1 : ratio >= 1.4 ? 2 : ratio >= 1.15 ? 3 : 0;
    if (level) rename(block, `h${level}`);
  }
}

// ---- formatting from styles -----------------------------------------------------

function formatsFor(element: Element, style: Map<string, string>): Set<FormatTag> {
  const formats = new Set<FormatTag>();
  const tag = tagOf(element);
  const weight = style.get('font-weight');
  if (weight && (/^(bold|bolder)$/i.test(weight) || parseInt(weight, 10) >= 600) && !HEADINGS.test(tag) && tag !== 'th') {
    formats.add('strong');
  }
  if (/^(italic|oblique)/i.test(style.get('font-style') ?? '')) formats.add('em');
  const decoration = `${style.get('text-decoration') ?? ''} ${style.get('text-decoration-line') ?? ''}`;
  if (/underline/i.test(decoration) && !element.closest('a')) formats.add('u');
  if (/line-through/i.test(decoration)) formats.add('s');
  const align = style.get('vertical-align');
  if (align === 'super') formats.add('sup');
  if (align === 'sub') formats.add('sub');
  if (!BLOCK_TAGS.has(tag) && MONOSPACE.test(style.get('font-family') ?? '')) formats.add('code');
  return formats;
}

function applyFormatting(root: Element, sheet: StyleSheetInfo, options: CleanPasteOptions): void {
  for (const element of Array.from(root.querySelectorAll('*'))) {
    const tag = tagOf(element);
    if (['ul', 'ol', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'colgroup', 'col', 'br', 'img', 'hr'].includes(tag)) continue;
    const style = ownStyle(element, sheet);

    // Remember what survives sanitizing; everything else in `style` goes later.
    const kept: string[] = [];
    const styleAlign = style.get('text-align') ?? '';
    const textAlign = /^(center|right|justify)$/i.test(styleAlign) ? styleAlign : element.getAttribute('align') ?? styleAlign;
    if (options.keepAlignment !== false && BLOCK_TAGS.has(tag) && /^(center|right|justify)$/i.test(textAlign)) {
      kept.push(`text-align: ${textAlign.toLowerCase()}`);
    }
    if (options.keepColors) {
      const color = cssColor(style.get('color'));
      const background = cssColor(style.get('background-color') ?? style.get('background'));
      if (color && !/^(#0{3}(?:0{3})?|black|windowtext|rgb\(0,\s*0,\s*0\))$/i.test(color)) kept.push(`color: ${color}`);
      if (background && !/^(transparent|white|#fff(?:fff)?|rgba?\(.*,\s*0\))$/i.test(background)) {
        kept.push(`background-color: ${background}`);
      }
    }
    if (kept.length > 0) element.setAttribute('data-paste-style', kept.join('; '));

    const formats = formatsFor(element, style);
    for (const format of [...FORMAT_ORDER].reverse()) {
      if (!formats.has(format) || tag === format) continue;
      wrapChildren(element, format);
    }
  }
}

const COLOR_VALUE = /^(#[0-9a-f]{3,8}|(?:rgb|hsl)a?\(\s*[\d.]+%?(?:\s*[,\s/]\s*[\d.]+(?:%|deg)?){2,3}\s*\)|[a-z]{3,20})$/i;

/** A plain colour value, or null: anything else (url(), expressions, keywords like inherit) is dropped. */
function cssColor(value: string | undefined): string | null {
  const color = value?.replace(/\s*!important$/i, '').trim();
  if (!color || !COLOR_VALUE.test(color)) return null;
  if (/^(inherit|initial|unset|revert|auto|none|currentcolor|windowtext|transparent)$/i.test(color)) return null;
  return color;
}

function renameTags(root: Element, source: PasteSource): void {
  for (const element of Array.from(root.querySelectorAll('*'))) {
    const tag = tagOf(element);
    if (tag === 'del') {
      // Word's tracked deletions carry cite="mailto:..."; accept them. Elsewhere <del> is struck text.
      if (source === 'word' || /^mailto:/i.test(element.getAttribute('cite') ?? '')) element.remove();
      else rename(element, 's');
    } else if (tag === 'center') {
      element.setAttribute('data-paste-style', 'text-align: center');
      rename(element, 'div');
    } else if (RENAMED[tag]) {
      rename(element, RENAMED[tag]);
    }
  }
}

// ---- structure ----------------------------------------------------------------

function normalizeDivs(root: Element): void {
  const divs = Array.from(root.querySelectorAll('div, section, article, header, footer, aside, nav, main')).reverse();
  for (const div of divs) {
    const hasBlocks = Array.from(div.children).some((child) => BLOCK_TAGS.has(tagOf(child)));
    if (hasBlocks || div.closest('li, td, th') === null && !hasVisibleContent(div)) unwrap(div);
    else if (div.closest('li, td, th')) unwrap(div);
    else rename(div, 'p');
  }
}

function levelOf(li: Element): number | null {
  const value = li.getAttribute('aria-level') ?? li.getAttribute('data-aria-level');
  const level = value ? parseInt(value, 10) : NaN;
  return Number.isFinite(level) && level > 0 ? level : null;
}

function normalizeLists(root: Element): void {
  const doc = root.ownerDocument;

  // A list placed directly inside another list (Google Docs, Pages) belongs in the item before it.
  for (const nested of Array.from(root.querySelectorAll('ul > ul, ul > ol, ol > ul, ol > ol'))) {
    let previous = nested.previousElementSibling;
    if (!previous || tagOf(previous) !== 'li') {
      previous = doc.createElement('li');
      nested.before(previous);
    }
    previous.appendChild(nested);
  }

  // Word for the web gives every item its own list: merge neighbours of the same kind.
  for (const list of Array.from(root.querySelectorAll('ul, ol'))) {
    if (!list.isConnected && !root.contains(list)) continue;
    let next = nextElementSkippingBlank(list);
    while (next && tagOf(next) === tagOf(list) && levelOf(list.querySelector('li') ?? list) !== null) {
      while (next.firstChild) list.appendChild(next.firstChild);
      const after = nextElementSkippingBlank(next);
      next.remove();
      next = after;
    }
  }

  // Flat lists whose items carry aria-level: nest by level.
  for (const list of Array.from(root.querySelectorAll('ul, ol'))) {
    const items = Array.from(list.children).filter((child) => tagOf(child) === 'li');
    const levels = items.map(levelOf);
    if (levels.some((level) => level === null) || new Set(levels).size < 2) continue;
    const stack: Array<{ list: Element; level: number }> = [{ list, level: levels[0]! }];
    items.forEach((item, index) => {
      const level = levels[index]!;
      while (stack.length > 1 && stack[stack.length - 1].level > level) stack.pop();
      const top = stack[stack.length - 1];
      if (level > top.level) {
        const parentItem = top.list.lastElementChild;
        const sublist = doc.createElement(tagOf(list));
        (parentItem && tagOf(parentItem) === 'li' ? parentItem : top.list).appendChild(sublist);
        stack.push({ list: sublist, level });
      }
      stack[stack.length - 1].list.appendChild(item);
    });
  }

  // <li><p>text</p></li> -> <li>text</li> when the item is a single paragraph.
  for (const item of Array.from(root.querySelectorAll('li'))) {
    const paragraphs = Array.from(item.children).filter((child) => tagOf(child) === 'p');
    if (paragraphs.length === 1) unwrap(paragraphs[0]);
  }

  // Loose <li> outside any list.
  for (const item of Array.from(root.querySelectorAll('li'))) {
    const parent = item.parentElement;
    if (parent && !['ul', 'ol'].includes(tagOf(parent))) {
      const list = doc.createElement('ul');
      item.before(list);
      list.appendChild(item);
    }
  }
}

function cleanTables(root: Element, options: CleanPasteOptions): void {
  root.querySelectorAll('colgroup, col').forEach((element) => element.remove());
  for (const cell of Array.from(root.querySelectorAll('td, th'))) {
    const blocks = Array.from(cell.children).filter((child) => tagOf(child) === 'p');
    if (blocks.length === 1 && cell.children.length === 1) unwrap(blocks[0]);
  }
  if (options.detectHeaderRows === false) return;
  for (const table of Array.from(root.querySelectorAll('table'))) {
    if (table.querySelector('th, thead')) continue;
    const rows = Array.from(table.querySelectorAll('tr')).filter((row) => row.closest('table') === table);
    if (rows.length < 2) continue;
    const cells = Array.from(rows[0].children);
    const allBold = cells.length > 0 && cells.every((cell) => {
      const text = (cell.textContent ?? '').trim();
      if (!text) return false;
      const bold = Array.from(cell.querySelectorAll('strong, b')).map((strong) => strong.textContent ?? '').join('').trim();
      return bold === text;
    });
    if (!allBold) continue;
    const thead = table.ownerDocument.createElement('thead');
    const section = rows[0].parentElement!;
    table.insertBefore(thead, section === table ? rows[0] : section);
    thead.appendChild(rows[0]);
    for (const cell of cells) {
      cell.querySelectorAll('strong, b').forEach(unwrap);
      rename(cell, 'th');
    }
  }
}

function flattenTables(root: Element): void {
  for (const table of Array.from(root.querySelectorAll('table')).reverse()) {
    const fragment = table.ownerDocument.createDocumentFragment();
    for (const row of Array.from(table.querySelectorAll('tr'))) {
      const paragraph = table.ownerDocument.createElement('p');
      Array.from(row.children).forEach((cell, index) => {
        if (index > 0) paragraph.appendChild(table.ownerDocument.createTextNode(' — '));
        while (cell.firstChild) paragraph.appendChild(cell.firstChild);
      });
      fragment.appendChild(paragraph);
    }
    table.replaceWith(fragment);
  }
}

// ---- sanitizing -------------------------------------------------------------------

const SAFE_LINK = /^(https?:|mailto:|tel:|#)/i;
const DATA_IMAGE = /^data:image\/(png|gif|jpe?g|webp|avif);base64,[a-z0-9+/=\s]+$/i;

function safeUrl(value: string): string | null {
  const url = value.trim().replace(/[\u0000-\u001f\u007f]/g, '');
  if (!url) return null;
  if (SAFE_LINK.test(url)) return url;
  // Relative links have no meaning outside the page they were copied from, but are harmless.
  if (!/^[a-z][a-z0-9+.-]*:/i.test(url) && !url.startsWith('//')) return url;
  return null;
}

function sanitize(root: Element, options: CleanPasteOptions, images: PastedImage[], warnings: string[]): void {
  // Deepest first, so unwrapping never skips a descendant.
  const elements = Array.from(root.querySelectorAll('*')).reverse();
  for (const element of elements) {
    const tag = tagOf(element);
    if (REMOVED_TAGS.has(tag)) {
      element.remove();
      continue;
    }
    if (!OUTPUT_TAGS.has(tag)) {
      unwrap(element);
      continue;
    }

    const keep: Record<string, string> = {};
    const kept = element.getAttribute('data-paste-style');

    if (tag === 'a') {
      const href = options.keepLinks === false ? null : safeUrl(element.getAttribute('href') ?? '');
      if (!href) {
        unwrap(element);
        continue;
      }
      keep.href = href;
      const title = element.getAttribute('title');
      if (title) keep.title = title;
    } else if (tag === 'img') {
      const src = (element.getAttribute('src') ?? '').trim();
      const alt = element.getAttribute('alt') ?? '';
      let status: PastedImage['status'] = 'kept';
      if (options.keepImages === false) status = 'images-off';
      else if (/^(file:|cid:|ms-|webkit-fake-url:)/i.test(src) || /^[a-z]:\\/i.test(src)) status = 'local-file';
      else if (/^data:/i.test(src)) status = options.allowDataImages === false ? 'data-url-blocked' : DATA_IMAGE.test(src) ? 'kept' : 'unsafe';
      else if (!/^(https?:|blob:)/i.test(src) && /^[a-z][a-z0-9+.-]*:/i.test(src)) status = 'unsafe';
      else if (!src) status = 'unsafe';
      images.push({ src, alt, status });
      if (status !== 'kept') {
        element.remove();
        continue;
      }
      keep.src = src;
      if (alt) keep.alt = alt;
      for (const dimension of ['width', 'height']) {
        const value = element.getAttribute(dimension);
        if (value && /^\d{1,5}$/.test(value)) keep[dimension] = value;
      }
    } else if (tag === 'td' || tag === 'th') {
      for (const span of ['colspan', 'rowspan']) {
        const value = element.getAttribute(span);
        if (value && /^\d{1,3}$/.test(value) && value !== '1') keep[span] = value;
      }
    } else if (tag === 'ol') {
      const start = element.getAttribute('start');
      if (start && /^-?\d{1,6}$/.test(start) && start !== '1') keep.start = start;
    }
    if (kept && (BLOCK_TAGS.has(tag) || tag === 'span')) keep.style = kept;

    for (const attribute of Array.from(element.attributes)) element.removeAttribute(attribute.name);
    for (const [name, value] of Object.entries(keep)) element.setAttribute(name, value);

    if (tag === 'span' && !element.hasAttribute('style')) unwrap(element);
  }
  if (images.some((image) => image.status === 'unsafe')) warnings.push('Some images had unsupported addresses and were left out.');
}

// ---- whitespace and tidying ------------------------------------------------------------

function normalizeWhitespace(root: Element): void {
  const walker = root.ownerDocument.createTreeWalker(root, 4 /* SHOW_TEXT */);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    if (node.parentElement?.closest('pre')) continue;
    node.data = node.data.replace(/[\u00a0\u200b\ufeff]/g, (char) => (char === '\u00a0' ? ' ' : '')).replace(/[\s]+/g, ' ');
  }

  // Trim the edges of every block, and drop whitespace between blocks.
  const blocks = [root, ...Array.from(root.querySelectorAll('*')).filter((element) => BLOCK_TAGS.has(tagOf(element)) && tagOf(element) !== 'pre')];
  for (const block of blocks) {
    for (const child of Array.from(block.childNodes)) {
      if (child.nodeType === 3 && !(child.textContent ?? '').trim()) {
        const before = child.previousSibling;
        const after = child.nextSibling;
        const betweenBlocks = (!before || (isElement(before) && BLOCK_TAGS.has(tagOf(before)))) || (!after || (isElement(after) && BLOCK_TAGS.has(tagOf(after))));
        if (betweenBlocks) child.remove();
      }
    }
    trimEdge(block, 'start');
    trimEdge(block, 'end');
  }

  // <br> at the end of a block, or between blocks at the top level, is layout noise.
  for (const br of Array.from(root.querySelectorAll('br'))) {
    const parent = br.parentElement!;
    const atEnd = !br.nextSibling && parent !== root && BLOCK_TAGS.has(tagOf(parent));
    const isBlockOrEdge = (node: Node | null) => !node || (isElement(node) && BLOCK_TAGS.has(tagOf(node)));
    const betweenBlocks = parent === root && (isBlockOrEdge(br.previousSibling) || isBlockOrEdge(br.nextSibling)) && hasBlockChild(root);
    if (atEnd || betweenBlocks) br.remove();
  }
}

function hasBlockChild(element: Element): boolean {
  return Array.from(element.children).some((child) => BLOCK_TAGS.has(tagOf(child)));
}

function trimEdge(block: Element, edge: 'start' | 'end'): void {
  let node: Node | null = edge === 'start' ? block.firstChild : block.lastChild;
  while (node) {
    if (node.nodeType === 3) {
      const text = node as Text;
      text.data = edge === 'start' ? text.data.replace(/^\s+/, '') : text.data.replace(/\s+$/, '');
      if (text.data) return;
      const next: Node | null = edge === 'start' ? node.nextSibling : node.previousSibling;
      text.remove();
      node = next;
    } else if (isElement(node) && !BLOCK_TAGS.has(tagOf(node)) && !['br', 'img'].includes(tagOf(node))) {
      node = edge === 'start' ? node.firstChild : node.lastChild;
    } else {
      return;
    }
  }
}

function removeEmpty(root: Element): void {
  for (const element of Array.from(root.querySelectorAll('*')).reverse()) {
    const tag = tagOf(element);
    if (['br', 'img', 'hr', 'td', 'th', 'tr', 'thead', 'tbody', 'tfoot', 'table'].includes(tag)) continue;
    if (!hasVisibleContent(element) && !element.querySelector('br')) element.remove();
    else if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'].includes(tag) && !hasVisibleContent(element)) element.remove();
  }
  for (const table of Array.from(root.querySelectorAll('table'))) {
    if (!hasVisibleContent(table)) table.remove();
  }
}

const MERGEABLE = new Set(['strong', 'em', 'u', 's', 'sub', 'sup', 'code', 'mark']);

function mergeAdjacent(root: Element): void {
  // Nested duplicates: <strong><strong>x</strong></strong>.
  for (const element of Array.from(root.querySelectorAll('strong strong, em em, u u, s s, code code, sup sup, sub sub'))) unwrap(element);
  // Neighbours: <strong>a</strong><strong>b</strong> -> <strong>ab</strong>.
  for (const element of Array.from(root.querySelectorAll('*'))) {
    if (!MERGEABLE.has(tagOf(element)) || !element.isConnected && !root.contains(element)) continue;
    let next = element.nextSibling;
    while (next && isElement(next) && tagOf(next) === tagOf(element) && !next.attributes.length && !element.attributes.length) {
      while (next.firstChild) element.appendChild(next.firstChild);
      const after: ChildNode | null = next.nextSibling;
      next.remove();
      next = after;
    }
  }
  root.normalize();
}

function tidyHeadings(root: Element): void {
  for (const heading of Array.from(root.querySelectorAll('h1, h2, h3, h4, h5, h6'))) {
    // Headings are bold already.
    const only = heading.children.length === 1 ? heading.children[0] : null;
    if (only && tagOf(only) === 'strong' && (only.textContent ?? '').trim() === (heading.textContent ?? '').trim()) unwrap(only);
    heading.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(unwrap);
  }
}

function wrapLooseInline(root: Element): void {
  const children = Array.from(root.childNodes);
  if (!children.some((child) => isElement(child) && BLOCK_TAGS.has(tagOf(child)))) return;
  let paragraph: Element | null = null;
  for (const child of children) {
    if (isElement(child) && BLOCK_TAGS.has(tagOf(child))) {
      paragraph = null;
      continue;
    }
    if (!paragraph) {
      if (child.nodeType === 3 && !(child.textContent ?? '').trim()) {
        child.remove();
        continue;
      }
      paragraph = root.ownerDocument.createElement('p');
      child.before(paragraph);
    }
    paragraph.appendChild(child);
  }
  root.querySelectorAll(':scope > p').forEach((p) => trimEdge(p, 'end'));
}

// ---- text output ---------------------------------------------------------------------

function codeText(root: Element): string {
  const container = root.querySelector('div') ?? root;
  const lines: string[] = [];
  container.childNodes.forEach((child) => {
    if (isElement(child) && tagOf(child) === 'br') lines.push('');
    else lines.push((child.textContent ?? '').replace(/\u00a0/g, ' '));
  });
  return lines.join('\n').replace(/\s+$/, '');
}

function blockText(element: Element, depth = 0): string {
  let out = '';
  element.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      out += child.textContent ?? '';
      return;
    }
    if (!isElement(child)) return;
    const tag = tagOf(child);
    if (tag === 'br') out += '\n';
    else if (tag === 'ul' || tag === 'ol') out += `${depth === 0 ? '\n' : ''}${blockText(child, depth + 1)}${depth === 0 ? '\n' : ''}`;
    else if (tag === 'li') {
      const list = child.parentElement;
      const marker = list && tagOf(list) === 'ol' ? `${Array.from(list.children).indexOf(child) + 1}.` : '-';
      const nested = Array.from(child.children).filter((grandchild) => ['ul', 'ol'].includes(tagOf(grandchild)));
      const own = Array.from(child.childNodes).filter((node) => !nested.includes(node as Element));
      const holder = child.ownerDocument.createElement('div');
      own.forEach((node) => holder.appendChild(node.cloneNode(true)));
      out += `${'  '.repeat(Math.max(0, depth - 1))}${marker} ${blockText(holder, depth).trim()}\n`;
      nested.forEach((list) => (out += blockText(list, depth + 1)));
    } else if (tag === 'table') out += `\n${blockText(child, depth)}\n`;
    else if (tag === 'thead' || tag === 'tbody' || tag === 'tfoot') out += blockText(child, depth);
    else if (tag === 'tr') out += `${Array.from(child.children).map((cell) => blockText(cell, depth).trim().replace(/\n/g, ' ')).join('\t')}\n`;
    else if (BLOCK_TAGS.has(tag)) out += `\n${blockText(child, depth).trim()}\n\n`;
    else out += blockText(child, depth);
  });
  return out;
}
