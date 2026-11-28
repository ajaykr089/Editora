---
title: "AccessibleIcon"
description: "Gives an icon-only control a name screen readers read, and hides the icon itself."
sidebar_label: "AccessibleIcon"
---

# AccessibleIcon

```tsx
import { AccessibleIcon } from '@editora/ui-react';

## Try it

```tsx live
function Example() {
  return (
    <ThemeProvider>
      <Button variant="secondary">
        <AccessibleIcon label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m4 4 8 8m0-8-8 8" /></svg>
        </AccessibleIcon>
      </Button>
    </ThemeProvider>
  );
}
```

<button type="button">
  <AccessibleIcon label="Close"><XIcon /></AccessibleIcon>
</button>
```

The icon is marked `aria-hidden` (an `<svg>` also gets `focusable="false"`), and `label` is rendered as visually hidden text, so the button is announced as "Close, button". Use it for icon-only controls; an icon next to visible text needs no label. It warns in the console when `label` is missing.

See the [API reference](../api/accessible-icon).
