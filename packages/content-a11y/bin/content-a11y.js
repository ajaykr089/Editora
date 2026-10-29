#!/usr/bin/env node
// Check HTML content files for accessibility problems, for CI.
//
//   npx content-a11y content/ --min-heading 2
//   npx content-a11y page.html --fix              # apply the safe fixes in place
//   cat body.html | npx content-a11y - --json
//
// Needs an HTML parser in your project: `npm i -D jsdom` (or linkedom).
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { checkContent, fixContent, formatReport } from '../dist/index.js';

const USAGE = `Usage: content-a11y [files or folders...] [options]

  -                     read HTML from stdin
  --fix                 apply the fixes that are safe without looking, and write the files back
  --fix-suggested       also apply suggested fixes (headings, lists, link labels...)
  --json                print a JSON report
  --min-heading <n>     headings in the content start at this level (2 when the page title is the h1)
  --fail-on <level>     error (default), warning, or none
  --rule <id>=<value>   off, error, warning or info; repeatable
  --help                show this help`;

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(USAGE);
  process.exit(0);
}

const options = { rules: {} };
const inputs = [];
let fix = false;
let fixSuggested = false;
let json = false;
let failOn = 'error';
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg === '--fix') fix = true;
  else if (arg === '--fix-suggested') fix = fixSuggested = true;
  else if (arg === '--json') json = true;
  else if (arg === '--min-heading') options.minHeadingLevel = Number(args[(index += 1)]);
  else if (arg === '--fail-on') failOn = args[(index += 1)];
  else if (arg === '--rule') {
    const [id, value] = String(args[(index += 1)]).split('=');
    options.rules[id] = value;
  } else if (arg.startsWith('--')) {
    console.error(`Unknown option ${arg}\n\n${USAGE}`);
    process.exit(2);
  } else inputs.push(arg);
}
if (!['error', 'warning', 'none'].includes(failOn)) {
  console.error('--fail-on must be error, warning or none');
  process.exit(2);
}

async function loadParser() {
  try {
    const { parseHTML } = await import('linkedom');
    return (html) => parseHTML(/<html[\s>]/i.test(html) ? html : `<!doctype html><html><head></head><body>${html}</body></html>`).document;
  } catch {
    // Try jsdom next.
  }
  try {
    const { JSDOM } = await import('jsdom');
    return (html) => new JSDOM(html).window.document;
  } catch {
    console.error('content-a11y needs an HTML parser: run `npm i -D jsdom` (or linkedom) in your project.');
    process.exit(2);
  }
}

async function collect(path, out) {
  const info = await stat(path);
  if (info.isDirectory()) {
    for (const entry of await readdir(path)) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue;
      await collect(join(path, entry), out);
    }
  } else if (['.html', '.htm'].includes(extname(path).toLowerCase())) {
    out.push(path);
  }
  return out;
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const parse = await loadParser();
options.parse = parse;

const files = [];
for (const input of inputs.length ? inputs : ['-']) {
  if (input === '-') files.push('-');
  else await collect(input, files);
}
if (files.length === 0) {
  console.error('No .html files found.');
  process.exit(2);
}

const report = [];
let failing = 0;
for (const file of files) {
  const html = file === '-' ? await readStdin() : await readFile(file, 'utf8');
  const document = /<html[\s>]/i.test(html);
  let issues;
  let applied = [];
  if (fix) {
    const doc = parse(html);
    const fixed = fixContent(doc.body, { ...options, kinds: fixSuggested ? ['auto', 'suggested'] : ['auto'] });
    applied = fixed.applied;
    issues = fixed.remaining;
    const output = document ? `${/^\s*<!doctype/i.test(html) ? '<!DOCTYPE html>\n' : ''}${doc.documentElement.outerHTML}\n` : fixed.html;
    // stdin always goes back out (a pipeline expects it); files are only rewritten when something changed.
    if (file === '-') process.stdout.write(output);
    else if (applied.length > 0) await writeFile(file, output);
  } else {
    issues = checkContent(html, options).issues;
  }
  const counted = issues.filter((issue) => issue.severity === 'error' || (failOn === 'warning' && issue.severity === 'warning'));
  if (failOn !== 'none') failing += counted.length;
  report.push({ file, issues, applied });
}

if (json) {
  console.log(
    JSON.stringify(
      report.map(({ file, issues, applied }) => ({
        file,
        fixed: applied,
        issues: issues.map(({ rule, severity, level, wcag, message, help, snippet, fixes }) => ({
          rule, severity, level, wcag, message, help, snippet, fixes: fixes.map((item) => ({ label: item.label, kind: item.kind })),
        })),
      })),
      null,
      2,
    ),
  );
} else {
  for (const { file, issues, applied } of report) {
    const name = file === '-' ? 'stdin' : file;
    if (applied.length) console.error(`${name}: fixed ${applied.length} problem${applied.length === 1 ? '' : 's'} (${applied.map((item) => item.rule).join(', ')})`);
    console.error(formatReport(issues, name));
  }
  const total = report.reduce((sum, { issues }) => sum + issues.length, 0);
  console.error(`\n${total} problem${total === 1 ? '' : 's'} in ${report.length} file${report.length === 1 ? '' : 's'}${failOn !== 'none' ? `; ${failing} at or above "${failOn}"` : ''}.`);
}
process.exit(failing > 0 ? 1 : 0);
