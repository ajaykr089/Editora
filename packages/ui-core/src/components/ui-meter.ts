import { ElementBase } from '../ElementBase';

type MeterFormat = 'percent' | 'value' | 'fraction';
type MeterState = 'low' | 'optimum' | 'suboptimum' | 'high';

const style = `
  :host {
    display: block;
    width: 100%;
    --ui-meter-bg: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 44%, transparent);
    --ui-meter-fill: var(--ui-color-primary, #2563eb);
    --ui-meter-fill-soft:
      linear-gradient(
        90deg,
        color-mix(in srgb, var(--ui-meter-fill, #2563eb) 84%, white 16%),
        var(--ui-meter-fill, #2563eb)
      );
    --ui-meter-text: var(--ui-color-text, #0f172a);
    --ui-meter-muted: var(--ui-color-muted, #64748b);
    --ui-meter-height: 12px;
    --ui-meter-radius: 999px;
    --ui-meter-border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-meter-circle-size: 76px;
    --ui-meter-circle-thickness: 9px;
    color-scheme: light dark;
  }

  .root {
    display: grid;
    gap: 10px;
    min-inline-size: 0;
  }

  .meta {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    min-block-size: 16px;
    font: 600 12px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
    color: var(--ui-meter-text);
    letter-spacing: 0.01em;
  }

  .label {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .value-text {
    color: var(--ui-meter-muted);
    font-weight: 700;
    white-space: nowrap;
  }

  .track {
    position: relative;
    inline-size: 100%;
    block-size: var(--ui-meter-height);
    overflow: hidden;
    border-radius: var(--ui-meter-radius);
    border: var(--ui-meter-border);
    background: var(--ui-meter-bg);
    box-sizing: border-box;
  }

  .fill {
    position: absolute;
    inset: 0 auto 0 0;
    inline-size: calc(var(--ui-meter-percent, 0) * 1%);
    block-size: 100%;
    border-radius: inherit;
    background: var(--ui-meter-fill-soft);
    transition: inline-size 180ms cubic-bezier(0.2, 0.9, 0.24, 1), transform 140ms ease;
    will-change: inline-size;
  }

  .fill::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.28), transparent 60%);
    pointer-events: none;
  }

  .circle {
    display: none;
    inline-size: var(--ui-meter-circle-size);
    block-size: var(--ui-meter-circle-size);
    position: relative;
    place-items: center;
  }

  .circle-track,
  .circle-fill {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    -webkit-mask: radial-gradient(
      farthest-side,
      transparent calc(100% - var(--ui-meter-circle-thickness)),
      #000 calc(100% - var(--ui-meter-circle-thickness) + 1px)
    );
    mask: radial-gradient(
      farthest-side,
      transparent calc(100% - var(--ui-meter-circle-thickness)),
      #000 calc(100% - var(--ui-meter-circle-thickness) + 1px)
    );
  }

  .circle-track {
    background: color-mix(in srgb, var(--ui-meter-bg) 84%, transparent);
  }

  .circle-fill {
    background: conic-gradient(var(--ui-meter-fill) calc(var(--ui-meter-percent, 0) * 1%), transparent 0);
    transition: background 180ms cubic-bezier(0.2, 0.9, 0.24, 1);
  }

  .circle-value {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    inline-size: calc(var(--ui-meter-circle-size) - (var(--ui-meter-circle-thickness) * 2));
    block-size: calc(var(--ui-meter-circle-size) - (var(--ui-meter-circle-thickness) * 2));
    border-radius: 50%;
    background: color-mix(in srgb, var(--ui-color-surface, #ffffff) 94%, transparent);
    color: var(--ui-meter-text);
    font: 700 12px/1.1 -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif;
    text-align: center;
    padding: 6px;
    box-sizing: border-box;
  }

  :host([mode="circle"]) {
    inline-size: fit-content;
  }

  :host([mode="circle"]) .track {
    display: none;
  }

  :host([mode="circle"]) .circle {
    display: grid;
  }

  :host([size="xs"]) {
    --ui-meter-height: 6px;
    --ui-meter-circle-size: 36px;
    --ui-meter-circle-thickness: 4px;
  }

  :host([size="sm"]) {
    --ui-meter-height: 8px;
    --ui-meter-circle-size: 52px;
    --ui-meter-circle-thickness: 6px;
  }

  :host([size="lg"]) {
    --ui-meter-height: 16px;
    --ui-meter-circle-size: 96px;
    --ui-meter-circle-thickness: 10px;
  }

  :host([shape="round"]) { --ui-meter-radius: 10px; }
  :host([shape="square"]) { --ui-meter-radius: 2px; }

  :host([variant="solid"]) {
    --ui-meter-fill-soft: var(--ui-meter-fill);
  }

  :host([variant="soft"]) {
    --ui-meter-bg: color-mix(in srgb, var(--ui-meter-fill, #2563eb) 14%, transparent);
    --ui-meter-border: 0;
  }

  :host([variant="contrast"]) {
    --ui-meter-bg: #1f2937;
    --ui-meter-text: #f8fafc;
    --ui-meter-muted: #cbd5e1;
    --ui-meter-border: 1px solid #334155;
    --ui-meter-fill-soft: var(--ui-meter-fill);
  }

  :host([tone="brand"]) { --ui-meter-fill: var(--ui-color-primary, #2563eb); }
  :host([tone="success"]) { --ui-meter-fill: #16a34a; }
  :host([tone="warning"]) { --ui-meter-fill: #d97706; }
  :host([tone="danger"]) { --ui-meter-fill: #dc2626; }
  :host([tone="neutral"]) { --ui-meter-fill: #64748b; }

  :host([data-meter-state="low"]:not([tone])) {
    --ui-meter-fill: #d97706;
  }

  :host([data-meter-state="optimum"]:not([tone])) {
    --ui-meter-fill: #16a34a;
  }

  :host([data-meter-state="suboptimum"]:not([tone])) {
    --ui-meter-fill: #f59e0b;
  }

  :host([data-meter-state="high"]:not([tone])) {
    --ui-meter-fill: #2563eb;
  }
`;

type MeterMetrics = {
  value: number;
  min: number;
  max: number;
  low: number;
  high: number;
  optimum: number | null;
  percent: number;
  state: MeterState;
  text: string;
};

function parseNumber(value: string | null, fallback: number): number {
  if (value == null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function classifyMeterState(value: number, low: number, high: number, optimum: number | null): MeterState {
  if (optimum == null) {
    if (value < low) return 'low';
    if (value > high) return 'high';
    return 'optimum';
  }

  if (optimum < low) {
    if (value <= low) return 'optimum';
    if (value <= high) return 'suboptimum';
    return 'high';
  }

  if (optimum > high) {
    if (value >= high) return 'optimum';
    if (value >= low) return 'suboptimum';
    return 'low';
  }

  if (value < low) return 'low';
  if (value > high) return 'high';
  return 'optimum';
}

export class UIMeter extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'min',
      'max',
      'low',
      'high',
      'optimum',
      'label',
      'show-label',
      'format',
      'precision',
      'size',
      'variant',
      'tone',
      'shape',
      'mode'
    ];
  }

  private _lastChangeKey = '';

  get metrics(): MeterMetrics {
    let min = parseNumber(this.getAttribute('min'), 0);
    let max = parseNumber(this.getAttribute('max'), 1);
    if (max <= min) max = min + 1;

    const value = clamp(parseNumber(this.getAttribute('value'), min), min, max);
    const low = clamp(parseNumber(this.getAttribute('low'), min + (max - min) * 0.25), min, max);
    const high = clamp(parseNumber(this.getAttribute('high'), min + (max - min) * 0.75), min, max);
    const lowBound = Math.min(low, high);
    const highBound = Math.max(low, high);
    const optimumAttr = this.getAttribute('optimum');
    const optimum = optimumAttr == null ? null : clamp(parseNumber(optimumAttr, value), min, max);
    const percent = ((value - min) / (max - min)) * 100;
    const state = classifyMeterState(value, lowBound, highBound, optimum);
    return {
      value,
      min,
      max,
      low: lowBound,
      high: highBound,
      optimum,
      percent,
      state,
      text: this._formatValue(value, min, max, percent)
    };
  }

  private _formatValue(value: number, min: number, max: number, percent: number): string {
    const format = (this.getAttribute('format') as MeterFormat | null) || 'value';
    const precision = Math.max(0, Math.floor(parseNumber(this.getAttribute('precision'), 0)));
    if (format === 'percent') return `${percent.toFixed(precision)}%`;
    if (format === 'fraction') return `${value.toFixed(precision)} / ${max.toFixed(precision)}`;
    if (min === 0 && max === 1) return value.toFixed(Math.max(precision, 2));
    return value.toFixed(precision);
  }

  private _emitChange(metrics: MeterMetrics): void {
    const changeKey = [
      metrics.value,
      metrics.min,
      metrics.max,
      metrics.low,
      metrics.high,
      metrics.optimum ?? '',
      metrics.percent.toFixed(3),
      metrics.state
    ].join('|');
    if (changeKey === this._lastChangeKey) return;
    this._lastChangeKey = changeKey;

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          value: metrics.value,
          min: metrics.min,
          max: metrics.max,
          low: metrics.low,
          high: metrics.high,
          optimum: metrics.optimum,
          percent: metrics.percent,
          state: metrics.state
        },
        bubbles: true,
        composed: true
      })
    );
  }

  protected override render(): void {
    const metrics = this.metrics;
    const label = this.getAttribute('label') || '';
    const showLabel = this.hasAttribute('show-label') || Boolean(label);
    this.setAttribute('data-meter-state', metrics.state);
    this.style.setProperty('--ui-meter-percent', metrics.percent.toFixed(3));

    this.setContent(`
      <style>${style}</style>
      <div class="root">
        ${showLabel ? `
          <div class="meta" part="meta">
            <span class="label" part="label">${label || 'Meter'}</span>
            <span class="value-text" part="value-text">${metrics.text}</span>
          </div>
        ` : ''}
        <div
          class="track"
          part="track"
          role="meter"
          aria-valuemin="${metrics.min}"
          aria-valuemax="${metrics.max}"
          aria-valuenow="${metrics.value}"
          aria-valuetext="${metrics.text}"
          aria-label="${label || 'Meter'}"
        >
          <div class="fill" part="fill"></div>
        </div>
        <div
          class="circle"
          part="circle"
          role="meter"
          aria-valuemin="${metrics.min}"
          aria-valuemax="${metrics.max}"
          aria-valuenow="${metrics.value}"
          aria-valuetext="${metrics.text}"
          aria-label="${label || 'Meter'}"
        >
          <div class="circle-track" part="circle-track"></div>
          <div class="circle-fill" part="circle-fill"></div>
          <div class="circle-value" part="circle-value">${metrics.text}</div>
        </div>
      </div>
    `);

    this._emitChange(metrics);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-meter': UIMeter;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-meter')) {
  customElements.define('ui-meter', UIMeter);
}
