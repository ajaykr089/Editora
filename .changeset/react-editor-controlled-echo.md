---
'@editora/react': patch
---

A controlled `EditoraEditor` (`value={html} onChange={setHtml}`) no longer loses characters when you type quickly. `onChange` is reported after a short pause (100ms by default); when that report came back as `value` while you had typed more, the editor wrote the older HTML back, dropping the newer characters and moving the caret to the start. The editor now recognises its own report and leaves the content alone; a different `value` from outside still replaces it.
