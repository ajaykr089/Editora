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

## Import

```tsx
// Barrel
import { Sortable } from '@editora/ui-react';

// Subpath
import { Sortable } from '@editora/ui-react/Sortable';

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

## Basic Usage

```tsx
import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-react';

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

export function ReleaseBoard() {
  const [items, setItems] = React.useState(initialItems);
  const [selection, setSelection] = React.useState<string[]>(['epic']);

  return (
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
  );
}
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
};
```

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
| `dropIndicatorVisibility` | `'active' \| 'always'` | `'active'` | Keeps idle drop rails hidden by default, or shows them all the time for more explicit affordances |
| `dropzoneStyle` | `'indicator' \| 'container'` | `'indicator'` | Uses slim rail targets by default, or expands the active drop target into an item-sized container surface |
| `dragPreviewSize` | `'match-item' \| 'compact'` | `'match-item'` | Controls whether the floating drop preview matches the dragged item size or uses the older compact preview card |
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
| `onChange` | `(detail: SortableChangeDetail) => void` | — | Full change event with operation and persistence snapshot |
| `onItemsChange` | `(items: SortableItem[]) => void` | — | Controlled item updates |
| `onSelectionChange` | `(detail: SortableSelectionChangeDetail) => void` | — | Selection changes for multi-select workflows |
| `onPersistRequest` | `(detail: SortableChangeDetail) => void` | — | Hook for saving the new order to a backend |

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
- `dragPreviewSize="match-item"` makes the floating drop preview mirror the dragged card dimensions, while `"compact"` restores the smaller older preview style
- `dragHandleMode="item"` lets the entire card initiate drag while still preserving click-to-select when the pointer does not move
- `dragHandleSelector` is useful with `renderItem` when your custom JSX already has a grip button or icon that should be the drag affordance
- `itemRadius` and `handleRadius` accept preset tokens like `"sm"`, `"lg"`, or `"full"`, and also accept raw CSS values like `"24px"`, `"1rem"`, or `20`
- `listGap` maps directly to the `--ui-sortable-list-gap` CSS variable and takes precedence over `itemSpacing` when both are provided
- `itemSpacing` accepts preset tokens like `"xs"` or `"lg"`, and also accepts raw CSS values like `"6px"`, `"0.75rem"`, or `12`
- This custom rendering path is available in the React wrapper
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
