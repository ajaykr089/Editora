---
"@editora/ui-core": patch
---

Fix `<ui-sortable>` hiding the dragged card during a keyboard drag over "Nest inside <card>" when that card has no children yet. The branch check matched the exact string `class="item"` and so missed the placeholder (`item item-placeholder`); the card was gone from the screen until the drop.
