---
"@editora/ui-core": patch
---

Fix six recurrences of two bug patterns found during an ecosystem-wide audit: (1) Button's icon prop, and DateTimePicker/DateRangeTimePicker's calendar grid, rendered inert when deep-imported because the parent component never imported the child custom element's own registration module; (2) DatePicker, DateTimePicker, DateRangeTimePicker, and TimePicker's popovers rendered with hardcoded light colors under dark themes, same root cause as DateRangePicker's already-fixed overlay bug - --ui-_-bg/--ui-_-surface tokens defined only in the component's own :host scope, invisible to the document.body-appended overlay div.
