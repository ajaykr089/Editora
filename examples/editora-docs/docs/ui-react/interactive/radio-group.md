---
title: Radio Group
description: Interactive single-choice control with options data.
sidebar_label: Radio Group
---

# Radio Group

```tsx
import { RadioGroup } from '@editora/ui-react';

<RadioGroup
  value="review"
  variant="segmented"
  orientation="horizontal"
  options={[
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'In review' },
    { value: 'live', label: 'Live' }
  ]}
  onValueChange={(detail) => console.log(detail.value)}
/>;
```

## Key Props

`value`, `disabled`, `required`, `name`, `orientation`, `variant`, `size`, `tone`, `options`, `onValueChange`
