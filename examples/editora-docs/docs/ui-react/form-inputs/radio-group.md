---
title: Radio Group
description: Single-choice selection group backed by option data or custom children.
sidebar_label: Radio Group
---

# Radio Group

```tsx
import { RadioGroup } from '@editora/ui-react';

<RadioGroup
  name="priority"
  value="high"
  orientation="vertical"
  variant="card"
  options={[
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High', description: 'Escalate immediately' }
  ]}
  onValueChange={(detail) => console.log(detail.value)}
/>;
```

## Key Props

`value`, `disabled`, `required`, `name`, `orientation`, `variant`, `size`, `tone`, `options`, `onValueChange`

## Notes

- Prefer the `options` prop for data-driven groups, or pass custom child markup directly.
