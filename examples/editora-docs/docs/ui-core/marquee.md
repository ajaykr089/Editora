---
title: Marquee
description: Framework-agnostic infinite scrolling custom element for text, cards, images, and vertical feeds.
sidebar_label: Marquee
---

# Marquee

`ui-marquee` is the framework-agnostic infinite scrolling rail from `@editora/ui-core`. It supports horizontal and vertical directions, mixed content, reduced-motion safeguards, clone sanitization, and the same tokenized visual system used by other surface components.

## Import

```ts
import '@editora/ui-core';
```

## Basic Usage

```html
<ui-marquee speed="72" gap="20" pause-on-hover fade>
  <div data-ui-marquee-item>Realtime collaboration synced</div>
  <div data-ui-marquee-item>Release train ready for sign-off</div>
  <div data-ui-marquee-item>ICU occupancy crossed 85%</div>
</ui-marquee>
```

## Mixed Content

```html
<ui-marquee variant="glass" tone="info" size="lg" gap="24" speed="58" fade pause-on-hover>
  <article data-ui-marquee-item>
    <img src="/launch-poster.png" alt="Launch poster">
    <h3>Editorial launch rail</h3>
    <p>Use richer card-like items when the marquee acts as a moving shelf.</p>
  </article>

  <article data-ui-marquee-item>
    <video src="/preview.mp4" muted autoplay loop playsinline></video>
  </article>
</ui-marquee>
```

## Vertical Feed

```html
<ui-marquee
  direction="up"
  variant="contrast"
  tone="info"
  speed="42"
  gap="16"
  fade
  style="block-size: 360px;"
>
  <article data-ui-marquee-item>
    <strong>Deployment 4.2.1</strong>
    <span>Canary rollout reached 60% of premium traffic.</span>
  </article>
  <article data-ui-marquee-item>
    <strong>Policy drift check</strong>
    <span>Two workspaces still need the updated retention package.</span>
  </article>
</ui-marquee>
```

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `direction` | `left \| right \| up \| down` | `left` | Scroll direction |
| `speed` | `number` | `60` | Pixels per second |
| `gap` | CSS length | `24px` | Gap between items |
| `paused` | boolean | `false` | Pauses animation |
| `pause-on-hover` | boolean | `false` | Pauses on hover |
| `pause-on-focus` | boolean | `false` | Pauses on focus within |
| `fade` | boolean | `false` | Enables edge fading |
| `fade-size` | CSS length | `48px` | Fade mask size |
| `variant` | `default \| surface \| soft \| solid \| glass \| contrast \| minimal` | `default` | Surface styling |
| `tone` | `brand \| neutral \| info \| success \| warning \| danger` | `brand` | Accent tone |
| `size` | `sm \| md \| lg \| 1 \| 2 \| 3` | `md` | Shell and item sizing |
| `radius` | CSS length or semantic token | — | Shell radius override |
| `elevation` | `none \| low \| high` | `low` | Surface shadow depth |
| `padding` | CSS length | — | Shell padding override |

## Methods

```ts
const marquee = document.querySelector('ui-marquee');
marquee?.pause();
marquee?.play();
marquee?.refresh();
```

## Notes

- Add `data-ui-marquee-item` to content wrappers for the built-in item styling treatment.
- The component duplicates slotted content internally to create a seamless loop.
- Interactive content inside clones is sanitized and hidden from assistive technology to avoid duplicate focus targets.
- Reduced-motion environments automatically suppress animation.
