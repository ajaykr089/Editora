---
title: Inline Edit
description: In-place editing control for compact surfaces.
sidebar_label: Inline Edit
---

# Inline Edit

```tsx
import { InlineEdit } from '@editora/ui-react';

<InlineEdit
  value="Quarterly release notes"
  placeholder="Add a title"
  onSave={(detail) => console.log(detail.value)}
  onCancel={(value) => console.log(value)}
/>;
```

## Key Props

`value`, `placeholder`, `editing`, `multiline`, `disabled`, `readOnly`, `name`, `onChange`, `onValueChange`, `onSave`, `onCancel`
