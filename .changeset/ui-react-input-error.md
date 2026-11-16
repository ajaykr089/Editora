---
'@editora/ui-react': patch
---

`Input` and `Textarea` take an `error` message, as `Select` already did: it shows under the field and marks it invalid. Without the prop, a surrounding `Form` manages the field's errors as before. Showing a server error on a field outside a `Form` used to need an `<Input.Error>` child plus `validation="error"`.
