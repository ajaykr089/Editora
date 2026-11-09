---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

Chart, DataTable and Stat (`variant="card"`) frames use the same corner radius as Card: `--base-card-radius`, falling back to `--ui-radius` + 2px. Side by side they used three different radii (Chart `--ui-radius` + 4px, Stat a fixed 16px from an undefined `--ui-radius-lg`), and a theme could not set one card radius for all of them.
