---
title: DataViewToolbar
description: Higher-level list-page toolbar that composes FiltersBar with counts, summary text, and actions.
sidebar_label: DataViewToolbar
---

# DataViewToolbar

`DataViewToolbar` is a compositional wrapper for list and table screens that need search, status filters, clear actions, row counts, and secondary actions in one surface. It is built on top of `FiltersBar`.

## Basic usage

```tsx
import { Button, DataViewToolbar } from '@editora/ui-react';

function PatientsToolbar() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');

  return (
    <DataViewToolbar
      title="Patients"
      description="Search and segment active patient records"
      itemLabel="patient"
      selectedCount={2}
      totalCount={48}
      search={search}
      status={status}
      statusOptions={[
        { value: 'all', label: 'All status' },
        { value: 'active', label: 'Active' },
        { value: 'discharged', label: 'Discharged' },
      ]}
      actions={<Button size="sm">Export</Button>}
      onSearchChange={setSearch}
      onStatusChange={setStatus}
      onClear={() => {
        setSearch('');
        setStatus('all');
      }}
    />
  );
}
```

## Notes

- Use `summary` when you need a custom line instead of the built-in count summary.
- `filtersExtra` adds custom controls beside the stock search and status inputs.
- `DataViewToolbar` is a client-side composition helper and pairs naturally with `PageHeader`, `DataTable`, and `Pagination`.
