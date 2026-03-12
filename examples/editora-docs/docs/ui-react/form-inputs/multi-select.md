---
title: Multi Select
description: Tokenized multi-value selector with grouped options support.
sidebar_label: Multi Select
---

# Multi Select

```tsx
import { MultiSelect } from '@editora/ui-react';

<MultiSelect
  label="Notify teams"
  placeholder="Choose recipients"
  clearable
  selectionIndicator="check"
  options={[
    { label: 'Core', options: [{ value: 'ops', label: 'Operations' }, { value: 'eng', label: 'Engineering' }] },
    { value: 'support', label: 'Support' }
  ]}
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`options`, `value`, `placeholder`, `label`, `description`, `error`, `name`, `required`, `disabled`, `readOnly`, `loading`, `loadingText`, `clearable`, `maxSelections`, `renderLimit`, `selectionIndicator`, `variant`, `tone`, `density`, `shape`, `size`, `onChange`, `onValueChange`

## Notes

- `options` accepts both flat options and grouped option sections.
- The component is controlled through `value`; there is no separate search callback prop in the wrapper.
