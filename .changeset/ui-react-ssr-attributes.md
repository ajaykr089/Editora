---
"@editora/ui-react": patch
---

Server-rendered HTML now carries the attributes the wrappers set on their elements (`label`, `description`, `size`, `selected`, `disabled`, ...). They were written only in layout effects, which do not run on the server, so the preload styles could not reserve a labelled field's height and elements upgraded from their defaults before hydration. Wrapper hosts, `Tabs.Tab` and `Tabs.Panel` also no longer log hydration mismatches for attributes the elements add to themselves when they upgrade.
