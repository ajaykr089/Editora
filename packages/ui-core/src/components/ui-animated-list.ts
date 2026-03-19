import { ElementBase } from '../ElementBase';

type AnimatedListEffect =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'blur-in'
  | 'pop'
  | 'flip-in'
  | 'rotate-in'
  | 'tilt-in'
  | 'float-up'
  | 'swing-in';

type AnimatedListTrigger = 'load' | 'visible' | 'manual';
type AnimatedListAnimation = 'calm' | 'smooth' | 'snappy' | 'bouncy';

const DEFAULT_DURATION = '520ms';
const DEFAULT_STAGGER = '90ms';
const DEFAULT_DELAY = '0ms';
const DEFAULT_LOOP_DELAY = 1400;
const DEFAULT_THRESHOLD = 0.24;
const SEMANTIC_RADIUS_VALUES = new Set(['none', 'sm', 'md', 'lg', 'full']);
const EFFECTS = new Set<AnimatedListEffect>([
  'fade-up',
  'fade-down',
  'slide-left',
  'slide-right',
  'scale-in',
  'blur-in',
  'pop',
  'flip-in',
  'rotate-in',
  'tilt-in',
  'float-up',
  'swing-in',
]);
const TRIGGERS = new Set<AnimatedListTrigger>(['load', 'visible', 'manual']);
const ANIMATIONS = new Set<AnimatedListAnimation>(['calm', 'smooth', 'snappy', 'bouncy']);

const style = `
  :host {
    --ui-animated-list-duration: ${DEFAULT_DURATION};
    --ui-animated-list-stagger: ${DEFAULT_STAGGER};
    --ui-animated-list-delay: ${DEFAULT_DELAY};
    --ui-animated-list-gap: 12px;
    --ui-animated-list-padding: 16px;
    --ui-animated-list-motion-easing: cubic-bezier(0.2, 0.9, 0.24, 1);
    --ui-animated-list-motion-duration-scale: 1;
    --ui-animated-list-motion-distance-scale: 1;
    --ui-animated-list-motion-blur-scale: 1;
    --ui-animated-list-motion-rotate-scale: 1;
    --ui-animated-list-motion-overshoot-y: -2px;
    --ui-animated-list-motion-overshoot-scale: 1.02;
    --ui-animated-list-radius: var(--base-animated-list-radius, 20px);
    --ui-animated-list-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent) 0%,
        color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 24%, var(--ui-color-surface, #ffffff)) 100%
      );
    --ui-animated-list-color: var(--ui-color-text, #0f172a);
    --ui-animated-list-border-color:
      color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 80%, transparent);
    --ui-animated-list-border: 1px solid var(--ui-animated-list-border-color);
    --ui-animated-list-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 16px 30px rgba(15, 23, 42, 0.08);
    --ui-animated-list-backdrop: none;
    --ui-animated-list-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-animated-list-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));

    --ui-animated-list-item-radius: 16px;
    --ui-animated-list-item-padding: 14px 16px;
    --ui-animated-list-item-min-block-size: 56px;
    --ui-animated-list-item-gap: 6px;
    --ui-animated-list-item-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, transparent),
        color-mix(in srgb, var(--ui-animated-list-accent) 4%, var(--ui-color-surface, #ffffff))
      );
    --ui-animated-list-item-border:
      1px solid color-mix(in srgb, var(--ui-animated-list-accent) 10%, var(--ui-animated-list-border-color));
    --ui-animated-list-item-shadow:
      0 1px 2px rgba(15, 23, 42, 0.04),
      0 10px 18px rgba(15, 23, 42, 0.06);
    --ui-animated-list-item-color: inherit;
    --ui-animated-list-item-muted: var(--ui-color-muted, #64748b);
    --ui-animated-list-item-backdrop: none;

    display: block;
    min-inline-size: 0;
    box-sizing: border-box;
    color-scheme: light dark;
    color: var(--ui-animated-list-color);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    contain: layout style;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-animated-list-gap: 10px;
    --ui-animated-list-padding: 12px;
    --ui-animated-list-radius: 16px;
    --ui-animated-list-item-radius: 14px;
    --ui-animated-list-item-padding: 11px 13px;
    --ui-animated-list-item-min-block-size: 48px;
    --ui-animated-list-item-gap: 4px;
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-animated-list-gap: 12px;
    --ui-animated-list-padding: 16px;
    --ui-animated-list-radius: var(--base-animated-list-radius, 20px);
    --ui-animated-list-item-radius: 16px;
    --ui-animated-list-item-padding: 14px 16px;
    --ui-animated-list-item-min-block-size: 56px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-animated-list-gap: 14px;
    --ui-animated-list-padding: 20px;
    --ui-animated-list-radius: 24px;
    --ui-animated-list-item-radius: 18px;
    --ui-animated-list-item-padding: 16px 18px;
    --ui-animated-list-item-min-block-size: 64px;
    --ui-animated-list-item-gap: 8px;
  }

  :host([animation="calm"]) {
    --ui-animated-list-motion-easing: cubic-bezier(0.22, 1, 0.36, 1);
    --ui-animated-list-motion-duration-scale: 1.12;
    --ui-animated-list-motion-distance-scale: 0.78;
    --ui-animated-list-motion-blur-scale: 0.75;
    --ui-animated-list-motion-rotate-scale: 0.82;
    --ui-animated-list-motion-overshoot-y: -1px;
    --ui-animated-list-motion-overshoot-scale: 1.01;
  }

  :host(:not([animation])),
  :host([animation="smooth"]) {
    --ui-animated-list-motion-easing: cubic-bezier(0.2, 0.9, 0.24, 1);
    --ui-animated-list-motion-duration-scale: 1;
    --ui-animated-list-motion-distance-scale: 1;
    --ui-animated-list-motion-blur-scale: 1;
    --ui-animated-list-motion-rotate-scale: 1;
    --ui-animated-list-motion-overshoot-y: -2px;
    --ui-animated-list-motion-overshoot-scale: 1.02;
  }

  :host([animation="snappy"]) {
    --ui-animated-list-motion-easing: cubic-bezier(0.16, 1, 0.3, 1);
    --ui-animated-list-motion-duration-scale: 0.88;
    --ui-animated-list-motion-distance-scale: 1.12;
    --ui-animated-list-motion-blur-scale: 0.92;
    --ui-animated-list-motion-rotate-scale: 1.08;
    --ui-animated-list-motion-overshoot-y: -2.5px;
    --ui-animated-list-motion-overshoot-scale: 1.028;
  }

  :host([animation="bouncy"]) {
    --ui-animated-list-motion-easing: cubic-bezier(0.2, 1.18, 0.28, 1);
    --ui-animated-list-motion-duration-scale: 1.08;
    --ui-animated-list-motion-distance-scale: 1.18;
    --ui-animated-list-motion-blur-scale: 1;
    --ui-animated-list-motion-rotate-scale: 1.18;
    --ui-animated-list-motion-overshoot-y: -4px;
    --ui-animated-list-motion-overshoot-scale: 1.05;
  }

  :host([tone="neutral"]) {
    --ui-animated-list-accent: #64748b;
  }

  :host([tone="info"]) {
    --ui-animated-list-accent: #0ea5e9;
  }

  :host([tone="success"]) {
    --ui-animated-list-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-animated-list-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-animated-list-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="soft"]) {
    --ui-animated-list-bg:
      color-mix(in srgb, var(--ui-animated-list-accent) 6%, var(--ui-color-surface, #ffffff));
    --ui-animated-list-border-color:
      color-mix(in srgb, var(--ui-animated-list-accent) 18%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-animated-list-shadow: none;
    --ui-animated-list-item-bg:
      color-mix(in srgb, var(--ui-animated-list-accent) 10%, rgba(255, 255, 255, 0.82));
    --ui-animated-list-item-border:
      1px solid color-mix(in srgb, var(--ui-animated-list-accent) 20%, transparent);
    --ui-animated-list-item-shadow: none;
  }

  :host([variant="solid"]) {
    --ui-animated-list-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-animated-list-accent) 12%, var(--ui-color-surface, #ffffff)),
        color-mix(in srgb, var(--ui-animated-list-accent) 6%, var(--ui-color-surface-elevated, #f8fafc))
      );
    --ui-animated-list-border-color:
      color-mix(in srgb, var(--ui-animated-list-accent) 24%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-animated-list-shadow:
      0 1px 3px rgba(15, 23, 42, 0.06),
      0 18px 36px color-mix(in srgb, var(--ui-animated-list-accent) 10%, rgba(15, 23, 42, 0.08));
    --ui-animated-list-item-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-animated-list-accent) 14%, rgba(255, 255, 255, 0.92)),
        color-mix(in srgb, var(--ui-animated-list-accent) 8%, rgba(255, 255, 255, 0.84))
      );
    --ui-animated-list-item-border:
      1px solid color-mix(in srgb, var(--ui-animated-list-accent) 28%, transparent);
  }

  :host([variant="glass"]) {
    --ui-animated-list-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 84%, #ffffff 16%),
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 74%, transparent)
      );
    --ui-animated-list-border-color:
      color-mix(in srgb, #ffffff 28%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-animated-list-shadow:
      0 1px 3px rgba(15, 23, 42, 0.08),
      0 24px 48px rgba(15, 23, 42, 0.12);
    --ui-animated-list-backdrop: blur(16px) saturate(1.08);
    --ui-animated-list-item-bg: color-mix(in srgb, #ffffff 48%, transparent);
    --ui-animated-list-item-border: 1px solid color-mix(in srgb, #ffffff 36%, transparent);
    --ui-animated-list-item-backdrop: blur(10px) saturate(1.05);
  }

  :host([variant="contrast"]) {
    --ui-animated-list-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #07162d 92%, var(--ui-animated-list-accent) 8%),
        color-mix(in srgb, #0f2d57 84%, var(--ui-animated-list-accent) 16%)
      );
    --ui-animated-list-color: #f8fbff;
    --ui-animated-list-border-color: color-mix(in srgb, #9ec5ff 18%, transparent);
    --ui-animated-list-shadow: 0 28px 56px rgba(2, 6, 23, 0.32);
    --ui-animated-list-item-bg: color-mix(in srgb, #ffffff 10%, transparent);
    --ui-animated-list-item-border: 1px solid color-mix(in srgb, #ffffff 14%, transparent);
    --ui-animated-list-item-color: #f8fbff;
    --ui-animated-list-item-muted: color-mix(in srgb, #f8fbff 68%, transparent);
  }

  :host([variant="minimal"]) {
    --ui-animated-list-bg: transparent;
    --ui-animated-list-border: none;
    --ui-animated-list-shadow: none;
    --ui-animated-list-item-bg: color-mix(in srgb, var(--ui-animated-list-accent) 8%, transparent);
    --ui-animated-list-item-border: 1px solid color-mix(in srgb, var(--ui-animated-list-accent) 16%, transparent);
  }

  :host([radius="none"]) {
    --ui-animated-list-radius: 0px;
    --ui-animated-list-item-radius: 0px;
  }

  :host([radius="sm"]) {
    --ui-animated-list-radius: 12px;
    --ui-animated-list-item-radius: 12px;
  }

  :host([radius="md"]) {
    --ui-animated-list-radius: 18px;
    --ui-animated-list-item-radius: 16px;
  }

  :host([radius="lg"]) {
    --ui-animated-list-radius: 24px;
    --ui-animated-list-item-radius: 18px;
  }

  :host([radius="full"]) {
    --ui-animated-list-radius: 999px;
    --ui-animated-list-item-radius: 999px;
  }

  :host([elevation="none"]) {
    --ui-animated-list-shadow: none;
    --ui-animated-list-item-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-animated-list-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 16px 30px rgba(15, 23, 42, 0.08);
  }

  :host([elevation="high"]) {
    --ui-animated-list-shadow:
      0 2px 8px rgba(15, 23, 42, 0.08),
      0 28px 54px rgba(15, 23, 42, 0.16);
    --ui-animated-list-item-shadow:
      0 2px 8px rgba(15, 23, 42, 0.06),
      0 18px 34px rgba(15, 23, 42, 0.1);
  }

  .root {
    display: block;
    min-inline-size: 0;
  }

  .surface {
    display: block;
    min-inline-size: 0;
    padding: var(--ui-animated-list-padding);
    border-radius: var(--ui-animated-list-radius);
    border: var(--ui-animated-list-border);
    background: var(--ui-animated-list-bg);
    color: var(--ui-animated-list-color);
    box-shadow: var(--ui-animated-list-shadow);
    backdrop-filter: var(--ui-animated-list-backdrop);
    box-sizing: border-box;
    transition:
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      backdrop-filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  .list {
    display: grid;
    gap: var(--ui-animated-list-gap);
    min-inline-size: 0;
  }

  ::slotted([data-ui-animated-list-item]) {
    display: grid !important;
    gap: var(--ui-animated-list-item-gap);
    min-inline-size: 0;
    min-block-size: var(--ui-animated-list-item-min-block-size);
    align-content: center;
    box-sizing: border-box;
    padding: var(--ui-animated-list-item-padding);
    border-radius: var(--ui-animated-list-item-radius);
    border: var(--ui-animated-list-item-border);
    background: var(--ui-animated-list-item-bg);
    color: var(--ui-animated-list-item-color);
    box-shadow: var(--ui-animated-list-item-shadow);
    backdrop-filter: var(--ui-animated-list-item-backdrop);
    transform-origin: 50% 50%;
    will-change: transform, opacity, filter;
    transition:
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      backdrop-filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  :host([data-phase="ready"]) ::slotted([data-ui-animated-list-item]),
  :host([data-phase="idle"]) ::slotted([data-ui-animated-list-item]) {
    opacity: 0;
    transform: var(--ui-animated-list-effect-from-transform, translate3d(0, 20px, 0));
    filter: var(--ui-animated-list-effect-from-filter, none);
  }

  :host([data-phase="running"]) ::slotted([data-ui-animated-list-item]) {
    opacity: 0;
    animation-duration: var(--ui-animated-list-duration);
    animation-delay:
      calc(var(--ui-animated-list-delay) + var(--ui-animated-list-index, 0) * var(--ui-animated-list-stagger));
    animation-fill-mode: both;
    animation-timing-function: var(--ui-animated-list-motion-easing);
    animation-play-state: running;
  }

  :host([paused][data-phase="running"]) ::slotted([data-ui-animated-list-item]) {
    animation-play-state: paused;
  }

  :host([data-phase="complete"]) ::slotted([data-ui-animated-list-item]) {
    opacity: 1;
    transform: none;
    filter: none;
    animation: none;
  }

  :host(:not([effect])),
  :host([effect="fade-up"]) {
    --ui-animated-list-effect-from-transform: translate3d(0, 18px, 0);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="fade-down"]) {
    --ui-animated-list-effect-from-transform: translate3d(0, -18px, 0);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="slide-left"]) {
    --ui-animated-list-effect-from-transform: translate3d(28px, 0, 0);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="slide-right"]) {
    --ui-animated-list-effect-from-transform: translate3d(-28px, 0, 0);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="scale-in"]) {
    --ui-animated-list-effect-from-transform: translate3d(0, 10px, 0) scale(0.94);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="blur-in"]) {
    --ui-animated-list-effect-from-transform: translate3d(0, 14px, 0) scale(0.98);
    --ui-animated-list-effect-from-filter: blur(12px);
  }

  :host([effect="pop"]) {
    --ui-animated-list-effect-from-transform: translate3d(0, 8px, 0) scale(0.88);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="flip-in"]) {
    --ui-animated-list-effect-from-transform: perspective(900px) rotateX(-18deg) translate3d(0, 14px, 0);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="rotate-in"]) {
    --ui-animated-list-effect-from-transform: translate3d(0, 12px, 0) rotate(-10deg) scale(0.97);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="tilt-in"]) {
    --ui-animated-list-effect-from-transform: perspective(900px) rotateY(-14deg) translate3d(0, 12px, 0);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="float-up"]) {
    --ui-animated-list-effect-from-transform: translate3d(0, 26px, 0) scale(0.985);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([effect="swing-in"]) {
    --ui-animated-list-effect-from-transform: translate3d(-16px, 0, 0) rotate(-7deg);
    --ui-animated-list-effect-from-filter: none;
  }

  :host([data-phase="running"]:not([effect])) ::slotted([data-ui-animated-list-item]),
  :host([data-phase="running"][effect="fade-up"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-fade-up;
  }

  :host([data-phase="running"][effect="fade-down"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-fade-down;
  }

  :host([data-phase="running"][effect="slide-left"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-slide-left;
  }

  :host([data-phase="running"][effect="slide-right"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-slide-right;
  }

  :host([data-phase="running"][effect="scale-in"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-scale-in;
  }

  :host([data-phase="running"][effect="blur-in"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-blur-in;
  }

  :host([data-phase="running"][effect="pop"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-pop;
  }

  :host([data-phase="running"][effect="flip-in"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-flip-in;
  }

  :host([data-phase="running"][effect="rotate-in"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-rotate-in;
  }

  :host([data-phase="running"][effect="tilt-in"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-tilt-in;
  }

  :host([data-phase="running"][effect="float-up"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-float-up;
  }

  :host([data-phase="running"][effect="swing-in"]) ::slotted([data-ui-animated-list-item]) {
    animation-name: ui-animated-list-swing-in;
  }

  @keyframes ui-animated-list-fade-up {
    from {
      opacity: 0;
      transform: translate3d(0, 18px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-list-fade-down {
    from {
      opacity: 0;
      transform: translate3d(0, -18px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-list-slide-left {
    from {
      opacity: 0;
      transform: translate3d(28px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-list-slide-right {
    from {
      opacity: 0;
      transform: translate3d(-28px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-list-scale-in {
    from {
      opacity: 0;
      transform: translate3d(0, 10px, 0) scale(0.94);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes ui-animated-list-blur-in {
    from {
      opacity: 0;
      transform: translate3d(0, 14px, 0) scale(0.98);
      filter: blur(12px);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
      filter: blur(0);
    }
  }

  @keyframes ui-animated-list-pop {
    from {
      opacity: 0;
      transform: translate3d(0, 8px, 0) scale(0.88);
    }
    60% {
      opacity: 1;
      transform: translate3d(0, -2px, 0) scale(1.02);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes ui-animated-list-flip-in {
    from {
      opacity: 0;
      transform: perspective(900px) rotateX(-18deg) translate3d(0, 14px, 0);
    }
    to {
      opacity: 1;
      transform: perspective(900px) rotateX(0deg) translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-list-rotate-in {
    from {
      opacity: 0;
      transform: translate3d(0, 12px, 0) rotate(-10deg) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    }
  }

  @keyframes ui-animated-list-tilt-in {
    from {
      opacity: 0;
      transform: perspective(900px) rotateY(-14deg) translate3d(0, 12px, 0);
    }
    to {
      opacity: 1;
      transform: perspective(900px) rotateY(0deg) translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-list-float-up {
    from {
      opacity: 0;
      transform: translate3d(0, 26px, 0) scale(0.985);
    }
    60% {
      opacity: 1;
      transform: translate3d(0, -2px, 0) scale(1.01);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes ui-animated-list-swing-in {
    from {
      opacity: 0;
      transform: translate3d(-16px, 0, 0) rotate(-7deg);
    }
    70% {
      opacity: 1;
      transform: translate3d(1px, 0, 0) rotate(1deg);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg);
    }
  }

  :host(:focus-visible) .surface {
    outline: none;
    border-color: color-mix(in srgb, var(--ui-animated-list-focus-ring) 24%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-animated-list-focus-ring) 18%, transparent),
      var(--ui-animated-list-shadow);
  }

  @media (prefers-reduced-motion: reduce) {
    :host {
      --ui-animated-list-duration: 1ms;
      --ui-animated-list-stagger: 0ms;
      --ui-animated-list-delay: 0ms;
    }

    :host([data-phase="running"]) ::slotted([data-ui-animated-list-item]) {
      animation-duration: 1ms !important;
      animation-delay: 0ms !important;
    }
  }

  @media (prefers-contrast: more) {
    .surface,
    ::slotted([data-ui-animated-list-item]) {
      box-shadow: none;
    }

    .surface {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-animated-list-bg: Canvas;
      --ui-animated-list-color: CanvasText;
      --ui-animated-list-border-color: CanvasText;
      --ui-animated-list-shadow: none;
      --ui-animated-list-item-bg: Canvas;
      --ui-animated-list-item-border: 1px solid CanvasText;
      --ui-animated-list-item-color: CanvasText;
      --ui-animated-list-item-shadow: none;
    }

    .surface,
    ::slotted([data-ui-animated-list-item]) {
      forced-color-adjust: none;
    }
  }
`;

function parseTimeToMs(value: string | null, fallback: number): number {
  if (value == null || value === '') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (/^-?\d+(\.\d+)?ms$/i.test(trimmed)) return Math.max(0, Number.parseFloat(trimmed));
  if (/^-?\d+(\.\d+)?s$/i.test(trimmed)) return Math.max(0, Number.parseFloat(trimmed) * 1000);
  if (/^-?\d+(\.\d+)?$/i.test(trimmed)) return Math.max(0, Number.parseFloat(trimmed));
  return fallback;
}

function normalizeTime(value: string | null, fallback: string): string {
  if (value == null || value === '') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (/^-?\d+(\.\d+)?(ms|s)$/i.test(trimmed)) return trimmed;
  if (/^-?\d+(\.\d+)?$/i.test(trimmed)) return `${trimmed}ms`;
  return fallback;
}

function normalizeLength(value: string | null): string | null {
  if (value == null || value === '') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return parts.map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? `${part}px` : part)).join(' ');
}

function parseThreshold(value: string | null): number {
  if (value == null || value === '') return DEFAULT_THRESHOLD;
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return DEFAULT_THRESHOLD;
  return Math.min(1, Math.max(0, parsed));
}

type TimerHandle = ReturnType<typeof setTimeout> | null;

export class UIAnimatedList extends ElementBase {
  static get observedAttributes() {
    return [
      'effect',
      'trigger',
      'duration',
      'stagger',
      'delay',
      'animation',
      'loop',
      'loop-delay',
      'paused',
      'threshold',
      'variant',
      'tone',
      'size',
      'radius',
      'elevation',
      'padding',
      'gap',
    ];
  }

  private _slotEl: HTMLSlotElement | null = null;
  private _items: HTMLElement[] = [];
  private _phase: 'idle' | 'ready' | 'running' | 'complete' = 'idle';
  private _playToken = 0;
  private _hasTriggeredOnce = false;
  private _inView = false;
  private _completionTimer: TimerHandle = null;
  private _completionStartedAt = 0;
  private _completionRemaining = 0;
  private _loopTimer: TimerHandle = null;
  private _loopStartedAt = 0;
  private _loopRemaining = 0;
  private _rafA = 0;
  private _rafB = 0;
  private _intersectionObserver: IntersectionObserver | null = null;
  private _mediaQuery: MediaQueryList | null = null;
  private _animations: Animation[] = [];
  private _boundSlotChange = this._handleSlotChange.bind(this);
  private _boundReducedMotionChange = this._handleReducedMotionChange.bind(this);

  override connectedCallback() {
    super.connectedCallback();
    this._bindReducedMotionWatcher();
  }

  override disconnectedCallback() {
    this._clearTimers();
    this._disconnectIntersectionObserver();
    this._mediaQuery?.removeEventListener?.('change', this._boundReducedMotionChange);
    this._mediaQuery?.removeListener?.(this._boundReducedMotionChange);
    this._mediaQuery = null;
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue || !this.isConnected) return;
    if (name === 'paused') {
      if (this.hasAttribute('paused')) {
        this._pauseTimers();
        this._pauseAnimations();
      } else {
        this._resumeTimers();
        this._resumeAnimations();
      }
      this._syncStateAttributes();
      return;
    }

    this._syncRuntimeStyles();

    if (name === 'trigger' || name === 'threshold') {
      this._syncTrigger();
      this._autoStartIfNeeded();
      return;
    }

    if (name === 'duration' || name === 'stagger' || name === 'delay' || name === 'loop' || name === 'loop-delay') {
      if (this._phase === 'running' && !this.hasAttribute('paused')) {
        this._scheduleCompletion(this._totalAnimationMs());
      } else if (this._phase === 'complete' && this._hasLoop() && !this.hasAttribute('paused')) {
        this._scheduleLoop(this._loopDelayMs());
      }
      return;
    }

    if (name === 'effect' || name === 'animation') {
      if (this._phase === 'running' && !this.hasAttribute('paused')) this.replay();
      return;
    }
  }

  play(): void {
    if (this.hasAttribute('paused') && this._phase === 'running') {
      this.removeAttribute('paused');
      return;
    }

    if (this.hasAttribute('paused')) this.removeAttribute('paused');

    this._hasTriggeredOnce = true;
    this._clearTimers();

    if (this._prefersReducedMotion() || this._items.length === 0) {
      this._setPhase('complete');
      return;
    }

    const token = ++this._playToken;
    this._setPhase('ready');

    this._rafA = requestAnimationFrame(() => {
      if (token !== this._playToken || !this.isConnected) return;
      this._rafB = requestAnimationFrame(() => {
        if (token !== this._playToken || !this.isConnected) return;
        this._setPhase('running');
        this._startAnimations();
        if (!this.hasAttribute('paused')) this._scheduleCompletion(this._totalAnimationMs());
      });
    });
  }

  pause(): void {
    if (!this.hasAttribute('paused')) this.setAttribute('paused', '');
  }

  replay(): void {
    this.play();
  }

  refresh(): void {
    this._syncItems();
    this._syncRuntimeStyles();
    this._syncTrigger();

    if (this._phase === 'complete') this._setPhase('complete');
    else if (this._phase === 'running' && !this.hasAttribute('paused')) this._scheduleCompletion(this._totalAnimationMs());

    this._autoStartIfNeeded();
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="surface" part="surface">
          <div class="list" part="list">
            <slot></slot>
          </div>
        </div>
      </div>
    `);

    this._slotEl = this.root.querySelector('slot');
    this._slotEl?.addEventListener('slotchange', this._boundSlotChange);
    this._syncRuntimeStyles();
    this._syncItems();
    this._syncTrigger();
    this._autoStartIfNeeded();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  private _handleSlotChange(): void {
    this._syncItems();
    if (this._phase === 'complete') this._setPhase('complete');
    this._autoStartIfNeeded();
  }

  private _handleReducedMotionChange(): void {
    if (this._prefersReducedMotion()) {
      this._clearTimers();
      this._setPhase('complete');
      return;
    }
    this._autoStartIfNeeded();
  }

  private _bindReducedMotionWatcher(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    if (this._mediaQuery) return;
    this._mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._mediaQuery.addEventListener?.('change', this._boundReducedMotionChange);
    this._mediaQuery.addListener?.(this._boundReducedMotionChange);
  }

  private _prefersReducedMotion(): boolean {
    return !!this._mediaQuery?.matches;
  }

  private _itemsFromSlot(): HTMLElement[] {
    if (!this._slotEl) return [];
    return this._slotEl
      .assignedElements({ flatten: true })
      .filter((node): node is HTMLElement => node instanceof HTMLElement);
  }

  private _syncItems(): void {
    const nextItems = this._itemsFromSlot();
    const nextSet = new Set(nextItems);

    for (const item of this._items) {
      if (nextSet.has(item)) continue;
      item.style.removeProperty('--ui-animated-list-index');
      item.removeAttribute('data-ui-animated-list-managed');
      if (item.hasAttribute('data-ui-animated-list-owned')) {
        item.removeAttribute('data-ui-animated-list-item');
        item.removeAttribute('data-ui-animated-list-owned');
      }
    }

    nextItems.forEach((item, index) => {
      item.setAttribute('data-ui-animated-list-managed', '');
      if (!item.hasAttribute('data-ui-animated-list-item')) {
        item.setAttribute('data-ui-animated-list-item', '');
        item.setAttribute('data-ui-animated-list-owned', '');
      }
      item.style.setProperty('--ui-animated-list-index', String(index));
    });

    this._items = nextItems;
    if (!this._items.length) this._setPhase('complete');
  }

  private _syncRuntimeStyles(): void {
    this.style.setProperty('--ui-animated-list-duration', normalizeTime(this.getAttribute('duration'), DEFAULT_DURATION));
    this.style.setProperty('--ui-animated-list-stagger', normalizeTime(this.getAttribute('stagger'), DEFAULT_STAGGER));
    this.style.setProperty('--ui-animated-list-delay', normalizeTime(this.getAttribute('delay'), DEFAULT_DELAY));

    const padding = normalizeLength(this.getAttribute('padding'));
    if (padding) this.style.setProperty('--ui-animated-list-padding', padding);
    else this.style.removeProperty('--ui-animated-list-padding');

    const gap = normalizeLength(this.getAttribute('gap'));
    if (gap) this.style.setProperty('--ui-animated-list-gap', gap);
    else this.style.removeProperty('--ui-animated-list-gap');

    const radius = this.getAttribute('radius');
    if (!radius || SEMANTIC_RADIUS_VALUES.has(radius.trim())) {
      this.style.removeProperty('--ui-animated-list-radius');
      this.style.removeProperty('--ui-animated-list-item-radius');
      return;
    }

    const normalizedRadius = normalizeLength(radius);
    if (normalizedRadius) {
      this.style.setProperty('--ui-animated-list-radius', normalizedRadius);
      this.style.setProperty('--ui-animated-list-item-radius', normalizedRadius);
    } else {
      this.style.removeProperty('--ui-animated-list-radius');
      this.style.removeProperty('--ui-animated-list-item-radius');
    }
  }

  private _trigger(): AnimatedListTrigger {
    const raw = this.getAttribute('trigger');
    return raw && TRIGGERS.has(raw as AnimatedListTrigger) ? (raw as AnimatedListTrigger) : 'load';
  }

  private _hasLoop(): boolean {
    return this.hasAttribute('loop');
  }

  private _animationPreset(): AnimatedListAnimation {
    const raw = this.getAttribute('animation');
    return raw && ANIMATIONS.has(raw as AnimatedListAnimation) ? (raw as AnimatedListAnimation) : 'smooth';
  }

  private _motionProfile() {
    switch (this._animationPreset()) {
      case 'calm':
        return {
          durationScale: 1.12,
          distanceScale: 0.78,
          blurScale: 0.75,
          rotateScale: 0.82,
          overshootY: -1,
          overshootScale: 1.01,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        };
      case 'snappy':
        return {
          durationScale: 0.88,
          distanceScale: 1.12,
          blurScale: 0.92,
          rotateScale: 1.08,
          overshootY: -2.5,
          overshootScale: 1.028,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        };
      case 'bouncy':
        return {
          durationScale: 1.08,
          distanceScale: 1.18,
          blurScale: 1,
          rotateScale: 1.18,
          overshootY: -4,
          overshootScale: 1.05,
          easing: 'cubic-bezier(0.2, 1.18, 0.28, 1)',
        };
      case 'smooth':
      default:
        return {
          durationScale: 1,
          distanceScale: 1,
          blurScale: 1,
          rotateScale: 1,
          overshootY: -2,
          overshootScale: 1.02,
          easing: 'cubic-bezier(0.2, 0.9, 0.24, 1)',
        };
    }
  }

  private _loopDelayMs(): number {
    return parseTimeToMs(this.getAttribute('loop-delay'), DEFAULT_LOOP_DELAY);
  }

  private _totalAnimationMs(): number {
    const count = Math.max(this._items.length, 1);
    const duration =
      parseTimeToMs(this.getAttribute('duration'), parseTimeToMs(DEFAULT_DURATION, 520)) *
      this._motionProfile().durationScale;
    const stagger = parseTimeToMs(this.getAttribute('stagger'), parseTimeToMs(DEFAULT_STAGGER, 90));
    const delay = parseTimeToMs(this.getAttribute('delay'), parseTimeToMs(DEFAULT_DELAY, 0));
    return Math.max(0, delay + duration + stagger * Math.max(0, count - 1));
  }

  private _scheduleCompletion(durationMs: number): void {
    this._clearCompletionTimer();
    if (this.hasAttribute('paused')) {
      this._completionRemaining = durationMs;
      return;
    }

    this._completionRemaining = durationMs;
    if (durationMs <= 0) {
      queueMicrotask(() => this._completeRun());
      return;
    }

    this._completionStartedAt = Date.now();
    const token = this._playToken;
    this._completionTimer = setTimeout(() => {
      if (token !== this._playToken) return;
      this._completionTimer = null;
      this._completionRemaining = 0;
      this._completeRun();
    }, durationMs);
  }

  private _scheduleLoop(delayMs: number): void {
    this._clearLoopTimer();
    if (!this._hasLoop() || this.hasAttribute('paused')) {
      this._loopRemaining = delayMs;
      return;
    }

    this._loopRemaining = delayMs;
    if (delayMs <= 0) {
      queueMicrotask(() => this.replay());
      return;
    }

    this._loopStartedAt = Date.now();
    const token = this._playToken;
    this._loopTimer = setTimeout(() => {
      if (token !== this._playToken) return;
      this._loopTimer = null;
      this._loopRemaining = 0;
      this.replay();
    }, delayMs);
  }

  private _completeRun(): void {
    this._setPhase('complete');
    if (this._hasLoop() && !this._prefersReducedMotion()) this._scheduleLoop(this._loopDelayMs());
  }

  private _pauseTimers(): void {
    if (this._completionTimer) {
      const elapsed = Date.now() - this._completionStartedAt;
      this._completionRemaining = Math.max(0, this._completionRemaining - elapsed);
      this._clearCompletionTimer();
    }

    if (this._loopTimer) {
      const elapsed = Date.now() - this._loopStartedAt;
      this._loopRemaining = Math.max(0, this._loopRemaining - elapsed);
      this._clearLoopTimer();
    }
  }

  private _resumeTimers(): void {
    if (this._phase === 'running') {
      if (this._completionRemaining > 0) this._scheduleCompletion(this._completionRemaining);
      else this._scheduleCompletion(this._totalAnimationMs());
      return;
    }

    if (this._phase === 'complete' && this._hasLoop()) {
      if (this._loopRemaining > 0) this._scheduleLoop(this._loopRemaining);
      else this._scheduleLoop(this._loopDelayMs());
    }
  }

  private _clearTimers(): void {
    this._playToken += 1;
    this._clearAnimations();
    this._clearCompletionTimer();
    this._clearLoopTimer();
    if (this._rafA) cancelAnimationFrame(this._rafA);
    if (this._rafB) cancelAnimationFrame(this._rafB);
    this._rafA = 0;
    this._rafB = 0;
    this._completionRemaining = 0;
    this._loopRemaining = 0;
  }

  private _clearCompletionTimer(): void {
    if (!this._completionTimer) return;
    clearTimeout(this._completionTimer);
    this._completionTimer = null;
  }

  private _clearLoopTimer(): void {
    if (!this._loopTimer) return;
    clearTimeout(this._loopTimer);
    this._loopTimer = null;
  }

  private _setPhase(phase: 'idle' | 'ready' | 'running' | 'complete'): void {
    this._phase = phase;
    this.setAttribute('data-phase', phase);
    this._syncStateAttributes();
  }

  private _syncStateAttributes(): void {
    const isPausedState = this.hasAttribute('paused') && (this._phase === 'running' || this._loopRemaining > 0);
    this.setAttribute('data-state', isPausedState ? 'paused' : this._phase);
  }

  private _syncTrigger(): void {
    if (this._trigger() !== 'visible') {
      this._disconnectIntersectionObserver();
      this._inView = true;
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      this._inView = true;
      return;
    }

    this._disconnectIntersectionObserver();
    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        this._inView = entry.isIntersecting && entry.intersectionRatio >= parseThreshold(this.getAttribute('threshold'));
        if (this._inView) this._autoStartIfNeeded();
      },
      { threshold: [0, parseThreshold(this.getAttribute('threshold')), 1] }
    );
    this._intersectionObserver.observe(this);
  }

  private _disconnectIntersectionObserver(): void {
    this._intersectionObserver?.disconnect();
    this._intersectionObserver = null;
  }

  private _autoStartIfNeeded(): void {
    if (!this.isConnected || this.hasAttribute('paused')) return;
    if (this._prefersReducedMotion()) {
      this._setPhase('complete');
      return;
    }
    if (this._trigger() === 'manual') {
      if (this._phase === 'idle') this._setPhase('ready');
      return;
    }
    if (this._trigger() === 'visible' && !this._inView) {
      if (this._phase === 'idle') this._setPhase('ready');
      return;
    }
    if (!this._hasTriggeredOnce) this.play();
  }

  private _pauseAnimations(): void {
    for (const animation of this._animations) {
      try {
        animation.pause();
      } catch {
        // no-op
      }
    }
  }

  private _resumeAnimations(): void {
    for (const animation of this._animations) {
      try {
        animation.play();
      } catch {
        // no-op
      }
    }
  }

  private _clearAnimations(): void {
    for (const animation of this._animations) {
      try {
        animation.cancel();
      } catch {
        // no-op
      }
    }
    this._animations = [];
  }

  private _effectKeyframes(): Keyframe[] {
    const effect = this.getAttribute('effect');
    const motion = this._motionProfile();
    const distance = motion.distanceScale;
    const blur = 12 * motion.blurScale;
    const rotate = motion.rotateScale;
    switch (effect) {
      case 'fade-down':
        return [
          { opacity: 0, transform: `translate3d(0, ${-18 * distance}px, 0)`, filter: 'none' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)', filter: 'none' },
        ];
      case 'slide-left':
        return [
          { opacity: 0, transform: `translate3d(${28 * distance}px, 0, 0)`, filter: 'none' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)', filter: 'none' },
        ];
      case 'slide-right':
        return [
          { opacity: 0, transform: `translate3d(${-28 * distance}px, 0, 0)`, filter: 'none' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)', filter: 'none' },
        ];
      case 'scale-in':
        return [
          { opacity: 0, transform: `translate3d(0, ${10 * distance}px, 0) scale(${1 - 0.06 * distance})`, filter: 'none' },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', filter: 'none' },
        ];
      case 'blur-in':
        return [
          {
            opacity: 0,
            transform: `translate3d(0, ${14 * distance}px, 0) scale(${1 - 0.02 * distance})`,
            filter: `blur(${blur}px)`,
          },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', filter: 'blur(0)' },
        ];
      case 'pop':
        return [
          { opacity: 0, transform: `translate3d(0, ${8 * distance}px, 0) scale(${1 - 0.12 * distance})`, filter: 'none', offset: 0 },
          {
            opacity: 1,
            transform: `translate3d(0, ${motion.overshootY}px, 0) scale(${motion.overshootScale})`,
            filter: 'none',
            offset: 0.6,
          },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', filter: 'none', offset: 1 },
        ];
      case 'flip-in':
        return [
          {
            opacity: 0,
            transform: `perspective(900px) rotateX(${-18 * rotate}deg) translate3d(0, ${14 * distance}px, 0)`,
            filter: 'none',
          },
          { opacity: 1, transform: 'perspective(900px) rotateX(0deg) translate3d(0, 0, 0)', filter: 'none' },
        ];
      case 'rotate-in':
        return [
          {
            opacity: 0,
            transform: `translate3d(0, ${12 * distance}px, 0) rotate(${-10 * rotate}deg) scale(${1 - 0.03 * distance})`,
            filter: 'none',
          },
          { opacity: 1, transform: 'translate3d(0, 0, 0) rotate(0deg) scale(1)', filter: 'none' },
        ];
      case 'tilt-in':
        return [
          {
            opacity: 0,
            transform: `perspective(900px) rotateY(${-14 * rotate}deg) translate3d(0, ${12 * distance}px, 0)`,
            filter: 'none',
          },
          { opacity: 1, transform: 'perspective(900px) rotateY(0deg) translate3d(0, 0, 0)', filter: 'none' },
        ];
      case 'float-up':
        return [
          { opacity: 0, transform: `translate3d(0, ${26 * distance}px, 0) scale(${1 - 0.015 * distance})`, filter: 'none', offset: 0 },
          {
            opacity: 1,
            transform: `translate3d(0, ${Math.min(motion.overshootY, -1)}px, 0) scale(${Math.max(1.01, motion.overshootScale - 0.005)})`,
            filter: 'none',
            offset: 0.62,
          },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)', filter: 'none', offset: 1 },
        ];
      case 'swing-in':
        return [
          { opacity: 0, transform: `translate3d(${-16 * distance}px, 0, 0) rotate(${-7 * rotate}deg)`, filter: 'none', offset: 0 },
          { opacity: 1, transform: 'translate3d(1px, 0, 0) rotate(1deg)', filter: 'none', offset: 0.7 },
          { opacity: 1, transform: 'translate3d(0, 0, 0) rotate(0deg)', filter: 'none', offset: 1 },
        ];
      case 'fade-up':
      default:
        return [
          { opacity: 0, transform: `translate3d(0, ${18 * distance}px, 0)`, filter: 'none' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)', filter: 'none' },
        ];
    }
  }

  private _startAnimations(): void {
    this._clearAnimations();
    if (typeof this._items[0]?.animate !== 'function') return;

    const motion = this._motionProfile();
    const duration =
      parseTimeToMs(this.getAttribute('duration'), parseTimeToMs(DEFAULT_DURATION, 520)) * motion.durationScale;
    const stagger = parseTimeToMs(this.getAttribute('stagger'), parseTimeToMs(DEFAULT_STAGGER, 90));
    const delay = parseTimeToMs(this.getAttribute('delay'), parseTimeToMs(DEFAULT_DELAY, 0));
    const keyframes = this._effectKeyframes();

    this._animations = this._items.map((item, index) => {
      item.style.animation = 'none';
      const animation = item.animate(keyframes, {
        duration,
        delay: delay + index * stagger,
        fill: 'both',
        easing: motion.easing,
      });
      if (this.hasAttribute('paused')) {
        try {
          animation.pause();
        } catch {
          // no-op
        }
      }
      return animation;
    });
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-animated-list')) {
  customElements.define('ui-animated-list', UIAnimatedList);
}
