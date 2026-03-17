---
title: Accordion
description: Disclosure group with composed React sub-components for container, item, trigger, and panel.
sidebar_label: Accordion
---

# Accordion

Import the main `Accordion` component and use its sub-components as properties.

## Basic Usage

```tsx
import { Accordion } from '@editora/ui-react';

function BasicAccordion() {
  return (
    <Accordion collapsible variant="outline" radius={12} size="md">
      <Accordion.Item description="What the product does" badge="Overview">
        <Accordion.Trigger>What is Editora?</Accordion.Trigger>
        <Accordion.Panel>
          Editora is a rich text editing system with a web-component core and React wrappers.
        </Accordion.Panel>
      </Accordion.Item>

      <Accordion.Item description="Architecture summary">
        <Accordion.Trigger>How does it work?</Accordion.Trigger>
        <Accordion.Panel>
          It composes `ui-core` custom elements behind `ui-react` wrappers.
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

## Accordion Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Allow multiple open items |
| `collapsible` | `boolean` | `false` | Allow all items to close |
| `open` | `number \| number[]` | - | Controlled open item indices |
| `variant` | `'surface' \| 'outline' \| 'soft' \| 'solid' \| 'ghost' \| 'glass'` | `'surface'` | Visual treatment |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Density and typography scale |
| `radius` | `number \| string` | theme radius | Corner radius; numbers are treated as pixels and `full` creates a pill shell |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Accent color family |
| `indicator` | `'line' \| 'none'` | `'line'` | Show or hide the left accent rail on open items |
| `shape` | `'default' \| 'square' \| 'pill'` | `'default'` | Container shape |
| `elevation` | `'default' \| 'none' \| 'low' \| 'high'` | `'default'` | Shadow depth |
| `onToggle` | `(open) => void` | - | Host `toggle` event bridge |
| `onChangeOpen` | `(open) => void` | - | Host `change` event bridge |

## Item Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable the item |
| `description` | `string` | - | Metadata displayed by the custom element |
| `badge` | `string` | - | Badge label displayed by the custom element |

## Trigger and Panel

- `Accordion.Trigger` renders a button with `data-ui-accordion-trigger`.
- `Accordion.Panel` renders a panel with `data-ui-accordion-panel`.

## Controlled Multiple Open State

```tsx
function ControlledAccordion() {
  const [open, setOpen] = React.useState<number | number[]>([0]);

  return (
    <Accordion multiple open={open} onToggle={setOpen} variant="soft" tone="info" radius={12}>
      <Accordion.Item>
        <Accordion.Trigger>Section one</Accordion.Trigger>
        <Accordion.Panel>First panel</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Trigger>Section two</Accordion.Trigger>
        <Accordion.Panel>Second panel</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
```

## Composed Sub-Components

All Accordion sub-components are available as properties on the main Accordion component:

- `Accordion.Item` - Individual accordion item container
- `Accordion.Trigger` - Button to toggle accordion item
- `Accordion.Panel` - Content panel for accordion item

## Notes

- `open` is index-based (`number | number[]`), not string-value based.
- `radius` is the primary corner-control prop. `shape` remains available for compatibility with older usage.
