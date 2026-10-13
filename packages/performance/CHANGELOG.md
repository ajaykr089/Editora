# Change Log

## 1.0.13

### Patch Changes

- 5f69013: Fix four bugs found while writing the README, each with a test (the package's tests now run under a `window`, and the monitor test that was left out runs again):

  - `TransactionBatcher`: a transaction added from inside the `onFlush` callback was thrown away with the batch, and the timer that `add()` had just started was cancelled. The batch is now taken before the callback runs.
  - `MemoryManager.destroy()` forgot the listeners registered through `registerEventListener()` without removing them, so they kept running and kept their targets alive. It now calls `removeEventListener` with the options they were added with (`cleanup()` still leaves listeners alone).
  - `LazyLoader.load()` cached the module only once it had arrived, so two callers asking for the same id before then both ran the loader. It now caches the promise, and forgets it when the load fails.
  - `PerformanceMonitor.getAverageMetrics()` counted the periodic heap samples (which have no timings) as zeros, so in Chromium a single 30 ms render averaged 15 ms after one sample and 3 ms after nine, while other browsers were right. The timings are now averaged over the operations only.

- 59c675b: Rewrite the READMEs of `@editora/cli`, `@editora/icons`, `@editora/react-icons` and `@editora/performance`, and add one to `@editora/ui-editor`, which had none. They are the npm pages of these packages, with screenshots and examples.

  The CLI README shows real terminal output (every command and the JavaScript example in it are run against the CLI and compared with the text, `npm run check:readme-examples`). The other READMEs have examples that are type-checked and run in Chromium, and their screenshots are taken from the same examples (`npm run readme:screenshots`).

  Things the READMEs now get right that they did not: only 21 of the 504 icons have a solid variant and 2 a duotone one; importing anything from `@editora/icons` or `@editora/react-icons` brings the whole catalog (about 48 KB and 57 KB gzipped), so named imports are not smaller; `registerWithEditoraUI(registerIcon)` must not be used with `@editora/ui-core`, because its registry then wins over the built-in icons and every `<ui-icon>` draws the plain outline; `@editora/react-icons` has no `'use client'` directive, so in the Next.js App Router its icons belong in Client Components; `editora add` does not read lock files, so in a pnpm, yarn or bun project it needs `--package-manager` or the matching `dlx`. `@editora/performance` documents that its memory manager cancels every registered timer when the heap is high, that the heap size exists only in Chromium, that the monitor times one operation at a time, and that most of it needs `window`; `@editora/ui-editor` says that its six elements are provided by `@editora/ui-core` and that loading it registers nothing, because `@editora/ui-core` is imported first and defines the same tags.

- Updated dependencies [e0c6fb4]
  - @editora/core@1.0.23

## 1.0.12

### Patch Changes

- f1326f5: Export what the typings declare. `index.d.ts` promised `LazyLoader`, `lazyLoader`, `debounce`, `getGlobalMemoryManager` and `getGlobalPerformanceMonitor`; all of them existed in the source but `src/index.ts` never exported them (`LazyLoader` was left in a "placeholder" comment), so TypeScript users compiled fine and got `undefined` at runtime.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.11](https://github.com/ajaykr089/Editora/compare/@editora/performance@1.0.8...@editora/performance@1.0.11) (2026-09-05)

**Note:** Version bump only for package @editora/performance

## 1.0.8 (2026-03-08)

**Note:** Version bump only for package @editora/performance

## 1.0.7 (2026-03-05)

**Note:** Version bump only for package @editora/performance

## 1.0.4 (2026-02-28)

### Changed

- Updated package metadata and publish configuration for npm release readiness.
- Aligned `@editora/core` dependency range to `^1.0.4`.

### Packaging

- Added explicit `exports` map and root declaration entrypoint (`index.d.ts`).
- Included README and declaration file in published artifacts.

## 1.0.2 (2026-02-13)

**Note:** Version bump only for package @editora/performance

## 1.0.1 (2026-02-12)

**Note:** Version bump only for package @editora/performance
