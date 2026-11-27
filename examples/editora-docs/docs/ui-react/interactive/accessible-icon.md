---
title: AccessibleIcon
description: Gives an icon-only control a name screen readers read, and hides the icon itself.
sidebar_label: AccessibleIcon
---

# AccessibleIcon

:::info New in @editora/ui-react 0.7.0 and @editora/ui-core 0.7.0
:::

```tsx
import { AccessibleIcon } from '@editora/ui-react';

<button type="button">
  <AccessibleIcon label="Close"><XIcon /></AccessibleIcon>
</button>
```

The icon is marked `aria-hidden` (an `<svg>` also gets `focusable="false"`), and `label` is rendered as visually hidden text, so the button is announced as "Close, button". Use it for icon-only controls; an icon next to visible text needs no label. It warns in the console when `label` is missing.

See the [API reference](../api/accessible-icon).
