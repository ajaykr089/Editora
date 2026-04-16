import { ElementBase } from '../ElementBase';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { resolveDateTimeTranslations } from './date-time-i18n';
import {
  compareTimes,
  computePopoverPosition,
  eventOriginatesWithin,
  isTruthyAttr,
  lockBodyScroll,
  parseTimeInput,
  rafThrottle,
  shouldUseMobileSheet,
  to12hDisplay
} from './date-time-utils';

type TimeDetail = {
  mode: 'time';
  value: string | null;
  source: string;
};

const CLOCK_ICON = `
  <svg viewBox="0 0 20 20" class="icon-svg" aria-hidden="true" focusable="false">
    <path d="M10 2.4a7.6 7.6 0 1 1 0 15.2A7.6 7.6 0 0 1 10 2.4Zm0 1.4a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm.7 2.4a.7.7 0 0 0-1.4 0v4.1c0 .2.1.4.2.5l2.6 2.5a.7.7 0 1 0 1-1l-2.4-2.3v-3.8Z" fill="currentColor"/>
  </svg>
`;

const CLEAR_ICON = `
  <svg viewBox="0 0 20 20" class="icon-svg" aria-hidden="true" focusable="false">
    <path d="m6 6 8 8M14 6l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>
`;

const CHEVRON_ICON = `
  <svg viewBox="0 0 20 20" class="icon-svg" aria-hidden="true" focusable="false">
    <path d="m5.6 7.6 4.4 4.6 4.4-4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const style = `
  :host {
    --ui-dp-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-dp-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 72%, transparent);
    --ui-dp-text: var(--ui-color-text, #0f172a);
    --ui-dp-muted: var(--ui-color-muted, #64748b);
    --ui-dp-accent: var(--ui-color-primary, #2563eb);
    --ui-dp-radius: 12px;
    --ui-dp-field-error: var(--ui-color-danger, #dc2626);
    --ui-dp-z: 1600;
    color-scheme: light dark;
    display: inline-grid;
    inline-size: min(100%, var(--ui-width, 240px));
    min-inline-size: min(200px, 100%);
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-dp-text);
  }

  .root { display: grid; gap: 6px; }
  .label { font: 600 13px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: var(--ui-dp-text); }
  .label[hidden] { display: none; }
  .required { color: var(--ui-dp-field-error); font-size: 11px; }

  .field {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 8px;
    min-block-size: 38px;
    border: 1px solid var(--ui-dp-border);
    border-radius: var(--ui-dp-radius);
    background: var(--ui-dp-bg);
    padding: 0 10px;
    transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
  }

  .field:focus-within {
    border-color: color-mix(in srgb, var(--ui-dp-accent) 70%, var(--ui-dp-border));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-dp-accent) 22%, transparent);
  }

  .input {
    border: 0;
    outline: none;
    background: transparent;
    color: var(--ui-dp-text);
    inline-size: 100%;
    min-inline-size: 0;
    padding: 8px 0;
    font: 500 14px/1.35 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .icon {
    color: color-mix(in srgb, var(--ui-dp-text) 70%, transparent);
    inline-size: 16px;
    block-size: 16px;
    display: inline-grid;
    place-items: center;
  }

  .icon-svg {
    inline-size: 16px;
    block-size: 16px;
    pointer-events: none;
  }

  .btn {
    border: 0;
    background: transparent;
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    color: color-mix(in srgb, var(--ui-dp-text) 72%, transparent);
    cursor: pointer;
    display: inline-grid;
    place-items: center;
    transition: background-color 140ms ease, color 140ms ease, transform 140ms ease;
  }
  .btn:hover { background: color-mix(in srgb, var(--ui-dp-text) 10%, transparent); color: var(--ui-dp-text); }
  .btn:active { transform: translateY(1px); }
  .btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-dp-accent) 68%, transparent);
    outline-offset: 1px;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn[hidden] { display: none; }

  .hint { color: var(--ui-dp-muted); font-size: 12px; line-height: 1.4; }
  .error { color: var(--ui-dp-field-error); font-size: 12px; line-height: 1.4; }
  .hint[hidden], .error[hidden] { display: none; }

  :host([disabled]) .field {
    opacity: 0.64;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .field,
    .btn {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (forced-colors: active) {
    .field {
      border-color: CanvasText;
      background: Canvas;
      box-shadow: none;
    }

    .icon,
    .input {
      color: CanvasText;
    }

    .btn {
      border: 1px solid CanvasText;
      background: Canvas;
      color: CanvasText;
    }

    .btn:focus-visible {
      outline-color: Highlight;
    }
  }
`;

const overlayStyle = `
  .overlay { position: fixed; z-index: var(--ui-dp-z, 1600); pointer-events: none; }
  .panel {
    pointer-events: auto;
    min-inline-size: min(300px, calc(100vw - 16px));
    max-inline-size: min(320px, calc(100vw - 16px));
    border: 1px solid var(--ui-dp-border, #cbd5e1);
    border-radius: var(--ui-dp-radius, 12px);
    background: var(--ui-dp-bg, #fff);
    color: var(--ui-dp-text, #0f172a);
    box-shadow: 0 20px 34px rgba(2, 6, 23, 0.16);
    padding: 10px;
    display: grid;
    gap: 10px;
  }
  .sheet-wrap { position: fixed; inset: 0; display: grid; align-items: end; z-index: var(--ui-dp-z, 1600); }
  .sheet-backdrop { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.52); }
  .sheet {
    position: relative;
    pointer-events: auto;
    background: var(--ui-dp-bg, #fff);
    color: var(--ui-dp-text, #0f172a);
    border-radius: 16px 16px 0 0;
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 84%, transparent);
    box-shadow: 0 -12px 30px rgba(2, 6, 23, 0.2);
    padding: 12px;
    display: grid;
    gap: 10px;
    max-block-size: min(82vh, 560px);
    overflow: auto;
  }
  .pickers { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; align-items: end; }
  .pickers[data-seconds="false"][data-ampm="false"] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pickers[data-seconds="false"][data-ampm="true"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .picker { display: grid; gap: 4px; }
  .picker label { font-size: 11px; color: var(--ui-dp-muted, #64748b); font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  .picker select {
    min-block-size: 34px;
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 84%, transparent);
    border-radius: 8px;
    padding: 0 8px;
    background: color-mix(in srgb, var(--ui-dp-bg, #fff) 95%, transparent);
    color: var(--ui-dp-text, #0f172a);
    font: 600 13px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .footer { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
  .action {
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 85%, transparent);
    background: color-mix(in srgb, var(--ui-dp-bg, #fff) 95%, transparent);
    color: var(--ui-dp-text, #0f172a);
    min-block-size: 30px;
    border-radius: 8px;
    padding: 0 10px;
    font: 600 12px/1 "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
  }
  .action[data-tone="primary"] { border-color: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 60%, transparent); background: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 18%, transparent); }

  .action:hover {
    border-color: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 40%, var(--ui-dp-border, #cbd5e1));
    background: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 10%, transparent);
  }

  .action:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-dp-accent, #2563eb) 66%, transparent);
    outline-offset: 1px;
  }

  @media (prefers-reduced-motion: reduce) {
    .panel,
    .sheet,
    .action {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (forced-colors: active) {
    .panel,
    .sheet {
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }

    .sheet-backdrop {
      background: color-mix(in srgb, CanvasText 36%, transparent);
    }

    .picker label {
      color: CanvasText;
    }

    .picker select,
    .action {
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
    }

    .picker select:focus-visible,
    .action:focus-visible {
      outline-color: Highlight;
    }
  }
`;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatCanonical(hours: number, minutes: number, seconds: number, withSeconds: boolean): string {
  const hh = pad2(hours);
  const mm = pad2(minutes);
  if (!withSeconds) return `${hh}:${mm}`;
  return `${hh}:${mm}:${pad2(seconds)}`;
}

export class UITimePicker extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'default-open',
      'value',
      'default-value',
      'format',
      'step',
      'seconds',
      'step-seconds',
      'min',
      'max',
      'disabled',
      'readonly',
      'required',
      'name',
      'clearable',
      'allow-input',
      'mode',
      'label',
      'hint',
      'error',
      'translations',
      'locale',
      'variant'
    ];
  }

  private _value: string | null = null;
  private _pending: string | null = null;
  private _draft = '';
  private _inlineError = '';
  private _open = false;
  private _syncing = false;
  private _overlay: HTMLDivElement | null = null;
  private _dismissableLayer: DismissableLayerHandle | null = null;
  private _releaseScrollLock: (() => void) | null = null;
  private _isInitialized = false;
  private _hasView = false;
  private _restoreFocusEl: HTMLElement | null = null;
  private _overlayKey: string | null = null;
  private _fieldEl: HTMLElement | null = null;
  private _labelEl: HTMLElement | null = null;
  private _labelTextEl: HTMLElement | null = null;
  private _requiredEl: HTMLElement | null = null;
  private _inputEl: HTMLInputElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;
  private _toggleBtn: HTMLButtonElement | null = null;
  private _hintEl: HTMLElement | null = null;
  private _errorEl: HTMLElement | null = null;
  private _hiddenInputEl: HTMLInputElement | null = null;
  private _schedulePosition = rafThrottle(() => this._positionOverlay());

  private _onRootClickBound = (event: Event) => this._onRootClick(event);
  private _onRootInputBound = (event: Event) => this._onRootInput(event);
  private _onRootBlurBound = (event: Event) => this._onRootBlur(event);
  private _onRootKeyDownBound = (event: Event) => this._onRootKeyDown(event);
  private _onOverlayClickBound = (event: Event) => this._onOverlayClick(event);
  private _onOverlayChangeBound = (event: Event) => this._onOverlayChange(event);
  private _onDocumentPointerDownBound = (event: PointerEvent) => this._onDocumentPointerDown(event);
  private _onDocumentKeyDownBound = (event: KeyboardEvent) => this._onDocumentKeyDown(event);
  private _onWindowResizeBound = () => this._schedulePosition.run();
  private _onWindowScrollBound = (event: Event) => {
    if (eventOriginatesWithin(event, [this._overlay])) return;
    this._schedulePosition.run();
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClickBound);
    this.root.addEventListener('input', this._onRootInputBound);
    this.root.addEventListener('focusout', this._onRootBlurBound);
    this.root.addEventListener('keydown', this._onRootKeyDownBound);
    if (this._hasView && !this._inputEl) this._cacheDomRefs();

    if (!this._isInitialized) {
      const initial = this._normalizeCanonical(this.getAttribute('value') || this.getAttribute('default-value'));
      this._value = initial;
      this._pending = initial;
      this._draft = this._formatDisplay(initial);
      this._open = this.hasAttribute('open') || isTruthyAttr(this.getAttribute('default-open'));
      this._isInitialized = true;
    }

    if (this._open && !this._isInlineMode()) this._ensureOverlay();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClickBound);
    this.root.removeEventListener('input', this._onRootInputBound);
    this.root.removeEventListener('focusout', this._onRootBlurBound);
    this.root.removeEventListener('keydown', this._onRootKeyDownBound);
    this._destroyOverlay();
    this._fieldEl = null;
    this._labelEl = null;
    this._labelTextEl = null;
    this._requiredEl = null;
    this._inputEl = null;
    this._clearBtn = null;
    this._toggleBtn = null;
    this._hintEl = null;
    this._errorEl = null;
    this._hiddenInputEl = null;
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'value' && !this._syncing) {
      this._value = this._normalizeCanonical(newValue);
      this._pending = this._value;
      this._draft = this._formatDisplay(this._value);
      this._inlineError = '';
    }
    if (name === 'open' && !this._syncing) {
      this._open = this.hasAttribute('open');
      this._syncOverlay('attribute');
    }
    if (name === 'mode') {
      this._syncOverlay('attribute');
    }
    if (name === 'disabled' && this.hasAttribute('disabled')) {
      this._setOpen(false, 'outside');
    }
    if (!this.isConnected) return;
    if (!this._hasView) {
      this.requestRender();
      return;
    }
    this._updateHostState();
  }

  private _isInlineMode(): boolean {
    return (this.getAttribute('mode') || 'popover') === 'inline';
  }

  private _isMobileSheet(): boolean {
    return shouldUseMobileSheet(this.getAttribute('mode'));
  }

  private _isDisabled(): boolean {
    return this.hasAttribute('disabled');
  }

  private _isReadonly(): boolean {
    return this.hasAttribute('readonly');
  }

  private _allowInput(): boolean {
    return isTruthyAttr(this.getAttribute('allow-input'), true);
  }

  private _clearable(): boolean {
    return isTruthyAttr(this.getAttribute('clearable'), true);
  }

  private _withSeconds(): boolean {
    return this.hasAttribute('seconds');
  }

  private _is12h(): boolean {
    return (this.getAttribute('format') || '24h') === '12h';
  }

  private _minuteStep(): number {
    const parsed = Number(this.getAttribute('step') || 5);
    const fallback = 5;
    if (!Number.isFinite(parsed) || parsed < 1) return fallback;
    return Math.min(60, Math.trunc(parsed));
  }

  private _secondStep(): number {
    const parsed = Number(this.getAttribute('step-seconds') || 1);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    return Math.min(60, Math.trunc(parsed));
  }

  private _translations() {
    return resolveDateTimeTranslations(
      this.getAttribute('locale'),
      this.getAttribute('translations')
    );
  }

  private _normalizeCanonical(value: string | null): string | null {
    if (!value) return null;
    const parsed = parseTimeInput(value, true);
    if (!parsed) return null;
    return formatCanonical(parsed.hours, parsed.minutes, parsed.seconds, this._withSeconds());
  }

  private _minTime(): string | null {
    return this._normalizeCanonical(this.getAttribute('min'));
  }

  private _maxTime(): string | null {
    return this._normalizeCanonical(this.getAttribute('max'));
  }

  private _formatDisplay(value: string | null): string {
    if (!value) return '';
    if (this._is12h()) return to12hDisplay(value, this.getAttribute('locale') || 'en-US');
    return value;
  }

  private _syncOpenAttribute(next: boolean): void {
    this._syncing = true;
    try {
      if (next) {
        if (!this.hasAttribute('open')) this.setAttribute('open', '');
      } else if (this.hasAttribute('open')) {
        this.removeAttribute('open');
      }
    } finally {
      this._syncing = false;
    }
  }

  private _syncValueAttribute(next: string | null): void {
    this._syncing = true;
    try {
      if (!next) {
        if (this.hasAttribute('value')) this.removeAttribute('value');
      } else if (this.getAttribute('value') !== next) {
        this.setAttribute('value', next);
      }
    } finally {
      this._syncing = false;
    }
  }

  private _emitInput(source: string): void {
    const detail: TimeDetail = { mode: 'time', value: this._pending, source };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
  }

  private _emitChange(source: string): void {
    const detail: TimeDetail = { mode: 'time', value: this._value, source };
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _emitInvalid(raw: string, reason: string): void {
    this.dispatchEvent(new CustomEvent('invalid', { detail: { raw, reason }, bubbles: true, composed: true }));
  }

  private _clampToBounds(value: string | null): string | null {
    if (!value) return null;
    const min = this._minTime();
    const max = this._maxTime();
    let next = value;
    if (min && compareTimes(next, min) < 0) next = min;
    if (max && compareTimes(next, max) > 0) next = max;
    return next;
  }

  private _commit(next: string | null, source: string): void {
    if (this._isDisabled() || this._isReadonly()) return;
    const clamped = this._clampToBounds(this._normalizeCanonical(next));
    this._value = clamped;
    this._pending = clamped;
    this._draft = this._formatDisplay(clamped);
    this._inlineError = '';
    this._syncValueAttribute(clamped);
    this._emitInput(source);
    this._emitChange(source);
    this._updateHostState();
  }

  private _setOpen(next: boolean, source: string): void {
    if (this._isDisabled()) return;
    if (this._open === next) return;
    this._open = next;
    this._syncOpenAttribute(next);
    this._syncOverlay(source);
    this._updateHostState();
    this.dispatchEvent(new CustomEvent(next ? 'open' : 'close', { bubbles: true, composed: true }));
  }

  private _syncOverlay(_source: string): void {
    if (this._isInlineMode()) {
      this._destroyOverlay();
      return;
    }
    if (this._open) {
      this._ensureOverlay();
      this._syncOverlayState();
      return;
    }
    this._destroyOverlay();
    const focusTarget = this._restoreFocusEl;
    this._restoreFocusEl = null;
    if (focusTarget && focusTarget.isConnected) {
      try {
        focusTarget.focus();
      } catch {
        // no-op
      }
    }
  }

  private _ensureOverlay(): void {
    if (this._overlay || typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.pointerEvents = 'none';
    el.addEventListener('click', this._onOverlayClickBound);
    el.addEventListener('change', this._onOverlayChangeBound);
    document.body.appendChild(el);
    this._overlay = el;
    this._syncOverlayHostZIndex();
    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.addEventListener('keydown', this._onDocumentKeyDownBound);
    window.addEventListener('resize', this._onWindowResizeBound);
    window.addEventListener('scroll', this._onWindowScrollBound, { passive: true, capture: true });
    if (this._isMobileSheet()) this._releaseScrollLock = lockBodyScroll();
  }

  private _syncOverlayHostZIndex(): void {
    if (!this._overlay || typeof window === 'undefined') return;
    const resolved = window.getComputedStyle(this).getPropertyValue('--ui-dp-z').trim();
    this._overlay.style.zIndex = resolved || '1600';
  }

  private _destroyOverlay(): void {
    this._dismissableLayer?.destroy();
    this._dismissableLayer = null;
    if (!this._overlay) return;
    this._schedulePosition.cancel();
    document.removeEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.removeEventListener('keydown', this._onDocumentKeyDownBound);
    window.removeEventListener('resize', this._onWindowResizeBound);
    window.removeEventListener('scroll', this._onWindowScrollBound, true);
    this._overlay.removeEventListener('click', this._onOverlayClickBound);
    this._overlay.removeEventListener('change', this._onOverlayChangeBound);
    if (this._overlay.parentElement) this._overlay.parentElement.removeChild(this._overlay);
    this._overlay = null;
    this._overlayKey = null;
    if (this._releaseScrollLock) {
      this._releaseScrollLock();
      this._releaseScrollLock = null;
    }
  }

  private _syncDismissableLayer(): void {
    this._dismissableLayer?.destroy();
    this._dismissableLayer = null;
    if (!this._open || !this._overlay) return;
    const panel = this._overlay.querySelector('.panel, .sheet') as HTMLElement | null;
    if (!panel) return;
    this._dismissableLayer = createDismissableLayer({
      node: panel,
      trigger: this._fieldEl,
      closeOnEscape: true,
      closeOnPointerOutside: true,
      closeOnFocusOutside: false,
      onBeforeDismiss: (reason) => {
        if (reason === 'escape-key') {
          this._setOpen(false, 'escape');
          return false;
        }
        if (reason === 'outside-pointer') {
          this._setOpen(false, 'outside');
          return false;
        }
        return false;
      }
    });
  }

  private _positionOverlay(): void {
    if (!this._overlay || !this._open || this._isMobileSheet()) return;
    const field = this._fieldEl;
    const panel = this._overlay.querySelector('.panel') as HTMLElement | null;
    if (!field || !panel) return;
    const currentPlacement = panel.getAttribute('data-placement');
    const position = computePopoverPosition(
      field.getBoundingClientRect(),
      panel.getBoundingClientRect(),
      8,
      8,
      currentPlacement === 'top' ? 'top' : currentPlacement === 'bottom' ? 'bottom' : null
    );
    panel.style.position = 'absolute';
    panel.style.top = `${Math.round(position.top)}px`;
    panel.style.left = `${Math.round(position.left)}px`;
    panel.setAttribute('data-placement', position.placement);
  }

  private _timeParts(value: string | null): { hours: number; minutes: number; seconds: number; meridiem: 'am' | 'pm' } {
    const parsed = parseTimeInput(value || '00:00', true) || { hours: 0, minutes: 0, seconds: 0 };
    const meridiem: 'am' | 'pm' = parsed.hours >= 12 ? 'pm' : 'am';
    return {
      hours: parsed.hours,
      minutes: parsed.minutes,
      seconds: parsed.seconds,
      meridiem
    };
  }

  private _buildOverlayContent(sheet: boolean): string {
    const t = this._translations();
    const parts = this._timeParts(this._pending);
    const format12 = this._is12h();
    const withSeconds = this._withSeconds();
    const hourValue = format12 ? ((parts.hours % 12) || 12) : parts.hours;
    const minuteStep = this._minuteStep();
    const secondStep = this._secondStep();

    const hourOptions = Array.from({ length: format12 ? 12 : 24 }, (_, index) => {
      const value = format12 ? index + 1 : index;
      return `<option value="${value}" ${value === hourValue ? 'selected' : ''}>${pad2(value)}</option>`;
    }).join('');
    const minuteOptions = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, index) => {
      const value = Math.min(59, index * minuteStep);
      return `<option value="${value}" ${value === parts.minutes ? 'selected' : ''}>${pad2(value)}</option>`;
    }).join('');
    const secondOptions = Array.from({ length: Math.ceil(60 / secondStep) }, (_, index) => {
      const value = Math.min(59, index * secondStep);
      return `<option value="${value}" ${value === parts.seconds ? 'selected' : ''}>${pad2(value)}</option>`;
    }).join('');

    const pickerContent = `
      <div class="pickers" data-seconds="${withSeconds ? 'true' : 'false'}" data-ampm="${format12 ? 'true' : 'false'}">
        <div class="picker"><label>${t.hour}</label><select data-segment="hours">${hourOptions}</select></div>
        <div class="picker"><label>${t.minute}</label><select data-segment="minutes">${minuteOptions}</select></div>
        ${withSeconds ? `<div class="picker"><label>${t.second}</label><select data-segment="seconds">${secondOptions}</select></div>` : ''}
        ${format12
          ? `<div class="picker"><label>${t.meridiem}</label><select data-segment="meridiem"><option value="am" ${parts.meridiem === 'am' ? 'selected' : ''}>${t.am}</option><option value="pm" ${parts.meridiem === 'pm' ? 'selected' : ''}>${t.pm}</option></select></div>`
          : ''}
      </div>
    `;

    return `
      <style>${overlayStyle}</style>
      ${sheet ? '<div class="sheet-backdrop" data-action="backdrop"></div>' : ''}
      <section class="${sheet ? 'sheet' : 'panel'}" part="${sheet ? 'sheet' : 'popover'}">
        ${pickerContent}
        <footer class="footer" part="footer">
          <button type="button" class="action" data-action="now">${t.now}</button>
          <button type="button" class="action" data-action="clear" part="clear">${t.clear}</button>
          <button type="button" class="action" data-action="cancel" part="cancel">${t.cancel}</button>
          <button type="button" class="action" data-action="apply" data-tone="primary" part="apply">${t.apply}</button>
        </footer>
      </section>
    `;
  }

  private _overlaySignature(sheet: boolean): string {
    return [
      sheet ? 'sheet' : 'popover',
      this._is12h() ? '12h' : '24h',
      this._withSeconds() ? 'sec' : 'nosec',
      this._minuteStep(),
      this._secondStep(),
      this.getAttribute('translations') || ''
    ].join(':');
  }

  private _ensureOverlayContent(sheet: boolean): void {
    if (!this._overlay) return;
    const signature = this._overlaySignature(sheet);
    if (this._overlayKey === signature) return;
    this._overlayKey = signature;
    this._overlay.innerHTML = sheet
      ? `<div class="sheet-wrap">${this._buildOverlayContent(true)}</div>`
      : `<div class="overlay">${this._buildOverlayContent(false)}</div>`;
  }

  private _setClosestOptionValue(select: HTMLSelectElement, desired: number): void {
    const options = Array.from(select.options).map((option) => Number(option.value)).filter((n) => Number.isFinite(n));
    if (!options.length) return;
    let best = options[0];
    let bestDistance = Math.abs(best - desired);
    for (let index = 1; index < options.length; index += 1) {
      const current = options[index];
      const distance = Math.abs(current - desired);
      if (distance < bestDistance) {
        best = current;
        bestDistance = distance;
      }
    }
    select.value = String(best);
  }

  private _syncOverlayState(): void {
    if (!this._overlay) return;
    this._syncOverlayHostZIndex();
    const sheet = this._isMobileSheet();
    this._ensureOverlayContent(sheet);
    this._syncDismissableLayer();
    const parts = this._timeParts(this._pending);
    const hoursEl = this._overlay.querySelector('select[data-segment="hours"]') as HTMLSelectElement | null;
    const minutesEl = this._overlay.querySelector('select[data-segment="minutes"]') as HTMLSelectElement | null;
    const secondsEl = this._overlay.querySelector('select[data-segment="seconds"]') as HTMLSelectElement | null;
    const meridiemEl = this._overlay.querySelector('select[data-segment="meridiem"]') as HTMLSelectElement | null;
    const disabled = this._isDisabled() || this._isReadonly();
    const actionButtons = this._overlay.querySelectorAll('.action');
    actionButtons.forEach((node) => {
      (node as HTMLButtonElement).disabled = disabled;
    });
    if (hoursEl) {
      const hourValue = this._is12h() ? ((parts.hours % 12) || 12) : parts.hours;
      this._setClosestOptionValue(hoursEl, hourValue);
      hoursEl.disabled = disabled;
    }
    if (minutesEl) {
      this._setClosestOptionValue(minutesEl, parts.minutes);
      minutesEl.disabled = disabled;
    }
    if (secondsEl) {
      this._setClosestOptionValue(secondsEl, parts.seconds);
      secondsEl.disabled = disabled;
    }
    if (meridiemEl) {
      meridiemEl.value = parts.meridiem;
      meridiemEl.disabled = disabled;
    }
    if (!sheet) this._schedulePosition.run();
  }

  private _renderOverlay(): void {
    this._syncOverlayState();
  }

  private _applySegmentsFromOverlay(): void {
    if (!this._overlay) return;
    const hoursEl = this._overlay.querySelector('select[data-segment="hours"]') as HTMLSelectElement | null;
    const minutesEl = this._overlay.querySelector('select[data-segment="minutes"]') as HTMLSelectElement | null;
    const secondsEl = this._overlay.querySelector('select[data-segment="seconds"]') as HTMLSelectElement | null;
    const meridiemEl = this._overlay.querySelector('select[data-segment="meridiem"]') as HTMLSelectElement | null;
    if (!hoursEl || !minutesEl) return;
    let hours = Number(hoursEl.value);
    const minutes = Number(minutesEl.value);
    const seconds = secondsEl ? Number(secondsEl.value) : 0;
    if (this._is12h() && meridiemEl) {
      const meridiem = meridiemEl.value === 'pm' ? 'pm' : 'am';
      if (meridiem === 'pm' && hours < 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;
    }
    const canonical = formatCanonical(hours, minutes, seconds, this._withSeconds());
    this._pending = this._clampToBounds(canonical);
    this._emitInput('picker');
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const action = target.closest('[data-action]')?.getAttribute('data-action');
    if (!action) return;
    if (action === 'toggle') {
      this._restoreFocusEl = target;
      this._setOpen(!this._open, 'toggle');
      return;
    }
    if (action === 'clear') {
      this._commit(null, 'clear');
    }
  }

  private _onRootInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.classList.contains('input')) return;
    if (!this._allowInput()) return;
    this._draft = input.value;
    this._inlineError = '';
    const parsed = this._normalizeCanonical(input.value);
    this._pending = parsed;
    this._emitInput('typing');
  }

  private _onRootBlur(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.classList.contains('input')) return;
    if (!this._allowInput()) return;
    if (!this._draft.trim()) {
      this._commit(null, 'blur');
      return;
    }
    const parsed = this._normalizeCanonical(this._draft);
    if (!parsed) {
      this._inlineError = this.getAttribute('error') || this._translations().invalidTime;
      this._emitInvalid(this._draft, 'parse');
      this._updateHostState();
      return;
    }
    this._commit(parsed, 'blur');
  }

  private _stepBy(delta: number): void {
    const current = parseTimeInput(this._pending || this._value || '00:00', true) || { hours: 0, minutes: 0, seconds: 0 };
    const step = this._minuteStep() * delta;
    const totalMinutes = ((current.hours * 60 + current.minutes + step) % (24 * 60) + (24 * 60)) % (24 * 60);
    const nextHours = Math.floor(totalMinutes / 60);
    const nextMinutes = totalMinutes % 60;
    const next = formatCanonical(nextHours, nextMinutes, current.seconds, this._withSeconds());
    this._pending = this._clampToBounds(next);
    this._emitInput('keyboard-step');
    this._updateHostState();
  }

  private _onRootKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const target = keyboardEvent.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement) || !target.classList.contains('input')) return;
    if (keyboardEvent.key === 'ArrowUp') {
      keyboardEvent.preventDefault();
      this._stepBy(keyboardEvent.shiftKey ? 5 : 1);
      return;
    }
    if (keyboardEvent.key === 'ArrowDown') {
      keyboardEvent.preventDefault();
      this._stepBy(keyboardEvent.shiftKey ? -5 : -1);
      return;
    }
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      const parsed = this._normalizeCanonical(this._draft);
      if (!parsed && this._draft.trim()) {
        this._inlineError = this.getAttribute('error') || this._translations().invalidTime;
        this._emitInvalid(this._draft, 'parse');
        this._updateHostState();
        return;
      }
      this._commit(parsed, 'enter');
      if (!this._isInlineMode()) this._setOpen(false, 'enter');
      return;
    }
    if (keyboardEvent.key === 'Escape' && this._open && !this._isInlineMode()) {
      keyboardEvent.preventDefault();
      this._setOpen(false, 'escape');
      return;
    }
    if (keyboardEvent.key === 'ArrowDown' && !this._open && !this._isInlineMode()) {
      keyboardEvent.preventDefault();
      this._setOpen(true, 'keyboard');
    }
  }

  private _onOverlayClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const action = target.closest('[data-action]')?.getAttribute('data-action');
    if (!action) return;
    if (action === 'backdrop') {
      this._setOpen(false, 'outside');
      return;
    }
    if (action === 'cancel') {
      this._pending = this._value;
      this._setOpen(false, 'cancel');
      return;
    }
    if (action === 'clear') {
      this._pending = null;
      this._emitInput('clear');
      this._renderOverlay();
      return;
    }
    if (action === 'now') {
      const now = new Date();
      const canonical = formatCanonical(now.getHours(), now.getMinutes(), now.getSeconds(), this._withSeconds());
      this._pending = this._clampToBounds(canonical);
      this._emitInput('now');
      this._renderOverlay();
      return;
    }
    if (action === 'apply') {
      this._commit(this._pending, 'apply');
      this._setOpen(false, 'apply');
    }
  }

  private _onOverlayChange(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLSelectElement)) return;
    if (!target.matches('select[data-segment]')) return;
    this._applySegmentsFromOverlay();
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this._open || !this._overlay) return;
    const path = event.composedPath();
    if (path.includes(this) || path.includes(this._overlay)) return;
    this._setOpen(false, 'outside');
  }

  private _onDocumentKeyDown(event: KeyboardEvent): void {
    if (!this._open) return;
    if (event.key !== 'Escape') return;
    event.preventDefault();
    this._setOpen(false, 'escape');
  }

  private _cacheDomRefs(): void {
    this._labelEl = this.root.querySelector('.label') as HTMLElement | null;
    this._labelTextEl = this.root.querySelector('.label-text') as HTMLElement | null;
    this._requiredEl = this.root.querySelector('.required') as HTMLElement | null;
    this._fieldEl = this.root.querySelector('.field') as HTMLElement | null;
    this._inputEl = this.root.querySelector('.input') as HTMLInputElement | null;
    this._clearBtn = this.root.querySelector('.btn[data-action="clear"]') as HTMLButtonElement | null;
    this._toggleBtn = this.root.querySelector('.btn[data-action="toggle"]') as HTMLButtonElement | null;
    this._hintEl = this.root.querySelector('.hint') as HTMLElement | null;
    this._errorEl = this.root.querySelector('.error') as HTMLElement | null;
    this._hiddenInputEl = this.root.querySelector('.hidden-input') as HTMLInputElement | null;
  }

  private _updateHostState(): void {
    if (!this._hasView) return;
    const label = this.getAttribute('label') || '';
    const hint = this.getAttribute('hint') || '';
    const manualError = this.getAttribute('error') || '';
    const error = this._inlineError || manualError;
    const hasValue = !!this._value;
    const name = this.getAttribute('name') || '';
    const display = this._allowInput() ? this._draft : this._formatDisplay(this._value);
    const isInline = this._isInlineMode();
    const disabled = this._isDisabled();
    const t = this._translations();

    if (this._labelEl) this._labelEl.hidden = !label;
    if (this._labelTextEl) this._labelTextEl.textContent = label;
    if (this._requiredEl) this._requiredEl.hidden = !this.hasAttribute('required');
    if (this._inputEl) {
      if (this._inputEl.value !== display) this._inputEl.value = display;
      this._inputEl.placeholder = this._withSeconds() ? t.timePlaceholderSeconds : t.timePlaceholder;
      this._inputEl.readOnly = !this._allowInput() || this._isReadonly();
      this._inputEl.disabled = disabled;
      this._inputEl.required = this.hasAttribute('required');
    }
    if (this._clearBtn) {
      this._clearBtn.hidden = !(this._clearable() && hasValue);
      this._clearBtn.disabled = disabled || this._isReadonly();
      this._clearBtn.setAttribute('aria-label', t.clear);
    }
    if (this._toggleBtn) {
      this._toggleBtn.hidden = isInline;
      this._toggleBtn.disabled = disabled || this._isReadonly();
      this._toggleBtn.setAttribute('aria-label', t.toggleCalendar);
    }
    if (this._hintEl) {
      this._hintEl.hidden = !hint;
      this._hintEl.textContent = hint;
    }
    if (this._errorEl) {
      this._errorEl.hidden = !error;
      this._errorEl.textContent = error;
    }
    if (this._hiddenInputEl) {
      this._hiddenInputEl.disabled = !name;
      this._hiddenInputEl.name = name;
      this._hiddenInputEl.value = this._value || '';
    }

    if (!isInline && this._open) this._syncOverlayState();
  }

  protected override render(): void {
    if (!this._hasView) {
      this.setContent(`
        <style>${style}</style>
        <div class="root">
          <label class="label" part="label">
            <span class="label-text"></span>
            <span class="required">*</span>
          </label>
          <div class="field" part="field input">
            <span class="icon" part="icon">${CLOCK_ICON}</span>
            <input class="input" part="input" />
            <button type="button" class="btn" part="clear" data-action="clear">${CLEAR_ICON}</button>
            <button type="button" class="btn" part="toggle" data-action="toggle">${CHEVRON_ICON}</button>
          </div>
          <div class="hint" part="hint"></div>
          <div class="error" part="error" role="alert"></div>
          <input class="hidden-input" type="hidden" disabled />
        </div>
      `, { force: true });
      this._cacheDomRefs();
      this._hasView = true;
    }
    this._updateHostState();
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-time-picker')) {
  customElements.define('ui-time-picker', UITimePicker);
}
