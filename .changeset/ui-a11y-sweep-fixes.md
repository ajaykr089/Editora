---
'@editora/ui-core': patch
---

Two fixes from the new Storybook accessibility sweep: the inline DateTimePicker's hour and minute selects were unstyled browser defaults (19px tall, below the 24px WCAG 2.2 target size) because their styles only existed for the popover, and a Sortable list that scrolls (`max-height`) could not be reached from the keyboard when the single roving tab stop was in another list; that list is now a tab stop itself.
