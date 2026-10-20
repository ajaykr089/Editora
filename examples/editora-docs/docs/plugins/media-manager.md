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
| `maxFileSize` | `number` | `10MB` | Checked before sending |
| `allowedTypes` | `string[]` | JPEG, PNG, GIF, WebP, AVIF, MP4, WebM, Ogg | `image/*` wildcards work |

## The dialog

Insert Image, Insert Video and Replace Image share one picker with three tabs:

- **Library** (when the provider can `list`): searchable, paged grid; click to choose several, Shift-click for a range, double-click or Enter to insert; a details panel with alt text (prefilled from the library) and a decorative-image switch; Delete when the provider can delete
- **Upload**: drop files on the zone or anywhere on the dialog, or paste an image; each file has its own progress, cancel, error and retry
- **URL**: address, alt text and size, with a preview

Provider contract for the library: `list({ page, limit, search, type }, { signal }) => Promise<{ items, total }>`; for the REST backend, `GET <library>?page=&limit=&q=&type=` answering `{ items, total }`.

## Behavior

- Resolves active editor context before opening dialog
- Uploads show true progress, can be cancelled, and report failures; files are checked against `maxFileSize` and `allowedTypes` before anything is sent
- The selection toolbar and resize handles are drawn outside the editor (never in the saved content); one selection at a time across all editors
- Inserts selected media into current editor selection flow

## Validation Checklist

- Upload and insert for allowed types
- Correct instance targeting in multi-editor pages
- Dialog/picker styles consistent in light/dark themes
