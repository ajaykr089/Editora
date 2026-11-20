import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useSortable } from '../headless-react';

type Task = { id: string; title: string };
const key = (target: HTMLElement, name: string) =>
  act(() => {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
  });
const titles = (list: HTMLElement) => Array.from(list.children).map((child) => child.textContent);

afterEach(() => {
  document.body.innerHTML = '';
});

function TaskList({ initial, onChange, group, id }: { initial: Task[]; onChange?: (tasks: Task[]) => void; group?: string; id?: string }) {
  const [tasks, setTasks] = React.useState(initial);
  const { ref } = useSortable({
    items: tasks,
    group,
    id,
    direction: 'vertical',
    onChange: (next) => {
      setTasks(next);
      onChange?.(next);
    },
  });
  return (
    <ul ref={ref} aria-label={id}>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}

const tasks: Task[] = [
  { id: '1', title: 'Write brief' },
  { id: '2', title: 'Review copy' },
  { id: '3', title: 'Ship it' },
];

describe('useSortable', () => {
  it('hands the reordered array to onChange, and React renders it', () => {
    const onChange = vi.fn();
    render(<TaskList initial={tasks} onChange={onChange} />);
    const first = screen.getByText('Write brief');
    key(first, ' ');
    key(first, 'ArrowDown');
    key(first, ' ');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].map((task: Task) => task.id)).toEqual(['2', '1', '3']);
    expect(titles(screen.getByRole('list'))).toEqual(['Review copy', 'Write brief', 'Ship it']);
  });

  it('works under StrictMode, and keeps keyboard focus on the moved item', () => {
    render(
      <React.StrictMode>
        <TaskList initial={tasks} />
      </React.StrictMode>
    );
    const last = screen.getByText('Ship it');
    last.focus();
    key(last, ' ');
    key(last, 'Home');
    key(last, ' ');
    expect(titles(screen.getByRole('list'))).toEqual(['Ship it', 'Write brief', 'Review copy']);
    expect(document.activeElement?.textContent).toBe('Ship it');
  });

  it('moves an item between two lists of a group, each with its own state', () => {
    const todo = vi.fn();
    const done = vi.fn();
    render(
      <>
        <TaskList id="todo" group="board" initial={tasks} onChange={todo} />
        <TaskList id="done" group="board" initial={[{ id: '9', title: 'Plan sprint' }]} onChange={done} />
      </>
    );
    const item = screen.getByText('Review copy');
    key(item, ' ');
    key(item, 'ArrowRight');
    key(item, ' ');
    expect(todo.mock.calls[0][0].map((task: Task) => task.id)).toEqual(['1', '3']);
    expect(done.mock.calls[0][0].map((task: Task) => task.id)).toEqual(['9', '2']);
    expect(titles(screen.getByRole('list', { name: 'todo' }))).toEqual(['Write brief', 'Ship it']);
    expect(titles(screen.getByRole('list', { name: 'done' }))).toEqual(['Plan sprint', 'Review copy']);
  });

  it('uses the latest options: disabled after a re-render stops it', () => {
    function Toggle() {
      const [disabled, setDisabled] = React.useState(false);
      const { ref } = useSortable({ items: tasks, onChange: () => {}, disabled, direction: 'vertical' });
      return (
        <>
          <button onClick={() => setDisabled(true)}>lock</button>
          <ul ref={ref}>{tasks.map((task) => <li key={task.id}>{task.title}</li>)}</ul>
        </>
      );
    }
    render(<Toggle />);
    act(() => screen.getByText('lock').click());
    const first = screen.getByText('Write brief');
    key(first, ' ');
    expect(first.hasAttribute('data-sortable-lifted')).toBe(false);
  });

  it('cleans up when the list goes away', () => {
    const { unmount } = render(<TaskList initial={tasks} />);
    const first = screen.getByText('Write brief');
    expect(first.getAttribute('tabindex')).toBe('0');
    unmount();
    expect(first.hasAttribute('tabindex')).toBe(false);
  });
});
