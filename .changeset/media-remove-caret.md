---
'@editora/media-manager': patch
'@editora/plugins': patch
---

After the toolbar's Remove, the caret is in the paragraph after the media and typing goes there. It was left between paragraphs, so the next letters went outside any paragraph in Firefox and were glued onto the text before in WebKit; removing the only media left no paragraph at all.
