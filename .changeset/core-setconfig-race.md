---
'@editora/core': patch
---

`setConfig()` called while the editor is still building (for example right after loading the web component, with the element already in the page) no longer gets undone. Builds are async and several things start one (connecting, the attributes reported during an upgrade, `setConfig()`, attribute changes); they could overlap, and the last one to finish loading plugins won, so a configured plugin and its toolbar button could vanish. Now the latest build wins and the others stop before touching the page, `editor-ready` fires once per build that finishes, and an editor removed while loading is no longer built.
