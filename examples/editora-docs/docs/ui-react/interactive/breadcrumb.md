---
title: Breadcrumb
description: Hierarchical navigation trail with composed React sub-components, collapse logic, visual variants, and keyboard-friendly selection.
sidebar_label: Breadcrumb
---

# Breadcrumb

Import the main `Breadcrumb` component and use its sub-components as properties. Use `Breadcrumb` to show the current path through a workspace, settings flow, or deep document hierarchy.

## Basic Usage

```tsx
import { Breadcrumb } from '@editora/ui-react';

function Example() {
  return (
    <Breadcrumb
      ariaLabel="Release navigation"
      maxItems={5}
      currentIndex={3}
      variant="soft"
      tone="info"
      radius={12}
    >
      <Breadcrumb.Item label="Workspace" index={0}>Workspace</Breadcrumb.Item>
      <Breadcrumb.Item label="Programs" index={1}>Programs</Breadcrumb.Item>
      <Breadcrumb.Item label="Spring release" index={2}>Spring release</Breadcrumb.Item>
      <Breadcrumb.Item label="Audit logs" index={3}>Audit logs</Breadcrumb.Item>
    </Breadcrumb>
  );
}
```

## Composed Sub-Components

All Breadcrumb sub-components are available as properties on the main Breadcrumb component:

- `Breadcrumb.Item` - Individual breadcrumb item with optional links and labels

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `separator` | `string` | `'/'` | Separator shown between breadcrumb items. |
| `maxItems` | `number` | all items | Maximum visible items before collapsing the middle of the trail. |
| `currentIndex` | `number` | last item | Explicitly marks the current breadcrumb item. |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Density and text scale. `1/2/3` map to `sm/md/lg`. |
| `variant` | `'default' \| 'surface' \| 'soft' \| 'solid' \| 'outline' \| 'ghost' \| 'minimal'` | `'surface'` | Visual recipe for the crumb shell. |
| `radius` | `number \| string` | theme radius | Corner radius. Numbers are treated as pixels and `full` creates a pill shape. |
| `elevation` | `'default' \| 'none' \| 'low' \| 'high'` | `'none'` | Shadow depth for breadcrumb items. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Accent tone used for active and highlighted items. |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | Workflow state styling. |
| `disabled` | `boolean` | `false` | Disables selection for the whole breadcrumb. |
| `ariaLabel` | `string` | `'Breadcrumb'` | Accessible label for the navigation landmark. |
| `onSelect` | `(detail) => void` | - | Fired when a breadcrumb item is selected. |

## Variants

```tsx
<Breadcrumb variant="surface" tone="neutral">
  <Breadcrumb.Item label="Home" index={0}>Home</Breadcrumb.Item>
  <Breadcrumb.Item label="Products" index={1}>Products</Breadcrumb.Item>
</Breadcrumb>

<Breadcrumb variant="soft" tone="info">
  <Breadcrumb.Item label="Home" index={0}>Home</Breadcrumb.Item>
  <Breadcrumb.Item label="Products" index={1}>Products</Breadcrumb.Item>
</Breadcrumb>

<Breadcrumb variant="solid" tone="success" elevation="low">
  <Breadcrumb.Item label="Home" index={0}>Home</Breadcrumb.Item>
  <Breadcrumb.Item label="Products" index={1}>Products</Breadcrumb.Item>
</Breadcrumb>

<Breadcrumb variant="outline" tone="warning">
  <Breadcrumb.Item label="Home" index={0}>Home</Breadcrumb.Item>
  <Breadcrumb.Item label="Products" index={1}>Products</Breadcrumb.Item>
</Breadcrumb>

<Breadcrumb variant="ghost" tone="danger">
  <Breadcrumb.Item label="Home" index={0}>Home</Breadcrumb.Item>
  <Breadcrumb.Item label="Products" index={1}>Products</Breadcrumb.Item>
</Breadcrumb>

<Breadcrumb variant="minimal" tone="neutral">
  <Breadcrumb.Item label="Home" index={0}>Home</Breadcrumb.Item>
  <Breadcrumb.Item label="Products" index={1}>Products</Breadcrumb.Item>
</Breadcrumb>
```

## Selection

`onSelect` receives the selected index, label, optional `href`, and the interaction source:

```tsx
<Breadcrumb
  onSelect={(detail) => {
    console.log(detail.index, detail.label, detail.source);
  }}
>
  <Breadcrumb.Item label="Workspace" index={0}>Workspace</Breadcrumb.Item>
  <Breadcrumb.Item label="Programs" index={1}>Programs</Breadcrumb.Item>
  <Breadcrumb.Item label="Audit logs" index={2}>Audit logs</Breadcrumb.Item>
</Breadcrumb>
```
