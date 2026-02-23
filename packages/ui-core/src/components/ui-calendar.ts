import { ElementBase } from '../ElementBase';

/**
 * ui-calendar attributes
 * - year="YYYY" (backward-compatible)
 * - month="1-12" (backward-compatible)
 * - events='[{"date":"YYYY-MM-DD","title":"...","tone":"default|success|warning|danger|info"}]' (backward-compatible)
 * - value (backward-compatible; format depends on selection mode)
 * - variant="default|contrast" (backward-compatible)
 * - headless (backward-compatible)
 * - selection="single|range|multiple" (default: single)
 * - min="YYYY-MM-DD"
 * - max="YYYY-MM-DD"
 * - disabled
 * - readonly
 * - week-start="0|1|6"
 * - locale="en-US"
 * - outside-click="none|navigate|select" (default: navigate)
 * - events-max="N" (default: 3)
 * - events-display="dots|badges|count" (default: dots)
 * - max-selections="N" (multiple mode limit)
 * - size="sm|md|lg" (default: md)
 * - hide-today (hides today button)
 * - show-today="true|false" (optional override)
 *
 * events
 * - select: { value } (single mode compatibility)
 * - change: { mode, value, start?, end?, values? }
 *
 * methods
 * - focusDate(iso)
 * - goToMonth(year, month)
 * - selectDate(iso)
 */

type CalendarEventTone = 'default' | 'success' | 'warning' | 'danger' | 'info';
type CalendarEvent = {
  date: string;
  title?: string;
  tone?: CalendarEventTone;
};

type SelectionMode = 'single' | 'range' | 'multiple';
type OutsideClickMode = 'none' | 'navigate' | 'select';
type EventsDisplay = 'dots' | 'badges' | 'count';
type CalendarSize = 'sm' | 'md' | 'lg';

type IsoParts = { y: number; m: number; d: number };

type SingleSelection = { mode: 'single'; value: string | null };
type RangeSelection = { mode: 'range'; start: string | null; end: string | null };
type MultipleSelection = { mode: 'multiple'; values: string[] };
type CalendarSelection = SingleSelection | RangeSelection | MultipleSelection;

type CalendarCell = {
  iso: string;
  parts: IsoParts;
  outside: boolean;
  disabled: boolean;
  today: boolean;
};

const style = `
  :host {
    --ui-calendar-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent);
    --ui-calendar-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-calendar-text: var(--ui-color-text, #0f172a);
    --ui-calendar-muted: var(--ui-color-muted, #64748b);
    --ui-calendar-accent: var(--ui-color-primary, #2563eb);

    --ui-calendar-radius: 14px;
    --ui-calendar-shadow: 0 14px 34px rgba(15, 23, 42, 0.1);
    --ui-calendar-gap: 10px;
    --ui-calendar-day-radius: 10px;
    --ui-calendar-day-hover-bg: color-mix(in srgb, var(--ui-calendar-accent) 10%, transparent);
    --ui-calendar-selected-bg: color-mix(in srgb, var(--ui-calendar-accent) 14%, transparent);
    --ui-calendar-selected-border: color-mix(in srgb, var(--ui-calendar-accent) 44%, transparent);
    --ui-calendar-today-ring: color-mix(in srgb, var(--ui-calendar-accent) 56%, transparent);
    --ui-calendar-range-bg: color-mix(in srgb, var(--ui-calendar-accent) 9%, transparent);
    --ui-calendar-range-edge: color-mix(in srgb, var(--ui-calendar-accent) 20%, transparent);
    --ui-calendar-disabled-opacity: 0.45;

    --ui-calendar-day-height: 52px;
    --ui-calendar-day-font-size: 12px;
    --ui-calendar-weekday-font-size: 11px;
    --ui-calendar-title-font-size: 14px;

    display: block;
    min-inline-size: 280px;
    max-inline-size: 100%;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  :host([size="sm"]) {
    --ui-calendar-gap: 8px;
    --ui-calendar-day-height: 42px;
    --ui-calendar-day-font-size: 11px;
    --ui-calendar-weekday-font-size: 10px;
    --ui-calendar-title-font-size: 13px;
    --ui-calendar-day-radius: 8px;
  }

  :host([size="lg"]) {
    --ui-calendar-gap: 12px;
    --ui-calendar-day-height: 58px;
    --ui-calendar-day-font-size: 13px;
    --ui-calendar-weekday-font-size: 12px;
    --ui-calendar-title-font-size: 15px;
    --ui-calendar-day-radius: 12px;
  }

  .frame {
    border: 1px solid var(--ui-calendar-border);
    border-radius: var(--ui-calendar-radius);
    background: var(--ui-calendar-bg);
    box-shadow: var(--ui-calendar-shadow);
    padding: 12px;
    display: grid;
    gap: var(--ui-calendar-gap);
    min-inline-size: 0;
  }

  :host([headless]) .frame {
    display: none !important;
  }

  .header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    min-inline-size: 0;
  }

  .nav,
  .header-actions {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .title-wrap {
    display: flex;
    justify-content: center;
    min-inline-size: 0;
  }

  .title-btn,
  .nav-btn,
  .today-btn,
  .picker-btn,
  .picker-month,
  .picker-year-btn {
    border: 1px solid color-mix(in srgb, var(--ui-calendar-border) 82%, transparent);
    background: color-mix(in srgb, var(--ui-calendar-bg) 94%, transparent);
    color: var(--ui-calendar-text);
    border-radius: 9px;
    cursor: pointer;
    transition: background-color 130ms ease, border-color 130ms ease, transform 120ms ease;
  }

  .nav-btn,
  .today-btn,
  .picker-year-btn {
    min-block-size: 30px;
    padding: 0 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font: 600 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .nav-btn {
    inline-size: 30px;
    padding: 0;
  }

  .title-btn {
    min-block-size: 32px;
    padding: 0 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font: 700 var(--ui-calendar-title-font-size)/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    letter-spacing: 0.01em;
    min-inline-size: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-btn:hover,
  .today-btn:hover,
  .title-btn:hover,
  .picker-btn:hover,
  .picker-month:hover,
  .picker-year-btn:hover {
    border-color: color-mix(in srgb, var(--ui-calendar-accent) 38%, var(--ui-calendar-border));
    background: var(--ui-calendar-day-hover-bg);
  }

  .nav-btn:active,
  .today-btn:active,
  .title-btn:active,
  .picker-btn:active,
  .picker-month:active,
  .picker-year-btn:active {
    transform: translateY(1px);
  }

  .nav-btn:focus-visible,
  .today-btn:focus-visible,
  .title-btn:focus-visible,
  .picker-btn:focus-visible,
  .picker-month:focus-visible,
  .picker-year-btn:focus-visible,
  .day:focus-visible {
    outline: 2px solid var(--ui-calendar-accent);
    outline-offset: 1px;
  }

  .nav-btn[disabled],
  .today-btn[disabled],
  .title-btn[disabled],
  .picker-btn[disabled],
  .picker-month[disabled],
  .picker-year-btn[disabled],
  .day[aria-disabled="true"] {
    opacity: var(--ui-calendar-disabled-opacity);
    cursor: not-allowed;
    pointer-events: none;
  }

  .monthyear-pop {
    border: 1px solid color-mix(in srgb, var(--ui-calendar-border) 84%, transparent);
    border-radius: 12px;
    background: color-mix(in srgb, var(--ui-calendar-bg) 96%, transparent);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.1);
    padding: 10px;
    display: grid;
    gap: 8px;
  }

  .monthyear-pop[hidden] {
    display: none;
  }

  .picker-header {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .picker-year {
    font: 700 13px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-calendar-text);
  }

  .picker-months {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }

  .picker-month {
    min-block-size: 28px;
    padding: 0 8px;
    font: 600 11px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .picker-month[data-active="true"] {
    border-color: var(--ui-calendar-selected-border);
    background: var(--ui-calendar-selected-bg);
  }

  .grid-wrap {
    min-inline-size: 0;
    display: grid;
    gap: 6px;
  }

  .weekdays,
  .week {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
  }

  .weekday {
    text-align: center;
    font-size: var(--ui-calendar-weekday-font-size);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--ui-calendar-muted);
    padding: 4px 2px;
  }

  .day {
    border: 1px solid color-mix(in srgb, var(--ui-calendar-border) 78%, transparent);
    border-radius: var(--ui-calendar-day-radius);
    min-block-size: var(--ui-calendar-day-height);
    padding: 6px;
    background: color-mix(in srgb, var(--ui-calendar-bg) 98%, transparent);
    color: var(--ui-calendar-text);
    display: grid;
    align-content: start;
    gap: 4px;
    text-align: left;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 130ms ease, background-color 130ms ease;
  }

  .day:hover {
    border-color: color-mix(in srgb, var(--ui-calendar-accent) 34%, var(--ui-calendar-border));
    background: var(--ui-calendar-day-hover-bg);
  }

  .day[data-outside="true"] {
    color: color-mix(in srgb, var(--ui-calendar-muted) 88%, transparent);
    background: color-mix(in srgb, var(--ui-calendar-bg) 92%, transparent);
  }

  .day[data-today="true"] {
    box-shadow: inset 0 0 0 1px var(--ui-calendar-today-ring);
  }

  .day[data-selected="true"] {
    border-color: var(--ui-calendar-selected-border);
    background: var(--ui-calendar-selected-bg);
  }

  .day[data-range="true"] {
    background: var(--ui-calendar-range-bg);
    border-color: color-mix(in srgb, var(--ui-calendar-accent) 26%, var(--ui-calendar-border));
    border-radius: 0;
  }

  .day[data-range-start="true"],
  .day[data-range-end="true"] {
    background: var(--ui-calendar-range-edge);
    border-color: var(--ui-calendar-selected-border);
    border-radius: var(--ui-calendar-day-radius);
  }

  .day[data-range-preview="true"] {
    background: color-mix(in srgb, var(--ui-calendar-accent) 7%, transparent);
  }

  .day-number {
    font-size: var(--ui-calendar-day-font-size);
    font-weight: 650;
    line-height: 1;
  }

  .events {
    min-block-size: 10px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-inline-size: 100%;
    overflow: hidden;
  }

  .event-dot {
    inline-size: 7px;
    block-size: 7px;
    border-radius: 999px;
    background: var(--event-tone, var(--ui-calendar-accent));
    flex: 0 0 auto;
  }

  .event-badge {
    max-inline-size: 100%;
    border-radius: 999px;
    padding: 1px 6px;
    font: 600 10px/1.25 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: color-mix(in srgb, var(--event-tone, var(--ui-calendar-accent)) 18%, transparent);
    color: var(--ui-calendar-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .event-count {
    inline-size: 16px;
    block-size: 16px;
    border-radius: 999px;
    display: inline-grid;
    place-items: center;
    font: 700 10px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: color-mix(in srgb, var(--ui-calendar-accent) 18%, transparent);
    color: var(--ui-calendar-text);
  }

  .event-more {
    font: 600 10px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: var(--ui-calendar-muted);
    white-space: nowrap;
  }

  .tooltip {
    position: absolute;
    inset-inline-start: 50%;
    inset-block-end: calc(100% + 6px);
    transform: translateX(-50%);
    min-inline-size: 120px;
    max-inline-size: 220px;
    padding: 6px 8px;
    border-radius: 8px;
    border: 1px solid color-mix(in srgb, var(--ui-calendar-border) 80%, transparent);
    background: color-mix(in srgb, var(--ui-calendar-bg) 98%, #ffffff 2%);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
    color: var(--ui-calendar-text);
    font: 500 11px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    opacity: 0;
    pointer-events: none;
    z-index: 5;
  }

  .tooltip[hidden] {
    display: none;
  }

  .day:hover .tooltip,
  .day:focus-visible .tooltip,
  .day:focus-within .tooltip {
    opacity: 1;
  }

  .live-region {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }

  :host([variant="contrast"]) {
    --ui-calendar-bg: #0f172a;
    --ui-calendar-border: #334155;
    --ui-calendar-text: #e2e8f0;
    --ui-calendar-muted: #93a4bd;
    --ui-calendar-accent: #93c5fd;
    --ui-calendar-shadow: 0 16px 38px rgba(2, 6, 23, 0.5);
    --ui-calendar-selected-bg: color-mix(in srgb, #93c5fd 22%, transparent);
    --ui-calendar-selected-border: color-mix(in srgb, #93c5fd 72%, transparent);
    --ui-calendar-range-bg: color-mix(in srgb, #93c5fd 12%, transparent);
    --ui-calendar-range-edge: color-mix(in srgb, #93c5fd 20%, transparent);
  }

  :host([disabled]) .frame {
    opacity: 0.74;
  }

  @media (max-width: 420px) {
    .frame {
      padding: 10px;
    }

    .header {
      grid-template-columns: 1fr;
      gap: 6px;
    }

    .title-wrap {
      justify-content: flex-start;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .day,
    .nav-btn,
    .today-btn,
    .title-btn,
    .picker-btn,
    .picker-month,
    .picker-year-btn {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .frame {
      box-shadow: none;
      border-width: 2px;
    }

    .day,
    .nav-btn,
    .today-btn,
    .title-btn,
    .picker-btn,
    .picker-month,
    .picker-year-btn {
      border-width: 2px;
    }
  }

  @media (forced-colors: active) {
    :host {
      --ui-calendar-bg: Canvas;
      --ui-calendar-border: CanvasText;
      --ui-calendar-text: CanvasText;
      --ui-calendar-muted: CanvasText;
      --ui-calendar-accent: Highlight;
      --ui-calendar-shadow: none;
      --ui-calendar-selected-bg: Highlight;
      --ui-calendar-selected-border: Highlight;
      --ui-calendar-range-bg: Highlight;
      --ui-calendar-range-edge: Highlight;
      --ui-calendar-today-ring: Highlight;
    }

    .frame,
    .day,
    .nav-btn,
    .today-btn,
    .title-btn,
    .picker-btn,
    .picker-month,
    .picker-year-btn,
    .monthyear-pop,
    .tooltip,
    .event-dot,
    .event-badge,
    .event-count {
      forced-color-adjust: none;
      box-shadow: none;
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }

    .day[data-selected="true"],
    .day[data-range="true"],
    .day[data-range-start="true"],
    .day[data-range-end="true"] {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
    }

    .day[data-today="true"] {
      box-shadow: inset 0 0 0 2px Highlight;
    }

    .event-dot,
    .event-badge,
    .event-count {
      background: Highlight;
      color: HighlightText;
      border-color: Highlight;
    }
  }
`;

const EVENT_TONES: Record<CalendarEventTone, string> = {
  default: 'var(--ui-color-primary, #2563eb)',
  info: 'var(--ui-color-info, #0891b2)',
  success: 'var(--ui-color-success, #16a34a)',
  warning: 'var(--ui-color-warning, #d97706)',
  danger: 'var(--ui-color-danger, #dc2626)'
};

const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatISO(parts: IsoParts): string {
  return `${parts.y}-${pad2(parts.m)}-${pad2(parts.d)}`;
}

function parseISO(dateStr: string): IsoParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec((dateStr || '').trim());
  if (!match) return null;

  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null;
  if (m < 1 || m > 12) return null;
  const dim = daysInMonth(y, m);
  if (d < 1 || d > dim) return null;

  return { y, m, d };
}

function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function toUTCDate(parts: IsoParts): Date {
  return new Date(Date.UTC(parts.y, parts.m - 1, parts.d));
}

function fromUTCDate(date: Date): IsoParts {
  return {
    y: date.getUTCFullYear(),
    m: date.getUTCMonth() + 1,
    d: date.getUTCDate()
  };
}

function compareISO(a: string, b: string): number {
  const ap = parseISO(a);
  const bp = parseISO(b);
  if (!ap || !bp) return a.localeCompare(b);
  if (ap.y !== bp.y) return ap.y - bp.y;
  if (ap.m !== bp.m) return ap.m - bp.m;
  return ap.d - bp.d;
}

function addDaysISO(iso: string, days: number): string {
  const parts = parseISO(iso);
  if (!parts) return iso;
  const date = toUTCDate(parts);
  date.setUTCDate(date.getUTCDate() + days);
  return formatISO(fromUTCDate(date));
}

function addMonthsParts(parts: IsoParts, months: number): IsoParts {
  const date = new Date(Date.UTC(parts.y, parts.m - 1, 1));
  date.setUTCMonth(date.getUTCMonth() + months);
  const nextYear = date.getUTCFullYear();
  const nextMonth = date.getUTCMonth() + 1;
  const nextDay = clamp(parts.d, 1, daysInMonth(nextYear, nextMonth));
  return { y: nextYear, m: nextMonth, d: nextDay };
}

function addMonthsISO(iso: string, months: number): string {
  const parts = parseISO(iso);
  if (!parts) return iso;
  return formatISO(addMonthsParts(parts, months));
}

function startOfMonth(year: number, month: number): IsoParts {
  return { y: year, m: month, d: 1 };
}

function endOfMonth(year: number, month: number): IsoParts {
  return { y: year, m: month, d: daysInMonth(year, month) };
}

function weekdayFromISO(iso: string): number {
  const parts = parseISO(iso);
  if (!parts) return 0;
  return toUTCDate(parts).getUTCDay();
}

function readInt(raw: string | null, fallback: number): number {
  if (raw == null || raw === '') return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? Math.trunc(value) : fallback;
}

function readPositiveInt(raw: string | null, fallback: number): number {
  const value = readInt(raw, fallback);
  return value < 1 ? fallback : value;
}

function readTruthy(raw: string | null, fallback: boolean): boolean {
  if (raw == null) return fallback;
  const normalized = String(raw).toLowerCase();
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off';
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isoInRange(iso: string, start: string, end: string): boolean {
  return compareISO(iso, start) >= 0 && compareISO(iso, end) <= 0;
}

function normalizeRange(start: string, end: string): { start: string; end: string } {
  if (compareISO(start, end) <= 0) return { start, end };
  return { start: end, end: start };
}

function normalizeWeekStart(raw: string | null, locale: string): number {
  const parsed = Number(raw);
  if (parsed === 0 || parsed === 1 || parsed === 6) return parsed;

  try {
    const localeObj = new (Intl as any).Locale(locale || undefined);
    const firstDay = localeObj?.weekInfo?.firstDay;
    if (firstDay === 7) return 0;
    if (firstDay === 1 || firstDay === 6) return firstDay;
  } catch {
    // no-op
  }

  return 0;
}

function normalizeSelectionMode(raw: string | null): SelectionMode {
  if (raw === 'range' || raw === 'multiple') return raw;
  return 'single';
}

function normalizeOutsideClick(raw: string | null): OutsideClickMode {
  if (raw === 'none' || raw === 'select') return raw;
  return 'navigate';
}

function normalizeEventsDisplay(raw: string | null): EventsDisplay {
  if (raw === 'badges' || raw === 'count') return raw;
  return 'dots';
}

function normalizeSize(raw: string | null): CalendarSize {
  if (raw === 'sm' || raw === 'lg') return raw;
  return 'md';
}

function uniqueIsoList(values: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  values.forEach((value) => {
    const parsed = parseISO(value);
    if (!parsed) return;
    const iso = formatISO(parsed);
    if (seen.has(iso)) return;
    seen.add(iso);
    out.push(iso);
  });
  out.sort(compareISO);
  return out;
}

function cloneSelection(selection: CalendarSelection): CalendarSelection {
  if (selection.mode === 'single') {
    return { mode: 'single', value: selection.value };
  }
  if (selection.mode === 'range') {
    return { mode: 'range', start: selection.start, end: selection.end };
  }
  return { mode: 'multiple', values: [...selection.values] };
}

export class UICalendar extends ElementBase {
  static get observedAttributes() {
    return [
      'year',
      'month',
      'events',
      'value',
      'variant',
      'headless',
      'selection',
      'min',
      'max',
      'disabled',
      'readonly',
      'week-start',
      'locale',
      'outside-click',
      'events-max',
      'events-display',
      'max-selections',
      'size',
      'hide-today',
      'show-today'
    ];
  }

  private _eventsRawCache: string | null = null;
  private _eventsParsedCache: CalendarEvent[] = [];
  private _eventsByDateCache = new Map<string, CalendarEvent[]>();
  private _valueRawCache: string | null = null;
  private _valueModeCache: SelectionMode | null = null;
  private _valueParsedCache: CalendarSelection = { mode: 'single', value: null };

  private _focusedIso = '';
  private _hoverIso: string | null = null;
  private _pickerOpen = false;
  private _syncingValueAttribute = false;
  private _rangeKeyboardAnchor: string | null = null;
  private _shouldRefocus = false;

  private _docPointerDownBound = (event: PointerEvent) => this._onDocumentPointerDown(event);

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onPointerOver = this._onPointerOver.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onFocusIn = this._onFocusIn.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
    this.root.addEventListener('keydown', this._onKeyDown as EventListener);
    this.root.addEventListener('pointerover', this._onPointerOver as EventListener);
    this.root.addEventListener('mouseleave', this._onMouseLeave as EventListener);
    this.root.addEventListener('focusin', this._onFocusIn as EventListener);
    this._syncDocumentListener();
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    this.root.removeEventListener('keydown', this._onKeyDown as EventListener);
    this.root.removeEventListener('pointerover', this._onPointerOver as EventListener);
    this.root.removeEventListener('mouseleave', this._onMouseLeave as EventListener);
    this.root.removeEventListener('focusin', this._onFocusIn as EventListener);
    if (typeof document !== 'undefined') {
      document.removeEventListener('pointerdown', this._docPointerDownBound, true);
    }
    super.disconnectedCallback();
  }

  override attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'events') {
      this._eventsRawCache = null;
    }

    if (name === 'value' && !this._syncingValueAttribute) {
      this._rangeKeyboardAnchor = null;
      this._valueRawCache = null;
    }

    if (name === 'selection') {
      this._rangeKeyboardAnchor = null;
      this._valueModeCache = null;
    }

    if (name === 'disabled' && this.hasAttribute('disabled')) {
      this._pickerOpen = false;
      this._hoverIso = null;
    }

    if (!this.isConnected) return;
    this._syncDocumentListener();
    this.requestRender();
  }

  focusDate(iso: string): void {
    const parsed = parseISO(iso);
    if (!parsed) return;
    this.goToMonth(parsed.y, parsed.m);
    this._focusedIso = formatISO(parsed);
    this._shouldRefocus = true;
    this.requestRender();
  }

  goToMonth(year: number, month: number): void {
    if (!Number.isFinite(year) || !Number.isFinite(month)) return;

    let y = Math.trunc(year);
    let m = Math.trunc(month);

    while (m < 1) {
      m += 12;
      y -= 1;
    }
    while (m > 12) {
      m -= 12;
      y += 1;
    }

    if (String(y) !== (this.getAttribute('year') || '')) {
      this.setAttribute('year', String(y));
    }
    if (String(m) !== (this.getAttribute('month') || '')) {
      this.setAttribute('month', String(m));
    }
  }

  selectDate(iso: string): void {
    const parsed = parseISO(iso);
    if (!parsed) return;
    const formatted = formatISO(parsed);
    this._shouldRefocus = true;
    this._applySelection(formatted, false, 'api');
  }

  private _syncDocumentListener(): void {
    if (typeof document === 'undefined') return;
    document.removeEventListener('pointerdown', this._docPointerDownBound, true);
    if (this._pickerOpen) {
      document.addEventListener('pointerdown', this._docPointerDownBound, true);
    }
  }

  private _onDocumentPointerDown(event: PointerEvent): void {
    if (!this._pickerOpen) return;
    const path = event.composedPath();
    if (path.includes(this)) return;
    this._pickerOpen = false;
    this.requestRender();
  }

  private _resolveLocale(): string {
    const locale = (this.getAttribute('locale') || '').trim();
    return locale || (typeof navigator !== 'undefined' ? navigator.language : 'en-US');
  }

  private _resolvedView(): { year: number; month: number } {
    const now = new Date();
    const yearRaw = readInt(this.getAttribute('year'), now.getFullYear());
    const monthRaw = readInt(this.getAttribute('month'), now.getMonth() + 1);
    return {
      year: yearRaw,
      month: clamp(monthRaw, 1, 12)
    };
  }

  private _todayIso(): string {
    const now = new Date();
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  }

  private _resolveMinIso(): string | null {
    const parsed = parseISO(this.getAttribute('min') || '');
    return parsed ? formatISO(parsed) : null;
  }

  private _resolveMaxIso(): string | null {
    const parsed = parseISO(this.getAttribute('max') || '');
    return parsed ? formatISO(parsed) : null;
  }

  private _monthHasAllowedDay(year: number, month: number, minIso: string | null, maxIso: string | null): boolean {
    const start = formatISO(startOfMonth(year, month));
    const end = formatISO(endOfMonth(year, month));

    if (minIso && compareISO(end, minIso) < 0) return false;
    if (maxIso && compareISO(start, maxIso) > 0) return false;
    return true;
  }

  private _resolveSelectionMode(): SelectionMode {
    return normalizeSelectionMode(this.getAttribute('selection'));
  }

  private _resolveEventsDisplay(): EventsDisplay {
    return normalizeEventsDisplay(this.getAttribute('events-display'));
  }

  private _resolveOutsideClickMode(): OutsideClickMode {
    return normalizeOutsideClick(this.getAttribute('outside-click'));
  }

  private _resolveCalendarSize(): CalendarSize {
    return normalizeSize(this.getAttribute('size'));
  }

  private _maxSelections(): number {
    return readPositiveInt(this.getAttribute('max-selections'), Number.MAX_SAFE_INTEGER);
  }

  private _eventsMax(): number {
    return clamp(readPositiveInt(this.getAttribute('events-max'), 3), 1, 9);
  }

  private _showTodayButton(): boolean {
    if (this.hasAttribute('hide-today')) return false;
    return readTruthy(this.getAttribute('show-today'), true);
  }

  private _isDisabled(): boolean {
    return this.hasAttribute('disabled');
  }

  private _isReadonly(): boolean {
    return this.hasAttribute('readonly');
  }

  private _isDateOutOfBounds(iso: string, minIso: string | null, maxIso: string | null): boolean {
    if (minIso && compareISO(iso, minIso) < 0) return true;
    if (maxIso && compareISO(iso, maxIso) > 0) return true;
    return false;
  }

  private _isDateBlocked(iso: string, outside: boolean, minIso: string | null, maxIso: string | null): boolean {
    if (this._isDisabled()) return true;
    if (this._isDateOutOfBounds(iso, minIso, maxIso)) return true;
    if (outside && this._resolveOutsideClickMode() === 'none') return true;
    return false;
  }

  private _normalizeValueForMode(mode: SelectionMode): CalendarSelection {
    const raw = this.getAttribute('value') || '';
    if (this._valueRawCache === raw && this._valueModeCache === mode) {
      return cloneSelection(this._valueParsedCache);
    }

    let nextSelection: CalendarSelection;

    if (mode === 'multiple') {
      try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
          nextSelection = { mode, values: [] };
        } else {
          const values = uniqueIsoList(parsed.map((entry) => String(entry || '')));
          nextSelection = { mode, values };
        }
      } catch {
        nextSelection = { mode, values: [] };
      }
      this._valueRawCache = raw;
      this._valueModeCache = mode;
      this._valueParsedCache = cloneSelection(nextSelection);
      return nextSelection;
    }

    if (mode === 'range') {
      try {
        const parsed = JSON.parse(raw);
        const startRaw = parsed && typeof parsed === 'object' ? String((parsed as any).start || '') : '';
        const endRaw = parsed && typeof parsed === 'object' ? String((parsed as any).end || '') : '';
        const startParts = parseISO(startRaw);
        const endParts = parseISO(endRaw);
        const start = startParts ? formatISO(startParts) : null;
        const end = endParts ? formatISO(endParts) : null;
        if (start && end) {
          const normalized = normalizeRange(start, end);
          nextSelection = { mode, start: normalized.start, end: normalized.end };
        } else {
          nextSelection = { mode, start, end: null };
        }
      } catch {
        nextSelection = { mode, start: null, end: null };
      }

      this._valueRawCache = raw;
      this._valueModeCache = mode;
      this._valueParsedCache = cloneSelection(nextSelection);
      return nextSelection;
    }

    const singleParts = parseISO(raw);
    nextSelection = { mode, value: singleParts ? formatISO(singleParts) : null };
    this._valueRawCache = raw;
    this._valueModeCache = mode;
    this._valueParsedCache = cloneSelection(nextSelection);
    return nextSelection;
  }

  private _serializeSelection(selection: CalendarSelection): string | null {
    if (selection.mode === 'single') {
      return selection.value;
    }

    if (selection.mode === 'multiple') {
      return JSON.stringify(selection.values);
    }

    const payload: { start?: string; end?: string } = {};
    if (selection.start) payload.start = selection.start;
    if (selection.end) payload.end = selection.end;
    if (!payload.start && !payload.end) return null;
    return JSON.stringify(payload);
  }

  private _emitSelectionEvents(selection: CalendarSelection, sourceIso: string | null): void {
    if (selection.mode === 'single' && sourceIso) {
      this.dispatchEvent(
        new CustomEvent('select', {
          detail: { value: sourceIso },
          bubbles: true,
          composed: true
        })
      );
    }

    const detail: Record<string, unknown> = { mode: selection.mode };
    if (selection.mode === 'single') {
      detail.value = selection.value;
    } else if (selection.mode === 'range') {
      detail.value = selection.start && selection.end ? { start: selection.start, end: selection.end } : null;
      detail.start = selection.start;
      detail.end = selection.end;
    } else {
      detail.value = [...selection.values];
      detail.values = [...selection.values];
    }

    this.dispatchEvent(
      new CustomEvent('change', {
        detail,
        bubbles: true,
        composed: true
      })
    );
  }

  private _setValueAttribute(serialized: string | null): void {
    this._syncingValueAttribute = true;
    try {
      if (!serialized) {
        if (this.hasAttribute('value')) this.removeAttribute('value');
      } else {
        if (this.getAttribute('value') !== serialized) {
          this.setAttribute('value', serialized);
        }
      }
    } finally {
      this._syncingValueAttribute = false;
    }
  }

  private _applySelection(iso: string, fromKeyboardShift: boolean, source: 'pointer' | 'keyboard' | 'api'): void {
    if (!parseISO(iso)) return;

    const mode = this._resolveSelectionMode();
    const minIso = this._resolveMinIso();
    const maxIso = this._resolveMaxIso();
    if (this._isDateOutOfBounds(iso, minIso, maxIso)) return;

    const wasReadonly = this._isReadonly();
    if (this._isDisabled() || wasReadonly) return;

    let nextSelection: CalendarSelection = this._normalizeValueForMode(mode);

    if (mode === 'single') {
      nextSelection = { mode, value: iso };
    } else if (mode === 'multiple') {
      const current = this._normalizeValueForMode('multiple') as MultipleSelection;
      const set = new Set(current.values);
      if (set.has(iso)) set.delete(iso);
      else if (set.size < this._maxSelections()) set.add(iso);
      nextSelection = { mode, values: uniqueIsoList(Array.from(set)) };
    } else {
      const current = this._normalizeValueForMode('range') as RangeSelection;
      const start = current.start;
      const end = current.end;

      if (fromKeyboardShift) {
        const anchor = this._rangeKeyboardAnchor || start || this._focusedIso || iso;
        if (!parseISO(anchor)) {
          this._rangeKeyboardAnchor = iso;
          nextSelection = { mode, start: iso, end: null };
        } else {
          const normalized = normalizeRange(anchor, iso);
          nextSelection = { mode, start: normalized.start, end: normalized.end };
        }
      } else if (!start || (start && end)) {
        this._rangeKeyboardAnchor = iso;
        nextSelection = { mode, start: iso, end: null };
      } else if (start && !end) {
        const normalized = normalizeRange(start, iso);
        nextSelection = { mode, start: normalized.start, end: normalized.end };
      }
    }

    const prevSerialized = this.getAttribute('value');
    const nextSerialized = this._serializeSelection(nextSelection);

    if (prevSerialized !== nextSerialized) {
      this._setValueAttribute(nextSerialized);
      this._emitSelectionEvents(nextSelection, mode === 'single' ? iso : null);
    } else if (mode === 'single') {
      // Backward compatibility: single mode always emits select on explicit interaction.
      this._emitSelectionEvents(nextSelection, iso);
    }

    this._focusedIso = iso;
    this._hoverIso = null;
    this._shouldRefocus = true;

    if (source !== 'api') {
      this.requestRender();
    }
  }

  private _monthLabel(year: number, month: number, locale: string): string {
    try {
      return new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      }).format(new Date(Date.UTC(year, month - 1, 1)));
    } catch {
      return `${MONTH_NAMES_EN[month - 1] || 'Month'} ${year}`;
    }
  }

  private _weekdayLabels(locale: string, weekStart: number): string[] {
    const labels: string[] = [];
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });

    for (let i = 0; i < 7; i += 1) {
      const weekday = (weekStart + i) % 7;
      const date = new Date(Date.UTC(2024, 0, 7 + weekday));
      labels.push(formatter.format(date));
    }

    return labels;
  }

  private _dayAriaLabel(iso: string, locale: string): string {
    const parts = parseISO(iso);
    if (!parts) return iso;
    try {
      return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      }).format(toUTCDate(parts));
    } catch {
      return iso;
    }
  }

  private _ensureEventsCache(): void {
    const raw = this.getAttribute('events');
    if (raw === this._eventsRawCache) return;

    this._eventsRawCache = raw;
    this._eventsParsedCache = [];
    this._eventsByDateCache = new Map<string, CalendarEvent[]>();

    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return;

      const normalized: CalendarEvent[] = [];
      parsed.forEach((entry) => {
        if (!entry || typeof entry !== 'object') return;
        const dateRaw = String((entry as any).date || '').trim();
        const parsedDate = parseISO(dateRaw);
        const iso = parsedDate ? formatISO(parsedDate) : '';
        if (!iso) return;
        const toneRaw = String((entry as any).tone || 'default') as CalendarEventTone;
        const tone: CalendarEventTone =
          toneRaw === 'success' || toneRaw === 'warning' || toneRaw === 'danger' || toneRaw === 'info'
            ? toneRaw
            : 'default';
        const title = (entry as any).title != null ? String((entry as any).title) : undefined;
        normalized.push({ date: iso, title, tone });
      });

      this._eventsParsedCache = normalized;
      normalized.forEach((event) => {
        if (!this._eventsByDateCache.has(event.date)) {
          this._eventsByDateCache.set(event.date, []);
        }
        this._eventsByDateCache.get(event.date)!.push(event);
      });
    } catch {
      // keep empty cache on invalid JSON
    }
  }

  private _buildCells(
    year: number,
    month: number,
    weekStart: number,
    minIso: string | null,
    maxIso: string | null,
    todayIso: string
  ): CalendarCell[] {
    const firstIso = formatISO(startOfMonth(year, month));
    const firstWeekday = weekdayFromISO(firstIso);
    const offset = (firstWeekday - weekStart + 7) % 7;
    const startParts = parseISO(firstIso);
    if (!startParts) return [];
    const cursor = toUTCDate(startParts);
    cursor.setUTCDate(cursor.getUTCDate() - offset);

    const cells: CalendarCell[] = [];
    for (let i = 0; i < 42; i += 1) {
      if (i > 0) cursor.setUTCDate(cursor.getUTCDate() + 1);
      const parts = fromUTCDate(cursor);
      const iso = formatISO(parts);
      const outside = parts.y !== year || parts.m !== month;
      const disabled = this._isDateBlocked(iso, outside, minIso, maxIso);
      cells.push({
        iso,
        parts,
        outside,
        disabled,
        today: iso === todayIso
      });
    }

    return cells;
  }

  private _resolveFocusIso(cells: CalendarCell[], selection: CalendarSelection, todayIso: string): string {
    const byIso = new Map<string, CalendarCell>();
    cells.forEach((cell) => byIso.set(cell.iso, cell));

    const pick = (iso: string | null | undefined): string | null => {
      if (!iso) return null;
      const cell = byIso.get(iso);
      if (!cell || cell.disabled) return null;
      return iso;
    };

    let next = pick(this._focusedIso);
    if (next) return next;

    if (selection.mode === 'single') next = pick(selection.value);
    if (!next && selection.mode === 'range') next = pick(selection.end || selection.start);
    if (!next && selection.mode === 'multiple') next = pick(selection.values[0]);
    if (!next) next = pick(todayIso);

    if (next) return next;

    const firstEnabled = cells.find((cell) => !cell.disabled);
    if (firstEnabled) return firstEnabled.iso;

    return cells[0]?.iso || '';
  }

  private _focusDateButton(iso: string): void {
    if (!iso) return;
    const active = this.root.activeElement as HTMLElement | null;
    if (active?.getAttribute('data-date') === iso) return;
    const selector = `.day[data-date="${iso}"]`;
    const day = this.root.querySelector(selector) as HTMLButtonElement | null;
    if (!day) return;
    try {
      day.focus({ preventScroll: true });
    } catch {
      day.focus();
    }
  }

  private _moveFocusByDays(currentIso: string, amount: number, extendRange: boolean): void {
    const nextIso = addDaysISO(currentIso, amount);
    const nextParts = parseISO(nextIso);
    if (!nextParts) return;

    this.goToMonth(nextParts.y, nextParts.m);
    this._focusedIso = nextIso;
    this._shouldRefocus = true;

    if (extendRange && this._resolveSelectionMode() === 'range' && !this._isReadonly() && !this._isDisabled()) {
      this._applySelection(nextIso, true, 'keyboard');
    } else {
      this.requestRender();
    }
  }

  private _moveFocusByMonths(currentIso: string, amount: number): void {
    const nextIso = addMonthsISO(currentIso, amount);
    const nextParts = parseISO(nextIso);
    if (!nextParts) return;
    this.goToMonth(nextParts.y, nextParts.m);
    this._focusedIso = nextIso;
    this._shouldRefocus = true;
    this.requestRender();
  }

  private _focusWeekBoundary(currentIso: string, end: 'start' | 'end', weekStart: number): void {
    const currentWeekday = weekdayFromISO(currentIso);
    const offsetFromStart = (currentWeekday - weekStart + 7) % 7;
    const move = end === 'start' ? -offsetFromStart : 6 - offsetFromStart;
    this._moveFocusByDays(currentIso, move, false);
  }

  private _internalFocusable(): HTMLElement[] {
    const focusable = Array.from(
      this.root.querySelectorAll<HTMLElement>(
        'button:not([disabled]):not([aria-disabled="true"]), [tabindex]:not([tabindex="-1"]):not([disabled])'
      )
    );
    return focusable.filter((node) => node.offsetParent !== null || node === this.root.activeElement);
  }

  private _trapTab(event: KeyboardEvent): boolean {
    if (event.key !== 'Tab') return false;
    const focusables = this._internalFocusable();
    if (!focusables.length) return false;

    const active = this.root.activeElement as HTMLElement | null;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey) {
      if (active === first) {
        event.preventDefault();
        last.focus();
        return true;
      }
      return false;
    }

    if (active === last) {
      event.preventDefault();
      first.focus();
      return true;
    }

    return false;
  }

  private _onPointerOver(event: PointerEvent): void {
    if (this._resolveSelectionMode() !== 'range') return;

    const selection = this._normalizeValueForMode('range') as RangeSelection;
    if (!selection.start || selection.end) return;

    const target = event.target as HTMLElement | null;
    const day = target?.closest('.day') as HTMLButtonElement | null;
    if (!day) return;

    const iso = day.getAttribute('data-date') || '';
    if (!parseISO(iso)) return;

    const outside = day.getAttribute('data-outside') === 'true';
    const blocked = this._isDateBlocked(iso, outside, this._resolveMinIso(), this._resolveMaxIso());
    if (blocked) return;

    if (this._hoverIso !== iso) {
      this._hoverIso = iso;
      this.requestRender();
    }
  }

  private _onMouseLeave(): void {
    if (this._hoverIso == null) return;
    this._hoverIso = null;
    this.requestRender();
  }

  private _onFocusIn(event: FocusEvent): void {
    const target = event.target as HTMLElement | null;
    const day = target?.closest('.day') as HTMLButtonElement | null;
    if (!day) return;

    const iso = day.getAttribute('data-date') || '';
    if (parseISO(iso)) {
      this._focusedIso = iso;
      if (this._resolveSelectionMode() === 'range') {
        const selection = this._normalizeValueForMode('range') as RangeSelection;
        if (selection.start && !selection.end) {
          this._hoverIso = iso;
          this.requestRender();
        }
      }
    }
  }

  private _toggleMonthYearPicker(next?: boolean): void {
    if (this._isDisabled()) return;
    this._pickerOpen = typeof next === 'boolean' ? next : !this._pickerOpen;
    this._syncDocumentListener();
    this.requestRender();
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const actionEl = target.closest('[data-action]') as HTMLElement | null;
    const action = actionEl?.getAttribute('data-action') || '';

    const { year, month } = this._resolvedView();
    const todayIso = this._todayIso();
    const todayParts = parseISO(todayIso) as IsoParts;

    if (action === 'prev-month' || action === 'next-month') {
      if (this._isDisabled()) return;
      const delta = action === 'prev-month' ? -1 : 1;
      const focusedParts = this._focusedIso ? parseISO(this._focusedIso) : null;
      const anchor = focusedParts || { y: year, m: month, d: 1 };
      const next = addMonthsParts(anchor, delta);
      this.goToMonth(next.y, next.m);
      this._focusedIso = formatISO({ y: next.y, m: next.m, d: clamp(anchor.d, 1, daysInMonth(next.y, next.m)) });
      this._shouldRefocus = true;
      this.requestRender();
      return;
    }

    if (action === 'today') {
      if (this._isDisabled()) return;
      this.goToMonth(todayParts.y, todayParts.m);
      this._focusedIso = todayIso;
      this._shouldRefocus = true;
      if (!this._isReadonly()) {
        this._applySelection(todayIso, false, 'pointer');
      } else {
        this.requestRender();
      }
      return;
    }

    if (action === 'toggle-monthyear') {
      this._toggleMonthYearPicker();
      return;
    }

    if (action === 'picker-prev-year' || action === 'picker-next-year') {
      if (this._isDisabled()) return;
      const delta = action === 'picker-prev-year' ? -1 : 1;
      this.goToMonth(year + delta, month);
      this._pickerOpen = true;
      this._shouldRefocus = true;
      this.requestRender();
      return;
    }

    if (action === 'pick-month') {
      if (this._isDisabled()) return;
      const monthValue = Number(actionEl?.getAttribute('data-month') || '');
      if (!Number.isInteger(monthValue) || monthValue < 1 || monthValue > 12) return;
      this.goToMonth(year, monthValue);
      this._pickerOpen = false;
      this._shouldRefocus = true;
      this.requestRender();
      return;
    }

    const day = target.closest('.day') as HTMLButtonElement | null;
    if (!day) return;

    const iso = day.getAttribute('data-date') || '';
    if (!parseISO(iso)) return;

    const outside = day.getAttribute('data-outside') === 'true';
    if (this._isDateBlocked(iso, outside, this._resolveMinIso(), this._resolveMaxIso())) return;

    if (outside) {
      const outsideMode = this._resolveOutsideClickMode();
      if (outsideMode === 'none') return;
      if (outsideMode === 'navigate') {
        const parts = parseISO(iso) as IsoParts;
        this.goToMonth(parts.y, parts.m);
      }
    }

    if (this._isReadonly()) {
      this._focusedIso = iso;
      this._shouldRefocus = true;
      this.requestRender();
      return;
    }

    this._applySelection(iso, false, 'pointer');
  }

  private _onKeyDown(event: KeyboardEvent): void {
    if (this._trapTab(event)) return;

    if (event.key === 'Escape' && this._pickerOpen) {
      event.preventDefault();
      this._toggleMonthYearPicker(false);
      return;
    }

    const target = event.target as HTMLElement | null;
    const day = target?.closest('.day') as HTMLButtonElement | null;
    if (!day) return;

    const iso = day.getAttribute('data-date') || '';
    if (!parseISO(iso)) return;

    const weekStart = normalizeWeekStart(this.getAttribute('week-start'), this._resolveLocale());
    const shift = event.shiftKey;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this._moveFocusByDays(iso, 1, shift);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this._moveFocusByDays(iso, -1, shift);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this._moveFocusByDays(iso, 7, shift);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this._moveFocusByDays(iso, -7, shift);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      this._focusWeekBoundary(iso, 'start', weekStart);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      this._focusWeekBoundary(iso, 'end', weekStart);
      return;
    }

    if (event.key === 'PageUp') {
      event.preventDefault();
      this._moveFocusByMonths(iso, event.shiftKey ? -12 : -1);
      return;
    }

    if (event.key === 'PageDown') {
      event.preventDefault();
      this._moveFocusByMonths(iso, event.shiftKey ? 12 : 1);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const outside = day.getAttribute('data-outside') === 'true';
      if (this._isDateBlocked(iso, outside, this._resolveMinIso(), this._resolveMaxIso())) return;
      if (outside && this._resolveOutsideClickMode() === 'navigate') {
        const parts = parseISO(iso) as IsoParts;
        this.goToMonth(parts.y, parts.m);
      }
      if (!this._isReadonly()) {
        this._applySelection(iso, false, 'keyboard');
      }
    }
  }

  protected override render(): void {
    const locale = this._resolveLocale();
    const weekStart = normalizeWeekStart(this.getAttribute('week-start'), locale);
    const { year, month } = this._resolvedView();
    const mode = this._resolveSelectionMode();
    const minIso = this._resolveMinIso();
    const maxIso = this._resolveMaxIso();
    const todayIso = this._todayIso();
    const eventsDisplay = this._resolveEventsDisplay();
    const eventsMax = this._eventsMax();
    const size = this._resolveCalendarSize();

    this._ensureEventsCache();

    const selection = this._normalizeValueForMode(mode);
    const cells = this._buildCells(year, month, weekStart, minIso, maxIso, todayIso);
    this._focusedIso = this._resolveFocusIso(cells, selection, todayIso);
    const monthLabel = this._monthLabel(year, month, locale);

    const prevView = addMonthsParts({ y: year, m: month, d: 1 }, -1);
    const nextView = addMonthsParts({ y: year, m: month, d: 1 }, 1);

    const canPrev = this._monthHasAllowedDay(prevView.y, prevView.m, minIso, maxIso);
    const canNext = this._monthHasAllowedDay(nextView.y, nextView.m, minIso, maxIso);

    const weekdays = this._weekdayLabels(locale, weekStart);

    const rangeSelection = mode === 'range' ? (selection as RangeSelection) : null;
    const rangeStart = rangeSelection?.start || null;
    const rangeEnd = rangeSelection?.end || null;
    const multipleLookup = mode === 'multiple' ? new Set((selection as MultipleSelection).values) : null;
    let previewStart: string | null = null;
    let previewEnd: string | null = null;
    if (mode === 'range' && rangeStart && !rangeEnd && this._hoverIso && parseISO(this._hoverIso)) {
      const normalized = normalizeRange(rangeStart, this._hoverIso);
      previewStart = normalized.start;
      previewEnd = normalized.end;
    }

    const rows: string[] = [];
    for (let rowIndex = 0; rowIndex < 6; rowIndex += 1) {
      const slice = cells.slice(rowIndex * 7, rowIndex * 7 + 7);
      const days = slice
        .map((cell) => {
          const dayEvents = this._eventsByDateCache.get(cell.iso) || [];
          const ariaLabel = this._dayAriaLabel(cell.iso, locale);

          let selected = false;
          if (mode === 'single') {
            selected = (selection as SingleSelection).value === cell.iso;
          } else if (mode === 'multiple') {
            selected = multipleLookup?.has(cell.iso) || false;
          } else if (rangeStart && rangeEnd) {
            selected = isoInRange(cell.iso, rangeStart, rangeEnd);
          }

          const inRange = !!(rangeStart && rangeEnd && isoInRange(cell.iso, rangeStart, rangeEnd));
          const isRangeStart = !!(rangeStart && cell.iso === rangeStart);
          const isRangeEnd = !!(rangeEnd && cell.iso === rangeEnd);
          const inPreviewRange = !!(previewStart && previewEnd && isoInRange(cell.iso, previewStart, previewEnd));

          const focusable = !cell.disabled && cell.iso === this._focusedIso;
          const tabIndex = focusable ? 0 : -1;

          let eventsMarkup = '';
          if (dayEvents.length > 0) {
            if (eventsDisplay === 'count') {
              const firstTone = EVENT_TONES[dayEvents[0].tone || 'default'];
              eventsMarkup = `<span class="event-count" part="event-more" style="--event-tone:${firstTone}">${dayEvents.length}</span>`;
            } else if (eventsDisplay === 'badges') {
              const visible = dayEvents.slice(0, eventsMax);
              eventsMarkup = visible
                .map((event) => {
                  const title = escapeHtml(event.title || 'Event');
                  const tone = EVENT_TONES[event.tone || 'default'];
                  return `<span class="event-badge" part="event-dot" style="--event-tone:${tone}" title="${title}">${title}</span>`;
                })
                .join('');
            } else {
              const visible = dayEvents.slice(0, eventsMax);
              eventsMarkup = visible
                .map((event) => {
                  const tone = EVENT_TONES[event.tone || 'default'];
                  return `<span class="event-dot" part="event-dot" style="--event-tone:${tone}"></span>`;
                })
                .join('');
            }

            if (dayEvents.length > eventsMax && eventsDisplay !== 'count') {
              eventsMarkup += `<span class="event-more" part="event-more">+${dayEvents.length - eventsMax}</span>`;
            }
          }

          const tooltipId = `ui-calendar-tip-${cell.iso}`;
          const tooltipText = dayEvents.length
            ? dayEvents.map((event) => escapeHtml(event.title || 'Event')).join('<br/>')
            : '';
          const hasTooltip = tooltipText.length > 0;

          const ariaSelected = selected || inRange || isRangeStart || isRangeEnd;
          const part = inRange || isRangeStart || isRangeEnd ? 'day range' : 'day';

          return `
            <button
              type="button"
              class="day"
              part="${part}"
              role="gridcell"
              data-date="${cell.iso}"
              data-outside="${cell.outside ? 'true' : 'false'}"
              data-disabled="${cell.disabled ? 'true' : 'false'}"
              data-today="${cell.today ? 'true' : 'false'}"
              data-selected="${ariaSelected ? 'true' : 'false'}"
              data-range="${inRange ? 'true' : 'false'}"
              data-range-start="${isRangeStart ? 'true' : 'false'}"
              data-range-end="${isRangeEnd ? 'true' : 'false'}"
              data-range-preview="${!inRange && inPreviewRange ? 'true' : 'false'}"
              aria-selected="${ariaSelected ? 'true' : 'false'}"
              aria-disabled="${cell.disabled ? 'true' : 'false'}"
              ${cell.today ? 'aria-current="date"' : ''}
              aria-label="${escapeHtml(ariaLabel)}"
              ${hasTooltip ? `aria-describedby="${tooltipId}"` : ''}
              tabindex="${tabIndex}"
            >
              <span class="day-number" part="day-number">${cell.parts.d}</span>
              <span class="events" part="events">${eventsMarkup}</span>
              <span class="tooltip" part="tooltip" id="${tooltipId}" ${hasTooltip ? '' : 'hidden'}>${tooltipText}</span>
            </button>
          `;
        })
        .join('');

      rows.push(`<div class="week" role="row">${days}</div>`);
    }

    const monthButtons = MONTH_NAMES_EN.map((label, idx) => {
      const value = idx + 1;
      const active = value === month;
      return `
        <button
          type="button"
          class="picker-month"
          part="monthyear"
          data-action="pick-month"
          data-month="${value}"
          data-active="${active ? 'true' : 'false'}"
          ${this._isDisabled() ? 'disabled' : ''}
        >
          ${label}
        </button>
      `;
    }).join('');

    const weekHeader = weekdays
      .map((weekday) => `<span class="weekday" part="weekday" role="columnheader">${escapeHtml(weekday)}</span>`)
      .join('');

    const todayButton = this._showTodayButton()
      ? `<button type="button" class="today-btn" part="today" data-action="today" ${this._isDisabled() ? 'disabled' : ''}>Today</button>`
      : '';

    this.setContent(`
      <style>${style}</style>
      <section class="frame" part="frame" data-size="${size}" aria-disabled="${this._isDisabled() ? 'true' : 'false'}">
        <div class="live-region" aria-live="polite" aria-atomic="true">${escapeHtml(monthLabel)}</div>

        <header class="header" part="header">
          <div class="nav" part="nav">
            <button type="button" class="nav-btn" part="prev" data-action="prev-month" ${!canPrev || this._isDisabled() ? 'disabled' : ''} aria-label="Previous month">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M14.7 6.3a1 1 0 0 1 0 1.4L10.41 12l4.29 4.3a1 1 0 1 1-1.42 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.42 0Z" fill="currentColor"/></svg>
            </button>
            <button type="button" class="nav-btn" part="next" data-action="next-month" ${!canNext || this._isDisabled() ? 'disabled' : ''} aria-label="Next month">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M9.3 17.7a1 1 0 0 1 0-1.4L13.59 12 9.3 7.7a1 1 0 0 1 1.4-1.4l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4 0Z" fill="currentColor"/></svg>
            </button>
          </div>

          <div class="title-wrap">
            <button
              type="button"
              class="title-btn"
              part="title monthyear"
              data-action="toggle-monthyear"
              ${this._isDisabled() ? 'disabled' : ''}
              aria-expanded="${this._pickerOpen ? 'true' : 'false'}"
              aria-label="Choose month and year"
            >
              <span>${escapeHtml(monthLabel)}</span>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="M6.7 9.7a1 1 0 0 1 1.4 0L12 13.59l3.9-3.9a1 1 0 1 1 1.4 1.42l-4.6 4.6a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.42Z" fill="currentColor"/></svg>
            </button>
          </div>

          <div class="header-actions">
            ${todayButton}
          </div>
        </header>

        <section class="monthyear-pop" part="monthyear" ${this._pickerOpen ? '' : 'hidden'}>
          <div class="picker-header">
            <button type="button" class="picker-year-btn" part="prev" data-action="picker-prev-year" ${this._isDisabled() ? 'disabled' : ''} aria-label="Previous year">-</button>
            <span class="picker-year">${year}</span>
            <button type="button" class="picker-year-btn" part="next" data-action="picker-next-year" ${this._isDisabled() ? 'disabled' : ''} aria-label="Next year">+</button>
          </div>
          <div class="picker-months">${monthButtons}</div>
        </section>

        <section class="grid-wrap" part="grid" role="grid" aria-label="Calendar grid">
          <div class="weekdays" role="row">${weekHeader}</div>
          ${rows.join('')}
        </section>
      </section>
    `);

    const focusIso = this._focusedIso;
    const shouldRefocus = this._shouldRefocus;
    this._shouldRefocus = false;
    if (shouldRefocus) {
      queueMicrotask(() => {
        if (!this.isConnected) return;
        this._focusDateButton(focusIso);
      });
    }
  }

  protected override shouldRenderOnAttributeChange(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null
  ): boolean {
    return false;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-calendar')) {
  customElements.define('ui-calendar', UICalendar);
}

export { parseISO, compareISO, addDaysISO, addMonthsISO, startOfMonth, endOfMonth };
