# Change Log

## 0.1.12

### Patch Changes

- 59c675b: Fix `absoluteStrokeWidth`, which did the opposite of what it says. Every stroke is drawn with `vector-effect="non-scaling-stroke"`, so its width is already in screen pixels at any size; the option scaled the width by `viewBox / size` on top of that, and a 1.5 stroke came out 3px at size 12 and 0.75px at size 48 (measured in Chromium). The option now leaves the width alone and the stroke stays `strokeWidth` pixels at every size. This also fixes `<ui-icon absolute-stroke-width>` in `@editora/ui-core` and `Icon` in `@editora/ui-react`, which render through `@editora/icons`. Nothing changes for code that does not pass the option.
- 59c675b: Rewrite the READMEs of `@editora/cli`, `@editora/icons`, `@editora/react-icons` and `@editora/performance`, and add one to `@editora/ui-editor`, which had none. They are the npm pages of these packages, with screenshots and examples.

  The CLI README shows real terminal output (every command and the JavaScript example in it are run against the CLI and compared with the text, `npm run check:readme-examples`). The other READMEs have examples that are type-checked and run in Chromium, and their screenshots are taken from the same examples (`npm run readme:screenshots`).

  Things the READMEs now get right that they did not: only 21 of the 504 icons have a solid variant and 2 a duotone one; importing anything from `@editora/icons` or `@editora/react-icons` brings the whole catalog (about 48 KB and 57 KB gzipped), so named imports are not smaller; `registerWithEditoraUI(registerIcon)` must not be used with `@editora/ui-core`, because its registry then wins over the built-in icons and every `<ui-icon>` draws the plain outline; `@editora/react-icons` has no `'use client'` directive, so in the Next.js App Router its icons belong in Client Components; `editora add` does not read lock files, so in a pnpm, yarn or bun project it needs `--package-manager` or the matching `dlx`. `@editora/performance` documents that its memory manager cancels every registered timer when the heap is high, that the heap size exists only in Chromium, that the monitor times one operation at a time, and that most of it needs `window`; `@editora/ui-editor` says that its six elements are provided by `@editora/ui-core` and that loading it registers nothing, because `@editora/ui-core` is imported first and defines the same tags.

- Updated dependencies [59c675b]
- Updated dependencies [59c675b]
  - @editora/icons@0.1.12

## 0.1.11

### Patch Changes

- f53ca3a: Fix `IconProvider`'s `strokeWidth`, which was silently ignored: `iconWeight` always resolved to `'regular'` and always beat the provider's stroke width, so `<IconProvider value={{ strokeWidth: 3 }}>` rendered 1.5. Stroke width now resolves as prop width, prop weight, provider width, provider weight, then the default. A decorative icon that is also given an `aria-label` is no longer marked both `aria-hidden` and labelled. Invalid sizes (`0`, negatives, `NaN`, non-lengths) fall back to the default instead of reaching `width`/`height` (React logged "Received NaN for the `width` attribute"). Adds the package's first test suite.
- Updated dependencies [f53ca3a]
  - @editora/icons@0.1.11

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.10](https://github.com/ajaykr089/Editora/compare/@editora/react-icons@0.1.6...@editora/react-icons@0.1.10) (2026-09-05)

**Note:** Version bump only for package @editora/react-icons

## [0.1.6](https://github.com/ajaykr089/Editora/compare/@editora/react-icons@0.1.0...@editora/react-icons@0.1.6) (2026-03-08)

**Note:** Version bump only for package @editora/react-icons

## [0.1.5](https://github.com/ajaykr089/Editora/compare/@editora/react-icons@0.1.0...@editora/react-icons@0.1.5) (2026-03-05)

**Note:** Version bump only for package @editora/react-icons
