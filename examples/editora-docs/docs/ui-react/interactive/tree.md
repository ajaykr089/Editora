---
title: Tree
description: Hierarchical navigation and selection with nested expand/collapse items.
sidebar_label: Tree
---

# Tree

A hierarchical tree view for file explorers, navigation menus, and nested data structures. Supports keyboard navigation, roving focus, expand/collapse, and typeahead.

## Import

```tsx
// Subpath (recommended)
import { Tree } from '@editora/ui-react/Tree';

// Barrel
import { Tree } from '@editora/ui-react';
```

## Composition

| Component | Renders | Purpose |
|---|---|---|
| `Tree` | `<ui-tree>` | Root — manages selection and keyboard navigation |
| `Tree.Item` | `<ui-tree-item>` | Individual node — supports nesting, prefix/suffix slots |

## Basic Usage

```tsx
import { Tree } from '@editora/ui-react/Tree';

function FileExplorer() {
  const [value, setValue] = React.useState('button');

  return (
    <Tree
      value={value}
      onSelect={(detail) => setValue(detail.value)}
    >
      <Tree.Item value="src" label="src" expanded>
        <Tree.Item value="components" label="components" expanded>
          <Tree.Item value="button" label="button.tsx" />
          <Tree.Item value="dialog" label="dialog.tsx" />
        </Tree.Item>
      </Tree.Item>
      <Tree.Item value="docs" label="docs" expanded>
        <Tree.Item value="changelog" label="changelog.md" />
      </Tree.Item>
    </Tree>
  );
}
```

## Prefix and Suffix Slots

```tsx
<Tree>
  <Tree.Item
    value="alerts"
    label="Alerts"
    prefix={<span>🔔</span>}
    suffix={<span style={{ fontSize: 11, color: '#64748b' }}>3</span>}
  />
  <Tree.Item
    value="settings"
    label="Settings"
    prefix={<span>⚙️</span>}
  />
</Tree>
```

## Disabled Items

```tsx
<Tree value="active">
  <Tree.Item value="active" label="Active Node" />
  <Tree.Item value="locked" label="Locked Node" disabled />
</Tree>
```

## Controlled Expand/Collapse

```tsx
function ControlledTree() {
  const [selected, setSelected] = React.useState('');

  return (
    <Tree
      value={selected}
      onSelect={(detail) => setSelected(detail.value)}
      onExpandedChange={(detail) => console.log(detail.value, detail.expanded)}
    >
      <Tree.Item value="group-a" label="Group A" expanded>
        <Tree.Item value="item-1" label="Item 1" />
        <Tree.Item value="item-2" label="Item 2" />
      </Tree.Item>
      <Tree.Item value="group-b" label="Group B">
        <Tree.Item value="item-3" label="Item 3" />
      </Tree.Item>
    </Tree>
  );
}
```

## Tree Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled selected node value |
| `indentSize` | `string` | `'16px'` | CSS value for per-level indentation |
| `onSelect` | `(detail: TreeSelectDetail) => void` | — | Fires when a node is selected |
| `onExpandedChange` | `(detail: TreeExpandedChangeDetail) => void` | — | Fires when a node is expanded or collapsed |

## Tree.Item Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Unique identifier for this node (required) |
| `label` | `ReactNode` | — | Node label rendered in the `label` slot |
| `expanded` | `boolean` | `false` | Whether this node's children are visible |
| `selected` | `boolean` | `false` | Marks node as selected (managed by root) |
| `disabled` | `boolean` | `false` | Prevents interaction and dims the node |
| `prefix` | `ReactNode` | — | Content rendered before the label (icon, avatar, etc.) |
| `suffix` | `ReactNode` | — | Content rendered after the label (badge, count, etc.) |
| `children` | `ReactNode` | — | Nested `Tree.Item` nodes |

## Event Detail Types

```ts
type TreeSelectDetail = {
  value: string;
  label: string;
};

type TreeExpandedChangeDetail = {
  value: string;
  expanded: boolean;
};
```

## Keyboard Navigation

| Key | Action |
|---|---|
| `ArrowDown` | Move focus to next visible node |
| `ArrowUp` | Move focus to previous visible node |
| `ArrowRight` | Expand focused node (or move to first child if already expanded) |
| `ArrowLeft` | Collapse focused node (or move to parent if already collapsed) |
| `Home` | Move focus to first node |
| `End` | Move focus to last visible node |
| `Enter` / `Space` | Select focused node |
| Printable character | Typeahead — jump to next node starting with that character |
