---
"@editora/themes": patch
"@editora/core": patch
---

The theme stylesheets and the web component stylesheet build cleanly in webpack apps (Create React App, Docusaurus and the like). They used CSS nesting, which cssnano and clean-css do not understand: they turned a nested `.rte-toolbar-button` rule into a top-level one and merged the real one away, so every toolbar button lost its layout. And they used case-insensitive attribute selectors (`[fill="black" i]`), which postcss-preset-env polyfills by writing out every upper/lower-case form of the value: `dark.css` never finished building, and the web component CSS grew to about 1 MB. The rules are now written out flat, `:is()` groups whose parts have equal specificity are written as plain selector lists, and the attribute selectors list their lower-case, UPPER-CASE and Capitalized forms (a mixed-case value such as `#0F0f0F` no longer matches). In browsers the result is the same: no computed style changed on the editor, in the light, dark and acme themes.
