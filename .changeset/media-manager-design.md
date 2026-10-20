---
"@editora/plugins": minor
"@editora/media-manager": minor
---

Media manager: the picker is now the single "Media" window of the design.

- **One window for all media.** Image, Video, Audio and Replace open the same window, with a sidebar of sources (Library, Upload, From URL, Stock photos, Embed) that are always there when they apply, and All / Images / Video / Audio pills over the library. The command decides which pill it opens on.
- **Header.** One wide search box, a sort (Newest, Oldest, Name) and a grid / list switch. `MediaQuery` has a new `sort`, which the REST provider sends and the repository's API honours; a provider that cannot sort may ignore it.
- **Uploads in the library.** Files dropped or pasted while the library is open appear in the grid as tiles with their own progress and a cancel button, and are put at the top when they are done. The window says files can be dropped anywhere.
- **Details panel.** **Edit** opens the image editor on the chosen picture (the result is stored as a new file and chosen in its place); **Alt** suggests a description. Video and audio tiles show their length (read from the file when it is uploaded).
- **Look.** Black primary buttons (light in the dark theme), rounder corners, a list layout, and a Library tab whose "nothing here" text names the filter. The image editor opened from the window is closed by Escape on its own, leaving the window open.
