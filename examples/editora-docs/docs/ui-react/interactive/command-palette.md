---
title: Command Palette
description: Overlay command launcher built on top of the command primitive.
sidebar_label: Command Palette
---

# Command Palette

```tsx
import { CommandPalette } from '@editora/ui-react';

<CommandPalette open onSelect={(index) => console.log(index)}>
  <button value="new-doc">New document</button>
  <button value="open-settings">Open settings</button>
</CommandPalette>;
```

## Key Props

`open`, `onSelect`
