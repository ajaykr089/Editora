---
title: "DataList"
description: "Label and value pairs (record details, order summaries, metadata) as a native description list."
sidebar_label: "DataList"
---

# DataList

`DataList` shows label and value pairs: the details panel of a record, an order summary, metadata. It renders a native description list (`dl`, `dt`, `dd`), which screen readers announce as terms and their descriptions.

```tsx
import { Badge, Button, DataList } from '@editora/ui-react';

<DataList>
  <DataList.Item>
    <DataList.Label>Status</DataList.Label>
    <DataList.Value><Badge tone="success">Authorized</Badge></DataList.Value>
  </DataList.Item>
  <DataList.Item>
    <DataList.Label>ID</DataList.Label>
    <DataList.Value>
      <code>u_2J89JSA4GJ</code>
      <Button size="sm" variant="ghost">Copy</Button>
    </DataList.Value>
  </DataList.Item>
</DataList>
```

For plain text, pass `items`:

```tsx
<DataList divided items={[{ label: 'Plan', value: 'Pro' }, { label: 'Seats', value: '12 of 20' }]} />
```

| Prop | Values | Default |
| --- | --- | --- |
| `orientation` | `horizontal` (label beside value) `vertical` (label above) | `horizontal` |
| `size` | `sm` `md` `lg` | `md` |
| `labelWidth` | width of the label column, a CSS length (a number is px) | `10rem` |
| `divided` | a rule between rows | `false` |
| `align` | `baseline` `start` `center`: the label against a tall value | `baseline` |
| `items` | `{ label, value }[]` instead of children | |

A horizontal list stacks label above value when it is narrower than 30rem (a container query, so it follows the space it has, not the window).

## Without React

```html
<script type="module">import '@editora/ui-core/data-list';</script>
<ui-data-list divided>
  <dl>
    <div><dt>Status</dt><dd>Active</dd></div>
  </dl>
</ui-data-list>
```

Theme it with `--ui-data-list-label-width`, `--ui-data-list-gap`, `--ui-data-list-label`, `--ui-data-list-value` and `--ui-data-list-rule`.

See the [API reference](../api/data-list).
