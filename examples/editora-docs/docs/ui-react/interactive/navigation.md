---
title: Navigation
description: Keyboard-navigable navigation built with NavigationMenu.
sidebar_label: Navigation
source_component: NavigationMenu
---

# Navigation

Use `NavigationMenu` for product-level section navigation where a selected item reveals a matching content panel.

## Basic Usage

```tsx
import { NavigationMenu } from '@editora/ui-react';

function PrimaryNavigation() {
  return (
    <NavigationMenu
      selected={0}
      orientation="horizontal"
      variant="soft"
      size="md"
      radius={12}
      elevation="low"
    >
      <button slot="item">Overview</button>
      <button slot="item">Analytics</button>
      <button slot="item">Reports</button>

      <section slot="panel">Overview content</section>
      <section slot="panel">Analytics content</section>
      <section slot="panel">Reports content</section>
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
| `variant` | `'surface' \| 'soft' \| 'solid' \| 'outline' \| 'flat' \| 'contrast'` | Surface treatment |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | Control scale |
| `radius` | `number \| string` | Corner radius |
| `elevation` | `'none' \| 'low' \| 'high'` | Surface depth |
| `tone` | `'default' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | Accent tone |
| `loop` | `boolean` | Loop focus navigation |
| `collapsible` | `boolean` | Allow deselecting the active item |
| `headless` | `boolean` | Remove default visuals |
| `onChange` | `(detail: NavigationMenuChangeDetail) => void` | Full change detail callback |
| `onSelect` | `(selected: number) => void` | Selected index callback |

## Notes

- Compose `NavigationMenu` with your own buttons, links, or other interactive children in the `item` slot.
- Keep each `panel` slot aligned with its matching `item` by order.
