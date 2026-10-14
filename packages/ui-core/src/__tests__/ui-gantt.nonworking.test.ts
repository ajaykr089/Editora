import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

// 2026-03-02 is a Monday. The chart starts two days earlier, on Sat Feb 28, and a day is 13px at the week scale.
const TASKS = [{ id: 'a', label: 'Work', start: '2026-03-02', end: '2026-03-27' }];

const mount = async (attrs: Record<string, string> = {}) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(TASKS));
  gantt.setAttribute('zoom', 'week');
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const spans = (root: ParentNode, selector = '.off-day') =>
  [...root.querySelectorAll<HTMLElement>(`.timeline-body ${selector}`)].map((el) => [Math.round(parseFloat(el.style.left) / 13), Math.round(parseFloat(el.style.width) / 13)]);

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt non-working days', () => {
  it('shades nothing by default', async () => {
    const { root } = await mount();

    expect(root.querySelectorAll('.off-day').length).toBe(0);
  });

  it('shades the weekend when the attribute is there with no value, merging Saturday and Sunday into one stretch', async () => {
    const { root } = await mount({ 'non-working-days': '' });

    // day 0 is Sat Feb 28, day 1 Sun Mar 1; then Sat/Sun of Mar 7-8 are days 7-8, and so on a week apart
    expect(spans(root).slice(0, 4)).toEqual([[0, 2], [7, 2], [14, 2], [21, 2]]);
    expect(root.querySelectorAll('.off-day.holiday').length).toBe(0);
  });

  it('takes any weekdays, as a comma list or JSON', async () => {
    expect(spans((await mount({ 'non-working-days': '0' })).root).slice(0, 3)).toEqual([[1, 1], [8, 1], [15, 1]]); // Sundays
    document.body.innerHTML = '';
    expect(spans((await mount({ 'non-working-days': '[1, 2]' })).root).slice(0, 2)).toEqual([[2, 2], [9, 2]]); // Monday and Tuesday
    document.body.innerHTML = '';
    // Friday and Saturday: day 0 is itself a Saturday, then Fri Mar 6 and Sat Mar 7 (days 6 and 7) run together
    expect(spans((await mount({ 'non-working-days': '5, 6' })).root).slice(0, 2)).toEqual([[0, 1], [6, 2]]);
  });

  it('ignores weekdays that are not 0 to 6, and a value that is not a list', async () => {
    expect(spans((await mount({ 'non-working-days': '0, 9, x, -1, 3.5' })).root).slice(0, 2)).toEqual([[1, 1], [8, 1]]);
    document.body.innerHTML = '';
    expect((await mount({ 'non-working-days': '[[' })).root.querySelectorAll('.off-day').length).toBe(0);
  });

  it('shades holidays apart from ordinary non-working days, with or without a label', async () => {
    const { root } = await mount({ holidays: JSON.stringify(['2026-03-04', { date: '2026-03-10', label: 'Founders day' }, 'not a date', 5]) });

    // Wed Mar 4 is day 4, Tue Mar 10 is day 10
    expect(spans(root, '.off-day.holiday')).toEqual([[4, 1], [10, 1]]);
  });

  it('draws a holiday on a weekend as a holiday and keeps the rest of the weekend in its own tint', async () => {
    const { root } = await mount({ 'non-working-days': '', holidays: JSON.stringify(['2026-03-08']) }); // Sunday Mar 8

    // Sat Mar 7 (day 7) is an ordinary weekend day, Sun Mar 8 (day 8) a holiday
    expect(spans(root).filter(([day]) => day >= 7 && day <= 8)).toEqual([[7, 1], [8, 1]]);
    expect(spans(root, '.off-day.holiday')).toEqual([[8, 1]]);
  });

  it('ignores malformed holidays', async () => {
    expect((await mount({ holidays: '{nope' })).root.querySelectorAll('.off-day').length).toBe(0);
    document.body.innerHTML = '';
    expect((await mount({ holidays: '"2026-03-04"' })).root.querySelectorAll('.off-day').length).toBe(0);
  });

  it('leaves the shading out where a day is too narrow to read (month scale and wider)', async () => {
    for (const zoom of ['month', 'quarter', 'year']) {
      document.body.innerHTML = '';
      const { root } = await mount({ 'non-working-days': '', zoom });
      expect(root.querySelectorAll('.off-day').length).toBe(0);
    }
    document.body.innerHTML = '';
    expect((await mount({ 'non-working-days': '', zoom: 'day' })).root.querySelectorAll('.off-day').length).toBeGreaterThan(0);
  });

  it('puts the shading behind the rows and out of the way of the pointer', async () => {
    const { root } = await mount({ 'non-working-days': '' });
    const body = root.querySelector('.timeline-body')!;

    expect(root.querySelector('style')!.textContent).toMatch(/\.off-day \{[^}]*pointer-events: none;/);
    expect(body.querySelector('.off-day')!.compareDocumentPosition(body.querySelector('.timeline-row')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('only builds the shading near the visible part of a long range', async () => {
    const gantt = document.createElement('ui-gantt') as HTMLElement;
    gantt.setAttribute('tasks', JSON.stringify([{ id: 'a', label: 'Start', start: '2026-01-05', end: '2026-01-09' }, { id: 'b', label: 'Ten years on', start: '2035-12-01', end: '2035-12-05' }]));
    gantt.setAttribute('zoom', 'day');
    gantt.setAttribute('non-working-days', '');
    document.body.appendChild(gantt);
    await flush();

    expect(gantt.shadowRoot!.querySelectorAll('.off-day').length).toBeGreaterThan(5);
    expect(gantt.shadowRoot!.querySelectorAll('.off-day').length).toBeLessThan(120); // not the ~1,000 weekends in the range
  });

  it('mutes the day header cells of non-working days at the day scale, and names the holiday', async () => {
    const { root } = await mount({ zoom: 'day', 'non-working-days': '', holidays: JSON.stringify([{ date: '2026-03-04', label: 'Founders day' }]) });
    const off = [...root.querySelectorAll<HTMLElement>('.band.bottom .tick.day.off')].map((el) => el.querySelector('.num')!.textContent);

    expect(off.slice(0, 5)).toEqual(['28', '1', '4', '7', '8']); // Sat, Sun, the holiday, then the next weekend
    expect(root.querySelector<HTMLElement>('.band.bottom .tick.day.off[title="Founders day"]')).not.toBeNull();
  });

  it('re-renders when the attributes change', async () => {
    const { gantt, root } = await mount();
    expect(root.querySelectorAll('.off-day').length).toBe(0);

    gantt.setAttribute('non-working-days', '');
    await flush();
    expect(root.querySelectorAll('.off-day').length).toBeGreaterThan(0);

    gantt.removeAttribute('non-working-days');
    gantt.setAttribute('holidays', JSON.stringify(['2026-03-04']));
    await flush();
    expect(spans(root)).toEqual([[4, 1]]);
  });
});
