---
'@editora/ui-core': patch
---

`ui-data-table`: `data-align="end"` (or `"center"`) on a column's `th` and `td` aligns it, with tabular figures for numbers. The table's own header style beat any app CSS, so a numeric column's header could not be right-aligned over its numbers.
