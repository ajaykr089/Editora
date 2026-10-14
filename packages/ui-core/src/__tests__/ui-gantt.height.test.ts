import { afterEach, describe, expect, it, vi } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const make = (count: number) =>
  Array.from({ length: count }, (_, i) => ({ id: `t${i}`, label: `Task ${i}`, start: '2026-03-02', end: '2026-03-06' }));

const mount = async (attrs: Record<string, string> = {}, count = 4) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(make(count)));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};

afterEach(() => {
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
});

describe('ui-gantt height', () => {
  it('has a fill mode where the scroll area takes the height the container gives', async () => {
    const { root } = await mount({ fill: '' });
    const css = root.querySelector('style')!.textContent!;

    expect(css).toMatch(/:host\(\[fill\]\) \{\s*block-size: 100%;/);
    expect(css).toMatch(/:host\(\[fill\]\) \.frame \{[^}]*display: flex;[^}]*flex-direction: column;[^}]*block-size: 100%;/);
    expect(css).toMatch(/:host\(\[fill\]\) \.viewport \{[^}]*flex: 1 1 0;[^}]*min-block-size: 0;[^}]*max-block-size: none;/);
  });

  it('keeps the 620px cap without fill, and lets max-height change it', async () => {
    const plain = await mount();
    expect(plain.root.querySelector('style')!.textContent).toMatch(/\.viewport \{[^}]*max-block-size: var\(--ui-gantt-max-height, 620px\);/);
    expect(plain.root.querySelector<HTMLElement>('.frame')!.hasAttribute('style')).toBe(false);

    document.body.innerHTML = '';
    for (const value of ['480px', '60vh', '30rem', '75%', 'none']) {
      const { root } = await mount({ 'max-height': value });
      expect(root.querySelector<HTMLElement>('.frame')!.getAttribute('style')).toBe(`--ui-gantt-max-height:${value}`);
      document.body.innerHTML = '';
    }
  });

  it('ignores a max-height that is not a plain length, so it cannot carry other CSS', async () => {
    for (const bad of ['red', '12', 'calc(100vh - 80px)', '10px; color: red', '480px }', 'url(x)', '']) {
      const { root } = await mount({ 'max-height': bad });
      expect(root.querySelector<HTMLElement>('.frame')!.hasAttribute('style')).toBe(false);
      document.body.innerHTML = '';
    }
  });

  it('re-renders for a change of height only when fill is on or the rows are windowed by it', async () => {
    let callback: ResizeObserverCallback | null = null;
    vi.stubGlobal('ResizeObserver', class {
      constructor(cb: ResizeObserverCallback) {
        callback = cb;
      }
      observe() {}
      disconnect() {}
    });
    const resize = (height: number) => callback!([{ contentRect: { width: 0, height } } as ResizeObserverEntry], {} as ResizeObserver);

    // a small chart in auto height: its own height changes with its rows, which must not loop
    const plain = await mount();
    const plainRender = vi.spyOn(plain.gantt as unknown as { render: () => void }, 'render');
    resize(300);
    await flush();
    expect(plainRender).not.toHaveBeenCalled();

    // fill: the container decides the height
    document.body.innerHTML = '';
    const filled = await mount({ fill: '' });
    const filledRender = vi.spyOn(filled.gantt as unknown as { render: () => void }, 'render');
    resize(300);
    await flush();
    expect(filledRender).toHaveBeenCalledTimes(1);
    resize(300.4); // the same height to within a pixel
    await flush();
    expect(filledRender).toHaveBeenCalledTimes(1);

    // windowed rows: the window depends on the height
    document.body.innerHTML = '';
    const windowed = await mount({}, 1000);
    expect(windowed.root.querySelectorAll('.bar').length).toBeLessThan(1000);
    const windowedRender = vi.spyOn(windowed.gantt as unknown as { render: () => void }, 'render');
    resize(500);
    await flush();
    expect(windowedRender).toHaveBeenCalledTimes(1);
  });
});
