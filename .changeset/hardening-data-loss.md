---
"@editora/plugins": patch
"@editora/plugin-table": patch
"@editora/checklist": patch
"@editora/plugin-link": patch
"@editora/code-sample": patch
"@editora/translation-workflow": patch
"@editora/light-code-editor": patch
"@editora/markdown-editor": patch
---

Fix several ways of losing content. Table: Select All then Insert Table replaced the whole document. Checklist: converting loose root-level text deleted it. Link: a multi-block selection was flattened into a single plain-text `<a>`; it now links per block. code-sample: blocks decayed into a stray "Copy" text node with dead handlers after the first keystroke; they are now `<pre data-lang><code>` with delegated handlers. translation-workflow: unlocking made segments editable in read-only editors. light-code-editor: Backspace beside an emoji left a lone surrogate, Tab replaced a multi-line selection with spaces (it now indents/outdents lines), Replace All needed one Undo per match, and Alt/Cmd+Backspace deleted a single character. markdown-editor: the rich editor remounted on every keystroke and lost focus, and the toolbar inserted a literal `\n`.
