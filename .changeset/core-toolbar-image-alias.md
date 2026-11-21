---
"@editora/core": patch
---

`toolbar="image"` now draws the image button. The `image` toolbar name pointed at an `openImageDialog` command that no plugin has, so it drew nothing; it now means `insertImage`, like the `insertImage` name.
