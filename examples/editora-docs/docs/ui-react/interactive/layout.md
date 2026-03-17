---
title: Layout
description: Slot-based application shell with composed React sub-components for header, sidebar, content, aside, and footer regions.
sidebar_label: Layout
---

# Layout

Import the main `Layout` component and use its sub-components as properties. The Layout component provides a shell wrapper around `ui-layout` with a clean, hierarchical API.

## Basic Usage

```tsx
import { Box, Button, Flex, Layout } from '@editora/ui-react';

function BasicLayout() {
  return (
    <Layout mode="dashboard" maxWidth="xl" sidebarWidth="280px" asideWidth="320px">
      <Layout.Header>
        <Flex style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>Workspace</strong>
          <Button>Primary action</Button>
        </Flex>
      </Layout.Header>

      <Layout.Sidebar>Navigation</Layout.Sidebar>
      <Layout.Content>Main content</Layout.Content>
      <Layout.Aside>Context rail</Layout.Aside>
      <Layout.Footer>Footer actions</Layout.Footer>
    </Layout>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'dashboard' \| 'split' \| 'stack'` | `'dashboard'` | Shell layout mode |
| `variant` | `'default' \| 'flat' \| 'elevated' \| 'glass' \| 'contrast'` | `'default'` | Visual treatment |
| `density` | `'default' \| 'compact' \| 'comfortable'` | `'default'` | Spacing density |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl'` | - | Max-width token for the shell |
| `sidebarSide` | `'start' \| 'end'` | `'start'` | Sidebar placement in dashboard mode |
| `collapsed` | `boolean` | `false` | Collapse the sidebar rail |
| `headless` | `boolean` | `false` | Hide built-in shell chrome |
| `sidebarWidth` | `string` | - | CSS width for the sidebar track |
| `asideWidth` | `string` | - | CSS width for the aside track |
| `onLayoutChange` | `() => void` | - | Fired when the host emits `layoutchange` |
| `children` | `React.ReactNode` | - | Slotted shell content |

## Composed Sub-Components

All Layout sub-components are available as properties on the main Layout component:

- `Layout.Header` - Top app bar / workspace header
- `Layout.Sidebar` - Primary navigation or filters
- `Layout.Content` - Main content region
- `Layout.Aside` - Secondary rail for context or activity
- `Layout.Footer` - Footer controls

## Split Workspace

```tsx
import { Box, Layout } from '@editora/ui-react';

function SplitWorkspace() {
  return (
    <Layout mode="split" maxWidth="xl" asideWidth="340px">
      <Layout.Header>Review workflow</Layout.Header>
      <Layout.Content>Document canvas</Layout.Content>
      <Layout.Aside>Review notes</Layout.Aside>
    </Layout>
  );
}
```

## Collapsed Sidebar

```tsx
import { Box, Layout } from '@editora/ui-react';

function CollapsedShell() {
  return (
    <Layout collapsed sidebarWidth="260px" asideWidth="300px">
      <Layout.Header>Operations</Layout.Header>
      <Layout.Sidebar>Navigation</Layout.Sidebar>
      <Layout.Content>Primary dashboard</Layout.Content>
      <Layout.Aside>Activity</Layout.Aside>
    </Layout>
  );
}
```

## Notes

- `Layout` is intended for app-shell composition, not resizable pane management.
- Use slots for structure and CSS custom properties for deeper visual customization.
