import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-gantt';

const flush = () => new Promise((resolve) => setTimeout(resolve, 30));

const TASKS = [
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-13' },
  { id: 'b', label: 'Build', start: '2026-03-16', end: '2026-03-27' },
];

// jsdom has no layout, so a host's width is whatever the test says it is.
const mount = async (hostWidth: number, attrs: Record<string, string> = { zoom: 'week', 'week-start': '1' }) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  let width = hostWidth;
  Object.defineProperty(gantt, 'clientWidth', { get: () => width, configurable: true });
  gantt.setAttribute('tasks', JSON.stringify(TASKS));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot, resize: (next: number) => { width = next; } };
};

/** Right edge in px of the last cell in the header's bottom row. */
const headerEnd = (root: ParentNode) => {
  const ticks = [...root.querySelectorAll<HTMLElement>('.band.bottom .tick')];
  const last = ticks[ticks.length - 1];
  return parseFloat(last.style.left) + parseFloat(last.style.width);
};
const lastUnitLine = (root: ParentNode) =>
  Math.max(...[...root.querySelectorAll<HTMLElement>('.timeline-body .unit-line')].map((el) => parseFloat(el.style.left)));

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('ui-gantt timeline fills the frame', () => {
  it('lets the timeline track grow instead of stopping at the end of the data', async () => {
    const { root } = await mount(1700);
    const surface = root.querySelector<HTMLElement>('.surface')!;

    expect(surface.getAttribute('style')).toMatch(/grid-template-columns:var\(--gantt-grid-w\) minmax\([\d.]+px, 1fr\)/);
    // a fixed width on these two is what left the blank strip; they only have a floor now
    expect(root.querySelector<HTMLElement>('.timeline-body')!.style.minWidth).toMatch(/px$/);
    expect(root.querySelector<HTMLElement>('.timeline-body')!.style.width).toBe('');
    expect(root.querySelector<HTMLElement>('.scale')!.style.minWidth).toMatch(/px$/);
    expect(root.querySelector<HTMLElement>('.scale')!.style.width).toBe('');
  });

  it('draws the header and the grid lines out to the edge of a wide host', async () => {
    const narrow = await mount(0); // no layout: the data sets the width (680px minimum)
    expect(headerEnd(narrow.root)).toBeCloseTo(680, 0);
    expect(lastUnitLine(narrow.root)).toBeLessThan(680);

    document.body.innerHTML = '';
    const wide = await mount(1700);
    // 1700px host, 2px frame border, 376px task grid: 1322px of timeline
    expect(headerEnd(wide.root)).toBeCloseTo(1322, 0);
    expect(lastUnitLine(wide.root)).toBeGreaterThan(1250);
  });

  it('uses the narrow grid width when the host is narrow enough for the compact layout', async () => {
    // 640px frame or less -> the 148px grid, so a 1000px-frame calculation would be wrong here
    const compact = await mount(640 + 2);
    expect(headerEnd(compact.root)).toBeCloseTo(680, 0); // 642 - 2 - 148 = 492, below the 680px floor

    document.body.innerHTML = '';
    const full = await mount(641 + 2 + 800);
    expect(headerEnd(full.root)).toBeCloseTo(641 + 800 - 376, 0); // 1065
  });

  it('keeps up when the host is resized, and stops watching when it is removed', async () => {
    const observers: Array<{ cb: ResizeObserverCallback; disconnect: ReturnType<typeof vi.fn>; observed: Element[] }> = [];
    vi.stubGlobal('ResizeObserver', class {
      cb: ResizeObserverCallback;
      disconnect = vi.fn();
      observed: Element[] = [];
      constructor(cb: ResizeObserverCallback) {
        this.cb = cb;
        observers.push(this);
      }
      observe(el: Element) {
        this.observed.push(el);
      }
    });

    const { gantt, root, resize } = await mount(1000);
    expect(observers.length).toBe(1);
    expect(observers[0].observed).toEqual([gantt]);
    expect(headerEnd(root)).toBeCloseTo(680, 0); // 1000 - 2 - 376 = 622, below the floor

    resize(1500);
    observers[0].cb([{ contentRect: { width: 1500 } } as ResizeObserverEntry], observers[0] as unknown as ResizeObserver);
    await flush();
    expect(headerEnd(root)).toBeCloseTo(1122, 0);

    gantt.remove();
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  it('does not re-render for a resize callback that reports the width it already has', async () => {
    let callback: ResizeObserverCallback | null = null;
    vi.stubGlobal('ResizeObserver', class {
      constructor(cb: ResizeObserverCallback) {
        callback = cb;
      }
      observe() {}
      disconnect() {}
    });
    const { root } = await mount(1700);
    const before = root.querySelector('.surface');

    expect(callback).not.toBeNull(); // the host does register a resize observer
    callback!([{ contentRect: { width: 1700 } } as ResizeObserverEntry], {} as ResizeObserver);
    await flush();

    expect(root.querySelector('.surface')).toBe(before); // same node: no render happened
  });

  it('clips grid lines that run a scrollbar past the track, without clipping drag tips above the bars', async () => {
    const { root } = await mount(1700);
    const css = root.querySelector('style')!.textContent!;

    expect(css).toMatch(/\.timeline-body \{[^}]*overflow-x: clip;/);
  });
});
