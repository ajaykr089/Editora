---
"@editora/plugins": minor
"@editora/comments": minor
---

Comments: a redesigned comments panel.

- **A new comment says what it is about.** The form that sat open at the top of the panel, anchoring to whatever had been selected earlier without saying so, is gone. Add Comment (or New in the panel) opens a form that quotes the selected text; with nothing selected it is labelled a note for the whole document, and the quote has an x to turn a comment into a note. Enter posts, Shift+Enter starts a new line, Escape cancels.
- **Threads read like a conversation.** Each one has an avatar, the author's name, a relative time ("5 min. ago", the exact time on hover), a one-line quote of the commented text (click it to go there), the comment, its replies and a one-line Reply field that opens when used. Long threads show the latest two replies and "Show N earlier replies". Resolve is a check button, and Delete is in a more menu. Nothing important is hidden behind a chevron any more.
- **Open / Resolved / All tabs** with counts, and an empty state that says why the list is empty. Threads are listed in the order of the document, with notes about the whole document last (`getAllComments()` returns that order, it used to be newest first).
- **Clicking commented text** opens the panel on that thread, on the right tab, and scrolls to it.
- **Fixes.** The text field was cut off at the right edge of the panel. Redrawing the panel no longer resets the list's scroll position or loses a half-written reply. Selecting text inside the panel no longer replaces the remembered document selection, and clicking back into the text forgets it, so New no longer anchors to a selection that is long gone. A highlight in the text no longer stays lit after its card is rebuilt. The panel is quieter (no heavy shadow beside the text), has visible keyboard focus, respects reduced motion, and its behaviour was checked in Chromium, Firefox and WebKit (axe reports no violations in light and dark).
