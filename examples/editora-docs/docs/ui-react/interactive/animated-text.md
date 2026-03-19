---
title: AnimatedText
description: Text-first animation component for hero copy, onboarding headlines, operational callouts, and narrative UI moments.
sidebar_label: AnimatedText
---

# AnimatedText

`AnimatedText` is a React wrapper around the `ui-animated-text` custom element from `@editora/ui-core`. It animates text with a production-ready set of reveal effects while preserving accessibility, reduced-motion behavior, and the design-system variation model used across the Editora UI packages.

## Best For

- Hero headlines and editorial messaging
- Product onboarding steps and guided reveals
- Status callouts, release notes, and operational summaries
- Narrative dashboard moments where motion should stay readable

## Import

```tsx
import { AnimatedText } from '@editora/ui-react';
// or subpath
import { AnimatedText } from '@editora/ui-react/AnimatedText';
```

## Basic Usage

```tsx
<AnimatedText effect="fade-up" split="words" variant="gradient" size="lg">
  Editorial automation that feels alive
</AnimatedText>
```

## Choosing an Effect

- Use `fade-up`, `fade-down`, `slide-left`, and `slide-right` for restrained system UI motion.
- Use `blur`, `blur-up`, `zoom-in`, and `rotate-in` for premium hero or campaign surfaces.
- Use `pop`, `wave`, `flip-up`, `skew-in`, and `glow` for more expressive branded moments.
- Use `typewriter` when the copy should feel sequenced or authored live.

## Trigger Modes

Use `trigger="visible"` when the copy should animate only after it scrolls into view, or `trigger="manual"` when a tour, dialog, or command palette should control playback explicitly.

```tsx
<AnimatedText
  effect="wave"
  split="words"
  trigger="visible"
  variant="soft"
  tone="info"
  size="md"
  padding="10 14"
>
  The release summary animates only when this section enters the viewport.
</AnimatedText>
```

## Manual Playback

```tsx
const ref = React.useRef<HTMLElement & {
  play(): void;
  pause(): void;
  replay(): void;
  refresh(): void;
}>(null);

<>
  <button onClick={() => ref.current?.play()}>Play</button>
  <button onClick={() => ref.current?.pause()}>Pause</button>
  <button onClick={() => ref.current?.replay()}>Replay</button>

  <AnimatedText
    ref={ref}
    trigger="manual"
    effect="typewriter"
    variant="contrast"
    tone="info"
    size="xl"
    padding="14 18"
  >
    Command the rollout, then let the copy animate on cue.
  </AnimatedText>
</>
```

## Surface Variants

The component follows the shared visual-token pattern used by surface-style components.

```tsx
<>
  <AnimatedText variant="gradient" tone="brand" size="xl">
    Hero headline
  </AnimatedText>

  <AnimatedText variant="soft" tone="success" size="sm" padding="8 12">
    Supporting status copy
  </AnimatedText>

  <AnimatedText variant="contrast" tone="warning" size="md" padding="12 16">
    Attention-grabbing rollout note
  </AnimatedText>
</>
```

## Built-in Effects

AnimatedText currently ships with 14 built-in effects:

`fade-up`, `fade-down`, `slide-left`, `slide-right`, `blur`, `blur-up`, `pop`, `wave`, `zoom-in`, `rotate-in`, `flip-up`, `skew-in`, `glow`, `typewriter`

## Custom Effects

You can provide your own keyframe name as the `effect` value, or use `effect="custom"` with `customEffect`.

Use direct `effect="your-keyframe-name"` when you want the shortest API. Use `effect="custom"` with `customEffect` when you want the intent to be explicit in shared codebases or design-system examples.

```tsx
<style>
  {`
    @keyframes brand-ribbon {
      from {
        opacity: 0;
        transform: translateY(0.4em) rotate(-8deg) scale(0.92);
        filter: blur(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0) rotate(0deg) scale(1);
        filter: blur(0);
      }
    }
  `}
</style>

<AnimatedText
  effect="brand-ribbon"
  effectTimingFunction="cubic-bezier(0.16, 1, 0.3, 1)"
  size="lg"
>
  Custom brand motion with built-in text segmentation.
</AnimatedText>
```

Or use the explicit custom-effect API:

```tsx
<AnimatedText
  effect="custom"
  customEffect="brand-ribbon"
  effectDirection="alternate"
  effectIterationCount="infinite"
  effectFillMode="both"
>
  Reusable custom motion recipe
</AnimatedText>
```

## Custom Effect Guidelines

- Define your keyframes in application or page CSS so the animation name is globally available.
- Animate transform, opacity, filter, or letter-spacing rather than layout properties like width or height.
- Treat each segment as the animated unit. A word-split animation affects words; a char-split animation affects characters.
- Prefer `effectTimingFunction`, `effectDirection`, `effectIterationCount`, and `effectFillMode` for runtime tuning instead of duplicating near-identical keyframes.
- Test custom effects with reduced-motion enabled to make sure the static fallback still communicates clearly.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `string` | — | Explicit text source. If omitted, the component uses `children` text content |
| `effect` | built-in effect name or custom keyframe name | `'fade-up'` | Reveal animation style |
| `split` | `'chars' \| 'words' \| 'lines'` | `'words'` | Text segmentation strategy. `typewriter` automatically uses chars |
| `trigger` | `'load' \| 'visible' \| 'manual'` | `'load'` | When the animation should begin |
| `duration` | `number \| string` | `720` | Animation duration in ms or CSS time |
| `stagger` | `number \| string` | `55` | Delay between animated segments |
| `delay` | `number \| string` | `0` | Initial delay before the first segment |
| `loop` | `boolean` | `false` | Replays the sequence continuously |
| `loopDelay` | `number \| string` | `1400` | Delay between loops |
| `paused` | `boolean` | `false` | Pauses playback |
| `customEffect` | `string` | — | Explicit keyframe name to use when `effect="custom"` |
| `effectTimingFunction` | `string` | — | Overrides animation timing function |
| `effectDirection` | `'normal' \| 'reverse' \| 'alternate' \| 'alternate-reverse'` | — | Overrides animation direction |
| `effectIterationCount` | `number \| string` | — | Overrides iteration count |
| `effectFillMode` | `'none' \| 'forwards' \| 'backwards' \| 'both'` | — | Overrides fill mode |
| `variant` | `'default' \| 'soft' \| 'solid' \| 'contrast' \| 'gradient' \| 'minimal'` | `'default'` | Surface/text treatment |
| `tone` | `'brand' \| 'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'brand'` | Accent tone |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '1' \| '2' \| '3' \| '4'` | `'md'` | Typography scale |
| `radius` | `number \| string` | — | Surface radius override |
| `elevation` | `'none' \| 'low' \| 'high'` | `'low'` | Surface shadow depth |
| `padding` | `number \| string` | — | Surface padding override |
| `align` | `'start' \| 'center' \| 'end' \| 'left' \| 'right'` | `'start'` | Text alignment |
| `children` | `React.ReactNode` | — | Text content fallback when `text` is omitted |

## Imperative API

```tsx
const ref = React.useRef<HTMLElement & {
  play(): void;
  pause(): void;
  replay(): void;
  refresh(): void;
}>(null);

ref.current?.play();
ref.current?.pause();
ref.current?.replay();
ref.current?.refresh();
```

## Notes

- `AnimatedText` is text-first. If you pass nested markup, the component flattens it to text content before animating.
- `trigger="manual"` preserves layout but keeps the animated text hidden until `play()` is called.
- Reduced-motion environments automatically suppress animation while keeping the text visible and readable.
- `typewriter` includes a caret and automatically switches segmentation to characters.
- Custom effects inherit the component's segmentation, staggering, trigger modes, and reduced-motion behavior.
- The component includes internal safe-area handling for tight frames so descenders and right-edge glyphs do not get visually trimmed in dense headline layouts.
