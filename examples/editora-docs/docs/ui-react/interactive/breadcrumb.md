---
title: Breadcrumb
description: Hierarchical navigation trail with truncation support.
sidebar_label: Breadcrumb
---

# Breadcrumb

```tsx
import { Breadcrumb } from '@editora/ui-react';

<Breadcrumb maxItems={4} currentIndex={3} ariaLabel="Project navigation">
  <a href="/workspace">Workspace</a>
  <a href="/workspace/projects">Projects</a>
  <a href="/workspace/projects/editora">Editora</a>
  <span>Release notes</span>
</Breadcrumb>;
```

## Key Props

`separator`, `maxItems`, `currentIndex`, `size`, `variant`, `tone`, `state`, `disabled`, `ariaLabel`, `onSelect`

## Notes

- Provide the breadcrumb items as children.
- `onSelect` receives index and label details from the custom element.
