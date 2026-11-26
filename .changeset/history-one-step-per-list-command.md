---
'@editora/plugins': patch
'@editora/plugin-history': patch
---

In Safari, Bullet list and Numbered list are one undo step again. WebKit reports these commands itself, and the list plugin then recorded its clean-up of the markup as a second step, so the first Undo only took back the clean-up. A second report of the same change, right after the first, now replaces it.
