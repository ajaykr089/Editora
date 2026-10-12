import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * The built `@editora/ui-react/server` entry, checked the way a server loads it. vitest itself runs
 * in jsdom, which hides exactly the failures that matter (no HTMLElement, no hooks), so the loading
 * checks run in plain Node child processes. They need `npm run build` first and are skipped without.
 */
const dist = resolve(dirname(fileURLToPath(import.meta.url)), '../../dist');
const esmEntry = resolve(dist, 'server.esm.js');
const cjsEntry = resolve(dist, 'server.cjs.js');
const built = existsSync(esmEntry) && existsSync(cjsEntry);

const IMPORT_RE = /(?:\bfrom|\bimport)\s*(['"])([^'"]+)\1|\bimport\(\s*(['"])([^'"]+)\3\s*\)/g;
const REACT_NAMED_IMPORT_RE = /\bimport\s+(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s*from\s*['"]react['"]/g;

function collectDistGraph(entry: string) {
  const files = new Map<string, string>();
  const packages = new Set<string>();
  const queue = [entry];
  while (queue.length) {
    const file = queue.pop() as string;
    if (files.has(file)) continue;
    const source = readFileSync(file, 'utf8');
    files.set(file, source);
    for (const match of source.matchAll(IMPORT_RE)) {
      const specifier = match[2] ?? match[4];
      if (specifier.startsWith('.')) queue.push(resolve(dirname(file), specifier));
      else packages.add(specifier);
    }
  }
  return { files, packages };
}

function runNodeModule(args: string[], script: string): string {
  return execFileSync(process.execPath, [...args, '--input-type=module', '--no-warnings', '-e', script], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

// React 18's `react-server` build throws when it is required; React 19 ships the real one.
const reactServerBuild =
  built &&
  spawnSync(process.execPath, ['--conditions=react-server', '--no-warnings', '-e', "require('react').createElement"], {
    stdio: 'ignore',
  }).status === 0;

describe.skipIf(!built)('built server entry', () => {
  it('only reaches react, with no hook and no use-client module', () => {
    const { files, packages } = collectDistGraph(esmEntry);
    const names = [...files.keys()].map((file) => relative(dist, file));

    expect([...packages].filter((specifier) => specifier !== 'react' && !specifier.startsWith('react/jsx'))).toEqual([]);

    const hooks: string[] = [];
    for (const [file, source] of files) {
      for (const match of source.matchAll(REACT_NAMED_IMPORT_RE)) {
        for (const part of match[1].split(',')) {
          const name = part.trim().split(/\s+as\s+/)[0];
          if (/^use[A-Z]/.test(name)) hooks.push(`${relative(dist, file)}: ${name}`);
        }
      }
    }
    expect(hooks).toEqual([]);

    const marked = [...files].filter(([, source]) => /^\s*(['"])use client\1/.test(source)).map(([file]) => relative(dist, file));
    expect(marked).toEqual([]);

    // Guards the guards: the walk really did leave server.esm.js.
    expect(names.length).toBeGreaterThan(5);
  });

  it('renders without any DOM globals (esm)', () => {
    const out = runNodeModule(
      [],
      `const { createElement } = await import('react');
       const { renderToStaticMarkup } = await import('react-dom/server');
       const m = await import(${JSON.stringify(pathToFileURL(esmEntry).href)});
       if (typeof HTMLElement !== 'undefined' || typeof document !== 'undefined') throw new Error('test needs a DOM-free process');
       console.log(renderToStaticMarkup(createElement(m.Box, { p: 2, className: 'x' }, createElement(m.Flex, { gap: 4 }, 'hi'))));`
    );
    expect(out).toContain('<ui-box');
    expect(out).toContain('class="x"');
    expect(out).toContain('<ui-flex');
  });

  it('renders without any DOM globals (cjs)', () => {
    const out = execFileSync(
      process.execPath,
      [
        '--no-warnings',
        '-e',
        `const { createElement } = require('react');
         const { renderToStaticMarkup } = require('react-dom/server');
         const m = require(${JSON.stringify(cjsEntry)});
         if (typeof HTMLElement !== 'undefined') throw new Error('test needs a DOM-free process');
         console.log(renderToStaticMarkup(createElement(m.Container, null, createElement(m.Separator))));`,
      ],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );
    expect(out).toContain('<ui-container');
    expect(out).toContain('<ui-separator');
  });

  it.skipIf(!reactServerBuild)('loads against the react-server build of React (no hooks exist there)', () => {
    const out = runNodeModule(
      ['--conditions=react-server'],
      `const m = await import(${JSON.stringify(pathToFileURL(esmEntry).href)});
       console.log(Object.keys(m).sort().join(','));`
    );
    expect(out).toContain('Box');
    expect(out).toContain('VisuallyHidden');
  });
});
