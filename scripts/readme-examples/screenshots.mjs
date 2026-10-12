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
import { runCommand } from './cli-check.mjs';
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

  // ---- @editora/ui-core
  { out: 'packages/ui-core/docs/images/components.png', example: 'ui-core-gallery' },
  {
    out: 'packages/ui-core/docs/images/form.png',
    example: 'ui-core-form',
    async act(page) {
      // Submit the empty form: the required fields report their errors.
      await page.getByRole('button', { name: 'Save' }).click();
      await page.waitForTimeout(500);
    },
  },
  { out: 'packages/ui-core/docs/images/data-table.png', example: 'ui-core-data-table' },
  { out: 'packages/ui-core/docs/images/gantt.png', example: 'ui-core-gantt' },
  {
    out: 'packages/ui-core/docs/images/dialog.png',
    example: 'ui-core-dialogs',
    viewport: { width: 1008, height: 560 },
    page: true,
    async act(page) {
      await page.getByRole('button', { name: 'Delete record' }).click();
      await page.waitForTimeout(600);
    },
  },

  // ---- @editora/ui-react
  { out: 'packages/ui-react/docs/images/components.png', example: 'ui-react-gallery' },
  {
    out: 'packages/ui-react/docs/images/form.png',
    example: 'ui-react-form',
    async act(page) {
      await page.getByRole('button', { name: 'Validate' }).click();
      await page.waitForTimeout(500);
    },
  },
  { out: 'packages/ui-react/docs/images/data-table.png', example: 'ui-react-data-table' },
  { out: 'packages/ui-react/docs/images/pickers.png', example: 'ui-react-pickers' },
  { out: 'packages/ui-react/docs/images/gantt.png', example: 'ui-react-gantt' },
  {
    out: 'packages/ui-react/docs/images/dialog.png',
    example: 'ui-react-dialogs',
    viewport: { width: 1008, height: 560 },
    page: true,
    async act(page) {
      await page.getByRole('button', { name: 'Confirm' }).click();
      await page.waitForTimeout(600);
    },
  },

  // ---- @editora/ui-sortable
  { out: 'packages/ui-sortable/docs/images/board.png', example: 'sortable-board' },
  {
    out: 'packages/ui-sortable/docs/images/dragging.png',
    example: 'sortable-board',
    async act(page) {
      // Pick up an item and hold it over another list.
      const from = await page.getByText('Design review', { exact: true }).first().boundingBox();
      const to = await page.getByText('Release epic', { exact: true }).first().boundingBox();
      await page.mouse.move(from.x - 34, from.y + from.height / 2);
      await page.mouse.down();
      await page.mouse.move(from.x - 60, from.y - 20, { steps: 6 });
      await page.mouse.move(to.x + 160, to.y + 90, { steps: 12 });
      await page.waitForTimeout(500);
    },
  },
  { out: 'packages/ui-sortable/docs/images/quick-start.png', example: 'sortable-quick-start' },
  { out: 'packages/ui-sortable/docs/images/custom.png', example: 'sortable-custom' },
  { out: 'packages/ui-sortable/docs/images/flat.png', example: 'sortable-flat' },

  // ---- @editora/toast
  {
    out: 'packages/editora-toast/docs/images/levels.png',
    example: 'toast-quick-start',
    viewport: { width: 1008, height: 360 },
    page: true,
    clip: { x: 568, y: 160, width: 440, height: 200 },
    async act(page) {
      await page.waitForTimeout(500);
    },
  },
  {
    out: 'packages/editora-toast/docs/images/actions.png',
    example: 'toast-advanced',
    viewport: { width: 1008, height: 360 },
    page: true,
    clip: { x: 568, y: 160, width: 440, height: 200 },
    async act(page) {
      await page.waitForTimeout(500);
    },
  },
  {
    out: 'packages/editora-toast/docs/images/promise-loading.png',
    example: 'toast-promise',
    viewport: { width: 1008, height: 360 },
    page: true,
    clip: { x: 568, y: 220, width: 440, height: 140 },
  },
  {
    out: 'packages/editora-toast/docs/images/promise-success.png',
    example: 'toast-promise',
    viewport: { width: 1008, height: 360 },
    page: true,
    clip: { x: 568, y: 220, width: 440, height: 140 },
    async act(page) {
      await page.waitForTimeout(1400);
    },
  },
  {
    out: 'packages/editora-toast/docs/images/themes.png',
    example: 'toast-themes',
    viewport: { width: 1008, height: 700 },
    page: true,
    clip: { x: 568, y: 0, width: 440, height: 680 },
    async act(page) {
      await page.waitForTimeout(600);
    },
  },
  {
    out: 'packages/editora-toast/docs/images/positions.png',
    example: 'toast-positions',
    viewport: { width: 1400, height: 520 },
    page: true,
    async act(page) {
      await page.waitForTimeout(600);
    },
  },

  // ---- @editora/icons
  { out: 'packages/icons/docs/images/catalog.png', example: 'icons-catalog' },
  { out: 'packages/icons/docs/images/toolbar.png', example: 'icons-quick-start', clip: { x: 0, y: 0, width: 294, height: 84 } },
  { out: 'packages/icons/docs/images/options.png', example: 'icons-options' },
  { out: 'packages/icons/docs/images/custom.png', example: 'icons-custom', clip: { x: 0, y: 0, width: 192, height: 80 } },
  { out: 'packages/icons/docs/images/ui-icon.png', example: 'icons-ui-core', clip: { x: 0, y: 0, width: 316, height: 76 } },

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
    // `clip` is a rectangle of the viewport: toasts sit in a corner of an otherwise empty page.
    await (shot.clip ? page : target).screenshot({ path: file, caret: 'hide', animations: 'disabled', ...(shot.clip ? { clip: shot.clip } : {}) });
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

// ---- terminals: the real output of the commands, drawn as a terminal window (@editora/cli)
const terminals = [
  {
    out: 'packages/cli/docs/images/add.png',
    commands: ['npx @editora/cli add editor --dry-run', 'npx @editora/cli add button modal toast --dry-run'],
  },
  {
    out: 'packages/cli/docs/images/package-managers.png',
    commands: [
      'npx @editora/cli add button --package-manager npm --dry-run | grep Installing',
      'npx @editora/cli add button --package-manager pnpm --dry-run | grep Installing',
      'npx @editora/cli add button --package-manager yarn --dry-run | grep Installing',
      'npx @editora/cli add button --package-manager bun --dry-run | grep Installing',
      'npx @editora/cli add button --package-manager deno',
    ],
  },
];

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const terminalHtml = (blocks) => `<!doctype html><meta charset="utf-8"><body style="margin:0;padding:24px;background:transparent">
<div id="window" style="width:760px;border-radius:12px;overflow:hidden;background:#0d1117;box-shadow:0 0 0 1px #30363d;font:14px/1.6 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#c9d1d9">
  <div style="display:flex;gap:8px;align-items:center;padding:12px 16px;background:#161b22;border-bottom:1px solid #30363d">
    <span style="width:12px;height:12px;border-radius:50%;background:#ff5f56"></span><span style="width:12px;height:12px;border-radius:50%;background:#ffbd2e"></span><span style="width:12px;height:12px;border-radius:50%;background:#27c93f"></span>
    <span style="margin-left:12px;color:#8b949e;font-size:12px">my-app</span>
  </div>
  <div style="padding:16px 20px 20px">${blocks
    .map(({ command, output }) => `<div style="margin-bottom:14px"><div><span style="color:#7ee787">$</span> <span style="color:#f0f6fc">${escapeHtml(command)}</span></div><pre style="margin:0;font:inherit;white-space:pre-wrap">${escapeHtml(output)}</pre></div>`)
    .join('')}</div>
</div></body>`;

for (const terminal of terminals) {
  const name = path.basename(terminal.out, '.png');
  if (only.length && !only.includes(name)) continue;
  const context = await browser.newContext({ viewport: { width: 810, height: 800 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  try {
    const blocks = terminal.commands.map((command) => {
      const result = runCommand(command);
      return { command, output: result.stdout.replace(/\s+$/, '') };
    });
    await page.setContent(terminalHtml(blocks));
    const file = path.join(root, terminal.out);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    await page.locator('#window').screenshot({ path: file, omitBackground: true });
    console.log(`ok   ${terminal.out}  ${(fs.statSync(file).size / 1024).toFixed(0)} KB`);
  } catch (error) {
    failed++;
    console.log(`FAIL ${terminal.out}: ${error.message.split('\n')[0]}`);
  } finally {
    await context.close();
  }
}

await browser.close();
process.exit(failed ? 1 : 0);
