/**
 * YAML front matter: a block at the very start of a document, fenced by `---` lines, as used by Jekyll,
 * Hugo, Docusaurus, Obsidian and most static-site tools. It is metadata, not content, so it is kept out of
 * the markdown that is rendered; left in, it renders as a horizontal rule followed by a heading.
 */

export interface FrontMatterSplit {
  /** The front matter exactly as written, fences and the line break after the closing one included. */
  frontMatter: string;
  /** Everything after it. `frontMatter + body` is always the original text. */
  body: string;
}

const OPENING = /^\uFEFF?---[ \t]*\r?\n/;
const CLOSING = /^(?:---|\.\.\.)[ \t]*$/;

// What a line of YAML can look like at the top level (nested lines are indented, which is always allowed).
// Anything else means the block is prose between two rules, not metadata.
const YAML_LINE = /^(?:#.*|-(?:\s.*)?|[^\s#:-][^:]*:(?:\s.*)?)$/;

export function splitFrontMatter(markdown: string): FrontMatterSplit {
  const opening = OPENING.exec(markdown);
  if (!opening) return { frontMatter: '', body: markdown };

  let position = opening[0].length;
  while (position <= markdown.length) {
    const newline = markdown.indexOf('\n', position);
    const end = newline === -1 ? markdown.length : newline + 1;
    const line = markdown.slice(position, newline === -1 ? markdown.length : newline).replace(/\r$/, '');

    if (CLOSING.test(line)) return { frontMatter: markdown.slice(0, end), body: markdown.slice(end) };
    const blankOrNested = line.trim() === '' || /^\s/.test(line);
    if (!blankOrNested && !YAML_LINE.test(line)) break;
    if (newline === -1) break;
    position = end;
  }
  return { frontMatter: '', body: markdown };
}

/** The YAML between the fences, without them. */
export function frontMatterText(frontMatter: string): string {
  const lines = frontMatter.replace(/\r\n?/g, '\n').split('\n');
  // The first line is the opening fence; the closing fence is the last non-empty line.
  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop();
  return lines.slice(1, -1).join('\n');
}

/** Puts front matter back in front of markdown that was edited without it, with a blank line between. */
export function joinFrontMatter(frontMatter: string, markdown: string): string {
  if (!frontMatter) return markdown;
  const separator = frontMatter.endsWith('\n') ? '' : '\n';
  return markdown ? `${frontMatter}${separator}\n${markdown}` : frontMatter;
}
