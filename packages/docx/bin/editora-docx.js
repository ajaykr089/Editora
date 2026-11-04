#!/usr/bin/env node
// Convert Word files to and from other formats.
//
//   npx @editora/docx report.docx --to markdown -o report.md
//   npx @editora/docx notes.md -o notes.docx
//   npx @editora/docx page.html -o page.docx --title "Page"
//
// Formats other than the document tree (ast) need @editora/rich-text-convert.
import { readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { readDocx, writeDocx } from '../dist/index.js';

const USAGE = `Usage: editora-docx <file> [options]

  A .docx input is read and converted --to a format (default html).
  Any other input is converted into a .docx.

  --to <format>         html, markdown, tiptap, prosemirror, lexical, slate, plate,
                        portable-text, editorjs or ast (default html)
  --from <format>       input format when writing a .docx (detected when left out)
  -o, --output <file>   write to a file instead of stdout (needed for .docx output)
  --title <text>        document title when writing
  --page <letter|a4>    page size when writing (default letter)
  --images <folder>     when reading: save images to files in this folder instead of data: URLs
  --reject-changes      when reading: reject tracked changes instead of accepting them
  --strict              exit with code 1 when anything could not be carried over
  --quiet               do not print warnings
  --help                show this help`;

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(USAGE);
  process.exit(0);
}

let input;
let output;
let to = 'html';
let from;
let imageFolder;
let strict = false;
let quiet = false;
const writeOptions = {};
const readOptions = {};
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  const next = () => args[(index += 1)];
  if (arg === '-o' || arg === '--output') output = next();
  else if (arg === '--to') to = next();
  else if (arg === '--from') from = next();
  else if (arg === '--title') writeOptions.title = next();
  else if (arg === '--page') writeOptions.page = next();
  else if (arg === '--images') imageFolder = next();
  else if (arg === '--reject-changes') readOptions.trackedChanges = 'reject';
  else if (arg === '--strict') strict = true;
  else if (arg === '--quiet') quiet = true;
  else if (arg.startsWith('-')) {
    console.error(`Unknown option ${arg}\n\n${USAGE}`);
    process.exit(2);
  } else input = arg;
}
if (!input) {
  console.error(`An input file is required.\n\n${USAGE}`);
  process.exit(2);
}

async function converter() {
  try {
    return await import('@editora/rich-text-convert');
  } catch {
    console.error('Converting to or from formats other than "ast" needs @editora/rich-text-convert: npm i @editora/rich-text-convert');
    process.exit(2);
  }
}

let warnings;
try {
  if (extname(input).toLowerCase() === '.docx') {
    if (imageFolder) {
      const { mkdir } = await import('node:fs/promises');
      await mkdir(imageFolder, { recursive: true });
      readOptions.image = async ({ path, data }) => {
        const file = `${imageFolder}/${path.split('/').pop()}`;
        await writeFile(file, data);
        return file;
      };
    }
    const result = await readDocx(await readFile(input), readOptions);
    warnings = result.warnings;
    let text;
    if (to === 'ast') text = `${JSON.stringify(result.doc, null, 2)}\n`;
    else {
      const { convert } = await converter();
      const converted = convert(result.doc, { from: 'ast', to });
      warnings.push(...converted.warnings);
      text = typeof converted.output === 'string' ? converted.output : `${JSON.stringify(converted.output, null, 2)}\n`;
    }
    if (output) await writeFile(output, text);
    else process.stdout.write(text);
  } else {
    if (!output) {
      console.error('Writing a .docx needs -o <file.docx>.');
      process.exit(2);
    }
    const source = await readFile(input, 'utf8');
    const byExtension = { '.md': 'markdown', '.markdown': 'markdown', '.html': 'html', '.htm': 'html' }[extname(input).toLowerCase()];
    let doc;
    const format = from ?? byExtension;
    if (format === 'ast') doc = JSON.parse(source);
    else {
      const { read, Report } = await converter();
      const report = new Report();
      doc = read(source, format, report);
      warnings = report.warnings;
    }
    const result = await writeDocx(doc, writeOptions);
    warnings = [...(warnings ?? []), ...result.warnings];
    await writeFile(output, result.data);
  }
} catch (error) {
  console.error(`editora-docx: ${error.message}`);
  process.exit(2);
}

if (!quiet) for (const warning of warnings) console.error(`warning: ${warning}`);
if (strict && warnings.length) process.exit(1);
