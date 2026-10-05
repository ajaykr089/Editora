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

const mjs = "// ESM programmatic entrypoint \u2014 load the existing CommonJS implementation\nimport { createRequire } from 'module';\nconst require = createRequire(import.meta.url);\nconst cli = require('../bin/editora.js');\n\nexport const run = cli.run;\nexport const parseArgs = cli.parseArgs;\nexport const resolveTarget = cli.resolveTarget;\nexport const detectPackageManager = cli.detectPackageManager;\nexport const installCommand = cli.installCommand;\nexport const getVersion = cli.getVersion;\nexport const formatHelpText = cli.formatHelpText;\nexport const uiReactComponents = cli.uiReactComponents;\nexport const specialRegistry = cli.specialRegistry;\n\nexport default cli;\n";

fs.writeFileSync(path.join(dist, 'index.cjs'), cjs);
fs.writeFileSync(path.join(dist, 'index.mjs'), mjs);
console.log('editora cli: wrote dist/index.cjs and dist/index.mjs');
