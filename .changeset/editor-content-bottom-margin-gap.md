---
"@editora/react": patch
---

Fix a stray blank strip appearing between the editor's content box and its status bar (or bottom toolbar), with the content box's own rounded corners and border making it look like a separate, disconnected box floating above the status bar. `EditorContent`'s contenteditable element had a hardcoded `marginBottom: "16px"` and always rounded its bottom corners, even when a status bar or bottom toolbar immediately followed it - unlike the top edge, which has no such margin and sits flush against the toolbar above it. Found via a user screenshot showing the gap in both light and dark themes. Fixed by removing the unconditional bottom margin and only rounding the content box's bottom corners when nothing follows it (`RichTextEditor` now tells `EditorContent` whether a bottom toolbar or status bar is present via a new `roundBottomCorners` prop), so the content flows seamlessly into whatever comes next.
