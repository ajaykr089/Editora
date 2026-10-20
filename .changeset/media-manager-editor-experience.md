---
"@editora/core": patch
"@editora/react": patch
"@editora/plugins": minor
"@editora/media-manager": minor
---

Media manager: paste and drop, captions, alignment and size, and the keyboard.

- **Paste and drop to upload.** Pasting an image (a screenshot, a copied picture) or dropping image and video files on the editor puts a placeholder where they go, with its own progress and a cancel button, and swaps in the media when it is stored, as one undo step. Failures and refused files (too large, wrong type) say why. Text pasted together with a picture (spreadsheet cells, a copied page) stays text. `uploadOnPaste: false` turns it off.
- **Figures and captions.** Inserted media is now `<figure class="rte-media" data-align>` with an optional `<figcaption>`; it can be aligned left, centre or right, captioned, and sized from a Size menu (small, medium, large, full width, original; relative to the visible width of the text). Alignment is plain margins and the figure shrinks to the picture (`display: table`), so saved HTML renders the same without the editor's CSS. Media from earlier versions is wrapped when it is aligned or captioned. `wrapInFigure: false` keeps the bare `<img>` / `<video>`. Enter in a caption goes on below, Backspace in an empty one removes it, and pasting into one is a line of plain text.
- **Inserting at a caret splits the block.** A figure cannot live inside a paragraph (the HTML parser tears it out), so inserting splits the paragraph or heading around the caret instead of putting the figure inside it; at the end of the editor an empty paragraph is left to type in.
- **Keyboard.** An arrow key at the edge of the paragraph beside media selects it (browsers skip over it), Alt+F10 moves into its toolbar (arrow keys, Enter or Space, Escape or Tab back to the text) and the toolbar keeps the focus on the button used. The corner handles use pointer events, so touch and pen drag them too, and show the size while dragging; they are larger on touch screens.
- `mediaSlashItems` for `SlashCommandsPlugin({ items })` adds `/image` and `/video`. `getCleanEditorHTML` (core) now drops unfinished uploads, the editing-only `contenteditable` of figures, and captions nobody wrote in, so none of it reaches `onChange` or saved content.
- **React:** `EditorContent` set `resize: both; overflow: auto; display: inline-block` on every image or video that was clicked, which put a second native resize grip on it, changed the saved content, and overrode block alignment. It no longer does.
- Selecting by clicking a video's control bar no longer takes the click away from the video's own controls.
