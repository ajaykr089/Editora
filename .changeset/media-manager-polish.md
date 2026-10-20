---
"@editora/plugins": patch
"@editora/media-manager": patch
---

Media manager: TypeScript types that match the plugin, and fixes found by testing in Chromium, Firefox and WebKit.

- **Types.** `@editora/plugins` publishes its types from a hand-written `index.d.ts`, which still said `MediaManagerPlugin(): Plugin` and `MediaManagerConfig = Record<string, unknown>`, so TypeScript users could not use `MediaManagerPlugin({ uploadHandler })`, the providers, `mediaSlashItems`, `parseEmbedUrl` or any of the new settings and types. It now declares all of them (the standalone `@editora/media-manager` already gets generated typings from its source). A test fails when something is exported from the source and not declared.
- **Selecting.** Clicking an image in an editor that did not have the focus showed the toolbar and removed it at once: the browser focuses the editor after the click and puts a caret at the start of the text, which was read as leaving the image. A click now also selects the media as the browser does, and selection changes right after selecting are ignored.
- **The toolbar** stays in view over a tall picture that reaches past the top or bottom of the window, where it used to be out of reach, and in a gallery it sits over the picture it is for. Clicking a gallery's second or third picture keeps that picture selected.
- **Saved documents.** An upload placeholder that a saved document was left with (a tab closed or an autosave taken mid-upload) is removed the next time its editor is entered; placeholders now have ids that cannot collide across page loads.
- A suggestion for alt text that is still being waited for is stopped when the dialog is closed.
- `youtube` and `vimeo` are no longer exported (they were never declared or documented; `parseEmbedUrl` is the API).
- The Storybook story for the media manager described `offline` options that never existed; it now shows what does (an upload handler, a library, stock photos and suggested alt text, audio, embeds and the slash menu, optimized uploads). The stale `IMPLEMENTATION.md` is replaced by `ARCHITECTURE.md`.
