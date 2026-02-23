import { ElementBase } from '../ElementBase';

type SliderMark = { value: number; label?: string };

const style = `
  :host {
    --ui-slider-width: min(340px, 100%);
    --ui-slider-track-size: 6px;
    --ui-slider-track-radius: 999px;
    --ui-slider-thumb-size: 18px;
    --ui-slider-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-slider-text: var(--ui-color-text, #0f172a);
    --ui-slider-muted: var(--ui-color-muted, #64748b);
    --ui-slider-track: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-slider-fill: var(--ui-color-primary, #2563eb);
    --ui-slider-focus: var(--ui-color-focus-ring, #2563eb);
    --ui-slider-shadow:
      0 1px 2px rgba(2, 6, 23, 0.05),
      0 12px 28px rgba(2, 6, 23, 0.08);
    --ui-slider-thumb-shadow:
      0 2px 8px rgba(2, 6, 23, 0.22),
      0 0 0 1px color-mix(in srgb, var(--ui-slider-fill) 24%, transparent);
    --ui-slider-thumb-ring: 0 0 0 4px color-mix(in srgb, var(--ui-slider-focus) 18%, transparent);
    --ui-slider-padding: 10px;
    --ui-slider-radius: 14px;
    --ui-slider-label-size: 13px;
    --ui-slider-value-size: 12px;
    color-scheme: light dark;
    display: inline-grid;
    inline-size: var(--ui-slider-width);
    min-inline-size: min(220px, 100%);
    box-sizing: border-box;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .shell {
    min-inline-size: 0;
    display: grid;
    gap: 8px;
    color: var(--ui-slider-text);
    background: var(--ui-slider-bg);
    border: 1px solid color-mix(in srgb, var(--ui-color-border, #cbd5e1) 60%, transparent);
    border-radius: var(--ui-slider-radius);
    box-shadow: var(--ui-slider-shadow);
    padding: var(--ui-slider-padding);
  }

  .meta {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }

  .meta[hidden],
  .description[hidden],
  .label[hidden],
  .value[hidden],
  .marks[hidden] {
    display: none;
  }

  .label {
    font-size: var(--ui-slider-label-size);
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .description {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    color: var(--ui-slider-muted);
  }

  .value {
    color: var(--ui-slider-muted);
    font-size: var(--ui-slider-value-size);
    line-height: 1.25;
    white-space: nowrap;
  }

  .control {
    min-inline-size: 0;
    display: grid;
    gap: 8px;
    align-items: center;
  }

  .track-wrap {
    position: relative;
    min-inline-size: 0;
    block-size: max(var(--ui-slider-thumb-size), 24px);
    display: grid;
    align-items: center;
  }

  .track {
    block-size: var(--ui-slider-track-size);
    border-radius: var(--ui-slider-track-radius);
    background: var(--ui-slider-track);
  }

  .range-fill {
    position: absolute;
    left: var(--ui-slider-start, 0%);
    right: calc(100% - var(--ui-slider-end, 0%));
    block-size: var(--ui-slider-track-size);
    border-radius: var(--ui-slider-track-radius);
    background: linear-gradient(
      90deg,
      color-mix(in srgb, var(--ui-slider-fill) 86%, #ffffff 14%),
      var(--ui-slider-fill)
    );
    pointer-events: none;
  }

  .inputs {
    position: absolute;
    inset: 0;
  }

  input[type="range"] {
    appearance: none;
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    margin: 0;
    background: transparent;
    pointer-events: auto;
    outline: none;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    appearance: none;
    background: transparent;
    block-size: var(--ui-slider-track-size);
  }

  input[type="range"]::-moz-range-track {
    background: transparent;
    block-size: var(--ui-slider-track-size);
    border: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    inline-size: var(--ui-slider-thumb-size);
    block-size: var(--ui-slider-thumb-size);
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--ui-slider-fill) 42%, transparent);
    background: color-mix(in srgb, var(--ui-slider-fill) 94%, #ffffff 6%);
    box-shadow: var(--ui-slider-thumb-shadow);
    margin-top: calc((var(--ui-slider-track-size) - var(--ui-slider-thumb-size)) / 2);
    cursor: pointer;
    transition: transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
  }

  input[type="range"]::-moz-range-thumb {
    inline-size: var(--ui-slider-thumb-size);
    block-size: var(--ui-slider-thumb-size);
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--ui-slider-fill) 42%, transparent);
    background: color-mix(in srgb, var(--ui-slider-fill) 94%, #ffffff 6%);
    box-shadow: var(--ui-slider-thumb-shadow);
    cursor: pointer;
    transition: transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease;
  }

  input[type="range"]:focus-visible::-webkit-slider-thumb {
    box-shadow: var(--ui-slider-thumb-shadow), var(--ui-slider-thumb-ring);
  }

  input[type="range"]:focus-visible::-moz-range-thumb {
    box-shadow: var(--ui-slider-thumb-shadow), var(--ui-slider-thumb-ring);
  }

  input[type="range"]:active::-webkit-slider-thumb,
  input[type="range"]:active::-moz-range-thumb {
    transform: scale(1.06);
  }

  .marks {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 6px);
    display: block;
    pointer-events: none;
  }

  .mark {
    position: absolute;
    transform: translateX(-50%);
    display: grid;
    justify-items: center;
    gap: 4px;
  }

  .mark::before {
    content: "";
    inline-size: 1px;
    block-size: 8px;
    background: color-mix(in srgb, var(--ui-slider-track) 84%, var(--ui-slider-text));
  }

  .mark-label {
    font-size: 10px;
    color: var(--ui-slider-muted);
    white-space: nowrap;
  }

  .shell[data-has-marks="true"] .control {
    padding-bottom: 22px;
  }

  :host([disabled]) .shell {
    opacity: 0.62;
    box-shadow: none;
  }

  :host([disabled]) input[type="range"] {
    pointer-events: none;
  }

  :host([size="sm"]) {
    --ui-slider-track-size: 4px;
    --ui-slider-thumb-size: 14px;
    --ui-slider-padding: 8px;
    --ui-slider-radius: 12px;
  }

  :host([size="lg"]) {
    --ui-slider-track-size: 8px;
    --ui-slider-thumb-size: 22px;
    --ui-slider-padding: 12px;
    --ui-slider-radius: 16px;
  }

  :host([variant="soft"]) {
    --ui-slider-bg: color-mix(in srgb, var(--ui-slider-fill) 10%, var(--ui-color-surface, #ffffff));
    --ui-slider-track: color-mix(in srgb, var(--ui-slider-fill) 20%, var(--ui-color-border, #cbd5e1));
  }

  :host([variant="glass"]) {
    --ui-slider-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 74%, transparent);
    --ui-slider-shadow:
      0 8px 20px rgba(2, 6, 23, 0.14),
      0 24px 48px rgba(2, 6, 23, 0.16);
  }

  :host([variant="contrast"]) {
    --ui-slider-bg: #0f172a;
    --ui-slider-text: #e2e8f0;
    --ui-slider-muted: #93a4bd;
    --ui-slider-track: #334155;
    --ui-slider-fill: #93c5fd;
    --ui-slider-focus: #93c5fd;
    --ui-slider-thumb-shadow:
      0 0 0 1px color-mix(in srgb, #93c5fd 36%, transparent),
      0 4px 14px rgba(2, 6, 23, 0.42);
    --ui-slider-shadow:
      0 14px 34px rgba(2, 6, 23, 0.46),
      0 30px 60px rgba(2, 6, 23, 0.42);
  }

  :host([variant="minimal"]) {
    --ui-slider-bg: transparent;
    --ui-slider-shadow: none;
  }

  :host([tone="success"]) {
    --ui-slider-fill: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-slider-fill: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-slider-fill: var(--ui-color-danger, #dc2626);
  }

  :host([orientation="vertical"]) {
    --ui-slider-width: auto;
  }

  :host([orientation="vertical"]) .control {
    justify-items: center;
  }

  :host([orientation="vertical"]) .track-wrap {
    inline-size: max(var(--ui-slider-thumb-size), 26px);
    block-size: 200px;
    margin-inline: auto;
  }

  :host([orientation="vertical"]) .track {
    inline-size: var(--ui-slider-track-size);
    block-size: 100%;
    margin-inline: auto;
  }

  :host([orientation="vertical"]) .range-fill {
    left: 50%;
    transform: translateX(-50%);
    inline-size: var(--ui-slider-track-size);
    right: auto;
    top: calc(100% - var(--ui-slider-end, 0%));
    bottom: var(--ui-slider-start, 0%);
    block-size: auto;
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-slider-fill) 86%, #ffffff 14%),
      var(--ui-slider-fill)
    );
  }

  :host([orientation="vertical"]) .inputs {
    transform: rotate(-90deg);
    transform-origin: center;
    inset: auto;
    left: 50%;
    top: 50%;
    width: 200px;
    height: 26px;
    translate: -50% -50%;
  }

  :host([orientation="vertical"]) .marks {
    left: calc(100% + 8px);
    right: auto;
    top: 0;
    bottom: 0;
    width: 56px;
  }

  :host([orientation="vertical"]) .mark {
    transform: translateY(50%);
    left: 0 !important;
    right: 0;
    justify-items: start;
  }

  :host([orientation="vertical"]) .mark::before {
    inline-size: 8px;
    block-size: 1px;
  }

  :host([headless]) .shell {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .shell,
    input[type="range"]::-webkit-slider-thumb,
    input[type="range"]::-moz-range-thumb {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .shell {
      border-width: 2px;
      box-shadow: none;
    }

    .track,
    .range-fill {
      block-size: max(var(--ui-slider-track-size), 8px);
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-slider-bg: Canvas;
      --ui-slider-text: CanvasText;
      --ui-slider-muted: CanvasText;
      --ui-slider-track: CanvasText;
      --ui-slider-fill: Highlight;
      --ui-slider-focus: Highlight;
      --ui-slider-shadow: none;
      --ui-slider-thumb-shadow: none;
    }

    .shell {
      border-color: CanvasText;
    }

    input[type="range"]::-webkit-slider-thumb,
    input[type="range"]::-moz-range-thumb {
      background: Highlight;
      border-color: HighlightText;
      box-shadow: none;
    }
  }
`;

function parseNumber(raw: string | null, fallback: number): number {
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseMarks(raw: string | null, min: number, max: number): SliderMark[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        if (typeof entry === 'number') return { value: entry };
        if (entry && typeof entry === 'object' && Number.isFinite(Number((entry as any).value))) {
          return {
            value: Number((entry as any).value),
            label: (entry as any).label != null ? String((entry as any).label) : undefined
          };
        }
        return null;
      })
      .filter((entry): entry is SliderMark => !!entry)
      .map((entry) => ({ ...entry, value: clamp(entry.value, min, max) }));
  } catch {
    return [];
  }
}

function isTruthy(raw: string | null, fallback = false): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function formatValue(
  format: string,
  singleValue: number,
  start: number,
  end: number,
  min: number,
  max: number,
  isRange: boolean
): string {
  const span = Math.max(1, max - min);
  const percent = Math.round(((singleValue - min) / span) * 100);
  const startPercent = Math.round(((start - min) / span) * 100);
  const endPercent = Math.round(((end - min) / span) * 100);

  if (format === 'percent') {
    if (isRange) return `${startPercent}% – ${endPercent}%`;
    return `${percent}%`;
  }

  if (format === 'range') {
    if (isRange) return `${start} – ${end}`;
    return `${singleValue}`;
  }

  return `${singleValue}`;
}

const SLIDER_LIVE_ATTRS = new Set([
  'value',
  'value-start',
  'value-end',
  'min',
  'max',
  'step',
  'disabled',
  'headless',
  'orientation',
  'size',
  'variant',
  'tone',
  'show-value',
  'format',
  'name',
  'name-start',
  'name-end'
]);

export class UISlider extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'value-start',
      'value-end',
      'min',
      'max',
      'step',
      'disabled',
      'headless',
      'range',
      'orientation',
      'size',
      'variant',
      'tone',
      'show-value',
      'format',
      'label',
      'description',
      'marks',
      'name',
      'name-start',
      'name-end'
    ];
  }

  private _startInput: HTMLInputElement | null = null;
  private _endInput: HTMLInputElement | null = null;
  private _valueEl: HTMLElement | null = null;
  private _trackWrap: HTMLElement | null = null;
  private _rangeMode = false;
  private _value = 0;
  private _valueStart = 0;
  private _valueEnd = 0;

  constructor() {
    super();
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('input', this._onInput as EventListener, true);
    this.root.addEventListener('change', this._onChange as EventListener, true);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('input', this._onInput as EventListener, true);
    this.root.removeEventListener('change', this._onChange as EventListener, true);
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (SLIDER_LIVE_ATTRS.has(name) && this._trackWrap) {
      this._syncFromAttributes();
      this._syncDom();
      return;
    }

    if (this.isConnected) this.requestRender();
  }

  get value(): number {
    return this._rangeMode ? this._valueEnd : this._value;
  }

  set value(next: number) {
    const normalized = Number(next);
    if (!Number.isFinite(normalized)) return;
    this.setAttribute('value', String(normalized));
  }

  get valueStart(): number {
    return this._valueStart;
  }

  set valueStart(next: number) {
    const normalized = Number(next);
    if (!Number.isFinite(normalized)) return;
    this.setAttribute('value-start', String(normalized));
  }

  get valueEnd(): number {
    return this._valueEnd;
  }

  set valueEnd(next: number) {
    const normalized = Number(next);
    if (!Number.isFinite(normalized)) return;
    this.setAttribute('value-end', String(normalized));
  }

  private _syncFromAttributes(): void {
    const min = parseNumber(this.getAttribute('min'), 0);
    const max = Math.max(min, parseNumber(this.getAttribute('max'), 100));
    const step = Math.max(0.0001, parseNumber(this.getAttribute('step'), 1));
    this._rangeMode = this.hasAttribute('range');

    const attrValue = parseNumber(this.getAttribute('value'), this._value || min);
    const attrStart = parseNumber(this.getAttribute('value-start'), this._valueStart || min);
    const attrEnd = parseNumber(this.getAttribute('value-end'), this._valueEnd || attrValue || min);

    if (!this._rangeMode) {
      this._value = clamp(attrValue, min, max);
      this._valueStart = min;
      this._valueEnd = this._value;
      return;
    }

    const start = clamp(Math.min(attrStart, attrEnd), min, max);
    const end = clamp(Math.max(attrStart, attrEnd), min, max);

    this._valueStart = Math.round(start / step) * step;
    this._valueEnd = Math.round(end / step) * step;
    this._value = this._valueEnd;
  }

  private _detail() {
    const min = parseNumber(this.getAttribute('min'), 0);
    const max = Math.max(min, parseNumber(this.getAttribute('max'), 100));
    const step = Math.max(0.0001, parseNumber(this.getAttribute('step'), 1));
    const span = Math.max(1, max - min);
    const percent = ((this._value - min) / span) * 100;
    const percentStart = ((this._valueStart - min) / span) * 100;
    const percentEnd = ((this._valueEnd - min) / span) * 100;

    return {
      value: this._rangeMode ? this._valueEnd : this._value,
      valueStart: this._valueStart,
      valueEnd: this._valueEnd,
      range: this._rangeMode,
      min,
      max,
      step,
      percent,
      percentStart,
      percentEnd
    };
  }

  private _emit(name: string): void {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: this._detail(),
        bubbles: true,
        composed: true
      })
    );
  }

  private _syncDom(): void {
    const min = parseNumber(this.getAttribute('min'), 0);
    const max = Math.max(min, parseNumber(this.getAttribute('max'), 100));
    const step = Math.max(0.0001, parseNumber(this.getAttribute('step'), 1));
    const disabled = isTruthy(this.getAttribute('disabled')) || this.hasAttribute('disabled');
    const format = this.getAttribute('format') || (this._rangeMode ? 'range' : 'percent');
    const showValue = isTruthy(this.getAttribute('show-value'), true);

    const span = Math.max(1, max - min);
    const startPercent = ((this._valueStart - min) / span) * 100;
    const endPercent = ((this._valueEnd - min) / span) * 100;

    if (this._startInput) {
      this._startInput.min = String(min);
      this._startInput.max = String(max);
      this._startInput.step = String(step);
      this._startInput.value = String(this._rangeMode ? this._valueStart : this._value);
      this._startInput.disabled = disabled;
      this._startInput.name = this._rangeMode
        ? (this.getAttribute('name-start') || this.getAttribute('name') || '')
        : (this.getAttribute('name') || '');
      this._startInput.setAttribute('aria-valuemin', String(min));
      this._startInput.setAttribute('aria-valuemax', String(max));
      this._startInput.setAttribute('aria-valuenow', String(this._rangeMode ? this._valueStart : this._value));
    }

    if (this._endInput) {
      this._endInput.min = String(min);
      this._endInput.max = String(max);
      this._endInput.step = String(step);
      this._endInput.value = String(this._valueEnd);
      this._endInput.disabled = disabled;
      this._endInput.name = this.getAttribute('name-end') || this.getAttribute('name') || '';
      this._endInput.setAttribute('aria-valuemin', String(min));
      this._endInput.setAttribute('aria-valuemax', String(max));
      this._endInput.setAttribute('aria-valuenow', String(this._valueEnd));
    }

    if (this._trackWrap) {
      this._trackWrap.style.setProperty('--ui-slider-start', `${this._rangeMode ? startPercent : 0}%`);
      this._trackWrap.style.setProperty('--ui-slider-end', `${endPercent}%`);
    }

    if (this._valueEl) {
      this._valueEl.textContent = formatValue(format, this._value, this._valueStart, this._valueEnd, min, max, this._rangeMode);
      if (showValue) this._valueEl.removeAttribute('hidden');
      else this._valueEl.setAttribute('hidden', '');
    }

    this.setAttribute('aria-valuemin', String(min));
    this.setAttribute('aria-valuemax', String(max));
    this.setAttribute('aria-valuenow', String(this.value));
    this.setAttribute('aria-orientation', this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal');
    this.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  }

  private _updateFromInput(target: HTMLInputElement): void {
    const min = parseNumber(this.getAttribute('min'), 0);
    const max = Math.max(min, parseNumber(this.getAttribute('max'), 100));
    const step = Math.max(0.0001, parseNumber(this.getAttribute('step'), 1));

    if (!this._rangeMode) {
      this._value = clamp(parseNumber(target.value, this._value), min, max);
      this._valueStart = min;
      this._valueEnd = this._value;
      this.setAttribute('value', String(this._value));
      return;
    }

    const raw = clamp(parseNumber(target.value, target.classList.contains('start') ? this._valueStart : this._valueEnd), min, max);

    if (target.classList.contains('start')) {
      this._valueStart = Math.min(raw, this._valueEnd);
    } else {
      this._valueEnd = Math.max(raw, this._valueStart);
    }

    this._valueStart = Math.round(this._valueStart / step) * step;
    this._valueEnd = Math.round(this._valueEnd / step) * step;
    this._value = this._valueEnd;

    this.setAttribute('value-start', String(this._valueStart));
    this.setAttribute('value-end', String(this._valueEnd));
    this.setAttribute('value', String(this._valueEnd));
  }

  private _onInput(event: Event): void {
    if (isTruthy(this.getAttribute('disabled')) || this.hasAttribute('disabled')) return;
    const target = event.target as HTMLInputElement | null;
    if (!target || target.type !== 'range') return;

    this._updateFromInput(target);
    this._syncDom();
    this._emit('input');
    this._emit('valuechange');
  }

  private _onChange(event: Event): void {
    if (isTruthy(this.getAttribute('disabled')) || this.hasAttribute('disabled')) return;
    const target = event.target as HTMLInputElement | null;
    if (!target || target.type !== 'range') return;

    this._updateFromInput(target);
    this._syncDom();
    this._emit('change');
  }

  private _renderMarks(min: number, max: number): string {
    const marks = parseMarks(this.getAttribute('marks'), min, max);
    if (!marks.length) return '<div class="marks" part="marks" hidden></div>';

    const span = Math.max(1, max - min);
    const orientation = this.getAttribute('orientation') === 'vertical' ? 'vertical' : 'horizontal';

    const html = marks
      .map((mark) => {
        const percent = ((mark.value - min) / span) * 100;
        const posStyle = orientation === 'vertical' ? `style="bottom:${percent}%"` : `style="left:${percent}%"`;
        const markLabel = mark.label != null ? escapeHtml(mark.label) : String(mark.value);
        return `
          <span class="mark" ${posStyle}>
            <span class="mark-label">${markLabel}</span>
          </span>
        `;
      })
      .join('');

    return `<div class="marks" part="marks">${html}</div>`;
  }

  protected override render(): void {
    this._syncFromAttributes();

    const min = parseNumber(this.getAttribute('min'), 0);
    const max = Math.max(min, parseNumber(this.getAttribute('max'), 100));
    const label = this.getAttribute('label') || '';
    const description = this.getAttribute('description') || '';
    const hasMeta = !!label || !!description;
    const marks = this._renderMarks(min, max);
    const hasMarks = parseMarks(this.getAttribute('marks'), min, max).length > 0;
    const safeLabel = escapeHtml(label);
    const safeDescription = escapeHtml(description);
    const startAriaLabel = safeLabel ? `${safeLabel} start` : 'Slider value';
    const endAriaLabel = safeLabel ? `${safeLabel} end` : 'Slider end value';

    this.setContent(`
      <style>${style}</style>
      <div class="shell" part="shell" role="group" data-has-marks="${hasMarks}">
        <div class="meta" part="meta" ${hasMeta ? '' : 'hidden'}>
          <span class="label" part="label" ${label ? '' : 'hidden'}>${safeLabel}</span>
          <span class="value" part="value"></span>
        </div>
        <p class="description" part="description" ${description ? '' : 'hidden'}>${safeDescription}</p>
        <div class="control" part="control">
          <div class="track-wrap" part="track-wrap">
            <div class="track" part="track"></div>
            <div class="range-fill" part="range"></div>
            <div class="inputs" part="inputs">
              <input class="start" type="range" aria-label="${startAriaLabel}" />
              ${this._rangeMode ? `<input class="end" type="range" aria-label="${endAriaLabel}" />` : ''}
            </div>
            ${marks}
          </div>
        </div>
      </div>
    `);

    this._startInput = this.root.querySelector('input.start') as HTMLInputElement | null;
    this._endInput = this.root.querySelector('input.end') as HTMLInputElement | null;
    this._valueEl = this.root.querySelector('.value') as HTMLElement | null;
    this._trackWrap = this.root.querySelector('.track-wrap') as HTMLElement | null;

    this._syncDom();
  }

  protected override shouldRenderOnAttributeChange(
    name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return !SLIDER_LIVE_ATTRS.has(name);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-slider')) {
  customElements.define('ui-slider', UISlider);
}
