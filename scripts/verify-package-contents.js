#!/usr/bin/env node
/**
 * Refuses to let a package be published with missing entry points or typings.
 *
 * `changeset publish` packs whatever is on disk. `dist/` is not committed, so in a fresh CI checkout a
 * package that nothing built is published as just LICENSE + README + package.json (36 plugin packages
 * went out that way in the 2026-10-02 release: they installed fine and could not be imported; ~46 more
 * declared typings that the build never emitted). This computes, for every publishable workspace, the
 * exact file list npm would put in the tarball and checks that each file named by main / module / bin /
 * exports / types is in it.
 *
 * The list comes from `npm-packlist` (the library `npm pack` uses) rather than `npm pack --dry-run`:
 * npm 10 runs each workspace's `prepare` script during `pack` even with --ignore-scripts, which rebuilt
 * packages mid-check and failed CI.
 *
 * Run it after `npm run build` and `npm run build:types`.
 */
const fs = require('fs');
const path = require('path');
const packlist = require('npm-packlist');

const root = path.resolve(__dirname, '..');
const changesetConfig = JSON.parse(fs.readFileSync(path.join(root, '.changeset', 'config.json'), 'utf8'));
const ignored = new Set(changesetConfig.ignore || []);

function workspaceDirs() {
  const dirs = [];
  for (const base of [path.join(root, 'packages'), path.join(root, 'packages', 'plugins')]) {
    if (!fs.existsSync(base)) continue;
    for (const name of fs.readdirSync(base)) {
      const dir = path.join(base, name);
      if (fs.existsSync(path.join(dir, 'package.json'))) dirs.push(dir);
    }
  }
  return dirs;
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

async function main() {
  const problems = [];
  let checked = 0;

  for (const dir of workspaceDirs()) {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    if (pkg.private || ignored.has(pkg.name)) continue;
    checked += 1;
    // A bare tree is enough: packlist only needs the directory and its package.json.
    const files = new Set(await packlist({ path: dir, package: pkg, edgesOut: new Map(), isProjectRoot: false }));
    const { runtime, types } = entryPoints(pkg);
    const missing = [...new Set(runtime.filter((p) => !files.has(p)))];
    if (missing.length) problems.push({ name: `${pkg.name}@${pkg.version}`, missing, kind: 'runtime' });
    const missingTypes = [...new Set(types.filter((p) => !files.has(p)))];
    if (missingTypes.length) problems.push({ name: `${pkg.name}@${pkg.version}`, missing: missingTypes, kind: 'typings' });
  }

  if (problems.length) {
    console.error(`\n${problems.length} of ${checked} publishable packages would be published without files their package.json points at:\n`);
    for (const p of problems) console.error(`  ${p.name}\n      missing: ${p.missing.join(', ')}`);
    console.error('\nBuild every workspace first (npm run build), then generate plugin typings (npm run build:types), or fix the package "files" list.\n');
    process.exit(1);
  }
  console.log(`✓ ${checked} publishable packages contain every runtime entry point and typings file their package.json names.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
