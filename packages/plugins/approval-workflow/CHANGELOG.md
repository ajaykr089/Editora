# @editora/approval-workflow

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

- fd24d9c: Fix the `data-approval-locked` attribute and `rte-approval-locked-editor` CSS class (a diagonal-stripe "this document is locked" background) staying stale for one render after a document is approved. `updateEditorStatusAttributes` set the attribute and toggled the class from `state.locked` before updating it for the new status, so on the exact transition into "Approved" they kept reading the old, unlocked value - `contenteditable` was correctly disabled right away, but the visual lock indicator only appeared after some unrelated later action (e.g. adding a comment) happened to re-run the update. Found via live testing: approving a document showed the panel say "Locked" and made the content genuinely uneditable, but the striped locked-background never showed up until a second, unrelated state change occurred.

  Fixed by computing whether the editor will be locked up front, from the same condition used later, and using that value consistently for the attribute, the class, and the lock transition. Verified live: the attribute, class, and `contenteditable` now all flip together on approval, and reopening to draft correctly clears all three.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
