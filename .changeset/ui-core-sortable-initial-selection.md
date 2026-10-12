---
"@editora/ui-core": patch
---

Fix `<ui-sortable>` dropping a selection that is set before its items. The selection is kept only for ids that exist, so a `selection` that arrived before `items` (the order of a React render, or of a script that assigns `selection` first) was emptied and never read again once the items were there: a controlled `selection={['epic']}` showed "0 items selected". The selection is now read again whenever the items change.
