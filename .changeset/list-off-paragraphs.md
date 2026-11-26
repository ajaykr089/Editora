---
'@editora/plugins': patch
'@editora/plugin-list': patch
---

Switching a list off gives back one paragraph per item. The browsers' own command joined the items into one paragraph with line breaks (`<p>a<br>b</p>`) in Chromium, Firefox and Safari, and Chromium wrapped each in a span with the editor's font. Items before and after the selection now stay in their list, an ordered list keeps its numbering after the gap, and the selection stays on the same text.
