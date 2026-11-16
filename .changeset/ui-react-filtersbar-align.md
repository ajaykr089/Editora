---
'@editora/ui-react': patch
---

`FiltersBar`: fields line up on their input boxes, so giving one filter a visible label (`statusLabel="Category"`) no longer pushes it below the search field. The search field is announced as "Search" when it has no `searchLabel`; it had only its placeholder, which is not an accessible name.
