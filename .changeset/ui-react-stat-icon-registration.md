---
'@editora/ui-react': patch
---

`Stat` and `MetricCard` register `ui-icon` themselves, so an icon name shows when they are imported on their own (it rendered nothing unless something else had loaded the icon element). The lazy icon import in `Dropdown` and `Menu` no longer breaks a declarations-only build (`TS2307` for `@editora/ui-core/icon`).
