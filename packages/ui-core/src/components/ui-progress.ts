import { ElementBase } from '../ElementBase';

type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';
type ProgressVariant = 'default' | 'solid' | 'soft' | 'line' | 'glass' | 'contrast';
type ProgressTone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
type ProgressShape = 'round' | 'pill' | 'square';
type ProgressMode = 'line' | 'circle';

const style = `
  :host {
    display: block;
    width: 100%;
    --ui-progress-bg: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 45%, transparent);
    --ui-progress-fill: var(--ui-color-primary, #2563eb);
    --ui-progress-fill-soft:
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--ui-progress-fill, #2563eb) 82%, white 18%),
        var(--ui-progress-fill, #2563eb)
      );
    --ui-progress-buffer: color-mix(in srgb, var(--ui-progress-fill, #2563eb) 24%, transparent);
    --ui-progress-height: 10px;
    --ui-progress-radius: 999px;
    --ui-progress-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.38);
    --ui-progress-label: #334155;
    --ui-progress-duration: 220ms;
    --ui-progress-easing: cubic-bezier(0.2, 0.9, 0.24, 1);
    --ui-progress-track-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 70%, transparent);
    --ui-progress-circle-size: 72px;
    --ui-progress-circle-thickness: 8px;
    --ui-progress-circle-track: color-mix(in srgb, var(--ui-progress-bg) 82%, transparent);
    color-scheme: light dark;
  }

  .root {
    display: grid;
    gap: 8px;
    min-width: 0;
  }

  .meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    font: 600 12px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    color: var(--ui-progress-label);
    letter-spacing: 0.01em;
    min-height: 16px;
  }

  .track {
    position: relative;
    width: 100%;
    height: var(--ui-progress-height);
    border-radius: var(--ui-progress-radius);
    overflow: hidden;
    border: var(--ui-progress-track-border);
    box-sizing: border-box;
    background: var(--ui-progress-bg);
    box-shadow: var(--ui-progress-shadow);
    isolation: isolate;
  }

  .radial-wrap {
    display: none;
    position: relative;
    width: var(--ui-progress-circle-size);
    height: var(--ui-progress-circle-size);
    place-items: center;
    border-radius: 50%;
  }

  .radial-buffer,
  .radial-value {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - var(--ui-progress-circle-thickness)),
      #000 calc(100% - var(--ui-progress-circle-thickness) + 1px)
    );
    mask: radial-gradient(
      farthest-side,
      transparent calc(100% - var(--ui-progress-circle-thickness)),
      #000 calc(100% - var(--ui-progress-circle-thickness) + 1px)
    );
  }

  .radial-buffer {
    background:
      conic-gradient(
        var(--ui-progress-buffer) calc(var(--ui-radial-buffer, 0) * 1%),
        var(--ui-progress-circle-track) 0
      );
    transition: background var(--ui-progress-duration) var(--ui-progress-easing);
  }

  .radial-value {
    background:
      conic-gradient(
        var(--ui-progress-fill) calc(var(--ui-radial-value, 0) * 1%),
        transparent 0
      );
    transition: background var(--ui-progress-duration) var(--ui-progress-easing), transform 160ms ease;
  }

  .radial-center {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    min-width: calc(var(--ui-progress-circle-size) - (var(--ui-progress-circle-thickness) * 2));
    min-height: calc(var(--ui-progress-circle-size) - (var(--ui-progress-circle-thickness) * 2));
    border-radius: 50%;
    font: 600 11px/1.1 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, Helvetica, Arial, sans-serif;
    color: var(--ui-progress-label);
    letter-spacing: 0.01em;
    text-align: center;
    padding: 4px;
    box-sizing: border-box;
  }

  :host([mode="circle"]) {
    width: fit-content;
  }

  :host([mode="circle"]) .track {
    display: none;
  }

  :host([mode="circle"]) .radial-wrap {
    display: grid;
  }

  :host([mode="circle"][size="xs"]) {
    --ui-progress-circle-size: 36px;
    --ui-progress-circle-thickness: 4px;
  }

  :host([mode="circle"][size="sm"]) {
    --ui-progress-circle-size: 52px;
    --ui-progress-circle-thickness: 6px;
  }

  :host([mode="circle"][size="lg"]) {
    --ui-progress-circle-size: 96px;
    --ui-progress-circle-thickness: 10px;
  }

  .buffer {
    position: absolute;
    inset: 0 auto 0 0;
    width: 0%;
    border-radius: inherit;
    background: var(--ui-progress-buffer);
    transition: width var(--ui-progress-duration) var(--ui-progress-easing);
  }

  .value {
    position: absolute;
    inset: 0 auto 0 0;
    width: 0%;
    border-radius: inherit;
    background: var(--ui-progress-fill-soft);
    transition: width var(--ui-progress-duration) var(--ui-progress-easing), transform 160ms ease;
    will-change: width, transform;
  }

  .value::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.32), transparent 55%);
    opacity: 0.6;
    pointer-events: none;
  }

  :host([variant="solid"]) {
    --ui-progress-fill-soft: var(--ui-progress-fill);
    --ui-progress-shadow: none;
  }

  :host([variant="line"]) {
    --ui-progress-height: 6px;
    --ui-progress-track-border: 0;
    --ui-progress-shadow: none;
  }

  :host([variant="line"]) .value::before,
  :host([variant="contrast"]) .value::before {
    display: none;
  }

  :host([variant="glass"]) .track {
    background:
      linear-gradient(
        180deg,
        color-mix(in srgb, var(--ui-progress-bg) 74%, #ffffff 26%),
        color-mix(in srgb, var(--ui-progress-bg) 94%, transparent)
      ),
      var(--ui-progress-bg);
    backdrop-filter: blur(8px) saturate(1.08);
  }

  :host([variant="contrast"]) {
    --ui-progress-bg: #1f2937;
    --ui-progress-fill: #93c5fd;
    --ui-progress-buffer: rgba(147, 197, 253, 0.36);
    --ui-progress-label: #e2e8f0;
    --ui-progress-track-border: 1px solid #334155;
    --ui-progress-fill-soft: var(--ui-progress-fill);
    --ui-progress-shadow: none;
  }

  :host([tone="success"]) { --ui-progress-fill: #16a34a; }
  :host([tone="warning"]) { --ui-progress-fill: #d97706; }
  :host([tone="danger"]) { --ui-progress-fill: #dc2626; }
  :host([tone="info"]) { --ui-progress-fill: #0ea5e9; }
  :host([tone="neutral"]) { --ui-progress-fill: #64748b; }

  :host([shape="square"]) { --ui-progress-radius: 2px; }
  :host([shape="round"]) { --ui-progress-radius: 10px; }
  :host([shape="pill"]) { --ui-progress-radius: 999px; }

  :host([size="xs"]) { --ui-progress-height: 4px; }
  :host([size="sm"]) { --ui-progress-height: 8px; }
  :host([size="lg"]) { --ui-progress-height: 14px; }

  :host([striped]) .value {
    background-image:
      linear-gradient(
        135deg,
        color-mix(in srgb, #ffffff 30%, transparent) 25%,
        transparent 25%,
        transparent 50%,
        color-mix(in srgb, #ffffff 30%, transparent) 50%,
        color-mix(in srgb, #ffffff 30%, transparent) 75%,
        transparent 75%,
        transparent
      ),
      var(--ui-progress-fill-soft);
    background-size: 16px 16px, 100% 100%;
  }

  :host([striped][animated]) .value {
    animation: ui-progress-stripes 1s linear infinite;
  }

  :host([indeterminate]) .value {
    width: 38% !important;
    min-width: 34px;
    animation: ui-progress-indeterminate 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  :host([mode="circle"][indeterminate]) .radial-value {
    background: conic-gradient(var(--ui-progress-fill) 24%, transparent 0);
    animation: ui-progress-spin 900ms linear infinite;
  }

  :host([headless]) .track,
  :host([headless]) .radial-wrap,
  :host([headless]) .meta {
    display: none !important;
  }

  @keyframes ui-progress-stripes {
    from { background-position: 16px 0, 0 0; }
    to { background-position: 0 0, 0 0; }
  }

  @keyframes ui-progress-indeterminate {
    0% { transform: translateX(-120%); }
    50% { transform: translateX(60%); }
    100% { transform: translateX(240%); }
  }

  @keyframes ui-progress-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (prefers-reduced-motion: reduce) {
    .value,
    .buffer {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (forced-colors: active) {
    .track {
      forced-color-adjust: none;
      border-color: CanvasText;
      background: Canvas;
      box-shadow: none;
    }

    .value,
    .buffer {
      forced-color-adjust: none;
      background: Highlight;
    }

    .meta {
      color: CanvasText;
    }
  }

  @media (prefers-contrast: more) {
    .track,
    .radial-wrap {
      box-shadow: none;
    }

    .track {
      border-width: 2px;
    }
  }
`;

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function booleanAttr(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0';
}

function readNumber(raw: string | null, fallback: number): number {
  if (raw == null || raw === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeSize(raw: string | null): ProgressSize {
  if (raw === 'xs' || raw === 'sm' || raw === 'lg') return raw;
  return 'md';
}

function normalizeVariant(raw: string | null): ProgressVariant {
  if (raw === 'solid' || raw === 'soft' || raw === 'line' || raw === 'glass' || raw === 'contrast') return raw;
  return 'default';
}

function normalizeTone(raw: string | null): ProgressTone {
  if (raw === 'success' || raw === 'warning' || raw === 'danger' || raw === 'info' || raw === 'neutral') return raw;
  return 'brand';
}

function normalizeShape(raw: string | null): ProgressShape {
  if (raw === 'square' || raw === 'round') return raw;
  return 'pill';
}

function normalizeMode(raw: string | null): ProgressMode {
  if (raw === 'circle' || raw === 'radial') return 'circle';
  return 'line';
}

export class UIProgress extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'buffer',
      'max',
      'min',
      'indeterminate',
      'size',
      'variant',
      'tone',
      'shape',
      'mode',
      'striped',
      'animated',
      'show-label',
      'label',
      'format',
      'precision',
      'headless'
    ];
  }

  private _value = 0;
  private _buffer = 0;
  private _max = 100;
  private _min = 0;
  private _percent = 0;
  private _bufferPercent = 0;
  private _indeterminate = false;

  private _domReady = false;
  private _metaEl: HTMLDivElement | null = null;
  private _trackEl: HTMLDivElement | null = null;
  private _bufferEl: HTMLDivElement | null = null;
  private _valueEl: HTMLDivElement | null = null;
  private _radialWrapEl: HTMLDivElement | null = null;
  private _radialBufferEl: HTMLDivElement | null = null;
  private _radialValueEl: HTMLDivElement | null = null;
  private _radialCenterEl: HTMLDivElement | null = null;

  private _lastEmitted = '';
  private _completeFired = false;

  constructor() {
    super();
  }

  override connectedCallback(): void {
    this._syncFromAttributes();
    super.connectedCallback();
    this._emitState();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this._syncFromAttributes();
    super.attributeChangedCallback(name, oldValue, newValue);
    if (name === 'value' || name === 'buffer' || name === 'max' || name === 'min' || name === 'indeterminate') {
      this._emitState();
    }
  }

  setValue(next: number): void {
    this.setAttribute('value', String(next));
  }

  setBuffer(next: number): void {
    this.setAttribute('buffer', String(next));
  }

  increment(step = 1): void {
    this.setValue(this._value + step);
  }

  reset(): void {
    this.setValue(this._min);
  }

  private _syncFromAttributes(): void {
    const min = readNumber(this.getAttribute('min'), 0);
    const maxRaw = readNumber(this.getAttribute('max'), 100);
    const max = maxRaw > min ? maxRaw : min + 1;
    const valueRaw = readNumber(this.getAttribute('value'), min);
    const bufferRaw = readNumber(this.getAttribute('buffer'), valueRaw);
    const indeterminate = this.hasAttribute('indeterminate');

    const clampedValue = clamp(valueRaw, min, max);
    const clampedBuffer = clamp(bufferRaw, min, max);
    const denom = Math.max(1e-6, max - min);

    this._min = min;
    this._max = max;
    this._value = clampedValue;
    this._buffer = clampedBuffer;
    this._indeterminate = indeterminate;
    this._percent = clamp(((clampedValue - min) / denom) * 100, 0, 100);
    this._bufferPercent = clamp(((clampedBuffer - min) / denom) * 100, 0, 100);
  }

  private _formatLabel(percent: number): string {
    const mode = (this.getAttribute('format') || 'percent').toLowerCase();
    const precision = clamp(Math.round(readNumber(this.getAttribute('precision'), 0)), 0, 3);

    if (mode === 'value') return `${this._value.toFixed(precision)} / ${this._max.toFixed(precision)}`;
    if (mode === 'fraction') {
      const denom = Math.max(1, this._max - this._min);
      const numer = Math.max(0, this._value - this._min);
      return `${numer.toFixed(precision)}/${denom.toFixed(precision)}`;
    }
    return `${percent.toFixed(precision)}%`;
  }

  private _emitState(): void {
    if (this._indeterminate) return;

    const key = `${this._value}|${this._buffer}|${this._max}|${this._min}`;
    if (key === this._lastEmitted) return;
    this._lastEmitted = key;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: this._value,
          buffer: this._buffer,
          max: this._max,
          min: this._min,
          percent: this._percent,
          bufferPercent: this._bufferPercent
        },
        bubbles: true
      })
    );

    if (this._value >= this._max) {
      if (!this._completeFired) {
        this.dispatchEvent(
          new CustomEvent('complete', {
            detail: { value: this._value, max: this._max },
            bubbles: true
          })
        );
        this._completeFired = true;
      }
    } else {
      this._completeFired = false;
    }
  }

  private _ensureDom(): void {
    if (this._domReady) return;

    this.setContent(`
      <style>${style}</style>
      <div class="root" part="root">
        <div class="meta" part="label"></div>
        <div class="track" part="track" role="progressbar">
          <div class="buffer" part="buffer"></div>
          <div class="value" part="value"></div>
          <slot></slot>
        </div>
        <div class="radial-wrap" part="radial" role="progressbar">
          <div class="radial-buffer" part="radial-buffer"></div>
          <div class="radial-value" part="radial-value"></div>
          <div class="radial-center" part="radial-label"></div>
        </div>
      </div>
    `);

    this._metaEl = this.root.querySelector('.meta');
    this._trackEl = this.root.querySelector('.track');
    this._bufferEl = this.root.querySelector('.buffer');
    this._valueEl = this.root.querySelector('.value');
    this._radialWrapEl = this.root.querySelector('.radial-wrap');
    this._radialBufferEl = this.root.querySelector('.radial-buffer');
    this._radialValueEl = this.root.querySelector('.radial-value');
    this._radialCenterEl = this.root.querySelector('.radial-center');
    this._domReady = true;
  }

  protected render(): void {
    this._ensureDom();

    const showLabel = booleanAttr(this.getAttribute('show-label'), false);
    const explicitLabel = this.getAttribute('label');
    const renderedLabel =
      explicitLabel != null && explicitLabel !== ''
        ? explicitLabel
        : this._indeterminate
          ? 'Loading...'
          : this._formatLabel(this._percent);

    const size = normalizeSize(this.getAttribute('size'));
    const variant = normalizeVariant(this.getAttribute('variant'));
    const tone = normalizeTone(this.getAttribute('tone'));
    const shape = normalizeShape(this.getAttribute('shape'));
    const mode = normalizeMode(this.getAttribute('mode'));
    const showCenterLabel = showLabel && mode === 'circle';
    const showTopLabel = showLabel && mode !== 'circle';

    if (this._metaEl) {
      this._metaEl.textContent = showTopLabel ? renderedLabel : '';
      this._metaEl.setAttribute('aria-hidden', showTopLabel ? 'false' : 'true');
    }

    if (this._trackEl) {
      this._trackEl.dataset.size = size;
      this._trackEl.dataset.variant = variant;
      this._trackEl.dataset.tone = tone;
      this._trackEl.dataset.shape = shape;
      if (mode === 'line') {
        this._trackEl.setAttribute('aria-valuemin', String(this._min));
        this._trackEl.setAttribute('aria-valuemax', String(this._max));
        this._trackEl.setAttribute('aria-busy', this._indeterminate ? 'true' : 'false');
        this._trackEl.setAttribute('role', 'progressbar');

        if (this._indeterminate) {
          this._trackEl.removeAttribute('aria-valuenow');
          this._trackEl.setAttribute('aria-valuetext', 'Loading');
        } else {
          this._trackEl.removeAttribute('aria-valuetext');
          this._trackEl.setAttribute('aria-valuenow', String(this._value));
        }
      } else {
        this._trackEl.removeAttribute('role');
        this._trackEl.removeAttribute('aria-valuemin');
        this._trackEl.removeAttribute('aria-valuemax');
        this._trackEl.removeAttribute('aria-valuenow');
        this._trackEl.removeAttribute('aria-valuetext');
        this._trackEl.removeAttribute('aria-busy');
      }
    }

    if (this._bufferEl) {
      this._bufferEl.style.width = `${this._indeterminate ? 0 : this._bufferPercent}%`;
    }

    if (this._valueEl) {
      this._valueEl.style.width = `${this._indeterminate ? 38 : this._percent}%`;
    }

    if (this._radialWrapEl) {
      this._radialWrapEl.dataset.size = size;
      this._radialWrapEl.dataset.variant = variant;
      this._radialWrapEl.dataset.tone = tone;
      this._radialWrapEl.dataset.shape = shape;
      if (mode === 'circle') {
        this._radialWrapEl.setAttribute('aria-valuemin', String(this._min));
        this._radialWrapEl.setAttribute('aria-valuemax', String(this._max));
        this._radialWrapEl.setAttribute('aria-busy', this._indeterminate ? 'true' : 'false');
        this._radialWrapEl.setAttribute('role', 'progressbar');
        if (this._indeterminate) {
          this._radialWrapEl.removeAttribute('aria-valuenow');
          this._radialWrapEl.setAttribute('aria-valuetext', 'Loading');
        } else {
          this._radialWrapEl.removeAttribute('aria-valuetext');
          this._radialWrapEl.setAttribute('aria-valuenow', String(this._value));
        }
      } else {
        this._radialWrapEl.removeAttribute('role');
        this._radialWrapEl.removeAttribute('aria-valuemin');
        this._radialWrapEl.removeAttribute('aria-valuemax');
        this._radialWrapEl.removeAttribute('aria-valuenow');
        this._radialWrapEl.removeAttribute('aria-valuetext');
        this._radialWrapEl.removeAttribute('aria-busy');
      }
    }

    if (this._radialBufferEl) {
      this._radialBufferEl.style.setProperty('--ui-radial-buffer', String(this._indeterminate ? 0 : this._bufferPercent));
    }

    if (this._radialValueEl) {
      this._radialValueEl.style.setProperty('--ui-radial-value', String(this._indeterminate ? 24 : this._percent));
    }

    if (this._radialCenterEl) {
      this._radialCenterEl.textContent = showCenterLabel ? renderedLabel : '';
      this._radialCenterEl.setAttribute('aria-hidden', showCenterLabel ? 'false' : 'true');
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-progress')) {
  customElements.define('ui-progress', UIProgress);
}
