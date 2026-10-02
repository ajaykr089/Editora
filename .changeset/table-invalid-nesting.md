---
"@editora/plugin-table": patch
---

Fix inserted tables producing invalid HTML that silently corrupts on any reparse (undo/redo snapshots, copy-paste, or any sanitizer that round-trips through `innerHTML`). Two separate invalid-nesting issues, both constructed via direct DOM calls that the browser renders as-is without validating:

- `insertTableCommand` inserted the `<table>` with `range.insertNode(table)` at the raw cursor position, nesting it inside whatever block element (usually a `<p>`) the cursor was in. A `<table>` isn't valid content inside a `<p>`, so reparsing the HTML auto-closed the paragraph at the table boundary, splitting it in two.
- The table-level resize handle was appended as a direct child of `<table>` (`table.appendChild(tableResizeHandle)`), which is just as invalid - `<table>` can only contain `<thead>`/`<tbody>`/`<tfoot>`/`<tr>`/etc. Reparsing foster-parented the handle to just before the table, breaking its `position: absolute` anchor (which is relative to the table) and moving it to a visually wrong spot.

Both bugs are latent until the first reparse, which `history`'s undo/redo already does on every snapshot restore (`editor.innerHTML = snapshot.innerHTML`) - so inserting a table and then undoing or redoing any edit would corrupt it.

Fixed by inserting the table as a sibling of its containing block instead of at the raw cursor position (matching the pattern already used by the page-break plugin), and by wrapping the table in a `.rte-table-wrapper` div that holds the resize handle as the table's sibling instead of its child - self-healing, so tables inserted before this fix get wrapped the first time they're interacted with. `deleteTableCommand` now removes the whole wrapper instead of leaving it and the handle behind as orphaned elements. Verified live: insertion, add/delete row, table-level resize, and delete-table all produce markup that survives a reparse unchanged, and the resize handle's on-screen position is pixel-identical to before.
