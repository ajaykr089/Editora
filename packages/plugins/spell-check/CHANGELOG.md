# @editora/spell-check

## 1.0.6

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 1.0.5

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.4

### Patch Changes

- cdd091a: Fix two spell-check bugs found via live testing. First, the dictionary used to decide whether a word is misspelled only had ~105 words (mostly function words), so ordinary prose came back as low as 54.5% "accuracy" with words like "rich", "framework", "native", and "runtime" flagged as misspelled. Replaced it with the 10,000 most common English words (MIT-licensed `most-common-words-by-language` package, Google word-frequency corpus), baked into a generated `englishDictionary.ts` with no new runtime dependency.

  Second, upgrading the dictionary exposed a pre-existing bug: `highlightMisspelledWords` wrapped each misspelled word in a `<span>` via `Range.surroundContents`, looping through issues in document order. Wrapping a range splits the text node it's in, which shifted the offsets of every other issue still pointing at that same original node - so only the first misspelled word in a given text node ever got visually highlighted, while the side panel's count (computed from a fresh scan) correctly showed all of them. With the old sparse dictionary this rarely triggered since sentences rarely had two flagged words in the same node; with the real dictionary it showed up on nearly every sentence with multiple errors. Fixed by applying highlights from the highest offset down per text node, so each split only affects the already-processed tail. Verified live: a 5-misspelling sentence now gets all 5 words highlighted with correct suggestions, "Ignore" and toggle on/off still work cleanly, and the original false-positive words no longer appear.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
