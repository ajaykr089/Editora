# UI Core Primitive Implementation Status

This document started as the execution plan for the priority shortlist from
`PRIMITIVE_GAP_MATRIX.md`. It now functions as a status document with the
original proposed APIs, contracts, rollout order, and the remaining production
gaps after implementation.

The goal was not just to add more components. The goal was to give `ui-core` a
stable behavioral substrate that existing and future components can share.

## Status legend

- `Implemented`: the primitive or component contract exists in `ui-core`.
- `Adopted`: key consumers have been migrated onto it.
- `Remaining`: still-open work after implementation, usually hardening or
  broader rollout.

## Original scope

This plan covers the next eight recommended additions:

1. `DismissableLayer`
2. `FocusScope`
3. `Positioner`
4. `RovingFocusGroup`
5. `Collection`
6. `Listbox`
7. `NumberField`
8. `PanelGroup` / `Resizable`

## Design rules

- Preserve the current library shape: custom elements, attribute-driven APIs,
  `CustomEvent` detail payloads, imperative methods where needed.
- Add low-level TypeScript primitives under `src/primitives/`.
- Only expose custom elements when there is real authoring value.
- Prefer composition contracts over monolithic widgets.
- Make all new primitives usable by both framework wrappers and plain HTML.
- Ship tests with each primitive before refactoring existing widgets onto it.

## Dependency order

| Order | Primitive | Depends on | Unblocks |
| --- | --- | --- | --- |
| 1 | `DismissableLayer` | none | dialog, popover, menu, dropdown, tooltip, hover-card, command |
| 2 | `FocusScope` | `DismissableLayer` optional | dialog, drawer, command, modal popover |
| 3 | `Positioner` | none | popover, tooltip, hover-card, dropdown, context-menu, combobox |
| 4 | `RovingFocusGroup` | none | tabs, menubar, toolbar, toggle-group, radio-group |
| 5 | `Collection` | none | listbox, menu, command, tree, multiselect |
| 6 | `Listbox` | `Collection`, `Typeahead`, `RovingFocusGroup` | select, combobox, command |
| 7 | `NumberField` | field semantics only | forms, filters, admin settings |
| 8 | `PanelGroup` / `Resizable` | none | layout, sidebar, data workspaces |

## Shared event conventions

All new components should use these conventions:

- Events are `bubbles: true`, `composed: true`.
- Stateful events expose both current and previous values when relevant.
- Preventable transitions use `before-*` events.
- Authoring surface prefers attributes for declarative state and methods for
  imperative control.

Recommended event names:

- `before-open`, `open`, `before-close`, `close`
- `before-value-change`, `value-change`
- `highlight-change`
- `active-item-change`
- `layout-change`

## 1. DismissableLayer

### Purpose

Shared close orchestration for overlays and floating surfaces.

### Status

Implemented and adopted across the main overlay stack.

### Files

- `src/primitives/dismissable-layer.ts`
- `src/components/ui-dismissable-layer.ts`
- `src/__tests__/dismissable-layer.test.ts`

### Primitive API

```ts
export type DismissableLayerReason =
  | 'outside-pointer'
  | 'outside-focus'
  | 'escape-key'
  | 'programmatic'
  | 'ancestor-closed';

export interface DismissableLayerOptions {
  node: HTMLElement;
  trigger?: HTMLElement | null;
  modal?: boolean;
  closeOnEscape?: boolean;
  closeOnPointerOutside?: boolean;
  closeOnFocusOutside?: boolean;
  disableOutsidePointerEvents?: boolean;
  parentLayer?: HTMLElement | null;
  onBeforeDismiss?: (reason: DismissableLayerReason, event?: Event) => boolean | void;
  onDismiss?: (reason: DismissableLayerReason, event?: Event) => void;
}

export interface DismissableLayerHandle {
  destroy(): void;
  pause(): void;
  resume(): void;
  contains(target: Node | null): boolean;
  dismiss(reason?: DismissableLayerReason): void;
}

export function createDismissableLayer(
  options: DismissableLayerOptions
): DismissableLayerHandle;
```

### Custom element contract

Tag: `ui-dismissable-layer`

Attributes:

- `open`
- `modal`
- `close-on-escape`
- `close-on-pointer-outside`
- `close-on-focus-outside`
- `disable-outside-pointer-events`

Methods:

- `open(): void`
- `close(reason?: DismissableLayerReason): void`
- `toggle(): void`

Events:

- `before-close` detail: `{ reason, originalEvent? }`
- `close` detail: `{ reason, originalEvent? }`
- `interact-outside` detail: `{ originalEvent }`
- `escape-key-down` detail: `{ originalEvent }`

Slots:

- default: overlay content
- `trigger`: optional trigger reference

### First adopters

- `ui-dialog`
- `ui-alert-dialog`
- `ui-popover`
- `ui-dropdown`
- `ui-menu`

## 2. FocusScope

### Purpose

Reusable focus containment, focus restore, initial focus, and nested trap policy.

### Status

Implemented and adopted in dialog-style focus traps.

### Files

- `src/primitives/focus-scope.ts`
- `src/components/ui-focus-scope.ts`
- `src/__tests__/focus-scope.test.ts`

### Primitive API

```ts
export interface FocusScopeOptions {
  node: HTMLElement;
  trapped?: boolean;
  loop?: boolean;
  restoreFocus?: boolean;
  autoFocus?: 'first' | 'selected' | 'container' | 'none';
  initialFocus?: HTMLElement | (() => HTMLElement | null) | null;
  finalFocus?: HTMLElement | (() => HTMLElement | null) | null;
  inertOthers?: boolean;
}

export interface FocusScopeHandle {
  destroy(): void;
  focusFirst(): void;
  focusLast(): void;
  focusInitial(): void;
  pause(): void;
  resume(): void;
}

export function createFocusScope(options: FocusScopeOptions): FocusScopeHandle;
```

### Custom element contract

Tag: `ui-focus-scope`

Attributes:

- `active`
- `trapped`
- `loop`
- `restore-focus`
- `auto-focus`
- `inert-others`

Properties:

- `initialFocus: HTMLElement | null`
- `finalFocus: HTMLElement | null`

Methods:

- `activate(): void`
- `deactivate(): void`
- `focusFirst(): void`
- `focusInitial(): void`

Events:

- `focus-scope-mount`
- `focus-scope-unmount`
- `escape` detail: `{ originalEvent }`

Slots:

- default

### First adopters

- `ui-dialog`
- `ui-alert-dialog`
- `ui-drawer`
- `ui-command-palette`

## 3. Positioner

### Purpose

Single positioning engine for anchored floating content.

### Status

Implemented and adopted across the main floating-surface consumers.

### Files

- `src/primitives/positioner.ts`
- `src/components/ui-positioner.ts`
- `src/components/ui-anchor.ts`
- `src/__tests__/positioner.test.ts`

### Primitive API

```ts
export type UIPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'right'
  | 'right-start'
  | 'right-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end';

export interface PositionerOptions {
  anchor: HTMLElement | DOMRect;
  floating: HTMLElement;
  placement?: UIPlacement;
  strategy?: 'absolute' | 'fixed';
  offset?: number;
  crossOffset?: number;
  flip?: boolean;
  shift?: boolean;
  matchWidth?: boolean;
  fitViewport?: boolean;
  arrow?: HTMLElement | null;
  boundary?: HTMLElement | null;
  sticky?: 'partial' | 'always' | 'never';
  onUpdate?: (data: PositionerState) => void;
}

export interface PositionerState {
  x: number;
  y: number;
  placement: UIPlacement;
  availableWidth: number;
  availableHeight: number;
}

export interface PositionerHandle {
  update(): PositionerState;
  destroy(): void;
}

export function createPositioner(options: PositionerOptions): PositionerHandle;
```

### Custom element contract

Tag: `ui-positioner`

Attributes:

- `open`
- `placement`
- `strategy`
- `offset`
- `cross-offset`
- `flip`
- `shift`
- `match-width`
- `fit-viewport`
- `anchor`

Methods:

- `updatePosition(): void`
- `open(): void`
- `close(): void`

Events:

- `position-change` detail: `PositionerState`

Slots:

- default: floating content
- `anchor`: optional anchor content when authoring inline
- `arrow`

### First adopters

- `ui-popover`
- `ui-tooltip`
- `ui-hover-card`
- `ui-dropdown`
- `ui-context-menu`
- `ui-combobox`

## 4. RovingFocusGroup

### Status

Implemented and adopted across the main composite navigation surfaces.

### Purpose

One keyboard-navigation model for composite widgets.

### Status

Implemented as a shared primitive and a DOM-facing component contract.

- Low-level helpers live in `src/primitives/roving-focus-group.ts`.
- The component contract lives in `src/components/ui-roving-focus-group.ts`.
- The shipped contract is intentionally pragmatic: it standardizes active-item
  resolution, roving `tabindex`, boundary movement, and focus handoff over
  existing DOM structures without forcing a new `ui-roving-focus-item`
  authoring model.

### Files

- `src/primitives/roving-focus-group.ts`
- `src/components/ui-roving-focus-group.ts`
- `src/__tests__/roving-focus-group.component.test.ts`
- `src/__tests__/roving-focus.integration.test.ts`

### Primitive API

```ts
export function getRovingFocusBoundaryIndex<T>(
  items: readonly T[],
  edge: 'first' | 'last',
  getDisabled?: (item: T) => boolean
): number;

export function resolveRovingFocusIndex<T>(
  items: readonly T[],
  options?: {
    activeIndex?: number;
    selectedIndex?: number;
    fallbackIndex?: number;
    getDisabled?: (item: T) => boolean;
  }
): number;

export function moveRovingFocusIndex<T>(
  items: readonly T[],
  currentIndex: number,
  step: 1 | -1,
  options?: {
    wrap?: boolean;
    fallbackIndex?: number;
    getDisabled?: (item: T) => boolean;
  }
): number;

export function syncRovingTabStops(
  items: readonly HTMLElement[],
  active: HTMLElement | null,
  options?: { activeAttribute?: string | null }
): void;

export function focusRovingItem(
  item: HTMLElement | null,
  options?: FocusOptions
): void;
```

### Current custom element contract

Tag: `ui-roving-focus-group`

Attributes:

- `item-selector`
- `direct-item-selector`
- `active-attribute`
- `loop`

Methods:

- `queryItems(): HTMLElement[]`
- `queryEnabledItems(): HTMLElement[]`
- `getActiveItem(): HTMLElement | null`
- `setActiveItem(item: HTMLElement | null): HTMLElement | null`
- `focusBoundary(edge: 'first' | 'last'): HTMLElement | null`
- `move(step: 1 | -1): HTMLElement | null`

Events:

- `active-item-change` detail: `{ item, previousItem }`

Slots:

- default

### Migration result

- `ui-tabs`
- `ui-toolbar`
- `ui-menubar` root item bar
- `ui-toggle-group`
- `ui-radio-group`

### Remaining

Roving focus is no longer the main navigation gap. The remaining work for
production-grade composition is:

- `ui-number-field`
- `ui-panel-group`, `ui-panel`, `ui-splitter`
- a reusable `ui-tree` / hierarchical collection model

## 5. Collection

### Status

Implemented as both primitive logic and authoring-facing collection contracts.

### Purpose

Canonical item registry for ordered interactive collections.

### Files

- `src/primitives/collection.ts`
- `src/primitives/collection-item.ts`
- `src/__tests__/collection.test.ts`

### Primitive API

```ts
export interface CollectionItemRecord {
  id: string;
  value?: string;
  label?: string;
  disabled?: boolean;
  textValue?: string;
  group?: string;
  node: HTMLElement;
}

export interface CollectionHandle {
  register(item: CollectionItemRecord): () => void;
  getItems(): CollectionItemRecord[];
  getEnabledItems(): CollectionItemRecord[];
  getItemById(id: string): CollectionItemRecord | undefined;
  getItemByValue(value: string): CollectionItemRecord | undefined;
  indexOf(id: string): number;
}

export function createCollection(root?: HTMLElement): CollectionHandle;
```

### Element exposure

No mandatory standalone custom element is needed in v1.

Optional helper elements if authoring pain shows up:

- `ui-collection`
- `ui-collection-item`

### First adopters

- `ui-listbox`
- `ui-menu`
- `ui-command`
- future `ui-tree`

## 6. Listbox

### Status

Implemented as both primitive logic and `ui-listbox` component contracts, then
adopted by current list-like overlays and selectors.

### Purpose

Shared selection primitive for select, combobox, and command-style lists.

### Status

Implemented as a pragmatic first contract layer.

- Low-level helpers remain in `src/primitives/collection.ts` and
  `src/primitives/listbox.ts`.
- Real DOM-facing contracts now exist in `src/components/ui-collection.ts` and
  `src/components/ui-listbox.ts`.
- The current component contract is intentionally lighter than the original
  aspirational `ui-listbox-item` / `ui-listbox-group` model. It provides shared
  querying, semantics, active-item state, boundary movement, and typeahead over
  existing DOM structures without forcing a full authoring-model rewrite.

### Files

- `src/components/ui-collection.ts`
- `src/components/ui-listbox.ts`
- `src/primitives/collection.ts`
- `src/primitives/listbox.ts`
- `src/__tests__/collection.component.test.ts`
- `src/__tests__/listbox.component.test.ts`

### State model

```ts
export type ListboxSelectionMode = 'single' | 'multiple';

export interface ListboxValueChangeDetail {
  value: string | string[] | null;
  previousValue: string | string[] | null;
  source: 'keyboard' | 'pointer' | 'programmatic' | 'typeahead';
}

export interface ListboxHighlightChangeDetail {
  activeId: string | null;
  previousActiveId: string | null;
}
```

### Current root custom element contract

Tag: `ui-listbox`

Attributes:

- `item-selector`
- `direct-item-selector`
- `item-role`
- `active-attribute`

Properties:

- `container: ParentNode | null`

Methods:

- `refresh(): HTMLElement[]`
- `queryItems(): HTMLElement[]`
- `queryEnabledItems(): HTMLElement[]`
- `findByValue(value: string): HTMLElement | null`
- `findTypeaheadMatch(query: string): HTMLElement | null`
- `clearActive(): void`
- `getActiveItem(): HTMLElement | null`
- `setActiveItem(item: HTMLElement | null): HTMLElement | null`
- `focusBoundary(edge: 'first' | 'last'): HTMLElement | null`
- `move(step: 1 | -1): HTMLElement | null`
- `typeahead(query: string): HTMLElement | null`

Events:

- `collection-change`

Slots:

- default

### Migration result

These surfaces now use the shared contract instead of duplicating item lookup,
active-item movement, or typeahead internally:

- `ui-command-palette`
- `ui-dropdown`
- `ui-menu`
- `ui-context-menu`
- `ui-menubar` panel content
- `ui-select`
- `ui-combobox`

### First adopters

- refactor `ui-select` popup content
- refactor `ui-combobox` result list
- split low-level list from `ui-command-palette`
- refactor `ui-dropdown`, `ui-menu`, `ui-context-menu`, and `ui-menubar` panels

### Remaining

Collection/listbox is no longer the main substrate gap. The remaining work from
this point is broader adoption and navigation hardening:

- `ui-menubar` root item navigation
- `ui-tabs`
- `ui-toolbar`
- `ui-toggle-group`
- `ui-radio-group`

## 7. NumberField

### Purpose

Proper numeric input primitive with spinbutton semantics.

### Status

Implemented as a production-oriented form primitive.

- The runtime owns parsing, formatting, stepping, and blur commit directly
  instead of delegating behavior to native `input[type="number"]`.
- The current contract supports locale-aware formatting, keyboard and wheel
  stepping, min/max and step validation, clamp-on-blur, form registration, and
  custom increment/decrement triggers.

### Files

- `src/components/ui-number-field.ts`
- `src/__tests__/number-field.behavior.test.ts`

### Custom element contract

Tag: `ui-number-field`

Attributes:

- `value`
- `min`
- `max`
- `step`
- `precision`
- `locale`
- `format`
- `name`
- `placeholder`
- `disabled`
- `readonly`
- `required`
- `invalid`
- `allow-wheel`
- `show-steppers`
- `clamp-on-blur`

Properties:

- `valueAsNumber: number | null`
- `rawValue: string`

Methods:

- `stepUp(count?: number): void`
- `stepDown(count?: number): void`
- `select(): void`
- `focus(): void`

Events:

- `before-value-change` detail: `{ value, previousValue, source }`
- `value-change` detail: `{ value, previousValue, source }`
- `invalid` detail: `{ reason: 'min' | 'max' | 'step' | 'parse' }`

Slots:

- `prefix`
- `suffix`
- `increment-trigger`
- `decrement-trigger`

### Authoring notes

- Must use `role="spinbutton"` when appropriate.
- Must expose `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- Parsing and formatting should be separate internal steps.
- Do not rely on native `input[type=number]` behavior as the source of truth.

### First adopters

- settings panels
- table filters
- numeric editors in admin forms

### Remaining

The remaining form/layout gap is no longer numeric input. The remaining work
from this point is broader layout adoption and hardening:

- `ui-panel-group`
- `ui-panel`
- `ui-splitter`

## 8. PanelGroup / Resizable

### Purpose

Accessible resizable layout primitive for shells and workspaces.

### Status

Implemented as a shared resize substrate.

- Low-level layout math lives in `src/primitives/panel-layout.ts`.
- DOM-facing contracts now exist in `src/components/ui-panel-group.ts`,
  `src/components/ui-panel.ts`, and `src/components/ui-splitter.ts`.
- The current contract supports generated splitters, pointer and keyboard
  resizing, persisted layouts, and panel-level collapse/expand.
- `ui-layout` is now migrated onto the shared substrate for dashboard-mode
  shells.
- `ui-sidebar` now shares the same resize and persisted-width semantics instead
  of owning a separate shell-width model.

### Files

- `src/components/ui-panel-group.ts`
- `src/components/ui-panel.ts`
- `src/components/ui-splitter.ts`
- `src/primitives/panel-layout.ts`
- `src/__tests__/panel-group.behavior.test.ts`

### Root contract

Tag: `ui-panel-group`

Attributes:

- `orientation`
- `storage-key`
- `auto-save`

Methods:

- `getLayout(): number[]`
- `setLayout(sizes: number[]): void`
- `resetLayout(): void`

Events:

- `layout-change` detail: `{ sizes: number[] }`

Slots:

- default

### Child panel contract

Tag: `ui-panel`

Attributes:

- `id`
- `size`
- `min-size`
- `max-size`
- `collapsed-size`
- `collapsible`

Methods:

- `collapse(): void`
- `expand(): void`

### Splitter contract

Tag: `ui-splitter`

Attributes:

- `disabled`
- `aria-label`

Methods:

- `focus(): void`

Events:

- `resize-start`
- `resize`
- `resize-end`

### Interaction rules

- Pointer drag support.
- Keyboard resize with arrow keys.
- Home/End to jump toward min/max where applicable.
- Persisted layout when `storage-key` is provided.

### First adopters

- `ui-layout`
- `ui-sidebar`
- future IDE-like app shells

### Remaining

The remaining work in this area is adoption, not new primitive invention:

- finish hardening `ui-layout` on `ui-panel-group`
- add broader shell-level integration coverage once those adopters move

Shell adoption is now in place. The next major primitive gap is hierarchical
navigation and data structures:

- `ui-tree`
- a reusable hierarchical collection model

## Phase plan

### Phase 1: Infrastructure

- Implement `DismissableLayer`
- Implement `FocusScope`
- Implement `Positioner`
- Add tests for nesting, outside interaction, and focus restore

### Phase 2: Navigation substrate

- Implement `RovingFocusGroup`
- Implement `Collection`
- Refactor `ui-tabs`, `ui-toolbar`, `ui-menubar`, `ui-toggle-group`, and `ui-radio-group`

### Phase 3: Selection substrate

- Implement `ui-listbox`
- Refactor `ui-select`, `ui-combobox`, `ui-command-palette`, `ui-dropdown`,
  `ui-menu`, `ui-context-menu`, and `ui-menubar` panels

### Phase 4: Form and layout primitives

- Implement `ui-number-field`
- Implement `ui-panel-group`, `ui-panel`, `ui-splitter`
- Refactor `ui-layout` and `ui-sidebar` where useful

### Current status

- Phase 1 is implemented and adopted across the overlay stack.
- Phase 2 is implemented and adopted across the core composite-navigation
  surfaces.
- Phase 3 is implemented as a pragmatic component-contract layer and is already
  adopted by current list-like overlays.
- Phase 4 is implemented across form and layout primitives, including
  `ui-number-field`, `ui-panel-group`, `ui-panel`, `ui-splitter`, `ui-layout`,
  and `ui-sidebar`.
- Later roadmap items from this document were also implemented:
  `ui-tree`, `ui-meter`, `ui-tags-input`, `ui-file-upload`, `ui-dropzone`,
  `ui-command`, `ui-description`, `ui-field-error`, `ui-control-group`,
  `ui-fieldset`, `ui-pin-input`, `ui-otp-input`, `ui-date-field`,
  `ui-time-field`, `ui-multi-select`, `ui-split-button`,
  `ui-transfer-list`, and `ui-inline-edit`.

## 9. Tree

### Purpose

Hierarchical navigation and nested collection primitive for explorers, CMS
sidebars, permission editors, and docs navigation.

### Status

Implemented as the first phase-5 hierarchical substrate.

- Low-level visible-tree flattening and parent lookup live in
  `src/primitives/tree.ts`.
- DOM-facing contracts now exist in `src/components/ui-tree.ts` and
  `src/components/ui-tree-item.ts`.
- The current contract supports nested items, roving focus over visible nodes,
  arrow-key expand/collapse behavior, single selection, and typeahead.

### Files

- `src/primitives/tree.ts`
- `src/components/ui-tree.ts`
- `src/components/ui-tree-item.ts`
- `src/__tests__/tree.behavior.test.ts`

### Remaining

The remaining work is adoption and deeper hierarchy primitives:

- adopt `ui-tree` in docs/admin navigation surfaces where nested structure is
  currently ad hoc
- consider a fuller hierarchical collection contract once real adopters demand
  drag/drop, async loading, or checkbox selection

## 10. Meter

### Purpose

Add a semantic measurement primitive distinct from task progress.

### Status

Implemented as a standalone component contract.

- The component lives in `src/components/ui-meter.ts`.
- It intentionally does not reuse `ui-progress` semantics because `meter`
  represents scored values, capacity, health, and thresholds rather than work
  completion.
- The initial contract supports `low`, `high`, and `optimum` thresholds,
  semantic state classification, and both line and circular presentations.

### Files

- `src/components/ui-meter.ts`
- `src/__tests__/meter.behavior.test.ts`

### Adoption targets

- dashboards and analytics cards
- quota and storage indicators
- health, confidence, and quality scoring surfaces

### Remaining

- broader dashboard and analytics adoption
- threshold/state refinements only if real consumers demand them

## 11. TagsInput

### Purpose

Add a tokenized multi-value input primitive for recipients, filters, mentions,
and multi-select-like authoring flows.

### Status

Implemented as a standalone component and React wrapper.

- The core component lives in `src/components/ui-tags-input.ts`.
- The React wrapper lives in `packages/ui-react/src/components/TagsInput.tsx`.
- The shipped contract focuses on stable typing, keyboard tokenization,
  duplicate handling, array-valued form registration, and chip removal without
  rerender churn.

### Files

- `src/components/ui-tags-input.ts`
- `src/__tests__/tags-input.behavior.test.ts`
- `packages/ui-react/src/components/TagsInput.tsx`
- `packages/ui-react/src/__tests__/TagsInput.test.tsx`

### Adoption targets

- filter builders
- reviewer/owner assignment
- saved search tokens
- multiselect composition surfaces

### Remaining

- broader adoption in tokenized form flows
- richer composition with mentions or async suggestions if product needs emerge

## 12. FileUpload / Dropzone

### Purpose

Add first-class file selection and drag/drop primitives for forms, evidence
capture, and admin workflows.

### Status

Implemented as a shared core substrate plus React wrappers.

- The core components live in `src/components/ui-file-upload.ts` and
  `src/components/ui-dropzone.ts`.
- The React wrappers live in
  `packages/ui-react/src/components/FileUpload.tsx`.
- The initial contract covers picker-based selection, drag/drop ingestion,
  file-list rendering, removal, accept filtering, size and count limits, and
  array-valued `ui-form` registration.

### Files

- `src/components/ui-file-upload.ts`
- `src/components/ui-dropzone.ts`
- `src/__tests__/file-upload.behavior.test.ts`
- `packages/ui-react/src/components/FileUpload.tsx`
- `packages/ui-react/src/__tests__/FileUpload.test.tsx`

### Adoption targets

- evidence and attachment workflows
- admin import surfaces
- media and asset upload entry points
- drag-and-drop document intake

### Remaining

- richer composed upload experiences such as previews, progress orchestration,
  or provider-backed transport adapters

## 13. DateField / TimeField

### Purpose

Add segmented keyboard-first date and time entry primitives that remain useful
without a popup picker.

### Status

Implemented as standalone core components plus React wrappers.

- The core components live in `src/components/ui-date-field.ts` and
  `src/components/ui-time-field.ts`.
- The React wrappers live in
  `packages/ui-react/src/components/DateField.tsx`.
- The shipped contract focuses on segmented entry, locale-aware date segment
  order, 12h and 24h time entry, keyboard increment/decrement, min/max
  clamping, and `ui-form` registration.

### Files

- `src/components/ui-date-field.ts`
- `src/components/ui-time-field.ts`
- `src/__tests__/date-time-field.behavior.test.ts`
- `packages/ui-react/src/components/DateField.tsx`
- `packages/ui-react/src/__tests__/DateTimeField.test.tsx`

### Adoption targets

- dense admin forms
- table and inline editors
- dialog flows where a popup picker is undesirable
- accessibility-first keyboard entry flows

### Remaining

The original production substrate gap list covered by this plan is materially
complete. The remaining work is adopter integration and higher-order
composition:

- rebuild picker triggers around the segmented field primitives where it makes
  sense
- add richer multi-file upload behaviors like previews and upload progress
- continue composed controls built on the new primitives

## 14. Command

### Purpose

Provide the reusable search-plus-list command surface beneath modal shells such
as `ui-command-palette`.

### Status

Implemented as a low-level component contract and adopted by
`ui-command-palette`.

- The core component lives in `src/components/ui-command.ts`.
- The React wrapper lives in `packages/ui-react/src/components/Command.tsx`.
- `ui-command-palette` now composes `ui-command` for search, filtering, active
  command movement, and selection instead of owning that behavior directly.
- The shared collection contract was extended so `ui-listbox` can operate on an
  explicit item source, which keeps projected command items working correctly in
  nested slot scenarios.

### Files

- `src/components/ui-command.ts`
- `src/components/ui-command-palette.ts`
- `src/__tests__/command.behavior.test.ts`
- `src/__tests__/command-palette.integration.test.ts`
- `packages/ui-react/src/components/Command.tsx`
- `packages/ui-react/src/__tests__/Command.test.tsx`

### Adoption targets

- `ui-command-palette`
- slash-command or quick-action surfaces
- future inline command bars and searchable action trays

### Remaining

The main primitive gap is closed. Remaining work here is composition polish:

- add grouped command sections if real adopters need them
- add shortcut rendering conventions shared with menu and quick-action surfaces
- continue validating projected-content and wrapper behavior in real browser
  stories

## 15. Field Semantics

### Purpose

Split help text, grouped controls, error messaging, and grouped form semantics
 out of `ui-field` into reusable low-level contracts.

### Status

Implemented as standalone form-semantic primitives plus React wrappers.

- Core components now exist in `src/components/ui-description.ts`,
  `src/components/ui-field-error.ts`, `src/components/ui-control-group.ts`,
  and `src/components/ui-fieldset.ts`.
- React wrappers now exist in
  `packages/ui-react/src/components/FieldSemantics.tsx`.
- The current rollout intentionally adds these as first-class primitives
  without forcing `ui-field` to be rewritten immediately.

### Files

- `src/components/ui-description.ts`
- `src/components/ui-field-error.ts`
- `src/components/ui-control-group.ts`
- `src/components/ui-fieldset.ts`
- `src/__tests__/field-semantics.behavior.test.ts`
- `packages/ui-react/src/components/FieldSemantics.tsx`
- `packages/ui-react/src/__tests__/FieldSemantics.test.tsx`

### Adoption targets

- grouped checkbox and switch clusters
- radio-like preference sections
- dense forms that need explicit helper and error composition
- future `ui-form` layout upgrades without further overloading `ui-field`

### Remaining

The primitive gap is closed. Remaining work is adoption polish:

- migrate selected `ui-form` and Storybook examples to prefer these primitives
  when grouped semantics matter
- evaluate whether `ui-field` should internally compose `ui-description` and
  `ui-field-error` in a later hardening pass

## 16. PinInput / OTPInput

### Purpose

Provide a dedicated verification-code primitive for auth, recovery, payment,
and approval flows.

### Status

Implemented as a standalone segmented-entry component plus React wrapper.

- The core runtime lives in `src/components/ui-pin-input.ts`.
- `ui-otp-input` is exposed as an alias tag for teams that prefer OTP naming
  in auth flows.
- The current contract supports single-character slot entry, auto-advance,
  keyboard navigation, backspace clearing, full-code paste, completion events,
  and `ui-form` registration.

### Files

- `src/components/ui-pin-input.ts`
- `src/__tests__/pin-input.behavior.test.ts`
- `packages/ui-react/src/components/PinInput.tsx`
- `packages/ui-react/src/__tests__/PinInput.test.tsx`

### Adoption targets

- sign-in and MFA verification
- payment approval and challenge flows
- admin recovery codes
- secure short-code confirmations inside dialogs and drawers

### Remaining

The primitive gap itself is closed. Remaining work is composition polish:

- add product-specific countdown and resend flows outside the primitive
- evaluate grouped visual separators if a real adopter needs 3-3 or 4-4 slot
  formatting without wrapper markup

## 17. MultiSelect

### Purpose

Prove the next phase by composing a higher-order selection control from the
new tags/listbox substrate.

### Status

Implemented as a composed control and React wrapper.

- The core component lives in `src/components/ui-multi-select.ts`.
- The React wrapper lives in `packages/ui-react/src/components/MultiSelect.tsx`.
- The initial contract combines tokenized selected values, searchable listbox
  options, array-valued form registration, and reusable listbox behavior.

### Files

- `src/components/ui-multi-select.ts`
- `src/__tests__/multi-select.behavior.test.ts`
- `packages/ui-react/src/components/MultiSelect.tsx`
- `packages/ui-react/src/__tests__/MultiSelect.test.tsx`

### Remaining

The remaining high-value composition work is:

- rebuild picker triggers around the segmented field primitives where it makes
  sense
- enrich file upload with previews and upload-progress composition

## 18. SplitButton

### Purpose

Provide the common productivity pattern of a primary action with an attached
secondary action menu.

### Status

Implemented as a composed control plus React wrapper.

- The core component lives in `src/components/ui-split-button.ts`.
- The React wrapper lives in `packages/ui-react/src/components/SplitButton.tsx`.
- The current contract supports a primary action event, a separate toggle for
  the attached menu, projected menu items, and item-selection events.

### Files

- `src/components/ui-split-button.ts`
- `src/__tests__/split-button.behavior.test.ts`
- `packages/ui-react/src/components/SplitButton.tsx`
- `packages/ui-react/src/__tests__/SplitButton.test.tsx`

### Remaining

The main gap is closed. Remaining work is mostly visual and browser hardening:

- evaluate richer menu-item affordances like check states or destructive tones
- expand browser validation for dense toolbar usage

## 19. TransferList

### Purpose

Provide a standard dual-list selection surface for permissions, mappings, and
admin assignment flows.

### Status

Implemented as a composed control plus React wrapper.

- The core component lives in `src/components/ui-transfer-list.ts`.
- The React wrapper lives in `packages/ui-react/src/components/TransferList.tsx`.
- The shipped contract covers available/selected panels, move actions,
  aggregated value state, and `ui-form` registration.

### Files

- `src/components/ui-transfer-list.ts`
- `src/__tests__/transfer-list.behavior.test.ts`
- `packages/ui-react/src/components/TransferList.tsx`
- `packages/ui-react/src/__tests__/TransferList.test.tsx`

### Remaining

The base control exists. Remaining work is enterprise polish:

- add bulk move-all affordances if a real adopter needs them
- consider searchable panels or grouping if larger data sets show up

## 20. InlineEdit

### Purpose

Provide an in-place edit surface for dense records, cards, and admin tables.

### Status

Implemented as a composed control plus React wrapper.

- The core component lives in `src/components/ui-inline-edit.ts`.
- The React wrapper lives in `packages/ui-react/src/components/InlineEdit.tsx`.
- The current contract supports display mode, edit mode, save, cancel,
  keyboard commit, and optional multiline editing.

### Files

- `src/components/ui-inline-edit.ts`
- `src/__tests__/inline-edit.behavior.test.ts`
- `packages/ui-react/src/components/InlineEdit.tsx`
- `packages/ui-react/src/__tests__/InlineEdit.test.tsx`

### Remaining

The primitive gap is closed. Remaining work is composition polish:

- evaluate validation/error display for inline-save flows
- add row-editor or cell-editor examples where real adopters need them

## Refactor targets

| Existing component | New primitive dependency |
| --- | --- |
| `ui-dialog` | `DismissableLayer`, `FocusScope` |
| `ui-alert-dialog` | `DismissableLayer`, `FocusScope` |
| `ui-popover` | `DismissableLayer`, `Positioner` |
| `ui-tooltip` | `Positioner`, optional `DismissableLayer` for interactive mode |
| `ui-hover-card` | `Positioner`, `DismissableLayer` |
| `ui-dropdown` | `DismissableLayer`, `Positioner`, `Collection`, `Typeahead` |
| `ui-menu` | `DismissableLayer`, `Positioner`, `Collection`, `Typeahead`, `RovingFocusGroup` |
| `ui-context-menu` | `DismissableLayer`, `Positioner`, `Collection`, `Typeahead` |
| `ui-tabs` | `RovingFocusGroup` |
| `ui-menubar` | `RovingFocusGroup`, `Collection`, `Typeahead` |
| `ui-select` | `Positioner`, `DismissableLayer`, `Listbox` |
| `ui-combobox` | `Positioner`, `DismissableLayer`, `Listbox`, `Collection` |
| `ui-layout` | `PanelGroup` |

### Refactor status

- The table above should now be read as architecture lineage, not as a pending
  task list.
- Main overlay, selector, menu, and shell consumers listed above have already
  been migrated in some form.

## Testing requirements

Each new primitive should ship with:

- behavior tests
- accessibility assertions
- nested interaction tests where applicable
- reduced-motion compatibility where motion exists
- SSR-safe registration behavior for custom elements

High-value tests:

- nested dialog inside dialog
- popover inside dialog
- command palette over drawer
- roving focus with disabled items
- listbox single and multiple selection
- number field parse/format edge cases
- splitter keyboard resizing

## Remaining production gaps

The original primitive shortlist is materially complete. The remaining work is
no longer primitive invention. It is production hardening and adopter polish.

- complete broader Storybook and browser validation across newer components
- expand integration coverage for nested overlays, real pointer paths, and
  complex focus flows
- continue composed controls built on the new substrate rather than adding more
  one-off widgets
- tighten accessibility and native-form semantics where segmented and composed
  controls still rely mostly on internal contracts
