---
title: DirectionProvider
description: Set layout direction (LTR/RTL) for descendants in the component tree.
sidebar_label: DirectionProvider
---

# DirectionProvider

Use `DirectionProvider` to control text and layout direction for multilingual interfaces.

## Basic Usage

```tsx live
function Example() {
  return (
    <ThemeProvider>
      <DirectionProvider dir="rtl">Arabic content</DirectionProvider>
    </ThemeProvider>
  );
}
```
