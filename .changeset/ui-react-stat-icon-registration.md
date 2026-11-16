---
'@editora/ui-react': patch
---

`Stat` and `MetricCard` load `ui-icon` themselves (as a separate chunk, on the client), so an icon name shows when they are imported on their own. Before, it rendered nothing unless something else had loaded the icon element. The lazy icon import in `Dropdown` and `Menu` no longer breaks a declarations-only build (`TS2307` for `@editora/ui-core/icon`).
