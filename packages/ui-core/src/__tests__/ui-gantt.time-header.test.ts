import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = () => new Promise((resolve) => setTimeout(resolve, 30));

// Local dates, like the component: 2026-03-02 is a Monday. The chart starts two days earlier, on Sat Feb 28.
const TASKS = [
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-13' },
  { id: 'b', label: 'Build', start: '2026-03-16', end: '2026-03-27' },
];

const mount = async (attrs: Record<string, string>, tasks: unknown[] = TASKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return gantt.shadowRoot as ShadowRoot;
};

const texts = (root: ParentNode, selector: string) =>
  [...root.querySelectorAll(selector)].map((el) => el.textContent!.trim()).filter(Boolean);
const lefts = (root: ParentNode, selector: string) =>
  [...root.querySelectorAll<HTMLElement>(selector)].map((el) => parseFloat(el.style.left));

const monthYear = (year: number, month: number) =>
  new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date(year, month, 1));
const monthShort = (month: number) => new Intl.DateTimeFormat(undefined, { month: 'short' }).format(new Date(2026, month, 1));

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt time header', () => {
  it('names the month above the weeks, and labels each week with its first day', async () => {
    const root = await mount({ zoom: 'week', 'week-start': '1' });

    // The scale ends about 52 days in (680px at 13px a day), so a last week with only a day or two left has no label.
    expect(texts(root, '.band.bottom .tick .num')).toEqual(['2', '9', '16', '23', '30', '6', '13']);
    expect(texts(root, '.band.top .band-cell')).toEqual([monthYear(2026, 2), monthYear(2026, 3)]);
  });

  it('starts the weeks on the day given by week-start', async () => {
    const root = await mount({ zoom: 'week', 'week-start': '0' });

    expect(texts(root, '.band.bottom .tick .num')).toEqual(['1', '8', '15', '22', '29', '5', '12']);
  });

  it('shows every day with a weekday letter, and the month over its days', async () => {
    const root = await mount({ zoom: 'day' });
    const days = texts(root, '.band.bottom .tick.day .num');

    expect(days.slice(0, 4)).toEqual(['28', '1', '2', '3']);
    expect(root.querySelectorAll('.band.bottom .tick.day .dow').length).toBe(days.length);
    const top = texts(root, '.band.top .band-cell');
    expect(top[0]).toBe(monthShort(1)); // two days of February are too narrow for the long name
    expect(top[1]).toBe(monthYear(2026, 2));
    // the cells are 36px per day, side by side
    const edges = lefts(root, '.band.bottom .tick.day');
    expect(edges[1] - edges[0]).toBeCloseTo(36, 1);
  });

  it('puts the month scale on real month starts, not every 30 days', async () => {
    const root = await mount({ zoom: 'month' });

    expect(texts(root, '.band.bottom .tick').slice(0, 3)).toEqual([monthShort(2), monthShort(3), monthShort(4)]);
    expect(texts(root, '.band.top .band-cell')).toEqual(['2026']);
    const [feb, mar, apr, may] = lefts(root, '.band.bottom .tick');
    expect(feb).toBe(0);
    expect(apr - mar).toBeCloseTo(31 * 4.4, 1); // March has 31 days
    expect(may - apr).toBeCloseTo(30 * 4.4, 1); // April has 30
  });

  it('labels quarters and puts the year over them', async () => {
    const root = await mount({ zoom: 'quarter' });

    expect(texts(root, '.band.bottom .tick').slice(0, 4)).toEqual(['Q1', 'Q2', 'Q3', 'Q4']);
    // 2027 only gets three days at the end of the scale: too narrow for a label.
    expect(texts(root, '.band.top .band-cell')).toEqual(['2026']);
  });

  it('uses a single row of years at the year scale', async () => {
    const root = await mount({ zoom: 'year' });

    expect(root.querySelector('.band.top')).toBeNull();
    expect(texts(root, '.band.bottom .tick')).toEqual(['2026', '2027']);
  });

  it('highlights today in the day scale', async () => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, '0');
    const iso = (offset: number) => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    };
    const root = await mount({ zoom: 'day' }, [{ id: 'a', label: 'Now', start: iso(-3), end: iso(5) }]);

    const marked = [...root.querySelectorAll('.tick.today-cell .num')].map((el) => el.textContent);
    expect(marked).toEqual([String(now.getDate())]);
  });

  it('only builds the header cells near the visible part of a long range', async () => {
    const root = await mount({ zoom: 'day' }, [
      { id: 'a', label: 'Start', start: '2026-01-05', end: '2026-01-09' },
      { id: 'b', label: 'Ten years on', start: '2035-12-01', end: '2035-12-05' },
    ]);

    const cells = root.querySelectorAll('.band.bottom .tick').length;
    expect(cells).toBeGreaterThan(20);
    expect(cells).toBeLessThan(200); // not the ~3,600 days in the range
  });

  it('keeps the header out of the accessibility tree', async () => {
    const root = await mount({ zoom: 'week' });

    expect(root.querySelector('.timeline-head')!.getAttribute('aria-hidden')).toBe('true');
  });
});
