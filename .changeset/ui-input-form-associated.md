---
'@editora/ui-core': minor
---

`ui-input` is now form-associated: its value is part of a surrounding `<form>`'s `FormData`, `form.reset()` restores it, a `<fieldset disabled>` disables it, and its validity (`required`, `pattern`, `minlength`…) takes part in the form's constraint validation, so an empty `required` field now blocks a native submit like a native input does (add `novalidate` to the form to validate in JavaScript instead). Pressing Enter in `ui-input`, `ui-password-field` or `ui-number-field` submits the surrounding `<form>` (through its default submit button, which a disabled default button blocks, as natively) or `<ui-form>`; a keydown listener can still cancel it with `preventDefault()`.
