---
"@editora/light-code-editor": minor
---

Fixes from an audit of the code editor:

- Read-only mode can no longer be switched off with Ctrl+R (pressed twice it made a read-only editor editable, and it blocked the browser's reload key on Windows and Linux). `ReadOnlyExtension` keeps its `setReadOnly` and `toggleReadOnly` commands.
- Copy and Cut across a folded block take the code, not the fold label (Cut used to lose the folded lines).
- The lightweight formatter no longer changes strings, template literals, regular expressions, comments, `<pre>`, `<textarea>`, Python docstrings or Markdown line breaks, and returns the code unchanged if it would change anything but whitespace.
- Shortcuts that need Shift or Option now work: fold/unfold (Ctrl/Cmd+Shift+[ and ]) never ran, and on a Mac neither did Option+Shift+F (format) or Option+Shift+A (block comment).
- A regular-expression replace expands `$1`, `$<name>`, `$&` and `$$`. Regex search results now carry `groups` and `namedGroups`.
- `setValue()` is one undo step; Undo after it used to skip what had been typed just before.
- `createEditor` no longer adds its defaults to the caller's `extensions` array (two editors made from the same options shared one keymap, so Ctrl+Z in one undid in the other).
- The diagnostics status box is hidden when there are no diagnostics, instead of showing a developer note to users.
- New: Enter keeps the indentation of the current line, indents one level after `{`, `[` or `(`, and splits `{|}` over three lines. Set `autoIndent: false` for the old behaviour.
- The ES build is now one file per module and the package declares `sideEffects`, so unused extensions are left out of an app's bundle (`createEditor` alone: 35 KB to 16 KB gzipped).
