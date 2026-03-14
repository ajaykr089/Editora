---
title: Avatar
description: Identity surface for people, teams, entities, and live presence states.
sidebar_label: Avatar
---

# Avatar

`Avatar` is a token-backed identity component for people, queues, and entities. It supports image and initials fallbacks, status indicators, badge counts, presence states, and the same baseline visual props used across the newer components.

## Basic usage

```tsx
import { Avatar } from '@editora/ui-react';

function UserAvatar() {
  return (
    <Avatar
      src="https://example.com/avatar.png"
      alt="Asha Patel"
      status="online"
      badge="2"
      variant="surface"
      radius="full"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | - | Image source. |
| `alt` | `string` | - | Accessible label and fallback source. |
| `initials` | `string` | - | Explicit initials fallback. |
| `size` | `number \| string \| 'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Avatar size. |
| `variant` | `'surface' \| 'soft' \| 'solid' \| 'outline'` | `'surface'` | Visual treatment. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Accent/tone treatment. |
| `radius` | `number \| string` | theme default | Corner radius. Use `full`, `12`, `8`, or `0`. |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Shadow depth. |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | - | Presence indicator. |
| `state` | `'idle' \| 'loading' \| 'error' \| 'success'` | `'idle'` | UI lifecycle state. |
| `badge` | `string` | - | Small badge count or label. |
| `ring` | `boolean` | `false` | Accent ring highlight. |
| `interactive` | `boolean` | `false` | Enables button-like interaction styling and keyboard activation. |
| `disabled` | `boolean` | `false` | Disables interaction. |
| `loading` | `'lazy' \| 'eager' \| boolean` | `'lazy'` | Native image loading hint. |
| `shape` | `'circle' \| 'rounded' \| 'square'` | - | Compatibility alias for non-default geometry. |
| `bg` | `string` | - | Custom background override. |
| `color` | `string` | - | Custom foreground override. |
| `fontWeight` | `number \| string` | - | Custom fallback text weight. |
| `onAvatarLoad` | `(detail) => void` | - | Fired when the image loads. |
| `onAvatarError` | `(detail) => void` | - | Fired when the image fails. |

## Variants

```tsx
<Avatar initials="EA" variant="surface" />
<Avatar initials="EA" variant="soft" tone="info" />
<Avatar initials="EA" variant="outline" tone="warning" />
<Avatar initials="EA" variant="solid" tone="success" />
```

## Size and radius

```tsx
<Avatar initials="EA" size="sm" radius={8} />
<Avatar initials="EA" size="md" radius={12} />
<Avatar initials="EA" size="lg" radius="full" />
```

## Presence and state

```tsx
<Avatar initials="EA" status="online" />
<Avatar initials="EA" status="busy" tone="danger" />
<Avatar initials="EA" state="loading" />
<Avatar initials="EA" state="error" tone="danger" />
```

## Interactive avatars

```tsx
<Avatar
  src="https://example.com/avatar.png"
  alt="Asha Patel"
  status="online"
  badge="3"
  interactive
  ring
  onClick={() => console.log('Avatar clicked')}
/>
```

## Notes

- When `src` fails, the component falls back to initials derived from `initials`, `alt`, or text children.
- `radius` is the primary public shape control. `shape` remains available for compatibility.
- `interactive` enables keyboard activation with `Enter` and `Space`.
