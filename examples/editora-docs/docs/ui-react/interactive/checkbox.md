---
title: Checkbox
description: Interactive checkbox wrapper for checked, indeterminate, invalid, and loading states.
sidebar_label: Checkbox
---

# Checkbox

Use `Checkbox` for binary selection. The React wrapper maps directly to `ui-checkbox`.

```tsx live
function Preferences() {
  return (
    <ThemeProvider>
      <Checkbox indeterminate preset="admin" onCheckedChange={(checked) => console.log(checked)}>
        Review required
      </Checkbox>
    </ThemeProvider>
  );
}
```

## Supported Props

`checked`, `disabled`, `indeterminate`, `loading`, `headless`, `invalid`, `density`, `preset`, `onCheckedChange`, `onChange`, `onInput`

## Notes

- Use children for the visible label content.
