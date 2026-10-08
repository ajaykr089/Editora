---
"@editora/markdown-editor": patch
---

Add image and table buttons, front matter, footnotes, scroll sync, fullscreen, translatable labels, a ref handle and optional math.

- **Toolbar**: image (`![alt text](url)`, a selected address becomes the source) and table (a 3x2 table with the first header selected, with the blank lines around it that markdown needs).
- **Preview**: YAML **front matter** at the start of the document is shown as a collapsed block instead of a rule and a heading, and is kept out of the rich pane (put back when it reports a change). **Footnotes** (`text[^1]`, `[^1]: note`) become numbered links with the notes at the end and a link back; their ids are unique per editor, and a click on one stays inside the preview instead of changing the address of the page. Each top-level block now carries `data-md-line`, the line it starts on.
- **Scroll sync**: in split view the source and the preview scroll together, matched block by block through those lines (not by proportion, which drifts around tall code blocks and tables), with both ends lined up. New `height` prop fixes the editor's height (px or any CSS length) so each pane scrolls inside it; `syncScroll` (default true) turns the sync off. Without `height` the editor grows with its text, as before.
- **Fullscreen**: a button in the header; the page behind is locked and restored, Escape leaves (unless a menu or the find panel took it). `--md-fullscreen-z-index` sets the layer.
- **Labels**: the new `labels` prop translates everything the editor shows or announces (header, switches, toolbar names and tooltips, heading menu, preview heading and empty state, front matter and footnotes text, the text area's name, the status bar language); what is not given stays English. The status bar counts (`@editora/core`) and the rich surface's toolbar (`@editora/react`) are not covered.
- **Ref**: the editor forwards a ref with `focus()`, `getValue()`, `insertText()` and `runCommand()`; the last two are one undo step and return `false` when read-only or on the rich surface.
- **Math** (opt-in): pass `renderMath`, a function that typesets TeX (for example KaTeX's `renderToString` with `output: 'html'`), and `$x^2$`, `$$x^2$$` and `$$` fences become formulas in the preview. Without it a dollar sign is just a dollar sign. Prices are left alone (pandoc's rules), code is never read as math, and a formula the typesetter rejects is shown as written. The typeset HTML is sanitised on its own against a short allowlist that keeps the SVG KaTeX draws radicals and arrows with, and nothing that can run.

New dependency: `marked-footnote`. New exported types: `MarkdownEditorHandle`, `MarkdownEditorLabels`, `MarkdownEditorLabelsInput`, `MarkdownCommand`, `MarkdownCommandName` and `MathRenderer`.
