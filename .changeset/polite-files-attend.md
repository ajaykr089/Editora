---
"@editora/ui-core": patch
---

Fix DateRangePicker's portaled overlay panel rendering with a light/white background under dark themes. Its --ui-dp-* surface tokens were only defined within the picker's own :host scope, invisible to the overlay div appended to document.body; now re-derived locally on the overlay host, matching the pattern already used by ui-popover.
