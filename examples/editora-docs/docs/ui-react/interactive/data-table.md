---
title: DataTable
description: Rich table wrapper for pagination, filtering, selection, virtualization, and enterprise data workflows.
sidebar_label: DataTable
---

# DataTable

`DataTable` wraps `ui-data-table`. Like `Table`, it expects real HTML table markup as `children`. The React wrapper adds the event and attribute bridge for sorting, paging, filtering, virtualization, and selection.

## Basic Usage

```tsx
import { Badge, DataTable } from '@editora/ui-react';

function UsersTable() {
  return (
    <DataTable sortable striped hover page={1} pageSize={6}>
      <table>
        <thead>
          <tr>
            <th data-key="name">Name</th>
            <th data-key="email">Email</th>
            <th data-key="status">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ava Johnson</td>
            <td>ava@acme.com</td>
            <td><Badge tone="success" variant="soft">Active</Badge></td>
          </tr>
        </tbody>
      </table>
    </DataTable>
  );
}
```

## Core Props

| Prop | Type | Description |
|------|------|-------------|
| `sortable` | `boolean` | Enable sorting |
| `selectable` | `boolean` | Enable row selection |
| `multiSelect` | `boolean` | Allow multi-select |
| `shape` | `'default' \| 'square' \| 'soft'` | Surface shape |
| `variant` | `'default' \| 'flat' \| 'contrast'` | Surface variant |
| `elevation` | `'default' \| 'none' \| 'low' \| 'high'` | Elevation token |
| `striped` | `boolean` | Zebra-strip rows |
| `hover` | `boolean` | Hover feedback |
| `compact` | `boolean` | Compact density |
| `bordered` | `boolean` | Stronger borders |
| `stickyHeader` | `boolean` | Sticky header |
| `stickyFooter` | `boolean` | Sticky footer |
| `loading` | `boolean` | Loading flag |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | Visual state |
| `stateText` | `string` | State label |
| `headless` | `boolean` | Remove default styling |
| `hideSummary` | `boolean` | Hide summary footer |
| `emptyText` | `string` | Empty-state copy |
| `page` | `number` | Current page |
| `pageSize` | `number` | Page size |
| `paginationId` | `string` | Pagination target id |
| `filterQuery` | `string` | Global search query |
| `filterColumn` | `string \| number` | Focus a single filter column |
| `filterRules` | `DataTableFilterRule[]` | Structured filters |
| `columnOrder` | `string` | Column order serialization |
| `pinColumns` | `string \| { left?: Array<string \| number>; right?: Array<string \| number> }` | Pinned columns |
| `draggableColumns` | `boolean` | Drag-reorder headers |
| `resizableColumns` | `boolean` | Resize columns |
| `bulkActionsLabel` | `string` | Bulk action label |
| `bulkClearLabel` | `string` | Bulk clear label |
| `virtualize` | `boolean` | Enable virtualization |
| `rowHeight` | `number` | Virtual row height |
| `overscan` | `number` | Virtual overscan window |

## Events

| Prop | Detail |
|------|--------|
| `onSortChange` | `columnIndex`, `key`, `direction`, `page` |
| `onRowSelect` | `index`, `selected`, `indices`, `rows`, `page` |
| `onPageChange` | `page`, `count`, `pageSize`, `total`, `start`, `end` |
| `onFilterChange` | `query`, `filters`, `total`, `filtered`, `page`, `count` |
| `onColumnResize` | `columnIndex`, `key`, `width` |
| `onVirtualRangeChange` | `start`, `end`, `visible`, `total` |
| `onColumnOrderChange` | `sourceIndex`, `targetIndex`, `order`, `keys` |
| `onBulkClear` | `count`, `page` |

## Paginated + Selectable

```tsx
<DataTable
  sortable
  selectable
  multiSelect
  page={page}
  pageSize={6}
  paginationId="users-pagination"
  onPageChange={(detail) => setPage(detail.page)}
  onRowSelect={(detail) => setSelected(detail.indices)}
>
  <table>{/* thead / tbody / tfoot */}</table>
</DataTable>
```

## Notes

- Use header `th[data-key]` values so sort and order-change events carry stable keys.
- Use `Table` when you only need lightweight sorting/selection without paging or filters.
