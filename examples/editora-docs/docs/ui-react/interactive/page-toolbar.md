---
title: PageToolbar
description: Higher-level page shell that combines PageHeader with a toolbar row and optional footer.
sidebar_label: PageToolbar
---

# PageToolbar

`PageToolbar` is a small composition helper for screens where the page intro and the control row always travel together. It wraps `PageHeader` and adds named `toolbar` and `footer` regions inside one reusable shell.

## Basic usage

```tsx
import { Input, PageToolbar, Select } from '@editora/ui-react';

function ReportsToolbar() {
  return (
    <PageToolbar
      title="Reports"
      subtitle="Date and department-driven reporting"
      toolbar={(
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
          <Input type="date" label="From" />
          <Input type="date" label="To" />
          <Select label="Department">
            <option>All departments</option>
          </Select>
        </div>
      )}
      footer={<span>Reporting window: last 30 days</span>}
    />
  );
}
```

## Notes

- Use `PageToolbar` when the same page title, action bar, and filter row repeat across list or reporting screens.
- `surface="none"` removes the framed shell if you want to embed the pattern inside an existing layout container.
- `PageToolbar` stays client-side because it builds on top of the interactive page-shell wrappers.
