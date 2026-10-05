# @editora/code-sample

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

- 2d30165: Fix inserted code blocks producing invalid HTML that silently corrupts on reparse (undo/redo snapshots, copy-paste, or any sanitizer round-tripping through `innerHTML`). `insertCodeBlock` inserted the `<pre>` with `range.insertNode(pre)` at the raw cursor position, nesting it inside whatever block (usually a `<p>`) the cursor was in - `<pre>` isn't valid content inside a `<p>`, so reparsing the HTML auto-closes the paragraph at the `<pre>` boundary, splitting it in two.

  Found via live testing, the same way the identical bug was found in the table plugin: inserting a code sample mid-paragraph and reparsing the resulting HTML produced different markup than what was live in the editor.

  Fixed by inserting the code block as a sibling of its containing block instead of at the raw cursor position, matching the pattern already used by the page-break and table plugins. Verified live that the resulting markup is byte-identical after a reparse.

- ed63c6a: Fix duplicate, stacked modal overlays when a toolbar dialog command (Insert Code Sample, Embed Content, Insert Template, Anchor, Insert Link, Insert Math) is invoked again while its dialog is already open - e.g. a double-click on the toolbar button, or clicking it again before noticing the dialog already opened. Each of these six plugins created a brand-new full-viewport overlay + dialog on every invocation with no check for an existing one, so repeated invocations left several independent overlays stacked in the DOM at once; closing the topmost one (via Escape, Cancel, or the X button) revealed another leftover dialog underneath instead of returning to the editor. Found via live-browser testing that simulated a user re-opening the same dialog rapidly. Fixed by removing/closing any existing instance of the dialog before creating a new one, matching the guard already correctly implemented in `@editora/conditional-content`, `@editora/data-binding`, `@editora/merge-tag`, `@editora/emojis`, and `@editora/version-diff`.
- bb57fc7: Fix several ways of losing content. Table: Select All then Insert Table replaced the whole document. Checklist: converting loose root-level text deleted it. Link: a multi-block selection was flattened into a single plain-text `<a>`; it now links per block. code-sample: blocks decayed into a stray "Copy" text node with dead handlers after the first keystroke; they are now `<pre data-lang><code>` with delegated handlers. translation-workflow: unlocking made segments editable in read-only editors. light-code-editor: Backspace beside an emoji left a lone surrogate, Tab replaced a multi-line selection with spaces (it now indents/outdents lines), Replace All needed one Undo per match, and Alt/Cmd+Backspace deleted a single character. markdown-editor: the rich editor remounted on every keystroke and lost focus, and the toolbar inserted a literal `\n`.
- bb57fc7: Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
- bb57fc7: Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
