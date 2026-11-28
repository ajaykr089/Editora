---
'@editora/media-manager': patch
'@editora/plugins': patch
---

A resized picture keeps its shape on narrow screens. Resizing saved a fixed height (`style="width: 564px; height: 296px"`), so on a page whose stylesheet narrows pictures to the screen (`img { max-width: 100% }`) it was squashed, and with no such stylesheet it ran off a phone screen. It now saves `height: auto; max-width: 100%` with the `width` and `height` attributes, which still give the picture its shape while it loads.
