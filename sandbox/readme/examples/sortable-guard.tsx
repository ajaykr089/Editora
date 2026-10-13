import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

type Task = { reviewed: boolean };

const lists: SortableList[] = [
  { id: 'todo', label: 'To do' },
  { id: 'doing', label: 'Doing', maxItems: 2 },
  { id: 'done', label: 'Done' }
];

const initialItems: SortableItem[] = [
  { id: 'brief', label: 'Write the brief', listId: 'todo', data: { reviewed: true } },
  { id: 'budget', label: 'Approve the budget', listId: 'todo', data: { reviewed: false } },
  { id: 'launch', label: 'Plan the launch', listId: 'todo', data: { reviewed: true } },
  { id: 'assets', label: 'Collect the assets', listId: 'doing', data: { reviewed: true } }
];

export default function GuardedBoard() {
  const [items, setItems] = React.useState(initialItems);

  return (
    <Sortable
      lists={lists}
      items={items}
      allowNesting={false}
      // Only reviewed work goes to Done: over it the lifted card turns red, and a drop does nothing.
      canDrop={(drop) =>
        drop.targetListId !== 'done' || drop.items.every((item) => (item.data as Task).reviewed)
      }
      // The last word before anything changes: return false to cancel (here, at most two cards at a time).
      onBeforeChange={(detail) => detail.movedIds.length <= 2}
      onItemsChange={setItems}
    />
  );
}
