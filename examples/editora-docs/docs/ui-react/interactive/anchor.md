---
title: Anchor
description: Low-level anchoring primitive used with positioned overlays.
sidebar_label: Anchor
---

# Anchor

```tsx
import { Anchor, Positioner } from '@editora/ui-react';

<>
  <Anchor id="filters-anchor" />
  <Positioner anchor="filters-anchor" placement="bottom">
    <div>Anchored content</div>
  </Positioner>
</>;
```

## Key Props

`children`

## Notes

- `Anchor` is intentionally minimal. Most behavior lives in the components that reference it.
- Use normal React HTML attributes like `id`, `className`, and `style` when needed.
