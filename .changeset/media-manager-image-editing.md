---
"@editora/plugins": minor
"@editora/media-manager": minor
---

Media manager: edit images, and make large uploads smaller.

- **Edit image** (a new button in the toolbar over a selected image): rotate a quarter either way, flip, crop, scale to a maximum width, and choose how it is saved. The crop is free or to 1:1, 4:3, 3:2, 16:9 or the picture's own shape; drag the box and its handles (mouse, touch or pen) or use the keyboard (arrows move it, Shift and the arrows resize it, and what it covers is announced). The panel shows the size the file will come out at. Turning and flipping mean what you see, the crop turns with the picture, and a transparent picture saved as JPEG gets a white background rather than black.
- The edit is stored as a **new file** through your upload settings, so the original is not touched, and the image records where it came from (`data-original-src`) so that **Restore original** can bring it back. Nothing changes in the document until Apply, and applying is one undo step. A picture from a server that does not send CORS headers cannot be edited (the canvas would be unreadable) and says so; a GIF is saved as a still picture.
- **`optimizeImages`** scales down and re-encodes JPEG, PNG and WebP files before they are stored (`true` for wider than 2048px to 2048 at quality 0.85, or `{ maxWidth, quality, format }`). The size limit is applied to the result, so a 12 MB camera photo can pass a 10 MB limit. A file that cannot be made smaller, or that the browser cannot process, is stored as it is. Off by default.
