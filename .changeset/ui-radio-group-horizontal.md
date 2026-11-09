---
'@editora/ui-core': patch
---

`ui-radio-group` with `orientation="horizontal"` puts plain radios side by side at their own width, wrapping when needed. Each option took a 160px column, so in a narrow form column three short choices stacked one per line even though the group was horizontal. Card and segmented groups keep their columns.
