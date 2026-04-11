import { ElementBase } from '../ElementBase';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { compareISO } from './ui-calendar';
import { resolveDateTimeTranslations } from './date-time-i18n';
import {
  clampDateIso,
  computeLastDaysRange,
  computeMonthRange,
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

type RangeValue = { start: string | null; end: string | null };
type RangeDetail = {
  mode: 'range';
  start: string | null;
  end: string | null;
  value: { start: string; end: string } | null;
  source: string;
};

type DateRangePickerState = 'idle' | 'loading' | 'error' | 'success';

let dateRangePickerUid = 0;

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
    --ui-dp-field-error: var(--ui-color-danger, #dc2626);
    --ui-dp-focus-ring: color-mix(in srgb, var(--ui-dp-accent) 26%, transparent);
    --ui-dp-z: 1600;
    --ui-dp-duration: 160ms;
    --ui-dp-ease: cubic-bezier(0.2, 0.9, 0.24, 1);
    color-scheme: light dark;
    display: inline-grid;
    inline-size: min(100%, var(--ui-width, 420px));
    min-inline-size: min(240px, 100%);
    color: var(--ui-dp-text);
    font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  :host([shape="square"]) {
    --ui-dp-radius: 6px;
  }

  :host([shape="soft"]) {
    --ui-dp-radius: 16px;
  }

  .root {
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

  .label[hidden] { display: none; }

  .required { color: var(--ui-dp-field-error); font-size: 11px; }

  .fields {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 8px;
    min-block-size: 42px;
    border: 1px solid var(--ui-dp-border);
    border-radius: var(--ui-dp-radius);
    padding: 0 10px 0 11px;
    background: var(--ui-dp-surface);
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.75);
    transition: border-color var(--ui-dp-duration) var(--ui-dp-ease), box-shadow var(--ui-dp-duration) var(--ui-dp-ease);
  }

  .fields[data-single="true"] {
    grid-template-columns: auto 1fr auto auto;
  }

  .fields:focus-within {
    border-color: color-mix(in srgb, var(--ui-dp-accent) 72%, transparent);
    box-shadow: 0 0 0 3px var(--ui-dp-focus-ring), 0 4px 14px rgba(2, 6, 23, 0.09);
  }

  .fields[data-open="true"] {
    border-color: color-mix(in srgb, var(--ui-dp-accent) 72%, transparent);
    box-shadow: 0 0 0 3px var(--ui-dp-focus-ring), 0 10px 24px rgba(2, 6, 23, 0.12);
  }

  .fields[data-invalid="true"] {
    border-color: color-mix(in srgb, var(--ui-dp-field-error) 68%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-dp-field-error) 20%, transparent);
  }

  .fields[data-state="success"]:not([data-invalid="true"]) {
    border-color: color-mix(in srgb, var(--ui-dp-success) 56%, var(--ui-dp-border));
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-dp-success) 20%, transparent);
  }

  .fields[data-state="loading"] {
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
    border: 0;
    background: transparent;
    color: var(--ui-dp-text);
    min-inline-size: 0;
    inline-size: 100%;
    padding: 8px 0;
    font: 500 14px/1.4 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.005em;
    outline: none;
  }

  .input::placeholder {
    color: color-mix(in srgb, var(--ui-dp-text) 44%, transparent);
  }

  .sep {
    color: var(--ui-dp-muted);
    font-size: 12px;
    user-select: none;
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
    transition: background-color var(--ui-dp-duration) var(--ui-dp-ease), color var(--ui-dp-duration) var(--ui-dp-ease), transform var(--ui-dp-duration) var(--ui-dp-ease);
  }

  .btn:hover { background: color-mix(in srgb, var(--ui-dp-text) 10%, transparent); color: var(--ui-dp-text); }
  .btn:active { transform: translateY(1px); }
  .btn:focus-visible { outline: 2px solid color-mix(in srgb, var(--ui-dp-accent) 64%, transparent); outline-offset: 1px; }
  .btn:disabled { cursor: not-allowed; opacity: 0.55; }
  .toggle-icon { display: inline-grid; place-items: center; }
  .spinner {
    display: none;
    inline-size: 14px;
    block-size: 14px;
    border-radius: 999px;
    border: 2px solid color-mix(in srgb, var(--ui-dp-text) 20%, transparent);
    border-top-color: color-mix(in srgb, var(--ui-dp-accent) 72%, transparent);
    animation: ui-drp-spin 780ms linear infinite;
  }
  :host([state="loading"]) .toggle-icon { display: none; }
  :host([state="loading"]) .spinner { display: inline-block; }
  .btn[hidden] { display: none; }

  .hint { color: var(--ui-dp-muted); font-size: 12px; line-height: 1.4; }
  .error { color: var(--ui-dp-field-error); font-size: 12px; line-height: 1.4; }
  .hint[hidden], .error[hidden] { display: none; }

  .inline-panel {
    border: 1px solid var(--ui-dp-border);
    border-radius: var(--ui-dp-panel-radius);
    background: var(--ui-dp-surface);
    box-shadow: 0 18px 30px rgba(2, 6, 23, 0.12);
    inline-size: fit-content;
    max-inline-size: 100%;
    justify-self: start;
    padding: 10px;
    display: grid;
    gap: 10px;
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

  .presets, .footer {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .inline-panel .presets,
  .inline-panel .footer {
    gap: 6px;
  }

  .presets[hidden], .footer[hidden] {
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

  .inline-panel .action {
    min-block-size: 30px;
    padding: 0 10px;
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

  :host([disabled]) .fields { opacity: 0.62; pointer-events: none; }
  :host([readonly]) .fields { background: color-mix(in srgb, var(--ui-dp-bg) 92%, var(--ui-color-surface-alt, #f8fafc)); }

  :host([variant="contrast"]) {
    --ui-dp-bg: #0f172a;
    --ui-dp-border: #334155;
    --ui-dp-text: #e2e8f0;
    --ui-dp-muted: #93a4bd;
    --ui-dp-accent: #93c5fd;
    --ui-dp-surface: linear-gradient(180deg, color-mix(in srgb, #0f172a 86%, #1e293b), #0f172a);
  }

  :host([state="success"]) {
    --ui-dp-focus-ring: color-mix(in srgb, var(--ui-dp-success) 26%, transparent);
  }

  @media (max-width: 640px) {
    :host { inline-size: min(100%, var(--ui-width, 100%)); }
    .fields { min-block-size: 40px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fields,
    .btn,
    .action,
    .spinner {
      transition: none !important;
      animation: none !important;
    }
  }

  @media (forced-colors: active) {
    .fields,
    .inline-panel,
    .action {
      forced-color-adjust: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }
    .fields:focus-within,
    .btn:focus-visible,
    .action:focus-visible {
      outline-color: Highlight;
    }
    .spinner {
      border-color: CanvasText;
      border-top-color: CanvasText;
    }
  }

  @keyframes ui-drp-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const overlayStyle = `
  .overlay { position: fixed; z-index: var(--ui-dp-z, 1600); pointer-events: none; }
  .panel {
    pointer-events: auto;
    inline-size: min(var(--ui-drp-panel-width, 26rem), calc(100vw - 16px));
    max-inline-size: calc(100vw - 16px);
    border: 1px solid var(--ui-dp-border, #cbd5e1);
    border-radius: var(--ui-dp-panel-radius, 14px);
    background: var(--ui-dp-surface, #fff);
    color: var(--ui-dp-text, #0f172a);
    box-shadow: 0 20px 34px rgba(2, 6, 23, 0.16);
    padding: 10px;
    display: grid;
    gap: 10px;
    transform-origin: top;
    animation: ui-drp-pop-in var(--ui-dp-duration, 160ms) var(--ui-dp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }
  .panel[data-bare="true"], .sheet[data-bare="true"] {
    border: 0;
    border-radius: 0;
    background: var(--ui-dp-bare-bg, var(--ui-dp-bg));
    box-shadow: none;
    padding: 0;
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
    max-block-size: min(82vh, 640px);
    overflow: auto;
    animation: ui-drp-sheet-up var(--ui-dp-duration, 160ms) var(--ui-dp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .title {
    margin: 0;
    font: 700 14px/1.3 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-dp-text, #0f172a);
  }
  .presets, .footer { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
  .presets[hidden], .footer[hidden] { display: none !important; }
  .action {
    border: 1px solid color-mix(in srgb, var(--ui-dp-border, #cbd5e1) 85%, transparent);
    background: color-mix(in srgb, var(--ui-dp-bg, #fff) 95%, transparent);
    color: var(--ui-dp-text, #0f172a);
    min-block-size: 32px;
    border-radius: 8px;
    padding: 0 12px;
    font: 600 12px/1 Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    cursor: pointer;
    transition: border-color var(--ui-dp-duration, 160ms) var(--ui-dp-ease, cubic-bezier(0.2, 0.9, 0.24, 1)), background-color var(--ui-dp-duration, 160ms) var(--ui-dp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }
  .action:hover { border-color: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 38%, var(--ui-dp-border, #cbd5e1)); background: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 10%, transparent); }
  .action:focus-visible { outline: 2px solid color-mix(in srgb, var(--ui-dp-accent, #2563eb) 64%, transparent); outline-offset: 1px; }
  .action[data-tone="primary"] { border-color: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 60%, transparent); background: color-mix(in srgb, var(--ui-dp-accent, #2563eb) 18%, transparent); }
  @media (prefers-reduced-motion: reduce) {
    .panel, .sheet, .action { animation: none !important; transition: none !important; }
  }
  @keyframes ui-drp-pop-in {
    from { opacity: 0; transform: translateY(6px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes ui-drp-sheet-up {
    from { opacity: 0.82; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function parseRangeValue(raw: string | null): RangeValue {
  if (!raw) return { start: null, end: null };
  try {
    const parsed = JSON.parse(raw);
    const start = normalizeDateIso(parsed?.start || null);
    const end = normalizeDateIso(parsed?.end || null);
    return { start, end };
  } catch {
    return { start: null, end: null };
  }
}

function serializeRangeValue(value: RangeValue): string | null {
  if (!value.start && !value.end) return null;
  return JSON.stringify({
    ...(value.start ? { start: value.start } : {}),
    ...(value.end ? { end: value.end } : {})
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseSingleRangeDraft(raw: string, locale: string): RangeValue {
  const trimmed = raw.trim();
  if (!trimmed) return { start: null, end: null };

  // Only treat explicit separators as a range split to avoid breaking ISO dates like 2026-02-10.
  const parts = trimmed.split(/\s(?:—|–|to)\s/i).map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1) {
    const start = parseUserDateInput(parts[0] || '', locale);
    const end = parseUserDateInput(parts[1] || '', locale);
    return { start, end };
  }

  const single = parseUserDateInput(trimmed, locale);
  return { start: single, end: null };
}

export class UIDateRangePicker extends ElementBase {
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
      'range-variant',
      'label',
      'hint',
      'error',
      'allow-same-day',
      'allow-partial',
      'close-on-select',
      'clearable',
      'disabled',
      'readonly',
      'required',
      'name',
      'name-start',
      'name-end',
      'mode',
      'show-footer'
    ];
  }

  private _value: RangeValue = { start: null, end: null };
  private _pending: RangeValue = { start: null, end: null };
  private _draftStart = '';
  private _draftEnd = '';
  private _draftSingle = '';
  private _inlineError = '';
  private _open = false;
  private _syncing = false;
  private _overlay: HTMLDivElement | null = null;
  private _dismissableLayer: DismissableLayerHandle | null = null;
  private _releaseScrollLock: (() => void) | null = null;
  private _isInitialized = false;
  private _hasView = false;
  private _restoreFocusEl: HTMLElement | null = null;
  private _overlayMode: 'sheet' | 'popover' | null = null;
  private readonly _uid = `ui-drp-${++dateRangePickerUid}`;
  private readonly _singleId = `${this._uid}-single`;
  private readonly _startId = `${this._uid}-start`;
  private readonly _endId = `${this._uid}-end`;
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
  private _onOverlayCalendarBound = (event: Event) => this._onOverlayCalendarChange(event);

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onRootClickBound);
    this.root.addEventListener('input', this._onRootInputBound);
    this.root.addEventListener('focusout', this._onRootBlurBound);
    this.root.addEventListener('keydown', this._onRootKeyDownBound);

    if (!this._isInitialized) {
      const initialRaw = parseRangeValue(this.getAttribute('value') || this.getAttribute('default-value'));
      const initial = this._normalizePending(initialRaw);
      this._value = initial;
      this._pending = { ...initial };
      this._refreshDraftFromValue();
      this._open = this.hasAttribute('open') || isTruthyAttr(this.getAttribute('default-open'));
      this._isInitialized = true;
    }

    if (this._open && !this._isInlineMode()) this._ensureOverlay();
    if (this._isInlineMode()) this._scheduleInlineCalendarSync();
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
      this._value = this._normalizePending(parseRangeValue(newValue));
      this._pending = { ...this._value };
      this._refreshDraftFromValue();
      this._inlineError = '';
      this._syncValueAttribute(this._value);
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

    if ((name === 'min' || name === 'max') && !this._syncing) {
      this._value = this._normalizePending(this._value);
      this._pending = this._normalizePending(this._pending);
      this._syncValueAttribute(this._value);
      this._refreshDraftFromValue();
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

  private _state(): DateRangePickerState {
    const raw = (this.getAttribute('state') || '').trim().toLowerCase();
    if (raw === 'loading' || raw === 'error' || raw === 'success') return raw;
    return 'idle';
  }

  private _isInteractionBlocked(): boolean {
    return this._isDisabled() || this._state() === 'loading';
  }

  private _isReadonly(): boolean {
    return this.hasAttribute('readonly');
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

  private _allowPartial(): boolean {
    return isTruthyAttr(this.getAttribute('allow-partial'), true);
  }

  private _allowSameDay(): boolean {
    return isTruthyAttr(this.getAttribute('allow-same-day'), true);
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

  private _rangeVariant(): 'two-fields' | 'single-field' {
    return (this.getAttribute('range-variant') || 'two-fields') === 'single-field' ? 'single-field' : 'two-fields';
  }

  private _minIso(): string | null {
    return parseConstraintDate(this.getAttribute('min'));
  }

  private _maxIso(): string | null {
    return parseConstraintDate(this.getAttribute('max'));
  }

  private _todayIso(): string {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${mm}-${dd}`;
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

  private _refreshDraftFromValue(): void {
    const startDisplay = formatDateForDisplay(this._value.start, this._locale(), 'locale', null);
    const endDisplay = formatDateForDisplay(this._value.end, this._locale(), 'locale', null);
    this._draftStart = startDisplay;
    this._draftEnd = endDisplay;
    this._draftSingle = [startDisplay, endDisplay].filter(Boolean).join(' — ');
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

  private _syncValueAttribute(next: RangeValue): void {
    const serialized = serializeRangeValue(next);
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
    const detail: RangeDetail = {
      mode: 'range',
      start: this._pending.start,
      end: this._pending.end,
      value: this._pending.start && this._pending.end ? { start: this._pending.start, end: this._pending.end } : null,
      source
    };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
  }

  private _emitChange(source: string): void {
    const detail: RangeDetail = {
      mode: 'range',
      start: this._value.start,
      end: this._value.end,
      value: this._value.start && this._value.end ? { start: this._value.start, end: this._value.end } : null,
      source
    };
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _emitInvalid(raw: string, reason: string): void {
    this.dispatchEvent(new CustomEvent('invalid', { detail: { raw, reason }, bubbles: true, composed: true }));
  }

  private _normalizePending(next: RangeValue): RangeValue {
    const { min: minIso, max: maxIso } = this._resolvedBounds();
    const start = next.start ? clampDateIso(next.start, minIso, maxIso) : null;
    const end = next.end ? clampDateIso(next.end, minIso, maxIso) : null;
    if (!start || !end) return { start, end };
    if (compareISO(start, end) > 0) {
      return { start: end, end: start };
    }
    return { start, end };
  }

  private _canCommit(value: RangeValue): boolean {
    if (!value.start && !value.end) return true;
    if (!this._allowPartial() && (!value.start || !value.end)) return false;
    if (value.start && value.end && !this._allowSameDay() && value.start === value.end) return false;
    return true;
  }

  private _commit(next: RangeValue, source: string): void {
    if (this._isInteractionBlocked() || this._isReadonly()) return;
    const normalized = this._normalizePending(next);
    if (!this._canCommit(normalized)) {
      this._inlineError = this.getAttribute('error') || this._translations().invalidRange;
      this._emitInvalid(JSON.stringify(next), 'range');
      this._updateHostState();
      return;
    }
    this._value = normalized;
    this._pending = { ...normalized };
    this._inlineError = '';
    this._refreshDraftFromValue();
    this._syncValueAttribute(this._value);
    this._emitInput(source);
    this._emitChange(source);
    this._updateHostState();
  }

  private _setOpen(next: boolean, source: string): void {
    if (next && this._isInteractionBlocked()) return;
    if (this._open === next) return;
    this._open = next;
    this._overlayFocusedOnOpen = false;
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
    const focusTarget = this._restoreFocusEl || (this.root.querySelector('.single, .start, .end') as HTMLElement | null);
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
    el.className = 'ui-date-range-picker-overlay-host';
    el.style.position = 'fixed';
    el.style.left = '0';
    el.style.top = '0';
    el.style.pointerEvents = 'none';
    el.addEventListener('click', this._onOverlayClickBound);
    el.addEventListener('select', this._onOverlayCalendarBound as EventListener);
    el.addEventListener('change', this._onOverlayCalendarBound as EventListener);
    document.body.appendChild(el);
    this._overlay = el;
    this._syncOverlayHostZIndex();
    document.addEventListener('pointerdown', this._onDocumentPointerDownBound, true);
    document.addEventListener('keydown', this._onDocumentKeyDownBound);
    window.addEventListener('resize', this._onWindowResizeBound);
    window.addEventListener('scroll', this._onWindowScrollBound, true);
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
    this._overlay.removeEventListener('select', this._onOverlayCalendarBound as EventListener);
    this._overlay.removeEventListener('change', this._onOverlayCalendarBound as EventListener);
    if (this._overlay.parentElement) this._overlay.parentElement.removeChild(this._overlay);
    this._overlay = null;
    this._overlayMode = null;
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
    const trigger = this.root.querySelector('.fields') as HTMLElement | null;
    if (!panel) return;
    this._dismissableLayer = createDismissableLayer({
      node: panel,
      trigger,
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
    const field = this.root.querySelector('.fields') as HTMLElement | null;
    const panel = this._overlay.querySelector('.panel') as HTMLElement | null;
    if (!field || !panel) return;
    const anchorRect = field.getBoundingClientRect();
    panel.style.setProperty('--ui-drp-panel-width', `${Math.round(anchorRect.width)}px`);
    const panelRect = panel.getBoundingClientRect();
    const position = computePopoverPosition(anchorRect, panelRect);
    panel.style.position = 'absolute';
    panel.style.top = `${Math.round(position.top)}px`;
    panel.style.left = `${Math.round(position.left)}px`;
  }

  private _renderPanelInner(sheet: boolean): string {
    const t = this._translations();
    const label = (this.getAttribute('label') || '').trim();
    const showHeader = !!label || sheet;
    const ariaModal = sheet ? 'true' : 'false';
    const body = `
      <header class="header" part="header" ${showHeader ? '' : 'hidden'}>
        <p class="title" id="${this._panelTitleId}" ${label ? '' : 'hidden'}>${escapeHtml(label)}</p>
        ${sheet ? `<button type="button" class="action" data-action="cancel">${escapeHtml(t.cancel)}</button>` : ''}
      </header>
      <ui-calendar class="drp-calendar" part="calendar"></ui-calendar>
      <div class="presets" part="presets">
        <button type="button" class="action" data-action="preset-today">${escapeHtml(t.today)}</button>
        <button type="button" class="action" data-action="preset-last7">${escapeHtml(t.last7Days)}</button>
        <button type="button" class="action" data-action="preset-month">${escapeHtml(t.thisMonth)}</button>
      </div>
      <footer class="footer" part="footer">
        <button type="button" class="action" data-action="clear" part="clear">${escapeHtml(t.clear)}</button>
        <button type="button" class="action" data-action="cancel" part="cancel">${escapeHtml(t.cancel)}</button>
        <button type="button" class="action" data-action="apply" data-tone="primary" part="apply">${escapeHtml(t.apply)}</button>
      </footer>
    `;

    return `
      <style>${overlayStyle}</style>
      ${sheet ? '<div class="sheet-backdrop" data-action="backdrop"></div>' : ''}
      <section class="${sheet ? 'sheet' : 'panel'}" id="${this._panelId}" role="dialog" aria-modal="${ariaModal}" aria-labelledby="${this._panelTitleId}" part="${sheet ? 'sheet' : 'popover'}">${body}</section>
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
    const payload = serializeRangeValue(this._pending);
    const { min, max } = this._resolvedBounds();
    syncAttr('selection', 'range');
    syncAttr('value', payload);
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
    if (this._isReadonly()) syncAttr('readonly', '');
    else syncAttr('readonly', null);
    if (this._isInteractionBlocked()) syncAttr('disabled', '');
    else syncAttr('disabled', null);
    if (this._isBare()) syncAttr('bare', '');
    else syncAttr('bare', null);
    syncAttr('tabindex', '-1');
    syncAttr('aria-label', this.getAttribute('label') || this._translations().selectDateRange);
  }

  private _ensureOverlayContent(sheet: boolean): void {
    if (!this._overlay) return;
    const mode: 'sheet' | 'popover' = sheet ? 'sheet' : 'popover';
    if (this._overlayMode === mode && this._overlay.querySelector('.drp-calendar')) return;
    this._overlayMode = mode;
    this._overlay.innerHTML = sheet
      ? `<div class="sheet-wrap">${this._renderPanelInner(true)}</div>`
      : `<div class="overlay">${this._renderPanelInner(false)}</div>`;
  }

  private _syncOverlayState(): void {
    if (!this._overlay) return;
    this._syncOverlayHostZIndex();
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
    this._syncDismissableLayer();
    const header = this._overlay.querySelector('.header') as HTMLElement | null;
    const presetGroup = this._overlay.querySelector('.presets') as HTMLElement | null;
    const footer = this._overlay.querySelector('.footer') as HTMLElement | null;
    const t = this._translations();
    if (panel) panel.dataset.bare = this._isBare() ? 'true' : 'false';
    if (header) header.hidden = !((this.getAttribute('label') || '').trim()) && !sheet;
    const showFooter = this._showFooter();
    if (presetGroup) presetGroup.hidden = !showFooter;
    if (footer) footer.hidden = !showFooter;
    if (title) {
      const label = (this.getAttribute('label') || '').trim();
      title.textContent = label;
      title.hidden = !label;
    }
    const presetToday = this._overlay.querySelector('[data-action="preset-today"]') as HTMLElement | null;
    if (presetToday) presetToday.textContent = t.today;
    const presetLast7 = this._overlay.querySelector('[data-action="preset-last7"]') as HTMLElement | null;
    if (presetLast7) presetLast7.textContent = t.last7Days;
    const presetMonth = this._overlay.querySelector('[data-action="preset-month"]') as HTMLElement | null;
    if (presetMonth) presetMonth.textContent = t.thisMonth;
    const clearAction = this._overlay.querySelector('[data-action="clear"]') as HTMLElement | null;
    if (clearAction) clearAction.textContent = t.clear;
    const cancelAction = this._overlay.querySelector('[data-action="cancel"]') as HTMLElement | null;
    if (cancelAction) cancelAction.textContent = t.cancel;
    const applyAction = this._overlay.querySelector('[data-action="apply"]') as HTMLElement | null;
    if (applyAction) applyAction.textContent = t.apply;
    const actions = this._overlay.querySelectorAll('.action');
    const disabled = this._isInteractionBlocked() || this._isReadonly();
    actions.forEach((node) => {
      (node as HTMLButtonElement).disabled = disabled;
    });
    const calendarEl = this._overlay.querySelector('.drp-calendar') as HTMLElement | null;
    if (calendarEl) {
      this._syncCalendar(calendarEl);
      if (this._open && !this._overlayFocusedOnOpen) {
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
    this._syncCalendar(calendarEl);
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

  private _updateHostState(): void {
    if (!this._hasView) return;
    const label = this.getAttribute('label') || '';
    const hint = this.getAttribute('hint') || '';
    const manualError = this.getAttribute('error') || '';
    const error = this._inlineError || manualError;
    const t = this._translations();
    const state = error ? 'error' : this._state();
    const variant = this._rangeVariant();
    const isInline = this._isInlineMode();
    const hasValue = !!(this._value.start || this._value.end || this._pending.start || this._pending.end);
    const disabled = this._isInteractionBlocked();

    const labelEl = this.root.querySelector('.label') as HTMLElement | null;
    const labelTextEl = this.root.querySelector('.label-text') as HTMLElement | null;
    const requiredEl = this.root.querySelector('.required') as HTMLElement | null;
    const fields = this.root.querySelector('.fields') as HTMLElement | null;
    const single = this.root.querySelector('.single') as HTMLInputElement | null;
    const start = this.root.querySelector('.start') as HTMLInputElement | null;
    const end = this.root.querySelector('.end') as HTMLInputElement | null;
    const sep = this.root.querySelector('.sep') as HTMLElement | null;
    const clearBtn = this.root.querySelector('.btn[data-action="clear"]') as HTMLButtonElement | null;
    const toggleBtn = this.root.querySelector('.btn[data-action="toggle"]') as HTMLButtonElement | null;
    const hintEl = this.root.querySelector('.hint') as HTMLElement | null;
    const errorEl = this.root.querySelector('.error') as HTMLElement | null;
    const inlinePanel = this.root.querySelector('.inline-panel') as HTMLElement | null;
    const inlinePresets = this.root.querySelector('.inline-panel .presets') as HTMLElement | null;
    const inlineFooter = this.root.querySelector('.inline-panel .footer') as HTMLElement | null;
    const hiddenRange = this.root.querySelector('.hidden-range') as HTMLInputElement | null;
    const hiddenStart = this.root.querySelector('.hidden-start') as HTMLInputElement | null;
    const hiddenEnd = this.root.querySelector('.hidden-end') as HTMLInputElement | null;
    const inlineActions = this.root.querySelectorAll('.inline-panel .action');

    if (labelEl) {
      labelEl.hidden = !label;
      labelEl.id = this._labelId;
      labelEl.setAttribute('for', variant === 'single-field' ? this._singleId : this._startId);
    }
    if (labelTextEl) labelTextEl.textContent = label;
    if (requiredEl) requiredEl.hidden = !this.hasAttribute('required');
    if (fields) {
      fields.dataset.single = variant === 'single-field' ? 'true' : 'false';
      fields.dataset.invalid = error ? 'true' : 'false';
      fields.dataset.open = this._open && !isInline ? 'true' : 'false';
      fields.dataset.state = state;
      fields.setAttribute('aria-disabled', disabled ? 'true' : 'false');
    }
    if (single) {
      if (single.value !== this._draftSingle) single.value = this._draftSingle;
      single.id = this._singleId;
      single.hidden = variant !== 'single-field';
      single.readOnly = this._isReadonly() || disabled;
      single.disabled = disabled;
      single.required = this.hasAttribute('required');
      single.placeholder = t.startEnd;
      single.autocomplete = 'off';
      single.setAttribute('role', 'combobox');
      single.setAttribute('aria-haspopup', 'dialog');
      single.setAttribute('aria-controls', this._panelId);
      single.setAttribute('aria-expanded', isInline ? 'false' : String(this._open));
      single.setAttribute('aria-invalid', error ? 'true' : 'false');
      if (label) single.setAttribute('aria-labelledby', this._labelId);
      else single.removeAttribute('aria-labelledby');
    }
    if (start) {
      if (start.value !== this._draftStart) start.value = this._draftStart;
      start.id = this._startId;
      start.hidden = variant === 'single-field';
      start.readOnly = this._isReadonly() || disabled;
      start.disabled = disabled;
      start.required = this.hasAttribute('required');
      start.placeholder = t.startDate;
      start.autocomplete = 'off';
      start.setAttribute('role', 'combobox');
      start.setAttribute('aria-haspopup', 'dialog');
      start.setAttribute('aria-controls', this._panelId);
      start.setAttribute('aria-expanded', isInline ? 'false' : String(this._open));
      start.setAttribute('aria-invalid', error ? 'true' : 'false');
      if (label) start.setAttribute('aria-labelledby', this._labelId);
      else start.removeAttribute('aria-labelledby');
    }
    if (end) {
      if (end.value !== this._draftEnd) end.value = this._draftEnd;
      end.id = this._endId;
      end.hidden = variant === 'single-field';
      end.readOnly = this._isReadonly() || disabled;
      end.disabled = disabled;
      end.required = this.hasAttribute('required');
      end.placeholder = t.endDate;
      end.autocomplete = 'off';
      end.setAttribute('role', 'combobox');
      end.setAttribute('aria-haspopup', 'dialog');
      end.setAttribute('aria-controls', this._panelId);
      end.setAttribute('aria-expanded', isInline ? 'false' : String(this._open));
      end.setAttribute('aria-invalid', error ? 'true' : 'false');
      if (label) end.setAttribute('aria-labelledby', this._labelId);
      else end.removeAttribute('aria-labelledby');
    }
    if (sep) sep.hidden = variant === 'single-field';
    if (clearBtn) {
      clearBtn.hidden = !(this._clearable() && hasValue);
      clearBtn.disabled = disabled;
      clearBtn.setAttribute('aria-label', t.clearDateRange);
    }
    if (toggleBtn) {
      toggleBtn.hidden = isInline;
      toggleBtn.disabled = disabled;
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
    const describedBy: string[] = [];
    if (hint && hintEl && !hintEl.hidden) describedBy.push(this._hintId);
    if (error) describedBy.push(this._errorId);
    const describedByValue = describedBy.join(' ');
    if (single) {
      if (describedByValue) single.setAttribute('aria-describedby', describedByValue);
      else single.removeAttribute('aria-describedby');
    }
    if (start) {
      if (describedByValue) start.setAttribute('aria-describedby', describedByValue);
      else start.removeAttribute('aria-describedby');
    }
    if (end) {
      if (describedByValue) end.setAttribute('aria-describedby', describedByValue);
      else end.removeAttribute('aria-describedby');
    }
    if (inlinePanel) {
      inlinePanel.hidden = !isInline;
      inlinePanel.id = this._panelId;
      inlinePanel.dataset.bare = this._isBare() ? 'true' : 'false';
      inlinePanel.setAttribute('role', 'dialog');
      inlinePanel.setAttribute('aria-modal', 'false');
      inlinePanel.setAttribute('aria-label', label || t.selectDateRange);
    }
    const showFooter = this._showFooter();
    if (inlinePresets) inlinePresets.hidden = !showFooter;
    if (inlineFooter) inlineFooter.hidden = !showFooter;
    inlineActions.forEach((node) => {
      (node as HTMLButtonElement).disabled = disabled || this._isReadonly();
    });
    const inlinePresetToday = this.root.querySelector('.inline-panel [data-action="preset-today"]') as HTMLElement | null;
    if (inlinePresetToday) inlinePresetToday.textContent = t.today;
    const inlinePresetLast7 = this.root.querySelector('.inline-panel [data-action="preset-last7"]') as HTMLElement | null;
    if (inlinePresetLast7) inlinePresetLast7.textContent = t.last7Days;
    const inlinePresetMonth = this.root.querySelector('.inline-panel [data-action="preset-month"]') as HTMLElement | null;
    if (inlinePresetMonth) inlinePresetMonth.textContent = t.thisMonth;
    const inlineClear = this.root.querySelector('.inline-panel [data-action="clear"]') as HTMLElement | null;
    if (inlineClear) inlineClear.textContent = t.clear;
    const inlineApply = this.root.querySelector('.inline-panel [data-action="apply"]') as HTMLElement | null;
    if (inlineApply) inlineApply.textContent = t.apply;

    const name = this.getAttribute('name') || '';
    const startName = this.getAttribute('name-start') || '';
    const endName = this.getAttribute('name-end') || '';
    const combined = this._value.start && this._value.end ? `${this._value.start}..${this._value.end}` : '';
    if (hiddenRange) {
      hiddenRange.disabled = !name;
      hiddenRange.name = name;
      hiddenRange.value = combined;
    }
    if (hiddenStart) {
      hiddenStart.disabled = !!name || !startName;
      hiddenStart.name = startName;
      hiddenStart.value = this._value.start || '';
    }
    if (hiddenEnd) {
      hiddenEnd.disabled = !!name || !endName;
      hiddenEnd.name = endName;
      hiddenEnd.value = this._value.end || '';
    }

    if (isInline) {
      this._scheduleInlineCalendarSync();
      this._destroyOverlay();
      return;
    }

    if (this._open) this._syncOverlayState();
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const actionEl = target.closest('[data-action]') as HTMLElement | null;
    const action = actionEl?.getAttribute('data-action');
    if (!action) return;
    if (this._isInteractionBlocked()) return;
    if (action === 'toggle') {
      this._restoreFocusEl = actionEl as HTMLElement;
      this._setOpen(!this._open, 'toggle');
      return;
    }
    if (action === 'clear') {
      this._commit({ start: null, end: null }, 'clear');
      return;
    }
    if (action === 'apply') {
      this._commit(this._pending, 'apply');
      if (!this._isInlineMode()) this._setOpen(false, 'apply');
      return;
    }
    if (action === 'cancel') {
      this._pending = { ...this._value };
      if (!this._isInlineMode()) this._setOpen(false, 'cancel');
      this._updateHostState();
    }
  }

  private _onRootInput(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;
    if (this._isInteractionBlocked()) return;
    if (this._isReadonly()) return;
    const variant = this._rangeVariant();
    if (variant === 'single-field' && target.classList.contains('single')) {
      this._draftSingle = target.value;
      this._inlineError = '';
      return;
    }
    if (target.classList.contains('start')) {
      this._draftStart = target.value;
      this._inlineError = '';
    }
    if (target.classList.contains('end')) {
      this._draftEnd = target.value;
      this._inlineError = '';
    }
  }

  private _commitFromDraft(source: string): boolean {
    const variant = this._rangeVariant();
    if (variant === 'single-field') {
      const raw = this._draftSingle.trim();
      if (!raw) {
        this._pending = { start: null, end: null };
        this._commit(this._pending, source);
        return true;
      }
      const parsed = parseSingleRangeDraft(raw, this._locale());
      if (!parsed.start || (!parsed.end && !this._allowPartial())) {
        this._inlineError = this.getAttribute('error') || this._translations().invalidRange;
        this._emitInvalid(raw, 'parse');
        this._updateHostState();
        return false;
      }
      this._pending = this._normalizePending({ start: parsed.start, end: parsed.end || null });
      this._commit(this._pending, source);
      return true;
    }

    const start = this._draftStart ? parseUserDateInput(this._draftStart, this._locale()) : null;
    const end = this._draftEnd ? parseUserDateInput(this._draftEnd, this._locale()) : null;
    if ((this._draftStart && !start) || (this._draftEnd && !end)) {
      this._inlineError = this.getAttribute('error') || this._translations().invalidRange;
      this._emitInvalid(`${this._draftStart} ${this._draftEnd}`.trim(), 'parse');
      this._updateHostState();
      return false;
    }
    this._pending = this._normalizePending({ start, end });
    this._commit(this._pending, source);
    return true;
  }

  private _onRootBlur(event: Event): void {
    if (this._isInteractionBlocked()) return;
    if (this._isReadonly()) return;
    const focusEvent = event as FocusEvent;
    const target = focusEvent.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement)) return;
    const related = focusEvent.relatedTarget as Node | null;
    if (related && this._overlay?.contains(related)) return;
    if (this._open && !this._isInlineMode()) return;
    if (target.classList.contains('single') || target.classList.contains('start') || target.classList.contains('end')) {
      if (target.classList.contains('single')) this._draftSingle = target.value;
      if (target.classList.contains('start')) this._draftStart = target.value;
      if (target.classList.contains('end')) this._draftEnd = target.value;
      this._commitFromDraft('blur');
    }
  }

  private _onRootKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this._isInteractionBlocked()) return;
    if (keyboardEvent.key === 'Enter') {
      const target = keyboardEvent.target as HTMLElement | null;
      if (!this._isReadonly() && target instanceof HTMLInputElement && (target.classList.contains('single') || target.classList.contains('start') || target.classList.contains('end'))) {
        keyboardEvent.preventDefault();
        if (target.classList.contains('single')) this._draftSingle = target.value;
        if (target.classList.contains('start')) this._draftStart = target.value;
        if (target.classList.contains('end')) this._draftEnd = target.value;
        const committed = this._commitFromDraft('enter');
        if (committed && !this._isInlineMode()) this._setOpen(false, 'enter');
        return;
      }
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
    if (this._isInteractionBlocked() || this._isReadonly()) return;

    if (action === 'backdrop') {
      this._setOpen(false, 'outside');
      return;
    }

    if (action === 'clear') {
      this._pending = { start: null, end: null };
      this._emitInput('clear');
      this._renderOverlay();
      return;
    }
    if (action === 'cancel') {
      this._pending = { ...this._value };
      this._setOpen(false, 'cancel');
      return;
    }
    if (action === 'apply') {
      this._commit(this._pending, 'apply');
      this._setOpen(false, 'apply');
      return;
    }
    if (action === 'preset-today') {
      const iso = this._todayIso();
      this._pending = this._normalizePending({ start: iso, end: iso });
      this._emitInput('preset-today');
      this._renderOverlay();
      return;
    }
    if (action === 'preset-last7') {
      const todayIso = this._todayIso();
      this._pending = this._normalizePending(computeLastDaysRange(todayIso, 7));
      this._emitInput('preset-last7');
      this._renderOverlay();
      return;
    }
    if (action === 'preset-month') {
      const todayIso = this._todayIso();
      this._pending = this._normalizePending(computeMonthRange(todayIso));
      this._emitInput('preset-month');
      this._renderOverlay();
    }
  }

  private _onOverlayCalendarChange(event: Event): void {
    if (this._isInteractionBlocked() || this._isReadonly()) return;
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'ui-calendar') return;
    const detail = (event as CustomEvent<{ mode?: string; start?: string; end?: string }>).detail;
    if (!detail || detail.mode !== 'range') return;
    this._pending = this._normalizePending({
      start: normalizeDateIso(detail.start || null),
      end: normalizeDateIso(detail.end || null)
    });
    this._emitInput('calendar');
    if (this._shouldAutoCommit() && this._pending.start && this._pending.end) {
      this._commit(this._pending, 'calendar');
      if (!this._isInlineMode()) this._setOpen(false, 'calendar');
      return;
    }
    this._updateHostState();
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
          <div class="fields" part="field input" data-single="false">
            <span class="icon" part="icon" aria-hidden="true">${CALENDAR_ICON}</span>
            <input class="input single" id="${this._singleId}" part="input" />
            <input class="input start" id="${this._startId}" part="input" />
            <span class="sep">—</span>
            <input class="input end" id="${this._endId}" part="input" />
            <button type="button" class="btn" part="clear" data-action="clear">${CLOSE_ICON}</button>
            <button type="button" class="btn" part="toggle" data-action="toggle">
              <span class="toggle-icon">${CHEVRON_ICON}</span>
              <span class="spinner" aria-hidden="true"></span>
            </button>
          </div>
          <div class="hint" id="${this._hintId}" part="hint"></div>
          <div class="error" id="${this._errorId}" part="error" role="alert"></div>
          <input class="hidden-range" type="hidden" disabled />
          <input class="hidden-start" type="hidden" disabled />
          <input class="hidden-end" type="hidden" disabled />
          <section class="inline-panel" id="${this._panelId}" part="popover" hidden>
            <ui-calendar class="inline-calendar" part="calendar"></ui-calendar>
            <div class="presets" part="presets">
              <button type="button" class="action" data-action="preset-today"></button>
              <button type="button" class="action" data-action="preset-last7"></button>
              <button type="button" class="action" data-action="preset-month"></button>
            </div>
            <footer class="footer" part="footer">
              <button type="button" class="action" data-action="clear"></button>
              <button type="button" class="action" data-action="apply" data-tone="primary"></button>
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-date-range-picker')) {
  customElements.define('ui-date-range-picker', UIDateRangePicker);
}
