---
'@editora/ui-core': patch
---

`ui-chart`: the value axis of line, area, step, scatter and bar charts lands on round numbers. The five gridlines read `$0, $15,000, $30,000, $45,000, $60,000` instead of `$0, $13,565, $27,130…`, and small values keep the decimals the step needs (`0.25`, not `0.3`).
