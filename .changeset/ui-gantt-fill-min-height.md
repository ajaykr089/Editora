---
'@editora/ui-core': patch
---

`ui-gantt`: with `fill` in a container that has no height of its own (a card, a page section), the timeline collapsed to 0px and only the toolbar showed. The scroll area now keeps a minimum height, `--ui-gantt-fill-min-height` (default 240px).
