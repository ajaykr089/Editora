---
title: Table
description: Lightweight table wrapper that enhances native table markup with sorting and row selection.
sidebar_label: Table
---

# Table

`Table` wraps `ui-table` and expects a real HTML `<table>` as `children`.

## Basic Usage

```tsx
import { Table } from '@editora/ui-react';

function TeamTable() {
  return (
    <Table striped hover>
      <table>
        <thead>
          <tr>
            <th data-key="name">Name</th>
            <th data-key="role">Role</th>
            <th data-key="status">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ava Johnson</td>
            <td>Designer</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>Liam Carter</td>
            <td>Engineer</td>
            <td>Review</td>
          </tr>
        </tbody>
      </table>
    </Table>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sortable` | `boolean` | `false` | Enable sortable header cells |
| `selectable` | `boolean` | `false` | Enable row selection |
| `multiSelect` | `boolean` | `false` | Allow multiple selected rows |
| `striped` | `boolean` | `false` | Zebra-strip rows |
| `hover` | `boolean` | `false` | Hover row feedback |
| `compact` | `boolean` | `false` | Reduce row density |
| `bordered` | `boolean` | `false` | Add stronger borders |
| `stickyHeader` | `boolean` | `false` | Keep the header visible while scrolling |
| `loading` | `boolean` | `false` | Show loading state |
| `headless` | `boolean` | `false` | Remove default styling |
| `emptyText` | `string` | - | Empty-state label |
| `onSortChange` | `(detail) => void` | - | Host `sort-change` event |
| `onRowSelect` | `(detail) => void` | - | Host `row-select` event |

## Sortable Headers

Add `data-key` to sortable header cells so the custom element can emit meaningful sort details.

```tsx
<Table sortable onSortChange={(detail) => console.log(detail.key, detail.direction)}>
  <table>
    <thead>
      <tr>
        <th data-key="name">Name</th>
        <th data-key="updated">Last updated</th>
      </tr>
    </thead>
    <tbody>{/* rows */}</tbody>
  </table>
</Table>
```

## Selectable Rows

```tsx
<Table selectable multiSelect onRowSelect={(detail) => console.log(detail.indices)}>
  <table>
    <thead>
      <tr>
        <th data-key="name">Name</th>
        <th data-key="role">Role</th>
      </tr>
    </thead>
    <tbody>{/* rows */}</tbody>
  </table>
</Table>
```

## Notes

- Use semantic HTML table markup inside `Table`.
- For pagination, filtering, virtualization, and richer state, use `DataTable` instead.
