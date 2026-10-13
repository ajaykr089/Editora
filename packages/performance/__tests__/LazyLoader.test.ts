import { describe, expect, it } from '@jest/globals';
import { LazyLoader } from '../src/LazyLoader';

describe('LazyLoader', () => {
  it('runs the loader once for loads that overlap', async () => {
    // Two callers asking for the same module before it arrived both ran the loader (two downloads).
    const loader = new LazyLoader();
    let calls = 0;
    let finish: (module: { n: number }) => void = () => {};
    const slow = () => new Promise<{ n: number }>((resolve) => {
      calls++;
      finish = resolve;
    });

    const first = loader.load('chart', slow);
    const second = loader.load('chart', slow);
    finish({ n: 1 });

    expect(await first).toBe(await second);
    expect(calls).toBe(1);
  });

  it('keeps separate ids separate', async () => {
    const loader = new LazyLoader();
    const [a, b] = await Promise.all([loader.load('a', async () => 'A'), loader.load('b', async () => 'B')]);
    expect([a, b]).toEqual(['A', 'B']);
  });

  it('does not remember a failed load: the next call tries again', async () => {
    const loader = new LazyLoader();
    let calls = 0;
    const flaky = async () => {
      if (++calls === 1) throw new Error('network');
      return 'ok';
    };
    await expect(loader.load('x', flaky)).rejects.toThrow('network');
    expect(await loader.load('x', flaky)).toBe('ok');
    expect(calls).toBe(2);
  });

  it('turns a loader that throws before it returns a promise into a rejection', async () => {
    const loader = new LazyLoader();
    const broken = (() => { throw new Error('sync'); }) as () => Promise<never>;
    await expect(loader.load('x', broken)).rejects.toThrow('sync');
    expect(await loader.load('x', async () => 'again')).toBe('again');
  });

  it('unload() and clear() make the next load run the loader again', async () => {
    const loader = new LazyLoader();
    let calls = 0;
    const load = async () => ++calls;
    expect(await loader.load('a', load)).toBe(1);
    expect(await loader.load('a', load)).toBe(1);
    loader.unload('a');
    expect(await loader.load('a', load)).toBe(2);
    loader.clear();
    expect(await loader.load('a', load)).toBe(3);
  });
});
