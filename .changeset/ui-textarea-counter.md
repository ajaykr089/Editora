---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

`ui-textarea` takes `counter` (as `ui-input` does) as well as `show-count`, and React `Textarea` takes `counter` as well as `showCount`. The same character count had a different name on the two fields.
