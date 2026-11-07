---
'@editora/ui-core': patch
---

`ui-data-table` `pagination-id` works when the pager comes after the table in the page. It was looked up once when the table connected, so the usual layout (table, then pager) left paging dead; the pager is now found by id when needed.
