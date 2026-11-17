---
"@editora/react-icons": minor
---

Named icons are tree-shakeable: each component is built from its own glyph in `@editora/icons/glyphs`, so
`<CheckIcon />` alone adds about 2.5 KB gzipped instead of the whole catalog (about 50 KB). New `defineIcon(definition,
displayName?)` makes a component from an icon definition without registering it. `<Icon name>` now autocompletes
built-in names. A built-in icon replaced with `registerIcon` is still drawn by its named component. `<Icon name>`,
`createIcon`, `icons` and `getIconComponent` still look names up and bring the whole catalog.
