import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const TASKS = [
  { id: 'p', label: 'Phase', start: '2026-03-02', end: '2026-03-20', type: 'summary', progress: 60 },
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-06', parent: 'p', progress: 40, assignee: 'Ava' },
  { id: 'm', label: 'Launch', start: '2026-03-20', type: 'milestone', parent: 'p' },
];

const mount = async (attrs: Record<string, string> = {}, hostWidth = 0) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  if (hostWidth) Object.defineProperty(gantt, 'clientWidth', { get: () => hostWidth, configurable: true });
  gantt.setAttribute('tasks', JSON.stringify(TASKS));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};

const headers = (root: ParentNode) => [...root.querySelectorAll('[role="columnheader"]')].map((el) => el.textContent!.trim());
const cells = (root: ParentNode, id: string) => [...root.querySelectorAll(`.grid-row[data-task-id="${id}"] .grid-cell`)].map((el) => el.textContent!.replace(/\s+/g, ' ').trim());
const short = (m: number, d: number) => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(2026, m - 1, d));
const layoutCss = (root: ParentNode) => [...root.querySelectorAll('style')].map((s) => s.textContent).filter((c) => c!.startsWith('@container'));

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt columns', () => {
  it('shows name, owner, dates and progress by default, as before', async () => {
    const { root } = await mount();

    expect(headers(root)).toEqual(['Task', 'Owner', 'Dates', '%']);
    expect(cells(root, 'a')).toEqual(['Design', 'Ava', `${short(3, 2)} - ${short(3, 6)}`, '40%']);
    expect(root.querySelector('[role="treegrid"]')!.getAttribute('aria-colcount')).toBe('4');
    expect(layoutCss(root)).toEqual([]); // the stylesheet defaults are the default layout
  });

  it('shows the columns asked for, in that order', async () => {
    const { root } = await mount({ columns: JSON.stringify(['label', 'start', 'end', 'duration', 'progress']) });

    expect(headers(root)).toEqual(['Task', 'Start', 'End', 'Days', '%']);
    expect(cells(root, 'a')).toEqual(['Design', short(3, 2), short(3, 6), '4', '40%']);
    expect(cells(root, 'm')).toEqual(['Launch', short(3, 20), '-', '-', '-']);
    expect(root.querySelector('[role="treegrid"]')!.getAttribute('aria-colcount')).toBe('5');
    // 170 + 74 + 74 + 56 + 44
    expect(layoutCss(root)[0]).toContain('--gantt-grid-w: 418px');
    expect(layoutCss(root)[0]).toContain('--gantt-cols: minmax(170px, 1fr) 74px 74px 56px 44px');
  });

  it('takes a header label and a width for a column', async () => {
    const { root } = await mount({ columns: JSON.stringify(['label', { key: 'dates', label: 'When', width: 120 }]) });

    expect(headers(root)).toEqual(['Task', 'When']);
    expect(layoutCss(root)[0]).toContain('--gantt-cols: minmax(170px, 1fr) 120px');
  });

  it('puts the name column first and drops unknown and repeated keys', async () => {
    const { root } = await mount({ columns: JSON.stringify(['progress', 'bogus', 'label', 'owner', 'progress', 42, null]) });

    expect(headers(root)).toEqual(['Task', '%', 'Owner']);
  });

  it('adds the name column when it is left out', async () => {
    const { root } = await mount({ columns: JSON.stringify(['dates']) });

    expect(headers(root)).toEqual(['Task', 'Dates']);
  });

  it('falls back to the default columns for malformed or empty values', async () => {
    for (const bad of ['{nope', '[]', '"x"', 'null', '{}']) {
      document.body.innerHTML = '';
      const { root } = await mount({ columns: bad });
      expect(headers(root)).toEqual(['Task', 'Owner', 'Dates', '%']);
    }
  });

  it('sorts from the header of any sortable column', async () => {
    const { gantt, root } = await mount({ columns: JSON.stringify(['label', 'end']) });
    const sorts: string[] = [];
    gantt.addEventListener('sortchange', (event) => sorts.push((event as CustomEvent).detail.sort));

    root.querySelector<HTMLButtonElement>('.head-button[data-sort="end"]')!.click();
    await flush();

    expect(sorts).toEqual(['end']);
    expect(root.querySelector('[role="columnheader"][aria-sort="ascending"]')!.textContent!.trim()).toBe('End');
    expect(root.querySelector('.head-button[data-sort="start"]')).toBeNull();
  });

  it('keeps a column that cannot sort as a plain header', async () => {
    const { root } = await mount({ columns: JSON.stringify(['label', 'duration']) });

    expect(root.querySelectorAll('.head-button').length).toBe(1);
    expect(headers(root)).toEqual(['Task', 'Days']);
  });

  it('re-renders when the columns change', async () => {
    const { gantt, root } = await mount();
    gantt.setAttribute('columns', JSON.stringify(['label', 'progress']));
    await flush();

    expect(headers(root)).toEqual(['Task', '%']);
    expect(cells(root, 'a')).toEqual(['Design', '40%']);
  });

  it('counts one column for a narrow host, where only the name is shown, and all of them otherwise', async () => {
    expect((await mount({}, 600)).root.querySelector('[role="treegrid"]')!.getAttribute('aria-colcount')).toBe('1');
    document.body.innerHTML = '';
    expect((await mount({}, 900)).root.querySelector('[role="treegrid"]')!.getAttribute('aria-colcount')).toBe('4');
    document.body.innerHTML = '';
    expect((await mount({ columns: JSON.stringify(['label', 'start', 'end']) }, 900)).root.querySelector('[role="treegrid"]')!.getAttribute('aria-colcount')).toBe('3');
    document.body.innerHTML = '';
    expect((await mount()).root.querySelector('[role="treegrid"]')!.getAttribute('aria-colcount')).toBe('4'); // width unknown
  });

  it('translates a column header through the labels', async () => {
    const { root } = await mount({ columns: JSON.stringify(['label', 'duration']), labels: JSON.stringify({ columnDuration: 'Jours' }) });

    expect(headers(root)).toEqual(['Task', 'Jours']);
  });
});

describe('ui-gantt grid width', () => {
  it('uses the grid-width attribute, keeping the name column a flexible 96px or more', async () => {
    const { root } = await mount({ 'grid-width': '340' });

    expect(layoutCss(root)[0]).toContain('--gantt-grid-w: 340px');
    expect(layoutCss(root)[0]).toContain('--gantt-cols: minmax(96px, 1fr) 82px 80px 44px');
  });

  it('never goes below the other columns plus the 96px the name keeps', async () => {
    const { root } = await mount({ 'grid-width': '100' });

    expect(layoutCss(root)[0]).toContain('--gantt-grid-w: 302px'); // 82 + 80 + 44 + 96
  });

  it('ignores a width that is not a positive number', async () => {
    for (const bad of ['abc', '0', '-5', '']) {
      document.body.innerHTML = '';
      const { root } = await mount({ 'grid-width': bad });
      expect(layoutCss(root)).toEqual([]);
    }
  });

  it('is what fit leaves room for beside the task list', async () => {
    const { root } = await mount({ zoom: 'fit', 'grid-width': '500' }, 1200);

    // 1200px host - 2px frame border - 500px list; the 30 days of the project fill it
    expect(parseFloat(root.querySelector<HTMLElement>('.timeline-body')!.style.minWidth)).toBeCloseTo(698, 0);
  });
});

describe('ui-gantt splitter', () => {
  const splitter = (root: ParentNode) => root.querySelector<HTMLElement>('.splitter[role="separator"]')!;
  const press = (target: Element, key: string, init: KeyboardEventInit = {}) => target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));

  it('is a focusable vertical separator with its value, and an aria-hidden twin down the body', async () => {
    const { root } = await mount();

    expect(splitter(root).getAttribute('aria-orientation')).toBe('vertical');
    expect(splitter(root).getAttribute('aria-label')).toBe('Resize the task list');
    expect(splitter(root).getAttribute('aria-valuenow')).toBe('376');
    expect(splitter(root).getAttribute('aria-valuemin')).toBe('302');
    expect(splitter(root).tabIndex).toBe(0);
    const twin = root.querySelector<HTMLElement>('.splitter-rail.body .splitter')!;
    expect(twin.getAttribute('aria-hidden')).toBe('true');
    expect(twin.hasAttribute('tabindex')).toBe(false);
    // not inside the treegrid, whose rows and headers are all it may contain
    expect(root.querySelector('[role="treegrid"]')!.contains(splitter(root))).toBe(false);
  });

  it('resizes the list with the arrow keys, Shift for bigger steps, and reports it', async () => {
    const { gantt, root } = await mount();
    const widths: number[] = [];
    gantt.addEventListener('gridresize', (event) => widths.push((event as CustomEvent).detail.width));

    splitter(root).focus();
    press(splitter(root), 'ArrowRight');
    await flush();
    expect(gantt.getAttribute('grid-width')).toBe('392');
    expect(root.activeElement).toBe(splitter(root)); // focus survives the re-render

    press(splitter(root), 'ArrowLeft', { shiftKey: true });
    await flush();
    expect(gantt.getAttribute('grid-width')).toBe('328');

    press(splitter(root), 'Home');
    await flush();
    expect(gantt.getAttribute('grid-width')).toBe('302');
    expect(widths).toEqual([392, 328, 302]);
  });

  it('stops at the largest width, and does not report a press that changes nothing', async () => {
    const { gantt, root } = await mount();
    const widths: number[] = [];
    gantt.addEventListener('gridresize', (event) => widths.push((event as CustomEvent).detail.width));

    press(splitter(root), 'End');
    await flush();
    const max = Number(gantt.getAttribute('grid-width'));
    expect(max).toBe(1200); // the ceiling when the host's width is not known

    press(splitter(root), 'ArrowRight');
    press(splitter(root), 'ArrowRight');
    await flush();
    expect(gantt.getAttribute('grid-width')).toBe(String(max));
    expect(widths).toEqual([max]);
  });

  it('follows a drag live, and keeps the width when it is let go', async () => {
    const { gantt, root } = await mount();
    const handle = root.querySelector<HTMLElement>('.splitter-rail.body .splitter')!;
    handle.setPointerCapture = () => {}; // jsdom has none
    const fire = (type: string, clientX: number) => {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      handle.dispatchEvent(event);
    };

    fire('pointerdown', 400);
    fire('pointermove', 460);
    expect(root.querySelector<HTMLElement>('.surface')!.style.getPropertyValue('--gantt-grid-w')).toBe('436px');
    expect(handle.classList.contains('dragging')).toBe(true);

    fire('pointerup', 460);
    await flush();
    expect(gantt.getAttribute('grid-width')).toBe('436');
  });

  it('puts a cancelled drag back', async () => {
    const { gantt, root } = await mount();
    const handle = root.querySelector<HTMLElement>('.splitter-rail.body .splitter')!;
    handle.setPointerCapture = () => {};
    const fire = (type: string, clientX: number) => {
      const event = new MouseEvent(type, { bubbles: true, cancelable: true, button: 0, clientX });
      Object.defineProperty(event, 'pointerId', { value: 1 });
      handle.dispatchEvent(event);
    };

    fire('pointerdown', 400);
    fire('pointermove', 480);
    fire('pointercancel', 480);

    expect(gantt.hasAttribute('grid-width')).toBe(false);
    expect(root.querySelector<HTMLElement>('.surface')!.style.getPropertyValue('--gantt-grid-w')).toBe('');
  });

  it('is hidden in a narrow host, which has no room to resize the list', async () => {
    const { root } = await mount();
    const css = root.querySelector('style')!.textContent!;

    expect(css).toMatch(/@container ui-gantt \(max-width: 640px\) \{[\s\S]*?\.splitter-rail \{\s*display: none;/);
  });
});
