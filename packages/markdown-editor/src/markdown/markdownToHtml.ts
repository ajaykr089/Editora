import { Marked, Parser, type MarkedOptions, type Token } from 'marked';
import markedFootnote from 'marked-footnote';
import { sanitizeHTML } from '@editora/core';
import { frontMatterText, splitFrontMatter } from './frontMatter';
import { escapeHtml, highlightCode } from './highlight';

/** First word of a fence info string, reduced to characters that are safe inside a class name. */
const languageOf = (info?: string): string =>
  (info || '').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9_+#.-]/g, '');

// ---------------------------------------------------------------------------------------------
// Preview pane
// ---------------------------------------------------------------------------------------------

export interface PreviewLabels {
  /** Summary of the collapsed front matter block. */
  frontMatter: string;
  /** Heading of the footnotes section (read by assistive technology only). */
  footnotes: string;
  /** Label of the link back from a footnote to its reference; {0} is the footnote's label. */
  backToReference: string;
}

export const DEFAULT_PREVIEW_LABELS: PreviewLabels = {
  frontMatter: 'Front matter',
  footnotes: 'Footnotes',
  backToReference: 'Back to reference {0}',
};

const newlinesIn = (text: string): number => (text.match(/\n/g) || []).length;

/** Blocks that can be scrolled to: each gets the line of the markdown it starts on. */
const ANCHORED = new Set(['heading', 'paragraph', 'code', 'blockquote', 'list', 'table', 'hr']);

/**
 * Renders each top-level block on its own so it can carry `data-md-line`, the (0-based) line of the
 * markdown it starts on. The scroll sync reads these to line the preview up with the source exactly instead
 * of by proportion, which drifts as soon as a code block or a table is taller than its source.
 */
const parseWithLines = (tokens: Token[], options?: MarkedOptions): string => {
  let line = 0;
  let html = '';
  for (const token of tokens) {
    const rendered = Parser.parse([token], options);
    html += ANCHORED.has(token.type)
      ? rendered.replace(/^<([a-z][a-z0-9]*)/i, `<$1 data-md-line="${line}"`)
      : rendered;
    // The footnotes token's raw is the section's title, not text of the document (it stays at the start when
    // nothing refers to a note).
    if (token.type !== 'footnotes') line += newlinesIn(token.raw);
  }
  return html;
};

const createPreviewMarked = (labels: PreviewLabels) =>
  new Marked(
    {
      gfm: true,
      breaks: true,
      hooks: {
        provideParser() {
          return this.block ? parseWithLines : Parser.parseInline;
        },
      },
      renderer: {
        code({ text, lang }) {
          const language = languageOf(lang);
          return `<pre class="md-code-block"><code class="language-${language || 'txt'}">${highlightCode(text, language)}</code></pre>\n`;
        },
        codespan({ text }) {
          return `<code class="md-inline-code">${escapeHtml(text)}</code>`;
        },
        // A real <input> would be stripped by the sanitiser, which silently turned every task item into a
        // plain bullet. A role=checkbox span survives it and is still announced as a checkbox.
        checkbox({ checked }) {
          return `<span class="md-task-box" role="checkbox" aria-checked="${checked ? 'true' : 'false'}" aria-disabled="true"></span> `;
        },
        link({ href, title, tokens }) {
          const text = this.parser.parseInline(tokens);
          const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
          return `<a href="${escapeHtml(href)}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
        },
      },
    },
    markedFootnote({ description: labels.footnotes, backRefLabel: labels.backToReference }),
  );

// One instance per set of labels: an instance is cheap but not free, and there are rarely more than one.
const previewInstances = new Map<string, Marked>();
const previewMarkedFor = (labels: PreviewLabels): Marked => {
  const key = JSON.stringify([labels.footnotes, labels.backToReference]);
  let instance = previewInstances.get(key);
  if (!instance) {
    instance = createPreviewMarked(labels);
    previewInstances.set(key, instance);
  }
  return instance;
};

// ---------------------------------------------------------------------------------------------
// Editing pane
// ---------------------------------------------------------------------------------------------

// Same look the code-sample plugin gives a block it creates itself: it is drawn by inline style, so a
// block loaded from saved HTML has to carry it too or it shows up as bare monospace text.
const CODE_BLOCK_STYLE =
  "display:block;position:relative;background:#f5f5f5;border:1px solid #e0e0e0;border-radius:6px;padding:30px 12px 12px;margin:12px 0;overflow-x:auto;font-family:'Courier New','Monaco','Menlo',monospace;font-size:13px;line-height:1.5;color:#333;user-select:text;cursor:default;";
const CODE_STYLE = 'font-family:inherit;font-size:inherit;line-height:inherit;color:inherit;white-space:pre;word-break:normal;display:block;';

/**
 * A checklist item's text sits in a <p>. Loose items already arrive as one, and a nested list must
 * not end up inside it (a <p> cannot contain a list), so only the leading inline run is wrapped.
 */
const paragraphLead = (content: string): string => {
  const block = content.search(/<(?:p|ul|ol|pre|blockquote|table|h[1-6])\b/);
  if (block === 0) return content;
  const lead = (block === -1 ? content : content.slice(0, block)).trim();
  const rest = block === -1 ? '' : content.slice(block);
  return `${lead ? `<p>${lead}</p>` : ''}${rest}`;
};

const editorMarked = new Marked({
  gfm: true,
  breaks: true,
  renderer: {
    // The editor's code-sample plugin owns code blocks (edited through its dialog), so fences load
    // as the markup it creates and recognises.
    code({ text, lang }) {
      const language = languageOf(lang) || 'plaintext';
      return (
        `<pre class="rte-code-block" data-type="code-block" data-lang="${language}" contenteditable="false" ` +
        `tabindex="0" role="group" aria-label="Code sample (${language}). Press Enter to edit." style="${CODE_BLOCK_STYLE}">` +
        `<code class="language-${language}" style="${CODE_STYLE}">${escapeHtml(text)}</code></pre>\n`
      );
    },
    // Task lists load as the checklist plugin's own structure so its checkboxes work.
    list(token) {
      const body = token.items.map((item) => this.listitem(item)).join('');
      if (token.items.length > 0 && token.items.every((item) => item.task)) {
        return `<ul data-type="checklist">\n${body}</ul>\n`;
      }
      const tag = token.ordered ? 'ol' : 'ul';
      const start = token.ordered && token.start !== '' && token.start !== 1 ? ` start="${token.start}"` : '';
      return `<${tag}${start}>\n${body}</${tag}>\n`;
    },
    listitem(item) {
      const content = this.parser.parse(item.tokens, !!item.loose);
      if (item.task) {
        return `<li data-type="checklist-item" data-checked="${item.checked ? 'true' : 'false'}">${paragraphLead(content)}</li>\n`;
      }
      return `<li>${content}</li>\n`;
    },
  },
});

// ---------------------------------------------------------------------------------------------

const hasDom = (): boolean => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * marked passes raw HTML in the markdown straight through (`<img onerror>`, `<script>`, ...), and the
 * result is injected into the DOM, so it is always sanitised. DOMPurify needs a DOM: with none (a
 * server render) this returns nothing rather than returning unsanitised HTML.
 */
const sanitize =(html: string): string => (hasDom() ? sanitizeHTML(html) : '');

export interface PreviewOptions {
  /**
   * Prefix for the ids footnotes use to link to each other, so that two editors on one page do not share
   * ids (a footnote link would jump to the first editor's footnote).
   */
  idPrefix?: string;
  labels?: Partial<PreviewLabels>;
}

const FOOTNOTE_ATTRIBUTE = /\b(id|href|aria-describedby)="(#?)footnote-/g;

// Our own markup, built from escaped text, so it does not go through the sanitiser (which has no <details>).
const frontMatterBlock = (frontMatter: string, label: string): string =>
  frontMatter
    ? `<details class="md-front-matter" data-md-line="0"><summary>${escapeHtml(label)}</summary>` +
      `<pre><code>${escapeHtml(frontMatterText(frontMatter))}</code></pre></details>\n`
    : '';

export const markdownToPreviewHtml = (markdown: string, options: PreviewOptions = {}): string => {
  if (!hasDom()) return '';
  const labels = { ...DEFAULT_PREVIEW_LABELS, ...options.labels };
  const { frontMatter, body } = splitFrontMatter(markdown);
  // The front matter is not rendered, but its lines are kept so every block keeps the line number it has in the source.
  const lined = '\n'.repeat(newlinesIn(frontMatter)) + body;
  let html = sanitize(previewMarkedFor(labels).parse(lined, { async: false }) as string);
  if (options.idPrefix) {
    html = html.replace(FOOTNOTE_ATTRIBUTE, (_, name: string, hash: string) => `${name}="${hash}${options.idPrefix}footnote-`);
  }
  return frontMatterBlock(frontMatter, labels.frontMatter) + html;
};

/** The front matter is not part of what the rich pane shows or edits; see `joinFrontMatter`. */
export const markdownToEditorHtml = (markdown: string): string =>
  sanitize(editorMarked.parse(splitFrontMatter(markdown).body, { async: false }) as string);
