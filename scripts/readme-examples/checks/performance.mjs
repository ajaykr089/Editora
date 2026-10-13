// Run checks for the examples of the @editora/performance README.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { root } from '../shared.mjs';

export default async function checks({ run, ok, fail }) {
  const require = createRequire(import.meta.url);
  const performanceDist = path.join(root, 'packages/performance/dist/index.cjs.js');
  const load = () => {
    delete require.cache[performanceDist];
    return require(performanceDist);
  };
  const check = (condition, good, bad) => (condition ? ok(good) : fail(bad));

  // ---- the defaults the README gives are the defaults of the build (the classes only need `window` for timers)
  globalThis.window = globalThis;
  try {
    const lib = load();
    const config = (instance) => JSON.stringify(instance.config);
    const batcher = new lib.TransactionBatcher();
    check(config(batcher) === JSON.stringify({ maxBatchSize: 10, maxBatchTime: 16, enabled: true }), 'TransactionBatcher defaults: 10 transactions, 16 ms, enabled', `TransactionBatcher defaults changed: ${config(batcher)}`);
    const memory = new lib.MemoryManager({ autoCleanup: false });
    check(config(memory) === JSON.stringify({ maxMemoryMB: 100, cleanupIntervalMs: 30000, autoCleanup: false }), 'MemoryManager defaults: 100 MB, 30 s', `MemoryManager defaults changed: ${config(memory)}`);
    const defaults = new lib.MemoryManager();
    check(defaults.config.autoCleanup === true, 'MemoryManager cleans up automatically by default', 'MemoryManager no longer cleans up by default');
    defaults.destroy();
    const monitor = new lib.PerformanceMonitor({ enabled: false });
    check(config(monitor) === JSON.stringify({ enabled: false, sampleInterval: 5000, maxSamples: 100, logWarnings: true }), 'PerformanceMonitor defaults: 5 s, 100 samples, warnings on', `PerformanceMonitor defaults changed: ${config(monitor)}`);
    check(new lib.Debouncer().delay === 250, 'Debouncer waits 250 ms by default', 'the Debouncer default delay changed');

    // The warnings and their thresholds.
    const warnings = [];
    const warn = console.warn;
    console.warn = (...args) => warnings.push(args.join(' '));
    const realNow = performance.now;
    try {
      const watched = new lib.PerformanceMonitor({ enabled: true, sampleInterval: 1e9 });
      for (const [elapsed, expected] of [[15, null], [17, 'Slow render'], [101, 'Slow transaction']]) {
        warnings.length = 0;
        let calls = 0;
        performance.now = () => (calls++ === 0 ? 0 : elapsed);
        watched.startOperation('x');
        watched.endOperation();
        const text = warnings.join('|');
        check(expected === null ? warnings.length === 0 : text.includes(expected), `a ${elapsed} ms operation ${expected ? `warns "${expected}"` : 'does not warn'}`, `a ${elapsed} ms operation gives ${JSON.stringify(warnings)}`);
      }
      watched.destroy();
    } finally {
      performance.now = realNow;
      console.warn = warn;
    }
    batcher.destroy();
    memory.destroy();
    monitor.destroy();

    // What an operation records, by type: its duration is renderTime and transactionTime whatever the type, and 'dom' adds domTime.
    {
      const timed = new lib.PerformanceMonitor({ enabled: true, sampleInterval: 1e9, logWarnings: false });
      const record = (type) => {
        let calls = 0;
        performance.now = () => (calls++ === 0 ? 0 : 12);
        timed.startOperation(type);
        const metrics = timed.endOperation();
        performance.now = realNow;
        return `${metrics.domTime}/${metrics.renderTime}/${metrics.transactionTime}`;
      };
      const seen = Object.fromEntries(['render', 'transaction', 'dom', 'anything'].map((type) => [type, record(type)]));
      check(JSON.stringify(seen) === JSON.stringify({ render: '0/12/12', transaction: '0/12/12', dom: '12/12/12', anything: '0/12/12' }), 'an operation records its time as render and transaction time, and dom time for type dom', `operation types record ${JSON.stringify(seen)}`);

      // memoryUsage: the heap growth of an operation, the heap in use for a sample; and the memory warning.
      const MB = 1024 * 1024;
      performance.memory = { usedJSHeapSize: 100 * MB, totalJSHeapSize: 300 * MB, jsHeapSizeLimit: 2048 * MB };
      timed.startOperation('render');
      performance.memory = { usedJSHeapSize: 130 * MB, totalJSHeapSize: 300 * MB, jsHeapSizeLimit: 2048 * MB };
      const grown = timed.endOperation();
      check(grown.memoryUsage === 30, 'an operation records the heap growth in MB', `an operation recorded ${grown.memoryUsage} MB for 30 MB of growth`);
      const sampling = new lib.PerformanceMonitor({ enabled: true, sampleInterval: 10, logWarnings: false });
      await new Promise((resolve) => setTimeout(resolve, 40));
      const sample = sampling.getMetrics()[0];
      check(sample && sample.memoryUsage === 130 && sample.renderTime === 0, 'a sample records the heap in use in MB, and no timings', `a sample is ${JSON.stringify(sample)}`);
      sampling.destroy();
      warnings.length = 0;
      console.warn = (...args) => warnings.push(args.join(' '));
      const loud = new lib.PerformanceMonitor({ enabled: true, sampleInterval: 1e9 });
      performance.memory = { usedJSHeapSize: 100 * MB };
      loud.startOperation('render');
      performance.memory = { usedJSHeapSize: 151 * MB };
      loud.endOperation();
      loud.destroy();
      console.warn = warn;
      delete performance.memory;
      check(warnings.some((line) => line.includes('High memory usage: 51MB')), 'an operation that grows the heap by more than 50 MB warns', `no memory warning: ${JSON.stringify(warnings)}`);
      timed.destroy();
    }

    // A timeout stays registered after it has fired, until it is unregistered or cleaned up.
    {
      const manager = new lib.MemoryManager({ autoCleanup: false });
      manager.registerTimeout(window.setTimeout(() => {}, 1));
      await new Promise((resolve) => setTimeout(resolve, 20));
      check(manager.timeouts.size === 1, 'a timeout that has fired stays registered', 'a timeout that has fired is no longer registered: update the README');
      manager.destroy();
    }

    // Without a flush callback a flush hands the transactions to nobody.
    {
      const silent = new lib.TransactionBatcher({ maxBatchTime: 1e9 });
      silent.add({ id: 1 });
      silent.flushBatch();
      check(silent.getBatchSize() === 0, 'a batch flushed with no callback is gone', 'a batch flushed with no callback is kept');
      silent.destroy();
    }

    // The package imports nothing at run time (the types of @editora/core are erased).
    const built = fs.readFileSync(performanceDist, 'utf8') + fs.readFileSync(performanceDist.replace('index.cjs.js', 'index.esm.js'), 'utf8');
    check(!/@editora\/core/.test(built), 'the build does not import @editora/core', 'the build imports @editora/core: update the README');
  } finally {
    delete globalThis.window;
  }

  // ---- where there is no window: what runs and what does not
  const bare = load();
  const throwsWithoutWindow = (create) => {
    try {
      create();
      return false;
    } catch (error) {
      return /window is not defined/.test(error.message);
    }
  };
  check(throwsWithoutWindow(() => bare.createMemoryManager()), 'createMemoryManager() needs window', 'createMemoryManager() runs without window');
  check(throwsWithoutWindow(() => bare.createPerformanceMonitor()), 'createPerformanceMonitor() needs window', 'createPerformanceMonitor() runs without window');
  check(throwsWithoutWindow(() => bare.createTransactionBatcher().add({})), 'a TransactionBatcher needs window to add a transaction', 'a TransactionBatcher runs without window');
  check(throwsWithoutWindow(() => bare.createDebouncer().execute(() => {})), 'a Debouncer needs window to execute', 'a Debouncer runs without window');
  let debounced = 0;
  const wrapped = bare.debounce(() => debounced++);
  wrapped();
  wrapped();
  await new Promise((resolve) => setTimeout(resolve, 200));
  const early = debounced;
  await new Promise((resolve) => setTimeout(resolve, 120));
  check(early === 0 && debounced === 1, 'debounce() runs once, after 250 ms, with no window', `debounce() ran ${early} times at 200 ms and ${debounced} at 320 ms`);
  check((await bare.lazyLoader.load('node', async () => 'loaded')) === 'loaded', 'lazyLoader works with no window', 'lazyLoader needs window');

  // ---- the examples, in Chromium
  await run('performance-debounce', async (page, { logs }) => {
    const counts = () => page.locator('#counts').textContent();
    if ((await counts()) !== 'keystrokes: 0 · searches: 0') return `the counters start at ${await counts()}`;
    await page.type('#query', 'editora', { delay: 40 });
    if ((await counts()) !== 'keystrokes: 7 · searches: 0') return `right after typing: ${await counts()}`;
    await page.waitForTimeout(450);
    if ((await counts()) !== 'keystrokes: 7 · searches: 1') return `300 ms after typing: ${await counts()}`;
    if ((await page.locator('#result').textContent()) !== 'Results for "editora"') return `the search got ${await page.locator('#result').textContent()}`;

    for (const width of [900, 800, 700]) await page.setViewportSize({ width, height: 800 });
    await page.waitForTimeout(400);
    const resized = logs.filter((line) => line.startsWith('resized'));
    return resized.length === 1 && resized[0] === 'resized 700' ? true : `three resizes in a row logged ${JSON.stringify(resized)}`;
  });

  await run('performance-batcher', async (page) => {
    const lines = () => page.$$eval('#flushes li', (items) => items.map((item) => item.textContent));
    // Click and read in one task, so that the batch timer (200 ms) cannot run in between.
    const straightAway = await page.evaluate(() => {
      document.querySelector('#add').click();
      return [...document.querySelectorAll('#flushes li')].map((item) => item.textContent);
    });
    if (JSON.stringify(straightAway) !== JSON.stringify(['Handled 5 together: 1, 2, 3, 4, 5'])) return `right after the click: ${JSON.stringify(straightAway)}`;
    await page.waitForTimeout(350);
    const expected = ['Handled 5 together: 1, 2, 3, 4, 5', 'Handled 2 together: 6, 7'];
    if (JSON.stringify(await lines()) !== JSON.stringify(expected)) return `200 ms later: ${JSON.stringify(await lines())}`;
    await page.locator('#add').click();
    await page.waitForTimeout(350);
    return (await lines()).length === 4 ? true : `a second click gave ${(await lines()).length} batches, not 4`;
  });

  await run('performance-memory', async (page) => {
    const pings = () => page.locator('#pings').textContent();
    if ((await pings()) !== 'Pings heard: 0') return `the page starts at ${await pings()}`;
    await page.locator('#ping').click();
    await page.locator('#ping').click();
    if ((await pings()) !== 'Pings heard: 2') return `after two pings: ${await pings()}`;
    const heap = await page.locator('#heap').textContent();
    if (!/^(Heap: \d+ MB of \d+ MB|The heap size is not available in this browser)$/.test(heap)) return `the heap line says "${heap}"`;

    // destroy() removes the listener it was given, and clears the interval that was registered with it.
    await page.locator('#destroy').click();
    await page.locator('#ping').click();
    if ((await pings()) !== 'Pings heard: 2') return `a ping after destroy() was still heard: ${await pings()}`;
    await page.evaluate(() => { document.querySelector('#heap').textContent = 'stale'; });
    await page.waitForTimeout(1300);
    return (await page.locator('#heap').textContent()) === 'stale' ? true : 'the registered interval kept running after destroy()';
  });

  await run('performance-monitor', async (page) => {
    await page.locator('#run').click();
    const text = await page.locator('#out').textContent();
    const match = text.match(/^This render: (\d+) ms\nAverage over the last minute: (\d+) ms$/);
    if (!match) return `the output is "${text}"`;
    const [last, average] = [Number(match[1]), Number(match[2])];
    if (last < 30 || last > 80) return `a 30 ms render measured ${last} ms`;
    // The only operation in the window is the one just measured; the heap samples that Chromium adds have no timings and are left out.
    return average === last ? true : `the average (${average} ms) is not the one render that was measured (${last} ms)`;
  });

  await run('performance-lazy', async (page) => {
    await page.locator('#open').click();
    await page.waitForTimeout(300);
    const status = () => page.locator('#status').textContent();
    if ((await status()) !== 'chart drawn · same module: true · loader ran 1 time') return `after the first click: ${await status()}`;
    await page.locator('#open').click();
    await page.waitForTimeout(300);
    return (await status()) === 'chart drawn · same module: true · loader ran 1 time' ? true : `a second click ran the loader again: ${await status()}`;
  });
}
