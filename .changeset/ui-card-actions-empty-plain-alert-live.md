---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

`Card.Actions` puts buttons or menus on the title's row inside `Card.Header`, at the end, without a wrapper (the header was a single-column grid). `EmptyState variant="plain"` draws no box of its own, for use inside a Card, table or panel. `Alert live={false}` (`live="false"`) is a static page banner: no `role="alert"`/`status` and no `aria-live`, so it is not announced when the page loads. Also fixes Card without a footer, which had no padding under its content.
