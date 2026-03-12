---
title: Hover Card
description: Delayed hover surface for lightweight contextual details.
sidebar_label: Hover Card
---

# Hover Card

```tsx
import { HoverCard } from '@editora/ui-react';

<HoverCard delay={150} closeDelay={120} placement="bottom" onChange={(open) => console.log(open)}>
  <button slot="trigger">Hover user</button>
  <div>Contextual profile preview</div>
</HoverCard>;
```

## Key Props

`open`, `delay`, `closeDelay`, `placement`, `offset`, `variant`, `tone`, `density`, `shape`, `elevation`, `headless`, `onOpen`, `onClose`, `onChange`
