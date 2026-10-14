import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = () => new Promise((resolve) => setTimeout(resolve, 30));

const mount = async (tasks: unknown[], attrs: Record<string, string> = {}) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return gantt.shadowRoot as ShadowRoot;
};

const bar = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!;
const fills = (root: ParentNode, id: string) =>
  [...bar(root, id).querySelectorAll<HTMLElement>('.split-segment .progress')].map((el) =>
    parseFloat(el.style.getPropertyValue('--progress'))
  );

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt progress on the bar', () => {
  it('sizes the fill from the task progress and marks only finished bars as complete', async () => {
    const root = await mount([
      { id: 'half', label: 'Half', start: '2026-03-02', end: '2026-03-12', progress: 50 },
      { id: 'done', label: 'Done', start: '2026-03-02', end: '2026-03-12', progress: 100 },
      { id: 'none', label: 'None', start: '2026-03-02', end: '2026-03-12' },
    ]);

    // the bar carries --progress and its .progress child inherits it
    expect(bar(root, 'half').style.getPropertyValue('--progress')).toBe('50.00%');
    expect(bar(root, 'half').querySelectorAll(':scope > .progress').length).toBe(1);
    expect(bar(root, 'half').getAttribute('data-progress')).toBe('50');
    expect(bar(root, 'half').classList.contains('complete')).toBe(false);

    expect(bar(root, 'done').classList.contains('complete')).toBe(true);

    expect(bar(root, 'none').hasAttribute('data-progress')).toBe(false);
    expect(bar(root, 'none').classList.contains('complete')).toBe(false);
  });

  it('draws the fill as a solid shade, not the old 30%-opacity fade', async () => {
    const root = await mount([{ id: 'a', label: 'A', start: '2026-03-02', end: '2026-03-12', progress: 40 }]);
    const css = root.querySelector('style')!.textContent!;
    const rule = /\n  \.progress \{([^}]*)\}/.exec(css)![1];

    expect(rule).not.toMatch(/opacity/);
    expect(rule).toMatch(/color-mix\(in srgb, var\(--tone, var\(--ui-gantt-accent\)\) 58%, #0b1220\)/);
    expect(rule).toMatch(/inset -2px 0 0/); // the light edge where the fill stops
  });
});

describe('ui-gantt progress on a split bar', () => {
  // 10 days with a 2-day part and a 6-day part (8 days of work, two days of gap).
  const split = (extra: Record<string, unknown> = {}, segments = [
    { start: '2026-03-02', end: '2026-03-04' },
    { start: '2026-03-06', end: '2026-03-12' },
  ]) => ({ id: 's', label: 'Split', start: '2026-03-02', end: '2026-03-12', segments, ...extra });

  it('fills the parts in order from the overall progress, weighted by length', async () => {
    const root = await mount([split({ progress: 50 })]);

    // 50% of 8 working days is 4 days: the 2-day part is done, 2 of the 6 days of the next one
    expect(fills(root, 's')).toEqual([100, expect.closeTo(33.33, 1)]);
  });

  it('shows no fill when there is no progress', async () => {
    const root = await mount([split()]);

    expect(fills(root, 's')).toEqual([0, 0]);
  });

  it('uses the progress a part carries itself, and shares the rest among the other parts', async () => {
    const root = await mount([
      split({ progress: 50 }, [
        { start: '2026-03-02', end: '2026-03-04', progress: 25 } as never,
        { start: '2026-03-06', end: '2026-03-12' },
      ]),
    ]);

    // the second part is the only one without its own progress: 50% of its 6 days
    expect(fills(root, 's')).toEqual([25, 50]);
  });

  it('puts each fill inside its part and none across the gap', async () => {
    const root = await mount([split({ progress: 50 })]);

    expect(bar(root, 's').classList.contains('split')).toBe(true);
    expect(bar(root, 's').querySelectorAll('.split-segment').length).toBe(2);
    // the bar-level fill still exists (hidden by CSS for split bars), so the parts must not rely on it
    expect(bar(root, 's').querySelectorAll(':scope > .progress').length).toBe(1);
    expect(root.querySelector('style')!.textContent).toMatch(/\.bar\.split > \.progress \{\s*display: none;/);
  });

  it('clips a part to the task dates and skips parts outside them', async () => {
    const root = await mount([
      split({ progress: 100 }, [
        { start: '2026-02-20', end: '2026-03-04' }, // starts before the task
        { start: '2026-04-01', end: '2026-04-05' }, // entirely after it
      ]),
    ]);

    expect(bar(root, 's').querySelectorAll('.split-segment').length).toBe(1);
    expect(fills(root, 's')).toEqual([100]);
  });

  it('marks a part that is fully done, so it gets no edge line', async () => {
    const root = await mount([
      { id: 's', label: 'Split', start: '2026-03-02', end: '2026-03-12', progress: 50,
        segments: [{ start: '2026-03-02', end: '2026-03-04' }, { start: '2026-03-06', end: '2026-03-12' }] },
    ]);

    const parts = [...bar(root, 's').querySelectorAll('.split-segment .progress')];
    expect(parts.map((el) => el.classList.contains('full'))).toEqual([true, false]);
  });

  it('gives the parts of a split bar the look of the bar variant', async () => {
    const root = await mount([{ id: 'a', label: 'A', start: '2026-03-02', end: '2026-03-12' }], { 'bar-variant': 'outline' });
    const css = root.querySelector('style')!.textContent!;

    for (const variant of ['soft', 'striped', 'outline', 'glass']) {
      expect(css).toContain(`:host([bar-variant="${variant}"]) .split-segment`);
    }
    expect(css).toMatch(/:host\(\[bar-variant\]\) \.bar\.split \{\s*background: transparent;/);
  });
});
