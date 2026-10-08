---
"@editora/markdown-editor": patch
---

Make the markdown source the default editing surface, so editing never rewrites the document.

The editing pane used to be a rich-text surface that rendered the markdown and converted it back on every edit. Even with a faithful converter that is normalisation: the first edit rewrites `*` bullets, `Setext` headings, numbering, spacing and any HTML the surface cannot represent. The default pane is now the markdown text itself in `@editora/light-code-editor`, with markdown syntax highlighting, line numbers, wrapping and find / replace, so nothing is converted and nothing is lost.

- **Toolbar** in the Editora editor's style, using the same icons and classes (so it follows `@editora/themes`, dark mode included): undo / redo, heading level, bold, italic, strikethrough, link, bullet / numbered / task lists, quote, inline code, code block and horizontal rule. Each acts on the selection or the current line as a single undo step and toggles formatting that is already present (including telling `*italic*` from `**bold**`). Arrow keys move along the toolbar, the heading menu is keyboard-operable, and buttons never steal the text selection.
- **Shortcuts**: Cmd/Ctrl+B, I, E, K and Shift+X.
- **Enter** in a list or quote continues the marker (numbers count up, task boxes start unchecked), splits an item when pressed mid-item, moves an empty nested item out one level, and ends the list on an empty item, leaving the blank line that stops the next paragraph being read as part of the list.
- The status bar is Editora's (`StatusBar` from `@editora/core`): line and column, selection size, word / character / line counts. The code editor follows the Editora dark theme live.

The rich-text surface is still there as `editorType="rich"`, and the header has a Source / Rich text switch; switching keeps the text and changes nothing by itself. A new `editorType` prop selects the starting surface (`'source'` by default).

**Behaviour change:** the default surface is now `'source'`. Pass `editorType="rich"` for the previous behaviour. The package now depends on `@editora/light-code-editor`, whose stylesheet (`@editora/light-code-editor/light-code-editor.css`) must be loaded like the theme styles.

Also centres the checkmark of a checked task item in the preview, using an SVG laid over the box instead of hand-tuned borders, so it matches the editor's checklist.
