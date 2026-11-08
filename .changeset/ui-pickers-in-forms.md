---
'@editora/ui-core': patch
---

Date, time, date-time and date-range pickers take part in `ui-form`: their value is collected by `getValues()` and submit, `required` is checked, and `form.setErrors()` shows a message on them. Before, a picked date was missing from the form's values and a required picker was never checked.
