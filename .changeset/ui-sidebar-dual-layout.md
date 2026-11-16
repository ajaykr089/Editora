---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

`ui-sidebar layout="dual"` (React `<Sidebar layout="dual">`): an icon rail plus a panel, as in Slack or Supabase.

- Top-level items become the rail (icon with a short label; a top-level item's `section` change draws a divider). An item with `children` is an area: clicking it shows its pages in the panel, under its label and `description`. A top-level item without children is a link or button on the rail.
- The panel follows `value`: it opens the area holding the current page. A rail click only changes the panel, not the value, and fires `area-change` (React `onAreaChange`).
- `collapsed` hides the panel and keeps the rail (the area holding the current page stays marked). With `collapsible`, a click on the open area folds the panel away and any area click opens it again.
- `width`, `min-width`, `max-width` and resizing size the panel; `--ui-sidebar-rail-width` (72px) sizes the rail. Header, search, promo and footer slots sit in the panel; new `rail-start` / `rail-end` slots (React `Sidebar.RailStart` / `Sidebar.RailEnd`) hold a logo or avatar on the rail.
- Keyboard: Up/Down walk the rail, Right moves into the panel, Left goes back to the rail. Works with every `variant`.
