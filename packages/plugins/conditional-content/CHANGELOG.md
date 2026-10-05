# @editora/conditional-content

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

- 2d30165: Fix inserting a conditional content block mid-paragraph producing invalid, corrupting HTML. `insertBlockAtSelection` inserted the `<section class="rte-conditional-block">` with `range.insertNode(block)` at the raw cursor position - the same invalid-nesting bug already fixed in the table and code-sample plugins. Because the block is sectioning content, not phrasing content, this isn't valid inside a `<p>`; on this demo page the corruption happened to be papered over by an unrelated MutationObserver that reprocesses paragraphs for translation segment IDs, which incidentally re-split the paragraph - but it also left the text that came after the cursor as bare, unwrapped text sitting directly under the editable root instead of back inside a paragraph, and a host application without that same side effect would see the raw invalid nesting.

  Found via live testing: inserting a conditional block in the middle of a sentence left the back half of that sentence orphaned outside any paragraph.

  Fixed by inserting the block as a sibling of its containing paragraph instead of at the raw cursor position (matching the table/code-sample/page-break pattern), with a defensive fallback that wraps any still-orphaned inline content in a `<p>` for the rare case no containing block can be found. Verified live for both a collapsed cursor and a text selection (which still correctly moves the selected text into the block's "if" body): the resulting HTML is unchanged by a reparse and no content is left outside a paragraph.

- a8b16eb: Fix conditional-content block headers becoming nearly illegible (light gray-white text on a pale cyan background) when Preview mode is toggled on inside a dark-themed editor. The preview-mode header background rule (`.rte-conditional-preview-on ... .rte-conditional-header { background: #ecfeff }`) was never theme-scoped, so it always applied - and because it combines more class/attribute selectors than the existing dark-mode header rule, it won on specificity and silently overrode the dark background back to its light-mode color, while the dark-mode text color rule (meant to pair with a dark background) stayed in effect. Found via a screenshot showing the condition text nearly unreadable. Fixed by adding a dark-theme-scoped override for the preview-mode header background, using a dark teal that stays visually distinct from the normal (non-preview) dark header, mirroring how the light theme distinguishes preview mode with a cyan tint.
- bb57fc7: Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
