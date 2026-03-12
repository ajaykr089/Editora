---
title: Select
description: Interactive select wrapper with variant, tone, density, and validation options.
sidebar_label: Select
---

# Select

```tsx
import { Select } from '@editora/ui-react';

<Select
  label="Status"
  variant="soft"
  tone="warning"
  validation="warning"
>
  <option value="draft">Draft</option>
  <option value="review">In review</option>
  <option value="published">Published</option>
</Select>
```

## Supported Props

`value`, `disabled`, `loading`, `required`, `invalid`, `headless`, `placeholder`, `name`, `label`, `description`, `error`, `size`, `variant`, `tone`, `density`, `shape`, `elevation`, `radius`, `validation`, `onChange`, `onInput`, `onValueChange`
