---
'@editora/core': patch
'@editora/react': patch
---

Cmd/Ctrl+Shift+8 (bullet list) and Cmd/Ctrl+Shift+7 (numbered list) work. Shortcuts were matched on the character a key types, and with Shift held the digit keys type `*` and `&`, so neither shortcut ever ran, in `<editora-editor>` or in the React editor. With a modifier held, a shortcut now also matches the key itself; the character is still tried first, so other keyboard layouts keep theirs.
