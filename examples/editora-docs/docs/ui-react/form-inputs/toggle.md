---
title: Toggle
description: Pressed-state toggle control with icon and tone support.
sidebar_label: Toggle
---

# Toggle

```tsx live
function ToggleDemo() {
  return (
    <ThemeProvider>
      <Toggle pressed value="bold" iconOn="format_bold" onChange={(detail) => console.log(detail.pressed)}>
        Bold
      </Toggle>
    </ThemeProvider>
  );
}
```

## Props

`pressed`, `disabled`, `loading`, `headless`, `size`, `variant`, `tone`, `shape`, `elevation`, `name`, `value`, `required`, `iconOn`, `iconOff`, `onInput`, `onChange`
