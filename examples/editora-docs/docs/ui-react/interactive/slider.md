---
title: Slider
description: Interactive slider for line and range controls with marks and visual variants.
sidebar_label: Slider
---

# Slider

```tsx
import { Slider } from '@editora/ui-react';

<Slider
  range
  valueStart={20}
  valueEnd={80}
  marks={[0, 25, 50, 75, 100]}
  format="range"
  variant="soft"
  tone="success"
/>
```

## Supported Props

`value`, `valueStart`, `valueEnd`, `min`, `max`, `step`, `range`, `disabled`, `headless`, `orientation`, `size`, `variant`, `tone`, `showValue`, `format`, `label`, `description`, `marks`, `name`, `nameStart`, `nameEnd`, `onInput`, `onChange`, `onValueChange`
