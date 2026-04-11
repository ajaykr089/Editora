---
title: PageHeader
description: Reusable page-title shell with eyebrow text, status chip, action buttons, and optional supporting content.
sidebar_label: PageHeader
---

# PageHeader

`PageHeader` is the base shell for page titles across dashboards, admin panels, record views, and settings screens. It keeps the title block, status chip, and action row in one responsive layout and powers higher-level wrappers like `PageToolbar` and `RecordHeader`.

## Basic usage

```tsx
import { PageHeader } from '@editora/ui-react';

function ReportsHeader() {
  return (
    <PageHeader
      eyebrow="Operations"
      title="Reports"
      subtitle="Track performance across locations and departments"
      statusChip={{ label: 'live', tone: 'success' }}
      actions={[
        { label: 'Share' },
        { label: 'Export', variant: 'primary' },
      ]}
    />
  );
}
```

## Custom action content

```tsx
import { Button, PageHeader } from '@editora/ui-react';

function PatientsHeader() {
  return (
    <PageHeader
      title="Patients"
      subtitle="Manage intake, review status, and assignments"
      actions={(
        <>
          <Button size="sm" variant="ghost">Import</Button>
          <Button size="sm">New patient</Button>
        </>
      )}
    />
  );
}
```

## Supporting content below the title row

```tsx
<PageHeader title="Billing" subtitle="Cycle health and payment timing">
  <div>Last synced 5 minutes ago</div>
</PageHeader>
```

## Notes

- Use `actions` as a config array when standard button actions are enough; pass custom React nodes when the header needs menus, segmented controls, or mixed layouts.
- `actionsLabel` sets the accessible label for the action group.
- `statusChip` mirrors the `Badge` tone and variant options, so it works well for live status, plan tier, review state, or environment labels.
- `children` render below the main title row, which is handy for lightweight summaries, breadcrumbs, or inline metadata.
- Use `PageHeader` directly for flexible page shells, `PageToolbar` when a control row is always attached, and `RecordHeader` when the page also needs a structured detail grid.
