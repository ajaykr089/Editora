# Change Log

## 1.0.23

### Patch Changes

- ce68b95: Undo, dialogs, menus and a few plugins that did not do their job.

  **Undo and redo** (editor, web component and code editor):
  - Undo took back one character at a time and kept only the last 100 steps; typing is now grouped into words (a pause, a click, a caret key or Tab, undo and redo end a run; typing over a selection and deleting a selection are steps of their own) and 200 steps are kept.
  - After undo or redo the caret was left at the start of the document; it now goes back to the text that changed.
  - `<editora-editor>` never recorded typing, so Undo (the button and Cmd/Ctrl+Z) did nothing for typed text.
  - In the code editor, Ctrl/Cmd+Shift+Z undid again instead of redoing.

  **Keyboard and screen readers:**
  - Modal dialogs (Image, Video, Template, Preview, Math, Anchor, Code Sample, Emoji, Special Characters and the rest) now get a role and a name, take focus, keep Tab inside, and give the focus and the caret back when they close without changing the text.
  - The toolbar's block-type, font, alignment, line-height and capitalisation menus work with the keyboard in both `@editora/react` and `<editora-editor>`: they announce that they open a menu, take focus, move with the arrow keys, Home and End, choose with Enter or Space, and close with Escape.
  - The Spell Check panel is a named region; the Math dialog's controls are labelled; the media dialog's labels are tied to their fields, its tabs say which is selected, and its upload zone works with the keyboard.
  - In a table, Tab and Shift+Tab move between cells, and Tab in the last cell adds a row.
  - The Comments, Spell Check and Approval Workflow side panels take focus when they open, keep it when they redraw, and give it back to the editor when they close.
  - The Text Color and Background Color pickers could not be used from the keyboard: they opened without taking the focus and sat at the end of the page. They are now named dialogs that take the focus, keep Tab inside, and give the focus and the selection back to the text when they close.
  - Dialogs keep Tab inside in Safari, which does not Tab to buttons by default (the trap used to move the focus only at the first and last control).
  - The slash menu and the mention list tell a screen reader which suggestion is active, and the media dialog's hidden file input has a name.

  **Behaviour fixes:**
  - A URL can be typed in the Image and Video dialogs (the dialog was rebuilt on every keystroke, so only pasting worked), what is pasted there is escaped, and inserting media tells the editor, records Undo and puts the caret after it.
  - The slash menu ran a block command on the previous or next paragraph when the line was otherwise empty; it also now asks every command bridge before the browser's own command, so lists made from it match the toolbar.
  - Dialogs and panels pass an axe-core sweep in the light and dark themes: names for the code sample language select and the background colour input, tabs inside a tablist, text contrast of at least 4.5:1, and no `main` landmark inside the version diff dialog.
  - The floating toolbar of an image inside a link no longer lands on top of the editor toolbar.
  - Cycling the citation style (toolbar button or shortcut) now updates the Style dropdown in the Citations panel; it kept showing the old style.
  - Making a paragraph a list no longer leaves an empty paragraph before and after it, or moves the caret to the start of the line.
  - Choosing a heading keeps the selection.
  - The Math dialog opens with no network (KaTeX comes from the `katex` package, not a script from a CDN) and renders formulas with its layout rules embedded; its template grid no longer hides its last row.
  - Export Word no longer sends a request to `http://localhost:3001` on every click: there is no default API server any more, and with none configured the file is built in the browser. To use a backend, set `apiUrl` (`setGlobalApiConfig` or `setDocumentManagerConfig`). An empty `apiUrl` on a plugin now means "no API".
  - Spell-check suggestions rank the word that was meant first ("tset" gives "test", "wrods" gives "words").
  - The Comments panel no longer lies under the editor toolbar (a CSS variable was defined on the wrong element and the sticky toolbar sat above the panel).
  - Format Painter no longer writes styles the target already shows, so painting leaves no redundant inline styles.
  - Plugins no longer use the browser's `confirm()` and `prompt()`: removing media or a link, resizing, and discarding Source Editor changes use an in-page dialog with a named role, focus trap and Escape.
  - Undo history is capped by size as well as by count (about 40 million characters), and steps that start where the last one ended share a string, so a very large document no longer holds hundreds of copies.
  - Messages such as "Please select text first" appear in a live region instead of a blocking `alert()`.

- Updated dependencies [ce68b95]
  - @editora/core@1.0.24
  - @editora/light-code-editor@1.0.19

## 1.0.22

### Patch Changes

- e0c6fb4: Rewrite the READMEs of `@editora/core`, `@editora/react` and `@editora/plugins`, which are the npm pages of the three packages.

  The old READMEs documented APIs that do not exist (`createEditor({ content, onChange })` with `mount()` and `getJSON()` in core; `useEditor`, `useEditorState`, `ToolbarButton` and `ParagraphPlugin` in react; a catalog with subscript, superscript, audio and horizontal-rule plugins in plugins), and their images used relative paths that npm cannot show. The new ones describe what the packages do, with screenshots and examples:

  - every example is a file that is type-checked in strict mode and run in Chromium, and the README quotes it word for word (`npm run check:readme-examples`);
  - the screenshots are taken from the same examples (`npm run readme:screenshots`);
  - core: the `<editora-editor>` element, its attributes, methods and events, the two bundles, and the sanitising rules;
  - react: the props, the toolbar item names, the editor API, themes, and how to use the editor with Next.js (it cannot be imported on the server, so load it with `next/dynamic` and `ssr: false`);
  - plugins: all 56 plugins with their toolbar item, entry point and import path, plus measured bundle sizes: importing one plugin from the root entry bundles the whole catalog (125 KB gzipped), `lite` costs 24 KB and a subpath import 1 KB.

- Updated dependencies [e0c6fb4]
- Updated dependencies [16ae8ee]
  - @editora/core@1.0.23
  - @editora/light-code-editor@1.0.18

## 1.0.21

### Patch Changes

- da5bebd: Fixes from a real-browser audit of the UI packages.

  **ui-react / ui-sortable:** `className` was rendered as a literal `classname` attribute on custom-element hosts under React 16-18, so it never applied (about 115 wrappers); it is now mapped to `class`. Alert, Badge, Container, ContextMenu, DataTable, EmptyState, Field, Flex, Grid, Skeleton, Table, NavigationMenu and FloatingOverlay now forward refs. `Sortable` no longer crashes while `lists`/`items` are still undefined.

  **ui-core:** invalid selectors in `item-selector`, `direct-item-selector`, portal `target` and positioner `anchor`, and negative or oversized textarea `minlength`/`maxlength`, no longer throw. The transfer list, sortable lists, tab panels, multi-select, date-time picker and colour picker expose accessible names. `<ui-sortable>`: horizontal lanes now actually lay out horizontally; dropping on an empty list or below the last card works and a release no longer commits a stale target; keys typed into controls inside a card are no longer swallowed; keyboard dragging no longer stalls with `allow-nesting="false"`; a cancelled drag no longer leaves a card faded; right-to-left lanes navigate and drop in reading order; dragging near the page edge auto-scrolls.

  **collaboration:** content received from peers can no longer execute (scripts, event handlers, `javascript:` URLs and embeds are filtered), a destroyed binding fully detaches, a caller-supplied doc is no longer destroyed, a supplied provider's own doc is used, editors without an id no longer share the empty room, and a warning is logged when the public demo server is used by default.

  **plugins:** 39 duplicate/generic ids (e.g. `id="icon"`) removed from toolbar icon SVGs.

  **core / react:** the editing surface always has an accessible name (host `aria-label`, then the placeholder, then "Rich text editor").

- Updated dependencies [da5bebd]
  - @editora/core@1.0.20

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
