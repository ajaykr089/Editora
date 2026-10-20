# @editora/media-manager

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

## 1.0.4

### Patch Changes

- f1326f5: Ship TypeScript declarations. These packages declare `"types": "dist/index.d.ts"` in their `package.json`, but their build only produced JavaScript, so that file never existed in any published version and TypeScript users got no typings from them (TS7016, or an implicit `any`). Each package now includes a generated `dist/index.d.ts` (plus the declaration files it re-exports under `dist/_types/`), and the release workflow refuses to publish a package whose declared typings are missing.
- Updated dependencies [f1326f5]
  - @editora/core@1.0.19

## 1.0.3

### Patch Changes

- 84dc7ed: Re-release with the build output that was missing from the published packages. The CI publish workflow only built a handful of packages (`verify:release`), and `changeset publish` packs whatever is on disk, so these packages went to npm without their `dist/` folder: the latest published version of each installs but cannot be imported (`main` / `module` / `exports` point at files that are not in the tarball). `@editora/core`, `@editora/react`, `@editora/plugins`, `@editora/themes`, `@editora/ui-core`, `@editora/ui-react`, `@editora/light-code-editor` and `@editora/markdown-editor` were built and are unaffected.

  If you use one of the individual plugin packages, upgrade to this release; `@editora/plugins` (which bundles all of them) was never affected. The release workflow now builds every workspace and refuses to publish a package whose entry points are not in its tarball.

  Also: `@editora/code` and `@editora/plugins` import `@editora/light-code-editor` at runtime but did not declare it; it is now a dependency. `@editora/cli` writes its programmatic entry points (`dist/index.cjs`, `dist/index.mjs`) during `build` instead of relying on gitignored files that only existed on one machine.

## 1.0.2

### Patch Changes

- 1845a93: Fix the same duplicate-stacked-overlay bug as the prior patch (see `dialog-overlay-stacking.md`) in two more plugins found during continued systematic QA: Insert Image/Video (`@editora/media-manager`) and the Accessibility Checker (`@editora/a11y-checker`, whose `toggleA11yChecker` command is misleadingly named - it always opened a new dialog rather than actually toggling one closed). Both now remove any existing instance of their dialog before creating a new one.
- bb57fc7: Dialog polish. Dragging out of a dialog input to select text no longer closes the dialog when the mouse is released over the backdrop (shared guard across the plugin dialogs). Dialogs use the editor's typeface instead of mixing serif and sans. Emoji and special-character category tabs are no longer clipped on phone-width viewports. The embed dialog has labelled fields and inline errors. Anchor IDs accept uppercase letters, and a11y-checker suggestions no longer swallow `<label>`/`<th>` elements.
- bb57fc7: Close several script-injection paths found in a hardening pass. The comments panel interpolated the selected document text (`range.toString()`) into `innerHTML`, so a document containing `<img onerror=…>` executed when a comment was added (stored XSS); it is now built with `textContent`. The media-manager, code-sample, math, link, emojis, template and a11y-checker dialogs interpolated alt text, link URL/title, code, formulas and search text into markup unescaped; they now escape through a shared helper, and MathML is reduced to a whitelist in an inert `DOMParser` document. The link URL field is validated in code (`javascript:`/`data:` blocked, `#anchor`, relative paths, `mailto:` and bare domains accepted). The markdown-editor preview rendered raw `marked` output unsanitised and now goes through core's DOMPurify wrapper (`@editora/core` is now a dependency of `@editora/markdown-editor`). embed-iframe validates the URL properly and shows inline errors instead of `alert()`.
- Updated dependencies [202a5eb]
- Updated dependencies [a1640aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [c26b303]
- Updated dependencies [c913780]
- Updated dependencies [b9b30aa]
- Updated dependencies [bb57fc7]
- Updated dependencies [e74d395]
  - @editora/core@1.0.16
