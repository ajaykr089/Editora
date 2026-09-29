---
title: Icon
description: Render system icons with size, color, and accessibility support.
sidebar_label: Icon
---

# Icon

The `Icon` component provides a consistent wrapper for icon rendering.

## Basic Usage

```tsx live
function Example() {
  return (
    <ThemeProvider>
      <Icon name="check" aria-label="Success" />
    </ThemeProvider>
  );
}
```
