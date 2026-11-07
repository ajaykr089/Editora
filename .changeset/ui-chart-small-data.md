---
'@editora/ui-core': patch
---

`ui-chart` with a few points: the plot kept a fixed minimum width (420px, 320px on small screens), so in a narrower card the last bars were cut off behind a hidden scrollbar; the minimum now scales with the number of points (about 28px each) and large datasets keep the old minimum. All-positive bar charts no longer show a negative tick on the y-axis, and negative values put the sign before the prefix (`-$1,990`, not `$-1,990`).
