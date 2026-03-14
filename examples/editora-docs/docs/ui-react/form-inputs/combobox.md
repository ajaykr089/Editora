---
title: Combobox
description: Searchable input with option list and async state support.
sidebar_label: Combobox
---

# Combobox

```tsx
import { Combobox } from '@editora/ui-react';

<Combobox
  label="Assignee"
  placeholder="Search people"
  clearable
  debounce={200}
  emptyText="No matches"
  onInput={(query) => console.log(query)}
  onSelect={(value, label) => console.log(value, label)}
>
  <button value="asha">Asha Patel</button>
  <button value="dylan">Dylan Kim</button>
</Combobox>;
```

## Key Props

`value`, `open`, `state`, `stateText`, `onChange`, `onInput`, `onDebouncedInput`, `onSelect`, `onOpenDetail`, `onCloseDetail`, `onOpen`, `onClose`, `onClear`, `clearable`, `debounce`, `validation`, `size`, `maxlength`, `readOnly`, `autofocus`, `disabled`, `name`, `required`, `placeholder`, `variant`, `radius`, `label`, `description`, `emptyText`, `noFilter`, `allowCustom`
