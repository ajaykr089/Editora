---
"@editora/plugins": minor
"@editora/comments": minor
---

Comments: starting, working on and undoing comments.

- **A bubble over selected text.** Select text and a small "Comment" button appears under it (it waits for the mouse to come up, so it does not chase a drag, and follows the text when the page scrolls). It is offered only in editors that have comments and are editable. **Cmd/Ctrl+Alt+M** does the same from the keyboard, as in Google Docs; it works by key code, so it also works on a Mac where Alt changes the character.
- **The thread and its text point at each other.** Pointing at (or tabbing into) a card lights its text, and clicking a card marks it as the active thread and scrolls its text into view. Clicking the text still opens the card. The lighting is a stylesheet rule on the anchor's id, not a class on the anchor, so a highlight is never saved with the document or put in undo history.
- **Edit.** The more menu of a comment, and of every reply, has Edit: the text becomes a field (Enter saves, Shift+Enter starts a line, Escape or Cancel puts it back) and an edited comment says "edited".
- **Delete can be taken back.** Deleting a thread, a note or a reply shows "Deleted · Undo" at the foot of the panel for a few seconds. Undo puts the highlight back in the text too; if the document has changed too much for that, it says so and points at the editor's own Undo.
- **On a phone** (under 640px) the panel is a bottom sheet with a grip, larger touch targets and 16px fields (so iOS does not zoom), and "go to this text" keeps the text above the sheet instead of under it.
- Fixes: the New button's hover was below 4.5:1 contrast in the dark theme; an editor removed from the page no longer keeps its highlights in the stylesheet.
