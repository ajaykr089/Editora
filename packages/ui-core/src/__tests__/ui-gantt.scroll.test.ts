import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms));

const make = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: `t${i}`, label: `Task ${i}`, start: '2026-03-02', end: '2026-06-30' }));

const original: Array<[object, string, PropertyDescriptor | undefined]> = [];
const stub = (target: object, name: string, descriptor: PropertyDescriptor) => {
  original.push([target, name, Object.getOwnPropertyDescriptor(target, name)]);
  Object.defineProperty(target, name, { configurable: true, ...descriptor });
};

const mount = async (count: number, attrs: Record<string, string> = {}) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(make(count)));
  gantt.setAttribute('zoom', 'day');
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const area = (root: ParentNode) => root.querySelector<HTMLElement>('.viewport')!;
const scrollTo = (root: ParentNode, left: number, top = 0) => {
  area(root).scrollLeft = left;
  area(root).scrollTop = top;
  area(root).dispatchEvent(new Event('scroll'));
};

beforeEach(() => {
  // a 600 x 400 scroll area over a 5000 x 20000 surface
  const onViewport = (size: number) => ({ get(this: Element) { return this.classList?.contains('viewport') ? size : 0; } });
  stub(Element.prototype, 'clientWidth', onViewport(600));
  stub(Element.prototype, 'clientHeight', onViewport(400));
  stub(Element.prototype, 'scrollWidth', onViewport(5000));
  stub(Element.prototype, 'scrollHeight', onViewport(20000));
});
afterEach(() => {
  document.body.innerHTML = '';
  for (const [target, name, descriptor] of original.reverse()) {
    if (descriptor) Object.defineProperty(target, name, descriptor);
    else delete (target as Record<string, unknown>)[name];
  }
  original.length = 0;
  vi.restoreAllMocks();
});

describe('ui-gantt scrolling does not rebuild the chart for nothing', () => {
  it('leaves a small chart alone while it is scrolled a little', async () => {
    const { gantt, root } = await mount(6);
    const render = vi.spyOn(gantt as unknown as { render: () => void }, 'render');

    for (const left of [10, 40, 90, 150, 220, 300]) scrollTo(root, left);
    await flush();

    expect(render).not.toHaveBeenCalled();
  });

  it('builds the header cells again once the view has moved far from where they were built, even in small steps', async () => {
    const { gantt, root } = await mount(6);
    const render = vi.spyOn(gantt as unknown as { render: () => void }, 'render');
    const firstLabel = () => root.querySelector('.band.bottom .tick .num')!.textContent;
    const before = firstLabel();

    // a wheel or the scrollbar: many small events that add up
    for (let left = 50; left <= 700; left += 50) scrollTo(root, left);
    await flush();

    expect(render).toHaveBeenCalled();
    expect(firstLabel()).not.toBe(before); // the cells now start further along
    // and the new window covers the view: 700px is 19 days of 36px
    const cells = [...root.querySelectorAll<HTMLElement>('.band.bottom .tick')];
    expect(parseFloat(cells[cells.length - 1].style.left)).toBeGreaterThan(700 + 600);
  });

  it('keeps the header cells covering the view of a long chart scrolled sideways in small steps (rows need nothing)', async () => {
    const { gantt, root } = await mount(1000);
    scrollTo(root, 0, 42 * 500); // down to the middle of the rows: the rows window is built and no longer asks for a render
    await flush();
    const render = vi.spyOn(gantt as unknown as { render: () => void }, 'render');
    const firstLabel = () => root.querySelector('.band.bottom .tick .num')!.textContent;
    const before = firstLabel();

    for (let left = 50; left <= 700; left += 50) scrollTo(root, left, 42 * 500);
    await flush();

    expect(render).toHaveBeenCalled();
    expect(firstLabel()).not.toBe(before);
  });

  it('still rebuilds the rows window of a long chart as it is scrolled down', async () => {
    const { gantt, root } = await mount(1000);
    const render = vi.spyOn(gantt as unknown as { render: () => void }, 'render');

    scrollTo(root, 0, 42 * 700);
    await flush();

    expect(render).toHaveBeenCalled();
    expect(root.querySelector('.grid-row[data-task-id="t700"]')).not.toBeNull();
  });

  it('does not put the scroll position back on a scroll area that was not replaced', async () => {
    const { gantt, root } = await mount(6);
    let writes = 0;
    Object.defineProperty(area(root), 'scrollLeft', {
      configurable: true,
      get: () => 123,
      set: () => {
        writes += 1;
      },
    });

    (gantt as unknown as { requestRender: () => void }).requestRender(); // same markup: the tree is kept
    await flush();

    expect(area(root)).toBe(root.querySelector('.viewport'));
    expect(writes).toBe(0);
  });

  it('puts it back on a new scroll area', async () => {
    const { gantt, root } = await mount(6);
    scrollTo(root, 200);
    const old = area(root);

    gantt.setAttribute('labels', JSON.stringify({ title: 'Changed' })); // new markup: a new tree
    await flush();

    expect(area(root)).not.toBe(old);
    expect(area(root).scrollLeft).toBe(200);
  });
});

describe('ui-gantt smooth scrolling survives a render', () => {
  const smooth = async () => {
    const calls: Array<{ left?: number; top?: number; behavior?: string }> = [];
    stub(Element.prototype, 'scrollTo', { value: function (this: Element, options: { left?: number; top?: number; behavior?: string }) { calls.push({ ...options }); } });
    const { gantt, root } = await mount(6);
    return { gantt, root, calls };
  };

  it('starts a smooth scroll and carries on with it when the scroll area is replaced', async () => {
    const { gantt, root, calls } = await smooth();

    (gantt as unknown as { scrollToDate: (d: string, o: object) => void }).scrollToDate('2026-04-20', { behavior: 'smooth', align: 'start' });
    expect(calls.length).toBe(1);
    expect(calls[0].behavior).toBe('smooth');
    const target = calls[0].left;

    gantt.setAttribute('labels', JSON.stringify({ title: 'Changed' })); // a render that replaces the tree, mid-scroll
    await flush();

    expect(calls.length).toBe(2);
    expect(calls[1]).toEqual({ left: target, behavior: 'smooth' });
    expect(root.querySelector('.viewport')).toBeTruthy();
  });

  it('forgets it once the scroll has arrived', async () => {
    const { gantt, root, calls } = await smooth();
    (gantt as unknown as { scrollToDate: (d: string, o: object) => void }).scrollToDate('2026-04-20', { behavior: 'smooth', align: 'start' });

    scrollTo(root, calls[0].left as number); // arrives
    gantt.setAttribute('labels', JSON.stringify({ title: 'Changed' }));
    await flush();

    expect(calls.length).toBe(1);
  });

  it('forgets it when the user takes over with the wheel', async () => {
    const { gantt, root, calls } = await smooth();
    (gantt as unknown as { scrollToDate: (d: string, o: object) => void }).scrollToDate('2026-04-20', { behavior: 'smooth', align: 'start' });

    area(root).dispatchEvent(new Event('wheel'));
    gantt.setAttribute('labels', JSON.stringify({ title: 'Changed' }));
    await flush();

    expect(calls.length).toBe(1);
  });

  it('does not keep an instant scroll as a target', async () => {
    const { gantt, calls } = await smooth();
    (gantt as unknown as { scrollToDate: (d: string, o: object) => void }).scrollToDate('2026-04-20', { behavior: 'auto' });
    gantt.setAttribute('labels', JSON.stringify({ title: 'Changed' }));
    await flush();

    expect(calls.filter((c) => c.behavior === 'smooth').length).toBe(0);
  });
});
