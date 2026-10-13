// Checks the README of @editora/cli against the real CLI (packages/cli). It needs no browser and no build step beyond the
// two-file dist that `npm run build -w @editora/cli` writes, which this script writes itself.
//
//   1. Every `$ command` in a ```text block is run, and the README shows exactly the output it printed.
//   2. Every `npx @editora/cli ...` and `editora ...` line in a ```bash block is accepted by the CLI.
//   3. The ```js example runs against the built package, and prints what the README shows after it.
//   4. The helpers the README lists are exported by both the CommonJS and the ES module build.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { readmes, root } from './shared.mjs';

const cliDir = path.join(root, 'packages/cli');
const bin = path.join(cliDir, 'bin/editora.js');
const clean = (text) => text.replace(/\r\n/g, '\n').split('\n').map((line) => line.trimEnd()).join('\n').trim();

// What the README calls the command, run as the local copy. The user agent is cleared, as it is when run by npx.
export function runCommand(command) {
  const local = command.replace(/^npx @editora\/cli\b/, `node "${bin}"`).replace(/^editora\b/, `node "${bin}"`);
  const env = { ...process.env };
  delete env.npm_config_user_agent;
  return spawnSync('/bin/sh', ['-c', `${local} 2>&1`], { encoding: 'utf8', env });
}

export function checkCli({ ok, fail }) {
  console.log('@editora/cli README');
  const readme = fs.readFileSync(readmes.cli, 'utf8').replace(/\r\n/g, '\n');
  const blocks = [...readme.matchAll(/```(\w+)\n([\s\S]*?)```/g)].map((match) => ({ lang: match[1], body: match[2] }));

  // 1. the output shown for each command
  let shown = 0;
  for (const { lang, body } of blocks.filter((block) => block.lang === 'text' && block.body.startsWith('$ '))) {
    for (const part of body.split(/^(?=\$ )/m)) {
      const [first, ...rest] = part.split('\n');
      const command = first.slice(2).trim();
      const result = runCommand(command);
      const real = clean(result.stdout);
      if (real === clean(rest.join('\n'))) {
        shown++;
        ok(`$ ${command}`);
      } else {
        fail(`$ ${command}: the README shows\n${clean(rest.join('\n'))}\n         but the CLI prints\n${real}`);
      }
    }
  }
  if (!shown) fail('the README shows no command output');

  // 2. every command line is accepted
  for (const { body } of blocks.filter((block) => block.lang === 'bash')) {
    for (const raw of body.split('\n')) {
      const line = raw.replace(/\s+#.*$/, '').trim();
      if (!/^(npx @editora\/cli|editora)\b/.test(line)) continue;
      const safe = /--(dry-run|help|version)\b/.test(line) ? line : `${line} --dry-run`;
      const result = runCommand(safe);
      if (result.status === 0) ok(line);
      else fail(`${line}: the CLI exits with ${result.status}\n${clean(result.stdout).split('\n')[0]}`);
    }
  }

  // 3. the example from code, and its output
  fs.mkdirSync(path.join(cliDir, 'dist'), { recursive: true });
  spawnSync(process.execPath, [path.join(cliDir, 'scripts/build.js')], { encoding: 'utf8' });
  const cjs = path.join(cliDir, 'dist/index.cjs');
  const mjs = path.join(cliDir, 'dist/index.mjs');
  const jsIndex = blocks.findIndex((block) => block.lang === 'js' && block.body.includes("@editora/cli"));
  if (jsIndex < 0) fail('the README has no JavaScript example');
  else {
    const example = blocks[jsIndex].body.replace("'@editora/cli'", JSON.stringify(cjs));
    const expected = blocks[jsIndex + 1]?.lang === 'text' ? blocks[jsIndex + 1].body : null;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'editora-cli-readme-'));
    const file = path.join(dir, 'example.cjs');
    fs.writeFileSync(file, example);
    const result = spawnSync(process.execPath, [file], { encoding: 'utf8' });
    fs.rmSync(dir, { recursive: true, force: true });
    if (expected === null) fail('the JavaScript example is not followed by its output');
    else if (result.status !== 0) fail(`the JavaScript example fails: ${result.stderr.split('\n')[0]}`);
    else if (clean(result.stdout) !== clean(expected)) fail(`the JavaScript example prints\n${clean(result.stdout)}\n         not\n${clean(expected)}`);
    else ok('the JavaScript example prints what the README shows');
  }

  // 4. the helpers the README lists
  const listed = ['run', 'resolveTarget', 'installCommand', 'parseArgs', 'detectPackageManager', 'getVersion', 'formatHelpText', 'uiReactComponents', 'specialRegistry'];
  return import(pathToFileURL(mjs).href).then(async (esm) => {
    const common = (await import('node:module')).createRequire(import.meta.url)(cjs);
    for (const name of listed) {
      if (!(name in common)) fail(`require('@editora/cli') does not export ${name}`);
      else if (!(name in esm)) fail(`import '@editora/cli' does not export ${name}`);
    }
    if (listed.every((name) => name in common && name in esm)) ok('both builds export the helpers the README lists');
    if (common.resolveTarget('no-such-component') !== null) fail('resolveTarget does not return null for an unknown name');
    else ok('resolveTarget returns null for an unknown name');
  });
}
