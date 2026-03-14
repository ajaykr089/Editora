---
title: Color Picker
description: Color value picker with inline and popover modes.
sidebar_label: Color Picker
---

# Color Picker

```tsx
import { ColorPicker } from '@editora/ui-react';

<ColorPicker
  value="#2563eb"
  mode="popover"
  alpha
  presets={['#2563eb', '#16a34a', '#dc2626']}
  recent
  maxRecent={6}
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `format`, `alpha`, `disabled`, `readOnly`, `size`, `variant`, `state`, `tone`, `mode`, `open`, `closeOnEscape`, `placeholder`, `presets`, `recent`, `maxRecent`, `persist`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onOpenDetail`, `onCloseDetail`, `onInvalid`

## Notes

- Use `mode="inline"` to keep the picker always visible.
- `onChange` and `onInput` receive a detail object; `onValueChange` receives the serialized color string.
