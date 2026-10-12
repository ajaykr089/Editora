---
"@editora/core": patch
"@editora/react": patch
---

Deprecate the `menubar` option, which has never done anything. The React prop (`menubar={{ enabled: true, items: [...] }}`) and the `<editora-editor menubar>` attribute were accepted, passed along and ignored: no menu bar is rendered, and a menu bar is not planned for the editor.

It is not removed, so code that passes it keeps compiling and running, but it is marked `@deprecated` in the typings, logs one console warning per page when a page actually asks for a menu bar, and will be removed in a future major release. `getConfig().menubar` on the web component now reports `false` by default instead of claiming a menu bar that does not exist.
