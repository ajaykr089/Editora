---
'@editora/ui-react': patch
---

`PageHeader` renders its title as a real heading (`<h1>` by default, `headingLevel` to change it), so screen-reader users can find the page title by heading. `FiltersBar`'s status select gets the accessible name "Status" when no `statusLabel` is given.
