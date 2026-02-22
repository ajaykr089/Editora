import { ElementBase } from '../ElementBase';

type CalendarEvent = {
  date: string;
  title?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

const style = `
  :host {
    --ui-calendar-bg: color-mix(in srgb, var(--ui-color-surface, #ffffff) 95%, transparent);
    --ui-calendar-border: color-mix(in srgb, var(--ui-color-border, #cbd5e1) 74%, transparent);
    --ui-calendar-text: var(--ui-color-text, #0f172a);
    --ui-calendar-muted: var(--ui-color-muted, #64748b);
    --ui-calendar-accent: var(--ui-color-primary, #2563eb);

    display: block;
    min-inline-size: 0;
    color-scheme: light dark;
    font-family: "Inter", "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }

  .frame {
    border: 1px solid var(--ui-calendar-border);
    border-radius: 14px;
    background: var(--ui-calendar-bg);
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
    padding: 12px;
    display: grid;
    gap: 10px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .title {
    font-size: 13px;
    font-weight: 700;
    color: var(--ui-calendar-text);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
  }

  .weekday {
    font-size: 11px;
    color: var(--ui-calendar-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 2px;
  }

  .day {
    border: 1px solid color-mix(in srgb, var(--ui-calendar-border) 76%, transparent);
    border-radius: 10px;
    min-block-size: 52px;
    padding: 6px;
    background: color-mix(in srgb, var(--ui-calendar-bg) 98%, transparent);
    color: var(--ui-calendar-text);
    text-align: left;
    display: grid;
    align-content: start;
    gap: 4px;
    cursor: pointer;
    transition: border-color 120ms ease, background-color 120ms ease;
  }

  .day:hover {
    border-color: color-mix(in srgb, var(--ui-calendar-accent) 32%, var(--ui-calendar-border));
    background: color-mix(in srgb, var(--ui-calendar-accent) 8%, transparent);
  }

  .day:focus-visible {
    outline: 2px solid var(--ui-calendar-accent);
    outline-offset: 1px;
  }

  .day[aria-selected="true"] {
    border-color: color-mix(in srgb, var(--ui-calendar-accent) 44%, transparent);
    background: color-mix(in srgb, var(--ui-calendar-accent) 12%, transparent);
  }

  .day[data-outside="true"] {
    opacity: 0.45;
  }

  .day-number {
    font-size: 12px;
    font-weight: 600;
  }

  .event-dot {
    inline-size: 7px;
    block-size: 7px;
    border-radius: 999px;
    background: var(--dot, var(--ui-calendar-accent));
  }

  .events {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-block-size: 9px;
  }

  :host([variant="contrast"]) {
    --ui-calendar-bg: #0f172a;
    --ui-calendar-border: #334155;
    --ui-calendar-text: #e2e8f0;
    --ui-calendar-muted: #93a4bd;
    --ui-calendar-accent: #93c5fd;
  }

  :host([headless]) .frame {
    display: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .day {
      transition: none !important;
    }
  }

  @media (prefers-contrast: more) {
    .frame {
      box-shadow: none;
    }

    .day {
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
    }

    .frame,
    .day,
    .event-dot {
      forced-color-adjust: none;
      box-shadow: none;
    }

    .frame,
    .day {
      background: Canvas;
      color: CanvasText;
      border-color: CanvasText;
    }

    .day[aria-selected="true"] {
      border-color: Highlight;
    }

    .event-dot {
      background: Highlight;
    }
  }
`;

const tones: Record<string, string> = {
  default: 'var(--ui-color-primary, #2563eb)',
  info: 'var(--ui-color-info, #0891b2)',
  success: 'var(--ui-color-success, #16a34a)',
  warning: 'var(--ui-color-warning, #d97706)',
  danger: 'var(--ui-color-danger, #dc2626)'
};

function toIsoDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseEvents(raw: string | null): CalendarEvent[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((entry) => {
        if (!entry || typeof entry !== 'object') return null;
        const date = String((entry as any).date || '').trim();
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
        return {
          date,
          title: (entry as any).title ? String((entry as any).title) : undefined,
          tone: (entry as any).tone
        } as CalendarEvent;
      })
      .filter(Boolean) as CalendarEvent[];
  } catch {
    return [];
  }
}

export class UICalendar extends ElementBase {
  static get observedAttributes() {
    return ['year', 'month', 'events', 'value', 'variant', 'headless'];
  }

  constructor() {
    super();
    this._onClick = this._onClick.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root.addEventListener('click', this._onClick as EventListener);
  }

  override disconnectedCallback(): void {
    this.root.removeEventListener('click', this._onClick as EventListener);
    super.disconnectedCallback();
  }

  private _resolvedDate(): { year: number; month: number } {
    const now = new Date();
    const yearRaw = Number(this.getAttribute('year') || now.getFullYear());
    const monthRaw = Number(this.getAttribute('month') || now.getMonth() + 1);
    const year = Number.isInteger(yearRaw) ? yearRaw : now.getFullYear();
    const month = Number.isInteger(monthRaw) ? Math.max(1, Math.min(12, monthRaw)) : now.getMonth() + 1;
    return { year, month };
  }

  private _cells(year: number, month: number): Array<{ iso: string; day: number; outside: boolean }> {
    const first = new Date(year, month - 1, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();
    const cells: Array<{ iso: string; day: number; outside: boolean }> = [];

    for (let i = 0; i < 42; i += 1) {
      const dayOffset = i - startWeekday + 1;
      if (dayOffset <= 0) {
        const day = prevMonthDays + dayOffset;
        const monthDate = month === 1 ? { y: year - 1, m: 12 } : { y: year, m: month - 1 };
        cells.push({ iso: toIsoDate(monthDate.y, monthDate.m, day), day, outside: true });
      } else if (dayOffset > daysInMonth) {
        const day = dayOffset - daysInMonth;
        const monthDate = month === 12 ? { y: year + 1, m: 1 } : { y: year, m: month + 1 };
        cells.push({ iso: toIsoDate(monthDate.y, monthDate.m, day), day, outside: true });
      } else {
        cells.push({ iso: toIsoDate(year, month, dayOffset), day: dayOffset, outside: false });
      }
    }

    return cells;
  }

  private _onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    const day = target?.closest('.day') as HTMLButtonElement | null;
    if (!day) return;
    const value = day.getAttribute('data-date');
    if (!value) return;

    this.setAttribute('value', value);
    this.dispatchEvent(new CustomEvent('select', { detail: { value }, bubbles: true, composed: true }));
  }

  protected override render(): void {
    const { year, month } = this._resolvedDate();
    const selected = this.getAttribute('value') || '';
    const events = parseEvents(this.getAttribute('events'));
    const byDate = new Map<string, CalendarEvent[]>();
    events.forEach((entry) => {
      if (!byDate.has(entry.date)) byDate.set(entry.date, []);
      byDate.get(entry.date)!.push(entry);
    });

    const monthLabel = new Date(year, month - 1, 1).toLocaleString(undefined, { month: 'long', year: 'numeric' });
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const cells = this._cells(year, month)
      .map((cell) => {
        const dayEvents = byDate.get(cell.iso) || [];
        const dots = dayEvents
          .slice(0, 3)
          .map((entry) => `<span class="event-dot" style="--dot:${tones[entry.tone || 'default'] || tones.default}" title="${entry.title || ''}"></span>`)
          .join('');

        return `
          <button
            type="button"
            class="day"
            part="day"
            data-date="${cell.iso}"
            data-outside="${cell.outside ? 'true' : 'false'}"
            aria-selected="${selected === cell.iso ? 'true' : 'false'}"
          >
            <span class="day-number">${cell.day}</span>
            <span class="events">${dots}</span>
          </button>
        `;
      })
      .join('');

    this.setContent(`
      <style>${style}</style>
      <section class="frame" part="frame">
        <header class="header" part="header">
          <span class="title">${monthLabel}</span>
        </header>
        <div class="grid" part="grid">
          ${weekdays.map((name) => `<span class="weekday">${name}</span>`).join('')}
          ${cells}
        </div>
      </section>
    `);
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('ui-calendar')) {
  customElements.define('ui-calendar', UICalendar);
}
