---
title: Navigation Menu
description: Navigation primitive with composed React sub-components for tab-like app sections.
sidebar_label: Navigation Menu
---

# Navigation Menu

Import the main `NavigationMenu` component and use its sub-components as properties. The `NavigationMenu` component provides a navigation primitive for tab-like app sections.

## Basic Usage

```tsx live
function NavigationMenuDemo() {
  return (
    <ThemeProvider>
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
            <NavigationMenu.Link href="#analytics">Analytics</NavigationMenu.Link>
            <NavigationMenu.Content>Analytics content</NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.Indicator />
        <NavigationMenu.Viewport />
      </NavigationMenu.Root>
    </ThemeProvider>
  );
}
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

## Your own element (`asChild`)

`NavigationMenu.Link` renders its single child instead of its own element when you pass `asChild`. The part's props are merged into the child's: class names are joined, styles merged, both event handlers run (the child's first) and both refs receive the element.

```tsx
import Link from 'next/link';

<NavigationMenu>
  <NavigationMenu.Item>
    <NavigationMenu.Link asChild>
      <Link href="/blog">Blog</Link>
    </NavigationMenu.Link>
  </NavigationMenu.Item>
</NavigationMenu>
```

Use this for client-side routing (Next.js, React Router, TanStack Router): the router's link renders the `<a>`, with the menu's item slot on it. `NavigationMenu.Trigger` takes `asChild` too; your element then brings its own content, so add a caret if you want one.
