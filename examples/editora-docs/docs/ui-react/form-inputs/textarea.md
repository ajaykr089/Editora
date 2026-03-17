---
title: Textarea
description: Multi-line text input with autosize, counter, validation, and composition slots.
sidebar_label: Textarea
---

# Textarea

A multi-line text input with autosize, character counter, debounced input, and clearable support. Uses a composed pattern — `Textarea.Label`, `Textarea.Description`, and `Textarea.Error` map to the web component's named slots.

## Import

```tsx
import { Textarea } from '@editora/ui-react';
// or subpath
import { Textarea } from '@editora/ui-react/Textarea';
```

## Basic Usage

```tsx
<Textarea
  placeholder="Write a release summary..."
  rows={4}
  onChange={(value) => console.log(value)}
/>
```

## With Label and Description

```tsx
<Textarea
  placeholder="Describe what changed and why..."
  rows={4}
>
  <Textarea.Label>Change reason</Textarea.Label>
  <Textarea.Description>Required for audit trails.</Textarea.Description>
</Textarea>
```

## With Error

```tsx
<Textarea validation="error" value="">
  <Textarea.Label>Change reason</Textarea.Label>
  <Textarea.Error>Please provide a reason before publishing.</Textarea.Error>
</Textarea>
```

## Controlled with Debounce

```tsx
const [value, setValue] = useState('');
const [debounced, setDebounced] = useState('');

<Textarea
  value={value}
  debounce={320}
  clearable
  rows={5}
  variant="soft"
  onInput={setValue}
  onDebouncedInput={setDebounced}
>
  <Textarea.Label>Release notes</Textarea.Label>
  <Textarea.Description>Debounced output updates after 320ms.</Textarea.Description>
</Textarea>
```

## Autosize with Counter

```tsx
<Textarea
  autosize
  maxRows={8}
  rows={3}
  showCount
  maxlength={600}
  variant="filled"
  tone="success"
  placeholder="Add operational context..."
>
  <Textarea.Label>Internal context</Textarea.Label>
  <Textarea.Description>Grows up to 8 rows automatically.</Textarea.Description>
</Textarea>
```

## Props

### Textarea (root)

| Prop               | Type                                                                      | Default      | Description                                              |
|--------------------|---------------------------------------------------------------------------|--------------|----------------------------------------------------------|
| `value`            | `string`                                                                  | —            | Controlled value                                         |
| `placeholder`      | `string`                                                                  | —            | Placeholder text                                         |
| `rows`             | `number`                                                                  | `4`          | Initial visible row count                                |
| `minlength`        | `number`                                                                  | —            | Minimum character length                                 |
| `maxlength`        | `number`                                                                  | —            | Maximum character length                                 |
| `clearable`        | `boolean`                                                                 | `false`      | Shows a clear button when field has value                |
| `showCount`        | `boolean`                                                                 | `false`      | Shows character count (and max if `maxlength` is set)    |
| `autosize`         | `boolean`                                                                 | `false`      | Grows height to fit content                              |
| `maxRows`          | `number`                                                                  | —            | Maximum rows when `autosize` is enabled                  |
| `debounce`         | `number`                                                                  | —            | Debounce delay in ms for `onDebouncedInput`              |
| `validation`       | `'error' \| 'success' \| 'none'`                                          | `'none'`     | Visual validation state                                  |
| `variant`          | `'classic' \| 'surface' \| 'soft' \| 'filled' \| 'ghost' \| 'contrast'`  | `'classic'`  | Visual style                                             |
| `size`             | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'`                              | `'md'`       | Field size                                               |
| `density`          | `'compact' \| 'default' \| 'comfortable'`                                 | `'default'`  | Vertical padding density                                 |
| `tone`             | `'brand' \| 'success' \| 'warning' \| 'danger'`                           | `'brand'`    | Accent color                                             |
| `resize`           | `'none' \| 'both' \| 'horizontal' \| 'vertical'`                          | `'vertical'` | CSS resize handle                                        |
| `radius`           | `'none' \| 'large' \| 'full' \| string`                                   | —            | Border radius override                                   |
| `disabled`         | `boolean`                                                                 | `false`      | Disables the field                                       |
| `readOnly`         | `boolean`                                                                 | `false`      | Makes the field read-only                                |
| `required`         | `boolean`                                                                 | `false`      | Marks field as required                                  |
| `autofocus`        | `boolean`                                                                 | `false`      | Focuses field on mount                                   |
| `name`             | `string`                                                                  | —            | Form field name                                          |
| `label`            | `string`                                                                  | —            | Shorthand label (alternative to `Textarea.Label`)        |
| `description`      | `string`                                                                  | —            | Shorthand description (alternative to `Textarea.Description`) |
| `headless`         | `boolean`                                                                 | `false`      | Hides meta and footer, renders bare field only           |
| `onChange`         | `(value: string) => void`                                                 | —            | Fires on committed change                                |
| `onInput`          | `(value: string) => void`                                                 | —            | Fires on every keystroke                                 |
| `onDebouncedInput` | `(value: string) => void`                                                 | —            | Fires after `debounce` ms of inactivity                  |
| `onClear`          | `() => void`                                                              | —            | Fires when clear button is clicked                       |

### Textarea.Label

| Prop       | Type                                | Description                        |
|------------|-------------------------------------|------------------------------------|
| `children` | `React.ReactNode`                   | Label text content                 |
| `...rest`  | `React.HTMLAttributes<HTMLElement>` | Passed to inner `<span>`           |

### Textarea.Description

| Prop       | Type                                | Description                        |
|------------|-------------------------------------|------------------------------------|
| `children` | `React.ReactNode`                   | Description text content           |
| `...rest`  | `React.HTMLAttributes<HTMLElement>` | Passed to inner `<span>`           |

### Textarea.Error

| Prop       | Type                                | Description                        |
|------------|-------------------------------------|------------------------------------|
| `children` | `React.ReactNode`                   | Error message content              |
| `...rest`  | `React.HTMLAttributes<HTMLElement>` | Passed to inner `<span>`           |

## Notes

- `label`/`description` string props and `Textarea.Label`/`Textarea.Description` sub-components are equivalent — use whichever fits your pattern.
- `autosize` grows the field height to fit content, capped at `maxRows` if provided.
- `showCount` displays character count; when combined with `maxlength` it shows `n / max` format.
- `debounce` only affects `onDebouncedInput` — `onInput` always fires immediately.
