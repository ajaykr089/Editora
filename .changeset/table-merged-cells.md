---
'@editora/plugins': patch
'@editora/plugin-table': patch
---

The table's row and column commands work on tables with merged cells. They counted cells instead of columns, so once a cell spanned two columns (which the toolbar's own Merge does) a new row came out a cell short, a new column went in at different places in different rows, and Delete Column deleted the merged cell with all its text. A merged cell now grows over a row or column added inside it, Delete Column makes it narrower instead of removing it, and deleting the first row of a cell that spans rows keeps its text in the next row.
