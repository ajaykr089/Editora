#!/usr/bin/env node
// Takes the screenshots used in the READMEs of @editora/core, @editora/react and @editora/plugins.
//
// Every picture is the real component running the code the README quotes (sandbox/readme/examples), so a picture
// cannot show something the code does not do. Run it again after a UI change to refresh them.
//
//   npm run build -w @editora/themes -w @editora/core -w @editora/plugins -w @editora/react
//   npm --prefix sandbox run dev -- --port 5190          # in another terminal
//   node scripts/readme-examples/screenshots.mjs [name ...]
//
// Playwright is not a dependency of the repo; it is found next to the local e2e harness, or in node_modules.
import fs from 'node:fs';
import path from 'node:path';
import { listExamples, loadPlaywright, openExample, root } from './shared.mjs';

const only = process.argv.slice(2);
const examples = Object.fromEntries(listExamples().map((example) => [example.name, example]));

const select = async (page, selector) => {
  await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }, selector);
  await page.waitForTimeout(200);
};

const shots = [
  // ---- @editora/core
  { out: 'packages/core/docs/images/web-component.png', example: 'core-full' },
  { out: 'packages/core/docs/images/quick-start.png', example: 'core-cdn' },
  { out: 'packages/core/docs/images/themes.png', example: 'core-config' },
  {
    out: 'packages/core/docs/images/api.png',
    example: 'core-api',
    async act(page) {
      await page.click('#replace');
      await page.waitForTimeout(300);
      await page.click('#read');
      await page.waitForTimeout(200);
    },
  },

  // ---- @editora/react
  { out: 'packages/react/docs/images/document-editor.png', example: 'react-document-editor' },
  { out: 'packages/react/docs/images/quick-start.png', example: 'react-quick-start' },
  { out: 'packages/react/docs/images/themes.png', example: 'react-themes' },
  {
    out: 'packages/react/docs/images/editor-api.png',
    example: 'react-editor-api',
    async act(page) {
      await select(page, '[contenteditable="true"]');
      await page.click('button:text-is("Bold")');
      await page.waitForTimeout(200);
      await page.click('button:text-is("Read HTML")');
      await page.waitForTimeout(200);
    },
  },

  // ---- @editora/plugins
  {
    out: 'packages/plugins/docs/images/table.png',
    example: 'plugins-entry-points',
    async act(page) {
      // Put the caret in the paragraph, so the table goes below it and the heading is not the active format.
      await page.evaluate(() => {
        const content = document.querySelector('[contenteditable="true"]');
        content.focus();
        const range = document.createRange();
        range.selectNodeContents(content.querySelector('p'));
        range.collapse(false);
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      });
      await page.waitForTimeout(200);
      await page.click('[data-command="insertTable"]');
      await page.waitForTimeout(500);
    },
  },
  {
    out: 'packages/plugins/docs/images/math.png',
    example: 'plugins-entry-points',
    viewport: { width: 1008, height: 800 },
    page: true,
    async act(page) {
      await page.click('[data-command="insertMath"]');
      await page.waitForTimeout(500);
    },
  },
  {
    out: 'packages/plugins/docs/images/merge-tags.png',
    example: 'plugins-options',
    viewport: { width: 1008, height: 640 },
    page: true,
    async act(page) {
      await page.click('[data-command="insertMergeTag"]');
      await page.waitForTimeout(500);
    },
  },
  {
    out: 'packages/plugins/docs/images/track-changes.png',
    example: 'plugins-options',
    async act(page) {
      await page.click('[data-command="toggleTrackChanges"]');
      await page.waitForTimeout(300);
      await page.evaluate(() => {
        const content = document.querySelector('[contenteditable="true"]');
        content.focus();
        const range = document.createRange();
        range.selectNodeContents(content.querySelector('p'));
        range.collapse(false);
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      });
      await page.keyboard.type(' This sentence was added in review.');
      await page.waitForTimeout(400);
    },
  },

  // ---- @editora/light-code-editor
  { out: 'packages/light-code-editor/docs/images/editor-dark.png', example: 'lce-quick-start' },
  { out: 'packages/light-code-editor/docs/images/editor-light.png', example: 'lce-react' },
  { out: 'packages/light-code-editor/docs/images/diagnostics.png', example: 'lce-language-service' },
  {
    out: 'packages/light-code-editor/docs/images/search.png',
    example: 'lce-quick-start',
    async act(page) {
      await page.click('[contenteditable]');
      await page.keyboard.press('ControlOrMeta+f');
      await page.waitForTimeout(300);
      await page.keyboard.type('user');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(400);
    },
  },
  {
    out: 'packages/light-code-editor/docs/images/completion.png',
    example: 'lce-language-service',
    async act(page) {
      await page.keyboard.press('Escape');
      await page.click('[contenteditable]');
      await page.keyboard.press('Control+End');
      await page.keyboard.type('di');
      await page.keyboard.press('ControlOrMeta+Space');
      await page.waitForTimeout(500);
    },
  },

  // ---- @editora/themes
  { out: 'packages/themes/docs/images/themes.png', example: 'themes-gallery' },
  {
    out: 'packages/themes/docs/images/custom-theme.png',
    example: 'themes-custom',
    async act(page) {
      await page.evaluate(() => {
        const strong = document.querySelector('[contenteditable] strong');
        strong.closest('[contenteditable]').focus();
        const range = document.createRange();
        range.selectNodeContents(strong);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
      });
      await page.waitForTimeout(400);
    },
  },
];

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
let failed = 0;

for (const shot of shots) {
  const name = path.basename(shot.out, '.png');
  if (only.length && !only.includes(name) && !only.includes(shot.example)) continue;

  const context = await browser.newContext({
    viewport: shot.viewport ?? { width: 1008, height: 700 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const problems = [];
  page.on('pageerror', (error) => problems.push(error.message));
  page.on('console', (message) => message.type() === 'error' && problems.push(message.text()));

  try {
    const example = examples[shot.example];
    if (!example) throw new Error(`no example called ${shot.example}`);
    await openExample(page, example);
    if (shot.act) await shot.act(page);

    const file = path.join(root, shot.out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    // Dialogs are overlays on the whole page; everything else is the example itself.
    const target = shot.page ? page : page.locator(example.kind === 'html' ? 'body' : '#shot');
    await target.screenshot({ path: file, caret: 'hide', animations: 'disabled' });
    console.log(`${problems.length ? 'WARN' : 'ok  '} ${shot.out}  ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
    if (problems.length) {
      failed++;
      console.log('     browser reported:', problems.slice(0, 3).join(' | '));
    }
  } catch (error) {
    failed++;
    console.log(`FAIL ${shot.out}: ${error.message.split('\n')[0]}`);
  } finally {
    await context.close();
  }
}

await browser.close();
process.exit(failed ? 1 : 0);
