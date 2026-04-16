---
title: Radio
description: Interactive standalone radio control with same-name grouping and tone or density variants.
sidebar_label: Radio
---

# Radio

Use `Radio` for a single radio control or for custom radio sets where you want native-style same-name grouping without the higher-level `RadioGroup` options API.

## Import

```tsx
import { Radio } from '@editora/ui-react';
// or subpath
import { Radio } from '@editora/ui-react/Radio';
```

## Quick Example

```tsx
<Radio checked tone="success" onCheckedChange={(checked) => console.log(checked)}>
  Publish to subscribers
</Radio>
```

## Same-Name Grouping

```tsx
<>
  <Radio name="plan" value="starter">Starter</Radio>
  <Radio name="plan" value="pro" checked>Professional</Radio>
  <Radio name="plan" value="enterprise">Enterprise</Radio>
</>
```

## Key Props

| Prop | Type | Default |
|------|------|---------|
| `checked` | `boolean` | `false` |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |
| `name` | `string` | — |
| `value` | `string` | — |
| `density` | `'default' \| 'compact' \| 'comfortable'` | `'default'` |
| `tone` | `'brand' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'brand'` |
| `onCheckedChange` | `(checked: boolean, detail) => void` | — |

For the full props reference and event detail type, see [form-inputs/radio](../form-inputs/radio.md).
