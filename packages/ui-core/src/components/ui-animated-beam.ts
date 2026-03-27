import { ElementBase } from '../ElementBase';

type AnimatedBeamVariant = 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
type AnimatedBeamTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type AnimatedBeamSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | '0' | '1' | '2' | '3';
type AnimatedBeamElevation = 'none' | 'low' | 'high';
type AnimatedBeamAnimation = 'calm' | 'smooth' | 'snappy' | 'surge' | 'pulse' | 'heartbeat';
type AnimatedBeamCurve = 'auto' | 'straight' | 'soft' | 'arc';
type AnimatedBeamDirection = 'forward' | 'reverse';
type AnimatedBeamNodeEffect = 'none' | 'glow' | 'pulse' | 'ring' | 'shake';
type AnimatedBeamNodeKind = 'node' | 'hub';
type AnimatedBeamMotionPattern = 'progress' | 'pulse' | 'heartbeat';

type AnimatedBeamSizePreset = {
  nodeSize: number;
  hubSize: number;
  columnGap: number;
  rowGap: number;
  padding: number;
  minHeight: number;
  radius: number;
};

type AnimatedBeamMotionPreset = {
  durationScale: number;
  glowOpacity: number;
  glowBlur: number;
  beamFactor: number;
  pattern: AnimatedBeamMotionPattern;
};

type AnimatedBeamNodeRecord = {
  el: HTMLElement;
  nodeId: string;
  kind: AnimatedBeamNodeKind;
  column: number;
  row: number;
  sizePx: number;
  centerX: number;
  centerY: number;
  radiusPx: number;
};

type AnimatedBeamConnectionRecord = {
  el: HTMLElement;
  from: string;
  to: string;
  index: number;
  curve: AnimatedBeamCurve;
  reverse: boolean;
  tone: AnimatedBeamTone | null;
  durationMs: number;
  hasExplicitDelay: boolean;
  localDelayMs: number;
  delayMs: number;
  siblingIndex: number;
  beamFactor: number;
  trailWidthPx: number;
  beamWidthPx: number;
  colorStart: string | null;
  colorEnd: string | null;
};

type LayoutMetrics = {
  width: number;
  height: number;
  scale: number;
  padding: number;
  columns: number;
  rows: number;
  columnGap: number;
  rowGap: number;
  nodeSize: number;
  hubSize: number;
};

type Point = { x: number; y: number };
type CubicGeometry = {
  kind: 'line' | 'cubic';
  start: Point;
  end: Point;
  c1?: Point;
  c2?: Point;
  d: string;
  length: number;
};

const DEFAULT_DURATION = 3200;
const DEFAULT_DELAY = 0;
const DEFAULT_STAGGER = 0;
const DEFAULT_TRAIL_WIDTH = 3;
const DEFAULT_BEAM_WIDTH = 4;
const DEFAULT_BEAM_FACTOR = 0.18;
const DEFAULT_COLUMNS = 3;
const DEFAULT_COLOR_START = '#8b5cf6';
const DEFAULT_COLOR_END = '#f59e0b';
const DEFAULT_TRAIL_COLOR = 'rgba(148, 163, 184, 0.34)';
const NODE_PATH_OVERLAP = 2;
const SEMANTIC_RADIUS_VALUES = new Set(['none', 'sm', 'md', 'lg', 'full']);
const VARIANTS = new Set<AnimatedBeamVariant>(['surface', 'soft', 'solid', 'glass', 'contrast', 'minimal']);
const TONES = new Set<AnimatedBeamTone>(['brand', 'neutral', 'info', 'success', 'warning', 'danger']);
const SIZES = new Set<AnimatedBeamSize>(['xxs', 'xs', 'sm', 'md', 'lg', '0', '1', '2', '3']);
const ELEVATIONS = new Set<AnimatedBeamElevation>(['none', 'low', 'high']);
const ANIMATIONS = new Set<AnimatedBeamAnimation>(['calm', 'smooth', 'snappy', 'surge', 'pulse', 'heartbeat']);
const CURVES = new Set<AnimatedBeamCurve>(['auto', 'straight', 'soft', 'arc']);
const DIRECTIONS = new Set<AnimatedBeamDirection>(['forward', 'reverse']);
const NODE_EFFECTS = new Set<AnimatedBeamNodeEffect>(['none', 'glow', 'pulse', 'ring', 'shake']);
const LIGHT_DOM_OBSERVED_ATTRIBUTES = [
  'node-id',
  'column',
  'row',
  'size',
  'from',
  'to',
  'curve',
  'direction',
  'reverse',
  'duration',
  'delay',
  'tone',
  'color-start',
  'color-end',
  'beam-factor',
  'trail-width',
  'beam-width',
  'id',
];

const SIZE_PRESETS: Record<'xxs' | 'xs' | 'sm' | 'md' | 'lg', AnimatedBeamSizePreset> = {
  xxs: {
    nodeSize: 36,
    hubSize: 50,
    columnGap: 72,
    rowGap: 28,
    padding: 12,
    minHeight: 160,
    radius: 16,
  },
  xs: {
    nodeSize: 46,
    hubSize: 62,
    columnGap: 88,
    rowGap: 36,
    padding: 16,
    minHeight: 190,
    radius: 18,
  },
  sm: {
    nodeSize: 56,
    hubSize: 74,
    columnGap: 108,
    rowGap: 48,
    padding: 20,
    minHeight: 220,
    radius: 22,
  },
  md: {
    nodeSize: 84,
    hubSize: 116,
    columnGap: 156,
    rowGap: 72,
    padding: 32,
    minHeight: 320,
    radius: 28,
  },
  lg: {
    nodeSize: 98,
    hubSize: 132,
    columnGap: 188,
    rowGap: 88,
    padding: 40,
    minHeight: 400,
    radius: 34,
  },
};

const MOTION_PRESETS: Record<AnimatedBeamAnimation, AnimatedBeamMotionPreset> = {
  calm: {
    durationScale: 1.18,
    glowOpacity: 0.26,
    glowBlur: 9,
    beamFactor: 0.15,
    pattern: 'progress',
  },
  smooth: {
    durationScale: 1,
    glowOpacity: 0.34,
    glowBlur: 11,
    beamFactor: DEFAULT_BEAM_FACTOR,
    pattern: 'progress',
  },
  snappy: {
    durationScale: 0.82,
    glowOpacity: 0.38,
    glowBlur: 10,
    beamFactor: 0.2,
    pattern: 'progress',
  },
  surge: {
    durationScale: 0.68,
    glowOpacity: 0.44,
    glowBlur: 13,
    beamFactor: 0.24,
    pattern: 'progress',
  },
  pulse: {
    durationScale: 0.92,
    glowOpacity: 0.42,
    glowBlur: 14,
    beamFactor: 0.22,
    pattern: 'pulse',
  },
  heartbeat: {
    durationScale: 0.86,
    glowOpacity: 0.48,
    glowBlur: 15,
    beamFactor: 0.18,
    pattern: 'heartbeat',
  },
};

const TONE_ACCENTS: Record<AnimatedBeamTone, { start: string; end: string }> = {
  brand: { start: DEFAULT_COLOR_START, end: DEFAULT_COLOR_END },
  neutral: { start: '#64748b', end: '#cbd5e1' },
  info: { start: '#38bdf8', end: '#6366f1' },
  success: { start: '#22c55e', end: '#14b8a6' },
  warning: { start: '#f59e0b', end: '#f97316' },
  danger: { start: '#ef4444', end: '#f97316' },
};

const style = `
  :host {
    --ui-animated-beam-required-width: 0px;
    --ui-animated-beam-duration: ${DEFAULT_DURATION}ms;
    --ui-animated-beam-delay: ${DEFAULT_DELAY}ms;
    --ui-animated-beam-stagger: ${DEFAULT_STAGGER}ms;
    --ui-animated-beam-padding: ${SIZE_PRESETS.md.padding}px;
    --ui-animated-beam-column-gap: ${SIZE_PRESETS.md.columnGap}px;
    --ui-animated-beam-row-gap: ${SIZE_PRESETS.md.rowGap}px;
    --ui-animated-beam-node-size: ${SIZE_PRESETS.md.nodeSize}px;
    --ui-animated-beam-hub-size: ${SIZE_PRESETS.md.hubSize}px;
    --ui-animated-beam-min-height: ${SIZE_PRESETS.md.minHeight}px;
    --ui-animated-beam-columns: ${DEFAULT_COLUMNS};
    --ui-animated-beam-radius: ${SIZE_PRESETS.md.radius}px;
    --ui-animated-beam-trail-width: ${DEFAULT_TRAIL_WIDTH}px;
    --ui-animated-beam-beam-width: ${DEFAULT_BEAM_WIDTH}px;
    --ui-animated-beam-beam-factor: ${DEFAULT_BEAM_FACTOR};
    --ui-animated-beam-accent: ${DEFAULT_COLOR_START};
    --ui-animated-beam-accent-end: ${DEFAULT_COLOR_END};
    --ui-animated-beam-path-color: ${DEFAULT_TRAIL_COLOR};
    --ui-animated-beam-bg: transparent;
    --ui-animated-beam-color: var(--ui-color-text, #0f172a);
    --ui-animated-beam-border-color:
      color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 82%, transparent);
    --ui-animated-beam-border: 1px solid transparent;
    --ui-animated-beam-shadow: none;
    --ui-animated-beam-backdrop: none;
    --ui-animated-beam-node-bg:
      linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.94));
    --ui-animated-beam-node-color: inherit;
    --ui-animated-beam-node-border:
      1px solid color-mix(in srgb, var(--ui-animated-beam-accent) 12%, rgba(15, 23, 42, 0.1));
    --ui-animated-beam-node-shadow:
      0 1px 2px rgba(15, 23, 42, 0.06),
      0 14px 28px rgba(15, 23, 42, 0.1);
    --ui-animated-beam-node-backdrop: none;
    --ui-animated-beam-hub-bg:
      linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(248, 250, 252, 0.96));
    --ui-animated-beam-hub-border:
      1px solid color-mix(in srgb, var(--ui-animated-beam-accent) 14%, rgba(15, 23, 42, 0.1));
    --ui-animated-beam-hub-shadow:
      0 1px 2px rgba(15, 23, 42, 0.08),
      0 18px 34px rgba(15, 23, 42, 0.12);
    --ui-animated-beam-glow-opacity: ${MOTION_PRESETS.smooth.glowOpacity};
    --ui-animated-beam-glow-blur: ${MOTION_PRESETS.smooth.glowBlur}px;
    --ui-animated-beam-core-opacity: 0.96;
    --ui-animated-beam-trail-opacity: 0.72;
    --ui-animated-beam-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    display: block;
    min-inline-size: var(--ui-animated-beam-required-width);
    color: var(--ui-animated-beam-color);
    color-scheme: light dark;
    font-family: "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-sizing: border-box;
  }

  :host([size="xxs"]),
  :host([size="0"]) {
    --ui-animated-beam-padding: ${SIZE_PRESETS.xxs.padding}px;
    --ui-animated-beam-column-gap: ${SIZE_PRESETS.xxs.columnGap}px;
    --ui-animated-beam-row-gap: ${SIZE_PRESETS.xxs.rowGap}px;
    --ui-animated-beam-node-size: ${SIZE_PRESETS.xxs.nodeSize}px;
    --ui-animated-beam-hub-size: ${SIZE_PRESETS.xxs.hubSize}px;
    --ui-animated-beam-min-height: ${SIZE_PRESETS.xxs.minHeight}px;
    --ui-animated-beam-radius: ${SIZE_PRESETS.xxs.radius}px;
  }

  :host([size="xs"]) {
    --ui-animated-beam-padding: ${SIZE_PRESETS.xs.padding}px;
    --ui-animated-beam-column-gap: ${SIZE_PRESETS.xs.columnGap}px;
    --ui-animated-beam-row-gap: ${SIZE_PRESETS.xs.rowGap}px;
    --ui-animated-beam-node-size: ${SIZE_PRESETS.xs.nodeSize}px;
    --ui-animated-beam-hub-size: ${SIZE_PRESETS.xs.hubSize}px;
    --ui-animated-beam-min-height: ${SIZE_PRESETS.xs.minHeight}px;
    --ui-animated-beam-radius: ${SIZE_PRESETS.xs.radius}px;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-animated-beam-padding: ${SIZE_PRESETS.sm.padding}px;
    --ui-animated-beam-column-gap: ${SIZE_PRESETS.sm.columnGap}px;
    --ui-animated-beam-row-gap: ${SIZE_PRESETS.sm.rowGap}px;
    --ui-animated-beam-node-size: ${SIZE_PRESETS.sm.nodeSize}px;
    --ui-animated-beam-hub-size: ${SIZE_PRESETS.sm.hubSize}px;
    --ui-animated-beam-min-height: ${SIZE_PRESETS.sm.minHeight}px;
    --ui-animated-beam-radius: ${SIZE_PRESETS.sm.radius}px;
  }

  :host(:not([size])),
  :host([size="md"]),
  :host([size="2"]) {
    --ui-animated-beam-padding: ${SIZE_PRESETS.md.padding}px;
    --ui-animated-beam-column-gap: ${SIZE_PRESETS.md.columnGap}px;
    --ui-animated-beam-row-gap: ${SIZE_PRESETS.md.rowGap}px;
    --ui-animated-beam-node-size: ${SIZE_PRESETS.md.nodeSize}px;
    --ui-animated-beam-hub-size: ${SIZE_PRESETS.md.hubSize}px;
    --ui-animated-beam-min-height: ${SIZE_PRESETS.md.minHeight}px;
    --ui-animated-beam-radius: ${SIZE_PRESETS.md.radius}px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-animated-beam-padding: ${SIZE_PRESETS.lg.padding}px;
    --ui-animated-beam-column-gap: ${SIZE_PRESETS.lg.columnGap}px;
    --ui-animated-beam-row-gap: ${SIZE_PRESETS.lg.rowGap}px;
    --ui-animated-beam-node-size: ${SIZE_PRESETS.lg.nodeSize}px;
    --ui-animated-beam-hub-size: ${SIZE_PRESETS.lg.hubSize}px;
    --ui-animated-beam-min-height: ${SIZE_PRESETS.lg.minHeight}px;
    --ui-animated-beam-radius: ${SIZE_PRESETS.lg.radius}px;
  }

  :host([tone="neutral"]) {
    --ui-animated-beam-accent: ${TONE_ACCENTS.neutral.start};
    --ui-animated-beam-accent-end: ${TONE_ACCENTS.neutral.end};
  }

  :host([tone="info"]) {
    --ui-animated-beam-accent: ${TONE_ACCENTS.info.start};
    --ui-animated-beam-accent-end: ${TONE_ACCENTS.info.end};
  }

  :host([tone="success"]) {
    --ui-animated-beam-accent: ${TONE_ACCENTS.success.start};
    --ui-animated-beam-accent-end: ${TONE_ACCENTS.success.end};
  }

  :host([tone="warning"]) {
    --ui-animated-beam-accent: ${TONE_ACCENTS.warning.start};
    --ui-animated-beam-accent-end: ${TONE_ACCENTS.warning.end};
  }

  :host([tone="danger"]) {
    --ui-animated-beam-accent: ${TONE_ACCENTS.danger.start};
    --ui-animated-beam-accent-end: ${TONE_ACCENTS.danger.end};
  }

  :host([variant="surface"]) {
    --ui-animated-beam-bg:
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.9));
    --ui-animated-beam-border: 1px solid var(--ui-animated-beam-border-color);
    --ui-animated-beam-shadow:
      0 1px 2px rgba(15, 23, 42, 0.04),
      0 20px 36px rgba(15, 23, 42, 0.08);
    --ui-animated-beam-trail-opacity: 0.7;
  }

  :host([variant="soft"]) {
    --ui-animated-beam-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-animated-beam-accent) 5%, rgba(255, 255, 255, 0.98)),
        color-mix(in srgb, var(--ui-animated-beam-accent) 2%, rgba(248, 250, 252, 0.92))
    );
    --ui-animated-beam-border: 1px solid color-mix(in srgb, var(--ui-animated-beam-accent) 16%, transparent);
    --ui-animated-beam-shadow: none;
    --ui-animated-beam-trail-opacity: 0.62;
    --ui-animated-beam-core-opacity: 0.9;
  }

  :host([variant="solid"]) {
    --ui-animated-beam-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-animated-beam-accent) 12%, rgba(255, 255, 255, 0.98)),
        color-mix(in srgb, var(--ui-animated-beam-accent-end) 8%, rgba(248, 250, 252, 0.94))
      );
    --ui-animated-beam-border: 1px solid color-mix(in srgb, var(--ui-animated-beam-accent) 20%, transparent);
    --ui-animated-beam-shadow:
      0 1px 2px rgba(15, 23, 42, 0.04),
      0 24px 42px color-mix(in srgb, var(--ui-animated-beam-accent) 8%, rgba(15, 23, 42, 0.08));
    --ui-animated-beam-trail-opacity: 0.76;
  }

  :host([variant="glass"]) {
    --ui-animated-beam-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, rgba(255, 255, 255, 0.96) 88%, transparent),
        color-mix(in srgb, rgba(255, 255, 255, 0.86) 72%, transparent)
      );
    --ui-animated-beam-border: 1px solid color-mix(in srgb, #ffffff 28%, var(--ui-animated-beam-border-color));
    --ui-animated-beam-shadow:
      0 1px 2px rgba(15, 23, 42, 0.06),
      0 26px 48px rgba(15, 23, 42, 0.12);
    --ui-animated-beam-backdrop: blur(16px) saturate(1.08);
    --ui-animated-beam-node-backdrop: blur(10px) saturate(1.04);
    --ui-animated-beam-trail-opacity: 0.64;
  }

  :host([variant="contrast"]) {
    --ui-animated-beam-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #07162d 92%, var(--ui-animated-beam-accent) 8%),
        color-mix(in srgb, #0f2d57 84%, var(--ui-animated-beam-accent-end) 16%)
      );
    --ui-animated-beam-color: #f8fbff;
    --ui-animated-beam-border: 1px solid color-mix(in srgb, #9ec5ff 20%, transparent);
    --ui-animated-beam-shadow: 0 26px 54px rgba(2, 6, 23, 0.32);
    --ui-animated-beam-node-bg: color-mix(in srgb, #ffffff 8%, transparent);
    --ui-animated-beam-node-border: 1px solid color-mix(in srgb, #ffffff 16%, transparent);
    --ui-animated-beam-node-color: #f8fbff;
    --ui-animated-beam-node-shadow: 0 12px 22px rgba(2, 6, 23, 0.22);
    --ui-animated-beam-hub-bg: color-mix(in srgb, #ffffff 10%, transparent);
    --ui-animated-beam-hub-border: 1px solid color-mix(in srgb, #ffffff 18%, transparent);
    --ui-animated-beam-hub-shadow: 0 18px 30px rgba(2, 6, 23, 0.24);
    --ui-animated-beam-path-color: color-mix(in srgb, #ffffff 20%, transparent);
    --ui-animated-beam-trail-opacity: 0.92;
    --ui-animated-beam-core-opacity: 1;
  }

  :host(:not([variant])),
  :host([variant="minimal"]) {
    --ui-animated-beam-bg: transparent;
    --ui-animated-beam-border: 1px solid transparent;
    --ui-animated-beam-shadow: none;
    --ui-animated-beam-trail-opacity: 0.68;
  }

  :host([radius="none"]) {
    --ui-animated-beam-radius: 0px;
  }

  :host([radius="sm"]) {
    --ui-animated-beam-radius: 18px;
  }

  :host([radius="md"]) {
    --ui-animated-beam-radius: 24px;
  }

  :host([radius="lg"]) {
    --ui-animated-beam-radius: 32px;
  }

  :host([radius="full"]) {
    --ui-animated-beam-radius: 999px;
  }

  :host([elevation="none"]) {
    --ui-animated-beam-shadow: none;
    --ui-animated-beam-node-shadow: none;
    --ui-animated-beam-hub-shadow: none;
  }

  :host([elevation="high"]) {
    --ui-animated-beam-shadow:
      0 1px 2px rgba(15, 23, 42, 0.06),
      0 30px 58px rgba(15, 23, 42, 0.14);
    --ui-animated-beam-node-shadow:
      0 1px 3px rgba(15, 23, 42, 0.08),
      0 18px 34px rgba(15, 23, 42, 0.14);
    --ui-animated-beam-hub-shadow:
      0 1px 3px rgba(15, 23, 42, 0.08),
      0 24px 42px rgba(15, 23, 42, 0.16);
  }

  :host([animation="calm"]) {
    --ui-animated-beam-glow-opacity: ${MOTION_PRESETS.calm.glowOpacity};
    --ui-animated-beam-glow-blur: ${MOTION_PRESETS.calm.glowBlur}px;
    --ui-animated-beam-beam-factor: ${MOTION_PRESETS.calm.beamFactor};
  }

  :host(:not([animation])),
  :host([animation="smooth"]) {
    --ui-animated-beam-glow-opacity: ${MOTION_PRESETS.smooth.glowOpacity};
    --ui-animated-beam-glow-blur: ${MOTION_PRESETS.smooth.glowBlur}px;
    --ui-animated-beam-beam-factor: ${MOTION_PRESETS.smooth.beamFactor};
  }

  :host([animation="snappy"]) {
    --ui-animated-beam-glow-opacity: ${MOTION_PRESETS.snappy.glowOpacity};
    --ui-animated-beam-glow-blur: ${MOTION_PRESETS.snappy.glowBlur}px;
    --ui-animated-beam-beam-factor: ${MOTION_PRESETS.snappy.beamFactor};
  }

  :host([animation="surge"]) {
    --ui-animated-beam-glow-opacity: ${MOTION_PRESETS.surge.glowOpacity};
    --ui-animated-beam-glow-blur: ${MOTION_PRESETS.surge.glowBlur}px;
    --ui-animated-beam-beam-factor: ${MOTION_PRESETS.surge.beamFactor};
  }

  :host([animation="pulse"]) {
    --ui-animated-beam-glow-opacity: ${MOTION_PRESETS.pulse.glowOpacity};
    --ui-animated-beam-glow-blur: ${MOTION_PRESETS.pulse.glowBlur}px;
    --ui-animated-beam-beam-factor: ${MOTION_PRESETS.pulse.beamFactor};
  }

  :host([animation="heartbeat"]) {
    --ui-animated-beam-glow-opacity: ${MOTION_PRESETS.heartbeat.glowOpacity};
    --ui-animated-beam-glow-blur: ${MOTION_PRESETS.heartbeat.glowBlur}px;
    --ui-animated-beam-beam-factor: ${MOTION_PRESETS.heartbeat.beamFactor};
  }

  .root {
    display: block;
    min-inline-size: var(--ui-animated-beam-required-width);
  }

  .surface {
    position: relative;
    min-inline-size: var(--ui-animated-beam-required-width);
    inline-size: max(100%, var(--ui-animated-beam-required-width));
    border-radius: var(--ui-animated-beam-radius);
    border: var(--ui-animated-beam-border);
    background: var(--ui-animated-beam-bg);
    color: var(--ui-animated-beam-color);
    box-shadow: var(--ui-animated-beam-shadow);
    backdrop-filter: var(--ui-animated-beam-backdrop);
    transition:
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      backdrop-filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  .canvas {
    position: relative;
    min-inline-size: var(--ui-animated-beam-required-width);
    inline-size: max(100%, var(--ui-animated-beam-required-width));
    min-block-size: var(--ui-animated-beam-min-height);
    overflow: visible;
    isolation: isolate;
  }

  .svg {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
    pointer-events: none;
  }

  .connection {
    fill: none;
  }

  .trail,
  .beam-glow,
  .beam-core {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  .trail {
    stroke: var(--ui-animated-beam-path-color);
    opacity: var(--ui-animated-beam-trail-opacity);
  }

  :host([data-path-visible="false"]) .trail {
    opacity: 0;
  }

  .beam-glow,
  .beam-core {
    stroke-dasharray: 0 var(--ui-animated-beam-travel-distance, 320);
    stroke-dashoffset: var(--ui-animated-beam-progress-offset, 0);
    animation-duration: var(--ui-animated-beam-cycle-duration, var(--ui-animated-beam-connection-duration, var(--ui-animated-beam-duration)));
    animation-timing-function: linear;
    animation-iteration-count: var(--ui-animated-beam-iteration-count, infinite);
    animation-fill-mode: both;
  }

  .beam-glow {
    opacity: 0;
    filter: blur(var(--ui-animated-beam-glow-blur));
  }

  :host([glow="false"]) .beam-glow {
    display: none;
  }

  .beam-core {
    opacity: 0;
  }

  :host([data-state="paused"]) .beam-glow,
  :host([data-state="paused"]) .beam-core {
    animation-play-state: paused;
  }

  :host([data-state="paused"]) ::slotted([data-ui-animated-beam-node]),
  :host([data-state="paused"]) ::slotted([data-ui-animated-beam-hub]) {
    animation-play-state: paused;
  }

  :host([data-reduced-motion="true"]) .beam-glow,
  :host([data-reduced-motion="true"]) .beam-core {
    animation: none;
    stroke-dasharray: var(--ui-animated-beam-travel-distance, 320) 0;
  }

  :host([data-reduced-motion="true"]) .beam-glow {
    opacity: var(--ui-animated-beam-glow-opacity);
  }

  :host([data-reduced-motion="true"]) .beam-core {
    opacity: var(--ui-animated-beam-core-opacity);
  }

  :host([data-reduced-motion="true"]) ::slotted([data-ui-animated-beam-node]),
  :host([data-reduced-motion="true"]) ::slotted([data-ui-animated-beam-hub]) {
    animation: none !important;
  }

  slot[name="hub"],
  slot[name="connections"] {
    display: contents;
  }

  .connections-meta {
    display: none;
  }

  ::slotted([data-ui-animated-beam-node]),
  ::slotted([data-ui-animated-beam-hub]) {
    --ui-animated-beam-node-base-shadow: var(--ui-animated-beam-node-shadow);
    --ui-animated-beam-node-effect-ring:
      color-mix(in srgb, var(--ui-animated-beam-accent-end) 26%, transparent);
    --ui-animated-beam-node-effect-glow:
      color-mix(in srgb, var(--ui-animated-beam-accent) 32%, transparent);
    position: absolute !important;
    inset: auto;
    transform: translate(-50%, -50%);
    inline-size: var(--ui-animated-beam-render-size, var(--ui-animated-beam-node-size));
    block-size: var(--ui-animated-beam-render-size, var(--ui-animated-beam-node-size));
    display: grid !important;
    place-items: center;
    box-sizing: border-box;
    border-radius: 999px;
    padding: calc(var(--ui-animated-beam-render-size, var(--ui-animated-beam-node-size)) * 0.1);
    font-size: calc(var(--ui-animated-beam-render-size, var(--ui-animated-beam-node-size)) * 0.32);
    color: var(--ui-animated-beam-node-color);
    background: var(--ui-animated-beam-node-bg);
    border: var(--ui-animated-beam-node-border);
    box-shadow: var(--ui-animated-beam-node-shadow);
    backdrop-filter: var(--ui-animated-beam-node-backdrop);
    text-align: center;
    z-index: 1;
    animation-name: var(--ui-animated-beam-node-effect-name, none);
    animation-duration: var(--ui-animated-beam-node-effect-cycle, 0ms);
    animation-timing-function: linear;
    animation-iteration-count: var(--ui-animated-beam-node-effect-iterations, 1);
    animation-fill-mode: both;
    transition:
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      transform 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  ::slotted([data-ui-animated-beam-hub]) {
    --ui-animated-beam-node-base-shadow: var(--ui-animated-beam-hub-shadow);
    inline-size: var(--ui-animated-beam-render-size, var(--ui-animated-beam-hub-size));
    block-size: var(--ui-animated-beam-render-size, var(--ui-animated-beam-hub-size));
    padding: calc(var(--ui-animated-beam-render-size, var(--ui-animated-beam-hub-size)) * 0.12);
    font-size: calc(var(--ui-animated-beam-render-size, var(--ui-animated-beam-hub-size)) * 0.26);
    background: var(--ui-animated-beam-hub-bg);
    border: var(--ui-animated-beam-hub-border);
    box-shadow: var(--ui-animated-beam-hub-shadow);
    z-index: 2;
  }

  ::slotted([data-ui-animated-beam-node]:focus-visible),
  ::slotted([data-ui-animated-beam-hub]:focus-visible) {
    outline: none;
    border-color: color-mix(in srgb, var(--ui-animated-beam-focus-ring) 26%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-animated-beam-focus-ring) 18%, transparent),
      var(--ui-animated-beam-node-shadow);
  }

  ::slotted([slot="connections"]) {
    display: none !important;
  }

  ::slotted([data-ui-animated-beam-node] > svg),
  ::slotted([data-ui-animated-beam-hub] > svg) {
    inline-size: 62%;
    block-size: 62%;
  }

  @media (prefers-reduced-motion: reduce) {
    .beam-glow,
    .beam-core {
      animation: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-animated-beam-bg: Canvas;
      --ui-animated-beam-color: CanvasText;
      --ui-animated-beam-border: 1px solid CanvasText;
      --ui-animated-beam-shadow: none;
      --ui-animated-beam-node-bg: Canvas;
      --ui-animated-beam-node-color: CanvasText;
      --ui-animated-beam-node-border: 1px solid CanvasText;
      --ui-animated-beam-node-shadow: none;
      --ui-animated-beam-hub-bg: Canvas;
      --ui-animated-beam-hub-border: 1px solid CanvasText;
      --ui-animated-beam-hub-shadow: none;
      --ui-animated-beam-path-color: CanvasText;
    }
  }
`;

export class UIAnimatedBeam extends ElementBase {
  static get observedAttributes() {
    return [
      'animation',
      'variant',
      'tone',
      'size',
      'radius',
      'elevation',
      'columns',
      'rows',
      'padding',
      'column-gap',
      'row-gap',
      'min-height',
      'node-size',
      'hub-size',
      'duration',
      'delay',
      'stagger',
      'trail-width',
      'beam-width',
      'beam-factor',
      'path',
      'glow',
      'node-effect',
      'auto-fit',
      'paused',
      'repeat',
      'direction',
      'reverse',
      'color-start',
      'color-end',
      'trail-color',
      'curve',
    ];
  }

  private _nodeSlot: HTMLSlotElement | null = null;
  private _hubSlot: HTMLSlotElement | null = null;
  private _connectionSlot: HTMLSlotElement | null = null;
  private _surfaceEl: HTMLElement | null = null;
  private _canvasEl: HTMLElement | null = null;
  private _svgEl: SVGSVGElement | null = null;
  private _defsEl: SVGDefsElement | null = null;
  private _pathsEl: SVGGElement | null = null;
  private _animationStyleEl: HTMLStyleElement | null = null;
  private _nodes: AnimatedBeamNodeRecord[] = [];
  private _connections: AnimatedBeamConnectionRecord[] = [];
  private _nodeEffectAnimations = new Map<HTMLElement, Animation>();
  private _lastLayoutMetrics: LayoutMetrics | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _mutationObserver: MutationObserver | null = null;
  private _mediaQuery: MediaQueryList | null = null;
  private _observedResizeElements = new Set<Element>();
  private readonly _uid = `ui-animated-beam-${Math.random().toString(36).slice(2, 10)}`;
  private readonly _boundSlotChange = this._handleSlotChange.bind(this);
  private readonly _boundReducedMotionChange = this._handleReducedMotionChange.bind(this);
  private readonly _boundResize = this._handleResize.bind(this);
  private _refreshScheduled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this._bindReducedMotionWatcher();
    this._ensureResizeObserver();
    this._ensureMutationObserver();
  }

  override disconnectedCallback(): void {
    this._clearNodeEffectAnimations();
    this._disconnectResizeObserver();
    this._disconnectMutationObserver();
    this._mediaQuery?.removeEventListener?.('change', this._boundReducedMotionChange);
    this._mediaQuery?.removeListener?.(this._boundReducedMotionChange);
    this._mediaQuery = null;
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue || !this.isConnected) return;
    if (name === 'paused') {
      this._syncState();
      return;
    }
    this._syncRuntimeStyles();
    this._refreshScene();
  }

  play(): void {
    if (this.hasAttribute('paused')) this.removeAttribute('paused');
    this._syncState();
  }

  pause(): void {
    if (!this.hasAttribute('paused')) this.setAttribute('paused', '');
    this._syncState();
  }

  refresh(): void {
    this._clearNodeEffectAnimations();
    this._syncRuntimeStyles();
    this._syncNodes();
    this._syncConnections();
    this._layoutNodes();
    this._renderConnections();
    this._syncObservedResizeElements();
    this._syncState();
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <style data-ui-animated-beam-animations></style>
      <div class="root" part="root">
        <div class="surface" part="surface">
          <div class="canvas" part="canvas">
            <svg class="svg" part="svg" aria-hidden="true" focusable="false" preserveAspectRatio="none">
              <defs></defs>
              <g class="paths" part="paths"></g>
            </svg>
            <slot name="hub"></slot>
            <slot></slot>
            <div class="connections-meta" aria-hidden="true">
              <slot name="connections"></slot>
            </div>
          </div>
        </div>
      </div>
    `);

    this._surfaceEl = this.root.querySelector('.surface') as HTMLElement | null;
    this._canvasEl = this.root.querySelector('.canvas') as HTMLElement | null;
    this._svgEl = this.root.querySelector('.svg') as SVGSVGElement | null;
    this._defsEl = this.root.querySelector('defs') as SVGDefsElement | null;
    this._pathsEl = this.root.querySelector('.paths') as SVGGElement | null;
    this._animationStyleEl = this.root.querySelector('style[data-ui-animated-beam-animations]') as HTMLStyleElement | null;
    this._nodeSlot = this.root.querySelector('slot:not([name])') as HTMLSlotElement | null;
    this._hubSlot = this.root.querySelector('slot[name="hub"]') as HTMLSlotElement | null;
    this._connectionSlot = this.root.querySelector('slot[name="connections"]') as HTMLSlotElement | null;
    this._nodeSlot?.addEventListener('slotchange', this._boundSlotChange);
    this._hubSlot?.addEventListener('slotchange', this._boundSlotChange);
    this._connectionSlot?.addEventListener('slotchange', this._boundSlotChange);

    this._syncRuntimeStyles();
    this.refresh();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  private _handleSlotChange(): void {
    this._refreshScene();
  }

  private _handleReducedMotionChange(): void {
    this._syncState();
  }

  private _handleResize(): void {
    this._refreshScene();
  }

  private _refreshScene(): void {
    if (this._refreshScheduled) return;
    this._refreshScheduled = true;
    queueMicrotask(() => {
      this._refreshScheduled = false;
      if (!this.isConnected) return;
      this.refresh();
    });
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

  private _ensureResizeObserver(): void {
    if (this._resizeObserver || typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver(this._boundResize);
    this._syncObservedResizeElements();
  }

  private _disconnectResizeObserver(): void {
    if (!this._resizeObserver) return;
    this._resizeObserver.disconnect();
    this._resizeObserver = null;
    this._observedResizeElements.clear();
  }

  private _syncObservedResizeElements(): void {
    if (!this._resizeObserver) return;
    const next = new Set<Element>();
    if (this._canvasEl) next.add(this._canvasEl);
    next.add(this);
    for (const record of this._nodes) next.add(record.el);

    for (const el of this._observedResizeElements) {
      if (next.has(el)) continue;
      this._resizeObserver.unobserve(el);
    }

    for (const el of next) {
      if (this._observedResizeElements.has(el)) continue;
      this._resizeObserver.observe(el);
    }

    this._observedResizeElements = next;
  }

  private _ensureMutationObserver(): void {
    if (this._mutationObserver || typeof MutationObserver === 'undefined') return;
    this._mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'childList') {
          this._refreshScene();
          return;
        }
        if (
          record.type === 'attributes' &&
          record.target instanceof HTMLElement &&
          LIGHT_DOM_OBSERVED_ATTRIBUTES.includes(record.attributeName || '')
        ) {
          this._refreshScene();
          return;
        }
      }
    });
    this._mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: LIGHT_DOM_OBSERVED_ATTRIBUTES,
    });
  }

  private _disconnectMutationObserver(): void {
    this._mutationObserver?.disconnect();
    this._mutationObserver = null;
  }

  private _syncRuntimeStyles(): void {
    const sizePreset = this._sizePreset();
    const motionPreset = this._motionPreset();

    this.style.setProperty('--ui-animated-beam-required-width', `${this._autoFit() ? 0 : this._requiredWidthPx(sizePreset)}px`);
    this.style.setProperty('--ui-animated-beam-duration', `${this._durationMs() * motionPreset.durationScale}ms`);
    this.style.setProperty('--ui-animated-beam-delay', `${this._delayMs()}ms`);
    this.style.setProperty('--ui-animated-beam-stagger', `${this._staggerMs()}ms`);
    this.style.setProperty('--ui-animated-beam-columns', String(this._columns()));
    this.style.setProperty('--ui-animated-beam-padding', `${this._paddingPx(sizePreset)}px`);
    this.style.setProperty('--ui-animated-beam-column-gap', `${this._columnGapPx(sizePreset)}px`);
    this.style.setProperty('--ui-animated-beam-row-gap', `${this._rowGapPx(sizePreset)}px`);
    this.style.setProperty('--ui-animated-beam-node-size', `${this._nodeSizePx(sizePreset)}px`);
    this.style.setProperty('--ui-animated-beam-hub-size', `${this._hubSizePx(sizePreset)}px`);
    this.style.setProperty('--ui-animated-beam-min-height', `${this._minHeightPx(sizePreset)}px`);
    this.style.setProperty('--ui-animated-beam-trail-width', `${this._trailWidthPx()}px`);
    this.style.setProperty('--ui-animated-beam-beam-width', `${this._beamWidthPx()}px`);
    this.style.setProperty('--ui-animated-beam-beam-factor', String(this._beamFactor(motionPreset)));
    this.style.setProperty('--ui-animated-beam-glow-opacity', String(motionPreset.glowOpacity));
    this.style.setProperty('--ui-animated-beam-glow-blur', `${motionPreset.glowBlur}px`);

    const radius = this.getAttribute('radius');
    if (radius && !SEMANTIC_RADIUS_VALUES.has(radius.trim())) {
      const normalized = normalizeLength(radius);
      if (normalized) this.style.setProperty('--ui-animated-beam-radius', normalized);
      else this.style.removeProperty('--ui-animated-beam-radius');
    } else {
      this.style.removeProperty('--ui-animated-beam-radius');
    }

    const colorStart = this.getAttribute('color-start');
    const colorEnd = this.getAttribute('color-end');
    if (colorStart) this.style.setProperty('--ui-animated-beam-accent', colorStart);
    else this.style.removeProperty('--ui-animated-beam-accent');
    if (colorEnd) this.style.setProperty('--ui-animated-beam-accent-end', colorEnd);
    else this.style.removeProperty('--ui-animated-beam-accent-end');

    const trailColor = this.getAttribute('trail-color');
    if (trailColor) this.style.setProperty('--ui-animated-beam-path-color', trailColor);
    else this.style.removeProperty('--ui-animated-beam-path-color');
  }

  private _nodesFromSlot(): HTMLElement[] {
    if (!this._nodeSlot) return [];
    return this._nodeSlot
      .assignedElements({ flatten: true })
      .filter((node): node is HTMLElement => node instanceof HTMLElement);
  }

  private _hubsFromSlot(): HTMLElement[] {
    if (!this._hubSlot) return [];
    return this._hubSlot
      .assignedElements({ flatten: true })
      .filter((node): node is HTMLElement => node instanceof HTMLElement);
  }

  private _connectionsFromSlot(): HTMLElement[] {
    if (!this._connectionSlot) return [];
    return this._connectionSlot
      .assignedElements({ flatten: true })
      .filter((node): node is HTMLElement => node instanceof HTMLElement);
  }

  private _syncNodes(): void {
    const sizePreset = this._sizePreset();
    const defaultColumns = this._columns();
    const defaultRows = this._declaredRows();
    const nextNodeElements = this._nodesFromSlot();
    const nextHubElements = this._hubsFromSlot();
    const nextSet = new Set<HTMLElement>([...nextNodeElements, ...nextHubElements]);

    for (const record of this._nodes) {
      if (nextSet.has(record.el)) continue;
      cleanupBeamManagedNode(record.el);
    }

    const nextRecords: AnimatedBeamNodeRecord[] = [];
    nextNodeElements.forEach((el, index) => {
      nextRecords.push(this._buildNodeRecord(el, 'node', index, defaultColumns, defaultRows, sizePreset));
    });
    nextHubElements.forEach((el, index) => {
      nextRecords.push(this._buildNodeRecord(el, 'hub', index, defaultColumns, defaultRows, sizePreset));
    });

    this._nodes = nextRecords;
    this.setAttribute('data-node-count', String(nextNodeElements.length));
    this.setAttribute('data-hub-count', String(nextHubElements.length));
  }

  private _buildNodeRecord(
    el: HTMLElement,
    kind: AnimatedBeamNodeKind,
    index: number,
    columns: number,
    declaredRows: number | null,
    sizePreset: AnimatedBeamSizePreset,
  ): AnimatedBeamNodeRecord {
    const managedAttr = kind === 'hub' ? 'data-ui-animated-beam-hub' : 'data-ui-animated-beam-node';
    if (!el.hasAttribute(managedAttr)) el.setAttribute(managedAttr, '');
    if (!el.hasAttribute('data-ui-animated-beam-managed')) el.setAttribute('data-ui-animated-beam-managed', '');
    if (!el.hasAttribute('data-ui-animated-beam-node-id-owned')) {
      // marker only used for cleanup when the component synthesized the id
      el.removeAttribute('data-ui-animated-beam-node-id-owned');
    }

    if (kind === 'hub' && el.getAttribute('slot') !== 'hub') el.setAttribute('slot', 'hub');

    const nodeId = this._nodeIdForElement(el, kind, index);
    const rowFallback = declaredRows ? Math.max(1, Math.ceil(declaredRows / 2)) : kind === 'hub' ? 2 : index + 1;
    const row = clampInteger(parseInteger(el.getAttribute('row'), rowFallback), 1, Math.max(declaredRows || rowFallback, rowFallback));
    const columnFallback = kind === 'hub' ? Math.ceil(columns / 2) : clampInteger(index + 1, 1, columns);
    const column = clampInteger(parseInteger(el.getAttribute('column'), columnFallback), 1, columns);
    const sizeDefault = kind === 'hub' ? sizePreset.hubSize : sizePreset.nodeSize;
    const sizePx = parseLengthToPx(el.getAttribute('size'), sizeDefault);

    return {
      el,
      nodeId,
      kind,
      column,
      row,
      sizePx,
      centerX: 0,
      centerY: 0,
      radiusPx: sizePx / 2,
    };
  }

  private _nodeIdForElement(el: HTMLElement, kind: AnimatedBeamNodeKind, index: number): string {
    const explicit = el.getAttribute('node-id') || el.id;
    if (explicit) return explicit;
    const generated = `${kind}-${index + 1}`;
    el.setAttribute('node-id', generated);
    el.setAttribute('data-ui-animated-beam-node-id-owned', '');
    return generated;
  }

  private _syncConnections(): void {
    const motionPreset = this._motionPreset();
    const connectionElements = this._connectionsFromSlot();
    const nextSet = new Set(connectionElements);

    for (const record of this._connections) {
      if (nextSet.has(record.el)) continue;
      cleanupBeamManagedConnection(record.el);
    }

    const rootTone = this._tone();
    const nextConnections: AnimatedBeamConnectionRecord[] = [];
    const siblingCounts = new Map<string, number>();
    connectionElements.forEach((el, index) => {
      if (el.getAttribute('slot') !== 'connections') el.setAttribute('slot', 'connections');
      if (!el.hasAttribute('data-ui-animated-beam-connection')) el.setAttribute('data-ui-animated-beam-connection', '');
      if (!el.hasAttribute('data-ui-animated-beam-managed')) el.setAttribute('data-ui-animated-beam-managed', '');
      const from = el.getAttribute('from');
      const to = el.getAttribute('to');
      if (!from || !to) return;

      const tone = normalizeTone(el.getAttribute('tone'));
      const durationBase = parseTimeToMs(el.getAttribute('duration'), this._durationMs());
      const delayAttr = el.getAttribute('delay');
      const siblingIndex = siblingCounts.get(from) || 0;
      siblingCounts.set(from, siblingIndex + 1);

      nextConnections.push({
        el,
        from,
        to,
        index,
        curve: this._curveForConnection(el),
        reverse: this._directionForConnection(el) === 'reverse',
        tone,
        durationMs: durationBase * motionPreset.durationScale,
        hasExplicitDelay: delayAttr != null && delayAttr.trim() !== '',
        localDelayMs: parseTimeToMs(delayAttr, 0),
        delayMs: 0,
        siblingIndex,
        beamFactor: clampNumber(parseFloatSafe(el.getAttribute('beam-factor'), this._beamFactor(motionPreset)), 0.06, 0.48),
        trailWidthPx: parseLengthToPx(el.getAttribute('trail-width'), this._trailWidthPx()),
        beamWidthPx: parseLengthToPx(el.getAttribute('beam-width'), this._beamWidthPx()),
        colorStart: el.getAttribute('color-start') || TONE_ACCENTS[tone || rootTone].start,
        colorEnd: el.getAttribute('color-end') || TONE_ACCENTS[tone || rootTone].end,
      });
    });

    this._connections = nextConnections;

    this.setAttribute('data-connection-count', String(this._connections.length));
  }

  private _curveForConnection(el: HTMLElement): AnimatedBeamCurve {
    const curve = el.getAttribute('curve');
    if (curve && CURVES.has(curve as AnimatedBeamCurve)) return curve as AnimatedBeamCurve;
    const rootCurve = this.getAttribute('curve');
    return rootCurve && CURVES.has(rootCurve as AnimatedBeamCurve) ? (rootCurve as AnimatedBeamCurve) : 'auto';
  }

  private _directionForConnection(el: HTMLElement): AnimatedBeamDirection {
    const connectionDirection = el.getAttribute('direction');
    if (connectionDirection && DIRECTIONS.has(connectionDirection as AnimatedBeamDirection)) {
      return connectionDirection as AnimatedBeamDirection;
    }
    if (el.hasAttribute('reverse')) return 'reverse';
    const rootDirection = this.getAttribute('direction');
    if (rootDirection && DIRECTIONS.has(rootDirection as AnimatedBeamDirection)) {
      return rootDirection as AnimatedBeamDirection;
    }
    return this.hasAttribute('reverse') ? 'reverse' : 'forward';
  }

  private _layoutNodes(): void {
    if (!this._canvasEl || !this._svgEl) return;
    const metrics = this._layoutMetrics();
    this._lastLayoutMetrics = metrics;
    const rowCount = this._resolvedRowCount();
    const columnWidth =
      metrics.columns > 1
        ? (metrics.width - metrics.padding * 2 - metrics.columnGap * (metrics.columns - 1)) / metrics.columns
        : metrics.width - metrics.padding * 2;
    const rowHeight =
      rowCount > 1
        ? (metrics.height - metrics.padding * 2 - metrics.rowGap * (rowCount - 1)) / rowCount
        : metrics.height - metrics.padding * 2;

    for (const record of this._nodes) {
      const sizePx = record.sizePx * metrics.scale;
      const x = metrics.padding + columnWidth * (record.column - 0.5) + metrics.columnGap * (record.column - 1);
      const y = metrics.padding + rowHeight * (record.row - 0.5) + metrics.rowGap * (record.row - 1);

      record.centerX = x;
      record.centerY = y;
      record.radiusPx = sizePx / 2;

      record.el.style.left = `${x}px`;
      record.el.style.top = `${y}px`;
      record.el.style.inlineSize = `${sizePx}px`;
      record.el.style.blockSize = `${sizePx}px`;
      record.el.style.zIndex = record.kind === 'hub' ? '2' : '1';
      record.el.style.setProperty('--ui-animated-beam-render-size', `${sizePx}px`);
    }

    this._svgEl.setAttribute('viewBox', `0 0 ${metrics.width} ${metrics.height}`);
    this._canvasEl.style.minHeight = `${metrics.height}px`;
    this.setAttribute('data-row-count', String(rowCount));
    this.setAttribute('data-column-count', String(metrics.columns));
  }

  private _renderConnections(): void {
    if (!this._defsEl || !this._pathsEl || !this._animationStyleEl) return;
    const metrics = this._lastLayoutMetrics || this._layoutMetrics();
    const strokeScale = clampNumber(metrics.scale, 0.72, 1);
    const nodeEffect = this._nodeEffect();
    const motionPreset = this._motionPreset();
    const nodeMap = new Map(this._nodes.map((record) => [record.nodeId, record]));
    const renderRecords: Array<{
      connection: AnimatedBeamConnectionRecord;
      geometry: CubicGeometry;
      travelDistance: number;
    }> = [];
    const defs: string[] = [];
    const paths: string[] = [];

    this._connections.forEach((connection) => {
      const fromNode = nodeMap.get(connection.from);
      const toNode = nodeMap.get(connection.to);
      if (!fromNode || !toNode) return;

      const geometry = createBeamGeometry(fromNode, toNode, connection.curve);
      renderRecords.push({
        connection,
        geometry,
        travelDistance: geometry.length,
      });
    });

    const scheduledDelays = scheduleConnectionDelays(renderRecords, this._delayMs(), this._staggerMs());
    const baseCycleDurationMs = Math.max(
      1,
      ...renderRecords.map((record) => {
        const delayMs = scheduledDelays.get(record.connection) ?? this._delayMs();
        return delayMs + record.connection.durationMs;
      }),
    );
    const effectDurationMs = nodeEffect === 'none' ? 0 : resolveNodeEffectDuration(baseCycleDurationMs);
    const iterationCount = this._repeat() ? 'infinite' : '1';
    const animationRules: string[] = [];
    const nodeArrivalTimes = new Map<string, number>();

    renderRecords.forEach((record) => {
      const delayMs = scheduledDelays.get(record.connection) ?? this._delayMs();
      const arrivalMs = delayMs + record.connection.durationMs;
      const visualEndNodeId = connectionVisualEnd(record.connection);
      nodeArrivalTimes.set(visualEndNodeId, Math.max(nodeArrivalTimes.get(visualEndNodeId) ?? 0, arrivalMs));
    });
    const cycleDurationMs = Math.max(
      baseCycleDurationMs,
      ...Array.from(nodeArrivalTimes.values(), (arrivalMs) => arrivalMs + effectDurationMs),
    );

    renderRecords.forEach((record) => {
      const { connection, geometry, travelDistance } = record;
      const beamGeometry = connection.reverse ? reverseGeometry(geometry) : geometry;
      const gradientId = `${this._uid}-gradient-${connection.index}`;
      const trailWidthValue = Math.max(1, connection.trailWidthPx * strokeScale);
      const beamWidthValue = Math.max(1.5, connection.beamWidthPx * strokeScale);
      const trailWidth = trailWidthValue.toFixed(2);
      const beamWidth = beamWidthValue.toFixed(2);
      const glowWidthValue = Math.max(beamWidthValue * 2, beamWidthValue + 4 * strokeScale);
      const glowWidth = glowWidthValue.toFixed(2);
      const gradientStart = beamGeometry.start;
      const gradientEnd = beamGeometry.end;
      const progressOffset = 0;
      const beamSpan = clampNumber(travelDistance * connection.beamFactor, beamWidthValue * 6, travelDistance * 0.72);
      connection.delayMs = scheduledDelays.get(connection) ?? this._delayMs();
      const glowAnimationName = `${this._uid}-glow-${connection.index}`;
      const coreAnimationName = `${this._uid}-core-${connection.index}`;
      animationRules.push(
        createBeamMotionKeyframes(
          glowAnimationName,
          cycleDurationMs,
          connection.delayMs,
          connection.durationMs,
          'var(--ui-animated-beam-glow-opacity)',
          motionPreset.pattern,
          travelDistance,
          glowWidthValue,
          glowWidthValue * 1.18,
          beamSpan,
        ),
      );
      animationRules.push(
        createBeamMotionKeyframes(
          coreAnimationName,
          cycleDurationMs,
          connection.delayMs,
          connection.durationMs,
          'var(--ui-animated-beam-core-opacity)',
          motionPreset.pattern,
          travelDistance,
          beamWidthValue,
          beamWidthValue * 1.22,
          beamSpan,
        ),
      );

      defs.push(`
        <linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse" x1="${gradientStart.x}" y1="${gradientStart.y}" x2="${gradientEnd.x}" y2="${gradientEnd.y}">
          <stop offset="0%" stop-color="${escapeHtml(connection.colorStart || DEFAULT_COLOR_START)}"></stop>
          <stop offset="100%" stop-color="${escapeHtml(connection.colorEnd || DEFAULT_COLOR_END)}"></stop>
        </linearGradient>
      `);

      paths.push(`
        <g
          class="connection"
          part="connection"
          data-from="${escapeHtml(connection.from)}"
          data-to="${escapeHtml(connection.to)}"
          style="
            --ui-animated-beam-travel-distance:${travelDistance};
            --ui-animated-beam-connection-duration:${connection.durationMs}ms;
            --ui-animated-beam-connection-delay:${connection.delayMs}ms;
            --ui-animated-beam-cycle-duration:${cycleDurationMs}ms;
            --ui-animated-beam-iteration-count:${iterationCount};
            --ui-animated-beam-progress-offset:${progressOffset};
          "
        >
          <path
            class="trail"
            part="trail"
            d="${geometry.d}"
            stroke-width="${trailWidth}"
          ></path>
          <path
            class="beam-glow"
            part="beam beam-glow"
            d="${beamGeometry.d}"
            stroke="url(#${gradientId})"
            stroke-width="${glowWidth}"
            style="animation-name:${glowAnimationName};"
          ></path>
          <path
            class="beam-core"
            part="beam beam-core"
            d="${beamGeometry.d}"
            stroke="url(#${gradientId})"
            stroke-width="${beamWidth}"
            style="animation-name:${coreAnimationName};"
          ></path>
        </g>
      `);
    });

    this._applyNodeEffectStyles(nodeEffect, nodeArrivalTimes, cycleDurationMs, iterationCount, animationRules);

    this._defsEl.innerHTML = defs.join('');
    this._pathsEl.innerHTML = paths.join('');
    this._animationStyleEl.textContent = animationRules.join('\n');
    this.setAttribute('data-path-visible', this._pathVisible() ? 'true' : 'false');
  }

  private _applyNodeEffectStyles(
    effect: AnimatedBeamNodeEffect,
    nodeArrivalTimes: Map<string, number>,
    cycleDurationMs: number,
    iterationCount: string,
    animationRules: string[],
  ): void {
    const effectDurationMs = resolveNodeEffectDuration(cycleDurationMs);

    this._nodes.forEach((node, index) => {
      const arrivalMs = nodeArrivalTimes.get(node.nodeId);
      if (effect === 'none' || arrivalMs == null) {
        this._nodeEffectAnimations.get(node.el)?.cancel();
        this._nodeEffectAnimations.delete(node.el);
        clearNodeEffectStyles(node.el);
        return;
      }

      const animationName = `${this._uid}-node-effect-${index}`;
      animationRules.push(createNodeEffectKeyframes(animationName, cycleDurationMs, arrivalMs, effectDurationMs, effect));
      node.el.style.setProperty('--ui-animated-beam-node-effect-name', animationName);
      node.el.style.setProperty('--ui-animated-beam-node-effect-cycle', `${cycleDurationMs}ms`);
      node.el.style.setProperty('--ui-animated-beam-node-effect-iterations', iterationCount);
      this._startNodeEffectAnimation(node.el, effect, cycleDurationMs, arrivalMs, effectDurationMs, iterationCount);
    });
  }

  private _syncState(): void {
    const paused = this.hasAttribute('paused') || this._prefersReducedMotion();
    this.setAttribute('data-state', paused ? 'paused' : 'running');
    this.setAttribute('data-reduced-motion', this._prefersReducedMotion() ? 'true' : 'false');
    this.setAttribute('data-path-visible', this._pathVisible() ? 'true' : 'false');
    this._syncNodeEffectAnimationState(paused);
  }

  private _startNodeEffectAnimation(
    el: HTMLElement,
    effect: AnimatedBeamNodeEffect,
    cycleDurationMs: number,
    arrivalMs: number,
    effectDurationMs: number,
    iterationCount: string,
  ): void {
    if (typeof el.animate !== 'function' || this._prefersReducedMotion() || effect === 'none') return;

    this._nodeEffectAnimations.get(el)?.cancel();
    const safeCycle = Math.max(cycleDurationMs, 1);
    const startOffset = clampNumber(arrivalMs / safeCycle, 0, 1);
    const peakOffset = clampNumber((arrivalMs + effectDurationMs * 0.35) / safeCycle, startOffset, 1);
    const settleOffset = clampNumber((arrivalMs + effectDurationMs * 0.72) / safeCycle, peakOffset, 1);
    const endOffset = clampNumber((arrivalMs + effectDurationMs) / safeCycle, settleOffset, 1);
    const animation = el.animate(buildNodeEffectKeyframes(effect, startOffset, peakOffset, settleOffset, endOffset), {
      duration: cycleDurationMs,
      iterations: iterationCount === 'infinite' ? Infinity : 1,
      fill: 'both',
      easing: 'linear',
      delay: 0,
    });

    if (this.hasAttribute('paused') || this._prefersReducedMotion()) animation.pause();
    this._nodeEffectAnimations.set(el, animation);
  }

  private _syncNodeEffectAnimationState(paused: boolean): void {
    this._nodeEffectAnimations.forEach((animation) => {
      if (paused) animation.pause();
      else animation.play();
    });
  }

  private _clearNodeEffectAnimations(): void {
    this._nodeEffectAnimations.forEach((animation) => animation.cancel());
    this._nodeEffectAnimations.clear();
  }

  private _layoutMetrics(): LayoutMetrics {
    const sizePreset = this._sizePreset();
    const columns = this._columns();
    const rows = this._resolvedRowCount();
    const rawPadding = this._paddingPx(sizePreset);
    const rawColumnGap = this._columnGapPx(sizePreset);
    const rawRowGap = this._rowGapPx(sizePreset);
    const rawNodeSize = this._nodeSizePx(sizePreset);
    const rawHubSize = this._hubSizePx(sizePreset);
    const rawMinHeight = this._minHeightPx(sizePreset);
    const baseCellSize = Math.max(rawNodeSize, Math.round(rawHubSize * 0.86));
    const naturalWidth = rawPadding * 2 + columns * baseCellSize + Math.max(0, columns - 1) * rawColumnGap;
    const rect = this._canvasEl?.getBoundingClientRect();
    const availableWidth = rect?.width || this.clientWidth || 0;
    const scale = this._autoFit() && availableWidth > 0 && naturalWidth > 0
      ? clampNumber(availableWidth / naturalWidth, 0.2, 1)
      : 1;
    const padding = rawPadding * scale;
    const columnGap = rawColumnGap * scale;
    const rowGap = rawRowGap * scale;
    const nodeSize = rawNodeSize * scale;
    const hubSize = rawHubSize * scale;
    const minHeight = rawMinHeight * scale;
    const fallbackHeight = Math.max(
      minHeight,
      padding * 2 + rows * Math.max(nodeSize, Math.round(hubSize * 0.86)) + Math.max(0, rows - 1) * rowGap
    );
    const width = this._autoFit() && availableWidth > 0 ? availableWidth : Math.max(availableWidth, naturalWidth);
    const height = Math.max(rect?.height || this.clientHeight || 0, fallbackHeight);

    return {
      width,
      height,
      scale,
      padding,
      columns,
      rows,
      columnGap,
      rowGap,
      nodeSize,
      hubSize,
    };
  }

  private _resolvedRowCount(): number {
    const declaredRows = this._declaredRows();
    const maxNodeRow = this._nodes.reduce((max, record) => Math.max(max, record.row), 1);
    return Math.max(1, declaredRows || maxNodeRow);
  }

  private _declaredRows(): number | null {
    const raw = parseInteger(this.getAttribute('rows'), NaN);
    return Number.isFinite(raw) ? clampInteger(raw, 1, 12) : null;
  }

  private _columns(): number {
    return clampInteger(parseInteger(this.getAttribute('columns'), DEFAULT_COLUMNS), 1, 6);
  }

  private _paddingPx(sizePreset: AnimatedBeamSizePreset): number {
    return parseLengthToPx(this.getAttribute('padding'), sizePreset.padding);
  }

  private _columnGapPx(sizePreset: AnimatedBeamSizePreset): number {
    return parseLengthToPx(this.getAttribute('column-gap'), sizePreset.columnGap);
  }

  private _rowGapPx(sizePreset: AnimatedBeamSizePreset): number {
    return parseLengthToPx(this.getAttribute('row-gap'), sizePreset.rowGap);
  }

  private _nodeSizePx(sizePreset: AnimatedBeamSizePreset): number {
    return parseLengthToPx(this.getAttribute('node-size'), sizePreset.nodeSize);
  }

  private _hubSizePx(sizePreset: AnimatedBeamSizePreset): number {
    return parseLengthToPx(this.getAttribute('hub-size'), sizePreset.hubSize);
  }

  private _minHeightPx(sizePreset: AnimatedBeamSizePreset): number {
    return parseLengthToPx(this.getAttribute('min-height'), sizePreset.minHeight);
  }

  private _requiredWidthPx(sizePreset: AnimatedBeamSizePreset): number {
    const columns = this._columns();
    const padding = this._paddingPx(sizePreset);
    const columnGap = this._columnGapPx(sizePreset);
    const nodeSize = this._nodeSizePx(sizePreset);
    const hubSize = this._hubSizePx(sizePreset);
    const baseCellSize = Math.max(nodeSize, Math.round(hubSize * 0.86));
    return padding * 2 + columns * baseCellSize + Math.max(0, columns - 1) * columnGap;
  }

  private _autoFit(): boolean {
    const raw = this.getAttribute('auto-fit');
    return raw == null ? false : parseBooleanAttribute(raw, true);
  }

  private _trailWidthPx(): number {
    return parseLengthToPx(this.getAttribute('trail-width'), DEFAULT_TRAIL_WIDTH);
  }

  private _beamWidthPx(): number {
    return parseLengthToPx(this.getAttribute('beam-width'), DEFAULT_BEAM_WIDTH);
  }

  private _durationMs(): number {
    return parseTimeToMs(this.getAttribute('duration'), DEFAULT_DURATION);
  }

  private _delayMs(): number {
    return parseTimeToMs(this.getAttribute('delay'), DEFAULT_DELAY);
  }

  private _staggerMs(): number {
    return parseTimeToMs(this.getAttribute('stagger'), DEFAULT_STAGGER);
  }

  private _beamFactor(motionPreset: AnimatedBeamMotionPreset): number {
    return clampNumber(parseFloatSafe(this.getAttribute('beam-factor'), motionPreset.beamFactor), 0.06, 0.48);
  }

  private _sizePreset(): AnimatedBeamSizePreset {
    const raw = this.getAttribute('size');
    if (raw === 'xxs' || raw === '0') return SIZE_PRESETS.xxs;
    if (raw === 'xs') return SIZE_PRESETS.xs;
    if (raw === 'sm' || raw === '1') return SIZE_PRESETS.sm;
    if (raw === 'lg' || raw === '3') return SIZE_PRESETS.lg;
    return SIZE_PRESETS.md;
  }

  private _motionPreset(): AnimatedBeamMotionPreset {
    const raw = this.getAttribute('animation');
    return raw && ANIMATIONS.has(raw as AnimatedBeamAnimation)
      ? MOTION_PRESETS[raw as AnimatedBeamAnimation]
      : MOTION_PRESETS.smooth;
  }

  private _tone(): AnimatedBeamTone {
    const raw = this.getAttribute('tone');
    return raw && TONES.has(raw as AnimatedBeamTone) ? (raw as AnimatedBeamTone) : 'brand';
  }

  private _pathVisible(): boolean {
    const raw = this.getAttribute('path');
    return raw == null ? true : parseBooleanAttribute(raw, true);
  }

  private _repeat(): boolean {
    const raw = this.getAttribute('repeat');
    return raw == null ? true : parseBooleanAttribute(raw, true);
  }

  private _nodeEffect(): AnimatedBeamNodeEffect {
    const raw = this.getAttribute('node-effect');
    return raw && NODE_EFFECTS.has(raw as AnimatedBeamNodeEffect) ? (raw as AnimatedBeamNodeEffect) : 'none';
  }
}

function createBeamGeometry(
  fromNode: AnimatedBeamNodeRecord,
  toNode: AnimatedBeamNodeRecord,
  curve: AnimatedBeamCurve,
): CubicGeometry {
  const origin = { x: fromNode.centerX, y: fromNode.centerY };
  const destination = { x: toNode.centerX, y: toNode.centerY };
  const angle = Math.atan2(destination.y - origin.y, destination.x - origin.x);
  const start = offsetPoint(origin, angle, Math.max(0, fromNode.radiusPx - NODE_PATH_OVERLAP));
  const end = offsetPoint(destination, angle + Math.PI, Math.max(0, toNode.radiusPx - NODE_PATH_OVERLAP));
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  if (curve === 'straight' || (curve === 'auto' && absDy < Math.max(8, Math.min(fromNode.radiusPx, toNode.radiusPx) * 0.28))) {
    return {
      kind: 'line',
      start,
      end,
      d: `M ${round(start.x)} ${round(start.y)} L ${round(end.x)} ${round(end.y)}`,
      length: distance(start, end),
    };
  }

  const factor = curve === 'arc' ? 0.56 : curve === 'soft' ? 0.34 : absDy > absDx * 0.45 ? 0.48 : 0.4;
  if (absDx >= absDy) {
    const controlOffset = Math.max(absDx * factor, 44);
    const c1 = { x: start.x + Math.sign(dx || 1) * controlOffset, y: start.y };
    const c2 = { x: end.x - Math.sign(dx || 1) * controlOffset, y: end.y };
    return {
      kind: 'cubic',
      start,
      end,
      c1,
      c2,
      d: `M ${round(start.x)} ${round(start.y)} C ${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(end.x)} ${round(end.y)}`,
      length: approximateCubicLength(start, c1, c2, end),
    };
  }

  const controlOffset = Math.max(absDy * factor, 44);
  const c1 = { x: start.x, y: start.y + Math.sign(dy || 1) * controlOffset };
  const c2 = { x: end.x, y: end.y - Math.sign(dy || 1) * controlOffset };
  return {
    kind: 'cubic',
    start,
    end,
    c1,
    c2,
    d: `M ${round(start.x)} ${round(start.y)} C ${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(end.x)} ${round(end.y)}`,
    length: approximateCubicLength(start, c1, c2, end),
  };
}

function reverseGeometry(geometry: CubicGeometry): CubicGeometry {
  if (geometry.kind === 'line') {
    return {
      kind: 'line',
      start: geometry.end,
      end: geometry.start,
      d: `M ${round(geometry.end.x)} ${round(geometry.end.y)} L ${round(geometry.start.x)} ${round(geometry.start.y)}`,
      length: geometry.length,
    };
  }

  const c1 = geometry.c2!;
  const c2 = geometry.c1!;
  return {
    kind: 'cubic',
    start: geometry.end,
    end: geometry.start,
    c1,
    c2,
    d: `M ${round(geometry.end.x)} ${round(geometry.end.y)} C ${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(geometry.start.x)} ${round(geometry.start.y)}`,
    length: geometry.length,
  };
}

function scheduleConnectionDelays(
  renderRecords: Array<{
    connection: AnimatedBeamConnectionRecord;
    travelDistance: number;
  }>,
  rootDelay: number,
  stagger: number,
): Map<AnimatedBeamConnectionRecord, number> {
  const incomingByNode = new Map<string, typeof renderRecords>();
  const nodeArrivalCache = new Map<string, number>();
  const connectionDelayCache = new Map<AnimatedBeamConnectionRecord, number>();
  const resolvingNodes = new Set<string>();
  const resolvingConnections = new Set<AnimatedBeamConnectionRecord>();

  for (const record of renderRecords) {
    const visualEndNodeId = connectionVisualEnd(record.connection);
    const existing = incomingByNode.get(visualEndNodeId);
    if (existing) existing.push(record);
    else incomingByNode.set(visualEndNodeId, [record]);
  }

  const resolveNodeArrival = (nodeId: string): number => {
    const cached = nodeArrivalCache.get(nodeId);
    if (cached != null) return cached;
    if (resolvingNodes.has(nodeId)) return rootDelay;

    resolvingNodes.add(nodeId);
    const incoming = incomingByNode.get(nodeId);
    let arrivalMs = rootDelay;

    if (incoming?.length) {
      arrivalMs = incoming.reduce((latestArrival, record) => {
        const connectionStart = resolveConnectionDelay(record.connection);
        return Math.max(latestArrival, connectionStart + record.connection.durationMs);
      }, rootDelay);
    }

    resolvingNodes.delete(nodeId);
    nodeArrivalCache.set(nodeId, arrivalMs);
    return arrivalMs;
  };

  const resolveConnectionDelay = (connection: AnimatedBeamConnectionRecord): number => {
    const cached = connectionDelayCache.get(connection);
    if (cached != null) return cached;
    if (resolvingConnections.has(connection)) return rootDelay;

    resolvingConnections.add(connection);
    const inheritedDelay = resolveNodeArrival(connectionVisualStart(connection));
    const siblingDelay = connection.hasExplicitDelay ? 0 : connection.siblingIndex * stagger;
    const scheduledDelay = inheritedDelay + siblingDelay + connection.localDelayMs;
    resolvingConnections.delete(connection);
    connectionDelayCache.set(connection, scheduledDelay);
    return scheduledDelay;
  };

  for (const record of renderRecords) {
    connectionDelayCache.set(record.connection, resolveConnectionDelay(record.connection));
  }

  return connectionDelayCache;
}

function createBeamMotionKeyframes(
  animationName: string,
  cycleDurationMs: number,
  delayMs: number,
  durationMs: number,
  targetOpacity: string,
  motionPattern: AnimatedBeamMotionPattern,
  travelDistance: number,
  baseStrokeWidth: number,
  peakStrokeWidth: number,
  beamSpan: number,
): string {
  const safeCycle = Math.max(cycleDurationMs, 1);
  const startPercent = clampNumber((delayMs / safeCycle) * 100, 0, 100);
  const endPercent = clampNumber(((delayMs + durationMs) / safeCycle) * 100, startPercent, 100);
  const revealPercent = clampNumber(startPercent + Math.max((durationMs / safeCycle) * 100 * 0.02, 0.01), startPercent, endPercent);
  const start = roundPercent(startPercent);
  const reveal = roundPercent(revealPercent);
  const end = roundPercent(endPercent);
  const baseWidth = round(baseStrokeWidth);
  const peakWidth = round(peakStrokeWidth);
  const travel = round(travelDistance);
  const span = round(beamSpan);

  if (motionPattern === 'pulse') {
    const peakPercent = clampNumber(startPercent + (endPercent - startPercent) * 0.42, revealPercent, endPercent);
    const settlePercent = clampNumber(startPercent + (endPercent - startPercent) * 0.82, peakPercent, endPercent);
    const peak = roundPercent(peakPercent);
    const settle = roundPercent(settlePercent);

    return `
      @keyframes ${animationName} {
        0%, ${start}% {
          opacity: 0;
          stroke-dasharray: ${span} ${travel};
          stroke-dashoffset: 0;
          stroke-width: ${baseWidth};
        }
        ${reveal}% {
          opacity: calc(${targetOpacity} * 0.72);
          stroke-dasharray: ${span} ${travel};
          stroke-dashoffset: 0;
          stroke-width: ${baseWidth};
        }
        ${peak}% {
          opacity: ${targetOpacity};
          stroke-dasharray: ${span} ${travel};
          stroke-dashoffset: ${round(-travelDistance * 0.44)};
          stroke-width: ${peakWidth};
        }
        ${settle}% {
          opacity: calc(${targetOpacity} * 0.68);
          stroke-dasharray: ${span} ${travel};
          stroke-dashoffset: ${round(-travelDistance * 0.84)};
          stroke-width: ${baseWidth};
        }
        ${end}%,
        100% {
          opacity: 0;
          stroke-dasharray: ${span} ${travel};
          stroke-dashoffset: ${round(-travelDistance)};
          stroke-width: ${baseWidth};
        }
      }
    `;
  }

  if (motionPattern === 'heartbeat') {
    const beatSpan = clampNumber(beamSpan * 0.72, baseStrokeWidth * 4.5, travelDistance * 0.42);
    const beat = round(beatSpan);
    const beatOnePercent = clampNumber(startPercent + (endPercent - startPercent) * 0.24, revealPercent, endPercent);
    const valleyPercent = clampNumber(startPercent + (endPercent - startPercent) * 0.34, beatOnePercent, endPercent);
    const beatTwoPercent = clampNumber(startPercent + (endPercent - startPercent) * 0.48, valleyPercent, endPercent);
    const settlePercent = clampNumber(startPercent + (endPercent - startPercent) * 0.82, beatTwoPercent, endPercent);
    const beatOne = roundPercent(beatOnePercent);
    const valley = roundPercent(valleyPercent);
    const beatTwo = roundPercent(beatTwoPercent);
    const settle = roundPercent(settlePercent);

    return `
      @keyframes ${animationName} {
        0%, ${start}% {
          opacity: 0;
          stroke-dasharray: ${beat} ${travel};
          stroke-dashoffset: 0;
          stroke-width: ${baseWidth};
        }
        ${reveal}% {
          opacity: calc(${targetOpacity} * 0.7);
          stroke-dasharray: ${beat} ${travel};
          stroke-dashoffset: 0;
          stroke-width: ${baseWidth};
        }
        ${beatOne}% {
          opacity: calc(${targetOpacity} * 0.88);
          stroke-dasharray: ${beat} ${travel};
          stroke-dashoffset: ${round(-travelDistance * 0.24)};
          stroke-width: ${round(baseStrokeWidth * 1.08)};
        }
        ${valley}% {
          opacity: calc(${targetOpacity} * 0.5);
          stroke-dasharray: ${beat} ${travel};
          stroke-dashoffset: ${round(-travelDistance * 0.34)};
          stroke-width: ${baseWidth};
        }
        ${beatTwo}% {
          opacity: ${targetOpacity};
          stroke-dasharray: ${beat} ${travel};
          stroke-dashoffset: ${round(-travelDistance * 0.5)};
          stroke-width: ${peakWidth};
        }
        ${settle}% {
          opacity: calc(${targetOpacity} * 0.7);
          stroke-dasharray: ${beat} ${travel};
          stroke-dashoffset: ${round(-travelDistance * 0.84)};
          stroke-width: ${baseWidth};
        }
        ${end}%,
        100% {
          opacity: 0;
          stroke-dasharray: ${beat} ${travel};
          stroke-dashoffset: ${round(-travelDistance)};
          stroke-width: ${baseWidth};
        }
      }
    `;
  }

  return `
    @keyframes ${animationName} {
      0%, ${start}% {
        opacity: 0;
        stroke-dasharray: 0 ${travel};
        stroke-width: ${baseWidth};
      }
      ${reveal}% {
        opacity: ${targetOpacity};
        stroke-dasharray: 0 ${travel};
        stroke-width: ${baseWidth};
      }
      ${end}%, 100% {
        opacity: ${targetOpacity};
        stroke-dasharray: ${travel} 0;
        stroke-width: ${baseWidth};
      }
    }
  `;
}

function connectionVisualStart(connection: AnimatedBeamConnectionRecord): string {
  return connection.reverse ? connection.to : connection.from;
}

function connectionVisualEnd(connection: AnimatedBeamConnectionRecord): string {
  return connection.reverse ? connection.from : connection.to;
}

function resolveNodeEffectDuration(cycleDurationMs: number): number {
  return clampNumber(cycleDurationMs * 0.16, 360, 900);
}

function createNodeEffectKeyframes(
  animationName: string,
  cycleDurationMs: number,
  arrivalMs: number,
  effectDurationMs: number,
  effect: AnimatedBeamNodeEffect,
): string {
  const safeCycle = Math.max(cycleDurationMs, 1);
  const startPercent = clampNumber((arrivalMs / safeCycle) * 100, 0, 100);
  const peakPercent = clampNumber(((arrivalMs + effectDurationMs * 0.35) / safeCycle) * 100, startPercent, 100);
  const settlePercent = clampNumber(((arrivalMs + effectDurationMs * 0.72) / safeCycle) * 100, peakPercent, 100);
  const endPercent = clampNumber(((arrivalMs + effectDurationMs) / safeCycle) * 100, settlePercent, 100);
  const start = roundPercent(startPercent);
  const peak = roundPercent(peakPercent);
  const settle = roundPercent(settlePercent);
  const end = roundPercent(endPercent);

  if (effect === 'shake') {
    const shakeAPercent = clampNumber(startPercent + (peakPercent - startPercent) * 0.3, startPercent, peakPercent);
    const shakeBPercent = clampNumber(startPercent + (peakPercent - startPercent) * 0.65, shakeAPercent, peakPercent);
    const shakeA = roundPercent(shakeAPercent);
    const shakeB = roundPercent(shakeBPercent);
    return `
      @keyframes ${animationName} {
        0%, ${start}%, 100% {
          transform: translate(-50%, -50%) scale(1);
          box-shadow: var(--ui-animated-beam-node-base-shadow);
          border-color: color-mix(in srgb, var(--ui-animated-beam-accent) 12%, rgba(15, 23, 42, 0.1));
        }
        ${shakeA}% {
          transform: translate(calc(-50% - 2px), calc(-50% + 1px)) scale(1.02) rotate(-2deg);
          box-shadow:
            var(--ui-animated-beam-node-base-shadow),
            0 0 0 5px var(--ui-animated-beam-node-effect-ring);
          border-color: color-mix(in srgb, var(--ui-animated-beam-accent-end) 30%, transparent);
        }
        ${shakeB}% {
          transform: translate(calc(-50% + 2px), calc(-50% - 1px)) scale(1.03) rotate(2deg);
        }
        ${peak}% {
          transform: translate(-50%, -50%) scale(1.03);
          box-shadow:
            var(--ui-animated-beam-node-base-shadow),
            0 0 0 6px var(--ui-animated-beam-node-effect-ring),
            0 0 24px var(--ui-animated-beam-node-effect-glow);
        }
        ${settle}%,
        ${end}% {
          transform: translate(-50%, -50%) scale(1);
          box-shadow: var(--ui-animated-beam-node-base-shadow);
          border-color: color-mix(in srgb, var(--ui-animated-beam-accent) 12%, rgba(15, 23, 42, 0.1));
        }
      }
    `;
  }

  const peakTransform =
    effect === 'pulse'
      ? 'translate(-50%, -50%) scale(1.08)'
      : effect === 'ring'
        ? 'translate(-50%, -50%) scale(1.04)'
        : 'translate(-50%, -50%) scale(1.03)';
  const peakShadow =
    effect === 'ring'
      ? `var(--ui-animated-beam-node-base-shadow), 0 0 0 7px var(--ui-animated-beam-node-effect-ring)`
      : effect === 'pulse'
        ? `var(--ui-animated-beam-node-base-shadow), 0 0 0 6px var(--ui-animated-beam-node-effect-ring), 0 0 20px var(--ui-animated-beam-node-effect-glow)`
        : `var(--ui-animated-beam-node-base-shadow), 0 0 0 5px var(--ui-animated-beam-node-effect-ring), 0 0 28px var(--ui-animated-beam-node-effect-glow)`;
  const peakBorder =
    effect === 'ring'
      ? 'color-mix(in srgb, var(--ui-animated-beam-accent-end) 34%, transparent)'
      : 'color-mix(in srgb, var(--ui-animated-beam-accent) 28%, transparent)';

  return `
    @keyframes ${animationName} {
      0%, ${start}%, 100% {
        transform: translate(-50%, -50%) scale(1);
        box-shadow: var(--ui-animated-beam-node-base-shadow);
        border-color: color-mix(in srgb, var(--ui-animated-beam-accent) 12%, rgba(15, 23, 42, 0.1));
      }
      ${peak}% {
        transform: ${peakTransform};
        box-shadow: ${peakShadow};
        border-color: ${peakBorder};
      }
      ${settle}%,
      ${end}% {
        transform: translate(-50%, -50%) scale(1);
        box-shadow: var(--ui-animated-beam-node-base-shadow);
        border-color: color-mix(in srgb, var(--ui-animated-beam-accent) 12%, rgba(15, 23, 42, 0.1));
      }
    }
  `;
}

function buildNodeEffectKeyframes(
  effect: AnimatedBeamNodeEffect,
  startOffset = 0,
  peakOffset = 0.1,
  settleOffset = 0.16,
  endOffset = 0.2,
): Keyframe[] {
  const base: Keyframe = {
    offset: 0,
    transform: 'translate(-50%, -50%) scale(1)',
    boxShadow: 'var(--ui-animated-beam-node-base-shadow)',
    borderColor: 'color-mix(in srgb, var(--ui-animated-beam-accent) 12%, rgba(15, 23, 42, 0.1))',
  };

  if (effect === 'shake') {
    const shakeAOffset = startOffset + (peakOffset - startOffset) * 0.3;
    const shakeBOffset = startOffset + (peakOffset - startOffset) * 0.65;
    return [
      { ...base, offset: 0 },
      { ...base, offset: startOffset },
      {
        offset: shakeAOffset,
        transform: 'translate(calc(-50% - 2px), calc(-50% + 1px)) scale(1.02) rotate(-2deg)',
        boxShadow: 'var(--ui-animated-beam-node-base-shadow), 0 0 0 5px var(--ui-animated-beam-node-effect-ring)',
        borderColor: 'color-mix(in srgb, var(--ui-animated-beam-accent-end) 30%, transparent)',
      },
      {
        offset: shakeBOffset,
        transform: 'translate(calc(-50% + 2px), calc(-50% - 1px)) scale(1.03) rotate(2deg)',
        boxShadow: 'var(--ui-animated-beam-node-base-shadow), 0 0 0 5px var(--ui-animated-beam-node-effect-ring)',
        borderColor: 'color-mix(in srgb, var(--ui-animated-beam-accent-end) 30%, transparent)',
      },
      {
        offset: peakOffset,
        transform: 'translate(-50%, -50%) scale(1.03)',
        boxShadow: 'var(--ui-animated-beam-node-base-shadow), 0 0 0 6px var(--ui-animated-beam-node-effect-ring), 0 0 24px var(--ui-animated-beam-node-effect-glow)',
        borderColor: 'color-mix(in srgb, var(--ui-animated-beam-accent-end) 30%, transparent)',
      },
      { ...base, offset: settleOffset },
      { ...base, offset: endOffset },
      { ...base, offset: 1 },
    ];
  }

  const peakTransform =
    effect === 'pulse'
      ? 'translate(-50%, -50%) scale(1.08)'
      : effect === 'ring'
        ? 'translate(-50%, -50%) scale(1.04)'
        : 'translate(-50%, -50%) scale(1.03)';
  const peakShadow =
    effect === 'ring'
      ? 'var(--ui-animated-beam-node-base-shadow), 0 0 0 7px var(--ui-animated-beam-node-effect-ring)'
      : effect === 'pulse'
        ? 'var(--ui-animated-beam-node-base-shadow), 0 0 0 6px var(--ui-animated-beam-node-effect-ring), 0 0 20px var(--ui-animated-beam-node-effect-glow)'
        : 'var(--ui-animated-beam-node-base-shadow), 0 0 0 5px var(--ui-animated-beam-node-effect-ring), 0 0 28px var(--ui-animated-beam-node-effect-glow)';
  const peakBorder =
    effect === 'ring'
      ? 'color-mix(in srgb, var(--ui-animated-beam-accent-end) 34%, transparent)'
      : 'color-mix(in srgb, var(--ui-animated-beam-accent) 28%, transparent)';

  return [
    { ...base, offset: 0 },
    { ...base, offset: startOffset },
    {
      offset: peakOffset,
      transform: peakTransform,
      boxShadow: peakShadow,
      borderColor: peakBorder,
    },
    { ...base, offset: settleOffset },
    { ...base, offset: endOffset },
    { ...base, offset: 1 },
  ];
}

function approximateCubicLength(start: Point, c1: Point, c2: Point, end: Point): number {
  let total = 0;
  let previous = start;
  const segments = 18;
  for (let index = 1; index <= segments; index += 1) {
    const t = index / segments;
    const point = cubicPoint(start, c1, c2, end, t);
    total += distance(previous, point);
    previous = point;
  }
  return total;
}

function cubicPoint(start: Point, c1: Point, c2: Point, end: Point, t: number): Point {
  const inv = 1 - t;
  const x =
    inv * inv * inv * start.x +
    3 * inv * inv * t * c1.x +
    3 * inv * t * t * c2.x +
    t * t * t * end.x;
  const y =
    inv * inv * inv * start.y +
    3 * inv * inv * t * c1.y +
    3 * inv * t * t * c2.y +
    t * t * t * end.y;
  return { x, y };
}

function offsetPoint(origin: Point, angle: number, radius: number): Point {
  return {
    x: origin.x + Math.cos(angle) * radius,
    y: origin.y + Math.sin(angle) * radius,
  };
}

function cleanupBeamManagedNode(el: HTMLElement): void {
  el.removeAttribute('data-ui-animated-beam-managed');
  el.removeAttribute('data-ui-animated-beam-node');
  el.removeAttribute('data-ui-animated-beam-hub');
  if (el.hasAttribute('data-ui-animated-beam-node-id-owned')) {
    el.removeAttribute('node-id');
    el.removeAttribute('data-ui-animated-beam-node-id-owned');
  }
  el.style.removeProperty('left');
  el.style.removeProperty('top');
  el.style.removeProperty('inline-size');
  el.style.removeProperty('block-size');
  el.style.removeProperty('z-index');
  el.style.removeProperty('--ui-animated-beam-render-size');
  clearNodeEffectStyles(el);
}

function cleanupBeamManagedConnection(el: HTMLElement): void {
  el.removeAttribute('data-ui-animated-beam-managed');
  el.removeAttribute('data-ui-animated-beam-connection');
}

function clearNodeEffectStyles(el: HTMLElement): void {
  el.style.removeProperty('--ui-animated-beam-node-effect-name');
  el.style.removeProperty('--ui-animated-beam-node-effect-cycle');
  el.style.removeProperty('--ui-animated-beam-node-effect-iterations');
}

function normalizeTone(value: string | null): AnimatedBeamTone | null {
  return value && TONES.has(value as AnimatedBeamTone) ? (value as AnimatedBeamTone) : null;
}

function normalizeLength(value: string | null): string | null {
  if (!value) return null;
  if (/^-?\d+(\.\d+)?$/.test(value.trim())) return `${value.trim()}px`;
  return value;
}

function parseLengthToPx(value: string | null, fallback: number): number {
  const normalized = normalizeLength(value);
  if (!normalized) return fallback;
  const match = normalized.match(/-?\d+(\.\d+)?/);
  if (!match) return fallback;
  return Number.parseFloat(match[0]);
}

function parseTimeToMs(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number.parseFloat(trimmed);
  if (trimmed.endsWith('ms')) return Number.parseFloat(trimmed.slice(0, -2)) || fallback;
  if (trimmed.endsWith('s')) return (Number.parseFloat(trimmed.slice(0, -1)) || fallback / 1000) * 1000;
  return fallback;
}

function parseBooleanAttribute(value: string | null, fallback: boolean): boolean {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'off' || normalized === 'no') return false;
  if (normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes') return true;
  return fallback;
}

function parseInteger(value: string | null, fallback: number): number {
  if (value == null) return fallback;
  const next = Number.parseInt(value, 10);
  return Number.isFinite(next) ? next : fallback;
}

function parseFloatSafe(value: string | null, fallback: number): number {
  if (value == null) return fallback;
  const next = Number.parseFloat(value);
  return Number.isFinite(next) ? next : fallback;
}

function clampInteger(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function round(value: number): string {
  return value.toFixed(2);
}

function roundPercent(value: number): string {
  return value.toFixed(4).replace(/\.?0+$/, '');
}

function escapeHtml(value: string): string {
  return value
    .split('&').join('&amp;')
    .split('"').join('&quot;')
    .split('<').join('&lt;')
    .split('>').join('&gt;');
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-animated-beam': UIAnimatedBeam;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-animated-beam')) {
  customElements.define('ui-animated-beam', UIAnimatedBeam);
}
