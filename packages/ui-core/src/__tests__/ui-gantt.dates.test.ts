import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = () => new Promise((resolve) => setTimeout(resolve, 30));

const medium = (year: number, month: number, day: number) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(year, month - 1, day));

const mount = async (tasks: unknown[], attrs: Record<string, string> = {}) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};

const name = (root: ParentNode, id = 'a') => root.querySelector(`.bar[data-task-id="${id}"]`)!.getAttribute('aria-label');
const originalTz = process.env.TZ;

afterEach(() => {
  document.body.innerHTML = '';
  if (originalTz === undefined) delete process.env.TZ;
  else process.env.TZ = originalTz;
});

describe('ui-gantt task dates are calendar days', () => {
  const expected = `Work, ${medium(2026, 3, 2)} to ${medium(2026, 3, 6)}`;

  // A datetime used to go through Date.parse and become the viewer's local day: 23:30Z is already the 3rd east of
  // Greenwich, and 00:30+05:00 is still the 1st west of it. Whatever the machine's zone, one of these moved.
  for (const zone of ['UTC', 'Asia/Kolkata', 'Pacific/Auckland', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
    it(`ignores the time and the offset, in ${zone}`, async () => {
      process.env.TZ = zone;
      const late = await mount([{ id: 'a', label: 'Work', start: '2026-03-02T23:30:00Z', end: '2026-03-06T23:59:59.999Z' }]);
      expect(name(late.root)).toBe(expected);

      document.body.innerHTML = '';
      const early = await mount([{ id: 'a', label: 'Work', start: '2026-03-02T00:30:00+05:00', end: '2026-03-06T00:00:00-08:00' }]);
      expect(name(early.root)).toBe(expected);
    });
  }

  it('reads a space before the time like a T', async () => {
    const { root } = await mount([{ id: 'a', label: 'Work', start: '2026-03-02 23:30', end: '2026-03-06 01:00:00' }]);

    expect(name(root)).toBe(expected);
  });

  it('puts a datetime task in the same place as the same day written without a time', async () => {
    const plain = await mount([{ id: 'a', label: 'Work', start: '2026-03-02', end: '2026-03-06', baselineStart: '2026-03-01', baselineEnd: '2026-03-05' }]);
    const plainBar = plain.root.querySelector<HTMLElement>('.bar')!.getAttribute('style');
    const plainBaseline = plain.root.querySelector<HTMLElement>('.baseline')!.getAttribute('style');

    document.body.innerHTML = '';
    const timed = await mount([{ id: 'a', label: 'Work', start: '2026-03-02T23:30:00Z', end: '2026-03-06T23:30:00Z', baselineStart: '2026-03-01T23:30:00Z', baselineEnd: '2026-03-05T23:30:00Z' }]);

    expect(timed.root.querySelector<HTMLElement>('.bar')!.getAttribute('style')).toBe(plainBar);
    expect(timed.root.querySelector<HTMLElement>('.baseline')!.getAttribute('style')).toBe(plainBaseline);
  });

  it('reads the days of the parts of a split task the same way', async () => {
    const plain = await mount([{ id: 'a', label: 'Work', start: '2026-03-02', end: '2026-03-12', segments: [{ start: '2026-03-02', end: '2026-03-04' }, { start: '2026-03-06', end: '2026-03-12' }] }]);
    const plainParts = [...plain.root.querySelectorAll('.split-segment')].map((el) => el.getAttribute('style'));

    document.body.innerHTML = '';
    const timed = await mount([{ id: 'a', label: 'Work', start: '2026-03-02T23:30:00Z', end: '2026-03-12T23:30:00Z', segments: [{ start: '2026-03-02T23:30:00Z', end: '2026-03-04T23:30:00Z' }, { start: '2026-03-06T23:30:00Z', end: '2026-03-12T23:30:00Z' }] }]);

    expect([...timed.root.querySelectorAll('.split-segment')].map((el) => el.getAttribute('style'))).toEqual(plainParts);
  });

  it('reports a change as a plain date, whatever the task was given', async () => {
    const { gantt, root } = await mount([{ id: 'a', label: 'Work', start: '2026-03-02T23:30:00Z', end: '2026-03-06T23:30:00Z' }]);
    const changes: unknown[] = [];
    gantt.addEventListener('taskchange', (event) => changes.push((event as CustomEvent).detail));

    const bar = root.querySelector<HTMLElement>('.bar')!;
    bar.focus();
    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();

    expect(changes).toEqual([{ id: 'a', start: '2026-03-03', end: '2026-03-07' }]);
  });

  it('still reads other date strings the way it did (as local days)', async () => {
    const { root } = await mount([{ id: 'a', label: 'Work', start: 'March 2, 2026', end: '2026/03/06' }]);

    expect(name(root)).toBe(expected);
  });

  it('still drops a task whose start is not a date', async () => {
    const { root } = await mount([{ id: 'a', label: 'Work', start: 'someday', end: '2026-03-06' }]);

    expect(root.querySelector('.bar')).toBeNull();
  });
});
