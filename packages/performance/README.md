<h1 align="center">@editora/performance</h1>

<p align="center">
  Small utilities for an interface that has to stay fast: debounce a handler, batch updates, load a module once, clean up
  timers and listeners, and time an operation. All of it is 1.7 KB gzipped, and you can read every line of it.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/performance"><img src="https://img.shields.io/npm/v/@editora/performance.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/performance"><img src="https://img.shields.io/npm/dm/@editora/performance.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/performance.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/performance"><img src="https://img.shields.io/npm/types/@editora/performance.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/">Website</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/performance/docs/images/batcher.png" alt="A button reading Add 7 transactions and the two batches it produced: Handled 5 together: 1, 2, 3, 4, 5 and Handled 2 together: 6, 7" width="392">
</p>

## What is in it

| You want to | Use | Needs a browser |
| --- | --- | --- |
| Run a handler once after a burst of calls | `createDebouncer(delay)`, or `debounce(fn, delay)` | `debounce`: no |
| Handle several updates together | `createTransactionBatcher(config)` | yes |
| Download or build something once, however many ask | `lazyLoader` (or `new LazyLoader()`) | no |
| Cancel timers and remove listeners when a view goes away | `createMemoryManager(config)` | yes |
| See how long an operation took, and warn when it was slow | `createPerformanceMonitor(config)` | yes |

- **Small.** Everything is 5.8 KB minified and 1.7 KB gzipped; `debounce` alone is 273 bytes. The package
  imports nothing at run time (the types of [`@editora/core`](https://www.npmjs.com/package/@editora/core) are erased,
  but `npm` installs it as a dependency).
- **Independent.** There is no framework in it and no setup; the Editora editors do not call it for you, so it is for
  your own code, in an editor integration or anywhere else.
- **Typed.** TypeScript declarations are included.

## Install

```bash
npm install @editora/performance
```

## Debounce

`createDebouncer(delay)` runs a function once, `delay` milliseconds after the last call to `execute`, with the arguments of
that last call. Every new call cancels the one that is waiting. `debounce(fn, delay)` wraps a function that you call
yourself. The default delay is 250 ms.

```ts
import { createDebouncer, debounce } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo input { box-sizing: border-box; width: 100%; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 8px; font: inherit; }
    .demo p { margin: 10px 0 0; }
    .demo .counts { font: 12px ui-monospace, monospace; color: #57606a; }
  </style>
  <div class="demo">
    <input id="query" type="search" placeholder="Type quickly" aria-label="Search" />
    <p class="counts" id="counts"></p>
    <p id="result"></p>
  </div>`;

const input = root.querySelector<HTMLInputElement>('#query')!;
const counts = root.querySelector('#counts')!;
const result = root.querySelector('#result')!;

let keystrokes = 0;
let searches = 0;
const showCounts = () => (counts.textContent = `keystrokes: ${keystrokes} · searches: ${searches}`);
showCounts();

// One search, 300 ms after the last keystroke, with the text as it is then. Each new call cancels the one waiting.
const search = createDebouncer(300);
input.addEventListener('input', () => {
  keystrokes++;
  showCounts();
  search.execute((text: string) => {
    searches++;
    result.textContent = text ? `Results for "${text}"` : '';
    showCounts();
  }, input.value);
});

// debounce() wraps a function that you call yourself, such as a resize handler.
window.addEventListener('resize', debounce(() => console.log('resized', window.innerWidth), 150));
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/performance/docs/images/debounce.png" alt="A search box holding the word editora. Under it: keystrokes 7, searches 1, and Results for editora" width="392">
</p>

`cancel()` drops the call that is waiting. There is nothing else: a debounced call runs at the end of the quiet period,
never at the start, there is no maximum wait, and a function made by `debounce()` cannot be cancelled. (The
`DebounceConfig` type in the declarations has `leading` and `maxWait`, but nothing reads it.)

## Handle updates together

A `TransactionBatcher` collects what you `add` and hands it over in one call: when the batch holds `maxBatchSize`
transactions (10 by default), or `maxBatchTime` milliseconds (16) after the first one arrived, whichever comes first.
Later transactions do not extend the wait. A transaction is any object.

```ts
import { createTransactionBatcher } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo button { padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa; font: inherit; }
    .demo ol { margin: 12px 0 0; padding-left: 20px; line-height: 1.7; }
  </style>
  <div class="demo">
    <button id="add" type="button">Add 7 transactions</button>
    <ol id="flushes"></ol>
  </div>`;

// Up to 5 transactions are handled together, and a smaller batch waits at most 200 ms for company.
const batcher = createTransactionBatcher({ maxBatchSize: 5, maxBatchTime: 200 });

batcher.setOnFlush((transactions) => {
  const item = document.createElement('li');
  item.textContent = `Handled ${transactions.length} together: ${transactions.map((transaction) => transaction.id).join(', ')}`;
  root.querySelector('#flushes')!.append(item);
});

let next = 1;
root.querySelector('#add')!.addEventListener('click', () => {
  for (let i = 0; i < 7; i++) batcher.add({ id: next++ });
});
```

The callback gets the transactions and a state: the `beforeState` of the first transaction if it has one, and `{}`
otherwise. Things to know:

- Set the callback before you add anything: a batch that is flushed while there is no callback is dropped.
- A transaction added from inside the callback goes into the next batch.
- `flushBatch()` hands over what is waiting now. `setEnabled(false)` does that and then passes each later transaction
  straight through, and `destroy()` flushes what is waiting and stops the timer. `getBatchSize()` and `isEnabled()`
  tell you where it stands.

## Load a module once

`lazyLoader.load(id, loader)` runs `loader` the first time it is asked for `id` and gives every caller the same result.
Callers that ask while the first load is still running share it, so the loader runs once. A load that fails is not
remembered, so the next call tries again. `unload(id)` and `clear()` forget what was loaded.

```ts
import { lazyLoader } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo button { padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa; font: inherit; }
    .demo p { margin: 12px 0 0; }
  </style>
  <div class="demo">
    <button id="open" type="button">Open the chart twice</button>
    <p id="status"></p>
  </div>`;

let downloads = 0;

// Stands in for () => import('./chart'): anything that returns a promise will do.
const loadChart = () =>
  new Promise<{ draw: () => string }>((resolve) => {
    downloads++;
    setTimeout(() => resolve({ draw: () => 'chart drawn' }), 100);
  });

root.querySelector('#open')!.addEventListener('click', async () => {
  // Two callers ask for the same module before it has arrived: the loader runs once, and both get the module.
  const [first, second] = await Promise.all([lazyLoader.load('chart', loadChart), lazyLoader.load('chart', loadChart)]);
  root.querySelector('#status')!.textContent = `${first.draw()} · same module: ${first === second} · loader ran ${downloads} time${downloads === 1 ? '' : 's'}`;
});
```

## Clean up timers and listeners

A `MemoryManager` is a list of things to dispose of when a view is done: `registerTimeout(id)`, `registerInterval(id)`
and `registerEventListener(target, type, listener, options?)`, which adds the listener for you. `destroy()` stops the
manager, clears the timers and intervals and removes the listeners, each with the options it was added with.

```ts
import { createMemoryManager } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo button { margin-right: 8px; padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa; font: inherit; }
    .demo p { margin: 12px 0 0; }
  </style>
  <div class="demo">
    <button id="ping" type="button">Ping</button>
    <button id="destroy" type="button">Destroy the manager</button>
    <p id="pings"></p>
    <p id="heap"></p>
  </div>`;

// Checks the heap every 10 s, and when it is above 200 MB clears the timers that were registered with it.
const memory = createMemoryManager({ maxMemoryMB: 200, cleanupIntervalMs: 10000 });

const pings = root.querySelector('#pings')!;
const heap = root.querySelector('#heap')!;
let heard = 0;
const showPings = () => (pings.textContent = `Pings heard: ${heard}`);
showPings();

// Added through the manager, so destroy() removes it.
memory.registerEventListener(root, 'ping', () => {
  heard++;
  showPings();
});

// An interval that the manager may clear, and that destroy() does clear.
const showHeap = () => {
  const usage = memory.getMemoryUsage(); // null where the browser does not say (only Chromium does)
  heap.textContent = usage ? `Heap: ${usage.used} MB of ${usage.limit} MB` : 'The heap size is not available in this browser';
};
showHeap();
memory.registerInterval(window.setInterval(showHeap, 1000));

root.querySelector('#ping')!.addEventListener('click', () => root.dispatchEvent(new Event('ping')));
root.querySelector('#destroy')!.addEventListener('click', () => memory.destroy());
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/performance/docs/images/memory.png" alt="Ping and Destroy the manager buttons, Pings heard: 3 after the manager was destroyed and a fourth ping was sent, and a line with the heap size" width="392">
</p>

It also watches the heap, and this part is easy to get wrong:

- **It cancels your timers.** Every `cleanupIntervalMs` (30 s) it checks whether the heap is above `maxMemoryMB` (100) and,
  if so, runs `cleanup()`: every registered timeout and interval is cleared, and `window.gc()` is called if the page
  has one. Register only timers that the page can live without, and set `autoCleanup: false` to switch the check off.
  `cleanup()` leaves the listeners alone; `destroy()` removes them.
- **It only works in Chromium.** The heap size comes from `performance.memory`, which other browsers do not have.
  `getMemoryUsage()` returns `null` there (in Chromium `{ used, total, limit }` in MB), `isMemoryHigh()` is `false`, and
  the automatic cleanup never runs.
- **It does not notice a timeout that has fired.** The id stays registered until `unregisterTimeout(id)` or a cleanup.
- `getGlobalMemoryManager()` creates one manager, with the automatic cleanup on, and it is never destroyed.

## Time an operation

```ts
import { createPerformanceMonitor } from '@editora/performance';

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .demo { width: 360px; font: 14px system-ui, sans-serif; color: #24292f; }
    .demo button { padding: 8px 14px; border: 1px solid #d0d7de; border-radius: 8px; background: #f6f8fa; font: inherit; }
    .demo pre { margin: 12px 0 0; font: 13px/1.6 ui-monospace, monospace; }
  </style>
  <div class="demo">
    <button id="run" type="button">Run a slow render</button>
    <pre id="out">No operation yet</pre>
  </div>`;

// Samples the heap every second (in Chromium) and does not log warnings. Call monitor.destroy() when you are done.
const monitor = createPerformanceMonitor({ sampleInterval: 1000, logWarnings: false });

root.querySelector('#run')!.addEventListener('click', () => {
  monitor.startOperation('render');
  const until = performance.now() + 30;
  while (performance.now() < until) {
    // 30 ms of work to measure
  }
  const metrics = monitor.endOperation(); // null if monitoring is off

  const average = monitor.getAverageMetrics(60_000);
  root.querySelector('#out')!.textContent = [
    `This render: ${Math.round(metrics?.renderTime ?? 0)} ms`,
    `Average over the last minute: ${average.renderTime ?? 0} ms`,
  ].join('\n');
});
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/performance/docs/images/monitor.png" alt="A Run a slow render button, This render: 30 ms, and Average over the last minute: 30 ms" width="392">
</p>

`startOperation(type)` and `endOperation()` time what happens between them with `performance.now()`. `endOperation()`
returns the metrics (`null` if monitoring is off or nothing was started) and keeps them, up to `maxSamples` (100) of
them. Read them back with `getMetrics()`, or `getAverageMetrics(durationMs)`, which averages the last minute unless you
say otherwise, in whole milliseconds and megabytes. `clearMetrics()` empties the list.

What the numbers are:

- **One operation at a time.** Starting a second one before ending the first forgets the first.
- **The type hardly matters.** An operation records its duration as `renderTime` and as `transactionTime`, whatever the
  type, and `'dom'` also records it as `domTime`.
- **`memoryUsage`.** For an operation, how much the heap grew in MB (0 where the browser has no heap size); for a
  sample, the heap in use in MB.
- **Samples.** In Chromium the monitor also records the heap every `sampleInterval` (5 s). A sample has no timings, and
  the averages of the timings leave it out.
- **Warnings.** `logWarnings` is on by default. An operation that takes more than 16 ms logs "Slow render", one that
  takes more than 100 ms also logs "Slow transaction", and one that grows the heap by more than 50 MB logs "High memory
  usage", each as `console.warn('Performance warning:', …)`. Turn it off for production.
- **It runs a timer.** A monitor that is on samples every `sampleInterval` until you call `destroy()` (or `stopMonitoring()`);
  pass `enabled: false` to create one that does nothing, and `getGlobalPerformanceMonitor()` creates one that is never
  stopped.

## Where it runs

`debounce`, `LazyLoader` and `lazyLoader` use no browser API, so they run in Node and on a server. The debouncer, the batcher,
the memory manager and the monitor set their timers on `window`: creating or using one without a `window` throws
`window is not defined`, so create them in the browser (in an effect, or on first use), not at the top of a module that a
server also loads.

## Reference

| Class | Option | Default | Meaning |
| --- | --- | --- | --- |
| `Debouncer` | `delay` (constructor argument) | `250` | Milliseconds of quiet before the call runs. |
| `TransactionBatcher` | `maxBatchSize` | `10` | Transactions that make a full batch. |
| | `maxBatchTime` | `16` | Longest wait, in milliseconds, from the first transaction of a batch to its flush. |
| | `enabled` | `true` | `false` hands over each transaction at once. |
| `MemoryManager` | `maxMemoryMB` | `100` | Heap size, in MB, above which `isMemoryHigh()` is true. |
| | `cleanupIntervalMs` | `30000` | How often the automatic check runs. |
| | `autoCleanup` | `true` | Run `cleanup()` when the heap is high. |
| `PerformanceMonitor` | `enabled` | `true` | `false` records nothing and runs no timer. |
| | `sampleInterval` | `5000` | Milliseconds between heap samples. |
| | `maxSamples` | `100` | How many entries are kept. |
| | `logWarnings` | `true` | Log slow operations. |

Each class has a factory (`createDebouncer`, `createTransactionBatcher`, `createMemoryManager`,
`createPerformanceMonitor`) that takes the same options. `PerformanceMetrics` is `{ domTime, renderTime,
transactionTime, memoryUsage, timestamp }`, and the other types are `Transaction`, `TransactionBatchConfig`, `MemoryConfig`,
`PerformanceConfig` and `DebounceConfig`.

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
