---
title: Command
description: Search-first command surface with list selection.
sidebar_label: Command
---

# Command

```tsx
import { Command } from '@editora/ui-react';

<Command
  placeholder="Search commands"
  emptyText="No matching commands"
  onQueryChange={(value) => console.log(value)}
  onSelect={(detail) => console.log(detail.value)}
>
  <button value="publish">Publish update</button>
  <button value="archive">Archive draft</button>
</Command>;
```

## Key Props

`placeholder`, `emptyText`, `onSelect`, `onQueryChange`
