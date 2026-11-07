---
'@editora/ui-core': patch
---

Pagination renders the right pages on its first render: `page={1} count={3}` no longer shows a single page with Next disabled until the next tick. Keyboard focus also stays on Next/Previous (or the current page) after paging, instead of being lost when the buttons re-render.
