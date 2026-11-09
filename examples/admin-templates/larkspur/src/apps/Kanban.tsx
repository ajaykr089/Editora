import React from 'react';
import { Avatar } from '@editora/ui-react/Avatar';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { Dialog } from '@editora/ui-react/Dialog';
import { Form } from '@editora/ui-react/Form';
import { Input } from '@editora/ui-react/Input';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Select } from '@editora/ui-react/Select';
import { Sortable, type SortableItem } from '@editora/ui-react/Sortable';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { addBoardCard, BOARD_COLUMNS, getBoard, initials, saveBoard, shortDate, TEAM, TODAY, type BoardCard } from '../../../shared/data';
import { useTitle } from '../lib/router';

const PRIORITY_TONE = { low: 'neutral', medium: 'info', high: 'danger' } as const;
const LISTS = BOARD_COLUMNS.map((column) => ({ id: column.id, label: column.label, emptyLabel: 'Drop cards here' }));

const toItems = (cards: BoardCard[]): SortableItem[] =>
  cards.map((card, order) => ({ id: card.id, label: card.title, listId: card.column, order, data: card }));

/** A kanban board: Sortable lists, drag (or keyboard) to move cards, and a quick-add dialog. */
export function Kanban() {
  useTitle('Kanban');
  const [items, setItems] = React.useState<SortableItem[] | null>(null);
  const [adding, setAdding] = React.useState<string | null>(null);

  React.useEffect(() => { getBoard().then((cards) => setItems(toItems(cards))); }, []);

  const persist = (next: SortableItem[]) => {
    setItems(next);
    void saveBoard(next.map((item) => ({ ...(item.data as BoardCard), column: item.listId })));
  };

  const add = async (values: Record<string, unknown>) => {
    const card = await addBoardCard({
      title: String(values.title || 'Untitled'),
      tag: String(values.tag || 'General'),
      assignee: String(values.assignee || TEAM[0].name),
      priority: (values.priority as BoardCard['priority']) || 'medium',
      column: adding || 'todo',
    });
    setItems((all) => [...(all || []), ...toItems([card]).map((item) => ({ ...item, order: (all || []).length }))]);
    setAdding(null);
    toastApi.success(`${card.title} added`);
  };

  return (
    <div className="lk-screen lk-screen-wide">
      <PageHeader title="Kanban" subtitle="Drag cards between columns, or pick one up with Space and move it with the arrow keys." actions={<Button icon="plus" onClick={() => setAdding('todo')}>Add card</Button>} />
      {items ? (
        <Sortable
          className="lk-board"
          aria-label="Task board"
          lists={LISTS}
          items={items}
          hideToolbar
          // The cards below are drawn in the sortable's shadow root: pageStyles lets this app's
          // CSS classes (.lk-board-card...) reach them.
          pageStyles
          dropzoneStyle="container"
          listGap="md"
          onItemsChange={persist}
          renderListHeader={(list) => (
            <div className="lk-board-head">
              <span className="cell-title">{list.label}</span>
              <span className="cell-sub" aria-label={`${items.filter((item) => item.listId === list.id).length} cards`}>{items.filter((item) => item.listId === list.id).length}</span>
              <Button variant="ghost" size="sm" icon="plus" aria-label={`Add a card to ${list.label}`} onClick={() => setAdding(list.id)} />
            </div>
          )}
          renderItem={(item) => {
            const card = item.data as BoardCard;
            const overdue = !!card.due && card.due < TODAY && item.listId !== 'done';
            return (
              <div className="lk-board-card">
                <div className="lk-row">
                  <Badge size="sm" variant="outline" tone="neutral">{card.tag}</Badge>
                  <Badge size="sm" variant="soft" tone={PRIORITY_TONE[card.priority]}>{card.priority}</Badge>
                </div>
                <span className="cell-title">{card.title}</span>
                <div className="lk-row lk-board-meta">
                  <Avatar initials={initials(card.assignee)} size="sm" alt={card.assignee} variant="soft" tone="neutral" />
                  {card.due ? <span className={overdue ? 'cell-sub cell-warn' : 'cell-sub'}>{overdue ? 'Overdue · ' : 'Due '}{shortDate(card.due)}</span> : null}
                </div>
              </div>
            );
          }}
        />
      ) : null}

      <Dialog open={!!adding} title="Add a card" onDialogClose={() => setAdding(null)} submitText="" cancelText="">
        <Form onSubmit={add} aria-label="Add a card" key={adding || 'closed'}>
          <div className="lk-stack">
            <Input name="title" label="Title" required placeholder="Write the size guide" />
            <div className="lk-form-grid">
              <Input name="tag" label="Tag" placeholder="Content" />
              <Select name="priority" label="Priority" defaultValue="medium">
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </Select>
            </div>
            <Select name="assignee" label="Assignee" defaultValue={TEAM[0].name}>
              {TEAM.map((person) => <option key={person.name} value={person.name}>{person.name}</option>)}
            </Select>
            <div className="lk-actions">
              <Button variant="secondary" type="button" onClick={() => setAdding(null)}>Cancel</Button>
              <Button type="submit">Add card</Button>
            </div>
          </div>
        </Form>
      </Dialog>
    </div>
  );
}
