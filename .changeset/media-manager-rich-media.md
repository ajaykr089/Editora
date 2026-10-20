---
"@editora/core": patch
"@editora/react": patch
"@editora/plugins": minor
"@editora/media-manager": minor
---

Media manager: audio, embedded videos, galleries, stock photos and suggested alt text.

- **Audio.** `insertAudio` and a picker for audio files; the result is a figure with an `<audio controls>` player that can be aligned and captioned, and is selected without taking the click from its controls. The Audio toolbar button is opt-in (`audio: true`) so that existing toolbars do not change; `audio` is a name for toolbar item lists in both toolbars, and `mediaSlashItems` has `/audio`. The default allowed types include MP3, WAV, Ogg, MP4/M4A, AAC and WebM audio. The repository's API server accepts and types audio (databases made before need `ALTER TABLE media MODIFY type ENUM('image', 'video', 'audio') NOT NULL`).
- **Embedded videos.** The Insert Video dialog has an Embed tab for YouTube and Vimeo links, or the iframe snippet a site offers. Only the video's id is read; the iframe's address is built from it, so a pasted link cannot bring in another host, a script URL or extra parameters (YouTube's privacy-enhanced host, Vimeo's do-not-track setting). The player is a block figure that keeps its shape, loads lazily, can be aligned, captioned and sized, takes no mouse while editing (clicking it selects its figure) and survives the editor's sanitizer through the existing trusted-embed mark. `embedProviders` adds more services.
- **Galleries.** Choosing two or more pictures offers Insert as gallery: one figure with a grid of equal-shaped pictures in 2 to 5 columns (a Columns menu in the toolbar) and one caption; each picture still has its own alt text, link, edit and replace, and can be removed alone. A gallery of stock photos carries their credits as its caption.
- **Stock photos.** `stockProvider` adds a tab to the Insert Image dialog: you write `search` (calling your own backend, where the API key lives) and get a searchable, paged grid. Photos are inserted by address with their description as alt text and, by default, "Photo by <author> on <service>" as the caption. The editor calls no service itself.
- **Suggested alt text.** `generateAltText` adds a Suggest button next to the alt text field in the picker and in the Edit alt text dialog. What comes back is tidied and put in the field for the person to read and change, never inserted on its own; failures are said next to the button.
- An upload's type is now taken from the file that was sent rather than from the server's reply, so a server that files audio under another type cannot make it insert as something else.
