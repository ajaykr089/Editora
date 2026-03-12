---
title: Chart
description: Lightweight chart wrapper for line, bar, donut, and related views.
sidebar_label: Chart
---

# Chart

```tsx
import { Chart } from '@editora/ui-react';

<Chart
  type="bar"
  title="Weekly signups"
  data={[
    { label: 'Mon', value: 12 },
    { label: 'Tue', value: 18 },
    { label: 'Wed', value: 9 }
  ]}
  showLegend
  onPointSelect={(detail) => console.log(detail.label, detail.value)}
/>;
```

## Key Props

`data`, `values`, `labels`, `type`, `variant`, `title`, `subtitle`, `state`, `disabled`, `interactive`, `showLegend`, `showSummary`, `headless`, `ariaLabel`, `onPointSelect`

## Notes

- Use either `data` or paired `values` and `labels`.
