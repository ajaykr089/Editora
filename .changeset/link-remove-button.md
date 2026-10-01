---
"@editora/plugin-link": patch
---

Add a "Remove Link" button to the link dialog's edit mode. The plugin already implements a working `removeLink` command (`document.execCommand('unlink')`), registered globally and recognized by the toolbar's active-state tracking, but nothing in the toolbar, the floating toolbar, or the link dialog itself ever called it - there was no way to remove a link from the UI. Clearing the URL field and submitting also silently did nothing, since the dialog's submit handler only acts when the URL is non-empty.

Found via live testing: editing an existing link and clearing its URL before clicking "Update Link" produced no change and no feedback.

Fixed by adding a "Remove Link" button, shown only when editing an existing link, that unwraps the link element being edited directly (rather than running `unlink` against the live selection, which no longer points at the link once focus has moved into the dialog's inputs). Verified live: the button appears only in edit mode, removing the link preserves its text, and the insert-new-link dialog is unaffected.
