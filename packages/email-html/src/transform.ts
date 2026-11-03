import { escapeAttr, escapeText, type HElement, type HNode } from './html-parser';
import type { Report } from './report';
import { cleanStyle, mergeStyles, parseStyle, px, serializeStyle, type Style } from './style';
import { tagStyles, type EmailTheme } from './theme';

export interface TransformContext {
  theme: EmailTheme;
  report: Report;
  /** Width of the content column in px (the email width minus its side padding). */
  contentWidth: number;
  baseUrl?: string;
  /** Extra styles by simple selector: `p`, `.lead`, `a.button`. */
  classStyles: Record<string, string>;
}

interface State extends TransformContext {
  tags: Record<string, string>;
  selectors: Array<{ tag?: string; classes: string[]; style: string; weight: number }>;
}

const BLOCK = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'pre', 'hr', 'table', 'div', 'figure', 'figcaption', 'center', 'section', 'article', 'header', 'footer', 'main', 'aside', 'nav', 'address', 'dl', 'dt', 'dd', 'details', 'summary', 'iframe', 'video', 'audio']);
const DROP = new Set(['script', 'style', 'template', 'noscript', 'head', 'title', 'meta', 'link', 'base', 'object', 'embed', 'svg', 'canvas', 'form', 'input', 'select', 'textarea', 'colgroup', 'col', 'source', 'track']);
const INLINE_KEEP = new Set(['strong', 'b', 'em', 'i', 'u', 's', 'del', 'strike', 'sub', 'sup', 'small', 'span', 'abbr', 'cite', 'q', 'code', 'kbd', 'br', 'a', 'img']);
const MERGE_TOKEN = /^\s*(\{\{[\s\S]*\}\}|\{%[\s\S]*%\}|\*\|[\s\S]*\|\*|%%[\s\S]*%%|\[\[[\s\S]*\]\]|\$\{[\s\S]*\})\s*$/;
const SAFE_URL = /^(https?:|mailto:|tel:|sms:|#)/i;

const isElement = (node: HNode): node is HElement => typeof node !== 'string';
const classesOf = (element: HElement) => (element.attrs.class ?? '').split(/\s+/).filter(Boolean);
const hasText = (nodes: HNode[]): boolean => nodes.some((node) => (isElement(node) ? node.tag === 'img' || hasText(node.children) : node.trim() !== ''));

export function createState(context: TransformContext): State {
  const selectors = Object.entries(context.classStyles).flatMap(([selector, style]) =>
    selector.split(',').map((part) => {
      const [tag, ...classes] = part.trim().split('.');
      return { tag: tag || undefined, classes, style, weight: classes.length * 10 + (tag ? 1 : 0) };
    }),
  );
  selectors.sort((a, b) => a.weight - b.weight);
  return { ...context, tags: tagStyles(context.theme), selectors };
}

/** Theme style for the tag, then matching selectors, then the element's own inline style. */
function styleFor(element: HElement, state: State, tag = element.tag, extra?: string): Style {
  const classes = classesOf(element);
  const matched = state.selectors.filter((selector) => (!selector.tag || selector.tag === tag) && selector.classes.every((name) => classes.includes(name))).map((selector) => selector.style);
  const own = parseStyle(element.attrs.style);
  if (element.attrs.align && !own.has('text-align')) own.set('text-align', element.attrs.align);
  return cleanStyle(mergeStyles(state.tags[tag], extra, ...matched, own), state.report);
}

function styleAttr(style: Style): string {
  return style.size ? ` style="${escapeAttr(serializeStyle(style))}"` : '';
}

function commonAttrs(element: HElement): string {
  return ['dir', 'lang', 'title'].filter((name) => element.attrs[name]).map((name) => ` ${name}="${escapeAttr(element.attrs[name])}"`).join('');
}

function url(value: string | undefined, kind: 'link' | 'image', state: State): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (MERGE_TOKEN.test(trimmed) || SAFE_URL.test(trimmed)) return trimmed;
  if (kind === 'image' && /^cid:/i.test(trimmed)) return trimmed;
  if (/^data:/i.test(trimmed)) {
    if (kind === 'image') state.report.warn('Gmail and Outlook block data: images; host the image and use its URL');
    return kind === 'image' ? trimmed : undefined;
  }
  if (/^[a-z][a-z\d+.-]*:/i.test(trimmed)) {
    state.report.warn(`Removed a ${trimmed.split(':')[0]}: ${kind === 'image' ? 'image source' : 'link'}`);
    return undefined;
  }
  if (state.baseUrl) {
    try {
      return new URL(trimmed, state.baseUrl).href;
    } catch {
      // Fall through to the warning.
    }
  }
  state.report.warn(`Relative ${kind === 'image' ? 'image' : 'link'} URLs do not work in email; pass baseUrl (found "${trimmed}")`);
  return trimmed;
}

/** A full-width layout table holding one cell: how email spaces and decorates blocks. */
function blockTable(content: string, tdStyle: string, tdAttrs = ''): string {
  return `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tr><td${tdAttrs} style="${escapeAttr(tdStyle)}">${content}</td></tr></table>`;
}

const size = (value: number) => (value ? `${value}px` : '0');

const isButton = (element: HElement) => element.tag === 'a' && (/\b(button|btn)\b/.test(element.attrs.class ?? '') || 'data-email-button' in element.attrs || element.attrs.role === 'button');

// ---- inline content -----------------------------------------------------------------------

function renderInlines(nodes: HNode[], state: State): string {
  return nodes.map((node) => renderInline(node, state)).join('');
}

function renderInline(node: HNode, state: State): string {
  if (!isElement(node)) return escapeText(node);
  const { tag } = node;
  if (DROP.has(tag)) return '';
  if (tag === 'span' && classesOf(node).includes('rte-merge-tag')) {
    // Editora merge tags: the bare token, for the email service to fill in.
    return escapeText(node.attrs['data-token'] || textOf(node));
  }
  if (tag === 'br') return '<br>';
  if (tag === 'img') return renderImage(node, state, false);
  if (tag === 'a') {
    const href = url(node.attrs.href, 'link', state);
    if (isButton(node)) state.report.warn('A button inside a line of text shows as a plain link in Outlook; put it in its own paragraph');
    const style = styleFor(node, state);
    const target = node.attrs.target ? ` target="${escapeAttr(node.attrs.target)}"` : '';
    return href ? `<a href="${escapeAttr(href)}"${target}${commonAttrs(node)}${styleAttr(style)}>${renderInlines(node.children, state)}</a>` : `<span${styleAttr(style)}>${renderInlines(node.children, state)}</span>`;
  }
  if (tag === 'mark') return `<span${styleAttr(styleFor(node, state))}>${renderInlines(node.children, state)}</span>`;
  if (tag === 'font') {
    const extra = [node.attrs.color && `color:${node.attrs.color}`, node.attrs.face && `font-family:${node.attrs.face}`].filter(Boolean).join(';');
    return `<span${styleAttr(styleFor(node, state, 'span', extra))}>${renderInlines(node.children, state)}</span>`;
  }
  if (tag === 'button') {
    state.report.warn('Buttons and form controls do nothing in email; use a link with class="button"');
    return renderInlines(node.children, state);
  }
  if (INLINE_KEEP.has(tag)) {
    const name = tag === 'strike' || tag === 'del' ? 's' : tag;
    return `<${name}${commonAttrs(node)}${styleAttr(styleFor(node, state))}>${renderInlines(node.children, state)}</${name}>`;
  }
  // Anything else inline (ins, time, label...): keep the content.
  return renderInlines(node.children, state);
}

function renderImage(element: HElement, state: State, standalone: boolean): string {
  const src = url(element.attrs.src, 'image', state);
  if (!src) return '';
  const own = parseStyle(element.attrs.style);
  const percent = /^(\d+(?:\.\d+)?)%$/.exec(element.attrs.width ?? own.get('width') ?? '');
  let width = px(element.attrs.width) ?? px(own.get('width')) ?? (percent ? Math.round((state.contentWidth * Number(percent[1])) / 100) : undefined);
  let height = px(element.attrs.height) ?? px(own.get('height'));
  if (width === undefined) {
    state.report.warn('Images without a width show at their natural size in Outlook; set width on the image');
    if (standalone) width = undefined;
  } else if (width > state.contentWidth) {
    if (height !== undefined) height = Math.round((height * state.contentWidth) / width);
    width = state.contentWidth;
  }
  let alt = element.attrs.alt;
  if (alt === undefined) {
    state.report.warn('Images need alt text: many clients block images until the reader allows them');
    alt = '';
  }
  own.delete('width');
  own.delete('height');
  const base = standalone ? 'display:block;border:0;outline:none;text-decoration:none;max-width:100%;height:auto' : 'display:inline-block;border:0;outline:none;text-decoration:none;max-width:100%;height:auto;vertical-align:middle';
  const style = cleanStyle(mergeStyles(base, own), state.report);
  return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${width !== undefined ? ` width="${width}"` : ''}${height !== undefined ? ` height="${height}"` : ''}${styleAttr(style)}>`;
}

function renderButton(link: HElement, state: State, align: string, gap: number): string {
  const { theme } = state;
  const own = styleFor(link, state, 'a');
  const background = own.get('background-color') ?? own.get('background') ?? theme.buttonBackground;
  const color = parseStyle(link.attrs.style).get('color') ?? theme.buttonColor;
  const href = url(link.attrs.href, 'link', state) ?? '#';
  const font = `font-family:${theme.fontFamily};font-size:${theme.fontSize}px;line-height:${Math.round(theme.fontSize * 1.25)}px;font-weight:bold`;
  // Padding on the cell, so Outlook (which ignores padding on links) still draws the full button.
  const button = `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr><td align="center" bgcolor="${escapeAttr(background)}" style="${escapeAttr(`border-radius:${theme.buttonRadius}px;background-color:${background};padding:12px 24px;mso-padding-alt:12px 24px`)}"><a href="${escapeAttr(href)}"${link.attrs.target ? ` target="${escapeAttr(link.attrs.target)}"` : ''} style="${escapeAttr(`${font};color:${color};text-decoration:none;display:inline-block`)}">${renderInlines(link.children, state)}</a></td></tr></table>`;
  return blockTable(button, `padding:0 0 ${size(gap)}`, ` align="${escapeAttr(align)}"`);
}

// ---- blocks -------------------------------------------------------------------------------

/** Render children as blocks. Runs of inline content become paragraphs; `tight` drops the last block's bottom margin. */
export function renderBlocks(nodes: HNode[], state: State, tight = false): string {
  const groups: Array<HElement | HNode[]> = [];
  for (const node of nodes) {
    if (isElement(node) && (BLOCK.has(node.tag) || DROP.has(node.tag))) groups.push(node);
    else {
      const last = groups[groups.length - 1];
      if (Array.isArray(last)) last.push(node);
      else groups.push([node]);
    }
  }
  const meaningful = groups.filter((group) => (Array.isArray(group) ? hasText(group) : !DROP.has(group.tag)));
  return groups
    .map((group) => {
      const last = tight && group === meaningful[meaningful.length - 1];
      if (Array.isArray(group)) return hasText(group) ? renderParagraph({ tag: 'p', attrs: {}, children: group }, state, last) : '';
      return renderBlock(group, state, last);
    })
    .join('');
}

function withoutBottomMargin(style: Style): Style {
  const margin = style.get('margin');
  if (margin && !style.has('margin-bottom')) {
    const [top, right = top, , left = right] = margin.split(/\s+/);
    style.set('margin', `${top} ${right} 0 ${left}`);
  } else style.set('margin-bottom', '0');
  return style;
}

function renderParagraph(element: HElement, state: State, last: boolean, tag = 'p'): string {
  const meaningful = element.children.filter((child) => isElement(child) || child.trim() !== '');
  const only = meaningful.length === 1 && isElement(meaningful[0]) ? meaningful[0] : undefined;
  const style = styleFor(element, state, tag);
  const align = style.get('text-align') ?? 'left';
  // A paragraph holding just an image (or a linked image) or a button: lay it out as a block.
  if (only && tag === 'p') {
    const linkedImage = only.tag === 'a' && only.children.filter((child) => isElement(child) || child.trim()).length === 1 && only.children.some((child) => isElement(child) && child.tag === 'img');
    if (only.tag === 'img' || linkedImage) {
      const imageElement = only.tag === 'img' ? only : (only.children.find((child) => isElement(child) && child.tag === 'img') as HElement);
      const image = renderImage(imageElement, state, true);
      const href = only.tag === 'a' ? url(only.attrs.href, 'link', state) : undefined;
      const content = href ? `<a href="${escapeAttr(href)}" style="text-decoration:none;">${image}</a>` : image;
      return image ? blockTable(content, `padding:0 0 ${size(last ? 0 : state.theme.spacing)}`, ` align="${escapeAttr(align)}"`) : '';
    }
    if (isButton(only)) return renderButton(only, state, align, last ? 0 : state.theme.spacing);
  }
  if (last) withoutBottomMargin(style);
  // An empty paragraph is a deliberate blank line: keep its height.
  const content = hasText(element.children) ? renderInlines(element.children, state) : '&nbsp;';
  return `<${tag}${commonAttrs(element)}${styleAttr(style)}>${content}</${tag}>`;
}

function renderBlock(element: HElement, state: State, last: boolean): string {
  const { tag } = element;
  const { theme, report } = state;
  const gap = last ? 0 : theme.spacing;
  if (DROP.has(tag)) return '';
  switch (tag) {
    case 'p':
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
    case 'figcaption':
      return renderParagraph(element, state, last, tag);
    case 'center':
      return renderParagraph({ ...element, attrs: { ...element.attrs, align: 'center' } }, state, last);
    case 'dt':
      return renderParagraph({ ...element, attrs: { ...element.attrs, style: `font-weight:bold;margin-bottom:4px;${element.attrs.style ?? ''}` } }, state, last);
    case 'dd':
      return renderParagraph({ ...element, attrs: { ...element.attrs, style: `margin-left:${theme.spacing + 8}px;${element.attrs.style ?? ''}` } }, state, last);
    case 'ul':
    case 'ol': {
      const style = styleFor(element, state);
      if (last) withoutBottomMargin(style);
      const start = tag === 'ol' && element.attrs.start ? ` start="${escapeAttr(element.attrs.start)}"` : '';
      const type = element.attrs.type ? ` type="${escapeAttr(element.attrs.type)}"` : '';
      const items = element.children.filter(isElement).map((child) => (child.tag === 'li' ? renderListItem(child, state) : renderListItem({ tag: 'li', attrs: {}, children: [child] }, state)));
      return `<${tag}${start}${type}${commonAttrs(element)}${styleAttr(style)}>${items.join('')}</${tag}>`;
    }
    case 'li':
      // A stray list item outside a list.
      return renderBlock({ tag: 'ul', attrs: {}, children: [element] }, state, last);
    case 'blockquote': {
      const own = styleFor(element, state, 'blockquote');
      const border = own.get('border-left') ?? `4px solid ${theme.borderColor}`;
      const color = own.get('color') ?? theme.mutedColor;
      const inner = renderBlocks(element.children, { ...state, tags: { ...state.tags, p: `${state.tags.p};color:${color}` } }, true);
      return blockTable(blockTable(inner, `border-left:${border};padding:0 0 0 ${theme.spacing}px`), `padding:0 0 ${size(gap)}`);
    }
    case 'hr': {
      const color = parseStyle(element.attrs.style).get('border-color') ?? theme.borderColor;
      const line = blockTable('&nbsp;', `border-top:1px solid ${color};font-size:0;line-height:0;mso-line-height-rule:exactly`);
      return blockTable(line, `padding:8px 0 ${gap + 8}px`);
    }
    case 'pre': {
      const text = textOf(element).replace(/\n$/, '');
      // Outlook ignores white-space: pre, so keep the layout with &nbsp; and <br>.
      const html = text
        .split('\n')
        .map((line) => escapeText(line.replace(/\t/g, '    ')).replace(/^ +| {2,}/g, (spaces) => '&nbsp;'.repeat(spaces.length)))
        .join('<br>');
      const style = `background-color:${theme.codeBackground};padding:12px 16px;border-radius:6px;font-family:${theme.codeFontFamily};font-size:${Math.round(theme.fontSize * 0.8125)}px;line-height:${Math.round(theme.fontSize * 0.8125 * 1.5)}px;color:${theme.color};mso-line-height-rule:exactly`;
      return blockTable(blockTable(html || '&nbsp;', style, ` bgcolor="${escapeAttr(theme.codeBackground)}"`), `padding:0 0 ${size(gap)}`);
    }
    case 'table':
      return renderTable(element, state, gap);
    case 'iframe': {
      const src = url(element.attrs.src, 'link', state);
      report.warn('Embedded frames and videos do not play in email; they were replaced by a link');
      return src ? renderParagraph({ tag: 'p', attrs: {}, children: [{ tag: 'a', attrs: { href: src }, children: [element.attrs.title || src] }] }, state, last) : '';
    }
    case 'video':
    case 'audio': {
      report.warn('Embedded frames and videos do not play in email; they were replaced by a link');
      const src = element.attrs.src ?? element.children.filter(isElement).find((child) => child.tag === 'source')?.attrs.src;
      const href = url(src, 'link', state);
      if (!href) return '';
      const label = element.attrs.poster ? { tag: 'img', attrs: { src: element.attrs.poster, alt: element.attrs.title ?? 'Play the video' }, children: [] } : element.attrs.title || 'Play the video';
      return renderParagraph({ tag: 'p', attrs: {}, children: [{ tag: 'a', attrs: { href }, children: [label] }] }, state, last);
    }
    default: {
      // div, section, figure, details...: a box when it is styled, otherwise just its content.
      const own = parseStyle(element.attrs.style);
      const boxed = ['background-color', 'background', 'border', 'border-top', 'border-bottom', 'border-left', 'border-right', 'padding'].some((name) => own.has(name));
      const hasBlocks = element.children.some((child) => isElement(child) && BLOCK.has(child.tag));
      if (!boxed) {
        if (!hasBlocks && hasText(element.children)) return renderParagraph({ ...element, tag: 'p' }, state, last);
        return renderBlocks(element.children, state, last);
      }
      const background = own.get('background-color') ?? own.get('background');
      const inner = renderBlocks(element.children, state, true);
      const box = blockTable(inner, serializeStyle(cleanStyle(own, report)), background && !/url\(/.test(background) ? ` bgcolor="${escapeAttr(background)}"` : '');
      return blockTable(box, `padding:0 0 ${size(gap)}`);
    }
  }
}

function renderListItem(element: HElement, state: State): string {
  const style = styleFor(element, state, 'li');
  const blocks = element.children.filter((child) => isElement(child) && BLOCK.has(child.tag));
  // Editors wrap item text in <p>: a single paragraph is just the item's text.
  const single = blocks.length === 1 && isElement(blocks[0]) && blocks[0].tag === 'p' && !element.children.some((child) => child !== blocks[0] && (isElement(child) || child.trim()));
  let content: string;
  if (blocks.length === 0) content = renderInlines(element.children, state);
  else if (single) content = renderInlines((blocks[0] as HElement).children, state);
  else {
    // Item text followed by a nested list: keep the text inline, nested lists tight.
    const parts: string[] = [];
    let inline: HNode[] = [];
    const flush = () => {
      if (hasText(inline)) parts.push(renderInlines(inline, state));
      inline = [];
    };
    const children = element.children;
    children.forEach((child, index) => {
      if (isElement(child) && BLOCK.has(child.tag)) {
        flush();
        const lastChild = !children.slice(index + 1).some((next) => isElement(next) || next.trim());
        if (child.tag === 'p' && parts.length === 0) parts.push(renderInlines(child.children, state));
        else if (child.tag === 'ul' || child.tag === 'ol') parts.push(renderBlock({ ...child, attrs: { ...child.attrs, style: `margin-top:${Math.round(state.theme.spacing / 2)}px;${child.attrs.style ?? ''}` } }, state, true));
        else parts.push(renderBlock(child, state, lastChild));
      } else inline.push(child);
    });
    flush();
    content = parts.join('');
  }
  const checked = element.attrs['data-checked'];
  const box = checked === 'true' ? '&#9745;&nbsp;' : checked === 'false' ? '&#9744;&nbsp;' : '';
  if (box) style.set('list-style-type', 'none');
  return `<li${commonAttrs(element)}${styleAttr(style)}>${box}${content}</li>`;
}

function renderTable(element: HElement, state: State, gap: number): string {
  const layout = element.attrs.role === 'presentation';
  const rows: HElement[] = [];
  let caption: HElement | undefined;
  const collect = (nodes: HNode[]) => {
    for (const node of nodes) {
      if (!isElement(node)) continue;
      if (node.tag === 'tr') rows.push(node);
      else if (node.tag === 'caption') caption = node;
      else if (['thead', 'tbody', 'tfoot'].includes(node.tag)) collect(node.children);
    }
  };
  collect(element.children);
  const own = cleanStyle(parseStyle(element.attrs.style), state.report);
  const width = element.attrs.width ?? (px(own.get('width')) !== undefined ? String(px(own.get('width'))) : '100%');
  const cellTags = layout ? { ...state.tags, td: state.tags.p.replace(/margin:[^;]*;?/, ''), th: state.tags.p.replace(/margin:[^;]*;?/, '') } : state.tags;
  const cellState = { ...state, tags: cellTags };
  const body = rows
    .map((row) => {
      const cells = row.children.filter(isElement).filter((cell) => cell.tag === 'td' || cell.tag === 'th');
      return `<tr>${cells
        .map((cell) => {
          const span = ['colspan', 'rowspan'].filter((name) => Number(cell.attrs[name]) > 1).map((name) => ` ${name}="${Number(cell.attrs[name])}"`).join('');
          const cellStyle = styleFor(cell, cellState);
          const background = cellStyle.get('background-color');
          const bg = background ? ` bgcolor="${escapeAttr(background)}"` : '';
          const align = cellStyle.get('text-align');
          const hasBlocks = cell.children.some((child) => isElement(child) && BLOCK.has(child.tag));
          const content = hasBlocks ? renderBlocks(cell.children, cellState, true) : renderInlines(cell.children, cellState);
          return `<${cell.tag}${span}${bg}${align ? ` align="${escapeAttr(align)}"` : ''}${styleAttr(cellStyle)}>${content || '&nbsp;'}</${cell.tag}>`;
        })
        .join('')}</tr>`;
    })
    .join('');
  const captionHtml = caption ? `<caption${styleAttr(styleFor(caption, state))}>${renderInlines(caption.children, state)}</caption>` : '';
  const role = layout ? ' role="presentation"' : '';
  const tableStyle = serializeStyle(mergeStyles('border-collapse:collapse', own));
  const table = `<table${role} width="${escapeAttr(width)}" border="0" cellpadding="0" cellspacing="0" style="${escapeAttr(tableStyle)}">${captionHtml}${body}</table>`;
  return blockTable(table, `padding:0 0 ${size(gap)}`);
}

export function textOf(node: HNode): string {
  if (!isElement(node)) return node;
  return node.tag === 'br' ? '\n' : node.children.map(textOf).join('');
}
