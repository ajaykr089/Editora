import { ElementBase } from '../ElementBase';

type MarqueeDirection = 'left' | 'right' | 'up' | 'down';

const DEFAULT_GAP = '24px';
const DEFAULT_FADE_SIZE = '48px';
const DEFAULT_SPEED = 60;

const SEMANTIC_RADIUS_VALUES = new Set(['none', 'sm', 'md', 'lg', 'full']);
const MEASUREMENT_ATTRIBUTES = new Set(['direction', 'speed', 'gap', 'size', 'padding']);

const style = `
  :host {
    --ui-marquee-gap: ${DEFAULT_GAP};
    --ui-marquee-fade-size: ${DEFAULT_FADE_SIZE};
    --ui-marquee-duration: 12s;
    --ui-marquee-distance: 0px;
    --ui-marquee-padding-inline: 18px;
    --ui-marquee-padding-block: 12px;
    --ui-marquee-content-align: center;
    --ui-marquee-min-block-size: 56px;
    --ui-marquee-radius: var(--base-marquee-radius, 18px);
    --ui-marquee-bg: var(--base-marquee-bg, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-marquee-color: var(--ui-color-text, var(--ui-text, #202020));
    --ui-marquee-border-color:
      color-mix(in srgb, var(--ui-color-border, rgba(15, 23, 42, 0.16)) 82%, transparent);
    --ui-marquee-border: 1px solid var(--ui-marquee-border-color);
    --ui-marquee-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 16px 30px rgba(15, 23, 42, 0.08);
    --ui-marquee-backdrop: none;
    --ui-marquee-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-marquee-focus-ring: var(--ui-color-focus-ring, var(--ui-focus-ring, #2563eb));

    --ui-marquee-item-radius: 999px;
    --ui-marquee-item-padding-inline: 14px;
    --ui-marquee-item-padding-block: 8px;
    --ui-marquee-item-gap: 8px;
    --ui-marquee-item-min-block-size: 36px;
    --ui-marquee-item-font-size: 13px;
    --ui-marquee-item-line-height: 1.25;
    --ui-marquee-item-bg: color-mix(in srgb, var(--ui-marquee-accent) 8%, transparent);
    --ui-marquee-item-border: 1px solid color-mix(in srgb, var(--ui-marquee-accent) 18%, transparent);
    --ui-marquee-item-shadow: none;
    --ui-marquee-item-backdrop: none;
    --ui-marquee-item-color: inherit;

    display: block;
    min-inline-size: 0;
    min-block-size: var(--ui-marquee-min-block-size);
    box-sizing: border-box;
    color-scheme: light dark;
    color: var(--ui-marquee-color);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .root {
    position: relative;
    display: block;
    min-inline-size: 0;
    min-block-size: inherit;
  }

  .viewport {
    position: relative;
    display: block;
    overflow: hidden;
    min-inline-size: 0;
    min-block-size: inherit;
    padding: var(--ui-marquee-padding, var(--ui-marquee-padding-block) var(--ui-marquee-padding-inline));
    border-radius: var(--ui-marquee-radius);
    border: var(--ui-marquee-border);
    background: var(--ui-marquee-bg);
    color: var(--ui-marquee-color);
    box-shadow: var(--ui-marquee-shadow);
    backdrop-filter: var(--ui-marquee-backdrop);
    box-sizing: border-box;
    isolation: isolate;
    transition:
      background-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      border-color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      box-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      backdrop-filter 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-marquee-gap: 16px;
    --ui-marquee-padding-inline: 14px;
    --ui-marquee-padding-block: 10px;
    --ui-marquee-min-block-size: 48px;
    --ui-marquee-item-padding-inline: 12px;
    --ui-marquee-item-padding-block: 7px;
    --ui-marquee-item-min-block-size: 32px;
    --ui-marquee-item-font-size: 12px;
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-marquee-gap: ${DEFAULT_GAP};
    --ui-marquee-padding-inline: 18px;
    --ui-marquee-padding-block: 12px;
    --ui-marquee-min-block-size: 56px;
    --ui-marquee-item-padding-inline: 14px;
    --ui-marquee-item-padding-block: 8px;
    --ui-marquee-item-min-block-size: 36px;
    --ui-marquee-item-font-size: 13px;
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-marquee-gap: 30px;
    --ui-marquee-padding-inline: 22px;
    --ui-marquee-padding-block: 16px;
    --ui-marquee-min-block-size: 68px;
    --ui-marquee-item-padding-inline: 18px;
    --ui-marquee-item-padding-block: 10px;
    --ui-marquee-item-min-block-size: 42px;
    --ui-marquee-item-font-size: 14px;
  }

  :host([tone="neutral"]) {
    --ui-marquee-accent: #64748b;
  }

  :host([tone="info"]) {
    --ui-marquee-accent: #0ea5e9;
  }

  :host([tone="success"]) {
    --ui-marquee-accent: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-marquee-accent: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-marquee-accent: var(--ui-color-danger, #dc2626);
  }

  :host([variant="soft"]) {
    --ui-marquee-bg:
      color-mix(in srgb, var(--ui-marquee-accent) 7%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)));
    --ui-marquee-border-color:
      color-mix(in srgb, var(--ui-marquee-accent) 18%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-marquee-shadow: none;
    --ui-marquee-item-bg: color-mix(in srgb, var(--ui-marquee-accent) 12%, transparent);
    --ui-marquee-item-border: 1px solid color-mix(in srgb, var(--ui-marquee-accent) 22%, transparent);
  }

  :host([variant="solid"]) {
    --ui-marquee-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-marquee-accent) 12%, var(--color-panel-solid, var(--ui-color-surface, #ffffff))),
        color-mix(in srgb, var(--ui-marquee-accent) 6%, var(--color-panel-solid, var(--ui-color-surface, #ffffff)))
      );
    --ui-marquee-border-color:
      color-mix(in srgb, var(--ui-marquee-accent) 24%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-marquee-shadow:
      0 1px 3px rgba(15, 23, 42, 0.06),
      0 18px 36px color-mix(in srgb, var(--ui-marquee-accent) 10%, rgba(15, 23, 42, 0.08));
    --ui-marquee-item-bg:
      color-mix(in srgb, var(--ui-marquee-accent) 16%, rgba(255, 255, 255, 0.72));
    --ui-marquee-item-border:
      1px solid color-mix(in srgb, var(--ui-marquee-accent) 28%, transparent);
    --ui-marquee-item-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
  }

  :host([variant="glass"]) {
    --ui-marquee-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--color-panel-solid, var(--ui-color-surface, #ffffff)) 82%, #ffffff 18%),
        color-mix(in srgb, var(--color-panel-solid, var(--ui-color-surface, #ffffff)) 92%, transparent)
      );
    --ui-marquee-border-color:
      color-mix(in srgb, #ffffff 28%, var(--ui-color-border, rgba(15, 23, 42, 0.16)));
    --ui-marquee-shadow:
      0 1px 3px rgba(15, 23, 42, 0.08),
      0 24px 48px rgba(15, 23, 42, 0.12);
    --ui-marquee-backdrop: blur(16px) saturate(1.08);
    --ui-marquee-item-bg: color-mix(in srgb, #ffffff 42%, transparent);
    --ui-marquee-item-border: 1px solid color-mix(in srgb, #ffffff 36%, transparent);
    --ui-marquee-item-backdrop: blur(10px) saturate(1.05);
  }

  :host([variant="contrast"]) {
    --ui-marquee-bg:
      linear-gradient(
        180deg,
        color-mix(in srgb, #07162d 92%, var(--ui-marquee-accent) 8%),
        color-mix(in srgb, #0f2d57 84%, var(--ui-marquee-accent) 16%)
      );
    --ui-marquee-color: #f8fbff;
    --ui-marquee-border-color: color-mix(in srgb, #9ec5ff 18%, transparent);
    --ui-marquee-shadow: 0 28px 56px rgba(2, 6, 23, 0.32);
    --ui-marquee-item-bg: color-mix(in srgb, #ffffff 10%, transparent);
    --ui-marquee-item-border: 1px solid color-mix(in srgb, #ffffff 14%, transparent);
    --ui-marquee-item-color: #f8fbff;
  }

  :host([variant="minimal"]) {
    --ui-marquee-bg: transparent;
    --ui-marquee-border: none;
    --ui-marquee-shadow: none;
    --ui-marquee-item-bg: color-mix(in srgb, var(--ui-marquee-accent) 8%, transparent);
    --ui-marquee-item-border: 1px solid color-mix(in srgb, var(--ui-marquee-accent) 18%, transparent);
  }

  :host([radius="none"]) {
    --ui-marquee-radius: 0px;
    --ui-marquee-item-radius: 0px;
  }

  :host([radius="sm"]) {
    --ui-marquee-radius: 10px;
    --ui-marquee-item-radius: 12px;
  }

  :host([radius="md"]) {
    --ui-marquee-radius: 16px;
    --ui-marquee-item-radius: 16px;
  }

  :host([radius="lg"]) {
    --ui-marquee-radius: 22px;
    --ui-marquee-item-radius: 18px;
  }

  :host([radius="full"]) {
    --ui-marquee-radius: 999px;
    --ui-marquee-item-radius: 999px;
  }

  :host([elevation="none"]) {
    --ui-marquee-shadow: none;
  }

  :host([elevation="low"]) {
    --ui-marquee-shadow:
      0 1px 2px rgba(15, 23, 42, 0.05),
      0 16px 30px rgba(15, 23, 42, 0.08);
  }

  :host([elevation="high"]) {
    --ui-marquee-shadow:
      0 2px 8px rgba(15, 23, 42, 0.08),
      0 28px 54px rgba(15, 23, 42, 0.16);
  }

  .track {
    display: flex;
    align-items: var(--ui-marquee-content-align);
    gap: var(--ui-marquee-gap);
    inline-size: max-content;
    min-inline-size: 100%;
    will-change: transform;
    animation-duration: var(--ui-marquee-duration);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-play-state: paused;
  }

  .lane,
  .source,
  .clone-content {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: var(--ui-marquee-content-align);
    gap: var(--ui-marquee-gap);
    min-inline-size: max-content;
  }

  .lane {
    min-block-size: 100%;
  }

  .lane--clone {
    pointer-events: none;
    user-select: none;
  }

  .lane--clone,
  .lane--clone * {
    pointer-events: none !important;
  }

  .source slot {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: var(--ui-marquee-content-align);
    gap: var(--ui-marquee-gap);
    min-inline-size: max-content;
  }

  .source slot::slotted(*) {
    flex: 0 0 auto;
    color: inherit;
  }

  .source slot::slotted(img),
  .source slot::slotted(video),
  .source slot::slotted(canvas),
  .source slot::slotted(svg) {
    display: block;
    max-inline-size: none;
  }

  .source slot::slotted([data-ui-marquee-item]) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 0;
    min-block-size: var(--ui-marquee-item-min-block-size);
    gap: var(--ui-marquee-item-gap);
    padding: var(--ui-marquee-item-padding-block) var(--ui-marquee-item-padding-inline);
    border-radius: var(--ui-marquee-item-radius);
    border: var(--ui-marquee-item-border);
    background: var(--ui-marquee-item-bg);
    color: var(--ui-marquee-item-color);
    box-shadow: var(--ui-marquee-item-shadow);
    backdrop-filter: var(--ui-marquee-item-backdrop);
    box-sizing: border-box;
    font-size: var(--ui-marquee-item-font-size);
    line-height: var(--ui-marquee-item-line-height);
    white-space: nowrap;
  }

  .clone-content [data-ui-marquee-item] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 0;
    min-block-size: var(--ui-marquee-item-min-block-size);
    gap: var(--ui-marquee-item-gap);
    padding: var(--ui-marquee-item-padding-block) var(--ui-marquee-item-padding-inline);
    border-radius: var(--ui-marquee-item-radius);
    border: var(--ui-marquee-item-border);
    background: var(--ui-marquee-item-bg);
    color: var(--ui-marquee-item-color);
    box-shadow: var(--ui-marquee-item-shadow);
    backdrop-filter: var(--ui-marquee-item-backdrop);
    box-sizing: border-box;
    font-size: var(--ui-marquee-item-font-size);
    line-height: var(--ui-marquee-item-line-height);
    white-space: nowrap;
  }

  .clone-content img,
  .clone-content video,
  .clone-content canvas,
  .clone-content svg {
    display: block;
    max-inline-size: none;
  }

  :host([direction="up"]) .track,
  :host([direction="down"]) .track {
    flex-direction: column;
    align-items: stretch;
    min-inline-size: 0;
    min-block-size: 100%;
  }

  :host([direction="up"]) .lane,
  :host([direction="up"]) .source,
  :host([direction="up"]) .clone-content,
  :host([direction="down"]) .lane,
  :host([direction="down"]) .source,
  :host([direction="down"]) .clone-content {
    display: grid;
    min-inline-size: 100%;
    min-block-size: max-content;
    justify-items: stretch;
    align-items: stretch;
  }

  :host([direction="up"]) .source slot,
  :host([direction="down"]) .source slot {
    display: grid;
    min-inline-size: 100%;
    min-block-size: max-content;
  }

  :host([data-state="running"]) .track {
    animation-play-state: running;
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host([pause-on-hover]:hover) .track,
  :host([pause-on-focus]:focus-within) .track,
  :host([paused]) .track {
    animation-play-state: paused;
  }

  :host([pause-on-focus]:focus-within) .viewport {
    border-color: color-mix(in srgb, var(--ui-marquee-accent) 24%, var(--ui-marquee-border-color));
    box-shadow:
      0 0 0 3px color-mix(in srgb, var(--ui-marquee-focus-ring) 22%, transparent),
      var(--ui-marquee-shadow);
  }

  :host(:not([direction])) .track,
  :host([direction="left"]) .track {
    animation-name: ui-marquee-scroll-left;
  }

  :host([direction="right"]) .track {
    animation-name: ui-marquee-scroll-right;
  }

  :host([direction="up"]) .track {
    animation-name: ui-marquee-scroll-up;
  }

  :host([direction="down"]) .track {
    animation-name: ui-marquee-scroll-down;
  }

  :host([fade]) .viewport {
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
  }

  :host([fade][direction="left"]) .viewport,
  :host([fade][direction="right"]) .viewport {
    -webkit-mask-image:
      linear-gradient(
        90deg,
        transparent 0,
        #000 min(12%, var(--ui-marquee-fade-size)),
        #000 calc(100% - min(12%, var(--ui-marquee-fade-size))),
        transparent 100%
      );
    mask-image:
      linear-gradient(
        90deg,
        transparent 0,
        #000 min(12%, var(--ui-marquee-fade-size)),
        #000 calc(100% - min(12%, var(--ui-marquee-fade-size))),
        transparent 100%
      );
  }

  :host([fade][direction="up"]) .viewport,
  :host([fade][direction="down"]) .viewport {
    -webkit-mask-image:
      linear-gradient(
        180deg,
        transparent 0,
        #000 min(12%, var(--ui-marquee-fade-size)),
        #000 calc(100% - min(12%, var(--ui-marquee-fade-size))),
        transparent 100%
      );
    mask-image:
      linear-gradient(
        180deg,
        transparent 0,
        #000 min(12%, var(--ui-marquee-fade-size)),
        #000 calc(100% - min(12%, var(--ui-marquee-fade-size))),
        transparent 100%
      );
  }

  @keyframes ui-marquee-scroll-left {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(calc(var(--ui-marquee-distance) * -1), 0, 0); }
  }

  @keyframes ui-marquee-scroll-right {
    from { transform: translate3d(calc(var(--ui-marquee-distance) * -1), 0, 0); }
    to { transform: translate3d(0, 0, 0); }
  }

  @keyframes ui-marquee-scroll-up {
    from { transform: translate3d(0, 0, 0); }
    to { transform: translate3d(0, calc(var(--ui-marquee-distance) * -1), 0); }
  }

  @keyframes ui-marquee-scroll-down {
    from { transform: translate3d(0, calc(var(--ui-marquee-distance) * -1), 0); }
    to { transform: translate3d(0, 0, 0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .track {
      animation: none !important;
      transform: none !important;
    }

    .lane--clone {
      display: none !important;
    }
  }

  @media (forced-colors: active) {
    :host([fade]) .viewport {
      -webkit-mask-image: none !important;
      mask-image: none !important;
    }
  }
`;

function normalizeDirection(raw: string | null): MarqueeDirection {
  if (raw === 'right' || raw === 'up' || raw === 'down') return raw;
  return 'left';
}

function positiveNumberAttr(raw: string | null, fallback: number): number {
  if (raw == null || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeCssToken(raw: string | null): string | null {
  if (raw == null || raw.trim() === '') return null;
  const normalized = raw.trim();
  if (/^-?\d+(\.\d+)?$/.test(normalized)) return `${normalized}px`;
  return normalized;
}

function isSemanticRadius(raw: string | null): boolean {
  return Boolean(raw && SEMANTIC_RADIUS_VALUES.has(raw.trim().toLowerCase()));
}

function isMeaningfulNode(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE) return Boolean(node.textContent?.trim());
  return node.nodeType === Node.ELEMENT_NODE;
}

function setNodeInteractivityDisabled(element: HTMLElement): void {
  element.tabIndex = -1;
  if ('inert' in element) {
    try {
      (element as HTMLElement & { inert: boolean }).inert = true;
    } catch {
      // noop
    }
  }

  if ('disabled' in element) {
    try {
      (element as HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).disabled = true;
    } catch {
      // noop
    }
  }

  element.setAttribute('aria-hidden', 'true');
  element.removeAttribute('autofocus');
}

function sanitizeCloneTree(node: Node): void {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const element = node as HTMLElement;
  element.removeAttribute('id');
  element.removeAttribute('slot');
  element.setAttribute('data-marquee-clone', '');
  setNodeInteractivityDisabled(element);

  if (element instanceof HTMLAnchorElement) {
    element.removeAttribute('href');
  }

  if (element instanceof HTMLMediaElement) {
    element.muted = true;
    element.controls = false;
    element.autoplay = false;
    element.loop = true;
    try {
      element.pause();
    } catch {
      // noop
    }
  }

  const descendants = element.querySelectorAll<HTMLElement>('*');
  descendants.forEach((child) => {
    child.removeAttribute('id');
    child.removeAttribute('slot');
    child.setAttribute('data-marquee-clone', '');
    setNodeInteractivityDisabled(child);

    if (child instanceof HTMLAnchorElement) {
      child.removeAttribute('href');
    }

    if (child instanceof HTMLMediaElement) {
      child.muted = true;
      child.controls = false;
      child.autoplay = false;
      child.loop = true;
      try {
        child.pause();
      } catch {
        // noop
      }
    }
  });
}

function cloneAssignedNode(node: Node): Node | null {
  if (node.nodeType === Node.TEXT_NODE) {
    return document.createTextNode(node.textContent || '');
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null;
  const clone = node.cloneNode(true);
  sanitizeCloneTree(clone);
  return clone;
}

export class UIMarquee extends ElementBase {
  static get observedAttributes() {
    return [
      'direction',
      'speed',
      'gap',
      'fade',
      'fade-size',
      'paused',
      'pause-on-hover',
      'pause-on-focus',
      'variant',
      'tone',
      'size',
      'radius',
      'elevation',
      'padding',
    ];
  }

  private _slotEl: HTMLSlotElement | null = null;
  private _viewportEl: HTMLElement | null = null;
  private _sourceEl: HTMLElement | null = null;
  private _trackEl: HTMLElement | null = null;
  private _cloneRootEl: HTMLElement | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _lightDomObserver: MutationObserver | null = null;
  private _mediaQuery: MediaQueryList | null = null;
  private _measureFrame: number | null = null;
  private _cloneCount = 0;

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onContentMutation = this._onContentMutation.bind(this);
    this._onResize = this._onResize.bind(this);
    this._onReducedMotionChange = this._onReducedMotionChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._observeLightDom();
    this._bindReducedMotion();
    this._syncHostStyles();
  }

  override disconnectedCallback(): void {
    if (this._slotEl) {
      this._slotEl.removeEventListener('slotchange', this._onSlotChange as EventListener);
      this._slotEl = null;
    }

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

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

    if (this._measureFrame != null) {
      this._cancelFrame(this._measureFrame);
      this._measureFrame = null;
    }

    super.disconnectedCallback();
  }

  play(): void {
    this.removeAttribute('paused');
    this._syncPlaybackState();
  }

  pause(): void {
    this.setAttribute('paused', '');
    this._syncPlaybackState();
  }

  refresh(): void {
    this._scheduleMeasurement(true);
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    if (oldValue === newValue || !name || !this.isConnected) return;

    if (name === 'gap' || name === 'fade-size' || name === 'radius' || name === 'padding') {
      this._syncHostStyles();
    }

    if (name === 'paused') {
      this._syncPlaybackState();
      return;
    }

    if (MEASUREMENT_ATTRIBUTES.has(name)) {
      this._scheduleMeasurement(name !== 'speed');
    }
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="viewport" part="viewport">
          <div class="track" part="track">
            <div class="lane lane--source" part="lane lane-source">
              <div class="source" part="source">
                <slot></slot>
              </div>
            </div>
            <div class="clone-root" part="clones"></div>
          </div>
        </div>
      </div>
    `);

    this._bindElements();
    this._syncHostStyles();
    this._scheduleMeasurement();
  }

  private _bindElements(): void {
    const slot = this.root.querySelector('slot') as HTMLSlotElement | null;
    if (slot && slot !== this._slotEl) {
      if (this._slotEl) this._slotEl.removeEventListener('slotchange', this._onSlotChange as EventListener);
      slot.addEventListener('slotchange', this._onSlotChange as EventListener);
      this._slotEl = slot;
    }

    this._viewportEl = this.root.querySelector('.viewport') as HTMLElement | null;
    this._sourceEl = this.root.querySelector('.source') as HTMLElement | null;
    this._trackEl = this.root.querySelector('.track') as HTMLElement | null;
    this._cloneRootEl = this.root.querySelector('.clone-root') as HTMLElement | null;
    this._ensureResizeObserver();
  }

  private _observeLightDom(): void {
    if (this._lightDomObserver || typeof MutationObserver === 'undefined') return;
    this._lightDomObserver = new MutationObserver(this._onContentMutation);
    this._lightDomObserver.observe(this, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
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
    this._syncPlaybackState();
  }

  private _ensureResizeObserver(): void {
    if (!this.isConnected || typeof ResizeObserver === 'undefined') return;
    if (!this._resizeObserver) {
      this._resizeObserver = new ResizeObserver(this._onResize);
    }

    this._resizeObserver.disconnect();

    if (this._viewportEl) this._resizeObserver.observe(this._viewportEl);
    if (this._sourceEl) this._resizeObserver.observe(this._sourceEl);
    this._resizeObserver.observe(this);

    const assignedElements = this._slotEl?.assignedElements({ flatten: true }) || [];
    assignedElements.forEach((element) => this._resizeObserver?.observe(element));
  }

  private _onSlotChange(): void {
    this._ensureResizeObserver();
    this._scheduleMeasurement(true);
  }

  private _onContentMutation(): void {
    this._ensureResizeObserver();
    this._scheduleMeasurement(true);
  }

  private _onResize(): void {
    this._scheduleMeasurement();
  }

  private _onReducedMotionChange(): void {
    this._syncPlaybackState();
  }

  private _scheduleMeasurement(forceCloneSync = false): void {
    if (!this.isConnected) return;
    if (this._measureFrame != null) {
      this._cancelFrame(this._measureFrame);
      this._measureFrame = null;
    }

    this._measureFrame = this._requestFrame(() => {
      this._measureFrame = null;
      this._syncLayout(forceCloneSync);
    });
  }

  private _syncLayout(forceCloneSync = false): void {
    if (!this._viewportEl || !this._sourceEl || !this._cloneRootEl) return;

    const direction = normalizeDirection(this.getAttribute('direction'));
    if (!this.hasAttribute('direction')) {
      this.setAttribute('direction', direction);
    }

    const gapPx = this._measureCssLength(this.style.getPropertyValue('--ui-marquee-gap') || DEFAULT_GAP);
    const speed = positiveNumberAttr(this.getAttribute('speed'), DEFAULT_SPEED);
    const sourceSize = this._measureSourceSize(direction);
    const viewportSize = this._measureViewportSize(direction);

    if (sourceSize <= 0 || viewportSize <= 0) {
      this._cloneRootEl.innerHTML = '';
      this._cloneCount = 0;
      this._setRuntimeState('idle');
      this.style.setProperty('--ui-marquee-distance', '0px');
      this.style.setProperty('--ui-marquee-duration', '0s');
      return;
    }

    const distance = Math.max(sourceSize + gapPx, sourceSize);
    const requiredCloneCount = Math.max(1, Math.ceil((viewportSize + gapPx) / Math.max(distance, 1)) + 1);
    if (forceCloneSync || requiredCloneCount !== this._cloneCount || !this._cloneRootEl.childElementCount) {
      this._syncClones(requiredCloneCount);
    }

    const durationSeconds = Math.max(distance / speed, 0.1);
    this.style.setProperty('--ui-marquee-distance', `${distance}px`);
    this.style.setProperty('--ui-marquee-duration', `${durationSeconds}s`);
    this._setRuntimeState(this._isMotionPaused() ? 'paused' : 'running');
  }

  private _syncClones(count: number): void {
    if (!this._cloneRootEl) return;
    this._cloneRootEl.innerHTML = '';
    this._cloneCount = count;

    const assignedNodes = this._slotEl?.assignedNodes({ flatten: true }).filter(isMeaningfulNode) || [];
    for (let index = 0; index < count; index += 1) {
      const lane = document.createElement('div');
      lane.className = 'lane lane--clone';
      lane.setAttribute('part', 'lane lane-clone');
      lane.setAttribute('aria-hidden', 'true');

      const content = document.createElement('div');
      content.className = 'clone-content';
      content.setAttribute('part', 'clone-content');

      assignedNodes.forEach((node) => {
        const clone = cloneAssignedNode(node);
        if (clone) content.appendChild(clone);
      });

      lane.appendChild(content);
      this._cloneRootEl.appendChild(lane);
    }
  }

  private _syncHostStyles(): void {
    const gap = normalizeCssToken(this.getAttribute('gap'));
    const fadeSize = normalizeCssToken(this.getAttribute('fade-size'));
    const padding = normalizeCssToken(this.getAttribute('padding'));
    const radius = normalizeCssToken(this.getAttribute('radius'));

    if (gap) this.style.setProperty('--ui-marquee-gap', gap);
    else this.style.removeProperty('--ui-marquee-gap');

    if (fadeSize) this.style.setProperty('--ui-marquee-fade-size', fadeSize);
    else this.style.removeProperty('--ui-marquee-fade-size');

    if (padding) this.style.setProperty('--ui-marquee-padding', padding);
    else this.style.removeProperty('--ui-marquee-padding');

    if (radius && !isSemanticRadius(this.getAttribute('radius'))) {
      this.style.setProperty('--ui-marquee-radius', radius);
    } else {
      this.style.removeProperty('--ui-marquee-radius');
    }

    this._syncPlaybackState();
  }

  private _syncPlaybackState(): void {
    if (!this._trackEl) return;
    this._setRuntimeState(this._isMotionPaused() ? 'paused' : 'running');
  }

  private _setRuntimeState(state: 'idle' | 'running' | 'paused'): void {
    if (this.getAttribute('data-state') !== state) {
      this.setAttribute('data-state', state);
    }
  }

  private _isMotionPaused(): boolean {
    if (this.hasAttribute('paused')) return true;
    return Boolean(this._mediaQuery?.matches);
  }

  private _measureViewportSize(direction: MarqueeDirection): number {
    if (!this._viewportEl) return 0;
    if (direction === 'up' || direction === 'down') {
      return this._viewportEl.clientHeight || this._viewportEl.getBoundingClientRect().height || 0;
    }
    return this._viewportEl.clientWidth || this._viewportEl.getBoundingClientRect().width || 0;
  }

  private _measureSourceSize(direction: MarqueeDirection): number {
    if (!this._sourceEl) return 0;
    const rect = this._sourceEl.getBoundingClientRect();

    if (direction === 'up' || direction === 'down') {
      return Math.max(this._sourceEl.scrollHeight, this._sourceEl.offsetHeight, rect.height || 0);
    }

    return Math.max(this._sourceEl.scrollWidth, this._sourceEl.offsetWidth, rect.width || 0);
  }

  private _measureCssLength(value: string): number {
    const normalized = value.trim();
    if (!normalized) return 0;
    if (/^-?\d+(\.\d+)?px$/.test(normalized)) return parseFloat(normalized);
    if (/^-?\d+(\.\d+)?$/.test(normalized)) return parseFloat(normalized);

    const probe = document.createElement('div');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.pointerEvents = 'none';
    probe.style.inlineSize = normalized;
    this.appendChild(probe);
    const measured = parseFloat(getComputedStyle(probe).inlineSize || getComputedStyle(probe).width || '0');
    probe.remove();
    return Number.isFinite(measured) ? measured : 0;
  }

  private _requestFrame(callback: FrameRequestCallback): number {
    if (typeof requestAnimationFrame === 'function') {
      return requestAnimationFrame(callback);
    }
    return window.setTimeout(() => callback(performance.now()), 16);
  }

  private _cancelFrame(handle: number): void {
    if (typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(handle);
      return;
    }
    window.clearTimeout(handle);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-marquee': UIMarquee;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-marquee')) {
  customElements.define('ui-marquee', UIMarquee);
}
