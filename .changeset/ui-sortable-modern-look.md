---
"@editora/ui-core": patch
"@editora/ui-sortable": patch
---

A new look for `<ui-sortable>`, and a few fixes that came with it.

- Flat, lightly bordered cards on a quiet surface, tight spacing (a list is about half as tall as before: the invisible drop rails no longer take up room), a faint drag grip that shows fully on hover, focus, selection and touch, and a guide line under nested cards. The first card no longer looks focused when nothing is.
- Dragging with the pointer now lifts the real card under the pointer (a copy, with a count badge for several items and a `+` for a copy), leaves an empty slot where it was, and marks the drop position with a thin line. The "Moving item" pill and the floating "Drop preview" box are gone. `drag-preview-size="compact"` now narrows the lifted card.
- Lists sit side by side and the board scrolls sideways when they do not fit (min width `--ui-sortable-list-min-size`, 260px), and it keeps its scroll position across renders and scrolls to a card dropped into a far list. Holding a card at the edge of the board, or of a list that has its own scrollbar (`::part(items)`), scrolls it.
- The "N items selected" line is hidden until something is selected. New parts: `items`, `drag-ghost`.
- The README pictures show the new look.
