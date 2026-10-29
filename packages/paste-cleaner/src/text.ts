/**
 * Plain-text pastes. Text that clearly is Markdown (what you get from a chat
 * assistant's copy button, a README, a code comment) becomes headings, lists,
 * code blocks and tables; anything else becomes paragraphs.
 */

export interface TextToHtmlOptions {
  markdown?: boolean;
  linkify?: boolean;
}

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const URL_PATTERN = /\bhttps?:\/\/[^\s<>"']*[^\s<>"'.,;:!?)\]]/g;

function linkify(escaped: string): string {
  return escaped.replace(URL_PATTERN, (url) => `<a href="${url}">${url}</a>`);
}

const BLOCK_MARKERS = [
  /^#{1,6}\s+\S/, // heading
  /^\s*[-*+]\s+\S/, // bullet
  /^\s*\d{1,3}[.)]\s+\S/, // numbered
  /^```/, // fence
  /^>\s?/, // quote
  /^\|.*\|\s*$/, // table row
  /^\s*[-*_]{3,}\s*$/, // rule
];

/** Strong Markdown signals only, so ordinary text with a dash or a number is left alone. */
export function looksLikeMarkdown(text: string): boolean {
  const lines = text.split('\n');
  let blocks = 0;
  for (const line of lines) if (BLOCK_MARKERS.some((pattern) => pattern.test(line))) blocks += 1;
  const inline = /\*\*[^*\n]+\*\*|__[^_\n]+__|`[^`\n]+`|\[[^\]\n]+\]\(\S+\)/.test(text);
  return blocks >= 2 || (blocks >= 1 && inline) || /^```/m.test(text) || /^#{1,6}\s+\S/m.test(text);
}

export function textToHtml(text: string, options: TextToHtmlOptions = {}): { html: string; markdown: boolean } {
  const normalized = text.replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ');
  if (!normalized.trim()) return { html: '', markdown: false };
  const markdown = options.markdown !== false && looksLikeMarkdown(normalized);
  if (markdown) return { html: markdownToHtml(normalized, options.linkify !== false), markdown };

  const paragraphs = normalized.trim().split(/\n[ \t]*\n+/);
  // A single line pasted mid-sentence stays inline.
  if (paragraphs.length === 1 && !paragraphs[0].includes('\n')) {
    const escaped = escapeHtml(paragraphs[0].trim());
    return { html: options.linkify !== false ? linkify(escaped) : escaped, markdown };
  }
  const html = paragraphs
    .map((paragraph) => {
      const escaped = escapeHtml(paragraph.trim()).replace(/\n/g, '<br>');
      return `<p>${options.linkify !== false ? linkify(escaped) : escaped}</p>`;
    })
    .join('');
  return { html, markdown };
}

// ---- Markdown ----------------------------------------------------------------------

function inlineMarkdown(source: string, autolink: boolean): string {
  const codes: string[] = [];
  let text = source.replace(/`([^`\n]+)`/g, (_match, code: string) => {
    codes.push(`<code>${escapeHtml(code)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });

  const links: string[] = [];
  text = text.replace(/\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))+)(?:\s+"[^"]*")?\)/g, (_match, label: string, href: string) => {
    const safe = /^(https?:|mailto:|tel:|#|\/)/i.test(href) ? href : null;
    links.push(safe ? `<a href="${escapeHtml(safe)}">${escapeHtml(label)}</a>` : escapeHtml(label));
    return `\u0001${links.length - 1}\u0001`;
  });

  text = escapeHtml(text);
  if (autolink) text = linkify(text);
  text = text
    .replace(/\*\*([^*\n]+?)\*\*|__([^_\n]+?)__/g, (_match, a?: string, b?: string) => `<strong>${a ?? b}</strong>`)
    .replace(/(^|[^*\w])\*([^*\s][^*\n]*?)\*(?!\w)/g, '$1<em>$2</em>')
    .replace(/(^|[^_\w])_([^_\s][^_\n]*?)_(?!\w)/g, '$1<em>$2</em>')
    .replace(/~~([^~\n]+?)~~/g, '<s>$1</s>');

  return text
    .replace(/\u0001(\d+)\u0001/g, (_match, index: string) => links[Number(index)])
    .replace(/\u0000(\d+)\u0000/g, (_match, index: string) => codes[Number(index)]);
}

interface ListLine {
  indent: number;
  ordered: boolean;
  text: string;
  start: number;
}

function parseListLine(line: string): ListLine | null {
  const match = line.match(/^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/);
  if (!match) return null;
  const ordered = /\d/.test(match[2]);
  return {
    indent: match[1].replace(/\t/g, '    ').length,
    ordered,
    text: match[3],
    start: ordered ? parseInt(match[2], 10) : 1,
  };
}

function renderList(items: ListLine[], autolink: boolean): string {
  let html = '';
  const stack: Array<{ indent: number; tag: string }> = [];
  for (const item of items) {
    const tag = item.ordered ? 'ol' : 'ul';
    while (stack.length > 0 && item.indent < stack[stack.length - 1].indent) {
      html += `</li></${stack.pop()!.tag}>`;
    }
    const top = stack[stack.length - 1];
    if (!top || item.indent > top.indent) {
      const start = item.ordered && item.start !== 1 ? ` start="${item.start}"` : '';
      html += `<${tag}${start}>`;
      stack.push({ indent: item.indent, tag });
    } else {
      html += '</li>';
      if (top.tag !== tag) {
        html += `</${stack.pop()!.tag}><${tag}>`;
        stack.push({ indent: item.indent, tag });
      }
    }
    const task = item.text.match(/^\[([ xX])\]\s+(.*)$/);
    html += task
      ? `<li>${task[1] === ' ' ? '☐' : '☑'} ${inlineMarkdown(task[2], autolink)}`
      : `<li>${inlineMarkdown(item.text, autolink)}`;
  }
  while (stack.length > 0) html += `</li></${stack.pop()!.tag}>`;
  return html;
}

function splitRow(line: string): string[] {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

export function markdownToHtml(markdown: string, autolink = true): string {
  const lines = markdown.split('\n');
  const out: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^(`{3,}|~{3,})\s*([\w+-]*)/);
    if (fence) {
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].startsWith(fence[1])) body.push(lines[index++]);
      index += 1;
      const language = fence[2] ? ` class="language-${escapeHtml(fence[2])}"` : '';
      out.push(`<pre><code${language}>${escapeHtml(body.join('\n'))}</code></pre>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (heading) {
      out.push(`<h${heading[1].length}>${inlineMarkdown(heading[2], autolink)}</h${heading[1].length}>`);
      index += 1;
      continue;
    }

    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
      out.push('<hr>');
      index += 1;
      continue;
    }

    if (/^\|.*\|\s*$/.test(line) && /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(lines[index + 1] ?? '')) {
      const header = splitRow(line);
      const align = splitRow(lines[index + 1]).map((cell) => (/^:-+:$/.test(cell) ? 'center' : /-:$/.test(cell) ? 'right' : ''));
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && /^\|.*\|\s*$/.test(lines[index])) rows.push(splitRow(lines[index++]));
      const cell = (tag: string, text: string, column: number) =>
        `<${tag}${align[column] ? ` style="text-align: ${align[column]}"` : ''}>${inlineMarkdown(text, autolink)}</${tag}>`;
      out.push(
        `<table><thead><tr>${header.map((text, column) => cell('th', text, column)).join('')}</tr></thead><tbody>${rows
          .map((row) => `<tr>${header.map((_h, column) => cell('td', row[column] ?? '', column)).join('')}</tr>`)
          .join('')}</tbody></table>`,
      );
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoted: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) quoted.push(lines[index++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${markdownToHtml(quoted.join('\n'), autolink)}</blockquote>`);
      continue;
    }

    if (parseListLine(line)) {
      const items: ListLine[] = [];
      while (index < lines.length) {
        const item = parseListLine(lines[index]);
        if (item) {
          items.push(item);
          index += 1;
        } else if (lines[index].trim() && /^\s{2,}/.test(lines[index]) && items.length > 0) {
          // A wrapped continuation line of the previous item.
          items[items.length - 1].text += ` ${lines[index].trim()}`;
          index += 1;
        } else {
          break;
        }
      }
      out.push(renderList(items, autolink));
      continue;
    }

    const paragraph: string[] = [];
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,6}\s|```|~~~|>\s?)/.test(lines[index]) &&
      !(paragraph.length > 0 && parseListLine(lines[index]))
    ) {
      paragraph.push(lines[index++]);
    }
    out.push(`<p>${paragraph.map((part) => inlineMarkdown(part.trim(), autolink)).join('<br>')}</p>`);
  }

  return out.join('');
}
