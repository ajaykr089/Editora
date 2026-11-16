---
'@editora/ui-core': patch
---

`ui-app-header`: menus opened from the header (an account menu, notifications) show over the page again. The header's frosted background made it a layer of its own with no z-index, so a tab bar or card further down the page was drawn over an open menu; it now sits at `--ui-app-header-z`. A `sticky` header also cut such menus off at its bottom edge (paint containment); it no longer does.
