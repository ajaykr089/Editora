# @editora/markdown-editor

## 0.2.0

### Minor Changes

- 0797f65: Keep typing fast in long documents, publish a smaller package, fix the accessibility and Safari problems found by checking it in real browsers, and add screenshots to the README.

  - **Long documents.** Building the preview of a document of several thousand lines takes a few hundred milliseconds, and it was done after every character. While the source pane is being typed in beside it, the preview of a long document (20,000 characters or more) whose last build was slow now waits for a pause in the typing (a pause of twice the build time, between 120 ms and 1 s) and is never older than 2 s. A document that is short or quick to build is rebuilt in the same render as before, so nothing changes for it. Typing in a 6,600-line document in split view blocked the page for about 1.1 s per character; it is now the browser's own cost of editing (about 130 ms) with the preview and the highlighting following when the typing pauses. (The line-number work in `@editora/light-code-editor` is part of this.)
  - **Smaller package.** `marked` and `marked-footnote` were listed as dependencies and also bundled into the build, so they were installed and shipped twice. They are now left to the bundler: the published files go from 134 KB to 78 KB (ESM) and 104 KB to 63 KB (CJS), and a project that already uses `marked` shares its copy.
  - **Accessibility** (found with axe-core, WCAG 2.2 AA, and by keyboard in Chromium, Firefox and WebKit; axe now reports nothing in light or dark, in any view):
    - **No keyboard trap.** Tab indents in the source pane, so a keyboard user who tabbed in could not get out, and every Tab press edited the document. Escape then Tab (or Shift+Tab) now leaves it (the fix is in `@editora/light-code-editor`), and the text area is described by a new translatable hint, `labels.sourceHint`, so assistive technology can announce this.
    - **Contrast.** The selected view button (white on `#007bff`, 3.97:1), the title, the preview's label, the front matter's title, the empty state and the placeholder were below 4.5:1. They are darkened (dark theme unchanged, it already read well).
    - **Names.** The heading button and its menu items start with the glyph they show (`H2 Heading level: Heading 2`), so a name that can be read can be said; the arrow is hidden from assistive technology. The checkboxes of task items in the preview have names, new labels `taskDone` and `taskTodo`.
    - **Preview.** It is one named region (it was a `section` with the name, around a scrolling `div`) and can be focused, so a keyboard can scroll it, with a visible focus ring.
  - **Safari: Escape in fullscreen.** Safari does not focus a button when it is clicked, so after pressing the fullscreen button the editor never heard Escape and could only be left with the button. Escape is now heard wherever the focus is (and still yields to a menu or the find panel that handled it).
  - **Footnote numbers** no longer make their line taller than the lines around them.
  - **README** with screenshots (split view, dark theme, rich text, the preview's front matter, footnotes and math), an Accessibility section and the keyboard notes.

  **Version:** this is a minor release because the default editing surface changed to the markdown source in this series (pass `editorType="rich"` for the previous behaviour), which for a 0.x package is the version that tells people to look.

### Patch Changes

- 8f76e4c: Make the markdown editor safe to edit in, and give it the Editora editor's UI. (This describes the rich-text pane, `editorType="rich"`; the source pane is described in its own entry.)

  **Editing no longer corrupts the markdown.** Every edit in the rich pane is converted back to markdown, and that conversion was a chain of regexes over the HTML string. A single keystroke in a heading rewrote the whole document: link URLs were dropped, `~~strikethrough~~` vanished, ordered lists became bullets, nested lists were flattened, fenced code became inline backticks, tables collapsed into their cell text, images and horizontal rules disappeared, and HTML entities (`&lt;`, `&amp;`) leaked into the stored value. The conversion now walks a parsed DOM and round-trips headings, emphasis, links with titles, images, bullet / ordered (with start number) / nested / task lists, blockquotes, fenced code with its language, tables with alignment and rules. Text typed in the editor that would read as markdown (`*`, `` ` ``, `[`, a leading `#` or `-`) is escaped, entities are decoded, and `snake_case` and `5 < 6` are left alone.

  **Toolbar.** The rich pane now uses the real Editora toolbar (undo/redo, headings, bold, italic, strikethrough, link, bullet / numbered / task lists, quote, code block), the selection toolbar and the status bar. The old buttons appended a snippet to the end of the document whatever the selection was, and still edited a `readOnly` editor; the Editora toolbar acts on the selection and is disabled when read-only.

  **Preview.** The code highlighter no longer corrupts its own markup: it ran regexes over the HTML it had already produced, so a string literal produced a stray `<span class="&lt;span">` and `&#39;` was split around its number. It now tokenises the raw text in one pass. Task list items keep their checkbox (the sanitiser stripped the `<input>`, so they rendered as plain bullets), and links open in a new tab with `rel="noopener noreferrer"`.

  **UI.** Styled from the `--rte-*` theme variables, so it matches the rich-text editor and follows `@editora/themes`, including dark mode; the view switch is a segmented control with `aria-pressed`. The editor stays mounted in Preview view, so undo history and selection survive switching views. The wrapped editor's props are created once instead of on every keystroke. With no DOM (a server render) nothing is rendered rather than unsanitised HTML.

  `@editora/plugins` is now a dependency, and the package has a test suite (converter, round trip, sanitising, highlighter and component behaviour).

- 48fd669: Add image and table buttons, front matter, footnotes, scroll sync, fullscreen, translatable labels, a ref handle and optional math.

  - **Toolbar**: image (`![alt text](url)`, a selected address becomes the source) and table (a 3x2 table with the first header selected, with the blank lines around it that markdown needs).
  - **Preview**: YAML **front matter** at the start of the document is shown as a collapsed block instead of a rule and a heading, and is kept out of the rich pane (put back when it reports a change). **Footnotes** (`text[^1]`, `[^1]: note`) become numbered links with the notes at the end and a link back; their ids are unique per editor, and a click on one stays inside the preview instead of changing the address of the page. Each top-level block now carries `data-md-line`, the line it starts on.
  - **Scroll sync**: in split view the source and the preview scroll together, matched block by block through those lines (not by proportion, which drifts around tall code blocks and tables), with both ends lined up. New `height` prop fixes the editor's height (px or any CSS length) so each pane scrolls inside it; `syncScroll` (default true) turns the sync off. Without `height` the editor grows with its text, as before.
  - **Fullscreen**: a button in the header; the page behind is locked and restored, Escape leaves (unless a menu or the find panel took it). `--md-fullscreen-z-index` sets the layer.
  - **Labels**: the new `labels` prop translates everything the editor shows or announces (header, switches, toolbar names and tooltips, heading menu, preview heading and empty state, front matter and footnotes text, the text area's name, the status bar language); what is not given stays English. The status bar counts (`@editora/core`) and the rich surface's toolbar (`@editora/react`) are not covered.
  - **Ref**: the editor forwards a ref with `focus()`, `getValue()`, `insertText()` and `runCommand()`; the last two are one undo step and return `false` when read-only or on the rich surface.
  - **Math** (opt-in): pass `renderMath`, a function that typesets TeX (for example KaTeX's `renderToString` with `output: 'html'`), and `$x^2$`, `$$x^2$$` and `$$` fences become formulas in the preview. Without it a dollar sign is just a dollar sign. Prices are left alone (pandoc's rules), code is never read as math, and a formula the typesetter rejects is shown as written. The typeset HTML is sanitised on its own against a short allowlist that keeps the SVG KaTeX draws radicals and arrows with, and nothing that can run.

  New dependency: `marked-footnote`. New exported types: `MarkdownEditorHandle`, `MarkdownEditorLabels`, `MarkdownEditorLabelsInput`, `MarkdownCommand`, `MarkdownCommandName` and `MathRenderer`.

- 7943f63: Make the markdown source the default editing surface, so editing never rewrites the document.

  The editing pane used to be a rich-text surface that rendered the markdown and converted it back on every edit. Even with a faithful converter that is normalisation: the first edit rewrites `*` bullets, `Setext` headings, numbering, spacing and any HTML the surface cannot represent. The default pane is now the markdown text itself in `@editora/light-code-editor`, with markdown syntax highlighting, line numbers, wrapping and find / replace, so nothing is converted and nothing is lost.

  - **Toolbar** in the Editora editor's style, using the same icons and classes (so it follows `@editora/themes`, dark mode included): undo / redo, heading level, bold, italic, strikethrough, link, bullet / numbered / task lists, quote, inline code, code block and horizontal rule. Each acts on the selection or the current line as a single undo step and toggles formatting that is already present (including telling `*italic*` from `**bold**`). Arrow keys move along the toolbar, the heading menu is keyboard-operable, and buttons never steal the text selection.
  - **Shortcuts**: Cmd/Ctrl+B, I, E, K and Shift+X.
  - **Enter** in a list or quote continues the marker (numbers count up, task boxes start unchecked), splits an item when pressed mid-item, moves an empty nested item out one level, and ends the list on an empty item, leaving the blank line that stops the next paragraph being read as part of the list.
  - The status bar is Editora's (`StatusBar` from `@editora/core`): line and column, selection size, word / character / line counts. The code editor follows the Editora dark theme live.

  The rich-text surface is still there as `editorType="rich"`, and the header has a Source / Rich text switch; switching keeps the text and changes nothing by itself. A new `editorType` prop selects the starting surface (`'source'` by default).

  **Behaviour change:** the default surface is now `'source'`. Pass `editorType="rich"` for the previous behaviour. The package now depends on `@editora/light-code-editor`, whose stylesheet (`@editora/light-code-editor/light-code-editor.css`) must be loaded like the theme styles.

  Also centres the checkmark of a checked task item in the preview, using an SVG laid over the box instead of hand-tuned borders, so it matches the editor's checklist.

- Updated dependencies [1c0c064]
- Updated dependencies [2e4b6c2]
- Updated dependencies [03bc707]
- Updated dependencies [9164376]
  - @editora/core@1.0.22
  - @editora/light-code-editor@1.0.17

## 0.1.1

### Patch Changes

- bb57fc7: Fix several ways of losing content. Table: Select All then Insert Table replaced the whole document. Checklist: converting loose root-level text deleted it. Link: a multi-block selection was flattened into a single plain-text `<a>`; it now links per block. code-sample: blocks decayed into a stray "Copy" text node with dead handlers after the first keystroke; they are now `<pre data-lang><code>` with delegated handlers. translation-workflow: unlocking made segments editable in read-only editors. light-code-editor: Backspace beside an emoji left a lone surrogate, Tab replaced a multi-line selection with spaces (it now indents/outdents lines), Replace All needed one Undo per match, and Alt/Cmd+Backspace deleted a single character. markdown-editor: the rich editor remounted on every keystroke and lost focus, and the toolbar inserted a literal `\n`.
- bb57fc7: Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
- Updated dependencies [202a5eb]
- Updated dependencies [a3723fa]
- Updated dependencies [a1640aa]
- Updated dependencies [53a8021]
- Updated dependencies [bb57fc7]
- Updated dependencies [e756a24]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
  - @editora/react@1.0.21

## 0.1.0

### Initial Release

- A lightweight markdown editor component with edit, split, and preview modes plus inline formatting actions.
