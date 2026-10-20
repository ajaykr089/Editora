---
"@editora/plugins": minor
"@editora/comments": minor
---

Comments: apply other people's changes live.

- **`upsertCommentThread(editor, thread)` and `removeCommentThread(editor, id)`** add, replace or take away a single thread while the editor is open, for shared comments (a WebSocket, polling, a push). Unlike `setCommentThreads`, which replaces everything, they leave what the person here is doing alone: a half-written comment or reply, an edit in progress, the thread they are on, the list's scroll position and the focus. A replaced thread keeps its place; a thread marked resolved elsewhere moves to the Resolved tab and its highlight follows; an edit of a reply that was deleted elsewhere is cancelled. Neither calls `onChange` or writes `storageKey`, so a change you apply cannot bounce back to your server. Both return `false` when there was nothing to do.
- **Fix:** the panel was redrawn after every change to the document, including the class change of the highlight that a Resolve itself makes, which could close a menu that had just been opened. It is now redrawn only when what it shows changes (a thread appears or goes, or is resolved or reopened).
