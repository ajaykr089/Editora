---
"@editora/approval-workflow": patch
---

Fix the `data-approval-locked` attribute and `rte-approval-locked-editor` CSS class (a diagonal-stripe "this document is locked" background) staying stale for one render after a document is approved. `updateEditorStatusAttributes` set the attribute and toggled the class from `state.locked` before updating it for the new status, so on the exact transition into "Approved" they kept reading the old, unlocked value - `contenteditable` was correctly disabled right away, but the visual lock indicator only appeared after some unrelated later action (e.g. adding a comment) happened to re-run the update. Found via live testing: approving a document showed the panel say "Locked" and made the content genuinely uneditable, but the striped locked-background never showed up until a second, unrelated state change occurred.

Fixed by computing whether the editor will be locked up front, from the same condition used later, and using that value consistently for the attribute, the class, and the lock transition. Verified live: the attribute, class, and `contenteditable` now all flip together on approval, and reopening to draft correctly clears all three.
