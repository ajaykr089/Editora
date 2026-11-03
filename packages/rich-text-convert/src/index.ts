import { normalize, type Doc } from './ast';
import { readEditorJs, writeEditorJs, type EditorJsData, type EditorJsWriteOptions } from './formats/editorjs';
import { readHtml, writeHtml } from './formats/html';
import { readLexical, writeLexical, type LexicalState, type LexicalWriteOptions } from './formats/lexical';
import { readMarkdown, writeMarkdown } from './formats/markdown';
import { readPortableText, writePortableText, type PTBlock } from './formats/portable-text';
import { readProseMirror, writeProseMirror, type PMNode } from './formats/prosemirror';
import { readSlate, writeSlate, type SlateNode } from './formats/slate';
import { Report } from './report';

export type Format = 'html' | 'markdown' | 'tiptap' | 'prosemirror' | 'lexical' | 'slate' | 'plate' | 'portable-text' | 'editorjs' | 'ast';

export const FORMATS: Format[] = ['html', 'markdown', 'tiptap', 'prosemirror', 'lexical', 'slate', 'plate', 'portable-text', 'editorjs', 'ast'];

/** Formats that are text; the rest are JSON values. */
const TEXT_FORMATS = new Set<Format>(['html', 'markdown']);

export interface WriteOptions {
  /** Lexical: write image nodes / horizontal rules. */
  lexical?: LexicalWriteOptions;
  /** Editor.js: the list block format. */
  editorjs?: EditorJsWriteOptions;
}

export interface ConvertOptions extends WriteOptions {
  /** The input format. Detected from the input when left out. */
  from?: Format;
  to: Format;
}

export interface ConvertResult<T = unknown> {
  output: T;
  /** Everything that could not be carried over, or was changed to fit the target. */
  warnings: string[];
}

const PLATE_TYPES = new Set(['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'lic', 'blockquote', 'code_block', 'hr', 'img', 'td', 'th', 'tr']);
const SNAKE_PM = /"type":"(bullet_list|ordered_list|list_item|code_block|horizontal_rule|hard_break)"/;

/** Guess the format of a value: a string is HTML or Markdown, JSON is recognised by its shape. */
export function detectFormat(input: unknown): Format {
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (/^[[{]/.test(trimmed)) {
      try {
        return detectFormat(JSON.parse(trimmed));
      } catch {
        // Not JSON: fall through to text.
      }
    }
    return /^<[a-z!]/i.test(trimmed) ? 'html' : 'markdown';
  }
  if (Array.isArray(input)) {
    const first = input.find((node) => node && typeof node === 'object');
    if (!first) return 'slate';
    if (typeof first._type === 'string') return 'portable-text';
    return input.some((node) => node && PLATE_TYPES.has(node.type)) ? 'plate' : 'slate';
  }
  if (input && typeof input === 'object') {
    const value = input as Record<string, unknown>;
    if (value.root && typeof value.root === 'object') return 'lexical';
    if (Array.isArray(value.blocks)) return 'editorjs';
    if (value.type === 'doc' && Array.isArray(value.children)) return 'ast';
    if (value.type === 'doc') return SNAKE_PM.test(JSON.stringify(value)) ? 'prosemirror' : 'tiptap';
  }
  throw new Error('Could not detect the input format; pass `from`.');
}

/** Read any supported format into the shared document tree. */
export function read(input: unknown, from: Format = detectFormat(input), report = new Report()): Doc {
  if (!FORMATS.includes(from)) throw new Error(`Unknown format "${from}". Use one of: ${FORMATS.join(', ')}.`);
  const value = !TEXT_FORMATS.has(from) && typeof input === 'string' ? JSON.parse(input) : input;
  if (TEXT_FORMATS.has(from) && typeof value !== 'string') throw new Error(`Expected a string of ${from}.`);
  switch (from) {
    case 'html':
      return normalize(readHtml(value as string, report));
    case 'markdown':
      return normalize(readMarkdown(value as string, report));
    case 'tiptap':
    case 'prosemirror':
      return normalize(readProseMirror(value as PMNode, report));
    case 'lexical':
      return normalize(readLexical(value as LexicalState, report));
    case 'slate':
    case 'plate':
      return normalize(readSlate(value as SlateNode[], report));
    case 'portable-text':
      return normalize(readPortableText(value as PTBlock[], report));
    case 'editorjs':
      return normalize(readEditorJs(value as EditorJsData, report));
    case 'ast':
      if ((value as Doc)?.type !== 'doc') throw new Error('Expected a document tree with type "doc".');
      return normalize(value as Doc);
  }
}

/** Write the shared document tree to any supported format. */
export function write(doc: Doc, to: Format, options: WriteOptions = {}, report = new Report()): unknown {
  switch (to) {
    case 'html':
      return writeHtml(doc);
    case 'markdown':
      return writeMarkdown(doc, report);
    case 'tiptap':
    case 'prosemirror':
      return writeProseMirror(doc, report, to);
    case 'lexical':
      return writeLexical(doc, report, options.lexical);
    case 'slate':
    case 'plate':
      return writeSlate(doc, report, to);
    case 'portable-text':
      return writePortableText(doc, report);
    case 'editorjs':
      return writeEditorJs(doc, report, options.editorjs);
    case 'ast':
      return doc;
    default:
      throw new Error(`Unknown format "${String(to)}". Use one of: ${FORMATS.join(', ')}.`);
  }
}

/**
 * Convert rich text from one format to another.
 *
 *   const { output, warnings } = convert(tiptapJson, { to: 'lexical' });
 */
export function convert<T = unknown>(input: unknown, options: ConvertOptions): ConvertResult<T> {
  const report = new Report();
  const doc = read(input, options.from ?? detectFormat(input), report);
  const output = write(doc, options.to, options, report) as T;
  return { output, warnings: report.warnings };
}

export { Report } from './report';
export { normalize } from './ast';
export type { Block, Doc, Inline, Mark } from './ast';
export type { EditorJsData, EditorJsWriteOptions } from './formats/editorjs';
export type { LexicalState, LexicalWriteOptions } from './formats/lexical';
export type { PTBlock } from './formats/portable-text';
export type { PMNode } from './formats/prosemirror';
export type { SlateNode } from './formats/slate';
