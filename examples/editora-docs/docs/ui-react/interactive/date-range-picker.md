---
title: Date Range Picker
description: Interactive date-range picker for scheduling and reporting flows.
sidebar_label: Date Range Picker
---

# Date Range Picker

```tsx
import { DateRangePicker } from '@editora/ui-react';

<DateRangePicker
  label="Incident window"
  rangeVariant="single-field"
  closeOnSelect
  clearable
  allowPartial
  value='{"start":"2026-03-11","end":"2026-03-13"}'
  onChange={(detail) => console.log(detail)}
/>;
```

## Key Props

`value`, `defaultValue`, `open`, `defaultOpen`, `min`, `max`, `locale`, `translations`, `weekStart`, `size`, `shape`, `bare`, `variant`, `state`, `rangeVariant`, `label`, `hint`, `error`, `allowSameDay`, `allowPartial`, `closeOnSelect`, `clearable`, `disabled`, `readOnly`, `required`, `name`, `nameStart`, `nameEnd`, `mode`, `showFooter`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onInvalid`
