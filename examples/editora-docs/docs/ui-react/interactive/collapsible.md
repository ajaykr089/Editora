---
title: Collapsible
description: Expandable/collapsible panel with header, caption, meta information, and rich content area.
sidebar_label: Collapsible
---

# Collapsible

Use `Collapsible` to create expandable panels with customizable headers, captions, meta information, and content areas. Perfect for grouping related information while keeping the interface clean.

```tsx
import { Collapsible, Badge } from '@editora/ui-react';

function Example() {
  return (
    <Collapsible open>
      <Collapsible.Header>Compliance Configuration</Collapsible.Header>
      <Collapsible.Caption>Security, auditing, and release governance</Collapsible.Caption>
      <Collapsible.Meta>
        <Badge tone="brand">Enterprise</Badge>
      </Collapsible.Meta>
      <Collapsible.Content>
        <div>1. Require reviewer approval for enterprise policy changes.</div>
        <div>2. Enforce audit trail retention for 365 days.</div>
        <div>3. Limit export scope for restricted patient records.</div>
      </Collapsible.Content>
    </Collapsible>
  );
}
```

## Props

### Collapsible (Root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | Whether the collapsible is initially expanded. |
| `headless` | `boolean` | `false` | Disables the header and toggle button rendering. |
| `disabled` | `boolean` | `false` | Disables toggling the collapsible. |
| `readOnly` | `boolean` | `false` | Prevents state changes via user interaction. |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | Workflow state styling. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size of the collapsible. |
| `variant` | `'default' \| 'subtle' \| 'outline' \| 'ghost'` | `'default'` | Visual style variant. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Accent tone. |
| `radius` | `number \| string \| 'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Corner radius. Numbers are treated as pixels and `full` creates a pill shape. |
| `iconPosition` | `'left' \| 'right'` | `'right'` | Position of the toggle icon. |
| `closeOnEscape` | `boolean` | `true` | Close the collapsible when Escape key is pressed. |
| `onToggle` | `(open: boolean) => void` | - | Fired when toggled. |
| `onChangeOpen` | `(open: boolean) => void` | - | Alias for `onToggle`. |
| `onToggleDetail` | `(detail) => void` | - | Fired with detailed toggle information. |
| `onChangeDetail` | `(detail) => void` | - | Alias for `onToggleDetail`. |

## Sub-components

### Collapsible.Header

The header/title of the collapsible. Typically contains the main label.

```tsx
<Collapsible.Header>
  <Flex align="center" style={{ gap: 8 }}>
    <ShieldIcon size={15} />
    Compliance Configuration
  </Flex>
</Collapsible.Header>
```

### Collapsible.Caption

Optional descriptive text shown below the header.

```tsx
<Collapsible.Caption>
  Security, auditing, and release governance
</Collapsible.Caption>
```

### Collapsible.Meta

Optional metadata, badges, or secondary information displayed in the header area.

```tsx
<Collapsible.Meta>
  <Badge tone="brand">Enterprise</Badge>
</Collapsible.Meta>
```

### Collapsible.Content

The main content area that expands/collapses.

```tsx
<Collapsible.Content>
  <Grid style={{ display: 'grid', gap: 8 }}>
    <Box>Item 1</Box>
    <Box>Item 2</Box>
  </Grid>
</Collapsible.Content>
```

## Examples

### Basic Collapsible

```tsx
<Collapsible>
  <Collapsible.Header>Section Title</Collapsible.Header>
  <Collapsible.Content>
    This is the expandable content.
  </Collapsible.Content>
</Collapsible>
```

### With Icons and Badges

```tsx
<Collapsible tone="info" variant="subtle">
  <Collapsible.Header>
    <Flex align="center" style={{ gap: 8 }}>
      <InfoIcon size={15} />
      Important Information
    </Flex>
  </Collapsible.Header>
  <Collapsible.Caption>Additional context about this section</Collapsible.Caption>
  <Collapsible.Meta>
    <Badge>New</Badge>
  </Collapsible.Meta>
  <Collapsible.Content>
    Content goes here...
  </Collapsible.Content>
</Collapsible>
```

### With State Feedback

```tsx
const [state, setState] = React.useState('idle');

<Collapsible
  state={state}
  tone={state === 'error' ? 'danger' : state === 'success' ? 'success' : 'neutral'}
  onToggleDetail={(detail) => {
    setState('loading');
    // perform async operation...
  }}
>
  <Collapsible.Header>Process Status</Collapsible.Header>
  <Collapsible.Caption>Monitor the current operation</Collapsible.Caption>
  <Collapsible.Content>
    Loading..., Error occurred, or Success message
  </Collapsible.Content>
</Collapsible>
```

## Variants

```tsx
<Collapsible variant="default">...</Collapsible>
<Collapsible variant="subtle">...</Collapsible>
<Collapsible variant="outline">...</Collapsible>
<Collapsible variant="ghost">...</Collapsible>
```

## Sizes

```tsx
<Collapsible size="sm">...</Collapsible>
<Collapsible size="md">...</Collapsible>
<Collapsible size="lg">...</Collapsible>
```

## Tones

```tsx
<Collapsible tone="neutral">...</Collapsible>
<Collapsible tone="info">...</Collapsible>
<Collapsible tone="success">...</Collapsible>
<Collapsible tone="warning">...</Collapsible>
<Collapsible tone="danger">...</Collapsible>
```

## Controlled State

```tsx
function ControlledCollapsible() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible open={open} onChangeOpen={setOpen}>
      <Collapsible.Header>Expandable Section</Collapsible.Header>
      <Collapsible.Content>
        This content expands and collapses based on the open state.
      </Collapsible.Content>
    </Collapsible>
  );
}
```
