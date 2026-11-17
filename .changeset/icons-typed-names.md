---
"@editora/icons": minor
---

Names are typed: every function that takes an icon name accepts `IconName` (the union of the 504 built-in names, so
they autocomplete) or any other string, and `IconName` is exported for typing names kept in your own data, where a
typo becomes a compile error. `renderIconDefinition` is now also exported from the package root, and
`getRegisteredIcon(name)` (root and `@editora/icons/renderer`) returns the icon `registerIcon` added or replaced under
a name. The `glyphs` and `renderer` subpaths now resolve in tools that ignore `exports` (Jest 27, webpack 4,
TypeScript's `node` resolution).
