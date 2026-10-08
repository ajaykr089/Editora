---
"@editora/light-code-editor": patch
---

Fix line numbers with `lineWrapping`: they did not follow wrapped lines. Every line number was one row tall, but a line that wraps is several rows, so from the first wrapped line on the numbers drifted up against the text, and the gutter ended (at the last line number) while the text carried on below it; in a long document the last numbers sat beside text from far earlier in the file. A number now sits at the first row of its line, and is as tall as the line is.

The editor finds how many rows each line wraps to by laying the same text out one block per line in a hidden copy of the content (one layout pass, once per task), and measures again when the text changes (even if the number of lines does not) and when the editor is resized or shown. After an edit only the lines it changed are laid out again, and a line keeps its height until its text, the width or the font changes, so typing in a long document stays cheap; the gutter keeps its rows too, adding or dropping them at the end instead of building them all again, and writes only the heights that changed. Line and gutter decorations (the active line, markers) and `scrollToPosition` are placed by those measured positions too, so they land on the right line when lines wrap. Without `lineWrapping`, nothing is measured and nothing changes. While folded blocks are on screen the lines cannot be matched to numbers and each stays one row, as before.

The package now has a test suite (`npm test`).
