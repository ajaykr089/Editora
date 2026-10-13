import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'todo', label: 'To do' },
  { id: 'done', label: 'Done' }
];

const initialItems: SortableItem[] = [
  { id: 'brief', label: 'Write the brief', description: 'One page, with the audience.', listId: 'todo' },
  { id: 'review', label: 'Legal review', listId: 'todo' }
];

export default function CustomRendering() {
  const [items, setItems] = React.useState(initialItems);
  const [selection, setSelection] = React.useState<string[]>(['brief']);

  return (
    <Sortable
      lists={lists}
      items={items}
      selection={selection}
      onItemsChange={setItems}
      onSelectionChange={(detail) => setSelection(detail.selection)}
      renderItem={(item, context) => (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <strong>{item.label}</strong>
            <span>{context.selected ? 'Selected' : 'Ready'}</span>
          </div>
          {item.description && <div>{item.description}</div>}
          <small>{context.list?.label}</small>
        </div>
      )}
      renderListHeader={(list, context) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <strong>{list.label}</strong>
          <span>{context.itemCount} items</span>
        </div>
      )}
      renderEmptyState={(list) => (
        <div>
          No items in {list.label} yet. Drag something here to get started.
        </div>
      )}
    />
  );
}
