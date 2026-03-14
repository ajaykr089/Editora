---
title: Label
description: Accessible text label for form controls and grouped inputs.
sidebar_label: Label
---

# Label

The `Label` component connects text descriptions with form controls.

## Basic Usage

```tsx
import { Label, Input } from '@editora/ui-react';

export function Example() {
  return (
    <div>
      <Label htmlFor="name">Name</Label>
      <Input id="name" />
    </div>
  );
}
```
