# @editora/ui-sortable

> [!IMPORTANT]
> **Broader docs and examples:** https://editora-ecosystem.netlify.app/docs/ui-react/interactive/sortable

Standalone package for the Editora sortable web component.

`@editora/ui-sortable` is the smallest way to ship `<ui-sortable>` without importing the full `@editora/ui-core` catalog. It supports:
- single-list reordering
- multi-list transfer
- nesting and hierarchy
- multi-selection
- keyboard-accessible drag and drop
- indicator or container-style dropzones
- an optional React wrapper via `@editora/ui-sortable/react`

## Installation

```bash
npm install @editora/ui-sortable
```

If you want the React wrapper entry, also install React peer dependencies:

```bash
npm install react react-dom
```

Or install the standalone React-ready setup in one step:

```bash
npm install @editora/ui-sortable react react-dom
```

## Quick Start

Import the package once to register the custom element:

```ts
import '@editora/ui-sortable';
```

Then bind lists and items:

```ts
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
```

```html
<ui-sortable></ui-sortable>
```

## React Wrapper

The package also exposes a standalone React wrapper:

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

export function Example() {
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

Use `@editora/ui-sortable/react` when you want the sortable wrapper only, without taking the rest of `@editora/ui-react`.

If you are using Next.js, App Router, or another SSR/RSC framework, import `@editora/ui-sortable/react` from a client component because it registers the custom element in the browser runtime.

```tsx
'use client';

import { Sortable } from '@editora/ui-sortable/react';
```

## React Examples

### Controlled Board

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
        console.log(detail.persistence.records);
      }}
    />
  );
}
```

### Flat List Sorting

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

### Clone Library

```tsx
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'library', label: 'Template Library', cloneOnDrag: true },
  { id: 'campaign', label: 'Campaign Plan' }
];

const items: SortableItem[] = [
  { id: 'press-kit', label: 'Press kit template', listId: 'library', cloneOnDrag: true },
  { id: 'email-series', label: 'Lifecycle email series', listId: 'library', cloneOnDrag: true },
  { id: 'owner-sync', label: 'Owner sync', listId: 'campaign' }
];

export function CloneLibraryExample() {
  return <Sortable lists={lists} items={items} />;
}
```

### Container Dropzones

```tsx
<Sortable
  lists={lists}
  items={items}
  dropzoneStyle="container"
/>
```

### Custom Item Rendering

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

### Custom List Headers And Empty States

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

### Nested Hierarchy

```tsx
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'roadmap', label: 'Roadmap' }
];

const items: SortableItem[] = [
  { id: 'initiative', label: 'Reader retention initiative', listId: 'roadmap' },
  { id: 'survey', label: 'Audience survey', listId: 'roadmap', parentId: 'initiative' },
  { id: 'experiment', label: 'Paywall experiment', listId: 'roadmap' }
];

export function NestedHierarchyExample() {
  return <Sortable lists={lists} items={items} />;
}
```

For broader usage patterns, Storybook-style variations, and the full prop reference, use the Editora docs:

- https://editora-ecosystem.netlify.app/docs/ui-react/interactive/sortable

## Dropzone Styles

Use the default insertion rails:

```html
<ui-sortable></ui-sortable>
```

Or switch to container-style dropzones:

```html
<ui-sortable dropzone-style="container"></ui-sortable>
```

## Common Attributes

- `dropzone-style="indicator|container"`
- `drop-indicator-visibility="active|always"`
- `drag-preview-size="match-item|compact"`
- `drag-handle-mode="handle|item"`
- `allow-nesting`
- `persist-key`

## Events

The component emits `CustomEvent`s such as:
- `change`
- `selection-change`

Each event provides structured detail payloads for the latest ordering or selection state.

## Type Exports

The package also re-exports sortable types from `@editora/ui-core/sortable`, including:
- `UISortable`
- `UISortableList`
- `UISortableItem`
- `UISortableChangeDetail`
- `UISortableDropzoneStyle`

The React subpath exports:
- `Sortable`
- `SortableList`
- `SortableItem`
- `SortableChangeDetail`
- `SortableDropzoneStyle`

## Development

```bash
cd packages/ui-sortable
npm run build
npm run test
```
