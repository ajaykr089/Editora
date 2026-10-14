import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const TASKS = [
  { id: 'p', label: 'Phase', start: '2026-03-01', end: '2026-03-02', type: 'summary' }, // its own dates are placeholders
  { id: 'a', label: 'Design', start: '2026-03-04', end: '2026-03-09', parent: 'p', progress: 100 },
  { id: 'b', label: 'Build', start: '2026-03-10', end: '2026-03-20', parent: 'p', progress: 40 },
  { id: 'r', label: 'Frozen', start: '2026-03-12', end: '2026-03-14', parent: 'p', readonly: true },
  { id: 'z', label: 'Outside', start: '2026-03-23', end: '2026-03-27' },
];

const mount = async (attrs: Record<string, string> = {}, tasks: unknown[] = TASKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  gantt.setAttribute('zoom', 'week');
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const bar = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!;
const dates = (root: ParentNode, id: string) => root.querySelector(`.grid-row[data-task-id="${id}"] .grid-cell:nth-child(3)`)!.textContent!.trim();
const progress = (root: ParentNode, id: string) => root.querySelector(`.grid-row[data-task-id="${id}"] .grid-cell:nth-child(4)`)!.textContent!.trim();
const short = (m: number, d: number) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(2026, m - 1, d));
const press = (target: Element, key: string, init: KeyboardEventInit = {}) => target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));
const record = (gantt: HTMLElement, ...names: string[]) => {
  const seen: Array<{ type: string; detail: Record<string, unknown> }> = [];
  for (const name of names) gantt.addEventListener(name, (event) => seen.push({ type: name, detail: (event as CustomEvent).detail }));
  return seen;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt auto-summary', () => {
  it('leaves a parent on its own dates without the attribute', async () => {
    const { root } = await mount();

    expect(dates(root, 'p')).toBe(`${short(3, 1)} - ${short(3, 2)}`);
  });

  it('makes a parent span its children, and take their progress when it has none of its own', async () => {
    const { root } = await mount({ 'auto-summary': '' });

    expect(dates(root, 'p')).toBe(`${short(3, 4)} - ${short(3, 20)}`);
    // Design 5 days at 100%, Build 10 days at 40%, Frozen has none: (100*5 + 40*10) / 15 = 60
    expect(progress(root, 'p')).toBe('60%');
    expect(dates(root, 'z')).toBe(`${short(3, 23)} - ${short(3, 27)}`); // a task without children is left alone
  });

  it('keeps a progress the parent has itself', async () => {
    const tasks = TASKS.map((t) => (t.id === 'p' ? { ...t, progress: 10 } : t));
    const { root } = await mount({ 'auto-summary': '' }, tasks);

    expect(progress(root, 'p')).toBe('10%');
  });

  it('follows a change to a child, and turning it on and off', async () => {
    const { gantt, root } = await mount({ 'auto-summary': '' });

    bar(root, 'b').focus();
    for (let i = 0; i < 3; i += 1) {
      press(bar(root, 'b'), 'ArrowRight');
      await flush();
    }
    expect(dates(root, 'p')).toBe(`${short(3, 4)} - ${short(3, 23)}`); // Build now ends on the 23rd

    gantt.removeAttribute('auto-summary');
    await flush();
    expect(dates(root, 'p')).toBe(`${short(3, 1)} - ${short(3, 2)}`);
    gantt.setAttribute('auto-summary', '');
    await flush();
    expect(dates(root, 'p')).toBe(`${short(3, 4)} - ${short(3, 23)}`);
  });

  it('puts the parent bar where its children are', async () => {
    const plain = await mount();
    const plainWidth = parseFloat(bar(plain.root, 'p').style.width);
    document.body.innerHTML = '';
    const auto = await mount({ 'auto-summary': '' });

    expect(plainWidth).toBeLessThan(20); // one day
    expect(parseFloat(bar(auto.root, 'p').style.width)).toBeCloseTo(16 * 13, 0); // the 4th to the 20th
    expect(bar(auto.root, 'p').getAttribute('aria-label')).toContain('60% complete');
  });
});

describe('ui-gantt auto-summary with parents that have no dates', () => {
  const UNDATED = [
    { id: 'p', label: 'Phase', type: 'summary' },
    { id: 'q', label: 'Sub phase', type: 'summary', parent: 'p' },
    { id: 'a', label: 'Design', start: '2026-03-04', end: '2026-03-09', parent: 'q' },
    { id: 'b', label: 'Build', start: '2026-03-10', end: '2026-03-20', parent: 'p' },
    { id: 'empty', label: 'Empty phase', type: 'summary' },
  ];

  it('takes the dates of a parent from its children, through a parent of parents', async () => {
    const { root } = await mount({ 'auto-summary': '' }, UNDATED);

    expect(dates(root, 'p')).toBe(`${short(3, 4)} - ${short(3, 20)}`);
    expect(dates(root, 'q')).toBe(`${short(3, 4)} - ${short(3, 9)}`);
  });

  it('leaves out a parent that has no dates and no children to take them from', async () => {
    const { root } = await mount({ 'auto-summary': '' }, UNDATED);

    expect(root.querySelector('.grid-row[data-task-id="empty"]')).toBeNull();
    expect(root.querySelectorAll('.grid-row').length).toBe(4);
  });

  it('still needs dates without the attribute', async () => {
    const { root } = await mount({}, UNDATED);

    expect(root.querySelector('.grid-row[data-task-id="p"]')).toBeNull();
    expect(root.querySelector('.grid-row[data-task-id="a"]')).not.toBeNull();
  });

  it('keeps the chart from reaching back to 1970 for a placeholder', async () => {
    const { root } = await mount({ 'auto-summary': '' }, UNDATED);

    expect(parseFloat(root.querySelector<HTMLElement>('.timeline-body')!.style.minWidth)).toBeLessThan(2000);
    expect(root.querySelector('.band.top .band-cell')!.textContent).not.toContain('1970');
  });
});

describe('ui-gantt cascade', () => {
  it('keeps parents fixed without it, and makes them movable with it (no resize handles)', async () => {
    const plain = await mount();
    expect(bar(plain.root, 'p').hasAttribute('data-draggable')).toBe(false);

    document.body.innerHTML = '';
    const { root } = await mount({ cascade: '' });
    expect(bar(root, 'p').getAttribute('data-draggable')).toBe('true');
    expect(bar(root, 'p').querySelector('.handle')).toBeNull();
    expect(bar(root, 'a').querySelector('.handle')).not.toBeNull();
  });

  it('moves everything under a parent by the same days, from the keyboard, and says so in beforetaskchange', async () => {
    const { gantt, root } = await mount({ cascade: '' });
    const seen = record(gantt, 'beforetaskchange', 'taskchange');

    bar(root, 'p').focus();
    press(bar(root, 'p'), 'ArrowRight');
    await flush();

    expect(seen.map((s) => s.type)).toEqual(['beforetaskchange', 'taskchange', 'taskchange', 'taskchange']);
    expect(seen[0].detail).toMatchObject({ id: 'p', start: '2026-03-02', end: '2026-03-03', source: 'keyboard' });
    expect((seen[0].detail.affected as Array<{ id: string }>).map((c) => c.id).sort()).toEqual(['a', 'b']);
    expect(seen.slice(1).map((s) => s.detail.id)).toEqual(['p', 'a', 'b']);
    expect(dates(root, 'a')).toBe(`${short(3, 5)} - ${short(3, 10)}`);
    expect(dates(root, 'b')).toBe(`${short(3, 11)} - ${short(3, 21)}`);
  });

  it('leaves a read-only task where it is', async () => {
    const { root } = await mount({ cascade: '' });

    bar(root, 'p').focus();
    press(bar(root, 'p'), 'ArrowRight');
    await flush();

    expect(dates(root, 'r')).toBe(`${short(3, 12)} - ${short(3, 14)}`);
  });

  it('moves a group by dragging its bar, and a refusal puts everything back', async () => {
    const { gantt, root } = await mount({ cascade: '' });
    const seen = record(gantt, 'taskchange');
    const target = bar(root, 'p');
    target.setPointerCapture = () => {};
    const fire = (type: string, clientX: number) => {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      target.dispatchEvent(event);
    };

    fire('pointerdown', 100);
    fire('pointermove', 126); // two days at 13px
    fire('pointerup', 126);
    await flush();
    expect(seen.map((s) => `${s.detail.id}:${s.detail.start}`)).toEqual(['p:2026-03-03', 'a:2026-03-06', 'b:2026-03-12']);

    seen.length = 0;
    gantt.addEventListener('beforetaskchange', (event) => event.preventDefault());
    fire('pointerdown', 100);
    fire('pointermove', 126);
    fire('pointerup', 126);
    await flush();
    expect(seen).toEqual([]);
    expect(dates(root, 'a')).toBe(`${short(3, 6)} - ${short(3, 11)}`);
  });

  it('does not resize a parent with Shift and the arrows: it moves', async () => {
    const { gantt, root } = await mount({ cascade: '' });
    const seen = record(gantt, 'taskchange');

    bar(root, 'p').focus();
    press(bar(root, 'p'), 'ArrowRight', { shiftKey: true });
    await flush();

    const primary = seen.find((s) => s.detail.id === 'p')!;
    expect(primary.detail).toMatchObject({ start: '2026-03-02', end: '2026-03-03' }); // both moved, the length kept
  });

  it('moves a parent without children on its own', async () => {
    const { gantt, root } = await mount({ cascade: '' }, [{ id: 'e', label: 'Empty summary', start: '2026-03-02', end: '2026-03-09', type: 'summary' }]);
    const seen = record(gantt, 'beforetaskchange', 'taskchange');

    bar(root, 'e').focus();
    press(bar(root, 'e'), 'ArrowRight');
    await flush();

    expect(seen.map((s) => s.type)).toEqual(['beforetaskchange', 'taskchange']);
    expect((seen[0].detail.affected as unknown[]).length).toBe(0);
  });

  it('works with auto-summary: the parent and its children move together and the parent stays on top of them', async () => {
    const { root } = await mount({ cascade: '', 'auto-summary': '' });

    bar(root, 'p').focus();
    press(bar(root, 'p'), 'ArrowRight');
    await flush();

    expect(dates(root, 'p')).toBe(`${short(3, 5)} - ${short(3, 21)}`); // 4th -> 5th and 20th -> 21st: the read-only task did not hold it
  });
});
