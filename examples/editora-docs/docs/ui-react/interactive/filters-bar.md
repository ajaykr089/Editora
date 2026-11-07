---
title: FiltersBar
description: Search-and-filter toolbar for list screens with optional status select, custom controls, and clear actions.
sidebar_label: FiltersBar
---

# FiltersBar

`FiltersBar` is the low-level filter shell behind `DataViewToolbar`. It gives list and table screens a reusable row for search, status filtering, extra controls, and a single reset action without pulling in page-level copy or count summaries.

## Basic usage

```tsx live
function PatientsFilters() {
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState('all');

  return (
    <ThemeProvider>
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
    </ThemeProvider>
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

## Date range with presets

Pass `onDateRangeChange` to add a date-range picker; `dateRangePresets` adds one-click ranges beside it, and the one matching the current range is shown as pressed. `commonDateRangePresets` covers last 7 and 30 days, this and last month, and this year, computed in the user's local time. Ranges are ISO dates with both ends included.

```tsx
import { FiltersBar, commonDateRangePresets, type FiltersBarDateRange } from '@editora/ui-react';

const [period, setPeriod] = React.useState<FiltersBarDateRange | null>(null);

<FiltersBar
  search={search}
  onSearchChange={setSearch}
  dateRange={period}
  dateRangeLabel="Period"
  dateRangePresets={commonDateRangePresets}
  onDateRangeChange={setPeriod}
/>
```

Your own presets take a fixed range or a function: `{ label: 'Q1', range: { start: '2026-01-01', end: '2026-03-31' } }`.

## Notes

- `searchDebounce` helps when every keystroke would otherwise trigger a network-backed query.
- `extra` is useful for one-off controls like export buttons, date filters, or saved-view pickers.
- `children` render inline with `extra`, so you can add fully custom controls without changing the stock search and status layout.
- Pass `clearDisabled` when the clear action should stay visible but inactive until filters are applied.
- Use `FiltersBar` directly when you only need the filter controls; use `DataViewToolbar` when the screen also needs counts, summary text, or page-level actions.
