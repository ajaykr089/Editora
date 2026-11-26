---
'@editora/plugins': patch
'@editora/plugin-list': patch
---

Switching a list between bullets and numbers switches the whole list. The browsers' own command converted item by item, splitting the list where the selection ended, and Chromium wrapped each converted item in a span carrying the editor's font. The list keeps its items, its attributes (a bullet list drops the numbering ones) and the selection.
