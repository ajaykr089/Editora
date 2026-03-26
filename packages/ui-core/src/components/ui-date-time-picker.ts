import { ElementBase } from '../ElementBase';
import { resolveDateTimeTranslations } from './date-time-i18n';
import {
  clampDateIso,
  combineDateTime,
  compareDateTimes,
  computePopoverPosition,
  formatDateForDisplay,
  isTruthyAttr,
  lockBodyScroll,
  normalizeDateIso,
  normalizeLocale,
  parseConstraintDate,
  parseConstraintDateTime,
  parseUserDateInput,
  parseTimeInput,
  rafThrottle,
  shouldUseMobileSheet,
  splitDateTime,
  to12hDisplay
} from './date-time-utils';

type DateTimeDetail = {
  mode: 'datetime';
  value: string | null;
  date: string | null;
  time: string | null;
  source: string;
};

type DateTimeState = { date: string | null; time: string | null };

let dateTimePickerUid = 0;

const CALENDAR_ICON = `
  <svg viewBox="0 0 20 20" class="icon-svg" aria-hidden="true" focusable="false">
    <path d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h.5A2.5 2.5 0 0 1 18 6.5v9A2.5 2.5 0 0 1 15.5 18h-11A2.5 2.5 0 0 1 2 15.5v-9A2.5 2.5 0 0 1 4.5 4H5V3a1 1 0 0 1 1-1Zm10 7H4v6.5c0 .276.224.5.5.5h11a.5.5 0 0 0 .5-.5V9ZM4.5 6a.5.5 0 0 0-.5.5V7h12v-.5a.5.5 0 0 0-.5-.5h-11Z" fill="currentColor"/>
  </svg>
`;

const CHEVRON_ICON = `
  <svg viewBox="0 0 20 20" class="icon-svg" aria-hidden="true" focusable="false">
    <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.12l3.71-3.9a.75.75 0 1 1 1.08 1.04l-4.25 4.47a.75.75 0 0 1-1.08 0L5.2 8.27a.75.75 0 0 1 .02-1.06Z" fill="currentColor"/>
  </svg>
`;

const CLOSE_ICON = `
  <svg viewBox="0 0 20 20" class="icon-svg" aria-hidden="true" focusable="false">
    <path d="M5.22 5.22a.75.75 0 0 1 1.06 0L10 8.94l3.72-3.72a.75.75 0 1 1 1.06 1.06L11.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06L10 11.06l-3.72 3.72a.75.75 0 1 1-1.06-1.06L8.94 10 5.22 6.28a.75.75 0 0 1 0-1.06Z" fill="currentColor"/>
  </svg>
`;

const CLOCK_ICON = `
  <svg viewBox="0 0 20 20" class="icon-svg" aria-hidden="true" focusable="false">
    <path d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm0 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm.75 2.75a.75.75 0 0 0-1.5 0v3.88c0 .2.08.4.22.54l2.5 2.5a.75.75 0 1 0 1.06-1.06l-2.28-2.28V6.25Z" fill="currentColor"/>
  </svg>
`;

const style = `
  :host {
    --ui-dtp-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-dtp-surface: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 90%, var(--ui-color-surface-alt, #f8fafc))
    );
    --ui-dtp-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-dp-text: var(--ui-color-text, #0f172a);
    --ui-dp-muted: var(--ui-color-muted, #64748b);
    --ui-dtp-accent: var(--ui-color-primary, #2563eb);
    --ui-dtp-success: var(--ui-color-success, #16a34a);
    --ui-dtp-error: var(--ui-color-danger, #dc2626);
    --ui-dtp-radius: 12px;
    --ui-dtp-panel-radius: 14px;
    --ui-dtp-z: 1600;
    --ui-dtp-shadow: none;
    --ui-dtp-gap: 12px;
    --ui-dtp-hit: 42px;
    --ui-dtp-duration: 160ms;
    --ui-dtp-ease: cubic-bezier(0.2, 0.9, 0.24, 1);
    color-scheme: light dark;
    display: inline-grid;
    inline-size: min(100%, var(--ui-width, 360px));
    min-inline-size: min(240px, 100%);
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ui-dp-text);
  }

  :host([shape="square"]) {
    --ui-dtp-radius: 6px;
    --ui-dtp-panel-radius: 8px;
  }

  :host([shape="soft"]) {
    --ui-dtp-radius: 16px;
    --ui-dtp-panel-radius: 18px;
  }

  :host([size="sm"]) {
    --ui-dtp-hit: 38px;
  }

  :host([size="lg"]) {
    --ui-dtp-hit: 48px;
  }

  .root {
    display: grid;
    gap: 8px;
    min-inline-size: 0;
  }

  .label {
    font: 600 13px/1.35 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ui-dp-text);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .label[hidden] { display: none; }

  .required {
    color: var(--ui-dtp-error);
    font-size: 11px;
    line-height: 1;
  }

  .field {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto auto;
    align-items: center;
    gap: 8px;
    min-block-size: var(--ui-dtp-hit);
    border: 1px solid var(--ui-dtp-border);
    border-radius: var(--ui-dtp-radius);
    background: var(--ui-dtp-surface);
    padding: 0 10px;
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.72);
    transition: border-color var(--ui-dtp-duration) var(--ui-dtp-ease), box-shadow var(--ui-dtp-duration) var(--ui-dtp-ease), transform var(--ui-dtp-duration) var(--ui-dtp-ease);
  }

  .field[data-open="true"],
  .field:focus-within {
    border-color: color-mix(in srgb, var(--ui-dtp-accent) 70%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-dtp-accent) 22%, transparent), 0 10px 22px rgba(2, 6, 23, 0.12);
  }

  .field[data-invalid="true"] {
    border-color: color-mix(in srgb, var(--ui-dtp-error) 72%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-dtp-error) 20%, transparent);
  }

  .field[data-state="success"]:not([data-invalid="true"]) {
    border-color: color-mix(in srgb, var(--ui-dtp-success) 56%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-dtp-success) 18%, transparent);
  }

  .input {
    border: 0;
    background: transparent;
    color: var(--ui-dp-text);
    outline: none;
    min-inline-size: 0;
    inline-size: 100%;
    padding: 8px 0;
    font: 500 14px/1.35 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }

  .input::placeholder {
    color: color-mix(in srgb, var(--ui-dp-text) 44%, transparent);
  }

  .icon {
    display: inline-grid;
    place-items: center;
    color: color-mix(in srgb, var(--ui-dp-text) 68%, transparent);
    inline-size: 20px;
    block-size: 20px;
  }

  .icon-svg {
    inline-size: 16px;
    block-size: 16px;
    pointer-events: none;
  }

  .btn {
    border: 1px solid transparent;
    background: color-mix(in srgb, var(--ui-dtp-bg) 84%, transparent);
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    color: color-mix(in srgb, var(--ui-dp-text) 72%, transparent);
    cursor: pointer;
    display: inline-grid;
    place-items: center;
    transition: background-color var(--ui-dtp-duration) var(--ui-dtp-ease), color var(--ui-dtp-duration) var(--ui-dtp-ease), border-color var(--ui-dtp-duration) var(--ui-dtp-ease), transform var(--ui-dtp-duration) var(--ui-dtp-ease);
  }

  .btn:hover {
    background: color-mix(in srgb, var(--ui-dtp-accent) 10%, transparent);
    border-color: color-mix(in srgb, var(--ui-dtp-accent) 30%, transparent);
    color: var(--ui-dp-text);
  }

  .btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-dtp-accent) 64%, transparent);
    outline-offset: 1px;
  }

  .btn:active {
    transform: translateY(1px);
  }

  .btn[hidden] { display: none; }

  .hint { color: var(--ui-dp-muted); font-size: 12px; line-height: 1.4; }
  .error { color: var(--ui-dtp-error); font-size: 12px; line-height: 1.4; }
  .hint[hidden], .error[hidden] { display: none; }

  .inline-panel {
    border: 1px solid var(--ui-dtp-border);
    border-radius: var(--ui-dtp-panel-radius);
    background: var(--ui-dtp-surface);
    box-shadow: var(--ui-dtp-shadow);
    inline-size: fit-content;
    max-inline-size: 100%;
    justify-self: start;
    padding: 12px;
    display: grid;
    gap: var(--ui-dtp-gap);
  }

  .inline-panel .content {
    gap: 10px;
    grid-template-columns: minmax(0, 1fr) minmax(176px, 214px);
  }

  .inline-panel .time-panel {
    padding: 10px;
    gap: 8px;
  }

  .inline-panel .time-grid {
    gap: 6px;
  }

  .inline-panel .footer {
    gap: 6px;
  }

  .inline-panel[data-bare="true"] {
    border: 0;
    border-radius: 0;
    background: var(--ui-dtp-bare-bg, var(--ui-dtp-bg));
    box-shadow: none;
    padding: 0;
  }

  .inline-panel[hidden] {
    display: none !important;
  }

  .panel-title {
    margin: 0;
    font: 650 13px/1.35 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ui-dp-text);
  }

  :host([disabled]) .field {
    opacity: 0.62;
    pointer-events: none;
  }

  :host([readonly]) .field {
    background: color-mix(in srgb, var(--ui-dtp-bg) 90%, var(--ui-color-surface-alt, #f8fafc));
  }

  :host([variant="contrast"]) {
    --ui-dtp-bg: #0f172a;
    --ui-dtp-border: #334155;
    --ui-dp-text: #e2e8f0;
    --ui-dp-muted: #94a3b8;
    --ui-dtp-accent: #93c5fd;
    --ui-dtp-surface: linear-gradient(180deg, color-mix(in srgb, #0f172a 84%, #1e293b), #0f172a);
    --ui-dtp-shadow: 0 18px 36px rgba(2, 6, 23, 0.48);
  }

  @media (max-width: 640px) {
    :host {
      inline-size: min(100%, var(--ui-width, 100%));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .field,
    .btn,
    .action {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (forced-colors: active) {
    .field,
    .inline-panel {
      border-color: CanvasText;
      background: Canvas;
      box-shadow: none;
    }

    .btn,
    .action {
      border: 1px solid CanvasText;
      background: Canvas;
      color: CanvasText;
    }

    .btn:focus-visible,
    .action:focus-visible {
      outline-color: Highlight;
    }
  }
`;

const overlayStyle = `
  .overlay { position: fixed; z-index: var(--ui-dtp-z, 1600); pointer-events: none; }
  .panel {
    pointer-events: auto;
    min-inline-size: min(560px, calc(100vw - 20px));
    max-inline-size: min(640px, calc(100vw - 20px));
    border: 1px solid var(--ui-dtp-border, #cbd5e1);
    border-radius: var(--ui-dtp-panel-radius, 14px);
    background: var(--ui-dtp-surface, #fff);
    color: var(--ui-dp-text, #0f172a);
    box-shadow: var(--ui-dtp-shadow);
    padding: 12px;
    display: grid;
    gap: 12px;
    animation: ui-dtp-pop var(--ui-dtp-duration, 160ms) var(--ui-dtp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }
  .panel[data-bare="true"], .sheet[data-bare="true"] {
    border: 0;
    border-radius: 0;
    background: var(--ui-dtp-bare-bg, var(--ui-dtp-bg));
    box-shadow: none;
    padding: 0;
  }
  .sheet-wrap { position: fixed; inset: 0; display: grid; align-items: end; z-index: var(--ui-dtp-z, 1600); }
  .sheet-backdrop { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.52); }
  .sheet {
    position: relative;
    pointer-events: auto;
    background: var(--ui-dtp-surface, #fff);
    color: var(--ui-dp-text, #0f172a);
    border-radius: 16px 16px 0 0;
    border: 1px solid color-mix(in srgb, var(--ui-dtp-border, #cbd5e1) 84%, transparent);
    box-shadow: 0 -12px 30px rgba(2, 6, 23, 0.2);
    padding: 12px;
    display: grid;
    gap: 10px;
    max-block-size: min(82vh, 640px);
    overflow: auto;
  }
  .head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
  .head-title {
    margin: 0;
    font: 700 14px/1.35 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ui-dp-text, #0f172a);
  }
  .head-meta {
    margin: 0;
    font: 500 12px/1.3 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ui-dp-muted, #64748b);
  }
  .content {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(200px, 240px);
    gap: 12px;
    align-items: start;
  }
  .time-panel {
    border: 1px solid color-mix(in srgb, var(--ui-dtp-border, #cbd5e1) 86%, transparent);
    border-radius: 12px;
    padding: 12px;
    display: grid;
    gap: 10px;
    background: color-mix(in srgb, var(--ui-dtp-bg, #fff) 95%, transparent);
  }
  .icon {
    display: inline-grid;
    place-items: center;
    color: color-mix(in srgb, var(--ui-dp-text, #0f172a) 70%, transparent);
  }
  .icon-svg {
    inline-size: 16px;
    block-size: 16px;
    pointer-events: none;
  }
  .time-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .time-grid[data-meridiem="true"] { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .time-grid label { font-size: 11px; color: var(--ui-dp-muted, #64748b); font-weight: 650; text-transform: uppercase; letter-spacing: .04em; }
  .time-grid select {
    min-block-size: 34px;
    border: 1px solid color-mix(in srgb, var(--ui-dtp-border, #cbd5e1) 84%, transparent);
    border-radius: 8px;
    padding: 0 8px;
    background: color-mix(in srgb, var(--ui-dtp-bg, #fff) 95%, transparent);
    color: var(--ui-dp-text, #0f172a);
    font: 600 13px/1 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .footer { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
  .footer[hidden] { display: none !important; }
  .action {
    border: 1px solid color-mix(in srgb, var(--ui-dtp-border, #cbd5e1) 85%, transparent);
    background: color-mix(in srgb, var(--ui-dtp-bg, #fff) 95%, transparent);
    color: var(--ui-dp-text, #0f172a);
    min-block-size: 32px;
    border-radius: 8px;
    padding: 0 12px;
    font: 650 12px/1 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    cursor: pointer;
    transition: border-color var(--ui-dtp-duration, 160ms) var(--ui-dtp-ease, cubic-bezier(0.2, 0.9, 0.24, 1)), background-color var(--ui-dtp-duration, 160ms) var(--ui-dtp-ease, cubic-bezier(0.2, 0.9, 0.24, 1)), transform var(--ui-dtp-duration, 160ms) var(--ui-dtp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }
  .action:hover {
    border-color: color-mix(in srgb, var(--ui-dtp-accent, #2563eb) 40%, var(--ui-dtp-border, #cbd5e1));
    background: color-mix(in srgb, var(--ui-dtp-accent, #2563eb) 10%, transparent);
  }
  .action:active { transform: translateY(1px); }
  .action:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-dtp-accent, #2563eb) 66%, transparent);
    outline-offset: 1px;
  }
  .action[data-tone="primary"] { border-color: color-mix(in srgb, var(--ui-dtp-accent, #2563eb) 60%, transparent); background: color-mix(in srgb, var(--ui-dtp-accent, #2563eb) 20%, transparent); }
  .action:disabled { opacity: .58; cursor: not-allowed; }

  @media (max-width: 760px) {
    .content {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel, .sheet, .action { animation: none !important; transition: none !important; }
  }

  @media (forced-colors: active) {
    .panel,
    .sheet,
    .time-panel {
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }

    .sheet-backdrop {
      background: color-mix(in srgb, CanvasText 36%, transparent);
    }

    .time-grid label,
    .head-meta {
      color: CanvasText;
    }

    .time-grid select,
    .action {
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
    }

    .time-grid select:focus-visible,
    .action:focus-visible {
      outline-color: Highlight;
    }
  }

  @keyframes ui-dtp-pop {
    from { opacity: 0; transform: translateY(6px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseState(value: string | null): DateTimeState {
  const split = splitDateTime(value);
  if (!split) return { date: null, time: null };
  return { date: split.date, time: split.time };
}

function serializeState(state: DateTimeState): string | null {
  return combineDateTime(state.date, state.time);
}

export class UIDateTimePicker extends ElementBase {
  static get observedAttributes() {
    return [
      'open',
      'default-open',
      'value',
      'default-value',
      'min',
      'max',
      'locale',
      'translations',
      'week-start',
      'size',
      'shape',
      'bare',
      'variant',
      'state',
      'step',
      'format',
      'disabled',
      'readonly',
      'required',
      'name',
      'close-on-select',
      'clearable',
      'allow-input',
      'mode',
      'label',
      'hint',
      'error',
      'show-footer'
    ];
  }

  private _value: DateTimeState = { date: null, time: null };
  private _pending: DateTimeState = { date: null, time: null };
  private _draft = '';
  private _inlineError = '';
  private _open = false;
  private _syncing = false;
  private _overlay: HTMLDivElement | null = null;
  private _releaseScrollLock: (() => void) | null = null;
  private _isInitialized = false;
  private _hasView = false;
  private _restoreFocusEl: HTMLElement | null = null;
  private _overlayKey: string | null = null;
  private readonly _uid = `ui-dtp-${++dateTimePickerUid}`;
  private readonly _inputId = `${this._uid}-input`;
  private readonly _labelId = `${this._uid}-label`;
  private readonly _hintId = `${this._uid}-hint`;
  private readonly _errorId = `${this._uid}-error`;
  private readonly _panelId = `${this._uid}-panel`;
  private _schedulePosition = rafThrottle(() => this._positionOverlay());

  private _onRootClickBound = (event: Event) => this._onRootClick(event);
  private _onRootInputBound = (event: Event) => this._onRootInput(event);
  private _onRootChangeBound = (event: Event) => this._onRootChange(event);
  private _onRootBlurBound = (event: Event) => this._onRootBlur(event);
  private _onRootKeyDownBound = (event: Event) => this._onRootKeyDown(event);
  private _onOverlayClickBound = (event: Event) => this._onOverlayClick(event);
  private _onOverlayChangeBound = (event: Event) => this._onOverlayChange(event);
  private _onOverlayCalendarBound = (event: Event) => this._onOverlayCalendar(event);
  private _onDocumentPointerDownBound = (event: PointerEvent) => this._onDocumentPointerDown(event);
  private _onDocumentKeyDownBound = (event: KeyboardEvent) => this._onDocumentKeyDown(event);
  private _onWindowResizeBound = () => this._schedulePosition.run();
  private _onWindowScrollBound = () => this._schedulePosition.run();

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClickBound);
    this.root.addEventListener('input', this._onRootInputBound);
    this.root.addEventListener('change', this._onRootChangeBound);
    this.root.addEventListener('focusout', this._onRootBlurBound);
    this.root.addEventListener('keydown', this._onRootKeyDownBound);

    if (!this._isInitialized) {
      const initial = parseState(this.getAttribute('value') || this.getAttribute('default-value'));
      this._value = initial;
      this._pending = { ...initial };
      this._draft = this._formatDisplay(initial);
      this._open = this.hasAttribute('open') || isTruthyAttr(this.getAttribute('default-open'));
      this._isInitialized = true;
    }
    if (this._open && !this._isInlineMode()) this._ensureOverlay();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClickBound);
    this.root.removeEventListener('input', this._onRootInputBound);
    this.root.removeEventListener('change', this._onRootChangeBound);
    this.root.removeEventListener('focusout', this._onRootBlurBound);
    this.root.removeEventListener('keydown', this._onRootKeyDownBound);
    this._destroyOverlay();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'value' && !this._syncing) {
      this._value = parseState(newValue);
      this._pending = { ...this._value };
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
    if (name === 'state' && this._state() === 'loading') {
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

  private _state(): 'idle' | 'loading' | 'error' | 'success' {
    const value = (this.getAttribute('state') || '').trim().toLowerCase();
    if (value === 'loading' || value === 'error' || value === 'success') return value;
    return 'idle';
  }

  private _isInteractionBlocked(): boolean {
    return this._isDisabled() || this._state() === 'loading';
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

  private _closeOnSelect(): boolean {
    return isTruthyAttr(this.getAttribute('close-on-select'), false);
  }

  private _shouldAutoCommit(): boolean {
    return this._closeOnSelect() || !this._showFooter();
  }

  private _showFooter(): boolean {
    return isTruthyAttr(this.getAttribute('show-footer'), true);
  }

  private _isBare(): boolean {
    return isTruthyAttr(this.getAttribute('bare'), false);
  }

  private _locale(): string {
    return normalizeLocale(this.getAttribute('locale'));
  }

  private _translations() {
    return resolveDateTimeTranslations(
      this.getAttribute('locale'),
      this.getAttribute('translations')
    );
  }

  private _minuteStep(): number {
    const parsed = Number(this.getAttribute('step') || 5);
    if (!Number.isFinite(parsed) || parsed < 1) return 5;
    return Math.min(60, Math.trunc(parsed));
  }

  private _formatDisplay(state: DateTimeState): string {
    if (!state.date || !state.time) return '';
    const date = formatDateForDisplay(state.date, this._locale(), 'locale', null);
    if (this._is12h()) return `${date} ${to12hDisplay(state.time, this._locale())}`;
    return `${date} ${state.time}`;
  }

  private _is12h(): boolean {
    return (this.getAttribute('format') || '24h') === '12h';
  }

  private _parseDateInput(raw: string): string | null {
    const directIso = normalizeDateIso(raw);
    if (directIso) return directIso;
    const byLocalePattern = parseUserDateInput(raw, this._locale());
    if (byLocalePattern) return byLocalePattern;
    const parsed = new Date(raw);
    if (!Number.isFinite(parsed.getTime())) return null;
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, '0');
    const dd = String(parsed.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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

  private _syncValueAttribute(next: DateTimeState): void {
    const serialized = serializeState(next);
    this._syncing = true;
    try {
      if (!serialized) {
        if (this.hasAttribute('value')) this.removeAttribute('value');
      } else if (this.getAttribute('value') !== serialized) {
        this.setAttribute('value', serialized);
      }
    } finally {
      this._syncing = false;
    }
  }

  private _emitInput(source: string): void {
    const detail: DateTimeDetail = {
      mode: 'datetime',
      value: serializeState(this._pending),
      date: this._pending.date,
      time: this._pending.time,
      source
    };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
  }

  private _emitChange(source: string): void {
    const detail: DateTimeDetail = {
      mode: 'datetime',
      value: serializeState(this._value),
      date: this._value.date,
      time: this._value.time,
      source
    };
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _emitInvalid(raw: string, reason: string): void {
    this.dispatchEvent(new CustomEvent('invalid', { detail: { raw, reason }, bubbles: true, composed: true }));
  }

  private _minDate(): string | null {
    return parseConstraintDate(this.getAttribute('min'));
  }

  private _maxDate(): string | null {
    return parseConstraintDate(this.getAttribute('max'));
  }

  private _minDateTime(): string | null {
    const parsed = parseConstraintDateTime(this.getAttribute('min'));
    return parsed ? `${parsed.date}T${parsed.time}` : null;
  }

  private _maxDateTime(): string | null {
    const parsed = parseConstraintDateTime(this.getAttribute('max'));
    return parsed ? `${parsed.date}T${parsed.time}` : null;
  }

  private _clampState(next: DateTimeState): DateTimeState {
    if (!next.date) return { date: null, time: next.time };
    const minDate = this._minDate();
    const maxDate = this._maxDate();
    const date = clampDateIso(next.date, minDate, maxDate);
    const time = next.time || '00:00';
    let minDateTime = this._minDateTime();
    let maxDateTime = this._maxDateTime();
    if (minDateTime && maxDateTime && compareDateTimes(minDateTime, maxDateTime) > 0) {
      const swap = minDateTime;
      minDateTime = maxDateTime;
      maxDateTime = swap;
    }
    let dateTime = combineDateTime(date, time) || `${date}T00:00`;
    if (minDateTime && compareDateTimes(dateTime, minDateTime) < 0) dateTime = minDateTime;
    if (maxDateTime && compareDateTimes(dateTime, maxDateTime) > 0) dateTime = maxDateTime;
    const split = splitDateTime(dateTime);
    if (!split) return { date, time };
    return { date: split.date, time: split.time };
  }

  private _commit(next: DateTimeState, source: string): void {
    if (this._isInteractionBlocked() || this._isReadonly()) return;
    if (!next.date && !next.time) {
      this._value = { date: null, time: null };
      this._pending = { date: null, time: null };
      this._draft = '';
      this._inlineError = '';
      this._syncValueAttribute(this._value);
      this._emitInput(source);
      this._emitChange(source);
      this._updateHostState();
      return;
    }

    const parsedTime = parseTimeInput(next.time || '', true);
    const normalized = this._clampState({
      date: normalizeDateIso(next.date),
      time: parsedTime ? `${pad2(parsedTime.hours)}:${pad2(parsedTime.minutes)}` : null
    });

    if (!normalized.date || !normalized.time) {
      this._inlineError = this.getAttribute('error') || this._translations().invalidDateTime;
      this._emitInvalid(JSON.stringify(next), 'parse');
      this._updateHostState();
      return;
    }

    this._value = normalized;
    this._pending = { ...normalized };
    this._draft = this._formatDisplay(normalized);
    this._inlineError = '';
    this._syncValueAttribute(this._value);
    this._emitInput(source);
    this._emitChange(source);
    this._updateHostState();
  }

  private _setOpen(next: boolean, source: string): void {
    if (next && this._isInteractionBlocked()) return;
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
    el.style.zIndex = '1100';
    el.style.pointerEvents = 'none';
    el.addEventListener('click', this._onOverlayClickBound);
    el.addEventListener('change', this._onOverlayChangeBound);
    el.addEventListener('change', this._onOverlayCalendarBound as EventListener);
    document.body.appendChild(el);
    this._overlay = el;
    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.addEventListener('keydown', this._onDocumentKeyDownBound);
    window.addEventListener('resize', this._onWindowResizeBound);
    window.addEventListener('scroll', this._onWindowScrollBound, true);
    if (this._isMobileSheet()) this._releaseScrollLock = lockBodyScroll();
  }

  private _destroyOverlay(): void {
    if (!this._overlay) return;
    this._schedulePosition.cancel();
    document.removeEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.removeEventListener('keydown', this._onDocumentKeyDownBound);
    window.removeEventListener('resize', this._onWindowResizeBound);
    window.removeEventListener('scroll', this._onWindowScrollBound, true);
    this._overlay.removeEventListener('click', this._onOverlayClickBound);
    this._overlay.removeEventListener('change', this._onOverlayChangeBound);
    this._overlay.removeEventListener('change', this._onOverlayCalendarBound as EventListener);
    if (this._overlay.parentElement) this._overlay.parentElement.removeChild(this._overlay);
    this._overlay = null;
    this._overlayKey = null;
    if (this._releaseScrollLock) {
      this._releaseScrollLock();
      this._releaseScrollLock = null;
    }
  }

  private _positionOverlay(): void {
    if (!this._overlay || !this._open || this._isMobileSheet()) return;
    const field = this.root.querySelector('.field') as HTMLElement | null;
    const panel = this._overlay.querySelector('.panel') as HTMLElement | null;
    if (!field || !panel) return;
    const position = computePopoverPosition(field.getBoundingClientRect(), panel.getBoundingClientRect());
    panel.style.position = 'absolute';
    panel.style.top = `${Math.round(position.top)}px`;
    panel.style.left = `${Math.round(position.left)}px`;
  }

  private _timeOptions(): { hours: string; minutes: string; meridiem: string } {
    const current = parseTimeInput(this._pending.time || '00:00', true) || { hours: 0, minutes: 0, seconds: 0 };
    const minuteStep = this._minuteStep();
    const hours = this._is12h()
      ? Array.from({ length: 12 }, (_, index) => {
          const value = index + 1;
          const currentHour = (current.hours % 12) || 12;
          return `<option value="${value}" ${value === currentHour ? 'selected' : ''}>${pad2(value)}</option>`;
        }).join('')
      : Array.from({ length: 24 }, (_, index) => {
          return `<option value="${index}" ${index === current.hours ? 'selected' : ''}>${pad2(index)}</option>`;
        }).join('');
    const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, index) => {
      const value = Math.min(59, index * minuteStep);
      return `<option value="${value}" ${value === current.minutes ? 'selected' : ''}>${pad2(value)}</option>`;
    }).join('');
    const meridiem = current.hours >= 12 ? 'pm' : 'am';
    return { hours, minutes, meridiem };
  }

  private _renderSurfaceInner(sheet: boolean, inline = false): string {
    const t = this._translations();
    const options = this._timeOptions();
    const rawLabel = (this.getAttribute('label') || '').trim();
    const title = escapeHtml(rawLabel);
    const dialogLabel = escapeHtml(rawLabel || t.selectDate);
    const valueSummary = this._pending.date && this._pending.time ? this._formatDisplay(this._pending) : '';
    const content = `
      <header class="head">
        <div>
          <p class="head-title" ${rawLabel ? '' : 'hidden'}>${title}</p>
          <p class="head-meta">${escapeHtml(valueSummary || t.selectDate)}</p>
        </div>
      </header>
      <div class="content">
        <ui-calendar class="${inline ? 'dt-calendar-inline' : 'dt-calendar'}" part="calendar"></ui-calendar>
        <section class="time-panel" part="time">
          <span class="icon" aria-hidden="true">${CLOCK_ICON}</span>
          <div class="time-grid" data-meridiem="${this._is12h() ? 'true' : 'false'}">
            <div><label>${escapeHtml(t.hour)}</label><select data-segment="hours">${options.hours}</select></div>
            <div><label>${escapeHtml(t.minute)}</label><select data-segment="minutes">${options.minutes}</select></div>
            ${this._is12h()
              ? `<div><label>${escapeHtml(t.meridiem)}</label><select data-segment="meridiem"><option value="am" ${options.meridiem === 'am' ? 'selected' : ''}>${escapeHtml(t.am)}</option><option value="pm" ${options.meridiem === 'pm' ? 'selected' : ''}>${escapeHtml(t.pm)}</option></select></div>`
              : ''}
          </div>
        </section>
      </div>
      <footer class="footer" part="footer">
        <button type="button" class="action" data-action="now">${escapeHtml(t.now)}</button>
        <button type="button" class="action" data-action="clear">${escapeHtml(t.clear)}</button>
        ${inline ? '' : `<button type="button" class="action" data-action="cancel">${escapeHtml(t.cancel)}</button>`}
        <button type="button" class="action" data-action="apply" data-tone="primary">${escapeHtml(t.apply)}</button>
      </footer>
    `;
    if (inline) return content;
    return `
      <style>${overlayStyle}</style>
      ${sheet ? '<div class="sheet-backdrop" data-action="backdrop"></div>' : ''}
      <section class="${sheet ? 'sheet' : 'panel'}" id="${this._panelId}" role="dialog" aria-modal="${sheet ? 'true' : 'false'}" aria-label="${dialogLabel}" part="${sheet ? 'sheet' : 'popover'}">${content}</section>
    `;
  }

  private _syncCalendar(calendarEl: HTMLElement): void {
    const syncAttr = (name: string, value: string | null) => {
      if (value == null || value === '') {
        if (calendarEl.hasAttribute(name)) calendarEl.removeAttribute(name);
        return;
      }
      if (calendarEl.getAttribute(name) !== value) calendarEl.setAttribute(name, value);
    };
    const syncBool = (name: string, enabled: boolean) => {
      if (enabled) syncAttr(name, '');
      else syncAttr(name, null);
    };
    syncAttr('selection', 'single');
    syncAttr('value', this._pending.date);
    syncAttr('min', this.getAttribute('min'));
    syncAttr('max', this.getAttribute('max'));
    syncAttr('locale', this.getAttribute('locale'));
    syncAttr('translations', this.getAttribute('translations'));
    syncAttr('week-start', this.getAttribute('week-start'));
    const sizeAttr = this.getAttribute('size');
    const effectiveSize = sizeAttr || 'sm';
    const isInlineCalendar = calendarEl.classList.contains('dt-calendar-inline');
    syncAttr('size', effectiveSize === 'lg' ? 'md' : 'sm');
    syncAttr('variant', this.getAttribute('variant'));
    syncBool('readonly', this._isReadonly());
    syncBool('disabled', this._isInteractionBlocked());
    syncBool('bare', this._isBare());
    syncAttr('tabindex', '-1');
    if (effectiveSize === 'lg') {
      calendarEl.style.setProperty('--ui-calendar-day-height', '1.95em');
      calendarEl.style.setProperty('--ui-calendar-day-padding-block', '0.2em');
      calendarEl.style.setProperty('--ui-calendar-day-padding-inline', '0.26em');
      calendarEl.style.setProperty('--ui-calendar-gap', '0.42em');
      calendarEl.style.setProperty('--ui-calendar-day-font-size', '0.78em');
      calendarEl.style.setProperty('--ui-calendar-weekday-font-size', '0.7em');
      calendarEl.style.setProperty('--ui-calendar-title-font-size', '0.88em');
    } else {
      calendarEl.style.setProperty('--ui-calendar-day-height', '2.4em');
      calendarEl.style.setProperty('--ui-calendar-day-padding-block', '0.14em');
      calendarEl.style.setProperty('--ui-calendar-day-padding-inline', '0.22em');
      calendarEl.style.setProperty('--ui-calendar-gap', '0.34em');
      calendarEl.style.setProperty('--ui-calendar-day-font-size', '0.72em');
      calendarEl.style.setProperty('--ui-calendar-weekday-font-size', '0.64em');
      calendarEl.style.setProperty('--ui-calendar-title-font-size', '0.8em');
    }
    if (isInlineCalendar) {
      calendarEl.style.setProperty('--ui-calendar-frame-padding', '0.32em');
      calendarEl.style.setProperty('--ui-calendar-week-gap', '0.18em');
      calendarEl.style.setProperty('--ui-calendar-control-height', '1.72em');
      calendarEl.style.setProperty('--ui-calendar-gap', '0.24em');
    } else {
      calendarEl.style.removeProperty('--ui-calendar-frame-padding');
      calendarEl.style.removeProperty('--ui-calendar-week-gap');
      calendarEl.style.removeProperty('--ui-calendar-control-height');
    }
    syncAttr('aria-label', this.getAttribute('label') || this._translations().selectDate);
  }

  private _overlaySignature(sheet: boolean): string {
    return [
      sheet ? 'sheet' : 'popover',
      this._minuteStep(),
      this._is12h() ? '12h' : '24h',
      this.getAttribute('locale') || '',
      this.getAttribute('translations') || ''
    ].join(':');
  }

  private _ensureOverlayContent(sheet: boolean): void {
    if (!this._overlay) return;
    const signature = this._overlaySignature(sheet);
    if (this._overlayKey === signature && this._overlay.querySelector('.dt-calendar')) return;
    this._overlayKey = signature;
    this._overlay.innerHTML = sheet
      ? `<div class="sheet-wrap">${this._renderSurfaceInner(true)}</div>`
      : `<div class="overlay">${this._renderSurfaceInner(false)}</div>`;
  }

  private _setClosestOptionValue(select: HTMLSelectElement, desired: number): void {
    const values = Array.from(select.options).map((option) => Number(option.value)).filter((n) => Number.isFinite(n));
    if (!values.length) return;
    let best = values[0];
    let bestDistance = Math.abs(best - desired);
    for (let index = 1; index < values.length; index += 1) {
      const current = values[index];
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
    const sheet = this._isMobileSheet();
    this._ensureOverlayContent(sheet);
    const t = this._translations();
    const panel = this._overlay.querySelector('.panel, .sheet') as HTMLElement | null;
    const footer = this._overlay.querySelector('.footer') as HTMLElement | null;
    if (panel) panel.dataset.bare = this._isBare() ? 'true' : 'false';
    if (footer) footer.hidden = !this._showFooter();
    const headTitle = this._overlay.querySelector('.head-title') as HTMLElement | null;
    if (headTitle) {
      const label = (this.getAttribute('label') || '').trim();
      headTitle.textContent = label;
      headTitle.hidden = !label;
    }
    const headMeta = this._overlay.querySelector('.head-meta') as HTMLElement | null;
    if (headMeta) headMeta.textContent = this._pending.date && this._pending.time ? this._formatDisplay(this._pending) : t.selectDate;
    const calendarEl = this._overlay.querySelector('.dt-calendar') as HTMLElement | null;
    if (calendarEl) this._syncCalendar(calendarEl);
    const parsed = parseTimeInput(this._pending.time || '00:00', true) || { hours: 0, minutes: 0, seconds: 0 };
    const hourEl = this._overlay.querySelector('select[data-segment="hours"]') as HTMLSelectElement | null;
    const minuteEl = this._overlay.querySelector('select[data-segment="minutes"]') as HTMLSelectElement | null;
    const meridiemEl = this._overlay.querySelector('select[data-segment="meridiem"]') as HTMLSelectElement | null;
    if (hourEl) {
      const hourValue = this._is12h() ? ((parsed.hours % 12) || 12) : parsed.hours;
      this._setClosestOptionValue(hourEl, hourValue);
      hourEl.disabled = this._isInteractionBlocked() || this._isReadonly();
    }
    if (minuteEl) {
      this._setClosestOptionValue(minuteEl, parsed.minutes);
      minuteEl.disabled = this._isInteractionBlocked() || this._isReadonly();
    }
    if (meridiemEl) {
      meridiemEl.value = parsed.hours >= 12 ? 'pm' : 'am';
      meridiemEl.disabled = this._isInteractionBlocked() || this._isReadonly();
    }
    const disabled = this._isInteractionBlocked() || this._isReadonly();
    const actions = this._overlay.querySelectorAll('.action');
    actions.forEach((node) => {
      (node as HTMLButtonElement).disabled = disabled;
    });
    if (!sheet) this._schedulePosition.run();
  }

  private _renderOverlay(): void {
    this._syncOverlayState();
  }

  private _applyTimeFromSurface(surface: ParentNode): void {
    const hourEl = surface.querySelector('select[data-segment="hours"]') as HTMLSelectElement | null;
    const minuteEl = surface.querySelector('select[data-segment="minutes"]') as HTMLSelectElement | null;
    const meridiemEl = surface.querySelector('select[data-segment="meridiem"]') as HTMLSelectElement | null;
    if (!hourEl || !minuteEl) return;
    const hours = Number(hourEl.value);
    const minutes = Number(minuteEl.value);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;
    let resolvedHours = hours;
    if (this._is12h()) {
      const meridiem = meridiemEl?.value === 'pm' ? 'pm' : 'am';
      if (meridiem === 'pm' && resolvedHours < 12) resolvedHours += 12;
      if (meridiem === 'am' && resolvedHours === 12) resolvedHours = 0;
    }
    this._pending = this._clampState({
      date: this._pending.date,
      time: `${pad2(resolvedHours)}:${pad2(minutes)}`
    });
    this._emitInput('time');
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const action = target.closest('[data-action]')?.getAttribute('data-action');
    if (!action) return;
    if (this._isInteractionBlocked() || this._isReadonly()) return;
    if (action === 'toggle') {
      this._restoreFocusEl = target;
      this._setOpen(!this._open, 'toggle');
      return;
    }
    if (action === 'clear') {
      if (this._isInlineMode()) {
        this._pending = { date: null, time: null };
        this._emitInput('clear');
        this._updateHostState();
      } else {
        this._commit({ date: null, time: null }, 'clear');
      }
      return;
    }
    if (this._isInlineMode() && action === 'now') {
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const date = `${now.getFullYear()}-${mm}-${dd}`;
      const time = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
      this._pending = this._clampState({ date, time });
      this._emitInput('now');
      this._updateHostState();
      return;
    }
    if (this._isInlineMode() && action === 'cancel') {
      this._pending = { ...this._value };
      this._updateHostState();
      return;
    }
    if (this._isInlineMode() && action === 'apply') {
      this._commit(this._pending, 'apply');
    }
  }

  private _onRootChange(event: Event): void {
    if (!this._isInlineMode()) return;
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.tagName.toLowerCase() === 'ui-calendar') {
      this._onOverlayCalendar(event);
      return;
    }
    if (target instanceof HTMLSelectElement && target.closest('.inline-panel')) {
      if (!target.matches('select[data-segment]')) return;
      if (this._isInteractionBlocked() || this._isReadonly()) return;
      const panel = this.root.querySelector('.inline-panel') as HTMLElement | null;
      if (!panel) return;
      this._applyTimeFromSurface(panel);
      if (this._shouldAutoCommit() && this._pending.date && this._pending.time) {
        this._commit(this._pending, 'time');
        return;
      }
      this._updateHostState();
    }
  }

  private _onRootInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.classList.contains('input')) return;
    if (!this._allowInput()) return;
    if (this._isInteractionBlocked()) return;
    this._draft = input.value;
    this._inlineError = '';
    this._emitInput('typing');
  }

  private _onRootBlur(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.classList.contains('input')) return;
    if (!this._allowInput()) return;
    if (this._isInteractionBlocked()) return;
    const raw = this._draft.trim();
    if (!raw) {
      this._commit({ date: null, time: null }, 'blur');
      return;
    }
    const match = /^(.+)\s+(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[ap]m)?)$/i.exec(raw);
    if (!match) {
      this._inlineError = this.getAttribute('error') || this._translations().invalidDateTime;
      this._emitInvalid(raw, 'parse');
      this._updateHostState();
      return;
    }
    const date = this._parseDateInput(match[1]);
    const time = parseTimeInput(match[2], true) ? match[2] : null;
    if (!date || !time) {
      this._inlineError = this.getAttribute('error') || this._translations().invalidDateTime;
      this._emitInvalid(raw, 'parse');
      this._updateHostState();
      return;
    }
    this._commit({ date, time }, 'blur');
  }

  private _onRootKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this._isInteractionBlocked()) return;
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
    if (this._isInteractionBlocked()) return;
    if (this._isReadonly() && action !== 'toggle') return;
    if (action === 'backdrop') {
      this._setOpen(false, 'outside');
      return;
    }
    if (action === 'cancel') {
      this._pending = { ...this._value };
      this._setOpen(false, 'cancel');
      return;
    }
    if (action === 'clear') {
      this._pending = { date: null, time: null };
      this._emitInput('clear');
      this._renderOverlay();
      return;
    }
    if (action === 'now') {
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const date = `${now.getFullYear()}-${mm}-${dd}`;
      const time = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
      this._pending = this._clampState({ date, time });
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
    if (this._isInteractionBlocked()) return;
    if (!this._overlay) return;
    this._applyTimeFromSurface(this._overlay);
    if (this._shouldAutoCommit() && this._pending.date && this._pending.time) {
      this._commit(this._pending, 'time');
      this._setOpen(false, 'time');
    }
  }

  private _onOverlayCalendar(event: Event): void {
    if (this._isInteractionBlocked() || this._isReadonly()) return;
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'ui-calendar') return;
    const type = event.type;
    const detail = (event as CustomEvent<{ value?: string }>).detail;
    const date = normalizeDateIso(type === 'select' ? detail?.value || null : (detail?.value as string | null));
    if (!date) return;
    this._pending = this._clampState({ date, time: this._pending.time || '09:00' });
    this._emitInput('calendar');
    if (this._shouldAutoCommit() && this._pending.time) {
      this._commit(this._pending, 'calendar');
      this._setOpen(false, 'calendar');
      return;
    }
    this._updateHostState();
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

  private _updateHostState(): void {
    if (!this._hasView) return;
    const label = this.getAttribute('label') || '';
    const hint = this.getAttribute('hint') || '';
    const manualError = this.getAttribute('error') || '';
    const error = this._inlineError || manualError;
    const hasValue = !!serializeState(this._value);
    const name = this.getAttribute('name') || '';
    const display = this._allowInput() ? this._draft : this._formatDisplay(this._value);
    const isInline = this._isInlineMode();
    const t = this._translations();
    const state = error ? 'error' : this._state();
    if (this._state() === 'loading') this.setAttribute('aria-busy', 'true');
    else this.removeAttribute('aria-busy');

    const labelEl = this.root.querySelector('.label') as HTMLElement | null;
    const labelTextEl = this.root.querySelector('.label-text') as HTMLElement | null;
    const requiredEl = this.root.querySelector('.required') as HTMLElement | null;
    const inputEl = this.root.querySelector('.input') as HTMLInputElement | null;
    const clearBtn = this.root.querySelector('.btn[data-action="clear"]') as HTMLButtonElement | null;
    const toggleBtn = this.root.querySelector('.btn[data-action="toggle"]') as HTMLButtonElement | null;
    const hintEl = this.root.querySelector('.hint') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const hiddenInput = this.root.querySelector('.hidden-input') as HTMLInputElement | null;

    if (labelEl) labelEl.hidden = !label;
    if (labelEl) {
      labelEl.id = this._labelId;
      labelEl.setAttribute('for', this._inputId);
    }
    if (labelTextEl) labelTextEl.textContent = label;
    if (requiredEl) requiredEl.hidden = !this.hasAttribute('required');
    if (inputEl) {
      if (inputEl.value !== display) inputEl.value = display;
      inputEl.id = this._inputId;
      inputEl.placeholder = t.dateTimePlaceholder;
      inputEl.readOnly = !this._allowInput() || this._isReadonly();
      inputEl.disabled = this._isInteractionBlocked();
      inputEl.required = this.hasAttribute('required');
      inputEl.autocomplete = 'off';
      inputEl.setAttribute('role', 'combobox');
      inputEl.setAttribute('aria-haspopup', 'dialog');
      inputEl.setAttribute('aria-expanded', isInline ? 'false' : String(this._open));
      inputEl.setAttribute('aria-controls', this._panelId);
      inputEl.setAttribute('aria-invalid', error ? 'true' : 'false');
      if (label) inputEl.setAttribute('aria-labelledby', this._labelId);
      else inputEl.removeAttribute('aria-labelledby');
    }
    if (clearBtn) {
      clearBtn.hidden = !(this._clearable() && hasValue);
      clearBtn.setAttribute('aria-label', t.clear);
      clearBtn.disabled = this._isInteractionBlocked();
    }
    if (toggleBtn) {
      toggleBtn.hidden = isInline;
      toggleBtn.setAttribute('aria-label', t.toggleCalendar);
      toggleBtn.setAttribute('aria-expanded', isInline ? 'false' : String(this._open));
      toggleBtn.setAttribute('aria-controls', this._panelId);
      toggleBtn.disabled = this._isInteractionBlocked();
    }
    if (hintEl) {
      hintEl.id = this._hintId;
      hintEl.hidden = !hint;
      hintEl.textContent = hint;
    }
    if (errorEl) {
      errorEl.id = this._errorId;
      errorEl.hidden = !error;
      errorEl.textContent = error;
    }
    if (inputEl) {
      const describedBy: string[] = [];
      if (hint && hintEl && !hintEl.hidden) describedBy.push(this._hintId);
      if (error) describedBy.push(this._errorId);
      if (describedBy.length) inputEl.setAttribute('aria-describedby', describedBy.join(' '));
      else inputEl.removeAttribute('aria-describedby');
    }
    if (hiddenInput) {
      hiddenInput.disabled = !name;
      hiddenInput.name = name;
      hiddenInput.value = serializeState(this._value) || '';
    }

    const field = this.root.querySelector('.field') as HTMLElement | null;
    if (field) {
      field.dataset.open = this._open && !isInline ? 'true' : 'false';
      field.dataset.invalid = error ? 'true' : 'false';
      field.dataset.state = state;
    }

    const inlinePanel = this.root.querySelector('.inline-panel') as HTMLElement | null;
    if (inlinePanel) {
      inlinePanel.hidden = !isInline;
      inlinePanel.id = this._panelId;
      inlinePanel.dataset.bare = this._isBare() ? 'true' : 'false';
      inlinePanel.setAttribute('role', 'dialog');
      inlinePanel.setAttribute('aria-modal', 'false');
      inlinePanel.setAttribute('aria-label', label || t.selectDate);
      const inlineTitle = inlinePanel.querySelector('.panel-title') as HTMLElement | null;
      if (inlineTitle) {
        inlineTitle.textContent = label;
        inlineTitle.hidden = !label;
      }
      const inlineHeadTitle = inlinePanel.querySelector('.head-title') as HTMLElement | null;
      if (inlineHeadTitle) {
        inlineHeadTitle.textContent = label;
        inlineHeadTitle.hidden = !label;
      }
      const inlineHeadMeta = inlinePanel.querySelector('.head-meta') as HTMLElement | null;
      if (inlineHeadMeta) inlineHeadMeta.textContent = this._pending.date && this._pending.time ? this._formatDisplay(this._pending) : t.selectDate;
      const inlineNow = inlinePanel.querySelector('[data-action="now"]') as HTMLElement | null;
      if (inlineNow) inlineNow.textContent = t.now;
      const inlineClear = inlinePanel.querySelector('[data-action="clear"]') as HTMLElement | null;
      if (inlineClear) inlineClear.textContent = t.clear;
      const inlineApply = inlinePanel.querySelector('[data-action="apply"]') as HTMLElement | null;
      if (inlineApply) inlineApply.textContent = t.apply;
      const inlineFooter = inlinePanel.querySelector('.footer') as HTMLElement | null;
      if (inlineFooter) inlineFooter.hidden = !this._showFooter();
      const inlineCalendar = inlinePanel.querySelector('.dt-calendar-inline') as HTMLElement | null;
      if (inlineCalendar) this._syncCalendar(inlineCalendar);
      const inlineHour = inlinePanel.querySelector('select[data-segment="hours"]') as HTMLSelectElement | null;
      const inlineMinute = inlinePanel.querySelector('select[data-segment="minutes"]') as HTMLSelectElement | null;
      const inlineMeridiem = inlinePanel.querySelector('select[data-segment="meridiem"]') as HTMLSelectElement | null;
      const parsed = parseTimeInput(this._pending.time || '00:00', true) || { hours: 0, minutes: 0, seconds: 0 };
      if (inlineHour) {
        const hourValue = this._is12h() ? ((parsed.hours % 12) || 12) : parsed.hours;
        this._setClosestOptionValue(inlineHour, hourValue);
        inlineHour.disabled = this._isInteractionBlocked() || this._isReadonly();
      }
      if (inlineMinute) {
        this._setClosestOptionValue(inlineMinute, parsed.minutes);
        inlineMinute.disabled = this._isInteractionBlocked() || this._isReadonly();
      }
      if (inlineMeridiem) {
        inlineMeridiem.value = parsed.hours >= 12 ? 'pm' : 'am';
        inlineMeridiem.disabled = this._isInteractionBlocked() || this._isReadonly();
      }
      inlinePanel.querySelectorAll('.action').forEach((node) => {
        (node as HTMLButtonElement).disabled = this._isInteractionBlocked() || this._isReadonly();
      });
    }

    if (!isInline && this._open) this._syncOverlayState();
    if (isInline) this._destroyOverlay();
  }

  protected override render(): void {
    if (!this._hasView) {
      const t = this._translations();
      this.setContent(`
        <style>${style}</style>
        <div class="root">
          <label class="label" part="label" id="${this._labelId}">
            <span class="label-text"></span>
            <span class="required">*</span>
          </label>
          <div class="field" part="field input">
            <span class="icon" part="icon">${CALENDAR_ICON}</span>
            <input class="input" id="${this._inputId}" part="input" />
            <span class="icon" part="icon">${CLOCK_ICON}</span>
            <button type="button" class="btn" part="clear" data-action="clear">${CLOSE_ICON}</button>
            <button type="button" class="btn" part="toggle" data-action="toggle">${CHEVRON_ICON}</button>
          </div>
          <div class="hint" id="${this._hintId}" part="hint"></div>
          <div class="error" id="${this._errorId}" part="error" role="alert"></div>
          <input class="hidden-input" type="hidden" disabled />
          <section class="inline-panel" id="${this._panelId}" part="popover" hidden>
            <p class="panel-title">${escapeHtml(t.selectDate)}</p>
            ${this._renderSurfaceInner(false, true)}
          </section>
        </div>
      `, { force: true });
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-date-time-picker')) {
  customElements.define('ui-date-time-picker', UIDateTimePicker);
}
