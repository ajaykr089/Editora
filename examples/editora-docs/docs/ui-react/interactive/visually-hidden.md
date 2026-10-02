---
title: VisuallyHidden
description: Keep content available to assistive tech while hiding it visually.
sidebar_label: VisuallyHidden
---

# VisuallyHidden

The `VisuallyHidden` component improves accessibility for icon-only or compact UIs.

## Basic Usage

```tsx live
function Example() {
  return (
    <ThemeProvider>
      <button type="button">
        <span aria-hidden="true">?</span>
        <VisuallyHidden>Open help</VisuallyHidden>
      </button>
    </ThemeProvider>
  );
}
```
