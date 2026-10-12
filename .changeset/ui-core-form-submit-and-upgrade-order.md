---
"@editora/ui-core": patch
---

Fix two ways `<ui-form>` did nothing in plain HTML, found while testing the README example.

- A `<ui-button type="submit">` (or `type="reset"`) inside a `<ui-form>` did nothing. The button looked for an ancestor `<form>`, but `<ui-form>` keeps its `<form>` in a shadow root, which `closest()` cannot see. It now calls the form's `requestSubmit()` and `reset()`.
- A form whose markup is on the page before the script that registers the elements had no values and validated nothing. Elements are upgraded in the order they were defined, so a control such as `<ui-input>` could be upgraded before `<ui-form>`, find no `registerField()` on it, and never register. The form now asks the controls inside it to register again once it is upgraded. (React and other code that creates the elements after the import was not affected.)
