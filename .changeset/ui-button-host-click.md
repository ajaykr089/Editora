---
'@editora/ui-core': patch
---

`ui-button`: calling `click()` on the element works like a native button: a `type="submit"` button submits its form (`<form>` or `ui-form`), `type="reset"` resets it, and a disabled button does nothing. It used to fire a click on the element only, so scripts and tests that clicked a submit button never submitted.
