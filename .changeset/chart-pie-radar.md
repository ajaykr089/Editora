---
"@editora/ui-core": minor
"@editora/ui-react": minor
---

`Chart` has two new types: `pie` (filled wedges, one per point) and `radar` (one spoke per label and one polygon per series, for comparing several series across the same dimensions). Series and slice colours now come from `--ui-chart-1` to `--ui-chart-6`, which a theme can set; the defaults are six distinct hues. Before, the palette used the status colours, and in the default theme primary and warning are both amber, so the 1st and 3rd slices of a donut were the same colour.
