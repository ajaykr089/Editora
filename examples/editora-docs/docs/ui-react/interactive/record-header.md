---
title: RecordHeader
description: Detail-page header that combines PageHeader with a structured metadata grid.
sidebar_label: RecordHeader
---

# RecordHeader

`RecordHeader` is the detail-page companion to `PageHeader`. It keeps the familiar title, subtitle, status chip, and actions, then adds a responsive metadata grid for identifiers, owners, timestamps, or other high-value record facts.

## Basic usage

```tsx
import { RecordHeader } from '@editora/ui-react';

function PatientHeader() {
  return (
    <RecordHeader
      title="Ava Stone"
      subtitle="Clinical profile and recent activity"
      statusChip={{ label: 'critical', tone: 'warning' }}
      details={[
        { label: 'MRN', value: 'PT-1042' },
        { label: 'Owner', value: 'Dr. Maya Chen' },
        { label: 'Updated', value: 'Apr 9, 2026' },
      ]}
    />
  );
}
```

## Notes

- Use `details` for compact, scannable metadata that should stay close to the record title.
- Pass custom React content to `details` when the default label/value grid is not enough.
- `RecordHeader` works well for profile pages, document detail views, and admin record screens.
