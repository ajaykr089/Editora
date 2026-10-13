import * as React from 'react';
import { Sortable, type SortableItem, type SortableList } from '@editora/ui-sortable/react';

const backlogLists: SortableList[] = [{ id: 'backlog', label: 'Backlog' }];
const sprintLists: SortableList[] = [{ id: 'sprint', label: 'This sprint', maxItems: 3, maxHeight: 280 }];

export default function TwoBoards() {
  const [backlog, setBacklog] = React.useState<SortableItem[]>([
    { id: 'audit', label: 'Audit onboarding', listId: 'backlog' },
    { id: 'notes', label: 'Ship release notes', listId: 'backlog' },
    { id: 'handoff', label: 'Review handoff', listId: 'backlog' }
  ]);
  const [sprint, setSprint] = React.useState<SortableItem[]>([
    { id: 'login', label: 'Fix login', listId: 'sprint' },
    { id: 'docs', label: 'Write docs', listId: 'sprint' }
  ]);

  // Sortables with the same group take each other's cards. Each one reports its own change,
  // so each keeps its own state.
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      <Sortable lists={backlogLists} items={backlog} group="planning" allowNesting={false} onItemsChange={setBacklog} />
      <Sortable lists={sprintLists} items={sprint} group="planning" allowNesting={false} onItemsChange={setSprint} />
    </div>
  );
}
