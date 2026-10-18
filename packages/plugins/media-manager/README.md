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

## Commands and shortcut

- `insertImage` (shortcut `Mod-Shift-i`) and `insertVideo`, with toolbar items **Image** and **Video**

## Inserting

- The dialog has an **Upload** tab (drag a file onto the zone or choose one with the keyboard) and a **URL** tab (URL, alt text, width and height, with a preview).
- The media is inserted at the caret, the caret is put after it, the editor is told its content changed, and the insertion can be undone.

## Editing an inserted image or video

Click it for a floating toolbar: align left, centre or right, edit the alt text, add or remove a link, replace the image and remove it. Drag the corner handles to resize. Removing asks first.

## Configuration

```ts
import { setMediaManagerConfig } from "@editora/media-manager";

setMediaManagerConfig({
  apiUrl: "https://your-api.example.com",
  apiEndpoints: { upload: "/media/upload", library: "/media/library", delete: "/media/library" },
  maxFileSize: 10 * 1024 * 1024,
  allowedTypes: ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"],
});
```

There is no default API server: with no `apiUrl`, nothing is sent anywhere. An empty `apiUrl` set here means "no API" even when a global one is configured.

## Notes

- Every field has a label, the Upload and URL tabs say which is selected, and Escape closes the dialog and gives the focus and the caret back.
