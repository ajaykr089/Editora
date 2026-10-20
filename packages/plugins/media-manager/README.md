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

One dialog for Insert Image, Insert Video and Replace Image, with a **Library**, an **Upload** and a **URL** tab:

- **Library** (when the provider can list; see below): a searchable grid of what you have uploaded, paged as you scroll. Click to choose (several are fine; Shift-click chooses a range, Ctrl/Cmd+A everything loaded), double-click or Enter to insert. A details panel shows the item last touched, with its alt text (prefilled from the library) and a "decorative image" switch that inserts an empty `alt`. Providers that can delete get a Delete button there.
- **Upload**: drop files on the zone, anywhere on the dialog, or paste an image; several at once. Each file is a tile with its own real progress, a cancel button, and, if it fails or is refused (too large, wrong type), the reason, with Retry where trying again can help. A finished upload is chosen for you, and shows up in the library.
- **URL**: the address, alt text, width and height, with a preview. An address that ends like a video is inserted as a video.
- It works from the keyboard (arrows through the grid, Space to choose, Enter to insert), on a phone (it becomes a bottom sheet), and in the dark theme.
- The media is inserted at the caret, the caret is put after it, the editor is told its content changed, and the insertion can be undone. Several chosen items go in as one undoable step, in the order they were chosen.

## In the editor

- **Paste and drop.** Paste an image (a screenshot, a copied picture) or drop image and video files onto the editor and each one gets a placeholder where it will go, with its own progress and a cancel button, then becomes the real media when it is stored. It is one undo step. Several files at once are fine. What is pasted along with text (a spreadsheet's cells, a copied page) is left as text. Turn it off with `uploadOnPaste: false`.
- **Captioned, aligned media.** Inserted media is a `<figure>`: align it left, centre or right, and add a caption under it (Enter in the caption goes on in a new paragraph, Backspace in an empty one removes it, pasting into it gives one line of plain text). Media without a figure (from earlier versions) gets one when you align or caption it.
- **Select it** by clicking, or with the keyboard: an arrow key at the edge of the paragraph beside it steps onto it, the next one carries on past it. Escape lets go.
- **The toolbar** over a selected image or video: align, **Size** (small, medium, large, full width, original size; relative to the width of the text), caption, alt text, link, replace, remove. From the keyboard, Alt+F10 moves into it; the arrow keys go along it, Enter or Space uses a button, Escape or Tab goes back to the text.
- **Edit image** (the crop button in the toolbar): turn it a quarter either way, flip it, crop it (free, or to 1:1, 4:3, 3:2, 16:9 or the picture's own shape; drag the box and its handles, or use the arrow keys, Shift and the arrows resize it), scale it down to a width, and choose how it is saved (JPEG, WebP or PNG, with a quality slider and the size the file will come out at). Nothing changes in the document until Apply. The edit is stored as a **new file** through your upload settings, so the original is still where it was, and the image remembers it (`data-original-src`) so that **Restore original** can bring it back. A picture from a server that does not send CORS headers can be shown but not edited, and the editor says so; GIFs are saved as still pictures.
- **Drag a corner** to resize (mouse, touch or pen); the size shows while you drag.
- **Slash menu.** `SlashCommandsPlugin({ items: mediaSlashItems })` adds `/image` and `/video`.
- The toolbar, the handles and the upload placeholders are drawn outside the editor, so none of them end up in the document.

What is saved is plain, and needs none of the editor's CSS:

```html
<figure class="rte-media" data-align="center" style="display: table; max-width: 100%; margin: 1em auto;">
  <img src="…" alt="…" width="480" height="300" style="max-width: 100%; height: auto; display: block;">
  <figcaption style="display: table-caption; caption-side: bottom; …">A caption</figcaption>
</figure>
```

(`display: table` makes the figure as wide as the picture, so the caption wraps at the picture's width.) While editing, the figure is `contenteditable="false"` with only the caption editable; the editor leaves that out of the HTML it hands to you, along with captions nobody wrote in. `wrapInFigure: false` inserts the bare `<img>` / `<video>` of earlier versions.

## Audio, embedded videos, galleries

- **Audio.** `insertAudio` opens the same picker for audio files (MP3, WAV, Ogg, M4A, AAC); the result is a `<figure>` with an `<audio controls>` player that can be aligned and captioned. The toolbar's Audio button is off by default so that existing toolbars do not change: `audio: true` adds it (`audio` is also a name for `toolbar` item lists), and `mediaSlashItems` has `/audio`.
- **Embedded videos.** The Insert Video dialog has an **Embed** tab: paste a YouTube or Vimeo link (watch, short, `youtu.be`, shorts, playlists, a start time, Vimeo private links) or the iframe snippet the site gives you. The player is a block figure that keeps its shape (16:9, or upright for Shorts), loads lazily, uses YouTube's privacy-enhanced host and Vimeo's do-not-track setting, and can be aligned, captioned and sized from the toolbar. Only the video's **id** is read from what you paste; the iframe's address is built from it, so a link cannot bring in another host, script or parameters. Add more services with `embedProviders: [{ id, label, parse(url) }]` (what `parse` returns must be an https address). While editing, a player takes no mouse (click it to select its figure); it plays normally in the saved page. The iframe carries `data-editora-embed="true"`, which is what keeps the editor's sanitizer from removing it.
- **Galleries.** Choose two or more pictures in the Library, Stock or Upload tab and **Insert as gallery** puts them in one `<figure class="rte-media rte-gallery">`: a grid of equal-shaped pictures in 2 to 5 columns (the toolbar's Columns menu), with one caption for the whole gallery. Click a picture for its own alt text, link, edit and replace, or to remove just that picture (or the gallery).

## Stock photos and suggested alt text

Neither calls any service by itself: you write the function (which can call your own backend, where the API key lives) and the dialog does the rest.

```ts
setMediaManagerConfig({
  // A Stock tab in the Insert Image dialog, named for the service
  stockProvider: {
    name: "Unsplash",
    search: async ({ search, page, limit }, { signal }) => {
      const res = await fetch(`/api/stock?q=${encodeURIComponent(search)}&page=${page}&per=${limit}`, { signal });
      const { results, total } = await res.json();
      return {
        total,
        items: results.map((p) => ({ id: p.id, thumbnailUrl: p.urls.small, url: p.urls.regular, width: p.width, height: p.height, description: p.alt_description, author: p.user.name, sourceUrl: p.links.html })),
      };
    },
    // caption: false | (photo) => string | null   (default: "Photo by <author> on <name>")
  },
  // A Suggest button next to the alt text field, in the picker and in the Edit alt text dialog
  generateAltText: async ({ src, name }, { signal }) => (await describeWithMyService(src, signal)).text,
});
```

An empty `search` means "show something" (popular, curated). Stock photos are inserted by address (not copied to your storage), with the description as alt text and the credit as the caption. Suggested alt text is only ever put in the field for the person to read and change, never inserted on its own; what comes back is tidied (one paragraph, no wrapping quotes, at most 500 characters).

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
| `audio` | `false` | Put an Audio button in the toolbar |
| `embedProviders` | none | More services that can be embedded (YouTube and Vimeo are built in) |
| `stockProvider` | none | A Stock tab in the Insert Image dialog; see above |
| `generateAltText` | none | A Suggest button for alt text; see above |
| `wrapInFigure` | `true` | Insert `<figure>` media that can be aligned and captioned; `false` for a bare `<img>` / `<video>` |
| `uploadOnPaste` | `true` | Upload images and videos that are pasted or dropped into the editor |
| `optimizeImages` | off | Scale down and re-encode large JPEG, PNG and WebP files before they are stored: `true` (wider than 2048px is scaled to 2048, quality 0.85) or `{ maxWidth, quality, format: 'keep' \| 'webp' \| 'jpeg' }`. The size limit is checked on the result, so a 12 MB photo can pass when it comes out at 600 KB; a file that cannot be made smaller is left as it is |
| `maxFileSize` | 10 MB | Checked before sending; the dialog states it |
| `allowedTypes` | JPEG, PNG, GIF, WebP, AVIF, MP4, WebM, Ogg video | `image/*` wildcards work |

The library appears when the provider has a `list(query, { signal })` that answers `{ items, total }` for `{ page, limit, search, type }`: the REST backend has one (`GET <library>?page=&limit=&q=&type=`), and a custom `provider` can bring its own. With an `uploadHandler` alone there is no library, only Upload and URL.

`createRestProvider`, `createCallbackProvider` and `createBase64Provider` are exported for building your own provider. There is no default API server: with no `apiUrl`, nothing is sent anywhere. An empty `apiUrl` set here means "no API" even when a global one is configured.

## Notes

- The selection toolbar and resize handles are drawn outside the editor, so they never end up in the saved document. Every field has a label, the Upload and URL tabs say which is selected, and Escape closes the dialog and gives the focus and the caret back.
