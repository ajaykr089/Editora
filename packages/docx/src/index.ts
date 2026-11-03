import type { Doc } from './ast';
import { readDocxDoc, type ReadOptions } from './read';
import { Report } from './report';
import { writeDocxDoc, type WriteOptions } from './write';

export interface DocxReadResult {
  /** The document tree; give it to @editora/rich-text-convert (`from: 'ast'`) for any other format. */
  doc: Doc;
  /** What could not be carried over. */
  warnings: string[];
}

export interface DocxWriteResult {
  /** The .docx file. */
  data: Uint8Array;
  warnings: string[];
}

/**
 * Read a .docx file.
 *
 *   const { doc, warnings } = await readDocx(await file.arrayBuffer());
 *   const html = convert(doc, { from: 'ast', to: 'html' }).output;
 */
export async function readDocx(data: Uint8Array | ArrayBuffer, options: ReadOptions = {}): Promise<DocxReadResult> {
  const report = new Report();
  const doc = await readDocxDoc(data, report, options);
  return { doc, warnings: report.warnings };
}

/**
 * Write a .docx file from a document tree.
 *
 *   const doc = read(editor.getJSON(), 'tiptap');   // from @editora/rich-text-convert
 *   const { data } = await writeDocx(doc, { title: 'Report' });
 */
export async function writeDocx(doc: Doc, options: WriteOptions = {}): Promise<DocxWriteResult> {
  const report = new Report();
  const data = await writeDocxDoc(doc, report, options);
  return { data, warnings: report.warnings };
}

export { DocxError } from './zip';
export type { Block, Doc, Inline, Mark } from './ast';
export type { DocxImage, ReadOptions } from './read';
export type { WriteOptions } from './write';
