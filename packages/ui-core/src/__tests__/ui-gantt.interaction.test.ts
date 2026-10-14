import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = () => new Promise((resolve) => setTimeout(resolve, 30));

const TASKS = [
  { id: 'p1', label: 'Discovery', start: '2026-03-02', end: '2026-03-20', type: 'summary' },
  { id: 'a', label: 'Interviews', start: '2026-03-02', end: '2026-03-06', parent: 'p1', assignee: 'Ava' },
  { id: 'b', label: 'Requirements', start: '2026-03-09', end: '2026-03-13', parent: 'p1', assignee: 'Sam' },
  { id: 'c', label: 'Build', start: '2026-03-16', end: '2026-03-27', assignee: 'Kai' },
];

const mount = async (attrs: Record<string, string> = {}, tasks: unknown[] = TASKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return gantt;
};

const root = (gantt: HTMLElement) => gantt.shadowRoot as ShadowRoot;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt toolbar focus', () => {
  it('keeps focus and the caret in the filter box while the list re-renders', async () => {
    const gantt = await mount();
    const typed: string[] = [];
    gantt.addEventListener('filterchange', (event) => typed.push((event as CustomEvent).detail.filter));

    for (const text of ['r', 're', 'req']) {
      const input = root(gantt).querySelector<HTMLInputElement>('.control')!;
      input.focus();
      input.value = text;
      input.setSelectionRange(text.length, text.length);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await flush();
    }

    const input = root(gantt).querySelector<HTMLInputElement>('.control')!;
    expect(typed).toEqual(['r', 're', 'req']);
    expect(root(gantt).activeElement).toBe(input);
    expect(input.value).toBe('req');
    expect(input.selectionStart).toBe(3);
    expect(root(gantt).querySelectorAll('.grid-row').length).toBe(2); // Requirements and its summary
  });

  it('keeps focus on the zoom buttons and the sort header after they re-render', async () => {
    const gantt = await mount();

    const zoom = root(gantt).querySelector<HTMLButtonElement>('.zoom-button[data-zoom="month"]')!;
    zoom.focus();
    zoom.click();
    await flush();
    expect(root(gantt).activeElement).toBe(root(gantt).querySelector('.zoom-button[data-zoom="month"]'));

    const header = root(gantt).querySelector<HTMLButtonElement>('.head-button[data-sort="label"]')!;
    header.focus();
    header.click();
    await flush();
    expect(root(gantt).activeElement).toBe(root(gantt).querySelector('.head-button[data-sort="label"]'));
  });
});

const press = (target: Element, key: string, init: KeyboardEventInit = {}) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));

const bar = (gantt: HTMLElement, id: string) => root(gantt).querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!;

describe('ui-gantt keyboard editing', () => {
  it('keeps focus on the bar so arrow keys can be pressed more than once', async () => {
    const gantt = await mount();
    const changes: Array<{ id: string; start: string; end: string }> = [];
    gantt.addEventListener('taskchange', (event) => changes.push((event as CustomEvent).detail));

    bar(gantt, 'a').focus();
    press(bar(gantt, 'a'), 'ArrowRight');
    await flush();
    expect(root(gantt).activeElement).toBe(bar(gantt, 'a'));

    press(bar(gantt, 'a'), 'ArrowRight');
    await flush();
    press(bar(gantt, 'a'), 'ArrowRight', { shiftKey: true });
    await flush();

    expect(changes).toEqual([
      { id: 'a', start: '2026-03-03', end: '2026-03-07' },
      { id: 'a', start: '2026-03-04', end: '2026-03-08' },
      { id: 'a', start: '2026-03-04', end: '2026-03-09' },
    ]);
    expect(root(gantt).activeElement).toBe(bar(gantt, 'a'));
  });

  it('moves focus to the next row with the arrow keys and keeps it there', async () => {
    const gantt = await mount();

    bar(gantt, 'a').focus();
    press(bar(gantt, 'a'), 'ArrowDown');
    await flush();
    expect(root(gantt).activeElement).toBe(bar(gantt, 'b'));

    press(bar(gantt, 'b'), 'ArrowDown');
    await flush();
    expect(root(gantt).activeElement).toBe(bar(gantt, 'c'));

    press(bar(gantt, 'c'), 'ArrowUp');
    await flush();
    expect(root(gantt).activeElement).toBe(bar(gantt, 'b'));
  });

  it('keeps focus on the expand button after it collapses a branch', async () => {
    const gantt = await mount();
    const toggle = root(gantt).querySelector<HTMLButtonElement>('.expander[data-task-id="p1"]')!;

    toggle.focus();
    toggle.click();
    await flush();

    expect(root(gantt).querySelectorAll('.grid-row').length).toBe(2);
    expect(root(gantt).activeElement).toBe(root(gantt).querySelector('.expander[data-task-id="p1"]'));
  });
});

describe('ui-gantt keyboard navigation reaches every bar', () => {
  it('moves off a summary bar, which is the first and only Tab stop', async () => {
    const gantt = await mount();
    const stops = [...root(gantt).querySelectorAll<HTMLElement>('.bar')].filter((el) => el.tabIndex === 0);
    expect(stops.map((el) => el.dataset.taskId)).toEqual(['p1']);

    bar(gantt, 'p1').focus();
    press(bar(gantt, 'p1'), 'ArrowDown');
    await flush();
    expect(root(gantt).activeElement).toBe(bar(gantt, 'a'));

    bar(gantt, 'c').focus();
    press(bar(gantt, 'c'), 'ArrowUp');
    await flush();
    press(bar(gantt, 'b'), 'ArrowUp');
    await flush();
    press(bar(gantt, 'a'), 'ArrowUp');
    await flush();
    expect(root(gantt).activeElement).toBe(bar(gantt, 'p1'));
  });

  it('still navigates and selects in a read-only chart, without editing anything', async () => {
    const gantt = await mount({ readonly: '' });
    const events: string[] = [];
    for (const name of ['taskchange', 'taskdelete', 'taskselect']) {
      gantt.addEventListener(name, (event) => events.push(`${name}:${(event as CustomEvent).detail.id}`));
    }

    bar(gantt, 'a').focus();
    press(bar(gantt, 'a'), 'ArrowDown');
    await flush();
    expect(root(gantt).activeElement).toBe(bar(gantt, 'b'));

    press(bar(gantt, 'b'), 'ArrowRight');
    press(bar(gantt, 'b'), 'Delete');
    await flush();
    expect(events).toEqual(['taskselect:b']);
  });

  it('navigates through a read-only task but never moves or deletes it', async () => {
    const tasks = TASKS.map((task) => (task.id === 'b' ? { ...task, readonly: true } : task));
    const gantt = await mount({}, tasks);
    const events: string[] = [];
    for (const name of ['taskchange', 'taskdelete']) {
      gantt.addEventListener(name, (event) => events.push(name));
    }

    bar(gantt, 'a').focus();
    press(bar(gantt, 'a'), 'ArrowDown');
    await flush();
    expect(root(gantt).activeElement).toBe(bar(gantt, 'b'));

    press(bar(gantt, 'b'), 'ArrowRight');
    press(bar(gantt, 'b'), 'Delete');
    press(bar(gantt, 'b'), 'ArrowDown');
    await flush();
    expect(events).toEqual([]);
    expect(root(gantt).activeElement).toBe(bar(gantt, 'c'));
  });
});
