---
'@editora/core': patch
---

`<editora-editor>` shows that it is loading while its plugins load on demand: the element gets `data-loading` and `aria-busy="true"`, drawn as a toolbar-shaped shimmer and a "Loading editor…" line (no animation under reduced motion), and both are removed when `editor-ready` fires. It used to be an empty box for a second or two.
