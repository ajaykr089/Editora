---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

`ui-sortable` `page-styles` (React `Sortable` `pageStyles`): your page's stylesheets also apply to `renderItem` / `renderListHeader` content, which is drawn inside the sortable's shadow root where app CSS classes did not reach (kanban cards had to be styled inline). The page's CSS is adopted in a cascade layer, so it styles your markup but never overrides the sortable's own look, and it follows stylesheets added later. The primitive behind it, `adoptPageStyles`, lives in `primitives/page-styles`.
