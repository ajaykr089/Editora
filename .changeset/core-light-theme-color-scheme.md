---
"@editora/core": patch
---

A light-themed `<editora-editor>` stays readable on a dark page. On a site with `color-scheme: dark` (most dark modes), its toolbar buttons kept their white background but took the browser's dark-scheme text colour, so every icon was white on white. The light theme now declares `color-scheme: light`.
