---
title: Autocomplete
description: Searchable single-select input built with the Combobox wrapper.
sidebar_label: Autocomplete
source_component: Combobox
---

# Autocomplete

Autocomplete in `ui-react` is documented through the `Combobox` component surface.

## Use Combobox

```tsx
import { Combobox } from '@editora/ui-react';

function AutocompleteField() {
  return (
    <Combobox
      label="Assignee"
      placeholder="Search people"
      clearable
      emptyText="No matching people"
      onInput={(query) => console.log('query', query)}
      onSelect={(value, label) => console.log(value, label)}
    >
      <option value="ava">Ava Johnson</option>
      <option value="liam">Liam Carter</option>
      <option value="mia">Mia Chen</option>
    </Combobox>
  );
}
```

## Combobox Props Used For Autocomplete

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Selected value |
| `open` | `boolean` | Controlled open state |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | Async/search state |
| `stateText` | `string` | State label |
| `clearable` | `boolean` | Show clear affordance |
| `debounce` | `number` | Debounced query delay |
| `validation` | `'error' \| 'success' \| 'none'` | Validation state |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | Size token |
| `maxlength` | `number` | Max query length |
| `readOnly` | `boolean` | Read-only mode |
| `autofocus` | `boolean` | Autofocus |
| `disabled` | `boolean` | Disabled state |
| `name` | `string` | Form field name |
| `required` | `boolean` | Required flag |
| `placeholder` | `string` | Input placeholder |
| `variant` | `'classic' \| 'surface' \| 'soft'` | Visual variant |
| `radius` | `'none' \| 'large' \| 'full' \| string` | Radius token |
| `label` | `string` | Visible label |
| `description` | `string` | Helper text |
| `emptyText` | `string` | Empty-state label |
| `noFilter` | `boolean` | Disable built-in filtering |
| `allowCustom` | `boolean` | Allow custom values |

## Notes

- Use `Combobox` for autocomplete behavior in `ui-react`.
