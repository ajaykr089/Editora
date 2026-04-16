# `@editora/ui-react` Wrapper Hardening Backlog

This document audits the current `ui-react` wrapper surface and identifies which components need API work before they should be treated as production-grade React components.

Scope:
- Source audited: [packages/ui-react/src/components](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components)
- Current wrapper count: `101`
- Goal: define a practical one-by-one hardening order

## Standards

A production-grade `ui-react` wrapper should generally provide:

- React-shaped public props instead of leaking raw custom-element attribute naming where avoidable
- a clear controlled contract when open/value/selection state matters
- stable event callbacks with typed details
- consistent support for `disabled`, `readOnly`, `required`, `loading`, `invalid`, and `headless` when applicable
- modern visual tokens where applicable: `size`, `variant`, `tone`, `density`, `shape`, `elevation`
- predictable composition rules: children, slots, data props, or dedicated subcomponents
- imperative ref methods only where they materially improve app ergonomics
- docs and Storybook examples that match the real wrapper API

## Status Legend

- `Critical`: too thin or inconsistent for a serious public React API
- `High`: usable, but missing modern public API pieces
- `Medium`: mostly workable, but should be normalized with the family
- `Intentional Primitive`: thin by design; should stay small and be documented as infrastructure

## Priority Order

1. Overlay and popup wrappers
2. Selection and form wrappers
3. Date/time and calendar family
4. Layout and navigation family
5. Feedback and utility family
6. Intentional infrastructure wrappers

## Critical Backlog

Wave 1 is complete. These wrappers now have stable typed props, lifecycle callbacks, richer public APIs, Storybook coverage, and targeted wrapper tests.

| Status | Component | File | Completed Outcome |
|---|---|---|---|
| `Completed` | `Pagination` | [Pagination.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Pagination.tsx) | typed `page` / `count`, lifecycle detail callbacks, imperative ref methods, aligned Storybook and tests |
| `Completed` | `Popover` | [Popover.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Popover.tsx) | controlled `open`, placement/offset/close-behavior props, imperative ref methods, open-change callbacks |
| `Completed` | `CommandPalette` | [CommandPalette.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/CommandPalette.tsx) | query/placeholder/empty-state props, open lifecycle callbacks, richer select detail, imperative palette API |
| `Completed` | `ToastAPI` / `Toast` | [ToastAPI.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/ToastAPI.tsx), [Toast.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Toast.tsx) | unified provider/hook/helpers model alongside imperative ref host |
| `Completed` | `PluginPanel` | [PluginPanel.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/PluginPanel.tsx) | formal public panel API with title/description/size/dismissible/open-change support |

## High Priority Backlog

### Overlay, menu, and interaction wrappers

| Priority | Component | File | Main Gaps | Target Outcome |
|---|---|---|---|---|
| `High` | `Tooltip` | [Tooltip.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Tooltip.tsx) | better than `Popover`, but still light; no richer placement/alignment contract, no trigger helpers, no ref API | stronger overlay parity and clearer controlled/uncontrolled guidance |
| `High` | `Dropdown` | [Dropdown.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Dropdown.tsx) | child-only composition, weak trigger/item contract, no item model | documented trigger/content/menu-item contract or higher-level typed item API |
| `High` | `Menu` | [Menu.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Menu.tsx) | same family issues as `Dropdown`; selection contract is okay, composition is still raw | stronger menu composition helpers and submenu guidance |
| `High` | `Menubar` | [Menubar.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Menubar.tsx) | child-only composition, weak trigger/item conventions | formal menubar child contract and better event/value model |
| `High` | `HoverCard` | [HoverCard.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/HoverCard.tsx) | reasonable base props, but no richer content/trigger contract | align with overlay family conventions |
| `High` | `FloatingToolbar` | [FloatingToolbar.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/FloatingToolbar.tsx) | specialized but still public; needs clearer anchor/content/selection semantics | formal toolbar trigger/anchor API |
| `High` | `QuickActions` | [QuickActions.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/QuickActions.tsx) | weak item contract, child-only composition, limited state model | proper item/action schema and open-state contract |
| `High` | `BlockControls` | [BlockControls.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/BlockControls.tsx) | highly specialized but exposed publicly; likely underdefined | either mature editor-specific API or move to specialized package |
| `High` | `SelectionPopup` | [SelectionPopup.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/SelectionPopup.tsx) | similar to `BlockControls`; underdefined public surface | explicit editor selection contract or internal-only designation |
| `High` | `ContextMenu` | [ContextMenu.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/ContextMenu.tsx) | improved recently, but still complex; needs final API freeze and browser validation | stable public item schema and controlled anchor/open story |

### Dialog and modal wrappers

| Priority | Component | File | Main Gaps | Target Outcome |
|---|---|---|---|---|
| `High` | `Dialog` | [Dialog.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Dialog.tsx) | decent wrapper, but API is mixed between template config and slot composition, with raw custom-element semantics leaking through | cleaner React-first modal API with explicit controlled contract |
| `High` | `Drawer` | [Drawer.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Drawer.tsx) | lots of attrs, but still low-level; no stronger imperative or content helpers | align with `Dialog` conventions |
| `High` | `AlertDialog` | [AlertDialog.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/AlertDialog.tsx) | template-driven API is usable, but React ergonomics are still thin | clearer confirm/prompt contract and config typing |
| `High` | `DialogProvider` | [DialogProvider.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/DialogProvider.tsx) | provider/hook surface should be audited against actual modal needs | finalize promise API and story coverage |
| `High` | `AlertDialogProvider` | [AlertDialogProvider.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/AlertDialogProvider.tsx) | same family risk as `DialogProvider` | finalize alert/prompt workflow contract |

### Form and selection wrappers

| Priority | Component | File | Main Gaps | Target Outcome |
|---|---|---|---|---|
| `High` | `Select` | [Select.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Select.tsx) | child-only option model, no controlled/uncontrolled pair, raw attribute names like `autofocus` in sibling wrappers create family inconsistency | standardize controlled value and option composition patterns |
| `High` | `Combobox` | [Combobox.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Combobox.tsx) | stronger than `Select`, but still child-structure heavy and slightly inconsistent with input family naming | lock final search/select/custom-value API |
| `High` | `Radio` | [Radio.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Radio.tsx) | newly added wrapper; needs docs/story hardening and consistency review with `Checkbox`/`Switch` | standardized standalone single-choice boolean-control API |
| `High` | `RadioGroup` | [RadioGroup.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/RadioGroup.tsx) | no dedicated `defaultValue`, no group helper components, limited item rendering contract | standardized single-choice group API |
| `High` | `Checkbox` | [Checkbox.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Checkbox.tsx) | workable, but lighter than modern React checkbox APIs | review label/help/error group story and naming consistency |
| `High` | `Switch` | [Switch.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Switch.tsx) | same family issue as `Checkbox` | normalize boolean-control API |
| `High` | `Toggle` | [Toggle.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Toggle.tsx) | same family issue; event naming differs from modern React conventions | normalize toggle event/value naming |
| `High` | `ToggleGroup` | [ToggleGroup.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/ToggleGroup.tsx) | better than `Toggle`, but still raw-child heavy | stronger item schema and group ergonomics |
| `High` | `Field` / `FieldSemantics` | [Field.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Field.tsx), [FieldSemantics.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/FieldSemantics.tsx) | public form-semantic story is fragmented | settle on one form-field composition model |
| `High` | `Form` | [Form.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Form.tsx) | public API differs from common React form expectations; form transport semantics are custom | formalize `ui-form` React story and document expectations clearly |

### Date/time and calendar family

| Priority | Component | File | Main Gaps | Target Outcome |
|---|---|---|---|---|
| `High` | `Calendar` | [Calendar.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Calendar.tsx) | large public surface, but event/value conventions differ across date family | unify date-family callback and value conventions |
| `High` | `DatePicker` | [DatePicker.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/DatePicker.tsx) | sizable API, but not fully React-normalized; dual formatting/value concepts need cleanup | standard single-date public API |
| `High` | `DateRangePicker` | [DateRangePicker.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/DateRangePicker.tsx) | range value still serialized awkwardly | React-friendly range value contract |
| `High` | `DateTimePicker` | [DateTimePicker.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/DateTimePicker.tsx) | consistent with core but still custom-element-shaped | unify date+time patterns |
| `High` | `DateRangeTimePicker` | [DateRangeTimePicker.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/DateRangeTimePicker.tsx) | complex but young API, likely under-baked | stable enterprise scheduling API |
| `High` | `TimePicker` | [TimePicker.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/TimePicker.tsx) | needs same family normalization | consistent value and callback conventions |
| `High` | `DateField` / `TimeField` | [DateField.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/DateField.tsx) | segmented fields are useful, but family naming and behavior must stay aligned with pickers | production-stable segmented-field contract |

## Medium Priority Backlog

| Priority | Component | File | Main Gaps | Target Outcome |
|---|---|---|---|---|
| `Medium` | `Table` | [Table.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Table.tsx) | child-markup heavy and slightly non-React in feel | keep lightweight, but document stronger table contract |
| `Medium` | `DataTable` | [DataTable.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/DataTable.tsx) | powerful but still heavily custom-element-shaped | lock enterprise table contract and examples |
| `Medium` | `Layout` | [Layout.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Layout.tsx) | shell is usable, but slot-driven contract should be standardized | stable shell composition guidance |
| `Medium` | `Sidebar` | [Sidebar.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Sidebar.tsx) | many props, but item model and layout integration should be re-checked | finalize app-shell navigation API |
| `Medium` | `PanelGroup` | [PanelGroup.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/PanelGroup.tsx) | decent substrate, but React ergonomics can improve | formalize resizable-pane contract |
| `Medium` | `NavigationMenu` | [NavigationMenu.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/NavigationMenu.tsx) | thin but public and app-facing | stronger composition examples and selected-value story |
| `Medium` | `Breadcrumb` | [Breadcrumb.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Breadcrumb.tsx) | child-only composition is acceptable, but item model could be easier | optional data-driven breadcrumb API |
| `Medium` | `AppHeader` | [AppHeader.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/AppHeader.tsx) | likely design-heavy but API-light | decide whether it is a real component or a showcase shell |
| `Medium` | `Tree` | [Tree.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Tree.tsx) | usable, but could benefit from stronger data-driven API | optional item-data tree model |
| `Medium` | `Tabs` | [Tabs.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Tabs.tsx) | current child contract is okay, but still low-level | stronger composition helpers and examples |
| `Medium` | `Accordion` | [Accordion.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Accordion.tsx) | separate export model is fine, but component ergonomics should be reviewed with tabs/tree | keep, but standardize docs and events |
| `Medium` | `EmptyState` | [EmptyState.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/EmptyState.tsx) | simple but workable; may need richer CTA/media contract | optional structured empty-state API |
| `Medium` | `Avatar` | [Avatar.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Avatar.tsx) | fairly rich already, but not fully standardized with image/media family | confirm final avatar/media contract |
| `Medium` | `Chart` / `Timeline` / `Gantt` | [Chart.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Chart.tsx), [Timeline.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Timeline.tsx), [Gantt.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Gantt.tsx) | advanced components should have explicit data and interaction models | owner-specific hardening pass |
| `Medium` | `Wizard` / `Stepper` | [Wizard.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Wizard.tsx), [Stepper.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Stepper.tsx) | decent surface, but step schema and control model should align | stable multi-step family API |

## Intentional Primitive Wrappers

These wrappers are thin by design. They do not need “prop-rich” public APIs unless the product explicitly wants React-specific ergonomics on top of them.

| Status | Components |
|---|---|
| `Intentional Primitive` | `Anchor`, `Collection`, `DismissableLayer`, `FocusScope`, `Listbox`, `Portal`, `Positioner`, `Presence`, `RovingFocusGroup`, `Slot`, `Separator`, `VisuallyHidden`, `DirectionProvider` |

These should receive:
- accurate docs
- examples
- clear “infrastructure primitive” positioning

They do not need the same treatment as app-facing components like `Select`, `Dialog`, or `Pagination`.

## Registry and Docs Drift

The registry file at [packages/ui-react/docs/COMPONENT_REGISTRY.md](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/docs/COMPONENT_REGISTRY.md) currently overstates several wrappers. Examples:

- `Select` is described as searchable and clearable, but the wrapper at [Select.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Select.tsx) does not expose that surface.
- `Input` is described as having formatting, but the wrapper at [Input.tsx](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-react/src/components/Input.tsx) does not expose formatter/parser-style props.
- `Form` mentions `useForm` in the registry entry, but the component wrapper itself is a different concern.

This should be corrected after each family hardening pass so the registry reflects source, not intent.

## Recommended Work Sequence

### Wave 1

- `Pagination`
- `Popover`
- `CommandPalette`
- `Toast` / `ToastAPI`
- `Dialog` / `Drawer` / `AlertDialog`

### Wave 2

- `Dropdown`
- `Menu`
- `Menubar`
- `Tooltip`
- `HoverCard`
- `ContextMenu`

### Wave 3

- `Select`
- `Combobox`
- `Radio`
- `RadioGroup`
- `Checkbox`
- `Switch`
- `Toggle`
- `ToggleGroup`
- `Form` / `Field` / `FieldSemantics`

### Wave 4

- `Calendar`
- `DatePicker`
- `DateRangePicker`
- `TimePicker`
- `DateTimePicker`
- `DateRangeTimePicker`
- `DateField` / `TimeField`

### Wave 5

- `Layout`
- `Sidebar`
- `PanelGroup`
- `NavigationMenu`
- `Breadcrumb`
- `AppHeader`
- `Tabs`
- `Accordion`
- `Tree`

## Definition of Done Per Component

Before a wrapper leaves this backlog, it should have:

- a stable prop surface
- a typed event/callback model
- Storybook coverage for normal, disabled, loading, error, and controlled cases where relevant
- docs aligned with the actual source
- targeted tests for the wrapper contract
