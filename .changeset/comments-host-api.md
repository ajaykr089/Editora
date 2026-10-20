---
"@editora/plugins": minor
"@editora/comments": minor
---

Comments: save and load comments, and name the user.

- **`CommentsPlugin(options)`** now takes `currentUser` (`{ id?, name, avatar? }` or a name), `initialThreads`, `onChange(threads, { reason, threadId })` and `canModify(author, user)`. New comments, replies and resolutions are signed with the current user, whose picture is shown (the initials stay if it does not load). The comments are plain data (`CommentThread`) you can store, so they survive a reload: the highlight in the document's HTML finds its thread again.
- **`storageKey`** keeps the comments in `localStorage` with no backend: saved after every change (before `onChange` is called), loaded when the editor starts, and preferred over `initialThreads` when something is stored. A browser that refuses to store (private mode, quota) does not stop commenting; a warning is logged once.
- **`getCommentThreads(editor)`, `setCommentThreads(editor, threads)` and `configureComments(editor, options)`** read, replace and configure an editor's comments from your own code, and every change is also dispatched as an `editora:comments-change` event on the editor. Types: `CommentThread`, `CommentUser`, `CommentsOptions`, `CommentsChange`.
- **Who may change a comment.** With ids on the user and the comment's author, only the author sees Edit and Delete; `canModify` replaces that rule. Replying and resolving stay open to everyone.
- **A highlight with no thread behind it** (the document was saved with its comments but they were not loaded) loses its colour and its pointer cursor, instead of looking clickable and doing nothing. This is a stylesheet rule, so the document is not touched.
- Data that comes in is checked: entries that cannot be shown are dropped, and ids or picture addresses that could do harm (`javascript:` URLs, ids with quotes in them) are rejected.
- Threads follow the document: a Resolve that the editor's Undo took back, or a deleted thread whose text came back, is picked up and reported with `reason: "document"`.
- The plugin finds its editor by itself in React (the oldest `CommentsPlugin(...)` call still waiting, as editors appear), is told by the web component, and is bound by whichever of its commands runs first; `configureComments` says it explicitly.
