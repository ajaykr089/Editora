---
'@editora/core': patch
---

`<editora-editor>` keeps the selection when it sanitizes an edit. When an edit reported without `beforeinput` (a plugin's own change, or Chromium's list commands) changed on sanitizing, the content was replaced and the selection fell to the start of the document. In Chromium this meant that after turning two paragraphs into a bullet list, pressing Numbered list changed only the first item and wrapped it in an inline `font-family` span.
