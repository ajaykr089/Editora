// Regenerates the README pictures in docs/images from the demo (Chromium, 2x).
//
//   node packages/agent/demo/server.mjs &              # http://localhost:5199
//   PLAYWRIGHT_PATH=<path to playwright> node packages/agent/demo/screenshots.mjs
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? fileURLToPath(new URL('../../../e2e-local/node_modules/playwright', import.meta.url)));
const base = process.env.DEMO_URL ?? 'http://localhost:5199';
const out = fileURLToPath(new URL('../docs/images/', import.meta.url));
await mkdir(out, { recursive: true });

const browser = await chromium.launch();
const hideChrome = 'main > h1, p.lead { display: none !important; } body { padding: 24px !important; }';

async function runDemo(page, query = '') {
  await page.goto(`${base}/?authorship=0${query}`);
  await page.addStyleTag({ content: hideChrome });
  await page.waitForSelector('.editora-content');
  await page.click('.editora-content h1');
  await page.keyboard.press('ControlOrMeta+Shift+K');
  await page.waitForSelector('.eag-panel');
  await page.selectOption('.eag-panel select', 'demo');
  await page.focus('.eag-panel textarea');
  await page.keyboard.type('Make the headings sentence case, fix the tense and add a one-line summary.');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.air-bar[data-state="review"]', { timeout: 15000 });
  await page.waitForTimeout(150);
}

const union = async (page, selectors, pad = 16) => {
  const boxes = (await Promise.all(selectors.map((s) => page.locator(s).first().boundingBox()))).filter(Boolean);
  const x = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
  const y = Math.max(0, Math.min(...boxes.map((b) => b.y)) - pad);
  return { x, y, width: Math.max(...boxes.map((b) => b.x + b.width)) + pad - x, height: Math.max(...boxes.map((b) => b.y + b.height)) + pad - y };
};

for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1240, height: 880 }, deviceScaleFactor: 2, colorScheme: theme });
  await runDemo(page, theme === 'dark' ? '&theme=dark' : '');
  await page.screenshot({ path: `${out}${theme === 'dark' ? 'dark' : 'agent-review'}.png`, clip: await union(page, ['editora-editor', '.eag-panel']) });
  await page.close();
}

const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await runDemo(phone);
await phone.screenshot({ path: `${out}phone.png`, clip: await union(phone, ['editora-editor'], 12) });
await phone.close();

await browser.close();
console.log(`Wrote README pictures to ${out}`);
