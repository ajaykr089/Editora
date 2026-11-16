---
'@editora/react': patch
---

`EditoraEditor` takes `ariaLabel` and `ariaLabelledBy` for the editing area's accessible name. Its name was always the placeholder ("Write your message…") or "Rich text editor", so a form could not give the editor the label it shows next to it.
