# Change Log

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
