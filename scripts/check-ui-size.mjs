#!/usr/bin/env node
/**
 * Per-component size budget for @editora/ui-react.
 *
 * For every `@editora/ui-react/<Name>` entry this bundles `import '@editora/ui-react/<Name>'` the way
 * an app bundler does (esbuild, minified, code splitting, react external) against the BUILT packages
 * (run `npm run build` first) and measures what loads up front: the entry chunk plus everything it
 * imports statically, gzipped. Lazy chunks (the built-in icon set loads on first use) are reported
 * but not budgeted.
 *
 *   node scripts/check-ui-size.mjs            check against ui-size-budgets.json (CI)
 *   node scripts/check-ui-size.mjs --update   write budgets: current size + 10% (at least +1 KB)
 *   node scripts/check-ui-size.mjs Button     measure one or more entries and print the details
 */
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packages = path.join(root, 'packages');
const budgetFile = path.join(root, 'ui-size-budgets.json');
const args = process.argv.slice(2);
const update = args.includes('--update');
const only = args.filter((arg) => !arg.startsWith('--'));

const reactPkg = JSON.parse(readFileSync(path.join(packages, 'ui-react/package.json'), 'utf8'));
const entries = only.length
  ? only
  : Object.keys(reactPkg.exports).map((key) => /^\.\/([A-Z][A-Za-z]+)$/.exec(key)?.[1]).filter(Boolean);

const distOf = {
  '@editora/icons': path.join(packages, 'icons/dist/index.esm.js'),
  '@editora/toast': path.join(packages, 'editora-toast/dist/index.esm.js'),
};
for (const file of [path.join(packages, 'ui-react/dist/Button.esm.js'), path.join(packages, 'ui-core/dist/button.esm.js'), ...Object.values(distOf)]) {
  if (!existsSync(file)) {
    console.error(`Missing ${path.relative(root, file)}: build the packages first (npm run build).`);
    process.exit(2);
  }
}

const resolveBuilt = {
  name: 'editora-built',
  setup(b) {
    b.onResolve({ filter: /^@editora\/ui-core\/(.+)$/ }, (a) => ({ path: path.join(packages, 'ui-core/dist', `${a.path.split('/').pop()}.esm.js`) }));
    b.onResolve({ filter: /^@editora\/ui-core$/ }, () => ({ path: path.join(packages, 'ui-core/dist/index.esm.js') }));
    b.onResolve({ filter: /^@editora\/ui-react\/(.+)$/ }, (a) => ({ path: path.join(packages, 'ui-react/dist', `${a.path.split('/').pop()}.esm.js`) }));
    b.onResolve({ filter: /^@editora\/(icons|toast)$/ }, (a) => ({ path: distOf[a.path] }));
  },
};

async function measure(name) {
  const dir = mkdtempSync(path.join(tmpdir(), 'ui-size-'));
  try {
    writeFileSync(path.join(dir, 'entry.js'), `import * as m from '@editora/ui-react/${name}'; console.log(m);\n`);
    const result = await build({
      entryPoints: [path.join(dir, 'entry.js')],
      bundle: true, minify: true, format: 'esm', splitting: true, write: false, metafile: true,
      outdir: path.join(dir, 'out'),
      external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
      plugins: [resolveBuilt], logLevel: 'error',
    });
    const outputs = result.metafile.outputs;
    const keyFor = (file) => Object.keys(outputs).find((key) => path.resolve(root, key) === file || file.endsWith(key));
    const entryKey = Object.keys(outputs).find((key) => outputs[key].entryPoint);
    const initial = new Set();
    const walk = (key) => {
      if (!key || initial.has(key)) return;
      initial.add(key);
      for (const imp of outputs[key].imports || []) {
        if (imp.kind === 'import-statement') walk(Object.keys(outputs).find((k) => k === imp.path || k.endsWith(imp.path.replace(/^\.\//, ''))));
      }
    };
    walk(entryKey);
    let initialGz = 0;
    let lazyGz = 0;
    for (const file of result.outputFiles) {
      const gz = gzipSync(file.contents).length;
      if (initial.has(keyFor(file.path))) initialGz += gz;
      else lazyGz += gz;
    }
    return { initialGz, lazyGz };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const budgets = existsSync(budgetFile) ? JSON.parse(readFileSync(budgetFile, 'utf8')).budgets || {} : {};
const results = {};
for (const name of entries) results[name] = await measure(name);

if (only.length) {
  for (const [name, r] of Object.entries(results)) {
    console.log(`${name.padEnd(28)} initial ${kb(r.initialGz).padStart(9)} gz   lazy ${kb(r.lazyGz).padStart(9)} gz   budget ${budgets[name] ? kb(budgets[name]) : '-'}`);
  }
  process.exit(0);
}

if (update) {
  const next = {};
  for (const [name, r] of Object.entries(results).sort(([a], [b]) => a.localeCompare(b))) {
    next[name] = Math.max(Math.ceil((r.initialGz * 1.1) / 256) * 256, r.initialGz + 1024);
  }
  writeFileSync(budgetFile, `${JSON.stringify({
    description: 'Gzipped bytes each @editora/ui-react/<Name> entry may load up front (scripts/check-ui-size.mjs). Raise one deliberately, with a reason in the commit.',
    budgets: next,
  }, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(next).length} budgets to ${path.relative(root, budgetFile)}.`);
  process.exit(0);
}

const over = [];
const missing = [];
for (const [name, r] of Object.entries(results)) {
  if (budgets[name] == null) missing.push(name);
  else if (r.initialGz > budgets[name]) over.push(`${name}: ${kb(r.initialGz)} > budget ${kb(budgets[name])}`);
}
const total = Object.values(results).reduce((sum, r) => sum + r.initialGz, 0);
console.log(`Checked ${entries.length} entries (sum of initial sizes ${kb(total)} gz).`);
if (missing.length) console.log(`No budget yet (run with --update): ${missing.join(', ')}`);
if (over.length) {
  console.error(`Over budget:\n  ${over.join('\n  ')}`);
  process.exit(1);
}
if (missing.length) process.exit(1);
console.log('All entries within budget.');
