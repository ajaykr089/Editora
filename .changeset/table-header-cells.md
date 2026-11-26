---
'@editora/plugins': patch
'@editora/plugin-table': patch
---

Rows and columns added next to header cells are header cells. A column added to a table with a header row put a `<td>` into the header, and a row added above the header row was a row of `<td>`s inside `<thead>`. A new cell is now a `<th>` where it joins a header row or a header column; a row added below the header row is still a body row.
