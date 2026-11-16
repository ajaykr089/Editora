---
'@editora/ui-react': patch
---

`FiltersBar`: while the date range picker's code loads, an inert copy of the empty field holds its place (same height, border, radius and label), instead of an invisible gap that the field appeared in a moment later.
