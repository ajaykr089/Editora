---
'@editora/ui-core': patch
---

`ui-toggle-group` with `variant="soft"` or `"contrast"` is a proper segmented control: the track gets 3px of padding, toggles inside it drop their own border (it doubled the track's) and round their corners inside the track's (so `shape="pill"` rounds the toggles too), and the pressed toggle is a surface-coloured segment with a soft shadow instead of a second outline.
