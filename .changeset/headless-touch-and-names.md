---
"@editora/ui-core": patch
---

Headless controllers on touch screens and for screen readers:

- `createSlider` sets `touch-action: none` on the track and thumbs. Before, a touch drag was taken by the browser for scrolling and cancelled after the first move.
- `createScrollArea` thumbs and the `createToaster` region set `touch-action` for the same reason (the toaster still lets the page scroll on the other axis).
- `createContextMenu`: lifting the finger after a long press no longer closes the menu. The browser's compatibility mouse events moved focus out of it; this is the path iOS takes, since it fires no `contextmenu` event.
- `createSelect`: an unnamed list is named by the trigger's `<label>`, since `aria-labelledby` is not followed through the trigger.

Dark mode, found by a new dark pass over every Storybook story:

- `ui-dock` glass labels, `ui-animated-list` glass, soft and solid items, and `ui-multi-select` soft and solid fields were tinted toward white even in dark mode, under the dark theme's light text. They now tint the theme surface.
- `ui-toggle` contrast variant inside a toggle group: the pressed segment took the theme surface (dark in dark mode) under the variant's dark pressed text; it keeps its light accent fill.
- `ui-number-ticker` neutral tone used a fixed `#526175`; it now uses the muted theme colour.
