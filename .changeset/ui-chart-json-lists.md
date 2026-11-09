---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

`ui-chart`: the `values` and `labels` attributes take a JSON array (`values="[12, 18, 9]"`, `labels='["Jan 1, 2026", "Feb 1, 2026"]'`) as well as comma-separated text. A JSON array used to lose its first and last value without a word (`[12` and `9]` are not numbers), and a label with a comma in it was split in two. The React `Chart` now passes `values` and `labels` as JSON, so labels such as "Jun 1, 2026" work.
