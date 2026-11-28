---
'@editora/media-manager': patch
'@editora/plugins': patch
---

Keys around pictures, videos and embeds no longer damage the text. With media selected, each browser mishandled them its own way: Backspace, Delete and Cut merged the paragraphs on either side (Chromium wrapping the second in a styled `<span>`, Firefox leaving a stray `<br>`), a typed letter glued them together or landed outside any paragraph, and Enter deleted the picture. Backspace at the start of the paragraph after a picture, or Delete at the end of the one before, deleted it and merged the paragraphs too.

Now, with media selected, Backspace, Delete and Cut remove just it (one picture of a gallery, or a link that wraps only it) as one undo step, Enter starts a paragraph below it, and a typed character replaces it with a paragraph. Backspace or Delete next to media selects it first, and the next press removes it.
