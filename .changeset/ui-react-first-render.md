---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

React wrappers are correct on the first render: the element renders once with every prop applied, in the same commit, instead of showing its defaults until the next microtask (a test reading the shadow DOM straight after `render()` saw, for example, an Input without its label or a Meter without its value). Wrapper event listeners are attached before that render, so an event the element dispatches while rendering is no longer missed. `ui-rating` no longer drops an `aria-label` that is set after it named itself. New `flushPendingRender()` on every element runs a queued render immediately.
