---
title: Toolbar
description: Focus-managed toolbar layout for dense controls.
sidebar_label: Toolbar
---

# Toolbar

```tsx live
function ToolbarDemo() {
  return (
    <ThemeProvider>
      <Toolbar variant="soft" density="compact">
        <button>Undo</button>
        <button>Redo</button>
        <button>Publish</button>
      </Toolbar>
    </ThemeProvider>
  );
}
```

## Key Props

`orientation`, `variant`, `size`, `density`, `wrap`, `loop`, `headless`
