---
title: AnimatedText
description: Framework-agnostic animated text custom element for hero copy, narrative UI, and status-driven reveal moments.
sidebar_label: AnimatedText
---

# AnimatedText

`ui-animated-text` is the framework-agnostic animated text primitive from `@editora/ui-core`. It is built for text-only motion: hero headlines, onboarding copy, status callouts, release announcements, and narrative dashboard moments where motion should stay readable and accessible.

## Best For

- Hero headlines and campaign messaging
- Guided onboarding copy and step transitions
- Status callouts and operational summaries
- Narrative product surfaces that need motion without sacrificing legibility

## Import

```ts
import '@editora/ui-core';
```

## Basic Usage

```html
<ui-animated-text effect="fade-up" split="words" variant="gradient" size="lg">
  Editorial automation that feels alive
</ui-animated-text>
```

## Choosing an Effect

- Use `fade-up`, `fade-down`, `slide-left`, and `slide-right` for calmer interface motion.
- Use `blur`, `blur-up`, `zoom-in`, and `rotate-in` for premium hero or announcement surfaces.
- Use `pop`, `wave`, `flip-up`, `skew-in`, and `glow` for more expressive or branded motion systems.
- Use `typewriter` when you want a deliberate authored reveal.

## Attribute-Based Text Source

Use the `text` attribute when you want a declarative text source without slotted content.

```html
<ui-animated-text
  text="Bring motion to system headlines without sacrificing readability."
  effect="blur"
  split="words"
  variant="soft"
  tone="info"
  size="md"
  padding="10 14"
></ui-animated-text>
```

## Trigger Modes

```html
<ui-animated-text
  effect="wave"
  split="words"
  trigger="visible"
  variant="minimal"
  tone="success"
>
  This text animates when it enters the viewport.
</ui-animated-text>
```

## Manual Playback

```html
<ui-animated-text
  id="headline"
  trigger="manual"
  effect="typewriter"
  variant="contrast"
  tone="info"
  size="xl"
  padding="14 18"
>
  Command the rollout, then let the copy animate on cue.
</ui-animated-text>

<script type="module">
  const headline = document.getElementById('headline');
  headline?.play();
  // headline?.pause();
  // headline?.replay();
  // headline?.refresh();
</script>
```

## Built-in Effects

`ui-animated-text` currently ships with 14 built-in effects:

`fade-up`, `fade-down`, `slide-left`, `slide-right`, `blur`, `blur-up`, `pop`, `wave`, `zoom-in`, `rotate-in`, `flip-up`, `skew-in`, `glow`, `typewriter`

## Custom Effects

Define a global keyframe and pass its name through `effect`, or use `custom-effect` explicitly.

Use direct `effect="your-keyframe-name"` when you want the shortest markup. Use `effect="custom"` with `custom-effect` when you want an explicit contract in shared examples or design-system code.

```html
<style>
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
</style>

<ui-animated-text
  effect="brand-ribbon"
  effect-timing="cubic-bezier(0.16, 1, 0.3, 1)"
>
  Custom keyframes with built-in text segmentation.
</ui-animated-text>
```

Or:

```html
<ui-animated-text
  effect="custom"
  custom-effect="brand-ribbon"
  effect-direction="alternate"
  effect-iteration-count="infinite"
  effect-fill-mode="both"
>
  Explicit custom motion recipe
</ui-animated-text>
```

## Custom Effect Guidelines

- Define custom keyframes in global or page-level CSS so the animation name exists before the element renders.
- Prefer animating transform, opacity, filter, or letter-spacing instead of layout-changing properties.
- Remember that the animated unit is each generated segment. Word splitting animates words, character splitting animates characters.
- Use `effect-timing`, `effect-direction`, `effect-iteration-count`, and `effect-fill-mode` to tune playback without cloning keyframes unnecessarily.
- Always test with reduced motion enabled so the static fallback remains readable and useful.

## Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | string | — | Explicit text source. If omitted, the component uses slotted text content |
| `effect` | built-in effect name or custom keyframe name | `fade-up` | Reveal animation style |
| `split` | `chars \| words \| lines` | `words` | Segmentation strategy. `typewriter` forces chars |
| `trigger` | `load \| visible \| manual` | `load` | When playback begins |
| `duration` | CSS time or number | `720ms` | Segment animation duration |
| `stagger` | CSS time or number | `55ms` | Delay between segments |
| `delay` | CSS time or number | `0ms` | Initial sequence delay |
| `loop` | boolean | `false` | Replays the animation continuously |
| `loop-delay` | CSS time or number | `1400ms` | Delay between loops |
| `paused` | boolean | `false` | Pauses playback |
| `custom-effect` | string | — | Explicit keyframe name used when `effect="custom"` |
| `effect-timing` | string | — | Overrides animation timing function |
| `effect-direction` | `normal \| reverse \| alternate \| alternate-reverse` | — | Overrides animation direction |
| `effect-iteration-count` | number, string, or `infinite` | — | Overrides iteration count |
| `effect-fill-mode` | `none \| forwards \| backwards \| both` | — | Overrides fill mode |
| `variant` | `default \| soft \| solid \| contrast \| gradient \| minimal` | `default` | Visual treatment |
| `tone` | `brand \| neutral \| info \| success \| warning \| danger` | `brand` | Accent tone |
| `size` | `sm \| md \| lg \| xl \| 1 \| 2 \| 3 \| 4` | `md` | Typography scale |
| `radius` | CSS length or semantic token | — | Surface radius override |
| `elevation` | `none \| low \| high` | `low` | Surface shadow depth |
| `padding` | CSS length | — | Surface padding override |
| `align` | `start \| center \| end \| left \| right` | `start` | Text alignment |

## Methods

```ts
const animatedText = document.querySelector('ui-animated-text');
animatedText?.play();
animatedText?.pause();
animatedText?.replay();
animatedText?.refresh();
```

## Notes

- `ui-animated-text` is intentionally text-first. It does not preserve nested HTML structure in the animated output.
- The host keeps semantic text available via `role="text"` and `aria-label`.
- Reduced-motion environments automatically disable motion while preserving readable static text.
- `trigger="manual"` preserves layout while hiding the text until playback starts.
- Custom effects still benefit from built-in text splitting, staggering, playback controls, and reduced-motion handling.
- The component includes internal safe-area handling for tighter containers so descenders and right-edge glyphs remain visible during animation.
