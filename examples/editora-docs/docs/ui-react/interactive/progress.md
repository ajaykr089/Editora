---
title: Progress
description: Interactive progress wrapper for line, circle, and radial visualizations.
sidebar_label: Progress
---

# Progress

```tsx live
function ProgressDemo() {
  return (
    <ThemeProvider>
      <Progress value={72} buffer={86} striped animated variant="soft" tone="success" />
    </ThemeProvider>
  );
}
```

## Supported Props

`value`, `buffer`, `max`, `min`, `indeterminate`, `striped`, `animated`, `showLabel`, `label`, `format`, `precision`, `size`, `variant`, `tone`, `shape`, `mode`, `onValueChange`, `onComplete`
