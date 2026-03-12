---
title: Search Input
description: Search input pattern built with the Input wrapper.
sidebar_label: Search Input
source_component: Input
---

# Search Input

Search input in `ui-react` is documented through the `Input` component with `type="search"`.

```tsx
import { Input } from '@editora/ui-react';

<Input
  type="search"
  label="Search"
  placeholder="Search issues"
  clearable
  debounce={200}
  onDebouncedInput={(value) => console.log(value)}
/>
```
