---
"@editora/themes": patch
---

Fix empty space left below the status bar in the React editor (light theme, and dark theme since it inherits the base rule). `.rte-editor .editora-statusbar-bottom { top: -32px; }` shifted the status bar visually upward with `position: relative`, which doesn't remove it from normal flow - the element still reserved its original, un-shifted space, leaving a 32px blank gap at the bottom of the editor card. This was dead leftover code with no legitimate purpose; removed.
