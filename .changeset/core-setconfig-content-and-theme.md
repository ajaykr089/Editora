---
"@editora/core": patch
---

Fix two options of `<editora-editor>.setConfig()` that were accepted and then ignored.

- `setConfig({ content })` now replaces the content, for an editor that is already running and for one that is not in the page yet (it outranks the element's own markup). The editor was rebuilt from the content it already held, so the new content was dropped. The value is used once: a later rebuild, such as a `plugins` attribute change, resumes from what the user typed, not from the value passed here. It is sanitised like any other content that comes from outside.
- `setConfig({ theme: 'dark' })` now swaps the theme class. It added `editora-theme-dark` next to the existing `editora-theme-light`, so the editor carried both. Changing the `theme` attribute had the same problem whenever more than one theme class was present, because the old classes were removed while the class list was being walked, which skips every other one.
