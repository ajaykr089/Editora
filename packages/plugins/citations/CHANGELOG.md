# @editora/citations

## 1.0.4

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 1.0.3

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.2

### Patch Changes

- bb45a9d: Fix bibliography entries getting a doubled period whenever the author, title, or source field already ends in one. `formatBibliographyEntry` unconditionally appended a literal `.` after each of those fields in every style - but APA/Chicago author names are conventionally entered as `Last, F.` (already period-terminated for the initial), so a real citation like author "Smith, J." rendered as "Smith, J.. (2024)." in the generated bibliography, for every one of the three supported styles.

  Found via live testing: inserting a citation with a standard APA-style author name produced a visibly doubled period in the "References" section. Fixed with a small helper that only appends a period when the field doesn't already end in sentence-terminal punctuation; verified live that APA, MLA, and Chicago bibliography entries all render with correct single punctuation.

- 365ed30: Fix the Citations panel giving sighted users no feedback at all when "Insert Citation" fails validation (e.g. a missing Title) or succeeds. The panel already computed the right message ("Author and title are required.", "Citation inserted.", etc.) and wrote it into a `.rte-citations-live` region - but that element is the standard visually-hidden "sr-only" pattern, meant only for screen readers via `aria-live`. A sighted user who forgot to fill a required field and clicked Insert saw literally nothing happen, with no indication why. Found via live-browser testing. Fixed by also writing the same message into a new, visible status line (red for errors, green for success), while leaving the existing screen-reader announcement untouched.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
