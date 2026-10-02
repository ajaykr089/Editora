# @editora/preview

## 1.0.4

### Patch Changes

- bb57fc7: Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
- dbb020d: Fix two more toggle-command bugs found during continued systematic QA:

  - `@editora/code`'s `toggleSourceView` created a brand-new full-viewport source-editor overlay on every click with no check for one already open - repeated clicks (e.g. a double-click, or the `Mod-Shift-S` shortcut pressed twice) stacked duplicate dialogs, same bug class as the prior dialog-overlay-stacking patches. Fixed by removing any existing instance before creating a new one.
  - `@editora/preview`'s `togglePreview` command, despite its name, only ever opened the preview dialog - it had a guard against opening a second one, but nothing wired the button to _close_ an already-open dialog, so once opened it could only be dismissed via the dialog's own close button or Escape, not by clicking the toolbar button again. Fixed by tracking the active dialog's close function and calling it when the command runs while the dialog is already open, making it a genuine toggle.

- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
