---
title: "ButtonGroup"
description: "Joins related buttons, inputs and selects into one control."
sidebar_label: "ButtonGroup"
---

# ButtonGroup

:::info New in @editora/ui-react 0.7.0 and @editora/ui-core 0.7.0
:::

```tsx
import { Button, ButtonGroup } from '@editora/ui-react';

<ButtonGroup aria-label="Text alignment">
  <Button variant="outline">Left</Button>
  <Button variant="outline">Center</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>

<ButtonGroup size="sm">
  <Button>Save</Button>
  <Button>Save as…</Button>
</ButtonGroup>

<ButtonGroup orientation="vertical">
  <Button variant="secondary">Up</Button>
  <Button variant="secondary">Down</Button>
</ButtonGroup>
```

Children share borders and only the outer corners stay round; filled buttons get a hairline divider. A hovered or focused button is raised so its border and focus ring are fully visible. A nested `ButtonGroup` stays a separate cluster with a gap. Works with `Button`, `SplitButton`, `Input`, `Select`, `NativeSelect` and native buttons, inputs and selects.

| Prop | Values | Default |
| --- | --- | --- |
| `orientation` | `horizontal` `vertical` (buttons fill the width) | `horizontal` |
| `size` | passed to child buttons that set none | |
| `detached` | spaced buttons with their own corners | `false` |

## Accessibility

The host is a `role="group"`. Give it an `aria-label` when the buttons' purpose is not clear from their text. For a toolbar with arrow-key navigation use [Toolbar](./toolbar) instead (or set `role="toolbar"`, which also sets `aria-orientation`).

See the [API reference](../api/button-group).
