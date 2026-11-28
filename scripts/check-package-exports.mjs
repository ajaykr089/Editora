#!/usr/bin/env node
// Every published package with an "exports" map must export "./package.json": without it,
// require('<pkg>/package.json') fails (tools read versions and metadata that way), and a "./*"
// pattern can even map it to a file that does not exist.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const manifests = [];
for (const dir of ['packages', 'packages/plugins']) {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name, 'package.json');
    if (existsSync(file)) manifests.push(file);
  }
}
const missing = [];
for (const file of manifests) {
  const pkg = JSON.parse(readFileSync(file, 'utf8'));
  if (pkg.private || !pkg.exports || typeof pkg.exports !== 'object') continue;
  if (pkg.exports['./package.json'] !== './package.json') missing.push(`${pkg.name} (${file})`);
}
if (missing.length) {
  console.error(`These packages do not export "./package.json":\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log(`All ${manifests.length} package manifests export ./package.json (or have no exports map).`);
