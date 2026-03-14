---
title: Password Field
description: Password input with reveal toggle, clear action, and strength feedback.
sidebar_label: Password Field
---

# Password Field

```tsx
import { PasswordField } from '@editora/ui-react';

<PasswordField
  label="Password"
  placeholder="Create a password"
  clearable
  revealable
  showStrength
  minlength={12}
  onChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `onChange`, `onInput`, `onDebouncedInput`, `onClear`, `onVisibilityChange`, `onStrengthChange`, `clearable`, `debounce`, `validation`, `size`, `minlength`, `maxlength`, `readOnly`, `autofocus`, `disabled`, `counter`, `floatingLabel`, `name`, `required`, `pattern`, `autoComplete`, `spellCheck`, `placeholder`, `variant`, `tone`, `density`, `shape`, `color`, `radius`, `label`, `description`, `error`, `showStrength`, `revealable`, `strengthEvaluator`

## Notes

- `strengthEvaluator` lets product code replace the default scoring logic.
- The wrapper uses `minlength` and `maxlength`, matching the underlying custom element attributes.
