---
'@editora/ui-core': patch
---

`ui-number-field` in a form: text typed since the field was last left is committed when the form reads or validates it (Safari and Firefox do not move focus to a clicked Submit button, so the form read the old, often empty, value), and an error appearing or clearing updates in place instead of re-rendering the field, which in Safari threw away the text being typed. Its required asterisk is hidden from screen readers.
