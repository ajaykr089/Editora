// @vitest-environment node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * `import { Button } from '@editora/ui-react'` used to cost about 600 KB gzipped: the root imported '@editora/ui-core'
 * (every element) and the package claimed side effects, so a bundler kept every wrapper. Now the root only re-exports,
 * `"sideEffects": false` lets a bundler drop what an app does not use, and each wrapper registers the elements it
 * renders. These checks keep it that way.
 */
const here = dirname(fileURLToPath(import.meta.url));
const pkg = resolve(here, '../..');
const src = join(pkg, 'src');
const components = join(src, 'components');
const coreSrc = resolve(pkg, '../ui-core/src');

const read = (file: string) => readFileSync(file, 'utf8');
const withoutComments = (code: string) => code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
// Runtime imports and re-exports (type-only ones are erased), side-effect imports included.
const runtimeSpecifiers = (code: string) =>
  [...code.matchAll(/^\s*(?:import|export)\s+(?!type\b)(?:[^'";]*?\sfrom\s+)?['"]([^'"]+)['"]/gm)].map((m) => m[1]);
const resolveSource = (from: string, spec: string) => {
  const base = resolve(dirname(from), spec);
  return [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts')].find((file) => existsSync(file)) ?? null;
};

// The elements a ui-core entry registers, following ui-core's own imports.
const coreMemo = new Map<string, Set<string>>();
function coreRegisters(file: string, seen = new Set<string>()): Set<string> {
  if (coreMemo.has(file)) return coreMemo.get(file)!;
  const tags = new Set<string>();
  if (seen.has(file)) return tags;
  seen.add(file);
  const code = withoutComments(read(file));
  for (const m of code.matchAll(/customElements\.define\(\s*['"](ui-[a-z0-9-]+)['"]/g)) tags.add(m[1]);
  for (const spec of runtimeSpecifiers(code)) {
    if (!spec.startsWith('.')) continue;
    const target = resolveSource(file, spec);
    if (target) for (const tag of coreRegisters(target, seen)) tags.add(tag);
  }
  coreMemo.set(file, tags);
  return tags;
}
const coreEntryFile = (entry: string) => (entry === 'sortable' ? join(coreSrc, 'sortable.ts') : join(coreSrc, 'standalone', `${entry}.ts`));

// What a ui-react module renders and registers, following its imports of other ui-react modules. A dynamic
// `import('@editora/ui-core/icon')` counts: Dropdown, Menu, Stat and MetricCard define ui-icon on demand.
type Info = { renders: Set<string>; registers: Set<string>; root: boolean };
const reactMemo = new Map<string, Info>();
function reactInfo(file: string): Info {
  if (reactMemo.has(file)) return reactMemo.get(file)!;
  const info: Info = { renders: new Set(), registers: new Set(), root: false };
  reactMemo.set(file, info);
  const code = withoutComments(read(file));
  for (const m of code.matchAll(/createUIElement\(\s*['"](ui-[a-z0-9-]+)['"]|<(ui-[a-z0-9-]+)[\s>/]/g)) info.renders.add(m[1] ?? m[2]);
  const dynamic = [...code.matchAll(/import\(\s*['"]@editora\/ui-core\/([a-z0-9-]+)['"]/g)].map((m) => m[1]);
  for (const spec of [...runtimeSpecifiers(code), ...dynamic.map((entry) => `@editora/ui-core/${entry}`)]) {
    if (spec === '@editora/ui-core') info.root = true;
    const entry = spec.match(/^@editora\/ui-core\/(.+)$/)?.[1];
    if (entry) {
      if (existsSync(coreEntryFile(entry))) for (const tag of coreRegisters(coreEntryFile(entry))) info.registers.add(tag);
      continue;
    }
    if (!spec.startsWith('.')) continue;
    const target = resolveSource(file, spec);
    if (!target || !target.startsWith(src)) continue;
    const sub = reactInfo(target);
    sub.renders.forEach((tag) => info.renders.add(tag));
    sub.registers.forEach((tag) => info.registers.add(tag));
    info.root ||= sub.root;
  }
  return info;
}

const wrappers = readdirSync(components).filter((file) => file.endsWith('.tsx') && !file.startsWith('_'));

describe('the package root stays tree-shakeable', () => {
  it('declares no side effects, so a bundler drops the components an app does not import', () => {
    expect(JSON.parse(read(join(pkg, 'package.json'))).sideEffects).toBe(false);
  });

  it('does not import the whole @editora/ui-core catalog from the root or the client entry', () => {
    for (const entry of ['index.tsx', 'client.tsx']) {
      expect(runtimeSpecifiers(withoutComments(read(join(src, entry)))), entry).not.toContain('@editora/ui-core');
    }
  });

  it('has every wrapper register each element it renders (nothing relies on another import registering it)', () => {
    expect(wrappers.length).toBeGreaterThan(100);
    const gaps = wrappers.flatMap((file) => {
      const info = reactInfo(join(components, file));
      return [...info.renders].filter((tag) => !info.registers.has(tag)).map((tag) => `${file}: ${tag}`);
    });
    expect(gaps).toEqual([]);
  });

  it('keeps a file that registers an element out of the pass-through form Rollup inlines into the root', () => {
    // `import '@editora/ui-core/x'; export * from './server/X'` has no code of its own, so Rollup resolves the root's
    // re-export straight to ./server/X and copies the bare import into index.esm.js: the root registered x for everyone.
    const offenders = wrappers.filter((file) => {
      const code = withoutComments(read(join(components, file)));
      const hasEffects = /^\s*import\s+['"]@editora\/ui-core\//m.test(code) || /^\s*(?:if|void)\b/m.test(code);
      return hasEffects && /^\s*export\s+(?:\*|\{[^}]*\})\s+from\s+['"]\.\/server\//m.test(code);
    });
    expect(offenders).toEqual([]);
  });
});

const dist = join(pkg, 'dist');
describe.skipIf(!existsSync(join(dist, 'index.esm.js')))('built root entry', () => {
  it('imports no package for its side effects, and neither @editora/toast nor ui-core/runtime directly', () => {
    for (const entry of ['index.esm.js', 'client.esm.js']) {
      const code = read(join(dist, entry));
      expect(code.match(/^import\s+["']@editora\/[^"']+["'];?$/gm) ?? [], entry).toEqual([]);
      const packages = [...code.matchAll(/^import\s[^;]*?from\s+["'](@editora\/[^"']+)["']/gm)].map((m) => m[1]);
      expect(packages, entry).toEqual([]);
    }
  });
});
