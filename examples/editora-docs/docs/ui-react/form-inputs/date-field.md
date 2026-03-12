---
title: Date Field
description: Segmented date field for direct keyboard entry.
sidebar_label: Date Field
---

# Date Field

```tsx
import { DateField } from '@editora/ui-react';

<DateField
  label="Due date"
  value="2026-03-18"
  min="2026-01-01"
  max="2026-12-31"
  locale="en-IN"
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `min`, `max`, `locale`, `label`, `description`, `error`, `name`, `required`, `disabled`, `readOnly`, `onChange`, `onValueChange`

## Notes

- Use `DateField` for segmented keyboard input.
- Use `TimeField` from the same wrapper module when you need time-only segmented entry.
