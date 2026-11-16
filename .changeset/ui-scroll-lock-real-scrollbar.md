---
'@editora/ui-core': patch
---

Dialogs, drawers and other overlays that lock page scrolling no longer push the page sideways. The lock reserved a scrollbar gutter on both `<html>` and `<body>` whether or not the page had a scrollbar, so on a page that did not scroll (or with overlay scrollbars) everything moved left when a dialog opened. It now measures the page's scrollbar once and makes up for exactly that, on `<html>` only.
