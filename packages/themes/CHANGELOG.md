# Change Log

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
