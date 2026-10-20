# Change Log

## 1.0.20

### Patch Changes

- dba8e5d: The default theme gives the toolbar buttons, the "more" button, dropdown menus, dialogs, the inline menu and the table toolbar an explicit text colour. Without one they took the browser's, which is white when a page sets `color-scheme: dark` (as `ui-grid` and other ui-core components do), so the icons were white on the white buttons and looked missing.

## 1.0.19

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

## 1.0.18

### Patch Changes

- 16ae8ee: Rewrite the READMEs of `@editora/light-code-editor`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/ui-sortable` and `@editora/toast`, which are the npm pages of these packages, with screenshots and examples.

  Their images and links were relative paths that npm cannot show, and several examples did not run. Every example is now a file that is type-checked in strict mode and run in Chromium (React ones under `StrictMode`, drag and drop with the pointer and the keyboard), and the README quotes it word for word (`npm run check:readme-examples`). The screenshots are taken from the same examples (`npm run readme:screenshots`).

  Things the READMEs now get right that they did not: the `@editora/themes` tokens only set text, border and shadow colours (backgrounds are set by rules), the helpers it exports are documented; `@editora/ui-core` and `@editora/ui-react` list measured bundle sizes (a Button imported from the `@editora/ui-react` root is 1 MB gzipped up front, from its own entry 54 KB up front plus the rest of `ui-core` loaded later); `@editora/toast` documents its defaults (bottom right, four seconds, three visible, theme `system`) and that it is safe to import on the server.

## 1.0.17

### Patch Changes

- bdc8294: Centre the check mark of a checked checklist item. The mark was a "✓" text glyph placed with hand-tuned `left` / `top` offsets, so where it landed depended on the font's glyph metrics: in practice it sat low and to the right of centre in the box. It is now an SVG laid over the exact box of the checkbox (the same size, border included) and centred in it, so it is centred whatever the font.

## 1.0.16

### Patch Changes

- e756a24: Fix the shared `InlineMenu` React component (used by any `type: "inline-menu"` toolbar item - currently Capitalization and Text Alignment) rendering with its hardcoded light colors even inside a dark-themed editor. The existing dark-mode CSS only matched via an ancestor selector (`[data-theme="dark"] .rte-inline-menu`); despite the menu remaining a DOM descendant of the dark-themed wrapper (it uses `position: fixed` for placement, not a body portal), the menu was still painting with its light-theme background live in the browser. Fixed by having the component itself detect the dark-theme context from its anchor button (the same approach `@editora/mentions` and the newly-fixed `@editora/slash-commands` use) and apply an explicit `rte-inline-menu-theme-dark` class, with matching CSS added as a robust fallback alongside the existing ancestor-selector rule. Verified live: correctly dark in a dark-themed editor, unchanged (light) in a light-themed one.
- 6efb2ba: Fix empty space left below the status bar in the React editor (light theme, and dark theme since it inherits the base rule). `.rte-editor .editora-statusbar-bottom { top: -32px; }` shifted the status bar visually upward with `position: relative`, which doesn't remove it from normal flow - the element still reserved its original, un-shifted space, leaving a 32px blank gap at the bottom of the editor card. This was dead leftover code with no legitimate purpose; removed.
- c913780: Fix toolbar icons rendering as solid, unrecognizable blobs (found by the user, who diagnosed it precisely via devtools), and fix a second, related contrast bug found while auditing the rest of the codebase for the same pattern.

  **Root cause 1 - outline icons turned solid.** Several stylesheets forced `fill: currentColor` on every toolbar icon's `<svg>` (or every descendant, via a `svg *` selector on active/pressed buttons) - `.editora-toolbar-button svg`/`.editora-toolbar-icon svg` in the web component's own styles, and the `@editora/themes` package's `index.css`, `default.css` and `dark.css` (base rules, active-state rules, and dark-theme rules alike). Many icons are authored as outlines - root `<svg fill="none">`, with child shapes carrying their own `stroke="currentColor"` and no fill of their own - relying on that root `fill="none"` to stay hollow. Since `fill` is CSS-inherited and a presentation attribute loses to a matching CSS rule, the blanket rule overrode `fill="none"` to `currentColor` on the root (or directly on every descendant), which every fill-less child then inherited too, turning ~40 outline icons (confirmed by grepping every plugin's icon markup for `fill="none"` roots) solid. `@editora/themes`'s `dark.css` had also grown five narrow, per-`data-command` `fill: none !important` workarounds (direction, anchor, spell-check, fullscreen) patching this same root cause one icon at a time; these are now redundant and removed.

  **Root cause 2 - solid-glyph icons losing contrast.** The first-pass fix (scoped to elements with an _explicit_ `fill="#000"`/`"black"` attribute) missed icons like Bold/Italic that declare no `fill` attribute at all and rely on SVG's implicit black default. Left unconverted, these icons stayed literally black even against a dark theme's toolbar background (near-invisible) or a colored active/pressed background (poor contrast) - a real, live-browser-verified regression from the first-pass fix, not present in the original bug report. Fixed by also converting the `<svg>` root to `currentColor` whenever it does _not_ declare `fill="none"` (`svg:not([fill="none" i])`), so fill-less solid icons inherit the button's intended text color while outline icons remain untouched.

  Verified live across both the web component and React (`@editora/react`, via `@editora/themes`), in light and dark themes, in both default and active/pressed button states.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.15](https://github.com/ajaykr089/Editora/compare/@editora/themes@1.0.10...@editora/themes@1.0.15) (2026-09-05)

**Note:** Version bump only for package @editora/themes

## 1.0.10 (2026-03-08)

**Note:** Version bump only for package @editora/themes

## 1.0.9 (2026-03-05)

**Note:** Version bump only for package @editora/themes

## 1.0.4 (2026-02-28)

### Changed

- Updated package publish metadata and declaration entrypoint resolution.

### Packaging

- Included top-level declaration entry in published files.

## 1.0.2 (2026-02-13)

**Note:** Version bump only for package @editora/themes

## 1.0.1 (2026-02-12)

**Note:** Version bump only for package @editora/themes
