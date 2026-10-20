---
title: Comments Plugin
description: Threaded comments on selected text, in a side panel. Save and load threads from your own backend.
keywords: [editora, plugins, comments]
---

# Comments Plugin

Threaded comments on selected text (or on the whole document), in a side panel next to the editor. Comments are plain data you can store and load, so they work with your own backend and users.

## Installation and Import

```ts
import { CommentsPlugin } from "@editora/plugins";
// or: import { CommentsPlugin } from "@editora/comments";
```

## Usage

```ts
const plugins = [CommentsPlugin()];
```

With a signed-in user, and saving the comments with the document:

```tsx
const [saved] = useState(() => loadThreads(documentId)); // CommentThread[] from your database

const plugins = useMemo(
  () => [
    CommentsPlugin({
      currentUser: { id: user.id, name: user.name, avatar: user.photoUrl },
      initialThreads: saved,
      onChange: (threads, change) => saveThreads(documentId, threads),
    }),
  ],
  [],
);
```

Comments are anchored to the text with a highlight that is part of the document's HTML, so save the HTML and the threads together.

## Options

| Option | Type | Description |
| --- | --- | --- |
| `currentUser` | `{ id?, name, avatar? }` or a name | Who is commenting. New comments, replies and resolutions are signed with this. Default `{ name: 'User' }`. |
| `initialThreads` | `CommentThread[]` | Threads to show when the editor starts. |
| `onChange` | `(threads, { reason, threadId? }) => void` | Called after every change with all threads. `reason` is `create`, `reply`, `edit`, `resolve`, `reopen`, `delete`, or `document` (a change that came from the text, such as the editor's own Undo). |
| `canModify` | `(author, user) => boolean` | Who may edit or delete a comment. By default people change their own comments when both have an `id`, and anyone may when there are no ids. Anyone can always reply and resolve. |

Create one `CommentsPlugin(...)` for each editor, as with any plugin: the options belong to the editor the plugin was made for.

## Reading and setting threads

```ts
import { getCommentThreads, setCommentThreads, configureComments } from "@editora/plugins";

getCommentThreads(editorElement);            // CommentThread[]: everything that was not deleted
setCommentThreads(editorElement, threads);   // replace what the editor has (does not call onChange)
configureComments(editorElement, options);   // the same options as CommentsPlugin(options), given explicitly
```

`editorElement` is the editor, or anything inside it. The editor also dispatches `editora:comments-change` (bubbling, `detail` is `{ threads, reason, threadId }`) on every change, for code that does not own the plugin call.

A thread whose highlight is not in the document is kept (and returned by `getCommentThreads`) but not shown. A highlight in the document with no thread behind it loses its colour, so it does not look clickable.

### The thread format

```ts
interface CommentThread {
  id: string;
  anchorId?: string;        // id of the highlighted span in the document; none for a note about the whole document
  quote?: string;           // the text that was selected
  author: { id?: string; name: string; avatar?: string };
  text: string;
  createdAt: string;        // ISO date
  editedAt?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: { id?: string; name: string; avatar?: string };
  replies: { id: string; author: CommentUser; text: string; createdAt: string; editedAt?: string }[];
}
```

Whatever you pass in is checked: entries that cannot be shown are dropped, authors written as plain names become users, and ids or picture addresses that could do harm (a `javascript:` URL, an id with quotes in it) are rejected.

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Create comment | `addComment` | Cmd/Ctrl+Alt+M | `Add Comment` |
| Toggle comments panel | `toggleComments` | None | `Show / Hide Comments` |

## Behavior

- Select text and a **Comment** bubble appears under it; the shortcut and the toolbar button do the same. With nothing selected, a comment is a note for the whole document.
- Threads are listed in the order of the document, with the notes last, under **Open / Resolved / All** tabs.
- Clicking highlighted text opens its thread; clicking a thread scrolls to its text.
- Comments and replies can be edited; deleting one offers Undo for a few seconds.
- Under 640px wide the panel is a bottom sheet.

## Multi-Instance Notes

- The panel mounts in its own editor, and highlights and threads stay editor-scoped.
- On a page with several editors, give each its own `CommentsPlugin(options)`. If the plugin cannot tell which editor is its own (rare), use `configureComments(editorElement, options)`.

## Validation Checklist

- Panel opens in the correct editor instance
- Add-comment flow does not shake or reflow unrelated editors
- Threads saved with the document come back after a reload, with their highlights live
- Dark theme panel contrast is readable
