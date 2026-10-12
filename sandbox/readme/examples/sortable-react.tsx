import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'done', label: 'Done' }
];

const items: SortableItem[] = [
  { id: 'story-1', label: 'Audit onboarding', listId: 'backlog' },
  { id: 'story-2', label: 'Ship release notes', listId: 'done' }
];

export default function Example() {
  return (
    <Sortable
      lists={lists}
      items={items}
      dropzoneStyle="container"
      onChange={(detail) => {
        console.log(detail.items);
      }}
    />
  );
}
