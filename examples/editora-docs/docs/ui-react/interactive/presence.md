---
title: Presence
description: Control mount and unmount transitions for animated UI regions.
sidebar_label: Presence
---

# Presence

The `Presence` component manages conditional rendering with transition-aware behavior.

## Basic Usage

```tsx
import { Presence } from '@editora/ui-react';

export function Example({ open }: { open: boolean }) {
  return <Presence present={open}><div>Animated content</div></Presence>;
}
```
