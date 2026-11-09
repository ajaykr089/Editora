---
'@editora/ui-react': patch
---

`ThemeProvider`: the `tokens` you pass win over a theme saved under `storageKey`, from the first render. The saved theme was applied first and replaced a moment later, so an app passing a dark theme showed the saved light one on load. The saved theme still applies when no `tokens` are passed.
