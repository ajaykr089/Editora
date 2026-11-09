---
'@editora/ui-core': patch
---

`ui-select`, `ui-multi-select` and `ui-combobox` build their option list when they open. A closed field used to keep its whole list in its shadow tree (about 180 to 220 elements for 50 options), which made filter-heavy pages large and test queries slow. `ui-radio-group` outlines also reach 3:1 (`--ui-color-field-border`), like `ui-radio`.
