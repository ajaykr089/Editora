---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

`ui-data-table`: the `row-select` event (React `onRowSelect`) carries `ids`, the `data-id` of every selected row, and `id`, the clicked row's. Apps could only get positions and cell text before, so acting on the selected records (delete, export) meant mapping text back to records.
