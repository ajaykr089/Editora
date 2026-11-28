#!/usr/bin/env node
/**
 * Writes the programmatic entry points named by package.json "main" / "exports".
 *
 * dist/ is gitignored and the CLI has no bundler step, so without this a fresh checkout (CI)
 * packs a package whose main/exports point at files that do not exist. `npx editora` runs
 * bin/editora.js and never noticed; `require('@editora/cli')` could not have worked.
 */
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist');
fs.mkdirSync(dist, { recursive: true });

const cjs = "// CommonJS programmatic entrypoint \u2014 re-export the CLI helpers\nconst cli = require('../bin/editora.js');\nmodule.exports = cli;\n";

// The ES module names every export of the CommonJS one, so a helper added to bin/editora.js is exported by both.
const names = Object.keys(require('../bin/editora.js'));
const mjs = [
  "// ESM programmatic entrypoint \u2014 load the existing CommonJS implementation",
  "import { createRequire } from 'module';",
  "const require = createRequire(import.meta.url);",
  "const cli = require('../bin/editora.js');",
  "",
  ...names.map((name) => `export const ${name} = cli.${name};`),
  "",
  "export default cli;",
  ""
].join("\n");

fs.writeFileSync(path.join(dist, 'index.cjs'), cjs);
fs.writeFileSync(path.join(dist, 'index.mjs'), mjs);
console.log('editora cli: wrote dist/index.cjs and dist/index.mjs');

// The index `editora add --copy` downloads from (lib/copy-index.js): the import graph and hashes of the ui-core and
// ui-react sources at this commit. Published builds run in CI on a pushed commit, which the files are fetched from.
const { execFileSync } = require('child_process');
const { buildIndex } = require('../lib/copy-index');
let commit = process.env.EDITORA_COPY_COMMIT || null;
if (!commit) {
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: __dirname, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    commit = null;
  }
}
// Sources that differ from the commit would fail their hash check when downloaded: record no commit then.
if (commit && !process.env.EDITORA_COPY_COMMIT) {
  try {
    const dirty = execFileSync('git', ['status', '--porcelain', '--', '../ui-core/src', '../ui-react/src', '../ui-react/blocks'], { cwd: path.join(__dirname, '..'), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (dirty) {
      console.warn('editora cli: ui-core/ui-react sources have uncommitted changes; the copy index records no commit (use --source).');
      commit = null;
    }
  } catch {
    commit = null;
  }
}
const packagesDir = path.join(__dirname, '..', '..');
if (fs.existsSync(path.join(packagesDir, 'ui-core', 'src'))) {
  const index = buildIndex(packagesDir, { commit });
  fs.writeFileSync(path.join(dist, 'copy-index.json'), JSON.stringify(index));
  console.log(`editora cli: wrote dist/copy-index.json (${Object.keys(index.files).length} files, commit ${commit || 'none'})`);
}
