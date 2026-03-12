---
title: Layout
description: Slot-based application shell for header, sidebar, content, aside, and footer regions.
sidebar_label: Layout
---

# Layout

`Layout` is a shell wrapper around `ui-layout`. Use regular children with `slot="header" | "sidebar" | "content" | "aside" | "footer"`.

## Basic Usage

```tsx
import { Box, Button, Flex, Layout } from '@editora/ui-react';

function BasicLayout() {
  return (
    <Layout mode="dashboard" maxWidth="xl" sidebarWidth="280px" asideWidth="320px">
      <Flex slot="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>Workspace</strong>
        <Button>Primary action</Button>
      </Flex>

      <Box slot="sidebar">Navigation</Box>
      <Box slot="content">Main content</Box>
      <Box slot="aside">Context rail</Box>
      <Box slot="footer">Footer actions</Box>
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

## Slots

| Slot | Purpose |
|------|---------|
| `header` | Top app bar / workspace header |
| `sidebar` | Primary navigation or filters |
| `content` | Main content region |
| `aside` | Secondary rail for context or activity |
| `footer` | Footer controls |

## Split Workspace

```tsx
import { Box, Layout } from '@editora/ui-react';

function SplitWorkspace() {
  return (
    <Layout mode="split" maxWidth="xl" asideWidth="340px">
      <Box slot="header">Review workflow</Box>
      <Box slot="content">Document canvas</Box>
      <Box slot="aside">Review notes</Box>
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
      <Box slot="header">Operations</Box>
      <Box slot="sidebar">Navigation</Box>
      <Box slot="content">Primary dashboard</Box>
      <Box slot="aside">Activity</Box>
    </Layout>
  );
}
```

## Notes

- `Layout` is intended for app-shell composition, not resizable pane management.
- Use slots for structure and CSS custom properties for deeper visual customization.
