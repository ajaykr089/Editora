#!/usr/bin/env node
/**
 * Emits TypeScript declarations for the individual plugin packages.
 *
 * ~46 packages under packages/plugins/* declare `"types": "dist/index.d.ts"`, but their `vite build` only
 * produces JavaScript, so TypeScript users who installed one got no typings at all (TS7016, or `any`).
 * This runs the compiler once over every plugin's `src/index.ts`, then gives each package the
 * declaration files it actually needs under `dist/_types/` plus a `dist/index.d.ts` that re-exports its
 * entry. A package only receives the files reachable from its own entry (its source, `shared/`, ...), so
 * tarballs stay small.
 *
 * Run it after `npm run build` (the build wipes `dist/`).
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const pluginsRoot = path.join(root, 'packages', 'plugins');
const changesetConfig = JSON.parse(fs.readFileSync(path.join(root, '.changeset', 'config.json'), 'utf8'));
const ignored = new Set(changesetConfig.ignore || []);

function targets() {
  const out = [];
  for (const name of fs.readdirSync(pluginsRoot)) {
    const dir = path.join(pluginsRoot, name);
    const pj = path.join(dir, 'package.json');
    const entry = ['src/index.ts', 'src/index.tsx'].map((e) => path.join(dir, e)).find((e) => fs.existsSync(e));
    if (!fs.existsSync(pj) || !entry) continue;
    const pkg = JSON.parse(fs.readFileSync(pj, 'utf8'));
    const declared = (pkg.types || pkg.typings || '').replace(/^\.\//, '');
    if (pkg.private || ignored.has(pkg.name) || declared !== 'dist/index.d.ts') continue;
    out.push({ name: pkg.name, dirName: name, dir, entry });
  }
  return out;
}

function compile(entries, outDir) {
  const configPath = path.join(pluginsRoot, 'tsconfig.json');
  const read = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, pluginsRoot);
  const options = {
    ...parsed.options,
    declaration: true,
    emitDeclarationOnly: true,
    noEmit: false,
    outDir,
    rootDir: pluginsRoot,
    skipLibCheck: true,
    composite: false,
    incremental: false,
    declarationMap: false,
    sourceMap: false,
  };
  const program = ts.createProgram(entries, options);
  program.emit(undefined, undefined, undefined, true);
}

const RELATIVE = /(?:from|import\()\s*['"](\.{1,2}\/[^'"]+)['"]/g;

function resolveDts(fromFile, spec) {
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const candidate of [`${base}.d.ts`, path.join(base, 'index.d.ts'), base]) {
    if (candidate.endsWith('.d.ts') && fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function reachable(entryDts) {
  const seen = new Set();
  const queue = [entryDts];
  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(RELATIVE)) {
      const next = resolveDts(file, m[1]);
      if (next) queue.push(next);
    }
  }
  return [...seen];
}

/**
 * Non-plugin packages that declare `dist/index.d.ts` but only run `vite build` (today: @editora/ui-editor).
 * They are compiled with their own tsconfig, here rather than in their `build` script: those packages run
 * `build` from `prepare` during `npm ci`, when the workspaces they import types from are not built yet.
 */
function ownConfigTargets() {
  const out = [];
  const packagesRoot = path.join(root, 'packages');
  for (const name of fs.readdirSync(packagesRoot)) {
    const dir = path.join(packagesRoot, name);
    const pj = path.join(dir, 'package.json');
    if (name === 'plugins' || !fs.existsSync(pj) || !fs.existsSync(path.join(dir, 'tsconfig.json'))) continue;
    const pkg = JSON.parse(fs.readFileSync(pj, 'utf8'));
    const declared = (pkg.types || pkg.typings || '').replace(/^\.\//, '');
    if (pkg.private || ignored.has(pkg.name) || declared !== 'dist/index.d.ts') continue;
    if (!fs.existsSync(path.join(dir, 'src', 'index.ts'))) continue;
    if (fs.existsSync(path.join(dir, 'dist', 'index.d.ts'))) continue; // its own build already emitted them
    out.push({ name: pkg.name, dir });
  }
  return out;
}

function compileOwnConfig(dir) {
  const configPath = path.join(dir, 'tsconfig.json');
  const read = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, dir);
  const program = ts.createProgram(parsed.fileNames, {
    ...parsed.options,
    declaration: true,
    emitDeclarationOnly: true,
    noEmit: false,
    skipLibCheck: true,
  });
  program.emit(undefined, undefined, undefined, true);
}

const list = targets();
const own = ownConfigTargets();
if (!list.length && !own.length) {
  console.log('no packages need typings');
  process.exit(0);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'editora-dts-'));
try {
  const failures = [];

  for (const t of own) {
    compileOwnConfig(t.dir);
    if (!fs.existsSync(path.join(t.dir, 'dist', 'index.d.ts'))) failures.push(`${t.name}: no dist/index.d.ts emitted`);
  }

  if (list.length) compile(list.map((t) => t.entry), tmp);

  for (const t of list) {
    const entryDts = path.join(tmp, t.dirName, 'src', 'index.d.ts');
    if (!fs.existsSync(entryDts)) {
      failures.push(`${t.name}: no declaration emitted for src/index`);
      continue;
    }
    const distTypes = path.join(t.dir, 'dist', '_types');
    fs.rmSync(distTypes, { recursive: true, force: true });
    for (const file of reachable(entryDts)) {
      const dest = path.join(distTypes, path.relative(tmp, file));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(file, dest);
    }
    const entryText = fs.readFileSync(entryDts, 'utf8');
    const hasDefault = /export\s+default\b|export\s*\{[^}]*\bdefault\b/.test(entryText);
    const target = `./_types/${t.dirName}/src/index`;
    fs.writeFileSync(
      path.join(t.dir, 'dist', 'index.d.ts'),
      `export * from '${target}';\n${hasDefault ? `export { default } from '${target}';\n` : ''}`
    );
  }

  if (failures.length) {
    console.error(`\n${failures.length} package(s) got no typings:\n  ${failures.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`✓ wrote typings for ${list.length} plugin packages and ${own.length} other package(s)`);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
