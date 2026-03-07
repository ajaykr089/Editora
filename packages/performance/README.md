# @editora/performance

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Performance and memory utilities for Editora editors.

## Installation

```bash
npm install @editora/performance @editora/core
```

## Exports

From `@editora/performance`:

- `TransactionBatcher`, `createTransactionBatcher`
- `Debouncer`, `createDebouncer`, `debounce`
- `MemoryManager`, `createMemoryManager`, `getGlobalMemoryManager`
- `PerformanceMonitor`, `createPerformanceMonitor`, `getGlobalPerformanceMonitor`

## Transaction Batching

```ts
import { createTransactionBatcher } from "@editora/performance";

const batcher = createTransactionBatcher({
  maxBatchSize: 10,
  maxBatchTime: 16,
  enabled: true,
});

batcher.setOnFlush((transactions) => {
  // apply grouped editor updates
});
```

## Debouncing

```ts
import { createDebouncer, debounce } from "@editora/performance";

const debouncer = createDebouncer(120);
debouncer.execute(() => {
  // expensive update
});

const onResize = debounce(() => {
  // recalc layout
}, 150);
```

## Memory Management

```ts
import { createMemoryManager } from "@editora/performance";

const memory = createMemoryManager({
  maxMemoryMB: 100,
  cleanupIntervalMs: 30000,
  autoCleanup: true,
});

const timeoutId = window.setTimeout(() => {}, 1000);
memory.registerTimeout(timeoutId);
```

## Performance Monitoring

```ts
import { createPerformanceMonitor } from "@editora/performance";

const monitor = createPerformanceMonitor({
  enabled: true,
  sampleInterval: 5000,
  maxSamples: 100,
  logWarnings: true,
});

monitor.startOperation("render");
// render work
monitor.endOperation();
```

## Notes

- Utilities are browser-oriented (`window`, `performance` APIs).
- Keep monitor enabled in dev/staging and tune in production.
