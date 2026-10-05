import { describe, it, expect } from '@jest/globals';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as performance from '../src/index';

describe('@editora/performance public exports', () => {
  it('exports at runtime everything index.d.ts declares', () => {
    // The typings are hand-written; they once promised LazyLoader, debounce, getGlobalMemoryManager and
    // getGlobalPerformanceMonitor, none of which the build exported, so TS users got `undefined`.
    const dts = readFileSync(join(__dirname, '..', 'index.d.ts'), 'utf8');
    const declared = [...dts.matchAll(/export\s+(?:declare\s+)?(?:abstract\s+)?(?:class|function|const|let|var|enum)\s+([A-Za-z0-9_$]+)/g)].map((m) => m[1]);
    expect(declared.length).toBeGreaterThan(10);
    const runtime = new Set(Object.keys(performance));
    expect(declared.filter((name) => !runtime.has(name))).toEqual([]);
  });

  it('exports LazyLoader and the shared lazyLoader that index.d.ts declares', () => {
    expect(typeof performance.LazyLoader).toBe('function');
    expect(performance.lazyLoader).toBeInstanceOf(performance.LazyLoader);
  });

  it('LazyLoader caches a module per id until unloaded or cleared', async () => {
    const loader = new performance.LazyLoader();
    let calls = 0;
    const load = async () => ({ n: ++calls });

    const first = await loader.load('a', load);
    const again = await loader.load('a', load);
    expect(again).toBe(first);
    expect(calls).toBe(1);

    loader.unload('a');
    expect((await loader.load('a', load)).n).toBe(2);

    loader.clear();
    expect((await loader.load('a', load)).n).toBe(3);
  });
});
