---
'@editora/plugins': patch
'@editora/plugin-link': patch
---

Links that open in the same tab no longer get `target="_self"`. The link dialog wrote it on every link it made or edited, which is noise in the saved HTML. Links that open in a new tab keep `target="_blank"` and `rel="noopener noreferrer"`, and unticking "Open in new window/tab" now removes both.
