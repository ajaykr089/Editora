# Change Log

## 1.0.20

### Patch Changes

- f1326f5: Sanitise HTML in three plugins that handled it with hand-rolled code. The preview dialog and the source-view "Save" used a blacklist on a live detached `<div>` (so `<img onerror>` ran during the cleanup, and `javascript:` links with leading whitespace, mixed case or an embedded newline kept their `href`); importing a `.docx` assigned Mammoth's unsanitised output straight into the editor, and the Word/PDF export parsed the document into a live `<div>`. They now use a shared DOMPurify-based helper (formatting, tables, links and images are kept; scripts, event handlers, `javascript:`/non-image `data:` URLs, `srcdoc`, `<style>`, forms, `<base>` and `<meta>` are removed) and an inert `DOMParser` for read-only traversal.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 1.0.19

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.18

### Patch Changes

- bb57fc7: Fix several ways of losing content. Table: Select All then Insert Table replaced the whole document. Checklist: converting loose root-level text deleted it. Link: a multi-block selection was flattened into a single plain-text `<a>`; it now links per block. code-sample: blocks decayed into a stray "Copy" text node with dead handlers after the first keystroke; they are now `<pre data-lang><code>` with delegated handlers. translation-workflow: unlocking made segments editable in read-only editors. light-code-editor: Backspace beside an emoji left a lone surrogate, Tab replaced a multi-line selection with spaces (it now indents/outdents lines), Replace All needed one Undo per match, and Alt/Cmd+Backspace deleted a single character. markdown-editor: the rich editor remounted on every keystroke and lost focus, and the toolbar inserted a literal `\n`.
- bb57fc7: Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
- bb57fc7: Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
- bb57fc7: Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
- e74d395: Add the new `@editora/collaboration` plugin to the bundle (`./collaboration` subpath export, plus `CollaborationPlugin` in the main and `enterprise` barrels), matching how every other plugin package is aggregated here.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.17](https://github.com/ajaykr089/Editora/compare/@editora/plugins@1.0.10...@editora/plugins@1.0.17) (2026-09-05)

### Bug Fixes

- **plugins:** externalize @editora/light-code-editor in aggregator build ([24d5194](https://github.com/ajaykr089/Editora/commit/24d5194cafa2f88e403bef5511cb245a0cb96ef1))
- **plugins:** fix broken/missing vite configs across 14 plugin packages ([47c3e79](https://github.com/ajaykr089/Editora/commit/47c3e79a17d0ccdc371fc0ef404de4851565c0ca))

## 1.0.10 (2026-03-08)

**Note:** Version bump only for package @editora/plugins

## 1.0.9 (2026-03-05)

**Note:** Version bump only for package @editora/plugins

## 1.0.4 (2026-02-28)

### Changed

- Updated package publish metadata and declaration entrypoint resolution.
- Standardized plugin subpath type mappings to use shipped root declarations.

### Packaging

- Included top-level declaration entry in published files.
- Updated `@editora/core` peer/dev range to `^1.0.4`.

## 1.0.2 (2026-02-13)

**Note:** Version bump only for package @editora/plugins

## 1.0.1 (2026-02-12)

**Note:** Version bump only for package @editora/plugins
