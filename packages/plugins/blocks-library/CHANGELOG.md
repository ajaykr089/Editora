# @editora/blocks-library

## 1.0.3

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.2

### Patch Changes

- c5569a5: Fix inserting a library block or document template mid-paragraph splitting the paragraph and leaving the text after the cursor as bare, unwrapped content instead of back inside a paragraph. Both plugins' multi-element HTML (headings, paragraphs, lists) was inserted with `range.insertNode()` at the raw cursor position, which - for a collapsed cursor inside a text node - splits that node and interleaves the inserted content between the two halves, with no guarantee the trailing half stays wrapped in a block element.

  Found via live testing: inserting a block/template in the middle of a sentence left the back half of that sentence sitting directly under the editable root, outside any paragraph.

  Fixed both by inserting the new content as a sibling of the containing paragraph instead of at the raw cursor position, matching the pattern already used by the table, code-sample, conditional-content, and page-break plugins. Verified live: the original paragraph now stays fully intact and the inserted content is appended cleanly after it, with no orphaned text and no change from a reparse.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
