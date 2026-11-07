---
'@editora/ui-core': patch
'@editora/ui-react': patch
---

Dialog and AlertDialog put a single dialog in the accessibility tree: the panel inside the shadow root (named by its title, with `aria-modal`). The host no longer gets `role="dialog"` / `role="alertdialog"` added. The panel role is set with the new `dialog-role` attribute (the React `roleType` prop now writes it); a `role` attribute on the host is still read for backwards compatibility.
