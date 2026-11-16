---
'@editora/ui-core': minor
---

`ui-data-table` (with `selectable`) works with a checkbox column the app renders: a checkbox with `data-row-select` in a row adds that row to (or takes it out of) the selection, and one with `data-select-all` in the header selects or clears the rows on the page. The table keeps every one of them checked, and select-all indeterminate, as the selection changes (row clicks, bulk clear). Plain `<input type="checkbox">` and `ui-checkbox` both work. Headers with `data-sort="false"`, and the select-all column, are not sortable.
