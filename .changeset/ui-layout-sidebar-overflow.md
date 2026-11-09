---
'@editora/ui-core': patch
---

`ui-layout variant="shell"`: a sidebar sized to its whole column no longer gets a horizontal scrollbar. The panel's 1px divider left it one pixel too wide; slotted sidebar and aside content now fits the panel, and those panels never scroll sideways.
