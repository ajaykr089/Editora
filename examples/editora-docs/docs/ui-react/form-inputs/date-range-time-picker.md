---
title: Date Range Time Picker
description: Range picker that captures start and end datetimes.
sidebar_label: Date Range Time Picker
---

# Date Range Time Picker

```tsx
import { DateRangeTimePicker } from '@editora/ui-react';

<DateRangeTimePicker
  label="Maintenance window"
  value='{"start":"2026-03-15T09:00","end":"2026-03-15T12:00"}'
  step={15}
  clearable
  allowPartial
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `defaultValue`, `open`, `defaultOpen`, `min`, `max`, `locale`, `translations`, `weekStart`, `size`, `bare`, `variant`, `step`, `autoNormalize`, `allowPartial`, `disabled`, `readOnly`, `required`, `name`, `closeOnSelect`, `clearable`, `mode`, `showFooter`, `label`, `hint`, `error`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onInvalid`
