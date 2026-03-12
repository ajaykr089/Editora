---
title: Split Button
description: Primary action button with attached action menu.
sidebar_label: Split Button
---

# Split Button

```tsx
import { SplitButton } from '@editora/ui-react';

<SplitButton
  label="Publish"
  menuLabel="More publishing actions"
  variant="primary"
  items={[
    { value: 'schedule', label: 'Schedule publish', shortcut: '⌘K' },
    { value: 'archive', label: 'Archive draft', tone: 'danger' }
  ]}
  onPrimaryAction={() => console.log('primary')}
  onSelect={(detail) => console.log(detail.value)}
/>;
```

## Key Props

`label`, `menuLabel`, `menuHeading`, `menuDescription`, `variant`, `density`, `menuDensity`, `menuShape`, `disabled`, `items`, `onPrimaryAction`, `onSelect`
