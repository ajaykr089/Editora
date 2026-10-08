import { Marked } from 'marked';
import { sanitizeHTML } from '@editora/core';
import { escapeHtml, highlightCode } from './highlight';

/** First word of a fence info string, reduced to characters that are safe inside a class name. */
const languageOf = (info?: string): string =>
  (info || '').trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9_+#.-]/g, '');

// ---------------------------------------------------------------------------------------------
// Preview pane
// ---------------------------------------------------------------------------------------------

const previewMarked = new Marked({
  gfm: true,
  breaks: true,
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
});

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

/**
 * marked passes raw HTML in the markdown straight through (`<img onerror>`, `<script>`, ...), and the
 * result is injected into the DOM, so it is always sanitised. DOMPurify needs a DOM: with none (a
 * server render) this returns nothing rather than returning unsanitised HTML.
 */
const sanitize = (html: string): string =>
  typeof window === 'undefined' || typeof document === 'undefined' ? '' : sanitizeHTML(html);

export const markdownToPreviewHtml = (markdown: string): string =>
  sanitize(previewMarked.parse(markdown, { async: false }) as string);

export const markdownToEditorHtml = (markdown: string): string =>
  sanitize(editorMarked.parse(markdown, { async: false }) as string);
