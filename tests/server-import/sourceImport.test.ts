import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { repoRoot, sourceEntries } from './entries';

// `@editora/react` is rendered by Next.js (and any other SSR framework) on the server even from a
// 'use client' file, and `@editora/plugins` / `@editora/core` are imported next to it. Each of those
// modules must load where there is no `window`, `document` or `HTMLElement`.
describe('importing the sources without a DOM', () => {
  it('runs in an environment that really has no DOM', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
    expect(typeof HTMLElement).toBe('undefined');
    expect(typeof customElements).toBe('undefined');
  });

  it('covers the plugin entries', () => {
    expect(sourceEntries.length).toBeGreaterThan(60);
    expect(sourceEntries.map((e) => e.name)).toEqual(
      expect.arrayContaining(['@editora/plugins/bold', '@editora/plugins/text-color', '@editora/react']),
    );
  });

  it.each(sourceEntries.map((e) => [e.name, e.file]))('%s (%s)', async (_name, file) => {
    const mod = await import(/* @vite-ignore */ path.join(repoRoot, file));
    expect(Object.keys(mod).length).toBeGreaterThan(0);
  });
});
