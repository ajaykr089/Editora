/**
 * Formatting for the source view: one block per line, indented, without changing what the HTML says.
 *
 * The old formatter put every tag on its own line and trimmed the text between tags. In inline content that
 * whitespace is part of the text: `foo<b>bar</b>baz` came back as "foo bar baz", `<i>x</i>.` as "x .", and a
 * `<pre>` lost its leading spaces, all by opening the source view and pressing Save without touching anything.
 * Here, line breaks and indentation go only between block elements, where whitespace means nothing; inline
 * content and preformatted elements are written out exactly as they are. On save, `removeFormattingWhitespace`
 * takes those line breaks out again.
 */

const BLOCK_TAGS = new Set([
  'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'CAPTION', 'COL', 'COLGROUP', 'DD', 'DETAILS', 'DIV', 'DL', 'DT',
  'FIELDSET', 'FIGCAPTION', 'FIGURE', 'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI',
  'MAIN', 'NAV', 'OL', 'P', 'PRE', 'SECTION', 'SUMMARY', 'TABLE', 'TBODY', 'TD', 'TFOOT', 'TH', 'THEAD', 'TR', 'UL',
]);

/** Elements whose text is kept exactly, whitespace and all. */
const VERBATIM_TAGS = new Set(['PRE', 'TEXTAREA', 'SCRIPT', 'STYLE']);

const INDENT = '  ';

const isBlock = (node: Node): node is HTMLElement =>
  node.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.has((node as Element).tagName);

const isBlank = (node: Node): boolean => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim() === '';

/** True when every child that is not blank text is a block element, so the children can go on lines of their own. */
function holdsOnlyBlocks(parent: ParentNode): boolean {
  let sawBlock = false;
  for (const child of Array.from(parent.childNodes)) {
    if (isBlank(child)) continue;
    if (!isBlock(child)) return false;
    sawBlock = true;
  }
  return sawBlock;
}

function serialize(node: Node): string {
  const holder = document.createElement('template');
  holder.content.appendChild(node.cloneNode(true));
  return holder.innerHTML;
}

/** The start and end tag of an element, as the browser writes them. */
function tagsOf(element: Element): { open: string; close: string } {
  const empty = serialize(element.cloneNode(false));
  const close = `</${element.tagName.toLowerCase()}>`;
  return empty.endsWith(close)
    ? { open: empty.slice(0, empty.length - close.length), close }
    : { open: empty, close: '' };
}

function formatChildren(parent: ParentNode, depth: number, lines: string[]): void {
  for (const child of Array.from(parent.childNodes)) {
    if (isBlank(child)) continue;
    const indent = INDENT.repeat(depth);
    if (isBlock(child) && !VERBATIM_TAGS.has(child.tagName) && holdsOnlyBlocks(child)) {
      const { open, close } = tagsOf(child);
      lines.push(indent + open);
      formatChildren(child, depth + 1, lines);
      if (close) lines.push(indent + close);
    } else {
      lines.push(indent + serialize(child));
    }
  }
}

/** Formats editor HTML for reading; see the note at the top of this file. */
export function formatSourceHtml(html: string): string {
  const template = document.createElement('template');
  template.innerHTML = html;
  // Content that is not all blocks (bare text, inline elements) has no place where a line break is harmless.
  if (!holdsOnlyBlocks(template.content)) return html;
  const lines: string[] = [];
  formatChildren(template.content, 0, lines);
  return lines.join('\n');
}

function stripBetweenBlocks(parent: ParentNode): void {
  if (holdsOnlyBlocks(parent)) {
    Array.from(parent.childNodes).forEach((child) => {
      if (isBlank(child)) parent.removeChild(child);
    });
  }
  Array.from(parent.childNodes).forEach((child) => {
    if (child.nodeType === Node.ELEMENT_NODE && !VERBATIM_TAGS.has((child as Element).tagName)) {
      stripBetweenBlocks(child as Element);
    }
  });
}

/**
 * Takes out the line breaks and indentation that sit between block elements (the ones `formatSourceHtml` adds, or
 * that someone typed in the source view), so they do not end up in the document as stray whitespace.
 */
export function removeFormattingWhitespace(html: string): string {
  const template = document.createElement('template');
  template.innerHTML = html;
  stripBetweenBlocks(template.content);
  return template.innerHTML;
}
