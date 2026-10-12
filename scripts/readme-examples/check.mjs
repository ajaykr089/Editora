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

  // `example` replaces the example file with a made-up one (used to run a stylesheet inside a page).
  async function run(name, check, example = byName[name]) {
    const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
    const problems = [];
    page.on('pageerror', (error) => problems.push(error.message));
    const logs = [];
    page.on('console', (message) => {
      logs.push(message.text());
      if (message.type() === 'error') problems.push(message.text());
    });
    try {
      await openExample(page, example);
      const result = await check(page, { logs });
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

  const checkFiles = fs.readdirSync(path.join(path.dirname(fileURLOf(import.meta.url)), 'checks')).filter((file) => file.endsWith('.mjs')).sort();
  for (const file of checkFiles) {
    const { default: register } = await import(`./checks/${file}`);
    await register({ run, commands, selectAll, page: undefined });
  }

  const checkSources = checkFiles.map((file) => fs.readFileSync(path.join(path.dirname(fileURLOf(import.meta.url)), 'checks', file), 'utf8')).join('\n');
  const unchecked = examples.filter((example) => example.kind !== 'css' && !checkSources.includes(`'${example.name}'`));
  for (const example of unchecked) fail(`${example.name} has no run check in scripts/readme-examples/checks`);

  await browser.close();
}

function fileURLOf(url) {
  return new URL(url).pathname;
}

console.log(failures ? `\n${failures} problem(s)` : '\nAll README examples check out.');
process.exit(failures ? 1 : 0);
