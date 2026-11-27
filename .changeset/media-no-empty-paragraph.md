---
'@editora/media-manager': patch
'@editora/plugins': patch
---

Media inserted at the end of a paragraph, or into an empty one, no longer leaves an empty paragraph below it when a paragraph already follows. The caret goes to the start of that paragraph. At the end of the document, or before something that is not text, an empty paragraph is still added to type in.
