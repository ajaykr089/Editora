import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

// Tasks start on Monday 2026-03-02 and Monday 2026-03-16 (13px a day at the week scale).
const TASKS = [
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-13' },
  { id: 'b', label: 'Build', start: '2026-03-16', end: '2026-03-27' },
  { id: 'm', label: 'Launch', start: '2026-03-30', type: 'milestone' },
];

const mount = async (attrs: Record<string, string> = {}) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(TASKS));
  gantt.setAttribute('zoom', 'week');
  gantt.setAttribute('week-start', '1');
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const bar = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!;
const handle = (root: ParentNode, id: string, side: 'start' | 'end') => root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"] .handle.${side}`)!;

const pointer = (target: Element, type: string, clientX: number) => {
  const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX });
  Object.defineProperty(event, 'pointerId', { value: 1 });
  target.dispatchEvent(event);
};
const grab = (target: HTMLElement) => {
  // jsdom has no pointer capture; the bar asks for it even when the press lands on one of its handles
  target.setPointerCapture = () => {};
  const owner = target.closest<HTMLElement>('.bar');
  if (owner) owner.setPointerCapture = () => {};
};
const record = (gantt: HTMLElement, ...names: string[]) => {
  const seen: Array<{ type: string; detail: Record<string, unknown> }> = [];
  for (const name of names) gantt.addEventListener(name, (event) => seen.push({ type: name, detail: (event as CustomEvent).detail }));
  return seen;
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt beforetaskchange', () => {
  it('fires before taskchange for a drag, a resize and a key, saying where it came from', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'beforetaskchange', 'taskchange');

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 100);
    pointer(bar(root, 'a'), 'pointermove', 126);
    pointer(bar(root, 'a'), 'pointerup', 126);
    await flush();

    grab(handle(root, 'b', 'end'));
    const end = handle(root, 'b', 'end');
    pointer(end, 'pointerdown', 100);
    pointer(end, 'pointermove', 113);
    pointer(end, 'pointerup', 113);
    await flush();

    bar(root, 'm').focus();
    bar(root, 'm').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();

    expect(seen.map((s) => s.type)).toEqual(['beforetaskchange', 'taskchange', 'beforetaskchange', 'taskchange', 'beforetaskchange', 'taskchange']);
    expect(seen[0].detail).toEqual({ id: 'a', start: '2026-03-04', end: '2026-03-15', previousStart: '2026-03-02', previousEnd: '2026-03-13', source: 'drag', affected: [] });
    expect(seen[1].detail).toEqual({ id: 'a', start: '2026-03-04', end: '2026-03-15' });
    expect(seen[2].detail).toMatchObject({ id: 'b', start: '2026-03-16', end: '2026-03-28', previousEnd: '2026-03-27', source: 'resize' });
    expect(seen[4].detail).toMatchObject({ id: 'm', start: '2026-03-31', source: 'keyboard' });
  });

  it('lets the host refuse a keyboard change: nothing moves and no taskchange fires', async () => {
    const { gantt, root } = await mount();
    gantt.addEventListener('beforetaskchange', (event) => event.preventDefault());
    const seen = record(gantt, 'taskchange');

    bar(root, 'a').focus();
    bar(root, 'a').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();

    expect(seen).toEqual([]);
    expect(bar(root, 'a').getAttribute('aria-label')).toContain('2');
    const dates = bar(root, 'a').getAttribute('aria-label')!;
    expect(dates).toBe(bar(root, 'a').getAttribute('aria-label'));
    // the task is still on 2 - 13 March
    expect(root.querySelector('.grid-row[data-task-id="a"]')!.textContent).toMatch(/2/);
    bar(root, 'a').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();
    expect(seen).toEqual([]);
  });

  it('puts a dragged bar back when the host refuses the drop', async () => {
    const { gantt, root } = await mount();
    gantt.addEventListener('beforetaskchange', (event) => event.preventDefault());
    const seen = record(gantt, 'taskchange');
    const before = { left: bar(root, 'a').style.left, width: bar(root, 'a').style.width };

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 100);
    pointer(bar(root, 'a'), 'pointermove', 160);
    await flush(60);
    expect(bar(root, 'a').style.left).not.toBe(before.left); // it followed the pointer
    pointer(bar(root, 'a'), 'pointerup', 160);
    await flush();

    expect(seen).toEqual([]);
    expect(bar(root, 'a').style.left).toBe(before.left);
    expect(bar(root, 'a').style.width).toBe(before.width);
    expect(bar(root, 'a').classList.contains('dragging')).toBe(false);
    expect(root.querySelector('.bar-tip')!.hasAttribute('data-open')).toBe(false);
  });

  it('keeps the new dates when the host accepts', async () => {
    const { gantt, root } = await mount();
    gantt.addEventListener('beforetaskchange', () => {}); // listening is not refusing
    const seen = record(gantt, 'taskchange');

    bar(root, 'a').focus();
    bar(root, 'a').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();

    expect(seen.map((s) => s.detail)).toEqual([{ id: 'a', start: '2026-03-03', end: '2026-03-14' }]);
  });
});

describe('ui-gantt cancelling a drag', () => {
  it('puts the bar back on Escape, without a single event, and stops following the pointer', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'beforetaskchange', 'taskchange');
    const before = bar(root, 'a').style.left;

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 100);
    pointer(bar(root, 'a'), 'pointermove', 170);
    await flush(60);
    expect(bar(root, 'a').style.left).not.toBe(before);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    expect(bar(root, 'a').style.left).toBe(before);
    expect(bar(root, 'a').classList.contains('dragging')).toBe(false);

    pointer(bar(root, 'a'), 'pointermove', 220);
    pointer(bar(root, 'a'), 'pointerup', 220);
    await flush(60);
    expect(seen).toEqual([]);
    expect(bar(root, 'a').style.left).toBe(before);
  });

  it('does not keep listening for Escape after the drag, so a later drag works', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskchange');

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 100);
    pointer(bar(root, 'a'), 'pointermove', 126);
    pointer(bar(root, 'a'), 'pointerup', 126);
    await flush();
    expect(seen.length).toBe(1);

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 100);
    pointer(bar(root, 'a'), 'pointermove', 126);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    pointer(bar(root, 'a'), 'pointerup', 126);
    await flush();
    expect(seen.length).toBe(1);
  });

  it('treats a cancelled pointer as no drop at all', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskchange');
    const before = bar(root, 'a').style.left;

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 100);
    pointer(bar(root, 'a'), 'pointermove', 170);
    await flush(60);
    pointer(bar(root, 'a'), 'pointercancel', 170);
    await flush();

    expect(seen).toEqual([]);
    expect(bar(root, 'a').style.left).toBe(before);
  });

  it('reports nothing for a drop where the bar was picked up', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'beforetaskchange', 'taskchange');

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 100);
    pointer(bar(root, 'a'), 'pointermove', 140);
    pointer(bar(root, 'a'), 'pointermove', 100);
    pointer(bar(root, 'a'), 'pointerup', 100);
    await flush();

    expect(seen).toEqual([]);
  });
});

describe('ui-gantt snap', () => {
  const dragBy = async (target: HTMLElement, dx: number) => {
    grab(target);
    pointer(target, 'pointerdown', 100);
    pointer(target, 'pointermove', 100 + dx);
    pointer(target, 'pointerup', 100 + dx);
    await flush();
  };

  it('moves by whole weeks with snap="week": the start lands on the nearest week start', async () => {
    const { gantt, root } = await mount({ snap: 'week' });
    const seen = record(gantt, 'taskchange');

    await dragBy(bar(root, 'a'), 5 * 13); // Mar 7 is a Saturday: the next Monday, the 9th, is nearer than the 2nd

    expect(seen.map((s) => s.detail)).toEqual([{ id: 'a', start: '2026-03-09', end: '2026-03-20' }]);
  });

  it('snaps back, and reports nothing, when the pointer is nearer the original week start', async () => {
    const { gantt, root } = await mount({ snap: 'week' });
    const seen = record(gantt, 'taskchange');

    await dragBy(bar(root, 'a'), 2 * 13);

    expect(seen).toEqual([]);
  });

  it('snaps the edge that is being resized, to week and to month', async () => {
    const week = await mount({ snap: 'week' });
    const weekSeen = record(week.gantt, 'taskchange');
    await dragBy(handle(week.root, 'a', 'end'), 2 * 13); // end Mar 13 + 2 = Sun Mar 15 -> Mon Mar 16
    expect(weekSeen.map((s) => s.detail)).toEqual([{ id: 'a', start: '2026-03-02', end: '2026-03-16' }]);

    document.body.innerHTML = '';
    const month = await mount({ snap: 'month' });
    const monthSeen = record(month.gantt, 'taskchange');
    await dragBy(handle(month.root, 'b', 'end'), 3 * 13); // end Mar 27 + 3 = Mar 30 -> Apr 1
    expect(monthSeen.map((s) => s.detail)).toEqual([{ id: 'b', start: '2026-03-16', end: '2026-04-01' }]);
  });

  it('keeps a snapped bar long enough to exist', async () => {
    const { gantt, root } = await mount({ snap: 'week' });
    const seen = record(gantt, 'taskchange');

    await dragBy(handle(root, 'a', 'start'), 9 * 13); // the start would snap to the end or past it

    for (const s of seen) expect(String(s.detail.start) < String(s.detail.end)).toBe(true);
  });

  it('is day by day without snap, and for a value it does not know', async () => {
    for (const snap of [undefined, 'day', 'fortnight']) {
      document.body.innerHTML = '';
      const { gantt, root } = await mount(snap ? { snap } : {});
      const seen = record(gantt, 'taskchange');
      await dragBy(bar(root, 'a'), 2 * 13);
      expect(seen.map((s) => s.detail)).toEqual([{ id: 'a', start: '2026-03-04', end: '2026-03-15' }]);
    }
  });
});

describe('ui-gantt drag near the edge', () => {
  // A 600px scroll area over a 3000px surface, its rectangle at x 0-600, with the 376px list covering its left side.
  const originalDescriptors: Array<[object, string, PropertyDescriptor | undefined]> = [];
  const stub = (target: object, name: string, descriptor: PropertyDescriptor) => {
    originalDescriptors.push([target, name, Object.getOwnPropertyDescriptor(target, name)]);
    Object.defineProperty(target, name, { configurable: true, ...descriptor });
  };
  beforeEach(() => {
    const onViewport = (value: number) => ({ get(this: Element) { return this.classList?.contains('viewport') ? value : 0; } });
    stub(Element.prototype, 'clientWidth', onViewport(600));
    stub(Element.prototype, 'scrollWidth', onViewport(3000));
    stub(Element.prototype, 'getBoundingClientRect', {
      value(this: Element) {
        const box = (left: number, right: number) => ({ left, right, top: 0, bottom: 100, width: right - left, height: 100, x: left, y: 0, toJSON() {} });
        if (this.classList?.contains('viewport')) return box(0, 600);
        if (this.classList?.contains('grid-body')) return box(0, 376);
        return box(0, 0);
      },
    });
  });
  afterEach(() => {
    for (const [target, name, descriptor] of originalDescriptors.reverse()) {
      if (descriptor) Object.defineProperty(target, name, descriptor);
      else delete (target as Record<string, unknown>)[name];
    }
    originalDescriptors.length = 0;
  });

  it('scrolls the timeline while the pointer is held near the right edge, and counts the scroll as movement', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskchange');
    const area = root.querySelector<HTMLElement>('.viewport')!;

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 400);
    pointer(bar(root, 'a'), 'pointermove', 590); // 10px from the right edge: inside the 56px zone
    await flush(150);
    expect(area.scrollLeft).toBeGreaterThan(40);
    const scrolled = area.scrollLeft;
    pointer(bar(root, 'a'), 'pointerup', 590);
    await flush();

    // the 190px of pointer movement plus what it scrolled: well beyond the 14 days of the pointer alone
    const start = String(seen[0].detail.start);
    const days = Math.round((Date.parse(start) - Date.parse('2026-03-02')) / 86400000);
    expect(days).toBe(Math.round((190 + scrolled) / 13));
    expect(days).toBeGreaterThan(15);
  });

  it('scrolls back while the pointer is held near the left edge of the timeline', async () => {
    const { root } = await mount();
    const area = root.querySelector<HTMLElement>('.viewport')!;
    area.scrollLeft = 500;

    grab(bar(root, 'b'));
    pointer(bar(root, 'b'), 'pointerdown', 450);
    pointer(bar(root, 'b'), 'pointermove', 380); // just right of the list: inside the zone
    await flush(150);

    expect(area.scrollLeft).toBeLessThan(500);
    pointer(bar(root, 'b'), 'pointercancel', 380);
  });

  it('does not scroll when the pointer is in the middle', async () => {
    const { root } = await mount();
    const area = root.querySelector<HTMLElement>('.viewport')!;

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 450);
    pointer(bar(root, 'a'), 'pointermove', 480);
    await flush(150);

    expect(area.scrollLeft).toBe(0);
    pointer(bar(root, 'a'), 'pointercancel', 480);
  });

  it('holds back the scroll re-render that would replace the bar being dragged', async () => {
    const { root } = await mount();
    const frame = root.querySelector('.frame');
    const area = root.querySelector<HTMLElement>('.viewport')!;

    grab(bar(root, 'a'));
    pointer(bar(root, 'a'), 'pointerdown', 400);
    pointer(bar(root, 'a'), 'pointermove', 420);
    area.scrollLeft = 1500; // far enough to ask for a render of the header window
    area.dispatchEvent(new Event('scroll'));
    await flush(80);
    expect(root.querySelector('.frame')).toBe(frame);
    expect(bar(root, 'a').classList.contains('dragging')).toBe(true);

    pointer(bar(root, 'a'), 'pointercancel', 420);
    await flush(80);
    expect(bar(root, 'a').classList.contains('dragging')).toBe(false);
  });
});
