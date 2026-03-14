---
title: Panel Group
description: Resizable panel layout primitives.
sidebar_label: Panel Group
---

# Panel Group

```tsx
import { Panel, PanelGroup, Splitter } from '@editora/ui-react';

<PanelGroup orientation="horizontal" onLayoutChange={(detail) => console.log(detail.sizes)}>
  <Panel size={30} minSize={20}>Navigation</Panel>
  <Splitter ariaLabel="Resize navigation" />
  <Panel size={70}>Workspace</Panel>
</PanelGroup>;
```

## Key Props

`orientation`, `storageKey`, `autoSave`, `onLayoutChange`, `onResizeStart`, `onResize`, `onResizeEnd`

## Notes

- Use `Panel` for sized regions and `Splitter` between them.
- `Panel` supports `size`, `minSize`, `maxSize`, `collapsedSize`, and `collapsed`.
