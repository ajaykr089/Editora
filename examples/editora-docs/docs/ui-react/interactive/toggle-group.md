---
title: Toggle Group
description: Single or multiple grouped toggles with shared selection state.
sidebar_label: Toggle Group
---

# Toggle Group

```tsx
import { ToggleGroup } from '@editora/ui-react';

<ToggleGroup
  value={['bold', 'italic']}
  multiple
  variant="soft"
  onValueChange={(detail) => console.log(detail.values)}
>
  <button value="bold">Bold</button>
  <button value="italic">Italic</button>
  <button value="underline">Underline</button>
</ToggleGroup>;
```

## Key Props

`value`, `multiple`, `disabled`, `headless`, `orientation`, `variant`, `size`, `density`, `shape`, `elevation`, `allowEmpty`, `required`, `activation`, `onInput`, `onChange`, `onValueChange`
