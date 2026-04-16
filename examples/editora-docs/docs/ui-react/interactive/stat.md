---
title: Stat
description: Lightweight metric surface for labels, values, trends, and supporting content.
sidebar_label: Stat
---

# Stat

`Stat` is the lightweight metric primitive for dashboards, analytics rails, and compact summary rows. Use it when you want information hierarchy around a value without committing to a full data card shell.

## Basic usage

```tsx
import { Stat } from '@editora/ui-react';

function QueueStat() {
  return (
    <Stat
      label="Queued jobs"
      value="128"
      meta="Updated 2m ago"
      trend="+9%"
      tone="info"
    />
  );
}
```

## With supporting content

```tsx
import { Meter, Stat } from '@editora/ui-react';

function QualityStat() {
  return (
    <Stat
      label="Quality score"
      value="84%"
      description="You can place supporting content below the main metric."
      tone="success"
      trend="Stable"
    >
      <Meter value={84} min={0} max={100} low={30} high={70} optimum={90} />
    </Stat>
  );
}
```

## Key props

`label`, `value`, `icon`, `meta`, `trend`, `description`, `tone`, `size`, `variant`

## Notes

- Use `variant="plain"` for inline metric rows and `variant="card"` for framed presentation.
- `value` and `trend` accept React nodes, so animated counters and badges work well here.
- `children` render after the descriptive/meta content, which is useful for meters, sparklines, or secondary actions.
