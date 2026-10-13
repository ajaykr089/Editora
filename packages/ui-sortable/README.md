<h1 align="center">@editora/ui-sortable</h1>

<p align="center">
  Drag-and-drop lists and boards as one web component, <code>&lt;ui-sortable&gt;</code>: reorder within a list, move
  between lists, nest, clone and select several items, with full keyboard support. A small React wrapper is included.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/ui-sortable"><img src="https://img.shields.io/npm/v/@editora/ui-sortable.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/ui-sortable"><img src="https://img.shields.io/npm/dm/@editora/ui-sortable.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/ui-sortable.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/ui-sortable"><img src="https://img.shields.io/npm/types/@editora/ui-sortable.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/docs/ui-react/interactive/sortable">Docs and examples</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-sortable/docs/images/board.png" alt="A board with four lists: Templates, Backlog with a nested item, In Progress and Done, each holding draggable cards with a drag handle" width="900">
</p>

## Features

- **One component, many layouts.** A single list, several lists side by side (a board), horizontal lists, nested
  hierarchies.
- **Reorder, transfer, nest and clone.** Drop an item between others, into another list, inside another item, or drag
  a copy out of a template list.
- **Multi-selection**: select several items and move them together.
- **Keyboard and screen readers.** Space lifts the focused item, the arrow keys choose the place, Space drops it, and
  the move is announced.
- **Persistence built in**: a `persist-request` event with the new positions, and a `persistKey` that keeps the positions across reloads.
- **Small.** The component is 17 KB gzipped (19 KB with the React wrapper), against about 490 KB for the whole
  [`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core) catalog it comes from.
- Custom item, list-header and empty-state rendering in React.

## Install

```bash
npm install @editora/ui-sortable
```

For the React wrapper, React is a peer dependency: `npm install @editora/ui-sortable react react-dom`.

## Quick start

Import the package once to register the element, then give it `lists` and `items`:

```html
<script type="importmap">
  {
    "imports": {
      "@editora/ui-sortable": "https://cdn.jsdelivr.net/npm/@editora/ui-sortable/dist/index.esm.js",
      "@editora/ui-core/sortable": "https://cdn.jsdelivr.net/npm/@editora/ui-core/dist/sortable.esm.js"
    }
  }
</script>
<ui-sortable></ui-sortable>

<script type="module">
  import '@editora/ui-sortable';

  const sortable = document.querySelector('ui-sortable');

  sortable.lists = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' }
  ];

  sortable.items = [
    { id: 'story-1', label: 'Audit onboarding', listId: 'backlog' },
    { id: 'story-2', label: 'Ship release notes', listId: 'in-progress' },
    { id: 'story-3', label: 'Review handoff', listId: 'done' }
  ];

  sortable.addEventListener('change', (event) => console.log('order', event.detail.items));
</script>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-sortable/docs/images/quick-start.png" alt="Three lists, Backlog, In Progress and Done, each with one card" width="900">
</p>

The element does not move your data: it fires `change` with the new `items`, and you store them. With a bundler, drop the
import map and `import '@editora/ui-sortable'`; without one, the import map above is all it needs.

## React

```tsx
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'done', label: 'Done' }
];

const items: SortableItem[] = [
  { id: 'story-1', label: 'Audit onboarding', listId: 'backlog' },
  { id: 'story-2', label: 'Ship release notes', listId: 'done' }
];

export default function Example() {
  return (
    <Sortable
      lists={lists}
      items={items}
      dropzoneStyle="container"
      onChange={(detail) => {
        console.log(detail.items);
      }}
    />
  );
}
```

`@editora/ui-sortable/react` is the wrapper on its own, without the rest of `@editora/ui-react`.

### A controlled board

Keep the items, and the selection, in state. This board has a template list that clones what you drag out of it, a
horizontal list, a nested item and a `persistKey` that remembers the positions:

```tsx
import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

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

export default function ReleaseBoard() {
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
        console.log(detail.persistence.records);
      }}
    />
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-sortable/docs/images/dragging.png" alt="The board while an item is dragged: a dashed drop preview shows where the card will land, and a Moving item label follows the pointer" width="900">
</p>

### A flat list

For a single list that only reorders, turn nesting off:

```tsx
import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'queue', label: 'Editorial Queue' }
];

const initialItems: SortableItem[] = [
  { id: 'headline', label: 'Headline polish', listId: 'queue' },
  { id: 'legal', label: 'Legal review', listId: 'queue' },
  { id: 'seo', label: 'SEO metadata', listId: 'queue' }
];

export default function FlatSortableQueue() {
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

### Your own markup

`renderItem`, `renderListHeader` and `renderEmptyState` replace the default item, list header and empty message. The
context says whether the item is selected, how many items a list holds, and so on:

```tsx
import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'todo', label: 'To do' },
  { id: 'done', label: 'Done' }
];

const initialItems: SortableItem[] = [
  { id: 'brief', label: 'Write the brief', description: 'One page, with the audience.', listId: 'todo' },
  { id: 'review', label: 'Legal review', listId: 'todo' }
];

export default function CustomRendering() {
  const [items, setItems] = React.useState(initialItems);
  const [selection, setSelection] = React.useState<string[]>(['brief']);

  return (
    <Sortable
      lists={lists}
      items={items}
      selection={selection}
      onItemsChange={setItems}
      onSelectionChange={(detail) => setSelection(detail.selection)}
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
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-sortable/docs/images/custom.png" alt="Two lists with custom markup: a header showing the item count, cards showing Selected or Ready, and a custom message in the empty list" width="900">
</p>

## Items and lists

| Item field | |
| --- | --- |
| `id`, `label`, `listId` | Required: the item's id, its text and the list it is in. |
| `parentId` | The id of the item this one is nested under. |
| `description` | A second line of text. |
| `cloneOnDrag` | Dragging this item leaves it where it is and drops a copy. |
| `disabled`, `dragDisabled`, `hidden` | Disable the item, stop it being dragged, or hide it. |

| List field | |
| --- | --- |
| `id`, `label` | Required. |
| `description`, `emptyLabel` | A line under the title, and the text of the empty state. |
| `orientation` | `'vertical'` (the default) or `'horizontal'`. |
| `cloneOnDrag` | Items dragged out of this list are copied. |
| `disabled` | Turn the list off. |

## Options

| React prop | Attribute | |
| --- | --- | --- |
| `lists`, `items` | `lists`, `items` | The data. In HTML, set them as properties or as JSON attributes. |
| `selection` | `selection` | The selected item ids. |
| `allowNesting` | `allow-nesting` | Allow dropping an item inside another. |
| `dropzoneStyle` | `dropzone-style` | `indicator` (an insertion rail, the default) or `container` (the whole list highlights). |
| `dropIndicatorVisibility` | `drop-indicator-visibility` | `active` or `always`. |
| `dragPreviewSize` | `drag-preview-size` | `match-item` or `compact`. |
| `dragHandleMode` | `drag-handle-mode` | `handle` (drag by the grip) or `item` (drag anywhere on the card). |
| `dragHandleSelector` | `drag-handle-selector` | A selector for your own drag handle. |
| `persistKey` | `persist-key` | Keep where each item is in `localStorage` under this key, and restore it on load. |
| `filterQuery`, `sort`, `allowFilteredDrag` | `filter-query`, `sort`, `allow-filtered-drag` | Filter the items, sort them (`manual` or `label`), and allow dragging while filtered. |
| `showSelectionBadge` | `show-selection-badge` | Show the *Selected* badge on selected items. |
| `disabled` | `disabled` | Turn the whole component off. |

The React wrapper also takes `itemRadius`, `handleRadius`, `listGap` and `itemSpacing` for the look.

## Events

| Event | React prop | `detail` |
| --- | --- | --- |
| `change` | `onChange` | `{ items, lists, selection, previousSelection, movedIds, source, operation, persistence }`. `source` is `pointer`, `keyboard`, `api` or `restore`; `operation` is `reorder`, `transfer`, `nest` or `clone`. |
| | `onItemsChange` | The new `items` array. |
| `selection-change` | `onSelectionChange` | `{ selection, previousSelection }` |
| `persist-request` | `onPersistRequest` | The same detail as `change`: `persistence.records` is `[{ id, listId, parentId, index }]`, ready to save. |

## Methods

On the element (or a ref to it): `select(ids)`, `clearSelection()`, `moveSelection({ targetListId, beforeId?, parentId?, mode?, clone? })`,
`focusItem(id)`, `cancelDrag()` and `getPersistenceSnapshot()`.

## Keyboard

Focus an item, then press **Space** to lift it, the **arrow keys** to choose where it goes, and **Space** again to drop
it. The result is announced to screen readers ("Item reordered in Editorial Queue."), and a hint above the lists
explains the keys.

## Types

`@editora/ui-sortable` re-exports `UISortable`, `UISortableList`, `UISortableItem`, `UISortableChangeDetail` and
`UISortableDropzoneStyle`. `@editora/ui-sortable/react` exports `Sortable`, `SortableList`, `SortableItem`,
`SortableChangeDetail` and `SortableDropzoneStyle`.

## Server rendering

Both entries can be imported on the server: loading them does not touch the DOM, and the custom element is defined only
in the browser. On the server `Sortable` from `@editora/ui-sortable/react` renders an empty `<ui-sortable>` tag; the lists
and items are applied in the browser, once the element is defined and the component has mounted. A `'use client'` file
that renders it is still rendered on the server first (Next.js does this); that render produces the empty tag and does
not fail.

## Part of Editora

This is the sortable of [`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core) as its own install. The same
component is also in [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react) and in the web components
catalog.

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
