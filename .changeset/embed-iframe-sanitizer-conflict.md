---
"@editora/core": patch
"@editora/react": patch
"@editora/embed-iframe": patch
---

Fix the embed-iframe plugin being completely non-functional: every inserted `<iframe>` was silently stripped back out within moments of insertion. `iframe` is deliberately excluded from the editor's default `sanitizeOnInput` allowlist - a real security boundary, since arbitrary pasted or typed content shouldn't be able to silently embed one - with a comment claiming "the embed-iframe plugin inserts iframes through its own explicit, user-initiated dialog, a different trust boundary that never calls through this sanitizer." That claim didn't hold: the plugin dispatched a plain `input` event after inserting, exactly like every other plugin's change notification, and `EditorContent`'s `handleInput` sanitizes on every `input` event unconditionally - there was no actual mechanism distinguishing the plugin's trusted insertion from arbitrary content, so the sanitizer stripped the iframe regardless.

Found via live testing: inserting an embed through the dialog showed it for a moment, then it vanished, leaving an empty paragraph behind, with no error anywhere.

Fixed by giving `sanitizeInputHTML` (never `sanitizePastedHTML`, so the paste boundary is unaffected) an `additionalAllowedTags` parameter, and having `EditorContent`'s `handleInput` read it from `event.detail.allowedTags` when the triggering event is a `CustomEvent` - letting one specific, already-in-the-trusted-DOM mutation keep a tag the default allowlist excludes, without reopening that tag to arbitrary input. The embed-iframe plugin now dispatches its post-insert event as `new CustomEvent('input', { detail: { allowedTags: ['iframe'] } })` instead of a plain `Event`, and `iframe` gets a dedicated entry in the attribute allowlist (src, sizing, fullscreen, scrolling/border) so the inserted embed keeps its full intended functionality rather than just surviving as a bare, unstyled frame.

Verified live: an inserted iframe now survives with all its attributes intact, while both a simulated paste and a plain `input` event carrying a raw `<iframe>` tag are still correctly stripped - the security boundary the original design intended is now actually enforced, for arbitrary content, while the one trusted path works.
