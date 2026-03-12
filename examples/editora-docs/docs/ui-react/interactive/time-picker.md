---
title: Time Picker
description: Interactive time selection wrapper.
sidebar_label: Time Picker
---

# Time Picker

```tsx
import { TimePicker } from '@editora/ui-react';

<TimePicker
  open
  label="Escalation time"
  value="13:30"
  format="24h"
  step={30}
  clearable
  allowInput
  onChange={(detail) => console.log(detail.value)}
/>;
```

## Key Props

`value`, `defaultValue`, `open`, `defaultOpen`, `format`, `step`, `seconds`, `stepSeconds`, `min`, `max`, `disabled`, `readOnly`, `required`, `name`, `clearable`, `allowInput`, `mode`, `label`, `hint`, `error`, `locale`, `translations`, `variant`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onInvalid`
