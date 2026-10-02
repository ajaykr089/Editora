---
title: Range Slider
description: Range selection is handled by Slider with range mode.
sidebar_label: Range Slider
source_component: Slider
---

# Range Slider

Range slider in `ui-react` is documented through the `Slider` component with `range`, `valueStart`, and `valueEnd`.

## Basic Usage

```tsx live
function BudgetRange() {
  return (
    <ThemeProvider>
      <Slider
        range
        min={0}
        max={1000}
        step={25}
        valueStart={150}
        valueEnd={650}
        format="range"
        label="Budget range"
      />
    </ThemeProvider>
  );
}
```

## Notes

- Range mode is part of `Slider`; there is no standalone `RangeSlider` export.
- Use `nameStart` and `nameEnd` when you need form names for both handles.
