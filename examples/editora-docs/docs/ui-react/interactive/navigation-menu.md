---
title: Navigation Menu
description: Navigation primitive for tab-like app sections.
sidebar_label: Navigation Menu
---

# Navigation Menu

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

## Key Props

`selected`, `orientation`, `activation`, `variant`, `size`, `radius`, `elevation`, `tone`, `loop`, `collapsible`, `headless`, `onChange`, `onSelect`

## Compound Helpers

`NavigationMenu.Root`, `NavigationMenu.List`, `NavigationMenu.Item`, `NavigationMenu.Trigger`, `NavigationMenu.Link`, `NavigationMenu.Content`, `NavigationMenu.Indicator`, `NavigationMenu.Viewport`
