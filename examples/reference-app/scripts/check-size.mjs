// What a visitor downloads before the first screen: the entry script, the chunks it preloads and
// the CSS, gzipped, from the production build (run `npm run build` first). Lazy chunks (the date
// range picker, the full icon set, react-dom/server) are listed but not counted: the app must not
// load them up front (tests/flows.spec.ts checks the last two are never requested at all).
// Raise BUDGET deliberately, with the reason in the commit.
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BUDGET_KB = 310;

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const initial = new Set([...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/g)].map((match) => match[1]));
const kb = (bytes) => bytes / 1024;
const gz = (file) => gzipSync(readFileSync(join(dist, file))).length;

let total = 0;
for (const file of initial) total += gz(file);
const lazy = readdirSync(join(dist, 'assets')).filter((file) => /\.js$/.test(file) && !initial.has(`assets/${file}`));

console.log(`Initial download: ${kb(total).toFixed(1)} KB gzipped (budget ${BUDGET_KB} KB)`);
for (const file of initial) console.log(`  ${file}  ${kb(gz(file)).toFixed(1)} KB`);
for (const file of lazy) console.log(`  lazy: assets/${file}  ${kb(gz(`assets/${file}`)).toFixed(1)} KB`);
if (kb(total) > BUDGET_KB) {
  console.error(`Over budget by ${(kb(total) - BUDGET_KB).toFixed(1)} KB.`);
  process.exit(1);
}
