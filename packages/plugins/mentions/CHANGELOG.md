# @editora/mentions

## 1.0.2

### Patch Changes

- 502af7d: Fix the slash-command and @mention popups reappearing after being dismissed with Escape. Both plugins re-run their trigger detection on every `input` event on the editor, with no memory of "the user just closed this" - so if the trigger text (e.g. `/head` or `@joh`) was still sitting right before the caret, any unrelated `input` event on the same editor (many plugins dispatch one after a programmatic DOM change, e.g. track-changes, mentions itself, autosave restore) would silently reopen the popup at the same spot, even though the user had explicitly dismissed it. Found via manual reproduction: dismiss a slash-command popup with Escape, then dispatch a bare `input` event - the popup reappears. Fixed by remembering the exact trigger position dismissed via Escape and skipping reopen at that position until the trigger genuinely changes (caret moves, text is edited); a fresh trigger elsewhere still opens normally as verified live.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
