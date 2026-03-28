# @editora/ui-sortable

> [!IMPORTANT]
> **Docs:** https://editora-ecosystem.netlify.app/docs/ui-react/interactive/sortable

Standalone package for the Editora sortable web component.

`@editora/ui-sortable` is the smallest way to ship `<ui-sortable>` without importing the full `@editora/ui-core` catalog. It supports:
- single-list reordering
- multi-list transfer
- nesting and hierarchy
- multi-selection
- keyboard-accessible drag and drop
- indicator or container-style dropzones

## Installation

```bash
npm install @editora/ui-sortable
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

## Development

```bash
cd packages/ui-sortable
npm run build
```
