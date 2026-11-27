---
title: "Spinner"
description: "Loading indicator that screen readers announce once, with sizes, tones and three shapes."
sidebar_label: "Spinner"
---

# Spinner

:::info New in @editora/ui-react 0.7.0 and @editora/ui-core 0.7.0
:::

`Spinner` shows that something is loading. It is a polite status: screen readers say its label ("Loading" unless you set `label`) when it appears.

```tsx
import { Spinner } from '@editora/ui-react';

<Spinner />
<Spinner size="lg" tone="brand" label="Loading invoices" />
<Spinner variant="dots" />
<Spinner variant="bars" size={28} />
```

Inside a control that already says it is busy (a button with `loading`, a region with `aria-busy`), mark it `decorative` so it is not announced twice:

```tsx
<Button disabled><Spinner decorative size="sm" /> Saving</Button>
```

## Props

| Prop | Values | Default |
| --- | --- | --- |
| `size` | `xs` `sm` `md` `lg` `xl`, or a length (a number is px) | `md` |
| `tone` | `current` `brand` `neutral` `success` `warning` `danger` | `current` (text colour) |
| `variant` | `ring` `dots` `bars` | `ring` |
| `speed` | `slow` `normal` `fast` | `normal` |
| `label` | text read by screen readers | `Loading` |
| `decorative` | hide from assistive technology | `false` |

## Accessibility

- The host is `role="status"` with real text, which every screen reader reads (some ignore `aria-label` on a status).
- Under `prefers-reduced-motion` the spinner pulses instead of rotating, so it still reads as busy.
- In forced-colors mode it uses system colours.

## Without React

```html
<script type="module">import '@editora/ui-core/spinner';</script>
<ui-spinner size="lg" label="Loading invoices"></ui-spinner>
```

See the [API reference](../api/spinner).
