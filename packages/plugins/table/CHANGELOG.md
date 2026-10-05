# @editora/plugin-table

## 1.0.6

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.5

### Patch Changes

- bb57fc7: Fix several ways of losing content. Table: Select All then Insert Table replaced the whole document. Checklist: converting loose root-level text deleted it. Link: a multi-block selection was flattened into a single plain-text `<a>`; it now links per block. code-sample: blocks decayed into a stray "Copy" text node with dead handlers after the first keystroke; they are now `<pre data-lang><code>` with delegated handlers. translation-workflow: unlocking made segments editable in read-only editors. light-code-editor: Backspace beside an emoji left a lone surrogate, Tab replaced a multi-line selection with spaces (it now indents/outdents lines), Replace All needed one Undo per match, and Alt/Cmd+Backspace deleted a single character. markdown-editor: the rich editor remounted on every keystroke and lost focus, and the toolbar inserted a literal `\n`.
- bb57fc7: Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
- 30bac04: Fix "Add row below" in the table toolbar silently doing nothing. It called `table.insertBefore(newRow, table.rows[rowIndex + 1])` - but `insertBefore` requires the reference node to be a _direct_ child of the node you call it on, and a table row's real parent is `<thead>`/`<tbody>`, never `<table>` itself. Every click threw an uncaught `NotFoundError` inside the button's `onclick` handler, which the browser silently swallows without disrupting the page, so the toolbar looked like it just wasn't responding. Found via live-browser testing (clicking the button produced no visible error, but instrumenting the handler directly surfaced the exception). Fixed by inserting relative to the target row's actual parent, matching the pattern the neighboring, already-correct "Add row above" command uses.
- a24ca1a: Fix inserted tables producing invalid HTML that silently corrupts on any reparse (undo/redo snapshots, copy-paste, or any sanitizer that round-trips through `innerHTML`). Two separate invalid-nesting issues, both constructed via direct DOM calls that the browser renders as-is without validating:

  - `insertTableCommand` inserted the `<table>` with `range.insertNode(table)` at the raw cursor position, nesting it inside whatever block element (usually a `<p>`) the cursor was in. A `<table>` isn't valid content inside a `<p>`, so reparsing the HTML auto-closed the paragraph at the table boundary, splitting it in two.
  - The table-level resize handle was appended as a direct child of `<table>` (`table.appendChild(tableResizeHandle)`), which is just as invalid - `<table>` can only contain `<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/etc. Reparsing foster-parented the handle to just before the table, breaking its `position: absolute` anchor (which is relative to the table) and moving it to a visually wrong spot.

  Both bugs are latent until the first reparse, which `history`'s undo/redo already does on every snapshot restore (`editor.innerHTML = snapshot.innerHTML`) - so inserting a table and then undoing or redoing any edit would corrupt it.

  Fixed by inserting the table as a sibling of its containing block instead of at the raw cursor position (matching the pattern already used by the page-break plugin), and by wrapping the table in a `.rte-table-wrapper` div that holds the resize handle as the table's sibling instead of its child - self-healing, so tables inserted before this fix get wrapped the first time they're interacted with. `deleteTableCommand` now removes the whole wrapper instead of leaving it and the handle behind as orphaned elements. Verified live: insertion, add/delete row, table-level resize, and delete-table all produce markup that survives a reparse unchanged, and the resize handle's on-screen position is pixel-identical to before.

- b9b30aa: Fix the floating table toolbar rendering as unstyled default `<button>` elements (visible OS borders, no icon/hover/dark-mode styling) instead of the app's design system. Unlike every sibling plugin with custom UI (comments, citations, preview, track-changes - all of which self-inject a `<style>` tag at runtime), this plugin only shipped its CSS as a static `table.css` import, relying on the consuming app's bundler to pick it up. A consumer using the web component build - which doesn't process arbitrary plugin CSS imports through a bundler the way a React app's Vite/webpack config does - never got this CSS at all. Now self-injects the toolbar's styles at runtime, matching the established sibling-plugin pattern, so the toolbar is correctly styled regardless of how the plugin was loaded.
- c913780: Fix toolbar icons rendering as solid, unrecognizable blobs (found by the user, who diagnosed it precisely via devtools), and fix a second, related contrast bug found while auditing the rest of the codebase for the same pattern.

  **Root cause 1 - outline icons turned solid.** Several stylesheets forced `fill: currentColor` on every toolbar icon's `<svg>` (or every descendant, via a `svg *` selector on active/pressed buttons) - `.editora-toolbar-button svg`/`.editora-toolbar-icon svg` in the web component's own styles, and the `@editora/themes` package's `index.css`, `default.css` and `dark.css` (base rules, active-state rules, and dark-theme rules alike). Many icons are authored as outlines - root `<svg fill="none">`, with child shapes carrying their own `stroke="currentColor"` and no fill of their own - relying on that root `fill="none"` to stay hollow. Since `fill` is CSS-inherited and a presentation attribute loses to a matching CSS rule, the blanket rule overrode `fill="none"` to `currentColor` on the root (or directly on every descendant), which every fill-less child then inherited too, turning ~40 outline icons (confirmed by grepping every plugin's icon markup for `fill="none"` roots) solid. `@editora/themes`'s `dark.css` had also grown five narrow, per-`data-command` `fill: none !important` workarounds (direction, anchor, spell-check, fullscreen) patching this same root cause one icon at a time; these are now redundant and removed.

  **Root cause 2 - solid-glyph icons losing contrast.** The first-pass fix (scoped to elements with an _explicit_ `fill="#000"`/`"black"` attribute) missed icons like Bold/Italic that declare no `fill` attribute at all and rely on SVG's implicit black default. Left unconverted, these icons stayed literally black even against a dark theme's toolbar background (near-invisible) or a colored active/pressed background (poor contrast) - a real, live-browser-verified regression from the first-pass fix, not present in the original bug report. Fixed by also converting the `<svg>` root to `currentColor` whenever it does _not_ declare `fill="none"` (`svg:not([fill="none" i])`), so fill-less solid icons inherit the button's intended text color while outline icons remain untouched.

  Verified live across both the web component and React (`@editora/react`, via `@editora/themes`), in light and dark themes, in both default and active/pressed button states.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
