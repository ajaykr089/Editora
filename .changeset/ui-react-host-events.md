---
'@editora/ui-react': patch
'@editora/ui-core': patch
---

Container wrappers (Tabs, Dialog, AlertDialog, Drawer, Dropdown, Menu, ContextMenu, Menubar, NavigationMenu, Popover, Tooltip, HoverCard, Accordion, Collapsible, QuickActions, Sidebar, Layout, Alert) now only react to events their own element dispatches. A `change`, `open`, `close` or `select` bubbling up from a child (a checkbox in a tab panel, a dropdown inside a dialog) no longer calls the parent's `onChange`/`onClose`; a checkbox in a tab panel used to close the panel. Tabs also keep keyboard focus on the active tab when panel content re-renders (the tab strip is only rebuilt when the tabs themselves change, and focus is restored when it is), and only count their own tabs and panels, not those of a nested `ui-tabs`.
