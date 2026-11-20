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
