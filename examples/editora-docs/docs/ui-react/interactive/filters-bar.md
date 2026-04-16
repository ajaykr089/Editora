---
title: FiltersBar
description: Search-and-filter toolbar for list screens with optional status select, custom controls, and clear actions.
sidebar_label: FiltersBar
---

# FiltersBar

`FiltersBar` is the low-level filter shell behind `DataViewToolbar`. It gives list and table screens a reusable row for search, status filtering, extra controls, and a single reset action without pulling in page-level copy or count summaries.

## Basic usage

```tsx
import { Button, FiltersBar } from '@editora/ui-react';

function PatientsFilters() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');

  return (
    <FiltersBar
      search={search}
      status={status}
      statusOptions={[
        { value: 'all', label: 'All status' },
        { value: 'active', label: 'Active' },
        { value: 'discharged', label: 'Discharged' },
      ]}
      extra={<Button size="sm" variant="secondary">Export</Button>}
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

## Labeled search and placeholder option

```tsx
<FiltersBar
  searchLabel="Search patients"
  searchPlaceholder="Find by name or MRN"
  statusLabel="Filter by status"
  statusPlaceholder="Choose a status"
  statusOptions={[
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending review' },
  ]}
/>
```

## Notes

- `searchDebounce` helps when every keystroke would otherwise trigger a network-backed query.
- `extra` is useful for one-off controls like export buttons, date filters, or saved-view pickers.
- `children` render inline with `extra`, so you can add fully custom controls without changing the stock search and status layout.
- Pass `clearDisabled` when the clear action should stay visible but inactive until filters are applied.
- Use `FiltersBar` directly when you only need the filter controls; use `DataViewToolbar` when the screen also needs counts, summary text, or page-level actions.
