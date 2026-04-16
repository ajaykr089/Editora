---
title: Kbd
description: Keycap-style keyboard hint surface for commands, menus, docs, and onboarding UI.
sidebar_label: Kbd
---

# Kbd

`Kbd` renders one or more keycaps with consistent spacing, separators, and tone styling. It is useful for command hints, onboarding tips, keyboard cheat sheets, and compact menu annotations.

## Basic usage

```tsx
import { Kbd } from '@editora/ui-react';

function SaveHint() {
  return <Kbd keys={['Cmd', 'S']} />;
}
```

## Custom separator

```tsx
<Kbd keys={['ArrowDown', 'Enter']} separator="then" />
```

## Child-derived keys

```tsx
<Kbd>
  <span>Shift</span>
  <span>K</span>
</Kbd>
```

## Key props

`keys`, `separator`, `size`, `tone`

## Notes

- `keys` is the clearest API when the list is data-driven.
- Child-derived keys are helpful when you want to compose richer labels inline.
- `Kbd` is server-safe, so it can be rendered in docs and RSC shells without client wrappers.
