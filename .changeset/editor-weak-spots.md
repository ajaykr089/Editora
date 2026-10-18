---
"@editora/core": patch
"@editora/plugins": patch
"@editora/react": patch
"@editora/themes": patch
"@editora/light-code-editor": patch
---

Undo, dialogs, menus and a few plugins that did not do their job.

**Undo and redo** (editor, web component and code editor):
- Undo took back one character at a time and kept only the last 100 steps; typing is now grouped into words (a pause, a click, a caret key or Tab, undo and redo end a run; typing over a selection and deleting a selection are steps of their own) and 200 steps are kept.
- After undo or redo the caret was left at the start of the document; it now goes back to the text that changed.
- `<editora-editor>` never recorded typing, so Undo (the button and Cmd/Ctrl+Z) did nothing for typed text.
- In the code editor, Ctrl/Cmd+Shift+Z undid again instead of redoing.

**Keyboard and screen readers:**
- Modal dialogs (Image, Video, Template, Preview, Math, Anchor, Code Sample, Emoji, Special Characters and the rest) now get a role and a name, take focus, keep Tab inside, and give the focus and the caret back when they close without changing the text.
- The toolbar's block-type, font, alignment, line-height and capitalisation menus work with the keyboard in both `@editora/react` and `<editora-editor>`: they announce that they open a menu, take focus, move with the arrow keys, Home and End, choose with Enter or Space, and close with Escape.
- The Spell Check panel is a named region; the Math dialog's controls are labelled; the media dialog's labels are tied to their fields, its tabs say which is selected, and its upload zone works with the keyboard.
- In a table, Tab and Shift+Tab move between cells, and Tab in the last cell adds a row.

**Behaviour fixes:**
- A URL can be typed in the Image and Video dialogs (the dialog was rebuilt on every keystroke, so only pasting worked), what is pasted there is escaped, and inserting media tells the editor, records Undo and puts the caret after it.
- The slash menu ran a block command on the previous or next paragraph when the line was otherwise empty; it also now asks every command bridge before the browser's own command, so lists made from it match the toolbar.
- Making a paragraph a list no longer leaves an empty paragraph before and after it, or moves the caret to the start of the line.
- Choosing a heading keeps the selection.
- The Math dialog opens with no network (KaTeX comes from the `katex` package, not a script from a CDN) and renders formulas with its layout rules embedded; its template grid no longer hides its last row.
- Export Word no longer sends a request to `http://localhost:3001` on every click: there is no default API server any more, and with none configured the file is built in the browser. To use a backend, set `apiUrl` (`setGlobalApiConfig` or `setDocumentManagerConfig`). An empty `apiUrl` on a plugin now means "no API".
- Spell-check suggestions rank the word that was meant first ("tset" gives "test", "wrods" gives "words").
- Messages such as "Please select text first" appear in a live region instead of a blocking `alert()`.
