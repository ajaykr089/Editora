// Regenerates the README pictures in docs/images from the demo (Chromium, 2x).
//
//   node packages/authorship/demo/server.mjs &        # http://localhost:5197
//   node packages/authorship/demo/screenshots.mjs      # needs Playwright (e2e-local or PLAYWRIGHT_PATH)
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH ?? fileURLToPath(new URL('../../../e2e-local/node_modules/playwright', import.meta.url)));
const base = process.env.DEMO_URL ?? 'http://localhost:5197';
const out = fileURLToPath(new URL('../docs/images/', import.meta.url));
await mkdir(out, { recursive: true });

const browser = await chromium.launch();

async function writeEssay(page) {
  // Only the editor on screen.
  await page.addStyleTag({ content: 'main > h1, p.lead, p:has(#cleaner), .tools, #out { display: none !important; } main { max-width: 760px !important; margin: 0 !important; } body { padding: 24px !important; }' });
  await page.waitForFunction(() => window.authorship?.recording);
  const content = page.locator('.editora-content');
  const caretToEnd = () =>
    page.evaluate(() => {
      const root = document.querySelector('.editora-content');
      root.focus();
      const range = document.createRange();
      range.selectNodeContents(root.lastElementChild ?? root);
      range.collapse(false);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    });
  const addParagraph = (html, provenance) =>
    page.evaluate(
      ([html, provenance]) => {
        const root = document.querySelector('.editora-content');
        if (provenance) root.dispatchEvent(new CustomEvent('provenance:expect', { detail: provenance, bubbles: true }));
        const p = document.createElement('p');
        p.innerHTML = html;
        root.append(p);
      },
      [html, provenance],
    );

  await content.click();
  await caretToEnd();
  // A new paragraph under the heading.
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Over the last ten years the river has burst its banks four times, more than in the forty years before. I measured the channel at three points in March and again in September.', { delay: 20 });
  await page.keyboard.press('Enter');
  // A paste from Google Docs, as the browser delivers it.
  await page.evaluate(() => {
    const html = '<meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-4f1c2a"><p dir="ltr"><span>Regional records show winter rainfall rising by a third over the decade, with most of the increase in short, heavy storms.</span></p></b>';
    const data = new DataTransfer();
    data.setData('text/html', html);
    data.setData('text/plain', html.replace(/<[^>]+>/g, ''));
    const root = document.querySelector('.editora-content');
    const event = new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true });
    root.dispatchEvent(event);
    if (!event.defaultPrevented) document.execCommand('insertHTML', false, html.replace(/<meta[^>]*>/g, ''));
  });
  // AI text, marked the way @editora/ai-review marks an accepted suggestion.
  await addParagraph('<ins data-provenance="ai" data-provenance-model="gemma4" data-provenance-provider="Ollama">Taken together, the measurements suggest the channel is narrowing just as storms are becoming more intense.</ins>');
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    const ins = document.querySelector('.editora-content ins[data-provenance]');
    ins.replaceWith(...ins.childNodes);
  });
  await addParagraph('I added the gauge readings from the two upstream stations to the appendix.', { kind: 'collaborator', author: 'Bo' });
  await caretToEnd();
  await page.keyboard.press('Enter');
  await page.keyboard.type('Next, I will compare these figures with the council’s flood maps.', { delay: 20 });
  await page.evaluate(() => window.authorship.sync());
}

async function openPanel(page) {
  await page.click('[data-command="toggleAuthorship"]');
  await page.waitForSelector('.eda-panel');
  // Park the cursor in the AI sentence so "At the cursor" has something to say.
  await page.evaluate(() => {
    const root = document.querySelector('.editora-content');
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) if (node.data.includes('Taken together')) break;
    const range = document.createRange();
    range.setStart(node, 12);
    range.collapse(true);
    getSelection().removeAllRanges();
    getSelection().addRange(range);
  });
  await page.waitForTimeout(150);
}

const union = async (page, selectors, pad = 16) => {
  const boxes = (await Promise.all(selectors.map((s) => page.locator(s).first().boundingBox()))).filter(Boolean);
  const x = Math.max(0, Math.min(...boxes.map((b) => b.x)) - pad);
  const y = Math.max(0, Math.min(...boxes.map((b) => b.y)) - pad);
  return { x, y, width: Math.max(...boxes.map((b) => b.x + b.width)) + pad - x, height: Math.max(...boxes.map((b) => b.y + b.height)) + pad - y };
};

for (const theme of ['light', 'dark']) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 2, colorScheme: theme });
  await page.goto(`${base}/?essay=1${theme === 'dark' ? '&theme=dark' : ''}`);
  await writeEssay(page);
  await openPanel(page);
  await page.screenshot({ path: `${out}${theme === 'dark' ? 'dark' : 'highlights-panel'}.png`, clip: await union(page, ['editora-editor', '.eda-panel']) });

  if (theme === 'light') {
    // Tooltip over the AI sentence (panel closed, highlights on).
    await page.click('.eda-panel >> text=Close');
    await page.evaluate(() => window.execEditorCommand('toggleAuthorshipHighlights'));
    const point = await page.evaluate(() => {
      const root = document.querySelector('.editora-content');
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) if (node.data.includes('Taken together')) break;
      const range = document.createRange();
      range.setStart(node, 30);
      range.setEnd(node, 31);
      const rect = range.getBoundingClientRect();
      return { x: rect.x + 2, y: rect.y + rect.height / 2 };
    });
    await page.mouse.move(point.x + 40, point.y + 40);
    await page.mouse.move(point.x, point.y, { steps: 4 });
    try {
      await page.waitForSelector('.eda-tooltip:not([hidden])', { timeout: 3000 });
    } catch (error) {
      console.log('tooltip debug', point, await page.evaluate(() => ({ highlights: [...(CSS.highlights?.keys() ?? [])], active: document.activeElement?.className, panel: !!document.querySelector('.eda-panel') })));
      throw error;
    }
    await page.screenshot({ path: `${out}tooltip.png`, clip: await union(page, ['.editora-content', '.eda-tooltip'], 12) });
    await page.evaluate(() => window.execEditorCommand('toggleAuthorshipHighlights'));

    // Replay, paused a little past half way.
    await page.evaluate(() => window.execEditorCommand('openAuthorshipReplay'));
    await page.waitForSelector('.eda-replay');
    await page.click('.eda-replay-controls .eda-btn');
    await page.evaluate(() => {
      const slider = document.querySelector('.eda-replay input[type=range]');
      slider.value = '965';
      slider.dispatchEvent(new Event('input'));
    });
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${out}replay.png`, clip: await union(page, ['.eda-replay'], 0) });
  }
  await page.close();
}

await browser.close();
console.log(`Wrote README pictures to ${out}`);
