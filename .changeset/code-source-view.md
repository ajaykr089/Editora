---
'@editora/plugins': patch
'@editora/code': patch
'@editora/core': patch
---

Source view (`code` plugin) fixes:

- **Saving without an edit no longer changes the document.** The formatter put every tag on its own line and trimmed the text between tags, so opening the source view and pressing Save turned `foo<b>bar</b>baz` into "foo bar baz" and `<i>x</i>.` into "x .", and a `<pre>` lost its leading spaces. Line breaks now go only between block elements, inline content and `<pre>` are shown exactly as they are, and Save leaves the document alone when the source was not edited.
- **Undo takes back a source edit.** Save replaced the content without telling the history, so Undo could not reverse it; it is now one undo step.
- **Edits are not thrown away without asking.** Escape, the close button and the backdrop closed the dialog at once (only Cancel asked about unsaved changes), and Escape in the find box closed the whole dialog. They now ask first, and an Escape the find box uses only closes the find box.
- **The dialog can be saved from the keyboard.** Escape in the code also closed the dialog, but in the code editor Escape is the way out of the Tab key (Tab indents; Escape then Tab moves on), so a keyboard user could never reach Save. Escape in the code is now left to the code editor.
