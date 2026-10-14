import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const TASKS = [
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-06' },
  { id: 'b', label: 'Build', start: '2026-03-06', end: '2026-03-10' },
  { id: 'c', label: 'Ship', start: '2026-03-10', end: '2026-03-16' },
  { id: 'x', label: 'Docs', start: '2026-03-02', end: '2026-03-05' },
  { id: 'y', label: 'Review', start: '2026-03-05', end: '2026-03-08' },
];
const LINKS = [
  { id: 'ab', source: 'a', target: 'b' },
  { id: 'bc', source: 'b', target: 'c' },
  { id: 'xy', source: 'x', target: 'y' },
];

const mount = async (attrs: Record<string, string> = {}, tasks: unknown[] = TASKS, links: unknown[] = LINKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  gantt.setAttribute('links', JSON.stringify(links));
  gantt.setAttribute('zoom', 'week');
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const critical = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('.bar.critical')].map((el) => el.dataset.taskId).sort();

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt critical-path', () => {
  it('draws a critical bar in the danger tone whatever tone the task has', async () => {
    const { root } = await mount({}, [{ id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-06', tone: 'success', critical: true }], []);
    // The inline `--tone` of a bar would otherwise beat the `.bar.critical` rule and keep the bar blue or green.
    expect(root.querySelector('.bar[data-task-id="a"]')?.getAttribute('style')).toContain('--tone:var(--ui-color-danger');
  });

  it('marks nothing on its own', async () => {
    expect(critical((await mount()).root)).toEqual([]);
  });

  it('marks the tasks on the longest tight chain, and not the shorter one', async () => {
    const { root } = await mount({ 'critical-path': '' });

    expect(critical(root)).toEqual(['a', 'b', 'c']);
    expect(root.querySelector('.bar[data-task-id="b"]')!.getAttribute('aria-label')).toMatch(/, critical$/);
    expect(root.querySelector('.bar[data-task-id="x"]')!.getAttribute('aria-label')).not.toMatch(/critical/);
  });

  it('keeps a critical flag the data sets, whatever the links say', async () => {
    const flagged = TASKS.map((t) => (t.id === 'y' ? { ...t, critical: true } : t));
    const { root } = await mount({ 'critical-path': '' }, flagged);

    expect(critical(root)).toEqual(['a', 'b', 'c', 'y']);
  });

  it('follows the attribute, the links and a move of a task', async () => {
    const { gantt, root } = await mount({ 'critical-path': '' });

    gantt.removeAttribute('critical-path');
    await flush();
    expect(critical(root)).toEqual([]);
    gantt.setAttribute('critical-path', '');
    await flush();
    expect(critical(root)).toEqual(['a', 'b', 'c']);

    // drop the link into c: b is no longer driving anything
    gantt.setAttribute('links', JSON.stringify(LINKS.filter((l) => l.id !== 'bc')));
    await flush();
    expect(critical(root)).toEqual([]);

    gantt.setAttribute('links', JSON.stringify(LINKS));
    await flush();
    const bar = root.querySelector<HTMLElement>('.bar[data-task-id="c"]')!;
    bar.focus();
    bar.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();
    // c now starts a day after b ends: b has a day of room, so the chain is no longer tight
    expect(critical(root)).toEqual([]);
  });
});
