---
'@editora/ui-core': patch
---

`ui-chart`: the title and subtitle use the same type as a Card's title and description (18px bold / 14px), so a chart next to a card on a dashboard no longer looks like a smaller, different component. `--ui-chart-title-size`, `--ui-chart-title-line-height`, `--ui-chart-subtitle-size` and `--ui-chart-subtitle-line-height` change them.
