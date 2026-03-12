---
title: Tabs
description: Tabbed interface wrapper with style and activation variants.
sidebar_label: Tabs
---

# Tabs

```tsx
import { Tabs } from '@editora/ui-react';

<Tabs
  selected={0}
  activation="auto"
  variant="underline"
  onTabChange={(detail) => console.log(detail.value)}
>
  <button data-ui-tab value="overview">Overview</button>
  <button data-ui-tab value="activity">Activity</button>

  <section data-ui-panel>Overview panel</section>
  <section data-ui-panel>Activity panel</section>
</Tabs>;
```

## Key Props

`selected`, `value`, `orientation`, `activation`, `variant`, `size`, `density`, `tone`, `stretched`, `shape`, `elevation`, `loop`, `bare`, `headless`, `onChange`, `onTabChange`

## Notes

- Provide tab triggers and panels as children of the `Tabs` host.
