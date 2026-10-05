---
"@editora/core": patch
"@editora/react": patch
"@editora/plugin-table": patch
---

Fix several editor behaviours found while testing the web component and the React wrapper.

- Table resize handles no longer leak into saved HTML. While the caret was in a table the table plugin put its drag handles (and a `position: relative` anchor style on the header cells) inside the document, and they appeared in every `onChange`, `content-change`, `getContent()`/`getHTML()` and autosave value. They are now stripped from everything the editor emits (new `stripEditorUiArtifacts` / `getCleanEditorHTML` helpers in `@editora/core`), and the table plugin removes the anchor style when the handles go. React's controlled-value comparison uses the cleaned DOM so typing inside a table does not rewrite the content.
- `@editora/react`: the editor no longer steals focus from other fields. It called `focus()` inside the effect that depends on `onChange` and the config props, so any parent re-render that produced a new `onChange` (an inline arrow function) pulled focus back into the editor: typing in a title field next to a controlled editor lost focus after one character, and a controlled editor could put later characters at the start of the paragraph. It now focuses only on mount and when it becomes editable.
- `<editora-editor>` keeps its edited content when it is moved in the DOM or reconfigured with `setConfig()`; it used to reset to the original `data-initial-content`.
- `createPluginManager()`, declared in the typings but never implemented, now exists.
