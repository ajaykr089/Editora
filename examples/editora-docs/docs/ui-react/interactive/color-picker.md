---
title: Color Picker
description: Interactive color selector with controlled open state support.
sidebar_label: Color Picker
---

# Color Picker

```tsx
import { ColorPicker } from '@editora/ui-react';

<ColorPicker
  mode="popover"
  open
  value="#0f172a"
  format="hex"
  alpha
  presets={['#0f172a', '#2563eb', '#16a34a']}
  recent
  onOpenDetail={(detail) => console.log(detail)}
  onValueChange={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `format`, `alpha`, `disabled`, `readOnly`, `size`, `variant`, `state`, `tone`, `mode`, `open`, `closeOnEscape`, `placeholder`, `presets`, `recent`, `maxRecent`, `persist`, `onInput`, `onChange`, `onValueChange`, `onOpen`, `onClose`, `onOpenDetail`, `onCloseDetail`, `onInvalid`
