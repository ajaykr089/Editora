---
title: NativeSelect
description: A styled native select: the platform picker, native forms and autofill, with the library field look.
sidebar_label: NativeSelect
---

# NativeSelect

:::info New in @editora/ui-react 0.7.0 and @editora/ui-core 0.7.0
:::

```tsx
import { NativeSelect } from '@editora/ui-react';

<NativeSelect>
  <select name="country" aria-label="Country" defaultValue="in">
    <option value="in">India</option>
    <option value="us">United States</option>
  </select>
</NativeSelect>
```

Use it when the platform's own picker is the better experience (the wheel on iOS, the sheet on Android), for long country or time-zone lists, and in plain HTML forms. The `<select>` stays in your markup, so `<form>`, `FormData`, `<label htmlFor>`, form libraries and autofill work on it directly. Use [Select](./select) when options need rich content, search or custom rendering.

| Prop | Values | Default |
| --- | --- | --- |
| `size` | `sm` `md` `lg` | `md` |
| `variant` | `outline` `soft` `ghost` | `outline` |
| `invalid` | sets `aria-invalid` on the select | `false` |
| `inline` | as wide as its content | `false` |

`disabled`, `required`, `multiple` and `:user-invalid` come from the `<select>` itself; a `multiple` select (or `size` above 1) shows its options inline without the chevron.

See the [API reference](../api/native-select).
