---
title: Slider
description: Value and range slider with marks, labels, variants, and change events.
sidebar_label: Slider
---

# Slider

```tsx
import { Slider } from '@editora/ui-react';

<Slider min={0} max={100} value={40} showValue label="Volume" onChange={(value) => console.log(value)} />
```

## Props

`value`, `valueStart`, `valueEnd`, `min`, `max`, `step`, `range`, `disabled`, `headless`, `orientation`, `size`, `variant`, `tone`, `showValue`, `format`, `label`, `description`, `marks`, `name`, `nameStart`, `nameEnd`, `onInput`, `onChange`, `onValueChange`

## Notes

- Use `range`, `valueStart`, and `valueEnd` for two-handle range selection.
