---
"@editora/ui-core": patch
---

A missing numeric attribute no longer reads as 0, so these defaults apply again: `ui-toast` shows up to 5 toasts (it showed 1), `ui-breadcrumb` only collapses when `max-items` is set (it collapsed past 3 items), `ui-tooltip` waits 250ms to open and 120ms to close, `ui-hover-card` waits 120ms, `ui-popover`, `ui-tooltip` and `ui-positioner` keep their 8px offset (and the positioner its 4px boundary padding), and `ui-textarea` has 4 rows.
