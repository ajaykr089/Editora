---
title: Marquee
description: Infinite scrolling rail for text, cards, images, and vertical activity feeds with React-friendly props.
sidebar_label: Marquee
---

# Marquee

`Marquee` is a production-ready infinite scrolling rail for status tickers, mixed media shelves, announcement strips, and vertical operations feeds. It wraps the `ui-marquee` custom element from `@editora/ui-core` and maps its design-system attributes into React props.

## Import

```tsx
import { Marquee } from '@editora/ui-react';
// or subpath
import { Marquee } from '@editora/ui-react/Marquee';
```

## Basic Usage

```tsx
<Marquee speed={72} gap={20} pauseOnHover fade>
  <Marquee.Item>Realtime collaboration synced</Marquee.Item>
  <Marquee.Item>Release train ready for sign-off</Marquee.Item>
  <Marquee.Item>ICU occupancy crossed 85%</Marquee.Item>
</Marquee>
```

## Mixed Content

Use `Marquee.Item` to keep text, cards, media, or richer content visually aligned inside the rail.

```tsx
<Marquee variant="glass" tone="info" size="lg" gap={24} speed={58} fade pauseOnHover>
  <Marquee.Item>
    <Card variant="surface" size="sm" radius={18}>
      <Card.Title as="div">Analytics snapshot</Card.Title>
      <Card.Description as="div">
        Executive dashboard clip prepared for leadership review.
      </Card.Description>
    </Card>
  </Marquee.Item>

  <Marquee.Item>
    <img src="/launch-poster.png" alt="Launch poster" />
  </Marquee.Item>

  <Marquee.Item>
    <video src="/preview.mp4" muted autoPlay loop playsInline />
  </Marquee.Item>
</Marquee>
```

## Vertical Feed

```tsx
<Marquee
  direction="up"
  variant="contrast"
  tone="info"
  speed={42}
  gap={16}
  fade
  style={{ blockSize: 360 }}
>
  <Marquee.Item>
    <strong>Deployment 4.2.1</strong>
    <span>Canary rollout reached 60% of premium traffic.</span>
  </Marquee.Item>
  <Marquee.Item>
    <strong>Policy drift check</strong>
    <span>Two workspaces still need the updated retention package.</span>
  </Marquee.Item>
</Marquee>
```

## Imperative API

Forward a ref to access the underlying custom-element methods.

```tsx
const ref = React.useRef<HTMLElement & { pause(): void; play(): void; refresh(): void }>(null);

<>
  <button onClick={() => ref.current?.pause()}>Pause</button>
  <button onClick={() => ref.current?.play()}>Play</button>
  <button onClick={() => ref.current?.refresh()}>Refresh</button>

  <Marquee ref={ref}>
    <Marquee.Item>Status rail</Marquee.Item>
    <Marquee.Item>Release notes</Marquee.Item>
  </Marquee>
</>
```

## Props

### Marquee (root)

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `'left' \| 'right' \| 'up' \| 'down'` | `'left'` | Scroll direction |
| `speed` | `number \| string` | `60` | Pixels per second for the loop speed |
| `gap` | `number \| string` | `24` | Gap between items |
| `paused` | `boolean` | `false` | Pauses animation |
| `pauseOnHover` | `boolean` | `false` | Pauses on hover |
| `pauseOnFocus` | `boolean` | `false` | Pauses when focus enters the marquee |
| `fade` | `boolean` | `false` | Adds edge fading to the viewport |
| `fadeSize` | `number \| string` | `48` | Fade mask size |
| `variant` | `'default' \| 'surface' \| 'soft' \| 'solid' \| 'glass' \| 'contrast' \| 'minimal'` | `'default'` | Surface styling |
| `tone` | `'brand' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Accent tone |
| `size` | `'sm' \| 'md' \| 'lg' \| '1' \| '2' \| '3'` | `'md'` | Rail spacing and item scale |
| `radius` | `number \| string` | — | Shell radius override |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Surface shadow depth |
| `padding` | `number \| string` | — | Shell padding override |

### Marquee.Item

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `keyof JSX.IntrinsicElements` | `'div'` | Render tag for the item wrapper |
| `children` | `React.ReactNode` | — | Item content |
| `...rest` | `React.HTMLAttributes<HTMLElement>` | — | Passed through to the wrapper element |

## Notes

- `Marquee.Item` is recommended for consistent spacing and visual treatment, especially with rich card or media content.
- The underlying `ui-marquee` duplicates content to create a seamless loop and sanitizes cloned interactive content for accessibility.
- `pauseOnHover`, `pauseOnFocus`, and reduced-motion support make it suitable for production dashboards and content rails.
