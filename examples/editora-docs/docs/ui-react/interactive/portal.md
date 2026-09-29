---
title: Portal
description: Render content outside normal DOM hierarchy for overlays and popups.
sidebar_label: Portal
---

# Portal

The `Portal` component mounts content into a separate DOM container.

## Basic Usage

```tsx live
function Example() {
  return (
    <ThemeProvider>
      <Portal><div>Overlay content</div></Portal>
    </ThemeProvider>
  );
}
```
