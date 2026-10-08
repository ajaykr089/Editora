---
"@editora/markdown-editor": patch
---

Make the markdown editor safe to edit in, and give it the Editora editor's UI. (This describes the rich-text pane, `editorType="rich"`; the source pane is described in its own entry.)

**Editing no longer corrupts the markdown.** Every edit in the rich pane is converted back to markdown, and that conversion was a chain of regexes over the HTML string. A single keystroke in a heading rewrote the whole document: link URLs were dropped, `~~strikethrough~~` vanished, ordered lists became bullets, nested lists were flattened, fenced code became inline backticks, tables collapsed into their cell text, images and horizontal rules disappeared, and HTML entities (`&lt;`, `&amp;`) leaked into the stored value. The conversion now walks a parsed DOM and round-trips headings, emphasis, links with titles, images, bullet / ordered (with start number) / nested / task lists, blockquotes, fenced code with its language, tables with alignment and rules. Text typed in the editor that would read as markdown (`*`, `` ` ``, `[`, a leading `#` or `-`) is escaped, entities are decoded, and `snake_case` and `5 < 6` are left alone.

**Toolbar.** The rich pane now uses the real Editora toolbar (undo/redo, headings, bold, italic, strikethrough, link, bullet / numbered / task lists, quote, code block), the selection toolbar and the status bar. The old buttons appended a snippet to the end of the document whatever the selection was, and still edited a `readOnly` editor; the Editora toolbar acts on the selection and is disabled when read-only.

**Preview.** The code highlighter no longer corrupts its own markup: it ran regexes over the HTML it had already produced, so a string literal produced a stray `<span class="&lt;span">` and `&#39;` was split around its number. It now tokenises the raw text in one pass. Task list items keep their checkbox (the sanitiser stripped the `<input>`, so they rendered as plain bullets), and links open in a new tab with `rel="noopener noreferrer"`.

**UI.** Styled from the `--rte-*` theme variables, so it matches the rich-text editor and follows `@editora/themes`, including dark mode; the view switch is a segmented control with `aria-pressed`. The editor stays mounted in Preview view, so undo history and selection survive switching views. The wrapped editor's props are created once instead of on every keystroke. With no DOM (a server render) nothing is rendered rather than unsanitised HTML.

`@editora/plugins` is now a dependency, and the package has a test suite (converter, round trip, sanitising, highlighter and component behaviour).
