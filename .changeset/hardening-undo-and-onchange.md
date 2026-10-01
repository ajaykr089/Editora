---
"@editora/plugins": patch
"@editora/plugin-history": patch
"@editora/plugin-list": patch
"@editora/font-size": patch
"@editora/font-family": patch
"@editora/text-color": patch
"@editora/clear-formatting": patch
"@editora/plugin-link": patch
"@editora/emojis": patch
"@editora/plugin-table": patch
"@editora/comments": patch
"@editora/code-sample": patch
---

Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
