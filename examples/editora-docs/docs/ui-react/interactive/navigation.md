---
title: Navigation
description: Keyboard-navigable navigation with composed React sub-components built with NavigationMenu.
sidebar_label: Navigation
source_component: NavigationMenu
---

# Navigation

Import the main `NavigationMenu` component and use its sub-components as properties. Use `NavigationMenu` for product-level section navigation where a selected item reveals a matching content panel.

## Basic Usage

```tsx
import { NavigationMenu } from '@editora/ui-react';

function PrimaryNavigation() {
  return (
    <NavigationMenu.Root
      selected={0}
      orientation="horizontal"
      variant="soft"
      size="md"
      radius={12}
      elevation="low"
    >
      <NavigationMenu.List>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Overview</NavigationMenu.Trigger>
          <NavigationMenu.Content>Overview content</NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Analytics</NavigationMenu.Trigger>
          <NavigationMenu.Content>Analytics content</NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Reports</NavigationMenu.Trigger>
          <NavigationMenu.Content>Reports content</NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Indicator />
      <NavigationMenu.Viewport />
    </NavigationMenu.Root>
  );
}
```

## Composed Sub-Components

All NavigationMenu sub-components are available as properties on the main NavigationMenu component:

- `NavigationMenu.Root` - Root container for the navigation menu
- `NavigationMenu.List` - Container for navigation items
- `NavigationMenu.Item` - Individual navigation item
- `NavigationMenu.Trigger` - Trigger element for dropdown content
- `NavigationMenu.Content` - Content area for each navigation item
- `NavigationMenu.Indicator` - Visual indicator for selected item
- `NavigationMenu.Viewport` - Viewport for dropdown content

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
