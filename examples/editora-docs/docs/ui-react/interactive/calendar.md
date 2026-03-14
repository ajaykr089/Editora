---
title: Calendar
description: Calendar view for single, range, or multiple selection flows.
sidebar_label: Calendar
---

# Calendar

```tsx
import { Calendar } from '@editora/ui-react';

<Calendar
  year={2026}
  month={2}
  selection="single"
  value="2026-03-15"
  events={[{ date: '2026-03-15', title: 'Launch', tone: 'info' }]}
  showToday
  onSelect={(detail) => console.log(detail.value)}
/>;
```

## Key Props

`year`, `month`, `value`, `events`, `variant`, `selection`, `min`, `max`, `disabled`, `readOnly`, `locale`, `translations`, `weekStart`, `outsideClick`, `eventsMax`, `eventsDisplay`, `maxSelections`, `size`, `bare`, `tone`, `state`, `headless`, `hideToday`, `showToday`, `ariaLabel`, `onSelect`, `onChange`, `onCalendarChange`, `onMonthChange`, `onValueChange`

## Notes

- `selection` controls whether the calendar acts in single, range, or multiple mode.
