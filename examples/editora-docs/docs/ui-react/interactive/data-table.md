---
title: DataTable
description: Rich table wrapper for pagination, filtering, selection, virtualization, and enterprise data workflows.
sidebar_label: DataTable
---

# DataTable

`DataTable` wraps `ui-data-table`. Like `Table`, it expects real HTML table markup as `children`. The React wrapper adds the event and attribute bridge for sorting, paging, filtering, virtualization, and selection.

## Basic Usage

```tsx live
function UsersTable() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
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
| `serverSide` | `boolean` | The rows are the current page, sorted and filtered by your server (see below) |
| `totalRows` | `number` | With `serverSide`: rows in the whole result, for the summary and paging |
| `hiddenColumns` | `Array<string \| number>` | Columns to hide, by key or 0-based index |

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
| `onNavigate` | `href`, `rowId`, `row`, `preventDefault()`: a row link is being followed |

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

## Server-driven data

With `serverSide`, the table shows the rows you give it as the current page and never sorts, filters or slices them itself. It still reports `onSortChange`, `onFilterChange` and `onPageChange`, so you fetch the next page and render it; `totalRows` drives the summary ("Showing 21-40 of 312") and the pagination.

```tsx
const [query, setQuery] = React.useState({ page: 1, sort: 'name', direction: 'asc' as 'asc' | 'desc' });
const { rows, total, loading, error } = usePeople(query); // your fetching hook

<DataTable
  serverSide
  sortable
  totalRows={total}
  page={query.page}
  pageSize={20}
  paginationId="people-pagination"
  state={error ? 'error' : loading ? 'loading' : 'idle'}
  onSortChange={({ key, direction }) => setQuery((q) => ({ ...q, page: 1, sort: key, direction }))}
  onPageChange={({ page }) => setQuery((q) => ({ ...q, page }))}
>
  <table>
    <thead>
      <tr><th data-key="name">Name</th><th data-key="email">Email</th></tr>
    </thead>
    <tbody>
      {rows.map((person) => (
        <tr key={person.id} data-id={person.id} data-href={`/people/${person.id}`}>
          <td><a href={`/people/${person.id}`}>{person.name}</a></td>
          <td>{person.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
</DataTable>
```

## Row links

Give a row `data-href` and clicking anywhere on it (except on a button or link inside it) follows the link; the row is reachable with Tab and Enter follows it too. Ctrl/⌘/Shift-click and middle-click open a new tab. The link goes through the same `navigate` contract as Sidebar and Breadcrumb, so a surrounding `NavigationProvider` routes it with your router, or `onNavigate` can take it over. In a `selectable` table a click selects the row, so link rows there follow their link with Enter only. Keep a real link in the row's main cell as well: screen readers announce rows as rows, not links.

## Column visibility

`hiddenColumns={['email', 3]}` hides those columns (by `data-key`, header text or index) in the header, body and footer; pair it with a menu of checkboxes to let people choose.

## Notes

- Use header `th[data-key]` values so sort and order-change events carry stable keys.
- Use `Table` when you only need lightweight sorting/selection without paging or filters.
