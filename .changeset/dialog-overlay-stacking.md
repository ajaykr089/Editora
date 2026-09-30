---
"@editora/anchor": patch
"@editora/code-sample": patch
"@editora/embed-iframe": patch
"@editora/plugin-link": patch
"@editora/math": patch
"@editora/template": patch
---

Fix duplicate, stacked modal overlays when a toolbar dialog command (Insert Code Sample, Embed Content, Insert Template, Anchor, Insert Link, Insert Math) is invoked again while its dialog is already open - e.g. a double-click on the toolbar button, or clicking it again before noticing the dialog already opened. Each of these six plugins created a brand-new full-viewport overlay + dialog on every invocation with no check for an existing one, so repeated invocations left several independent overlays stacked in the DOM at once; closing the topmost one (via Escape, Cancel, or the X button) revealed another leftover dialog underneath instead of returning to the editor. Found via live-browser testing that simulated a user re-opening the same dialog rapidly. Fixed by removing/closing any existing instance of the dialog before creating a new one, matching the guard already correctly implemented in `@editora/conditional-content`, `@editora/data-binding`, `@editora/merge-tag`, `@editora/emojis`, and `@editora/version-diff`.
