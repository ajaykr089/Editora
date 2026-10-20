# @editora/comments

[![Version](https://img.shields.io/npm/v/@editora/comments)](https://www.npmjs.com/package/@editora/comments)
[![License](https://img.shields.io/npm/l/@editora/comments)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Size](https://img.shields.io/bundlephobia/minzip/@editora/comments)](https://bundlephobia.com/package/@editora/comments)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Comments plugin for Editora rich text editor.

![Comment threads beside the document: avatars, the quoted text, replies, Open / Resolved / All tabs](https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/plugins/comments/docs/images/comments-panel.png)

<table>
  <tr>
    <td width="50%"><img alt="A Comment button appears under selected text" src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/plugins/comments/docs/images/comments-selection.png"></td>
    <td width="50%"><img alt="The new-comment form quotes the selected text" src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/plugins/comments/docs/images/comments-new.png"></td>
  </tr>
  <tr>
    <td align="center">Select text and a <b>Comment</b> button appears (or press Cmd/Ctrl+Alt+M).</td>
    <td align="center">The form says what the comment is about.</td>
  </tr>
</table>

On a phone the panel is a bottom sheet:

<img alt="The comments panel as a bottom sheet on a phone, in the dark theme" src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/plugins/comments/docs/images/comments-mobile-dark.png" width="260">

## What It Does

- Adds inline comment anchors to selected text, or a note about the whole document.
- Opens an editor-scoped comments side panel with Open / Resolved / All tabs.
- Threads show the author, a relative time, the quoted text, replies, and resolve/reopen and delete actions.
- Supports showing/hiding comments per editor instance.
- Integrates with editor theming and multi-instance behavior.

## Installation

```bash
npm install @editora/comments
```

Or bundle install:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { CommentsPlugin } from "@editora/comments";

const plugins = [CommentsPlugin()];
```

## Saving comments and naming the user

Comments are plain data. Give the plugin who is commenting, the threads you saved, and a place to save them:

```ts
CommentsPlugin({
  currentUser: { id: "u42", name: "Ada Lovelace", avatar: "https://example.com/ada.png" },
  initialThreads: savedThreads, // CommentThread[] from your database
  onChange: (threads, { reason, threadId }) => saveThreads(threads),
});
```

The highlight that anchors a comment is part of the document's HTML, so save the HTML and the threads together. Create one `CommentsPlugin(...)` per editor.

No backend yet? `CommentsPlugin({ storageKey: "comments:my-document" })` keeps the comments in this browser's `localStorage`, saved after every change and loaded when the editor starts.

| Option | Description |
| --- | --- |
| `currentUser` | `{ id?, name, avatar? }` or a name. Signs new comments, replies and resolutions. Default `{ name: "User" }`. |
| `initialThreads` | Threads to show when the editor starts. |
| `storageKey` | Keep the comments in `localStorage` under this key (one per document): saved after every change, loaded at start, and preferred over `initialThreads` when something is stored. Save the HTML too, for example with the editor's `autosave`. |
| `onChange(threads, change)` | After every change, with all threads. `change.reason` is `create`, `reply`, `edit`, `resolve`, `reopen`, `delete` or `document`. |
| `canModify(author, user)` | Who may edit or delete a comment. Default: your own, when both have an `id`; anyone, when there are no ids. |

```ts
import { getCommentThreads, setCommentThreads, configureComments } from "@editora/comments";

getCommentThreads(editorElement); // all threads that were not deleted
setCommentThreads(editorElement, threads); // replace them (does not call onChange)
configureComments(editorElement, options); // the options above, given explicitly
```

`editorElement` is the editor or anything inside it. Every change is also dispatched as an `editora:comments-change` event on the editor (`detail`: `{ threads, reason, threadId }`). A thread whose highlight is not in the document is kept but not shown; a highlight with no thread loses its colour.

## Toolbar Commands

- `addComment` (toolbar label: `Add Comment`)
- `toggleComments` (toolbar label: `Show / Hide Comments`)

## Behavior Notes

- `addComment` opens a new-comment form in the panel. With text selected the form quotes it and the comment is anchored there; with nothing selected it is a note for the whole document. Enter posts, Shift+Enter adds a line, Escape cancels.
- Select text and a **Comment** bubble appears under it; **Cmd/Ctrl+Alt+M** starts a comment from the keyboard.
- Clicking highlighted text opens its thread, and clicking a thread's card scrolls to its text. Threads are listed in document order, notes last.
- Comments and replies can be edited (Edit in the more menu); deleting one offers Undo for a few seconds.
- Under 640px wide the panel becomes a bottom sheet.
- `toggleComments` opens/closes the panel without losing editor context.
- Panel mounting is editor-root scoped for multiple editors on the same page.

## Notes

- Public package entry exports `CommentsPlugin`.
