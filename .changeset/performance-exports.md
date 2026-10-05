---
"@editora/performance": patch
---

Export what the typings declare. `index.d.ts` promised `LazyLoader`, `lazyLoader`, `debounce`, `getGlobalMemoryManager` and `getGlobalPerformanceMonitor`; all of them existed in the source but `src/index.ts` never exported them (`LazyLoader` was left in a "placeholder" comment), so TypeScript users compiled fine and got `undefined` at runtime.
