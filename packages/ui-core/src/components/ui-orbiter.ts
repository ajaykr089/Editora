import { ElementBase } from '../ElementBase';

type OrbiterDirection = 'clockwise' | 'counterclockwise' | 'alternate';
type OrbiterAnimation = 'calm' | 'smooth' | 'snappy' | 'bouncy';
type OrbiterVariant = 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
type OrbiterTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type OrbiterSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '0' | '1' | '2' | '3' | '4';
type OrbiterElevation = 'none' | 'low' | 'high';

type OrbiterSizePreset = {
  orbitRadius: string;
  itemSize: string;
  centerSize: string;
  ringGap: string;
  padding: string;
  panelRadius: string;
};

type OrbiterMotionPreset = {
  durationScale: number;
  accentOpacity: number;
};

const DEFAULT_DURATION = '18s';
const DEFAULT_DELAY = '0s';
const DEFAULT_ORBIT_RADIUS = '88px';
const DEFAULT_ITEM_SIZE = '44px';
const DEFAULT_CENTER_SIZE = '128px';
const DEFAULT_RING_GAP = '28px';
const DEFAULT_PADDING = '20px';
const DEFAULT_START_ANGLE = -90;
const MAX_RINGS = 6;
const SEMANTIC_RADIUS_VALUES = new Set(['none', 'sm', 'md', 'lg', 'full']);
const DIRECTIONS = new Set<OrbiterDirection>(['clockwise', 'counterclockwise', 'alternate']);
const ANIMATIONS = new Set<OrbiterAnimation>(['calm', 'smooth', 'snappy', 'bouncy']);

const SIZE_PRESETS: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', OrbiterSizePreset> = {
  xs: {
    orbitRadius: '54px',
    itemSize: '30px',
    centerSize: '80px',
    ringGap: '16px',
    padding: '12px',
    panelRadius: '22px',
  },
  sm: {
    orbitRadius: '68px',
    itemSize: '36px',
    centerSize: '96px',
    ringGap: '20px',
    padding: '14px',
    panelRadius: '24px',
  },
  md: {
    orbitRadius: DEFAULT_ORBIT_RADIUS,
    itemSize: DEFAULT_ITEM_SIZE,
    centerSize: DEFAULT_CENTER_SIZE,
    ringGap: DEFAULT_RING_GAP,
    padding: DEFAULT_PADDING,
    panelRadius: '28px',
  },
  lg: {
    orbitRadius: '108px',
    itemSize: '52px',
    centerSize: '148px',
    ringGap: '32px',
    padding: '24px',
    panelRadius: '32px',
  },
  xl: {
    orbitRadius: '132px',
    itemSize: '64px',
    centerSize: '172px',
    ringGap: '38px',
    padding: '28px',
    panelRadius: '36px',
  },
};

const MOTION_PRESETS: Record<OrbiterAnimation, OrbiterMotionPreset> = {
  calm: {
    durationScale: 1.28,
    accentOpacity: 0.12,
  },
  smooth: {
    durationScale: 1,
    accentOpacity: 0.16,
  },
  snappy: {
    durationScale: 0.82,
    accentOpacity: 0.18,
  },
  bouncy: {
    durationScale: 0.92,
    accentOpacity: 0.22,
  },
};

const style = `
  :host {
    --ui-orbiter-duration: ${DEFAULT_DURATION};
    --ui-orbiter-delay: ${DEFAULT_DELAY};
    --ui-orbiter-orbit-radius: ${DEFAULT_ORBIT_RADIUS};
    --ui-orbiter-item-size: ${DEFAULT_ITEM_SIZE};
    --ui-orbiter-center-size: ${DEFAULT_CENTER_SIZE};
    --ui-orbiter-ring-gap: ${DEFAULT_RING_GAP};
    --ui-orbiter-padding: ${DEFAULT_PADDING};
    --ui-orbiter-radius: 28px;
    --ui-orbiter-stage-size:
      calc((2 * var(--ui-orbiter-farthest-radius, ${DEFAULT_ORBIT_RADIUS})) + var(--ui-orbiter-item-size));
    --ui-orbiter-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-orbiter-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 92%, transparent) 0%,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent) 64%,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 84%, transparent) 100%
      );
    --ui-orbiter-color: var(--ui-color-text, #0f172a);
    --ui-orbiter-border-color:
      color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 86%, transparent);
    --ui-orbiter-border: 1px solid var(--ui-orbiter-border-color);
    --ui-orbiter-shadow:
      0 1px 3px rgba(15, 23, 42, 0.06),
      0 24px 44px rgba(15, 23, 42, 0.12);
    --ui-orbiter-backdrop: none;
    --ui-orbiter-path-color:
      color-mix(in srgb, var(--ui-orbiter-accent) 16%, var(--ui-orbiter-border-color));
    --ui-orbiter-path-opacity: 0.95;
    --ui-orbiter-item-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #ffffff 96%, transparent),
        color-mix(in srgb, var(--ui-orbiter-accent) 8%, rgba(255, 255, 255, 0.9))
      );
    --ui-orbiter-item-color: var(--ui-orbiter-color);
    --ui-orbiter-item-border:
      1px solid color-mix(in srgb, var(--ui-orbiter-accent) 12%, rgba(255, 255, 255, 0.82));
    --ui-orbiter-item-shadow:
      0 8px 14px rgba(15, 23, 42, 0.08),
      0 1px 2px rgba(15, 23, 42, 0.05);
    --ui-orbiter-item-backdrop: none;
    --ui-orbiter-center-bg:
      radial-gradient(
        circle at 50% 35%,
        color-mix(in srgb, #ffffff 92%, transparent) 0%,
        color-mix(in srgb, var(--ui-orbiter-accent) 12%, rgba(255, 255, 255, 0.94)) 100%
      );
    --ui-orbiter-center-border:
      1px solid color-mix(in srgb, var(--ui-orbiter-accent) 20%, rgba(255, 255, 255, 0.84));
    --ui-orbiter-center-shadow:
      0 12px 28px rgba(15, 23, 42, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
    --ui-orbiter-center-backdrop: none;
    --ui-orbiter-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    display: inline-block;
    min-inline-size: 0;
    color: var(--ui-orbiter-color);
    color-scheme: light dark;
    font-family: "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-sizing: border-box;
  }

  :host([size="xs"]),
  :host([size="0"]) {
    --ui-orbiter-orbit-radius: 54px;
    --ui-orbiter-item-size: 30px;
    --ui-orbiter-center-size: 80px;
    --ui-orbiter-ring-gap: 16px;
    --ui-orbiter-padding: 12px;
    --ui-orbiter-radius: 22px;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-orbiter-orbit-radius: 68px;
    --ui-orbiter-item-size: 36px;
    --ui-orbiter-center-size: 96px;
    --ui-orbiter-ring-gap: 20px;
    --ui-orbiter-padding: 14px;
    --ui-orbiter-radius: 24px;
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-orbiter-orbit-radius: ${DEFAULT_ORBIT_RADIUS};
    --ui-orbiter-item-size: ${DEFAULT_ITEM_SIZE};
    --ui-orbiter-center-size: ${DEFAULT_CENTER_SIZE};
    --ui-orbiter-ring-gap: ${DEFAULT_RING_GAP};
    --ui-orbiter-padding: ${DEFAULT_PADDING};
    --ui-orbiter-radius: 28px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-orbiter-orbit-radius: 108px;
    --ui-orbiter-item-size: 52px;
    --ui-orbiter-center-size: 148px;
    --ui-orbiter-ring-gap: 32px;
    --ui-orbiter-padding: 24px;
    --ui-orbiter-radius: 32px;
  }

  :host([size="xl"]),
  :host([size="4"]) {
    --ui-orbiter-orbit-radius: 132px;
    --ui-orbiter-item-size: 64px;
    --ui-orbiter-center-size: 172px;
    --ui-orbiter-ring-gap: 38px;
    --ui-orbiter-padding: 28px;
    --ui-orbiter-radius: 36px;
  }

  :host([tone="neutral"]) {
    --ui-orbiter-accent: #64748b;
  }

  :host([tone="info"]) {
    --ui-orbiter-accent: #0ea5e9;
  }

  :host([tone="success"]) {
    --ui-orbiter-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-orbiter-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-orbiter-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="soft"]) {
    --ui-orbiter-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-orbiter-accent) 10%, var(--ui-color-surface, #ffffff)) 0%,
        color-mix(in srgb, var(--ui-orbiter-accent) 4%, var(--ui-color-surface, #ffffff)) 100%
      );
    --ui-orbiter-shadow: none;
    --ui-orbiter-item-shadow: none;
    --ui-orbiter-center-shadow: none;
  }

  :host([variant="solid"]) {
    --ui-orbiter-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-orbiter-accent) 12%, var(--ui-color-surface, #ffffff)) 0%,
        color-mix(in srgb, var(--ui-orbiter-accent) 4%, var(--ui-color-surface-elevated, #f8fafc)) 100%
      );
    --ui-orbiter-path-color:
      color-mix(in srgb, var(--ui-orbiter-accent) 24%, var(--ui-orbiter-border-color));
  }

  :host([variant="glass"]) {
    --ui-orbiter-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, #ffffff 76%, transparent) 0%,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 78%, transparent) 100%
      );
    --ui-orbiter-backdrop: blur(18px) saturate(1.08);
    --ui-orbiter-item-backdrop: blur(10px) saturate(1.05);
    --ui-orbiter-center-backdrop: blur(14px) saturate(1.06);
    --ui-orbiter-path-color:
      color-mix(in srgb, #ffffff 40%, var(--ui-orbiter-border-color));
  }

  :host([variant="contrast"]) {
    --ui-orbiter-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, #0b1f3f 92%, var(--ui-orbiter-accent) 8%) 0%,
        color-mix(in srgb, #07162d 96%, var(--ui-orbiter-accent) 4%) 100%
      );
    --ui-orbiter-color: #f8fbff;
    --ui-orbiter-border-color: color-mix(in srgb, #9ec5ff 18%, transparent);
    --ui-orbiter-item-bg: color-mix(in srgb, #ffffff 10%, transparent);
    --ui-orbiter-item-border: 1px solid color-mix(in srgb, #ffffff 12%, transparent);
    --ui-orbiter-item-color: #f8fbff;
    --ui-orbiter-center-bg: color-mix(in srgb, #ffffff 8%, transparent);
    --ui-orbiter-center-border: 1px solid color-mix(in srgb, #ffffff 18%, transparent);
    --ui-orbiter-path-color: color-mix(in srgb, #ffffff 18%, transparent);
    --ui-orbiter-shadow: 0 28px 56px rgba(2, 6, 23, 0.34);
    --ui-orbiter-item-shadow: 0 12px 24px rgba(2, 6, 23, 0.22);
    --ui-orbiter-center-shadow: 0 18px 34px rgba(2, 6, 23, 0.24);
  }

  :host([variant="minimal"]) {
    --ui-orbiter-bg: transparent;
    --ui-orbiter-border: none;
    --ui-orbiter-shadow: none;
    --ui-orbiter-item-shadow: none;
    --ui-orbiter-center-shadow: none;
    --ui-orbiter-item-bg: transparent;
    --ui-orbiter-item-border: 1px solid transparent;
    --ui-orbiter-center-bg: transparent;
    --ui-orbiter-center-border: 1px solid transparent;
  }

  :host([surface-radius="none"]) {
    --ui-orbiter-radius: 0px;
  }

  :host([surface-radius="sm"]) {
    --ui-orbiter-radius: 18px;
  }

  :host([surface-radius="md"]) {
    --ui-orbiter-radius: 24px;
  }

  :host([surface-radius="lg"]) {
    --ui-orbiter-radius: 32px;
  }

  :host([surface-radius="full"]) {
    --ui-orbiter-radius: 999px;
  }

  :host([elevation="none"]) {
    --ui-orbiter-shadow: none;
    --ui-orbiter-item-shadow: none;
    --ui-orbiter-center-shadow: none;
  }

  :host([elevation="high"]) {
    --ui-orbiter-shadow:
      0 2px 8px rgba(15, 23, 42, 0.08),
      0 34px 64px rgba(15, 23, 42, 0.18);
    --ui-orbiter-item-shadow:
      0 10px 18px rgba(15, 23, 42, 0.12),
      0 2px 4px rgba(15, 23, 42, 0.08);
    --ui-orbiter-center-shadow:
      0 18px 34px rgba(15, 23, 42, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.42);
  }

  .root {
    display: block;
    min-inline-size: 0;
  }

  .surface {
    display: grid;
    place-items: center;
    min-inline-size: 0;
    inline-size: fit-content;
    padding: var(--ui-orbiter-padding);
    border-radius: var(--ui-orbiter-radius);
    border: var(--ui-orbiter-border);
    background: var(--ui-orbiter-bg);
    color: var(--ui-orbiter-color);
    box-shadow: var(--ui-orbiter-shadow);
    backdrop-filter: var(--ui-orbiter-backdrop);
    transition:
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      backdrop-filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  .stage {
    position: relative;
    inline-size: var(--ui-orbiter-stage-size);
    block-size: var(--ui-orbiter-stage-size);
    min-inline-size: 0;
    isolation: isolate;
    overflow: visible;
  }

  .paths,
  .center-shell {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .path {
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    border-radius: 999px;
    border: 1px solid var(--ui-orbiter-path-color);
    opacity: var(--ui-orbiter-path-opacity);
    transform: translate(-50%, -50%);
    box-sizing: border-box;
  }

  :host([data-path-visible="false"]) .paths {
    display: none;
  }

  ::slotted([data-ui-orbiter-center]) {
    position: absolute !important;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    inline-size: var(--ui-orbiter-center-size);
    block-size: var(--ui-orbiter-center-size);
    transform: translate(-50%, -50%);
    border-radius: 999px;
    border: var(--ui-orbiter-center-border);
    background: var(--ui-orbiter-center-bg);
    color: var(--ui-orbiter-color);
    box-shadow: var(--ui-orbiter-center-shadow);
    backdrop-filter: var(--ui-orbiter-center-backdrop);
    display: grid !important;
    place-items: center;
    padding: 12px;
    box-sizing: border-box;
    text-align: center;
    z-index: 1;
  }

  ::slotted([data-ui-orbiter-item]) {
    position: absolute !important;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    inline-size: var(--ui-orbiter-item-size);
    block-size: var(--ui-orbiter-item-size);
    border-radius: 999px;
    border: var(--ui-orbiter-item-border);
    background: var(--ui-orbiter-item-bg);
    color: var(--ui-orbiter-item-color);
    box-shadow: var(--ui-orbiter-item-shadow);
    backdrop-filter: var(--ui-orbiter-item-backdrop);
    display: grid !important;
    place-items: center;
    box-sizing: border-box;
    padding: 0;
    overflow: visible;
    transform:
      translate(-50%, -50%)
      rotate(var(--ui-orbit-start-angle, 0deg))
      translateX(var(--ui-orbit-radius, var(--ui-orbiter-orbit-radius)))
      rotate(var(--ui-orbit-start-angle-inverse, 0deg));
    transform-origin: center;
    will-change: transform;
    z-index: 2;
    pointer-events: auto;
  }

  ::slotted([data-ui-orbit-runtime]) {
    animation: none !important;
  }

  ::slotted([data-ui-orbiter-clickable]) {
    cursor: pointer;
    transition:
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  ::slotted([data-ui-orbiter-clickable]:hover) {
    filter: brightness(1.03);
  }

  ::slotted([data-ui-orbiter-clickable]:focus-visible) {
    outline: none;
    border-color: color-mix(in srgb, var(--ui-orbiter-focus-ring) 30%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-orbiter-focus-ring) 20%, transparent),
      var(--ui-orbiter-item-shadow);
  }

  :host([variant="minimal"]) ::slotted([data-ui-orbiter-item]) {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    backdrop-filter: none;
  }

  :host([variant="minimal"]) ::slotted([data-ui-orbiter-center]) {
    background: transparent;
    border-color: transparent;
    box-shadow: none;
    backdrop-filter: none;
    padding: 0;
  }

  :host([paused]) ::slotted([data-ui-orbiter-item]),
  :host([pause-on-hover]:hover) ::slotted([data-ui-orbiter-item]),
  :host([pause-on-item-hover][data-item-hovered="true"]) ::slotted([data-ui-orbiter-item]),
  :host([pause-on-focus]:focus-within) ::slotted([data-ui-orbiter-item]) {
    animation-play-state: paused;
  }

  @keyframes ui-orbiter-orbit {
    from {
      transform:
        translate(-50%, -50%)
        rotate(var(--ui-orbit-start-angle, 0deg))
        translateX(var(--ui-orbit-radius, var(--ui-orbiter-orbit-radius)))
        rotate(var(--ui-orbit-start-angle-inverse, 0deg));
    }
    25% {
      transform:
        translate(-50%, -50%)
        rotate(var(--ui-orbit-quarter-angle, 90deg))
        translateX(var(--ui-orbit-radius, var(--ui-orbiter-orbit-radius)))
        rotate(var(--ui-orbit-quarter-angle-inverse, -90deg));
    }
    50% {
      transform:
        translate(-50%, -50%)
        rotate(var(--ui-orbit-half-angle, 180deg))
        translateX(var(--ui-orbit-radius, var(--ui-orbiter-orbit-radius)))
        rotate(var(--ui-orbit-half-angle-inverse, -180deg));
    }
    75% {
      transform:
        translate(-50%, -50%)
        rotate(var(--ui-orbit-three-quarter-angle, 270deg))
        translateX(var(--ui-orbit-radius, var(--ui-orbiter-orbit-radius)))
        rotate(var(--ui-orbit-three-quarter-angle-inverse, -270deg));
    }
    to {
      transform:
        translate(-50%, -50%)
        rotate(var(--ui-orbit-end-angle, 360deg))
        translateX(var(--ui-orbit-radius, var(--ui-orbiter-orbit-radius)))
        rotate(var(--ui-orbit-end-angle-inverse, -360deg));
    }
  }

  :host(:focus-visible) .surface {
    outline: none;
    border-color: color-mix(in srgb, var(--ui-orbiter-focus-ring) 24%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-orbiter-focus-ring) 18%, transparent),
      var(--ui-orbiter-shadow);
  }

  @media (prefers-reduced-motion: reduce) {
    ::slotted([data-ui-orbiter-item]) {
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .surface,
    ::slotted([data-ui-orbiter-item]),
    ::slotted([data-ui-orbiter-center]) {
      box-shadow: none;
    }

    .surface {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-orbiter-bg: Canvas;
      --ui-orbiter-color: CanvasText;
      --ui-orbiter-border-color: CanvasText;
      --ui-orbiter-shadow: none;
      --ui-orbiter-item-bg: Canvas;
      --ui-orbiter-item-border: 1px solid CanvasText;
      --ui-orbiter-item-color: CanvasText;
      --ui-orbiter-item-shadow: none;
      --ui-orbiter-center-bg: Canvas;
      --ui-orbiter-center-border: 1px solid CanvasText;
      --ui-orbiter-center-shadow: none;
      --ui-orbiter-path-color: CanvasText;
    }

    .surface,
    .path,
    ::slotted([data-ui-orbiter-item]),
    ::slotted([data-ui-orbiter-center]) {
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

function normalizeTime(value: string | null, fallback: string): string {
  if (value == null || value === '') return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (/^-?\d+(\.\d+)?(ms|s)$/i.test(trimmed)) return trimmed;
  if (/^-?\d+(\.\d+)?$/i.test(trimmed)) return `${trimmed}s`;
  return fallback;
}

function timeToMs(value: string | null, fallbackMs: number): number {
  if (value == null || value === '') return fallbackMs;
  const trimmed = value.trim();
  if (!trimmed) return fallbackMs;
  if (/^-?\d+(\.\d+)?ms$/i.test(trimmed)) return Number.parseFloat(trimmed);
  if (/^-?\d+(\.\d+)?s$/i.test(trimmed)) return Number.parseFloat(trimmed) * 1000;
  if (/^-?\d+(\.\d+)?$/i.test(trimmed)) return Number.parseFloat(trimmed) * 1000;
  return fallbackMs;
}

function parseNumber(value: string | null, fallback: number): number {
  if (value == null || value === '') return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parsePositiveNumber(value: string | null, fallback: number): number {
  const parsed = parseNumber(value, fallback);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBooleanAttribute(value: string | null, fallback: boolean): boolean {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'off' || normalized === 'no') return false;
  if (normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes') return true;
  return fallback;
}

function buildOrbitTransform(angle: number, radius: string): string {
  return `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}) rotate(${-angle}deg)`;
}

function clampRings(value: string | null): number {
  const parsed = Math.round(parseNumber(value, 1));
  return Math.min(MAX_RINGS, Math.max(1, parsed || 1));
}

export class UIOrbiter extends ElementBase {
  static get observedAttributes() {
    return [
      'duration',
      'delay',
      'speed',
      'reverse',
      'radius',
      'orbit-radius',
      'icon-size',
      'item-size',
      'center-size',
      'ring-gap',
      'rings',
      'start-angle',
      'direction',
      'animation',
      'variant',
      'tone',
      'size',
      'surface-radius',
      'elevation',
      'padding',
      'path',
      'show-paths',
      'pause-on-hover',
      'pause-on-item-hover',
      'pause-on-focus',
      'paused',
    ];
  }

  private _itemSlot: HTMLSlotElement | null = null;
  private _centerSlot: HTMLSlotElement | null = null;
  private _pathsEl: HTMLElement | null = null;
  private _items: HTMLElement[] = [];
  private _centerNodes: HTMLElement[] = [];
  private _animations = new Map<HTMLElement, Animation>();
  private _hovering = false;
  private _itemHovering = false;
  private _focusWithin = false;
  private _itemHoverHandlers = new WeakMap<
    HTMLElement,
    { enter: (event: PointerEvent) => void; leave: (event: PointerEvent) => void }
  >();
  private _boundSlotChange = this._handleSlotChange.bind(this);
  private _boundPointerEnter = () => {
    this._hovering = true;
    this._syncState();
  };
  private _boundPointerLeave = () => {
    this._hovering = false;
    this._syncState();
  };
  private _boundFocusIn = () => {
    this._focusWithin = true;
    this._syncState();
  };
  private _boundFocusOut = () => {
    this._focusWithin = this.matches(':focus-within');
    this._syncState();
  };

  constructor() {
    super();
    this.addEventListener('pointerenter', this._boundPointerEnter);
    this.addEventListener('pointerleave', this._boundPointerLeave);
    this.addEventListener('focusin', this._boundFocusIn);
    this.addEventListener('focusout', this._boundFocusOut);
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
    this._syncRuntimeStyles();
    this._syncItems();
    this._renderPaths();
    this._syncAnimations();
    this._syncState();
  }

  override disconnectedCallback(): void {
    this._cancelAllAnimations();
    this._hovering = false;
    this._itemHovering = false;
    this._focusWithin = false;
    super.disconnectedCallback();
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="surface" part="surface">
          <div class="stage" part="stage">
            <div class="paths" part="paths"></div>
            <div class="center-shell" part="center">
              <slot name="center"></slot>
            </div>
            <slot></slot>
          </div>
        </div>
      </div>
    `);

    this._itemSlot = this.root.querySelector('slot:not([name])');
    this._centerSlot = this.root.querySelector('slot[name="center"]');
    this._pathsEl = this.root.querySelector('.paths');
    this._itemSlot?.addEventListener('slotchange', this._boundSlotChange);
    this._centerSlot?.addEventListener('slotchange', this._boundSlotChange);
    this._syncRuntimeStyles();
    this._syncItems();
    this._renderPaths();
    this._syncAnimations();
    this._syncState();
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue || !this.isConnected) return;
    if (name === 'paused') {
      this._syncState();
      return;
    }
    this._syncRuntimeStyles();
    if (
      name === 'orbit-radius' ||
      name === 'radius' ||
      name === 'icon-size' ||
      name === 'item-size' ||
      name === 'center-size' ||
      name === 'ring-gap' ||
      name === 'rings' ||
      name === 'start-angle' ||
      name === 'direction' ||
      name === 'reverse' ||
      name === 'size'
    ) {
      this._syncItems();
      this._renderPaths();
      this._syncAnimations();
    } else if (name === 'duration' || name === 'delay' || name === 'speed' || name === 'animation') {
      this._syncAnimations();
    }
    this._syncState();
  }

  private _handleSlotChange(): void {
    this._syncItems();
    this._renderPaths();
    this._syncAnimations();
    this._syncState();
  }

  private _itemsFromSlot(): HTMLElement[] {
    if (!this._itemSlot) return [];
    return this._itemSlot
      .assignedElements({ flatten: true })
      .filter((node): node is HTMLElement => node instanceof HTMLElement);
  }

  private _centerFromSlot(): HTMLElement[] {
    if (!this._centerSlot) return [];
    return this._centerSlot
      .assignedElements({ flatten: true })
      .filter((node): node is HTMLElement => node instanceof HTMLElement);
  }

  private _syncItems(): void {
    const nextItems = this._itemsFromSlot();
    const nextCenters = this._centerFromSlot();
    const nextSet = new Set(nextItems);
    const centerSet = new Set(nextCenters);

    for (const item of this._items) {
      if (nextSet.has(item)) continue;
      this._unbindItemHover(item);
      this._cancelAnimation(item);
      item.removeAttribute('data-ui-orbiter-managed');
      item.removeAttribute('data-ui-orbit-runtime');
      item.style.removeProperty('--ui-orbit-index');
      item.style.removeProperty('--ui-orbit-ring');
      item.style.removeProperty('--ui-orbit-radius');
      item.style.removeProperty('--ui-orbit-start-angle');
      item.style.removeProperty('--ui-orbit-quarter-angle');
      item.style.removeProperty('--ui-orbit-half-angle');
      item.style.removeProperty('--ui-orbit-three-quarter-angle');
      item.style.removeProperty('--ui-orbit-end-angle');
      item.style.removeProperty('--ui-orbit-start-angle-inverse');
      item.style.removeProperty('--ui-orbit-quarter-angle-inverse');
      item.style.removeProperty('--ui-orbit-half-angle-inverse');
      item.style.removeProperty('--ui-orbit-three-quarter-angle-inverse');
      item.style.removeProperty('--ui-orbit-end-angle-inverse');
      item.style.removeProperty('--ui-orbit-duration');
      item.style.removeProperty('--ui-orbit-duration-scale');
      item.style.removeProperty('animation');
      item.style.removeProperty('transform');
      if (item.hasAttribute('data-ui-orbiter-owned')) {
        item.removeAttribute('data-ui-orbiter-item');
        item.removeAttribute('data-ui-orbiter-owned');
      }
    }

    for (const center of this._centerNodes) {
      if (centerSet.has(center)) continue;
      center.removeAttribute('data-ui-orbiter-managed');
      if (center.hasAttribute('data-ui-orbiter-owned')) {
        center.removeAttribute('data-ui-orbiter-center');
        center.removeAttribute('data-ui-orbiter-owned');
      }
    }

    nextCenters.forEach((center) => {
      center.setAttribute('data-ui-orbiter-managed', '');
      if (!center.hasAttribute('data-ui-orbiter-center')) {
        center.setAttribute('data-ui-orbiter-center', '');
        center.setAttribute('data-ui-orbiter-owned', '');
      }
      center.setAttribute('slot', 'center');
    });

    const rings = clampRings(this.getAttribute('rings'));
    const baseRadius = normalizeLength(this._orbitRadiusValue(), this._sizePreset().orbitRadius);
    const ringGap = normalizeLength(this.getAttribute('ring-gap'), this._sizePreset().ringGap);
    const startAngle = parseNumber(this.getAttribute('start-angle'), DEFAULT_START_ANGLE);
    const ringBuckets = Array.from({ length: rings }, () => [] as Array<{ item: HTMLElement; index: number }>);

    nextItems.forEach((item, index) => {
      item.setAttribute('data-ui-orbiter-managed', '');
      if (!item.hasAttribute('data-ui-orbiter-item')) {
        item.setAttribute('data-ui-orbiter-item', '');
        item.setAttribute('data-ui-orbiter-owned', '');
      }
      this._bindItemHover(item);
      ringBuckets[index % rings].push({ item, index });
    });

    ringBuckets.forEach((bucket, ringIndex) => {
      const angleStep = bucket.length ? 360 / bucket.length : 360;
      const ringOffset = bucket.length > 1 && ringIndex % 2 === 1 ? angleStep / 2 : 0;
      const ringRadius = ringIndex === 0 ? baseRadius : `calc(${baseRadius} + ${ringIndex} * ${ringGap})`;
      const directionSign = this._directionSign(ringIndex);
      const turn = 360 * directionSign;

      bucket.forEach(({ item, index }, position) => {
        const angle = startAngle + ringOffset + position * angleStep;
        const endAngle = angle + turn;
        const quarterAngle = angle + turn * 0.25;
        const halfAngle = angle + turn * 0.5;
        const threeQuarterAngle = angle + turn * 0.75;
        const durationScale = 1 + ringIndex * 0.14;
        item.style.setProperty('--ui-orbit-index', String(index));
        item.style.setProperty('--ui-orbit-ring', String(ringIndex));
        item.style.setProperty('--ui-orbit-radius', ringRadius);
        item.style.setProperty('--ui-orbit-duration', `calc(var(--ui-orbiter-duration) * ${durationScale})`);
        item.style.setProperty('--ui-orbit-duration-scale', String(durationScale));
        item.style.setProperty('--ui-orbit-start-angle', `${angle}deg`);
        item.style.setProperty('--ui-orbit-quarter-angle', `${quarterAngle}deg`);
        item.style.setProperty('--ui-orbit-half-angle', `${halfAngle}deg`);
        item.style.setProperty('--ui-orbit-three-quarter-angle', `${threeQuarterAngle}deg`);
        item.style.setProperty('--ui-orbit-end-angle', `${endAngle}deg`);
        item.style.setProperty('--ui-orbit-start-angle-inverse', `${-angle}deg`);
        item.style.setProperty('--ui-orbit-quarter-angle-inverse', `${-quarterAngle}deg`);
        item.style.setProperty('--ui-orbit-half-angle-inverse', `${-halfAngle}deg`);
        item.style.setProperty('--ui-orbit-three-quarter-angle-inverse', `${-threeQuarterAngle}deg`);
        item.style.setProperty('--ui-orbit-end-angle-inverse', `${-endAngle}deg`);
        item.style.setProperty('transform', buildOrbitTransform(angle, ringRadius));
      });
    });

    this._items = nextItems;
    this._centerNodes = nextCenters;
    this._itemHovering = this._items.some((item) => item.matches(':hover'));
      this.setAttribute('data-item-count', String(this._items.length));
    this.setAttribute('data-center-count', String(this._centerNodes.length));
    this.setAttribute('data-ring-count', String(rings));
  }

  private _renderPaths(): void {
    if (!this._pathsEl) return;
    const rings = clampRings(this.getAttribute('rings'));
    const baseRadius = normalizeLength(this._orbitRadiusValue(), this._sizePreset().orbitRadius);
    const ringGap = normalizeLength(this.getAttribute('ring-gap'), this._sizePreset().ringGap);

    const markup = Array.from({ length: rings }, (_, ringIndex) => {
      const ringRadius = ringIndex === 0 ? baseRadius : `calc(${baseRadius} + ${ringIndex} * ${ringGap})`;
      return `<div class="path" part="path path-${ringIndex + 1}" style="inline-size:calc(2 * (${ringRadius}));block-size:calc(2 * (${ringRadius}));"></div>`;
    }).join('');

    this._pathsEl.innerHTML = markup;
    this._pathsEl.toggleAttribute('hidden', !this._pathVisible());
  }

  private _bindItemHover(item: HTMLElement): void {
    if (this._itemHoverHandlers.has(item)) return;
    const enter = () => {
      this._itemHovering = true;
      this._syncState();
    };
    const leave = (event: PointerEvent) => {
      const nextTarget = event.relatedTarget instanceof HTMLElement ? event.relatedTarget : null;
      const nextItem = nextTarget?.closest('[data-ui-orbiter-item]');
      this._itemHovering = nextItem instanceof HTMLElement ? this._items.includes(nextItem) : false;
      this._syncState();
    };
    item.addEventListener('pointerenter', enter);
    item.addEventListener('pointerleave', leave);
    this._itemHoverHandlers.set(item, { enter, leave });
  }

  private _unbindItemHover(item: HTMLElement): void {
    const handlers = this._itemHoverHandlers.get(item);
    if (!handlers) return;
    item.removeEventListener('pointerenter', handlers.enter);
    item.removeEventListener('pointerleave', handlers.leave);
    this._itemHoverHandlers.delete(item);
  }

  private _sizePreset(): OrbiterSizePreset {
    const raw = this.getAttribute('size');
    switch (raw) {
      case 'xs':
      case '0':
        return SIZE_PRESETS.xs;
      case 'sm':
      case '1':
        return SIZE_PRESETS.sm;
      case 'lg':
      case '3':
        return SIZE_PRESETS.lg;
      case 'xl':
      case '4':
        return SIZE_PRESETS.xl;
      case 'md':
      case '2':
      default:
        return SIZE_PRESETS.md;
    }
  }

  private _motionPreset(): OrbiterMotionPreset {
    const raw = this.getAttribute('animation');
    return raw && ANIMATIONS.has(raw as OrbiterAnimation)
      ? MOTION_PRESETS[raw as OrbiterAnimation]
      : MOTION_PRESETS.smooth;
  }

  private _direction(): OrbiterDirection {
    const raw = this.getAttribute('direction');
    return raw && DIRECTIONS.has(raw as OrbiterDirection)
      ? (raw as OrbiterDirection)
      : 'clockwise';
  }

  private _directionSign(ringIndex: number): number {
    const direction = this._direction();
    let sign = direction === 'counterclockwise' || (direction === 'alternate' && ringIndex % 2 === 1) ? -1 : 1;
    if (parseBooleanAttribute(this.getAttribute('reverse'), this.hasAttribute('reverse'))) sign *= -1;
    return sign;
  }

  private _pathVisible(): boolean {
    const path = this.getAttribute('path');
    if (path != null) return parseBooleanAttribute(path, true);
    if (this.hasAttribute('show-paths')) return true;
    return true;
  }

  private _orbitRadiusValue(): string | null {
    return this.getAttribute('radius') ?? this.getAttribute('orbit-radius');
  }

  private _iconSizeValue(): string | null {
    return this.getAttribute('icon-size') ?? this.getAttribute('item-size');
  }

  private _syncRuntimeStyles(): void {
    const sizePreset = this._sizePreset();
    const motionPreset = this._motionPreset();
    const duration = normalizeTime(this.getAttribute('duration'), DEFAULT_DURATION);
    const delay = normalizeTime(this.getAttribute('delay'), DEFAULT_DELAY);
    const orbitRadius = normalizeLength(this._orbitRadiusValue(), sizePreset.orbitRadius);
    const itemSize = normalizeLength(this._iconSizeValue(), sizePreset.itemSize);
    const centerSize = normalizeLength(this.getAttribute('center-size'), sizePreset.centerSize);
    const ringGap = normalizeLength(this.getAttribute('ring-gap'), sizePreset.ringGap);
    const padding = normalizeLength(this.getAttribute('padding'), sizePreset.padding);
    const rings = clampRings(this.getAttribute('rings'));
    const speed = parsePositiveNumber(this.getAttribute('speed'), 1);
    const farthestRadius = rings <= 1 ? orbitRadius : `calc(${orbitRadius} + ${(rings - 1)} * ${ringGap})`;
    const stageSize = `calc((2 * (${farthestRadius})) + ${itemSize})`;

    this.style.setProperty('--ui-orbiter-duration', `calc((${duration}) * ${motionPreset.durationScale} / ${speed})`);
    this.style.setProperty('--ui-orbiter-delay', delay);
    this.style.setProperty('--ui-orbiter-orbit-radius', orbitRadius);
    this.style.setProperty('--ui-orbiter-item-size', itemSize);
    this.style.setProperty('--ui-orbiter-center-size', centerSize);
    this.style.setProperty('--ui-orbiter-ring-gap', ringGap);
    this.style.setProperty('--ui-orbiter-padding', padding);
    this.style.setProperty('--ui-orbiter-farthest-radius', farthestRadius);
    this.style.setProperty('--ui-orbiter-stage-size', stageSize);
    this.style.setProperty('--ui-orbiter-path-opacity', String(motionPreset.accentOpacity > 0.18 ? 1 : 0.95));

    const radius = this.getAttribute('surface-radius');
    if (!radius || SEMANTIC_RADIUS_VALUES.has(radius.trim())) {
      this.style.removeProperty('--ui-orbiter-radius');
    } else {
      this.style.setProperty('--ui-orbiter-radius', normalizeLength(radius, sizePreset.panelRadius));
    }
  }

  private _syncAnimations(): void {
    const items = this._items;
    const active = new Set(items);

    for (const [item, animation] of this._animations.entries()) {
      if (active.has(item)) continue;
      animation.cancel();
      this._animations.delete(item);
    }

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      this._cancelAllAnimations();
      items.forEach((item) => item.removeAttribute('data-ui-orbit-runtime'));
      return;
    }

    if (typeof HTMLElement === 'undefined' || typeof HTMLElement.prototype.animate !== 'function') {
      items.forEach((item) => item.removeAttribute('data-ui-orbit-runtime'));
      return;
    }

    const motionPreset = this._motionPreset();
    const baseDurationMs = timeToMs(this.getAttribute('duration'), 18000);
    const delayMs = timeToMs(this.getAttribute('delay'), 0);
    const speed = parsePositiveNumber(this.getAttribute('speed'), 1);

    for (const item of items) {
      const radius = item.style.getPropertyValue('--ui-orbit-radius') || `var(--ui-orbiter-orbit-radius)`;
      const startAngle = parseNumber(item.style.getPropertyValue('--ui-orbit-start-angle'), DEFAULT_START_ANGLE);
      const quarterAngle = parseNumber(item.style.getPropertyValue('--ui-orbit-quarter-angle'), startAngle + 90);
      const halfAngle = parseNumber(item.style.getPropertyValue('--ui-orbit-half-angle'), startAngle + 180);
      const threeQuarterAngle = parseNumber(item.style.getPropertyValue('--ui-orbit-three-quarter-angle'), startAngle + 270);
      const endAngle = parseNumber(item.style.getPropertyValue('--ui-orbit-end-angle'), startAngle + 360);
      const ringScale = parsePositiveNumber(item.style.getPropertyValue('--ui-orbit-duration-scale'), 1);
      const durationMs = (baseDurationMs * motionPreset.durationScale * ringScale) / speed;
      const existing = this._animations.get(item);

      existing?.cancel();
      item.setAttribute('data-ui-orbit-runtime', '');
      const animation = item.animate(
        [
          { transform: buildOrbitTransform(startAngle, radius), offset: 0 },
          { transform: buildOrbitTransform(quarterAngle, radius), offset: 0.25 },
          { transform: buildOrbitTransform(halfAngle, radius), offset: 0.5 },
          { transform: buildOrbitTransform(threeQuarterAngle, radius), offset: 0.75 },
          { transform: buildOrbitTransform(endAngle, radius), offset: 1 },
        ],
        {
          duration: Math.max(1, durationMs),
          delay: Math.max(0, delayMs),
          easing: 'linear',
          iterations: Number.POSITIVE_INFINITY,
          fill: 'both',
        }
      );

      this._animations.set(item, animation);
    }
  }

  private _cancelAnimation(item: HTMLElement): void {
    const animation = this._animations.get(item);
    item.removeAttribute('data-ui-orbit-runtime');
    if (!animation) return;
    animation.cancel();
    this._animations.delete(item);
  }

  private _cancelAllAnimations(): void {
    for (const animation of this._animations.values()) animation.cancel();
    this._animations.clear();
    this._items.forEach((item) => {
      item.removeAttribute('data-ui-orbit-runtime');
      this._unbindItemHover(item);
    });
  }

  private _effectivePaused(): boolean {
    if (this.hasAttribute('paused')) return true;
    if (this.hasAttribute('pause-on-hover') && this._hovering) return true;
    if (this.hasAttribute('pause-on-item-hover') && this._itemHovering) return true;
    if (this.hasAttribute('pause-on-focus') && this._focusWithin) return true;
    return false;
  }

  private _syncState(): void {
    const state = this._effectivePaused() ? 'paused' : 'running';
    this.setAttribute('data-state', state);
    this.setAttribute('data-path-visible', this._pathVisible() ? 'true' : 'false');
    this.setAttribute('data-item-hovered', this._itemHovering ? 'true' : 'false');

    for (const animation of this._animations.values()) {
      if (state === 'paused') animation.pause();
      else animation.play();
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-orbiter')) {
  customElements.define('ui-orbiter', UIOrbiter);
}
