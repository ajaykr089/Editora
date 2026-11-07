---
'@editora/ui-core': patch
---

`ui-form` keeps focus on the first field with an error. Showing the error re-rendered an Editora field right after it took focus, so focus fell back to the page, both for `setErrors` and for a submit that failed validation.
