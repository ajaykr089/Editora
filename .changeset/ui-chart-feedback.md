---
'@editora/ui-core': minor
'@editora/ui-react': patch
---

`ui-chart` (React `Chart`):

- `show-summary="false"` also hides the readout line under the plot (range and change, or the selected point). `show-insight` (React `showInsight`) shows or hides that line on its own.
- No status pill while the state is idle: it said "Live" on every chart, title or not. An empty header is hidden (its `display: flex` beat the `hidden` attribute).
- The plot fits its card by default: `--ui-chart-plot-min-width` is now `0px` (set a width to keep dense data legible and scroll instead), and the last point's hit target no longer sticks out and adds a 7px scrollbar.
- Series and point `tone` accepts theme tone names (`success`, `danger`, `warning`, `info`, `primary`, `accent`, `neutral`) as well as colours; names used to draw black.
- A single dataset is no longer called "Series 1" in the tooltip.
- The value axis no longer crosses zero when no value does (₹-230 under data that is all 0 or more).
- Numbers follow `locale` (React `locale`), else the nearest `lang` attribute, so `en-IN` gives 1,00,000.
