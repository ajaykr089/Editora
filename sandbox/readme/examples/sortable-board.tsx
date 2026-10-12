import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'templates', label: 'Templates', cloneOnDrag: true },
  { id: 'backlog', label: 'Backlog' },
  { id: 'active', label: 'In Progress' },
  { id: 'done', label: 'Done', orientation: 'horizontal' }
];

const initialItems: SortableItem[] = [
  { id: 'template-brief', label: 'Launch brief template', listId: 'templates', cloneOnDrag: true },
  { id: 'epic', label: 'Release epic', listId: 'backlog' },
  { id: 'brief', label: 'Draft launch brief', listId: 'backlog', parentId: 'epic' },
  { id: 'review', label: 'Design review', listId: 'active' }
];

export default function ReleaseBoard() {
  const [items, setItems] = React.useState(initialItems);
  const [selection, setSelection] = React.useState<string[]>(['epic']);

  return (
    <Sortable
      lists={lists}
      items={items}
      selection={selection}
      persistKey="release-board"
      onItemsChange={setItems}
      onSelectionChange={(detail) => setSelection(detail.selection)}
      onPersistRequest={(detail) => {
        console.log(detail.persistence.records);
      }}
    />
  );
}
