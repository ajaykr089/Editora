/**
 * Shared by the pre-publish check (verify-package-contents.js) and the post-publish check
 * (verify-published-packages.js), so the two cannot disagree about what a package must contain.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
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

/** Workspaces `changeset publish` would publish: not private, not on the changeset ignore list. */
function publishableWorkspaces() {
  const out = [];
  for (const dir of workspaceDirs()) {
    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    if (pkg.private || ignored.has(pkg.name)) continue;
    out.push({ dir, pkg });
  }
  return out;
}

/**
 * Files a package.json promises. Runtime entry points break an install outright when absent; typings
 * only degrade it. Paths are returned the way they appear in a tarball (no leading "./").
 */
function entryPoints(pkg) {
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

module.exports = { root, ignored, workspaceDirs, publishableWorkspaces, entryPoints };
