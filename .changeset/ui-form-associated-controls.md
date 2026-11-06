---
'@editora/ui-core': minor
---

Textarea, Select, Checkbox, Switch, RadioGroup, PasswordField, NumberField, Slider and MultiSelect are form-associated, like Input: their value is in the surrounding `<form>`'s `FormData` (a checkbox or switch submits its `value`, default `on`, only when checked; MultiSelect and a range Slider submit one entry per value), `form.reset()` restores the value or checked state they had before the user changed them, a `<fieldset disabled>` disables them, and `required` takes part in the form's validation (an empty required field now blocks a native submit; add `novalidate` to validate in JavaScript). Also fixes `ui-slider` without `min`/`max` attributes, which clamped every value to 0.
