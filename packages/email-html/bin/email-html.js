#!/usr/bin/env node
// Turn editor HTML into email-safe HTML.
//
//   npx email-html newsletter.html -o email.html --text email.txt --preheader "This week"
//   cat body.html | npx email-html - --fragment > inlined.html
import { readFile, writeFile } from 'node:fs/promises';
import { toEmailHtml } from '../dist/index.js';

const USAGE = `Usage: email-html <file | -> [options]

  -                     read HTML from stdin
  -o, --output <file>   write the email HTML to a file instead of stdout
  --text <file>         also write the plain-text version
  --title <text>        the document title
  --preheader <text>    the inbox preview line
  --width <px>          column width (default 600)
  --base-url <url>      resolve relative links and images against this URL
  --theme <file.json>   colours, fonts and spacing (see the README)
  --fragment            output only the inlined content, without the document
  --strict              exit with code 1 when there are warnings
  --quiet               do not print warnings
  --help                show this help`;

const args = process.argv.slice(2);
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(USAGE);
  process.exit(0);
}

let input;
let output;
let textFile;
let themeFile;
let strict = false;
let quiet = false;
const options = {};
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  const next = () => args[(index += 1)];
  if (arg === '-o' || arg === '--output') output = next();
  else if (arg === '--text') textFile = next();
  else if (arg === '--title') options.title = next();
  else if (arg === '--preheader') options.preheader = next();
  else if (arg === '--width') options.width = Number(next());
  else if (arg === '--base-url') options.baseUrl = next();
  else if (arg === '--theme') themeFile = next();
  else if (arg === '--fragment') options.fragment = true;
  else if (arg === '--strict') strict = true;
  else if (arg === '--quiet') quiet = true;
  else if (arg.startsWith('-') && arg !== '-') {
    console.error(`Unknown option ${arg}\n\n${USAGE}`);
    process.exit(2);
  } else input = arg;
}
if (input === undefined) {
  console.error(`An input file (or - for stdin) is required.\n\n${USAGE}`);
  process.exit(2);
}
if (options.width !== undefined && !(options.width > 0)) {
  console.error('--width must be a number of pixels');
  process.exit(2);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

if (themeFile) options.theme = JSON.parse(await readFile(themeFile, 'utf8'));
const source = input === '-' ? await readStdin() : await readFile(input, 'utf8');
const result = toEmailHtml(source, options);

if (output) await writeFile(output, result.html);
else process.stdout.write(result.html);
if (textFile) await writeFile(textFile, `${result.text}\n`);

if (!quiet) for (const warning of result.warnings) console.error(`warning: ${warning}`);
if (strict && result.warnings.length) process.exit(1);
