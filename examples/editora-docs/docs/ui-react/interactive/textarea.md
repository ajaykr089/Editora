---
title: Textarea
description: Interactive textarea wrapper with autosize, counter, and composition slots.
sidebar_label: Textarea
---

# Textarea

A multi-line text input with autosize, character counter, debounced input, and clearable support.

## Import

```tsx
import { Textarea } from '@editora/ui-react';
// or subpath
import { Textarea } from '@editora/ui-react/Textarea';
```

## Quick Example

```tsx
<Textarea
  autosize
  maxRows={8}
  showCount
  maxlength={280}
  variant="soft"
  onInput={(value) => console.log(value)}
>
  <Textarea.Label>Notes</Textarea.Label>
  <Textarea.Description>Grows up to 8 rows automatically.</Textarea.Description>
</Textarea>
```

## Composition

| Sub-component          | Slot          | Description                          |
|------------------------|---------------|--------------------------------------|
| `Textarea.Label`       | `label`       | Label text above the field           |
| `Textarea.Description` | `description` | Helper text below the label          |
| `Textarea.Error`       | `error`       | Error message shown in the footer    |

## Key Props

| Prop               | Type                                                                     | Default      |
|--------------------|--------------------------------------------------------------------------|--------------|
| `value`            | `string`                                                                 | —            |
| `rows`             | `number`                                                                 | `4`          |
| `autosize`         | `boolean`                                                                | `false`      |
| `maxRows`          | `number`                                                                 | —            |
| `showCount`        | `boolean`                                                                | `false`      |
| `maxlength`        | `number`                                                                 | —            |
| `clearable`        | `boolean`                                                                | `false`      |
| `debounce`         | `number`                                                                 | —            |
| `validation`       | `'error' \| 'success' \| 'none'`                                         | `'none'`     |
| `variant`          | `'classic' \| 'surface' \| 'soft' \| 'filled' \| 'ghost' \| 'contrast'` | `'classic'`  |
| `onChange`         | `(value: string) => void`                                                | —            |
| `onInput`          | `(value: string) => void`                                                | —            |
| `onDebouncedInput` | `(value: string) => void`                                                | —            |

For the full props reference and all examples see [form-inputs/textarea](../form-inputs/textarea.md).
