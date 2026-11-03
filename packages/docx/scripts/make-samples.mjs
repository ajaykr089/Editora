#!/usr/bin/env node
// Write .docx files that cover every feature, to open in Word, LibreOffice and Google Docs by hand.
//
//   npm run build -w @editora/docx -w @editora/rich-text-convert
//   node packages/docx/scripts/make-samples.mjs [output folder]   # default packages/docx/samples-out
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const { readDocx, writeDocx } = await import(join(here, '..', 'dist', 'index.js'));
const { read } = await import(join(here, '..', '..', 'rich-text-convert', 'dist', 'index.js'));
const out = process.argv[2] ?? join(here, '..', 'samples-out');
await mkdir(out, { recursive: true });

// Images made here, so the samples need no network: a PNG gradient strip and a wide banner.
function png(width, height, pixel) {
  const crcTable = Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  const crc = (bytes) => {
    let c = 0xffffffff;
    for (const byte of bytes) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type), data]);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const sum = Buffer.alloc(4);
    sum.writeUInt32BE(crc(body));
    return Buffer.concat([length, body, sum]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  const rows = [];
  for (let y = 0; y < height; y += 1) {
    rows.push(0);
    for (let x = 0; x < width; x += 1) rows.push(...pixel(x, y));
  }
  // Stored (uncompressed) deflate blocks keep this dependency-free.
  const raw = Buffer.from(rows);
  const blocks = [];
  for (let offset = 0; offset < raw.length; offset += 65535) {
    const part = raw.subarray(offset, offset + 65535);
    const head = Buffer.alloc(5);
    head[0] = offset + 65535 >= raw.length ? 1 : 0;
    head.writeUInt16LE(part.length, 1);
    head.writeUInt16LE(~part.length & 0xffff, 3);
    blocks.push(head, part);
  }
  let a = 1;
  let b = 0;
  for (const byte of raw) {
    a = (a + byte) % 65521;
    b = (b + a) % 65521;
  }
  const adler = Buffer.alloc(4);
  adler.writeUInt32BE(((b << 16) | a) >>> 0);
  const idat = Buffer.concat([Buffer.from([0x78, 0x01]), ...blocks, adler]);
  return `data:image/png;base64,${Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', header), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]).toString('base64')}`;
}
const strip = png(240, 60, (x) => [Math.round((x / 240) * 255), 90, 200]);
const banner = png(1600, 200, (x, y) => [20, Math.round((y / 200) * 180), Math.round((x / 1600) * 255)]);

const samples = {
  '01-text-and-marks.html': `<h1>Text and marks</h1>
<p>Plain, <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike</s>, <code>inline code</code>, H<sub>2</sub>O, E = mc<sup>2</sup>, <mark>highlight</mark>.</p>
<p><strong><em>Bold italic</em></strong>, <a href="https://example.com/docs?a=1&amp;b=2">a link with a query</a>, and a <a href="mailto:team@example.com">mail link</a>.<br>A line break inside a paragraph, then a tab:\there.</p>
<p>Unicode: café, naïve, Ελληνικά, 日本語, emoji 🚀, quotes “like this” — and an en dash – too.</p>
<h2>Heading 2</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><h6>Heading 6</h6>
<blockquote><p>A quote, in the Quote style.</p><p>Its second paragraph.</p></blockquote>
<pre><code>function hello(name) {
\treturn \`Hello, \${name}!\`;
}</code></pre>
<hr>
<p>After the rule.</p>`,
  '02-lists.html': `<h1>Lists</h1>
<ul><li>Bullet one<ul><li>Level two<ul><li>Level three<ul><li>Level four</li></ul></li></ul></li></ul></li><li>Bullet two</li></ul>
<ol><li>Number one<ol><li>Nested number</li><li>Another</li></ol></li><li>Number two</li></ol>
<ol start="7"><li>Starts at seven</li><li>Eight</li></ol>
<ul><li>Mixed: bullet<ol><li>with numbered children</li></ol></li></ul>
<ul data-type="taskList"><li data-checked="true">Done task</li><li data-checked="false">Open task</li></ul>
<ul><li><p>Item with two paragraphs.</p><p>The second paragraph of the same item.</p></li></ul>`,
  '03-tables.html': `<h1>Tables</h1>
<table><tr><th>Name</th><th>Role</th><th>Since</th></tr><tr><td>Ada</td><td>Engineer</td><td>2021</td></tr><tr><td>Grace</td><td>Admiral</td><td>2019</td></tr></table>
<p>Merged cells:</p>
<table><tr><th>Region</th><th colspan="2">Q1–Q2</th></tr><tr><td rowspan="2">North</td><td>10</td><td>12</td></tr><tr><td>11</td><td>13</td></tr><tr><td colspan="3">Total row across all columns</td></tr></table>
<p>A table inside a table cell:</p>
<table><tr><td>Outer</td><td><table><tr><td>Inner A</td><td>Inner B</td></tr></table></td></tr></table>`,
  '04-images.html': `<h1>Images</h1>
<p>A small image (240×60):</p><p><img src="${strip}" alt="Purple gradient strip"></p>
<p>A wide image (1600×200), scaled to the page width:</p><p><img src="${banner}" alt="Blue banner"></p>
<p>An inline image <img src="${strip}" alt="Inline strip"> inside a sentence.</p>`,
};

const report = [];
for (const [name, html] of Object.entries(samples)) {
  const file = name.replace(/\.html$/, '.docx');
  const { data, warnings } = await writeDocx(read(html, 'html'), { title: file.slice(3, -5).replace(/-/g, ' ') });
  await writeFile(join(out, file), data);
  report.push(`${file}: ${(data.length / 1024).toFixed(1)} KB${warnings.length ? `, warnings: ${warnings.join('; ')}` : ''}`);
}

// A long document, for page flow and the navigation pane.
const sections = Array.from({ length: 60 }, (_, index) => `<h2>Section ${index + 1}</h2>${'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>'.repeat(5)}<ul><li>Point A</li><li>Point B</li></ul>`).join('');
const long = await writeDocx(read(`<h1>Long report</h1>${sections}`, 'html'), { title: 'Long report', page: 'a4' });
await writeFile(join(out, '05-long-report-a4.docx'), long.data);
report.push(`05-long-report-a4.docx: ${(long.data.length / 1024).toFixed(1)} KB`);

// A file from another writer, read and written back.
const library = await readDocx(await readFile(join(here, '..', 'src', '__tests__', 'fixtures', 'docx-library.docx')));
const back = await writeDocx(library.doc, { title: 'Round trip' });
await writeFile(join(out, '06-round-trip-from-docx-library.docx'), back.data);
report.push(`06-round-trip-from-docx-library.docx: ${(back.data.length / 1024).toFixed(1)} KB`);

console.log(`Wrote ${report.length} files to ${out}\n${report.map((line) => `  ${line}`).join('\n')}`);
