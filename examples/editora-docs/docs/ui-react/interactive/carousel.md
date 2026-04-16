---
title: Carousel
description: Lightweight narrative and gallery carousel with indicators, controls, and optional autoplay.
sidebar_label: Carousel
---

# Carousel

`Carousel` is a React-first slide surface for marketing heroes, release storytelling, media galleries, and guided content sequences. It supports controlled or uncontrolled navigation, multiple indicator styles, hover-aware controls, horizontal or vertical flow, and slide or fade transitions.

## Basic usage

```tsx
import { Carousel, Badge } from '@editora/ui-react';

function ReleaseCarousel() {
  return (
    <Carousel label="Release highlights">
      <Carousel.Item label="Overview">
        <div>
          <Badge tone="info">Overview</Badge>
          <h3>Introduce the launch in one frame</h3>
        </div>
      </Carousel.Item>
      <Carousel.Item label="Proof">
        <div>
          <Badge tone="success">Proof</Badge>
          <h3>Show one key metric or testimonial</h3>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}
```

## Controlled navigation

```tsx
import { Carousel } from '@editora/ui-react';

function ControlledCarousel() {
  const [index, setIndex] = React.useState(0);

  return (
    <Carousel index={index} onIndexChange={setIndex}>
      <Carousel.Item label="One">First slide</Carousel.Item>
      <Carousel.Item label="Two">Second slide</Carousel.Item>
    </Carousel>
  );
}
```

## Arrow overlays and centered controls

```tsx
import { Carousel } from '@editora/ui-react';

function GalleryCarousel() {
  return (
    <Carousel controlsPosition="center" controlsVariant="arrow" label="Gallery carousel">
      <Carousel.Item label="Still 1">First frame</Carousel.Item>
      <Carousel.Item label="Still 2">Second frame</Carousel.Item>
    </Carousel>
  );
}

function CenteredFooterCarousel() {
  return (
    <Carousel
      controlsAlign="center"
      controlsPosition="bottom"
      nextLabel="Forward"
      previousLabel="Back"
    >
      <Carousel.Item label="One">First slide</Carousel.Item>
      <Carousel.Item label="Two">Second slide</Carousel.Item>
    </Carousel>
  );
}
```

## Visibility, direction, and transition variants

```tsx
import { Carousel } from '@editora/ui-react';

function HoverRevealGallery() {
  return (
    <Carousel
      controlsPosition="center"
      controlsVariant="arrow"
      controlsVisibility="hover"
      indicatorsVariant="pill"
    >
      <Carousel.Item label="Still 1">First frame</Carousel.Item>
      <Carousel.Item label="Still 2">Second frame</Carousel.Item>
    </Carousel>
  );
}

function VerticalFadeCarousel() {
  return (
    <Carousel
      direction="vertical"
      indicatorsVariant="line"
      transition="fade"
    >
      <Carousel.Item label="Stage 1">Plan</Carousel.Item>
      <Carousel.Item label="Stage 2">Build</Carousel.Item>
      <Carousel.Item label="Stage 3">Ship</Carousel.Item>
    </Carousel>
  );
}
```

## Autoplay, hover pause, and swipe

```tsx
import { Carousel } from '@editora/ui-react';

function AmbientCarousel() {
  return (
    <Carousel
      autoPlay
      controlsPosition="center"
      controlsVariant="arrow"
      controlsVisibility="hover"
      interval={2400}
      pauseOnHover
    >
      <Carousel.Item label="Highlight 1">First highlight</Carousel.Item>
      <Carousel.Item label="Highlight 2">Second highlight</Carousel.Item>
      <Carousel.Item label="Highlight 3">Third highlight</Carousel.Item>
    </Carousel>
  );
}
```

## Notes

- Use `Carousel.Item` labels to generate clearer indicator and accessibility names.
- `controlsVariant` supports text buttons or compact arrow controls.
- `controlsVisibility` supports always visible controls, hover/focus reveal, or fully hidden chrome.
- `controlsPosition` supports top, centered overlay, and bottom control placements.
- `indicatorsVariant` supports `dot`, `pill`, and `line` treatments.
- `direction="vertical"` switches the whole shell to a vertical layout: slides move top-to-bottom, controls stack vertically, and indicators move into a vertical rail.
- `transition` supports `slide`, `fade`, and `none`.
- Set `showControls={false}` when you want an indicators-only carousel.
- `autoPlay` advances slides automatically, and `pauseOnHover` pauses the timer while the pointer is over the carousel.
- Swipe gestures are supported for both horizontal and vertical carousels.
- `Carousel` is client-only and should be imported from `@editora/ui-react` or `@editora/ui-react/client`.
