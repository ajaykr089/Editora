---
'@editora/ui-core': patch
---

`ui-switch` toggles when the switch element itself is clicked: `element.click()`, and assistive technology activating the element with `role="switch"`. Only clicks inside its shadow root were handled, so those did nothing (a mouse click on the switch was not affected).
