---
'@editora/ui-core': minor
---

Input and PasswordField accept your own native `<input slot="input">`, for sign-in forms: password managers and autofill could not reliably find an input inside the shadow root. The component keeps its label, styling, clear and show/hide buttons around your input but never changes its `name`, `type` (apart from the show/hide toggle), `autocomplete` or `placeholder`; the input is an ordinary form field (submitted once, Enter submits natively) and is named after the component's label unless you labelled it. Clicking the label focuses the field, with or without a slotted input.
