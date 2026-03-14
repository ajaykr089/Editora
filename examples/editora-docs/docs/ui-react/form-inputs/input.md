---
title: Input
description: Single-line input wrapper with validation, clearable mode, debounce, and visual variants.
sidebar_label: Input
---

# Input

```tsx
import { Input } from '@editora/ui-react';

<Input
  label="Email"
  type="email"
  placeholder="name@company.com"
  clearable
  onChange={(value) => console.log(value)}
/>
```

## Key Props

`value`, `onChange`, `onInput`, `onDebouncedInput`, `onClear`, `clearable`, `debounce`, `validation`, `size`, `minlength`, `maxlength`, `readOnly`, `autofocus`, `disabled`, `counter`, `floatingLabel`, `type`, `name`, `required`, `pattern`, `inputMode`, `autoComplete`, `min`, `max`, `step`, `spellCheck`, `placeholder`, `headless`, `variant`, `tone`, `density`, `shape`, `color`, `radius`, `label`, `description`

## Notes

- The wrapper uses `minlength` / `maxlength` and `autofocus`, matching the custom-element attributes.
