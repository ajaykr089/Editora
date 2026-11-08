---
'@editora/ui-core': patch
---

Tooltip, Menu, ContextMenu (and Menubar) panels have their background, border and padding back: lifting them into the top layer reset those with inline style, which beat the component's own CSS (since the top-layer change). The reset is now a zero-specificity rule. Portalled Menu, Tooltip, Popover and SplitButton panels also take the theme variables of the wrapper around their component. ContextMenu's hidden in-element copy no longer leaves an empty box.
