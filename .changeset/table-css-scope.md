---
'@editora/plugins': patch
'@editora/plugin-table': patch
---

The table plugin's stylesheet (part of `@editora/plugins/styles.css`) only styles tables inside an Editora editor. Its bare `table`, `th` and `td` selectors restyled every table on the page: a data table next to the editor got a 16px margin, a second border, cell borders and an 80px minimum cell width, and in dark mode the editor's table background.
