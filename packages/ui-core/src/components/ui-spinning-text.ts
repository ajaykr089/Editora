import { ElementBase } from '../ElementBase';

type SpinningTextDirection = 'clockwise' | 'counterclockwise';
type SpinningTextVariant = 'default' | 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
type SpinningTextTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type SpinningTextSize = 'sm' | 'md' | 'lg' | 'xl' | '1' | '2' | '3' | '4';
type SpinningTextElevation = 'none' | 'low' | 'high';

type SizePreset = {
  fontSize: string;
  fontSizePx: number;
  radius: string;
  radiusPx: number;
  padding: string;
  letterSpacing: string;
  letterSpacingPx: number;
  surfaceRadius: string;
};

const DEFAULT_DURATION = '14s';
const DEFAULT_SEPARATOR = ' • ';
const DEFAULT_EASING = 'linear';
const DEFAULT_SPEED_RPM = 4;
const DEFAULT_REPEAT = 1;
const MAX_REPEAT = 12;
const DIRECTIONS = new Set<SpinningTextDirection>(['clockwise', 'counterclockwise']);
const VARIANTS = new Set<SpinningTextVariant>(['default', 'surface', 'soft', 'solid', 'glass', 'contrast', 'minimal']);
const TONES = new Set<SpinningTextTone>(['brand', 'neutral', 'info', 'success', 'warning', 'danger']);
const SIZES = new Set<SpinningTextSize>(['sm', 'md', 'lg', 'xl', '1', '2', '3', '4']);
const ELEVATIONS = new Set<SpinningTextElevation>(['none', 'low', 'high']);

const SIZE_PRESETS: Record<'sm' | 'md' | 'lg' | 'xl', SizePreset> = {
  sm: {
    fontSize: '12px',
    fontSizePx: 12,
    radius: '56px',
    radiusPx: 56,
    padding: '12px',
    letterSpacing: '0.16em',
    letterSpacingPx: 1.92,
    surfaceRadius: '24px',
  },
  md: {
    fontSize: '14px',
    fontSizePx: 14,
    radius: '78px',
    radiusPx: 78,
    padding: '16px',
    letterSpacing: '0.16em',
    letterSpacingPx: 2.24,
    surfaceRadius: '28px',
  },
  lg: {
    fontSize: '16px',
    fontSizePx: 16,
    radius: '96px',
    radiusPx: 96,
    padding: '20px',
    letterSpacing: '0.18em',
    letterSpacingPx: 2.88,
    surfaceRadius: '32px',
  },
  xl: {
    fontSize: '20px',
    fontSizePx: 20,
    radius: '122px',
    radiusPx: 122,
    padding: '24px',
    letterSpacing: '0.2em',
    letterSpacingPx: 4,
    surfaceRadius: '36px',
  },
};

const style = `
  :host {
    --ui-spinning-text-duration: ${DEFAULT_DURATION};
    --ui-spinning-text-easing: ${DEFAULT_EASING};
    --ui-spinning-text-font-size: ${SIZE_PRESETS.lg.fontSize};
    --ui-spinning-text-font-weight: 760;
    --ui-spinning-text-letter-spacing: ${SIZE_PRESETS.lg.letterSpacing};
    --ui-spinning-text-radius: ${SIZE_PRESETS.lg.radius};
    --ui-spinning-text-min-radius: 0px;
    --ui-spinning-text-effective-radius: max(var(--ui-spinning-text-radius), var(--ui-spinning-text-min-radius));
    --ui-spinning-text-padding: ${SIZE_PRESETS.lg.padding};
    --ui-spinning-text-surface-radius: ${SIZE_PRESETS.lg.surfaceRadius};
    --ui-spinning-text-stage-size:
      calc((var(--ui-spinning-text-effective-radius) * 2) + (var(--ui-spinning-text-font-size) * 3));
    --ui-spinning-text-rotation: 1turn;
    --ui-spinning-text-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-spinning-text-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-spinning-text-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-color-surface-elevated, #f8fafc) 92%, transparent) 0%,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent) 62%,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 88%, transparent) 100%
      );
    --ui-spinning-text-border-color:
      color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 84%, transparent);
    --ui-spinning-text-border: 1px solid var(--ui-spinning-text-border-color);
    --ui-spinning-text-shadow:
      0 1px 3px rgba(15, 23, 42, 0.06),
      0 24px 44px rgba(15, 23, 42, 0.12);
    --ui-spinning-text-backdrop: none;
    --ui-spinning-text-orbit-color:
      color-mix(in srgb, var(--ui-spinning-text-accent) 18%, var(--ui-spinning-text-border-color));
    --ui-spinning-text-center-bg:
      radial-gradient(
        circle at 50% 35%,
        color-mix(in srgb, #ffffff 90%, transparent) 0%,
        color-mix(in srgb, var(--ui-spinning-text-accent) 10%, rgba(255, 255, 255, 0.92)) 100%
      );
    --ui-spinning-text-center-border:
      1px solid color-mix(in srgb, var(--ui-spinning-text-accent) 20%, rgba(255, 255, 255, 0.84));
    --ui-spinning-text-center-shadow:
      0 12px 28px rgba(15, 23, 42, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.52);
    --ui-spinning-text-center-color: inherit;
    --ui-spinning-text-center-size:
      clamp(56px, calc(var(--ui-spinning-text-effective-radius) * 0.9), 220px);
    --ui-spinning-text-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    display: inline-block;
    min-inline-size: 0;
    color: var(--ui-spinning-text-color);
    color-scheme: light dark;
    font-family: "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-sizing: border-box;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-spinning-text-font-size: ${SIZE_PRESETS.sm.fontSize};
    --ui-spinning-text-radius: ${SIZE_PRESETS.sm.radius};
    --ui-spinning-text-padding: ${SIZE_PRESETS.sm.padding};
    --ui-spinning-text-letter-spacing: ${SIZE_PRESETS.sm.letterSpacing};
    --ui-spinning-text-surface-radius: ${SIZE_PRESETS.sm.surfaceRadius};
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-spinning-text-font-size: ${SIZE_PRESETS.md.fontSize};
    --ui-spinning-text-radius: ${SIZE_PRESETS.md.radius};
    --ui-spinning-text-padding: ${SIZE_PRESETS.md.padding};
    --ui-spinning-text-letter-spacing: ${SIZE_PRESETS.md.letterSpacing};
    --ui-spinning-text-surface-radius: ${SIZE_PRESETS.md.surfaceRadius};
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-spinning-text-font-size: ${SIZE_PRESETS.lg.fontSize};
    --ui-spinning-text-radius: ${SIZE_PRESETS.lg.radius};
    --ui-spinning-text-padding: ${SIZE_PRESETS.lg.padding};
    --ui-spinning-text-letter-spacing: ${SIZE_PRESETS.lg.letterSpacing};
    --ui-spinning-text-surface-radius: ${SIZE_PRESETS.lg.surfaceRadius};
  }

  :host([size="xl"]),
  :host([size="4"]) {
    --ui-spinning-text-font-size: ${SIZE_PRESETS.xl.fontSize};
    --ui-spinning-text-radius: ${SIZE_PRESETS.xl.radius};
    --ui-spinning-text-padding: ${SIZE_PRESETS.xl.padding};
    --ui-spinning-text-letter-spacing: ${SIZE_PRESETS.xl.letterSpacing};
    --ui-spinning-text-surface-radius: ${SIZE_PRESETS.xl.surfaceRadius};
  }

  :host([direction="counterclockwise"]) {
    --ui-spinning-text-rotation: -1turn;
  }

  :host([tone="neutral"]) {
    --ui-spinning-text-accent: #64748b;
  }

  :host([tone="info"]) {
    --ui-spinning-text-accent: #0ea5e9;
  }

  :host([tone="success"]) {
    --ui-spinning-text-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-spinning-text-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-spinning-text-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="soft"]) {
    --ui-spinning-text-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-spinning-text-accent) 10%, var(--ui-color-surface, #ffffff)) 0%,
        color-mix(in srgb, var(--ui-spinning-text-accent) 4%, var(--ui-color-surface, #ffffff)) 100%
      );
    --ui-spinning-text-shadow: none;
    --ui-spinning-text-center-shadow: none;
  }

  :host([variant="solid"]) {
    --ui-spinning-text-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, var(--ui-spinning-text-accent) 12%, var(--ui-color-surface, #ffffff)) 0%,
        color-mix(in srgb, var(--ui-spinning-text-accent) 4%, var(--ui-color-surface-elevated, #f8fafc)) 100%
      );
    --ui-spinning-text-orbit-color:
      color-mix(in srgb, var(--ui-spinning-text-accent) 26%, var(--ui-spinning-text-border-color));
  }

  :host([variant="glass"]) {
    --ui-spinning-text-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, #ffffff 78%, transparent) 0%,
        color-mix(in srgb, var(--ui-color-surface, #ffffff) 80%, transparent) 100%
      );
    --ui-spinning-text-backdrop: blur(18px) saturate(1.08);
    --ui-spinning-text-center-shadow:
      0 10px 22px rgba(15, 23, 42, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.56);
  }

  :host([variant="contrast"]) {
    --ui-spinning-text-bg:
      radial-gradient(
        circle at 50% 50%,
        color-mix(in srgb, #0b1f3f 92%, var(--ui-spinning-text-accent) 8%) 0%,
        color-mix(in srgb, #07162d 96%, var(--ui-spinning-text-accent) 4%) 100%
      );
    --ui-spinning-text-color: #f8fbff;
    --ui-spinning-text-border-color: color-mix(in srgb, #9ec5ff 18%, transparent);
    --ui-spinning-text-center-bg: color-mix(in srgb, #ffffff 10%, transparent);
    --ui-spinning-text-center-border: 1px solid color-mix(in srgb, #ffffff 18%, transparent);
    --ui-spinning-text-center-shadow: 0 18px 34px rgba(2, 6, 23, 0.24);
    --ui-spinning-text-center-color: #f8fbff;
    --ui-spinning-text-shadow: 0 28px 56px rgba(2, 6, 23, 0.34);
    --ui-spinning-text-orbit-color: color-mix(in srgb, #ffffff 18%, transparent);
  }

  :host([variant="minimal"]) {
    --ui-spinning-text-bg: transparent;
    --ui-spinning-text-border: none;
    --ui-spinning-text-shadow: none;
    --ui-spinning-text-center-bg: transparent;
    --ui-spinning-text-center-border: 1px solid transparent;
    --ui-spinning-text-center-shadow: none;
  }

  :host([elevation="none"]) {
    --ui-spinning-text-shadow: none;
    --ui-spinning-text-center-shadow: none;
  }

  :host([elevation="high"]) {
    --ui-spinning-text-shadow:
      0 2px 8px rgba(15, 23, 42, 0.08),
      0 34px 64px rgba(15, 23, 42, 0.18);
    --ui-spinning-text-center-shadow:
      0 18px 34px rgba(15, 23, 42, 0.16),
      inset 0 1px 0 rgba(255, 255, 255, 0.42);
  }

  .root {
    display: block;
    min-inline-size: 0;
  }

  .surface {
    position: relative;
    display: grid;
    place-items: center;
    inline-size: fit-content;
    min-inline-size: 0;
    padding: var(--ui-spinning-text-padding);
    border-radius: var(--ui-spinning-text-surface-radius);
    border: var(--ui-spinning-text-border);
    background: var(--ui-spinning-text-bg);
    color: var(--ui-spinning-text-color);
    box-shadow: var(--ui-spinning-text-shadow);
    backdrop-filter: var(--ui-spinning-text-backdrop);
    transition:
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      backdrop-filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
    box-sizing: border-box;
    isolation: isolate;
  }

  .stage {
    position: relative;
    inline-size: var(--ui-spinning-text-stage-size);
    block-size: var(--ui-spinning-text-stage-size);
    min-inline-size: 0;
  }

  .ring {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    animation-name: ui-spinning-text-spin;
    animation-duration: var(--ui-spinning-text-duration);
    animation-timing-function: var(--ui-spinning-text-easing);
    animation-iteration-count: infinite;
    animation-play-state: running;
    will-change: transform;
    transform-origin: center;
  }

  .ring::before {
    content: "";
    position: absolute;
    inset: calc(50% - var(--ui-spinning-text-effective-radius));
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--ui-spinning-text-orbit-color) 70%, transparent);
    box-sizing: border-box;
    pointer-events: none;
  }

  .glyph {
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 1ch;
    transform:
      translate(-50%, -50%)
      rotate(calc(var(--ui-spinning-text-step, 12deg) * var(--ui-spinning-text-index, 0)))
      translateY(calc(var(--ui-spinning-text-effective-radius) * -1))
      rotate(calc(var(--ui-spinning-text-step, 12deg) * var(--ui-spinning-text-index, 0) * -1));
    transform-origin: center;
    white-space: pre;
    font-size: var(--ui-spinning-text-font-size);
    font-weight: var(--ui-spinning-text-font-weight);
    line-height: 1;
    letter-spacing: var(--ui-spinning-text-letter-spacing);
    text-transform: uppercase;
    color: inherit;
    user-select: none;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  .center-shell {
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    inline-size: var(--ui-spinning-text-center-size);
    block-size: var(--ui-spinning-text-center-size);
    transform: translate(-50%, -50%);
    border-radius: 999px;
    border: var(--ui-spinning-text-center-border);
    background: var(--ui-spinning-text-center-bg);
    color: var(--ui-spinning-text-center-color);
    box-shadow: var(--ui-spinning-text-center-shadow);
    display: grid;
    place-items: center;
    overflow: hidden;
    box-sizing: border-box;
    padding: 14px;
    text-align: center;
    z-index: 1;
  }

  .center-shell--empty {
    display: none;
  }

  slot[name="center"] {
    display: contents;
  }

  slot[name="center"]::slotted(*) {
    display: grid;
    place-items: center;
    inline-size: 100%;
    block-size: 100%;
    color: inherit;
    box-sizing: border-box;
  }

  :host(:focus-visible) .surface {
    outline: none;
    border-color: color-mix(in srgb, var(--ui-spinning-text-focus-ring) 24%, transparent);
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-spinning-text-focus-ring) 18%, transparent),
      var(--ui-spinning-text-shadow);
  }

  :host([paused]) .ring,
  :host([pause-on-hover]:hover) .ring,
  :host([pause-on-focus]:focus-within) .ring {
    animation-play-state: paused;
  }

  @keyframes ui-spinning-text-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(var(--ui-spinning-text-rotation)); }
  }

  @media (prefers-reduced-motion: reduce) {
    .ring {
      animation: none !important;
      transform: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .surface,
    .center-shell {
      box-shadow: none;
    }

    .surface {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-spinning-text-bg: Canvas;
      --ui-spinning-text-color: CanvasText;
      --ui-spinning-text-border-color: CanvasText;
      --ui-spinning-text-shadow: none;
      --ui-spinning-text-orbit-color: CanvasText;
      --ui-spinning-text-center-bg: Canvas;
      --ui-spinning-text-center-border: 1px solid CanvasText;
      --ui-spinning-text-center-shadow: none;
      --ui-spinning-text-center-color: CanvasText;
    }

    .surface,
    .center-shell,
    .ring::before {
      forced-color-adjust: none;
    }
  }
`;

function normalizeDirection(value: string | null): SpinningTextDirection {
  return value != null && DIRECTIONS.has(value as SpinningTextDirection) ? (value as SpinningTextDirection) : 'clockwise';
}

function normalizeVariant(value: string | null): SpinningTextVariant {
  return value != null && VARIANTS.has(value as SpinningTextVariant) ? (value as SpinningTextVariant) : 'default';
}

function normalizeTone(value: string | null): SpinningTextTone {
  return value != null && TONES.has(value as SpinningTextTone) ? (value as SpinningTextTone) : 'brand';
}

function normalizeSize(value: string | null): 'sm' | 'md' | 'lg' | 'xl' {
  if (value == null || !SIZES.has(value as SpinningTextSize)) return 'lg';
  if (value === '1') return 'sm';
  if (value === '2') return 'md';
  if (value === '3') return 'lg';
  if (value === '4') return 'xl';
  return value as 'sm' | 'md' | 'lg' | 'xl';
}

function normalizeElevation(value: string | null): SpinningTextElevation {
  return value != null && ELEVATIONS.has(value as SpinningTextElevation) ? (value as SpinningTextElevation) : 'low';
}

function normalizeLength(value: string | null): string | null {
  if (value == null || value.trim() === '') return null;
  const trimmed = value.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return parts.map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? `${part}px` : part)).join(' ');
}

function parsePositiveInteger(value: string | null, fallback: number, max = Number.POSITIVE_INFINITY): number {
  if (value == null || value.trim() === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function parsePositiveNumber(value: string | null, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const parsed = Number.parseFloat(value.replace(/rpm$/i, '').trim());
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toPx(value: string | null, contextPx: number, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number.parseFloat(trimmed);
  if (/^-?\d+(\.\d+)?px$/i.test(trimmed)) return Number.parseFloat(trimmed);
  if (/^-?\d+(\.\d+)?em$/i.test(trimmed)) return Number.parseFloat(trimmed) * contextPx;
  if (/^-?\d+(\.\d+)?rem$/i.test(trimmed)) return Number.parseFloat(trimmed) * 16;
  return fallback;
}

function resolveDuration(duration: string | null, speed: string | null): string {
  const normalizedDuration = normalizeTime(duration);
  if (normalizedDuration) return normalizedDuration;
  const rpm = parsePositiveNumber(speed, DEFAULT_SPEED_RPM);
  return `${Math.max(60 / rpm, 0.25)}s`;
}

function normalizeTime(value: string | null): string | null {
  if (value == null || value.trim() === '') return null;
  const trimmed = value.trim();
  if (/^-?\d+(\.\d+)?(ms|s)$/i.test(trimmed)) return trimmed;
  if (/^-?\d+(\.\d+)?$/i.test(trimmed)) return `${trimmed}s`;
  return null;
}

function resolveTextContent(host: HTMLElement): string {
  const explicit = host.getAttribute('text');
  if (explicit != null) return explicit;

  let text = '';
  for (const node of Array.from(host.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || '';
      continue;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) continue;
    const element = node as HTMLElement;
    if (element.getAttribute('slot') === 'center') continue;
    text += element.textContent || '';
  }
  return text;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function splitGraphemes(value: string): string[] {
  if (!value) return [];
  const IntlWithSegmenter = Intl as typeof Intl & {
    Segmenter?: {
      new (locales?: string | string[], options?: { granularity?: 'grapheme' | 'word' | 'sentence' }): {
        segment(input: string): Iterable<{ segment: string }>;
      };
    };
  };
  if (typeof Intl !== 'undefined' && IntlWithSegmenter.Segmenter) {
    const segmenter = new IntlWithSegmenter.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(segmenter.segment(value), (part) => part.segment);
  }
  return Array.from(value);
}

function buildVisualText(text: string, repeat: number, separator: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  if (repeat <= 1) return normalized;
  return Array.from({ length: repeat }, () => normalized).join(separator);
}

function estimateMinRadius(glyphCount: number, fontSizePx: number, letterSpacingPx: number): number {
  if (glyphCount <= 1) return Math.max(fontSizePx * 1.5, 20);
  const advance = Math.max((fontSizePx * 0.62) + Math.max(letterSpacingPx, 0), fontSizePx * 0.48);
  const circumference = glyphCount * advance;
  return Math.ceil((circumference / (2 * Math.PI)) + (fontSizePx * 0.6));
}

function setStyleToken(host: HTMLElement, name: string, value: string | null): void {
  if (value == null || value === '') host.style.removeProperty(name);
  else host.style.setProperty(name, value);
}

export class UISpinningText extends ElementBase {
  static get observedAttributes() {
    return [
      'text',
      'repeat',
      'separator',
      'speed',
      'duration',
      'direction',
      'variant',
      'tone',
      'size',
      'radius',
      'padding',
      'font-size',
      'font-weight',
      'letter-spacing',
      'color',
      'accent',
      'orbit-color',
      'easing',
      'elevation',
      'paused',
      'pause-on-hover',
      'pause-on-focus',
    ];
  }

  private _lightDomObserver: MutationObserver | null = null;
  private _mediaQuery: MediaQueryList | null = null;

  constructor() {
    super();
    this._onLightDomMutation = this._onLightDomMutation.bind(this);
    this._onReducedMotionChange = this._onReducedMotionChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'img');
    this._observeLightDom();
    this._bindReducedMotion();
    this._syncState();
  }

  override disconnectedCallback(): void {
    if (this._lightDomObserver) {
      this._lightDomObserver.disconnect();
      this._lightDomObserver = null;
    }

    if (this._mediaQuery) {
      try {
        this._mediaQuery.removeEventListener('change', this._onReducedMotionChange);
      } catch {
        this._mediaQuery.removeListener(this._onReducedMotionChange);
      }
      this._mediaQuery = null;
    }

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
    if (name === 'paused' && oldValue !== newValue) this._syncState();
  }

  protected render(): void {
    const size = normalizeSize(this.getAttribute('size'));
    const preset = SIZE_PRESETS[size];
    const baseText = resolveTextContent(this);
    const repeat = parsePositiveInteger(this.getAttribute('repeat'), DEFAULT_REPEAT, MAX_REPEAT);
    const separator = this.getAttribute('separator') ?? DEFAULT_SEPARATOR;
    const visualText = buildVisualText(baseText, repeat, separator);
    const glyphs = splitGraphemes(visualText);
    const hasCenter = Boolean(this.querySelector('[slot="center"]'));
    const fontSizeRaw = normalizeLength(this.getAttribute('font-size'));
    const letterSpacingRaw = normalizeLength(this.getAttribute('letter-spacing'));
    const paddingRaw = normalizeLength(this.getAttribute('padding'));
    const radiusRaw = normalizeLength(this.getAttribute('radius'));
    const fontSizePx = toPx(fontSizeRaw, preset.fontSizePx, preset.fontSizePx);
    const letterSpacingPx = toPx(letterSpacingRaw, fontSizePx, preset.letterSpacingPx);
    const minRadius = glyphs.length ? estimateMinRadius(glyphs.length, fontSizePx, letterSpacingPx) : 0;
    const duration = resolveDuration(this.getAttribute('duration'), this.getAttribute('speed'));
    const direction = normalizeDirection(this.getAttribute('direction'));
    const variant = normalizeVariant(this.getAttribute('variant'));
    const tone = normalizeTone(this.getAttribute('tone'));
    const elevation = normalizeElevation(this.getAttribute('elevation'));
    const easing = this.getAttribute('easing')?.trim() || DEFAULT_EASING;
    const glyphMarkup = glyphs.length
      ? glyphs
          .map((glyph, index) => {
            const safeGlyph = glyph === ' ' ? '&nbsp;' : escapeHtml(glyph);
            return `
              <span
                class="glyph"
                part="glyph"
                aria-hidden="true"
                data-index="${index}"
                style="--ui-spinning-text-index:${index};"
              >${safeGlyph}</span>
            `;
          })
          .join('')
      : '';

    setStyleToken(this, '--ui-spinning-text-duration', duration);
    setStyleToken(this, '--ui-spinning-text-easing', easing);
    setStyleToken(this, '--ui-spinning-text-font-size', fontSizeRaw);
    setStyleToken(this, '--ui-spinning-text-letter-spacing', letterSpacingRaw);
    setStyleToken(this, '--ui-spinning-text-padding', paddingRaw);
    setStyleToken(this, '--ui-spinning-text-radius', radiusRaw);
    setStyleToken(this, '--ui-spinning-text-color', this.getAttribute('color'));
    setStyleToken(this, '--ui-spinning-text-accent', this.getAttribute('accent'));
    setStyleToken(this, '--ui-spinning-text-orbit-color', this.getAttribute('orbit-color'));
    setStyleToken(this, '--ui-spinning-text-font-weight', this.getAttribute('font-weight'));
    setStyleToken(this, '--ui-spinning-text-min-radius', `${minRadius}px`);
    setStyleToken(this, '--ui-spinning-text-step', glyphs.length ? `${360 / glyphs.length}deg` : null);

    if (baseText.trim()) this.setAttribute('aria-label', baseText.replace(/\s+/g, ' ').trim());
    else this.removeAttribute('aria-label');

    this.setAttribute('data-direction', direction);
    this.setAttribute('data-variant', variant);
    this.setAttribute('data-tone', tone);
    this.setAttribute('data-elevation', elevation);

    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="surface" part="surface">
          <div class="stage" part="stage">
            <div
              class="ring"
              part="ring"
              aria-hidden="true"
              data-glyph-count="${glyphs.length}"
            >${glyphMarkup}</div>
            <div class="center-shell${hasCenter ? '' : ' center-shell--empty'}" part="center">
              <slot name="center"></slot>
            </div>
          </div>
        </div>
      </div>
    `);

    this._syncState();
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

  private _onReducedMotionChange(): void {
    this._syncState();
  }

  private _syncState(): void {
    const baseText = resolveTextContent(this).replace(/\s+/g, ' ').trim();
    if (!baseText) {
      this.setAttribute('data-state', 'idle');
      return;
    }

    const reducedMotion = Boolean(this._mediaQuery?.matches);
    this.setAttribute('data-motion', reducedMotion ? 'reduced' : 'auto');
    this.setAttribute('data-state', reducedMotion || this.hasAttribute('paused') ? 'paused' : 'running');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-spinning-text': UISpinningText;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-spinning-text')) {
  customElements.define('ui-spinning-text', UISpinningText);
}
