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
