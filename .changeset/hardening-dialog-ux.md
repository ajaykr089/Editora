---
"@editora/plugins": patch
"@editora/code": patch
"@editora/conditional-content": patch
"@editora/data-binding": patch
"@editora/merge-tag": patch
"@editora/preview": patch
"@editora/version-diff": patch
"@editora/anchor": patch
"@editora/emojis": patch
"@editora/special-characters": patch
"@editora/a11y-checker": patch
"@editora/embed-iframe": patch
"@editora/template": patch
"@editora/math": patch
"@editora/media-manager": patch
"@editora/plugin-link": patch
---

Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
