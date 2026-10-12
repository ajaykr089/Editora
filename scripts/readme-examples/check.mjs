#!/usr/bin/env node
// Checks that the code in the READMEs of @editora/core, @editora/react and @editora/plugins is the code that is tested.
//
//   1. Every example in sandbox/readme/examples is quoted word for word in a README, and every README code block that
//      imports an @editora package or loads the CDN bundle is one of the examples (so nothing untested is shown).
//   2. The React examples type-check in strict mode against the packages' typings.
//   3. Every example runs in Chromium without errors, and does what the README says it does.
//
// It needs the built packages and the sandbox dev server (the React and bundler examples run in it):
//
//   npm run build -w @editora/themes -w @editora/core -w @editora/plugins -w @editora/react
//   npm --prefix sandbox run dev -- --port 5190        # in another terminal
//   npm run check:readme-examples
//
// Playwright is not a dependency of the repo; see shared.mjs. It is not part of CI, which does not build the sandbox.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { listExamples, loadPlaywright, openExample, readmes, root, sandboxUrl } from './shared.mjs';

const examples = listExamples();
let failures = 0;
const fail = (message) => {
  failures++;
  console.log(`  FAIL ${message}`);
};
const ok = (message) => console.log(`  ok   ${message}`);

// ---------------------------------------------------------------- 1. the READMEs quote the examples
console.log('READMEs and examples');
const normalise = (text) => text.replace(/\r\n/g, '\n').trim();
const readmeText = Object.fromEntries(Object.entries(readmes).map(([name, file]) => [name, normalise(fs.readFileSync(file, 'utf8'))]));
const allReadmes = Object.values(readmeText).join('\n\n');

for (const example of examples) {
  if (allReadmes.includes(normalise(example.source))) ok(`${example.file} is quoted in a README`);
  else fail(`${example.file} is not quoted in any README, word for word`);
}

const fence = /```(\w+)\n([\s\S]*?)```/g;
for (const [name, text] of Object.entries(readmeText)) {
  for (const [, lang, body] of text.matchAll(fence)) {
    const code = normalise(body);
    const importsEditora = /(^|\n)import (?:[^'"\n]* from )?['"]@editora\//.test(code);
    const loadsCdn = /cdn\.jsdelivr\.net\/npm\/@editora\/core/.test(code);
    const onlySideEffectImports = code.split('\n').every((line) => !line.trim() || /^import '[^']+';/.test(line.trim()));
    if (!['ts', 'tsx', 'html'].includes(lang) || !(importsEditora || loadsCdn) || onlySideEffectImports) continue;
    const isExample = examples.some((example) => normalise(example.source).includes(code));
    if (!isExample) fail(`${name} README has a ${lang} block that is not one of the examples:\n         ${code.split('\n')[0]}`);
  }
}

// ---------------------------------------------------------------- 2. type-check
console.log('Type-check (strict)');
const tsc = path.join(root, 'sandbox/node_modules/.bin/tsc');
const typecheck = spawnSync(tsc, ['-p', path.join(root, 'sandbox/readme')], { encoding: 'utf8' });
if (typecheck.status === 0) ok(`${examples.filter((e) => e.file.endsWith('x') || e.file.endsWith('.ts')).length} React examples compile`);
else fail(`tsc reported errors:\n${(typecheck.stdout || typecheck.stderr).split('\n').slice(0, 12).join('\n')}`);

// ---------------------------------------------------------------- 3. run them
console.log('Run in Chromium');
const sandboxUp = await fetch(sandboxUrl).then((r) => r.ok, () => false);
if (!sandboxUp) {
  fail(`the sandbox is not running at ${sandboxUrl} (npm --prefix sandbox run dev -- --port 5190)`);
} else {
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch();
  const byName = Object.fromEntries(examples.map((example) => [example.name, example]));

  async function run(name, check) {
    const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
    const problems = [];
    page.on('pageerror', (error) => problems.push(error.message));
    page.on('console', (message) => message.type() === 'error' && problems.push(message.text()));
    try {
      await openExample(page, byName[name]);
      const result = await check(page);
      if (problems.length) fail(`${name}: the browser reported: ${problems[0].split('\n')[0]}`);
      else if (result === true || result === undefined) ok(name);
      else fail(`${name}: ${result}`);
    } catch (error) {
      fail(`${name}: ${error.message.split('\n')[0]}`);
    } finally {
      await page.close();
    }
  }

  const commands = (page, scope = 'body') =>
    page.$$eval(`${scope} [data-command]`, (buttons) => buttons.map((button) => button.getAttribute('data-command')));
  const selectAll = (page, selector) =>
    page.evaluate((sel) => {
      const element = document.querySelector(sel);
      element.focus();
      const range = document.createRange();
      range.selectNodeContents(element);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    }, selector);

  await run('react-quick-start', async (page) => {
    const found = await commands(page);
    // `heading` resolves to the heading menu (setBlockType); it used to be dropped silently.
    const wanted = ['undo', 'redo', 'setBlockType', 'toggleBold', 'toggleItalic', 'toggleUnderline', 'openLinkDialog', 'toggleBulletList', 'toggleOrderedList'];
    const missing = wanted.filter((command) => !found.includes(command));
    return missing.length ? `toolbar is missing ${missing.join(', ')}` : true;
  });

  await run('react-document-editor', async (page) => {
    const hasTable = (await commands(page)).length > 5;
    const status = await page.locator('text=words').count();
    return hasTable && status ? true : 'expected a toolbar and a status bar';
  });

  await run('react-themes', async (page) => {
    const colours = await page.evaluate(() =>
      [...document.querySelectorAll('[data-theme]')].map((el) => getComputedStyle(el.querySelector('[contenteditable]')).color),
    );
    return colours.length === 2 && colours[0] !== colours[1] ? true : `the two themes give the text the same colour (${colours.join(' / ')})`;
  });

  await run('react-editor-api', async (page) => {
    await selectAll(page, '[contenteditable="true"]');
    await page.click('button:text-is("Bold")');
    await page.click('button:text-is("Read HTML")');
    const bold = await page.textContent('pre');
    if (!/<(b|strong)>/.test(bold ?? '')) return `Bold did not bold the text: ${bold}`;
    await page.click('button:text-is("Replace")');
    await page.click('button:text-is("Read HTML")');
    const replaced = await page.textContent('pre');
    return replaced === '<p>Replaced from outside.</p>' ? true : `setHTML/getHTML returned ${replaced}`;
  });

  await run('plugins-entry-points', async (page) => {
    const found = await commands(page);
    if (!found.includes('insertTable') || !found.includes('insertMath') || !found.includes('toggleTrackChanges')) return `toolbar has ${found.join(', ')}`;
    await page.click('[data-command="insertTable"]');
    await page.waitForTimeout(300);
    return (await page.locator('[contenteditable] table').count()) === 1 ? true : 'Insert Table did not insert a table';
  });

  await run('plugins-options', async (page) => {
    await page.click('[data-command="toggleTrackChanges"]');
    await page.evaluate(() => {
      const content = document.querySelector('[contenteditable="true"]');
      content.focus();
      const range = document.createRange();
      range.selectNodeContents(content.querySelector('p'));
      range.collapse(false);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
    });
    await page.keyboard.type(' added');
    await page.waitForTimeout(300);
    const author = await page.getAttribute('[data-track-change="insert"]', 'data-track-author');
    if (author !== 'Ava Miller') return `the tracked change is attributed to ${author}`;
    await page.click('[data-command="insertMergeTag"]');
    await page.waitForTimeout(400);
    const dialog = await page.textContent('body');
    return /First name/.test(dialog ?? '') && /Account/.test(dialog ?? '') ? true : 'the merge tag dialog does not list the configured tags';
  });

  await run('plugins-lazy', async (page) => {
    await page.waitForTimeout(800);
    const found = await commands(page);
    return found.includes('toggleSpellCheck') ? true : `the lazily loaded plugin did not arrive (toolbar: ${found.join(', ')})`;
  });

  await run('core-bundler', async (page) => {
    // This one is a plain module: the demo page adds the element, as the README's HTML does.
    return page.evaluate(() => !!customElements.get('editora-editor')) ? true : 'the element is not registered';
  });

  await run('core-cdn', async (page) => {
    const found = await commands(page);
    return found.includes('toggleBold') && found.includes('openLinkDialog') ? true : `toolbar has ${found.join(', ')}`;
  });

  await run('core-full', async (page) => {
    const found = await commands(page);
    const wanted = ['toggleBold', 'toggleBulletList', 'openTextColorPicker', 'openBackgroundColorPicker', 'toggleBlockquote', 'insertTable'];
    const missing = wanted.filter((command) => !found.includes(command));
    return missing.length ? `toolbar is missing ${missing.join(', ')}` : true;
  });

  await run('core-minimal', async (page) => {
    const found = await commands(page);
    return found.includes('toggleBold') && found.includes('toggleBulletList') ? true : `toolbar has ${found.join(', ')}`;
  });

  await run('core-config', async (page) => {
    const editors = await page.$$eval('editora-editor', (els) =>
      els.map((el) => ({
        dark: el.classList.contains('editora-theme-dark'),
        buttons: el.querySelectorAll('[data-command]').length,
        editable: el.querySelector('.editora-content')?.getAttribute('contenteditable'),
      })),
    );
    if (!editors[0]?.dark) return 'theme="dark" did not give the first editor the dark theme';
    if (editors[0].buttons !== 8) return `the short toolbar has ${editors[0].buttons} buttons, expected 8`;
    if (editors[1]?.editable !== 'false' || editors[1]?.buttons !== 0) return 'the read-only editor is editable or shows a toolbar';
    return true;
  });

  await run('core-api', async (page) => {
    const text = (selector) => page.textContent(selector);
    await page.click('#read');
    if (!/Edit me/.test((await text('#out')) ?? '')) return 'getContent() did not return the content';
    await page.click('#replace');
    await page.click('#read');
    if ((await text('#out')) !== '<h2>Replaced</h2><p>From outside.</p>') return `setContent() then getContent() gave ${await text('#out')}`;
    await page.evaluate(() => document.getElementById('editor').setContent('<p>x</p>'));
    await selectAll(page, '#editor .editora-content');
    await page.click('#bold');
    await page.click('#read');
    if (!/<(b|strong)|font-weight/.test((await text('#out')) ?? '')) return `execCommand('toggleBold') changed nothing: ${await text('#out')}`;
    await page.click('#editor .editora-content');
    await page.keyboard.type('!');
    await page.waitForTimeout(400);
    return /!/.test((await text('#out')) ?? '') ? true : 'content-change did not report the typed text';
  });

  await run('plugins-web-component', async (page) => {
    const found = await commands(page);
    const wanted = ['undo', 'redo', 'toggleBold', 'insertTable', 'insertMergeTag'];
    const missing = wanted.filter((command) => !found.includes(command));
    return missing.length ? `toolbar is missing ${missing.join(', ')}` : true;
  });

  const unchecked = examples.filter((example) => !fs.readFileSync(fileURLOf(import.meta.url), 'utf8').includes(`'${example.name}'`));
  for (const example of unchecked) fail(`${example.name} has no run check in check.mjs`);

  await browser.close();
}

function fileURLOf(url) {
  return new URL(url).pathname;
}

console.log(failures ? `\n${failures} problem(s)` : '\nAll README examples check out.');
process.exit(failures ? 1 : 0);
