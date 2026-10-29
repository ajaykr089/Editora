---
'@editora/paste-cleaner': patch
---

`cleanPaste({ text })` works on a server without a DOM: plain text and Markdown no longer need the `parse` option, which is only required for HTML input. For text input, the result's `text` is the pasted text itself.
