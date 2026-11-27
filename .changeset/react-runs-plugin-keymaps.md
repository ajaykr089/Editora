---
'@editora/react': patch
---

`<EditoraEditor>` now runs the keyboard shortcuts in its plugins' `keymap`s, as `<editora-editor>` does, and leaves a key to the browser when no plugin handles it (Cmd/Ctrl+P prints). Mod+B, Mod+I and Mod+U without the plugin for them still do nothing, so the browser does not format the text itself. It ran only the core's fixed list before.
