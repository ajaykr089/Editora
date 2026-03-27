import { ElementBase } from '../ElementBase';

type OdometerAnimation = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | 'spring';
type AnimatedNumberVariant = 'odometer' | 'inline' | 'digital' | 'analog';
type AnimatedNumberFormat = 'decimal' | 'currency' | 'percent' | 'number';
type AnimatedNumberNotation = 'standard' | 'compact';
type OdometerDirection = 'up' | 'down' | 'auto';

type Token =
  | { kind: 'digit'; value: string }
  | { kind: 'text'; value: string; textType: 'group' | 'decimal' | 'symbol' | 'sign' | 'literal' };

type TextTokenType = Extract<Token, { kind: 'text' }>['textType'];

const style = `
  :host {
    --ui-odometer-font-family: var(--ui-font-family-mono, var(--font-mono, ui-monospace, 'SF Mono', Menlo, Monaco, Consolas, monospace));
    --ui-odometer-font-size: var(--font-size-4, 1.25rem);
    --ui-odometer-font-weight: 700;
    --ui-odometer-line-height: 1.05;
    --ui-odometer-letter-spacing: 0.03em;
    --ui-odometer-color: var(--ui-color-text, #0f172a);
    --ui-odometer-digit-width: 0.95ch;
    --ui-odometer-digit-gap: 0.12em;
    --ui-odometer-separator-gap: 0.12em;
    --ui-odometer-container-gap: 0.14em;
    --ui-odometer-window-height: calc(var(--ui-odometer-font-size) * var(--ui-odometer-line-height));
    --ui-odometer-container-padding: 0;
    --ui-odometer-container-bg: transparent;
    --ui-odometer-container-border: none;
    --ui-odometer-container-radius: 999px;
    --ui-odometer-digit-bg: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(226, 232, 240, 0.9));
    --ui-odometer-digit-border: 1px solid rgba(148, 163, 184, 0.35);
    --ui-odometer-digit-radius: 0.18em;
    --ui-odometer-digit-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 1px 2px rgba(15, 23, 42, 0.12);
    --ui-odometer-separator-opacity: 0.7;
    --ui-odometer-affix-opacity: 0.82;

    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    font-family: var(--ui-odometer-font-family);
    font-size: var(--ui-odometer-font-size);
    font-weight: var(--ui-odometer-font-weight);
    line-height: var(--ui-odometer-line-height);
    letter-spacing: var(--ui-odometer-letter-spacing);
    color: var(--ui-odometer-color);
    font-variant-numeric: tabular-nums;
    visibility: visible !important;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host([size="sm"]) {
    --ui-odometer-font-size: var(--font-size-2, 0.875rem);
  }

  :host([size="lg"]) {
    --ui-odometer-font-size: var(--font-size-6, 1.5rem);
  }

  :host([size="xl"]) {
    --ui-odometer-font-size: var(--font-size-8, 2rem);
  }

  :host([tone="brand"]) {
    --ui-odometer-color: var(--ui-color-primary, #2563eb);
  }

  :host([tone="success"]) {
    --ui-odometer-color: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-odometer-color: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-odometer-color: var(--ui-color-danger, #dc2626);
  }

  :host([theme="dark"]) {
    --ui-odometer-color: #e2e8f0;
    --ui-odometer-digit-bg: linear-gradient(180deg, rgba(30, 41, 59, 0.94), rgba(15, 23, 42, 0.98));
    --ui-odometer-digit-border: 1px solid rgba(148, 163, 184, 0.24);
    --ui-odometer-digit-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 1px 2px rgba(15, 23, 42, 0.35);
  }

  :host([theme="brand"]) {
    --ui-odometer-color: var(--ui-color-primary, #2563eb);
    --ui-odometer-digit-bg: linear-gradient(180deg, rgba(219, 234, 254, 0.98), rgba(191, 219, 254, 0.94));
    --ui-odometer-digit-border: 1px solid rgba(37, 99, 235, 0.22);
  }

  :host([variant="inline"]) {
    --ui-odometer-digit-width: 0.78ch;
    --ui-odometer-digit-gap: 0;
    --ui-odometer-separator-gap: 0;
    --ui-odometer-container-gap: 0;
    --ui-odometer-digit-bg: transparent;
    --ui-odometer-digit-border: none;
    --ui-odometer-digit-radius: 0;
    --ui-odometer-digit-shadow: none;
    --ui-odometer-letter-spacing: 0.01em;
    --ui-odometer-affix-opacity: 1;
  }

  :host([variant="digital"]) {
    --ui-odometer-font-family: var(--ui-font-family-mono, var(--font-mono, 'SF Mono', Menlo, Monaco, Consolas, monospace));
    --ui-odometer-color: #86efac;
    --ui-odometer-digit-width: 0.88ch;
    --ui-odometer-digit-gap: 0.08em;
    --ui-odometer-container-gap: 0.12em;
    --ui-odometer-letter-spacing: 0.05em;
    --ui-odometer-container-padding: 0.22em 0.34em;
    --ui-odometer-container-bg: linear-gradient(180deg, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.96));
    --ui-odometer-container-border: 1px solid rgba(148, 163, 184, 0.12);
    --ui-odometer-container-radius: 0.8em;
    --ui-odometer-digit-bg: linear-gradient(180deg, rgba(2, 6, 23, 0.98), rgba(3, 18, 11, 0.98));
    --ui-odometer-digit-border: 1px solid rgba(134, 239, 172, 0.18);
    --ui-odometer-digit-radius: 0.16em;
    --ui-odometer-digit-shadow: inset 0 0 0 1px rgba(134, 239, 172, 0.08), 0 0 14px rgba(34, 197, 94, 0.12);
    --ui-odometer-separator-opacity: 0.9;
    --ui-odometer-value-shadow: 0 0 10px rgba(74, 222, 128, 0.2), 0 0 22px rgba(34, 197, 94, 0.14);
  }

  :host([variant="analog"]) {
    --ui-odometer-font-family: var(--ui-font-family-serif, Georgia, 'Times New Roman', serif);
    --ui-odometer-color: #3f2f1e;
    --ui-odometer-digit-width: 1.08ch;
    --ui-odometer-digit-gap: 0.14em;
    --ui-odometer-container-gap: 0.16em;
    --ui-odometer-letter-spacing: 0.015em;
    --ui-odometer-container-padding: 0.18em 0.26em;
    --ui-odometer-container-bg: linear-gradient(180deg, rgba(248, 244, 232, 0.98), rgba(232, 223, 203, 0.98));
    --ui-odometer-container-border: 1px solid rgba(120, 92, 55, 0.28);
    --ui-odometer-container-radius: 999px;
    --ui-odometer-digit-bg: radial-gradient(circle at 50% 38%, rgba(255, 251, 241, 0.98), rgba(223, 211, 188, 0.96));
    --ui-odometer-digit-border: 1px solid rgba(120, 92, 55, 0.25);
    --ui-odometer-digit-radius: 999px;
    --ui-odometer-digit-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 2px rgba(120, 92, 55, 0.14), 0 2px 6px rgba(63, 47, 30, 0.12);
    --ui-odometer-separator-opacity: 0.85;
    --ui-odometer-affix-opacity: 0.92;
    --ui-odometer-value-shadow: 0 1px 0 rgba(255, 251, 241, 0.7), 0 2px 3px rgba(120, 92, 55, 0.14);
  }

  .container {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--ui-odometer-container-gap);
    padding: var(--ui-odometer-container-padding);
    background: var(--ui-odometer-container-bg);
    border: var(--ui-odometer-container-border);
    border-radius: var(--ui-odometer-container-radius);
  }

  .container[data-variant="digital"] {
    overflow: hidden;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 12px 24px rgba(2, 6, 23, 0.28);
  }

  .container[data-variant="digital"]::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.05), transparent 25%, transparent 75%, rgba(255, 255, 255, 0.03)),
      repeating-linear-gradient(180deg, rgba(134, 239, 172, 0.06) 0, rgba(134, 239, 172, 0.06) 1px, transparent 1px, transparent 3px);
    opacity: calc(0.52 + var(--ui-odometer-motion-intensity, 0) * 0.22);
    pointer-events: none;
  }

  .container[data-variant="analog"] {
    box-shadow:
      inset 0 1px 0 rgba(255, 251, 241, 0.9),
      inset 0 -1px 0 rgba(120, 92, 55, 0.08),
      0 10px 24px rgba(120, 92, 55, 0.12);
  }

  .container[data-variant="analog"]::before {
    content: '';
    position: absolute;
    inset: 0.18em;
    border-radius: inherit;
    border: 1px solid rgba(120, 92, 55, 0.14);
    opacity: 0.7;
    pointer-events: none;
  }

  .container[data-variant="analog"]::after {
    content: '';
    position: absolute;
    left: 0.36em;
    right: 0.36em;
    top: 50%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(120, 92, 55, 0.18), transparent);
    transform: translateY(-50%);
    pointer-events: none;
  }

  .digits {
    display: inline-flex;
    align-items: center;
    gap: var(--ui-odometer-digit-gap);
  }

  .value-display {
    display: inline-flex;
    align-items: center;
    white-space: pre;
  }

  .value-display.digital-display {
    position: relative;
    z-index: 1;
    text-transform: uppercase;
    text-shadow: var(--ui-odometer-value-shadow, none);
    transform: translateY(var(--ui-odometer-digital-shift-y, 0)) scaleY(var(--ui-odometer-digital-scale-y, 1));
    filter: brightness(calc(1 + var(--ui-odometer-motion-intensity, 0) * 0.22));
  }

  .value-display.analog-display {
    position: relative;
    z-index: 1;
    text-shadow: var(--ui-odometer-value-shadow, none);
    transform:
      translateX(var(--ui-odometer-analog-shift-x, 0))
      translateY(var(--ui-odometer-analog-shift-y, 0))
      scale(var(--ui-odometer-analog-scale, 1));
    filter: blur(var(--ui-odometer-analog-blur, 0));
  }

  .digit {
    position: relative;
    display: inline-flex;
    width: var(--ui-odometer-digit-width);
    height: var(--ui-odometer-window-height);
    overflow: hidden;
    align-items: stretch;
    justify-content: stretch;
    border-radius: var(--ui-odometer-digit-radius);
    background: var(--ui-odometer-digit-bg);
    border: var(--ui-odometer-digit-border);
    box-shadow: var(--ui-odometer-digit-shadow);
  }

  .digit-track {
    display: flex;
    flex-direction: column;
    width: 100%;
    transform: translateY(var(--ui-odometer-offset, 0));
    will-change: transform;
  }

  .digit-value {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: var(--ui-odometer-digit-width);
    height: var(--ui-odometer-window-height);
  }

  .text {
    display: inline-flex;
    align-items: center;
    white-space: pre;
  }

  .separator {
    opacity: var(--ui-odometer-separator-opacity);
  }

  .group {
    margin: 0 var(--ui-odometer-separator-gap);
  }

  .prefix,
  .suffix {
    display: inline-flex;
    align-items: center;
    opacity: var(--ui-odometer-affix-opacity);
    font-weight: 600;
    white-space: pre;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .digit-track {
      will-change: auto;
    }
  }
`;

function isTruthyAttr(value: string | null): boolean {
  return value !== null && value.toLowerCase() !== 'false' && value !== '0';
}

function readHostString(el: HTMLElement, name: string): string | null {
  const attr = el.getAttribute(name);
  if (attr != null) return attr;
  const prop = (el as unknown as Record<string, unknown>)[name];
  if (typeof prop === 'string' && prop.length > 0) return prop;
  return null;
}

function readHostNumber(el: HTMLElement, name: string): number | null {
  const attr = el.getAttribute(name);
  if (attr != null) {
    const num = parseFloat(attr);
    return Number.isNaN(num) ? null : num;
  }
  const prop = (el as unknown as Record<string, unknown>)[name];
  if (typeof prop === 'number') return Number.isNaN(prop) ? null : prop;
  if (typeof prop === 'string') {
    const num = parseFloat(prop);
    return Number.isNaN(num) ? null : num;
  }
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
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function clampValue(value: number, min: number | null, max: number | null): number {
  let next = value;
  if (min !== null && next < min) next = min;
  if (max !== null && next > max) next = max;
  return next;
}

function normalizeVariant(value: string | null): AnimatedNumberVariant {
  if (value === 'inline' || value === 'digital' || value === 'odometer' || value === 'analog') return value;
  return 'inline';
}

function normalizeFormat(value: string | null): AnimatedNumberFormat {
  if (value === 'currency' || value === 'percent' || value === 'number' || value === 'decimal') return value;
  return 'decimal';
}

function normalizeNotation(value: string | null): AnimatedNumberNotation {
  return value === 'compact' ? 'compact' : 'standard';
}

function normalizeDirection(value: string | null): OdometerDirection {
  if (value === 'up' || value === 'down' || value === 'auto') return value;
  return 'auto';
}

function getFractionDigits(el: HTMLElement): { minimumFractionDigits?: number; maximumFractionDigits?: number } {
  const legacyDecimals = readHostNumber(el, 'decimals');
  const minimumFractionDigits = readHostNumber(el, 'minimum-fraction-digits');
  const maximumFractionDigits = readHostNumber(el, 'maximum-fraction-digits');

  if (minimumFractionDigits != null || maximumFractionDigits != null) {
    return {
      minimumFractionDigits: minimumFractionDigits != null ? minimumFractionDigits : undefined,
      maximumFractionDigits: maximumFractionDigits != null ? maximumFractionDigits : undefined,
    };
  }

  if (legacyDecimals != null) {
    return {
      minimumFractionDigits: legacyDecimals,
      maximumFractionDigits: legacyDecimals,
    };
  }

  return {};
}

function formatValueToParts(el: HTMLElement, value: number): { tokens: Token[]; text: string } {
  const format = normalizeFormat(readHostString(el, 'format'));
  const locale = readHostString(el, 'locale') || undefined;
  const currency = readHostString(el, 'currency') || undefined;
  const notation = normalizeNotation(readHostString(el, 'notation'));
  const decimalSeparator = readHostString(el, 'decimal-separator');
  const groupSeparator = readHostString(el, 'group-separator');
  const fractionDigits = getFractionDigits(el);

  const options: Intl.NumberFormatOptions = {
    style: format === 'currency' && currency ? 'currency' : format === 'percent' ? 'percent' : 'decimal',
    currency: format === 'currency' && currency ? currency : undefined,
    notation,
    useGrouping: true,
    numberingSystem: 'latn',
    minimumFractionDigits: fractionDigits.minimumFractionDigits,
    maximumFractionDigits: fractionDigits.maximumFractionDigits,
  };

  let parts: Intl.NumberFormatPart[];
  try {
    parts = new Intl.NumberFormat(locale, options).formatToParts(value);
  } catch {
    parts = new Intl.NumberFormat(undefined, options).formatToParts(value);
  }

  const tokens: Token[] = [];

  for (const part of parts) {
    const mappedValue =
      part.type === 'decimal' && decimalSeparator != null
        ? decimalSeparator
        : part.type === 'group' && groupSeparator != null
          ? groupSeparator
          : part.value;

    for (const char of mappedValue) {
      if (/[0-9]/.test(char)) {
        tokens.push({ kind: 'digit', value: char });
        continue;
      }

      let textType: TextTokenType = 'literal';
      if (part.type === 'group') textType = 'group';
      else if (part.type === 'decimal') textType = 'decimal';
      else if (part.type === 'currency' || part.type === 'percentSign' || part.type === 'unit') textType = 'symbol';
      else if (part.type === 'minusSign' || part.type === 'plusSign') textType = 'sign';

      tokens.push({ kind: 'text', value: char, textType });
    }
  }

  return {
    tokens,
    text: tokens.map((token) => token.value).join(''),
  };
}

function getTrackDigits(direction: 'up' | 'down'): string[] {
  return direction === 'down'
    ? ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0']
    : ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
}

function getTrackOffset(digit: string, direction: 'up' | 'down'): number {
  const value = parseInt(digit, 10);
  if (Number.isNaN(value)) return 0;
  return direction === 'down' ? -(9 - value) * 100 : -value * 100;
}

function resolveAnimationProgress(animation: OdometerAnimation, t: number): number {
  if (animation === 'linear') return t;
  if (animation === 'ease-in') return t * t * t;
  if (animation === 'ease-out') return 1 - Math.pow(1 - t, 3);
  if (animation === 'ease-in-out') {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  if (animation === 'spring') {
    if (t === 0 || t === 1) return t;
    return Math.min(1, 1 - Math.cos(t * Math.PI * 4) * Math.exp(-t * 6));
  }
  return t * t * (3 - 2 * t);
}

export class UIOdometer extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'variant',
      'size',
      'tone',
      'theme',
      'format',
      'locale',
      'currency',
      'notation',
      'decimals',
      'minimum-fraction-digits',
      'maximum-fraction-digits',
      'duration',
      'animation',
      'direction',
      'prefix',
      'suffix',
      'decimal-separator',
      'group-separator',
      'separator',
      'animate',
      'animate-on-mount',
      'count-up',
      'min',
      'max',
      'auto-format',
      'label',
    ];
  }

  private _currentValue = 0;
  private _targetValue = 0;
  private _startValue = 0;
  private _startTime: number | null = null;
  private _animationFrame: number | null = null;
  private _initialized = false;
  private _animationProgress = 1;
  private _motionDirection: 'up' | 'down' | 'none' = 'none';

  connectedCallback() {
    super.connectedCallback();

    if (this._initialized) return;

    const initialValue = this._readClampedValue();
    this._targetValue = initialValue;

    if (this._shouldAnimateOnMount() && initialValue !== this._getMountStartValue()) {
      this._currentValue = this._getMountStartValue();
      this._initialized = true;
      this.requestRender();
      this._animateToValue(initialValue);
      return;
    }

    this._currentValue = initialValue;
    this._initialized = true;
    this.requestRender();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopAnimation();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;

    if (name === 'value') {
      const target = this._readClampedValue(newValue);

      if (!this.isConnected) {
        this._currentValue = target;
        this._targetValue = target;
        return;
      }

      if (!this._initialized) {
        this._currentValue = target;
        this._targetValue = target;
        this._initialized = true;
        this.requestRender();
        return;
      }

      this._animateToValue(target);
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  private _readClampedValue(rawValue?: string | null): number {
    const parsed =
      rawValue != null
        ? (() => {
            const num = parseFloat(rawValue);
            return Number.isNaN(num) ? 0 : num;
          })()
        : readHostNumber(this, 'value') ?? 0;

    return clampValue(parsed, readHostNumber(this, 'min'), readHostNumber(this, 'max'));
  }

  private _getMountStartValue(): number {
    return clampValue(0, readHostNumber(this, 'min'), readHostNumber(this, 'max'));
  }

  private _shouldAnimate(): boolean {
    return readHostBoolean(this, 'animate') && !this._isReducedMotion();
  }

  private _shouldAnimateOnMount(): boolean {
    return (readHostBoolean(this, 'animate-on-mount') || readHostBoolean(this, 'count-up')) && this._shouldAnimate();
  }

  private _stopAnimation() {
    if (this._animationFrame !== null) {
      cancelAnimationFrame(this._animationFrame);
      this._animationFrame = null;
    }
    this._startTime = null;
    this._animationProgress = 1;
  }

  private _animateToValue(target: number) {
    if (!this._shouldAnimate()) {
      const previousValue = this._currentValue;
      this._stopAnimation();
      this._currentValue = target;
      this._targetValue = target;
      this._motionDirection = target > previousValue ? 'up' : target < previousValue ? 'down' : 'none';
      this.requestRender();
      return;
    }

    this._stopAnimation();
    this._startValue = this._currentValue;
    this._targetValue = target;
    this._startTime = null;
    this._animationProgress = 0;
    this._motionDirection = target > this._startValue ? 'up' : target < this._startValue ? 'down' : 'none';
    this._animationFrame = requestAnimationFrame((timestamp) => this._animate(timestamp));
  }

  private _animate(timestamp: number) {
    if (this._startTime === null) {
      this._startTime = timestamp;
    }

    const duration = Math.max(1, readHostNumber(this, 'duration') ?? 800);
    const animation = (readHostString(this, 'animation') || 'spring') as OdometerAnimation;
    const elapsed = timestamp - this._startTime;
    const progress = Math.min(1, elapsed / duration);
    const easedProgress = resolveAnimationProgress(animation, progress);

    this._animationProgress = progress;
    this._currentValue = this._startValue + (this._targetValue - this._startValue) * easedProgress;
    this.requestRender();

    if (progress < 1) {
      this._animationFrame = requestAnimationFrame((nextTimestamp) => this._animate(nextTimestamp));
      return;
    }

    this._currentValue = this._targetValue;
    this._animationFrame = null;
    this._startTime = null;
    this._animationProgress = 1;
    this.requestRender();
    this._emitComplete();
  }

  private _emitComplete() {
    this.dispatchEvent(
      new CustomEvent('complete', {
        detail: { value: this._currentValue },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _isReducedMotion(): boolean {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }

  protected render() {
    const variant = normalizeVariant(readHostString(this, 'variant'));
    const prefix = readHostString(this, 'prefix') || '';
    const suffix = readHostString(this, 'suffix') || '';
    const label = readHostString(this, 'label');
    const formatted = formatValueToParts(this, this._currentValue);
    const accessibleLabel = label || `${prefix}${formatted.text}${suffix}`;
    const isAnimating = this._animationFrame !== null;
    const motionIntensity = isAnimating ? 1 - this._animationProgress : 0;
    const motionSign = this._motionDirection === 'down' ? -1 : this._motionDirection === 'up' ? 1 : 0;

    let valueDisplayClass = 'value-display';
    let valueDisplayStyle = '';

    if (variant === 'digital') {
      valueDisplayClass += ' digital-display';
      valueDisplayStyle = [
        `--ui-odometer-motion-intensity: ${motionIntensity.toFixed(3)}`,
        `--ui-odometer-digital-shift-y: ${(motionSign * motionIntensity * 0.16).toFixed(3)}em`,
        `--ui-odometer-digital-scale-y: ${(1 + motionIntensity * 0.08).toFixed(3)}`,
      ].join('; ');
    } else if (variant === 'analog') {
      valueDisplayClass += ' analog-display';
      valueDisplayStyle = [
        `--ui-odometer-motion-intensity: ${motionIntensity.toFixed(3)}`,
        `--ui-odometer-analog-shift-x: ${(motionSign * motionIntensity * 0.08).toFixed(3)}em`,
        `--ui-odometer-analog-shift-y: ${(-motionIntensity * 0.05).toFixed(3)}em`,
        `--ui-odometer-analog-scale: ${(1 + motionIntensity * 0.03).toFixed(3)}`,
        `--ui-odometer-analog-blur: ${(motionIntensity * 0.035).toFixed(3)}em`,
      ].join('; ');
    }

    let contentMarkup = `<span class="${valueDisplayClass}" part="value" aria-hidden="true"${
      valueDisplayStyle ? ` style="${valueDisplayStyle}"` : ''
    }>${escapeHtml(formatted.text)}</span>`;

    if (variant === 'odometer') {
      const directionPreference = normalizeDirection(readHostString(this, 'direction'));
      const motionDirection =
        directionPreference === 'auto'
          ? this._targetValue >= this._startValue
            ? 'up'
            : 'down'
          : directionPreference;

      const digitTrack = getTrackDigits(motionDirection);

      contentMarkup = `
        <span class="digits" part="digits" role="img" aria-label="${escapeHtml(accessibleLabel)}">
          ${formatted.tokens
            .map((token) => {
              if (token.kind === 'digit') {
                const trackContent = digitTrack
                  .map((digit) => `<span class="digit-value" aria-hidden="true">${digit}</span>`)
                  .join('');
                const offset = getTrackOffset(token.value, motionDirection);

                return `
                  <span class="digit" part="digit" aria-hidden="true">
                    <span class="digit-track" style="--ui-odometer-offset: ${offset}%;">
                      ${trackContent}
                    </span>
                  </span>
                `;
              }

              const textToken = token as Extract<Token, { kind: 'text' }>;
              const classes = ['text'];
              if (textToken.textType === 'group' || textToken.textType === 'decimal') classes.push('separator');
              if (textToken.textType === 'group') classes.push('group');
              if (textToken.textType === 'decimal') classes.push('decimal');
              if (textToken.textType === 'symbol') classes.push('symbol');
              if (textToken.textType === 'sign') classes.push('sign');

              return `<span class="${classes.join(' ')}" part="separator" aria-hidden="true">${escapeHtml(textToken.value)}</span>`;
            })
            .join('')}
        </span>
      `;
    }

    this.setContent(`
      <style>${style}</style>
      <span class="container" part="container" data-variant="${variant}" data-animating="${isAnimating ? 'true' : 'false'}" data-motion="${this._motionDirection}">
        ${prefix ? `<span class="prefix" part="prefix" aria-hidden="true">${escapeHtml(prefix)}</span>` : ''}
        ${contentMarkup}
        ${suffix ? `<span class="suffix" part="suffix" aria-hidden="true">${escapeHtml(suffix)}</span>` : ''}
      </span>
      <span class="sr-only" aria-live="polite" aria-atomic="true">${escapeHtml(accessibleLabel)}</span>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-odometer')) {
  customElements.define('ui-odometer', UIOdometer);
}
