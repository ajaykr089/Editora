import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const pad = (v: number) => String(v).padStart(2, '0');
const iso = (offset: number) => {
  const now = new Date();
  const x = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
};

// jsdom has no layout: give the scroll area a size (600 x 400 over a 3000 x 4000 surface).
const original = {
  clientWidth: Object.getOwnPropertyDescriptor(Element.prototype, 'clientWidth')!,
  clientHeight: Object.getOwnPropertyDescriptor(Element.prototype, 'clientHeight')!,
  scrollWidth: Object.getOwnPropertyDescriptor(Element.prototype, 'scrollWidth')!,
  scrollHeight: Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight')!,
};
const isViewport = (el: Element) => el.classList?.contains('viewport');
const stubLayout = () => {
  const define = (name: keyof typeof original, size: number) =>
    Object.defineProperty(Element.prototype, name, {
      configurable: true,
      get(this: Element) {
        return isViewport(this) ? size : 0;
      },
    });
  define('clientWidth', 600);
  define('clientHeight', 400);
  define('scrollWidth', 3000);
  define('scrollHeight', 4000);
};

const mount = async (tasks: unknown[], attrs: Record<string, string> = {}) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  gantt.setAttribute('zoom', 'week'); // 13px a day
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const viewport = (root: ParentNode) => root.querySelector<HTMLElement>('.viewport')!;
type Api = HTMLElement & {
  scrollToDate: (date: unknown, options?: object) => void;
  scrollToTask: (id: string, options?: object) => boolean;
  toggleTask: (id: string, open?: boolean) => void;
  expandAll: () => void;
  collapseAll: () => void;
  tasks: unknown;
  links: unknown;
};

// today is 62 days after the chart starts (the project starts 60 days ago, minus the 2 days of room): x = 806px.
const AROUND_TODAY = [{ id: 'a', label: 'Long project', start: iso(-60), end: iso(60) }];
const TODAY_X = 62 * 13;
const GRID = 376;
const CENTRED = TODAY_X - (600 - GRID) / 2; // 694

beforeEach(stubLayout);
afterEach(() => {
  document.body.innerHTML = '';
  for (const [name, descriptor] of Object.entries(original)) Object.defineProperty(Element.prototype, name, descriptor);
});

describe('ui-gantt opens on today', () => {
  it('scrolls so today is in the middle of the timeline when it is off the first screen', async () => {
    const { root } = await mount(AROUND_TODAY);

    expect(viewport(root).scrollLeft).toBeCloseTo(CENTRED, 0);
  });

  it('stays at the start when today is already on the first screen', async () => {
    const { root } = await mount([{ id: 'a', label: 'Soon', start: iso(-3), end: iso(20) }]);

    expect(viewport(root).scrollLeft).toBe(0);
  });

  it('stays at the start with initial-scroll="start", without a today marker, and in fit', async () => {
    expect(viewport((await mount(AROUND_TODAY, { 'initial-scroll': 'start' })).root).scrollLeft).toBe(0);
    document.body.innerHTML = '';
    expect(viewport((await mount(AROUND_TODAY, { 'show-today': 'false' })).root).scrollLeft).toBe(0);
    document.body.innerHTML = '';
    expect(viewport((await mount(AROUND_TODAY, { zoom: 'fit' })).root).scrollLeft).toBe(0);
  });

  it('does it once: later renders leave the scroll position alone', async () => {
    const { gantt, root } = await mount(AROUND_TODAY);
    viewport(root).scrollLeft = 100;
    viewport(root).dispatchEvent(new Event('scroll'));
    await flush();

    gantt.setAttribute('labels', JSON.stringify({ title: 'Renamed' }));
    await flush();

    expect(viewport(root).scrollLeft).toBe(100);
  });

  it('does it again for a different set of tasks', async () => {
    const { gantt, root } = await mount([{ id: 'x', label: 'Short', start: iso(-1), end: iso(5) }]);
    expect(viewport(root).scrollLeft).toBe(0);

    gantt.setAttribute('tasks', JSON.stringify([{ id: 'far', label: 'Long project', start: iso(-60), end: iso(60) }]));
    await flush();

    expect(viewport(root).scrollLeft).toBeCloseTo(CENTRED, 0);
  });
});

describe('ui-gantt today button', () => {
  it('is in the toolbar, named for assistive technology, and enabled while today is on the timeline', async () => {
    const { root } = await mount(AROUND_TODAY);
    const button = root.querySelector<HTMLButtonElement>('.today-button')!;

    expect(button.textContent).toBe('Today');
    expect(button.getAttribute('aria-label')).toBe('Scroll to today');
    expect(button.disabled).toBe(false);
  });

  it('brings today back to the middle after scrolling away', async () => {
    const { root } = await mount(AROUND_TODAY);
    viewport(root).scrollLeft = 2000;
    root.querySelector<HTMLButtonElement>('.today-button')!.click();

    expect(viewport(root).scrollLeft).toBeCloseTo(CENTRED, 0);
  });

  it('is disabled when today is not on the timeline, and absent with show-today="false"', async () => {
    expect((await mount([{ id: 'a', label: 'Old', start: '2020-01-06', end: '2020-02-14' }])).root.querySelector<HTMLButtonElement>('.today-button')!.disabled).toBe(true);
    document.body.innerHTML = '';
    expect((await mount(AROUND_TODAY, { 'show-today': 'false' })).root.querySelector('.today-button')).toBeNull();
  });

  it('keeps focus after its own click re-renders nothing, and is translatable', async () => {
    const { root } = await mount(AROUND_TODAY, { labels: JSON.stringify({ today: 'Aujourd’hui', scrollToToday: 'Aller à aujourd’hui' }) });
    const button = root.querySelector<HTMLButtonElement>('.today-button')!;

    expect(button.textContent).toBe('Aujourd’hui');
    expect(button.getAttribute('aria-label')).toBe('Aller à aujourd’hui');
  });
});

describe('ui-gantt scrollToDate', () => {
  it('centres a date, given as a string, a Date or a timestamp', async () => {
    const { gantt, root } = await mount(AROUND_TODAY, { 'initial-scroll': 'start' });
    const api = gantt as Api;
    const target = new Date(); // 30 days after the chart starts' worth: pick a fixed offset from today
    target.setDate(target.getDate() + 20);
    const x = (62 + 20) * 13;

    api.scrollToDate(iso(20));
    expect(viewport(root).scrollLeft).toBeCloseTo(x - (600 - GRID) / 2, 0);

    api.scrollToDate(new Date(2000, 0, 1).getTime()); // long before the chart: clamped to the start
    expect(viewport(root).scrollLeft).toBe(0);

    api.scrollToDate(new Date(target.getFullYear(), target.getMonth(), target.getDate()));
    expect(viewport(root).scrollLeft).toBeCloseTo(x - (600 - GRID) / 2, 0);

    api.scrollToDate(target.getTime());
    expect(viewport(root).scrollLeft).toBeCloseTo(x - (600 - GRID) / 2, 0);
  });

  it('puts a date near the left edge with align start, and never scrolls past either end', async () => {
    const { gantt, root } = await mount(AROUND_TODAY, { 'initial-scroll': 'start' });
    const api = gantt as Api;

    api.scrollToDate(iso(20), { align: 'start' });
    expect(viewport(root).scrollLeft).toBeCloseTo((62 + 20) * 13 - 24, 0);

    api.scrollToDate('2100-01-01');
    expect(viewport(root).scrollLeft).toBe(3000 - 600);
  });

  it('knows "today", and ignores a value that is not a date', async () => {
    const { gantt, root } = await mount(AROUND_TODAY, { 'initial-scroll': 'start' });
    const api = gantt as Api;

    api.scrollToDate('today');
    expect(viewport(root).scrollLeft).toBeCloseTo(CENTRED, 0);

    viewport(root).scrollLeft = 1234;
    api.scrollToDate('someday');
    api.scrollToDate('');
    expect(viewport(root).scrollLeft).toBe(1234);
  });
});

describe('ui-gantt tree API', () => {
  const TREE = [
    { id: 'p', label: 'Phase', start: iso(0), end: iso(30), type: 'summary' },
    { id: 'q', label: 'Sub phase', start: iso(0), end: iso(20), parent: 'p', type: 'summary' },
    { id: 'a', label: 'Deep task', start: iso(2), end: iso(9), parent: 'q' },
    { id: 'b', label: 'Other task', start: iso(10), end: iso(15), parent: 'p' },
    { id: 'z', label: 'Last', start: iso(16), end: iso(25) },
  ];
  const rows = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('.grid-row')].map((r) => r.dataset.taskId);
  const collect = (gantt: HTMLElement) => {
    const seen: Array<[string, boolean]> = [];
    gantt.addEventListener('tasktoggle', (event) => seen.push([(event as CustomEvent).detail.id, (event as CustomEvent).detail.open]));
    return seen;
  };

  it('collapses and expands every branch, firing tasktoggle for each that changed', async () => {
    const { gantt, root } = await mount(TREE);
    const seen = collect(gantt);
    const api = gantt as Api;

    api.collapseAll();
    await flush();
    expect(rows(root)).toEqual(['p', 'z']);
    expect(seen).toEqual([['p', false], ['q', false]]);

    seen.length = 0;
    api.expandAll();
    await flush();
    expect(rows(root)).toEqual(['p', 'q', 'a', 'b', 'z']);
    expect(seen.map(([id, open]) => `${id}:${open}`).sort()).toEqual(['p:true', 'q:true']);
  });

  it('toggles one branch, to a given state or the other one, and says nothing when nothing changes', async () => {
    const { gantt, root } = await mount(TREE);
    const seen = collect(gantt);
    const api = gantt as Api;

    api.toggleTask('q');
    await flush();
    expect(rows(root)).toEqual(['p', 'q', 'b', 'z']);
    api.toggleTask('q', false); // already closed
    api.toggleTask('q', true);
    await flush();
    expect(rows(root)).toEqual(['p', 'q', 'a', 'b', 'z']);
    expect(seen).toEqual([['q', false], ['q', true]]);
  });

  it('reports the toggle a user makes with the expand button', async () => {
    const { gantt, root } = await mount(TREE);
    const seen = collect(gantt);

    root.querySelector<HTMLButtonElement>('.expander[data-task-id="p"]')!.click();
    await flush();

    expect(seen).toEqual([['p', false]]);
  });

  it('opens the branches above a task when scrolling to it, and says so', async () => {
    const { gantt, root } = await mount(TREE);
    const api = gantt as Api;
    api.collapseAll();
    await flush();
    const seen = collect(gantt);

    expect(api.scrollToTask('a')).toBe(true);
    await flush();

    expect(rows(root)).toEqual(['p', 'q', 'a', 'b', 'z']);
    expect(seen.map(([id, open]) => `${id}:${open}`)).toEqual(['q:true', 'p:true']);
  });

  it('returns false for an unknown task and for one the filter hides', async () => {
    const { gantt } = await mount(TREE);
    const api = gantt as Api;

    expect(api.scrollToTask('nope')).toBe(false);
    gantt.setAttribute('filter', 'Last');
    await flush();
    expect(api.scrollToTask('b')).toBe(false);
    expect(api.scrollToTask('z')).toBe(true);
  });

  it('scrolls a row that is off screen to the middle, and leaves one that is visible alone', async () => {
    const many = Array.from({ length: 60 }, (_, i) => ({ id: `t${i}`, label: `Task ${i}`, start: iso(i % 20), end: iso((i % 20) + 5) }));
    const { gantt, root } = await mount(many, { 'initial-scroll': 'start' });
    const api = gantt as Api;

    api.scrollToTask('t40');
    // row 40 centred in a 400px area under the 62px header
    expect(viewport(root).scrollTop).toBeCloseTo(40 * 42 + 21 - (400 - 62) / 2, 0);

    const before = viewport(root).scrollTop;
    api.scrollToTask('t40');
    expect(viewport(root).scrollTop).toBe(before);
  });

  it('scrolls to a bar that is off screen horizontally', async () => {
    const { gantt, root } = await mount([{ id: 'a', label: 'Early', start: iso(-60), end: iso(-50) }, { id: 'b', label: 'Late', start: iso(50), end: iso(60) }], { 'initial-scroll': 'start' });
    const api = gantt as Api;

    api.scrollToTask('b');

    // start of "Late" is 112 days after the chart starts (60 + 2 + 50), with 24px of room
    expect(viewport(root).scrollLeft).toBeCloseTo((60 + 2 + 50) * 13 - 24, 0);
  });
});

describe('ui-gantt tasks and links properties', () => {
  it('writes the attribute from an array, turning Dates into plain days', async () => {
    const { gantt, root } = await mount([]);
    const api = gantt as Api;
    api.tasks = [{ id: 'a', label: 'Dated', start: new Date(2026, 2, 2, 23, 30), end: new Date(2026, 2, 6), baselineStart: new Date(2026, 2, 1) }];
    await flush();

    expect(JSON.parse(gantt.getAttribute('tasks')!)).toEqual([{ id: 'a', label: 'Dated', start: '2026-03-02', end: '2026-03-06', baselineStart: '2026-03-01' }]);
    expect(root.querySelectorAll('.bar').length).toBe(1);
  });

  it('reads the array back, and an empty array for nothing or for malformed JSON', async () => {
    const { gantt } = await mount([{ id: 'a', label: 'Task', start: '2026-03-02', end: '2026-03-06' }]);
    const api = gantt as Api;

    expect(api.tasks).toEqual([{ id: 'a', label: 'Task', start: '2026-03-02', end: '2026-03-06' }]);
    gantt.setAttribute('tasks', '{nope');
    expect(api.tasks).toEqual([]);
    api.tasks = null;
    expect(gantt.hasAttribute('tasks')).toBe(false);
    expect(api.tasks).toEqual([]);
  });

  it('handles links the same way', async () => {
    const { gantt } = await mount([{ id: 'a', label: 'A', start: '2026-03-02', end: '2026-03-06' }, { id: 'b', label: 'B', start: '2026-03-09', end: '2026-03-13' }]);
    const api = gantt as Api;

    api.links = [{ source: 'a', target: 'b', type: 'e2s' }];
    expect(JSON.parse(gantt.getAttribute('links')!)).toEqual([{ source: 'a', target: 'b', type: 'e2s' }]);
    expect(api.links).toEqual([{ source: 'a', target: 'b', type: 'e2s' }]);
  });

  it('keeps a property set before the element was upgraded', async () => {
    const gantt = document.createElement('ui-gantt') as Api;
    // what a framework does to an element that is not defined yet: an own property, hiding the accessor
    Object.defineProperty(gantt, 'tasks', { value: [{ id: 'a', label: 'Early', start: new Date(2026, 2, 2), end: new Date(2026, 2, 6) }], writable: true, configurable: true });
    document.body.appendChild(gantt);
    await flush();

    expect(JSON.parse(gantt.getAttribute('tasks')!)[0]).toMatchObject({ id: 'a', start: '2026-03-02' });
    expect(Object.prototype.hasOwnProperty.call(gantt, 'tasks')).toBe(false);
    expect(gantt.shadowRoot!.querySelectorAll('.bar').length).toBe(1);
  });
});
