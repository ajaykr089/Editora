---
title: Floating Toolbar
description: Selection or anchor-aware floating toolbar surface.
sidebar_label: Floating Toolbar
---

# Floating Toolbar

```tsx
import { FloatingToolbar } from '@editora/ui-react';

<FloatingToolbar anchorId="editor-anchor" placement="top" onOpenChange={(open) => console.log(open)}>
  <button>Bold</button>
  <button>Italic</button>
</FloatingToolbar>;
```

## Key Props

`anchorId`, `open`, `placement`, `align`, `offset`, `variant`, `density`, `shape`, `elevation`, `tone`, `closeOnOutside`, `closeOnEscape`, `onOpen`, `onClose`, `onOpenChange`, `onRequestClose`
