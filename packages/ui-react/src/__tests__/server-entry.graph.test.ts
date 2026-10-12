import { readFileSync, existsSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * `@editora/ui-react/server` is imported by React Server Components, which cannot load hooks, a
 * `'use client'` module or anything that touches `HTMLElement` when it is evaluated. A single
 * stray `import { useRef }` in a shared chunk is enough to break every server page, so this walks
 * the real import graph of src/server.ts and fails on anything a server module may not reach.
 */
const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const serverEntry = resolve(srcDir, 'server.ts');

const ALLOWED_PACKAGES = new Set(['react', 'react/jsx-runtime', 'react/jsx-dev-runtime']);
const IMPORT_RE = /(?:^|[\n;])\s*(?:import|export)\s*(?:type\s+)?(?:[^'"()]*?\sfrom\s*)?['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)/g;
const HOOK_NAME_RE = /\buse[A-Z]\w*/g;

function resolveRelative(from: string, specifier: string): string {
  const base = resolve(dirname(from), specifier);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, resolve(base, 'index.ts'), resolve(base, 'index.tsx')]) {
    if (existsSync(candidate) && /\.(ts|tsx)$/.test(candidate)) return candidate;
  }
  throw new Error(`Cannot resolve ${specifier} imported from ${relative(srcDir, from)}`);
}

function collectGraph(entry: string) {
  const files = new Map<string, string>();
  const packages: Array<{ specifier: string; from: string }> = [];
  const queue = [entry];

  while (queue.length) {
    const file = queue.pop() as string;
    if (files.has(file)) continue;
    const source = readFileSync(file, 'utf8');
    files.set(file, source);

    for (const match of source.matchAll(IMPORT_RE)) {
      const specifier = match[1] ?? match[2];
      if (specifier.startsWith('.')) queue.push(resolveRelative(file, specifier));
      else packages.push({ specifier, from: relative(srcDir, file) });
    }
  }

  return { files, packages };
}

describe('server entry import graph', () => {
  const { files, packages } = collectGraph(serverEntry);
  const names = [...files.keys()].map((file) => relative(srcDir, file));

  it('reaches the server components and nothing else', () => {
    expect(names).toContain('components/server/Box.tsx');
    expect(names).toContain('components/_createElement.ts');
    // Anything that pulls hooks or the custom-element catalog into the graph.
    expect(names.filter((name) => /(^|\/)(_internals|core-registration|hooks\/)/.test(name))).toEqual([]);
  });

  it('only imports react from outside the package', () => {
    const unexpected = packages.filter(({ specifier }) => !ALLOWED_PACKAGES.has(specifier));
    expect(unexpected).toEqual([]);
  });

  it('never imports a hook from react or calls one', () => {
    const offenders: string[] = [];
    for (const [file, source] of files) {
      const stripped = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      for (const [hook] of stripped.matchAll(HOOK_NAME_RE)) offenders.push(`${relative(srcDir, file)}: ${hook}`);
    }
    expect(offenders).toEqual([]);
  });

  it('has no use-client boundary inside the graph', () => {
    const marked = [...files]
      .filter(([, source]) => /^\s*(['"])use client\1/m.test(source))
      .map(([file]) => relative(srcDir, file));
    expect(marked).toEqual([]);
  });
});
