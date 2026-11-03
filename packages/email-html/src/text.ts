import type { HElement, HNode } from './html-parser';

const SKIP = new Set(['script', 'style', 'template', 'noscript', 'head', 'title', 'meta', 'link', 'svg', 'canvas', 'form', 'select', 'textarea', 'iframe', 'video', 'audio', 'object', 'embed']);
const BLOCK = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'blockquote', 'pre', 'figure', 'figcaption', 'center', 'section', 'article', 'header', 'footer', 'address', 'dt', 'dd', 'table', 'ul', 'ol']);

const isElement = (node: HNode): node is HElement => typeof node !== 'string';

/**
 * The plain-text part of a multipart email: what text-only clients, previews
 * and some spam filters read. Links keep their URL, lists keep their markers.
 */
export function toPlainText(root: HElement): string {
  const out: string[] = [];
  const write = (text: string): void => {
    out.push(text);
  };
  // Collapsed text: no leading space at the start of a line.
  const words = (text: string): void => {
    const collapsed = text.replace(/\s+/g, ' ');
    const previous = out.length ? out[out.length - 1] : '\n';
    write(previous.endsWith('\n') || previous.endsWith(' ') ? collapsed.replace(/^ /, '') : collapsed);
  };
  const block = (): void => write('\n\n');

  const inline = (nodes: HNode[], pre = false): void => {
    for (const node of nodes) {
      if (!isElement(node)) {
        if (pre) write(node);
        else words(node);
        continue;
      }
      walk(node, pre);
    }
  };

  const walk = (node: HElement, pre = false, depth = 0): void => {
    const { tag } = node;
    if (SKIP.has(tag)) return;
    if (tag === 'br') return write('\n');
    if (tag === 'img') {
      if (node.attrs.alt) write(`[${node.attrs.alt}]`);
      return;
    }
    if (tag === 'a') {
      const start = out.length;
      inline(node.children, pre);
      const label = out.slice(start).join('').trim();
      const href = node.attrs.href ?? '';
      if (href && !href.startsWith('#') && label !== href && label !== href.replace(/^mailto:/, '')) write(` (${href.replace(/^mailto:/, '')})`);
      return;
    }
    if (tag === 'span' && (node.attrs.class ?? '').includes('rte-merge-tag')) return write(node.attrs['data-token'] || '');
    if (tag === 'hr') {
      block();
      write('----------');
      return block();
    }
    if (tag === 'ul' || tag === 'ol') {
      let number = Number(node.attrs.start ?? 1) || 1;
      block();
      for (const item of node.children.filter(isElement)) {
        const checked = item.attrs['data-checked'];
        const marker = checked === 'true' ? '[x]' : checked === 'false' ? '[ ]' : tag === 'ol' ? `${number}.` : '-';
        number += 1;
        write(`${'  '.repeat(depth)}${marker} `);
        for (const child of item.children) {
          if (isElement(child) && (child.tag === 'ul' || child.tag === 'ol')) {
            write('\n');
            walkList(child, depth + 1);
          } else if (isElement(child) && child.tag === 'p') inline(child.children);
          else if (isElement(child)) walk(child, pre, depth);
          else words(child);
        }
        write('\n');
      }
      return block();
    }
    if (tag === 'tr') {
      const cells = node.children.filter(isElement).filter((cell) => cell.tag === 'td' || cell.tag === 'th');
      cells.forEach((cell, index) => {
        if (index > 0) write(' | ');
        inline(cell.children);
      });
      return write('\n');
    }
    if (tag === 'pre') {
      block();
      inline(node.children, true);
      return block();
    }
    if (/^h[1-6]$/.test(tag)) {
      block();
      const start = out.length;
      inline(node.children);
      const heading = out.splice(start).join('').trim();
      write(tag === 'h1' || tag === 'h2' ? `${heading}\n${(tag === 'h1' ? '=' : '-').repeat(Math.min(heading.length, 60))}` : heading);
      return block();
    }
    if (tag === 'blockquote') {
      block();
      const start = out.length;
      node.children.forEach((child) => (isElement(child) ? walk(child) : write(child)));
      const quoted = tidy(out.splice(start).join('')).split('\n').map((line) => (line ? `> ${line}` : '>')).join('\n');
      write(quoted);
      return block();
    }
    if (BLOCK.has(tag) || tag === 'li') {
      block();
      inline(node.children, pre);
      return block();
    }
    inline(node.children, pre);
  };

  const walkList = (list: HElement, depth: number) => {
    const before = out.length;
    walk(list, false, depth);
    // Nested lists sit right under their item, without blank lines around them.
    const nested = out.splice(before).join('').replace(/^\n+|\n+$/g, '');
    write(nested);
  };

  inline(root.children);
  return tidy(out.join(''));
}

function tidy(text: string): string {
  return text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n +\n/g, '\n\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
