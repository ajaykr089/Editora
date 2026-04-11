---
title: MetricCard
description: Card-styled metric wrapper built on top of Stat for dashboards and KPI grids.
sidebar_label: MetricCard
---

# MetricCard

`MetricCard` is the dashboard-friendly alias for `Stat` with the framed card treatment enabled by default. It works well for KPI grids, overview pages, and compact analytics summaries.

## Basic usage

```tsx
import { MetricCard } from '@editora/ui-react';
import { Icon } from '@editora/react-icons';

function RevenueCard() {
  return (
    <MetricCard
      label="Revenue"
      value="$42,300"
      meta="Monthly recurring"
      trend="+12%"
      icon={<Icon name="chart-bar" size={16} aria-hidden="true" />}
    />
  );
}
```

## With animated values

```tsx
import { AnimatedNumber, MetricCard } from '@editora/ui-react';

function ActiveSeatCard() {
  return (
    <MetricCard
      label="Active seats"
      value={<AnimatedNumber value={1284} variant="inline" animate animateOnMount />}
      meta="Live sessions"
      trend="+8%"
      tone="brand"
    />
  );
}
```

## Notes

- `MetricCard` accepts the same props as `Stat`, except `variant` is fixed to the card treatment.
- Use `MetricCard` when the surrounding layout expects balanced tiles; use `Stat` when you need lighter-weight metric grouping.
