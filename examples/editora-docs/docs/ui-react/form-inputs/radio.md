---
title: Radio
description: Standalone radio input for single-choice controls, same-name grouping, and keyboard navigation.
sidebar_label: Radio
---

# Radio

Use `Radio` when you need a standalone radio input or when you want to compose your own same-name radio set without the higher-level `RadioGroup` options API.

## Import

```tsx
import { Radio } from '@editora/ui-react';
// or subpath
import { Radio } from '@editora/ui-react/Radio';
```

## Basic Usage

```tsx
<Radio checked onCheckedChange={(checked) => console.log(checked)}>
  Email notifications
</Radio>
```

## Grouping With Shared Name

Radios that share the same `name` behave like a native radio set. Selecting one unchecks the others, and arrow keys move between enabled siblings.

```tsx
function BillingCycle() {
  const [value, setValue] = useState('monthly');

  return (
    <>
      <Radio
        name="billing-cycle"
        value="weekly"
        checked={value === 'weekly'}
        onCheckedChange={(checked) => checked && setValue('weekly')}
      >
        Weekly
      </Radio>
      <Radio
        name="billing-cycle"
        value="monthly"
        checked={value === 'monthly'}
        onCheckedChange={(checked) => checked && setValue('monthly')}
      >
        Monthly
      </Radio>
      <Radio
        name="billing-cycle"
        value="yearly"
        checked={value === 'yearly'}
        onCheckedChange={(checked) => checked && setValue('yearly')}
      >
        Yearly
      </Radio>
    </>
  );
}
```

## Visual Variants

```tsx
<Radio density="compact">Compact</Radio>
<Radio checked>Default</Radio>
<Radio density="comfortable" tone="info">Comfortable info</Radio>
<Radio checked tone="success">Success</Radio>
<Radio invalid>Invalid</Radio>
<Radio loading>Loading</Radio>
<Radio disabled>Disabled</Radio>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Controlled checked state |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Shows spinner and disables interaction |
| `invalid` | `boolean` | `false` | Marks the control invalid |
| `required` | `boolean` | `false` | Marks the radio as required |
| `headless` | `boolean` | `false` | Hides the visual control and leaves label content only |
| `name` | `string` | — | Same-name radios become a native-style group |
| `value` | `string` | — | Value included in event detail |
| `density` | `'default' \| 'compact' \| 'comfortable'` | `'default'` | Control density |
| `tone` | `'brand' \| 'neutral' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'brand'` | Accent tone |
| `onCheckedChange` | `(checked: boolean, detail) => void` | — | Fires when the radio becomes checked |
| `onChange` | `(event) => void` | — | Raw custom event bridge |
| `onInput` | `(event) => void` | — | Raw custom event bridge |

## Event Detail

```ts
type RadioChangeDetail = {
  checked: boolean;
  value?: string;
  name?: string;
  reason?: 'click' | 'keyboard';
};
```

## Notes

- Use `Radio` for standalone inputs and lightweight custom radio rows.
- Use [Radio Group](./radio-group) when you want a data-driven group with `options`, layout, and variant styling built in.
