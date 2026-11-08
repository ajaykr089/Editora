---
'@editora/ui-core': minor
'@editora/ui-react': patch
---

`ui-sidebar`: the space between rows was a fixed 8px. It is now `--ui-sidebar-row-gap` (or `--base-sidebar-row-gap` from a wrapper), attribute `row-gap`, React `rowGap`. `itemGap` stays the space inside a row.
