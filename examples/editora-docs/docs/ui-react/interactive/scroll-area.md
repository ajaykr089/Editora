---
title: Scroll Area
description: Styled scroll container with reach and progress events.
sidebar_label: Scroll Area
---

# Scroll Area

```tsx
import { ScrollArea } from '@editora/ui-react';

<ScrollArea
  orientation="vertical"
  size="md"
  shadows
  onScrollChange={(detail) => console.log(detail.progressY)}
>
  <div style={{ height: 480 }}>Scrollable content</div>
</ScrollArea>;
```

## Key Props

`orientation`, `size`, `variant`, `tone`, `autoHide`, `shadows`, `onScrollChange`, `onReachStart`, `onReachEnd`
