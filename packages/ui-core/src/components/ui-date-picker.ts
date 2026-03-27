import { ElementBase } from '../ElementBase';
import { compareISO } from './ui-calendar';
import { resolveDateTimeTranslations } from './date-time-i18n';
import {
  clampDateIso,
  computePopoverPosition,
  formatDateForDisplay,
  isTruthyAttr,
  lockBodyScroll,
  normalizeDateIso,
  normalizeLocale,
  parseConstraintDate,
  parseUserDateInput,
  rafThrottle,
  shouldUseMobileSheet
} from './date-time-utils';

type DatePickerSource =
  | 'typing'
  | 'blur'
  | 'enter'
  | 'calendar'
  | 'apply'
  | 'clear'
  | 'today'
  | 'api'
  | 'outside'
  | 'escape';

type DatePickerDetail = {
  mode: 'single';
  value: string | null;
  displayValue: string;
  source: DatePickerSource;
};

type DatePickerState = 'idle' | 'loading' | 'error' | 'success';

let datePickerUid = 0;

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

const style = `
  :host {
    --ui-dp-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-dp-surface: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 92%, var(--ui-color-surface-alt, #f8fafc))
    );
    --ui-dp-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 76%, transparent);
    --ui-dp-text: var(--ui-color-text, #0f172a);
    --ui-dp-muted: var(--ui-color-muted, #64748b);
    --ui-dp-accent: var(--ui-color-primary, #2563eb);
    --ui-dp-success: var(--ui-color-success, #15803d);
    --ui-dp-radius: 12px;
    --ui-dp-panel-radius: calc(var(--ui-dp-radius) + 2px);
    --ui-dp-shadow: none;
    --ui-dp-z: 1600;
    --ui-dp-gap: 12px;
    --ui-dp-hit: 42px;
    --ui-dp-field-bg: var(--ui-dp-bg);
    --ui-dp-field-border: var(--ui-dp-border);
    --ui-dp-field-focus: color-mix(in srgb, var(--ui-dp-accent) 72%, transparent);
    --ui-dp-field-error: var(--ui-color-danger, #dc2626);
    --ui-dp-focus-ring: color-mix(in srgb, var(--ui-dp-accent) 26%, transparent);
    --ui-dp-sheet-backdrop: rgba(15, 23, 42, 0.52);
    --ui-dp-sheet-bg: var(--ui-dp-bg);
    --ui-dp-duration: 160ms;
    --ui-dp-ease: cubic-bezier(0.2, 0.9, 0.24, 1);
    color-scheme: light dark;
    display: inline-grid;
    inline-size: min(100%, var(--ui-width, 320px));
    min-inline-size: min(220px, 100%);
    color: var(--ui-dp-text);
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  :host([shape="square"]) {
    --ui-dp-radius: 6px;
  }

  :host([shape="soft"]) {
    --ui-dp-radius: 16px;
  }

  :host([size="sm"]) {
    --ui-dp-hit: 38px;
  }

  :host([size="lg"]) {
    --ui-dp-hit: 48px;
  }

  .root {
    min-inline-size: 0;
    display: grid;
    gap: 8px;
  }

  .label {
    font: 600 13px/1.35 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-dp-text);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .required {
    color: var(--ui-dp-field-error);
    font-size: 11px;
    line-height: 1;
  }

  .field {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 8px;
    min-block-size: var(--ui-dp-hit);
    padding: 0 10px 0 11px;
    border: 1px solid var(--ui-dp-field-border);
    border-radius: var(--ui-dp-radius);
    background: var(--ui-dp-surface);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.75);
    transition: border-color var(--ui-dp-duration) var(--ui-dp-ease), box-shadow var(--ui-dp-duration) var(--ui-dp-ease), transform var(--ui-dp-duration) var(--ui-dp-ease);
  }

  .field[data-open="true"] {
    border-color: var(--ui-dp-field-focus);
    box-shadow: 0 0 0 3px var(--ui-dp-focus-ring), 0 10px 24px rgba(2, 6, 23, 0.12);
  }

  .field:focus-within {
    border-color: var(--ui-dp-field-focus);
    box-shadow: 0 0 0 3px var(--ui-dp-focus-ring), 0 4px 14px rgba(2, 6, 23, 0.09);
  }

  .field[data-invalid="true"] {
    border-color: color-mix(in srgb, var(--ui-dp-field-error) 68%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-dp-field-error) 20%, transparent);
  }

  .field[data-state="success"]:not([data-invalid="true"]) {
    border-color: color-mix(in srgb, var(--ui-dp-success) 56%, var(--ui-dp-border));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-dp-success) 20%, transparent);
  }

  .field[data-state="loading"] {
    pointer-events: none;
    opacity: 0.92;
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

  .input {
    inline-size: 100%;
    min-inline-size: 0;
    border: 0;
    background: transparent;
    color: var(--ui-dp-text);
    padding: 8px 0;
    outline: none;
    font: 500 14px/1.4 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.005em;
  }

  .input::placeholder {
    color: color-mix(in srgb, var(--ui-dp-text) 44%, transparent);
  }

  .btn {
    border: 0;
    background: transparent;
    color: color-mix(in srgb, var(--ui-dp-text) 74%, transparent);
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    display: inline-grid;
    place-items: center;
    cursor: pointer;
    transition: background-color var(--ui-dp-duration) var(--ui-dp-ease), color var(--ui-dp-duration) var(--ui-dp-ease), transform var(--ui-dp-duration) var(--ui-dp-ease);
  }

  .btn:hover {
    background: color-mix(in srgb, var(--ui-dp-text) 10%, transparent);
    color: var(--ui-dp-text);
  }

  .btn:active {
    transform: translateY(1px);
  }

  .btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-dp-accent) 64%, transparent);
    outline-offset: 1px;
  }

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  .toggle-icon {
    display: inline-grid;
    place-items: center;
  }

  .spinner {
    display: none;
    inline-size: 14px;
    block-size: 14px;
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--ui-dp-text) 20%, transparent);
    border-top-color: color-mix(in srgb, var(--ui-dp-accent) 72%, transparent);
    animation: ui-dp-spin 780ms linear infinite;
  }

  :host([state="loading"]) .toggle-icon {
    display: none;
  }

  :host([state="loading"]) .spinner {
    display: inline-block;
  }

  .btn[hidden] {
    display: none;
  }

  .hint {
    color: var(--ui-dp-muted);
    font-size: 12px;
    line-height: 1.4;
  }

  .error {
    color: var(--ui-dp-field-error);
    font-size: 12px;
    line-height: 1.4;
  }

  .hint[hidden],
  .error[hidden],
  .label[hidden] {
    display: none;
  }

  :host([disabled]) .field {
    opacity: 0.62;
    pointer-events: none;
  }

  :host([readonly]) .field {
    background: color-mix(in srgb, var(--ui-dp-field-bg) 92%, var(--ui-color-surface-alt, #f8fafc));
  }

  :host([variant="contrast"]) {
    --ui-dp-bg: #0f172a;
    --ui-dp-border: #334155;
    --ui-dp-text: #e2e8f0;
    --ui-dp-muted: #93a4bd;
    --ui-dp-accent: #93c5fd;
    --ui-dp-field-bg: #0f172a;
    --ui-dp-sheet-bg: #0f172a;
    --ui-dp-sheet-backdrop: rgba(2, 6, 23, 0.74);
    --ui-dp-surface: linear-gradient(180deg, color-mix(in srgb, #0f172a 86%, #1e293b), #0f172a);
  }

  :host([state="success"]) {
    --ui-dp-field-focus: color-mix(in srgb, var(--ui-dp-success) 72%, transparent);
    --ui-dp-focus-ring: color-mix(in srgb, var(--ui-dp-success) 26%, transparent);
  }

  .inline-panel {
    border: 1px solid var(--ui-dp-border);
    border-radius: var(--ui-dp-panel-radius);
    background: var(--ui-dp-surface);
    box-shadow: var(--ui-dp-shadow);
    inline-size: fit-content;
    max-inline-size: 100%;
    justify-self: start;
    padding: 10px;
    display: grid;
    gap: var(--ui-dp-gap);
  }

  .inline-panel .footer {
    gap: 6px;
  }

  .inline-panel .action {
    min-block-size: 30px;
    padding: 0 10px;
  }

  .inline-panel[data-bare="true"] {
    border: 0;
    border-radius: 0;
    background: var(--ui-dp-bare-bg, var(--ui-dp-bg));
    box-shadow: none;
    padding: 0;
  }

  .inline-panel[hidden] {
    display: none !important;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }

  .footer[hidden] {
    display: none !important;
  }

  .action {
    border: 1px solid color-mix(in srgb, var(--ui-dp-border) 85%, transparent);
    background: color-mix(in srgb, var(--ui-dp-bg) 95%, transparent);
    color: var(--ui-dp-text);
    min-block-size: 32px;
    border-radius: 8px;
    padding: 0 12px;
    font: 600 12px/1 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition: border-color var(--ui-dp-duration) var(--ui-dp-ease), background-color var(--ui-dp-duration) var(--ui-dp-ease), transform var(--ui-dp-duration) var(--ui-dp-ease);
  }

  .action:hover {
    border-color: color-mix(in srgb, var(--ui-dp-accent) 38%, var(--ui-dp-border));
    background: color-mix(in srgb, var(--ui-dp-accent) 10%, transparent);
  }

  .action:active {
    transform: translateY(1px);
  }

  .action:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-dp-accent) 64%, transparent);
    outline-offset: 1px;
  }

  .action[data-tone="primary"] {
    border-color: color-mix(in srgb, var(--ui-dp-accent) 60%, transparent);
    background: color-mix(in srgb, var(--ui-dp-accent) 20%, transparent);
    color: color-mix(in srgb, var(--ui-dp-text) 94%, transparent);
  }

  .action:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }

  @media (max-width: 640px) {
    :host {
      inline-size: min(100%, var(--ui-width, 100%));
    }

    .field {
      min-block-size: max(var(--ui-dp-hit), 40px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .field,
    .btn,
    .action,
    .spinner {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (forced-colors: active) {
    .field,
    .inline-panel,
    .action {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
    .field:focus-within,
    .action:focus-visible,
    .btn:focus-visible {
      outline-color: Highlight;
    }
    .spinner {
      border-color: CanvasText;
      border-top-color: CanvasText;
    }
  }

  @keyframes ui-dp-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const overlayStyle = `
  .overlay {
    position: fixed;
    z-index: var(--ui-dp-z, 1600);
    pointer-events: none;
  }

  .panel {
    pointer-events: auto;
    border: 1px solid var(--ui-dp-border, #cbd5e1);
    border-radius: var(--ui-dp-panel-radius, 14px);
    background: var(--ui-dp-surface, #fff);
    color: var(--ui-dp-text, #0f172a);
    box-shadow: var(--ui-dp-shadow);
    padding: 10px;
    display: grid;
    gap: var(--ui-dp-gap, 12px);
    inline-size: min(var(--ui-dp-panel-width, 20rem), calc(100vw - 16px));
    max-inline-size: calc(100vw - 16px);
    transform-origin: top;
    animation: ui-dp-pop-in var(--ui-dp-duration, 160ms) var(--ui-dp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }

  .panel[data-bare="true"],
  .sheet[data-bare="true"] {
    border: 0;
    border-radius: 0;
    background: var(--ui-dp-bare-bg, var(--ui-dp-bg));
    box-shadow: none;
    padding: 0;
  }

  .sheet-wrap {
    position: fixed;
    inset: 0;
    display: grid;
    align-items: end;
    z-index: var(--ui-dp-z, 1600);
  }

  .sheet-backdrop {
    position: absolute;
    inset: 0;
    background: var(--ui-dp-sheet-backdrop, rgba(15, 23, 42, 0.52));
  }

  .sheet {
    position: relative;
    pointer-events: auto;
    background: var(--ui-dp-sheet-bg, #fff);
    color: var(--ui-dp-text, #0f172a);
    border-radius: 16px 16px 0 0;
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 84%, transparent);
    box-shadow: 0 -12px 30px rgba(2, 6, 23, 0.2);
    padding: 12px;
    display: grid;
    gap: 10px;
    max-block-size: min(82vh, 620px);
    overflow: auto;
    animation: ui-dp-sheet-up var(--ui-dp-duration, 160ms) var(--ui-dp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .title {
    margin: 0;
    font: 700 14px/1.3 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-dp-text, #0f172a);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
  }

  .footer[hidden] {
    display: none !important;
  }

  .action {
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 85%, transparent);
    background: color-mix(in srgb, var(--ui-dp-bg, #fff) 94%, transparent);
    color: var(--ui-dp-text, #0f172a);
    min-block-size: 32px;
    border-radius: 8px;
    padding: 0 12px;
    font: 600 12px/1 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition: border-color var(--ui-dp-duration, 160ms) var(--ui-dp-ease, cubic-bezier(0.2, 0.9, 0.24, 1)), background-color var(--ui-dp-duration, 160ms) var(--ui-dp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }

  .action:hover {
    border-color: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 38%, var(--ui-dp-border, #cbd5e1));
    background: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 10%, transparent);
  }

  .action:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-dp-accent, #2563eb) 64%, transparent);
    outline-offset: 1px;
  }

  .action[data-tone="primary"] {
    border-color: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 60%, transparent);
    background: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 18%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    .panel,
    .sheet,
    .action {
      animation: none !important;
      transition: none !important;
    }
  }

  @keyframes ui-dp-pop-in {
    from {
      opacity: 0;
      transform: translateY(6px) scale(0.985);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes ui-dp-sheet-up {
    from {
      opacity: 0.82;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export class UIDatePicker extends ElementBase {
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
      'placeholder',
      'label',
      'hint',
      'error',
      'clearable',
      'allow-input',
      'close-on-select',
      'outside-click',
      'disabled',
      'readonly',
      'required',
      'name',
      'mode',
      'events',
      'events-max',
      'events-display',
      'format',
      'display-format',
      'show-footer'
    ];
  }

  private _value: string | null = null;
  private _pendingValue: string | null = null;
  private _draftInput = '';
  private _inlineError = '';
  private _open = false;
  private _syncing = false;
  private _overlay: HTMLDivElement | null = null;
  private _releaseScrollLock: (() => void) | null = null;
  private _lastOpenSource: DatePickerSource | 'attribute' = 'api';
  private _restoreFocusEl: HTMLElement | null = null;
  private _isInitialized = false;
  private _hasView = false;
  private _overlayMode: 'sheet' | 'popover' | null = null;
  private readonly _uid = `ui-dp-${++datePickerUid}`;
  private readonly _inputId = `${this._uid}-input`;
  private readonly _labelId = `${this._uid}-label`;
  private readonly _hintId = `${this._uid}-hint`;
  private readonly _errorId = `${this._uid}-error`;
  private readonly _panelId = `${this._uid}-panel`;
  private readonly _panelTitleId = `${this._uid}-panel-title`;
  private _overlayFocusedOnOpen = false;
  private _inlineCalendarFramePending = false;
  private _inlineCalendarUpgradePending = false;

  private _schedulePosition = rafThrottle(() => this._positionOverlay());

  private _onRootClickBound = (event: Event) => this._onRootClick(event);
  private _onRootInputBound = (event: Event) => this._onRootInput(event);
  private _onRootBlurBound = (event: Event) => this._onRootBlur(event);
  private _onRootKeyDownBound = (event: Event) => this._onRootKeyDown(event);

  private _onDocumentPointerDownBound = (event: PointerEvent) => this._onDocumentPointerDown(event);
  private _onDocumentKeyDownBound = (event: KeyboardEvent) => this._onDocumentKeyDown(event);
  private _onWindowResizeBound = () => this._schedulePosition.run();
  private _onWindowScrollBound = () => this._schedulePosition.run();
  private _onOverlayClickBound = (event: Event) => this._onOverlayClick(event);
  private _onOverlaySelectBound = (event: Event) => this._onCalendarSelect(event);

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClickBound);
    this.root.addEventListener('input', this._onRootInputBound);
    this.root.addEventListener('focusout', this._onRootBlurBound);
    this.root.addEventListener('keydown', this._onRootKeyDownBound);

    if (!this._isInitialized) {
      const initial = this._clampToBounds(
        normalizeDateIso(this.getAttribute('value'))
          || normalizeDateIso(this.getAttribute('default-value'))
      );
      this._value = initial;
      this._pendingValue = initial;
      this._draftInput = this._formatDisplay(initial);
      this._open = this.hasAttribute('open') || isTruthyAttr(this.getAttribute('default-open'));
      this._isInitialized = true;
    }

    if (this._open && !this._isInlineMode()) {
      this._ensureOverlay();
    }
    if (this._isInlineMode()) {
      this._scheduleInlineCalendarSync();
    }
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClickBound);
    this.root.removeEventListener('input', this._onRootInputBound);
    this.root.removeEventListener('focusout', this._onRootBlurBound);
    this.root.removeEventListener('keydown', this._onRootKeyDownBound);
    this._destroyOverlay();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'value' && !this._syncing) {
      this._value = this._clampToBounds(normalizeDateIso(newValue));
      this._pendingValue = this._value;
      this._draftInput = this._formatDisplay(this._value);
      this._inlineError = '';
      this._syncValueAttribute(this._value);
    }

    if (name === 'open' && !this._syncing) {
      this._open = this.hasAttribute('open');
      this._syncOverlay(this._open ? 'api' : 'outside');
    }

    if (name === 'mode') {
      this._syncOverlay('attribute');
    }

    if (name === 'disabled' && this.hasAttribute('disabled')) {
      this._setOpen(false, 'outside');
    }

    if ((name === 'min' || name === 'max') && !this._syncing) {
      const clampedValue = this._clampToBounds(this._value);
      const clampedPending = this._clampToBounds(this._pendingValue);
      this._value = clampedValue;
      this._pendingValue = clampedPending;
      this._draftInput = this._formatDisplay(this._allowInput() ? clampedPending : clampedValue);
      this._syncValueAttribute(clampedValue);
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
    return isTruthyAttr(this.getAttribute('close-on-select'), true);
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

  private _formatMode(): 'iso' | 'locale' | 'custom' {
    const value = (this.getAttribute('format') || 'locale').trim();
    if (value === 'iso' || value === 'custom') return value;
    return 'locale';
  }

  private _displayFormat(): string | null {
    const value = (this.getAttribute('display-format') || '').trim();
    return value || null;
  }

  private _placeholder(): string {
    const t = this._translations();
    const placeholder = this.getAttribute('placeholder');
    if (placeholder) return placeholder;
    return this._formatMode() === 'iso' ? 'YYYY-MM-DD' : t.selectDate;
  }

  private _todayIso(): string {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${mm}-${dd}`;
  }

  private _state(): DatePickerState {
    const value = (this.getAttribute('state') || '').trim().toLowerCase();
    if (value === 'loading' || value === 'success' || value === 'error') return value;
    return 'idle';
  }

  private _isInteractionBlocked(): boolean {
    return this._isDisabled() || this._state() === 'loading';
  }

  private _minIso(): string | null {
    return parseConstraintDate(this.getAttribute('min'));
  }

  private _maxIso(): string | null {
    return parseConstraintDate(this.getAttribute('max'));
  }

  private _resolvedBounds(): { min: string | null; max: string | null } {
    let min = this._minIso();
    let max = this._maxIso();
    if (min && max && compareISO(min, max) > 0) {
      const swap = min;
      min = max;
      max = swap;
    }
    return { min, max };
  }

  private _clampToBounds(iso: string | null): string | null {
    if (!iso) return null;
    const { min, max } = this._resolvedBounds();
    return clampDateIso(iso, min, max);
  }

  private _isWithinBounds(iso: string): boolean {
    const { min: minIso, max: maxIso } = this._resolvedBounds();
    if (minIso && compareISO(iso, minIso) < 0) return false;
    if (maxIso && compareISO(iso, maxIso) > 0) return false;
    return true;
  }

  private _formatDisplay(value: string | null): string {
    return formatDateForDisplay(value, this._locale(), this._formatMode(), this._displayFormat());
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

  private _emitInput(source: DatePickerSource): void {
    const detail: DatePickerDetail = {
      mode: 'single',
      value: this._pendingValue,
      displayValue: this._formatDisplay(this._pendingValue),
      source
    };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
  }

  private _emitChange(source: DatePickerSource): void {
    const detail: DatePickerDetail = {
      mode: 'single',
      value: this._value,
      displayValue: this._formatDisplay(this._value),
      source
    };
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _emitInvalid(raw: string, reason: string): void {
    this.dispatchEvent(
      new CustomEvent('invalid', {
        detail: { raw, reason },
        bubbles: true,
        composed: true
      })
    );
  }

  private _setOpen(next: boolean, source: DatePickerSource): void {
    if (next && this._isInteractionBlocked()) return;
    if (this._open === next) return;
    this._open = next;
    this._overlayFocusedOnOpen = false;
    this._lastOpenSource = source;
    this._syncOpenAttribute(next);
    this._syncOverlay(source);
    this._updateHostState();
    this.dispatchEvent(new CustomEvent(next ? 'open' : 'close', { bubbles: true, composed: true }));
  }

  private _syncOverlay(source: DatePickerSource | 'attribute'): void {
    if (this._isInlineMode()) {
      this._destroyOverlay();
      return;
    }
    if (this._open) {
      this._ensureOverlay();
      this._syncOverlayState();
    } else {
      this._destroyOverlay();
      if (source !== 'outside') {
        const focusTarget = this._restoreFocusEl || (this.root.querySelector('.input') as HTMLElement | null);
        this._restoreFocusEl = null;
        if (focusTarget && focusTarget.isConnected) {
          try {
            focusTarget.focus();
          } catch {
            // no-op
          }
        }
      }
    }
  }

  private _ensureOverlay(): void {
    if (this._overlay || typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.className = 'ui-date-picker-overlay-host';
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.zIndex = '1100';
    el.style.pointerEvents = 'none';
    el.addEventListener('click', this._onOverlayClickBound);
    el.addEventListener('select', this._onOverlaySelectBound as EventListener);
    el.addEventListener('change', this._onOverlaySelectBound as EventListener);
    document.body.appendChild(el);
    this._overlay = el;
    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.addEventListener('keydown', this._onDocumentKeyDownBound);
    window.addEventListener('resize', this._onWindowResizeBound);
    window.addEventListener('scroll', this._onWindowScrollBound, true);
    if (this._isMobileSheet()) {
      this._releaseScrollLock = lockBodyScroll();
    }
  }

  private _destroyOverlay(): void {
    if (!this._overlay) return;
    this._schedulePosition.cancel();
    document.removeEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.removeEventListener('keydown', this._onDocumentKeyDownBound);
    window.removeEventListener('resize', this._onWindowResizeBound);
    window.removeEventListener('scroll', this._onWindowScrollBound, true);
    this._overlay.removeEventListener('click', this._onOverlayClickBound);
    this._overlay.removeEventListener('select', this._onOverlaySelectBound as EventListener);
    this._overlay.removeEventListener('change', this._onOverlaySelectBound as EventListener);
    if (this._overlay.parentElement) this._overlay.parentElement.removeChild(this._overlay);
    this._overlay = null;
    this._overlayMode = null;
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
    const anchorRect = field.getBoundingClientRect();
    panel.style.setProperty('--ui-dp-panel-width', `${Math.round(anchorRect.width)}px`);
    const panelRect = panel.getBoundingClientRect();
    const position = computePopoverPosition(anchorRect, panelRect);
    panel.style.position = 'absolute';
    panel.style.top = `${Math.round(position.top)}px`;
    panel.style.left = `${Math.round(position.left)}px`;
    panel.setAttribute('data-placement', position.placement);
  }

  private _parseAndValidate(raw: string): string | null {
    return parseUserDateInput(raw, this._locale());
  }

  private _commit(next: string | null, source: DatePickerSource): void {
    if (this._isReadonly() || this._isInteractionBlocked()) return;
    const bounded = this._clampToBounds(next);
    this._value = bounded;
    this._pendingValue = bounded;
    this._draftInput = this._formatDisplay(bounded);
    this._inlineError = '';
    this._syncValueAttribute(bounded);
    this._emitInput(source);
    this._emitChange(source);
    this._updateHostState();
  }

  private _renderPanelInner(isSheet: boolean): string {
    const t = this._translations();
    const label = (this.getAttribute('label') || '').trim();
    const showHeader = !!label || isSheet;
    const shouldShowApply = !this._closeOnSelect() || isSheet;
    const panelClass = isSheet ? 'sheet' : 'panel';
    const ariaModal = isSheet ? 'true' : 'false';
    return `
      <style>${overlayStyle}</style>
      ${isSheet ? '<div class="sheet-backdrop" data-action="backdrop"></div>' : ''}
      <section class="${panelClass}" id="${this._panelId}" part="${isSheet ? 'sheet' : 'popover'}" role="dialog" aria-modal="${ariaModal}" aria-labelledby="${this._panelTitleId}" aria-label="${escapeHtml(t.datePickerPanel)}">
        <header class="header" part="header" ${showHeader ? '' : 'hidden'}>
          <p class="title" id="${this._panelTitleId}" ${label ? '' : 'hidden'}>${escapeHtml(label)}</p>
          ${isSheet ? `<button type="button" class="action" data-action="cancel">${escapeHtml(t.cancel)}</button>` : ''}
        </header>
        <ui-calendar class="dp-calendar" part="calendar"></ui-calendar>
        <footer class="footer" part="footer">
          <button type="button" class="action" data-action="today" part="presets">${escapeHtml(t.today)}</button>
          <button type="button" class="action" data-action="clear" part="clear">${escapeHtml(t.clear)}</button>
          ${shouldShowApply ? `<button type="button" class="action" data-tone="primary" data-action="apply" part="apply">${escapeHtml(t.apply)}</button>` : ''}
        </footer>
      </section>
    `;
  }

  private _syncCalendarElement(calendarEl: HTMLElement): void {
    const syncAttr = (name: string, value: string | null) => {
      if (value == null || value === '') {
        if (calendarEl.hasAttribute(name)) calendarEl.removeAttribute(name);
        return;
      }
      if (calendarEl.getAttribute(name) !== value) calendarEl.setAttribute(name, value);
    };
    const syncBool = (name: string, enabled: boolean) => {
      if (enabled) {
        if (!calendarEl.hasAttribute(name)) calendarEl.setAttribute(name, '');
      } else if (calendarEl.hasAttribute(name)) {
        calendarEl.removeAttribute(name);
      }
    };

    const { min, max } = this._resolvedBounds();
    syncAttr('selection', 'single');
    syncAttr('value', this._pendingValue);
    syncAttr('min', min);
    syncAttr('max', max);
    syncAttr('locale', this.getAttribute('locale'));
    syncAttr('translations', this.getAttribute('translations'));
    syncAttr('week-start', this.getAttribute('week-start'));
    const sizeAttr = this.getAttribute('size');
    const effectiveSize = sizeAttr || 'sm';
    syncAttr('size', effectiveSize === 'lg' ? 'md' : 'sm');
    syncAttr('variant', this.getAttribute('variant'));
    syncAttr('outside-click', this.getAttribute('outside-click'));
    syncAttr('events', this.getAttribute('events'));
    syncAttr('events-max', this.getAttribute('events-max'));
    syncAttr('events-display', this.getAttribute('events-display'));
    const isInlineCalendar = calendarEl.classList.contains('inline-calendar');
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
      calendarEl.style.setProperty('--ui-calendar-day-height', effectiveSize === 'lg' ? '2.1em' : '1.92em');
      calendarEl.style.setProperty('--ui-calendar-day-padding-block', '0.08em');
      calendarEl.style.setProperty('--ui-calendar-day-padding-inline', '0.14em');
      calendarEl.style.setProperty('--ui-calendar-frame-padding', '0.28em');
      calendarEl.style.setProperty('--ui-calendar-week-gap', '0.16em');
      calendarEl.style.setProperty('--ui-calendar-control-height', '1.64em');
      calendarEl.style.setProperty('--ui-calendar-gap', '0.2em');
      calendarEl.style.setProperty('--ui-calendar-day-font-size', effectiveSize === 'lg' ? '0.76em' : '0.68em');
      calendarEl.style.setProperty('--ui-calendar-weekday-font-size', effectiveSize === 'lg' ? '0.66em' : '0.58em');
      calendarEl.style.setProperty('--ui-calendar-title-font-size', effectiveSize === 'lg' ? '0.84em' : '0.76em');
    } else {
      calendarEl.style.removeProperty('--ui-calendar-frame-padding');
      calendarEl.style.removeProperty('--ui-calendar-week-gap');
      calendarEl.style.removeProperty('--ui-calendar-control-height');
    }
    syncBool('readonly', this._isReadonly());
    syncBool('disabled', this._isInteractionBlocked());
    syncBool('bare', this._isBare());
    syncAttr('tabindex', '-1');
    syncAttr('aria-label', this.getAttribute('label') || this._translations().selectDate);
  }

  private _ensureOverlayContent(sheet: boolean): void {
    if (!this._overlay) return;
    const mode: 'sheet' | 'popover' = sheet ? 'sheet' : 'popover';
    if (this._overlayMode === mode && this._overlay.querySelector('.dp-calendar')) return;
    this._overlayMode = mode;
    this._overlay.innerHTML = sheet
      ? `<div class="sheet-wrap">${this._renderPanelInner(true)}</div>`
      : `<div class="overlay">${this._renderPanelInner(false)}</div>`;
  }

  private _syncOverlayState(): void {
    if (!this._overlay) return;
    const sheet = this._isMobileSheet();
    if (sheet && !this._releaseScrollLock) {
      this._releaseScrollLock = lockBodyScroll();
    } else if (!sheet && this._releaseScrollLock) {
      this._releaseScrollLock();
      this._releaseScrollLock = null;
    }
    this._ensureOverlayContent(sheet);
    const title = this._overlay.querySelector('.title') as HTMLElement | null;
    const panel = this._overlay.querySelector('.panel, .sheet') as HTMLElement | null;
    const header = this._overlay.querySelector('.header') as HTMLElement | null;
    const footer = this._overlay.querySelector('.footer') as HTMLElement | null;
    const t = this._translations();
    if (panel) panel.dataset.bare = this._isBare() ? 'true' : 'false';
    if (footer) footer.hidden = !this._showFooter();
    if (header) header.hidden = !((this.getAttribute('label') || '').trim()) && !sheet;
    if (title) {
      const label = (this.getAttribute('label') || '').trim();
      title.textContent = label;
      title.hidden = !label;
    }
    const todayAction = this._overlay.querySelector('[data-action="today"]') as HTMLElement | null;
    if (todayAction) todayAction.textContent = t.today;
    const clearAction = this._overlay.querySelector('[data-action="clear"]') as HTMLElement | null;
    if (clearAction) clearAction.textContent = t.clear;
    const cancelAction = this._overlay.querySelector('[data-action="cancel"]') as HTMLElement | null;
    if (cancelAction) cancelAction.textContent = t.cancel;
    const applyAction = this._overlay.querySelector('[data-action="apply"]') as HTMLElement | null;
    if (applyAction) applyAction.textContent = t.apply;
    const apply = this._overlay.querySelector('[data-action="apply"]') as HTMLButtonElement | null;
    if (apply) apply.hidden = this._closeOnSelect() && !sheet;
    const actions = this._overlay.querySelectorAll('.action');
    const actionsDisabled = this._isInteractionBlocked();
    actions.forEach((node) => {
      (node as HTMLButtonElement).disabled = actionsDisabled;
    });
    const calendarEl = this._overlay.querySelector('.dp-calendar') as HTMLElement | null;
    if (calendarEl) {
      this._syncCalendarElement(calendarEl);
      if (this._open && !this._overlayFocusedOnOpen && this._lastOpenSource !== 'attribute') {
        this._overlayFocusedOnOpen = true;
        requestAnimationFrame(() => {
          if (!this._open || !this._overlay) return;
          try {
            calendarEl.focus({ preventScroll: true });
          } catch {
            // no-op
          }
        });
      }
    }
    if (!sheet) this._schedulePosition.run();
  }

  private _renderOverlay(): void {
    this._syncOverlayState();
  }

  private _renderInlineCalendar(): void {
    const calendarEl = this.root.querySelector('.inline-calendar') as HTMLElement | null;
    if (!calendarEl) return;
    this._syncCalendarElement(calendarEl);
  }

  private _scheduleInlineCalendarSync(): void {
    const sync = () => {
      if (!this.isConnected || !this._hasView || !this._isInlineMode()) return;
      this._renderInlineCalendar();
    };

    sync();

    if (!this._inlineCalendarFramePending) {
      this._inlineCalendarFramePending = true;
      requestAnimationFrame(() => {
        this._inlineCalendarFramePending = false;
        sync();
      });
    }

    if (
      !this._inlineCalendarUpgradePending
      && typeof customElements !== 'undefined'
      && !customElements.get('ui-calendar')
    ) {
      this._inlineCalendarUpgradePending = true;
      customElements.whenDefined('ui-calendar').then(() => {
        this._inlineCalendarUpgradePending = false;
        requestAnimationFrame(() => {
          sync();
        });
      });
    }
  }

  private _handleDraftCommit(source: DatePickerSource): void {
    const raw = this._draftInput.trim();
    if (!raw) {
      this._commit(null, source);
      return;
    }
    const parsed = this._parseAndValidate(raw);
    if (!parsed) {
      this._inlineError = this.getAttribute('error') || this._translations().invalidDate;
      this._emitInvalid(raw, 'parse');
      this._updateHostState();
      return;
    }
    if (!this._isWithinBounds(parsed)) {
      this._inlineError = this.getAttribute('error') || this._translations().dateOutOfRange;
      this._emitInvalid(raw, 'range');
      this._updateHostState();
      return;
    }
    this._pendingValue = parsed;
    this._commit(parsed, source);
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const actionEl = target.closest('[data-action]') as HTMLElement | null;
    const action = actionEl?.getAttribute('data-action');
    if (!action || this._isInteractionBlocked()) return;

    if (action === 'toggle') {
      this._restoreFocusEl = actionEl as HTMLElement;
      this._setOpen(!this._open, 'api');
      return;
    }
    if (action === 'clear') {
      event.preventDefault();
      this._commit(null, 'clear');
      return;
    }
    if (action === 'today') {
      event.preventDefault();
      const today = this._todayIso();
      const clamped = this._parseAndValidate(today);
      if (!clamped) return;
      const { min, max } = this._resolvedBounds();
      const next = clampDateIso(clamped, min, max);
      if (!next) return;
      this._pendingValue = next;
      this._emitInput('today');
      if (this._closeOnSelect() && !this._isInlineMode()) {
        this._commit(next, 'today');
        this._setOpen(false, 'today');
      } else {
        this._updateHostState();
      }
      return;
    }
    if (action === 'apply') {
      event.preventDefault();
      this._commit(this._pendingValue, 'apply');
      if (!this._isInlineMode()) this._setOpen(false, 'apply');
      return;
    }
    if (action === 'cancel') {
      event.preventDefault();
      this._pendingValue = this._value;
      this._draftInput = this._formatDisplay(this._value);
      this._inlineError = '';
      if (!this._isInlineMode()) this._setOpen(false, 'outside');
      this._updateHostState();
      return;
    }
  }

  private _onRootInput(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('input')) return;
    if (this._isInteractionBlocked()) return;
    if (!this._allowInput()) return;
    this._draftInput = target.value;
    this._inlineError = '';
    const parsed = this._parseAndValidate(target.value);
    this._pendingValue = parsed;
    this._emitInput('typing');
  }

  private _onRootBlur(event: Event): void {
    const focusEvent = event as FocusEvent;
    const target = focusEvent.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('input')) return;
    if (!this._allowInput()) return;
    this._draftInput = target.value;
    const related = focusEvent.relatedTarget as Node | null;
    if (related && this._overlay?.contains(related)) return;
    if (this._open && !this._isInlineMode()) return;
    this._handleDraftCommit('blur');
  }

  private _onRootKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const target = keyboardEvent.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;
    if (!target.classList.contains('input')) return;
    if (this._isInteractionBlocked()) return;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this._draftInput = target.value;
      this._handleDraftCommit('enter');
      if (!this._isInlineMode()) this._setOpen(false, 'enter');
      return;
    }
    if (keyboardEvent.key === 'ArrowDown' && !this._open && !this._isInlineMode()) {
      keyboardEvent.preventDefault();
      this._setOpen(true, 'api');
      return;
    }
    if (keyboardEvent.key === 'Escape' && this._open && !this._isInlineMode()) {
      keyboardEvent.preventDefault();
      this._setOpen(false, 'escape');
    }
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

  private _onOverlayClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const actionEl = target.closest('[data-action]') as HTMLElement | null;
    const action = actionEl?.getAttribute('data-action');
    if (!action) return;
    if (this._isInteractionBlocked()) return;

    if (action === 'backdrop') {
      this._setOpen(false, 'outside');
      return;
    }

    if (action === 'today') {
      const clamped = this._parseAndValidate(this._todayIso());
      if (!clamped) return;
      const { min, max } = this._resolvedBounds();
      const next = clampDateIso(clamped, min, max);
      if (!next) return;
      this._pendingValue = next;
      this._emitInput('today');
      if (this._closeOnSelect()) {
        this._commit(next, 'today');
        this._setOpen(false, 'today');
      } else {
        this._renderOverlay();
      }
      return;
    }
    if (action === 'clear') {
      this._pendingValue = null;
      this._emitInput('clear');
      if (this._closeOnSelect()) {
        this._commit(null, 'clear');
        this._setOpen(false, 'clear');
      } else {
        this._renderOverlay();
      }
      return;
    }
    if (action === 'apply') {
      this._commit(this._pendingValue, 'apply');
      this._setOpen(false, 'apply');
      return;
    }
    if (action === 'cancel') {
      this._pendingValue = this._value;
      this._setOpen(false, 'outside');
    }
  }

  private _onCalendarSelect(event: Event): void {
    if (this._isInteractionBlocked()) return;
    const customEvent = event as CustomEvent<{ value?: string; mode?: string }>;
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'ui-calendar') return;

    let iso: string | null = null;
    if (customEvent.type === 'select') {
      iso = normalizeDateIso(customEvent.detail?.value || null);
    } else if (customEvent.type === 'change') {
      const value = (customEvent.detail as { value?: unknown })?.value;
      if (typeof value === 'string') iso = normalizeDateIso(value);
    }
    if (!iso) return;
    const bounded = this._clampToBounds(iso);
    if (!bounded) return;
    this._pendingValue = bounded;
    this._emitInput('calendar');
    if (this._closeOnSelect()) {
      this._commit(bounded, 'calendar');
      if (!this._isInlineMode()) this._setOpen(false, 'calendar');
    } else {
      this._updateHostState();
    }
  }

  private _updateHostState(): void {
    if (!this._hasView) return;
    const label = this.getAttribute('label') || '';
    const hint = this.getAttribute('hint') || '';
    const manualError = this.getAttribute('error') || '';
    const error = this._inlineError || manualError;
    const placeholder = this._placeholder();
    const t = this._translations();
    const hasValue = !!(this._value || this._pendingValue);
    const name = this.getAttribute('name') || '';
    const isInline = this._isInlineMode();
    const state = error ? 'error' : this._state();
    const fieldValue = this._allowInput()
      ? this._draftInput
      : this._formatDisplay(this._pendingValue || this._value);

    const labelEl = this.root.querySelector('.label') as HTMLElement | null;
    const labelText = this.root.querySelector('.label-text') as HTMLElement | null;
    const requiredEl = this.root.querySelector('.required') as HTMLElement | null;
    const fieldEl = this.root.querySelector('.field') as HTMLElement | null;
    const inputEl = this.root.querySelector('.input') as HTMLInputElement | null;
    const clearBtn = this.root.querySelector('.btn[data-action="clear"]') as HTMLButtonElement | null;
    const toggleBtn = this.root.querySelector('.btn[data-action="toggle"]') as HTMLButtonElement | null;
    const hintEl = this.root.querySelector('.hint') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const hiddenInput = this.root.querySelector('.hidden-input') as HTMLInputElement | null;
    const inlinePanel = this.root.querySelector('.inline-panel') as HTMLElement | null;
    const inlineToday = this.root.querySelector('.inline-panel [data-action="today"]') as HTMLElement | null;
    const inlineClear = this.root.querySelector('.inline-panel [data-action="clear"]') as HTMLElement | null;
    const inlineApply = this.root.querySelector('.inline-panel [data-action="apply"]') as HTMLElement | null;
    const inlineFooter = this.root.querySelector('.inline-panel .footer') as HTMLElement | null;

    if (labelEl) {
      labelEl.hidden = !label;
      labelEl.id = this._labelId;
      labelEl.setAttribute('for', this._inputId);
    }
    if (labelText) labelText.textContent = label;
    if (requiredEl) requiredEl.hidden = !this.hasAttribute('required');
    if (fieldEl) {
      fieldEl.dataset.invalid = error ? 'true' : 'false';
      fieldEl.dataset.open = this._open && !isInline ? 'true' : 'false';
      fieldEl.dataset.state = state;
      fieldEl.setAttribute('aria-disabled', this._isInteractionBlocked() ? 'true' : 'false');
    }

    if (inputEl) {
      if (inputEl.value !== fieldValue) inputEl.value = fieldValue;
      inputEl.id = this._inputId;
      inputEl.placeholder = placeholder;
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
      clearBtn.disabled = this._isInteractionBlocked();
      clearBtn.setAttribute('aria-label', t.clearDate);
    }
    if (toggleBtn) {
      toggleBtn.hidden = isInline;
      toggleBtn.disabled = this._isInteractionBlocked();
      toggleBtn.setAttribute('aria-expanded', isInline ? 'false' : String(this._open));
      toggleBtn.setAttribute('aria-controls', this._panelId);
      toggleBtn.setAttribute('aria-label', t.toggleCalendar);
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
      hiddenInput.value = this._value || '';
    }
    if (inlinePanel) {
      inlinePanel.hidden = !isInline;
      inlinePanel.id = this._panelId;
      inlinePanel.dataset.bare = this._isBare() ? 'true' : 'false';
      inlinePanel.setAttribute('role', 'dialog');
      inlinePanel.setAttribute('aria-modal', 'false');
      inlinePanel.setAttribute('aria-label', label || t.selectDate);
    }
    if (inlineFooter) inlineFooter.hidden = !this._showFooter();
    if (inlineToday) inlineToday.textContent = t.today;
    if (inlineClear) inlineClear.textContent = t.clear;
    if (inlineApply) inlineApply.textContent = t.apply;

    if (isInline) {
      this._scheduleInlineCalendarSync();
      this._destroyOverlay();
      return;
    }

    if (this._open) this._syncOverlayState();
  }

  protected override render(): void {
    if (!this._hasView) {
      this.setContent(`
        <style>${style}</style>
        <div class="root">
          <label class="label" part="label" id="${this._labelId}">
            <span class="label-text"></span>
            <span class="required">*</span>
          </label>
          <div class="field" part="field input">
            <span class="icon" part="icon" aria-hidden="true">${CALENDAR_ICON}</span>
            <input class="input" id="${this._inputId}" part="input" />
            <button type="button" class="btn" part="clear" data-action="clear">${CLOSE_ICON}</button>
            <button type="button" class="btn" part="toggle" data-action="toggle">
              <span class="toggle-icon">${CHEVRON_ICON}</span>
              <span class="spinner" aria-hidden="true"></span>
            </button>
          </div>
          <div class="hint" id="${this._hintId}" part="hint"></div>
          <div class="error" id="${this._errorId}" part="error" role="alert"></div>
          <input class="hidden-input" type="hidden" disabled />
          <section class="inline-panel" id="${this._panelId}" part="popover" hidden>
            <ui-calendar class="inline-calendar" part="calendar"></ui-calendar>
            <footer class="footer" part="footer">
              <button type="button" class="action" data-action="today" part="presets"></button>
              <button type="button" class="action" data-action="clear" part="clear"></button>
              <button type="button" class="action" data-tone="primary" data-action="apply" part="apply"></button>
            </footer>
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-date-picker')) {
  customElements.define('ui-date-picker', UIDatePicker);
}
