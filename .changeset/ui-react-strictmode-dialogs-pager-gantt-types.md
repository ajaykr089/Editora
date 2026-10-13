---
"@editora/ui-react": patch
---

Fix three problems found while running the README examples in a browser.

- `DialogProvider` and `AlertDialogProvider` did not work under React `StrictMode`, which Vite, Create React App and Next.js turn on in development: every `confirm()` or `prompt()` resolved at once as `dismiss` and no dialog appeared. StrictMode runs an effect's cleanup and setup again without rendering in between, and the cleanup had dropped the manager. The setup now brings the manager back, with the alert dialog's defaults.
- `<Pagination>` removed the `count` that a linked `<DataTable paginationId="...">` had written on it, because its own `count` prop was undefined, so the pager showed one page whatever the table held. It now only removes attributes it set itself.
- The Gantt types (`GanttTask`, `GanttLink`, `GanttTaskChangeDetail`, `GanttLinkSelectDetail`, `GanttTaskType`, `GanttZoom`, `GanttSort`, `GanttBarVariant`) were not exported from the package root, although the `Gantt` component needs them. They are now.
