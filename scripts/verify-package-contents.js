#!/usr/bin/env node
/**
 * Refuses to let a package be published with missing entry points.
 *
 * `changeset publish` packs whatever is on disk. `dist/` is not committed, so in a fresh CI
 * checkout a package that nothing built is published as just LICENSE + README + package.json
 * (36 plugin packages went out that way in the 2026-10-02 release: they installed fine and could
 * not be imported). This runs `npm pack --dry-run` for every publishable workspace and checks
 * that each file named by main / module / types / bin / exports is really in the tarball.
 *
 * Run it after `npm run build`.
 */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const changesetConfig = JSON.parse(fs.readFileSync(path.join(root, '.changeset', 'config.json'), 'utf8'));
const ignored = new Set(changesetConfig.ignore || []);

function runPack() {
  const raw = execFileSync('npm', ['pack', '--dry-run', '--json', '--workspaces', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return JSON.parse(raw);
}

function manifestFor(entry) {
  // `npm pack --workspaces` does not say which directory an entry came from, so match by name.
  const dirs = [];
  for (const base of ['packages', path.join('packages', 'plugins'), 'sandbox']) {
    const abs = path.join(root, base);
    if (!fs.existsSync(abs)) continue;
    if (base === 'sandbox') dirs.push(abs);
    else for (const d of fs.readdirSync(abs)) dirs.push(path.join(abs, d));
  }
  for (const dir of dirs) {
    const file = path.join(dir, 'package.json');
    if (!fs.existsSync(file)) continue;
    const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (pkg.name === entry.name) return pkg;
  }
  return null;
}

function entryPoints(pkg) {
  // Runtime entry points break an install outright when absent; typings only degrade it.
  const runtime = new Set();
  const types = new Set();
  for (const key of ['main', 'module']) if (typeof pkg[key] === 'string') runtime.add(pkg[key]);
  for (const key of ['types', 'typings']) if (typeof pkg[key] === 'string') types.add(pkg[key]);
  if (typeof pkg.bin === 'string') runtime.add(pkg.bin);
  else if (pkg.bin && typeof pkg.bin === 'object') Object.values(pkg.bin).forEach((b) => runtime.add(b));
  const walk = (value, condition) => {
    if (typeof value === 'string') {
      if (!value.startsWith('./') || value.includes('*')) return;
      (condition === 'types' || value.endsWith('.d.ts') ? types : runtime).add(value);
    } else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) walk(v, k === 'types' ? 'types' : condition);
    }
  };
  walk(pkg.exports);
  const clean = (set) => [...set].map((p) => p.replace(/^\.\//, ''));
  return { runtime: clean(runtime), types: clean(types) };
}

const problems = [];
const typeGaps = [];
let checked = 0;
for (const entry of runPack()) {
  const pkg = manifestFor(entry);
  if (!pkg || pkg.private || ignored.has(pkg.name)) continue;
  checked += 1;
  const packed = new Set(entry.files.map((f) => f.path));
  const { runtime, types } = entryPoints(pkg);
  const missing = [...new Set(runtime.filter((p) => !packed.has(p)))];
  if (missing.length) problems.push({ name: `${pkg.name}@${pkg.version}`, missing });
  if (types.some((p) => !packed.has(p))) typeGaps.push(pkg.name);
}

if (typeGaps.length) {
  // Not fatal: many plugin packages have always declared "types": "dist/index.d.ts" without the
  // build emitting it, so TypeScript users get no typings from them. Reported so it stays visible.
  console.warn(`! ${typeGaps.length} packages declare typings that are not in the tarball (TypeScript users get no types from them).`);
}

if (problems.length) {
  console.error(`\n${problems.length} of ${checked} publishable packages would be published without files their package.json points at:\n`);
  for (const p of problems) console.error(`  ${p.name}\n      missing: ${p.missing.join(', ')}`);
  console.error('\nBuild every workspace first (npm run build), or fix the package "files" list.\n');
  process.exit(1);
}
console.log(`✓ ${checked} publishable packages contain every runtime entry point their package.json names.`);
