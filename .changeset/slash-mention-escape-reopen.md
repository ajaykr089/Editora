---
"@editora/slash-commands": patch
"@editora/mentions": patch
---

Fix the slash-command and @mention popups reappearing after being dismissed with Escape. Both plugins re-run their trigger detection on every `input` event on the editor, with no memory of "the user just closed this" - so if the trigger text (e.g. `/head` or `@joh`) was still sitting right before the caret, any unrelated `input` event on the same editor (many plugins dispatch one after a programmatic DOM change, e.g. track-changes, mentions itself, autosave restore) would silently reopen the popup at the same spot, even though the user had explicitly dismissed it. Found via manual reproduction: dismiss a slash-command popup with Escape, then dispatch a bare `input` event - the popup reappears. Fixed by remembering the exact trigger position dismissed via Escape and skipping reopen at that position until the trigger genuinely changes (caret moves, text is edited); a fresh trigger elsewhere still opens normally as verified live.
