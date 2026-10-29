---
'@editora/plugins': patch
'@editora/plugin-table': patch
'@editora/core': patch
---

The table plugin no longer acts on tables outside Editora editors. Its page-wide selection and keyboard handlers treated a table in any contenteditable on the page as its own, so another editor or comment box next to Editora got resize handles and a wrapper (which the browser's undo left behind), the table toolbar, and Tab moving between its cells.
