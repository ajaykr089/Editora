---
title: Number Field
description: Numeric input with stepping, formatting, and validation hooks.
sidebar_label: Number Field
---

# Number Field

```tsx
import { NumberField } from '@editora/ui-react';

<NumberField
  label="Seats"
  value={25}
  min={1}
  max={500}
  step={1}
  precision={0}
  locale="en-US"
  format="grouped"
  showSteppers
  onValueChange={(detail) => console.log(detail.value)}
/>;
```

## Key Props

`value`, `min`, `max`, `step`, `precision`, `locale`, `format`, `placeholder`, `label`, `description`, `error`, `name`, `required`, `disabled`, `readOnly`, `allowWheel`, `showSteppers`, `clampOnBlur`, `autoComplete`, `inputMode`, `invalid`, `prefix`, `suffix`, `incrementTrigger`, `decrementTrigger`, `onValueChange`, `onInvalidValue`

## Notes

- `onValueChange` receives a detail object with both the new and previous values.
- Use `prefix`, `suffix`, or the trigger slots when you need custom adornments.
