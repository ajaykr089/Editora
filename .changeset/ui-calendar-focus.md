---
'@editora/ui-core': patch
---

`ui-calendar`: focusing the calendar moves focus to its current day, so arrow keys work at once and the ring is the theme's (`--ui-ring-color`) instead of the browser's default outline (the macOS accent colour). A value set from outside moves the focus day to it. In range mode, clicking the end date no longer gets lost: the calendar re-rendered on the focus caused by `mousedown` and replaced the button before the click.
