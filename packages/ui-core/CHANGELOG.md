# Change Log

## 0.1.19

### Patch Changes

- 1265771: Fix six recurrences of two bug patterns found during an ecosystem-wide audit: (1) Button's icon prop, and DateTimePicker/DateRangeTimePicker's calendar grid, rendered inert when deep-imported because the parent component never imported the child custom element's own registration module; (2) DatePicker, DateTimePicker, DateRangeTimePicker, and TimePicker's popovers rendered with hardcoded light colors under dark themes, same root cause as DateRangePicker's already-fixed overlay bug - --ui-_-bg/--ui-_-surface tokens defined only in the component's own :host scope, invisible to the document.body-appended overlay div.
- 94bed27: Fix DateRangePicker's portaled overlay panel rendering with a light/white background under dark themes. Its --ui-dp-* surface tokens were only defined within the picker's own :host scope, invisible to the overlay div appended to document.body; now re-derived locally on the overlay host, matching the pattern already used by ui-popover.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.18](https://github.com/ajaykr089/Editora/compare/@editora/ui-core@0.1.4...@editora/ui-core@0.1.18) (2026-09-05)

**Note:** Version bump only for package @editora/ui-core

## [0.1.4](https://github.com/ajaykr089/Editora/compare/@editora/ui-core@0.1.0...@editora/ui-core@0.1.4) (2026-03-08)

**Note:** Version bump only for package @editora/ui-core

## [0.1.3](https://github.com/ajaykr089/Editora/compare/@editora/ui-core@0.1.0...@editora/ui-core@0.1.3) (2026-03-05)

**Note:** Version bump only for package @editora/ui-core
