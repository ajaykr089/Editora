# UI Core Primitive Gap Matrix

This document turns the current `@editora/ui-core` audit into a build roadmap.

Status note: several items from this original gap matrix are now implemented.
Use `PRIMITIVE_IMPLEMENTATION_PLAN.md` as the current source of truth for
implementation status.

The package already has broad widget coverage, but it still lacks several low-level
primitives that advanced UI libraries rely on to keep behavior consistent across
menus, popovers, dialogs, comboboxes, forms, and application shells.

## Current shape

- `ui-core` already ships a large exported surface: buttons, overlays, forms,
  menus, tables, date pickers, timelines, charts, gantt, layout components,
  and editor-adjacent widgets.
- The gap is not component count. The gap is reusable behavioral primitives.
- Several higher-level widgets exist before the lower-level layers they should be
  built on top of. That increases duplicated logic and makes consistency harder.

## Scoring

- `Priority`: `P0` means foundation work that unlocks many other components.
- `Existing related`: current components or helpers that would benefit from the primitive.
- `Suggested files`: proposed paths if the primitive is added to `ui-core`.

## Matrix

| Priority | Missing primitive | Existing related | Why it matters | Suggested files |
| --- | --- | --- | --- | --- |
| P0 | `DismissableLayer` | `ui-dialog`, `ui-alert-dialog`, `ui-popover`, `ui-dropdown`, `ui-menu`, `ui-context-menu`, `ui-hover-card`, `ui-tooltip`, `ui-selection-popup`, `ui-command-palette` | Centralizes outside click, Escape handling, nested overlay coordination, modal vs non-modal behavior, and close ordering. Without it, overlay logic stays duplicated. | `src/primitives/dismissable-layer.ts`, `src/components/ui-dismissable-layer.ts` |
| P0 | `FocusScope` | `focusManager`, `ui-dialog`, `ui-alert-dialog`, `ui-drawer`, `ui-command-palette` | A serious UI library needs reusable focus trapping, restore focus, nested scopes, autofocus policy, and optional background inerting. | `src/primitives/focus-scope.ts`, `src/components/ui-focus-scope.ts` |
| P0 | `Positioner` / `Anchor` | `portal`, `ui-popover`, `ui-tooltip`, `ui-hover-card`, `ui-dropdown`, `ui-context-menu`, `ui-selection-popup`, `ui-combobox` | Floating UI behavior should come from one collision-aware positioning primitive with offset, arrow, flip, shift, sticky, follow-anchor, and viewport clipping logic. | `src/primitives/positioner.ts`, `src/components/ui-positioner.ts`, `src/components/ui-anchor.ts` |
| P0 | `RovingFocusGroup` | `ui-tabs`, `ui-toolbar`, `ui-menubar`, `ui-toggle-group`, `ui-radio-group`, `ui-navigation-menu` | Keyboard navigation is currently spread across components. A shared roving tabindex primitive keeps arrow keys, loop behavior, orientation, and disabled-item rules consistent. | `src/primitives/roving-focus-group.ts`, `src/components/ui-roving-focus-group.ts` |
| P0 | `Collection` / item registry | `ui-select`, `ui-combobox`, `ui-menu`, `ui-command-palette`, `ui-data-table`, future tree and multiselect components | Advanced component systems need a canonical item registry for indexing, ordering, filtering, labels, disabled state, active state, and virtualization hooks. | `src/primitives/collection.ts`, `src/primitives/collection-item.ts` |
| P0 | `Listbox` | `ui-select`, `ui-combobox`, `ui-command-palette` | This is one of the biggest missing primitives. It becomes the behavioral base for select, multiselect, autocomplete, and command surfaces. | `src/components/ui-listbox.ts`, `src/components/ui-listbox-item.ts`, `src/components/ui-listbox-group.ts` |
| P0 | `Typeahead` | `ui-menu`, `ui-dropdown`, `ui-context-menu`, `ui-menubar`, `ui-listbox` | Type-to-select should not be reimplemented inside each composite widget. It should be a shared search buffer utility. | `src/primitives/typeahead.ts` |
| P1 | `Fieldset` / `ControlGroup` / `Description` / `FieldError` | `ui-field`, `ui-label`, `ui-form`, `ui-input`, `ui-select`, `ui-textarea`, `ui-combobox` | Implemented. `ui-description`, `ui-field-error`, `ui-control-group`, and `ui-fieldset` now provide standalone form-semantics contracts so help text, grouped controls, and error surfaces do not have to stay bundled inside `ui-field`. | `src/components/ui-fieldset.ts`, `src/components/ui-control-group.ts`, `src/components/ui-description.ts`, `src/components/ui-field-error.ts` |
| P1 | `NumberField` | `ui-input`, `ui-slider`, `ui-form` | Enterprise forms need a true spinbutton primitive with locale-aware parsing, precision, step controls, min/max, wheel policy, and keyboard stepping. | `src/components/ui-number-field.ts` |
| P1 | `TagsInput` | `ui-input`, `ui-combobox`, `ui-badge`, `ui-form` | Required for filters, recipients, mentions, tokenized search, and multiselect patterns. It also unlocks a better multiselect story. | `src/components/ui-tags-input.ts`, `src/components/ui-tag-chip.ts` |
| P1 | `FileUpload` / `Dropzone` | `ui-input`, `ui-form`, `ui-empty-state` | A top-tier UI library needs first-class file input primitives with drag and drop, validation, previews, progress, and keyboard accessibility. | `src/components/ui-file-upload.ts`, `src/components/ui-dropzone.ts` |
| P1 | `PinInput` / `OTPInput` | `ui-input`, `ui-form` | Implemented. `ui-pin-input` now ships as the canonical multi-slot verification-code primitive, with `ui-otp-input` exposed as an alias for auth and recovery flows. | `src/components/ui-pin-input.ts` |
| P1 | `DateField` / `TimeField` | `ui-date-picker`, `ui-time-picker`, `ui-date-time-picker`, `ui-date-range-picker` | The package already has pickers, but segmented field primitives are still missing. Those are important for accessibility, locale-aware entry, and headless composition. | `src/components/ui-date-field.ts`, `src/components/ui-time-field.ts` |
| P1 | `Meter` | `ui-progress` | `progress` and `meter` have different semantics. A mature library should expose both. | `src/components/ui-meter.ts` |
| P1 | `Resizable` / `PanelGroup` / `Splitter` | `ui-layout`, `ui-sidebar`, `ui-container`, `ui-grid`, `ui-data-table` | Application shells, IDE-style layouts, side panels, and admin workspaces need accessible resizable panes. This is a foundational app-shell primitive. | `src/components/ui-panel-group.ts`, `src/components/ui-panel.ts`, `src/components/ui-splitter.ts` |
| P1 | `Tree` | `ui-navigation-menu`, `ui-sidebar`, `ui-command-palette`, `ui-data-table` | Tree navigation is essential for file explorers, taxonomy editors, CMS sidebars, permissions, and nested collections. | `src/components/ui-tree.ts`, `src/components/ui-tree-item.ts` |
| P1 | `Command` core | `ui-command-palette` | Implemented. `ui-command` now owns the lower-level search/list surface under `ui-command-palette`, closing the original gap between the modal shell and the reusable command primitive. | `src/components/ui-command.ts`, `src/components/ui-command-palette.ts` |
| P2 | `MultiSelect` | `ui-select`, `ui-combobox`, `ui-tags-input`, `ui-listbox` | Common requirement, but should be built after `listbox` and `tags-input` exist. | `src/components/ui-multi-select.ts` |
| P2 | `SplitButton` | `ui-button`, `ui-menu`, `ui-dropdown` | Implemented. `ui-split-button` now provides a composed primary-action plus attached-menu surface for productivity-style actions. | `src/components/ui-split-button.ts` |
| P2 | `TransferList` | `ui-listbox`, `ui-button`, `ui-form` | Implemented. `ui-transfer-list` now provides the expected dual-list selection flow on top of the stronger selection substrate. | `src/components/ui-transfer-list.ts` |
| P2 | `InlineEdit` | `ui-input`, `ui-textarea`, `ui-field`, `ui-button` | Implemented. `ui-inline-edit` now covers in-place edit, save, and cancel flows for dense admin and card surfaces. | `src/components/ui-inline-edit.ts` |

## Priority order

1. Build the shared behavior layer first:
   `DismissableLayer`, `FocusScope`, `Positioner`, `RovingFocusGroup`,
   `Collection`, `Typeahead`.
2. Build the missing composition primitives next:
   `Listbox`, form subprimitives, `NumberField`, `DateField`, `TimeField`.
3. Build app-shell and enterprise primitives after that:
   `Resizable`, `Tree`, `FileUpload`, `TagsInput`, `Command`.
4. Build higher-level convenience widgets last:
   `MultiSelect`, `SplitButton`, `TransferList`, `InlineEdit`.

## Recommended next eight

If only eight items are added in the next milestone, these should be the ones:

1. `DismissableLayer`
2. `FocusScope`
3. `Positioner`
4. `RovingFocusGroup`
5. `Collection`
6. `Listbox`
7. `NumberField`
8. `Resizable` / `PanelGroup`

For exact proposed APIs, element contracts, and rollout order, see
`PRIMITIVE_IMPLEMENTATION_PLAN.md`.

## Architectural note

The fastest way to improve `ui-core` is not to keep adding showcase widgets.
The package already has advanced-looking surfaces such as chart, gantt, wizard,
quick actions, and command palette. The bigger opportunity is to make those
surfaces converge on the same low-level behavior contracts.

That means:

- fewer one-off overlay implementations
- fewer bespoke keyboard navigation loops
- fewer duplicated list item models
- cleaner accessibility semantics
- easier cross-framework wrappers
- lower maintenance cost as the catalog grows
