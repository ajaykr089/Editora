---
title: Navigation
description: Keyboard-navigable navigation built with NavigationMenu.
sidebar_label: Navigation
source_component: NavigationMenu
---

# Navigation

Navigation in `ui-react` is documented through the `NavigationMenu` component surface.

## Basic Usage

```tsx
import { NavigationMenu } from '@editora/ui-react';

function PrimaryNavigation() {
  return (
    <NavigationMenu selected={0} orientation="horizontal">
      <button>Overview</button>
      <button>Analytics</button>
      <button>Reports</button>
      <button>Settings</button>
    </NavigationMenu>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `selected` | `number` | Selected item index |
| `orientation` | `'horizontal' \| 'vertical'` | Layout direction |
| `activation` | `'automatic' \| 'manual'` | Focus activation model |
| `loop` | `boolean` | Loop focus navigation |
| `collapsible` | `boolean` | Allow collapsible behavior |
| `headless` | `boolean` | Remove default styling |
| `onChange` | `(detail: NavigationMenuChangeDetail) => void` | Full change detail callback |
| `onSelect` | `(selected: number) => void` | Selected index callback |

## Notes

- Compose `NavigationMenu` with your own buttons, links, or other interactive children.
