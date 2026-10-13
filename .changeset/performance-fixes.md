---
"@editora/performance": patch
---

Fix four bugs found while writing the README, each with a test (the package's tests now run under a `window`, and the monitor test that was left out runs again):

- `TransactionBatcher`: a transaction added from inside the `onFlush` callback was thrown away with the batch, and the timer that `add()` had just started was cancelled. The batch is now taken before the callback runs.
- `MemoryManager.destroy()` forgot the listeners registered through `registerEventListener()` without removing them, so they kept running and kept their targets alive. It now calls `removeEventListener` with the options they were added with (`cleanup()` still leaves listeners alone).
- `LazyLoader.load()` cached the module only once it had arrived, so two callers asking for the same id before then both ran the loader. It now caches the promise, and forgets it when the load fails.
- `PerformanceMonitor.getAverageMetrics()` counted the periodic heap samples (which have no timings) as zeros, so in Chromium a single 30 ms render averaged 15 ms after one sample and 3 ms after nine, while other browsers were right. The timings are now averaged over the operations only.
