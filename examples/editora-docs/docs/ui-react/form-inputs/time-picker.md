---
title: Time Picker
description: Time-only picker with optional freeform input.
sidebar_label: Time Picker
---

# Time Picker

```tsx
import { TimePicker } from '@editora/ui-react';

<TimePicker
  label="Start time"
  value="09:30"
  format="12h"
  step={15}
  min="08:00"
  max="18:00"
  clearable
  allowInput
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `defaultValue`, `open`, `defaultOpen`, `format`, `step`, `seconds`, `stepSeconds`, `min`, `max`, `disabled`, `readOnly`, `required`, `name`, `clearable`, `allowInput`, `mode`, `label`, `hint`, `error`, `locale`, `translations`, `variant`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onInvalid`

## Notes

- Use `seconds` and `stepSeconds` when the picker needs second-level precision.
- `format="12h"` switches the visible time format while preserving a serialized value.
