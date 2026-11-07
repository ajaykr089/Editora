---
'@editora/ui-core': patch
---

Dropdown, Menu, Menubar and Popover mark the light-DOM content they copy into their panel as `aria-hidden`, so Testing Library and other DOM-reading tools see one set of menu items (the open menu's) instead of two. Browsers already hid the originals; nothing changes visually.
