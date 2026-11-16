---
'@editora/react': patch
---

Typing into an empty editor writes paragraphs. With `value=""` (or after clearing everything) the first characters went straight into the editing area and Enter added `<div>`s, so `onChange` gave `Hello<div>Second line</div>` instead of `<p>Hello</p><p>Second line</p>`. The editor now starts a paragraph before the first insertion and makes Enter create `<p>`, as the web component already did. The placeholder still shows while it is empty.
