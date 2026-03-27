import { ElementBase } from '../ElementBase';

type IconCloudDirection = 'clockwise' | 'counterclockwise';
type IconCloudVariant = 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
type IconCloudTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type IconCloudSize = 'sm' | 'md' | 'lg' | 'xl' | '1' | '2' | '3' | '4';
type IconCloudElevation = 'none' | 'low' | 'high';

type Point3D = { x: number; y: number; z: number };
type SizePreset = {
  radius: string;
  radiusPx: number;
  itemSize: string;
  itemSizePx: number;
  centerSize: string;
  padding: string;
  shellRadius: string;
};

const DEFAULT_PERSPECTIVE = '920px';
const DEFAULT_DEPTH = 0.86;
const DEFAULT_SPEED = 1;
const DEFAULT_PADDING = '20px';
const DEFAULT_RADIUS = '118px';
const DEFAULT_ITEM_SIZE = '40px';
const DEFAULT_CENTER_SIZE = '118px';
const DEFAULT_SHELL_RADIUS = '30px';

const DIRECTIONS = new Set<IconCloudDirection>(['clockwise', 'counterclockwise']);
const VARIANTS = new Set<IconCloudVariant>(['surface', 'soft', 'solid', 'glass', 'contrast', 'minimal']);
const TONES = new Set<IconCloudTone>(['brand', 'neutral', 'info', 'success', 'warning', 'danger']);
const SIZES = new Set<IconCloudSize>(['sm', 'md', 'lg', 'xl', '1', '2', '3', '4']);
const ELEVATIONS = new Set<IconCloudElevation>(['none', 'low', 'high']);

const SIZE_PRESETS: Record<'sm' | 'md' | 'lg' | 'xl', SizePreset> = {
  sm: {
    radius: '90px',
    radiusPx: 90,
    itemSize: '32px',
    itemSizePx: 32,
    centerSize: '84px',
    padding: '14px',
    shellRadius: '24px',
  },
  md: {
    radius: DEFAULT_RADIUS,
    radiusPx: 118,
    itemSize: DEFAULT_ITEM_SIZE,
    itemSizePx: 40,
    centerSize: DEFAULT_CENTER_SIZE,
    padding: '18px',
    shellRadius: '28px',
  },
  lg: {
    radius: '140px',
    radiusPx: 140,
    itemSize: '46px',
    itemSizePx: 46,
    centerSize: '132px',
    padding: '22px',
    shellRadius: '32px',
  },
  xl: {
    radius: '164px',
    radiusPx: 164,
    itemSize: '54px',
    itemSizePx: 54,
    centerSize: '152px',
    padding: '26px',
    shellRadius: '36px',
  },
};

const style = `
  :host {
    --ui-icon-cloud-radius: ${DEFAULT_RADIUS};
    --ui-icon-cloud-item-size: ${DEFAULT_ITEM_SIZE};
    --ui-icon-cloud-center-size: ${DEFAULT_CENTER_SIZE};
    --ui-icon-cloud-padding: ${DEFAULT_PADDING};
    --ui-icon-cloud-perspective: ${DEFAULT_PERSPECTIVE};
    --ui-icon-cloud-depth: ${DEFAULT_DEPTH};
    --ui-icon-cloud-shell-radius: ${DEFAULT_SHELL_RADIUS};
    --ui-icon-cloud-tilt-x: 0deg;
    --ui-icon-cloud-tilt-y: 0deg;
    --ui-icon-cloud-fit-scale: 1;
    --ui-icon-cloud-fit-inline-size: auto;
    --ui-icon-cloud-fit-block-size: auto;
    --ui-icon-cloud-stage-size:
      calc((var(--ui-icon-cloud-radius) * 2) + var(--ui-icon-cloud-item-size));
    --ui-icon-cloud-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-icon-cloud-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 92%, transparent) 0%,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent) 64%,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 88%, transparent) 100%
      );
    --ui-icon-cloud-color: var(--ui-color-text, #0f172a);
    --ui-icon-cloud-border-color:
      color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 84%, transparent);
    --ui-icon-cloud-border: 1px solid var(--ui-icon-cloud-border-color);
    --ui-icon-cloud-shadow:
      0 1px 3px rgba(15, 23, 42, 0.06),
      0 24px 44px rgba(15, 23, 42, 0.12);
    --ui-icon-cloud-backdrop: none;
    --ui-icon-cloud-grid-color:
      color-mix(in srgb, var(--ui-icon-cloud-accent) 16%, var(--ui-icon-cloud-border-color));
    --ui-icon-cloud-item-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #ffffff 96%, transparent),
        color-mix(in srgb, var(--ui-icon-cloud-accent) 8%, rgba(255, 255, 255, 0.92))
      );
    --ui-icon-cloud-item-border:
      1px solid color-mix(in srgb, var(--ui-icon-cloud-accent) 12%, rgba(255, 255, 255, 0.82));
    --ui-icon-cloud-item-color: var(--ui-icon-cloud-color);
    --ui-icon-cloud-item-shadow:
      0 8px 16px rgba(15, 23, 42, 0.08),
      0 1px 2px rgba(15, 23, 42, 0.05);
    --ui-icon-cloud-item-backdrop: none;
    --ui-icon-cloud-item-radius: 14px;
    --ui-icon-cloud-center-bg:
      radial-gradient(
        circle at 50% 35%,
        color-mix(in srgb, #ffffff 92%, transparent) 0%,
        color-mix(in srgb, var(--ui-icon-cloud-accent) 12%, rgba(255, 255, 255, 0.94)) 100%
      );
    --ui-icon-cloud-center-border:
      1px solid color-mix(in srgb, var(--ui-icon-cloud-accent) 20%, rgba(255, 255, 255, 0.84));
    --ui-icon-cloud-center-shadow:
      0 12px 28px rgba(15, 23, 42, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    --ui-icon-cloud-center-backdrop: none;
    --ui-icon-cloud-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));

    display: inline-block;
    min-inline-size: 0;
    color: var(--ui-icon-cloud-color);
    color-scheme: light dark;
    font-family: "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-sizing: border-box;
  }

  :host([auto-fit]) {
    display: block;
    inline-size: 100%;
    max-inline-size: 100%;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-icon-cloud-radius: ${SIZE_PRESETS.sm.radius};
    --ui-icon-cloud-item-size: ${SIZE_PRESETS.sm.itemSize};
    --ui-icon-cloud-center-size: ${SIZE_PRESETS.sm.centerSize};
    --ui-icon-cloud-padding: ${SIZE_PRESETS.sm.padding};
    --ui-icon-cloud-shell-radius: ${SIZE_PRESETS.sm.shellRadius};
    --ui-icon-cloud-item-radius: 12px;
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-icon-cloud-radius: ${SIZE_PRESETS.md.radius};
    --ui-icon-cloud-item-size: ${SIZE_PRESETS.md.itemSize};
    --ui-icon-cloud-center-size: ${SIZE_PRESETS.md.centerSize};
    --ui-icon-cloud-padding: ${SIZE_PRESETS.md.padding};
    --ui-icon-cloud-shell-radius: ${SIZE_PRESETS.md.shellRadius};
    --ui-icon-cloud-item-radius: 14px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-icon-cloud-radius: ${SIZE_PRESETS.lg.radius};
    --ui-icon-cloud-item-size: ${SIZE_PRESETS.lg.itemSize};
    --ui-icon-cloud-center-size: ${SIZE_PRESETS.lg.centerSize};
    --ui-icon-cloud-padding: ${SIZE_PRESETS.lg.padding};
    --ui-icon-cloud-shell-radius: ${SIZE_PRESETS.lg.shellRadius};
    --ui-icon-cloud-item-radius: 16px;
  }

  :host([size="xl"]),
  :host([size="4"]) {
    --ui-icon-cloud-radius: ${SIZE_PRESETS.xl.radius};
    --ui-icon-cloud-item-size: ${SIZE_PRESETS.xl.itemSize};
    --ui-icon-cloud-center-size: ${SIZE_PRESETS.xl.centerSize};
    --ui-icon-cloud-padding: ${SIZE_PRESETS.xl.padding};
    --ui-icon-cloud-shell-radius: ${SIZE_PRESETS.xl.shellRadius};
    --ui-icon-cloud-item-radius: 18px;
  }

  :host([tone="neutral"]) {
    --ui-icon-cloud-accent: #64748b;
  }

  :host([tone="info"]) {
    --ui-icon-cloud-accent: #0ea5e9;
  }

  :host([tone="success"]) {
    --ui-icon-cloud-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-icon-cloud-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-icon-cloud-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="soft"]) {
    --ui-icon-cloud-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-icon-cloud-accent) 10%, var(--ui-color-surface, #ffffff)) 0%,
        color-mix(in srgb, var(--ui-icon-cloud-accent) 4%, var(--ui-color-surface, #ffffff)) 100%
      );
    --ui-icon-cloud-shadow: none;
    --ui-icon-cloud-item-shadow: none;
    --ui-icon-cloud-center-shadow: none;
  }

  :host([variant="solid"]) {
    --ui-icon-cloud-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-icon-cloud-accent) 12%, var(--ui-color-surface, #ffffff)) 0%,
        color-mix(in srgb, var(--ui-icon-cloud-accent) 4%, var(--ui-color-surface-elevated, #f8fafc)) 100%
      );
    --ui-icon-cloud-grid-color:
      color-mix(in srgb, var(--ui-icon-cloud-accent) 24%, var(--ui-icon-cloud-border-color));
  }

  :host([variant="glass"]) {
    --ui-icon-cloud-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, #ffffff 76%, transparent) 0%,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 78%, transparent) 100%
      );
    --ui-icon-cloud-backdrop: blur(18px) saturate(1.08);
    --ui-icon-cloud-item-backdrop: blur(10px) saturate(1.04);
    --ui-icon-cloud-center-backdrop: blur(14px) saturate(1.06);
  }

  :host([variant="contrast"]) {
    --ui-icon-cloud-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, #0b1f3f 92%, var(--ui-icon-cloud-accent) 8%) 0%,
        color-mix(in srgb, #07162d 96%, var(--ui-icon-cloud-accent) 4%) 100%
      );
    --ui-icon-cloud-color: #f8fbff;
    --ui-icon-cloud-border-color: color-mix(in srgb, #9ec5ff 18%, transparent);
    --ui-icon-cloud-item-bg: color-mix(in srgb, #ffffff 10%, transparent);
    --ui-icon-cloud-item-border: 1px solid color-mix(in srgb, #ffffff 12%, transparent);
    --ui-icon-cloud-item-color: #f8fbff;
    --ui-icon-cloud-center-bg: color-mix(in srgb, #ffffff 8%, transparent);
    --ui-icon-cloud-center-border: 1px solid color-mix(in srgb, #ffffff 18%, transparent);
    --ui-icon-cloud-shadow: 0 28px 56px rgba(2, 6, 23, 0.34);
    --ui-icon-cloud-item-shadow: 0 12px 24px rgba(2, 6, 23, 0.22);
    --ui-icon-cloud-center-shadow: 0 18px 34px rgba(2, 6, 23, 0.24);
    --ui-icon-cloud-grid-color: color-mix(in srgb, #ffffff 18%, transparent);
  }

  :host([variant="minimal"]) {
    --ui-icon-cloud-bg: transparent;
    --ui-icon-cloud-border: none;
    --ui-icon-cloud-shadow: none;
    --ui-icon-cloud-item-bg: transparent;
    --ui-icon-cloud-item-border: 1px solid transparent;
    --ui-icon-cloud-item-shadow: none;
    --ui-icon-cloud-center-bg: transparent;
    --ui-icon-cloud-center-border: 1px solid transparent;
    --ui-icon-cloud-center-shadow: none;
  }

  :host([elevation="none"]) {
    --ui-icon-cloud-shadow: none;
    --ui-icon-cloud-item-shadow: none;
    --ui-icon-cloud-center-shadow: none;
  }

  :host([elevation="high"]) {
    --ui-icon-cloud-shadow:
      0 2px 8px rgba(15, 23, 42, 0.08),
      0 34px 64px rgba(15, 23, 42, 0.18);
    --ui-icon-cloud-item-shadow:
      0 10px 18px rgba(15, 23, 42, 0.12),
      0 2px 4px rgba(15, 23, 42, 0.08);
    --ui-icon-cloud-center-shadow:
      0 18px 34px rgba(15, 23, 42, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.42);
  }

  .root {
    display: grid;
    justify-items: center;
    min-inline-size: 0;
    inline-size: 100%;
  }

  .frame {
    display: grid;
    place-items: center;
    inline-size: var(--ui-icon-cloud-fit-inline-size);
    block-size: var(--ui-icon-cloud-fit-block-size);
    min-inline-size: 0;
  }

  .surface {
    position: relative;
    display: grid;
    place-items: center;
    inline-size: fit-content;
    min-inline-size: 0;
    padding: var(--ui-icon-cloud-padding);
    border-radius: var(--ui-icon-cloud-shell-radius);
    border: var(--ui-icon-cloud-border);
    background: var(--ui-icon-cloud-bg);
    color: var(--ui-icon-cloud-color);
    box-shadow: var(--ui-icon-cloud-shadow);
    backdrop-filter: var(--ui-icon-cloud-backdrop);
    transition:
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      backdrop-filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
    box-sizing: border-box;
    isolation: isolate;
    overflow: visible;
    transform: scale(var(--ui-icon-cloud-fit-scale));
    transform-origin: center;
  }

  .stage {
    position: relative;
    inline-size: var(--ui-icon-cloud-stage-size);
    block-size: var(--ui-icon-cloud-stage-size);
    min-inline-size: 0;
    isolation: isolate;
    overflow: visible;
    perspective: var(--ui-icon-cloud-perspective);
    perspective-origin: 50% 50%;
    transform-style: preserve-3d;
  }

  .stage::before {
    content: "";
    position: absolute;
    inset-inline: 14%;
    inset-block-end: 4%;
    block-size: 18%;
    border-radius: 999px;
    background:
      radial-gradient(circle at 50% 50%, rgba(15, 23, 42, 0.22), rgba(15, 23, 42, 0.04) 62%, transparent 78%);
    filter: blur(18px);
    opacity: 0.9;
    transform: translateZ(-120px) rotateX(78deg) scaleX(1.06);
    transform-origin: center;
    pointer-events: none;
    z-index: 0;
  }

  .guides,
  .slots {
    position: absolute;
    inset: 0;
    transform-style: preserve-3d;
  }

  .guide {
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--ui-icon-cloud-grid-color) 70%, transparent);
    box-sizing: border-box;
    transform-style: preserve-3d;
    pointer-events: none;
  }

  .guide--outer {
    inline-size: calc(var(--ui-icon-cloud-radius) * 2);
    block-size: calc(var(--ui-icon-cloud-radius) * 2);
    opacity: 0.95;
    transform:
      translate(-50%, -50%)
      rotateX(calc(72deg + (var(--ui-icon-cloud-tilt-x) * 0.6)))
      rotateZ(calc(var(--ui-icon-cloud-tilt-y) * 0.35));
  }

  .guide--middle {
    inline-size: calc(var(--ui-icon-cloud-radius) * 1.48);
    block-size: calc(var(--ui-icon-cloud-radius) * 1.48);
    opacity: 0.82;
    transform:
      translate(-50%, -50%)
      rotateY(90deg)
      rotateX(calc(72deg - (var(--ui-icon-cloud-tilt-y) * 0.55)))
      rotateZ(calc(var(--ui-icon-cloud-tilt-x) * -0.4));
  }

  .glow {
    position: absolute;
    inset: 12%;
    border-radius: 999px;
    background:
      radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--ui-icon-cloud-accent) 12%, transparent), transparent 64%);
    filter: blur(18px);
    opacity: 0.82;
    transform:
      translateZ(-42px)
      rotateX(calc(64deg + (var(--ui-icon-cloud-tilt-x) * 0.5)))
      rotateZ(calc(var(--ui-icon-cloud-tilt-y) * 0.25))
      scale(1.08);
    transform-origin: center;
    pointer-events: none;
  }

  slot {
    display: contents;
  }

  ::slotted([data-ui-icon-cloud-center]) {
    position: absolute !important;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    inline-size: var(--ui-icon-cloud-center-size);
    block-size: var(--ui-icon-cloud-center-size);
    transform:
      translate(-50%, -50%)
      translateZ(52px)
      rotateX(calc(var(--ui-icon-cloud-tilt-x) * -0.18))
      rotateY(calc(var(--ui-icon-cloud-tilt-y) * -0.18));
    border-radius: 999px;
    border: var(--ui-icon-cloud-center-border);
    background: var(--ui-icon-cloud-center-bg);
    color: var(--ui-icon-cloud-color);
    box-shadow: var(--ui-icon-cloud-center-shadow);
    backdrop-filter: var(--ui-icon-cloud-center-backdrop);
    display: grid !important;
    place-items: center;
    padding: 12px;
    box-sizing: border-box;
    text-align: center;
    z-index: 2;
  }

  ::slotted([data-ui-icon-cloud-item]) {
    position: absolute !important;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    inline-size: var(--ui-icon-cloud-item-size);
    block-size: var(--ui-icon-cloud-item-size);
    border-radius: var(--ui-icon-cloud-item-radius);
    border: var(--ui-icon-cloud-item-border);
    background: var(--ui-icon-cloud-item-bg);
    color: var(--ui-icon-cloud-item-color);
    box-shadow: var(--ui-icon-cloud-item-shadow);
    backdrop-filter: var(--ui-icon-cloud-item-backdrop);
    display: grid !important;
    place-items: center;
    box-sizing: border-box;
    padding: 0;
    overflow: visible;
    transform:
      translate(-50%, -50%)
      translate3d(var(--ui-icon-cloud-x, 0px), var(--ui-icon-cloud-y, 0px), var(--ui-icon-cloud-z, 0px))
      rotateX(calc(var(--ui-icon-cloud-tilt-x) * -0.22))
      rotateY(calc(var(--ui-icon-cloud-tilt-y) * -0.22))
      scale(var(--ui-icon-cloud-scale, 1));
    transform-origin: center;
    opacity: var(--ui-icon-cloud-opacity, 1);
    z-index: var(--ui-icon-cloud-z-index, 1);
    filter: blur(var(--ui-icon-cloud-blur, 0px)) saturate(var(--ui-icon-cloud-saturation, 1));
    will-change: transform, opacity;
    user-select: none;
  }

  ::slotted([data-ui-icon-cloud-clickable]) {
    cursor: pointer;
    transition:
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  ::slotted([data-ui-icon-cloud-clickable]:hover) {
    filter: brightness(1.03);
  }

  ::slotted([data-ui-icon-cloud-clickable]:focus-visible) {
    outline: none;
    border-color: color-mix(in srgb, var(--ui-icon-cloud-focus-ring) 30%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-icon-cloud-focus-ring) 20%, transparent),
      var(--ui-icon-cloud-item-shadow);
  }

  :host(:focus-visible) .surface {
    outline: none;
    border-color: color-mix(in srgb, var(--ui-icon-cloud-focus-ring) 24%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-icon-cloud-focus-ring) 18%, transparent),
      var(--ui-icon-cloud-shadow);
  }

  :host([data-has-center="false"]) .guide--middle {
    opacity: 0.52;
  }

  @media (prefers-contrast: more) {
    .surface,
    ::slotted([data-ui-icon-cloud-item]),
    ::slotted([data-ui-icon-cloud-center]) {
      box-shadow: none;
    }

    .surface {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-icon-cloud-bg: Canvas;
      --ui-icon-cloud-color: CanvasText;
      --ui-icon-cloud-border-color: CanvasText;
      --ui-icon-cloud-shadow: none;
      --ui-icon-cloud-item-bg: Canvas;
      --ui-icon-cloud-item-border: 1px solid CanvasText;
      --ui-icon-cloud-item-color: CanvasText;
      --ui-icon-cloud-item-shadow: none;
      --ui-icon-cloud-center-bg: Canvas;
      --ui-icon-cloud-center-border: 1px solid CanvasText;
      --ui-icon-cloud-center-shadow: none;
      --ui-icon-cloud-grid-color: CanvasText;
    }

    .surface,
    .guide,
    ::slotted([data-ui-icon-cloud-item]),
    ::slotted([data-ui-icon-cloud-center]) {
      forced-color-adjust: none;
    }
  }
`;

function normalizeLength(value: string | null, fallback: string): string {
  if (value == null || value === '') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (!parts.length) return fallback;
  return parts.map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? `${part}px` : part)).join(' ');
}

function normalizeDirection(value: string | null): IconCloudDirection {
  return value != null && DIRECTIONS.has(value as IconCloudDirection) ? (value as IconCloudDirection) : 'clockwise';
}

function normalizeVariant(value: string | null): IconCloudVariant {
  return value != null && VARIANTS.has(value as IconCloudVariant) ? (value as IconCloudVariant) : 'surface';
}

function normalizeTone(value: string | null): IconCloudTone {
  return value != null && TONES.has(value as IconCloudTone) ? (value as IconCloudTone) : 'brand';
}

function normalizeElevation(value: string | null): IconCloudElevation {
  return value != null && ELEVATIONS.has(value as IconCloudElevation) ? (value as IconCloudElevation) : 'low';
}

function normalizeSize(value: string | null): 'sm' | 'md' | 'lg' | 'xl' {
  if (value == null || !SIZES.has(value as IconCloudSize)) return 'md';
  if (value === '1') return 'sm';
  if (value === '2') return 'md';
  if (value === '3') return 'lg';
  if (value === '4') return 'xl';
  return value as 'sm' | 'md' | 'lg' | 'xl';
}

function parsePositiveNumber(value: string | null, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function pxValue(value: string | null, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number.parseFloat(trimmed);
  if (/^-?\d+(\.\d+)?px$/i.test(trimmed)) return Number.parseFloat(trimmed);
  return fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function fibonacciSphere(count: number): Point3D[] {
  if (count <= 0) return [];
  if (count === 1) return [{ x: 0, y: 0, z: 1 }];
  const points: Point3D[] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < count; index += 1) {
    const t = index / (count - 1);
    const y = 1 - (t * 2);
    const radius = Math.sqrt(Math.max(0, 1 - (y * y)));
    const theta = goldenAngle * index;
    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
    });
  }

  return points;
}

function rotatePoint(point: Point3D, angleX: number, angleY: number): Point3D {
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);

  const x1 = (point.x * cosY) - (point.z * sinY);
  const z1 = (point.x * sinY) + (point.z * cosY);
  const y1 = point.y;

  return {
    x: x1,
    y: (y1 * cosX) - (z1 * sinX),
    z: (y1 * sinX) + (z1 * cosX),
  };
}

export class UIIconCloud extends ElementBase {
  static get observedAttributes() {
    return [
      'radius',
      'perspective',
      'depth',
      'speed',
      'direction',
      'item-size',
      'center-size',
      'padding',
      'variant',
      'tone',
      'size',
      'surface-radius',
      'elevation',
      'interactive',
      'auto-fit',
      'paused',
      'pause-on-hover',
      'pause-on-item-hover',
      'pause-on-focus',
    ];
  }

  private _slotEl: HTMLSlotElement | null = null;
  private _centerSlotEl: HTMLSlotElement | null = null;
  private _items: HTMLElement[] = [];
  private _center: HTMLElement | null = null;
  private _points: Point3D[] = [];
  private _frame: number | null = null;
  private _lastTimestamp = 0;
  private _hovering = false;
  private _itemHovering = false;
  private _focusWithin = false;
  private _autoAngleX = -0.35;
  private _autoAngleY = 0.25;
  private _currentTiltX = 0;
  private _currentTiltY = 0;
  private _targetTiltX = 0;
  private _targetTiltY = 0;
  private _lightDomObserver: MutationObserver | null = null;
  private _mediaQuery: MediaQueryList | null = null;
  private _resizeObserver: ResizeObserver | null = null;

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerEnter = this._onPointerEnter.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onPointerOver = this._onPointerOver.bind(this);
    this._onPointerOut = this._onPointerOut.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onLightDomMutation = this._onLightDomMutation.bind(this);
    this._onReducedMotionChange = this._onReducedMotionChange.bind(this);
    this._onResize = this._onResize.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    this.addEventListener('pointermove', this._onPointerMove);
    this.addEventListener('pointerenter', this._onPointerEnter);
    this.addEventListener('pointerleave', this._onPointerLeave);
    this.addEventListener('pointerover', this._onPointerOver);
    this.addEventListener('pointerout', this._onPointerOut);
    this.addEventListener('focusin', this._onFocusIn);
    this.addEventListener('focusout', this._onFocusOut);
    this._observeLightDom();
    this._bindReducedMotion();
    this._ensureResizeObserver();
  }

  override disconnectedCallback(): void {
    if (this._slotEl) {
      this._slotEl.removeEventListener('slotchange', this._onSlotChange as EventListener);
      this._slotEl = null;
    }
    if (this._centerSlotEl) {
      this._centerSlotEl.removeEventListener('slotchange', this._onSlotChange as EventListener);
      this._centerSlotEl = null;
    }
    this.removeEventListener('pointermove', this._onPointerMove);
    this.removeEventListener('pointerenter', this._onPointerEnter);
    this.removeEventListener('pointerleave', this._onPointerLeave);
    this.removeEventListener('pointerover', this._onPointerOver);
    this.removeEventListener('pointerout', this._onPointerOut);
    this.removeEventListener('focusin', this._onFocusIn);
    this.removeEventListener('focusout', this._onFocusOut);

    if (this._lightDomObserver) {
      this._lightDomObserver.disconnect();
      this._lightDomObserver = null;
    }

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    if (this._mediaQuery) {
      try {
        this._mediaQuery.removeEventListener('change', this._onReducedMotionChange);
      } catch {
        this._mediaQuery.removeListener(this._onReducedMotionChange);
      }
      this._mediaQuery = null;
    }

    this._stopAnimation();
    super.disconnectedCallback();
  }

  play(): void {
    this.removeAttribute('paused');
    this._syncState();
  }

  pause(): void {
    this.setAttribute('paused', '');
    this._syncState();
  }

  refresh(): void {
    this.requestRender();
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (!name || oldValue === newValue) return;
    if (
      name === 'paused' ||
      name === 'interactive' ||
      name === 'pause-on-hover' ||
      name === 'pause-on-item-hover' ||
      name === 'pause-on-focus' ||
      name === 'auto-fit' ||
      name === 'speed' ||
      name === 'direction'
    ) {
      this._syncState();
    }
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="frame" part="frame">
          <div class="surface" part="surface">
            <div class="stage" part="stage">
              <div class="guides" aria-hidden="true">
                <div class="glow"></div>
                <div class="guide guide--outer"></div>
                <div class="guide guide--middle"></div>
              </div>
              <div class="slots">
                <slot name="center"></slot>
                <slot></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    this._bindSlots();
    this._syncMetrics();
    this._syncAutoFit();
    this._collectChildren();
    this._applyLayout(this._autoAngleX + this._currentTiltX, this._autoAngleY + this._currentTiltY);
    this._syncState();
    this._ensureResizeObserver();
  }

  private _bindSlots(): void {
    const slot = this.root.querySelector('slot:not([name])') as HTMLSlotElement | null;
    const centerSlot = this.root.querySelector('slot[name="center"]') as HTMLSlotElement | null;

    if (slot && slot !== this._slotEl) {
      if (this._slotEl) this._slotEl.removeEventListener('slotchange', this._onSlotChange as EventListener);
      slot.addEventListener('slotchange', this._onSlotChange as EventListener);
      this._slotEl = slot;
    }

    if (centerSlot && centerSlot !== this._centerSlotEl) {
      if (this._centerSlotEl) this._centerSlotEl.removeEventListener('slotchange', this._onSlotChange as EventListener);
      centerSlot.addEventListener('slotchange', this._onSlotChange as EventListener);
      this._centerSlotEl = centerSlot;
    }
  }

  private _observeLightDom(): void {
    if (this._lightDomObserver || typeof MutationObserver === 'undefined') return;
    this._lightDomObserver = new MutationObserver(this._onLightDomMutation);
    this._lightDomObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['slot'],
    });
  }

  private _bindReducedMotion(): void {
    if (this._mediaQuery || typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    this._mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    try {
      this._mediaQuery.addEventListener('change', this._onReducedMotionChange);
    } catch {
      this._mediaQuery.addListener(this._onReducedMotionChange);
    }
  }

  private _onLightDomMutation(): void {
    this.requestRender();
  }

  private _onSlotChange(): void {
    this.requestRender();
  }

  private _onResize(): void {
    this._syncAutoFit();
  }

  private _syncMetrics(): void {
    const size = normalizeSize(this.getAttribute('size'));
    const preset = SIZE_PRESETS[size];
    const radius = normalizeLength(this.getAttribute('radius'), preset.radius);
    const itemSize = normalizeLength(this.getAttribute('item-size'), preset.itemSize);
    const centerSize = normalizeLength(this.getAttribute('center-size'), preset.centerSize);
    const padding = normalizeLength(this.getAttribute('padding'), preset.padding);
    const surfaceRadius = normalizeLength(this.getAttribute('surface-radius'), preset.shellRadius);
    const perspective = normalizeLength(this.getAttribute('perspective'), DEFAULT_PERSPECTIVE);
    const depth = clamp(parsePositiveNumber(this.getAttribute('depth'), DEFAULT_DEPTH), 0.35, 1.6);
    const variant = normalizeVariant(this.getAttribute('variant'));
    const tone = normalizeTone(this.getAttribute('tone'));
    const elevation = normalizeElevation(this.getAttribute('elevation'));

    this.style.setProperty('--ui-icon-cloud-radius', radius);
    this.style.setProperty('--ui-icon-cloud-item-size', itemSize);
    this.style.setProperty('--ui-icon-cloud-center-size', centerSize);
    this.style.setProperty('--ui-icon-cloud-padding', padding);
    this.style.setProperty('--ui-icon-cloud-perspective', perspective);
    this.style.setProperty('--ui-icon-cloud-depth', String(depth));
    this.style.setProperty('--ui-icon-cloud-shell-radius', surfaceRadius);
    this.style.setProperty('--ui-icon-cloud-stage-size', `calc((2 * ${radius}) + ${itemSize})`);
    this.setAttribute('data-variant', variant);
    this.setAttribute('data-tone', tone);
    this.setAttribute('data-elevation', elevation);
  }

  private _syncAutoFit(): void {
    const autoFit = this._autoFit();
    this.setAttribute('data-auto-fit', autoFit ? 'true' : 'false');

    if (!autoFit) {
      this.style.setProperty('--ui-icon-cloud-fit-scale', '1');
      this.style.setProperty('--ui-icon-cloud-fit-inline-size', 'auto');
      this.style.setProperty('--ui-icon-cloud-fit-block-size', 'auto');
      this.removeAttribute('data-auto-fit-scale');
      return;
    }

    const size = normalizeSize(this.getAttribute('size'));
    const preset = SIZE_PRESETS[size];
    const stageMetrics = this._stageMetrics(preset);
    const paddingMetrics = this._paddingMetrics(preset.padding);
    const naturalWidth = stageMetrics.width + paddingMetrics.inline;
    const naturalHeight = stageMetrics.height + paddingMetrics.block;
    const rect = this.getBoundingClientRect();
    const availableWidth = rect.width || this.clientWidth || naturalWidth;
    const scale =
      availableWidth > 0 && naturalWidth > 0
        ? clamp(availableWidth / naturalWidth, 0.2, 1)
        : 1;

    this.style.setProperty('--ui-icon-cloud-fit-scale', scale.toFixed(4));
    this.style.setProperty('--ui-icon-cloud-fit-inline-size', `${(naturalWidth * scale).toFixed(2)}px`);
    this.style.setProperty('--ui-icon-cloud-fit-block-size', `${(naturalHeight * scale).toFixed(2)}px`);
    this.setAttribute('data-auto-fit-scale', scale.toFixed(4));
  }

  private _collectChildren(): void {
    const items = (this._slotEl?.assignedElements({ flatten: true }) || []).filter(
      (element): element is HTMLElement => element instanceof HTMLElement
    );
    const center = (this._centerSlotEl?.assignedElements({ flatten: true }) || []).find(
      (element): element is HTMLElement => element instanceof HTMLElement
    ) || null;

    this._items = items;
    this._center = center;
    this._points = fibonacciSphere(items.length);

    this.setAttribute('data-count', String(items.length));
    this.setAttribute('data-has-center', center ? 'true' : 'false');
    this.setAttribute('data-interactive', this._interactiveEnabled() ? 'true' : 'false');

    if (center) {
      if (!center.hasAttribute('data-ui-icon-cloud-center')) center.setAttribute('data-ui-icon-cloud-center', '');
    }

    items.forEach((item) => {
      if (!item.hasAttribute('data-ui-icon-cloud-item')) item.setAttribute('data-ui-icon-cloud-item', '');
      if (this._isElementClickable(item)) item.setAttribute('data-ui-icon-cloud-clickable', '');
    });
  }

  private _isElementClickable(item: HTMLElement): boolean {
    if (item.hasAttribute('data-ui-icon-cloud-clickable')) return true;
    return item.tagName === 'BUTTON' || item.tagName === 'A';
  }

  private _onPointerEnter(): void {
    this._hovering = true;
    this._syncState();
  }

  private _onPointerLeave(): void {
    this._hovering = false;
    this._targetTiltX = 0;
    this._targetTiltY = 0;
    this._itemHovering = false;
    this._syncState();
  }

  private _onPointerMove(event: PointerEvent): void {
    if (!this._interactiveEnabled()) return;
    const rect = this.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    this._targetTiltY = clamp(x * 0.62, -0.62, 0.62);
    this._targetTiltX = clamp(y * -0.44, -0.44, 0.44);
    this._ensureAnimation();
  }

  private _onPointerOver(event: PointerEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('[data-ui-icon-cloud-item]')) {
      this._itemHovering = true;
      this._syncState();
    }
  }

  private _onPointerOut(event: PointerEvent): void {
    const nextTarget = event.relatedTarget as HTMLElement | null;
    if (nextTarget?.closest('[data-ui-icon-cloud-item]')) return;
    this._itemHovering = false;
    this._syncState();
  }

  private _onFocusIn(): void {
    this._focusWithin = true;
    this._syncState();
  }

  private _onFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget as Node | null;
    this._focusWithin = Boolean(nextTarget && this.contains(nextTarget));
    this._syncState();
  }

  private _onReducedMotionChange(): void {
    this._syncState();
  }

  private _effectivePaused(): boolean {
    if (this.hasAttribute('paused')) return true;
    if (this._mediaQuery?.matches) return true;
    if (this.hasAttribute('pause-on-hover') && this._hovering) return true;
    if (this.hasAttribute('pause-on-item-hover') && this._itemHovering) return true;
    if (this.hasAttribute('pause-on-focus') && this._focusWithin) return true;
    return false;
  }

  private _interactiveEnabled(): boolean {
    if (!this.hasAttribute('interactive')) return false;
    return this.getAttribute('interactive') !== 'false';
  }

  private _autoFit(): boolean {
    return parseBooleanAttribute(this.getAttribute('auto-fit'), false);
  }

  private _syncState(): void {
    const running = this._items.length > 0 && !this._effectivePaused();
    this.setAttribute('data-state', this._items.length ? (running ? 'running' : 'paused') : 'idle');
    this.setAttribute('data-item-hovered', this._itemHovering ? 'true' : 'false');
    this.setAttribute('data-interactive', this._interactiveEnabled() ? 'true' : 'false');

    if (running || Math.abs(this._targetTiltX - this._currentTiltX) > 0.002 || Math.abs(this._targetTiltY - this._currentTiltY) > 0.002) {
      this._ensureAnimation();
    } else {
      this._applyLayout(this._autoAngleX + this._currentTiltX, this._autoAngleY + this._currentTiltY);
      this._stopAnimation();
    }
  }

  private _ensureAnimation(): void {
    if (this._frame != null || !this.isConnected || !this._items.length) return;
    this._lastTimestamp = 0;
    this._frame = this._requestFrame((time) => this._tick(time));
  }

  private _stopAnimation(): void {
    if (this._frame == null) return;
    this._cancelFrame(this._frame);
    this._frame = null;
    this._lastTimestamp = 0;
  }

  private _tick(timestamp: number): void {
    this._frame = null;
    const previous = this._lastTimestamp || timestamp;
    const delta = clamp(timestamp - previous, 0, 48);
    this._lastTimestamp = timestamp;

    if (!this._effectivePaused()) {
      const direction = normalizeDirection(this.getAttribute('direction'));
      const directionFactor = direction === 'counterclockwise' ? -1 : 1;
      const speed = clamp(parsePositiveNumber(this.getAttribute('speed'), DEFAULT_SPEED), 0.2, 8);
      this._autoAngleY += delta * 0.00024 * speed * directionFactor;
      this._autoAngleX += delta * 0.00012 * speed * directionFactor;
    }

    this._currentTiltX += (this._targetTiltX - this._currentTiltX) * 0.08;
    this._currentTiltY += (this._targetTiltY - this._currentTiltY) * 0.08;

    this._applyLayout(this._autoAngleX + this._currentTiltX, this._autoAngleY + this._currentTiltY);

    const shouldContinue =
      !this._effectivePaused() ||
      Math.abs(this._targetTiltX - this._currentTiltX) > 0.002 ||
      Math.abs(this._targetTiltY - this._currentTiltY) > 0.002;

    if (shouldContinue) {
      this._frame = this._requestFrame((time) => this._tick(time));
    }
  }

  private _applyLayout(angleX: number, angleY: number): void {
    const size = normalizeSize(this.getAttribute('size'));
    const preset = SIZE_PRESETS[size];
    const radiusPx = pxValue(this.style.getPropertyValue('--ui-icon-cloud-radius') || this.getAttribute('radius'), preset.radiusPx);
    const perspectivePx = pxValue(this.style.getPropertyValue('--ui-icon-cloud-perspective') || this.getAttribute('perspective'), 920);
    const depth = clamp(parsePositiveNumber(this.style.getPropertyValue('--ui-icon-cloud-depth') || this.getAttribute('depth'), DEFAULT_DEPTH), 0.35, 1.6);
    this.style.setProperty('--ui-icon-cloud-tilt-x', `${(angleX * 180) / Math.PI}deg`);
    this.style.setProperty('--ui-icon-cloud-tilt-y', `${(angleY * 180) / Math.PI}deg`);

    this._items.forEach((item, index) => {
      const basePoint = this._points[index];
      if (!basePoint) return;
      const point = rotatePoint(basePoint, angleX, angleY);
      const zDepth = point.z * radiusPx * depth;
      const perspective = perspectivePx / Math.max(perspectivePx - zDepth, perspectivePx * 0.28);
      const x = point.x * radiusPx * perspective;
      const y = point.y * radiusPx * perspective;
      const depthRatio = (point.z + 1) / 2;
      const scale = 0.42 + (depthRatio * 0.8);
      const opacity = 0.18 + (depthRatio * 0.88);
      const blur = (1 - depthRatio) * 2.4;
      const saturation = 0.68 + (depthRatio * 0.5);
      const zIndex = 10 + Math.round(depthRatio * 100);

      item.style.setProperty('--ui-icon-cloud-x', `${x.toFixed(2)}px`);
      item.style.setProperty('--ui-icon-cloud-y', `${y.toFixed(2)}px`);
      item.style.setProperty('--ui-icon-cloud-z', `${(zDepth * 0.78).toFixed(2)}px`);
      item.style.setProperty('--ui-icon-cloud-scale', scale.toFixed(3));
      item.style.setProperty('--ui-icon-cloud-opacity', opacity.toFixed(3));
      item.style.setProperty('--ui-icon-cloud-z-index', String(zIndex));
      item.style.setProperty('--ui-icon-cloud-blur', `${blur.toFixed(2)}px`);
      item.style.setProperty('--ui-icon-cloud-saturation', saturation.toFixed(3));
      item.style.setProperty('--ui-icon-cloud-depth-ratio', depthRatio.toFixed(3));
    });
  }

  private _requestFrame(callback: FrameRequestCallback): number {
    if (typeof requestAnimationFrame === 'function') return requestAnimationFrame(callback);
    return window.setTimeout(() => callback(performance.now()), 16);
  }

  private _cancelFrame(handle: number): void {
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(handle);
      return;
    }
    window.clearTimeout(handle);
  }

  private _ensureResizeObserver(): void {
    if (!this.isConnected || !this._autoFit() || typeof ResizeObserver === 'undefined') {
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
        this._resizeObserver = null;
      }
      return;
    }

    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(this._onResize);
    } else {
      this._resizeObserver.disconnect();
    }

    this._resizeObserver.observe(this);
  }

  private _stageMetrics(preset: SizePreset): { width: number; height: number } {
    const stage = this.root.querySelector('.stage') as HTMLElement | null;
    const computed = stage ? getComputedStyle(stage) : null;
    const computedWidth = computed ? Number.parseFloat(computed.width) : Number.NaN;
    const computedHeight = computed ? Number.parseFloat(computed.height) : Number.NaN;
    const radiusPx = pxValue(this.style.getPropertyValue('--ui-icon-cloud-radius') || this.getAttribute('radius'), preset.radiusPx);
    const itemSizePx = pxValue(this.style.getPropertyValue('--ui-icon-cloud-item-size') || this.getAttribute('item-size'), preset.itemSizePx);
    const fallback = (radiusPx * 2) + itemSizePx;

    return {
      width: Number.isFinite(computedWidth) && computedWidth > 0 ? computedWidth : fallback,
      height: Number.isFinite(computedHeight) && computedHeight > 0 ? computedHeight : fallback,
    };
  }

  private _paddingMetrics(fallbackPadding: string): { inline: number; block: number } {
    const surface = this.root.querySelector('.surface') as HTMLElement | null;
    const computed = surface ? getComputedStyle(surface) : null;
    const paddingInline = computed ? Number.parseFloat(computed.paddingLeft) + Number.parseFloat(computed.paddingRight) : Number.NaN;
    const paddingBlock = computed ? Number.parseFloat(computed.paddingTop) + Number.parseFloat(computed.paddingBottom) : Number.NaN;

    if (Number.isFinite(paddingInline) && paddingInline > 0 && Number.isFinite(paddingBlock) && paddingBlock > 0) {
      return {
        inline: paddingInline,
        block: paddingBlock,
      };
    }

    const normalized = normalizeLength(this.getAttribute('padding'), fallbackPadding);
    const parts = normalized.split(/\s+/).filter(Boolean);
    const fallbackPx = pxValue(fallbackPadding, 20);
    const first = pxValue(parts[0] || '', fallbackPx);
    const second = pxValue(parts[1] || parts[0] || '', first);
    const third = pxValue(parts[2] || parts[0] || '', first);
    const fourth = pxValue(parts[3] || parts[1] || parts[0] || '', second);

    if (parts.length === 1) return { inline: first * 2, block: first * 2 };
    if (parts.length === 2) return { inline: second * 2, block: first * 2 };
    if (parts.length === 3) return { inline: second * 2, block: first + third };

    return { inline: second + fourth, block: first + third };
  }
}

function parseBooleanAttribute(value: string | null, fallback: boolean): boolean {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'off' || normalized === 'no') return false;
  if (normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes') return true;
  return fallback;
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-icon-cloud': UIIconCloud;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-icon-cloud')) {
  customElements.define('ui-icon-cloud', UIIconCloud);
}
