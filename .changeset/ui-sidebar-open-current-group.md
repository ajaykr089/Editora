---
'@editora/ui-core': patch
---

`ui-sidebar`: a group that holds the current item (`value`) opens by itself, once for each new value, so the reader sees where they are; a closed group holding it is shown in the active colour (`data-has-active`). Group toggles now have `aria-expanded`, so screen readers hear whether a group is open.
