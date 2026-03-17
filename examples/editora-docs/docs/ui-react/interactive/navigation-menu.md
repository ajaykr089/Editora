---
title: Navigation Menu
description: Navigation primitive with composed React sub-components for tab-like app sections.
sidebar_label: Navigation Menu
---

# Navigation Menu

Import the main `NavigationMenu` component and use its sub-components as properties. The `NavigationMenu` component provides a navigation primitive for tab-like app sections.

## Basic Usage

```tsx
import { NavigationMenu } from '@editora/ui-react';

<NavigationMenu.Root
  selected={0}
  variant="soft"
  size="md"
  radius={12}
  onSelect={(selected) => console.log(selected)}
>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Overview</NavigationMenu.Trigger>
      <NavigationMenu.Content>Overview content</NavigationMenu.Content>
    </NavigationMenu.Item>

    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Releases</NavigationMenu.Trigger>
      <NavigationMenu.Content>Releases content</NavigationMenu.Content>
    </NavigationMenu.Item>

    <NavigationMenu.Item>
      <NavigationMenu.Link href="/analytics">Analytics</NavigationMenu.Link>
      <NavigationMenu.Content>Analytics content</NavigationMenu.Content>
    </NavigationMenu.Item>
  </NavigationMenu.List>

  <NavigationMenu.Indicator />
  <NavigationMenu.Viewport />
</NavigationMenu.Root>;
```

## Composed Sub-Components

All NavigationMenu sub-components are available as properties on the main NavigationMenu component:

- `NavigationMenu.Root` - Root container for the navigation menu
- `NavigationMenu.List` - Container for navigation items
- `NavigationMenu.Item` - Individual navigation item
- `NavigationMenu.Trigger` - Trigger element for dropdown content
- `NavigationMenu.Link` - Link element for navigation
- `NavigationMenu.Content` - Content area for each navigation item
- `NavigationMenu.Indicator` - Visual indicator for selected item
- `NavigationMenu.Viewport` - Viewport for dropdown content

## Key Props

`selected`, `orientation`, `activation`, `variant`, `size`, `radius`, `elevation`, `tone`, `loop`, `collapsible`, `headless`, `onChange`, `onSelect`
