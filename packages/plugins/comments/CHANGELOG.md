# @editora/comments

## 1.1.0

### Minor Changes

- 4ed01e4: Comments: save and load comments, and name the user.

  - **`CommentsPlugin(options)`** now takes `currentUser` (`{ id?, name, avatar? }` or a name), `initialThreads`, `onChange(threads, { reason, threadId })` and `canModify(author, user)`. New comments, replies and resolutions are signed with the current user, whose picture is shown (the initials stay if it does not load). The comments are plain data (`CommentThread`) you can store, so they survive a reload: the highlight in the document's HTML finds its thread again.
  - **`storageKey`** keeps the comments in `localStorage` with no backend: saved after every change (before `onChange` is called), loaded when the editor starts, and preferred over `initialThreads` when something is stored. A browser that refuses to store (private mode, quota) does not stop commenting; a warning is logged once.
  - **`getCommentThreads(editor)`, `setCommentThreads(editor, threads)` and `configureComments(editor, options)`** read, replace and configure an editor's comments from your own code, and every change is also dispatched as an `editora:comments-change` event on the editor. Types: `CommentThread`, `CommentUser`, `CommentsOptions`, `CommentsChange`.
  - **Who may change a comment.** With ids on the user and the comment's author, only the author sees Edit and Delete; `canModify` replaces that rule. Replying and resolving stay open to everyone.
  - **A highlight with no thread behind it** (the document was saved with its comments but they were not loaded) loses its colour and its pointer cursor, instead of looking clickable and doing nothing. This is a stylesheet rule, so the document is not touched.
  - Data that comes in is checked: entries that cannot be shown are dropped, and ids or picture addresses that could do harm (`javascript:` URLs, ids with quotes in them) are rejected.
  - Threads follow the document: a Resolve that the editor's Undo took back, or a deleted thread whose text came back, is picked up and reported with `reason: "document"`.
  - The plugin finds its editor by itself in React (the oldest `CommentsPlugin(...)` call still waiting, as editors appear), is told by the web component, and is bound by whichever of its commands runs first; `configureComments` says it explicitly.

- 2ca0001: Comments: apply other people's changes live.

  - **`upsertCommentThread(editor, thread)` and `removeCommentThread(editor, id)`** add, replace or take away a single thread while the editor is open, for shared comments (a WebSocket, polling, a push). Unlike `setCommentThreads`, which replaces everything, they leave what the person here is doing alone: a half-written comment or reply, an edit in progress, the thread they are on, the list's scroll position and the focus. A replaced thread keeps its place; a thread marked resolved elsewhere moves to the Resolved tab and its highlight follows; an edit of a reply that was deleted elsewhere is cancelled. Neither calls `onChange` or writes `storageKey`, so a change you apply cannot bounce back to your server. Both return `false` when there was nothing to do.
  - **Fix:** the panel was redrawn after every change to the document, including the class change of the highlight that a Resolve itself makes, which could close a menu that had just been opened. It is now redrawn only when what it shows changes (a thread appears or goes, or is resolved or reopened).

- f9ff8ba: Comments: starting, working on and undoing comments.

  - **A bubble over selected text.** Select text and a small "Comment" button appears under it (it waits for the mouse to come up, so it does not chase a drag, and follows the text when the page scrolls). It is offered only in editors that have comments and are editable. **Cmd/Ctrl+Alt+M** does the same from the keyboard, as in Google Docs; it works by key code, so it also works on a Mac where Alt changes the character.
  - **The thread and its text point at each other.** Pointing at (or tabbing into) a card lights its text, and clicking a card marks it as the active thread and scrolls its text into view. Clicking the text still opens the card. The lighting is a stylesheet rule on the anchor's id, not a class on the anchor, so a highlight is never saved with the document or put in undo history.
  - **Edit.** The more menu of a comment, and of every reply, has Edit: the text becomes a field (Enter saves, Shift+Enter starts a line, Escape or Cancel puts it back) and an edited comment says "edited".
  - **Delete can be taken back.** Deleting a thread, a note or a reply shows "Deleted · Undo" at the foot of the panel for a few seconds. Undo puts the highlight back in the text too; if the document has changed too much for that, it says so and points at the editor's own Undo.
  - **On a phone** (under 640px) the panel is a bottom sheet with a grip, larger touch targets and 16px fields (so iOS does not zoom), and "go to this text" keeps the text above the sheet instead of under it.
  - Fixes: the New button's hover was below 4.5:1 contrast in the dark theme; an editor removed from the page no longer keeps its highlights in the stylesheet.

- fa37e17: Comments: a redesigned comments panel.

  - **A new comment says what it is about.** The form that sat open at the top of the panel, anchoring to whatever had been selected earlier without saying so, is gone. Add Comment (or New in the panel) opens a form that quotes the selected text; with nothing selected it is labelled a note for the whole document, and the quote has an x to turn a comment into a note. Enter posts, Shift+Enter starts a new line, Escape cancels.
  - **Threads read like a conversation.** Each one has an avatar, the author's name, a relative time ("5 min. ago", the exact time on hover), a one-line quote of the commented text (click it to go there), the comment, its replies and a one-line Reply field that opens when used. Long threads show the latest two replies and "Show N earlier replies". Resolve is a check button, and Delete is in a more menu. Nothing important is hidden behind a chevron any more.
  - **Open / Resolved / All tabs** with counts, and an empty state that says why the list is empty. Threads are listed in the order of the document, with notes about the whole document last (`getAllComments()` returns that order, it used to be newest first).
  - **Clicking commented text** opens the panel on that thread, on the right tab, and scrolls to it.
  - **Fixes.** The text field was cut off at the right edge of the panel. Redrawing the panel no longer resets the list's scroll position or loses a half-written reply. Selecting text inside the panel no longer replaces the remembered document selection, and clicking back into the text forgets it, so New no longer anchors to a selection that is long gone. A highlight in the text no longer stays lit after its card is rebuilt. The panel is quieter (no heavy shadow beside the text), has visible keyboard focus, respects reduced motion, and its behaviour was checked in Chromium, Firefox and WebKit (axe reports no violations in light and dark).

## 1.0.6

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 1.0.5

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.4

### Patch Changes

- bb57fc7: Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
- bb57fc7: Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
- b9b30aa: Fix toolbar icons rendering as solid black squares instead of their actual glyph when many plugins are loaded together. Both icons' upstream SVGRepo export used a class-based `<defs><style>.cls-1{fill:none}</style></defs>` block for a transparent bounding rect - fine when an icon is shadow-DOM-scoped, but this markup is inserted via raw `innerHTML` into plain light-DOM toolbar content alongside every other plugin's icon, so the `<style>` tag applied document-wide: any other icon reusing the same auto-generated class name would collide with it. Inlined the one declaration it held (`fill="none"`) directly on the rect instead, so there's nothing left to leak.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
