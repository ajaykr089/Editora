---
title: Combobox
description: Searchable select component with filtering, custom values, and async state management.
sidebar_label: Combobox
---

# Combobox

Use `Combobox` to provide a searchable alternative to traditional select dropdowns. Supports filtering, custom values, debounced inputs, and comprehensive state feedback.

```tsx
import { Combobox } from '@editora/ui-react';

function Example() {
  const [value, setValue] = React.useState('');

  return (
    <Combobox
      value={value}
      onChange={setValue}
      placeholder="Choose an option..."
      clearable
    >
      <Combobox.Option value="opt-1">Option 1</Combobox.Option>
      <Combobox.Option value="opt-2">Option 2</Combobox.Option>
      <Combobox.Option value="opt-3">Option 3</Combobox.Option>
    </Combobox>
  );
}
```

## Props

### Combobox (Root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | - | Currently selected value. |
| `open` | `boolean` | - | Whether the dropdown is open. |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | Workflow state for async operations. |
| `stateText` | `string` | - | Descriptive text for the current state. |
| `placeholder` | `string` | - | Placeholder text for the input. |
| `label` | `string` | - | Accessible label for the combobox. |
| `description` | `string` | - | Helper text below the label. |
| `emptyText` | `string` | - | Text shown when no options match the filter. |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Input size. |
| `variant` | `'classic' \| 'surface' \| 'soft'` | `'surface'` | Visual style variant. |
| `radius` | `'none' \| 'large' \| 'full' \| string` | - | Corner radius style. |
| `clearable` | `boolean` | `false` | Show clear button when value is set. |
| `disabled` | `boolean` | `false` | Disable the combobox. |
| `readOnly` | `boolean` | `false` | Prevent user interaction. |
| `required` | `boolean` | `false` | Mark as required. |
| `autofocus` | `boolean` | `false` | Auto-focus on mount. |
| `debounce` | `number` | - | Debounce delay (ms) for `onDebouncedInput`. |
| `validation` | `'error' \| 'success' \| 'none'` | `'none'` | Validation state styling. |
| `noFilter` | `boolean` | `false` | Disable client-side filtering. |
| `allowCustom` | `boolean` | `false` | Allow entering custom values not in options. |
| `onChange` | `(value: string) => void` | - | Fired when value changes. |
| `onInput` | `(query: string) => void` | - | Fired on input changes. |
| `onDebouncedInput` | `(query: string) => void` | - | Fired after debounce delay. |
| `onSelect` | `(value: string, label: string) => void` | - | Fired when option is selected. |
| `onOpen` | `() => void` | - | Fired when dropdown opens. |
| `onClose` | `() => void` | - | Fired when dropdown closes. |
| `onOpenDetail` | `(detail) => void` | - | Fired with open details. |
| `onCloseDetail` | `(detail) => void` | - | Fired with close details. |
| `onClear` | `() => void` | - | Fired when cleared. |

## Sub-components

### Combobox.Option

Represents a selectable option in the combobox.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | The option's value. |
| `description` | `string` | - | Optional description text shown below the label. |
| `children` | `ReactNode` | - | The display label for the option. |
| `disabled` | `boolean` | - | Disable this option. |

## Examples

### Basic Combobox

```tsx
<Combobox placeholder="Select an item...">
  <Combobox.Option value="apple">Apple</Combobox.Option>
  <Combobox.Option value="banana">Banana</Combobox.Option>
  <Combobox.Option value="cherry">Cherry</Combobox.Option>
</Combobox>
```

### With Descriptions

```tsx
<Combobox label="Select Team Member" placeholder="Search...">
  <Combobox.Option value="alice" description="Frontend Engineer">
    Alice Johnson
  </Combobox.Option>
  <Combobox.Option value="bob" description="Backend Engineer">
    Bob Smith
  </Combobox.Option>
  <Combobox.Option value="carol" description="Product Manager">
    Carol Williams
  </Combobox.Option>
</Combobox>
```

### Controlled State

```tsx
function ControlledCombobox() {
  const [value, setValue] = React.useState('');
  const [query, setQuery] = React.useState('');
  const [state, setState] = React.useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  return (
    <Combobox
      value={value}
      state={state}
      stateText={
        state === 'loading'
          ? 'Searching...'
          : state === 'error'
            ? 'Search failed'
            : state === 'success'
              ? 'Results loaded'
              : ''
      }
      onInput={(nextQuery) => {
        setQuery(nextQuery);
        setState('loading');
        // Simulate async search
        setTimeout(() => {
          setState(nextQuery.length > 2 ? 'success' : 'idle');
        }, 500);
      }}
      onChange={setValue}
      validation={state === 'error' ? 'error' : state === 'success' ? 'success' : 'none'}
    >
      <Combobox.Option value="opt1">Option 1</Combobox.Option>
      <Combobox.Option value="opt2">Option 2</Combobox.Option>
      <Combobox.Option value="opt3">Option 3</Combobox.Option>
    </Combobox>
  );
}
```

### With Custom Values

```tsx
<Combobox
  allowCustom
  label="Add New Tag"
  placeholder="Type to create custom tag..."
  description="Press Enter to add a custom value"
>
  <Combobox.Option value="urgent">Urgent</Combobox.Option>
  <Combobox.Option value="standard">Standard</Combobox.Option>
  <Combobox.Option value="low">Low Priority</Combobox.Option>
</Combobox>
```

### With Debounced Input

```tsx
<Combobox
  debounce={300}
  label="Search Organizations"
  placeholder="Type organization name..."
  onDebouncedInput={(query) => {
    // Perform async search after debounce
    console.log('Searching for:', query);
  }}
>
  <Combobox.Option value="acme">ACME Corp</Combobox.Option>
  <Combobox.Option value="globex">Globex Corporation</Combobox.Option>
</Combobox>
```

## Validation States

```tsx
{/* Success */}
<Combobox validation="success">...</Combobox>

{/* Error */}
<Combobox validation="error">...</Combobox>

{/* With State */}
<Combobox state="error" validation="error">...</Combobox>
<Combobox state="success" validation="success">...</Combobox>
```

## Sizing

```tsx
<Combobox size="sm">...</Combobox>
<Combobox size="md">...</Combobox>
<Combobox size="lg">...</Combobox>
```

## Variants

```tsx
<Combobox variant="classic">...</Combobox>
<Combobox variant="surface">...</Combobox>
<Combobox variant="soft">...</Combobox>
```
