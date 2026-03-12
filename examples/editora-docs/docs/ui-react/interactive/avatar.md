---
title: Avatar
description: Person or entity avatar with fallback and status options.
sidebar_label: Avatar
---

# Avatar

```tsx
import { Avatar } from '@editora/ui-react';

<Avatar
  src="https://example.com/avatar.png"
  alt="Asha Patel"
  shape="circle"
  status="online"
  badge="Admin"
  ring
  onAvatarError={(detail) => console.log(detail.src)}
/>;
```

## Key Props

`src`, `alt`, `initials`, `size`, `bg`, `color`, `radius`, `fontWeight`, `shape`, `tone`, `variant`, `status`, `state`, `badge`, `ring`, `interactive`, `disabled`, `loading`, `onAvatarLoad`, `onAvatarError`

## Notes

- When `src` fails, the component falls back to initials derived from `initials`, `alt`, or text children.
