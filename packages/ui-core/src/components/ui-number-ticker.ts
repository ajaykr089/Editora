import { ElementBase } from '../ElementBase';

export type NumberTickerTone = 'brand' | 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type NumberTickerSize = 'sm' | 'md' | 'lg' | 'xl' | '1' | '2' | '3' | '4';
export type NumberTickerAlign = 'start' | 'center' | 'end' | 'left' | 'right';
export type NumberTickerEasing =
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring'
  | 'bounce'
  | 'overshoot';
export type NumberTickerFormatStyle = 'decimal' | 'currency';
export type NumberTickerCurrencyDisplay = 'symbol' | 'narrowSymbol' | 'code' | 'name';
export type NumberTickerNotation = 'standard' | 'compact';
export type NumberTickerCompactDisplay = 'short' | 'long';
export type NumberTickerSignDisplay = 'auto' | 'always' | 'exceptZero' | 'never';
export type NumberTickerAnimation = 'interpolate' | 'odometer';
export type NumberTickerTrigger = 'immediate' | 'visible';
export type NumberTickerStaggerFrom = 'start' | 'end' | 'center';

export type NumberTickerFormatterContext = {
  formatted: string;
  intl: string;
  value: number;
  prefix: string;
  suffix: string;
  locale?: string;
  formatStyle: NumberTickerFormatStyle;
  currency?: string;
  notation: NumberTickerNotation;
  signDisplay: NumberTickerSignDisplay;
  fractionDigits: number | null;
};

export type NumberTickerFormatter = (value: number, context: NumberTickerFormatterContext) => string;

type SizePreset = {
  fontSize: string;
  letterSpacing: string;
  lineHeight: string;
};

const DEFAULT_DURATION_MS = 1200;
const DEFAULT_DELAY_MS = 0;
const DEFAULT_EASING: NumberTickerEasing = 'ease-out';
const DEFAULT_FORMAT_STYLE: NumberTickerFormatStyle = 'decimal';
const DEFAULT_FRACTION_DIGITS = 0;
const DEFAULT_VISIBILITY_THRESHOLD = 0.4;
const MAX_FRACTION_DIGITS = 6;

const EASINGS = new Set<NumberTickerEasing>([
  'linear',
  'ease-in',
  'ease-out',
  'ease-in-out',
  'spring',
  'bounce',
  'overshoot',
]);
const FORMAT_STYLES = new Set<NumberTickerFormatStyle>(['decimal', 'currency']);
const CURRENCY_DISPLAYS = new Set<NumberTickerCurrencyDisplay>(['symbol', 'narrowSymbol', 'code', 'name']);
const NOTATIONS = new Set<NumberTickerNotation>(['standard', 'compact']);
const COMPACT_DISPLAYS = new Set<NumberTickerCompactDisplay>(['short', 'long']);
const SIGN_DISPLAYS = new Set<NumberTickerSignDisplay>(['auto', 'always', 'exceptZero', 'never']);
const ANIMATIONS = new Set<NumberTickerAnimation>(['interpolate', 'odometer']);
const TRIGGERS = new Set<NumberTickerTrigger>(['immediate', 'visible']);
const STAGGER_FROM = new Set<NumberTickerStaggerFrom>(['start', 'end', 'center']);

const SIZE_PRESETS: Record<'sm' | 'md' | 'lg' | 'xl', SizePreset> = {
  sm: {
    fontSize: '14px',
    letterSpacing: '-0.02em',
    lineHeight: '1',
  },
  md: {
    fontSize: '22px',
    letterSpacing: '-0.04em',
    lineHeight: '0.98',
  },
  lg: {
    fontSize: '36px',
    letterSpacing: '-0.05em',
    lineHeight: '0.94',
  },
  xl: {
    fontSize: '56px',
    letterSpacing: '-0.06em',
    lineHeight: '0.9',
  },
};

const DIGIT_STACK = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const style = `
  :host {
    --ui-number-ticker-color: var(--ui-color-text, var(--ui-text, #0f172a));
    --ui-number-ticker-accent: var(--ui-color-primary, var(--ui-primary, #2563eb));
    --ui-number-ticker-font-size: ${SIZE_PRESETS.md.fontSize};
    --ui-number-ticker-font-weight: 780;
    --ui-number-ticker-letter-spacing: ${SIZE_PRESETS.md.letterSpacing};
    --ui-number-ticker-line-height: ${SIZE_PRESETS.md.lineHeight};
    --ui-number-ticker-align: start;
    --ui-number-ticker-roll-duration: 520ms;
    --ui-number-ticker-roll-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --ui-number-ticker-transition:
      color 180ms cubic-bezier(0.2, 0.9, 0.24, 1),
      text-shadow 180ms cubic-bezier(0.2, 0.9, 0.24, 1);

    display: inline-grid;
    min-inline-size: 0;
    color: var(--ui-number-ticker-color);
    font-family: "IBM Plex Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    font-variant-numeric: tabular-nums lining-nums;
    box-sizing: border-box;
  }

  :host([size="sm"]),
  :host([size="1"]) {
    --ui-number-ticker-font-size: ${SIZE_PRESETS.sm.fontSize};
    --ui-number-ticker-letter-spacing: ${SIZE_PRESETS.sm.letterSpacing};
    --ui-number-ticker-line-height: ${SIZE_PRESETS.sm.lineHeight};
  }

  :host([size="md"]),
  :host([size="2"]) {
    --ui-number-ticker-font-size: ${SIZE_PRESETS.md.fontSize};
    --ui-number-ticker-letter-spacing: ${SIZE_PRESETS.md.letterSpacing};
    --ui-number-ticker-line-height: ${SIZE_PRESETS.md.lineHeight};
  }

  :host([size="lg"]),
  :host([size="3"]) {
    --ui-number-ticker-font-size: ${SIZE_PRESETS.lg.fontSize};
    --ui-number-ticker-letter-spacing: ${SIZE_PRESETS.lg.letterSpacing};
    --ui-number-ticker-line-height: ${SIZE_PRESETS.lg.lineHeight};
  }

  :host([size="xl"]),
  :host([size="4"]) {
    --ui-number-ticker-font-size: ${SIZE_PRESETS.xl.fontSize};
    --ui-number-ticker-letter-spacing: ${SIZE_PRESETS.xl.letterSpacing};
    --ui-number-ticker-line-height: ${SIZE_PRESETS.xl.lineHeight};
  }

  :host([tone="neutral"]) {
    --ui-number-ticker-color: #64748b;
  }

  :host([tone="info"]) {
    --ui-number-ticker-color: #0ea5e9;
  }

  :host([tone="success"]) {
    --ui-number-ticker-color: var(--ui-color-success, #16a34a);
  }

  :host([tone="warning"]) {
    --ui-number-ticker-color: var(--ui-color-warning, #d97706);
  }

  :host([tone="danger"]) {
    --ui-number-ticker-color: var(--ui-color-danger, #dc2626);
  }

  :host([align="left"]),
  :host([align="start"]) {
    --ui-number-ticker-align: start;
  }

  :host([align="center"]) {
    --ui-number-ticker-align: center;
  }

  :host([align="right"]),
  :host([align="end"]) {
    --ui-number-ticker-align: end;
  }

  :host([monospace]) .value {
    font-family: "IBM Plex Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  }

  :host([tabular="false"]) {
    font-variant-numeric: lining-nums proportional-nums;
  }

  .ticker {
    display: inline-flex;
    justify-content: var(--ui-number-ticker-align);
    align-items: baseline;
    min-inline-size: 0;
  }

  .value {
    display: inline-flex;
    align-items: baseline;
    min-inline-size: 0;
    color: var(--ui-number-ticker-color);
    font-size: var(--ui-number-ticker-font-size);
    font-weight: var(--ui-number-ticker-font-weight);
    line-height: var(--ui-number-ticker-line-height);
    letter-spacing: var(--ui-number-ticker-letter-spacing);
    white-space: nowrap;
    text-wrap: nowrap;
    text-shadow:
      0 1px 0 color-mix(in srgb, #ffffff 52%, transparent),
      0 12px 30px color-mix(in srgb, var(--ui-number-ticker-accent) 8%, transparent);
    transition: var(--ui-number-ticker-transition);
  }

  .value[data-mode="odometer"] {
    align-items: center;
    gap: 0.02em;
  }

  .char {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 0;
  }

  .symbol {
    opacity: 0.88;
  }

  .digit {
    display: inline-flex;
    align-items: center;
    block-size: 1em;
    overflow: hidden;
    contain: content;
  }

  .digit-window {
    display: inline-flex;
    block-size: 1em;
    overflow: hidden;
    transform: translateZ(0);
  }

  .digit-track {
    display: grid;
    grid-auto-rows: 1em;
    will-change: transform;
    transition-property: transform;
    transition-duration: var(--ui-number-ticker-roll-duration);
    transition-timing-function: var(--ui-number-ticker-roll-ease);
    transition-delay: var(--ui-number-ticker-digit-delay, 0ms);
    transform: translate3d(0, calc(var(--ui-number-ticker-digit-value, 0) * -1em), 0);
  }

  .digit-track > span {
    display: grid;
    place-items: center;
    block-size: 1em;
    inline-size: 0.72em;
  }

  :host([data-state="waiting"]) .value {
    opacity: 0.92;
  }

  :host([data-animation="odometer"][data-direction="up"]) .digit-track {
    transition-duration: min(calc(var(--ui-number-ticker-roll-duration) + 40ms), 900ms);
  }

  :host([data-direction="up"]) .value {
    text-shadow:
      0 1px 0 color-mix(in srgb, #ffffff 52%, transparent),
      0 14px 34px color-mix(in srgb, var(--ui-number-ticker-accent) 12%, transparent);
  }

  :host([data-direction="down"]) .value {
    text-shadow:
      0 1px 0 color-mix(in srgb, #ffffff 52%, transparent),
      0 10px 24px color-mix(in srgb, var(--ui-number-ticker-accent) 7%, transparent);
  }

  @media (prefers-contrast: more) {
    .value {
      text-shadow: none;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-number-ticker-color: CanvasText;
      --ui-number-ticker-accent: CanvasText;
    }

    .value {
      forced-color-adjust: none;
      text-shadow: none;
    }
  }
`;

export class UINumberTicker extends ElementBase {
  static get observedAttributes() {
    return [
      'value',
      'from',
      'duration',
      'delay',
      'easing',
      'animation',
      'locale',
      'format-style',
      'currency',
      'currency-display',
      'notation',
      'compact-display',
      'fraction-digits',
      'use-grouping',
      'sign-display',
      'prefix',
      'suffix',
      'size',
      'tone',
      'align',
      'font-size',
      'font-weight',
      'letter-spacing',
      'color',
      'tabular',
      'monospace',
      'paused',
      'pause-on-hover',
      'pause-on-focus',
      'trigger',
      'visibility-threshold',
      'stagger',
      'stagger-from',
    ];
  }

  private _valueEl: HTMLElement | null = null;
  private _frame: number | null = null;
  private _currentValue = 0;
  private _animationFrom = 0;
  private _animationTo = 0;
  private _animationDuration = DEFAULT_DURATION_MS;
  private _animationDelay = DEFAULT_DELAY_MS;
  private _animationStartTime = 0;
  private _pausedElapsed = 0;
  private _animationPrepared = false;
  private _initialized = false;
  private _hovering = false;
  private _focusWithin = false;
  private _formatter = new Intl.NumberFormat();
  private _mediaQuery: MediaQueryList | null = null;
  private _customFormatter: NumberTickerFormatter | null = null;
  private _intersectionObserver: IntersectionObserver | null = null;
  private _observerThreshold = DEFAULT_VISIBILITY_THRESHOLD;
  private _isVisible = true;
  private _visibilityGatePending = false;

  constructor() {
    super();
    this._tick = this._tick.bind(this);
    this._onPointerEnter = this._onPointerEnter.bind(this);
    this._onPointerLeave = this._onPointerLeave.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
    this._onFocusOut = this._onFocusOut.bind(this);
    this._onReducedMotionChange = this._onReducedMotionChange.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);
  }

  get formatter(): NumberTickerFormatter | null {
    return this._customFormatter;
  }

  set formatter(value: NumberTickerFormatter | null) {
    this._customFormatter = typeof value === 'function' ? value : null;
    if (this._valueEl) this._renderValue(this._currentValue);
  }

  protected override shouldRenderOnAttributeChange(): boolean {
    return false;
  }

  override connectedCallback(): void {
    this._bindReducedMotion();
    super.connectedCallback();
    if (!this.hasAttribute('aria-live')) this.setAttribute('aria-live', 'off');
    this.addEventListener('pointerenter', this._onPointerEnter);
    this.addEventListener('pointerleave', this._onPointerLeave);
    this.addEventListener('focusin', this._onFocusIn);
    this.addEventListener('focusout', this._onFocusOut);
    this._syncVisibilityObserver();
    this._syncFromAttributes(false);
  }

  override disconnectedCallback(): void {
    this.removeEventListener('pointerenter', this._onPointerEnter);
    this.removeEventListener('pointerleave', this._onPointerLeave);
    this.removeEventListener('focusin', this._onFocusIn);
    this.removeEventListener('focusout', this._onFocusOut);

    if (this._mediaQuery) {
      try {
        this._mediaQuery.removeEventListener('change', this._onReducedMotionChange);
      } catch {
        this._mediaQuery.removeListener(this._onReducedMotionChange);
      }
      this._mediaQuery = null;
    }

    this._disconnectVisibilityObserver();
    this._stopAnimation();
    super.disconnectedCallback();
  }

  play(): void {
    this.removeAttribute('paused');
    this._syncFromAttributes(false);
  }

  pause(): void {
    this.setAttribute('paused', '');
    this._syncFromAttributes(false);
  }

  refresh(): void {
    if (normalizeTrigger(this.getAttribute('trigger')) === 'visible') {
      this._visibilityGatePending = true;
    }
    this._syncFromAttributes(true);
  }

  finish(): void {
    const target = this._resolvedTargetValue();
    this._stopAnimation();
    this._animationPrepared = false;
    this._visibilityGatePending = false;
    this._currentValue = target;
    this._renderValue(target);
    this._setDirection(this._resolvedBaseValue(), target);
    this._setState('completed');
  }

  override attributeChangedCallback(name?: string, oldValue?: string | null, newValue?: string | null): void {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (!name || oldValue === newValue || !this.isConnected || !this._valueEl) return;

    if (name === 'trigger' || name === 'visibility-threshold') {
      if (name === 'trigger' && normalizeTrigger(newValue ?? null) === 'visible' && !this._initialized) {
        this._visibilityGatePending = true;
      }
      this._syncVisibilityObserver();
    }

    this._syncFromAttributes(name === 'from');
  }

  protected render(): void {
    this.setContent(`
      <style>${style}</style>
      <span class="ticker" part="root">
        <span class="value" part="value"></span>
      </span>
    `);

    this._valueEl = this.root.querySelector('.value') as HTMLElement | null;
    this._syncFromAttributes(!this._initialized);
  }

  private _syncFromAttributes(resetToBase: boolean): void {
    if (!this._valueEl) return;

    this._syncStyleOverrides();
    this._syncVisibilityObserver();
    this._formatter = this._createFormatter();
    this._syncMotionPresentation();

    const target = this._resolvedTargetValue();
    const base = this._resolvedBaseValue();

    if (!this._initialized || resetToBase) {
      this._currentValue = base;
      this._renderValue(base);
      if (normalizeTrigger(this.getAttribute('trigger')) === 'visible') {
        this._visibilityGatePending = true;
      }
    } else {
      this._renderValue(this._currentValue);
    }

    this._setDirection(resetToBase ? base : this._currentValue, target);
    this._syncPlayback(target, base, resetToBase);
    this._initialized = true;
  }

  private _syncPlayback(target: number, base: number, resetToBase: boolean): void {
    const reducedMotion = this._prefersReducedMotion();
    const effectivePaused = this._effectivePaused();

    if (this._visibilityGatePending) {
      if (!this._isVisible) {
        this._stopAnimation();
        this._animationPrepared = false;
        this._currentValue = base;
        this._renderValue(base);
        this._setState(effectivePaused ? 'paused' : 'waiting');
        return;
      }
      this._visibilityGatePending = false;
    }

    if (reducedMotion) {
      this._stopAnimation();
      this._animationPrepared = false;
      this._currentValue = target;
      this._renderValue(target);
      this._setState(effectivePaused ? 'paused' : 'completed');
      return;
    }

    if (effectivePaused) {
      if ((resetToBase || !this._animationPrepared) && !approximatelyEqual(base, target)) {
        this._prepareAnimation(base, target);
      }
      this._pauseAnimation();
      this._setState('paused');
      return;
    }

    if (approximatelyEqual(this._currentValue, target)) {
      this._stopAnimation();
      this._animationPrepared = false;
      this._currentValue = target;
      this._renderValue(target);
      this._setState('completed');
      return;
    }

    if (resetToBase || !this._animationPrepared || !approximatelyEqual(target, this._animationTo)) {
      const start = resetToBase ? base : this._currentValue;
      this._prepareAnimation(start, target);
    }

    this._resumeAnimation();
  }

  private _prepareAnimation(from: number, to: number): void {
    this._stopAnimation();
    this._animationFrom = from;
    this._animationTo = to;
    this._animationDuration = Math.max(0, parseTimeToMs(this.getAttribute('duration'), DEFAULT_DURATION_MS));
    this._animationDelay = Math.max(0, parseTimeToMs(this.getAttribute('delay'), DEFAULT_DELAY_MS));
    this._animationStartTime = 0;
    this._pausedElapsed = 0;
    this._animationPrepared = !approximatelyEqual(from, to);
    this._setDirection(from, to);
    this._syncMotionPresentation();

    if (!this._animationPrepared || this._animationDuration === 0) {
      this._currentValue = to;
      this._renderValue(to);
      this._setState('completed');
      return;
    }

    this._renderValue(from);
  }

  private _resumeAnimation(): void {
    if (!this._animationPrepared || this._frame != null || !this.isConnected) return;
    this._setState('running');
    this._frame = this._requestFrame(this._tick);
  }

  private _pauseAnimation(): void {
    if (this._frame != null) {
      this._cancelFrame(this._frame);
      this._frame = null;
    }

    if (this._animationPrepared && this._animationStartTime > 0) {
      this._pausedElapsed = performance.now() - this._animationStartTime;
    }
  }

  private _stopAnimation(): void {
    if (this._frame != null) {
      this._cancelFrame(this._frame);
      this._frame = null;
    }
    this._animationStartTime = 0;
    this._pausedElapsed = 0;
  }

  private _tick(timestamp: number): void {
    this._frame = null;

    if (this._effectivePaused()) {
      this._pauseAnimation();
      this._setState('paused');
      return;
    }

    if (!this._animationPrepared) {
      this._setState('completed');
      return;
    }

    if (this._animationStartTime === 0) {
      this._animationStartTime = timestamp - this._pausedElapsed;
    }

    const elapsed = Math.max(0, timestamp - this._animationStartTime);

    if (elapsed < this._animationDelay) {
      this._renderValue(this._animationFrom);
      this._setState('running');
      this._frame = this._requestFrame(this._tick);
      return;
    }

    const progress = clamp((elapsed - this._animationDelay) / Math.max(this._animationDuration, 1), 0, 1);
    const easedProgress = applyEasing(normalizeEasing(this.getAttribute('easing')), progress);
    const nextValue = this._animationFrom + ((this._animationTo - this._animationFrom) * easedProgress);
    this._currentValue = nextValue;
    this._renderValue(nextValue);

    if (progress >= 1) {
      this._animationPrepared = false;
      this._animationStartTime = 0;
      this._pausedElapsed = 0;
      this._currentValue = this._animationTo;
      this._renderValue(this._animationTo);
      this._setState('completed');
      return;
    }

    this._setState('running');
    this._frame = this._requestFrame(this._tick);
  }

  private _renderValue(value: number): void {
    if (!this._valueEl) return;
    const text = this._formatValue(value);
    const animation = normalizeAnimation(this.getAttribute('animation'));
    this.setAttribute('data-animation', animation);
    this._valueEl.setAttribute('data-mode', animation);

    if (animation === 'odometer') {
      this._renderOdometer(text);
    } else {
      this._valueEl.textContent = text;
    }

    this.setAttribute('data-value', value.toFixed(6));
    this.setAttribute('data-rendered', text);
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', text);
    }
  }

  private _renderOdometer(text: string): void {
    if (!this._valueEl) return;

    const fragment = document.createDocumentFragment();
    const digitCount = Array.from(text).filter(isAsciiDigit).length;
    let digitIndex = 0;
    const stagger = Math.max(0, parseTimeToMs(this.getAttribute('stagger'), 0));
    const staggerFrom = normalizeStaggerFrom(this.getAttribute('stagger-from'));

    for (const char of Array.from(text)) {
      if (isAsciiDigit(char)) {
        const digit = document.createElement('span');
        digit.className = 'char digit';
        digit.setAttribute('part', 'digit');
        digit.style.setProperty(
          '--ui-number-ticker-digit-delay',
          `${resolveStaggerDelay(digitIndex, digitCount, stagger, staggerFrom)}ms`
        );

        const digitWindow = document.createElement('span');
        digitWindow.className = 'digit-window';

        const track = document.createElement('span');
        track.className = 'digit-track';
        track.style.setProperty('--ui-number-ticker-digit-value', String(Number(char)));

        for (const token of DIGIT_STACK) {
          const slot = document.createElement('span');
          slot.textContent = token;
          track.appendChild(slot);
        }

        digitWindow.appendChild(track);
        digit.appendChild(digitWindow);
        fragment.appendChild(digit);
        digitIndex += 1;
        continue;
      }

      const symbol = document.createElement('span');
      symbol.className = 'char symbol';
      symbol.setAttribute('part', 'symbol');
      symbol.textContent = char;
      fragment.appendChild(symbol);
    }

    this._valueEl.replaceChildren(fragment);
  }

  private _formatValue(value: number): string {
    const prefix = this.getAttribute('prefix') || '';
    const suffix = this.getAttribute('suffix') || '';
    const intl = this._formatter.format(value);
    const formatted = `${prefix}${intl}${suffix}`;

    if (this._customFormatter) {
      try {
        return String(
          this._customFormatter(value, {
            formatted,
            intl,
            value,
            prefix,
            suffix,
            locale: this.getAttribute('locale') || undefined,
            formatStyle: normalizeFormatStyle(this.getAttribute('format-style')),
            currency: this.getAttribute('currency') || undefined,
            notation: normalizeNotation(this.getAttribute('notation')),
            signDisplay: normalizeSignDisplay(this.getAttribute('sign-display')),
            fractionDigits: resolveFractionDigits(
              this.getAttribute('fraction-digits'),
              this.getAttribute('value'),
              this.getAttribute('from')
            ),
          })
        );
      } catch {
        return formatted;
      }
    }

    return formatted;
  }

  private _createFormatter(): Intl.NumberFormat {
    const formatStyle = normalizeFormatStyle(this.getAttribute('format-style'));
    const locale = this.getAttribute('locale') || undefined;
    const fractionDigits = resolveFractionDigits(
      this.getAttribute('fraction-digits'),
      this.getAttribute('value'),
      this.getAttribute('from')
    );
    const options: Intl.NumberFormatOptions = {
      style: formatStyle,
      useGrouping: parseBooleanAttribute(this.getAttribute('use-grouping'), true),
      signDisplay: normalizeSignDisplay(this.getAttribute('sign-display')),
      notation: normalizeNotation(this.getAttribute('notation')),
    };

    if (fractionDigits != null) {
      options.minimumFractionDigits = fractionDigits;
      options.maximumFractionDigits = fractionDigits;
    } else if (formatStyle === 'decimal') {
      options.minimumFractionDigits = DEFAULT_FRACTION_DIGITS;
      options.maximumFractionDigits = DEFAULT_FRACTION_DIGITS;
    }

    if (options.notation === 'compact') {
      options.compactDisplay = normalizeCompactDisplay(this.getAttribute('compact-display'));
    }

    if (formatStyle === 'currency') {
      options.currency = normalizeCurrency(this.getAttribute('currency'));
      options.currencyDisplay = normalizeCurrencyDisplay(this.getAttribute('currency-display'));
    }

    try {
      return new Intl.NumberFormat(locale, options);
    } catch {
      const safeOptions: Intl.NumberFormatOptions = {
        style: formatStyle === 'currency' && options.currency ? 'currency' : 'decimal',
        useGrouping: options.useGrouping,
        signDisplay: options.signDisplay,
        notation: options.notation,
        minimumFractionDigits: options.minimumFractionDigits,
        maximumFractionDigits: options.maximumFractionDigits,
      };

      if (safeOptions.notation === 'compact') {
        safeOptions.compactDisplay = options.compactDisplay;
      }

      if (safeOptions.style === 'currency' && options.currency) {
        safeOptions.currency = options.currency;
        safeOptions.currencyDisplay = options.currencyDisplay;
      }

      return new Intl.NumberFormat(undefined, safeOptions);
    }
  }

  private _syncStyleOverrides(): void {
    syncStyleLength(this.style, '--ui-number-ticker-font-size', this.getAttribute('font-size'));
    syncStyleRaw(this.style, '--ui-number-ticker-font-weight', this.getAttribute('font-weight'));
    syncStyleLength(this.style, '--ui-number-ticker-letter-spacing', this.getAttribute('letter-spacing'));
    syncStyleRaw(this.style, '--ui-number-ticker-color', this.getAttribute('color'));
  }

  private _syncMotionPresentation(): void {
    this.style.setProperty(
      '--ui-number-ticker-roll-duration',
      `${Math.round(clamp(this._animationDuration * 0.55, 180, 900))}ms`
    );
    this.style.setProperty('--ui-number-ticker-roll-ease', mapEasingToCss(normalizeEasing(this.getAttribute('easing'))));
  }

  private _resolvedTargetValue(): number {
    return parseFiniteNumber(this.getAttribute('value'), 0);
  }

  private _resolvedBaseValue(): number {
    return parseFiniteNumber(this.getAttribute('from'), 0);
  }

  private _effectivePaused(): boolean {
    if (this.hasAttribute('paused')) return true;
    if (this.hasAttribute('pause-on-hover') && this._hovering) return true;
    if (this.hasAttribute('pause-on-focus') && this._focusWithin) return true;
    return false;
  }

  private _setState(state: 'idle' | 'running' | 'paused' | 'waiting' | 'completed'): void {
    this.setAttribute('data-state', state);
  }

  private _setDirection(from: number, to: number): void {
    const direction = approximatelyEqual(from, to) ? 'flat' : to > from ? 'up' : 'down';
    this.setAttribute('data-direction', direction);
  }

  private _onPointerEnter(): void {
    this._hovering = true;
    if (this.hasAttribute('pause-on-hover')) this._syncFromAttributes(false);
  }

  private _onPointerLeave(): void {
    this._hovering = false;
    if (this.hasAttribute('pause-on-hover')) this._syncFromAttributes(false);
  }

  private _onFocusIn(): void {
    this._focusWithin = true;
    if (this.hasAttribute('pause-on-focus')) this._syncFromAttributes(false);
  }

  private _onFocusOut(event: FocusEvent): void {
    const nextTarget = event.relatedTarget as Node | null;
    this._focusWithin = Boolean(nextTarget && this.contains(nextTarget));
    if (this.hasAttribute('pause-on-focus')) this._syncFromAttributes(false);
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

  private _onReducedMotionChange(): void {
    this._syncFromAttributes(false);
  }

  private _syncVisibilityObserver(): void {
    const trigger = normalizeTrigger(this.getAttribute('trigger'));
    const threshold = clamp(parseFiniteNumber(this.getAttribute('visibility-threshold'), DEFAULT_VISIBILITY_THRESHOLD), 0, 1);

    if (trigger !== 'visible' || typeof IntersectionObserver !== 'function') {
      this._disconnectVisibilityObserver();
      this._isVisible = true;
      this._observerThreshold = threshold;
      return;
    }

    if (this._intersectionObserver && approximatelyEqual(this._observerThreshold, threshold)) return;

    this._disconnectVisibilityObserver();
    this._observerThreshold = threshold;
    this._isVisible = false;
    this._intersectionObserver = new IntersectionObserver(this._onVisibilityChange, {
      threshold: buildThresholdList(threshold),
    });
    this._intersectionObserver.observe(this);
  }

  private _disconnectVisibilityObserver(): void {
    if (!this._intersectionObserver) return;
    this._intersectionObserver.disconnect();
    this._intersectionObserver = null;
  }

  private _onVisibilityChange(entries: IntersectionObserverEntry[]): void {
    const entry = entries[entries.length - 1];
    if (!entry) return;

    const nextVisible = entry.isIntersecting && entry.intersectionRatio >= this._observerThreshold;
    const becameVisible = nextVisible && !this._isVisible;
    this._isVisible = nextVisible;

    if (becameVisible && this._visibilityGatePending) {
      this._syncFromAttributes(false);
    }
  }

  private _prefersReducedMotion(): boolean {
    return Boolean(this._mediaQuery?.matches);
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
}

function normalizeFormatStyle(value: string | null): NumberTickerFormatStyle {
  return value != null && FORMAT_STYLES.has(value as NumberTickerFormatStyle)
    ? (value as NumberTickerFormatStyle)
    : DEFAULT_FORMAT_STYLE;
}

function normalizeAnimation(value: string | null): NumberTickerAnimation {
  return value != null && ANIMATIONS.has(value as NumberTickerAnimation)
    ? (value as NumberTickerAnimation)
    : 'interpolate';
}

function normalizeTrigger(value: string | null): NumberTickerTrigger {
  return value != null && TRIGGERS.has(value as NumberTickerTrigger) ? (value as NumberTickerTrigger) : 'immediate';
}

function normalizeStaggerFrom(value: string | null): NumberTickerStaggerFrom {
  return value != null && STAGGER_FROM.has(value as NumberTickerStaggerFrom)
    ? (value as NumberTickerStaggerFrom)
    : 'start';
}

function normalizeEasing(value: string | null): NumberTickerEasing {
  return value != null && EASINGS.has(value as NumberTickerEasing) ? (value as NumberTickerEasing) : DEFAULT_EASING;
}

function normalizeCurrencyDisplay(value: string | null): NumberTickerCurrencyDisplay {
  return value != null && CURRENCY_DISPLAYS.has(value as NumberTickerCurrencyDisplay)
    ? (value as NumberTickerCurrencyDisplay)
    : 'symbol';
}

function normalizeNotation(value: string | null): NumberTickerNotation {
  return value != null && NOTATIONS.has(value as NumberTickerNotation) ? (value as NumberTickerNotation) : 'standard';
}

function normalizeCompactDisplay(value: string | null): NumberTickerCompactDisplay {
  return value != null && COMPACT_DISPLAYS.has(value as NumberTickerCompactDisplay)
    ? (value as NumberTickerCompactDisplay)
    : 'short';
}

function normalizeSignDisplay(value: string | null): NumberTickerSignDisplay {
  return value != null && SIGN_DISPLAYS.has(value as NumberTickerSignDisplay)
    ? (value as NumberTickerSignDisplay)
    : 'auto';
}

function normalizeCurrency(value: string | null): string {
  const trimmed = value?.trim().toUpperCase();
  return trimmed && /^[A-Z]{3}$/.test(trimmed) ? trimmed : 'USD';
}

function parseFiniteNumber(value: string | null, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseTimeToMs(value: string | null, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const trimmed = value.trim().toLowerCase();
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number.parseFloat(trimmed);
  if (/^-?\d+(\.\d+)?ms$/.test(trimmed)) return Number.parseFloat(trimmed);
  if (/^-?\d+(\.\d+)?s$/.test(trimmed)) return Number.parseFloat(trimmed) * 1000;
  return fallback;
}

function parseInteger(value: string | null, fallback: number): number {
  if (value == null || value.trim() === '') return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBooleanAttribute(value: string | null, fallback: boolean): boolean {
  if (value == null) return fallback;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'off' || normalized === 'no') return false;
  if (normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes') return true;
  return fallback;
}

function normalizeLength(value: string | null): string | null {
  if (value == null || value.trim() === '') return null;
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return null;
  return parts.map((part) => (/^-?\d+(\.\d+)?$/.test(part) ? `${part}px` : part)).join(' ');
}

function syncStyleLength(target: CSSStyleDeclaration, name: string, value: string | null): void {
  const normalized = normalizeLength(value);
  if (normalized == null) {
    target.removeProperty(name);
    return;
  }
  target.setProperty(name, normalized);
}

function syncStyleRaw(target: CSSStyleDeclaration, name: string, value: string | null): void {
  const trimmed = value?.trim();
  if (!trimmed) {
    target.removeProperty(name);
    return;
  }
  target.setProperty(name, trimmed);
}

function countFractionDigits(value: string | null): number {
  if (value == null) return 0;
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const match = trimmed.match(/^-?\d+(?:\.(\d+))?$/);
  return match?.[1]?.length || 0;
}

function resolveFractionDigits(
  configured: string | null,
  targetValue: string | null,
  fromValue: string | null
): number | null {
  const explicit = clamp(parseInteger(configured, -1), -1, MAX_FRACTION_DIGITS);
  if (explicit >= 0) return explicit;
  const inferred = clamp(Math.max(countFractionDigits(targetValue), countFractionDigits(fromValue)), 0, MAX_FRACTION_DIGITS);
  return inferred > 0 ? inferred : null;
}

function applyEasing(easing: NumberTickerEasing, progress: number): number {
  switch (easing) {
    case 'linear':
      return progress;
    case 'ease-in':
      return progress * progress * progress;
    case 'ease-in-out':
      return progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    case 'spring':
      return 1 - Math.cos(progress * Math.PI * 4.5) * Math.exp(-progress * 6);
    case 'bounce':
      return bounceOut(progress);
    case 'overshoot':
      return overshootOut(progress);
    case 'ease-out':
    default:
      return 1 - Math.pow(1 - progress, 3);
  }
}

function bounceOut(progress: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (progress < 1 / d1) return n1 * progress * progress;
  if (progress < 2 / d1) {
    const next = progress - 1.5 / d1;
    return n1 * next * next + 0.75;
  }
  if (progress < 2.5 / d1) {
    const next = progress - 2.25 / d1;
    return n1 * next * next + 0.9375;
  }
  const next = progress - 2.625 / d1;
  return n1 * next * next + 0.984375;
}

function overshootOut(progress: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
}

function mapEasingToCss(easing: NumberTickerEasing): string {
  switch (easing) {
    case 'linear':
      return 'linear';
    case 'ease-in':
      return 'cubic-bezier(0.55, 0.085, 0.68, 0.53)';
    case 'ease-in-out':
      return 'cubic-bezier(0.65, 0, 0.35, 1)';
    case 'spring':
      return 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    case 'bounce':
      return 'cubic-bezier(0.35, 1.4, 0.35, 1)';
    case 'overshoot':
      return 'cubic-bezier(0.2, 1.24, 0.3, 1)';
    case 'ease-out':
    default:
      return 'cubic-bezier(0.22, 1, 0.36, 1)';
  }
}

function resolveStaggerDelay(
  index: number,
  totalDigits: number,
  stagger: number,
  staggerFrom: NumberTickerStaggerFrom
): number {
  if (stagger <= 0 || totalDigits <= 1) return 0;
  switch (staggerFrom) {
    case 'end':
      return (totalDigits - index - 1) * stagger;
    case 'center': {
      const center = (totalDigits - 1) / 2;
      return Math.abs(index - center) * stagger;
    }
    case 'start':
    default:
      return index * stagger;
  }
}

function buildThresholdList(threshold: number): number[] {
  if (threshold <= 0) return [0];
  return [0, threshold, 1];
}

function isAsciiDigit(char: string): boolean {
  return /^[0-9]$/.test(char);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function approximatelyEqual(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.00001;
}

declare global {
  interface HTMLElementTagNameMap {
    'ui-number-ticker': UINumberTicker;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-number-ticker')) {
  customElements.define('ui-number-ticker', UINumberTicker);
}
