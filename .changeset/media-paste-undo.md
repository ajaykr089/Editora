---
'@editora/media-manager': patch
'@editora/plugins': patch
---

Undo takes a pasted or dropped picture back in one step, with the paragraph it went into whole again. The paragraph was split for the upload's placeholder outside the undo history, so Undo removed the picture and left the paragraph in two, and nothing could join it. A failed or cancelled upload now joins it too. Text typed while the file uploads is still kept when the picture is undone.
