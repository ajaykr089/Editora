---
"@editora/ui-core": patch
---

A range `ui-slider` (and `Slider range` in `@editora/ui-react`) can now be moved by its start handle with a mouse or finger. The two handles overlapped and the end handle took every press, so dragging the start handle moved the end handle to the pointer, and a single click anywhere on the track did the same. A press now moves whichever handle is nearer (when both sit on the same value, the direction of the first move decides), and the pressed handle gets focus for the keyboard. Values also snap from `min` the way the native input does, so `min="5" step="10"` gives 15, 25, and so on instead of rounding to multiples of 10.
