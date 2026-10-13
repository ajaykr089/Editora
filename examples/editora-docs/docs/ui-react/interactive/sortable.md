---
title: Sortable
description: Production-ready drag and drop for reordering, cross-list transfer, hierarchy, cloning, keyboard sorting, and persistence.
sidebar_label: Sortable
---

# Sortable

`Sortable` is a production-ready drag-and-drop workspace for queue management, kanban lanes, hierarchy building, and any interface where users need to reorder or move records with confidence.

It is available as:

- `@editora/ui-react` for the React wrapper
- `@editora/ui-core` for the broader web component bundle
- `@editora/ui-sortable` for a standalone `ui-sortable` install
- `@editora/ui-sortable/react` for a standalone React wrapper around `ui-sortable`

It covers:

- Single-list reordering
- Multi-list transfer
- Nesting and hierarchy
- Multi-selection drag as a group
- Drag-handle-only initiation
- Cloning from source lists or source items
- Keyboard drag/drop with `Space`, arrow keys, `Enter`, and `Escape`
- Screen-reader live announcements
- Filter/sort-aware drag locking
- Visual drop feedback and drag ghosting
- Configurable line-style or container-style dropzones
- Persistence payloads for local or server-side ordering
- Custom JSX item rendering through `renderItem`
- Custom list headers and empty states through `renderListHeader` and `renderEmptyState`
- A plain drag always reorders; nesting takes Alt or the far side of a card (`nestTrigger`)
- Hold-to-drag on touch for cards dragged by their body, so the page still scrolls (`touchHoldDelay`)
- Guard rails: `maxItems` per list, `canDrop`, and a cancelable `before-change` event (`onBeforeChange`)
- A free `data` field on every item and list
- Dragging cards between two sortables (`group`), and lists that scroll by themselves (`maxHeight`)
- Every text can be replaced through `labels`, and the hint line hidden with `hideToolbar`
- The same custom rendering without React, through properties of the element

## Import

```tsx
// Barrel
import { Sortable } from '@editora/ui-react';

// Subpath
import { Sortable } from '@editora/ui-react/Sortable';

// Standalone React wrapper
import { Sortable } from '@editora/ui-sortable/react';

// Standalone web component package
import '@editora/ui-sortable';
```

## Standalone Web Component Usage

If you only want the raw custom element without the rest of `ui-core`, install `@editora/ui-sortable`.

```html
<script type="module">
  import '@editora/ui-sortable';

  const sortable = document.querySelector('ui-sortable');
  sortable?.setAttribute('lists', JSON.stringify([
    { id: 'queue', label: 'Queue' }
  ]));
  sortable?.setAttribute('items', JSON.stringify([
    { id: 'a', label: 'Alpha', listId: 'queue' },
    { id: 'b', label: 'Beta', listId: 'queue' }
  ]));
  sortable?.setAttribute('dropzone-style', 'container');
</script>

<ui-sortable></ui-sortable>
```

## Standalone React Wrapper Usage

If you only want the sortable React wrapper without the rest of `@editora/ui-react`, use `@editora/ui-sortable/react`.

```tsx
import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'done', label: 'Done' }
];

const initialItems: SortableItem[] = [
  { id: 'story-1', label: 'Audit onboarding', listId: 'backlog' },
  { id: 'story-2', label: 'Ship release notes', listId: 'done' }
];

export function StandaloneSortableExample() {
  const [items, setItems] = React.useState(initialItems);

  return (
    <Sortable
      lists={lists}
      items={items}
      onItemsChange={setItems}
      dropzoneStyle="container"
    />
  );
}
```

For Next.js App Router or other SSR/RSC setups, import the standalone React wrapper from a client component:

```tsx
'use client';

import { Sortable } from '@editora/ui-sortable/react';
```

## Basic Usage

```tsx live noInline
const lists: SortableList[] = [
  { id: 'templates', label: 'Templates', cloneOnDrag: true },
  { id: 'backlog', label: 'Backlog' },
  { id: 'active', label: 'In Progress' },
  { id: 'done', label: 'Done', orientation: 'horizontal' }
];

const initialItems: SortableItem[] = [
  { id: 'template-brief', label: 'Launch brief template', listId: 'templates', cloneOnDrag: true },
  { id: 'epic', label: 'Release epic', listId: 'backlog' },
  { id: 'brief', label: 'Draft launch brief', listId: 'backlog', parentId: 'epic' },
  { id: 'review', label: 'Design review', listId: 'active' }
];

function ReleaseBoard() {
  const [items, setItems] = React.useState(initialItems);
  const [selection, setSelection] = React.useState<string[]>(['epic']);

  return (
    <ThemeProvider>
      <Sortable
        lists={lists}
        items={items}
        selection={selection}
        persistKey="release-board"
        onItemsChange={setItems}
        onSelectionChange={(detail) => setSelection(detail.selection)}
        onPersistRequest={(detail) => {
          // Save detail.persistence.records to your API
          console.log(detail.persistence.records);
        }}
      />
    </ThemeProvider>
  );
}

render(<ReleaseBoard />);
```

## Example Variations

Use these patterns when you want a more focused surface than a full kanban board:

| Variation | Best for | Notes |
| --- | --- | --- |
| Flat list sorting | Ranked queues, playlists, priority lists | One list, no hierarchy, direct reorder only |
| Flat list multi-select | Batch reprioritization | Move several selected items as one group |
| Clone library | Template shelves, reusable assets | Source items stay in place while copies move |
| Nested backlog | Epics, milestones, outlines | Drop onto items to create sub-items |
| Large nested board | Denser workflows and scale validation | Useful for testing focus, selection, and transfer behavior on deeper trees |
| Horizontal lane | Milestones and release phases | Single horizontal surface for sequenced items |
| Filtered and locked | Read-only or constrained views | Useful when sort/filter should intentionally pause drag |

## Flat List Example

```tsx
import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-react';

const lists: SortableList[] = [
  { id: 'queue', label: 'Editorial Queue' }
];

const initialItems: SortableItem[] = [
  { id: 'headline', label: 'Headline polish', listId: 'queue' },
  { id: 'legal', label: 'Legal review', listId: 'queue' },
  { id: 'seo', label: 'SEO metadata', listId: 'queue' },
];

export function FlatSortableQueue() {
  const [items, setItems] = React.useState(initialItems);

  return (
    <Sortable
      lists={lists}
      items={items}
      allowNesting={false}
      onItemsChange={setItems}
    />
  );
}
```

## Clone Library Example

```tsx
const lists: SortableList[] = [
  { id: 'library', label: 'Template Library', cloneOnDrag: true },
  { id: 'campaign', label: 'Campaign Plan' }
];

const items: SortableItem[] = [
  { id: 'press-kit', label: 'Press kit template', listId: 'library', cloneOnDrag: true },
  { id: 'email-series', label: 'Lifecycle email series', listId: 'library', cloneOnDrag: true },
  { id: 'owner-sync', label: 'Owner sync', listId: 'campaign' }
];
```

## Dropzone Styles

Use the default indicator rails when you want the canvas to stay quiet, or switch to container dropzones when you want the active insertion target to feel like a full card-sized landing zone.

```tsx
<Sortable
  lists={lists}
  items={items}
  dropzoneStyle="container"
/>
```

For the raw custom element, use the matching attribute:

```html
<ui-sortable dropzone-style="container"></ui-sortable>
```

## Custom JSX Items

If you want your own card design, use `renderItem`. The sortable behavior stays the same, but the item body becomes your JSX.

```tsx
<Sortable
  lists={lists}
  items={items}
  selection={selection}
  onItemsChange={setItems}
  renderItem={(item, context) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <strong>{item.label}</strong>
        <span>{context.selected ? 'Selected' : 'Ready'}</span>
      </div>
      {item.description && <div>{item.description}</div>}
      <small>{context.list?.label}</small>
    </div>
  )}
/>
```

## Custom List Headers And Empty States

You can also replace the default lane header and empty-state UI from the React wrapper.

```tsx
<Sortable
  lists={lists}
  items={items}
  renderListHeader={(list, context) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <strong>{list.label}</strong>
      <span>{context.itemCount} items</span>
    </div>
  )}
  renderEmptyState={(list) => (
    <div>
      No items in {list.label} yet. Drag something here to get started.
    </div>
  )}
/>
```

## Nested Hierarchy Example

```tsx
const lists: SortableList[] = [
  { id: 'roadmap', label: 'Roadmap' }
];

const items: SortableItem[] = [
  { id: 'initiative', label: 'Reader retention initiative', listId: 'roadmap' },
  { id: 'survey', label: 'Audience survey', listId: 'roadmap', parentId: 'initiative' },
  { id: 'experiment', label: 'Paywall experiment', listId: 'roadmap' }
];
```

## Large Board Validation

For heavier boards, validate with a realistic nested dataset instead of only a tiny flat list. The Storybook `LargeNestedBoard` example mirrors the browser regression scenario used in the repo for focus, selection, and long-board keyboard transfers.

Good production checks for a larger board:

- confirm focus movement does not remount the whole list
- confirm controlled selection updates stay visually stable
- test pointer drag and keyboard transfer across longer lists
- keep custom card content lightweight when rendering many rows

## Data Model

### `SortableList`

```ts
type SortableList = {
  id: string;
  label: string;
  description?: string;
  emptyLabel?: string;
  orientation?: 'vertical' | 'horizontal';
  disabled?: boolean;
  cloneOnDrag?: boolean;
  accepts?: string[];
  maxItems?: number;
  maxHeight?: number | string;
  data?: unknown;
};
```

### `SortableItem`

```ts
type SortableItem = {
  id: string;
  label: string;
  listId: string;
  parentId?: string | null;
  description?: string;
  order?: number;
  disabled?: boolean;
  dragDisabled?: boolean;
  cloneOnDrag?: boolean;
  hidden?: boolean;
  data?: unknown;
};
```

`data` is anything of yours that can be written as JSON. It travels with the item through moves and copies and comes back, as a copy, in every event and callback. `maxItems` is the most items a list can hold at every nesting level: a move or copy that would go past it is refused and the list header shows `3/5`. `maxHeight` (a number of px or a CSS length such as `"20rem"`) is the tallest the list's cards can be before the list scrolls by itself.

## Key Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `lists` | `SortableList[]` | — | Defines the containers/lanes |
| `items` | `SortableItem[]` | — | Flat item model with optional `parentId` hierarchy |
| `selection` | `string[]` | `[]` | Controlled selected item ids |
| `filterQuery` | `string` | `''` | Filters visible items by label and description |
| `sort` | `'manual' \| 'label'` | `'manual'` | `label` mode locks drag and keeps alphabetical ordering |
| `persistKey` | `string` | — | Stores persistence snapshots in `localStorage` |
| `allowFilteredDrag` | `boolean` | `false` | Re-enables dragging while a filter is active |
| `allowNesting` | `boolean` | `true` | Enables dropping inside another item |
| `group` | `string` | — | Sortables with the same group take each other's cards: hold a card over another one and drop it. Each reports its own `change` (with `external`). Ids must be unique across the group |
| `listMaxHeight` | `number \| string` | — | `maxHeight` for every list that does not set its own. A list taller than this scrolls by itself, and dragging at its edge scrolls it |
| `nestTrigger` | `'gutter' \| 'modifier' \| 'area'` | `'gutter'` | What it takes to nest with the pointer. `gutter`: hold Alt, or drop on the far side of a card. `modifier`: hold Alt. `area`: the middle of any card, as before. Otherwise the top half of a card is "before it" and the bottom half "after it" |
| `touchHoldDelay` | `number` | `350` | Milliseconds a finger must rest on a card (dragged by its body or a custom handle) before it lifts; `0` lifts at once. The built-in handle always lifts at once |
| `labels` | `Partial<SortableLabels>` | English | Replaces any of the texts shown or announced; `{count}`, `{label}`, `{list}` and `{max}` are filled in |
| `hideToolbar` | `boolean` | `false` | Hides the hint and the selection count from sight; screen readers still get the hint |
| `canDrop` | `(info: SortableDropInfo) => boolean` | — | Decides whether the moved items may go to a place. A refused place is not highlighted, the keyboard skips it, and the lifted card turns red over it |
| `dropIndicatorVisibility` | `'active' \| 'always'` | `'active'` | Keeps idle drop rails hidden by default, or shows them all the time for more explicit affordances |
| `dropzoneStyle` | `'indicator' \| 'container'` | `'indicator'` | Uses slim rail targets by default, or expands the active drop target into an item-sized container surface |
| `dragPreviewSize` | `'match-item' \| 'compact'` | `'match-item'` | Controls whether the card that follows the pointer matches the dragged item size or is narrower and shows only the title |
| `dragHandleMode` | `'handle' \| 'item'` | `'handle'` | Uses the built-in handle button, or lets the whole item surface initiate drag |
| `dragHandleSelector` | `string` | — | React wrapper only. Marks matching elements inside `renderItem` content as drag handles |
| `itemRadius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' \| string \| number` | — | Overrides the default item shell radius with preset tokens or any CSS radius value |
| `handleRadius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' \| string \| number` | — | Overrides the drag handle radius with preset tokens or any CSS radius value |
| `listGap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string \| number` | default token | Direct alias for the `--ui-sortable-list-gap` token that controls the gap between sortable items |
| `itemSpacing` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| string \| number` | default token | Overrides the gap between sortable items with preset tokens or any CSS length |
| `showSelectionBadge` | `boolean` | `true` | Shows or hides the default `Selected` badge in built-in item chrome |
| `disabled` | `boolean` | `false` | Disables the whole surface |
| `renderItem` | `(item, context) => ReactNode` | — | Replaces the default item body with custom JSX in the React wrapper |
| `renderListHeader` | `(list, context) => ReactNode` | — | Replaces the default list header UI in the React wrapper |
| `renderEmptyState` | `(list, context) => ReactNode` | — | Replaces the default empty-state content when a list has no visible items |
| `onBeforeChange` | `(detail: SortableBeforeChangeDetail, event: Event) => boolean \| void` | — | Called just before a move is applied, with the result it would have plus `target` and `clone`. Return `false` (or call `event.preventDefault()`) to cancel it |
| `onChange` | `(detail: SortableChangeDetail) => void` | — | Full change event with operation and persistence snapshot |
| `onItemsChange` | `(items: SortableItem[]) => void` | — | Controlled item updates |
| `onSelectionChange` | `(detail: SortableSelectionChangeDetail) => void` | — | Selection changes for multi-select workflows |
| `onPersistRequest` | `(detail: SortableChangeDetail) => void` | — | Hook for saving the new order to a backend |

## Guard Rails

```tsx
import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

type Task = { reviewed: boolean };

const lists: SortableList[] = [
  { id: 'todo', label: 'To do' },
  { id: 'doing', label: 'Doing', maxItems: 2 },
  { id: 'done', label: 'Done' }
];

const initialItems: SortableItem[] = [
  { id: 'brief', label: 'Write the brief', listId: 'todo', data: { reviewed: true } },
  { id: 'budget', label: 'Approve the budget', listId: 'todo', data: { reviewed: false } },
  { id: 'launch', label: 'Plan the launch', listId: 'todo', data: { reviewed: true } },
  { id: 'assets', label: 'Collect the assets', listId: 'doing', data: { reviewed: true } }
];

export default function GuardedBoard() {
  const [items, setItems] = React.useState(initialItems);

  return (
    <Sortable
      lists={lists}
      items={items}
      allowNesting={false}
      // Only reviewed work goes to Done: over it the lifted card turns red, and a drop does nothing.
      canDrop={(drop) =>
        drop.targetListId !== 'done' || drop.items.every((item) => (item.data as Task).reviewed)
      }
      // The last word before anything changes: return false to cancel (here, at most two cards at a time).
      onBeforeChange={(detail) => detail.movedIds.length <= 2}
      onItemsChange={setItems}
    />
  );
}
```

- `maxItems` counts every item in the list, at every nesting level; a copy counts all its items and a branch counts its children
- A list that is already over its limit can still be reordered and emptied, just not filled
- `canDrop` runs on every pointer move, so keep it quick; a function that throws refuses the drop
- `before-change` fires once, before anything is applied: cancelling it leaves the items, the saved positions and the attributes untouched, puts a dragged card back, and fires no `change`
- `moveSelection()` on the element returns `false` when a move did not happen

## Two Boards

```tsx
import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const backlogLists: SortableList[] = [{ id: 'backlog', label: 'Backlog' }];
const sprintLists: SortableList[] = [{ id: 'sprint', label: 'This sprint', maxItems: 3, maxHeight: 280 }];

export default function TwoBoards() {
  const [backlog, setBacklog] = React.useState<SortableItem[]>([
    { id: 'audit', label: 'Audit onboarding', listId: 'backlog' },
    { id: 'notes', label: 'Ship release notes', listId: 'backlog' },
    { id: 'handoff', label: 'Review handoff', listId: 'backlog' }
  ]);
  const [sprint, setSprint] = React.useState<SortableItem[]>([
    { id: 'login', label: 'Fix login', listId: 'sprint' },
    { id: 'docs', label: 'Write docs', listId: 'sprint' }
  ]);

  // Sortables with the same group take each other's cards. Each one reports its own change,
  // so each keeps its own state.
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      <Sortable lists={backlogLists} items={backlog} group="planning" allowNesting={false} onItemsChange={setBacklog} />
      <Sortable lists={sprintLists} items={sprint} group="planning" allowNesting={false} onItemsChange={setSprint} />
    </div>
  );
}
```

- The element the card came from reports `change` with `external.direction === 'out'`, the one it reached with `'in'`; both give the other one as `external.peer`
- `onBeforeChange` on either can cancel the move (nothing then changes anywhere), and the receiving sortable's `canDrop` (`info.from` is the sender), `maxItems`, `accepts` and `allowNesting` apply
- A card goes with all its children; a copy (clone lists) leaves the first board as it was and gets a fresh id in the second
- Ids must be unique across the group: a drop onto a board that already has one of the ids is refused
- Dragging between boards is pointer-only. For the keyboard and for code the element has `moveSelectionTo(otherSortable, { targetListId, beforeId?, parentId?, clone? })`

## Nesting, Touch And Translation

- With nesting on, dragging onto a card reorders. Hold `Alt` (Option), or drop on the far side of the card, to nest; the card highlights before you let go. `nestTrigger="area"` restores the old rule, where the middle of a card nests
- On touch a card dragged by its body is lifted by holding it for `touchHoldDelay` milliseconds; a finger that moves first scrolls the page and a tap still selects
- `labels` takes any of the keys listed in the `SortableLabels` type, for example `labels={{ hintHandle: 'Utilisez la poignée…', selectedMany: 'éléments sélectionnés', announceMovedOne: 'Déplacé vers {list}.' }}`

## Persistence Payload

Every completed move emits a persistence snapshot:

```ts
type SortablePersistenceRecord = {
  id: string;
  listId: string;
  parentId: string | null;
  index: number;
};
```

This is designed for storage in a database as explicit ordering metadata.

```tsx
<Sortable
  lists={lists}
  items={items}
  onPersistRequest={async (detail) => {
    await fetch('/api/reorder', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(detail.persistence.records),
    });
  }}
/>
```

## Keyboard Interactions

| Key | Action |
| --- | --- |
| `ArrowUp` / `ArrowDown` | Move focus in vertical lists |
| `ArrowLeft` / `ArrowRight` | Move focus in horizontal lists |
| `Cmd/Ctrl + A` | Select all visible items |
| `Enter` | Select the focused item |
| `Space` | Lift the focused selection for keyboard drag |
| Arrow keys during keyboard drag | Move the active drop target |
| `Enter` / `Space` during keyboard drag | Drop at the current target |
| `Escape` | Cancel keyboard or pointer drag |

## Multi-Selection

- Click an item to select it
- `Cmd/Ctrl + click` toggles an item in the selection
- `Shift + click` selects a range across the current visible order
- Dragging any selected root item moves the selected group together

## Custom Rendering Notes

- `renderItem` customizes the item body, while the drag handle and drag/drop mechanics stay managed by `Sortable`
- `renderListHeader` customizes the top chrome of each lane without affecting drop logic
- `renderEmptyState` customizes only the empty message area; the dropzone still remains active below it
- `dropIndicatorVisibility="active"` keeps the canvas visually clean until a drag is in progress, while `"always"` restores fully visible rails
- `dropzoneStyle="container"` turns the active drop target into a larger card-like landing surface sized from nearby sortable content
- `dragPreviewSize="match-item"` makes the card that follows the pointer mirror the dragged card dimensions, while `"compact"` shows a narrower card with only the title
- `dragHandleMode="item"` lets the entire card initiate drag while still preserving click-to-select when the pointer does not move
- `dragHandleSelector` is useful with `renderItem` when your custom JSX already has a grip button or icon that should be the drag affordance
- `itemRadius` and `handleRadius` accept preset tokens like `"sm"`, `"lg"`, or `"full"`, and also accept raw CSS values like `"24px"`, `"1rem"`, or `20`
- `listGap` maps directly to the `--ui-sortable-list-gap` CSS variable and takes precedence over `itemSpacing` when both are provided
- `itemSpacing` accepts preset tokens like `"xs"` or `"lg"`, and also accepts raw CSS values like `"6px"`, `"0.75rem"`, or `12`
- In the React wrapper these are props; on the element they are properties (`renderItem`, `renderListHeader`, `renderEmptyState`) that return a new DOM node, a string of HTML (escape anything that came from a user), or nothing to keep the built-in markup. A card is drawn again when its `data` changes and when it is selected or deselected
- Keep item content focus-friendly and avoid placing a second drag affordance inside the custom JSX unless you intend it to be purely visual

## Production Notes

- Use stable `id` values for both lists and items
- Persist `detail.persistence.records` instead of inferring order from array position alone
- Use `dragDisabled` for pinned records that must stay in place
- Use `cloneOnDrag` on source lists for template shelves and reusable task libraries
- Avoid enabling `allowFilteredDrag` unless your filtered view still maps cleanly to the underlying order model
- `Sortable` is production-ready for normal and moderately large datasets, but it is not a virtualized surface yet
- For dense boards, prefer tighter `listGap` / `itemSpacing` values and simpler custom item markup
- If you expect hundreds or thousands of visible rows, benchmark your real dataset before shipping

## Related Surfaces

- [Transfer List](../form-inputs/transfer-list) for simpler dual-list assignment
- [Tree](./tree) for read-first hierarchy navigation
- [Panel Group](./panel-group) for resizable multi-pane workspaces
