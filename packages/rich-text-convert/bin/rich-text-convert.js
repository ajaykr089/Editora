#!/usr/bin/env node
// Convert rich text between editor formats.
//
//   npx rich-text-convert post.json --to markdown
//   npx rich-text-convert notes.md --to tiptap -o notes.json
//   cat lexical.json | npx rich-text-convert - --from lexical --to html
import { readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { FORMATS, convert } from '../dist/index.js';

const USAGE = `Usage: rich-text-convert <file | -> --to <format> [options]

  -                     read from stdin
  --from <format>       input format (detected when left out)
  --to <format>         output format (required)
  -o, --output <file>   write to a file instead of stdout
  --lexical-images      Lexical: write image nodes (needs an ImageNode in your editor)
  --editorjs-strings    Editor.js: write 1.x string lists instead of nested lists
  --strict              exit with code 1 when anything could not be carried over
  --quiet               do not print warnings
  --help                show this help

Formats: ${FORMATS.join(', ')}`;

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(USAGE);
  process.exit(0);
}

let input;
let from;
let to;
let output;
let strict = false;
let quiet = false;
const options = { lexical: {}, editorjs: {} };
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === '--from') from = args[(index += 1)];
  else if (arg === '--to') to = args[(index += 1)];
  else if (arg === '-o' || arg === '--output') output = args[(index += 1)];
  else if (arg === '--lexical-images') options.lexical.imageNodes = true;
  else if (arg === '--editorjs-strings') options.editorjs.lists = 'strings';
  else if (arg === '--strict') strict = true;
  else if (arg === '--quiet') quiet = true;
  else if (arg.startsWith('-') && arg !== '-') {
    console.error(`Unknown option ${arg}\n\n${USAGE}`);
    process.exit(2);
  } else input = arg;
}
for (const [name, value] of [['--from', from], ['--to', to]]) {
  if (value !== undefined && !FORMATS.includes(value)) {
    console.error(`${name} must be one of: ${FORMATS.join(', ')}`);
    process.exit(2);
  }
}
if (!to || input === undefined) {
  console.error(`An input and --to are required.\n\n${USAGE}`);
  process.exit(2);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const source = input === '-' ? await readStdin() : await readFile(input, 'utf8');
// A file extension settles HTML vs Markdown when the content alone cannot.
const byExtension = { '.md': 'markdown', '.markdown': 'markdown', '.html': 'html', '.htm': 'html' }[extname(input).toLowerCase()];

let result;
try {
  result = convert(source, { from: from ?? byExtension, to, ...options });
} catch (error) {
  console.error(`rich-text-convert: ${error.message}`);
  process.exit(2);
}

const text = typeof result.output === 'string' ? result.output : `${JSON.stringify(result.output, null, 2)}\n`;
if (output) await writeFile(output, text);
else process.stdout.write(text);

if (!quiet) for (const warning of result.warnings) console.error(`warning: ${warning}`);
if (strict && result.warnings.length) process.exit(1);
