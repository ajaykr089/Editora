---
title: Tags Input
description: Tokenized text entry for tags, emails, and labels.
sidebar_label: Tags Input
---

# Tags Input

```tsx
import { TagsInput } from '@editora/ui-react';

<TagsInput
  label="Topics"
  placeholder="Add a topic"
  maxTags={6}
  addOnBlur
  onChange={(value) => console.log(value)}
  onTagAdd={(detail) => console.log(detail.tag)}
/>;
```

## Key Props

`value`, `name`, `label`, `description`, `placeholder`, `required`, `disabled`, `readOnly`, `counter`, `maxTags`, `allowDuplicates`, `addOnBlur`, `onChange`, `onTagAdd`, `onTagRemove`
