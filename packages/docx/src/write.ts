import type { Block, Doc, Inline, ListNode, Mark, TableNode } from './ast';
import { EXTENSIONS, fromBase64, imageSize, imageType } from './media';
import type { Report } from './report';
import { el, escapeXml } from './xml';
import { utf8, zip } from './zip';

export interface WriteOptions {
  title?: string;
  author?: string;
  /** Document language, e.g. `en-US`. */
  lang?: string;
  /** Page size. Default `letter`. */
  page?: 'letter' | 'a4';
  /** Body font and size in points. Defaults: Calibri, 11. */
  font?: string;
  fontSize?: number;
  /** Stored as the document's created and modified time. Default: now. */
  date?: Date;
  /**
   * Load an image's bytes. Default: `data:` URLs are decoded and http(s) URLs
   * are fetched with `fetch`. Return undefined to leave the image out.
   */
  loadImage?: (src: string) => Promise<Uint8Array | undefined>;
}

interface Media {
  rId: string;
  path: string;
  contentType: string;
  width: number;
  height: number;
}

interface State {
  report: Report;
  rels: string[];
  links: Map<string, string>;
  media: Map<string, Media | null>;
  abstracts: string[];
  nums: string[];
  drawingId: number;
  /** Text width of the page in EMU, for scaling images. */
  maxWidth: number;
}

const EMU_PER_PX = 9525;
const PAGES = { letter: { width: 12240, height: 15840 }, a4: { width: 11906, height: 16838 } };
const MARGIN = 1440;

// ---- runs ---------------------------------------------------------------------------------

/** Run properties in the order the schema requires. */
function runProperties(marks: Mark[] = [], extra: { style?: string } = {}): string {
  const has = (mark: Mark) => marks.includes(mark);
  const style = extra.style ?? (has('code') ? 'CodeChar' : undefined);
  const parts = [
    style ? el('w:rStyle', { 'w:val': style }) : '',
    has('bold') ? el('w:b') : '',
    has('italic') ? el('w:i') : '',
    has('strike') ? el('w:strike') : '',
    has('highlight') ? el('w:highlight', { 'w:val': 'yellow' }) : '',
    has('underline') ? el('w:u', { 'w:val': 'single' }) : '',
    has('superscript') ? el('w:vertAlign', { 'w:val': 'superscript' }) : has('subscript') ? el('w:vertAlign', { 'w:val': 'subscript' }) : '',
  ].join('');
  return parts ? el('w:rPr', null, parts) : '';
}

function textRuns(text: string, marks: Mark[] | undefined, style?: string): string {
  const rPr = runProperties(marks, { style });
  // Tabs are their own element inside a run.
  const content = text
    .split('\t')
    .map((part, index) => (index > 0 ? el('w:tab') : '') + (part ? `<w:t xml:space="preserve">${escapeXml(part)}</w:t>` : ''))
    .join('');
  return content ? `<w:r>${rPr}${content}</w:r>` : '';
}

function linkId(href: string, state: State): string {
  let id = state.links.get(href);
  if (!id) {
    id = `rId${state.rels.length + 1}`;
    state.links.set(href, id);
    state.rels.push(el('Relationship', { Id: id, Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink', Target: href, TargetMode: 'External' }));
  }
  return id;
}

function drawing(media: Media, alt: string | undefined, title: string | undefined, state: State): string {
  let { width, height } = media;
  const cx = Math.min(width * EMU_PER_PX, state.maxWidth);
  const cy = Math.round((height * EMU_PER_PX * cx) / (width * EMU_PER_PX));
  const id = (state.drawingId += 1);
  width = cx;
  height = cy;
  const name = `Picture ${id}`;
  return `<w:r><w:drawing>${el(
    'wp:inline',
    { distT: 0, distB: 0, distL: 0, distR: 0 },
    el('wp:extent', { cx: width, cy: height }),
    el('wp:effectExtent', { l: 0, t: 0, r: 0, b: 0 }),
    el('wp:docPr', { id, name, descr: alt || undefined, title: title || undefined }),
    el('wp:cNvGraphicFramePr', null, el('a:graphicFrameLocks', { 'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main', noChangeAspect: 1 })),
    el(
      'a:graphic',
      { 'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main' },
      el(
        'a:graphicData',
        { uri: 'http://schemas.openxmlformats.org/drawingml/2006/picture' },
        el(
          'pic:pic',
          { 'xmlns:pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture' },
          el('pic:nvPicPr', null, el('pic:cNvPr', { id, name, descr: alt || undefined }), el('pic:cNvPicPr')),
          el('pic:blipFill', null, el('a:blip', { 'r:embed': media.rId }), el('a:stretch', null, el('a:fillRect'))),
          el('pic:spPr', null, el('a:xfrm', null, el('a:off', { x: 0, y: 0 }), el('a:ext', { cx: width, cy: height })), el('a:prstGeom', { prst: 'rect' }, el('a:avLst'))),
        ),
      ),
    ),
  )}</w:drawing></w:r>`;
}

function writeInlines(inlines: Inline[], state: State): string {
  let out = '';
  let index = 0;
  while (index < inlines.length) {
    const node = inlines[index];
    if (node.type === 'text' && node.link) {
      // Consecutive runs with the same link share one hyperlink element.
      let runs = '';
      const href = node.link.href;
      while (index < inlines.length) {
        const next = inlines[index];
        if (next.type !== 'text' || next.link?.href !== href) break;
        runs += textRuns(next.text, next.marks, 'Hyperlink');
        index += 1;
      }
      out += href.startsWith('#') ? el('w:hyperlink', { 'w:anchor': href.slice(1), 'w:history': 1 }, runs) : el('w:hyperlink', { 'r:id': linkId(href, state), 'w:history': 1 }, runs);
      continue;
    }
    index += 1;
    if (node.type === 'text') out += textRuns(node.text, node.marks);
    else if (node.type === 'break') out += `<w:r>${el('w:br')}</w:r>`;
    else {
      const media = state.media.get(node.src);
      if (media) out += drawing(media, node.alt, node.title, state);
      else if (node.alt) out += textRuns(`[${node.alt}]`, undefined);
    }
  }
  return out;
}

// ---- blocks -------------------------------------------------------------------------------

function paragraphXml(content: string, props: { style?: string; numId?: number; ilvl?: number; indent?: number; border?: boolean } = {}): string {
  const pPr = [
    props.style ? el('w:pStyle', { 'w:val': props.style }) : '',
    props.numId !== undefined ? el('w:numPr', null, el('w:ilvl', { 'w:val': props.ilvl ?? 0 }), el('w:numId', { 'w:val': props.numId })) : '',
    props.border ? el('w:pBdr', null, el('w:bottom', { 'w:val': 'single', 'w:sz': 6, 'w:space': 1, 'w:color': 'auto' })) : '',
    props.indent ? el('w:ind', { 'w:left': props.indent }) : '',
  ].join('');
  return `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ''}${content}</w:p>`;
}

const BULLETS = ['•', '◦', '▪'];

/** One numbering definition per top-level list, with each level's type taken from the lists at that depth. */
function numbering(list: ListNode, state: State): number {
  const levels: Array<{ ordered: boolean; start: number } | undefined> = [];
  const visit = (node: ListNode, depth: number) => {
    levels[depth] ??= { ordered: node.ordered, start: node.start ?? 1 };
    for (const item of node.items) for (const child of item.children) if (child.type === 'list' && depth < 8) visit(child, depth + 1);
  };
  visit(list, 0);
  const abstractId = state.abstracts.length;
  const lvls = Array.from({ length: 9 }, (_, depth) => {
    const level = levels[depth] ?? levels[levels.length - 1] ?? { ordered: false, start: 1 };
    const indent = el('w:pPr', null, el('w:ind', { 'w:left': 720 * (depth + 1), 'w:hanging': 360 }));
    return el(
      'w:lvl',
      { 'w:ilvl': depth },
      el('w:start', { 'w:val': level.ordered ? level.start : 1 }),
      el('w:numFmt', { 'w:val': level.ordered ? 'decimal' : 'bullet' }),
      el('w:lvlText', { 'w:val': level.ordered ? `%${depth + 1}.` : BULLETS[depth % 3] }),
      el('w:lvlJc', { 'w:val': 'left' }),
      indent,
    );
  });
  state.abstracts.push(el('w:abstractNum', { 'w:abstractNumId': abstractId }, el('w:multiLevelType', { 'w:val': 'hybridMultilevel' }), ...lvls));
  const numId = state.nums.length + 1;
  state.nums.push(el('w:num', { 'w:numId': numId }, el('w:abstractNumId', { 'w:val': abstractId })));
  return numId;
}

function writeList(list: ListNode, state: State, numId: number, depth: number): string {
  let out = '';
  for (const item of list.items) {
    let first = true;
    const box = item.checked === undefined ? '' : item.checked ? '☑ ' : '☐ ';
    for (const child of item.children) {
      if (child.type === 'list') {
        out += writeList(child, state, numId, Math.min(8, depth + 1));
        continue;
      }
      if (first && (child.type === 'paragraph' || child.type === 'heading')) {
        if (child.type === 'heading') state.report.warn('Headings inside list items were written as list text');
        out += paragraphXml((box ? textRuns(box, undefined) : '') + writeInlines(child.children, state), { style: 'ListParagraph', numId, ilvl: depth });
      } else if (child.type === 'paragraph') {
        // Further paragraphs of the item: indented to the item's text, without a number.
        out += paragraphXml(writeInlines(child.children, state), { style: 'ListParagraph', indent: 720 * (depth + 1) });
      } else {
        if (first) out += paragraphXml(box ? textRuns(box, undefined) : '', { style: 'ListParagraph', numId, ilvl: depth });
        out += writeBlocks([child], state);
      }
      first = false;
    }
    if (first) out += paragraphXml(box ? textRuns(box, undefined) : '', { style: 'ListParagraph', numId, ilvl: depth });
  }
  return out;
}

function writeTable(table: TableNode, state: State): string {
  // Lay the cells out on a grid, so rowspans can be written as vertical merges.
  const grid: Array<Array<{ cell: TableNode['rows'][number]['cells'][number]; start: boolean } | undefined>> = [];
  table.rows.forEach((row, rowIndex) => {
    grid[rowIndex] ??= [];
    let column = 0;
    for (const cell of row.cells) {
      while (grid[rowIndex][column]) column += 1;
      const colspan = cell.colspan ?? 1;
      const rowspan = cell.rowspan ?? 1;
      for (let r = 0; r < rowspan; r += 1) {
        grid[rowIndex + r] ??= [];
        for (let c = 0; c < colspan; c += 1) grid[rowIndex + r][column + c] = { cell, start: r === 0 && c === 0 };
      }
      column += colspan;
    }
  });
  const columns = Math.max(1, ...grid.map((row) => row.length));
  const width = Math.floor((state.maxWidth / 635) / columns); // EMU -> twips, per column
  const rows = grid.slice(0, table.rows.length).map((row, rowIndex) => {
    const header = table.rows[rowIndex].cells.length > 0 && table.rows[rowIndex].cells.every((cell) => cell.header);
    let cells = '';
    for (let column = 0; column < columns; column += 1) {
      const slot = row[column];
      if (!slot) {
        cells += el('w:tc', null, el('w:tcPr', null, el('w:tcW', { 'w:w': width, 'w:type': 'dxa' })), '<w:p/>');
        continue;
      }
      const { cell, start } = slot;
      // Only the first column of a merged cell is written; gridSpan covers the rest.
      if (column > 0 && row[column - 1]?.cell === cell) continue;
      const colspan = cell.colspan ?? 1;
      const merged = (cell.rowspan ?? 1) > 1;
      const tcPr = el(
        'w:tcPr',
        null,
        el('w:tcW', { 'w:w': width * colspan, 'w:type': 'dxa' }),
        colspan > 1 ? el('w:gridSpan', { 'w:val': colspan }) : '',
        merged ? (start ? el('w:vMerge', { 'w:val': 'restart' }) : el('w:vMerge')) : '',
      );
      if (!start && merged && !table.rows[rowIndex].cells.includes(cell)) {
        cells += el('w:tc', null, tcPr, '<w:p/>');
        continue;
      }
      if (cell.header && !header) state.report.warn('Header cells outside a header row were written as bold text');
      const content = cell.header && !header ? boldBlocks(cell.children) : cell.children;
      let body = writeBlocks(content.length ? content : [{ type: 'paragraph', children: [] }], state);
      // A cell must end with a paragraph.
      if (!body.endsWith('</w:p>') && !body.endsWith('<w:p/>')) body += '<w:p/>';
      cells += el('w:tc', null, tcPr, body);
    }
    const trPr = header ? el('w:trPr', null, el('w:tblHeader')) : '';
    return `<w:tr>${trPr}${cells}</w:tr>`;
  });
  const tblPr = el(
    'w:tblPr',
    null,
    el('w:tblStyle', { 'w:val': 'TableGrid' }),
    el('w:tblW', { 'w:w': 5000, 'w:type': 'pct' }),
    el('w:tblLook', { 'w:val': '04A0', 'w:firstRow': 1, 'w:lastRow': 0, 'w:firstColumn': 0, 'w:lastColumn': 0, 'w:noHBand': 0, 'w:noVBand': 1 }),
  );
  const tblGrid = el('w:tblGrid', null, ...Array.from({ length: columns }, () => el('w:gridCol', { 'w:w': width })));
  return `<w:tbl>${tblPr}${tblGrid}${rows.join('')}</w:tbl>`;
}

function boldBlocks(blocks: Block[]): Block[] {
  return blocks.map((block) => (block.type === 'paragraph' ? { ...block, children: block.children.map((node) => (node.type === 'text' ? { ...node, marks: [...new Set([...(node.marks ?? []), 'bold' as Mark])] } : node)) } : block));
}

function writeBlocks(blocks: Block[], state: State, quoted = false): string {
  let out = '';
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        out += paragraphXml(writeInlines(block.children, state), quoted ? { style: 'Quote' } : {});
        break;
      case 'heading':
        if (quoted) state.report.warn('Headings inside quotes were written as quote paragraphs');
        out += paragraphXml(writeInlines(block.children, state), { style: quoted ? 'Quote' : `Heading${block.level}` });
        break;
      case 'blockquote':
        if (quoted) state.report.warn('Nested quotes were flattened');
        out += writeBlocks(block.children, state, true);
        break;
      case 'list':
        if (quoted) state.report.warn('Lists inside quotes were written without the quote');
        out += writeList(block, state, numbering(block, state), 0);
        break;
      case 'code': {
        if (block.language) state.report.warn('Code block languages were not kept (Word has no place for them)');
        const lines = block.text.split('\n').map((line) => textRuns(line, undefined));
        out += paragraphXml(lines.join(`<w:r>${el('w:br')}</w:r>`), { style: 'Code' });
        break;
      }
      case 'rule':
        out += paragraphXml('', { border: true });
        break;
      case 'image':
        out += paragraphXml(writeInlines([block], state), quoted ? { style: 'Quote' } : {});
        break;
      case 'table':
        out += writeTable(block, state);
        break;
    }
  }
  return out;
}

// ---- images -------------------------------------------------------------------------------

function collectImages(blocks: Block[], out: Set<string>): Set<string> {
  const inlines = (list: Inline[]) => list.forEach((node) => node.type === 'image' && out.add(node.src));
  for (const block of blocks) {
    if (block.type === 'paragraph' || block.type === 'heading') inlines(block.children);
    else if (block.type === 'image') out.add(block.src);
    else if (block.type === 'blockquote') collectImages(block.children, out);
    else if (block.type === 'list') block.items.forEach((item) => collectImages(item.children, out));
    else if (block.type === 'table') block.rows.forEach((row) => row.cells.forEach((cell) => collectImages(cell.children, out)));
  }
  return out;
}

async function defaultLoad(src: string): Promise<Uint8Array | undefined> {
  const data = /^data:[^;,]*(;base64)?,(.*)$/s.exec(src);
  if (data) return data[1] ? fromBase64(data[2]) : utf8(decodeURIComponent(data[2]));
  if (/^https?:/i.test(src) && typeof fetch === 'function') {
    const response = await fetch(src);
    return response.ok ? new Uint8Array(await response.arrayBuffer()) : undefined;
  }
  return undefined;
}

async function loadMedia(sources: Set<string>, state: State, options: WriteOptions, files: Array<[string, Uint8Array]>): Promise<void> {
  const load = options.loadImage ?? defaultLoad;
  let count = 0;
  for (const src of sources) {
    let bytes: Uint8Array | undefined;
    try {
      bytes = await load(src);
    } catch {
      bytes = undefined;
    }
    if (!bytes) {
      state.report.warn(`An image could not be loaded and was replaced by its alt text (${src.length > 80 ? `${src.slice(0, 77)}...` : src})`);
      state.media.set(src, null);
      continue;
    }
    const contentType = imageType(src.split(/[?#]/)[0], bytes);
    const extension = EXTENSIONS[contentType];
    if (!extension || contentType === 'image/svg+xml') {
      state.report.warn(`${contentType === 'image/svg+xml' ? 'SVG' : 'Unrecognised'} images were left out; convert them to PNG`);
      state.media.set(src, null);
      continue;
    }
    if (contentType === 'image/webp') state.report.warn('WebP images may not show in older versions of Word; PNG or JPEG is safer');
    let size = imageSize(bytes);
    if (!size || !size.width || !size.height) {
      state.report.warn('An image size could not be read; it was set to 400×300');
      size = { width: 400, height: 300 };
    }
    count += 1;
    const path = `media/image${count}.${extension}`;
    const rId = `rId${state.rels.length + 1}`;
    state.rels.push(el('Relationship', { Id: rId, Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/image', Target: path }));
    files.push([`word/${path}`, bytes]);
    state.media.set(src, { rId, path, contentType, ...size });
  }
}

// ---- package ------------------------------------------------------------------------------

const XML = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';

function stylesXml(font: string, size: number, lang: string): string {
  const half = Math.round(size * 2);
  const heading = (level: number, points: number) =>
    el(
      'w:style',
      { 'w:type': 'paragraph', 'w:styleId': `Heading${level}` },
      el('w:name', { 'w:val': `heading ${level}` }),
      el('w:basedOn', { 'w:val': 'Normal' }),
      el('w:next', { 'w:val': 'Normal' }),
      el('w:uiPriority', { 'w:val': 9 }),
      el('w:qFormat'),
      el('w:pPr', null, el('w:keepNext'), el('w:keepLines'), el('w:spacing', { 'w:before': level === 1 ? 360 : 240, 'w:after': 80 }), el('w:outlineLvl', { 'w:val': level - 1 })),
      el('w:rPr', null, el('w:b'), el('w:color', { 'w:val': '1F2328' }), el('w:sz', { 'w:val': points * 2 }), el('w:szCs', { 'w:val': points * 2 })),
    );
  return `${XML}${el(
    'w:styles',
    { 'xmlns:w': W_NS },
    el(
      'w:docDefaults',
      null,
      el('w:rPrDefault', null, el('w:rPr', null, el('w:rFonts', { 'w:ascii': font, 'w:hAnsi': font, 'w:eastAsia': font, 'w:cs': font }), el('w:sz', { 'w:val': half }), el('w:szCs', { 'w:val': half }), el('w:lang', { 'w:val': lang }))),
      el('w:pPrDefault', null, el('w:pPr', null, el('w:spacing', { 'w:after': 160, 'w:line': 276, 'w:lineRule': 'auto' }))),
    ),
    el('w:style', { 'w:type': 'paragraph', 'w:default': 1, 'w:styleId': 'Normal' }, el('w:name', { 'w:val': 'Normal' }), el('w:qFormat')),
    el('w:style', { 'w:type': 'character', 'w:default': 1, 'w:styleId': 'DefaultParagraphFont' }, el('w:name', { 'w:val': 'Default Paragraph Font' }), el('w:uiPriority', { 'w:val': 1 }), el('w:semiHidden'), el('w:unhideWhenUsed')),
    heading(1, 20),
    heading(2, 16),
    heading(3, 14),
    heading(4, 12),
    heading(5, 11),
    heading(6, 11),
    el(
      'w:style',
      { 'w:type': 'paragraph', 'w:styleId': 'Quote' },
      el('w:name', { 'w:val': 'Quote' }),
      el('w:basedOn', { 'w:val': 'Normal' }),
      el('w:next', { 'w:val': 'Normal' }),
      el('w:uiPriority', { 'w:val': 29 }),
      el('w:qFormat'),
      el('w:pPr', null, el('w:pBdr', null, el('w:left', { 'w:val': 'single', 'w:sz': 18, 'w:space': 8, 'w:color': 'D0D7DE' })), el('w:ind', { 'w:left': 360 })),
      el('w:rPr', null, el('w:color', { 'w:val': '59636E' })),
    ),
    el(
      'w:style',
      { 'w:type': 'paragraph', 'w:styleId': 'Code' },
      el('w:name', { 'w:val': 'Code' }),
      el('w:basedOn', { 'w:val': 'Normal' }),
      el('w:qFormat'),
      el('w:pPr', null, el('w:shd', { 'w:val': 'clear', 'w:color': 'auto', 'w:fill': 'F3F4F6' }), el('w:spacing', { 'w:line': 240, 'w:lineRule': 'auto' })),
      el('w:rPr', null, el('w:rFonts', { 'w:ascii': 'Consolas', 'w:hAnsi': 'Consolas', 'w:cs': 'Consolas' }), el('w:sz', { 'w:val': half - 2 }), el('w:szCs', { 'w:val': half - 2 })),
    ),
    el(
      'w:style',
      { 'w:type': 'character', 'w:styleId': 'CodeChar' },
      el('w:name', { 'w:val': 'Code Char' }),
      el('w:basedOn', { 'w:val': 'DefaultParagraphFont' }),
      el('w:rPr', null, el('w:rFonts', { 'w:ascii': 'Consolas', 'w:hAnsi': 'Consolas', 'w:cs': 'Consolas' }), el('w:shd', { 'w:val': 'clear', 'w:color': 'auto', 'w:fill': 'F3F4F6' })),
    ),
    el(
      'w:style',
      { 'w:type': 'character', 'w:styleId': 'Hyperlink' },
      el('w:name', { 'w:val': 'Hyperlink' }),
      el('w:basedOn', { 'w:val': 'DefaultParagraphFont' }),
      el('w:uiPriority', { 'w:val': 99 }),
      el('w:unhideWhenUsed'),
      el('w:rPr', null, el('w:color', { 'w:val': '0B57D0' }), el('w:u', { 'w:val': 'single' })),
    ),
    el(
      'w:style',
      { 'w:type': 'paragraph', 'w:styleId': 'ListParagraph' },
      el('w:name', { 'w:val': 'List Paragraph' }),
      el('w:basedOn', { 'w:val': 'Normal' }),
      el('w:uiPriority', { 'w:val': 34 }),
      el('w:qFormat'),
      el('w:pPr', null, el('w:spacing', { 'w:after': 80 }), el('w:ind', { 'w:left': 720 }), el('w:contextualSpacing')),
    ),
    el('w:style', { 'w:type': 'table', 'w:default': 1, 'w:styleId': 'TableNormal' }, el('w:name', { 'w:val': 'Normal Table' }), el('w:uiPriority', { 'w:val': 99 }), el('w:semiHidden'), el('w:unhideWhenUsed'), el('w:tblPr', null, el('w:tblInd', { 'w:w': 0, 'w:type': 'dxa' }), el('w:tblCellMar', null, el('w:top', { 'w:w': 0, 'w:type': 'dxa' }), el('w:left', { 'w:w': 108, 'w:type': 'dxa' }), el('w:bottom', { 'w:w': 0, 'w:type': 'dxa' }), el('w:right', { 'w:w': 108, 'w:type': 'dxa' })))),
    el(
      'w:style',
      { 'w:type': 'table', 'w:styleId': 'TableGrid' },
      el('w:name', { 'w:val': 'Table Grid' }),
      el('w:basedOn', { 'w:val': 'TableNormal' }),
      el('w:uiPriority', { 'w:val': 39 }),
      el('w:pPr', null, el('w:spacing', { 'w:after': 0, 'w:line': 240, 'w:lineRule': 'auto' })),
      el(
        'w:tblPr',
        null,
        el('w:tblBorders', null, ...['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map((side) => el(`w:${side}`, { 'w:val': 'single', 'w:sz': 4, 'w:space': 0, 'w:color': 'D0D7DE' }))),
        el('w:tblCellMar', null, el('w:top', { 'w:w': 60, 'w:type': 'dxa' }), el('w:left', { 'w:w': 108, 'w:type': 'dxa' }), el('w:bottom', { 'w:w': 60, 'w:type': 'dxa' }), el('w:right', { 'w:w': 108, 'w:type': 'dxa' })),
      ),
      el('w:tblStylePr', { 'w:type': 'firstRow' }, el('w:rPr', null, el('w:b')), el('w:tcPr', null, el('w:shd', { 'w:val': 'clear', 'w:color': 'auto', 'w:fill': 'F3F4F6' }))),
    ),
  )}`;
}

export async function writeDocxDoc(doc: Doc, report: Report, options: WriteOptions = {}): Promise<Uint8Array> {
  const page = PAGES[options.page ?? 'letter'];
  const state: State = {
    report,
    // rId1-3 are styles, numbering and settings.
    rels: [
      el('Relationship', { Id: 'rId1', Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles', Target: 'styles.xml' }),
      el('Relationship', { Id: 'rId2', Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering', Target: 'numbering.xml' }),
      el('Relationship', { Id: 'rId3', Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings', Target: 'settings.xml' }),
    ],
    links: new Map(),
    media: new Map(),
    abstracts: [],
    nums: [],
    drawingId: 0,
    maxWidth: (page.width - MARGIN * 2) * 635,
  };
  const mediaFiles: Array<[string, Uint8Array]> = [];
  await loadMedia(collectImages(doc.children, new Set()), state, options, mediaFiles);

  const body = writeBlocks(doc.children, state);
  const sectPr = el(
    'w:sectPr',
    null,
    el('w:pgSz', { 'w:w': page.width, 'w:h': page.height }),
    el('w:pgMar', { 'w:top': MARGIN, 'w:right': MARGIN, 'w:bottom': MARGIN, 'w:left': MARGIN, 'w:header': 720, 'w:footer': 720, 'w:gutter': 0 }),
    el('w:cols', { 'w:space': 720 }),
  );
  const document = `${XML}${el(
    'w:document',
    {
      'xmlns:w': W_NS,
      'xmlns:r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'xmlns:wp': 'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
      'xmlns:a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'xmlns:pic': 'http://schemas.openxmlformats.org/drawingml/2006/picture',
    },
    el('w:body', null, body || '<w:p/>', sectPr),
  )}`;

  const lang = options.lang ?? 'en-US';
  const date = (options.date ?? new Date()).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const types = new Set(mediaFiles.map(([path]) => path.split('.').pop()!));
  const contentTypes = `${XML}${el(
    'Types',
    { xmlns: 'http://schemas.openxmlformats.org/package/2006/content-types' },
    el('Default', { Extension: 'rels', ContentType: 'application/vnd.openxmlformats-package.relationships+xml' }),
    el('Default', { Extension: 'xml', ContentType: 'application/xml' }),
    ...[...types].map((extension) => el('Default', { Extension: extension, ContentType: Object.entries(EXTENSIONS).find(([, value]) => value === extension)![0] })),
    el('Override', { PartName: '/word/document.xml', ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml' }),
    el('Override', { PartName: '/word/styles.xml', ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml' }),
    el('Override', { PartName: '/word/numbering.xml', ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml' }),
    el('Override', { PartName: '/word/settings.xml', ContentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml' }),
    el('Override', { PartName: '/docProps/core.xml', ContentType: 'application/vnd.openxmlformats-package.core-properties+xml' }),
    el('Override', { PartName: '/docProps/app.xml', ContentType: 'application/vnd.openxmlformats-officedocument.extended-properties+xml' }),
  )}`;
  const rootRels = `${XML}${el(
    'Relationships',
    { xmlns: 'http://schemas.openxmlformats.org/package/2006/relationships' },
    el('Relationship', { Id: 'rId1', Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument', Target: 'word/document.xml' }),
    el('Relationship', { Id: 'rId2', Type: 'http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties', Target: 'docProps/core.xml' }),
    el('Relationship', { Id: 'rId3', Type: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties', Target: 'docProps/app.xml' }),
  )}`;
  const core = `${XML}<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">${options.title ? el('dc:title', null, escapeXml(options.title)) : ''}${options.author ? el('dc:creator', null, escapeXml(options.author)) + el('cp:lastModifiedBy', null, escapeXml(options.author)) : ''}<dcterms:created xsi:type="dcterms:W3CDTF">${date}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${date}</dcterms:modified></cp:coreProperties>`;
  const app = `${XML}<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Editora</Application></Properties>`;
  const settings = `${XML}${el('w:settings', { 'xmlns:w': W_NS }, el('w:defaultTabStop', { 'w:val': 720 }), el('w:characterSpacingControl', { 'w:val': 'doNotCompress' }), el('w:compat', null, el('w:compatSetting', { 'w:name': 'compatibilityMode', 'w:uri': 'http://schemas.microsoft.com/office/word', 'w:val': 15 })))}`;
  const numberingXml = `${XML}${el('w:numbering', { 'xmlns:w': W_NS }, ...state.abstracts, ...state.nums)}`;
  const documentRels = `${XML}${el('Relationships', { xmlns: 'http://schemas.openxmlformats.org/package/2006/relationships' }, ...state.rels)}`;

  return zip([
    ['[Content_Types].xml', utf8(contentTypes)],
    ['_rels/.rels', utf8(rootRels)],
    ['docProps/core.xml', utf8(core)],
    ['docProps/app.xml', utf8(app)],
    ['word/document.xml', utf8(document)],
    ['word/styles.xml', utf8(stylesXml(options.font ?? 'Calibri', options.fontSize ?? 11, lang))],
    ['word/numbering.xml', utf8(numberingXml)],
    ['word/settings.xml', utf8(settings)],
    ['word/_rels/document.xml.rels', utf8(documentRels)],
    ...mediaFiles,
  ]);
}
