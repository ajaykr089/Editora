---
title: Sidebar
description: App-shell navigation sidebar with selectable items and resize support.
sidebar_label: Sidebar
---

# Sidebar

```tsx
import { Sidebar } from '@editora/ui-react';

<Sidebar
  value="overview"
  collapsible
  resizable
  items={[
    { value: 'overview', label: 'Overview', icon: 'home' },
    { value: 'alerts', label: 'Alerts', badge: '12', tone: 'warning' }
  ]}
  onSelect={(detail) => console.log(detail.value)}
/>;
```

## Key Props

`collapsed`, `collapsible`, `rail`, `resizable`, `position`, `value`, `items`, `variant`, `size`, `density`, `tone`, `showIcons`, `showBadges`, `headless`, `width`, `minWidth`, `maxWidth`, `collapsedWidth`, `storageKey`, `autoSave`, `onSelect`, `onChange`, `onToggle`, `onCollapseChange`, `onWidthChange`
