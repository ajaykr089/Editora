---
title: Date Range Picker
description: Range picker for start and end dates.
sidebar_label: Date Range Picker
---

# Date Range Picker

```tsx
import { DateRangePicker } from '@editora/ui-react';

<DateRangePicker
  label="Coverage window"
  value='{"start":"2026-03-10","end":"2026-03-18"}'
  min="2026-01-01"
  max="2026-12-31"
  rangeVariant="two-fields"
  clearable
  allowSameDay
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `defaultValue`, `open`, `defaultOpen`, `min`, `max`, `locale`, `translations`, `weekStart`, `size`, `shape`, `bare`, `variant`, `state`, `rangeVariant`, `label`, `hint`, `error`, `allowSameDay`, `allowPartial`, `closeOnSelect`, `clearable`, `disabled`, `readOnly`, `required`, `name`, `nameStart`, `nameEnd`, `mode`, `showFooter`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onInvalid`

## Notes

- `value` is a serialized range string consumed by the custom element.
- Use `nameStart` and `nameEnd` when your form needs distinct field names.
