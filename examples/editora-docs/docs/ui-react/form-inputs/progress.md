---
title: Progress
description: Progress indicator for uploads, processing, and completion feedback.
sidebar_label: Progress
---

# Progress

```tsx
import { Progress } from '@editora/ui-react';

<Progress value={48} max={100} showLabel label="Upload progress" />
```

## Props

`value`, `buffer`, `max`, `min`, `indeterminate`, `striped`, `animated`, `showLabel`, `label`, `format`, `precision`, `size`, `variant`, `tone`, `shape`, `mode`, `onValueChange`, `onComplete`

## Notes

- The label flag is `showLabel`, not `showValue`.
