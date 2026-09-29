---
title: Checkbox
description: Boolean form control for checked, indeterminate, and loading states.
sidebar_label: Checkbox
---

# Checkbox

```tsx live
function CheckboxDemo() {
  return (
    <ThemeProvider>
      <Checkbox checked onCheckedChange={(checked) => console.log(checked)}>
        Email me product updates
      </Checkbox>
    </ThemeProvider>
  );
}
```

## Props

| Prop | Type |
|------|------|
| `checked` | `boolean` |
| `disabled` | `boolean` |
| `indeterminate` | `boolean` |
| `loading` | `boolean` |
| `headless` | `boolean` |
| `invalid` | `boolean` |
| `density` | `'default' \| 'compact' \| 'comfortable'` |
| `preset` | `'default' \| 'admin'` |
| `onCheckedChange` | `(checked: boolean, detail) => void` |
| `onChange` | `(event) => void` |
| `onInput` | `(event) => void` |

## Notes

- The wrapper uses children for label content.
