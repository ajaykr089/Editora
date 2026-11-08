---
'@editora/ui-core': minor
---

Date and time picker panels (`ui-date-picker`, `ui-date-range-picker`, `ui-date-time-picker`, `ui-time-picker`, `ui-date-range-time-picker`):

- The panel opens inside the picker (in the top layer where the Popover API exists) instead of at the end of `document.body`. Theme variables set on a wrapper now reach it, and it can be styled with `::part(popover)`, `::part(footer)` and the like. Styles that targeted `body > .ui-date-picker-overlay-host` no longer apply.
- The panel is opaque (`--color-panel-solid`, then `--ui-color-surface`; override with `--ui-dp-panel-bg`) and has a shadow (`--shadow-5`; override with `--ui-dp-popover-shadow`).
- The date and range panels are at least as wide as the calendar (`--ui-dp-panel-min-width`, default 18.5rem), so a narrow field no longer leaves the calendar sticking out and the month name cut off.
- The field label is no longer repeated as a panel title next to the field (the phone sheet keeps it); it names the dialog instead.
- One Today button: the calendar's own is hidden while the footer (or the range presets) show one.
- `clearable="false"` also hides the footer's Clear.
- A closed picker no longer builds a hidden inline calendar (about 180 elements per field); inline mode builds it when needed.
- A `default-value` that arrives after the element connected (as React sets attributes) is used as the starting value.
