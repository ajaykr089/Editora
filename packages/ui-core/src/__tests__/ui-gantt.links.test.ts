import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const TASKS = [
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-06' },
  { id: 'b', label: 'Build', start: '2026-03-09', end: '2026-03-13' },
  { id: 'c', label: 'Test', start: '2026-03-16', end: '2026-03-20' },
];
const LINKS = [{ id: 'ab', source: 'a', target: 'b', type: 'e2s' }];

const mount = async (attrs: Record<string, string> = {}, links: unknown[] = LINKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(TASKS));
  gantt.setAttribute('links', JSON.stringify(links));
  gantt.setAttribute('zoom', 'week');
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const bar = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!;
const dot = (root: ParentNode, id: string, side: 'start' | 'end') => root.querySelector<HTMLElement>(`.connector[data-task-id="${id}"][data-side="${side}"]`)!;
const hit = (root: ParentNode, id: string) => root.querySelector<SVGElement>(`.link-hit[data-link-id="${id}"]`)!;
const record = (gantt: HTMLElement, ...names: string[]) => {
  const seen: Array<{ type: string; detail: Record<string, unknown> }> = [];
  for (const name of names) gantt.addEventListener(name, (event) => seen.push({ type: name, detail: (event as CustomEvent).detail }));
  return seen;
};
const pointer = (target: Element, type: string, clientX = 0, clientY = 0) => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX, clientY });
  Object.defineProperty(event, 'pointerId', { value: 1 });
  target.dispatchEvent(event);
};
/** jsdom has no hit testing or layout: say which bar is under the pointer and where it is. */
const arrange = (root: ShadowRoot, hovered: () => Element | null, boxes: Record<string, [number, number]> = {}) => {
  (root as unknown as { elementFromPoint: () => Element | null }).elementFromPoint = hovered;
  for (const [id, [left, right]] of Object.entries(boxes)) {
    bar(root, id).getBoundingClientRect = () => ({ left, right, top: 0, bottom: 18, width: right - left, height: 18, x: left, y: 0, toJSON() {} });
  }
};
const drag = (root: ShadowRoot, from: HTMLElement, toX: number) => {
  from.setPointerCapture = () => {};
  pointer(from, 'pointerdown', 10, 10);
  pointer(from, 'pointermove', toX, 10);
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt linkable', () => {
  it('has no dots without the attribute or in a read-only chart, and two beside each bar with it', async () => {
    expect((await mount()).root.querySelectorAll('.connector').length).toBe(0);
    document.body.innerHTML = '';
    expect((await mount({ linkable: '', readonly: '' })).root.querySelectorAll('.connector').length).toBe(0);
    document.body.innerHTML = '';
    const { root } = await mount({ linkable: '' });

    expect(root.querySelectorAll('.connector').length).toBe(6);
    // outside the bar, so its overflow does not clip them
    expect(bar(root, 'a').contains(dot(root, 'a', 'end'))).toBe(false);
    expect(parseFloat(dot(root, 'a', 'start').style.left)).toBeLessThan(parseFloat(bar(root, 'a').style.left));
    expect(parseFloat(dot(root, 'a', 'end').style.left)).toBeGreaterThan(parseFloat(bar(root, 'a').style.left) + parseFloat(bar(root, 'a').style.width));
  });

  it('asks for the type of link the dots and the drop position say, for all four', async () => {
    const cases: Array<['start' | 'end', number, string]> = [
      ['end', 190, 'e2e'], // dropped on the right half of the bar: its end
      ['end', 110, 'e2s'], // the left half: its start
      ['start', 190, 's2e'],
      ['start', 110, 's2s'],
    ];
    for (const [side, x, type] of cases) {
      document.body.innerHTML = '';
      const { gantt, root } = await mount({ linkable: '' });
      const seen = record(gantt, 'linkcreate');
      arrange(root, () => bar(root, 'c'), { c: [100, 200] });

      drag(root, dot(root, 'a', side), x);
      pointer(dot(root, 'a', side), 'pointerup', x, 10);

      expect(seen.map((s) => s.detail)).toEqual([{ source: 'a', target: 'c', type }]);
    }
  });

  it('takes a drop on another bar\'s dot as that end of it', async () => {
    const { gantt, root } = await mount({ linkable: '' });
    const seen = record(gantt, 'linkcreate');
    arrange(root, () => dot(root, 'c', 'start'), { c: [100, 200] });

    drag(root, dot(root, 'a', 'end'), 190); // over the right half, but the dot says "start"
    pointer(dot(root, 'a', 'end'), 'pointerup', 190, 10);

    expect(seen.map((s) => s.detail)).toEqual([{ source: 'a', target: 'c', type: 'e2s' }]);
  });

  it('shows a line from the dot while dragging, and the bar it would join with the end it would take', async () => {
    const { root } = await mount({ linkable: '' });
    arrange(root, () => bar(root, 'c'), { c: [100, 200] });

    drag(root, dot(root, 'a', 'end'), 190);

    expect(root.querySelectorAll('.link-draft').length).toBe(1);
    expect(root.querySelector('.link-draft')!.getAttribute('d')).toMatch(/^M [\d.-]+ [\d.-]+ L [\d.-]+ [\d.-]+$/);
    expect(bar(root, 'c').classList.contains('link-target')).toBe(true);
    expect(bar(root, 'c').getAttribute('data-link-side')).toBe('end');
    expect(root.querySelector('.frame')!.hasAttribute('data-linking')).toBe(true);

    pointer(dot(root, 'a', 'end'), 'pointerup', 190, 10);
    expect(root.querySelector('.link-draft')).toBeNull();
    expect(bar(root, 'c').classList.contains('link-target')).toBe(false);
    expect(root.querySelector('.frame')!.hasAttribute('data-linking')).toBe(false);
  });

  it('creates nothing for a drop on the same task, on empty space, or for a link that already exists', async () => {
    const { gantt, root } = await mount({ linkable: '' });
    const seen = record(gantt, 'linkcreate');

    arrange(root, () => bar(root, 'a'), { a: [100, 200] });
    drag(root, dot(root, 'a', 'end'), 190);
    pointer(dot(root, 'a', 'end'), 'pointerup', 190, 10);

    arrange(root, () => null);
    drag(root, dot(root, 'a', 'end'), 190);
    pointer(dot(root, 'a', 'end'), 'pointerup', 190, 10);

    arrange(root, () => bar(root, 'b'), { b: [100, 200] });
    drag(root, dot(root, 'a', 'end'), 110); // a -> b start, e2s: already there
    pointer(dot(root, 'a', 'end'), 'pointerup', 110, 10);

    expect(seen).toEqual([]);
    expect(root.querySelector('.link-draft')).toBeNull();
  });

  it('cancels with Escape and with a cancelled pointer', async () => {
    const { gantt, root } = await mount({ linkable: '' });
    const seen = record(gantt, 'linkcreate');
    arrange(root, () => bar(root, 'c'), { c: [100, 200] });

    drag(root, dot(root, 'a', 'end'), 190);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(root.querySelector('.link-draft')).toBeNull();
    pointer(dot(root, 'a', 'end'), 'pointerup', 190, 10);

    drag(root, dot(root, 'a', 'end'), 190);
    pointer(dot(root, 'a', 'end'), 'pointercancel', 190, 10);
    expect(root.querySelector('.link-draft')).toBeNull();

    expect(seen).toEqual([]);
  });

  it('holds back the scroll re-render that would remove the dot being dragged', async () => {
    const { root } = await mount({ linkable: '' });
    arrange(root, () => null);
    const frame = root.querySelector('.frame');
    const area = root.querySelector<HTMLElement>('.viewport')!;

    drag(root, dot(root, 'a', 'end'), 50);
    area.scrollLeft = 1500;
    area.dispatchEvent(new Event('scroll'));
    await flush(80);

    expect(root.querySelector('.frame')).toBe(frame);
    pointer(dot(root, 'a', 'end'), 'pointercancel', 50, 10);
  });
});

describe('ui-gantt selecting and removing a link', () => {
  const press = (target: Element, key: string) => target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

  it('selects a link on a click, marks it, focuses it, and still fires linkselect', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'linkselect');

    hit(root, 'ab').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush();

    expect(seen.map((s) => s.detail)).toEqual([{ id: 'ab', source: 'a', target: 'b', type: 'e2s' }]);
    expect(hit(root, 'ab').classList.contains('selected')).toBe(true);
    expect(root.querySelectorAll('.links path.selected').length).toBe(2);
    expect(root.activeElement).toBe(hit(root, 'ab'));
  });

  it('keeps the link paths out of the tab order: they take focus when clicked', async () => {
    const { root } = await mount();

    expect(hit(root, 'ab').getAttribute('tabindex')).toBe('-1');
  });

  it('asks the host to remove the selected link on Delete or Backspace', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'linkdelete');

    hit(root, 'ab').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush();
    press(hit(root, 'ab'), 'Delete');
    press(hit(root, 'ab'), 'Backspace');

    expect(seen.map((s) => s.detail)).toEqual([
      { id: 'ab', source: 'a', target: 'b', type: 'e2s' },
      { id: 'ab', source: 'a', target: 'b', type: 'e2s' },
    ]);
  });

  it('does not ask in a read-only chart, which can still select a link', async () => {
    const { gantt, root } = await mount({ readonly: '' });
    const seen = record(gantt, 'linkdelete', 'linkselect');

    hit(root, 'ab').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush();
    press(hit(root, 'ab'), 'Delete');

    expect(seen.map((s) => s.type)).toEqual(['linkselect']);
  });

  it('deselects with Escape or when a task is selected, and forgets a link that is gone', async () => {
    const { gantt, root } = await mount();

    hit(root, 'ab').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush();
    press(hit(root, 'ab'), 'Escape');
    await flush();
    expect(root.querySelectorAll('.links path.selected').length).toBe(0);

    hit(root, 'ab').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush();
    bar(root, 'c').click();
    await flush();
    expect(root.querySelectorAll('.links path.selected').length).toBe(0);

    hit(root, 'ab').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await flush();
    gantt.setAttribute('links', JSON.stringify([]));
    await flush();
    gantt.setAttribute('links', JSON.stringify(LINKS));
    await flush();
    expect(root.querySelectorAll('.links path.selected').length).toBe(0); // it does not come back selected
  });

  it('answers Enter and Space with linkselect', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'linkselect');

    press(hit(root, 'ab'), 'Enter');
    press(hit(root, 'ab'), ' ');

    expect(seen.length).toBe(2);
  });
});
