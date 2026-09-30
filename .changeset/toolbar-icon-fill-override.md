---
"@editora/core": patch
"@editora/plugin-table": patch
---

Fix toolbar icons rendering as solid, unrecognizable blobs in the web component's light theme (found by the user, who diagnosed it precisely via devtools). `.editora-toolbar-button svg`/`.editora-toolbar-icon svg` forced `fill: currentColor` on every toolbar icon's root `<svg>` element - but many icons are authored as outlines: root `<svg fill="none">`, with child shapes carrying their own `stroke="currentColor"` and no `fill` of their own, relying on that root `fill="none"` to stay hollow. Since `fill` is CSS-inherited and a presentation attribute loses to a matching CSS rule, the blanket rule overrode `fill="none"` to `currentColor` on the root, which every fill-less child then inherited too - turning ~40 outline icons (confirmed by grepping every plugin's icon markup for `fill="none"` roots) solid. Same bug, same fix, in the table plugin's contextual toolbar (dark-mode-scoped there). The existing, more surgical dark-mode rules - which target only elements with an explicit `[fill="#000"]`/`[stroke="#000"]` attribute and override just those - were already correctly scoped and are unaffected.
