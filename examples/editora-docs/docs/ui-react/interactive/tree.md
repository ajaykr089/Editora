---
title: Tree
description: Hierarchical navigation and selection wrapper.
sidebar_label: Tree
---

# Tree

```tsx
import { Tree, TreeItem } from '@editora/ui-react';

<Tree value="incidents" onSelect={(detail) => console.log(detail.value)}>
  <TreeItem value="incidents" label="Incidents" expanded>
    <TreeItem value="sev-1" label="SEV-1" />
    <TreeItem value="sev-2" label="SEV-2" />
  </TreeItem>
</Tree>;
```

## Key Props

`value`, `indentSize`, `onSelect`, `onExpandedChange`

## Notes

- Use `TreeItem` for nested nodes.
- `TreeItem` supports `value`, `label`, `expanded`, `selected`, `disabled`, `prefix`, and `suffix`.
