---
'@editora/ui-core': minor
'@editora/ui-react': patch
---

`ui-dropdown` takes `align="start" | "end"` (React `align`) to line the menu up with that edge of the trigger. Without it the menu starts at the trigger's start edge, and lines up with the end edge when it would otherwise run off the window (a menu button at the right of a header).
