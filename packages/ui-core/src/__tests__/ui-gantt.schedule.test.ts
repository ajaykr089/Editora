import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

// a ends on the 6th, b starts on the 6th and ends on the 9th, c starts on the 9th: every link holds exactly.
const TASKS = [
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-06' },
  { id: 'b', label: 'Build', start: '2026-03-06', end: '2026-03-09' },
  { id: 'c', label: 'Test', start: '2026-03-09', end: '2026-03-12' },
];
const LINKS = [
  { id: 'ab', source: 'a', target: 'b' },
  { id: 'bc', source: 'b', target: 'c' },
];

const mount = async (attrs: Record<string, string> = {}, tasks: unknown[] = TASKS, links: unknown[] = LINKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  gantt.setAttribute('links', JSON.stringify(links));
  gantt.setAttribute('zoom', 'week');
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const bar = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!;
const hit = (root: ParentNode, id: string) => root.querySelector<SVGElement>(`.link-hit[data-link-id="${id}"]`)!;
const violated = (root: ParentNode) => [...root.querySelectorAll('.link-hit.violated')].map((el) => el.getAttribute('data-link-id'));
const press = (target: Element, key: string, init: KeyboardEventInit = {}) => target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));
const record = (gantt: HTMLElement, ...names: string[]) => {
  const seen: Array<{ type: string; detail: Record<string, unknown> }> = [];
  for (const name of names) gantt.addEventListener(name, (event) => seen.push({ type: name, detail: (event as CustomEvent).detail }));
  return seen;
};
const arrow = (root: ParentNode, id: string, key: 'ArrowRight' | 'ArrowLeft' = 'ArrowRight') => {
  bar(root, id).focus();
  press(bar(root, id), key);
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt dependency violations', () => {
  it('leaves links that hold alone', async () => {
    const { root } = await mount();

    expect(violated(root)).toEqual([]);
    expect(root.querySelector('.link-hit')!.getAttribute('aria-label')).toBe('Design dependency to Build');
  });

  it('draws a link whose target starts too early in the danger style, and says so', async () => {
    const early = TASKS.map((t) => (t.id === 'b' ? { ...t, start: '2026-03-05', end: '2026-03-08' } : t));
    const { root } = await mount({}, early);

    expect(violated(root)).toEqual(['ab']);
    expect(hit(root, 'ab').getAttribute('data-violated')).toBe('true');
    expect(hit(root, 'ab').getAttribute('aria-label')).toBe('Design dependency to Build, dependency not met');
    expect(root.querySelectorAll('.links path.violated').length).toBe(2); // the line and its wider click target
    expect(root.querySelector('#ui-gantt-arrow-bad')).not.toBeNull();
    expect(root.querySelector('style')!.textContent).toMatch(/\.links path\.violated:not\(\.link-hit\) \{[^}]*marker-end: url\(#ui-gantt-arrow-bad\)/);
  });

  it('turns a link red when a task is moved against it, and back when it is moved on', async () => {
    const { root } = await mount();

    arrow(root, 'b', 'ArrowLeft'); // b starts the 5th, before a ends
    await flush();
    expect(violated(root)).toEqual(['ab']);

    press(bar(root, 'b'), 'ArrowRight');
    await flush();
    expect(violated(root)).toEqual([]);
  });

  it('can be switched off with schedule="off"', async () => {
    const early = TASKS.map((t) => (t.id === 'b' ? { ...t, start: '2026-03-05', end: '2026-03-08' } : t));
    const { root } = await mount({ schedule: 'off' }, early);

    expect(violated(root)).toEqual([]);
  });

  it('counts a lag, a negative one too, and every type of link', async () => {
    const lagged = await mount({}, TASKS, [{ id: 'ab', source: 'a', target: 'b', lag: 2 }]); // b may not start before the 8th
    expect(violated(lagged.root)).toEqual(['ab']);

    document.body.innerHTML = '';
    const overlap = await mount({}, TASKS, [{ id: 'ab', source: 'a', target: 'b', lag: -2 }]);
    expect(violated(overlap.root)).toEqual([]);

    document.body.innerHTML = '';
    const types = await mount({}, TASKS, [
      { id: 's2s', source: 'a', target: 'b', type: 's2s' }, // b starts on or after a starts: holds
      { id: 'e2e', source: 'a', target: 'c', type: 'e2e' }, // c ends on or after a ends: holds
      { id: 's2e', source: 'c', target: 'a', type: 's2e' }, // a ends on or after c starts (the 9th): it ends the 6th
      { id: 'e2s', source: 'c', target: 'b', type: 'e2s' }, // b starts on or after c ends (the 12th): it starts the 6th
    ]);
    expect(violated(types.root).sort()).toEqual(['e2s', 's2e']);
  });

  it('ignores links to a task that is not there', async () => {
    const { root } = await mount({}, TASKS, [{ id: 'x', source: 'a', target: 'ghost' }]);

    expect(violated(root)).toEqual([]);
  });
});

describe('ui-gantt schedule="auto"', () => {
  it('only marks the broken link by default: nothing else moves', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskchange');

    arrow(root, 'a');
    await flush();

    expect(seen.map((s) => s.detail.id)).toEqual(['a']);
    expect(violated(root)).toEqual(['ab']);
  });

  it('pushes what follows a task that moves, all the way down the chain, in one change', async () => {
    const { gantt, root } = await mount({ schedule: 'auto' });
    const seen = record(gantt, 'beforetaskchange', 'taskchange');

    arrow(root, 'a'); // a: 3rd to 7th, so b must start on the 7th and c on the 10th
    await flush();

    expect(seen.map((s) => s.type)).toEqual(['beforetaskchange', 'taskchange', 'taskchange', 'taskchange']);
    expect(seen[0].detail).toMatchObject({ id: 'a', start: '2026-03-03', end: '2026-03-07', source: 'keyboard' });
    expect(seen[0].detail.affected).toEqual([
      { id: 'b', start: '2026-03-07', end: '2026-03-10', previousStart: '2026-03-06', previousEnd: '2026-03-09' },
      { id: 'c', start: '2026-03-10', end: '2026-03-13', previousStart: '2026-03-09', previousEnd: '2026-03-12' },
    ]);
    expect(seen.slice(1).map((s) => `${s.detail.id}:${s.detail.start}:${s.detail.end}`)).toEqual([
      'a:2026-03-03:2026-03-07',
      'b:2026-03-07:2026-03-10',
      'c:2026-03-10:2026-03-13',
    ]);
    expect(violated(root)).toEqual([]);
  });

  it('never pulls a task back: moving the first one earlier leaves the rest', async () => {
    const { gantt, root } = await mount({ schedule: 'auto' });
    const seen = record(gantt, 'taskchange');

    arrow(root, 'a', 'ArrowLeft');
    await flush();

    expect(seen.map((s) => s.detail.id)).toEqual(['a']);
  });

  it('keeps a lag when it pushes', async () => {
    const { gantt, root } = await mount({ schedule: 'auto' }, TASKS, [{ id: 'ab', source: 'a', target: 'b', lag: 2 }]);
    const seen = record(gantt, 'taskchange');

    arrow(root, 'a');
    await flush();

    // a ends the 7th, b may start on the 9th (it was on the 6th, already too early): it is pushed to the 9th
    expect(seen.find((s) => s.detail.id === 'b')!.detail).toMatchObject({ start: '2026-03-09', end: '2026-03-12' });
  });

  it('lets the host refuse the whole change, pushed tasks included', async () => {
    const { gantt, root } = await mount({ schedule: 'auto' });
    gantt.addEventListener('beforetaskchange', (event) => event.preventDefault());
    const seen = record(gantt, 'taskchange');

    arrow(root, 'a');
    await flush();

    expect(seen).toEqual([]);
    expect(violated(root)).toEqual([]);
  });

  it('does not push a read-only task, and its link stays red', async () => {
    const frozen = TASKS.map((t) => (t.id === 'b' ? { ...t, readonly: true } : t));
    const { gantt, root } = await mount({ schedule: 'auto' }, frozen);
    const seen = record(gantt, 'taskchange');

    arrow(root, 'a');
    await flush();

    expect(seen.map((s) => s.detail.id)).toEqual(['a']);
    expect(violated(root)).toEqual(['ab']);
  });

  it('pushes after a drag too', async () => {
    const { gantt, root } = await mount({ schedule: 'auto' });
    const seen = record(gantt, 'beforetaskchange', 'taskchange');
    const target = bar(root, 'a');
    target.setPointerCapture = () => {};
    const fire = (type: string, clientX: number) => {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      target.dispatchEvent(event);
    };

    fire('pointerdown', 100);
    fire('pointermove', 126); // two days
    fire('pointerup', 126);
    await flush();

    expect(seen[0].detail).toMatchObject({ id: 'a', source: 'drag', start: '2026-03-04' });
    expect((seen[0].detail.affected as Array<{ id: string }>).map((c) => c.id)).toEqual(['b', 'c']);
    expect(seen.filter((s) => s.type === 'taskchange').length).toBe(3);
  });

  it('takes the children of a pushed parent along with cascade', async () => {
    const tasks = [
      { id: 'a', label: 'First', start: '2026-03-02', end: '2026-03-06' },
      { id: 'p', label: 'Phase', start: '2026-03-06', end: '2026-03-12', type: 'summary' },
      { id: 'k', label: 'Kid', start: '2026-03-06', end: '2026-03-09', parent: 'p' },
      { id: 'm', label: 'Mate', start: '2026-03-09', end: '2026-03-12', parent: 'p' },
    ];
    const { gantt, root } = await mount({ schedule: 'auto', cascade: '' }, tasks, [{ id: 'ap', source: 'a', target: 'p' }]);
    const seen = record(gantt, 'taskchange');

    arrow(root, 'a');
    await flush();

    expect(seen.map((s) => `${s.detail.id}:${s.detail.start}`).sort()).toEqual(['a:2026-03-03', 'k:2026-03-07', 'm:2026-03-10', 'p:2026-03-07']);
  });
});
