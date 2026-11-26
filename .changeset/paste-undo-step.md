---
'@editora/core': patch
'@editora/react': patch
---

A paste is an undo step of its own, in `<editora-editor>` and in the React editor. A plain-text paste (the default) was recorded as typing in Safari and not at all in Chrome, so one Undo after a paste also took back the words typed just before it. With `paste.keepFormatting`, pasted HTML was never recorded, and no `input` event (React: no `onChange`) said the content had changed.
