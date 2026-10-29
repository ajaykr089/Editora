---
'@editora/plugins': patch
'@editora/plugin-table': patch
---

Fix: clicking into a table cell and typing put the text in the wrong place. The first time a table was touched the plugin wrapped it, and moving the table dropped the caret to just after it, so typing landed in the next paragraph (or the heading in Firefox) instead of the cell. The selection is now kept across the wrap, and the table cells no longer set `user-select: none`, which stopped Firefox placing a caret in a cell at all. Verified in Chromium, Firefox and WebKit, together with column resizing.
