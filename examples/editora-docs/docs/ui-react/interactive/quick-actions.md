---
title: Quick Actions
description: Compact action launcher for floating or embedded action groups.
sidebar_label: Quick Actions
---

# Quick Actions

```tsx
import { QuickActions } from '@editora/ui-react';

<QuickActions mode="fab" floating open label="Create actions" onSelect={(detail) => console.log(detail.id)}>
  <button data-id="doc">Document</button>
  <button data-id="task">Task</button>
</QuickActions>;
```

## Key Props

`open`, `mode`, `orientation`, `variant`, `floating`, `placement`, `collapsible`, `label`, `headless`, `onSelect`, `onOpenChange`, `onToggle`
