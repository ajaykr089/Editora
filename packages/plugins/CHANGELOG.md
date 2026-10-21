# Change Log

## 1.2.0

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

## 1.1.0

### Minor Changes

- 798b8e1: Media manager: the picker is now the single "Media" window of the design.

  - **One window for all media.** Image, Video, Audio and Replace open the same window, with a sidebar of sources (Library, Upload, From URL, Stock photos, Embed) that are always there when they apply, and All / Images / Video / Audio pills over the library. The command decides which pill it opens on.
  - **Header.** One wide search box, a sort (Newest, Oldest, Name) and a grid / list switch. `MediaQuery` has a new `sort`, which the REST provider sends and the repository's API honours; a provider that cannot sort may ignore it.
  - **Uploads in the library.** Files dropped or pasted while the library is open appear in the grid as tiles with their own progress and a cancel button, and are put at the top when they are done. The window says files can be dropped anywhere.
  - **Details panel.** **Edit** opens the image editor on the chosen picture (the result is stored as a new file and chosen in its place); **Alt** suggests a description. Video and audio tiles show their length (read from the file when it is uploaded).
  - **Look.** Black primary buttons (light in the dark theme), rounder corners, a list layout, and a Library tab whose "nothing here" text names the filter. The image editor opened from the window is closed by Escape on its own, leaving the window open.

- 7f54946: Media manager: a new picker dialog, with a library.

  - Insert Image, Insert Video and Replace Image are now one picker with a **Library**, an **Upload** and a **URL** tab, replacing the plain two-field form. It follows the dark theme, works on a phone (a bottom sheet), and has no accessibility violations in axe in either theme.
  - **Library** (when the provider can `list`, as the REST backend does): a searchable grid that pages as you scroll, with loading placeholders, an empty state that invites an upload, and a failure message with "Try again". Choose several (click, Shift-click for a range, Ctrl/Cmd+A), and insert them in one step; the arrow keys, Space and Enter work in the grid. A details panel shows the item last touched with its alt text (prefilled from the library) and a "This image is decorative" switch that inserts an empty `alt`. Providers that can delete get a Delete button, with a confirmation.
  - **Upload** takes several files at once, by browsing, dropping anywhere on the dialog, or pasting an image. Every file is a tile with its own progress and a cancel button; a failure or refusal shows its reason on the tile, with Retry where trying again can help. A finished upload is chosen for you and the library refreshes.
  - Inserting several items puts them in at the caret, in the order chosen, as one undoable step.
  - API: `MediaProvider.update` now resolves with nothing (it used to return a `MediaItem`) and takes `{ name, alt }`; `MediaItem` gained `alt`. The repository's own API server (`api/server.ts`) now honours `q` and `type` on `GET /api/media/library` and returns `alt` and `mimeType`.

- fe65119: Media manager: paste and drop, captions, alignment and size, and the keyboard.

  - **Paste and drop to upload.** Pasting an image (a screenshot, a copied picture) or dropping image and video files on the editor puts a placeholder where they go, with its own progress and a cancel button, and swaps in the media when it is stored, as one undo step. Failures and refused files (too large, wrong type) say why. Text pasted together with a picture (spreadsheet cells, a copied page) stays text. `uploadOnPaste: false` turns it off.
  - **Figures and captions.** Inserted media is now `<figure class="rte-media" data-align>` with an optional `<figcaption>`; it can be aligned left, centre or right, captioned, and sized from a Size menu (small, medium, large, full width, original; relative to the visible width of the text). Alignment is plain margins and the figure shrinks to the picture (`display: table`), so saved HTML renders the same without the editor's CSS. Media from earlier versions is wrapped when it is aligned or captioned. `wrapInFigure: false` keeps the bare `<img>` / `<video>`. Enter in a caption goes on below, Backspace in an empty one removes it, and pasting into one is a line of plain text.
  - **Inserting at a caret splits the block.** A figure cannot live inside a paragraph (the HTML parser tears it out), so inserting splits the paragraph or heading around the caret instead of putting the figure inside it; at the end of the editor an empty paragraph is left to type in.
  - **Keyboard.** An arrow key at the edge of the paragraph beside media selects it (browsers skip over it), Alt+F10 moves into its toolbar (arrow keys, Enter or Space, Escape or Tab back to the text) and the toolbar keeps the focus on the button used. The corner handles use pointer events, so touch and pen drag them too, and show the size while dragging; they are larger on touch screens.
  - `mediaSlashItems` for `SlashCommandsPlugin({ items })` adds `/image` and `/video`. `getCleanEditorHTML` (core) now drops unfinished uploads, the editing-only `contenteditable` of figures, and captions nobody wrote in, so none of it reaches `onChange` or saved content.
  - **React:** `EditorContent` set `resize: both; overflow: auto; display: inline-block` on every image or video that was clicked, which put a second native resize grip on it, changed the saved content, and overrode block alignment. It no longer does.
  - Selecting by clicking a video's control bar no longer takes the click away from the video's own controls.

- 3e2a3a7: Media manager: uploads that upload, and a selection that does not leak into the document.

  **Uploads and configuration:**
  - The upload progress bar was a random-number timer, and the plugin never read `setMediaManagerConfig`, so the documented API-backed upload did nothing: every file became a data URL. Files now go where you point them, in this order: a `provider`, an `uploadHandler` function, a REST backend (`apiUrl` and `apiEndpoints`), or, with nothing configured, a data URL as before. Settings can be given to one plugin (`MediaManagerPlugin({ uploadHandler })`) and win over the global ones.
  - The progress is real (bytes sent for a server, bytes read for a data URL), an upload can be cancelled with a button or by closing the dialog, and a failure says what happened: the server's own message, or that the file is too large or of a type that is not allowed. A file over `maxFileSize` or outside `allowedTypes` is refused before anything is sent.
  - The drop zone states the real size limit (it said 50 MB whatever the setting). The default limit is 10 MB, and the default types now include WebP and AVIF; `image/*` wildcards work in `allowedTypes`.
  - New exports: `createRestProvider`, `createCallbackProvider`, `createBase64Provider`, `MediaUploadError` and the `MediaProvider`, `MediaItem`, `UploadContext` types. `apiEndpoints` is merged one key at a time, so setting only `upload` keeps the other defaults.
  - `fallbackToBase64` (new, off by default) inserts a data URL when an upload fails. The `offline.*`, `upload.*`, `storage`, `library` and `manipulation` options of the exported `MediaManagerConfig` type were never implemented and are removed from it.

  **Selecting media:**
  - The floating toolbar was inserted into the editor's own content while an image was selected, so it could end up in a saved document; it, and the resize handles, are now drawn outside the editor.
  - Selecting an image no longer edits it (it used to force `display: block`), and aligning, editing alt text, linking, replacing, removing and resizing now tell the editor the content changed and can be undone.
  - Every initialisation of the plugin added another set of document listeners and four more resize handles; there is now one of each however many editors are on the page, and the plugin's `destroy` removes them. The toolbar's scroll listeners were leaked on every selection.
  - Removing a linked image removes the link around it too, when the link held only the image.

  **Core:** `<figure>` and `<figcaption>` are kept by the default sanitizer, in preparation for captioned media.

- b01c88f: Media manager: edit images, and make large uploads smaller.

  - **Edit image** (a new button in the toolbar over a selected image): rotate a quarter either way, flip, crop, scale to a maximum width, and choose how it is saved. The crop is free or to 1:1, 4:3, 3:2, 16:9 or the picture's own shape; drag the box and its handles (mouse, touch or pen) or use the keyboard (arrows move it, Shift and the arrows resize it, and what it covers is announced). The panel shows the size the file will come out at. Turning and flipping mean what you see, the crop turns with the picture, and a transparent picture saved as JPEG gets a white background rather than black.
  - The edit is stored as a **new file** through your upload settings, so the original is not touched, and the image records where it came from (`data-original-src`) so that **Restore original** can bring it back. Nothing changes in the document until Apply, and applying is one undo step. A picture from a server that does not send CORS headers cannot be edited (the canvas would be unreadable) and says so; a GIF is saved as a still picture.
  - **`optimizeImages`** scales down and re-encodes JPEG, PNG and WebP files before they are stored (`true` for wider than 2048px to 2048 at quality 0.85, or `{ maxWidth, quality, format }`). The size limit is applied to the result, so a 12 MB camera photo can pass a 10 MB limit. A file that cannot be made smaller, or that the browser cannot process, is stored as it is. Off by default.

- 7e14517: Media manager: audio, embedded videos, galleries, stock photos and suggested alt text.

  - **Audio.** `insertAudio` and a picker for audio files; the result is a figure with an `<audio controls>` player that can be aligned and captioned, and is selected without taking the click from its controls. The Audio toolbar button is opt-in (`audio: true`) so that existing toolbars do not change; `audio` is a name for toolbar item lists in both toolbars, and `mediaSlashItems` has `/audio`. The default allowed types include MP3, WAV, Ogg, MP4/M4A, AAC and WebM audio. The repository's API server accepts and types audio (databases made before need `ALTER TABLE media MODIFY type ENUM('image', 'video', 'audio') NOT NULL`).
  - **Embedded videos.** The Insert Video dialog has an Embed tab for YouTube and Vimeo links, or the iframe snippet a site offers. Only the video's id is read; the iframe's address is built from it, so a pasted link cannot bring in another host, a script URL or extra parameters (YouTube's privacy-enhanced host, Vimeo's do-not-track setting). The player is a block figure that keeps its shape, loads lazily, can be aligned, captioned and sized, takes no mouse while editing (clicking it selects its figure) and survives the editor's sanitizer through the existing trusted-embed mark. `embedProviders` adds more services.
  - **Galleries.** Choosing two or more pictures offers Insert as gallery: one figure with a grid of equal-shaped pictures in 2 to 5 columns (a Columns menu in the toolbar) and one caption; each picture still has its own alt text, link, edit and replace, and can be removed alone. A gallery of stock photos carries their credits as its caption.
  - **Stock photos.** `stockProvider` adds a tab to the Insert Image dialog: you write `search` (calling your own backend, where the API key lives) and get a searchable, paged grid. Photos are inserted by address with their description as alt text and, by default, "Photo by <author> on <service>" as the caption. The editor calls no service itself.
  - **Suggested alt text.** `generateAltText` adds a Suggest button next to the alt text field in the picker and in the Edit alt text dialog. What comes back is tidied and put in the field for the person to read and change, never inserted on its own; failures are said next to the button.
  - An upload's type is now taken from the file that was sent rather than from the server's reply, so a server that files audio under another type cannot make it insert as something else.

### Patch Changes

- 78aface: Media manager: TypeScript types that match the plugin, and fixes found by testing in Chromium, Firefox and WebKit.

  - **Types.** `@editora/plugins` publishes its types from a hand-written `index.d.ts`, which still said `MediaManagerPlugin(): Plugin` and `MediaManagerConfig = Record<string, unknown>`, so TypeScript users could not use `MediaManagerPlugin({ uploadHandler })`, the providers, `mediaSlashItems`, `parseEmbedUrl` or any of the new settings and types. It now declares all of them (the standalone `@editora/media-manager` already gets generated typings from its source). A test fails when something is exported from the source and not declared.
  - **Selecting.** Clicking an image in an editor that did not have the focus showed the toolbar and removed it at once: the browser focuses the editor after the click and puts a caret at the start of the text, which was read as leaving the image. A click now also selects the media as the browser does, and selection changes right after selecting are ignored.
  - **The toolbar** stays in view over a tall picture that reaches past the top or bottom of the window, where it used to be out of reach, and in a gallery it sits over the picture it is for. Clicking a gallery's second or third picture keeps that picture selected.
  - **Saved documents.** An upload placeholder that a saved document was left with (a tab closed or an autosave taken mid-upload) is removed the next time its editor is entered; placeholders now have ids that cannot collide across page loads.
  - A suggestion for alt text that is still being waited for is stopped when the dialog is closed.
  - `youtube` and `vimeo` are no longer exported (they were never declared or documented; `parseEmbedUrl` is the API).
  - The Storybook story for the media manager described `offline` options that never existed; it now shows what does (an upload handler, a library, stock photos and suggested alt text, audio, embeds and the slash menu, optimized uploads). The stale `IMPLEMENTATION.md` is replaced by `ARCHITECTURE.md`.
  - Pasting or dropping a picture into an Editora editor whose toolbar has no Image, Video or Audio button is left to that editor; the resize handles are 24px on touch screens.
  - **A library without a backend.** The dialog showed only Upload and URL unless the provider could list, which left the grid, search and details panel out of every demo and every `uploadHandler` setup. Providers that cannot list now get a library of what was uploaded from this browser (IndexedDB, in memory where that is unavailable; `localLibrary: false` turns it off). The dialog opens on it once it has something in it.
  - **Caption in the details panel.** The details panel has a Caption field (and stock photo credits fill it); it is inserted as the figure's `<figcaption>`.

- Updated dependencies [fe65119]
- Updated dependencies [3e2a3a7]
- Updated dependencies [7e14517]
  - @editora/core@1.0.25

## 1.0.23

### Patch Changes

- ce68b95: Undo, dialogs, menus and a few plugins that did not do their job.

  **Undo and redo** (editor, web component and code editor):
  - Undo took back one character at a time and kept only the last 100 steps; typing is now grouped into words (a pause, a click, a caret key or Tab, undo and redo end a run; typing over a selection and deleting a selection are steps of their own) and 200 steps are kept.
  - After undo or redo the caret was left at the start of the document; it now goes back to the text that changed.
  - `<editora-editor>` never recorded typing, so Undo (the button and Cmd/Ctrl+Z) did nothing for typed text.
  - In the code editor, Ctrl/Cmd+Shift+Z undid again instead of redoing.

  **Keyboard and screen readers:**
  - Modal dialogs (Image, Video, Template, Preview, Math, Anchor, Code Sample, Emoji, Special Characters and the rest) now get a role and a name, take focus, keep Tab inside, and give the focus and the caret back when they close without changing the text.
  - The toolbar's block-type, font, alignment, line-height and capitalisation menus work with the keyboard in both `@editora/react` and `<editora-editor>`: they announce that they open a menu, take focus, move with the arrow keys, Home and End, choose with Enter or Space, and close with Escape.
  - The Spell Check panel is a named region; the Math dialog's controls are labelled; the media dialog's labels are tied to their fields, its tabs say which is selected, and its upload zone works with the keyboard.
  - In a table, Tab and Shift+Tab move between cells, and Tab in the last cell adds a row.
  - The Comments, Spell Check and Approval Workflow side panels take focus when they open, keep it when they redraw, and give it back to the editor when they close.
  - The Text Color and Background Color pickers could not be used from the keyboard: they opened without taking the focus and sat at the end of the page. They are now named dialogs that take the focus, keep Tab inside, and give the focus and the selection back to the text when they close.
  - Dialogs keep Tab inside in Safari, which does not Tab to buttons by default (the trap used to move the focus only at the first and last control).
  - The slash menu and the mention list tell a screen reader which suggestion is active, and the media dialog's hidden file input has a name.

  **Behaviour fixes:**
  - A URL can be typed in the Image and Video dialogs (the dialog was rebuilt on every keystroke, so only pasting worked), what is pasted there is escaped, and inserting media tells the editor, records Undo and puts the caret after it.
  - The slash menu ran a block command on the previous or next paragraph when the line was otherwise empty; it also now asks every command bridge before the browser's own command, so lists made from it match the toolbar.
  - Dialogs and panels pass an axe-core sweep in the light and dark themes: names for the code sample language select and the background colour input, tabs inside a tablist, text contrast of at least 4.5:1, and no `main` landmark inside the version diff dialog.
  - The floating toolbar of an image inside a link no longer lands on top of the editor toolbar.
  - Cycling the citation style (toolbar button or shortcut) now updates the Style dropdown in the Citations panel; it kept showing the old style.
  - Making a paragraph a list no longer leaves an empty paragraph before and after it, or moves the caret to the start of the line.
  - Choosing a heading keeps the selection.
  - The Math dialog opens with no network (KaTeX comes from the `katex` package, not a script from a CDN) and renders formulas with its layout rules embedded; its template grid no longer hides its last row.
  - Export Word no longer sends a request to `http://localhost:3001` on every click: there is no default API server any more, and with none configured the file is built in the browser. To use a backend, set `apiUrl` (`setGlobalApiConfig` or `setDocumentManagerConfig`). An empty `apiUrl` on a plugin now means "no API".
  - Spell-check suggestions rank the word that was meant first ("tset" gives "test", "wrods" gives "words").
  - The Comments panel no longer lies under the editor toolbar (a CSS variable was defined on the wrong element and the sticky toolbar sat above the panel).
  - Format Painter no longer writes styles the target already shows, so painting leaves no redundant inline styles.
  - Plugins no longer use the browser's `confirm()` and `prompt()`: removing media or a link, resizing, and discarding Source Editor changes use an in-page dialog with a named role, focus trap and Escape.
  - Undo history is capped by size as well as by count (about 40 million characters), and steps that start where the last one ended share a string, so a very large document no longer holds hundreds of copies.
  - Messages such as "Please select text first" appear in a live region instead of a blocking `alert()`.

- Updated dependencies [ce68b95]
  - @editora/core@1.0.24
  - @editora/light-code-editor@1.0.19

## 1.0.22

### Patch Changes

- e0c6fb4: Rewrite the READMEs of `@editora/core`, `@editora/react` and `@editora/plugins`, which are the npm pages of the three packages.

  The old READMEs documented APIs that do not exist (`createEditor({ content, onChange })` with `mount()` and `getJSON()` in core; `useEditor`, `useEditorState`, `ToolbarButton` and `ParagraphPlugin` in react; a catalog with subscript, superscript, audio and horizontal-rule plugins in plugins), and their images used relative paths that npm cannot show. The new ones describe what the packages do, with screenshots and examples:

  - every example is a file that is type-checked in strict mode and run in Chromium, and the README quotes it word for word (`npm run check:readme-examples`);
  - the screenshots are taken from the same examples (`npm run readme:screenshots`);
  - core: the `<editora-editor>` element, its attributes, methods and events, the two bundles, and the sanitising rules;
  - react: the props, the toolbar item names, the editor API, themes, and how to use the editor with Next.js (it cannot be imported on the server, so load it with `next/dynamic` and `ssr: false`);
  - plugins: all 56 plugins with their toolbar item, entry point and import path, plus measured bundle sizes: importing one plugin from the root entry bundles the whole catalog (125 KB gzipped), `lite` costs 24 KB and a subpath import 1 KB.

- Updated dependencies [e0c6fb4]
- Updated dependencies [16ae8ee]
  - @editora/core@1.0.23
  - @editora/light-code-editor@1.0.18

## 1.0.21

### Patch Changes

- da5bebd: Fixes from a real-browser audit of the UI packages.

  **ui-react / ui-sortable:** `className` was rendered as a literal `classname` attribute on custom-element hosts under React 16-18, so it never applied (about 115 wrappers); it is now mapped to `class`. Alert, Badge, Container, ContextMenu, DataTable, EmptyState, Field, Flex, Grid, Skeleton, Table, NavigationMenu and FloatingOverlay now forward refs. `Sortable` no longer crashes while `lists`/`items` are still undefined.

  **ui-core:** invalid selectors in `item-selector`, `direct-item-selector`, portal `target` and positioner `anchor`, and negative or oversized textarea `minlength`/`maxlength`, no longer throw. The transfer list, sortable lists, tab panels, multi-select, date-time picker and colour picker expose accessible names. `<ui-sortable>`: horizontal lanes now actually lay out horizontally; dropping on an empty list or below the last card works and a release no longer commits a stale target; keys typed into controls inside a card are no longer swallowed; keyboard dragging no longer stalls with `allow-nesting="false"`; a cancelled drag no longer leaves a card faded; right-to-left lanes navigate and drop in reading order; dragging near the page edge auto-scrolls.

  **collaboration:** content received from peers can no longer execute (scripts, event handlers, `javascript:` URLs and embeds are filtered), a destroyed binding fully detaches, a caller-supplied doc is no longer destroyed, a supplied provider's own doc is used, editors without an id no longer share the empty room, and a warning is logged when the public demo server is used by default.

  **plugins:** 39 duplicate/generic ids (e.g. `id="icon"`) removed from toolbar icon SVGs.

  **core / react:** the editing surface always has an accessible name (host `aria-label`, then the placeholder, then "Rich text editor").

- Updated dependencies [da5bebd]
  - @editora/core@1.0.20

## 1.0.20

### Patch Changes

- f1326f5: Sanitise HTML in three plugins that handled it with hand-rolled code. The preview dialog and the source-view "Save" used a blacklist on a live detached `<div>` (so `<img onerror>` ran during the cleanup, and `javascript:` links with leading whitespace, mixed case or an embedded newline kept their `href`); importing a `.docx` assigned Mammoth's unsanitised output straight into the editor, and the Word/PDF export parsed the document into a live `<div>`. They now use a shared DOMPurify-based helper (formatting, tables, links and images are kept; scripts, event handlers, `javascript:`/non-image `data:` URLs, `srcdoc`, `<style>`, forms, `<base>` and `<meta>` are removed) and an inert `DOMParser` for read-only traversal.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 1.0.19

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.18

### Patch Changes

- bb57fc7: Fix several ways of losing content. Table: Select All then Insert Table replaced the whole document. Checklist: converting loose root-level text deleted it. Link: a multi-block selection was flattened into a single plain-text `<a>`; it now links per block. code-sample: blocks decayed into a stray "Copy" text node with dead handlers after the first keystroke; they are now `<pre data-lang><code>` with delegated handlers. translation-workflow: unlocking made segments editable in read-only editors. light-code-editor: Backspace beside an emoji left a lone surrogate, Tab replaced a multi-line selection with spaces (it now indents/outdents lines), Replace All needed one Undo per match, and Alt/Cmd+Backspace deleted a single character. markdown-editor: the rich editor remounted on every keystroke and lost focus, and the toolbar inserted a literal `\n`.
- bb57fc7: Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
- bb57fc7: Make edits that bypassed the undo stack undoable, and make them notify `onChange`. Lists, font size, font family, text and background colour and clear-formatting never reached the history plugin; link, emoji, table, code-sample and comment edits additionally never fired an `input` event, so controlled editors did not see them. Each now records exactly one undo step through a shared helper, and the history plugin ignores an identical consecutive snapshot. Emoji insertion refuses read-only editors. Comments keep the panel in step with the document on undo, redo and anchor click.
- bb57fc7: Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
- e74d395: Add the new `@editora/collaboration` plugin to the bundle (`./collaboration` subpath export, plus `CollaborationPlugin` in the main and `enterprise` barrels), matching how every other plugin package is aggregated here.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.0.17](https://github.com/ajaykr089/Editora/compare/@editora/plugins@1.0.10...@editora/plugins@1.0.17) (2026-09-05)

### Bug Fixes

- **plugins:** externalize @editora/light-code-editor in aggregator build ([24d5194](https://github.com/ajaykr089/Editora/commit/24d5194cafa2f88e403bef5511cb245a0cb96ef1))
- **plugins:** fix broken/missing vite configs across 14 plugin packages ([47c3e79](https://github.com/ajaykr089/Editora/commit/47c3e79a17d0ccdc371fc0ef404de4851565c0ca))

## 1.0.10 (2026-03-08)

**Note:** Version bump only for package @editora/plugins

## 1.0.9 (2026-03-05)

**Note:** Version bump only for package @editora/plugins

## 1.0.4 (2026-02-28)

### Changed

- Updated package publish metadata and declaration entrypoint resolution.
- Standardized plugin subpath type mappings to use shipped root declarations.

### Packaging

- Included top-level declaration entry in published files.
- Updated `@editora/core` peer/dev range to `^1.0.4`.

## 1.0.2 (2026-02-13)

**Note:** Version bump only for package @editora/plugins

## 1.0.1 (2026-02-12)

**Note:** Version bump only for package @editora/plugins
