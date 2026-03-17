---
title: Input
description: Single-line input wrapper with validation, clearable mode, debounce, character counter, and native form attributes.
sidebar_label: Input
---

# Input

```tsx
import { Input } from '@editora/ui-react';
```

## Composition Pattern

`Input` follows a composition pattern. Use `Input.Prefix`, `Input.Suffix`, and `Input.Error` as named sub-components to compose the field layout declaratively:

```tsx
<Input
  label="Email"
  type="email"
  placeholder="name@company.com"
  required
  clearable
  validation="error"
  onChange={(value) => console.log(value)}
>
  <Input.Prefix>✉️</Input.Prefix>
  <Input.Suffix>
    <button type="button">Verify</button>
  </Input.Suffix>
  <Input.Error>Enter a valid email address</Input.Error>
</Input>
```

### Sub-components

| Sub-component | Slot | Description |
|---|---|---|
| `Input.Prefix` | `prefix` | Content rendered on the left side of the input |
| `Input.Suffix` | `suffix` | Content rendered on the right side of the input |
| `Input.Error` | `error` | Error message shown when `validation="error"` |

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Controlled value |
| `onChange` | `(value: string) => void` | — | Fires on committed change |
| `onInput` | `(value: string) => void` | — | Fires on every keystroke |
| `onDebouncedInput` | `(value: string) => void` | — | Fires after `debounce` ms of inactivity |
| `onClear` | `() => void` | — | Fires when the clear button is clicked |
| `debounce` | `number` | — | Debounce delay in ms for `onDebouncedInput` |
| `clearable` | `boolean` | `false` | Shows a clear button when the field has a value |
| `validation` | `'error' \| 'success' \| 'none'` | `'none'` | Visual validation state |
| `counter` | `boolean` | `false` | Shows character count (requires `maxlength`) |
| `type` | `string` | `'text'` | Native input type (`email`, `password`, `number`, etc.) |
| `name` | `string` | — | Form field name |
| `required` | `boolean` | `false` | Marks field as required |
| `pattern` | `string` | — | Native validation pattern |
| `inputMode` | `string` | — | Virtual keyboard hint (`numeric`, `email`, etc.) |
| `autoComplete` | `string` | — | Browser autocomplete hint |
| `minlength` | `number` | — | Minimum character length |
| `maxlength` | `number` | — | Maximum character length |
| `min` | `string \| number` | — | Minimum value (for `type="number"`) |
| `max` | `string \| number` | — | Maximum value (for `type="number"`) |
| `step` | `string \| number` | — | Step increment (for `type="number"`) |
| `spellCheck` | `boolean` | — | Enable/disable browser spell check |
| `placeholder` | `string` | — | Placeholder text |
| `label` | `string` | — | Visible label rendered by the web component |
| `description` | `string` | — | Helper text below the field |
| `readOnly` | `boolean` | `false` | Makes the field read-only |
| `autofocus` | `boolean` | `false` | Focuses the field on mount |
| `disabled` | `boolean` | `false` | Disables the field |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Input size |
| `variant` | `'classic'` | Visual style |
| `tone` | `'default'` | Color tone |
| `density` | `'default' \| 'compact' \| 'comfortable'` | `'default'` | Vertical spacing |
| `shape` | `'default' \| 'square' \| 'soft'` | `'default'` | Border-radius preset |
| `radius` | `'none' \| 'large' \| 'full' \| string` | — | Custom border-radius override |
| `color` | `string` | — | Custom color token |
| `floatingLabel` | `boolean` | `false` | Animates label above the field on focus/fill |
| `headless` | `boolean` | `false` | Strips all default styles |

## Examples

### Search with prefix and debounce

```tsx
<Input
  placeholder="Search..."
  debounce={300}
  onDebouncedInput={(value) => fetchResults(value)}
>
  <Input.Prefix>🔍</Input.Prefix>
</Input>
```

### Character counter

```tsx
<Input label="Bio" maxlength={160} counter />
```

### Number input with constraints

```tsx
<Input type="number" min={0} max={100} step={5} label="Score" />
```

### Validation with error message

```tsx
<Input label="Username" validation="error">
  <Input.Error>Username is already taken</Input.Error>
</Input>
```

## Notes

- `Input.Error` is only visible when `validation="error"` is set on the root.
- `counter` requires `maxlength` to display the limit.
- `minlength` / `maxlength` and `autofocus` map directly to the underlying `<ui-input>` web component attributes.
