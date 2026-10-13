# Change Log

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
