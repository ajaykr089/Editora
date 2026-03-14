---
title: Textarea
description: Interactive textarea wrapper with autosize and counter support.
sidebar_label: Textarea
---

# Textarea

```tsx
import { Textarea } from '@editora/ui-react';

<Textarea
  label="Notes"
  autosize
  maxRows={8}
  showCount
  maxlength={280}
  variant="soft"
  onInput={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `onChange`, `onInput`, `onDebouncedInput`, `onClear`, `clearable`, `debounce`, `validation`, `size`, `minlength`, `maxlength`, `rows`, `readOnly`, `autofocus`, `disabled`, `name`, `required`, `placeholder`, `resize`, `variant`, `color`, `radius`, `label`, `description`, `autosize`, `maxRows`, `showCount`, `density`, `tone`, `headless`
