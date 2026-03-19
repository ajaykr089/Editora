import { ElementBase } from '../ElementBase';

type AnimatedTextEffect =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'blur'
  | 'blur-up'
  | 'pop'
  | 'wave'
  | 'zoom-in'
  | 'rotate-in'
  | 'flip-up'
  | 'skew-in'
  | 'glow'
  | 'typewriter';

type AnimatedTextSplit = 'chars' | 'words' | 'lines';
type AnimatedTextTrigger = 'load' | 'visible' | 'manual';

type SegmentToken = {
  text: string;
  animated: boolean;
  line: boolean;
};

const DEFAULT_DURATION = '720ms';
const DEFAULT_STAGGER = '55ms';
const DEFAULT_DELAY = '0ms';
const DEFAULT_LOOP_DELAY = 1400;

const EFFECTS = new Set<AnimatedTextEffect>([
  'fade-up',
  'fade-down',
  'slide-left',
  'slide-right',
  'blur',
  'blur-up',
  'pop',
  'wave',
  'zoom-in',
  'rotate-in',
  'flip-up',
  'skew-in',
  'glow',
  'typewriter',
]);

const SPLITS = new Set<AnimatedTextSplit>(['chars', 'words', 'lines']);
const TRIGGERS = new Set<AnimatedTextTrigger>(['load', 'visible', 'manual']);
const SEMANTIC_RADIUS_VALUES = new Set(['none', 'sm', 'md', 'lg', 'full']);

const style = `
  :host {
    --ui-animated-text-duration: ${DEFAULT_DURATION};
    --ui-animated-text-stagger: ${DEFAULT_STAGGER};
    --ui-animated-text-delay: ${DEFAULT_DELAY};
    --ui-animated-text-gap-inline: 0;
    --ui-animated-text-gap-block: 0.18em;
    --ui-animated-text-padding-inline: 0px;
    --ui-animated-text-padding-block: 0px;
    --ui-animated-text-radius: var(--base-animated-text-radius, 22px);
    --ui-animated-text-bg: transparent;
    --ui-animated-text-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-animated-text-border: 1px solid transparent;
    --ui-animated-text-shadow: none;
    --ui-animated-text-backdrop: none;
    --ui-animated-text-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-animated-text-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    --ui-animated-text-font-size: 1.375rem;
    --ui-animated-text-line-height: 1.08;
    --ui-animated-text-letter-spacing: -0.03em;
    --ui-animated-text-font-weight: 700;
    --ui-animated-text-align: start;
    --ui-animated-text-max-inline-size: 100%;
    --ui-animated-text-ease: cubic-bezier(0.2, 0.9, 0.24, 1);
    --ui-animated-text-caret-color: currentColor;
    --ui-animated-text-safe-inline-end: 0.08em;
    --ui-animated-text-safe-block-end: 0.12em;
    display: block;
    min-inline-size: 0;
    max-inline-size: var(--ui-animated-text-max-inline-size);
    color-scheme: light dark;
    color: var(--ui-animated-text-color);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-sizing: border-box;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-animated-text-font-size: 1rem;
    --ui-animated-text-line-height: 1.18;
    --ui-animated-text-letter-spacing: -0.012em;
    --ui-animated-text-font-weight: 650;
    --ui-animated-text-safe-inline-end: 0.04em;
    --ui-animated-text-safe-block-end: 0.08em;
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-animated-text-font-size: 1.375rem;
    --ui-animated-text-line-height: 1.08;
    --ui-animated-text-letter-spacing: -0.03em;
    --ui-animated-text-font-weight: 700;
    --ui-animated-text-safe-inline-end: 0.08em;
    --ui-animated-text-safe-block-end: 0.12em;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-animated-text-font-size: clamp(1.8rem, 2.6vw, 2.5rem);
    --ui-animated-text-line-height: 1.02;
    --ui-animated-text-letter-spacing: -0.04em;
    --ui-animated-text-font-weight: 760;
    --ui-animated-text-safe-inline-end: 0.1em;
    --ui-animated-text-safe-block-end: 0.14em;
  }

  :host([size="xl"]),
  :host([size="4"]) {
    --ui-animated-text-font-size: clamp(2.5rem, 5vw, 4.5rem);
    --ui-animated-text-line-height: 0.98;
    --ui-animated-text-letter-spacing: -0.055em;
    --ui-animated-text-font-weight: 800;
    --ui-animated-text-safe-inline-end: 0.12em;
    --ui-animated-text-safe-block-end: 0.16em;
  }

  :host([tone="neutral"]) {
    --ui-animated-text-accent: #64748b;
  }

  :host([tone="info"]) {
    --ui-animated-text-accent: #0ea5e9;
  }

  :host([tone="success"]) {
    --ui-animated-text-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-animated-text-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-animated-text-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="soft"]) {
    --ui-animated-text-color:
      color-mix(in srgb, var(--ui-animated-text-accent) 72%, var(--ui-color-text, var(--ui-text, #0f172a)));
    --ui-animated-text-bg:
      color-mix(in srgb, var(--ui-animated-text-accent) 8%, var(--ui-color-surface, #ffffff));
    --ui-animated-text-border:
      1px solid color-mix(in srgb, var(--ui-animated-text-accent) 18%, transparent);
    --ui-animated-text-padding-inline: 0.34em;
    --ui-animated-text-padding-block: 0.16em;
  }

  :host([variant="solid"]) {
    --ui-animated-text-color: color-mix(in srgb, var(--ui-animated-text-accent) 88%, #061221);
    --ui-animated-text-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-animated-text-accent) 12%, var(--ui-color-surface, #ffffff)),
        color-mix(in srgb, var(--ui-animated-text-accent) 5%, var(--ui-color-surface, #ffffff))
      );
    --ui-animated-text-border:
      1px solid color-mix(in srgb, var(--ui-animated-text-accent) 24%, transparent);
    --ui-animated-text-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 18px 34px color-mix(in srgb, var(--ui-animated-text-accent) 9%, rgba(15, 23, 42, 0.08));
    --ui-animated-text-padding-inline: 0.42em;
    --ui-animated-text-padding-block: 0.18em;
  }

  :host([variant="contrast"]) {
    --ui-animated-text-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #04111f 88%, var(--ui-animated-text-accent) 12%),
        color-mix(in srgb, #0a2344 84%, var(--ui-animated-text-accent) 16%)
      );
    --ui-animated-text-color: #f8fbff;
    --ui-animated-text-border:
      1px solid color-mix(in srgb, #ffffff 14%, transparent);
    --ui-animated-text-shadow:
      0 2px 10px rgba(2, 6, 23, 0.18),
      0 26px 54px rgba(2, 6, 23, 0.3);
    --ui-animated-text-caret-color: #f8fbff;
    --ui-animated-text-padding-inline: 0.42em;
    --ui-animated-text-padding-block: 0.18em;
  }

  :host([variant="gradient"]) {
    --ui-animated-text-bg: transparent;
    --ui-animated-text-border: none;
    --ui-animated-text-shadow: none;
    --ui-animated-text-color: var(--ui-color-text, var(--ui-text, #0f172a));
  }

  :host([variant="minimal"]) {
    --ui-animated-text-color:
      color-mix(in srgb, var(--ui-animated-text-accent) 84%, var(--ui-color-text, var(--ui-text, #0f172a)));
    --ui-animated-text-bg: transparent;
    --ui-animated-text-border: none;
    --ui-animated-text-shadow: none;
    --ui-animated-text-padding-inline: 0px;
    --ui-animated-text-padding-block: 0px;
  }

  :host([radius="none"]) {
    --ui-animated-text-radius: 0px;
  }

  :host([radius="sm"]) {
    --ui-animated-text-radius: 12px;
  }

  :host([radius="md"]) {
    --ui-animated-text-radius: 18px;
  }

  :host([radius="lg"]) {
    --ui-animated-text-radius: 26px;
  }

  :host([radius="full"]) {
    --ui-animated-text-radius: 999px;
  }

  :host([elevation="none"]) {
    --ui-animated-text-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-animated-text-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 16px 30px rgba(15, 23, 42, 0.08);
  }

  :host([elevation="high"]) {
    --ui-animated-text-shadow:
      0 2px 8px rgba(15, 23, 42, 0.08),
      0 28px 54px rgba(15, 23, 42, 0.16);
  }

  :host([align="center"]) {
    --ui-animated-text-align: center;
  }

  :host([align="right"]),
  :host([align="end"]) {
    --ui-animated-text-align: end;
  }

  .root {
    display: block;
    min-inline-size: 0;
  }

  .surface {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    max-inline-size: 100%;
    overflow: visible;
    padding:
      var(
        --ui-animated-text-padding,
        var(--ui-animated-text-padding-block) var(--ui-animated-text-padding-inline)
      );
    border-radius: var(--ui-animated-text-radius);
    background: var(--ui-animated-text-bg);
    color: var(--ui-animated-text-color);
    border: var(--ui-animated-text-border);
    box-shadow: var(--ui-animated-text-shadow);
    backdrop-filter: var(--ui-animated-text-backdrop);
    box-sizing: border-box;
    transition:
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      backdrop-filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  .content {
    position: relative;
    display: inline-flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: var(--ui-animated-text-gap-block) var(--ui-animated-text-gap-inline);
    min-inline-size: 0;
    max-inline-size: 100%;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    overflow: visible;
    padding-inline-end: var(--ui-animated-text-safe-inline-end);
    padding-block-end: var(--ui-animated-text-safe-block-end);
    margin-inline-end: calc(var(--ui-animated-text-safe-inline-end) * -1);
    margin-block-end: calc(var(--ui-animated-text-safe-block-end) * -1);
    font-size: var(--ui-animated-text-font-size);
    line-height: var(--ui-animated-text-line-height);
    letter-spacing: var(--ui-animated-text-letter-spacing);
    font-weight: var(--ui-animated-text-font-weight);
    text-align: var(--ui-animated-text-align);
    color: inherit;
  }

  .content[data-split="lines"] {
    display: grid;
    justify-items: start;
    gap: 0.12em;
  }

  .content[data-split="lines"][data-align="center"] {
    justify-items: center;
  }

  .content[data-split="lines"][data-align="end"] {
    justify-items: end;
  }

  .segment {
    display: inline-block;
    min-inline-size: 0;
    white-space: pre-wrap;
    overflow: visible;
    padding-inline-end: calc(var(--ui-animated-text-safe-inline-end) * 0.82);
    padding-block-end: calc(var(--ui-animated-text-safe-block-end) * 0.9);
    margin-inline-end: calc(var(--ui-animated-text-safe-inline-end) * -0.82);
    margin-block-end: calc(var(--ui-animated-text-safe-block-end) * -0.9);
    transform-origin: center 80%;
    will-change: transform, opacity, filter;
    animation-duration: var(--ui-animated-text-duration);
    animation-delay: calc(
      var(--ui-animated-text-delay) + var(--ui-animated-text-index, 0) * var(--ui-animated-text-stagger)
    );
    animation-timing-function: var(--ui-animated-text-animation-timing, var(--ui-animated-text-ease));
    animation-direction: var(--ui-animated-text-animation-direction, normal);
    animation-iteration-count: var(--ui-animated-text-animation-iteration-count, 1);
    animation-fill-mode: var(--ui-animated-text-animation-fill-mode, both);
    animation-play-state: running;
  }

  .segment[data-line="true"] {
    display: block;
  }

  .segment[data-space="true"] {
    padding-inline-end: 0;
    padding-block-end: 0;
    margin-inline-end: 0;
    margin-block-end: 0;
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    will-change: auto;
  }

  .content[data-hidden="true"] {
    visibility: hidden;
  }

  .content[data-animate="false"] .segment:not([data-space="true"]) {
    opacity: 1;
    transform: none;
    filter: none;
    animation: none;
  }

  .content[data-paused="true"] .segment:not([data-space="true"]) {
    opacity: 1;
    transform: none;
    filter: none;
    animation-play-state: paused;
  }

  .content[data-animate="true"] .segment:not([data-space="true"]) {
    opacity: 0;
  }

  .content[data-animate="true"][data-effect="fade-up"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-fade-up;
  }

  .content[data-animate="true"][data-effect="fade-down"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-fade-down;
  }

  .content[data-animate="true"][data-effect="slide-left"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-slide-left;
  }

  .content[data-animate="true"][data-effect="slide-right"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-slide-right;
  }

  .content[data-animate="true"][data-effect="blur"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-blur;
  }

  .content[data-animate="true"][data-effect="blur-up"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-blur-up;
  }

  .content[data-animate="true"][data-effect="pop"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-pop;
  }

  .content[data-animate="true"][data-effect="wave"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-wave;
  }

  .content[data-animate="true"][data-effect="zoom-in"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-zoom-in;
  }

  .content[data-animate="true"][data-effect="rotate-in"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-rotate-in;
  }

  .content[data-animate="true"][data-effect="flip-up"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-flip-up;
  }

  .content[data-animate="true"][data-effect="skew-in"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-skew-in;
  }

  .content[data-animate="true"][data-effect="glow"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-glow;
  }

  .content[data-animate="true"][data-effect="typewriter"] .segment:not([data-space="true"]) {
    animation-name: ui-animated-text-typewriter;
    animation-timing-function: var(--ui-animated-text-animation-timing, steps(2, end));
  }

  .content[data-animate="true"][data-effect="custom"] .segment:not([data-space="true"]) {
    animation-name: var(--ui-animated-text-custom-animation-name);
  }

  .content[data-variant="gradient"] .segment:not([data-space="true"]) {
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--ui-animated-text-accent) 96%, #ffffff 4%),
        color-mix(in srgb, var(--ui-animated-text-accent) 58%, #0f172a 42%)
      );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .caret {
    align-self: stretch;
    inline-size: 0.08em;
    margin-inline-start: 0.08em;
    border-radius: 999px;
    background: var(--ui-animated-text-caret-color);
    opacity: 0;
  }

  .content[data-effect="typewriter"][data-animate="true"] + .caret {
    opacity: 1;
    animation: ui-animated-text-caret 920ms steps(1, end) infinite;
  }

  .content[data-effect="typewriter"][data-paused="true"] + .caret {
    animation-play-state: paused;
    opacity: 0.65;
  }

  :host(:focus-visible) .surface {
    outline: none;
    border-color: color-mix(in srgb, var(--ui-animated-text-focus-ring) 24%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-animated-text-focus-ring) 18%, transparent),
      var(--ui-animated-text-shadow);
  }

  @keyframes ui-animated-text-fade-up {
    from {
      opacity: 0;
      transform: translate3d(0, 0.58em, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-text-fade-down {
    from {
      opacity: 0;
      transform: translate3d(0, -0.58em, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-text-slide-left {
    from {
      opacity: 0;
      transform: translate3d(0.72em, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-text-slide-right {
    from {
      opacity: 0;
      transform: translate3d(-0.72em, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-text-blur {
    from {
      opacity: 0;
      filter: blur(14px);
      transform: translate3d(0, 0.28em, 0) scale(0.98);
    }
    to {
      opacity: 1;
      filter: blur(0);
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes ui-animated-text-blur-up {
    from {
      opacity: 0;
      filter: blur(18px);
      transform: translate3d(0, 0.42em, 0) scale(0.95);
    }
    to {
      opacity: 1;
      filter: blur(0);
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes ui-animated-text-pop {
    from {
      opacity: 0;
      transform: translate3d(0, 0.16em, 0) scale(0.84);
    }
    72% {
      opacity: 1;
      transform: translate3d(0, -0.02em, 0) scale(1.04);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes ui-animated-text-wave {
    from {
      opacity: 0;
      transform: translate3d(0, 0.7em, 0) rotate(10deg) scale(0.96);
    }
    55% {
      opacity: 1;
      transform: translate3d(0, -0.08em, 0) rotate(-3deg) scale(1.01);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    }
  }

  @keyframes ui-animated-text-zoom-in {
    from {
      opacity: 0;
      transform: translate3d(0, 0.12em, 0) scale(0.72);
    }
    70% {
      opacity: 1;
      transform: translate3d(0, -0.02em, 0) scale(1.03);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes ui-animated-text-rotate-in {
    from {
      opacity: 0;
      transform: translate3d(0, 0.18em, 0) rotate(-12deg) scale(0.94);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg) scale(1);
    }
  }

  @keyframes ui-animated-text-flip-up {
    from {
      opacity: 0;
      transform: perspective(560px) rotateX(76deg) translate3d(0, 0.4em, 0);
    }
    65% {
      opacity: 1;
      transform: perspective(560px) rotateX(-8deg) translate3d(0, -0.03em, 0);
    }
    to {
      opacity: 1;
      transform: perspective(560px) rotateX(0deg) translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-text-skew-in {
    from {
      opacity: 0;
      transform: translate3d(0, 0.28em, 0) skewY(10deg) scaleX(0.94);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) skewY(0deg) scaleX(1);
    }
  }

  @keyframes ui-animated-text-glow {
    from {
      opacity: 0;
      filter: blur(10px) brightness(1.7);
      transform: translate3d(0, 0.1em, 0) scale(0.98);
    }
    to {
      opacity: 1;
      filter: blur(0) brightness(1);
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes ui-animated-text-typewriter {
    from {
      opacity: 0;
      transform: translate3d(0, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes ui-animated-text-caret {
    0%, 46% {
      opacity: 1;
    }
    47%, 100% {
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .segment,
    .caret {
      animation: none !important;
      transition: none !important;
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .surface {
      outline: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    }
  }

  @media (forced-colors: active) {
    .surface {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
      box-shadow: none;
    }

    .content[data-variant="gradient"] .segment:not([data-space="true"]) {
      background: none;
      color: CanvasText;
    }

    .caret {
      background: CanvasText;
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;')
    .split("'").join('&#39;');
}

function isWhitespace(value: string): boolean {
  return /^\s+$/.test(value);
}

function normalizeTimeValue(value: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized) return null;
  if (/^-?\d+(\.\d+)?$/.test(normalized)) return `${normalized}ms`;
  if (/^-?\d+(\.\d+)?m?s$/.test(normalized)) return normalized;
  return null;
}

function normalizeLengthValue(value: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim();
  if (!normalized) return null;
  const parts = normalized.split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return parts
    .map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? `${part}px` : part))
    .join(' ');
}

function parsePositiveMilliseconds(value: string | null, fallback: number): number {
  const normalized = normalizeTimeValue(value);
  if (!normalized) return fallback;

  if (normalized.endsWith('ms')) {
    const parsed = Number.parseFloat(normalized.slice(0, -2));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }

  if (normalized.endsWith('s')) {
    const parsed = Number.parseFloat(normalized.slice(0, -1));
    return Number.isFinite(parsed) && parsed >= 0 ? parsed * 1000 : fallback;
  }

  return fallback;
}

function segmentCharacters(value: string): string[] {
  const SegmenterCtor = (
    globalThis.Intl as typeof Intl & {
      Segmenter?: new (
        locales?: string | string[],
        options?: { granularity: string }
      ) => { segment(input: string): Iterable<{ segment: string }> };
    }
  ).Segmenter;
  if (typeof SegmenterCtor === 'function') {
    const segmenter = new SegmenterCtor(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(value), (part) => part.segment);
  }
  return Array.from(value);
}

function segmentWords(value: string): string[] {
  const SegmenterCtor = (
    globalThis.Intl as typeof Intl & {
      Segmenter?: new (
        locales?: string | string[],
        options?: { granularity: string }
      ) => { segment(input: string): Iterable<{ segment: string }> };
    }
  ).Segmenter;
  if (typeof SegmenterCtor === 'function') {
    const segmenter = new SegmenterCtor(undefined, { granularity: 'word' });
    return Array.from(segmenter.segment(value), (part) => part.segment).filter(Boolean);
  }
  return value.split(/(\s+)/).filter(Boolean);
}

function tokenizeText(value: string, split: AnimatedTextSplit): SegmentToken[] {
  if (!value) return [];

  if (split === 'lines') {
    return value.split(/\r\n|\r|\n/).map((line) => ({
      text: line || '\u00A0',
      animated: Boolean(line.trim()),
      line: true,
    }));
  }

  const parts = split === 'chars' ? segmentCharacters(value) : segmentWords(value);
  return parts.map((part) => ({
    text: part,
    animated: !isWhitespace(part),
    line: false,
  }));
}

function coerceEffect(value: string | null): AnimatedTextEffect {
  const normalized = (value || '').trim() as AnimatedTextEffect;
  return EFFECTS.has(normalized) ? normalized : 'fade-up';
}

type ResolvedAnimatedTextEffect =
  | { mode: 'builtin'; value: AnimatedTextEffect }
  | { mode: 'custom'; value: string };

function resolveEffectValue(effect: string | null, customEffect: string | null): ResolvedAnimatedTextEffect {
  const custom = (customEffect || '').trim();
  if (custom) return { mode: 'custom', value: custom };

  const normalized = (effect || '').trim();
  if (!normalized) return { mode: 'builtin', value: 'fade-up' };
  if (EFFECTS.has(normalized as AnimatedTextEffect)) {
    return { mode: 'builtin', value: normalized as AnimatedTextEffect };
  }
  return { mode: 'custom', value: normalized };
}

function coerceSplit(value: string | null, effect: AnimatedTextEffect): AnimatedTextSplit {
  if (effect === 'typewriter') return 'chars';
  const normalized = (value || '').trim() as AnimatedTextSplit;
  return SPLITS.has(normalized) ? normalized : 'words';
}

function coerceTrigger(value: string | null): AnimatedTextTrigger {
  const normalized = (value || '').trim() as AnimatedTextTrigger;
  return TRIGGERS.has(normalized) ? normalized : 'load';
}

export class UIAnimatedText extends ElementBase {
  static get observedAttributes() {
    return [
      'text',
      'effect',
      'split',
      'trigger',
      'duration',
      'stagger',
      'delay',
      'loop-delay',
      'paused',
      'loop',
      'custom-effect',
      'effect-timing',
      'effect-direction',
      'effect-iteration-count',
      'effect-fill-mode',
      'variant',
      'tone',
      'size',
      'radius',
      'padding',
      'elevation',
      'align',
    ];
  }

  private _sourceObserver: MutationObserver | null = null;
  private _intersectionObserver: IntersectionObserver | null = null;
  private _mediaQuery: MediaQueryList | null = null;
  private _loopTimer: number | null = null;
  private _visible = false;
  private _hasStarted = false;
  private _runId = 0;

  constructor() {
    super();
    this._handleSourceMutation = this._handleSourceMutation.bind(this);
    this._handleIntersection = this._handleIntersection.bind(this);
    this._handleReducedMotionChange = this._handleReducedMotionChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute('role', 'text');

    this._sourceObserver = new MutationObserver(this._handleSourceMutation);
    this._sourceObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    this._setupReducedMotionQuery();
    this._updateVisibilityObservation();
    this._syncHostStyles();

    queueMicrotask(() => {
      if (this._triggerMode() === 'load' && this._resolvedText().trim()) {
        this._startIfNeeded();
      } else {
        this._updateRuntimeState();
      }
      this._syncLoopTimer();
    });
  }

  override disconnectedCallback(): void {
    this._sourceObserver?.disconnect();
    this._sourceObserver = null;
    this._intersectionObserver?.disconnect();
    this._intersectionObserver = null;
    this._detachReducedMotionQuery();
    this._clearLoopTimer();
    super.disconnectedCallback();
  }

  get text(): string {
    return this.getAttribute('text') ?? this._sourceText();
  }

  set text(next: string) {
    if (!next) this.removeAttribute('text');
    else this.setAttribute('text', next);
  }

  pause(): void {
    if (!this.hasAttribute('paused')) {
      this.setAttribute('paused', '');
    } else {
      this._syncLoopTimer();
      this._updateRuntimeState();
    }
  }

  play(): void {
    if (this.hasAttribute('paused')) {
      this.removeAttribute('paused');
    }
    this._startIfNeeded();
    this._syncLoopTimer();
    this._updateRuntimeState();
  }

  replay(): void {
    if (!this._resolvedText().trim()) return;
    this._hasStarted = true;
    this._runId += 1;
    this.invalidateContentCache();
    this.requestRender();
    this._syncLoopTimer();
    this._updateRuntimeState();
  }

  refresh(): void {
    this.invalidateContentCache();
    this.requestRender();
    this._syncLoopTimer();
    this._updateRuntimeState();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'trigger') {
      this._updateVisibilityObservation();
      if (this._triggerMode() === 'load' && this._resolvedText().trim()) {
        this._startIfNeeded();
      }
    }

    if (name === 'text') {
      this._handleTextChange();
    }

    super.attributeChangedCallback(name, oldValue, newValue);

    this._syncHostStyles();
    this._syncLoopTimer();
    this._updateRuntimeState();
  }

  private _sourceText(): string {
    return this.textContent || '';
  }

  private _resolvedText(): string {
    return this.getAttribute('text') ?? this._sourceText();
  }

  private _resolvedEffect(): ResolvedAnimatedTextEffect {
    return resolveEffectValue(this.getAttribute('effect'), this.getAttribute('custom-effect'));
  }

  private _effect(): AnimatedTextEffect {
    const resolved = this._resolvedEffect();
    return resolved.mode === 'builtin' ? resolved.value : 'fade-up';
  }

  private _splitMode(): AnimatedTextSplit {
    return coerceSplit(this.getAttribute('split'), this._effect());
  }

  private _triggerMode(): AnimatedTextTrigger {
    return coerceTrigger(this.getAttribute('trigger'));
  }

  private _durationMs(): number {
    return parsePositiveMilliseconds(this.getAttribute('duration'), 720);
  }

  private _staggerMs(): number {
    return parsePositiveMilliseconds(this.getAttribute('stagger'), 55);
  }

  private _delayMs(): number {
    return parsePositiveMilliseconds(this.getAttribute('delay'), 0);
  }

  private _loopDelayMs(): number {
    const raw = this.getAttribute('loop-delay');
    if (!raw) return DEFAULT_LOOP_DELAY;
    const parsed = parsePositiveMilliseconds(raw, DEFAULT_LOOP_DELAY);
    return Math.max(0, parsed);
  }

  private _shouldLoop(): boolean {
    return this.hasAttribute('loop');
  }

  private _hiddenUntilStarted(): boolean {
    if (this._hasStarted) return false;
    const trigger = this._triggerMode();
    if (trigger === 'manual') return true;
    return trigger === 'visible' && !this._visible;
  }

  private _shouldAnimate(): boolean {
    return this._hasStarted && !this._isMotionReduced() && Boolean(this._resolvedText().trim());
  }

  private _isMotionReduced(): boolean {
    return Boolean(this._mediaQuery?.matches);
  }

  private _isMotionPaused(): boolean {
    if (!this._hasStarted) return false;
    if (this.hasAttribute('paused')) return true;
    if (this._isMotionReduced()) return true;
    if (this._triggerMode() === 'visible' && !this._visible) return true;
    return false;
  }

  private _currentAlignValue(): 'start' | 'center' | 'end' {
    const raw = (this.getAttribute('align') || '').trim().toLowerCase();
    if (raw === 'center') return 'center';
    if (raw === 'right' || raw === 'end') return 'end';
    return 'start';
  }

  private _countAnimatedSegments(text: string, split: AnimatedTextSplit): number {
    return tokenizeText(text, split).filter((token) => token.animated).length;
  }

  private _cycleDurationMs(text: string): number {
    const count = this._countAnimatedSegments(text, this._splitMode());
    if (count <= 0) return this._durationMs() + this._delayMs();
    return this._delayMs() + this._durationMs() + this._staggerMs() * Math.max(0, count - 1);
  }

  private _syncHostStyles(): void {
    const duration = normalizeTimeValue(this.getAttribute('duration'));
    const stagger = normalizeTimeValue(this.getAttribute('stagger'));
    const delay = normalizeTimeValue(this.getAttribute('delay'));
    const radius = this.getAttribute('radius');
    const padding = normalizeLengthValue(this.getAttribute('padding'));
    const effectTiming = (this.getAttribute('effect-timing') || '').trim();
    const effectDirection = (this.getAttribute('effect-direction') || '').trim();
    const effectIterationCount = (this.getAttribute('effect-iteration-count') || '').trim();
    const effectFillMode = (this.getAttribute('effect-fill-mode') || '').trim();
    const resolvedEffect = this._resolvedEffect();

    if (duration) this.style.setProperty('--ui-animated-text-duration', duration);
    else this.style.removeProperty('--ui-animated-text-duration');

    if (stagger) this.style.setProperty('--ui-animated-text-stagger', stagger);
    else this.style.removeProperty('--ui-animated-text-stagger');

    if (delay) this.style.setProperty('--ui-animated-text-delay', delay);
    else this.style.removeProperty('--ui-animated-text-delay');

    if (radius && !SEMANTIC_RADIUS_VALUES.has(radius)) {
      const normalizedRadius = normalizeLengthValue(radius);
      if (normalizedRadius) this.style.setProperty('--ui-animated-text-radius', normalizedRadius);
      else this.style.removeProperty('--ui-animated-text-radius');
    } else {
      this.style.removeProperty('--ui-animated-text-radius');
    }

    if (padding) this.style.setProperty('--ui-animated-text-padding', padding);
    else this.style.removeProperty('--ui-animated-text-padding');

    if (resolvedEffect.mode === 'custom' && resolvedEffect.value) {
      this.style.setProperty('--ui-animated-text-custom-animation-name', resolvedEffect.value);
    } else {
      this.style.removeProperty('--ui-animated-text-custom-animation-name');
    }

    if (effectTiming) this.style.setProperty('--ui-animated-text-animation-timing', effectTiming);
    else this.style.removeProperty('--ui-animated-text-animation-timing');

    if (effectDirection) this.style.setProperty('--ui-animated-text-animation-direction', effectDirection);
    else this.style.removeProperty('--ui-animated-text-animation-direction');

    if (effectIterationCount) this.style.setProperty('--ui-animated-text-animation-iteration-count', effectIterationCount);
    else this.style.removeProperty('--ui-animated-text-animation-iteration-count');

    if (effectFillMode) this.style.setProperty('--ui-animated-text-animation-fill-mode', effectFillMode);
    else this.style.removeProperty('--ui-animated-text-animation-fill-mode');
  }

  private _setupReducedMotionQuery(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    this._mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (typeof this._mediaQuery.addEventListener === 'function') {
      this._mediaQuery.addEventListener('change', this._handleReducedMotionChange);
      return;
    }

    this._mediaQuery.addListener(this._handleReducedMotionChange);
  }

  private _detachReducedMotionQuery(): void {
    if (!this._mediaQuery) return;

    if (typeof this._mediaQuery.removeEventListener === 'function') {
      this._mediaQuery.removeEventListener('change', this._handleReducedMotionChange);
    } else {
      this._mediaQuery.removeListener(this._handleReducedMotionChange);
    }

    this._mediaQuery = null;
  }

  private _handleReducedMotionChange(): void {
    this.invalidateContentCache();
    this.requestRender();
    this._syncLoopTimer();
    this._updateRuntimeState();
  }

  private _updateVisibilityObservation(): void {
    this._intersectionObserver?.disconnect();
    this._intersectionObserver = null;

    if (this._triggerMode() !== 'visible') {
      this._visible = true;
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      this._visible = true;
      return;
    }

    this._visible = false;
    this._intersectionObserver = new IntersectionObserver(this._handleIntersection, {
      threshold: 0.2,
    });
    this._intersectionObserver.observe(this);
  }

  private _handleIntersection(entries: IntersectionObserverEntry[]): void {
    const entry = entries[entries.length - 1];
    const nextVisible = Boolean(entry?.isIntersecting);
    if (this._visible === nextVisible) return;
    this._visible = nextVisible;

    if (this._visible) {
      this._startIfNeeded();
    } else {
      this._syncLoopTimer();
      this._updateRuntimeState();
      this.requestRender();
    }
  }

  private _handleSourceMutation(): void {
    if (this.hasAttribute('text')) return;
    this._handleTextChange();
  }

  private _handleTextChange(): void {
    const text = this._resolvedText();
    if (!text.trim()) {
      this._hasStarted = false;
      this._clearLoopTimer();
      this._updateRuntimeState();
      this.requestRender();
      return;
    }

    if (this._triggerMode() === 'manual' && !this._hasStarted) {
      this.invalidateContentCache();
      this.requestRender();
      this._updateRuntimeState();
      return;
    }

    if (this._triggerMode() === 'visible' && !this._visible && !this._hasStarted) {
      this.invalidateContentCache();
      this.requestRender();
      this._updateRuntimeState();
      return;
    }

    this._hasStarted = true;
    this._runId += 1;
    this.invalidateContentCache();
    this.requestRender();
    this._syncLoopTimer();
    this._updateRuntimeState();
  }

  private _startIfNeeded(): void {
    if (!this._resolvedText().trim()) {
      this._updateRuntimeState();
      return;
    }

    if (this._triggerMode() === 'visible' && !this._visible) {
      this._updateRuntimeState();
      return;
    }

    if (!this._hasStarted) {
      this._hasStarted = true;
      this._runId += 1;
      this.invalidateContentCache();
      this.requestRender();
    }

    this._syncLoopTimer();
    this._updateRuntimeState();
  }

  private _clearLoopTimer(): void {
    if (this._loopTimer != null) {
      window.clearTimeout(this._loopTimer);
      this._loopTimer = null;
    }
  }

  private _syncLoopTimer(): void {
    this._clearLoopTimer();

    const text = this._resolvedText();
    if (!this._shouldLoop() || !this._shouldAnimate() || this._isMotionPaused() || !text.trim()) {
      return;
    }

    const totalMs = this._cycleDurationMs(text) + this._loopDelayMs();
    this._loopTimer = window.setTimeout(() => {
      this._loopTimer = null;
      this.replay();
    }, Math.max(0, totalMs));
  }

  private _updateRuntimeState(): void {
    if (!this._resolvedText().trim()) {
      this.setAttribute('data-state', 'idle');
      return;
    }

    if (!this._hasStarted) {
      this.setAttribute('data-state', 'idle');
      return;
    }

    if (this._isMotionPaused()) {
      this.setAttribute('data-state', 'paused');
      return;
    }

    this.setAttribute('data-state', 'running');
  }

  protected override render(): void {
    const text = this._resolvedText();
    const resolvedEffect = this._resolvedEffect();
    const effect = resolvedEffect.mode === 'builtin' ? resolvedEffect.value : 'custom';
    const split = this._splitMode();
    const animate = this._shouldAnimate();
    const hidden = this._hiddenUntilStarted();
    const paused = this._isMotionPaused();
    const align = this._currentAlignValue();
    const variant = (this.getAttribute('variant') || 'default').trim();
    const tokens = tokenizeText(text, split);

    let animatedIndex = 0;
    const segments = tokens
      .map((token) => {
        const nextIndex = token.animated ? animatedIndex++ : 0;
        const safeText = token.text === '\u00A0' ? '&nbsp;' : escapeHtml(token.text);

        return `
          <span
            class="segment"
            part="segment"
            data-line="${token.line ? 'true' : 'false'}"
            data-space="${token.animated ? 'false' : 'true'}"
            style="${token.animated ? `--ui-animated-text-index:${nextIndex};` : ''}"
          >${safeText}</span>
        `;
      })
      .join('');

    if (text.trim()) {
      this.setAttribute('aria-label', text);
    } else {
      this.removeAttribute('aria-label');
    }

    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <span class="surface" part="surface">
          <span
            class="content"
            part="content"
            data-effect="${effect}"
            data-effect-name="${escapeHtml(resolvedEffect.value)}"
            data-split="${split}"
            data-variant="${escapeHtml(variant)}"
            data-align="${align}"
            data-run="${this._runId}"
            data-animate="${animate ? 'true' : 'false'}"
            data-hidden="${hidden ? 'true' : 'false'}"
            data-paused="${paused ? 'true' : 'false'}"
            aria-hidden="true"
          >${segments}</span>
          <span class="caret" aria-hidden="true"></span>
        </span>
      </div>
    `);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-animated-text': UIAnimatedText;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-animated-text')) {
  customElements.define('ui-animated-text', UIAnimatedText);
}
