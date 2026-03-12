---
title: Select
description: Select wrapper for native option markup with visual tokens and validation support.
sidebar_label: Select
---

# Select

```tsx
import { Select } from '@editora/ui-react';

<Select label="Role" placeholder="Choose a role" onValueChange={(value) => console.log(value)}>
  <option value="designer">Designer</option>
  <option value="engineer">Engineer</option>
  <option value="ops">Operations</option>
</Select>
```

## Props

`value`, `disabled`, `loading`, `required`, `invalid`, `headless`, `placeholder`, `name`, `label`, `description`, `error`, `size`, `variant`, `tone`, `density`, `shape`, `elevation`, `radius`, `validation`, `onChange`, `onInput`, `onValueChange`

## Notes

- Pass native `<option>` elements as children.
