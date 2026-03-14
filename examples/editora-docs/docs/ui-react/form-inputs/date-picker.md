---
title: Date Picker
description: Single-date picker with optional input editing and calendar events.
sidebar_label: Date Picker
---

# Date Picker

```tsx
import { DatePicker } from '@editora/ui-react';

<DatePicker
  label="Launch date"
  value="2026-03-15"
  min="2026-01-01"
  max="2026-12-31"
  clearable
  allowInput
  closeOnSelect
  events={[{ date: '2026-03-15', title: 'Release', tone: 'info' }]}
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `defaultValue`, `open`, `defaultOpen`, `min`, `max`, `locale`, `translations`, `weekStart`, `size`, `shape`, `bare`, `variant`, `state`, `placeholder`, `label`, `hint`, `error`, `clearable`, `allowInput`, `closeOnSelect`, `outsideClick`, `disabled`, `readOnly`, `required`, `name`, `mode`, `showFooter`, `events`, `eventsMax`, `eventsDisplay`, `format`, `displayFormat`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onInvalid`

## Notes

- `value` and `defaultValue` are ISO date strings.
- `events` decorates dates on the calendar surface.
