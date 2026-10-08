import type { MarkedExtension } from 'marked';
import { sanitizeHTML } from '@editora/core';
import { escapeHtml } from './highlight';

/**
 * Math in the preview: `$x^2$` inline, `$$x^2$$` as a display formula within a paragraph, and a `$$` fence on
 * its own lines for a display block. Turning TeX into something to look at is not done here: it needs a
 * typesetting library (KaTeX, MathJax) far larger than this package, so the page passes the one it uses to
 * `MarkdownEditor` as `renderMath`. Until it does, `$` is just a dollar sign: documents that never asked
 * for math are not changed by this.
 */

/** Typesets TeX and returns HTML; `displayMode` is true for a formula on a line of its own. */
export type MathRenderer = (tex: string, displayMode: boolean) => string;

// The renderer is a property of one call, but marked builds its renderers once. A parse is synchronous, so
// the renderer for it is held here for exactly that long, along with the formulas it typeset.
interface Typeset {
  html: string;
  source: string;
}
let active: { renderer: MathRenderer; formulas: Typeset[] } | null = null;

/** Runs a parse with a renderer; returns its result and the formulas typeset during it (see `restoreMath`). */
export function withMathRenderer<T>(renderer: MathRenderer, run: () => T): { result: T; formulas: Typeset[] } {
  const previous = active;
  const context = { renderer, formulas: [] as Typeset[] };
  active = context;
  try {
    return { result: run(), formulas: context.formulas };
  } finally {
    active = previous;
  }
}

const shown = (tex: string, display: boolean): string => (display ? `$$${tex}$$` : `$${tex}$`);
const fallback = (source: string, className: string, tag: 'span' | 'div'): string => {
  const element = tag === 'div' ? 'pre' : 'code';
  return `<${element} class="${className} md-math-source">${escapeHtml(source)}</${element}>`;
};

const typeset = (tex: string, display: boolean, tag: 'span' | 'div'): string => {
  const className = `md-math ${display ? 'md-math-display' : 'md-math-inline'}`;
  const source = shown(tex, display);
  let html = '';
  try {
    html = active ? active.renderer(tex, display) : '';
  } catch {
    // A formula the typesetter rejects is shown as written instead of taking the preview down with it.
  }
  if (!html || !active) return fallback(source, className, tag);
  // Not put into the page yet: the page's sanitiser does not know the SVG that typesetters draw radicals and
  // arrows with. A placeholder goes through it instead, and `restoreMath` fills it in afterwards.
  active.formulas.push({ html, source });
  return `<${tag} class="${className}" data-md-math="${active.formulas.length - 1}"></${tag}>`;
};

// What a typeset formula may contain: the spans, and the SVG with the paths of KaTeX (`output: 'html'`),
// with no link, image, script, style element, foreignObject or event handler. Narrower than the page's own
// allowlist on purpose, so even a typesetter that echoes its input cannot put anything else in the page.
const MATH_TAGS = ['span', 'div', 'svg', 'path', 'line', 'g'];
const MATH_ATTRIBUTES = {
  '*': [
    'class', 'style', 'aria-hidden', 'focusable', 'xmlns', 'width', 'height', 'viewBox', 'preserveAspectRatio',
    'd', 'x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width', 'fill',
  ],
};

// The element's other attributes (its class, and the line the scroll sync reads) can come before or after the index.
const PLACEHOLDER = /<(span|div)([^>]*?) data-md-math="(\d+)"([^>]*)><\/\1>/g;

/** Puts the typeset formulas into sanitised HTML at the placeholders `withMathRenderer` left. */
export function restoreMath(html: string, formulas: Typeset[]): string {
  if (formulas.length === 0) return html;
  return html.replace(PLACEHOLDER, (_whole, tag: 'span' | 'div', before: string, index: string, after: string) => {
    const formula = formulas[Number(index)];
    if (!formula) return '';
    const clean = sanitizeHTML(formula.html, { allowedTags: MATH_TAGS, allowedAttributes: MATH_ATTRIBUTES });
    if (clean.trim()) return `<${tag}${before}${after}>${clean}</${tag}>`;
    const className = /class="([^"]*)"/.exec(before + after)?.[1] ?? 'md-math';
    return fallback(formula.source, className, tag);
  });
}

// What counts as a formula follows pandoc, so that prices are not read as math: the opening `$` is not
// followed by a space, the closing one is not preceded by a space and not followed by a digit, and a
// backslash escapes the next character (`\$` is a dollar sign).
const INLINE = /^\$(?!\s)((?:\\[\s\S]|[^$\\\n])*?(?:\\[\s\S]|[^\s$\\]))\$(?!\d)/;
const INLINE_DISPLAY = /^\$\$(?!\s)((?:\\[\s\S]|[^$\\])*?(?:\\[\s\S]|[^\s$\\]))\$\$/;
const BLOCK = /^ {0,3}\$\$[ \t]*\n([\s\S]+?)\n {0,3}\$\$[ \t]*(?:\n|$)/;

export const mathExtension = (): MarkedExtension => ({
  extensions: [
    {
      name: 'mathBlock',
      level: 'block',
      // Lets a fence interrupt a paragraph, as a code fence does.
      start(src) {
        const found = /\n {0,3}\$\$[ \t]*\n/.exec(src);
        return found ? found.index + 1 : undefined;
      },
      tokenizer(src) {
        const match = BLOCK.exec(src);
        if (match) return { type: 'mathBlock', raw: match[0], text: match[1].trim() };
        return undefined;
      },
      renderer(token) {
        return `${typeset(token.text as string, true, 'div')}\n`;
      },
    },
    {
      name: 'mathInline',
      level: 'inline',
      start(src) {
        const index = src.indexOf('$');
        return index === -1 ? undefined : index;
      },
      tokenizer(src) {
        const display = INLINE_DISPLAY.exec(src);
        if (display) return { type: 'mathInline', raw: display[0], text: display[1], display: true };
        const inline = INLINE.exec(src);
        if (inline) return { type: 'mathInline', raw: inline[0], text: inline[1], display: false };
        return undefined;
      },
      renderer(token) {
        return typeset(token.text as string, token.display === true, 'span');
      },
    },
  ],
});
