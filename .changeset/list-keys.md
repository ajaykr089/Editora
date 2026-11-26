---
'@editora/plugins': patch
'@editora/plugin-list': patch
---

Lists get the keys of a word processor. Tab nests an item under the one before it and Shift+Tab moves a nested item back out (Tab used to take the focus out of the editor; Shift+Tab on a top-level item still does, so the focus can always leave). Enter in an empty item moves it out one level, or makes it a paragraph at the top level (Firefox made a `<div>`). Backspace at the start of an item does the same (at the start of the first item it did nothing). Each is one undo step.
