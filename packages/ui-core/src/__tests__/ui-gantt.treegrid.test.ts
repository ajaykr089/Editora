import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const TREE = [
  { id: 'p', label: 'Phase', start: '2026-03-02', end: '2026-03-30', type: 'summary' },
  { id: 'q', label: 'Sub phase', start: '2026-03-02', end: '2026-03-20', parent: 'p', type: 'summary' },
  { id: 'a', label: 'Deep task', start: '2026-03-02', end: '2026-03-09', parent: 'q' },
  { id: 'b', label: 'Other task', start: '2026-03-10', end: '2026-03-15', parent: 'p' },
  { id: 'z', label: 'Last', start: '2026-03-16', end: '2026-03-25' },
];

const mount = async (tasks: unknown[] = TREE, attrs: Record<string, string> = {}) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const row = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.grid-row[data-task-id="${id}"]`)!;
const bar = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!;
const press = (target: Element, key: string, init: KeyboardEventInit = {}) => target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));
const focused = (root: ShadowRoot) => {
  const el = root.activeElement as HTMLElement | null;
  return el ? `${el.classList.contains('grid-row') ? 'row' : el.classList.contains('bar') ? 'bar' : el.className}:${el.dataset.taskId}` : null;
};
const record = (gantt: HTMLElement, ...names: string[]) => {
  const seen: string[] = [];
  for (const name of names) gantt.addEventListener(name, (event) => seen.push(`${name}:${JSON.stringify((event as CustomEvent).detail)}`));
  return seen;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt task list as a treegrid', () => {
  it('has one row in the tab order, and marks the selected one', async () => {
    const { root } = await mount();
    const stops = (r: ParentNode) => [...r.querySelectorAll<HTMLElement>('.grid-row')].filter((el) => el.tabIndex === 0).map((el) => el.dataset.taskId);

    expect(stops(root)).toEqual(['p']);
    expect(root.querySelector('.grid-row[aria-selected]')).toBeNull();

    row(root, 'b').focus();
    press(row(root, 'b'), 'Enter');
    await flush();
    expect(stops(root)).toEqual(['b']);
    expect(row(root, 'b').getAttribute('aria-selected')).toBe('true');
    expect(root.querySelectorAll('.grid-row[aria-selected]').length).toBe(1);
    // the bar's tab stop follows the same task
    expect([...root.querySelectorAll<HTMLElement>('.bar')].filter((el) => el.tabIndex === 0).map((el) => el.dataset.taskId)).toEqual(['b']);
  });

  it('moves between rows with Up and Down, selecting as it goes', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskselect');

    row(root, 'p').focus();
    press(row(root, 'p'), 'ArrowDown');
    await flush();
    expect(focused(root)).toBe('row:q');
    press(row(root, 'q'), 'ArrowDown');
    press(row(root, 'a'), 'ArrowDown');
    await flush();
    expect(focused(root)).toBe('row:b');
    press(row(root, 'b'), 'ArrowUp');
    await flush();
    expect(focused(root)).toBe('row:a');
    expect(seen).toEqual(['taskselect:{"id":"q"}', 'taskselect:{"id":"a"}', 'taskselect:{"id":"b"}', 'taskselect:{"id":"a"}'].slice(0, seen.length));
    expect(seen[0]).toBe('taskselect:{"id":"q"}');
  });

  it('stops at the first and the last row', async () => {
    const { root } = await mount();

    row(root, 'p').focus();
    press(row(root, 'p'), 'ArrowUp');
    await flush();
    expect(focused(root)).toBe('row:p');

    press(row(root, 'p'), 'End');
    await flush();
    expect(focused(root)).toBe('row:z');
    press(row(root, 'z'), 'ArrowDown');
    await flush();
    expect(focused(root)).toBe('row:z');
  });

  it('jumps with Home and End, and ten rows with PageUp and PageDown', async () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ id: `t${i}`, label: `Task ${i}`, start: '2026-03-02', end: '2026-03-06' }));
    const { root } = await mount(many);

    row(root, 't5').focus();
    press(row(root, 't5'), 'PageDown');
    await flush();
    expect(focused(root)).toBe('row:t15');
    press(row(root, 't15'), 'PageDown');
    press(row(root, 't25'), 'PageDown');
    await flush();
    expect(focused(root)).toBe('row:t29');
    press(row(root, 't29'), 'PageUp');
    await flush();
    expect(focused(root)).toBe('row:t19');
    press(row(root, 't19'), 'Home');
    await flush();
    expect(focused(root)).toBe('row:t0');
    press(row(root, 't0'), 'End');
    await flush();
    expect(focused(root)).toBe('row:t29');
  });

  it('opens a closed branch with Right, goes into an open one, and ignores Right on a leaf', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'tasktoggle');
    gantt.toggleTask?.call(gantt, 'q', false);
    (gantt as unknown as { toggleTask: (id: string, open?: boolean) => void }).toggleTask('q', false);
    await flush();
    seen.length = 0;

    row(root, 'q').focus();
    press(row(root, 'q'), 'ArrowRight'); // closed: opens
    await flush();
    expect(seen).toEqual(['tasktoggle:{"id":"q","open":true}']);
    expect(focused(root)).toBe('row:q'); // and keeps focus through the re-render

    press(row(root, 'q'), 'ArrowRight'); // open: first child
    await flush();
    expect(focused(root)).toBe('row:a');

    press(row(root, 'a'), 'ArrowRight'); // a leaf: nothing
    await flush();
    expect(focused(root)).toBe('row:a');
    expect(seen.length).toBe(1);
  });

  it('closes an open branch with Left, and otherwise climbs to the parent', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'tasktoggle');

    row(root, 'a').focus();
    press(row(root, 'a'), 'ArrowLeft'); // a leaf: its parent
    await flush();
    expect(focused(root)).toBe('row:q');

    press(row(root, 'q'), 'ArrowLeft'); // open: closes
    await flush();
    expect(seen).toEqual(['tasktoggle:{"id":"q","open":false}']);
    expect(focused(root)).toBe('row:q');
    expect(root.querySelector('.grid-row[data-task-id="a"]')).toBeNull();

    press(row(root, 'q'), 'ArrowLeft'); // closed: up to p
    await flush();
    expect(focused(root)).toBe('row:p');

    press(row(root, 'p'), 'ArrowLeft'); // open, top level: closes
    await flush();
    press(row(root, 'p'), 'ArrowLeft'); // closed and without a parent: nothing
    await flush();
    expect(focused(root)).toBe('row:p');
  });

  it('selects with Enter and Space, and leaves a key on the expand button to the button', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskselect');

    row(root, 'b').focus();
    press(row(root, 'b'), ' ');
    press(row(root, 'b'), 'Enter');
    await flush();
    expect(seen).toEqual(['taskselect:{"id":"b"}', 'taskselect:{"id":"b"}']);

    const expander = root.querySelector<HTMLElement>('.expander[data-task-id="p"]')!;
    expander.focus();
    press(expander, 'ArrowDown'); // the row does not take it
    await flush();
    expect(focused(root)).toBe('expander:p');
  });

  it('moves between rows from a bar too, and a bar keeps editing dates with Left and Right', async () => {
    const { gantt, root } = await mount();
    const changes = record(gantt, 'taskchange');

    bar(root, 'p').focus();
    press(bar(root, 'p'), 'End');
    await flush();
    expect(focused(root)).toBe('bar:z');
    press(bar(root, 'z'), 'Home');
    await flush();
    expect(focused(root)).toBe('bar:p');

    bar(root, 'b').focus();
    press(bar(root, 'b'), 'ArrowRight');
    await flush();
    expect(changes).toEqual(['taskchange:{"id":"b","start":"2026-03-11","end":"2026-03-16"}']);
  });
});

describe('ui-gantt treegrid in a windowed chart', () => {
  const original: Array<[string, PropertyDescriptor]> = [];
  beforeEach(() => {
    const onViewport = (value: number) => ({
      configurable: true,
      get(this: Element) {
        return this.classList?.contains('viewport') ? value : 0;
      },
    });
    for (const [name, size] of [['clientWidth', 600], ['clientHeight', 400], ['scrollHeight', 1000000], ['scrollWidth', 3000]] as const) {
      original.push([name, Object.getOwnPropertyDescriptor(Element.prototype, name)!]);
      Object.defineProperty(Element.prototype, name, onViewport(size));
    }
  });
  afterEach(() => {
    for (const [name, descriptor] of original) Object.defineProperty(Element.prototype, name, descriptor);
    original.length = 0;
  });

  it('keeps a tab stop on screen even when the selected task is far away', async () => {
    const many = Array.from({ length: 1000 }, (_, i) => ({ id: `t${i}`, label: `Task ${i}`, start: '2026-03-02', end: '2026-03-06' }));
    const { gantt, root } = await mount(many);
    (gantt as unknown as { selectedId: string }).selectedId = 't900'; // selected, but not in the rendered window
    (gantt as unknown as { requestRender: () => void }).requestRender();
    await flush();

    expect(root.querySelector('.grid-row[data-task-id="t900"]')).toBeNull();
    const stops = [...root.querySelectorAll<HTMLElement>('.grid-row')].filter((el) => el.tabIndex === 0);
    expect(stops.length).toBe(1);
    expect([...root.querySelectorAll<HTMLElement>('.bar')].filter((el) => el.tabIndex === 0).length).toBe(1);
  });

  it('takes focus to a row that is not rendered yet, once the scroll has rendered its window', async () => {
    const many = Array.from({ length: 1000 }, (_, i) => ({ id: `t${i}`, label: `Task ${i}`, start: '2026-03-02', end: '2026-03-06' }));
    const { root } = await mount(many);

    row(root, 't0').focus();
    press(row(root, 't0'), 'End');
    await flush(80);

    // it scrolled to the last row (the render that follows must not put the scroll back) and the row has focus
    expect(root.querySelector<HTMLElement>('.viewport')!.scrollTop).toBeGreaterThan(30000);
    expect(focused(root)).toBe('row:t999');
  });
});
