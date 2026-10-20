---
title: Media Manager Plugin
description: Image and video insertion plugin with API-backed upload/library configuration.
keywords: [editora, plugins, media-manager]
---

# Media Manager Plugin

Image and video insertion plugin with API-backed upload/library configuration.

## Installation and Import

```ts
import {
  MediaManagerPlugin,
  setMediaManagerConfig,
  getMediaManagerConfig,
} from "@editora/plugins";
// or subpath: "@editora/plugins/media-manager"
```

## Usage

```ts
setMediaManagerConfig({
  // A REST backend...
  apiUrl: "https://api.example.com",
  apiEndpoints: { upload: "/media/upload" },
  headers: { Authorization: "Bearer ..." },
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png", "video/mp4"],
  // ...or just a function instead:
  // uploadHandler: async (file, { onProgress, signal }) => url,
});

const plugins = [MediaManagerPlugin()];
// Settings can also be given to one instance: MediaManagerPlugin({ uploadHandler })
```

With no configuration, uploaded files are embedded in the document as data URLs.

## Command Matrix

| Action | Command | Shortcut | Toolbar |
| --- | --- | --- | --- |
| Insert image | `insertImage` | `Mod-Shift-i` | `Image` |
| Insert video | `insertVideo` | None | `Video` |

## Config Options

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `provider` | `MediaProvider` | none | Complete provider (`upload`, optional `list`/`update`/`delete`); wins over everything |
| `uploadHandler` | `(file, { onProgress, signal }) => Promise<string \| { url, width?, height?, thumbnailUrl? }>` | none | Upload function |
| `apiUrl` | `string` | Empty | Base API URL; empty means no API (data URLs) |
| `apiEndpoints.upload` / `.library` / `.delete` | `string` | `/media/upload`, `/media/library`, `/media/library` | Merged key by key |
| `headers` | `Record<string,string>` | `{}` | Auth/custom headers, added to the global API headers |
| `withCredentials` | `boolean` | `false` | Send cookies on a cross-origin upload |
| `uploadFieldName` | `string` | `file` | Multipart field name |
| `fallbackToBase64` | `boolean` | `false` | Insert a data URL when the upload fails |
| `audio` | `boolean` | `false` | Put an Audio button in the toolbar (`insertAudio` always works) |
| `embedProviders` | `EmbedProvider[]` | none | More services to embed; YouTube and Vimeo are built in |
| `stockProvider` | `StockProvider` | none | `{ name, search({ search, page, limit }, { signal }) => { items, total? }, caption? }`: adds a Stock tab to Insert Image |
| `generateAltText` | `({ src, name }, { signal }) => Promise<string>` | none | Adds a Suggest button for alt text; the result is only put in the field |
| `wrapInFigure` | `boolean` | `true` | Insert `<figure>` media that can be aligned and captioned; `false` for a bare `<img>` / `<video>` |
| `uploadOnPaste` | `boolean` | `true` | Upload images and videos pasted or dropped into the editor |
| `optimizeImages` | `boolean \| { maxWidth?, quality?, format? }` | off | Scale down and re-encode large JPEG, PNG and WebP uploads (`true`: wider than 2048px is scaled to 2048, quality 0.85); the size limit is checked on the result |
| `maxFileSize` | `number` | `10MB` | Checked before sending |
| `allowedTypes` | `string[]` | JPEG, PNG, GIF, WebP, AVIF, MP4, WebM, Ogg | `image/*` wildcards work |

## The dialog

Insert Image, Insert Video and Replace Image share one picker with three tabs:

- **Library** (when the provider can `list`): searchable, paged grid; click to choose several, Shift-click for a range, double-click or Enter to insert; a details panel with alt text (prefilled from the library) and a decorative-image switch; Delete when the provider can delete
- **Upload**: drop files on the zone or anywhere on the dialog, or paste an image; each file has its own progress, cancel, error and retry
- **URL**: address, alt text and size, with a preview

Provider contract for the library: `list({ page, limit, search, type }, { signal }) => Promise<{ items, total }>`; for the REST backend, `GET <library>?page=&limit=&q=&type=` answering `{ items, total }`.

## In the editor

- Pasted images and dropped image or video files become uploads: a placeholder with progress and a cancel button where they will go, replaced by the media when stored (one undo step). Text pasted with a picture (spreadsheet cells, a copied page) stays text.
- Media is a `<figure class="rte-media" data-align>` with an optional `<figcaption>`: align it, caption it, size it (Size menu: small, medium, large, full width, original, relative to the text width) or drag a corner (mouse, touch, pen).
- Keyboard: an arrow key at the edge of the paragraph beside the media selects it, Alt+F10 moves into its toolbar (arrows, Enter or Space, Escape or Tab back), Enter in a caption goes on below, Backspace in an empty caption removes it.
- **Edit image** (crop button in the toolbar): rotate, flip, crop (free or to a shape), scale to a width, and pick JPEG, WebP or PNG with a quality slider and a size estimate. It is stored as a new file through your upload settings, so the original stays where it was; the image keeps `data-original-src` for **Restore original**. Needs the picture's server to allow CORS.
- `SlashCommandsPlugin({ items: mediaSlashItems })` adds `/image` and `/video`.
- The toolbar, handles and placeholders are drawn outside the editor; the editor strips the editing-only `contenteditable` and empty captions from the HTML it emits.

## Audio, embeds and galleries

- **Audio**: `insertAudio` and a picker for audio files; the result is a figure with an `<audio controls>`.
- **Embedded video**: the Insert Video dialog's Embed tab takes a YouTube or Vimeo link (or its iframe snippet). Only the video id is read; the iframe address is built from it, using YouTube's privacy-enhanced host and Vimeo's do-not-track setting. The iframe carries `data-editora-embed="true"`, which keeps the sanitizer from removing it.
- **Gallery**: choose two or more pictures and Insert as gallery: one `figure.rte-gallery` with a 2 to 5 column grid and one caption.
- **Stock photos** and **suggested alt text** call functions you provide; the editor contacts no service by itself.

## Behavior

- Resolves active editor context before opening dialog
- Uploads show true progress, can be cancelled, and report failures; files are checked against `maxFileSize` and `allowedTypes` before anything is sent
- The selection toolbar and resize handles are drawn outside the editor (never in the saved content); one selection at a time across all editors
- Inserts selected media into current editor selection flow

## Validation Checklist

- Upload and insert for allowed types
- Correct instance targeting in multi-editor pages
- Dialog/picker styles consistent in light/dark themes
