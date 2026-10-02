---
title: Progress
description: Progress indicator for uploads, processing, and completion feedback.
sidebar_label: Progress
---

# Progress

```tsx live
function ProgressDemo() {
  return (
    <ThemeProvider>
      <Progress value={48} max={100} showLabel label="Upload progress" />
    </ThemeProvider>
  );
}
```

## Props

`value`, `buffer`, `max`, `min`, `indeterminate`, `striped`, `animated`, `showLabel`, `label`, `format`, `precision`, `size`, `variant`, `tone`, `shape`, `mode`, `onValueChange`, `onComplete`

## Notes

- The label flag is `showLabel`, not `showValue`.
