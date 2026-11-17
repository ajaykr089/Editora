---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

Library gaps found while building the admin templates:

- New web components `ui-page-header`, `ui-stat` and `ui-metric-card`, so apps without React get the page header and stat tiles React has had as `PageHeader`, `Stat` and `MetricCard`. The page title is a real heading (`h1` unless `heading-level` says otherwise), actions go in `slot="actions"` (a named group), and every text has an attribute and a slot of the same name. Entries: `@editora/ui-core/page-header`, `@editora/ui-core/stat`.
- `ui-form` events are typed: `submit`, `invalid`, `validate`, `dirty-change` and `autosave` are `CustomEvent`s with typed `detail` (TypeScript used to type a `submit` listener's event as the browser's `SubmitEvent`, so `event.detail.values` did not compile). `document.querySelector('ui-form')` returns `UIForm`.
- `ui-data-table layout="auto"` (React `layout="auto"`) sizes each column to its content instead of an equal share. Resizable and virtualized tables keep fixed columns.
- `Avatar` / `ui-avatar` take `tone="brand"`, like `Badge`.
