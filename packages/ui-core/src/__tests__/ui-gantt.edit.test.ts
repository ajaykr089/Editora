import { afterEach, describe, expect, it } from 'vitest';
import '../components/ui-gantt';

const flush = (ms = 30) => new Promise((resolve) => setTimeout(resolve, ms));

const TASKS = [
  { id: 'a', label: 'Design', start: '2026-03-02', end: '2026-03-06' },
  { id: 'b', label: 'Build', start: '2026-03-09', end: '2026-03-13', readonly: true },
  { id: 'c', label: 'Ship', start: '2026-03-16', end: '2026-03-20', parent: 'g' },
  { id: 'g', label: 'Group', start: '2026-03-16', end: '2026-03-20', type: 'summary' },
];

const mount = async (attrs: Record<string, string> = {}, tasks: unknown[] = TASKS) => {
  const gantt = document.createElement('ui-gantt') as HTMLElement;
  gantt.setAttribute('tasks', JSON.stringify(tasks));
  gantt.setAttribute('zoom', 'week');
  gantt.setAttribute('initial-scroll', 'start');
  for (const [name, value] of Object.entries(attrs)) gantt.setAttribute(name, value);
  document.body.appendChild(gantt);
  await flush();
  return { gantt, root: gantt.shadowRoot as ShadowRoot };
};
const row = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.grid-row[data-task-id="${id}"]`)!;
const bar = (root: ParentNode, id: string) => root.querySelector<HTMLElement>(`.bar[data-task-id="${id}"]`)!;
const field = (root: ParentNode) => root.querySelector<HTMLInputElement>('.rename');
const press = (target: Element, key: string) => target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
const type = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
const record = (gantt: HTMLElement, ...names: string[]) => {
  const seen: Array<{ type: string; detail: Record<string, unknown> }> = [];
  for (const name of names) gantt.addEventListener(name, (event) => seen.push({ type: name, detail: (event as CustomEvent).detail }));
  return seen;
};
const nameOf = (root: ParentNode, id: string) => row(root, id).querySelector('.name-text')?.textContent;

afterEach(() => {
  document.body.innerHTML = '';
});

describe('ui-gantt rename', () => {
  it('turns the name into a field, with its text selected, on a double-click', async () => {
    const { root } = await mount();

    row(root, 'a').querySelector('.task-name')!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await flush();

    expect(field(root)!.value).toBe('Design');
    expect(field(root)!.getAttribute('aria-label')).toBe('Rename task');
    expect(root.activeElement).toBe(field(root));
    expect(field(root)!.selectionStart).toBe(0);
    expect(field(root)!.selectionEnd).toBe(6);
    expect(row(root, 'a').querySelector('.name-text')).toBeNull();
  });

  it('keeps the new name on Enter, reports it, and shows it in the row, the bar and the tooltip', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskrename');

    row(root, 'a').querySelector('.task-name')!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await flush();
    type(field(root)!, '  Visual design  ');
    press(field(root)!, 'Enter');
    await flush();

    expect(seen.map((s) => s.detail)).toEqual([{ id: 'a', label: 'Visual design', previousLabel: 'Design' }]);
    expect(field(root)).toBeNull();
    expect(nameOf(root, 'a')).toBe('Visual design');
    expect(bar(root, 'a').getAttribute('aria-label')).toMatch(/^Visual design,/);
    expect(root.activeElement).toBe(row(root, 'a')); // focus goes back to the row
  });

  it('drops the edit on Escape', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskrename');

    row(root, 'a').focus();
    press(row(root, 'a'), 'F2');
    await flush();
    type(field(root)!, 'Something else');
    press(field(root)!, 'Escape');
    await flush();

    expect(seen).toEqual([]);
    expect(nameOf(root, 'a')).toBe('Design');
    expect(root.activeElement).toBe(row(root, 'a'));
  });

  it('keeps the edit when the field loses focus', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskrename');

    row(root, 'a').focus();
    press(row(root, 'a'), 'F2');
    await flush();
    type(field(root)!, 'Blurred name');
    field(root)!.dispatchEvent(new FocusEvent('blur'));
    await flush();

    expect(seen.map((s) => s.detail.label)).toEqual(['Blurred name']);
    expect(nameOf(root, 'a')).toBe('Blurred name');
  });

  it('says nothing for an empty or unchanged name', async () => {
    const { gantt, root } = await mount();
    const seen = record(gantt, 'taskrename');

    row(root, 'a').focus();
    press(row(root, 'a'), 'F2');
    await flush();
    type(field(root)!, '   ');
    press(field(root)!, 'Enter');
    await flush();
    press(row(root, 'a'), 'F2');
    await flush();
    press(field(root)!, 'Enter'); // unchanged
    await flush();

    expect(seen).toEqual([]);
    expect(nameOf(root, 'a')).toBe('Design');
  });

  it('lets the host refuse a rename', async () => {
    const { gantt, root } = await mount();
    gantt.addEventListener('taskrename', (event) => event.preventDefault());

    row(root, 'a').focus();
    press(row(root, 'a'), 'F2');
    await flush();
    type(field(root)!, 'Nope');
    press(field(root)!, 'Enter');
    await flush();

    expect(nameOf(root, 'a')).toBe('Design');
  });

  it('starts from F2 on a bar as well as on a row', async () => {
    const { root } = await mount();

    bar(root, 'a').focus();
    press(bar(root, 'a'), 'F2');
    await flush();

    expect(field(root)!.value).toBe('Design');
  });

  it('does not rename in a read-only chart or a read-only task', async () => {
    const readonly = await mount({ readonly: '' });
    row(readonly.root, 'a').focus();
    press(row(readonly.root, 'a'), 'F2');
    row(readonly.root, 'a').querySelector('.task-name')!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await flush();
    expect(field(readonly.root)).toBeNull();

    document.body.innerHTML = '';
    const { root } = await mount();
    row(root, 'b').focus();
    press(row(root, 'b'), 'F2');
    await flush();
    expect(field(root)).toBeNull();
  });

  it('does not start from a double-click on the expand button, and keys in the field stay in the field', async () => {
    const { root } = await mount();

    root.querySelector('.expander')!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await flush();
    expect(field(root)).toBeNull();

    row(root, 'a').focus();
    press(row(root, 'a'), 'F2');
    await flush();
    press(field(root)!, 'ArrowDown'); // must not walk the grid
    press(field(root)!, 'End');
    await flush();
    expect(root.activeElement).toBe(field(root));
  });

  it('keeps what was typed through a re-render, and the caret', async () => {
    const { gantt, root } = await mount();

    row(root, 'a').focus();
    press(row(root, 'a'), 'F2');
    await flush();
    type(field(root)!, 'Half typed');
    field(root)!.setSelectionRange(4, 4);
    gantt.setAttribute('labels', JSON.stringify({ title: 'Re-rendered' })); // anything that renders again
    await flush();

    expect(field(root)!.value).toBe('Half typed');
    expect(root.activeElement).toBe(field(root));
    expect(field(root)!.selectionStart).toBe(4);
  });

  it('survives a drag of the same task: the new name is kept next to the new dates', async () => {
    const { gantt, root } = await mount();
    row(root, 'a').focus();
    press(row(root, 'a'), 'F2');
    await flush();
    type(field(root)!, 'Renamed');
    press(field(root)!, 'Enter');
    await flush();

    bar(root, 'a').focus();
    bar(root, 'a').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();

    expect(nameOf(root, 'a')).toBe('Renamed');
    expect(gantt.getAttribute('tasks')).toContain('"Design"'); // the host's data is untouched
  });

  it('forgets the local name when the host writes the tasks again', async () => {
    const { gantt, root } = await mount();
    row(root, 'a').focus();
    press(row(root, 'a'), 'F2');
    await flush();
    type(field(root)!, 'Renamed');
    press(field(root)!, 'Enter');
    await flush();

    gantt.setAttribute('tasks', JSON.stringify(TASKS.map((t) => (t.id === 'a' ? { ...t, label: 'From the host' } : t))));
    await flush();

    expect(nameOf(root, 'a')).toBe('From the host');
  });

  it('translates the field name', async () => {
    const { root } = await mount({ labels: JSON.stringify({ rename: 'Renommer la tâche' }) });
    row(root, 'a').focus();
    press(row(root, 'a'), 'F2');
    await flush();

    expect(field(root)!.getAttribute('aria-label')).toBe('Renommer la tâche');
  });
});

describe('ui-gantt create', () => {
  const addButton = (root: ParentNode) => root.querySelector<HTMLButtonElement>('.add-button');

  it('has no Add button unless it is asked for, and none in a read-only chart', async () => {
    expect(addButton((await mount()).root)).toBeNull();
    document.body.innerHTML = '';
    expect(addButton((await mount({ creatable: '', readonly: '' })).root)).toBeNull();
    document.body.innerHTML = '';
    expect(addButton((await mount({ creatable: '' })).root)!.textContent!.trim()).toBe('+ Add task');
  });

  it('asks the host for a task next to the selected one, starting on the first day of the timeline when today is off it', async () => {
    const { gantt, root } = await mount({ creatable: '' });
    const seen = record(gantt, 'taskcreate');
    row(root, 'c').click();
    await flush();

    addButton(root)!.click();

    // 2026-03-02 is the first task; the chart starts two days earlier
    expect(seen.map((s) => s.detail)).toEqual([{ start: '2026-02-28', end: '2026-03-07', parent: 'g', after: 'c' }]);
  });

  it('starts today when today is on the timeline', async () => {
    const now = new Date();
    const pad = (v: number) => String(v).padStart(2, '0');
    const day = (offset: number) => { const x = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset); return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`; };
    const { gantt, root } = await mount({ creatable: '' }, [{ id: 'a', label: 'Now', start: day(-3), end: day(10) }]);
    const seen = record(gantt, 'taskcreate');

    addButton(root)!.click();

    expect(seen.map((s) => s.detail)).toEqual([{ start: day(0), end: day(7), parent: undefined, after: undefined }]);
  });

  it('creates at the day under a double-click on empty timeline space, next to that row', async () => {
    const { gantt, root } = await mount({ creatable: '' });
    const seen = record(gantt, 'taskcreate');
    const body = root.querySelector<HTMLElement>('.timeline-body')!;
    body.getBoundingClientRect = () => ({ left: 100, right: 900, top: 0, bottom: 200, width: 800, height: 200, x: 100, y: 0, toJSON() {} });
    const timelineRow = root.querySelector<HTMLElement>('.timeline-row[data-task-id="c"]')!;

    // 5 days (13px each) and a bit into the timeline: day index 5 from the chart's start, 2026-02-28
    timelineRow.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, clientX: 100 + 5 * 13 + 4 }));

    expect(seen.map((s) => s.detail)).toEqual([{ start: '2026-03-05', end: '2026-03-12', parent: 'g', after: 'c' }]);
  });

  it('ignores a double-click on a bar, and in a chart that cannot create', async () => {
    const created = await mount({ creatable: '' });
    const seen = record(created.gantt, 'taskcreate');
    bar(created.root, 'a').dispatchEvent(new MouseEvent('dblclick', { bubbles: true, clientX: 150 }));
    expect(seen).toEqual([]);

    document.body.innerHTML = '';
    const plain = await mount();
    const plainSeen = record(plain.gantt, 'taskcreate');
    plain.root.querySelector<HTMLElement>('.timeline-row')!.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, clientX: 150 }));
    expect(plainSeen).toEqual([]);
  });

  it('translates the button', async () => {
    const { root } = await mount({ creatable: '', labels: JSON.stringify({ addTask: 'Ajouter une tâche' }) });

    expect(addButton(root)!.textContent!.trim()).toBe('+ Ajouter une tâche');
  });
});
