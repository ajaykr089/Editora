// @editora/ui-sortable/headless/react: useSortable() makes a list you render sortable, and hands you the new order.
//
//   const { ref } = useSortable({ items: tasks, onChange: setTasks });
//   <ul ref={ref}>{tasks.map((task) => <li key={task.id}>{task.title}</li>)}</ul>
//
// React keeps rendering the list: after a drop the elements go back where React put them, and onChange gets the
// reordered array. Lists with the same `group` exchange items; each one's onChange gets its own new array.
import * as React from 'react';
import { createSortable, moveItem, type Sortable, type SortableEvent, type SortableOptions } from './headless';

export interface UseSortableOptions<T> extends Omit<SortableOptions, 'revert' | 'onSort'> {
  /** The data the list renders, in the order it renders it: one entry per item element. */
  items: readonly T[];
  /** The new order. For a move between lists, called on both: without the item, and with it. */
  onChange: (items: T[], event: SortableEvent) => void;
}

export interface UseSortableResult {
  /** Put it on the element whose children are the items. */
  ref: (element: HTMLElement | null) => void;
  /** The list, for toArray() and the rest; null until the element is rendered. */
  sortable: Sortable | null;
}

// An item on its way from one list to another: the list it leaves says what it was, the list it joins takes it.
const inTransit = new WeakMap<HTMLElement, unknown>();

export function useSortable<T>(options: UseSortableOptions<T>): UseSortableResult {
  const latest = React.useRef(options);
  latest.current = options;
  const instance = React.useRef<Sortable | null>(null);
  const [sortable, setSortable] = React.useState<Sortable | null>(null);

  const engineOptions = (): SortableOptions => {
    const { items: _items, onChange: _onChange, onStart, onEnd, canMove, ...rest } = latest.current;
    return {
      ...rest,
      revert: true,
      onStart: onStart && ((event) => latest.current.onStart?.(event)),
      onEnd: onEnd && ((event) => latest.current.onEnd?.(event)),
      canMove: canMove && ((move) => latest.current.canMove?.(move) !== false),
      onSort: (event) => {
        const { items, onChange } = latest.current;
        if (event.type === 'update') {
          onChange(moveItem(items, event.oldIndex, event.newIndex), event);
        } else if (event.type === 'remove') {
          inTransit.set(event.item, items[event.oldIndex]);
          onChange(items.filter((_, index) => index !== event.oldIndex), event);
        } else {
          if (!inTransit.has(event.item)) return; // from a list this hook does not know: nothing to add
          const next = items.slice();
          next.splice(event.newIndex, 0, inTransit.get(event.item) as T);
          inTransit.delete(event.item);
          onChange(next, event);
        }
      },
    };
  };

  // React calls the ref with null when the element goes, which is the cleanup. (An unmount effect would also run in
  // StrictMode's rehearsal, which does not attach the ref again, and leave the list dead.)
  const ref = React.useCallback((element: HTMLElement | null) => {
    instance.current?.destroy();
    instance.current = element ? createSortable(element, engineOptions()) : null;
    setSortable(instance.current);
    // engineOptions reads `latest`, so the callbacks are always the current ones.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The options other than the callbacks (disabled, group, handle...) can change between renders.
  React.useEffect(() => {
    instance.current?.update(engineOptions());
  });

  return { ref, sortable };
}

export { moveItem, moveBetween, applySortEvent } from './headless';
export type {
  Sortable,
  SortableOptions,
  SortableEvent,
  SortableEndEvent,
  SortableMove,
  SortableDirection,
  SortableSource,
  SortableAnnouncements,
  SortableAnnouncementContext,
} from './headless';
