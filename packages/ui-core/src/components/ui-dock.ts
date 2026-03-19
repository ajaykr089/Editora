import { ElementBase } from '../ElementBase';

type DockOrientation = 'horizontal' | 'vertical';
type DockVariant = 'surface' | 'soft' | 'solid' | 'glass' | 'contrast' | 'minimal';
type DockTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type DockSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '0' | '1' | '2' | '3' | '4';
type DockElevation = 'none' | 'low' | 'high';
type DockLabelMode = 'hover' | 'always' | 'none';
type DockLabelPlacement = 'auto' | 'top' | 'bottom' | 'start' | 'end';
type DockAnimation = 'calm' | 'smooth' | 'snappy' | 'bouncy';
type DockFocusTarget = number | string;

type DockItemRecord = {
  el: HTMLElement;
  iconEl: HTMLElement | null;
  labelEl: HTMLElement | null;
  badgeEl: HTMLElement | null;
  center: number;
  currentScale: number;
  targetScale: number;
  currentLift: number;
  targetLift: number;
  labelVisible: boolean;
  disabled: boolean;
  sticky: boolean;
  scaleVelocity: number;
  liftVelocity: number;
};

type DockSizePreset = {
  gap: string;
  padding: string;
  itemSize: number;
  iconSize: number;
  itemRadius: number;
};

type DockMotionPreset = {
  response: number;
  damping: number;
  spread: number;
  lift: number;
};

const DEFAULT_MAGNIFICATION = 1.92;
const DEFAULT_DISTANCE = 148;
const DEFAULT_IDLE_SCALE = 1;
const DEFAULT_LIFT = 20;
const DEFAULT_SMOOTHING = 0.18;
const DEFAULT_GAP = '12px';
const DEFAULT_PADDING = '12px 14px';
const DEFAULT_ITEM_SIZE = '56px';
const DEFAULT_ITEM_SIZE_PX = 56;

const SIZE_PRESETS: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', DockSizePreset> = {
  xs: {
    gap: '8px',
    padding: '8px 10px',
    itemSize: 40,
    iconSize: 18,
    itemRadius: 14,
  },
  sm: {
    gap: '10px',
    padding: '10px 12px',
    itemSize: 48,
    iconSize: 20,
    itemRadius: 16,
  },
  md: {
    gap: DEFAULT_GAP,
    padding: DEFAULT_PADDING,
    itemSize: 56,
    iconSize: 24,
    itemRadius: 18,
  },
  lg: {
    gap: '14px',
    padding: '14px 16px',
    itemSize: 64,
    iconSize: 28,
    itemRadius: 20,
  },
  xl: {
    gap: '18px',
    padding: '16px 20px',
    itemSize: 74,
    iconSize: 32,
    itemRadius: 24,
  },
};

const MOTION_PRESETS: Record<DockAnimation, DockMotionPreset> = {
  calm: {
    response: 0.11,
    damping: 0.82,
    spread: 0.62,
    lift: 0.82,
  },
  smooth: {
    response: 0.16,
    damping: 0.78,
    spread: 0.82,
    lift: 1,
  },
  snappy: {
    response: 0.22,
    damping: 0.74,
    spread: 0.92,
    lift: 1.06,
  },
  bouncy: {
    response: 0.24,
    damping: 0.66,
    spread: 1,
    lift: 1.12,
  },
};

const VISUAL_ATTRIBUTES = new Set([
  'gap',
  'padding',
  'radius',
  'item-size',
  'variant',
  'tone',
  'size',
  'elevation',
]);

const GEOMETRY_ATTRIBUTES = new Set([
  'orientation',
  'magnification',
  'distance',
  'idle-scale',
  'lift',
  'smoothing',
  'animation',
  'gap',
  'padding',
  'item-size',
]);

const LABEL_ATTRIBUTES = new Set(['label-mode', 'label-placement']);
const SEMANTIC_RADIUS_VALUES = new Set(['none', 'sm', 'md', 'lg', 'full']);

const style = `
  :host {
    --ui-dock-gap: ${DEFAULT_GAP};
    --ui-dock-padding: ${DEFAULT_PADDING};
    --ui-dock-radius: 24px;
    --ui-dock-item-size: ${DEFAULT_ITEM_SIZE};
    --ui-dock-icon-size: 24px;
    --ui-dock-item-radius: 18px;
    --ui-dock-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-dock-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-panel-solid, var(--ui-color-surface, #ffffff)) 90%, #ffffff 10%),
        color-mix(in srgb, var(--color-panel-solid, var(--ui-color-surface, #ffffff)) 96%, transparent)
      );
    --ui-dock-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-dock-border-color: color-mix(in srgb, #ffffff 24%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-dock-border: 1px solid var(--ui-dock-border-color);
    --ui-dock-shadow:
      0 1px 3px rgba(15, 23, 42, 0.08),
      0 24px 44px rgba(15, 23, 42, 0.14);
    --ui-dock-backdrop: blur(16px) saturate(1.08);
    --ui-dock-item-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #ffffff 86%, transparent),
        color-mix(in srgb, var(--ui-dock-accent) 10%, rgba(255, 255, 255, 0.72))
      );
    --ui-dock-item-border: color-mix(in srgb, var(--ui-dock-accent) 16%, rgba(255, 255, 255, 0.72));
    --ui-dock-item-shadow:
      0 1px 2px rgba(15, 23, 42, 0.08),
      0 10px 18px rgba(15, 23, 42, 0.12);
    --ui-dock-item-backdrop: blur(10px) saturate(1.02);
    --ui-dock-label-bg: rgba(15, 23, 42, 0.92);
    --ui-dock-label-color: #f8fafc;
    --ui-dock-label-border: rgba(255, 255, 255, 0.14);
    --ui-dock-label-shadow: 0 14px 28px rgba(2, 6, 23, 0.28);
    --ui-dock-label-padding: 6px 10px;
    --ui-dock-label-font-size: 12px;
    --ui-dock-label-font-weight: 600;
    --ui-dock-label-radius: 999px;
    --ui-dock-label-offset: 12px;
    --ui-dock-label-backdrop: blur(10px) saturate(1.04);
    --ui-dock-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));
    display: inline-block;
    min-inline-size: 0;
    color: var(--ui-dock-color);
    color-scheme: light dark;
    font-family: "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    box-sizing: border-box;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-dock-gap: 10px;
    --ui-dock-padding: 10px 12px;
    --ui-dock-item-size: 48px;
    --ui-dock-icon-size: 20px;
    --ui-dock-item-radius: 16px;
    --ui-dock-label-padding: 5px 9px;
    --ui-dock-label-font-size: 11px;
    --ui-dock-label-offset: 10px;
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-dock-gap: ${DEFAULT_GAP};
    --ui-dock-padding: ${DEFAULT_PADDING};
    --ui-dock-item-size: ${DEFAULT_ITEM_SIZE};
    --ui-dock-icon-size: 24px;
    --ui-dock-item-radius: 18px;
    --ui-dock-label-padding: 6px 10px;
    --ui-dock-label-font-size: 12px;
    --ui-dock-label-offset: 12px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-dock-gap: 14px;
    --ui-dock-padding: 14px 16px;
    --ui-dock-item-size: 64px;
    --ui-dock-icon-size: 28px;
    --ui-dock-item-radius: 20px;
    --ui-dock-label-padding: 7px 12px;
    --ui-dock-label-font-size: 13px;
    --ui-dock-label-offset: 14px;
  }

  :host([size="xs"]),
  :host([size="0"]) {
    --ui-dock-gap: 8px;
    --ui-dock-padding: 8px 10px;
    --ui-dock-item-size: 40px;
    --ui-dock-icon-size: 18px;
    --ui-dock-item-radius: 14px;
    --ui-dock-label-padding: 4px 8px;
    --ui-dock-label-font-size: 10px;
    --ui-dock-label-offset: 8px;
  }

  :host([size="xl"]),
  :host([size="4"]) {
    --ui-dock-gap: 18px;
    --ui-dock-padding: 16px 20px;
    --ui-dock-item-size: 74px;
    --ui-dock-icon-size: 32px;
    --ui-dock-item-radius: 24px;
    --ui-dock-label-padding: 8px 14px;
    --ui-dock-label-font-size: 14px;
    --ui-dock-label-font-weight: 650;
    --ui-dock-label-offset: 16px;
  }

  :host([tone="brand"]) {
    --ui-dock-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
  }

  :host([tone="neutral"]) {
    --ui-dock-accent: #64748b;
  }

  :host([tone="info"]) {
    --ui-dock-accent: #0ea5e9;
  }

  :host([tone="success"]) {
    --ui-dock-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-dock-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-dock-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="soft"]) {
    --ui-dock-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-dock-accent) 8%, var(--color-panel-solid, var(--ui-color-surface, #ffffff))),
        color-mix(in srgb, var(--ui-dock-accent) 4%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)))
      );
    --ui-dock-border-color:
      color-mix(in srgb, var(--ui-dock-accent) 18%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-dock-shadow: none;
    --ui-dock-label-bg:
      color-mix(in srgb, var(--ui-dock-accent) 12%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-dock-label-color: var(--ui-dock-color);
    --ui-dock-label-border:
      color-mix(in srgb, var(--ui-dock-accent) 24%, var(--ui-color-border, rgba(15, 23, 42, 0.14)));
    --ui-dock-label-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);
  }

  :host([variant="solid"]) {
    --ui-dock-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-dock-accent) 16%, var(--color-panel-solid, var(--ui-color-surface, #ffffff))),
        color-mix(in srgb, var(--ui-dock-accent) 10%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)))
      );
    --ui-dock-border-color:
      color-mix(in srgb, var(--ui-dock-accent) 24%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-dock-item-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #ffffff 84%, transparent),
        color-mix(in srgb, var(--ui-dock-accent) 16%, rgba(255, 255, 255, 0.7))
      );
    --ui-dock-label-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-dock-accent) 24%, var(--color-panel-solid, var(--ui-color-surface, #ffffff))),
        color-mix(in srgb, var(--ui-dock-accent) 16%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)))
      );
    --ui-dock-label-color: var(--ui-dock-color);
    --ui-dock-label-border:
      color-mix(in srgb, var(--ui-dock-accent) 32%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
  }

  :host([variant="glass"]) {
    --ui-dock-label-bg: rgba(255, 255, 255, 0.74);
    --ui-dock-label-color: var(--ui-dock-color);
    --ui-dock-label-border: color-mix(in srgb, #ffffff 52%, var(--ui-dock-accent) 18%);
    --ui-dock-label-shadow:
      0 16px 30px rgba(15, 23, 42, 0.12);
    --ui-dock-label-backdrop: blur(14px) saturate(1.08);
  }

  :host([variant="contrast"]) {
    --ui-dock-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #04111f 88%, var(--ui-dock-accent) 12%),
        color-mix(in srgb, #0b2342 82%, var(--ui-dock-accent) 18%)
      );
    --ui-dock-color: #f8fbff;
    --ui-dock-border-color: color-mix(in srgb, #ffffff 18%, transparent);
    --ui-dock-shadow: 0 28px 56px rgba(2, 6, 23, 0.32);
    --ui-dock-item-bg: color-mix(in srgb, #ffffff 10%, transparent);
    --ui-dock-item-border: color-mix(in srgb, #ffffff 18%, transparent);
    --ui-dock-label-bg: rgba(2, 6, 23, 0.94);
    --ui-dock-label-border: rgba(255, 255, 255, 0.16);
  }

  :host([variant="minimal"]) {
    --ui-dock-bg: transparent;
    --ui-dock-border: none;
    --ui-dock-shadow: none;
    --ui-dock-backdrop: none;
    --ui-dock-label-bg: color-mix(in srgb, var(--ui-dock-accent) 10%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-dock-label-color: var(--ui-dock-color);
    --ui-dock-label-border:
      color-mix(in srgb, var(--ui-dock-accent) 18%, var(--ui-color-border, rgba(15, 23, 42, 0.14)));
    --ui-dock-label-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
  }

  :host([radius="none"]) {
    --ui-dock-radius: 0px;
    --ui-dock-item-radius: 0px;
  }

  :host([radius="sm"]) {
    --ui-dock-radius: 14px;
    --ui-dock-item-radius: 14px;
  }

  :host([radius="md"]) {
    --ui-dock-radius: 22px;
    --ui-dock-item-radius: 18px;
  }

  :host([radius="lg"]) {
    --ui-dock-radius: 30px;
    --ui-dock-item-radius: 22px;
  }

  :host([radius="full"]) {
    --ui-dock-radius: 999px;
    --ui-dock-item-radius: 999px;
  }

  :host([elevation="none"]) {
    --ui-dock-shadow: none;
  }

  :host([elevation="high"]) {
    --ui-dock-shadow:
      0 2px 10px rgba(15, 23, 42, 0.1),
      0 30px 62px rgba(15, 23, 42, 0.2);
  }

  .root {
    display: inline-block;
    min-inline-size: 0;
  }

  .frame {
    position: relative;
    display: inline-flex;
    align-items: flex-end;
    justify-content: center;
    gap: var(--ui-dock-gap);
    min-inline-size: 0;
    padding: var(--ui-dock-padding);
    border-radius: var(--ui-dock-radius);
    border: var(--ui-dock-border);
    background: var(--ui-dock-bg);
    color: var(--ui-dock-color);
    box-shadow: var(--ui-dock-shadow);
    backdrop-filter: var(--ui-dock-backdrop);
    box-sizing: border-box;
    overflow: visible;
    isolation: isolate;
  }

  :host([orientation="vertical"]) .frame {
    align-items: center;
  }

  .items {
    display: inline-flex;
    align-items: flex-end;
    justify-content: center;
    gap: var(--ui-dock-gap);
    min-inline-size: 0;
    overflow: visible;
  }

  :host([orientation="vertical"]) .items {
    flex-direction: column;
    align-items: center;
  }

  slot {
    display: contents;
  }

  ::slotted([data-ui-dock-item]) {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--ui-dock-item-size);
    block-size: var(--ui-dock-item-size);
    min-inline-size: var(--ui-dock-item-size);
    min-block-size: var(--ui-dock-item-size);
    flex: 0 0 var(--ui-dock-item-size);
    box-sizing: border-box;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    color: inherit;
    text-decoration: none;
    transform-origin: center bottom;
    will-change: transform;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  :host([orientation="vertical"]) ::slotted([data-ui-dock-item]) {
    transform-origin: center center;
  }

  ::slotted([data-ui-dock-item][disabled]),
  ::slotted([data-ui-dock-item][aria-disabled="true"]) {
    cursor: not-allowed;
    opacity: 0.56;
  }

  @media (prefers-reduced-motion: reduce) {
    .frame {
      scroll-behavior: auto;
    }
  }
`;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function parseFiniteNumber(value: string | null, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parsePositiveNumber(value: string | null, fallback: number): number {
  return Math.max(0, parseFiniteNumber(value, fallback));
}

function parseUnitInterval(value: string | null, fallback: number): number {
  return clamp(parseFiniteNumber(value, fallback), 0.01, 1);
}

function normalizeLength(value: string | null): string | null {
  if (value == null || value.trim() === '') return null;
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return parts
    .map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? `${part}px` : part))
    .join(' ');
}

function requestFrame(callback: FrameRequestCallback): number {
  if (typeof requestAnimationFrame === 'function') return requestAnimationFrame(callback);
  return window.setTimeout(() => callback(Date.now()), 16) as unknown as number;
}

function cancelFrameRequest(id: number | null): void {
  if (id == null) return;
  if (typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(id);
    return;
  }
  window.clearTimeout(id);
}

function isDockItem(element: Element): element is HTMLElement {
  return element instanceof HTMLElement;
}

function isDisabledItem(element: HTMLElement): boolean {
  return element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true';
}

function isStickyItem(element: HTMLElement): boolean {
  return (
    element.hasAttribute('data-active') ||
    element.getAttribute('aria-current') === 'page' ||
    element.getAttribute('aria-current') === 'true'
  );
}

function resolveLabelPlacement(value: string | null, orientation: DockOrientation): Exclude<DockLabelPlacement, 'auto'> {
  if (value === 'top' || value === 'bottom' || value === 'start' || value === 'end') return value;
  return orientation === 'horizontal' ? 'top' : 'end';
}

function findNearestEnabledIndex(items: DockItemRecord[], start: number, step: number): number {
  if (!items.length) return -1;
  let index = start;
  for (let count = 0; count < items.length; count += 1) {
    index = (index + step + items.length) % items.length;
    if (!items[index]?.disabled) return index;
  }
  return -1;
}

export class UIDock extends ElementBase {
  static get observedAttributes() {
    return [
      'orientation',
      'magnification',
      'distance',
      'idle-scale',
      'lift',
      'smoothing',
      'animation',
      'gap',
      'padding',
      'item-size',
      'label-mode',
      'label-placement',
      'variant',
      'tone',
      'size',
      'radius',
      'elevation',
    ];
  }

  private _frameEl: HTMLElement | null = null;
  private _slotEl: HTMLSlotElement | null = null;
  private _items: DockItemRecord[] = [];
  private _resizeObserver: ResizeObserver | null = null;
  private _mutationObserver: MutationObserver | null = null;
  private _mediaQuery: MediaQueryList | null = null;
  private _raf: number | null = null;
  private _pointerActive = false;
  private _pointerCoord = Number.NaN;
  private _focusedIndex = -1;
  private _rovingIndex = 0;
  private _reducedMotion = false;

  constructor() {
    super();
    this._handleSlotChange = this._handleSlotChange.bind(this);
    this._handlePointerMove = this._handlePointerMove.bind(this);
    this._handlePointerLeave = this._handlePointerLeave.bind(this);
    this._handleFocusIn = this._handleFocusIn.bind(this);
    this._handleFocusOut = this._handleFocusOut.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this._handleLightDomMutation = this._handleLightDomMutation.bind(this);
    this._handleReducedMotionChange = this._handleReducedMotionChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'toolbar');
    this._observeLightDom();
    this._bindReducedMotion();
    this._syncHostStyles();
    queueMicrotask(() => this.refresh());
  }

  override disconnectedCallback(): void {
    if (this._slotEl) {
      this._slotEl.removeEventListener('slotchange', this._handleSlotChange as EventListener);
      this._slotEl = null;
    }

    if (this._frameEl) {
      this._frameEl.removeEventListener('pointermove', this._handlePointerMove as EventListener);
      this._frameEl.removeEventListener('pointerleave', this._handlePointerLeave as EventListener);
      this._frameEl = null;
    }

    this.removeEventListener('focusin', this._handleFocusIn as EventListener);
    this.removeEventListener('focusout', this._handleFocusOut as EventListener);
    this.removeEventListener('keydown', this._handleKeyDown as EventListener);

    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._mutationObserver?.disconnect();
    this._mutationObserver = null;

    if (this._mediaQuery) {
      try {
        this._mediaQuery.removeEventListener('change', this._handleReducedMotionChange);
      } catch {
        this._mediaQuery.removeListener(this._handleReducedMotionChange);
      }
      this._mediaQuery = null;
    }

    cancelFrameRequest(this._raf);
    this._raf = null;
    super.disconnectedCallback();
  }

  refresh(): void {
    this._collectItems();
    this._syncHostStyles();
    this._measureItems();
    this._syncTabIndices();
    this._updateTargets();
    this._queueAnimation();
  }

  focusItem(target: DockFocusTarget): void {
    const index = typeof target === 'number'
      ? target
      : this._items.findIndex((item) => item.el.getAttribute('data-value') === String(target));

    if (index < 0 || index >= this._items.length || this._items[index]?.disabled) return;
    this._focusedIndex = index;
    this._rovingIndex = index;
    this._syncTabIndices();
    this._items[index]?.el.focus();
    this._pointerActive = false;
    this._pointerCoord = Number.NaN;
    this._updateTargets();
    this._queueAnimation();
  }

  clearActive(): void {
    this._pointerActive = false;
    this._pointerCoord = Number.NaN;
    this._focusedIndex = -1;
    this._updateTargets();
    this._queueAnimation();
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    if (!name || oldValue === newValue || !this.isConnected) return;

    if (VISUAL_ATTRIBUTES.has(name)) {
      this._syncHostStyles();
    }

    if (LABEL_ATTRIBUTES.has(name)) {
      this._syncItemChrome();
    }

    if (GEOMETRY_ATTRIBUTES.has(name) || LABEL_ATTRIBUTES.has(name) || VISUAL_ATTRIBUTES.has(name)) {
      this.refresh();
    }
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="frame" part="frame">
          <div class="items" part="items">
            <slot></slot>
          </div>
        </div>
      </div>
    `);

    this._bindElements();
    this._syncHostStyles();
    this.refresh();
  }

  private _bindElements(): void {
    const nextFrame = this.root.querySelector('.frame') as HTMLElement | null;
    if (nextFrame && nextFrame !== this._frameEl) {
      if (this._frameEl) {
        this._frameEl.removeEventListener('pointermove', this._handlePointerMove as EventListener);
        this._frameEl.removeEventListener('pointerleave', this._handlePointerLeave as EventListener);
      }
      nextFrame.addEventListener('pointermove', this._handlePointerMove as EventListener);
      nextFrame.addEventListener('pointerleave', this._handlePointerLeave as EventListener);
      this._frameEl = nextFrame;
    }

    const nextSlot = this.root.querySelector('slot') as HTMLSlotElement | null;
    if (nextSlot && nextSlot !== this._slotEl) {
      if (this._slotEl) this._slotEl.removeEventListener('slotchange', this._handleSlotChange as EventListener);
      nextSlot.addEventListener('slotchange', this._handleSlotChange as EventListener);
      this._slotEl = nextSlot;
    }

    this.removeEventListener('focusin', this._handleFocusIn as EventListener);
    this.removeEventListener('focusout', this._handleFocusOut as EventListener);
    this.removeEventListener('keydown', this._handleKeyDown as EventListener);
    this.addEventListener('focusin', this._handleFocusIn as EventListener);
    this.addEventListener('focusout', this._handleFocusOut as EventListener);
    this.addEventListener('keydown', this._handleKeyDown as EventListener);
    this._ensureResizeObserver();
  }

  private _observeLightDom(): void {
    if (this._mutationObserver || typeof MutationObserver === 'undefined') return;
    this._mutationObserver = new MutationObserver(this._handleLightDomMutation);
    this._mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  private _ensureResizeObserver(): void {
    if (this._resizeObserver || typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver(this._handleResize);
    this._resizeObserver.observe(this);
  }

  private _bindReducedMotion(): void {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    this._reducedMotion = media.matches;
    this._mediaQuery = media;
    try {
      media.addEventListener('change', this._handleReducedMotionChange);
    } catch {
      media.addListener(this._handleReducedMotionChange);
    }
  }

  private _handleReducedMotionChange(event: MediaQueryListEvent | MediaQueryList): void {
    this._reducedMotion = event.matches;
    this.refresh();
  }

  private _handleSlotChange(): void {
    this.refresh();
  }

  private _handleLightDomMutation(): void {
    this.refresh();
  }

  private _handleResize(): void {
    this._measureItems();
    this._updateTargets();
    this._queueAnimation();
  }

  private _handlePointerMove(event: PointerEvent | MouseEvent): void {
    if ('pointerType' in event && event.pointerType === 'touch') return;
    if (!this._frameEl) return;

    const rect = this._frameEl.getBoundingClientRect();
    const orientation = this._orientation();
    const coord = orientation === 'horizontal' ? event.clientX - rect.left : event.clientY - rect.top;

    this._pointerActive = true;
    this._pointerCoord = coord;
    this._measureItems();
    this._updateTargets();
    this._queueAnimation();
  }

  private _handlePointerLeave(): void {
    this._pointerActive = false;
    this._pointerCoord = Number.NaN;
    this._updateTargets();
    this._queueAnimation();
  }

  private _handleFocusIn(event: FocusEvent): void {
    const target = (event.target as Element | null)?.closest?.('[data-ui-dock-item]') as HTMLElement | null;
    if (!target) return;
    const index = this._items.findIndex((item) => item.el === target);
    if (index < 0) return;
    this._focusedIndex = index;
    this._rovingIndex = index;
    this._syncTabIndices();
    this._pointerActive = false;
    this._pointerCoord = Number.NaN;
    this._updateTargets();
    this._queueAnimation();
  }

  private _handleFocusOut(event: FocusEvent): void {
    const related = event.relatedTarget as Node | null;
    if (related && this.contains(related)) return;
    this._focusedIndex = -1;
    if (!this._pointerActive) {
      this._updateTargets();
      this._queueAnimation();
    }
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented || !this._items.length) return;

    const orientation = this._orientation();
    const previousKeys = orientation === 'horizontal' ? ['ArrowLeft'] : ['ArrowUp'];
    const nextKeys = orientation === 'horizontal' ? ['ArrowRight'] : ['ArrowDown'];

    if (previousKeys.includes(event.key)) {
      event.preventDefault();
      const nextIndex = findNearestEnabledIndex(this._items, this._rovingIndex, -1);
      if (nextIndex >= 0) this.focusItem(nextIndex);
      return;
    }

    if (nextKeys.includes(event.key)) {
      event.preventDefault();
      const nextIndex = findNearestEnabledIndex(this._items, this._rovingIndex, 1);
      if (nextIndex >= 0) this.focusItem(nextIndex);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      const nextIndex = this._items.findIndex((item) => !item.disabled);
      if (nextIndex >= 0) this.focusItem(nextIndex);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      for (let index = this._items.length - 1; index >= 0; index -= 1) {
        if (!this._items[index]?.disabled) {
          this.focusItem(index);
          break;
        }
      }
      return;
    }

    if (event.key === 'Escape') {
      this.clearActive();
    }
  }

  private _collectItems(): void {
    const previous = new Map(this._items.map((item) => [item.el, item]));
    const nextItems = Array.from(this.children)
      .filter(isDockItem)
      .map((el): DockItemRecord => {
        const previousItem = previous.get(el);
        const iconEl = el.querySelector('[data-ui-dock-icon]') as HTMLElement | null;
        const labelEl = el.querySelector('[data-ui-dock-label]') as HTMLElement | null;
        const badgeEl = el.querySelector('[data-ui-dock-badge]') as HTMLElement | null;
        return {
          el,
          iconEl,
          labelEl,
          badgeEl,
          center: previousItem?.center ?? 0,
          currentScale: previousItem?.currentScale ?? this._idleScale(),
          targetScale: previousItem?.targetScale ?? this._idleScale(),
          currentLift: previousItem?.currentLift ?? 0,
          targetLift: previousItem?.targetLift ?? 0,
          labelVisible: previousItem?.labelVisible ?? false,
          disabled: isDisabledItem(el),
          sticky: isStickyItem(el),
          scaleVelocity: previousItem?.scaleVelocity ?? 0,
          liftVelocity: previousItem?.liftVelocity ?? 0,
        };
      });

    this._items = nextItems;

    const preferredIndex = this._items.findIndex((item) => item.sticky && !item.disabled);
    if (preferredIndex >= 0) {
      this._rovingIndex = preferredIndex;
    } else if (!this._items[this._rovingIndex] || this._items[this._rovingIndex]?.disabled) {
      this._rovingIndex = this._items.findIndex((item) => !item.disabled);
    }

    if (this._rovingIndex < 0) this._rovingIndex = 0;
    if (this._focusedIndex >= this._items.length || this._items[this._focusedIndex]?.disabled) this._focusedIndex = -1;

    this._syncItemChrome();
  }

  private _syncItemChrome(): void {
    const placement = resolveLabelPlacement(this.getAttribute('label-placement'), this._orientation());
    const labelMode = this._labelMode();
    const orientation = this._orientation();

    this._items.forEach((item) => {
      const { el, iconEl, labelEl, badgeEl, sticky } = item;

      el.setAttribute('data-ui-dock-item', '');
      el.style.setProperty('position', 'relative');
      el.style.setProperty('display', 'inline-flex');
      el.style.setProperty('align-items', 'center');
      el.style.setProperty('justify-content', 'center');
      el.style.setProperty('inline-size', 'var(--ui-dock-item-size)');
      el.style.setProperty('block-size', 'var(--ui-dock-item-size)');
      el.style.setProperty('min-inline-size', 'var(--ui-dock-item-size)');
      el.style.setProperty('min-block-size', 'var(--ui-dock-item-size)');
      el.style.setProperty('flex', '0 0 var(--ui-dock-item-size)');
      el.style.setProperty('box-sizing', 'border-box');
      el.style.setProperty('background', 'transparent');
      el.style.setProperty('border', 'none');
      el.style.setProperty('padding', '0');
      el.style.setProperty('margin', '0');
      el.style.setProperty('color', 'inherit');
      el.style.setProperty('text-decoration', 'none');
      el.style.setProperty('outline', 'none');
      el.style.setProperty('cursor', item.disabled ? 'not-allowed' : 'pointer');
      el.style.setProperty('transform-origin', orientation === 'horizontal' ? 'center bottom' : 'center center');
      el.style.setProperty('touch-action', 'manipulation');

      if (!el.hasAttribute('tabindex')) el.tabIndex = -1;
      if (!el.hasAttribute('aria-label')) {
        const labelText =
          labelEl?.textContent?.trim() ||
          el.getAttribute('data-label') ||
          el.getAttribute('title') ||
          undefined;
        if (labelText) el.setAttribute('aria-label', labelText);
      }

      if (sticky) {
        el.setAttribute('data-dock-current', 'true');
      } else {
        el.removeAttribute('data-dock-current');
      }

      if (iconEl) {
        iconEl.style.setProperty('display', 'inline-flex');
        iconEl.style.setProperty('align-items', 'center');
        iconEl.style.setProperty('justify-content', 'center');
        iconEl.style.setProperty('inline-size', '100%');
        iconEl.style.setProperty('block-size', '100%');
        iconEl.style.setProperty('border-radius', 'var(--ui-dock-item-radius)');
        iconEl.style.setProperty('background', 'var(--ui-dock-item-bg)');
        iconEl.style.setProperty('border', '1px solid var(--ui-dock-item-border)');
        iconEl.style.setProperty('box-shadow', 'var(--ui-dock-item-shadow)');
        iconEl.style.setProperty('backdrop-filter', 'var(--ui-dock-item-backdrop)');
        iconEl.style.setProperty('font-size', 'var(--ui-dock-icon-size)');
        iconEl.style.setProperty('color', 'inherit');
        iconEl.style.setProperty('overflow', 'hidden');
        iconEl.style.setProperty('box-sizing', 'border-box');
      }

      if (labelEl) {
        labelEl.setAttribute('aria-hidden', 'true');
        labelEl.style.setProperty('position', 'absolute');
        labelEl.style.setProperty('pointer-events', 'none');
        labelEl.style.setProperty('white-space', 'nowrap');
        labelEl.style.setProperty('padding', 'var(--ui-dock-label-padding)');
        labelEl.style.setProperty('border-radius', 'var(--ui-dock-label-radius)');
        labelEl.style.setProperty('background', 'var(--ui-dock-label-bg)');
        labelEl.style.setProperty('color', 'var(--ui-dock-label-color)');
        labelEl.style.setProperty('border', '1px solid var(--ui-dock-label-border)');
        labelEl.style.setProperty('box-shadow', 'var(--ui-dock-label-shadow)');
        labelEl.style.setProperty('backdrop-filter', 'var(--ui-dock-label-backdrop)');
        labelEl.style.setProperty('font-size', 'var(--ui-dock-label-font-size)');
        labelEl.style.setProperty('font-weight', 'var(--ui-dock-label-font-weight)');
        labelEl.style.setProperty('line-height', '1.2');
        labelEl.style.setProperty('letter-spacing', '0.01em');
        labelEl.style.setProperty('min-inline-size', 'max-content');
        labelEl.style.setProperty('z-index', '3');
        labelEl.style.setProperty('display', labelMode === 'none' ? 'none' : 'inline-flex');

        labelEl.style.removeProperty('top');
        labelEl.style.removeProperty('bottom');
        labelEl.style.removeProperty('left');
        labelEl.style.removeProperty('right');

        if (placement === 'top') {
          labelEl.style.setProperty('left', '50%');
          labelEl.style.setProperty('bottom', 'calc(100% + var(--ui-dock-label-offset))');
        } else if (placement === 'bottom') {
          labelEl.style.setProperty('left', '50%');
          labelEl.style.setProperty('top', 'calc(100% + var(--ui-dock-label-offset))');
        } else if (placement === 'start') {
          labelEl.style.setProperty('right', 'calc(100% + var(--ui-dock-label-offset))');
          labelEl.style.setProperty('top', '50%');
        } else {
          labelEl.style.setProperty('left', 'calc(100% + var(--ui-dock-label-offset))');
          labelEl.style.setProperty('top', '50%');
        }
      }

      if (badgeEl) {
        badgeEl.setAttribute('aria-hidden', 'true');
        badgeEl.style.setProperty('position', 'absolute');
        badgeEl.style.setProperty('inset-inline-end', '-2px');
        badgeEl.style.setProperty('inset-block-start', '-2px');
        badgeEl.style.setProperty('display', 'inline-flex');
        badgeEl.style.setProperty('align-items', 'center');
        badgeEl.style.setProperty('justify-content', 'center');
        badgeEl.style.setProperty('min-inline-size', '18px');
        badgeEl.style.setProperty('min-block-size', '18px');
        badgeEl.style.setProperty('padding', '0 6px');
        badgeEl.style.setProperty('border-radius', '999px');
        badgeEl.style.setProperty('background', 'var(--ui-dock-accent)');
        badgeEl.style.setProperty('color', '#ffffff');
        badgeEl.style.setProperty('font-size', '11px');
        badgeEl.style.setProperty('font-weight', '700');
        badgeEl.style.setProperty('box-shadow', '0 8px 18px color-mix(in srgb, var(--ui-dock-accent) 32%, rgba(15, 23, 42, 0.18))');
        badgeEl.style.setProperty('z-index', '4');
      }
    });
  }

  private _syncTabIndices(): void {
    const fallbackIndex = this._items.findIndex((item) => !item.disabled);
    if (fallbackIndex >= 0 && (this._rovingIndex < 0 || this._items[this._rovingIndex]?.disabled)) {
      this._rovingIndex = fallbackIndex;
    }

    this._items.forEach((item, index) => {
      if (item.disabled) {
        item.el.tabIndex = -1;
        return;
      }
      item.el.tabIndex = index === this._rovingIndex ? 0 : -1;
    });
  }

  private _measureItems(): void {
    if (!this._frameEl) return;
    const frameRect = this._frameEl.getBoundingClientRect();
    const orientation = this._orientation();
    const frameStart = orientation === 'horizontal' ? frameRect.left : frameRect.top;

    this._items.forEach((item) => {
      const rect = item.el.getBoundingClientRect();
      item.center =
        (orientation === 'horizontal'
          ? rect.left + rect.width / 2
          : rect.top + rect.height / 2) - frameStart;
    });
  }

  private _updateTargets(): void {
    const idleScale = this._idleScale();
    const magnification = Math.max(idleScale, this._magnification());
    const distance = Math.max(1, this._distance());
    const maxLift = this._lift() * this._motion().lift;
    const labelMode = this._labelMode();

    this._items.forEach((item, index) => {
      let nextScale = idleScale;

      if (item.sticky) {
        nextScale = Math.max(nextScale, idleScale + (magnification - idleScale) * 0.08);
      }

      if (this._pointerActive && Number.isFinite(this._pointerCoord)) {
        const offset = Math.abs(this._pointerCoord - item.center);
        const falloff = clamp(1 - offset / distance, 0, 1);
        nextScale = Math.max(nextScale, idleScale + (magnification - idleScale) * falloff * falloff);
      }

      if (index === this._focusedIndex) {
        nextScale = Math.max(nextScale, magnification);
      }

      if (item.disabled) {
        nextScale = idleScale;
      }

      const normalized = magnification === idleScale ? 0 : (nextScale - idleScale) / (magnification - idleScale);
      item.targetScale = clamp(nextScale, idleScale, magnification);
      item.targetLift = normalized * maxLift;
      item.labelVisible =
        labelMode === 'always' ||
        (labelMode !== 'none' && (index === this._focusedIndex || normalized > 0.18));
    });

    this._updateRuntimeState();
  }

  private _applyFrame(immediate = false): void {
    const smoothing = this._smoothing();
    const motion = this._motion();
    const response = clamp(motion.response + smoothing * 0.12, 0.05, 0.42);
    const damping = clamp(motion.damping + (smoothing - DEFAULT_SMOOTHING) * 0.14, 0.52, 0.9);
    const orientation = this._orientation();
    const placement = resolveLabelPlacement(this.getAttribute('label-placement'), orientation);
    const mainAxisOffsets = this._mainAxisOffsets(motion.spread);
    let needsAnotherFrame = false;

    this._items.forEach((item, index) => {
      if (immediate) {
        item.currentScale = item.targetScale;
        item.currentLift = item.targetLift;
        item.scaleVelocity = 0;
        item.liftVelocity = 0;
      } else {
        item.scaleVelocity = item.scaleVelocity * damping + (item.targetScale - item.currentScale) * response;
        item.liftVelocity = item.liftVelocity * damping + (item.targetLift - item.currentLift) * response;

        item.currentScale += item.scaleVelocity;
        item.currentLift += item.liftVelocity;

        if (Math.abs(item.targetScale - item.currentScale) < 0.002 && Math.abs(item.scaleVelocity) < 0.002) {
          item.currentScale = item.targetScale;
          item.scaleVelocity = 0;
        }

        if (Math.abs(item.targetLift - item.currentLift) < 0.002 && Math.abs(item.liftVelocity) < 0.002) {
          item.currentLift = item.targetLift;
          item.liftVelocity = 0;
        }
      }

      if (
        Math.abs(item.targetScale - item.currentScale) >= 0.002 ||
        Math.abs(item.targetLift - item.currentLift) >= 0.002 ||
        Math.abs(item.scaleVelocity) >= 0.002 ||
        Math.abs(item.liftVelocity) >= 0.002
      ) {
        needsAnotherFrame = true;
      }

      const mainAxisOffset = mainAxisOffsets[index] ?? 0;
      const x =
        orientation === 'horizontal'
          ? mainAxisOffset
          : placement === 'start'
            ? -item.currentLift * 0.28
            : item.currentLift * 0.28;
      const y =
        orientation === 'horizontal'
          ? -item.currentLift
          : mainAxisOffset;

      item.el.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0) scale(${item.currentScale})`);
      item.el.style.setProperty('z-index', String(100 + Math.round(item.currentScale * 100) + index));

      if (item.iconEl) {
        const ring =
          index === this._focusedIndex
            ? `0 0 0 3px color-mix(in srgb, var(--ui-dock-focus-ring) 26%, transparent), `
            : item.sticky
              ? `0 0 0 2px color-mix(in srgb, var(--ui-dock-accent) 22%, transparent), `
              : '';
        item.iconEl.style.setProperty('box-shadow', `${ring}var(--ui-dock-item-shadow)`);
        item.iconEl.style.setProperty(
          'border-color',
          item.sticky || index === this._focusedIndex
            ? 'color-mix(in srgb, var(--ui-dock-accent) 30%, var(--ui-dock-item-border))'
            : 'var(--ui-dock-item-border)'
        );
      }

      if (item.labelEl) {
        const visible = item.labelVisible;
        item.labelEl.style.setProperty('opacity', visible ? '1' : '0');
        item.labelEl.style.setProperty(
          'transform',
          this._labelTransform(placement, visible)
        );
        item.labelEl.style.setProperty('filter', visible ? 'blur(0px)' : 'blur(6px)');
      }
    });

    if (needsAnotherFrame) {
      this._queueAnimation();
    }
  }

  private _queueAnimation(): void {
    if (this._reducedMotion) {
      cancelFrameRequest(this._raf);
      this._raf = null;
      this._applyFrame(true);
      return;
    }

    if (this._raf != null) return;
    this._raf = requestFrame(() => {
      this._raf = null;
      this._applyFrame(false);
    });
  }

  private _mainAxisOffsets(spreadMultiplier: number): number[] {
    if (this._items.length < 2) return this._items.map(() => 0);

    const baseSize = this._resolvedItemSizePx();
    const baseGap = this._resolvedGapPx();
    const baseCenterDistance = baseSize + baseGap;
    const rawOffsets = [0];

    for (let index = 1; index < this._items.length; index += 1) {
      const previous = this._items[index - 1];
      const current = this._items[index];
      const previousHalf = (baseSize * previous.currentScale) / 2;
      const currentHalf = (baseSize * current.currentScale) / 2;
      const requiredExtra = Math.max(0, previousHalf + currentHalf - baseCenterDistance);
      rawOffsets[index] = rawOffsets[index - 1] + requiredExtra * spreadMultiplier;
    }

    const centerOffset = rawOffsets[rawOffsets.length - 1] / 2;
    return rawOffsets.map((offset) => offset - centerOffset);
  }

  private _labelTransform(placement: Exclude<DockLabelPlacement, 'auto'>, visible: boolean): string {
    if (placement === 'top') {
      return visible ? 'translate3d(-50%, 0, 0)' : 'translate3d(-50%, 6px, 0)';
    }
    if (placement === 'bottom') {
      return visible ? 'translate3d(-50%, 0, 0)' : 'translate3d(-50%, -6px, 0)';
    }
    if (placement === 'start') {
      return visible ? 'translate3d(0, -50%, 0)' : 'translate3d(6px, -50%, 0)';
    }
    return visible ? 'translate3d(0, -50%, 0)' : 'translate3d(-6px, -50%, 0)';
  }

  private _syncHostStyles(): void {
    const gap = normalizeLength(this.getAttribute('gap'));
    if (gap) this.style.setProperty('--ui-dock-gap', gap);
    else this.style.removeProperty('--ui-dock-gap');

    const padding = normalizeLength(this.getAttribute('padding'));
    if (padding) this.style.setProperty('--ui-dock-padding', padding);
    else this.style.removeProperty('--ui-dock-padding');

    const itemSize = normalizeLength(this.getAttribute('item-size'));
    if (itemSize) {
      this.style.setProperty('--ui-dock-item-size', itemSize);
      this.style.setProperty('--ui-dock-icon-size', `calc(${itemSize} * 0.44)`);
    } else {
      this.style.removeProperty('--ui-dock-item-size');
      this.style.removeProperty('--ui-dock-icon-size');
    }

    const radius = this.getAttribute('radius');
    if (radius && !SEMANTIC_RADIUS_VALUES.has(radius)) {
      const normalizedRadius = normalizeLength(radius) || radius;
      this.style.setProperty('--ui-dock-radius', normalizedRadius);
      this.style.setProperty('--ui-dock-item-radius', `calc(${normalizedRadius} * 0.82)`);
    } else {
      this.style.removeProperty('--ui-dock-radius');
      this.style.removeProperty('--ui-dock-item-radius');
    }
  }

  private _orientation(): DockOrientation {
    return this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';
  }

  private _motion(): DockMotionPreset {
    const value = this.getAttribute('animation');
    if (value === 'calm' || value === 'snappy' || value === 'bouncy') return MOTION_PRESETS[value];
    return MOTION_PRESETS.smooth;
  }

  private _labelMode(): DockLabelMode {
    const value = this.getAttribute('label-mode');
    if (value === 'always' || value === 'none') return value;
    return 'hover';
  }

  private _magnification(): number {
    return Math.max(this._idleScale(), parsePositiveNumber(this.getAttribute('magnification'), DEFAULT_MAGNIFICATION));
  }

  private _distance(): number {
    return parsePositiveNumber(this.getAttribute('distance'), DEFAULT_DISTANCE);
  }

  private _idleScale(): number {
    return Math.max(0.5, parsePositiveNumber(this.getAttribute('idle-scale'), DEFAULT_IDLE_SCALE));
  }

  private _lift(): number {
    return parsePositiveNumber(this.getAttribute('lift'), DEFAULT_LIFT);
  }

  private _smoothing(): number {
    return parseUnitInterval(this.getAttribute('smoothing'), DEFAULT_SMOOTHING);
  }

  private _sizeToken(): keyof typeof SIZE_PRESETS {
    const value = this.getAttribute('size');
    if (value === 'xs' || value === '0') return 'xs';
    if (value === 'sm' || value === '1') return 'sm';
    if (value === 'lg' || value === '3') return 'lg';
    if (value === 'xl' || value === '4') return 'xl';
    return 'md';
  }

  private _resolvedItemSizePx(): number {
    const custom = normalizeLength(this.getAttribute('item-size'));
    if (custom) {
      const parsed = Number.parseFloat(custom);
      if (Number.isFinite(parsed)) return parsed;
    }
    return SIZE_PRESETS[this._sizeToken()]?.itemSize ?? DEFAULT_ITEM_SIZE_PX;
  }

  private _resolvedGapPx(): number {
    const custom = normalizeLength(this.getAttribute('gap'));
    if (custom) {
      const parsed = Number.parseFloat(custom);
      if (Number.isFinite(parsed)) return parsed;
    }
    const preset = SIZE_PRESETS[this._sizeToken()];
    return preset ? Number.parseFloat(preset.gap) : Number.parseFloat(DEFAULT_GAP);
  }

  private _updateRuntimeState(): void {
    const state =
      this._focusedIndex >= 0
        ? 'keyboard'
        : this._pointerActive
          ? 'pointer'
          : 'idle';
    this.setAttribute('data-state', state);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-dock')) {
  customElements.define('ui-dock', UIDock);
}
