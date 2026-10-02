---
"@editora/core": patch
"@editora/plugin-table": patch
"@editora/themes": patch
---

Fix toolbar icons rendering as solid, unrecognizable blobs (found by the user, who diagnosed it precisely via devtools), and fix a second, related contrast bug found while auditing the rest of the codebase for the same pattern.

**Root cause 1 - outline icons turned solid.** Several stylesheets forced `fill: currentColor` on every toolbar icon's `<svg>` (or every descendant, via a `svg *` selector on active/pressed buttons) - `.editora-toolbar-button svg`/`.editora-toolbar-icon svg` in the web component's own styles, and the `@editora/themes` package's `index.css`, `default.css` and `dark.css` (base rules, active-state rules, and dark-theme rules alike). Many icons are authored as outlines - root `<svg fill="none">`, with child shapes carrying their own `stroke="currentColor"` and no fill of their own - relying on that root `fill="none"` to stay hollow. Since `fill` is CSS-inherited and a presentation attribute loses to a matching CSS rule, the blanket rule overrode `fill="none"` to `currentColor` on the root (or directly on every descendant), which every fill-less child then inherited too, turning ~40 outline icons (confirmed by grepping every plugin's icon markup for `fill="none"` roots) solid. `@editora/themes`'s `dark.css` had also grown five narrow, per-`data-command` `fill: none !important` workarounds (direction, anchor, spell-check, fullscreen) patching this same root cause one icon at a time; these are now redundant and removed.

**Root cause 2 - solid-glyph icons losing contrast.** The first-pass fix (scoped to elements with an *explicit* `fill="#000"`/`"black"` attribute) missed icons like Bold/Italic that declare no `fill` attribute at all and rely on SVG's implicit black default. Left unconverted, these icons stayed literally black even against a dark theme's toolbar background (near-invisible) or a colored active/pressed background (poor contrast) - a real, live-browser-verified regression from the first-pass fix, not present in the original bug report. Fixed by also converting the `<svg>` root to `currentColor` whenever it does *not* declare `fill="none"` (`svg:not([fill="none" i])`), so fill-less solid icons inherit the button's intended text color while outline icons remain untouched.

Verified live across both the web component and React (`@editora/react`, via `@editora/themes`), in light and dark themes, in both default and active/pressed button states.
