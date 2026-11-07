---
'@editora/ui-core': minor
'@editora/ui-react': minor
---

Forms can show errors from a server response. `ui-form` has `setErrors({ email: 'Already registered' })`, `clearErrors(names?)` and `getErrors()`, and React's `Form` an `errors` prop that applies each new object once. Messages show on Editora fields as their own validation errors and on native inputs as their validity message with `aria-invalid`; the first field with an error, in page order, is focused. An error clears when its field is edited, and all of them when the form is validated or submitted again, so they never block the next attempt.
