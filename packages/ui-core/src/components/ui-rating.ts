import { ElementBase } from '../ElementBase';

type RatingVariant = 'default' | 'soft' | 'glass' | 'contrast' | 'minimal';
type RatingSize = 'sm' | 'md' | 'lg';
type RatingShape = 'rounded' | 'square' | 'pill';
type RatingTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
type RatingState = 'idle' | 'hover' | 'focus' | 'disabled';
type RatingAnimation = 'scale' | 'pulse' | 'none';

const style = `
  :host {
    --ui-rating-size: var(--ui-control-size, var(--ui-font-size-lg, 20px));
    --ui-rating-gap: var(--ui-control-gap, 6px);
    --ui-rating-color: var(--ui-color-warning, #f59e0b);
    --ui-rating-color-empty: var(--ui-color-muted, #cbd5e1);
    --ui-rating-color-hover: color-mix(in srgb, var(--ui-rating-color) 86%, #ffffff);
    --ui-rating-color-active: color-mix(in srgb, var(--ui-rating-color) 92%, #ffffff);
    --ui-rating-color-disabled: color-mix(in srgb, var(--ui-color-muted, #cbd5e1) 60%, transparent);
    --ui-rating-shadow: 0 1px 2px rgba(2, 6, 23, 0.12);
    --ui-rating-duration: var(--ui-motion-base, 160ms);
    --ui-rating-easing: var(--ui-motion-easing, cubic-bezier(0.2, 0.8, 0.2, 1));
    --ui-rating-radius: var(--ui-control-radius, var(--ui-radius, 4px));
    display: inline-flex;
    align-items: center;
    gap: var(--ui-rating-gap);
    color-scheme: light dark;
    font-family: var(--ui-font-family, var(--default-font-family, system-ui, sans-serif));
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  :host([block]) {
    display: flex;
    inline-size: 100%;
    justify-content: flex-start;
  }

  :host([tone="neutral"]) {
    --ui-rating-color: color-mix(in srgb, var(--ui-color-muted, #64748b) 74%, var(--ui-color-text, #0f172a) 26%);
  }

  :host([tone="info"]) {
    --ui-rating-color: var(--ui-color-primary, #2563eb);
  }

  :host([tone="success"]) {
    --ui-rating-color: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-rating-color: var(--ui-color-warning, #f59e0b);
  }

  :host([tone="danger"]) {
    --ui-rating-color: var(--ui-color-danger, #dc2626);
  }

  :host([theme="dark"]) {
    --ui-rating-color-empty: color-mix(in srgb, var(--ui-color-text, #e2e8f0) 22%, transparent);
    --ui-rating-color-disabled: color-mix(in srgb, var(--ui-color-text, #e2e8f0) 32%, transparent);
  }

  :host([theme="brand"]) {
    --ui-rating-color: color-mix(in srgb, var(--ui-color-primary, #2563eb) 78%, #0ea5e9 22%);
  }

  :host([variant="soft"]) {
    --ui-rating-color: color-mix(in srgb, var(--ui-rating-color) 60%, #ffffff);
    --ui-rating-color-hover: color-mix(in srgb, var(--ui-rating-color) 70%, #ffffff);
    --ui-rating-color-active: color-mix(in srgb, var(--ui-rating-color) 80%, #ffffff);
  }

  :host([variant="glass"]) {
    --ui-rating-shadow: 0 8px 20px rgba(2, 6, 23, 0.14), 0 24px 48px rgba(2, 6, 23, 0.16);
  }

  :host([variant="contrast"]) {
    --ui-rating-color: #fbbf24;
    --ui-rating-color-empty: #334155;
    --ui-rating-color-hover: #fde047;
    --ui-rating-color-active: #fde047;
    --ui-rating-shadow: 0 14px 34px rgba(2, 6, 23, 0.46), 0 30px 60px rgba(2, 6, 23, 0.42);
  }

  :host([variant="minimal"]) {
    --ui-rating-shadow: none;
    --ui-rating-color: color-mix(in srgb, var(--ui-rating-color) 70%, #ffffff);
    --ui-rating-color-empty: color-mix(in srgb, var(--ui-color-muted, #cbd5e1) 50%, transparent);
    --ui-rating-color-hover: color-mix(in srgb, var(--ui-rating-color) 80%, #ffffff);
    --ui-rating-color-active: color-mix(in srgb, var(--ui-rating-color) 85%, #ffffff);
  }

  :host([shape="square"]) {
    --ui-rating-radius: 0px;
  }

  :host([shape="pill"]) {
    --ui-rating-radius: 999px;
  }

  :host([size="sm"]) {
    --ui-rating-size: 16px;
    --ui-rating-gap: 4px;
  }

  :host([size="lg"]) {
    --ui-rating-size: 24px;
    --ui-rating-gap: 8px;
  }

  :host([state="disabled"]) {
    opacity: 0.62;
    cursor: not-allowed;
  }

  :host([data-animation="scale"]) .star:not([data-state="disabled"]) {
    transition: transform var(--ui-rating-duration) var(--ui-rating-easing);
  }

  :host([data-animation="scale"]) .star:not([data-state="disabled"]):hover {
    transform: scale(1.1);
  }

  :host([data-animation="pulse"]) .star:not([data-state="disabled"]):hover {
    animation: ui-rating-pulse 900ms ease-in-out infinite;
  }

  :host([data-animation="none"]) .star {
    transition: none;
    animation: none;
  }

  :host([headless]) .stars {
    display: none;
  }

  .stars {
    display: inline-flex;
    align-items: center;
    gap: var(--ui-rating-gap);
    position: relative;
  }

  .star {
    inline-size: var(--ui-rating-size);
    block-size: var(--ui-rating-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--ui-rating-color-empty);
    cursor: pointer;
    position: relative;
    transition:
      color var(--ui-rating-duration) var(--ui-rating-easing),
      transform var(--ui-rating-duration) var(--ui-rating-easing);
    outline: none;
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    flex: 0 0 auto;
  }

  .star:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-rating-color) 70%, transparent);
    outline-offset: 2px;
  }

  .star[data-state="disabled"] {
    color: var(--ui-rating-color-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

  .star-icon {
    position: relative;
    inline-size: 100%;
    block-size: 100%;
    display: block;
  }

  .star-base,
  .star-fill {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    display: block;
  }

  .star-base {
    color: var(--ui-rating-color-empty);
  }

  .star-fill {
    color: var(--ui-rating-color-active);
  }

  .star[data-state="hover"] .star-fill {
    color: var(--ui-rating-color-hover);
  }

  /* The clip area changes width, but the inner icon stays full-size */
  .star-fill-clip {
    position: absolute;
    inset: 0 auto 0 0;
    inline-size: var(--fill-percent, 0%);
    block-size: 100%;
    overflow: hidden;
  }

  .star-base svg {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    width: 100%;
    height: 100%;
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 1;
    filter: drop-shadow(var(--ui-rating-shadow, none));
    pointer-events: none;
  }

  /* Critical fix: full-size icon inside the clip, never shrink with clip width */
  .star-fill-svg {
    position: absolute;
    inset: 0;
    inline-size: var(--ui-rating-size);
    block-size: var(--ui-rating-size);
    width: var(--ui-rating-size);
    height: var(--ui-rating-size);
    min-inline-size: var(--ui-rating-size);
    min-block-size: var(--ui-rating-size);
    fill: currentColor;
    stroke: currentColor;
    stroke-width: 1;
    filter: drop-shadow(var(--ui-rating-shadow, none));
    pointer-events: none;
  }

  .star::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: var(--ui-rating-radius);
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    transition: opacity 140ms var(--ui-rating-easing);
  }

  .star:hover::after {
    opacity: 0.08;
  }

  .star:active::after {
    opacity: 0.12;
  }

  .label {
    font-size: var(--ui-font-size-sm, 12px);
    color: var(--ui-color-muted, #64748b);
    white-space: nowrap;
  }

  .value {
    font-size: var(--ui-font-size-sm, 12px);
    color: var(--ui-color-text, #0f172a);
    font-weight: 600;
    white-space: nowrap;
    margin-inline-start: 6px;
  }

  .sr-only {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }

  @keyframes ui-rating-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .star {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .star {
      border: 1px solid currentColor;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-rating-color: Highlight;
      --ui-rating-color-empty: ButtonFace;
      --ui-rating-color-hover: Highlight;
      --ui-rating-color-active: Highlight;
      --ui-rating-color-disabled: ButtonFace;
    }

    .star {
      forced-color-adjust: auto;
      color: ButtonText;
      background: ButtonFace;
    }

    .star-base,
    .star-fill {
      forced-color-adjust: auto;
    }
  }
`;

function isTruthyAttr(value: string | null): boolean {
  return value !== null && value.toLowerCase() !== 'false' && value !== '0';
}

function toVariant(value: string | null): RatingVariant {
  if (value === 'soft' || value === 'glass' || value === 'contrast' || value === 'minimal') return value;
  return 'default';
}

function toSize(value: string | null): RatingSize {
  if (value === 'sm' || value === 'lg') return value;
  return 'md';
}

function toShape(value: string | null): RatingShape {
  if (value === 'square' || value === 'pill') return value;
  return 'rounded';
}

function toTone(value: string | null): RatingTone | null {
  if (value === 'neutral' || value === 'info' || value === 'success' || value === 'warning' || value === 'danger') {
    return value;
  }
  return null;
}

function toState(value: string | null): RatingState {
  if (value === 'hover' || value === 'focus' || value === 'disabled') return value;
  return 'idle';
}

function toAnimation(value: string | null): RatingAnimation | null {
  if (value === 'scale' || value === 'pulse' || value === 'none') return value;
  return null;
}

function toRadius(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed === 'full') return '999px';
  if (/^-?\\d+(\\.\\d+)?$/.test(trimmed)) return `${trimmed}px`;
  return trimmed;
}

function toPrecision(value: string | null): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 1;
  if (n === 0.5) return 0.5;
  return 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, step: number): number {
  const rounded = Math.round(value / step) * step;
  return Number(rounded.toFixed(2));
}

function readHostString(el: HTMLElement, name: string): string | null {
  const attr = el.getAttribute(name);
  if (attr != null) return attr;
  const prop = (el as unknown as Record<string, unknown>)[name];
  if (typeof prop === 'string' && prop.length > 0) return prop;
  return null;
}

function readHostBoolean(el: HTMLElement, name: string): boolean {
  const attr = el.getAttribute(name);
  if (attr != null) return isTruthyAttr(attr);
  const prop = (el as unknown as Record<string, unknown>)[name];
  if (typeof prop === 'boolean') return prop;
  if (typeof prop === 'string') return isTruthyAttr(prop);
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function createStarSVG(className?: string): string {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true"${className ? ` class="${className}"` : ''}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
  `;
}

export class UIRating extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'max',
      'precision',
      'disabled',
      'readonly',
      'variant',
      'size',
      'headless',
      'theme',
      'tone',
      'state',
      'animation',
      'shape',
      'radius',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
      'label',
      'show-value'
    ];
  }

  private _stars: HTMLButtonElement[] = [];
  private _value = 0;
  private _max = 5;
  private _precision = 1;
  private _disabled = false;
  private _readonly = false;
  private _hoverValue = 0;

  constructor() {
    super();
    this._onRootClick = this._onRootClick.bind(this);
    this._onRootMouseMove = this._onRootMouseMove.bind(this);
    this._onRootMouseLeave = this._onRootMouseLeave.bind(this);
    this._onRootFocusIn = this._onRootFocusIn.bind(this);
    this._onRootFocusOut = this._onRootFocusOut.bind(this);
    this._onRootKeyDown = this._onRootKeyDown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClick, true);
    this.root.addEventListener('mousemove', this._onRootMouseMove, true);
    this.root.addEventListener('mouseleave', this._onRootMouseLeave, true);
    this.root.addEventListener('focusin', this._onRootFocusIn, true);
    this.root.addEventListener('focusout', this._onRootFocusOut, true);
    this.root.addEventListener('keydown', this._onRootKeyDown, true);
  }

  disconnectedCallback() {
    this.root.removeEventListener('click', this._onRootClick, true);
    this.root.removeEventListener('mousemove', this._onRootMouseMove, true);
    this.root.removeEventListener('mouseleave', this._onRootMouseLeave, true);
    this.root.removeEventListener('focusin', this._onRootFocusIn, true);
    this.root.removeEventListener('focusout', this._onRootFocusOut, true);
    this.root.removeEventListener('keydown', this._onRootKeyDown, true);
    super.disconnectedCallback();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'value') {
      const next = Number(newValue);
      if (Number.isFinite(next)) {
        this._value = clamp(roundToStep(next, this._precision), 0, this._max);
        this._syncStars();
        this._syncAria();
      }
    }

    if (name === 'max') {
      const next = Number(newValue);
      if (Number.isFinite(next) && next > 0) {
        this._max = Math.max(1, next);
        if (this._value > this._max) {
          this._value = this._max;
        }
        this._syncStars();
        this._syncAria();
      }
    }

    if (name === 'precision') {
      this._precision = toPrecision(newValue);
      this._value = clamp(roundToStep(this._value, this._precision), 0, this._max);
      this._hoverValue = this._hoverValue > 0
        ? clamp(roundToStep(this._hoverValue, this._precision), 0, this._max)
        : 0;
      this._syncStars();
      this._syncAria();
    }

    if (name === 'disabled') this._disabled = newValue !== null;
    if (name === 'readonly') this._readonly = newValue !== null;

    if (name === 'animation') {
      const animation = toAnimation(newValue);
      if (animation) this.setAttribute('data-animation', animation);
      else this.removeAttribute('data-animation');
    }

    if (this.isConnected) this.requestRender();
  }

  get value(): number {
    return this._value;
  }

  set value(next: number) {
    const normalized = Number(next);
    if (!Number.isFinite(normalized)) return;

    const clamped = clamp(roundToStep(normalized, this._precision), 0, this._max);
    const oldValue = this._value;
    if (oldValue === clamped) return;

    this._value = clamped;
    this.setAttribute('value', String(this._value));
    this._syncStars();
    this._syncAria();
    this._emit('change');
    this._emit('input');
  }

  get max(): number {
    return this._max;
  }

  set max(next: number) {
    const normalized = Number(next);
    if (!Number.isFinite(normalized)) return;

    this._max = Math.max(1, normalized);
    this.setAttribute('max', String(this._max));

    if (this._value > this._max) {
      this._value = this._max;
      this.setAttribute('value', String(this._value));
    }

    this.requestRender();
  }

  get precision(): number {
    return this._precision;
  }

  set precision(next: number) {
    this._precision = next === 0.5 ? 0.5 : 1;
    this.setAttribute('precision', String(this._precision));
    this._value = clamp(roundToStep(this._value, this._precision), 0, this._max);
    this.requestRender();
  }

  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(next: boolean) {
    this._disabled = !!next;
    if (this._disabled) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
    this.requestRender();
  }

  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(next: boolean) {
    this._readonly = !!next;
    if (this._readonly) this.setAttribute('readonly', '');
    else this.removeAttribute('readonly');
    this.requestRender();
  }

  private _getStarFromEventTarget(target: EventTarget | null): HTMLButtonElement | null {
    if (!(target instanceof Element)) return null;
    return target.closest('.star') as HTMLButtonElement | null;
  }

  private _getStarIndex(star: HTMLButtonElement | null): number {
    if (!star) return -1;
    const index = Number(star.dataset.index);
    return Number.isFinite(index) ? index : -1;
  }

  private _getValueFromPointer(event: MouseEvent, star: HTMLButtonElement): number {
    const index = this._getStarIndex(star);
    if (index === -1) return this._value;

    if (this._precision !== 0.5) {
      return index + 1;
    }

    const rect = star.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const half = x <= rect.width / 2 ? 0.5 : 1;
    return index + half;
  }

  private _formatValue(value: number): string {
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  private _getAriaValueText(value: number): string {
    return `${this._formatValue(value)} out of ${this._max}`;
  }

  private _onRootClick(event: Event): void {
    if (this._disabled || this._readonly) return;
    const mouseEvent = event as MouseEvent;
    const star = this._getStarFromEventTarget(mouseEvent.target);
    if (!star) return;
    this.value = this._getValueFromPointer(mouseEvent, star);
  }

  private _onRootMouseMove(event: Event): void {
    if (this._disabled || this._readonly) return;
    const mouseEvent = event as MouseEvent;
    const star = this._getStarFromEventTarget(mouseEvent.target);
    if (!star) return;

    this._hoverValue = this._getValueFromPointer(mouseEvent, star);
    this.setAttribute('state', 'hover');
    this._syncStars();
  }

  private _onRootMouseLeave(): void {
    if (this._disabled || this._readonly) return;
    this._hoverValue = 0;
    this.removeAttribute('state');
    this._syncStars();
  }

  private _onRootFocusIn(event: Event): void {
    if (this._disabled || this._readonly) return;
    const star = this._getStarFromEventTarget(event.target);
    const starIndex = this._getStarIndex(star);
    if (starIndex === -1) return;
    this._hoverValue = starIndex + 1;
    this.setAttribute('state', 'focus');
    this._syncStars();
  }

  private _onRootFocusOut(): void {
    if (this._disabled || this._readonly) return;
    this._hoverValue = 0;
    this.removeAttribute('state');
    this._syncStars();
  }

  private _onRootKeyDown(event: Event): void {
    if (this._disabled || this._readonly) return;
    const keyboardEvent = event as KeyboardEvent;
    const star = this._getStarFromEventTarget(keyboardEvent.target);
    const starIndex = this._getStarIndex(star);
    if (starIndex === -1) return;

    let newValue = this._value;
    const step = this._precision;

    switch (keyboardEvent.key) {
      case 'ArrowRight':
      case 'ArrowUp':
      case '+':
        newValue = clamp(this._value + step, 0, this._max);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
      case '-':
        newValue = clamp(this._value - step, 0, this._max);
        break;
      case 'Home':
        newValue = 0;
        break;
      case 'End':
        newValue = this._max;
        break;
      case ' ':
      case 'Enter':
        newValue = starIndex + 1;
        break;
      default:
        return;
    }

    keyboardEvent.preventDefault();
    this.value = newValue;
  }

  private _getFillPercent(starNumber: number, targetValue: number): number {
    const diff = targetValue - (starNumber - 1);
    if (diff >= 1) return 100;
    if (diff <= 0) return 0;
    return diff * 100;
  }

  private _syncStars(): void {
    const targetValue = this._hoverValue > 0 ? this._hoverValue : this._value;

    this._stars.forEach((star, index) => {
      const starNumber = index + 1;
      const fill = this._getFillPercent(starNumber, targetValue);
      star.style.setProperty('--fill-percent', `${fill}%`);

      if (this._disabled) {
        star.setAttribute('data-state', 'disabled');
        star.setAttribute('aria-disabled', 'true');
        return;
      }

      star.removeAttribute('aria-disabled');

      if (this._hoverValue > 0) {
        if (fill > 0) star.setAttribute('data-state', 'hover');
        else star.removeAttribute('data-state');
        return;
      }

      if (fill > 0) {
        star.setAttribute('data-state', 'active');
      } else {
        star.removeAttribute('data-state');
      }
    });

    this._syncAria();
  }

  private _syncAria(): void {
    const currentValueText = this._getAriaValueText(this._value);

    this.setAttribute('role', 'slider');
    this.setAttribute('tabindex', this._disabled || this._readonly ? '-1' : '0');
    this.setAttribute('aria-valuemin', '0');
    this.setAttribute('aria-valuemax', String(this._max));
    this.setAttribute('aria-valuenow', String(this._value));
    this.setAttribute('aria-valuetext', currentValueText);
    this.setAttribute('aria-orientation', 'horizontal');
    this.setAttribute('aria-disabled', this._disabled ? 'true' : 'false');
    this.setAttribute('aria-readonly', this._readonly ? 'true' : 'false');

    this._stars.forEach((star, index) => {
      const starNumber = index + 1;
      const fill = this._getFillPercent(starNumber, this._hoverValue > 0 ? this._hoverValue : this._value);

      star.setAttribute('role', 'presentation');
      star.setAttribute('tabindex', '-1');
      star.setAttribute('aria-hidden', 'true');
      star.setAttribute('aria-checked', 'false');

      const labelValue = this._precision === 0.5
        ? `${index + 0.5} to ${index + 1}`
        : `${index + 1}`;

      star.setAttribute('data-fill', String(fill));
      star.setAttribute('data-star-value', String(starNumber));
      star.setAttribute('aria-label', `${labelValue}`);
    });
  }

  private _emit(name: string) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          value: this._value,
          max: this._max,
          precision: this._precision,
          disabled: this._disabled,
          readonly: this._readonly
        },
        bubbles: true,
        composed: true
      })
    );
  }

  protected render() {
    const disabled = readHostBoolean(this, 'disabled');
    const readonly = readHostBoolean(this, 'readonly');
    const variant = toVariant(readHostString(this, 'variant'));
    const size = toSize(readHostString(this, 'size'));
    const theme = readHostString(this, 'theme');
    const tone = toTone(readHostString(this, 'tone'));
    const state = toState(readHostString(this, 'state'));
    const animation = toAnimation(readHostString(this, 'animation'));
    const shape = toShape(readHostString(this, 'shape'));
    const radius = toRadius(readHostString(this, 'radius'));
    const precision = toPrecision(readHostString(this, 'precision'));
    const ariaLabel = readHostString(this, 'aria-label');
    const ariaLabelledBy = readHostString(this, 'aria-labelledby');
    const ariaDescribedBy = readHostString(this, 'aria-describedby');
    const label = readHostString(this, 'label');
    const showValue = readHostBoolean(this, 'show-value');

    const rawValue = readHostString(this, 'value');
    const rawMax = readHostString(this, 'max');

    this._max = Math.max(1, Number(rawMax) || 5);
    this._precision = precision;
    this._value = clamp(roundToStep(Number(rawValue) || 0, this._precision), 0, this._max);
    this._disabled = disabled;
    this._readonly = readonly;

    if (animation) this.setAttribute('data-animation', animation);
    else this.removeAttribute('data-animation');

    if (theme === 'dark' || theme === 'brand') this.setAttribute('theme', theme);
    else this.removeAttribute('theme');

    if (tone) this.setAttribute('tone', tone);
    else this.removeAttribute('tone');

    if (state === 'disabled') this.setAttribute('state', 'disabled');
    else if (state !== 'idle') this.setAttribute('state', state);
    else this.removeAttribute('state');

    if (shape === 'square' || shape === 'pill') this.setAttribute('shape', shape);
    else this.removeAttribute('shape');

    if (variant === 'default') this.removeAttribute('variant');
    else this.setAttribute('variant', variant);

    if (size === 'md') this.removeAttribute('size');
    else this.setAttribute('size', size);

    if (radius) this.style.setProperty('--ui-rating-radius', radius);
    else this.style.removeProperty('--ui-rating-radius');

    this.setAttribute('precision', String(this._precision));

    const starsHtml = Array.from({ length: this._max }, (_, index) => `
      <button
        type="button"
        class="star"
        tabindex="-1"
        data-index="${index}"
        part="star"
        style="--fill-percent: 0%;"
      >
        <span class="star-icon">
          <span class="star-base">${createStarSVG()}</span>
          <span class="star-fill">
            <span class="star-fill-clip">
              ${createStarSVG('star-fill-svg')}
            </span>
          </span>
        </span>
      </button>
    `).join('');

    const valueText = showValue ? `${this._formatValue(this._value)} / ${this._max}` : '';

    this.setContent(`
      <style>${style}</style>
      <div
        class="stars"
        part="stars"
        aria-hidden="true"
      >
        ${starsHtml}
      </div>
      ${
        label || showValue
          ? `
            <div class="label" part="label">
              ${label ? `<span class="label-text">${escapeHtml(label)}</span>` : ''}
              ${showValue ? `<span class="value">${escapeHtml(valueText)}</span>` : ''}
            </div>
          `
          : ''
      }
    `);

    queueMicrotask(() => {
      this._stars = Array.from(this.root.querySelectorAll('.star')) as HTMLButtonElement[];
      this._syncStars();
    });

    if (ariaLabel) this.setAttribute('aria-label', ariaLabel);
    else this.removeAttribute('aria-label');

    if (ariaLabelledBy) this.setAttribute('aria-labelledby', ariaLabelledBy);
    else this.removeAttribute('aria-labelledby');

    if (ariaDescribedBy) this.setAttribute('aria-describedby', ariaDescribedBy);
    else this.removeAttribute('aria-describedby');

    if (this._disabled) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');

    if (this._readonly) this.setAttribute('readonly', '');
    else this.removeAttribute('readonly');

    this._syncAria();
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-rating')) {
  customElements.define('ui-rating', UIRating);
}