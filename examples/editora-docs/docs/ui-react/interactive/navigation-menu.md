---
title: Navigation Menu
description: Navigation primitive for tab-like app sections.
sidebar_label: Navigation Menu
---

# Navigation Menu

```tsx
import { NavigationMenu } from '@editora/ui-react';

<NavigationMenu selected={0} onSelect={(selected) => console.log(selected)}>
  <button>Overview</button>
  <button>Releases</button>
  <button>Analytics</button>
</NavigationMenu>;
```

## Key Props

`selected`, `orientation`, `activation`, `loop`, `collapsible`, `headless`, `onChange`, `onSelect`
