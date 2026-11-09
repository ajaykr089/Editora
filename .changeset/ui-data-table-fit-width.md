---
'@editora/ui-core': patch
---

`ui-data-table` with a few columns fits a narrow card: every table had a minimum width of 680px (620px on small screens), so a two- or three-column table scrolled sideways on a phone. The minimum now scales with the visible columns (about 100px each, not counting columns hidden by `hidden-columns` or by your CSS); wide tables keep the old minimum.
