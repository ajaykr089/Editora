---
"@editora/core": patch
"@editora/plugins": minor
"@editora/media-manager": minor
---

Media manager: uploads that upload, and a selection that does not leak into the document.

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
