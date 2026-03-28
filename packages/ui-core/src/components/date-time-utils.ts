import { addDaysISO, compareISO, endOfMonth, parseISO, startOfMonth } from './ui-calendar';
import { acquireBodyScrollLock } from '../scroll-lock';

export type DateDisplayFormat = 'iso' | 'locale' | 'custom';
export type OverlayPlacement = 'top' | 'bottom';
export type OverlayPosition = { top: number; left: number; placement: OverlayPlacement };
export type TimeParts = { hours: number; minutes: number; seconds: number };
export type DateTimeParts = { date: string; time: string };

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function parseNumber(raw: string): number | null {
  if (!/^-?\d+$/.test(raw)) return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  return Math.trunc(value);
}

function normalizeSeparator(raw: string): string {
  return raw.replace(/[.\-]/g, '/').replace(/\s+/g, ' ').trim();
}

function monthNamesShort(locale: string): string[] {
  const result: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    result.push(
      new Intl.DateTimeFormat(locale, {
        month: 'short',
        timeZone: 'UTC'
      }).format(new Date(Date.UTC(2024, i, 1)))
    );
  }
  return result;
}

function monthNamesLong(locale: string): string[] {
  const result: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    result.push(
      new Intl.DateTimeFormat(locale, {
        month: 'long',
        timeZone: 'UTC'
      }).format(new Date(Date.UTC(2024, i, 1)))
    );
  }
  return result;
}

export function isTruthyAttr(raw: string | null, fallback = false): boolean {
  if (raw == null) return fallback;
  const normalized = raw.trim().toLowerCase();
  if (!normalized) return true;
  return normalized !== 'false' && normalized !== '0' && normalized !== 'off' && normalized !== 'no';
}

export function normalizeLocale(raw: string | null): string {
  const value = (raw || '').trim();
  if (value) return value;
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'en-US';
}

export function normalizeDateIso(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const parsed = parseISO(raw);
  if (!parsed) return null;
  return `${parsed.y}-${pad2(parsed.m)}-${pad2(parsed.d)}`;
}

export function splitDateTime(value: string | null | undefined): DateTimeParts | null {
  if (!value) return null;
  const match = /^(\d{4}-\d{2}-\d{2})[T ](\d{1,2}:\d{2}(?::\d{2})?)$/.exec(value.trim());
  if (!match) return null;
  const dateIso = normalizeDateIso(match[1]);
  if (!dateIso) return null;
  const time = parseTimeInput(match[2], true);
  if (!time) return null;
  const hasSeconds = match[2].split(':').length === 3;
  return { date: dateIso, time: formatTime(time, hasSeconds) };
}

export function combineDateTime(dateIso: string | null, time: string | null): string | null {
  if (!dateIso || !time) return null;
  const normalizedDate = normalizeDateIso(dateIso);
  const parsedTime = parseTimeInput(time, true);
  if (!normalizedDate || !parsedTime) return null;
  return `${normalizedDate}T${formatTime(parsedTime, time.split(':').length >= 3)}`;
}

export function parseConstraintDate(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const dateIso = normalizeDateIso(raw);
  if (dateIso) return dateIso;
  const split = splitDateTime(raw);
  return split?.date || null;
}

export function parseConstraintDateTime(raw: string | null | undefined): DateTimeParts | null {
  if (!raw) return null;
  const split = splitDateTime(raw);
  if (split) return split;
  const dateIso = normalizeDateIso(raw);
  if (!dateIso) return null;
  return { date: dateIso, time: '00:00' };
}

export function formatDateISOToLocale(
  iso: string,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const parsed = parseISO(iso);
  if (!parsed) return iso;
  const key = `${locale}::${JSON.stringify(options || {})}`;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      timeZone: 'UTC',
      ...(options || {})
    });
    formatterCache.set(key, formatter);
  }
  return formatter.format(new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d)));
}

export function formatDateForDisplay(
  iso: string | null,
  locale: string,
  format: DateDisplayFormat,
  displayFormat: string | null
): string {
  if (!iso) return '';
  if (format === 'iso') return iso;
  if (format === 'custom' && displayFormat) {
    const parsed = parseISO(iso);
    if (!parsed) return iso;
    const shortMonths = monthNamesShort(locale);
    const longMonths = monthNamesLong(locale);
    return displayFormat
      .replace(/YYYY/g, String(parsed.y))
      .replace(/MMM/g, shortMonths[parsed.m - 1] || '')
      .replace(/MMMM/g, longMonths[parsed.m - 1] || '')
      .replace(/MM/g, pad2(parsed.m))
      .replace(/DD/g, pad2(parsed.d));
  }
  return formatDateISOToLocale(iso, locale);
}

export function parseUserDateInput(raw: string, locale: string): string | null {
  const direct = normalizeDateIso(raw.trim());
  if (direct) return direct;

  const normalized = normalizeSeparator(raw);
  if (!normalized) return null;

  const iso = normalizeDateIso(normalized);
  if (iso) return iso;

  const parts = normalized.split('/').map((part) => part.trim()).filter(Boolean);
  if (parts.length !== 3) return null;
  const first = parseNumber(parts[0]);
  const second = parseNumber(parts[1]);
  const third = parseNumber(parts[2]);
  if (first == null || second == null || third == null) return null;

  let year = third;
  if (year < 100) year += year >= 70 ? 1900 : 2000;

  const isUS = locale.toLowerCase().startsWith('en-us');
  const month = isUS ? first : second;
  const day = isUS ? second : first;
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) return null;

  const isoCandidate = `${year}-${pad2(month)}-${pad2(day)}`;
  return normalizeDateIso(isoCandidate);
}

export function parseTimeInput(raw: string, allowSeconds: boolean): TimeParts | null {
  const value = raw.trim().toLowerCase();
  if (!value) return null;
  const match = /^(\d{1,2})(?::|\.|h)?(\d{1,2})?(?::|\.|m)?(\d{1,2})?\s*(am|pm)?$/.exec(value);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] ?? '0');
  const seconds = Number(match[3] ?? '0');
  if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) return null;
  if (minutes < 0 || minutes > 59) return null;
  if (seconds < 0 || seconds > 59) return null;
  if (!allowSeconds && seconds !== 0) return null;

  const meridiem = match[4];
  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    if (meridiem === 'pm' && hours < 12) hours += 12;
    if (meridiem === 'am' && hours === 12) hours = 0;
  }

  if (hours < 0 || hours > 23) return null;

  return { hours, minutes, seconds };
}

export function formatTime(time: TimeParts | null, withSeconds = false): string {
  if (!time) return '';
  const hh = pad2(clamp(time.hours, 0, 23));
  const mm = pad2(clamp(time.minutes, 0, 59));
  if (!withSeconds) return `${hh}:${mm}`;
  const ss = pad2(clamp(time.seconds, 0, 59));
  return `${hh}:${mm}:${ss}`;
}

export function to12hDisplay(time24: string, locale: string): string {
  const parsed = parseTimeInput(time24, true);
  if (!parsed) return time24;
  const today = new Date();
  today.setHours(parsed.hours, parsed.minutes, parsed.seconds, 0);
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    second: time24.split(':').length > 2 ? '2-digit' : undefined,
    hour12: true
  }).format(today);
}

export function compareTimes(a: string, b: string): number {
  const pa = parseTimeInput(a, true);
  const pb = parseTimeInput(b, true);
  if (!pa || !pb) return a.localeCompare(b);
  const av = pa.hours * 3600 + pa.minutes * 60 + pa.seconds;
  const bv = pb.hours * 3600 + pb.minutes * 60 + pb.seconds;
  return av - bv;
}

export function clampTime(time: string, min: string | null, max: string | null): string {
  const parsed = parseTimeInput(time, true);
  if (!parsed) return time;
  let value = formatTime(parsed, time.split(':').length >= 3);
  if (min && compareTimes(value, min) < 0) value = min;
  if (max && compareTimes(value, max) > 0) value = max;
  return value;
}

export function clampDateIso(value: string, minIso: string | null, maxIso: string | null): string {
  let next = value;
  if (minIso && compareISO(next, minIso) < 0) next = minIso;
  if (maxIso && compareISO(next, maxIso) > 0) next = maxIso;
  return next;
}

export function compareDateTimes(a: string, b: string): number {
  const ap = splitDateTime(a);
  const bp = splitDateTime(b);
  if (!ap || !bp) return a.localeCompare(b);
  const dateDiff = compareISO(ap.date, bp.date);
  if (dateDiff !== 0) return dateDiff;
  return compareTimes(ap.time, bp.time);
}

export function computeMonthRange(todayIso: string): { start: string; end: string } {
  const parsed = parseISO(todayIso);
  if (!parsed) return { start: todayIso, end: todayIso };
  const start = startOfMonth(parsed.y, parsed.m);
  const end = endOfMonth(parsed.y, parsed.m);
  return {
    start: `${start.y}-${pad2(start.m)}-${pad2(start.d)}`,
    end: `${end.y}-${pad2(end.m)}-${pad2(end.d)}`
  };
}

export function computeLastDaysRange(todayIso: string, days: number): { start: string; end: string } {
  const safeDays = clamp(days, 1, 366);
  return {
    start: addDaysISO(todayIso, -(safeDays - 1)),
    end: todayIso
  };
}

export function computePopoverPosition(anchorRect: DOMRect, panelRect: DOMRect, padding = 8, gap = 8): OverlayPosition {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const scrollY = typeof window !== 'undefined' ? window.scrollY || 0 : 0;
  const scrollX = typeof window !== 'undefined' ? window.scrollX || 0 : 0;

  const hasBottomSpace = anchorRect.bottom + gap + panelRect.height <= viewportHeight - padding;
  const placement: OverlayPlacement = hasBottomSpace ? 'bottom' : 'top';
  const top = placement === 'bottom'
    ? anchorRect.bottom + gap + scrollY
    : anchorRect.top - panelRect.height - gap + scrollY;

  const unclampedLeft = anchorRect.left + scrollX;
  const maxLeft = scrollX + viewportWidth - panelRect.width - padding;
  const left = clamp(unclampedLeft, scrollX + padding, Math.max(scrollX + padding, maxLeft));

  return { top, left, placement };
}

export function rafThrottle(fn: () => void): { run: () => void; cancel: () => void } {
  let raf = 0;
  const run = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      fn();
    });
  };
  const cancel = () => {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
  };
  return { run, cancel };
}

export function shouldUseMobileSheet(mode: string | null): boolean {
  if ((mode || 'popover') === 'inline') return false;
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(max-width: 639px)').matches;
}

export function lockBodyScroll(): () => void {
  return acquireBodyScrollLock();
}
