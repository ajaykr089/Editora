---
"@editora/plugins": minor
"@editora/media-manager": minor
---

Media manager: a new picker dialog, with a library.

- Insert Image, Insert Video and Replace Image are now one picker with a **Library**, an **Upload** and a **URL** tab, replacing the plain two-field form. It follows the dark theme, works on a phone (a bottom sheet), and has no accessibility violations in axe in either theme.
- **Library** (when the provider can `list`, as the REST backend does): a searchable grid that pages as you scroll, with loading placeholders, an empty state that invites an upload, and a failure message with "Try again". Choose several (click, Shift-click for a range, Ctrl/Cmd+A), and insert them in one step; the arrow keys, Space and Enter work in the grid. A details panel shows the item last touched with its alt text (prefilled from the library) and a "This image is decorative" switch that inserts an empty `alt`. Providers that can delete get a Delete button, with a confirmation.
- **Upload** takes several files at once, by browsing, dropping anywhere on the dialog, or pasting an image. Every file is a tile with its own progress and a cancel button; a failure or refusal shows its reason on the tile, with Retry where trying again can help. A finished upload is chosen for you and the library refreshes.
- Inserting several items puts them in at the caret, in the order chosen, as one undoable step.
- API: `MediaProvider.update` now resolves with nothing (it used to return a `MediaItem`) and takes `{ name, alt }`; `MediaItem` gained `alt`. The repository's own API server (`api/server.ts`) now honours `q` and `type` on `GET /api/media/library` and returns `alt` and `mimeType`.
