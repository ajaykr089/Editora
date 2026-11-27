---
title: "InputGroup"
description: "One field frame around a text control and its addons: icons, units, buttons, keyboard hints, toolbars."
sidebar_label: "InputGroup"
---

# InputGroup

:::info New in @editora/ui-react 0.7.0 and @editora/ui-core 0.7.0
:::

```tsx
import { InputGroup, Kbd } from '@editora/ui-react';

<InputGroup>
  <SearchIcon slot="start" />
  <input type="search" aria-label="Search" placeholder="Search…" />
  <Kbd slot="end" keys={['⌘', 'K']} />
</InputGroup>

<InputGroup>
  <span slot="start">https://</span>
  <input aria-label="Website" placeholder="example.com" />
</InputGroup>

<InputGroup invalid>
  <input aria-label="Email" defaultValue="not-an-email" />
</InputGroup>
```

A chat composer: a textarea with a toolbar row under it.

```tsx
<InputGroup>
  <textarea aria-label="Message" placeholder="Ask anything…" />
  <div slot="bottom" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
    <Button size="sm" variant="ghost">Attach</Button>
    <Button size="sm">Send</Button>
  </div>
</InputGroup>
```

The group draws the border, background, hover and focus ring; the control inside (a native `input`, `textarea` or `select`, or `Input`, `Textarea`, `Select`) gives up its own frame. Addons go in `slot="start"` / `"end"` beside the control, or `"top"` / `"bottom"` as full-width rows. Clicking an addon that is not itself interactive focuses the control, as a `<label>` would.

| Prop | Values | Default |
| --- | --- | --- |
| `size` | `sm` `md` `lg` | `md` |
| `invalid` | red frame; sets `aria-invalid` on the control | `false` |
| `disabled` | disables the control | `false` |
| `borderlessRows` | no rule between the control and the top/bottom rows | `false` |

The group only undoes what it set: a control you disabled or marked invalid yourself stays that way.

See the [API reference](../api/input-group).
