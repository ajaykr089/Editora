import { ElementBase } from '../ElementBase';
import { createDismissableLayer, type DismissableLayerHandle } from '../primitives/dismissable-layer';
import { resolveDateTimeTranslations } from './date-time-i18n';
import {
  combineDateTime,
  compareDateTimes,
  computeLastDaysRange,
  computeMonthRange,
  computePopoverPosition,
  formatDateForDisplay,
  isTruthyAttr,
  lockBodyScroll,
  normalizeLocale,
  parseConstraintDateTime,
  parseTimeInput,
  rafThrottle,
  shouldUseMobileSheet,
  splitDateTime
} from './date-time-utils';

type RangeDateTimeValue = { start: string | null; end: string | null };
type RangeDateTimeDetail = {
  mode: 'datetimerange';
  start: string | null;
  end: string | null;
  value: { start: string; end: string } | null;
  source: string;
};

type PendingState = {
  startDate: string | null;
  endDate: string | null;
  startTime: string;
  endTime: string;
};

let dateRangeTimePickerUid = 0;

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
    --ui-drtp-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 96%, transparent);
    --ui-drtp-surface: linear-gradient(
      180deg,
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 98%, transparent),
      color-mix(in srgb, var(--ui-color-surface, #ffffff) 90%, var(--ui-color-surface-alt, #f8fafc))
    );
    --ui-drtp-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 78%, transparent);
    --ui-dp-text: var(--ui-color-text, #0f172a);
    --ui-dp-muted: var(--ui-color-muted, #64748b);
    --ui-drtp-accent: var(--ui-color-primary, #2563eb);
    --ui-drtp-success: var(--ui-color-success, #16a34a);
    --ui-drtp-error: var(--ui-color-danger, #dc2626);
    --ui-drtp-radius: 12px;
    --ui-drtp-panel-radius: 14px;
    --ui-drtp-z: 1600;
    --ui-drtp-shadow: none;
    --ui-drtp-hit: 42px;
    --ui-drtp-duration: 160ms;
    --ui-drtp-ease: cubic-bezier(0.2, 0.9, 0.24, 1);
    color-scheme: light dark;
    display: inline-grid;
    inline-size: min(100%, var(--ui-width, 420px));
    min-inline-size: min(260px, 100%);
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ui-dp-text);
  }

  :host([shape="square"]) {
    --ui-drtp-radius: 6px;
    --ui-drtp-panel-radius: 8px;
  }

  :host([shape="soft"]) {
    --ui-drtp-radius: 16px;
    --ui-drtp-panel-radius: 18px;
  }

  :host([size="sm"]) {
    --ui-drtp-hit: 38px;
  }

  :host([size="lg"]) {
    --ui-drtp-hit: 48px;
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
    color: var(--ui-drtp-error);
    font-size: 11px;
    line-height: 1;
  }

  .field {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto auto auto;
    align-items: center;
    gap: 8px;
    min-block-size: var(--ui-drtp-hit);
    border: 1px solid var(--ui-drtp-border);
    border-radius: var(--ui-drtp-radius);
    background: var(--ui-drtp-surface);
    padding: 0 10px;
    box-shadow: 0 1px 2px rgba(2, 6, 23, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.72);
    transition: border-color var(--ui-drtp-duration) var(--ui-drtp-ease), box-shadow var(--ui-drtp-duration) var(--ui-drtp-ease), transform var(--ui-drtp-duration) var(--ui-drtp-ease);
  }

  .field[data-open="true"],
  .field:focus-within {
    border-color: color-mix(in srgb, var(--ui-drtp-accent) 70%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-drtp-accent) 22%, transparent), 0 10px 22px rgba(2, 6, 23, 0.12);
  }

  .field[data-invalid="true"] {
    border-color: color-mix(in srgb, var(--ui-drtp-error) 72%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-drtp-error) 20%, transparent);
  }

  .field[data-state="success"]:not([data-invalid="true"]) {
    border-color: color-mix(in srgb, var(--ui-drtp-success) 56%, transparent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-drtp-success) 18%, transparent);
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
    background: color-mix(in srgb, var(--ui-drtp-bg) 84%, transparent);
    inline-size: 28px;
    block-size: 28px;
    border-radius: 8px;
    color: color-mix(in srgb, var(--ui-dp-text) 72%, transparent);
    cursor: pointer;
    display: inline-grid;
    place-items: center;
    transition: background-color var(--ui-drtp-duration) var(--ui-drtp-ease), color var(--ui-drtp-duration) var(--ui-drtp-ease), border-color var(--ui-drtp-duration) var(--ui-drtp-ease), transform var(--ui-drtp-duration) var(--ui-drtp-ease);
  }
  .btn:hover {
    background: color-mix(in srgb, var(--ui-drtp-accent) 10%, transparent);
    border-color: color-mix(in srgb, var(--ui-drtp-accent) 30%, transparent);
    color: var(--ui-dp-text);
  }
  .btn:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-drtp-accent) 64%, transparent);
    outline-offset: 1px;
  }
  .btn:active {
    transform: translateY(1px);
  }
  .btn[hidden] { display: none; }
  .hint { color: var(--ui-dp-muted); font-size: 12px; line-height: 1.4; }
  .error { color: var(--ui-drtp-error); font-size: 12px; line-height: 1.4; }
  .hint[hidden], .error[hidden] { display: none; }

  .inline-panel {
    border: 1px solid var(--ui-drtp-border);
    border-radius: var(--ui-drtp-panel-radius);
    background: var(--ui-drtp-surface);
    box-shadow: var(--ui-drtp-shadow);
    inline-size: fit-content;
    max-inline-size: 100%;
    justify-self: start;
    padding: 12px;
    display: grid;
    gap: 12px;
  }

  .inline-panel .content {
    gap: 8px;
    grid-template-columns: minmax(0, 1fr) 248px;
  }

  .inline-panel .time-groups {
    gap: 8px;
  }

  .inline-panel .time-card {
    padding: 8px;
    gap: 6px;
  }

  .inline-panel .time-table {
    gap: 4px;
  }

  .inline-panel .time-row + .time-row {
    padding-top: 6px;
  }

  .inline-panel .footer,
  .inline-panel .presets {
    gap: 6px;
  }

  .inline-panel[data-bare="true"] {
    border: 0;
    border-radius: 0;
    background: var(--ui-drtp-bare-bg, var(--ui-drtp-bg));
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
    background: color-mix(in srgb, var(--ui-drtp-bg) 90%, var(--ui-color-surface-alt, #f8fafc));
  }

  :host([variant="contrast"]) {
    --ui-drtp-bg: #0f172a;
    --ui-drtp-border: #334155;
    --ui-dp-text: #e2e8f0;
    --ui-dp-muted: #94a3b8;
    --ui-drtp-accent: #93c5fd;
    --ui-drtp-surface: linear-gradient(180deg, color-mix(in srgb, #0f172a 84%, #1e293b), #0f172a);
    --ui-drtp-shadow: 0 18px 36px rgba(2, 6, 23, 0.48);
  }

  @media (forced-colors: active) {
    .field,
    .inline-panel {
      border-color: CanvasText;
      background: Canvas;
      box-shadow: none;
    }

    .btn,
    .preset,
    .action {
      border-color: CanvasText;
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
  .overlay { position: fixed; z-index: var(--ui-drtp-z, 1600); pointer-events: none; }
  .panel {
    pointer-events: auto;
    min-inline-size: min(680px, calc(100vw - 20px));
    max-inline-size: min(760px, calc(100vw - 20px));
    border: 1px solid var(--ui-drtp-border, #cbd5e1);
    border-radius: var(--ui-drtp-panel-radius, 14px);
    background: var(--ui-drtp-surface, #fff);
    color: var(--ui-dp-text, #0f172a);
    box-shadow: var(--ui-drtp-shadow);
    padding: 12px;
    display: grid;
    gap: 12px;
    animation: ui-drtp-pop var(--ui-drtp-duration, 160ms) var(--ui-drtp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }
  .panel[data-bare="true"], .sheet[data-bare="true"] {
    border: 0;
    border-radius: 0;
    background: var(--ui-drtp-bare-bg, var(--ui-drtp-bg));
    box-shadow: none;
    padding: 0;
  }
  .sheet-wrap { position: fixed; inset: 0; display: grid; align-items: end; z-index: var(--ui-drtp-z, 1600); }
  .sheet-backdrop { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.52); }
  .sheet {
    position: relative;
    pointer-events: auto;
    background: var(--ui-drtp-surface, #fff);
    color: var(--ui-dp-text, #0f172a);
    border-radius: 16px 16px 0 0;
    border: 1px solid color-mix(in srgb, var(--ui-drtp-border, #cbd5e1) 84%, transparent);
    box-shadow: 0 -12px 30px rgba(2, 6, 23, 0.2);
    padding: 12px;
    display: grid;
    gap: 10px;
    max-block-size: min(82vh, 680px);
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
  .presets {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .presets[hidden] { display: none !important; }
  .preset {
    border: 1px dashed color-mix(in srgb, var(--ui-drtp-border, #cbd5e1) 86%, transparent);
    border-radius: 999px;
    padding: 0 10px;
    min-block-size: 28px;
    font: 600 11px/1 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ui-dp-muted, #64748b);
    background: color-mix(in srgb, var(--ui-drtp-bg, #fff) 96%, transparent);
    cursor: pointer;
  }
  .preset:hover {
    border-color: color-mix(in srgb, var(--ui-drtp-accent, #2563eb) 44%, transparent);
    color: var(--ui-dp-text, #0f172a);
  }
  .content { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 10px; align-items: start; }
  .time-groups { display: grid; gap: 10px; align-content: start; }
  .time-card {
    border: 1px solid color-mix(in srgb, var(--ui-drtp-border, #cbd5e1) 85%, transparent);
    border-radius: 12px;
    padding: 10px;
    display: grid;
    gap: 8px;
    background: color-mix(in srgb, var(--ui-drtp-bg, #fff) 95%, transparent);
  }
  .time-title {
    margin: 0;
    font: 700 12px/1.25 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: var(--ui-dp-text, #0f172a);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .time-table {
    display: grid;
    gap: 6px;
  }
  .time-table-head {
    display: grid;
    grid-template-columns: minmax(100px, 1fr) repeat(2, minmax(74px, 1fr));
    gap: 8px;
    align-items: center;
  }
  .time-col-label {
    font-size: 10px;
    color: var(--ui-dp-muted, #64748b);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    text-align: center;
  }
  .time-row {
    display: grid;
    grid-template-columns: minmax(100px, 1fr) repeat(2, minmax(74px, 1fr));
    gap: 8px;
    align-items: center;
  }
  .time-row + .time-row {
    border-top: 1px dashed color-mix(in srgb, var(--ui-drtp-border, #cbd5e1) 70%, transparent);
    padding-top: 8px;
  }
  .time-row-label {
    margin: 0;
    font: 600 12px/1.2 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    color: color-mix(in srgb, var(--ui-dp-text, #0f172a) 86%, transparent);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .time-row select {
    min-block-size: 34px;
    border: 1px solid color-mix(in srgb, var(--ui-drtp-border, #cbd5e1) 84%, transparent);
    border-radius: 8px;
    padding: 0 8px;
    background: color-mix(in srgb, var(--ui-drtp-bg, #fff) 95%, transparent);
    color: var(--ui-dp-text, #0f172a);
    font: 600 13px/1 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .time-row select:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-drtp-accent, #2563eb) 66%, transparent);
    outline-offset: 1px;
  }
  .footer { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
  .footer[hidden] { display: none !important; }
  .action {
    border: 1px solid color-mix(in srgb, var(--ui-drtp-border, #cbd5e1) 85%, transparent);
    background: color-mix(in srgb, var(--ui-drtp-bg, #fff) 95%, transparent);
    color: var(--ui-dp-text, #0f172a);
    min-block-size: 32px;
    border-radius: 8px;
    padding: 0 12px;
    font: 650 12px/1 Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    cursor: pointer;
    transition: border-color var(--ui-drtp-duration, 160ms) var(--ui-drtp-ease, cubic-bezier(0.2, 0.9, 0.24, 1)), background-color var(--ui-drtp-duration, 160ms) var(--ui-drtp-ease, cubic-bezier(0.2, 0.9, 0.24, 1)), transform var(--ui-drtp-duration, 160ms) var(--ui-drtp-ease, cubic-bezier(0.2, 0.9, 0.24, 1));
  }
  .action:hover {
    border-color: color-mix(in srgb, var(--ui-drtp-accent, #2563eb) 40%, var(--ui-drtp-border, #cbd5e1));
    background: color-mix(in srgb, var(--ui-drtp-accent, #2563eb) 10%, transparent);
  }
  .action:active { transform: translateY(1px); }
  .action:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--ui-drtp-accent, #2563eb) 66%, transparent);
    outline-offset: 1px;
  }
  .action[data-tone="primary"] { border-color: color-mix(in srgb, var(--ui-drtp-accent, #2563eb) 60%, transparent); background: color-mix(in srgb, var(--ui-drtp-accent, #2563eb) 20%, transparent); }
  .action:disabled { opacity: .58; cursor: not-allowed; }

  .icon-inline {
    display: inline-grid;
    place-items: center;
    color: color-mix(in srgb, var(--ui-dp-text, #0f172a) 70%, transparent);
  }
  .icon-svg {
    inline-size: 16px;
    block-size: 16px;
    pointer-events: none;
  }

  @media (max-width: 900px) {
    .content { grid-template-columns: 1fr; }
  }

  @media (max-width: 560px) {
    .time-table-head {
      display: none;
    }
    .time-row {
      grid-template-columns: 1fr 1fr;
    }
    .time-row-label {
      grid-column: 1 / -1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .panel, .sheet, .action, .preset { animation: none !important; transition: none !important; }
  }

  @media (forced-colors: active) {
    .panel,
    .sheet,
    .time-card {
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
      box-shadow: none;
    }

    .sheet-backdrop {
      background: color-mix(in srgb, CanvasText 36%, transparent);
    }

    .head-meta,
    .time-col-label,
    .time-row-label {
      color: CanvasText;
    }

    .time-row select,
    .preset,
    .action {
      border-color: CanvasText;
      background: Canvas;
      color: CanvasText;
    }

    .time-row select:focus-visible,
    .action:focus-visible {
      outline-color: Highlight;
    }
  }

  @keyframes ui-drtp-pop {
    from { opacity: 0; transform: translateY(6px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

function parseValue(raw: string | null): RangeDateTimeValue {
  if (!raw) return { start: null, end: null };
  try {
    const parsed = JSON.parse(raw);
    const start = typeof parsed?.start === 'string' ? parsed.start : null;
    const end = typeof parsed?.end === 'string' ? parsed.end : null;
    return { start, end };
  } catch {
    return { start: null, end: null };
  }
}

function serializeValue(value: RangeDateTimeValue): string | null {
  if (!value.start && !value.end) return null;
  return JSON.stringify({
    ...(value.start ? { start: value.start } : {}),
    ...(value.end ? { end: value.end } : {})
  });
}

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

function defaultPending(value: RangeDateTimeValue): PendingState {
  const now = new Date();
  const defaultTimeStart = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
  const defaultTimeEnd = `${pad2((now.getHours() + 1) % 24)}:${pad2(now.getMinutes())}`;
  const start = splitDateTime(value.start || null);
  const end = splitDateTime(value.end || null);
  return {
    startDate: start?.date || null,
    endDate: end?.date || null,
    startTime: start?.time?.slice(0, 5) || defaultTimeStart,
    endTime: end?.time?.slice(0, 5) || defaultTimeEnd
  };
}

export class UIDateRangeTimePicker extends ElementBase {
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
      'auto-normalize',
      'allow-partial',
      'disabled',
      'readonly',
      'required',
      'name',
      'close-on-select',
      'clearable',
      'mode',
      'label',
      'hint',
      'error',
      'show-footer'
    ];
  }

  private _value: RangeDateTimeValue = { start: null, end: null };
  private _pending: PendingState = defaultPending({ start: null, end: null });
  private _display = '';
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
  private readonly _uid = `ui-drtp-${++dateRangeTimePickerUid}`;
  private readonly _inputId = `${this._uid}-input`;
  private readonly _labelId = `${this._uid}-label`;
  private readonly _hintId = `${this._uid}-hint`;
  private readonly _errorId = `${this._uid}-error`;
  private readonly _panelId = `${this._uid}-panel`;
  private _schedulePosition = rafThrottle(() => this._positionOverlay());

  private _onRootClickBound = (event: Event) => this._onRootClick(event);
  private _onRootChangeBound = (event: Event) => this._onRootChange(event);
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
    this.root.addEventListener('change', this._onRootChangeBound);
    this.root.addEventListener('keydown', this._onRootKeyDownBound);

    if (!this._isInitialized) {
      const initial = parseValue(this.getAttribute('value') || this.getAttribute('default-value'));
      this._value = initial;
      this._pending = defaultPending(initial);
      this._display = this._formatDisplay();
      this._open = this.hasAttribute('open') || isTruthyAttr(this.getAttribute('default-open'));
      this._isInitialized = true;
    }
    if (this._open && !this._isInlineMode()) this._ensureOverlay();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onRootClickBound);
    this.root.removeEventListener('change', this._onRootChangeBound);
    this.root.removeEventListener('keydown', this._onRootKeyDownBound);
    this._destroyOverlay();
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    if (name === 'value' && !this._syncing) {
      this._value = parseValue(newValue);
      this._pending = defaultPending(this._value);
      this._display = this._formatDisplay();
      this._inlineError = '';
    }
    if (name === 'open' && !this._syncing) {
      this._open = this.hasAttribute('open');
      this._syncOverlay('attribute');
    }
    if (name === 'mode') {
      this._syncOverlay('attribute');
    }
    if (name === 'disabled' && this.hasAttribute('disabled')) this._setOpen(false, 'outside');
    if (name === 'state' && this._state() === 'loading') this._setOpen(false, 'outside');
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

  private _locale(): string {
    return normalizeLocale(this.getAttribute('locale'));
  }

  private _isReadonly(): boolean {
    return this.hasAttribute('readonly');
  }

  private _clearable(): boolean {
    return isTruthyAttr(this.getAttribute('clearable'), true);
  }

  private _showFooter(): boolean {
    return isTruthyAttr(this.getAttribute('show-footer'), true);
  }

  private _shouldAutoCommit(): boolean {
    return isTruthyAttr(this.getAttribute('close-on-select'), false) || !this._showFooter();
  }

  private _isBare(): boolean {
    return isTruthyAttr(this.getAttribute('bare'), false);
  }

  private _allowPartial(): boolean {
    return isTruthyAttr(this.getAttribute('allow-partial'), true);
  }

  private _autoNormalize(): boolean {
    return isTruthyAttr(this.getAttribute('auto-normalize'), true);
  }

  private _step(): number {
    const parsed = Number(this.getAttribute('step') || 5);
    if (!Number.isFinite(parsed) || parsed < 1) return 5;
    return Math.min(60, Math.trunc(parsed));
  }

  private _translations() {
    return resolveDateTimeTranslations(
      this.getAttribute('locale'),
      this.getAttribute('translations')
    );
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

  private _syncValueAttribute(next: RangeDateTimeValue): void {
    const serialized = serializeValue(next);
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
    const pendingValue = this._valueFromPending();
    const detail: RangeDateTimeDetail = {
      mode: 'datetimerange',
      start: pendingValue.start,
      end: pendingValue.end,
      value: pendingValue.start && pendingValue.end
        ? { start: pendingValue.start, end: pendingValue.end }
        : null,
      source
    };
    this.dispatchEvent(new CustomEvent('input', { detail, bubbles: true, composed: true }));
  }

  private _emitChange(source: string): void {
    const detail: RangeDateTimeDetail = {
      mode: 'datetimerange',
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

  private _valueFromPending(): RangeDateTimeValue {
    return {
      start: combineDateTime(this._pending.startDate, this._pending.startTime),
      end: combineDateTime(this._pending.endDate, this._pending.endTime)
    };
  }

  private _formatDateTimeDisplay(value: string | null): string {
    const split = splitDateTime(value);
    if (!split) return value || '';
    const date = formatDateForDisplay(split.date, this._locale(), 'locale', null);
    return `${date} ${split.time}`;
  }

  private _formatDisplay(): string {
    const start = this._value.start;
    const end = this._value.end;
    if (!start && !end) return '';
    if (start && end) return `${this._formatDateTimeDisplay(start)} — ${this._formatDateTimeDisplay(end)}`;
    return this._formatDateTimeDisplay(start || end);
  }

  private _normalizePendingState(state: PendingState): PendingState {
    let start = combineDateTime(state.startDate, state.startTime);
    let end = combineDateTime(state.endDate, state.endTime);
    if (start && end && compareDateTimes(start, end) > 0) {
      if (this._autoNormalize()) {
        const tmp = start;
        start = end;
        end = tmp;
      }
    }
    const min = parseConstraintDateTime(this.getAttribute('min'));
    const max = parseConstraintDateTime(this.getAttribute('max'));
    let minValue = min ? `${min.date}T${min.time}` : null;
    let maxValue = max ? `${max.date}T${max.time}` : null;
    if (minValue && maxValue && compareDateTimes(minValue, maxValue) > 0) {
      const swap = minValue;
      minValue = maxValue;
      maxValue = swap;
    }
    if (start && minValue && compareDateTimes(start, minValue) < 0) start = minValue;
    if (start && maxValue && compareDateTimes(start, maxValue) > 0) start = maxValue;
    if (end && minValue && compareDateTimes(end, minValue) < 0) end = minValue;
    if (end && maxValue && compareDateTimes(end, maxValue) > 0) end = maxValue;
    const splitStart = splitDateTime(start || '');
    const splitEnd = splitDateTime(end || '');
    return {
      startDate: splitStart?.date || null,
      endDate: splitEnd?.date || null,
      startTime: splitStart?.time?.slice(0, 5) || state.startTime,
      endTime: splitEnd?.time?.slice(0, 5) || state.endTime
    };
  }

  private _commit(state: PendingState, source: string): void {
    if (this._isInteractionBlocked() || this._isReadonly()) return;
    const normalized = this._normalizePendingState(state);
    const value = {
      start: combineDateTime(normalized.startDate, normalized.startTime),
      end: combineDateTime(normalized.endDate, normalized.endTime)
    };
    if (!this._allowPartial() && (!value.start || !value.end)) {
      this._inlineError = this.getAttribute('error') || this._translations().rangeIncomplete;
      this._emitInvalid(JSON.stringify(value), 'partial');
      this._updateHostState();
      return;
    }
    if (value.start && value.end && compareDateTimes(value.start, value.end) > 0) {
      this._inlineError = this.getAttribute('error') || this._translations().invalidRangeOrder;
      this._emitInvalid(JSON.stringify(value), 'order');
      this._updateHostState();
      return;
    }
    this._value = value;
    this._pending = normalized;
    this._display = this._formatDisplay();
    this._inlineError = '';
    this._syncValueAttribute(value);
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
    el.style.pointerEvents = 'none';
    el.addEventListener('click', this._onOverlayClickBound);
    el.addEventListener('change', this._onOverlayChangeBound);
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
    const resolved = window.getComputedStyle(this).getPropertyValue('--ui-drtp-z').trim();
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
    this._overlay.removeEventListener('change', this._onOverlayCalendarBound as EventListener);
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
    const trigger = this.root.querySelector('.field') as HTMLElement | null;
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
    const field = this.root.querySelector('.field') as HTMLElement | null;
    const panel = this._overlay.querySelector('.panel') as HTMLElement | null;
    if (!field || !panel) return;
    const position = computePopoverPosition(field.getBoundingClientRect(), panel.getBoundingClientRect());
    panel.style.position = 'absolute';
    panel.style.top = `${Math.round(position.top)}px`;
    panel.style.left = `${Math.round(position.left)}px`;
  }

  private _timeOptions(selected: string): { hours: string; minutes: string } {
    const parsed = parseTimeInput(selected, true) || { hours: 0, minutes: 0, seconds: 0 };
    const step = this._step();
    const hours = Array.from({ length: 24 }, (_, index) => {
      return `<option value="${index}" ${index === parsed.hours ? 'selected' : ''}>${pad2(index)}</option>`;
    }).join('');
    const minutes = Array.from({ length: Math.ceil(60 / step) }, (_, index) => {
      const value = Math.min(59, index * step);
      return `<option value="${value}" ${value === parsed.minutes ? 'selected' : ''}>${pad2(value)}</option>`;
    }).join('');
    return { hours, minutes };
  }

  private _renderSurfaceInner(sheet: boolean, inline = false): string {
    const t = this._translations();
    const start = this._timeOptions(this._pending.startTime);
    const end = this._timeOptions(this._pending.endTime);
    const rawLabel = (this.getAttribute('label') || '').trim();
    const label = escapeHtml(rawLabel);
    const dialogLabel = escapeHtml(rawLabel || t.selectDateRange);
    const summary = this._valueFromPending();
    const summaryText =
      summary.start && summary.end
        ? `${this._formatDateTimeDisplay(summary.start)} — ${this._formatDateTimeDisplay(summary.end)}`
        : t.selectDateRange;
    const startHourLabel = escapeHtml(`${t.startTime} ${t.hour}`);
    const startMinuteLabel = escapeHtml(`${t.startTime} ${t.minute}`);
    const endHourLabel = escapeHtml(`${t.endTime} ${t.hour}`);
    const endMinuteLabel = escapeHtml(`${t.endTime} ${t.minute}`);
    const content = `
      <header class="head">
        <div>
          <p class="head-title" ${rawLabel ? '' : 'hidden'}>${label}</p>
          <p class="head-meta">${escapeHtml(summaryText)}</p>
        </div>
      </header>
      <div class="content">
        <ui-calendar class="${inline ? 'drtp-calendar-inline' : 'drtp-calendar'}" part="calendar"></ui-calendar>
        <section class="time-groups" part="time">
          <div class="time-card">
            <p class="time-title"><span class="icon-inline">${CLOCK_ICON}</span>${escapeHtml(t.startTime)} / ${escapeHtml(t.endTime)}</p>
            <div class="time-table" role="group" aria-label="${escapeHtml(t.dateRangeTimePlaceholder)}">
              <div class="time-table-head" aria-hidden="true">
                <span></span>
                <span class="time-col-label">${escapeHtml(t.hour)}</span>
                <span class="time-col-label">${escapeHtml(t.minute)}</span>
              </div>
              <div class="time-row">
                <p class="time-row-label"><span class="icon-inline">${CLOCK_ICON}</span>${escapeHtml(t.startTime)}</p>
                <select data-time="start" data-segment="hours" aria-label="${startHourLabel}">${start.hours}</select>
                <select data-time="start" data-segment="minutes" aria-label="${startMinuteLabel}">${start.minutes}</select>
              </div>
              <div class="time-row">
                <p class="time-row-label"><span class="icon-inline">${CLOCK_ICON}</span>${escapeHtml(t.endTime)}</p>
                <select data-time="end" data-segment="hours" aria-label="${endHourLabel}">${end.hours}</select>
                <select data-time="end" data-segment="minutes" aria-label="${endMinuteLabel}">${end.minutes}</select>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="presets" part="presets">
        <button type="button" class="preset" data-action="preset-today">${escapeHtml(t.today)}</button>
        <button type="button" class="preset" data-action="preset-last7">${escapeHtml(t.last7Days)}</button>
        <button type="button" class="preset" data-action="preset-month">${escapeHtml(t.thisMonth)}</button>
      </div>
      <footer class="footer" part="footer">
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
    syncAttr('selection', 'range');
    syncAttr('value', JSON.stringify({
      ...(this._pending.startDate ? { start: this._pending.startDate } : {}),
      ...(this._pending.endDate ? { end: this._pending.endDate } : {})
    }));
    const min = parseConstraintDateTime(this.getAttribute('min'));
    const max = parseConstraintDateTime(this.getAttribute('max'));
    syncAttr('min', min?.date || null);
    syncAttr('max', max?.date || null);
    syncAttr('locale', this.getAttribute('locale'));
    syncAttr('translations', this.getAttribute('translations'));
    syncAttr('week-start', this.getAttribute('week-start'));
    const sizeAttr = this.getAttribute('size');
    const effectiveSize = sizeAttr || 'sm';
    const isInlineCalendar = calendarEl.classList.contains('drtp-calendar-inline');
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
    syncAttr('aria-label', this.getAttribute('label') || this._translations().selectDateRange);
  }

  private _overlaySignature(sheet: boolean): string {
    return [
      sheet ? 'sheet' : 'popover',
      this._step(),
      this.getAttribute('locale') || '',
      this.getAttribute('label') || '',
      this.getAttribute('translations') || ''
    ].join(':');
  }

  private _ensureOverlayContent(sheet: boolean): void {
    if (!this._overlay) return;
    const signature = this._overlaySignature(sheet);
    if (this._overlayKey === signature && this._overlay.querySelector('.drtp-calendar')) return;
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
    this._syncOverlayHostZIndex();
    const sheet = this._isMobileSheet();
    this._ensureOverlayContent(sheet);
    this._syncDismissableLayer();
    const t = this._translations();
    const panel = this._overlay.querySelector('.panel, .sheet') as HTMLElement | null;
    const presets = this._overlay.querySelector('.presets') as HTMLElement | null;
    const footer = this._overlay.querySelector('.footer') as HTMLElement | null;
    if (panel) panel.dataset.bare = this._isBare() ? 'true' : 'false';
    const showFooter = this._showFooter();
    if (presets) presets.hidden = !showFooter;
    if (footer) footer.hidden = !showFooter;
    const headTitle = this._overlay.querySelector('.head-title') as HTMLElement | null;
    if (headTitle) {
      const label = (this.getAttribute('label') || '').trim();
      headTitle.textContent = label;
      headTitle.hidden = !label;
    }
    const headMeta = this._overlay.querySelector('.head-meta') as HTMLElement | null;
    const pendingValue = this._valueFromPending();
    if (headMeta) {
      headMeta.textContent =
        pendingValue.start && pendingValue.end
          ? `${this._formatDateTimeDisplay(pendingValue.start)} — ${this._formatDateTimeDisplay(pendingValue.end)}`
          : t.selectDateRange;
    }
    const calendarEl = this._overlay.querySelector('.drtp-calendar') as HTMLElement | null;
    if (calendarEl) this._syncCalendar(calendarEl);
    const startParsed = parseTimeInput(this._pending.startTime, true) || { hours: 0, minutes: 0, seconds: 0 };
    const endParsed = parseTimeInput(this._pending.endTime, true) || { hours: 0, minutes: 0, seconds: 0 };
    const selectStartHour = this._overlay.querySelector('select[data-time="start"][data-segment="hours"]') as HTMLSelectElement | null;
    const selectStartMinute = this._overlay.querySelector('select[data-time="start"][data-segment="minutes"]') as HTMLSelectElement | null;
    const selectEndHour = this._overlay.querySelector('select[data-time="end"][data-segment="hours"]') as HTMLSelectElement | null;
    const selectEndMinute = this._overlay.querySelector('select[data-time="end"][data-segment="minutes"]') as HTMLSelectElement | null;
    if (selectStartHour) this._setClosestOptionValue(selectStartHour, startParsed.hours);
    if (selectStartMinute) this._setClosestOptionValue(selectStartMinute, startParsed.minutes);
    if (selectEndHour) this._setClosestOptionValue(selectEndHour, endParsed.hours);
    if (selectEndMinute) this._setClosestOptionValue(selectEndMinute, endParsed.minutes);
    const disabled = this._isInteractionBlocked() || this._isReadonly();
    [selectStartHour, selectStartMinute, selectEndHour, selectEndMinute].forEach((el) => {
      if (el) el.disabled = disabled;
    });
    this._overlay.querySelectorAll('.action, .preset').forEach((node) => {
      (node as HTMLButtonElement).disabled = disabled;
    });
    if (!sheet) this._schedulePosition.run();
  }

  private _renderOverlay(): void {
    this._syncOverlayState();
  }

  private _applyTimeFromOverlay(target: HTMLSelectElement): void {
    const timeKey = target.getAttribute('data-time');
    const hourEl = this._overlay?.querySelector(`select[data-time="${timeKey}"][data-segment="hours"]`) as HTMLSelectElement | null;
    const minuteEl = this._overlay?.querySelector(`select[data-time="${timeKey}"][data-segment="minutes"]`) as HTMLSelectElement | null;
    if (!timeKey || !hourEl || !minuteEl) return;
    const hours = Number(hourEl.value);
    const minutes = Number(minuteEl.value);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;
    const time = `${pad2(hours)}:${pad2(minutes)}`;
    if (timeKey === 'start') this._pending.startTime = time;
    if (timeKey === 'end') this._pending.endTime = time;
    this._pending = this._normalizePendingState(this._pending);
    this._emitInput('time');
  }

  private _todayIso(): string {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${mm}-${dd}`;
  }

  private _applyPreset(action: 'preset-today' | 'preset-last7' | 'preset-month'): void {
    const todayIso = this._todayIso();
    if (action === 'preset-today') {
      this._pending.startDate = todayIso;
      this._pending.endDate = todayIso;
      this._pending = this._normalizePendingState(this._pending);
      this._emitInput('preset-today');
      return;
    }
    if (action === 'preset-last7') {
      const range = computeLastDaysRange(todayIso, 7);
      this._pending.startDate = range.start;
      this._pending.endDate = range.end;
      this._pending = this._normalizePendingState(this._pending);
      this._emitInput('preset-last7');
      return;
    }
    const range = computeMonthRange(todayIso);
    this._pending.startDate = range.start;
    this._pending.endDate = range.end;
    this._pending = this._normalizePendingState(this._pending);
    this._emitInput('preset-month');
  }

  private _onRootClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const action = target.closest('[data-action]')?.getAttribute('data-action');
    if (!action) return;
    if (this._isInteractionBlocked()) return;
    if (this._isReadonly() && action !== 'toggle') return;
    if (action === 'toggle') {
      this._restoreFocusEl = target;
      this._setOpen(!this._open, 'toggle');
      return;
    }
    if (action === 'clear') {
      if (this._isInlineMode()) {
        this._pending = defaultPending({ start: null, end: null });
        this._emitInput('clear');
        this._updateHostState();
      } else {
        this._pending = defaultPending({ start: null, end: null });
        this._commit(this._pending, 'clear');
      }
      return;
    }
    if (this._isInlineMode() && (action === 'preset-today' || action === 'preset-last7' || action === 'preset-month')) {
      this._applyPreset(action);
      this._updateHostState();
      return;
    }
    if (this._isInlineMode() && action === 'cancel') {
      this._pending = defaultPending(this._value);
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
      if (!target.matches('select[data-time][data-segment]')) return;
      if (this._isInteractionBlocked() || this._isReadonly()) return;
      this._applyTimeFromOverlay(target);
      if (this._shouldAutoCommit()) {
        const next = this._valueFromPending();
        if (next.start && next.end) {
          this._commit(this._pending, 'time');
          return;
        }
      }
      this._updateHostState();
    }
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
    if (this._isInteractionBlocked() || this._isReadonly()) return;
    if (action === 'backdrop') {
      this._setOpen(false, 'outside');
      return;
    }
    if (action === 'cancel') {
      this._pending = defaultPending(this._value);
      this._setOpen(false, 'cancel');
      return;
    }
    if (action === 'clear') {
      this._pending = defaultPending({ start: null, end: null });
      this._emitInput('clear');
      this._renderOverlay();
      return;
    }
    if (action === 'preset-today' || action === 'preset-last7' || action === 'preset-month') {
      this._applyPreset(action);
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
    if (!target.matches('select[data-time][data-segment]')) return;
    if (this._isInteractionBlocked() || this._isReadonly()) return;
    this._applyTimeFromOverlay(target);
    if (this._shouldAutoCommit()) {
      const next = this._valueFromPending();
      if (next.start && next.end) {
        this._commit(this._pending, 'time');
        this._setOpen(false, 'time');
      }
    }
  }

  private _onOverlayCalendar(event: Event): void {
    if (this._isInteractionBlocked() || this._isReadonly()) return;
    const target = event.target as HTMLElement | null;
    if (!target || target.tagName.toLowerCase() !== 'ui-calendar') return;
    const detail = (event as CustomEvent<{ mode?: string; start?: string; end?: string }>).detail;
    if (!detail || detail.mode !== 'range') return;
    this._pending.startDate = detail.start || null;
    this._pending.endDate = detail.end || null;
    this._pending = this._normalizePendingState(this._pending);
    this._emitInput('calendar');
    if (this._shouldAutoCommit() && this._pending.startDate && this._pending.endDate) {
      this._commit(this._pending, 'calendar');
      this._setOpen(false, 'calendar');
      return;
    }
    if (this._isInlineMode()) this._updateHostState();
    else this._renderOverlay();
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
    const hasValue = !!(this._value.start || this._value.end);
    const name = this.getAttribute('name') || '';
    const isInline = this._isInlineMode();
    const t = this._translations();
    const state = error ? 'error' : this._state();
    const display = this._formatDisplay();
    this._display = display;
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

    if (labelEl) {
      labelEl.hidden = !label;
      labelEl.id = this._labelId;
      labelEl.setAttribute('for', this._inputId);
    }
    if (labelTextEl) labelTextEl.textContent = label;
    if (requiredEl) requiredEl.hidden = !this.hasAttribute('required');
    if (inputEl) {
      if (inputEl.value !== display) inputEl.value = display;
      inputEl.id = this._inputId;
      inputEl.placeholder = t.dateRangeTimePlaceholder;
      inputEl.readOnly = true;
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
      clearBtn.setAttribute('aria-label', t.clearDateRange);
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
      hiddenInput.value = serializeValue(this._value) || '';
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
      inlinePanel.setAttribute('aria-label', label || t.selectDateRange);
      const titleEl = inlinePanel.querySelector('.panel-title') as HTMLElement | null;
      if (titleEl) {
        titleEl.textContent = label;
        titleEl.hidden = !label;
      }
      const inlineHeadTitle = inlinePanel.querySelector('.head-title') as HTMLElement | null;
      if (inlineHeadTitle) {
        inlineHeadTitle.textContent = label;
        inlineHeadTitle.hidden = !label;
      }
      const inlineHeadMeta = inlinePanel.querySelector('.head-meta') as HTMLElement | null;
      const pendingInlineValue = this._valueFromPending();
      if (inlineHeadMeta) {
        inlineHeadMeta.textContent =
          pendingInlineValue.start && pendingInlineValue.end
            ? `${this._formatDateTimeDisplay(pendingInlineValue.start)} — ${this._formatDateTimeDisplay(pendingInlineValue.end)}`
            : t.selectDateRange;
      }
      const inlineCalendar = inlinePanel.querySelector('.drtp-calendar-inline') as HTMLElement | null;
      if (inlineCalendar) this._syncCalendar(inlineCalendar);
      const inlineStartHour = inlinePanel.querySelector('select[data-time="start"][data-segment="hours"]') as HTMLSelectElement | null;
      const inlineStartMinute = inlinePanel.querySelector('select[data-time="start"][data-segment="minutes"]') as HTMLSelectElement | null;
      const inlineEndHour = inlinePanel.querySelector('select[data-time="end"][data-segment="hours"]') as HTMLSelectElement | null;
      const inlineEndMinute = inlinePanel.querySelector('select[data-time="end"][data-segment="minutes"]') as HTMLSelectElement | null;
      const startParsed = parseTimeInput(this._pending.startTime, true) || { hours: 0, minutes: 0, seconds: 0 };
      const endParsed = parseTimeInput(this._pending.endTime, true) || { hours: 0, minutes: 0, seconds: 0 };
      if (inlineStartHour) this._setClosestOptionValue(inlineStartHour, startParsed.hours);
      if (inlineStartMinute) this._setClosestOptionValue(inlineStartMinute, startParsed.minutes);
      if (inlineEndHour) this._setClosestOptionValue(inlineEndHour, endParsed.hours);
      if (inlineEndMinute) this._setClosestOptionValue(inlineEndMinute, endParsed.minutes);
      [inlineStartHour, inlineStartMinute, inlineEndHour, inlineEndMinute].forEach((node) => {
        if (node) node.disabled = this._isInteractionBlocked() || this._isReadonly();
      });
      const presetToday = inlinePanel.querySelector('[data-action="preset-today"]') as HTMLElement | null;
      if (presetToday) presetToday.textContent = t.today;
      const presetLast7 = inlinePanel.querySelector('[data-action="preset-last7"]') as HTMLElement | null;
      if (presetLast7) presetLast7.textContent = t.last7Days;
      const presetMonth = inlinePanel.querySelector('[data-action="preset-month"]') as HTMLElement | null;
      if (presetMonth) presetMonth.textContent = t.thisMonth;
      const inlineClear = inlinePanel.querySelector('[data-action="clear"]') as HTMLElement | null;
      if (inlineClear) inlineClear.textContent = t.clear;
      const inlineApply = inlinePanel.querySelector('[data-action="apply"]') as HTMLElement | null;
      if (inlineApply) inlineApply.textContent = t.apply;
      const inlinePresets = inlinePanel.querySelector('.presets') as HTMLElement | null;
      const inlineFooter = inlinePanel.querySelector('.footer') as HTMLElement | null;
      const showFooter = this._showFooter();
      if (inlinePresets) inlinePresets.hidden = !showFooter;
      if (inlineFooter) inlineFooter.hidden = !showFooter;
      inlinePanel.querySelectorAll('.action, .preset').forEach((node) => {
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
            <input class="input" id="${this._inputId}" part="input" readonly />
            <span class="icon" part="icon">${CLOCK_ICON}</span>
            <button type="button" class="btn" part="clear" data-action="clear">${CLOSE_ICON}</button>
            <button type="button" class="btn" part="toggle" data-action="toggle">${CHEVRON_ICON}</button>
          </div>
          <div class="hint" id="${this._hintId}" part="hint"></div>
          <div class="error" id="${this._errorId}" part="error" role="alert"></div>
          <input class="hidden-input" type="hidden" disabled />
          <section class="inline-panel" id="${this._panelId}" part="popover" hidden>
            <p class="panel-title">${escapeHtml(t.selectDateRange)}</p>
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

if (typeof customElements !== 'undefined' && !customElements.get('ui-date-range-time-picker')) {
  customElements.define('ui-date-range-time-picker', UIDateRangeTimePicker);
}
