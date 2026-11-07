---
'@editora/icons': minor
'@editora/ui-core': minor
---

Ship only the icons you use. `@editora/icons/glyphs` exports every built-in icon on its own (`checkIcon`, `chevronDownIcon`, ...) so a bundler keeps only the ones imported, and `@editora/icons/renderer` draws a definition with `renderIconDefinition(definition, options)` without loading the catalog (about 1.7 KB gzipped). In `@editora/ui-core`, `addIcons(checkIcon, searchIcon)` (from `@editora/ui-core/add-icons`, or the package root; only apps that use it ship its 1.7 KB renderer) registers icons by definition: they draw at once, keep their variants and weights, are found by their aliases, and the full set (about 46 KB gzipped) is only fetched when an icon that was not added is shown.
