---
'@editora/ui-core': patch
---

`ui-data-table`: while loading, the words appear once, on the overlay over the rows; the status bar above the table stays for screen readers only, instead of repeating them. The first load says "Loading table data"; "Refreshing table data" is kept for when there are rows to refresh.
