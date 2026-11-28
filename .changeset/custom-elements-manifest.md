---
"@editora/ui-core": minor
---

Ship a Custom Elements Manifest (`custom-elements.json`, linked from `package.json`'s `customElements` field), VS Code HTML custom data (`html-custom-data.json`), and template typings for Vue (`@editora/ui-core/vue`) and Svelte (`@editora/ui-core/svelte`). They list every element's attributes with their allowed values, events, slots, CSS parts and CSS custom properties, and are generated from the sources (`npm run generate:elements`, checked in CI). A new docs page covers Vue, Svelte, Angular and plain HTML.
