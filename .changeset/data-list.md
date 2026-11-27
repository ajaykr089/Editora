---
"@editora/ui-core": minor
"@editora/ui-react": minor
"@editora/cli": patch
---

New `DataList` (and `ui-data-list`): label and value pairs (record details, order summaries, metadata) as a native description list, which screen readers announce as terms and their descriptions. Horizontal or vertical, sizes, a fixed label column (`labelWidth`), `divided` rows, label alignment, and an `items` shortcut for plain text; a horizontal list stacks when its container is narrower than 30rem. `editora add data-list` knows the new name.
