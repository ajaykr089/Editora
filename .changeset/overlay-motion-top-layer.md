---
"@editora/ui-core": minor
---

Overlays: enter and exit animation, state attributes for CSS, and the top layer.

- **Motion:** popovers, menus, menubar panels, dropdowns, selects, comboboxes, multi-selects, tooltips, dialogs and alert dialogs now fade and scale in from the side they open on and play a quick exit before they are removed. Before, most of them vanished instantly on close, and `ui-dialog` and `ui-alert-dialog` did not animate at all (their transition could not run out of `display: none`). Reduced motion turns it off. New variables: `--ui-overlay-in-duration`, `--ui-overlay-out-duration`, `--ui-overlay-shift`.
- **State hooks:** open surfaces carry `data-state="open|closed"` and, when positioned, `data-side` and `data-align` (the positioner and `showPortalFor` set them next to `data-placement`).
- **Top layer:** popover, menu, menubar, context menu, split button, tooltip, dialog and alert dialog use `popover="manual"` so they sit above every `z-index` on the page. Browsers without the Popover API keep the old stacking. The panels of select, dropdown, combobox and multi-select stay in their field (they are positioned inside it).
- **Look:** popover, dialog, select, dropdown and combobox panels share one flat surface: the solid panel colour, a hairline border, the theme shadow and radius. The dialog has no divider above its footer and no empty gap when there is no error.
- **Fixes:** the tooltip's exit animation never played (its cleanup removed the node first). The alert dialog's default confirm button had dark text on a grey fill (about 2.7:1); it now uses the primary fill, and tone fills are deep enough for white text.
- New internal helpers (not exported yet): `openOverlay`, `closeOverlay`, `setPanelOpen`, `liftToTopLayer` and `OVERLAY_MOTION_CSS`.
