---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

DataTable for server-driven admin screens. `server-side` (React `serverSide`) shows the rows it is given as the current page and never sorts, filters or slices them itself, while still reporting sort, filter and page changes; `total-rows` (`totalRows`) drives the summary and pagination. `hidden-columns` (`hiddenColumns`) hides columns by key or index. Rows with `data-href` become links: a click anywhere on the row (not on a control in it) or Enter follows it through the shared `navigate` contract, so `NavigationProvider` or `onNavigate` can route it; modifier and middle clicks open a new tab.
