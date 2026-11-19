#!/usr/bin/env node
/**
 * Size guard for @editora/plugins.
 *
 * For every plugin subpath (`@editora/plugins/<name>`) this takes the plugin factory it exports and
 * builds a one-file app the way a user's app is built (a Vite production build, minified, against the
 * BUILT package resolved through node_modules, so package.json `exports` and `sideEffects` apply):
 *
 *   import { BoldPlugin } from '@editora/plugins';        (root)
 *   import { BoldPlugin } from '@editora/plugins/bold';   (subpath)
 *
 * It measures what loads up front (the entry chunk plus its static imports, gzipped) and fails when
 *   - the root import costs more than the subpath import (the root must tree-shake down to the one
 *     plugin: a missing `sideEffects` field once made `BoldPlugin` from the root cost 40 KB, not 1.5 KB), or
 *   - the root import is over its budget in plugins-size-budgets.json.
 * Lazy chunks (KaTeX for the math plugin, for example) are reported but not budgeted.
 *
 *   node scripts/check-plugins-size.mjs                 check (CI; run `npm run build` first)
 *   node scripts/check-plugins-size.mjs --update        write budgets: current size + 10% (at least +1 KB)
 *   node scripts/check-plugins-size.mjs BoldPlugin ...  measure some plugins and print the details
 */
import { build } from 'vite';
import { gzipSync } from 'node:zlib';
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginsDir = path.join(root, 'packages/plugins');
const budgetFile = path.join(root, 'plugins-size-budgets.json');
const args = process.argv.slice(2);
const update = args.includes('--update');
const only = args.filter((arg) => !arg.startsWith('--'));

// Root imports may differ from subpath imports by chunk names and gzip noise, not by code.
const PARITY_TOLERANCE = 256;
// Subpaths that are not a single plugin.
const NOT_PLUGINS = new Set(['.', './lite', './enterprise', './shared-config', './styles.css']);

const pkg = JSON.parse(readFileSync(path.join(pluginsDir, 'package.json'), 'utf8'));
const rootDist = path.join(pluginsDir, pkg.exports['.'].import);
if (!existsSync(rootDist)) {
  console.error(`Missing ${path.relative(root, rootDist)}: build the packages first (npm run build).`);
  process.exit(2);
}
if (!existsSync(path.join(root, 'node_modules/@editora/plugins/package.json'))) {
  console.error('node_modules/@editora/plugins is missing: run npm ci first.');
  process.exit(2);
}

/** Names in the final `export { a as Name, Name2 }` statement of a built ES module. */
function exportedNames(file) {
  const source = readFileSync(file, 'utf8');
  const blocks = [...source.matchAll(/export\s*\{([^}]*)\}/g)];
  if (!blocks.length) return [];
  return blocks.at(-1)[1]
    .split(',')
    .map((part) => part.trim().split(/\s+as\s+/).pop().trim())
    .filter(Boolean);
}

const rootNames = new Set(exportedNames(rootDist));
const plugins = [];
for (const [subpath, target] of Object.entries(pkg.exports)) {
  if (NOT_PLUGINS.has(subpath) || typeof target !== 'object') continue;
  const factories = exportedNames(path.join(pluginsDir, target.import)).filter((name) => /Plugin$/.test(name));
  for (const name of factories) {
    if (!rootNames.has(name)) continue; // only plugins the root re-exports can be compared
    plugins.push({ name, specifier: `@editora/plugins/${subpath.slice(2)}` });
  }
}
const selected = only.length ? plugins.filter((p) => only.includes(p.name)) : plugins;
const unknown = only.filter((name) => !plugins.some((p) => p.name === name));
if (unknown.length) {
  console.error(`Not a plugin export of both the root and a subpath: ${unknown.join(', ')}`);
  process.exit(2);
}

async function measure(name, specifier) {
  const dir = mkdtempSync(path.join(tmpdir(), 'plugins-size-'));
  try {
    // Resolve @editora/* exactly as an installed app would: through the workspace node_modules.
    symlinkSync(path.join(root, 'node_modules'), path.join(dir, 'node_modules'), 'junction');
    const entry = path.join(dir, 'main.js');
    writeFileSync(entry, `import { ${name} } from '${specifier}';\nconsole.log(${name}());\n`);
    const result = await build({
      root: dir, configFile: false, logLevel: 'silent',
      build: { write: false, minify: true, modulePreload: false, rollupOptions: { input: entry } },
    });
    const files = (Array.isArray(result) ? result : [result]).flatMap((r) => r.output).filter((f) => f.type === 'chunk');
    const initial = new Set();
    const walk = (fileName) => {
      if (initial.has(fileName)) return;
      initial.add(fileName);
      for (const imported of files.find((f) => f.fileName === fileName)?.imports || []) walk(imported);
    };
    walk(files.find((f) => f.isEntry).fileName);
    let initialGz = 0;
    let lazyGz = 0;
    for (const file of files) {
      const gz = gzipSync(file.code).length;
      if (initial.has(file.fileName)) initialGz += gz;
      else lazyGz += gz;
    }
    return { initialGz, lazyGz };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const measured = {};
const queue = [...selected];
await Promise.all(Array.from({ length: 4 }, async () => {
  for (let next = queue.shift(); next; next = queue.shift()) {
    const { name, specifier } = next;
    measured[name] = { root: await measure(name, '@editora/plugins'), subpath: await measure(name, specifier), specifier };
  }
}));
// Builds finish in any order; report in a stable one.
const results = Object.fromEntries(Object.entries(measured).sort(([a], [b]) => a.localeCompare(b)));

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const budgets = existsSync(budgetFile) ? JSON.parse(readFileSync(budgetFile, 'utf8')).budgets || {} : {};

if (only.length) {
  for (const [name, r] of Object.entries(results)) {
    console.log(
      `${name.padEnd(28)} root ${kb(r.root.initialGz).padStart(9)} gz   ${r.specifier.replace('@editora/plugins', '').padEnd(22)} ${kb(r.subpath.initialGz).padStart(9)} gz   lazy ${kb(r.root.lazyGz).padStart(9)} gz   budget ${budgets[name] ? kb(budgets[name]) : '-'}`,
    );
  }
  process.exit(0);
}

const notShaken = Object.entries(results)
  .filter(([, r]) => r.root.initialGz > r.subpath.initialGz + PARITY_TOLERANCE)
  .map(([name, r]) => `${name}: from the root ${kb(r.root.initialGz)}, from ${r.specifier} ${kb(r.subpath.initialGz)}`);

if (update) {
  if (notShaken.length) {
    console.error(`Not writing budgets while the root does not tree-shake:\n  ${notShaken.join('\n  ')}`);
    process.exit(1);
  }
  const next = {};
  for (const [name, r] of Object.entries(results).sort(([a], [b]) => a.localeCompare(b))) {
    next[name] = Math.max(Math.ceil((r.root.initialGz * 1.1) / 256) * 256, r.root.initialGz + 1024);
  }
  writeFileSync(budgetFile, `${JSON.stringify({
    description: "Gzipped bytes `import { <Name> } from '@editora/plugins'` may load up front (scripts/check-plugins-size.mjs). Raise one deliberately, with a reason in the commit.",
    budgets: next,
  }, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(next).length} budgets to ${path.relative(root, budgetFile)}.`);
  process.exit(0);
}

const over = [];
const missing = [];
for (const [name, r] of Object.entries(results)) {
  if (budgets[name] == null) missing.push(name);
  else if (r.root.initialGz > budgets[name]) over.push(`${name}: ${kb(r.root.initialGz)} > budget ${kb(budgets[name])}`);
}
const total = Object.values(results).reduce((sum, r) => sum + r.root.initialGz, 0);
console.log(`Checked ${selected.length} plugins imported from the root (sum of initial sizes ${kb(total)} gz).`);
let failed = false;
if (notShaken.length) {
  console.error(`The root import loads more than the plugin's own subpath (check the "sideEffects" field and module-level code):\n  ${notShaken.join('\n  ')}`);
  failed = true;
}
if (over.length) {
  console.error(`Over budget:\n  ${over.join('\n  ')}`);
  failed = true;
}
if (missing.length) {
  console.error(`No budget yet (run with --update): ${missing.join(', ')}`);
  failed = true;
}
if (failed) process.exit(1);
console.log('All plugins tree-shake from the root and are within budget.');
