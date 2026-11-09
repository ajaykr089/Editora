---
'@editora/ui-core': patch
---

The `*` after a required field's label is hidden from screen readers in every field. Twelve fields (number field, date/time pickers and fields, file upload, multi-select, tags, pin input) left it readable, so "Amount" was announced "Amount star"; the control already says it is required.
