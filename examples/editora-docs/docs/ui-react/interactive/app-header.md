---
title: AppHeader
description: Application header shell with composed React sub-components for product branding, workspace context, and action rails.
sidebar_label: AppHeader
---

# AppHeader

Import the main `AppHeader` component and use its sub-components as properties. `AppHeader` is a token-backed application shell for product branding, workspace titles, status context, and fast actions. It supports the same baseline visual model used across the newer surfaces in `ui-react`: `variant`, `tone`, `size`, `radius`, and `elevation`.

## Basic usage

```tsx
import { AppHeader, Button } from '@editora/ui-react';

function WorkspaceHeader() {
  return (
    <AppHeader bordered showMenuButton variant="surface" radius={12}>
      <AppHeader.Start>Acme Health</AppHeader.Start>
      <AppHeader.Center>Live monitoring</AppHeader.Center>
      <AppHeader.Title>Clinical Command Center</AppHeader.Title>
      <AppHeader.Subtitle>North campus · Shift A</AppHeader.Subtitle>
      <AppHeader.End>
        <Button size="sm" recipe="soft" variant="secondary">
          Search
        </Button>
      </AppHeader.End>
    </AppHeader>
  );
}
```

## Composed Sub-Components

All AppHeader sub-components are available as properties on the main AppHeader component:

- `AppHeader.Start` - Product branding and navigation
- `AppHeader.Center` - Workspace context and status
- `AppHeader.Title` - Primary workspace title
- `AppHeader.Subtitle` - Secondary context information
- `AppHeader.End` - Action buttons and controls

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sticky` | `boolean` | `false` | Makes the header sticky to the top of the scroll container. |
| `bordered` | `boolean` | `false` | Shows the shell border treatment. |
| `dense` | `boolean` | `false` | Compact alias for the small header size. |
| `headless` | `boolean` | `false` | Hides the visual shell while keeping the element mounted. |
| `showMenuButton` | `boolean` | `false` | Displays the built-in menu trigger button. |
| `variant` | `'surface' \| 'soft' \| 'outline' \| 'solid'` | `'surface'` | Controls the shell treatment. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Applies the accent/tone system. |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Controls overall header scale and title rhythm. |
| `radius` | `number \| string` | theme default | Corner radius. Use values like `0`, `12`, or `full`. |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Controls shell shadow depth. |
| `onMenuTrigger` | `() => void` | - | Called when the built-in menu button is pressed. |

## Variants

```tsx
<AppHeader variant="surface" />
<AppHeader variant="soft" tone="info" />
<AppHeader variant="outline" tone="warning" />
<AppHeader variant="solid" tone="success" />
```

## Size and radius

```tsx
<AppHeader size="sm" radius={8} />
<AppHeader size="md" radius={12} />
<AppHeader size="lg" radius={16} />
<AppHeader size="lg" radius="full" />
```

## Menu button workflow

```tsx
function ShellHeader() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <AppHeader
      showMenuButton
      bordered
      onMenuTrigger={() => setDrawerOpen(true)}
    >
      <AppHeader.Start>Editora Ops</AppHeader.Start>
      <AppHeader.Title>Operations Center</AppHeader.Title>
      <AppHeader.End>
        <Button size="sm" recipe="soft" variant="secondary">
          Search
        </Button>
      </AppHeader.End>
    </AppHeader>
  );
}
```

## Notes

- `dense` remains available for compatibility, but `size="sm"` is the clearer public API.
- `radius` follows the same pattern as `Button`, `Card`, and `Alert`.
- The built-in menu trigger only emits `onMenuTrigger`; navigation drawers and side sheets should still be managed by your app shell.
