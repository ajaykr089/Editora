---
"@editora/core": patch
"@editora/embed-iframe": patch
---

Fix three `<editora-editor>` web-component bugs. Embedded iframes were stripped on the next edit because the input sanitiser removed them; embeds are now marked `data-editora-embed` and kept only on the input path after a URL check (`sanitizeHTML` and paste still strip them). A bare `readonly` attribute (`<editora-editor readonly>`) was ignored because only the literal `"true"` was recognised, leaving the editor and its commands live; boolean attributes are now on by presence, and `readonly="false"` or removing the attribute unlocks it. Editors created with `document.createElement` and given children afterwards came up empty because initial content was only captured in the constructor.
