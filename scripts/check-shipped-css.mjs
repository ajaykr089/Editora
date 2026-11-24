#!/usr/bin/env node
// Keeps the stylesheets the packages ship safe for the CSS pipelines apps put
// them through (webpack + postcss-preset-env + cssnano/clean-css, as in
// Create React App or Docusaurus). Two patterns broke there:
//
// - CSS nesting. cssnano and clean-css do not understand it: a nested
//   `.rte-toolbar-button { border: none }` came out as a top-level rule and the
//   real `.rte-toolbar-button` rule was merged away, so every toolbar button
//   lost its layout.
// - Case-insensitive attribute selectors (`[fill="black" i]`). The preset-env
//   polyfill writes out every upper/lower-case combination of the value
//   (2^letters selectors each): @editora/themes' dark.css never finished
//   building (over 20 minutes), and core's web component CSS grew to ~1 MB.
//
// Usage: node scripts/check-shipped-css.mjs [file.css...]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaults = [
  'packages/themes/src/index.css',
  'packages/themes/src/themes/default.css',
  'packages/themes/src/themes/dark.css',
  'packages/themes/src/themes/acme.css',
  'packages/core/src/webcomponent/styles.css',
  'packages/core/src/ui/native-ui.css',
  'packages/plugins/src/plugins.css',
];

export function findProblems(css) {
  const problems = [];
  // Blank out comments and strings, keeping offsets so line numbers stay right.
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  const code = css.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, (m) => m[0] + blank(m.slice(1, -1)) + m[0]);
  const lineOf = (i) => code.slice(0, i).split('\n').length;

  const stack = []; // 'rule' | 'at'
  let preludeStart = 0;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === '{') {
      const prelude = code.slice(preludeStart, i).trim();
      const kind = prelude.startsWith('@') ? 'at' : 'rule';
      if (kind === 'rule' && stack[stack.length - 1] === 'rule') {
        problems.push(`line ${lineOf(i)}: nested rule "${prelude.replace(/\s+/g, ' ').slice(0, 60)}" (CSS nesting)`);
      }
      stack.push(kind);
      preludeStart = i + 1;
    } else if (ch === '}') {
      stack.pop();
      preludeStart = i + 1;
    } else if (ch === ';') {
      preludeStart = i + 1;
    }
  }
  // Attribute selectors with the `i` flag, in the original text (the value is blanked in `code`).
  for (const m of css.replace(/\/\*[\s\S]*?\*\//g, blank).matchAll(/\[[^\]]*?["']\s+i\s*\]/g)) {
    problems.push(`line ${lineOf(m.index)}: case-insensitive attribute selector ${m[0]}`);
  }
  return problems;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const files = process.argv.slice(2).length ? process.argv.slice(2) : defaults.map((f) => path.join(root, f));
  let failed = 0;
  for (const file of files) {
    const problems = findProblems(fs.readFileSync(file, 'utf8'));
    if (problems.length) {
      failed += problems.length;
      console.error(`${path.relative(root, file)}:`);
      problems.slice(0, 20).forEach((p) => console.error(`  ${p}`));
      if (problems.length > 20) console.error(`  ...and ${problems.length - 20} more`);
    }
  }
  if (failed) {
    console.error(`\n${failed} problem(s). Write the rules out flat, and list the case forms ([fill="black"], [fill="BLACK"]) instead of the i flag.`);
    process.exit(1);
  }
  console.log(`Shipped CSS ok (${files.length} files).`);
}
