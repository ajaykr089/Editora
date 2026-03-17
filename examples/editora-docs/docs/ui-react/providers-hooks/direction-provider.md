---
title: DirectionProvider
description: Set layout direction (LTR/RTL) for descendants in the component tree.
sidebar_label: DirectionProvider
---

# DirectionProvider

Use `DirectionProvider` to control text and layout direction for multilingual interfaces.

## Basic Usage

```tsx
import { DirectionProvider } from '@editora/ui-react';

export function Example() {
  return <DirectionProvider dir="rtl">Arabic content</DirectionProvider>;
}
```
