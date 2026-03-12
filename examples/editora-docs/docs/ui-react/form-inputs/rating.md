---
title: Rating
description: A dedicated rating wrapper is not currently exported by ui-react.
sidebar_label: Rating
status: unavailable
---

# Rating

`@editora/ui-react` does not currently export a dedicated `Rating` component.

If you need this pattern today:
- use `Slider` for editable score input
- use `Meter` for read-only score display

## Editable Alternative

```tsx
import { Slider } from '@editora/ui-react';

function ScoreInput() {
  return <Slider min={0} max={5} step={1} value={4} showValue format="value" label="Rating" />;
}
```

## Read-only Alternative

```tsx
import { Meter } from '@editora/ui-react';

function ScoreDisplay() {
  return <Meter value={4} min={0} max={5} />;
}
```
