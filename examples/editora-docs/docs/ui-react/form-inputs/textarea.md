---
title: Textarea
description: Multi-line text input with autosize and validation support.
sidebar_label: Textarea
---

# Textarea

```tsx
import { Textarea } from '@editora/ui-react';

<Textarea
  label="Summary"
  placeholder="Add release notes"
  rows={4}
  autosize
  maxRows={10}
  showCount
  maxlength={500}
  onChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `onChange`, `onInput`, `onDebouncedInput`, `onClear`, `clearable`, `debounce`, `validation`, `size`, `minlength`, `maxlength`, `rows`, `readOnly`, `autofocus`, `disabled`, `name`, `required`, `placeholder`, `resize`, `variant`, `color`, `radius`, `label`, `description`, `autosize`, `maxRows`, `showCount`, `density`, `tone`, `headless`

## Notes

- `autosize` grows the field up to `maxRows`.
- The wrapper uses `minlength` and `maxlength` rather than camelCase versions.
