---
"@editora/code-sample": patch
---

Fix inserted code blocks producing invalid HTML that silently corrupts on reparse (undo/redo snapshots, copy-paste, or any sanitizer round-tripping through `innerHTML`). `insertCodeBlock` inserted the `<pre>` with `range.insertNode(pre)` at the raw cursor position, nesting it inside whatever block (usually a `<p>`) the cursor was in - `<pre>` isn't valid content inside a `<p>`, so reparsing the HTML auto-closes the paragraph at the `<pre>` boundary, splitting it in two.

Found via live testing, the same way the identical bug was found in the table plugin: inserting a code sample mid-paragraph and reparsing the resulting HTML produced different markup than what was live in the editor.

Fixed by inserting the code block as a sibling of its containing block instead of at the raw cursor position, matching the pattern already used by the page-break and table plugins. Verified live that the resulting markup is byte-identical after a reparse.
