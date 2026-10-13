import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const lists: SortableList[] = [
  { id: 'queue', label: 'Editorial Queue' }
];

const initialItems: SortableItem[] = [
  { id: 'headline', label: 'Headline polish', listId: 'queue' },
  { id: 'legal', label: 'Legal review', listId: 'queue' },
  { id: 'seo', label: 'SEO metadata', listId: 'queue' }
];

export default function FlatSortableQueue() {
  const [items, setItems] = React.useState(initialItems);

  return (
    <Sortable
      lists={lists}
      items={items}
      allowNesting={false}
      onItemsChange={setItems}
    />
  );
}
