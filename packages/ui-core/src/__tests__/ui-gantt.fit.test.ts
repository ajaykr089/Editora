import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = () => new Promise((resolve) => setTimeout(resolve, 30));

// 2026-03-02 .. 03-27, so the chart runs Feb 28 .. Mar 30: 30 days.
const TASKS = [
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-13' },
  { id: 'b', label: 'Build', start: '2026-03-16', end: '2026-03-27' },
];

const mount = async (hostWidth: number, tasks: unknown[] = TASKS, attrs: Record<string, string> = {}) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  if (hostWidth) Object.defineProperty(gantt, 'clientWidth', { get: () => hostWidth, configurable: true });
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  gantt.setAttribute('zoom', 'fit');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};

const barWidth = (root: ParentNode, id: string) =>
  parseFloat(root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!.style.width);
const trackMin = (root: ParentNode) => parseFloat(root.querySelector<HTMLElement>('.timeline-body')!.style.minWidth);
const unitOf = (root: ParentNode) => root.querySelector('.scale')!.getAttribute('data-zoom');

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt fit zoom', () => {
  it('scales the whole project to the width left beside the task grid', async () => {
    const { root } = await mount(1200);
    // 1200px host - 2px frame border - 376px task grid = 822px for 30 days
    const perDay = 822 / 30;

    expect(trackMin(root)).toBeCloseTo(822, 0);
    expect(barWidth(root, 'a')).toBeCloseTo(11 * perDay, 0); // Mar 2 -> Mar 13
    expect(barWidth(root, 'b')).toBeCloseTo(11 * perDay, 0);
  });

  it('uses the narrower task grid when the host is narrow', async () => {
    const { root } = await mount(500);
    // 498px frame is compact: 498 - 148 = 350px for 30 days
    expect(trackMin(root)).toBeCloseTo(350, 0);
  });

  it('picks the header unit from the scale it ends up with', async () => {
    // 27.4px a day: days
    expect(unitOf((await mount(1200)).root)).toBe('day');

    // 10.7px a day (322px for 30 days): weeks
    document.body.innerHTML = '';
    expect(unitOf((await mount(700)).root)).toBe('week');

    // two years in 822px is 1.1px a day: quarters
    document.body.innerHTML = '';
    const long = [{ id: 'a', label: 'Programme', start: '2026-01-05', end: '2027-12-31' }];
    expect(unitOf((await mount(1200, long)).root)).toBe('quarter');

    // twenty years: years
    document.body.innerHTML = '';
    const huge = [{ id: 'a', label: 'Century', start: '2026-01-05', end: '2046-12-31' }];
    expect(unitOf((await mount(1200, huge)).root)).toBe('year');
  });

  it('does not stretch a short project into huge days', async () => {
    const short = [{ id: 'a', label: 'Spike', start: '2026-03-02', end: '2026-03-05' }];
    const { root } = await mount(1200, short);

    // 8 days in 822px would be 103px a day; it stops at 48
    expect(barWidth(root, 'a')).toBeCloseTo(3 * 48, 0);
    expect(trackMin(root)).toBeCloseTo(8 * 48, 0);
  });

  it('never goes below a readable scale for a very long project', async () => {
    const long = [{ id: 'a', label: 'Epoch', start: '2000-01-03', end: '2090-12-31' }];
    const { root } = await mount(1200, long);

    // 33,000 days would be 0.02px a day; it stops at 0.2px, so the chart scrolls
    expect(trackMin(root)).toBeGreaterThan(822);
  });

  it('falls back to a default width before the chart has been laid out', async () => {
    const { root } = await mount(0);

    expect(trackMin(root)).toBeCloseTo(680, 0);
  });

  it('has a fit button in the toolbar, pressed when it is on, that switches to it', async () => {
    const { gantt, root } = await mount(1200);
    expect(root.querySelector('.zoom-button[data-zoom="fit"]')!.getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('.zoom-button[data-zoom="week"]')!.getAttribute('aria-pressed')).toBe('false');

    const zooms: string[] = [];
    gantt.addEventListener('zoomchange', (event) => zooms.push((event as CustomEvent).detail.zoom));
    root.querySelector<HTMLButtonElement>('.zoom-button[data-zoom="week"]')!.click();
    await flush();
    root.querySelector<HTMLButtonElement>('.zoom-button[data-zoom="fit"]')!.click();
    await flush();

    expect(zooms).toEqual(['week', 'fit']);
    expect(gantt.getAttribute('zoom')).toBe('fit');
  });

  it('re-fits when the host is resized', async () => {
    const calls: Array<() => void> = [];
    const original = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = class {
      constructor(cb: () => void) {
        calls.push(cb);
      }
      observe() {}
      disconnect() {}
    };
    try {
      const gantt = document.createElement('ui-gantt') as HTMLElement;
      let width = 1200;
      Object.defineProperty(gantt, 'clientWidth', { get: () => width, configurable: true });
      gantt.setAttribute('tasks', JSON.stringify(TASKS));
      gantt.setAttribute('zoom', 'fit');
      document.body.appendChild(gantt);
      await flush();
      const root = gantt.shadowRoot as ShadowRoot;
      expect(trackMin(root)).toBeCloseTo(822, 0);

      width = 900;
      (calls[0] as unknown as (entries: unknown[]) => void)([{ contentRect: { width: 900 } }]);
      await flush();
      expect(trackMin(root)).toBeCloseTo(900 - 2 - 376, 0);
    } finally {
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = original;
    }
  });

  it('drags by the scale in use, not a fixed pixels-per-day table', async () => {
    const { gantt, root } = await mount(1200);
    const perDay = 822 / 30;
    const changes: Array<{ id: string; start: string; end: string }> = [];
    gantt.addEventListener('taskchange', (event) => changes.push((event as CustomEvent).detail));

    const bar = root.querySelector<HTMLElement>('.bar[data-task-id="a"]')!;
    bar.setPointerCapture = () => {}; // jsdom has none
    const fire = (type: string, clientX: number) => {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      bar.dispatchEvent(event);
    };
    fire('pointerdown', 100);
    fire('pointermove', 100 + 2.2 * perDay); // a little over two days
    fire('pointerup', 100 + 2.2 * perDay);
    await flush();

    // at the old fixed 13px a day this would have been 5 days
    expect(changes).toEqual([{ id: 'a', start: '2026-03-04', end: '2026-03-15' }]);
  });
});
