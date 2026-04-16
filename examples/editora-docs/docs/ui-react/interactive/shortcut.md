---
title: Shortcut
description: Small convenience alias for keyboard shortcut hints built on top of Kbd.
sidebar_label: Shortcut
---

# Shortcut

`Shortcut` is the convenience alias for `Kbd` with a compact default size. It is useful when command palettes, menus, and action rails need keyboard hints without repeating the full `Kbd` configuration.

## Basic usage

```tsx
import { Shortcut } from '@editora/ui-react';

function PaletteHint() {
  return (
    <Shortcut>
      <span>Cmd</span>
      <span>K</span>
    </Shortcut>
  );
}
```

## With explicit keys

```tsx
<Shortcut keys={['Shift', '/']} tone="info" />
```

## Notes

- `Shortcut` shares the same prop surface as `Kbd`.
- Prefer `Shortcut` when the UI calls for compact inline hints; prefer `Kbd` when you want more direct control over size or styling.
