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

Compound usage:

```tsx
<Chart.Root type="area" series={series} valueSuffix="%">
  <Chart.Title>Revenue comparison</Chart.Title>
  <Chart.Subtitle>Last 12 months</Chart.Subtitle>
  <Chart.Header>
    <button>Last 12 months</button>
  </Chart.Header>
</Chart.Root>
```

## Key Props

`data`, `values`, `labels`, `type`, `variant`, `title`, `subtitle`, `state`, `disabled`, `interactive`, `showLegend`, `showSummary`, `headless`, `ariaLabel`, `onPointSelect`

Additional data-display props:

- `series`: multi-series chart input for line, area, step, scatter, and grouped bar charts
- `valuePrefix` / `valueSuffix`: format axis, tooltip, and summary values
- `slot="header"`: inject custom filter/date controls above the chart surface

## Notes

- Use either `data` or paired `values` and `labels`.
- Use `series` when you need comparison lines, multi-metric tooltips, or grouped bars.
- `donut` and `radial` currently use the primary series only.
- `Chart.Header` maps to the chart's `slot="header"` toolbar region.
- `Chart.Title` and `Chart.Subtitle` map to slotted header text regions and override the `title` / `subtitle` prop fallback.
