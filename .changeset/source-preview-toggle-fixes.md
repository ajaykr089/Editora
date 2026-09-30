---
"@editora/code": patch
"@editora/preview": patch
---

Fix two more toggle-command bugs found during continued systematic QA:

- `@editora/code`'s `toggleSourceView` created a brand-new full-viewport source-editor overlay on every click with no check for one already open - repeated clicks (e.g. a double-click, or the `Mod-Shift-S` shortcut pressed twice) stacked duplicate dialogs, same bug class as the prior dialog-overlay-stacking patches. Fixed by removing any existing instance before creating a new one.
- `@editora/preview`'s `togglePreview` command, despite its name, only ever opened the preview dialog - it had a guard against opening a second one, but nothing wired the button to *close* an already-open dialog, so once opened it could only be dismissed via the dialog's own close button or Escape, not by clicking the toolbar button again. Fixed by tracking the active dialog's close function and calling it when the command runs while the dialog is already open, making it a genuine toggle.
