---
"@editora/themes": patch
---

The default theme gives the toolbar buttons, the "more" button, dropdown menus, dialogs, the inline menu and the table toolbar an explicit text colour. Without one they took the browser's, which is white when a page sets `color-scheme: dark` (as `ui-grid` and other ui-core components do), so the icons were white on the white buttons and looked missing.
