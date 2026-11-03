import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Doc } from '../ast';
import { readDocx, writeDocx } from '../index';
import { fromUtf8, unzip } from '../zip';

const fixture = (name: string) => readFileSync(join(__dirname, 'fixtures', name));
// A 2x1 red PNG.
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAIAAAB7QOjdAAAAEElEQVR4nGP4z8DAwMDAAAAN/wH/mqKQ+wAAAABJRU5ErkJggg==';

const sample: Doc = {
  type: 'doc',
  children: [
    { type: 'heading', level: 1, children: [{ type: 'text', text: 'Release notes' }] },
    {
      type: 'paragraph',
      children: [
        { type: 'text', text: 'Plain, ' },
        { type: 'text', text: 'bold', marks: ['bold'] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'italic', marks: ['italic'] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'under', marks: ['underline'] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'gone', marks: ['strike'] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'code', marks: ['code'] },
        { type: 'text', text: ', H' },
        { type: 'text', text: '2', marks: ['subscript'] },
        { type: 'text', text: 'O, x' },
        { type: 'text', text: '2', marks: ['superscript'] },
        { type: 'text', text: ', ' },
        { type: 'text', text: 'marked', marks: ['highlight'] },
        { type: 'text', text: ' and ' },
        { type: 'text', text: 'a ' , link: { href: 'https://example.com/a' } },
        { type: 'text', text: 'bold link', marks: ['bold'], link: { href: 'https://example.com/a' } },
        { type: 'text', text: '.' },
        { type: 'break' },
        { type: 'text', text: 'Tab\there & <escaped>' },
      ],
    },
    { type: 'heading', level: 3, children: [{ type: 'text', text: 'Lists' }] },
    {
      type: 'list',
      ordered: false,
      items: [
        { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'First' }] }] },
        {
          children: [
            { type: 'paragraph', children: [{ type: 'text', text: 'Second' }] },
            { type: 'paragraph', children: [{ type: 'text', text: 'More about the second' }] },
            { type: 'list', ordered: true, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Nested' }] }] }, { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Nested 2' }] }] }] },
          ],
        },
        { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Third' }] }] },
      ],
    },
    { type: 'list', ordered: true, start: 4, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Fourth' }] }] }] },
    { type: 'list', ordered: false, items: [{ checked: true, children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Done' }] }] }, { checked: false, children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Todo' }] }] }] },
    { type: 'blockquote', children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Quoted' }] }, { type: 'paragraph', children: [{ type: 'text', text: 'Twice' }] }] },
    { type: 'code', text: 'const a = 1;\n\tconsole.log(a);' },
    { type: 'rule' },
    { type: 'image', src: PNG, alt: 'A red pixel pair' },
    {
      type: 'table',
      rows: [
        { cells: [{ header: true, children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Name' }] }] }, { header: true, children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Score' }] }] }, { header: true, children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Note' }] }] }] },
        { cells: [{ rowspan: 2, children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Ada', marks: ['bold'] }] }] }, { children: [{ type: 'paragraph', children: [{ type: 'text', text: '10' }] }] }, { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'x' }] }] }] },
        { cells: [{ colspan: 2, children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Spans two' }] }] }] },
      ],
    },
    { type: 'paragraph', children: [{ type: 'text', text: 'The end.' }] },
  ],
};

describe('round trip', () => {
  it('keeps every block and mark through a .docx', async () => {
    const written = await writeDocx(sample, { title: 'Notes', date: new Date('2026-01-01T00:00:00Z') });
    expect(written.warnings).toEqual([]);
    const read = await readDocx(written.data);
    expect(read.doc).toEqual(sample);
    expect(read.warnings).toEqual([]);
  });

  it('writes the same bytes for the same input', async () => {
    const options = { date: new Date('2026-01-01T00:00:00Z') };
    expect((await writeDocx(sample, options)).data).toEqual((await writeDocx(sample, options)).data);
  });

  it('reports what Word cannot hold', async () => {
    const { warnings } = await writeDocx({ type: 'doc', children: [{ type: 'code', language: 'ts', text: 'x' }, { type: 'blockquote', children: [{ type: 'heading', level: 2, children: [{ type: 'text', text: 'h' }] }] }] });
    expect(warnings).toEqual(['Code block languages were not kept (Word has no place for them)', 'Headings inside quotes were written as quote paragraphs']);
  });

  it('replaces images it cannot load with their alt text', async () => {
    const { data, warnings } = await writeDocx({ type: 'doc', children: [{ type: 'image', src: 'https://example.invalid/x.png', alt: 'Chart' }] }, { loadImage: async () => undefined });
    expect(warnings).toEqual(['An image could not be loaded and was replaced by its alt text (https://example.invalid/x.png)']);
    expect((await readDocx(data)).doc.children).toEqual([{ type: 'paragraph', children: [{ type: 'text', text: '[Chart]' }] }]);
  });

  it('sizes images from their header and fits them to the page', async () => {
    const files = await unzip((await writeDocx({ type: 'doc', children: [{ type: 'image', src: PNG }] })).data);
    expect(fromUtf8(files.get('word/document.xml')!)).toContain('<wp:extent cx="19050" cy="9525"/>');
    expect([...files.keys()]).toContain('word/media/image1.png');
  });

  it('passes images to the image option when reading', async () => {
    const { data } = await writeDocx({ type: 'doc', children: [{ type: 'image', src: PNG, alt: 'p' }] });
    const seen: string[] = [];
    const { doc } = await readDocx(data, { image: ({ path, contentType }) => (seen.push(`${path} ${contentType}`), 'https://cdn.test/1.png') });
    expect(seen).toEqual(['word/media/image1.png image/png']);
    expect(doc.children).toEqual([{ type: 'image', src: 'https://cdn.test/1.png', alt: 'p' }]);
  });
});

describe('reading files from other tools', () => {
  it('reads a textutil (Apple) file, inferring headings and lists from formatting', async () => {
    const { doc, warnings } = await readDocx(fixture('textutil.docx'));
    expect(doc.children.map((block) => block.type)).toEqual(['heading', 'paragraph', 'heading', 'list', 'list', 'paragraph', 'paragraph', 'paragraph', 'paragraph', 'paragraph', 'paragraph']);
    expect(doc.children[3]).toMatchObject({ ordered: false, items: [{}, { children: [{}, { type: 'list', items: [{ children: [{ children: [{ text: 'Nested item' }] }] }] }] }, {}] });
    expect(doc.children[4]).toMatchObject({ ordered: true, start: 3 });
    expect(warnings).toContain('Headings were inferred from text size (the document has no heading styles)');
    expect(warnings).toContain('Lists were inferred from typed bullets and numbers');
  });

  it('reads a file from the docx library: numbering, footnotes, merges, tracked changes, images', async () => {
    const { doc, warnings } = await readDocx(fixture('docx-library.docx'));
    expect(doc.children.slice(0, 5)).toEqual([
      { type: 'heading', level: 1, children: [{ type: 'text', text: 'From the docx library' }] },
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Has ' },
          { type: 'text', text: 'bold', marks: ['bold'] },
          { type: 'text', text: ' and a ' },
          { type: 'text', text: 'link', link: { href: 'https://example.com/lib' } },
          { type: 'text', text: '.' },
          { type: 'text', text: '1', marks: ['superscript'] },
        ],
      },
      {
        type: 'list',
        ordered: true,
        items: [
          { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Step one' }] }, { type: 'list', ordered: true, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Sub step' }] }] }] }] },
          { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Step two' }] }] },
        ],
      },
      { type: 'list', ordered: false, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Bullet' }] }] }] },
      { type: 'paragraph', children: [{ type: 'text', text: 'Kept inserted text' }] },
    ]);
    const table = doc.children[5];
    expect(table).toMatchObject({ type: 'table', rows: [{ cells: [{ header: true }, { header: true }] }, { cells: [{ rowspan: 2 }, {}] }, { cells: [{ children: [{ children: [{ text: '2' }] }] }] }, { cells: [{ colspan: 2 }] }] });
    expect(doc.children[6]).toMatchObject({ type: 'image', alt: 'Two pixels', title: 'Pixels' });
    expect(doc.children.slice(-2)).toEqual([{ type: 'rule' }, { type: 'list', ordered: true, items: [{ children: [{ type: 'paragraph', children: [{ type: 'text', text: 'A footnote.' }] }] }] }]);
    expect(warnings).toEqual(['Tracked changes were accepted', 'Footnotes and endnotes were moved to a numbered list at the end']);
  });

  it('can reject tracked changes instead', async () => {
    const { doc, warnings } = await readDocx(fixture('docx-library.docx'), { trackedChanges: 'reject' });
    expect(doc.children[4]).toEqual({ type: 'paragraph', children: [{ type: 'text', text: 'Kept deleted text' }] });
    expect(warnings[0]).toBe('Tracked changes were rejected');
  });

  it('can turn inference off', async () => {
    const { doc } = await readDocx(fixture('textutil.docx'), { inferStructure: false });
    expect(doc.children.some((block) => block.type === 'heading' || block.type === 'list')).toBe(false);
  });
});

describe('errors', () => {
  it('rejects files that are not Word documents', async () => {
    await expect(readDocx(new Uint8Array([1, 2, 3]))).rejects.toThrow(/Not a \.docx/);
  });
});
