# Media manager: how it is built

For people changing the plugin. What it does for users is in [README.md](./README.md).

## The shape of it

```
src/
  MediaManagerPlugin.native.ts   the plugin: commands, toolbar items, keymap; attaches the controller
  constants.ts                   the config store (setMediaManagerConfig), defaults, endpoint URLs
  types/media.ts                 every public type: config, providers, items, stock, alt text
  providers/                     where files go: base64, callback (uploadHandler), REST; resolveProvider()
  uploadService.ts               validate -> optimize -> provider.upload (progress, abort, fallback)
  uploadQueue.ts                 several uploads at once: concurrency, retry, cancel (picker and paste/drop)
  imaging/                       geometry (pure maths), canvas (render/encode), optimize (upload-time)
  embeds/providers.ts            link -> embed address, from an allowlist of providers
  model/                         what the document holds: figure.ts, embed.ts, gallery.ts
  ui/
    picker/                      the dialog: tabs (library, stock, upload, URL, embed), details, selection
    imageEditor/                 crop/rotate/flip/scale dialog
    mediaController.ts           one controller per page: selection, keyboard, paste/drop, caption keys
    floatingToolbar.ts           the bar over selected media (kind-aware)
    resizeHandles.ts             corner handles (pointer events)
    pendingUploads.ts            placeholders for pasted/dropped files
    *Dialog.ts, styles.ts        small dialogs and the stylesheets
```

## One flow for every file

`config` -> `resolveProvider()` (a `provider`, else an `uploadHandler`, else REST when `apiUrl` is set, else a data URL)
-> `uploadMedia(file)`: type check, `optimizeImages` (so the size limit applies to the result), `provider.upload(file,
{ signal, onProgress })`, then the optional data-URL fallback. The picker's Upload tab, paste, drop, the image editor and
Replace all go through it, so limits, progress, cancel and errors behave the same everywhere.

The library and the stock tab are the same grid (`LibraryView`) over two sources: `provider.list` and an adapter over
`stockProvider.search`.

## What is saved

Plain HTML that needs none of the editor's CSS. Alignment is margins; `display: table` makes a figure as wide as its picture
so the caption wraps at that width.

```html
<figure class="rte-media" data-align="center" style="display: table; ..."><img ...><figcaption>...</figcaption></figure>
<figure class="rte-media rte-embed" data-provider="youtube" ...><iframe data-editora-embed="true" ...></iframe></figure>
<figure class="rte-media rte-gallery" data-columns="3" style="display: grid; ..."><img ...><img ...></figure>
```

While editing, a figure is `contenteditable="false"` with only the caption editable (`adoptFigure`, applied lazily when an
editor is entered, because content loaded from storage has none of it). Core's `stripEditorUiArtifacts` removes that, empty
captions and unfinished uploads (`data-rte-media-pending`) from every emitted HTML, so none of the editing state is saved.
A placeholder that a saved document still holds is swept away the next time its editor is entered.

A figure may not sit inside a `<p>` (a parser would tear it out), so inserting splits the block at the caret
(`insertBlocks`).

## Things that are easy to break

- **The toolbar, handles and upload layers live on `document.body`** (`position: fixed`), never in the content, which is why
  none of them can end up in saved HTML. Keep it that way.
- **Selection.** `MediaController.select` is called from clicks, from `selectionchange` (node selections) and from arrow keys.
  A click also places a node selection, and `selectionchange` is ignored for 150 ms after selecting: a click on an
  unfocused editor is followed by the browser putting a caret at the start of the text, which must not read as "left the media".
- **Escape** inside the toolbar belongs to the toolbar; the controller's capture-phase handler must not act on it.
- **Embeds.** The iframe `src` is built from an id that `embeds/providers.ts` has validated, never copied from input; an
  iframe survives core's sanitizer only with `data-editora-embed="true"` and an http(s) `src`, plus a one-shot
  `detail.allowedTags` hint on the insertion's input event. The CSS rule `pointer-events: none` on iframes inside an editor
  is what lets a click select the figure.
- **Canvas needs CORS.** Editing a picture from a server that does not send CORS headers cannot work (a tainted canvas
  cannot be read); the editor says so rather than failing silently.
- **The upload type comes from the file**, not the server's reply.

## Testing

`npm run test:dom` in `packages/plugins` runs the jsdom suites (`src/__tests__`). jsdom has no layout, canvas or real
pointer/keyboard behaviour, so those are covered two ways: the maths is pure and tested exactly (`imaging/geometry`), and the
canvas is replaced by a recording fake (`__tests__/canvasStub.ts`). What jsdom cannot show (caret behaviour around a
non-editable figure, `display: table-caption` inside `contenteditable`, real drags, WebP encoding, accessibility) was
checked in Chromium, Firefox and WebKit with Playwright against a small page that mounts the plugin, and with axe-core over
every view; repeat that after changing selection, caret or layout code. (Firefox drops files from synthetic *paste* events,
so paste upload cannot be driven there; drop can.)
