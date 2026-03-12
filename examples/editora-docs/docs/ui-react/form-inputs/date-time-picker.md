---
title: Date Time Picker
description: Combined date and time selection field.
sidebar_label: Date Time Picker
---

# Date Time Picker

```tsx
import { DateTimePicker } from '@editora/ui-react';

<DateTimePicker
  label="Publish at"
  value="2026-03-15T10:30"
  min="2026-03-01T08:00"
  max="2026-03-31T18:00"
  format="12h"
  step={15}
  clearable
  allowInput
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `defaultValue`, `open`, `defaultOpen`, `min`, `max`, `locale`, `translations`, `weekStart`, `size`, `bare`, `variant`, `step`, `format`, `disabled`, `readOnly`, `required`, `name`, `closeOnSelect`, `clearable`, `allowInput`, `mode`, `showFooter`, `label`, `hint`, `error`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onInvalid`

## Notes

- `format` controls 24-hour vs 12-hour time rendering.
- `step` is the minute increment used by the time portion.
