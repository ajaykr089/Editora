import { afterEach, describe, expect, it, vi } from 'vitest';
import { applySortEvent, createSortable, moveBetween, moveItem, type Sortable, type SortableEvent } from '../headless';

const lists: Sortable[] = [];
afterEach(() => {
  lists.splice(0).forEach((list) => list.destroy());
  document.body.innerHTML = '';
});

function list(ids: string[], options: Parameters<typeof createSortable>[1] = {}, attributes: Record<string, string> = {}) {
  const element = document.createElement('ul');
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  for (const id of ids) {
    const item = document.createElement('li');
    item.dataset.id = id;
    item.textContent = `Task ${id}`;
    element.appendChild(item);
  }
  document.body.appendChild(element);
  const sortable = createSortable(element, { direction: 'vertical', ...options });
  lists.push(sortable);
  return { element, sortable, item: (id: string) => element.querySelector<HTMLElement>(`[data-id="${id}"]`)! };
}

const key = (target: HTMLElement, name: string) =>
  target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
const order = (element: HTMLElement) => Array.from(element.children).map((child) => (child as HTMLElement).dataset.id);
const announced = async () => {
  await new Promise((resolve) => setTimeout(resolve, 40));
  return document.querySelector('[data-sortable-announcer]')?.textContent;
};

describe('helpers', () => {
  it('moveItem moves within a new array', () => {
    const tasks = ['a', 'b', 'c', 'd'];
    expect(moveItem(tasks, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(moveItem(tasks, 3, 0)).toEqual(['d', 'a', 'b', 'c']);
    expect(moveItem(tasks, 1, 99)).toEqual(['a', 'c', 'd', 'b']);
    expect(tasks).toEqual(['a', 'b', 'c', 'd']);
  });

  it('moveBetween and applySortEvent move between lists', () => {
    expect(moveBetween(['a', 'b'], ['x'], 0, 1)).toEqual([['b'], ['x', 'a']]);
    const board = { todo: ['a', 'b'], done: ['x'] };
    const event = { type: 'add', fromId: 'todo', toId: 'done', oldIndex: 1, newIndex: 0 } as SortableEvent;
    expect(applySortEvent(board, event)).toEqual({ todo: ['a'], done: ['b', 'x'] });
    expect(applySortEvent(board, { ...event, type: 'remove' })).toEqual(board);
    expect(applySortEvent(board, { ...event, type: 'update', toId: 'todo', oldIndex: 0, newIndex: 1 })).toEqual({ todo: ['b', 'a'], done: ['x'] });
  });
});

describe('createSortable, by keyboard', () => {
  it('makes the items focusable and describes how to move them', () => {
    const { item } = list(['a', 'b']);
    expect(item('a').getAttribute('tabindex')).toBe('0');
    const instructions = document.getElementById(item('a').getAttribute('aria-describedby')!);
    expect(instructions?.textContent).toMatch(/Space to pick up/);
  });

  it('Space picks up, arrows move, Space drops: onSort and onEnd say what moved', async () => {
    const onSort = vi.fn();
    const onEnd = vi.fn();
    const { element, item, sortable } = list(['a', 'b', 'c'], { onSort, onEnd }, { 'aria-label': 'Sprint' });
    const a = item('a');
    a.focus();
    key(a, ' ');
    expect(a.hasAttribute('data-sortable-lifted')).toBe(true);
    expect(await announced()).toBe('Picked up Task a. Position 1 of 3.');

    key(a, 'ArrowDown');
    key(a, 'ArrowDown');
    expect(order(element)).toEqual(['b', 'c', 'a']);
    expect(document.activeElement).toBe(a);
    expect(await announced()).toBe('Task a: position 3 of 3.');
    expect(onSort).not.toHaveBeenCalled(); // not until it is dropped

    key(a, ' ');
    expect(onSort).toHaveBeenCalledTimes(1);
    expect(onSort.mock.calls[0][0]).toMatchObject({ type: 'update', itemId: 'a', oldIndex: 0, newIndex: 2, source: 'keyboard' });
    expect(onEnd.mock.calls[0][0]).toMatchObject({ changed: true, cancelled: false });
    expect(sortable.toArray()).toEqual(['b', 'c', 'a']);
    expect(await announced()).toBe('Dropped Task a in Sprint, position 3 of 3.');
  });

  it('Escape puts the item back, and Home and End jump', async () => {
    const onSort = vi.fn();
    const onEnd = vi.fn();
    const { element, item } = list(['a', 'b', 'c', 'd'], { onSort, onEnd });
    const c = item('c');
    key(c, 'Enter');
    key(c, 'Home');
    expect(order(element)).toEqual(['c', 'a', 'b', 'd']);
    key(c, 'Escape');
    expect(order(element)).toEqual(['a', 'b', 'c', 'd']);
    expect(onSort).not.toHaveBeenCalled();
    expect(onEnd.mock.calls[0][0]).toMatchObject({ changed: false, cancelled: true });
    expect(await announced()).toMatch(/^Cancelled/);

    key(c, ' ');
    key(c, 'End');
    key(c, ' ');
    expect(order(element)).toEqual(['a', 'b', 'd', 'c']);
  });

  it('a horizontal list moves with Left and Right', () => {
    const { element, item } = list(['a', 'b', 'c'], { direction: 'horizontal' });
    key(item('a'), ' ');
    key(item('a'), 'ArrowDown'); // not this list's direction
    key(item('a'), 'ArrowRight');
    key(item('a'), ' ');
    expect(order(element)).toEqual(['b', 'a', 'c']);
  });

  it('moves to the next list of its group with the cross arrows, firing remove then add', () => {
    const events: string[] = [];
    const record = (name: string) => (event: SortableEvent) => events.push(`${name}:${event.type}:${event.oldIndex}->${event.newIndex}`);
    const todo = list(['a', 'b'], { group: 'board', onSort: record('todo') }, { 'data-sortable-id': 'todo' });
    const done = list(['x'], { group: 'board', onSort: record('done') }, { 'data-sortable-id': 'done' });
    const b = todo.item('b');
    key(b, ' ');
    key(b, 'ArrowRight');
    expect(order(done.element)).toEqual(['x', 'b']);
    key(b, ' ');
    expect(events).toEqual(['todo:remove:1->1', 'done:add:1->1']);
    expect(order(todo.element)).toEqual(['a']);
  });

  it('a list of another group, or none, is not a destination', () => {
    const todo = list(['a'], { group: 'board' });
    const other = list(['x'], { group: 'elsewhere' });
    key(todo.item('a'), ' ');
    key(todo.item('a'), 'ArrowRight');
    key(todo.item('a'), ' ');
    expect(order(other.element)).toEqual(['x']);
  });

  it('canMove can refuse a move', () => {
    const { element, item } = list(['a', 'b', 'c'], { canMove: ({ newIndex }) => newIndex !== 2 });
    key(item('a'), ' ');
    key(item('a'), 'ArrowDown');
    key(item('a'), 'ArrowDown'); // refused
    key(item('a'), ' ');
    expect(order(element)).toEqual(['b', 'a', 'c']);
  });

  it('revert: the DOM goes back after the drop, and onSort says what to do', () => {
    const onSort = vi.fn();
    const { element, item } = list(['a', 'b', 'c'], { revert: true, onSort });
    key(item('a'), ' ');
    key(item('a'), 'ArrowDown');
    key(item('a'), ' ');
    expect(order(element)).toEqual(['a', 'b', 'c']);
    expect(onSort.mock.calls[0][0]).toMatchObject({ type: 'update', oldIndex: 0, newIndex: 1 });
  });

  it('with a handle, the handle is what is focused and lifts the item', () => {
    const element = document.createElement('ul');
    element.innerHTML = '<li data-id="a"><span class="grip">::</span> A</li><li data-id="b"><span class="grip">::</span> B</li>';
    document.body.appendChild(element);
    const sortable = createSortable(element, { handle: '.grip', direction: 'vertical' });
    lists.push(sortable);
    const grip = element.querySelector<HTMLElement>('.grip')!;
    expect(grip.getAttribute('tabindex')).toBe('0');
    expect(element.firstElementChild!.hasAttribute('tabindex')).toBe(false);
    key(grip, ' ');
    key(grip, 'ArrowDown');
    key(grip, ' ');
    expect(sortable.toArray()).toEqual(['b', 'a']);
  });

  it('keys typed in a field inside an item are the field\'s', () => {
    const { element, item } = list(['a', 'b']);
    const input = document.createElement('input');
    item('a').appendChild(input);
    key(input, ' ');
    key(input, 'ArrowDown');
    expect(item('a').hasAttribute('data-sortable-lifted')).toBe(false);
    expect(order(element)).toEqual(['a', 'b']);
  });

  it('only the items matching itemSelector move, and the others keep their place', () => {
    const element = document.createElement('ul');
    element.innerHTML = '<li class="head">Header</li><li data-id="a">A</li><li data-id="b">B</li><li class="foot">Footer</li>';
    document.body.appendChild(element);
    const onSort = vi.fn();
    const sortable = createSortable(element, { itemSelector: '[data-id]', direction: 'vertical', onSort });
    lists.push(sortable);
    const a = element.querySelector<HTMLElement>('[data-id="a"]')!;
    expect(element.querySelector('.head')!.hasAttribute('tabindex')).toBe(false);
    key(a, ' ');
    key(a, 'ArrowDown');
    key(a, 'ArrowDown'); // already last of the items
    key(a, ' ');
    expect(Array.from(element.children).map((child) => child.textContent)).toEqual(['Header', 'B', 'A', 'Footer']);
    expect(onSort.mock.calls[0][0]).toMatchObject({ oldIndex: 0, newIndex: 1 });
  });
});

describe('the list', () => {
  it('sort(ids) reorders, update() changes options, destroy() cleans up what it added', () => {
    const { element, sortable, item } = list(['a', 'b', 'c']);
    sortable.sort(['c', 'a']);
    expect(order(element)).toEqual(['c', 'a', 'b']);

    sortable.update({ disabled: true });
    key(item('a'), ' ');
    expect(item('a').hasAttribute('data-sortable-lifted')).toBe(false);

    sortable.destroy();
    expect(item('a').hasAttribute('tabindex')).toBe(false);
    expect(item('a').hasAttribute('aria-describedby')).toBe(false);
  });

  it('items added later become focusable too', async () => {
    const { element } = list(['a']);
    const added = document.createElement('li');
    added.dataset.id = 'b';
    element.appendChild(added);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(added.getAttribute('tabindex')).toBe('0');
  });

  it('keeps tabindex and aria-describedby the app set itself', () => {
    const element = document.createElement('ul');
    element.innerHTML = '<li data-id="a" tabindex="-1" aria-describedby="mine">A</li>';
    document.body.appendChild(element);
    const sortable = createSortable(element);
    sortable.destroy();
    const a = element.firstElementChild!;
    expect(a.getAttribute('tabindex')).toBe('-1');
    expect(a.getAttribute('aria-describedby')).toBe('mine');
  });

  it('announcements can be replaced, for another language', async () => {
    const { item } = list(['a', 'b'], { announcements: { lifted: ({ position }) => `Aufgenommen, Position ${position}` } });
    key(item('a'), ' ');
    expect(await announced()).toBe('Aufgenommen, Position 1');
  });
});
