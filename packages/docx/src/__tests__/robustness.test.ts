import type { Block, Doc } from '../ast.js';
import { DocxError, readDocx, writeDocx } from '../index.js';

// A long report: 1,650 blocks, about 240,000 characters (some 100 pages) of paragraphs, lists and tables.
function bigDocument(sections: number): Doc {
  const children: Block[] = [];
  for (let section = 1; section <= sections; section += 1) {
    children.push({ type: 'heading', level: 2, children: [{ type: 'text', text: `Section ${section}` }] });
    for (let index = 0; index < 8; index += 1) {
      children.push({
        type: 'paragraph',
        children: [
          { type: 'text', text: `Paragraph ${index} of section ${section}. `.repeat(6) },
          { type: 'text', text: 'Bold part', marks: ['bold'] },
          { type: 'text', text: ' and ' },
          { type: 'text', text: 'a link', link: { href: `https://example.com/${section}/${index}` } },
          { type: 'text', text: '.' },
        ],
      });
    }
    children.push({ type: 'list', ordered: section % 2 === 0, items: Array.from({ length: 5 }, (_, index) => ({ children: [{ type: 'paragraph' as const, children: [{ type: 'text' as const, text: `Item ${index}` }] }] })) });
    children.push({
      type: 'table',
      rows: Array.from({ length: 6 }, (_, row) => ({ cells: Array.from({ length: 4 }, (_, cell) => ({ ...(row === 0 ? { header: true } : {}), children: [{ type: 'paragraph' as const, children: [{ type: 'text' as const, text: `R${row}C${cell}` }] }] })) })),
    });
  }
  return { type: 'doc', children };
}

describe('large documents', () => {
  it('writes and reads a 100-page report quickly, and keeps it intact', async () => {
    const doc = bigDocument(150);
    const startWrite = performance.now();
    const { data } = await writeDocx(doc);
    const writeMs = performance.now() - startWrite;
    const startRead = performance.now();
    const { doc: back } = await readDocx(data);
    const readMs = performance.now() - startRead;
    if (process.env.DOCX_TIMING) console.log(`write ${Math.round(writeMs)} ms, read ${Math.round(readMs)} ms, ${Math.round(data.length / 1024)} KB, ${doc.children.length} blocks`);
    expect(back).toEqual(doc);
    // Generous bounds for slow CI machines; locally both take well under a second.
    expect(writeMs).toBeLessThan(5000);
    expect(readMs).toBeLessThan(5000);
  }, 20000);
});

describe('damaged files', () => {
  // A small deterministic random generator, so failures can be reproduced.
  function random(seed: number) {
    return () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 2 ** 32;
    };
  }

  it('either reads or throws a DocxError for damaged bytes, never anything else', async () => {
    const { data } = await writeDocx(bigDocument(2));
    const next = random(42);
    const outcomes = { read: 0, rejected: 0 };
    for (let attempt = 0; attempt < 150; attempt += 1) {
      const copy = data.slice();
      const flips = 1 + Math.floor(next() * 8);
      for (let flip = 0; flip < flips; flip += 1) copy[Math.floor(next() * copy.length)] = Math.floor(next() * 256);
      try {
        await readDocx(copy);
        outcomes.read += 1;
      } catch (error) {
        expect(error).toBeInstanceOf(DocxError);
        outcomes.rejected += 1;
      }
    }
    expect(outcomes.read + outcomes.rejected).toBe(150);
  }, 30000);

  it('throws a DocxError for files cut short at any point', async () => {
    const { data } = await writeDocx(bigDocument(1));
    for (const fraction of [0.1, 0.3, 0.5, 0.7, 0.9, 0.99]) {
      await expect(readDocx(data.subarray(0, Math.floor(data.length * fraction)))).rejects.toBeInstanceOf(DocxError);
    }
  });
});
