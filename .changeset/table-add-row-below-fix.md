---
"@editora/plugin-table": patch
---

Fix "Add row below" in the table toolbar silently doing nothing. It called `table.insertBefore(newRow, table.rows[rowIndex + 1])` - but `insertBefore` requires the reference node to be a *direct* child of the node you call it on, and a table row's real parent is `<thead>`/`<tbody>`, never `<table>` itself. Every click threw an uncaught `NotFoundError` inside the button's `onclick` handler, which the browser silently swallows without disrupting the page, so the toolbar looked like it just wasn't responding. Found via live-browser testing (clicking the button produced no visible error, but instrumenting the handler directly surfaced the exception). Fixed by inserting relative to the target row's actual parent, matching the pattern the neighboring, already-correct "Add row above" command uses.
