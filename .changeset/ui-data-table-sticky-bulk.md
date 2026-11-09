---
'@editora/ui-core': patch
---

`ui-data-table`: the bulk actions bar that appears when rows are selected sticks to the bottom of the window while the table is in view (`--ui-data-table-bulk-offset`, 16px). It sat under the last row, so on a table taller than the window, selecting a row near the top showed nothing.
