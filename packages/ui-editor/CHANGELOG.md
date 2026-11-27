# Change Log

## 0.1.15

### Patch Changes

- Updated dependencies [bb0be84]
  - @editora/ui-core@0.7.0

## 0.1.14

### Patch Changes

- Updated dependencies [4120258]
  - @editora/ui-core@0.6.0

## 0.1.13

### Patch Changes

- Updated dependencies [ad3d5ac]
- Updated dependencies [607fb54]
- Updated dependencies [0d12323]
- Updated dependencies [f930497]
- Updated dependencies [a69e637]
- Updated dependencies [221623d]
- Updated dependencies [a41f734]
- Updated dependencies [fba4051]
- Updated dependencies [2733cb4]
- Updated dependencies [23213a0]
- Updated dependencies [de66cc9]
- Updated dependencies [95df4c7]
- Updated dependencies [bffe35d]
- Updated dependencies [5658cdf]
- Updated dependencies [27951e7]
- Updated dependencies [f2242ac]
- Updated dependencies [2382831]
- Updated dependencies [278a0b7]
- Updated dependencies [1bdfc32]
- Updated dependencies [2c3a8d8]
- Updated dependencies [baf3202]
- Updated dependencies [c09ba5f]
- Updated dependencies [857e8e4]
- Updated dependencies [17aa80c]
- Updated dependencies [a179786]
- Updated dependencies [d3fcdc4]
- Updated dependencies [b0cc0e2]
- Updated dependencies [8a28491]
- Updated dependencies [9bb78e9]
- Updated dependencies [6d61b37]
- Updated dependencies [f055ee4]
- Updated dependencies [9bec255]
- Updated dependencies [724bbb3]
- Updated dependencies [eed5448]
- Updated dependencies [8333a1d]
- Updated dependencies [e5ec922]
- Updated dependencies [0d61f0a]
- Updated dependencies [fe4a85a]
- Updated dependencies [c73698b]
- Updated dependencies [67c9252]
- Updated dependencies [fc212ed]
- Updated dependencies [c5ad082]
- Updated dependencies [590a6ef]
- Updated dependencies [0e3c827]
- Updated dependencies [bfc158c]
- Updated dependencies [bd3b91b]
- Updated dependencies [98e723f]
- Updated dependencies [84edd8f]
- Updated dependencies [21cdb6c]
- Updated dependencies [647a63e]
- Updated dependencies [83869a0]
- Updated dependencies [8dfa855]
- Updated dependencies [edf8a80]
- Updated dependencies [29e7ae8]
- Updated dependencies [48c41ca]
- Updated dependencies [048fc0d]
- Updated dependencies [e764187]
- Updated dependencies [b1cb04b]
- Updated dependencies [a37e9f9]
  - @editora/ui-core@0.5.0

## 0.1.12

### Patch Changes

- Updated dependencies [48455d8]
- Updated dependencies [1a8e02d]
- Updated dependencies [a924a61]
- Updated dependencies [93a7258]
- Updated dependencies [69068ed]
- Updated dependencies [da7c0bd]
- Updated dependencies [e428bb3]
  - @editora/ui-core@0.4.0

## 0.1.11

### Patch Changes

- Updated dependencies [b25a486]
- Updated dependencies [8c7ae64]
- Updated dependencies [4c0898f]
- Updated dependencies [56cc0f7]
- Updated dependencies [7b34943]
- Updated dependencies [cddc05a]
- Updated dependencies [12ef8d6]
- Updated dependencies [e7315af]
- Updated dependencies [1e7ba3a]
- Updated dependencies [d0aec84]
- Updated dependencies [ea0ae06]
- Updated dependencies [5e8cd10]
- Updated dependencies [f303688]
- Updated dependencies [4a5aea1]
- Updated dependencies [2042a85]
- Updated dependencies [783d56b]
- Updated dependencies [74dce9b]
- Updated dependencies [1c27821]
- Updated dependencies [db566c8]
- Updated dependencies [179505e]
- Updated dependencies [616fed6]
- Updated dependencies [8c7a9f9]
- Updated dependencies [6f5a0cc]
- Updated dependencies [95a2110]
- Updated dependencies [3df4735]
  - @editora/ui-core@0.3.0

## 0.1.10

### Patch Changes

- Updated dependencies [c148036]
- Updated dependencies [0453386]
- Updated dependencies [0eafaf4]
- Updated dependencies [fa93f3a]
- Updated dependencies [8cd343c]
- Updated dependencies [e6291c8]
  - @editora/ui-core@0.2.0

## 0.1.9

### Patch Changes

- 475bc42: Add npm keywords so the packages show up in npm search for editor, markdown preview and floating-toolbar queries.
- Updated dependencies [26e9a7b]
  - @editora/ui-core@0.1.25

## 0.1.8

### Patch Changes

- 59c675b: Rewrite the READMEs of `@editora/cli`, `@editora/icons`, `@editora/react-icons` and `@editora/performance`, and add one to `@editora/ui-editor`, which had none. They are the npm pages of these packages, with screenshots and examples.

  The CLI README shows real terminal output (every command and the JavaScript example in it are run against the CLI and compared with the text, `npm run check:readme-examples`). The other READMEs have examples that are type-checked and run in Chromium, and their screenshots are taken from the same examples (`npm run readme:screenshots`).

  Things the READMEs now get right that they did not: only 21 of the 504 icons have a solid variant and 2 a duotone one; importing anything from `@editora/icons` or `@editora/react-icons` brings the whole catalog (about 48 KB and 57 KB gzipped), so named imports are not smaller; `registerWithEditoraUI(registerIcon)` must not be used with `@editora/ui-core`, because its registry then wins over the built-in icons and every `<ui-icon>` draws the plain outline; `@editora/react-icons` has no `'use client'` directive, so in the Next.js App Router its icons belong in Client Components; `editora add` does not read lock files, so in a pnpm, yarn or bun project it needs `--package-manager` or the matching `dlx`. `@editora/performance` documents that its memory manager cancels every registered timer when the heap is high, that the heap size exists only in Chromium, that the monitor times one operation at a time, and that most of it needs `window`; `@editora/ui-editor` says that its six elements are provided by `@editora/ui-core` and that loading it registers nothing, because `@editora/ui-core` is imported first and defines the same tags.

- Updated dependencies [16ae8ee]
- Updated dependencies [8a37a0c]
- Updated dependencies [3bfac80]
- Updated dependencies [b2dc737]
  - @editora/ui-core@0.1.23

## 0.1.7

### Patch Changes

- 8f9b69c: Actually ship the typings. `@editora/ui-editor@0.1.6` was published without its `dist/index.d.ts`: the declarations were generated before publishing, but `npm publish` re-runs the package's `prepare` hook (`npm run build`) afterwards and `vite build` empties `dist/`, deleting them before the tarball was made. The package's own `build` now emits the declarations, so every path that builds it (install, CI, publish) ends with them in place.

## 0.1.6

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.5](https://github.com/ajaykr089/Editora/compare/@editora/ui-editor@0.1.3...@editora/ui-editor@0.1.5) (2026-09-05)

**Note:** Version bump only for package @editora/ui-editor

## 0.1.3 (2026-03-08)

**Note:** Version bump only for package @editora/ui-editor

## 0.1.2 (2026-03-05)

**Note:** Version bump only for package @editora/ui-editor
