---
title: Meter
description: Semantic measure indicator distinct from progress.
sidebar_label: Meter
---

# Meter

```tsx
import { Meter } from '@editora/ui-react';

<Meter
  label="Storage usage"
  value={72}
  min={0}
  max={100}
  low={40}
  high={85}
  optimum={55}
  showLabel
  format="percent"
/>;
```

## Key Props

`value`, `min`, `max`, `low`, `high`, `optimum`, `label`, `showLabel`, `format`, `precision`, `size`, `variant`, `tone`, `shape`, `mode`, `onValueChange`
