---
"@editora/light-code-editor": patch
---

Fix a keyboard trap: Tab indents in the editor, so a keyboard user who tabbed into it could never tab out again (every Tab press inserted indentation into the document instead), which fails WCAG 2.1.2.

Escape now lets go of Tab, as in other code editors: after Escape, the next Tab (or Shift+Tab) is left to the browser, which moves the focus on, and the text is not touched. Any other key, or the editor losing the focus, takes the Tab key back, so nothing changes for someone who is writing. An Escape that something else handled (the find panel, a menu, a listener that prevented its default) does not count.
