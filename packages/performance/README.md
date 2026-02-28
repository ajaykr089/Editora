# @editora/performance

Performance utilities for Editora editors.

## Install

```bash
npm install @editora/performance @editora/core
```

## Exports

- `TransactionBatcher` / `createTransactionBatcher`
- `Debouncer` / `createDebouncer` / `debounce`
- `MemoryManager` / `createMemoryManager` / `getGlobalMemoryManager`
- `PerformanceMonitor` / `createPerformanceMonitor` / `getGlobalPerformanceMonitor`
- `LazyLoader` / `lazyLoader`

## Usage

```ts
import { createDebouncer, createPerformanceMonitor } from "@editora/performance";

const debouncer = createDebouncer(120);
const monitor = createPerformanceMonitor({ enabled: true, sampleInterval: 5000 });

debouncer.execute(() => {
  monitor.startOperation("render");
  // render/update work...
  monitor.endOperation();
});
```

## License

MIT
