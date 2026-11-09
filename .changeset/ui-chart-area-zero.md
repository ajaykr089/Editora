---
'@editora/ui-core': patch
---

`ui-chart`: area charts start their value axis at zero, as bar charts do. The filled area stood on a fitted baseline, so a revenue area on a $4,000 floor made a 40% dip look like a 90% one. Line, step and scatter charts keep the fitted axis.
