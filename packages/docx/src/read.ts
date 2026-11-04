import { normalize, paragraph, type Block, type Doc, type Inline, type Link, type ListItemNode, type ListNode, type Mark, type TableCellNode } from './ast';
import { base64, imageType } from './media';
import type { Report } from './report';
import { child, children, find, findAll, isElement, parseXml, textContent, type XElement } from './xml';
import { DocxError, fromUtf8, openZip, type ZipFiles } from './zip';

export interface DocxImage {
  /** Path inside the .docx, e.g. `word/media/image1.png`. */
  path: string;
  contentType: string;
  data: Uint8Array;
  alt?: string;
}

export interface ReadOptions {
  /**
   * Where images go. Return the `src` to use (for example after uploading the
   * bytes). Default: a `data:` URL.
   */
  image?: (image: DocxImage) => string | Promise<string>;
  /** Tracked changes: keep the document as if they were accepted (default) or rejected. */
  trackedChanges?: 'accept' | 'reject';
  /** Keep empty paragraphs (Word documents often use them for spacing). Default false. */
  keepEmptyParagraphs?: boolean;
  /**
   * Infer structure from formatting when a file has none: typed bullets and
   * numbers become lists, and (in a document without heading styles) short,
   * bold, larger paragraphs become headings. Default true.
   */
  inferStructure?: boolean;
  /** Largest file accepted, in bytes. Default 100 MB. */
  maxSize?: number;
  /** Most bytes the parts read may expand to, in total; guards against "zip bombs". Default 500 MB. */
  maxUncompressedSize?: number;
}

interface Rel {
  target: string;
  external: boolean;
  type: string;
}

interface StyleInfo {
  id: string;
  name: string;
  type: string;
  basedOn?: string;
  pPr?: XElement;
  rPr?: XElement;
}

interface Level {
  ordered: boolean;
  start: number;
}

interface Context {
  files: ZipFiles;
  rels: Map<string, Rel>;
  styles: Map<string, StyleInfo>;
  /** numId -> levels, with level overrides applied. */
  numbering: Map<string, Level[]>;
  images: Map<string, string>;
  footnotes: Map<string, XElement>;
  endnotes: Map<string, XElement>;
  notes: Array<{ kind: 'footnote' | 'endnote'; id: string }>;
  report: Report;
  options: ReadOptions;
  /** Blocks found inside runs (text boxes), emitted after the current paragraph. */
  after: Block[];
  field: FieldState;
  reported: Set<string>;
}

interface FieldState {
  depth: number;
  phase: 'instr' | 'result' | 'none';
  instr: string;
  link?: Link;
}

const MONOSPACE = /^(courier|courier new|consolas|menlo|monaco|lucida console|source code pro|fira code|fira mono|jetbrains mono|sf mono|roboto mono|ubuntu mono|dejavu sans mono|liberation mono|cascadia (code|mono)|inconsolata|andale mono)$/i;

// ---- package parts ------------------------------------------------------------------------

function resolvePath(base: string, target: string): string {
  if (target.startsWith('/')) return target.slice(1);
  const parts = base.split('/').slice(0, -1);
  for (const segment of target.split('/')) {
    if (segment === '..') parts.pop();
    else if (segment !== '.') parts.push(segment);
  }
  return parts.join('/');
}

function readRels(files: ZipFiles, part: string): Map<string, Rel> {
  const relsPath = resolvePath(part, `_rels/${part.split('/').pop()}.rels`);
  const rels = new Map<string, Rel>();
  const data = files.get(relsPath);
  if (!data) return rels;
  for (const rel of findAll(parseXml(fromUtf8(data)), 'rel:Relationship')) {
    if (!rel.attrs.Id || !rel.attrs.Target) continue;
    const external = rel.attrs.TargetMode === 'External';
    rels.set(rel.attrs.Id, { target: external ? rel.attrs.Target : resolvePath(part, rel.attrs.Target), external, type: rel.attrs.Type ?? '' });
  }
  return rels;
}

const relOfType = (rels: Map<string, Rel>, suffix: string) => [...rels.values()].find((rel) => rel.type.endsWith(`/${suffix}`));

function readStyles(files: ZipFiles, path: string | undefined): Map<string, StyleInfo> {
  const styles = new Map<string, StyleInfo>();
  const data = path && files.get(path);
  if (!data) return styles;
  for (const style of findAll(parseXml(fromUtf8(data)), 'w:style')) {
    const id = style.attrs['w:styleId'];
    if (!id) continue;
    styles.set(id, {
      id,
      name: (child(style, 'w:name')?.attrs['w:val'] ?? id).toLowerCase(),
      type: style.attrs['w:type'] ?? 'paragraph',
      basedOn: child(style, 'w:basedOn')?.attrs['w:val'],
      pPr: child(style, 'w:pPr'),
      rPr: child(style, 'w:rPr'),
    });
  }
  return styles;
}

function readNumbering(files: ZipFiles, path: string | undefined): Map<string, Level[]> {
  const out = new Map<string, Level[]>();
  const data = path && files.get(path);
  if (!data) return out;
  const root = parseXml(fromUtf8(data));
  const level = (lvl: XElement): Level => {
    const format = child(lvl, 'w:numFmt')?.attrs['w:val'] ?? 'decimal';
    return { ordered: format !== 'bullet' && format !== 'none', start: Number(child(lvl, 'w:start')?.attrs['w:val'] ?? 1) };
  };
  const abstracts = new Map<string, Level[]>();
  // List styles: an abstractNum with numStyleLink has no levels of its own; the one with the matching styleLink does.
  const byStyleLink = new Map<string, Level[]>();
  const linked = new Map<string, string>();
  for (const abstract of findAll(root, 'w:abstractNum')) {
    const levels: Level[] = [];
    for (const lvl of children(abstract, 'w:lvl')) levels[Number(lvl.attrs['w:ilvl'] ?? 0)] = level(lvl);
    const id = abstract.attrs['w:abstractNumId'];
    abstracts.set(id, levels);
    const styleLink = child(abstract, 'w:styleLink')?.attrs['w:val'];
    if (styleLink && levels.length) byStyleLink.set(styleLink, levels);
    const numStyleLink = child(abstract, 'w:numStyleLink')?.attrs['w:val'];
    if (numStyleLink) linked.set(id, numStyleLink);
  }
  for (const [id, style] of linked) if (!abstracts.get(id)?.length) abstracts.set(id, byStyleLink.get(style) ?? []);
  for (const num of findAll(root, 'w:num')) {
    const levels = [...(abstracts.get(child(num, 'w:abstractNumId')?.attrs['w:val'] ?? '') ?? [])];
    for (const override of children(num, 'w:lvlOverride')) {
      const index = Number(override.attrs['w:ilvl'] ?? 0);
      // An override can replace the whole level, or just restart its numbering.
      const replaced = child(override, 'w:lvl');
      if (replaced) levels[index] = level(replaced);
      const start = child(override, 'w:startOverride')?.attrs['w:val'];
      if (start !== undefined) levels[index] = { ...(levels[index] ?? { ordered: true, start: 1 }), start: Number(start) };
    }
    out.set(num.attrs['w:numId'], levels);
  }
  return out;
}

function readNotes(files: ZipFiles, path: string | undefined, name: string): Map<string, XElement> {
  const out = new Map<string, XElement>();
  const data = path && files.get(path);
  if (!data) return out;
  for (const note of findAll(parseXml(fromUtf8(data)), name)) {
    // Ids -1 and 0 are the separator notes.
    if (!note.attrs['w:type'] || note.attrs['w:type'] === 'normal') out.set(note.attrs['w:id'], note);
  }
  return out;
}

// ---- styles -------------------------------------------------------------------------------

function styleChain(context: Context, id: string | undefined): StyleInfo[] {
  const chain: StyleInfo[] = [];
  const seen = new Set<string>();
  while (id && !seen.has(id)) {
    seen.add(id);
    const style = context.styles.get(id);
    if (!style) break;
    chain.push(style);
    id = style.basedOn;
  }
  return chain;
}

type ParagraphKind = { kind: 'heading'; level: number } | { kind: 'quote' } | { kind: 'code' } | { kind: 'normal' };

function paragraphKind(context: Context, pPr: XElement | undefined): ParagraphKind {
  const chain = styleChain(context, child(pPr, 'w:pStyle')?.attrs['w:val']);
  for (const style of chain) {
    const heading = /^heading\s*([1-9])$/.exec(style.name);
    if (heading) return { kind: 'heading', level: Math.min(6, Number(heading[1])) };
    if (style.name === 'title') return { kind: 'heading', level: 1 };
    if (/quote|block text/.test(style.name)) return { kind: 'quote' };
    if (/\bcode\b|preformatted|source|macro text|verbatim/.test(style.name)) return { kind: 'code' };
  }
  const outline = child(pPr, 'w:outlineLvl')?.attrs['w:val'] ?? chain.map((style) => child(style.pPr, 'w:outlineLvl')?.attrs['w:val']).find((value) => value !== undefined);
  if (outline !== undefined && Number(outline) < 6) return { kind: 'heading', level: Number(outline) + 1 };
  return { kind: 'normal' };
}

function numberingOf(context: Context, pPr: XElement | undefined): { numId: string; ilvl: number } | undefined {
  let numPr = child(pPr, 'w:numPr');
  let ilvl = numPr ? child(numPr, 'w:ilvl')?.attrs['w:val'] : undefined;
  if (!child(numPr, 'w:numId')) {
    // List styles: the numbering can come from the paragraph style.
    for (const style of styleChain(context, child(pPr, 'w:pStyle')?.attrs['w:val'])) {
      const styled = child(style.pPr, 'w:numPr');
      if (child(styled, 'w:numId')) {
        numPr = styled;
        ilvl = ilvl ?? child(styled, 'w:ilvl')?.attrs['w:val'];
        break;
      }
    }
  }
  const numId = child(numPr, 'w:numId')?.attrs['w:val'];
  if (!numId || numId === '0') return undefined;
  return { numId, ilvl: Math.min(8, Number(ilvl ?? 0)) };
}

/** A toggle property: <w:b/> is on, <w:b w:val="0"/> is off. */
function toggle(rPr: XElement | undefined, name: string): boolean | undefined {
  const element = child(rPr, name);
  if (!element) return undefined;
  const value = element.attrs['w:val'];
  return value === undefined || !['0', 'false', 'off', 'none'].includes(value);
}

/** Formatting the tree cannot hold: say so once per document, not once per run. */
function once(context: Context, message: string): void {
  if (context.reported.has(message)) return;
  context.reported.add(message);
  context.report.warn(message);
}

function runMarks(context: Context, rPr: XElement | undefined): Mark[] {
  // Character styles first, then direct formatting on the run.
  // The Hyperlink character style's blue underline is the link's look, not underlined text.
  const characterStyles = styleChain(context, child(rPr, 'w:rStyle')?.attrs['w:val']).filter((style) => !/^(followed)?\s?hyperlink$/.test(style.name));
  const layers = [...characterStyles.reverse().map((style) => style.rPr), rPr];
  const state: Partial<Record<Mark, boolean>> = {};
  for (const style of styleChain(context, child(rPr, 'w:rStyle')?.attrs['w:val'])) {
    if (style.name === 'strong') state.bold = true;
    if (style.name === 'emphasis') state.italic = true;
    if (/\bcode\b|html code|verbatim|source/.test(style.name)) state.code = true;
  }
  for (const layer of layers) {
    if (!layer) continue;
    for (const [name, mark] of [['w:b', 'bold'], ['w:i', 'italic'], ['w:strike', 'strike'], ['w:dstrike', 'strike']] as const) {
      const value = toggle(layer, name);
      if (value !== undefined) state[mark] = value;
    }
    const underline = child(layer, 'w:u')?.attrs['w:val'];
    if (underline !== undefined) state.underline = underline !== 'none';
    const vertical = child(layer, 'w:vertAlign')?.attrs['w:val'];
    if (vertical) {
      state.superscript = vertical === 'superscript';
      state.subscript = vertical === 'subscript';
    }
    const highlight = child(layer, 'w:highlight')?.attrs['w:val'];
    if (highlight) state.highlight = highlight !== 'none';
    const fonts = child(layer, 'w:rFonts');
    const font = fonts?.attrs['w:ascii'] ?? fonts?.attrs['w:hAnsi'];
    if (font) state.code = MONOSPACE.test(font.trim());
  }
  if (rPr && (child(rPr, 'w:color')?.attrs['w:val'] ?? 'auto') !== 'auto') once(context, 'Text colours were not kept');
  if (child(rPr, 'w:sz') || child(rPr, 'w:szCs')) once(context, 'Font sizes were not kept');
  return (Object.keys(state) as Mark[]).filter((mark) => state[mark]);
}

// ---- inline content -----------------------------------------------------------------------

function readRuns(nodes: XElement['children'], context: Context, out: Inline[], link?: Link): void {
  for (const node of nodes) {
    if (!isElement(node)) continue;
    switch (node.name) {
      case 'w:r':
        readRun(node, context, out, link ?? context.field.link);
        break;
      case 'w:hyperlink': {
        const rel = node.attrs['r:id'] ? context.rels.get(node.attrs['r:id']) : undefined;
        const href = rel?.target ?? (node.attrs['w:anchor'] ? `#${node.attrs['w:anchor']}` : undefined);
        readRuns(node.children, context, out, href ? { href } : link);
        break;
      }
      case 'w:fldSimple': {
        const target = hyperlinkTarget(node.attrs['w:instr'] ?? '');
        readRuns(node.children, context, out, target ? { href: target } : link);
        break;
      }
      case 'w:ins':
      case 'w:moveTo':
        once(context, `Tracked changes were ${context.options.trackedChanges === 'reject' ? 'rejected' : 'accepted'}`);
        if (context.options.trackedChanges !== 'reject') readRuns(node.children, context, out, link);
        break;
      case 'w:del':
      case 'w:moveFrom':
        once(context, `Tracked changes were ${context.options.trackedChanges === 'reject' ? 'rejected' : 'accepted'}`);
        if (context.options.trackedChanges === 'reject') readRuns(node.children, context, out, link);
        break;
      case 'w:sdt':
        readRuns(child(node, 'w:sdtContent')?.children ?? [], context, out, link);
        break;
      case 'w:smartTag':
      case 'w:customXml':
      case 'w:dir':
      case 'w:bdo':
        readRuns(node.children, context, out, link);
        break;
      case 'mc:AlternateContent':
        readRuns((child(node, 'mc:Fallback') ?? child(node, 'mc:Choice'))?.children ?? [], context, out, link);
        break;
      case 'm:oMathPara':
      case 'm:oMath':
        context.report.warn('Equations were kept as plain text');
        out.push({ type: 'text', text: textContent(node) });
        break;
      default:
        // Bookmarks, comment ranges, proofing marks, permissions: no content.
        break;
    }
  }
}

function hyperlinkTarget(instr: string): string | undefined {
  const match = /^\s*HYPERLINK\s+(?:\\l\s+)?"([^"]+)"/i.exec(instr);
  if (!match) return undefined;
  return /\\l/.test(instr.split('"')[0]) ? `#${match[1]}` : match[1];
}

function readRun(run: XElement, context: Context, out: Inline[], link?: Link): void {
  const rPr = child(run, 'w:rPr');
  const marks = runMarks(context, rPr);
  const field = context.field;
  const push = (text: string) => {
    if (field.phase === 'instr') field.instr += text;
    else if (text) out.push({ type: 'text', text, ...(marks.length ? { marks } : {}), ...(link ? { link } : {}) });
  };
  for (const node of run.children) {
    if (!isElement(node)) continue;
    switch (node.name) {
      case 'w:t':
        push(textContent(node));
        break;
      case 'w:delText':
        if (context.options.trackedChanges === 'reject') push(textContent(node));
        break;
      case 'w:instrText':
        if (field.phase === 'instr') field.instr += textContent(node);
        break;
      case 'w:fldChar': {
        const type = node.attrs['w:fldCharType'];
        if (type === 'begin') {
          field.depth += 1;
          if (field.depth === 1) Object.assign(field, { phase: 'instr', instr: '', link: undefined });
        } else if (type === 'separate' && field.depth === 1) {
          const target = hyperlinkTarget(field.instr);
          field.phase = 'result';
          field.link = target ? { href: target } : undefined;
          link = field.link ?? link;
        } else if (type === 'end') {
          field.depth = Math.max(0, field.depth - 1);
          if (field.depth === 0) Object.assign(field, { phase: 'none', instr: '', link: undefined });
        }
        break;
      }
      case 'w:tab':
      case 'w:ptab':
        push('\t');
        break;
      case 'w:br':
      case 'w:cr':
        if (node.attrs['w:type'] === 'page' || node.attrs['w:type'] === 'column') context.report.warn('Page and column breaks were dropped');
        else if (field.phase !== 'instr') out.push({ type: 'break' });
        break;
      case 'w:noBreakHyphen':
        push('‑');
        break;
      case 'w:sym': {
        const code = parseInt(node.attrs['w:char'] ?? '', 16);
        // Symbol fonts map their glyphs to F000-F0FF; only plain code points are real characters.
        if (Number.isFinite(code) && code < 0xf000) push(String.fromCodePoint(code));
        else context.report.warn('Symbol-font characters were dropped');
        break;
      }
      case 'w:footnoteReference':
      case 'w:endnoteReference': {
        const kind = node.name === 'w:footnoteReference' ? 'footnote' : 'endnote';
        context.notes.push({ kind, id: node.attrs['w:id'] });
        out.push({ type: 'text', text: String(context.notes.length), marks: ['superscript'] });
        break;
      }
      case 'w:drawing':
      case 'w:pict':
      case 'w:object':
        readDrawing(node, context, out, link);
        break;
      case 'mc:AlternateContent': {
        const choice = child(node, 'mc:Fallback') ?? child(node, 'mc:Choice');
        if (choice) readRun({ ...run, children: choice.children }, context, out, link);
        break;
      }
      default:
        break;
    }
  }
}

function readDrawing(node: XElement, context: Context, out: Inline[], link?: Link): void {
  // Text boxes: their paragraphs follow the current one.
  for (const box of findAll(node, 'w:txbxContent')) {
    context.report.warn('Text boxes were read as normal paragraphs after the text they sit in');
    context.after.push(...readBody(box.children, context));
  }
  if (find(node, 'w:txbxContent')) return;
  // Word's "horizontal line" is a VML rectangle marked o:hr.
  const rect = find(node, 'v:rect');
  if (rect && (rect.attrs['o:hr'] === 't' || rect.attrs['o:hr'] === 'true')) {
    context.after.unshift({ type: 'rule' });
    return;
  }
  const blip = find(node, 'a:blip');
  const embed = blip?.attrs['r:embed'] ?? find(node, 'v:imagedata')?.attrs['r:id'];
  const linked = blip?.attrs['r:link'];
  const docPr = find(node, 'wp:docPr');
  const alt = docPr?.attrs.descr || docPr?.attrs.title || find(node, 'v:shape')?.attrs.alt || undefined;
  const src = embed ? context.images.get(embed) : linked ? context.rels.get(linked)?.target : undefined;
  if (src) {
    out.push({ type: 'image', src, ...(alt ? { alt } : {}), ...(docPr?.attrs.title && docPr.attrs.descr ? { title: docPr.attrs.title } : {}) });
    if (link) context.report.warn('Links on images were dropped');
    return;
  }
  const uri = find(node, 'a:graphicData')?.attrs.uri ?? '';
  if (/chart/.test(uri)) context.report.warn('Charts were dropped');
  else if (/diagram/.test(uri)) context.report.warn('SmartArt was dropped');
  else if (node.name === 'w:object') context.report.warn('Embedded objects were dropped');
  else if (embed) context.report.warn('An image whose file is missing from the document was dropped');
  else if (find(node, 'wps:wsp') || find(node, 'v:shape')) context.report.warn('Shapes were dropped');
}

// ---- blocks -------------------------------------------------------------------------------

interface ParagraphInfo {
  kind: ParagraphKind;
  list?: { numId: string; ilvl: number };
  /** A list typed by hand: a bullet or number and a tab at the start. */
  typed?: { ordered: boolean; start: number; ilvl: number };
  indented: boolean;
  inlines: Inline[];
  rule: boolean;
  /** Font size in half-points of most of the text, when set. */
  size?: number;
  bold: boolean;
  length: number;
}

// A bullet or number, then a tab: how Pages, TextEdit and hand-made Word lists look.
const TYPED_ITEM = /^[\t ]*(?:([•◦▪▫‣⁃●○■□·\-–*])|(\d{1,3}|[a-zA-Z])[.)]?)\t[\t ]*/;

/** Remove the first `length` characters of text from inline content. */
function dropPrefix(inlines: Inline[], length: number): Inline[] {
  const out: Inline[] = [];
  let remaining = length;
  for (const node of inlines) {
    if (remaining > 0 && node.type === 'text') {
      if (node.text.length <= remaining) {
        remaining -= node.text.length;
        continue;
      }
      out.push({ ...node, text: node.text.slice(remaining) });
      remaining = 0;
    } else out.push(node);
  }
  return out;
}

function readParagraph(p: XElement, context: Context): ParagraphInfo {
  const pPr = child(p, 'w:pPr');
  const inlines: Inline[] = [];
  readRuns(p.children, context, inlines);
  const border = child(child(pPr, 'w:pBdr'), 'w:bottom');
  const hasText = inlines.some((node) => node.type !== 'text' || node.text.trim());
  if (toggle(pPr, 'w:pageBreakBefore')) context.report.warn('Page and column breaks were dropped');
  const justify = child(pPr, 'w:jc')?.attrs['w:val'];
  if (justify && ['center', 'right', 'end', 'both', 'distribute'].includes(justify) && hasText) once(context, 'Paragraph alignment was not kept');
  const indent = child(pPr, 'w:ind');
  const left = Number(indent?.attrs['w:left'] ?? indent?.attrs['w:start'] ?? 0);
  // Size and boldness of the text, for inferring headings.
  const sizes = new Map<number, number>();
  let bold = true;
  let length = 0;
  for (const run of findAll(p, 'w:r')) {
    const text = children(run, 'w:t').map(textContent).join('');
    if (!text.trim()) continue;
    length += text.length;
    const rPr = child(run, 'w:rPr');
    const size = Number(child(rPr, 'w:sz')?.attrs['w:val'] ?? 0);
    if (size) sizes.set(size, (sizes.get(size) ?? 0) + text.length);
    if (!runMarks(context, rPr).includes('bold')) bold = false;
  }
  const size = [...sizes].sort((a, b) => b[1] - a[1])[0]?.[0];
  const list = numberingOf(context, pPr);
  let typed: ParagraphInfo['typed'];
  let content = inlines;
  if (!list && context.options.inferStructure !== false) {
    const first = inlines.map((node) => (node.type === 'text' ? node.text : '\u0000')).join('');
    const match = TYPED_ITEM.exec(first);
    if (match && first.length > match[0].length) {
      const marker = match[2];
      typed = { ordered: !!marker, start: marker && /^\d+$/.test(marker) ? Number(marker) : 1, ilvl: Math.max(0, Math.min(8, Math.round(left / 720) - 1)) };
      content = dropPrefix(inlines, match[0].length);
    }
  }
  return {
    kind: paragraphKind(context, pPr),
    list,
    typed,
    indented: left > 0,
    inlines: content,
    rule: !hasText && !!border && border.attrs['w:val'] !== 'none' && border.attrs['w:val'] !== 'nil',
    size,
    bold: bold && length > 0,
    length,
  };
}

/**
 * Headings from formatting, for documents that use no heading styles: short,
 * fully bold paragraphs set larger than the body text. Larger sizes get
 * higher levels.
 */
function inferHeadings(infos: ParagraphInfo[], context: Context): void {
  if (context.options.inferStructure === false || infos.some((info) => info.kind.kind === 'heading')) return;
  const weights = new Map<number, number>();
  for (const info of infos) if (info.size) weights.set(info.size, (weights.get(info.size) ?? 0) + info.length);
  const body = [...weights].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!body) return;
  const candidates = infos.filter((info) => info.kind.kind === 'normal' && !info.list && !info.typed && info.bold && info.size && info.size >= body * 1.15 && info.length <= 120);
  const sizes = [...new Set(candidates.map((info) => info.size!))].sort((a, b) => b - a);
  for (const info of candidates) {
    info.kind = { kind: 'heading', level: Math.min(6, sizes.indexOf(info.size!) + 1) };
    // The boldness is the heading's, not a mark on its text.
    info.inlines = info.inlines.map((node) => (node.type === 'text' && node.marks ? { ...node, marks: node.marks.filter((mark) => mark !== 'bold') } : node));
  }
  if (candidates.length) context.report.warn('Headings were inferred from text size (the document has no heading styles)');
}

const codeText = (inlines: Inline[]) => inlines.map((node) => (node.type === 'text' ? node.text : node.type === 'break' ? '\n' : '')).join('');

/** Read a sequence of body elements (paragraphs, tables, content controls) into blocks. */
function readBody(nodes: XElement['children'], context: Context, inferTopLevel = false): Block[] {
  const out: Block[] = [];
  // Open lists by level; the numId says which list a paragraph belongs to.
  let stack: Array<{ list: ListNode; numId: string }> = [];
  const closeLists = () => {
    stack = [];
  };

  const addParagraph = (info: ParagraphInfo) => {
    const previous = out[out.length - 1];
    if (info.typed && !info.list) {
      once(context, 'Lists were inferred from typed bullets and numbers');
      info.list = { numId: info.typed.ordered ? '#typed-ordered' : '#typed-bullet', ilvl: info.typed.ilvl };
    }
    if (info.list) {
      const level = info.typed ? { ordered: info.typed.ordered, start: info.typed.start } : context.numbering.get(info.list.numId)?.[info.list.ilvl] ?? { ordered: false, start: 1 };
      const depth = info.list.ilvl;
      if (stack.length && stack[0].numId !== info.list.numId && depth === 0) closeLists();
      while (stack.length > depth + 1) stack.pop();
      while (stack.length < depth + 1) {
        const list: ListNode = { type: 'list', ordered: level.ordered, items: [], ...(level.ordered && level.start !== 1 ? { start: level.start } : {}) };
        const parent = stack[stack.length - 1];
        if (parent) {
          if (!parent.list.items.length) parent.list.items.push({ children: [] });
          parent.list.items[parent.list.items.length - 1].children.push(list);
        } else out.push(list);
        stack.push({ list, numId: info.list.numId });
      }
      const item: ListItemNode = { children: [paragraph(info.inlines)] };
      // Word checklists are a symbol at the start of the item.
      const first = info.inlines[0];
      if (first?.type === 'text' && /^[☐☑☒]\s?/.test(first.text)) {
        item.checked = first.text[0] !== '☐';
        first.text = first.text.replace(/^[☐☑☒]\s?/, '');
      }
      stack[stack.length - 1].list.items.push(item);
      return;
    }
    // An indented paragraph right after a list item continues that item.
    if (stack.length && info.indented && info.kind.kind === 'normal') {
      const items = stack[stack.length - 1].list.items;
      items[items.length - 1].children.push(paragraph(info.inlines));
      return;
    }
    const empty = !info.inlines.some((node) => node.type !== 'text' || node.text.trim());
    if (empty && !info.rule && stack.length) return; // Spacing inside a list.
    closeLists();
    if (info.rule) {
      out.push({ type: 'rule' });
      return;
    }
    switch (info.kind.kind) {
      case 'heading':
        if (!empty) out.push({ type: 'heading', level: info.kind.level as 1, children: info.inlines });
        break;
      case 'code':
        if (previous?.type === 'code') previous.text += `\n${codeText(info.inlines)}`;
        else out.push({ type: 'code', text: codeText(info.inlines) });
        break;
      case 'quote':
        if (empty) break;
        if (previous?.type === 'blockquote') previous.children.push(paragraph(info.inlines));
        else out.push({ type: 'blockquote', children: [paragraph(info.inlines)] });
        break;
      default:
        if (!empty || context.options.keepEmptyParagraphs) out.push(paragraph(info.inlines));
    }
  };

  // Read every paragraph first, so headings can be inferred from the whole body.
  type Entry = { info: ParagraphInfo; after: Block[] } | { blocks: Block[] };
  const entries: Entry[] = [];
  for (const node of nodes) {
    if (!isElement(node)) continue;
    if (node.name === 'w:p') {
      context.after = [];
      const info = readParagraph(node, context);
      entries.push({ info, after: context.after });
      context.after = [];
    } else if (node.name === 'w:tbl') entries.push({ blocks: [readTable(node, context)] });
    else if (node.name === 'w:sdt') entries.push({ blocks: readBody(child(node, 'w:sdtContent')?.children ?? [], context) });
    else if (node.name === 'w:customXml' || node.name === 'w:ins' || node.name === 'w:moveTo') entries.push({ blocks: readBody(node.children, context) });
    else if (node.name === 'mc:AlternateContent') entries.push({ blocks: readBody((child(node, 'mc:Fallback') ?? child(node, 'mc:Choice'))?.children ?? [], context) });
  }
  if (inferTopLevel) inferHeadings(entries.flatMap((entry) => ('info' in entry ? [entry.info] : [])), context);
  for (const entry of entries) {
    if ('blocks' in entry) {
      closeLists();
      out.push(...entry.blocks);
      continue;
    }
    addParagraph(entry.info);
    if (entry.after.length) {
      closeLists();
      out.push(...entry.after);
    }
  }
  return out;
}

function readTable(table: XElement, context: Context): Block {
  const rows: Array<{ cells: TableCellNode[] }> = [];
  // Cells that started a vertical merge, by grid column.
  const merging = new Map<number, TableCellNode>();
  for (const tr of children(table, 'w:tr')) {
    const trPr = child(tr, 'w:trPr');
    const header = toggle(trPr, 'w:tblHeader') === true;
    let column = Number(child(trPr, 'w:gridBefore')?.attrs['w:val'] ?? 0);
    const cells: TableCellNode[] = [];
    const tcs = children(tr, 'w:tc').concat(children(tr, 'w:sdt').flatMap((sdt) => children(child(sdt, 'w:sdtContent'), 'w:tc')));
    for (const tc of tcs) {
      const tcPr = child(tc, 'w:tcPr');
      const span = Number(child(tcPr, 'w:gridSpan')?.attrs['w:val'] ?? 1);
      const vMerge = child(tcPr, 'w:vMerge');
      const blocks = readBody(tc.children, context);
      if (vMerge && vMerge.attrs['w:val'] !== 'restart') {
        const origin = merging.get(column);
        if (origin) {
          origin.rowspan = (origin.rowspan ?? 1) + 1;
          column += span;
          continue;
        }
      }
      const cell: TableCellNode = { children: blocks.length ? blocks : [paragraph()] };
      if (header) cell.header = true;
      if (span > 1) cell.colspan = span;
      if (vMerge?.attrs['w:val'] === 'restart') merging.set(column, cell);
      else for (let index = column; index < column + span; index += 1) merging.delete(index);
      cells.push(cell);
      column += span;
    }
    rows.push({ cells });
  }
  return { type: 'table', rows };
}

// ---- entry point --------------------------------------------------------------------------

export async function readDocxDoc(data: Uint8Array | ArrayBuffer, report: Report, options: ReadOptions = {}): Promise<Doc> {
  try {
    return await readPackage(data, report, options);
  } catch (error) {
    if (error instanceof DocxError) throw error;
    // Anything else means a damaged part; keep the original for debugging.
    throw new DocxError('The file could not be read: it may be damaged.', 'corrupt', { cause: error });
  }
}

async function readPackage(data: Uint8Array | ArrayBuffer, report: Report, options: ReadOptions): Promise<Doc> {
  const archive = openZip(data instanceof Uint8Array ? data : new Uint8Array(data), options);
  // Expand only the parts that are read: relationships first, then what they point at.
  const files: ZipFiles = new Map();
  const load = async (name: string | undefined) => {
    if (!name || files.has(name)) return;
    const bytes = await archive.read(name);
    if (bytes) files.set(name, bytes);
  };
  const relsOf = (part: string) => resolvePath(part, `_rels/${part.split('/').pop()}.rels`);
  await load(relsOf(''));
  const rootMain = relOfType(readRels(files, ''), 'officeDocument')?.target ?? 'word/document.xml';
  await load(rootMain);
  await load(relsOf(rootMain));
  for (const rel of readRels(files, rootMain).values()) {
    if (!rel.external && /\/(styles|numbering|footnotes|endnotes|comments|header|footer|image)$/.test(rel.type)) await load(rel.target);
  }
  const rootRels = readRels(files, '');
  const main = relOfType(rootRels, 'officeDocument')?.target ?? 'word/document.xml';
  const xml = files.get(main);
  if (!xml) throw new DocxError(archive.names.some((name) => name.startsWith('xl/')) ? 'This is an Excel file, not a Word document.' : archive.names.some((name) => name.startsWith('ppt/')) ? 'This is a PowerPoint file, not a Word document.' : 'Not a Word document: word/document.xml is missing.', 'not-docx');
  const rels = readRels(files, main);

  const images = new Map<string, string>();
  for (const [id, rel] of rels) {
    if (!rel.type.endsWith('/image') || rel.external) continue;
    const bytes = files.get(rel.target);
    if (!bytes) continue;
    const contentType = imageType(rel.target, bytes);
    if (/emf|wmf/.test(contentType)) report.warn('EMF/WMF images cannot be shown in browsers; convert them to PNG');
    const image: DocxImage = { path: rel.target, contentType, data: bytes };
    images.set(id, options.image ? await options.image(image) : `data:${contentType};base64,${base64(bytes)}`);
  }

  const context: Context = {
    files,
    rels,
    styles: readStyles(files, relOfType(rels, 'styles')?.target),
    numbering: readNumbering(files, relOfType(rels, 'numbering')?.target),
    images,
    footnotes: readNotes(files, relOfType(rels, 'footnotes')?.target, 'w:footnote'),
    endnotes: readNotes(files, relOfType(rels, 'endnotes')?.target, 'w:endnote'),
    notes: [],
    report,
    options,
    after: [],
    field: { depth: 0, phase: 'none', instr: '' },
    reported: new Set(),
  };

  const body = find(parseXml(fromUtf8(xml)), 'w:body');
  const blocks = readBody(body?.children ?? [], context, true);

  // Footnotes and endnotes: a numbered list at the end, matching the superscript numbers in the text.
  if (context.notes.length) {
    report.warn('Footnotes and endnotes were moved to a numbered list at the end');
    const items: ListItemNode[] = context.notes.map(({ kind, id }) => {
      const note = (kind === 'footnote' ? context.footnotes : context.endnotes).get(id);
      const content = note ? readBody(note.children, { ...context, notes: [] }) : [];
      return { children: content.length ? content : [paragraph()] };
    });
    blocks.push({ type: 'rule' }, { type: 'list', ordered: true, items });
  }

  if (findAll(parseXml(fromUtf8(files.get(relOfType(rels, 'comments')?.target ?? '') ?? new Uint8Array())), 'w:comment').length) report.warn('Comments were dropped');
  for (const rel of rels.values()) {
    if (!/\/(header|footer)$/.test(rel.type)) continue;
    const part = files.get(rel.target);
    if (part && findAll(parseXml(fromUtf8(part)), 'w:t').some((t) => textContent(t).trim())) {
      report.warn('Headers and footers were not read');
      break;
    }
  }
  return normalize({ type: 'doc', children: blocks });
}
