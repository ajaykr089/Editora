---
title: Date Time Picker
description: Interactive datetime selection for workflows and scheduling.
sidebar_label: Date Time Picker
---

# Date Time Picker

```tsx
import { DateTimePicker } from '@editora/ui-react';

<DateTimePicker
  label="Start"
  open
  value="2026-03-15T14:00"
  format="24h"
  step={30}
  clearable
  allowInput
  showFooter
  onChange={(detail) => console.log(detail)}
/>;
```

## Key Props

`value`, `defaultValue`, `open`, `defaultOpen`, `min`, `max`, `locale`, `translations`, `weekStart`, `size`, `bare`, `variant`, `step`, `format`, `disabled`, `readOnly`, `required`, `name`, `closeOnSelect`, `clearable`, `allowInput`, `mode`, `showFooter`, `label`, `hint`, `error`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onInvalid`
