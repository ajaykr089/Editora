---
'@editora/ui-core': patch
---

Dialog, AlertDialog and Drawer focus traps now include the content you put in them. The trap looked for focusable elements only in the overlay's own shadow root and read `document.activeElement`, which is the overlay host while focus is inside it, so in a Dialog every Tab sent focus back to the close button and its fields could not be reached from the keyboard. Traps now follow the rendered (flat) tree across slots and nested components such as Input, and `autofocus` on a field inside a dialog works.
