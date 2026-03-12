---
title: Accordion
description: Disclosure group with separate React exports for container, item, trigger, and panel.
sidebar_label: Accordion
---

# Accordion

Import `Accordion`, `AccordionItem`, `AccordionTrigger`, and `AccordionPanel` together.

## Basic Usage

```tsx
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '@editora/ui-react';

function BasicAccordion() {
  return (
    <Accordion collapsible variant="outline" radius={12} size="md">
      <AccordionItem description="What the product does" badge="Overview">
        <AccordionTrigger>What is Editora?</AccordionTrigger>
        <AccordionPanel>
          Editora is a rich text editing system with a web-component core and React wrappers.
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem description="Architecture summary">
        <AccordionTrigger>How does it work?</AccordionTrigger>
        <AccordionPanel>
          It composes `ui-core` custom elements behind `ui-react` wrappers.
        </AccordionPanel>
      </AccordionItem>
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

- `AccordionTrigger` renders a button with `data-ui-accordion-trigger`.
- `AccordionPanel` renders a panel with `data-ui-accordion-panel`.

## Controlled Multiple Open State

```tsx
function ControlledAccordion() {
  const [open, setOpen] = React.useState<number | number[]>([0]);

  return (
    <Accordion multiple open={open} onToggle={setOpen} variant="soft" tone="info" radius={12}>
      <AccordionItem>
        <AccordionTrigger>Section one</AccordionTrigger>
        <AccordionPanel>First panel</AccordionPanel>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>Section two</AccordionTrigger>
        <AccordionPanel>Second panel</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
```

## Notes

- `open` is index-based (`number | number[]`), not string-value based.
- `radius` is the primary corner-control prop. `shape` remains available for compatibility with older usage.
