---
title: Collapsible
description: Expand and collapse content regions with accessible trigger and panel behavior.
sidebar_label: Collapsible
---

# Collapsible

The `Collapsible` component lets users reveal or hide secondary content while keeping the layout compact.

## Basic Usage

```tsx
import { Collapsible } from '@editora/ui-react';

export function Example() {
  return (
    <Collapsible open={false}>
      <button type="button">Toggle details</button>
      <div>Hidden content area</div>
    </Collapsible>
  );
}
```

## Notes

- Use for optional details, filters, and advanced sections.
- Keep trigger labels explicit so state changes are clear.
