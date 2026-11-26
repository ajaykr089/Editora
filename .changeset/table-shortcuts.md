---
'@editora/plugins': patch
'@editora/plugin-table': patch
---

The table shortcuts are now Mod+Shift+Enter (add a row below) and Mod+Alt+Enter (add a column to the right). They were Mod+Shift+R and Mod+Shift+C, which belong to the browsers: hard reload in Chrome and Firefox, Reader in Safari, and the DevTools element picker. They also only worked once the table toolbar had been shown. The toolbar's tooltips name the new keys (Cmd on a Mac, Ctrl elsewhere); the "Add row above" button no longer claims the add-row-below shortcut. Tab in the last cell still adds a row.
