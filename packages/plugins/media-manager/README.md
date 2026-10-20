# @editora/media-manager

[![Version](https://img.shields.io/npm/v/@editora/media-manager)](https://www.npmjs.com/package/@editora/media-manager)
[![License](https://img.shields.io/npm/l/@editora/media-manager)](https://github.com/ajaykr089/Editora/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/

Inserts images and videos from a URL or a file, and edits them in place.

## Installation

```bash
npm install @editora/media-manager
```

Or the bundled plugins:

```bash
npm install @editora/plugins
```

## Usage

```ts
import { MediaManagerPlugin } from "@editora/media-manager";
// or: import { MediaManagerPlugin } from "@editora/plugins";

const plugins = [MediaManagerPlugin()];
```

With no configuration, files you upload are embedded in the document as data URLs.

## Commands and shortcut

- `insertImage` (shortcut `Mod-Shift-i`) and `insertVideo`, with toolbar items **Image** and **Video**

## Inserting

- The dialog has an **Upload** tab (drag a file onto the zone or choose one with the keyboard) and a **URL** tab (URL, alt text, width and height, with a preview).
- Uploads show their real progress, can be cancelled (the Cancel upload button, or closing the dialog), and say what went wrong when they fail: a file that is too large or of a type that is not allowed is refused before anything is sent.
- The media is inserted at the caret, the caret is put after it, the editor is told its content changed, and the insertion can be undone.

## Editing an inserted image or video

Click it for a floating toolbar: align left, centre or right, edit the alt text, add or remove a link, replace the image and remove it. Drag the corner handles to resize. Removing asks first.

## Where files go

Decided in this order: a `provider`, an `uploadHandler`, a REST backend (`apiUrl`), or, with none of those, the document itself (data URLs).

```ts
import { MediaManagerPlugin, setMediaManagerConfig } from "@editora/media-manager";

// 1. A function: receive the file, report progress, return the URL
setMediaManagerConfig({
  uploadHandler: async (file, { onProgress, signal }) => {
    const { url } = await myStorage.upload(file, { signal, onProgress: (f) => onProgress?.({ loaded: f, total: 1, fraction: f }) });
    return url; // or { url, width, height, thumbnailUrl }
  },
});

// 2. A REST backend (see CUSTOM_SERVER_UPLOAD.md for the format it answers)
setMediaManagerConfig({
  apiUrl: "https://your-api.example.com",
  apiEndpoints: { upload: "/media/upload" }, // library and delete keep their defaults
  headers: { Authorization: "Bearer ..." },
  maxFileSize: 20 * 1024 * 1024,
  allowedTypes: ["image/*", "video/mp4"],
});

// Or give the settings to one plugin instance; they win over the global ones
const plugins = [MediaManagerPlugin({ uploadHandler })];
```

| Option | Default | |
| --- | --- | --- |
| `provider` | none | A complete provider: `upload(file, { signal, onProgress })`, and optionally `list`, `update`, `delete` |
| `uploadHandler` | none | Upload function, wrapped into a provider |
| `apiUrl`, `apiEndpoints`, `headers` | none | REST backend; the endpoints are merged key by key |
| `withCredentials`, `uploadFieldName` | `false`, `file` | Cookies on a cross-origin upload; multipart field name |
| `fallbackToBase64` | `false` | Insert a data URL when the upload fails, instead of showing the error |
| `maxFileSize` | 10 MB | Checked before sending; the dialog states it |
| `allowedTypes` | JPEG, PNG, GIF, WebP, AVIF, MP4, WebM, Ogg video | `image/*` wildcards work |

`createRestProvider`, `createCallbackProvider` and `createBase64Provider` are exported for building your own provider. There is no default API server: with no `apiUrl`, nothing is sent anywhere. An empty `apiUrl` set here means "no API" even when a global one is configured.

## Notes

- The selection toolbar and resize handles are drawn outside the editor, so they never end up in the saved document. Every field has a label, the Upload and URL tabs say which is selected, and Escape closes the dialog and gives the focus and the caret back.
