---
"@editora/core": patch
---

Make `<editora-editor disabled>` (and `disabled="true"`, or `setConfig({ disabled: true })`) disable the editor. The attribute was accepted and ignored: the surface stayed editable and every toolbar button stayed enabled. A disabled editor is now read-only, its toolbar buttons are disabled, the surface leaves the tab order and reports `aria-disabled="true"`, and toolbar and keyboard commands do nothing. Removing the attribute restores exactly what it disabled (a button a plugin had already disabled stays disabled). `disabled="false"` no longer greys the editor out either: the style now follows the real state instead of the mere presence of the attribute.
