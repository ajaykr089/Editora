import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const TASKS = [
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-13' },
  { id: 'b', label: 'Build', start: '2026-03-16', end: '2026-03-27' },
];

const mount = async (attrs: Record<string, string> = {}) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(TASKS));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};

/** A render that changes nothing, as a resize callback or a repeated attribute write can cause. */
const renderAgain = async (gantt: HTMLElement, times = 2) => {
  for (let i = 0; i < times; i += 1) {
    (gantt as unknown as { requestRender: () => void }).requestRender();
    await flush();
  }
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('ui-gantt after a render that changes nothing', () => {
  it('moves a task one day per arrow press, not one per render', async () => {
    const { gantt, root } = await mount();
    await renderAgain(gantt);
    const changes: unknown[] = [];
    gantt.addEventListener('taskchange', (event) => changes.push((event as CustomEvent).detail));

    const bar = root.querySelector<HTMLElement>('.bar[data-task-id="a"]')!;
    bar.focus();
    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();

    expect(changes).toEqual([{ id: 'a', start: '2026-03-03', end: '2026-03-14' }]);
  });

  it('reports one filterchange per input', async () => {
    const { gantt, root } = await mount();
    await renderAgain(gantt);
    const filters: string[] = [];
    gantt.addEventListener('filterchange', (event) => filters.push((event as CustomEvent).detail.filter));

    const input = root.querySelector<HTMLInputElement>('.control')!;
    input.value = 'des';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await flush();

    expect(filters).toEqual(['des']);
  });

  it('reports one zoomchange, one sortchange and one taskselect per action', async () => {
    const { gantt, root } = await mount();
    await renderAgain(gantt);
    const seen: string[] = [];
    for (const name of ['zoomchange', 'sortchange', 'taskselect']) {
      gantt.addEventListener(name, (event) => seen.push(`${name}:${JSON.stringify((event as CustomEvent).detail)}`));
    }

    root.querySelector<HTMLButtonElement>('.zoom-button[data-zoom="month"]')!.click();
    await flush();
    root.querySelector<HTMLButtonElement>('.head-button[data-sort="label"]')!.click();
    await flush();
    root.querySelector<HTMLElement>('.bar[data-task-id="b"]')!.click();
    await flush();

    expect(seen).toEqual(['zoomchange:{"zoom":"month"}', 'sortchange:{"sort":"label"}', 'taskselect:{"id":"b"}']);
  });

  it('ends a drag once, with one taskchange', async () => {
    const { gantt, root } = await mount({ zoom: 'week' });
    await renderAgain(gantt);
    const changes: unknown[] = [];
    gantt.addEventListener('taskchange', (event) => changes.push((event as CustomEvent).detail));

    const bar = root.querySelector<HTMLElement>('.bar[data-task-id="a"]')!;
    bar.setPointerCapture = () => {}; // jsdom has none
    const fire = (type: string, clientX: number) => {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      bar.dispatchEvent(event);
    };
    fire('pointerdown', 100);
    fire('pointermove', 126); // two days at 13px a day
    fire('pointerup', 126);
    await flush();

    expect(changes).toEqual([{ id: 'a', start: '2026-03-04', end: '2026-03-15' }]);
  });

  it('keeps the same tree, so the listeners it has are the only ones', async () => {
    const { gantt, root } = await mount();
    const frame = root.querySelector('.frame');

    await renderAgain(gantt, 3);

    expect(root.querySelector('.frame')).toBe(frame);
  });

  it('does not re-render for a resize callback that is a fraction of a pixel off the host width', async () => {
    let callback: ResizeObserverCallback | null = null;
    vi.stubGlobal('ResizeObserver', class {
      constructor(cb: ResizeObserverCallback) {
        callback = cb;
      }
      observe() {}
      disconnect() {}
    });
    const gantt = document.createElement('ui-gantt') as HTMLElement;
    Object.defineProperty(gantt, 'clientWidth', { get: () => 541, configurable: true }); // the layout's whole number
    gantt.setAttribute('tasks', JSON.stringify(TASKS));
    document.body.appendChild(gantt);
    await flush();
    const root = gantt.shadowRoot as ShadowRoot;
    const render = vi.spyOn(gantt as unknown as { render: () => void }, 'render');

    callback!([{ contentRect: { width: 540.4 } } as ResizeObserverEntry], {} as ResizeObserver);
    await flush();
    expect(render).not.toHaveBeenCalled();

    callback!([{ contentRect: { width: 700.2 } } as ResizeObserverEntry], {} as ResizeObserver);
    await flush();
    expect(render).toHaveBeenCalledTimes(1); // a real change still renders
  });
});
