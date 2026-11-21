import { useState } from 'react';
import { useSortable } from '@editora/ui-sortable/headless/react';

type Card = { id: string; title: string };

function Column({ title, initial }: { title: string; initial: Card[] }) {
  const [cards, setCards] = useState(initial);
  // Columns with the same group take each other's cards; each one keeps its own state.
  const { ref } = useSortable({ items: cards, onChange: setCards, group: 'board' });

  return (
    <section style={{ width: 220, padding: 12, borderRadius: 10, background: '#f3f4f6' }}>
      <h3 style={{ margin: '0 0 8px', font: '600 14px system-ui' }}>{title}</h3>
      <ul ref={ref} aria-label={title} style={{ listStyle: 'none', margin: 0, padding: 0, minHeight: 48 }}>
        {cards.map((card) => (
          <li key={card.id} style={{ padding: '10px 12px', margin: '6px 0', borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', cursor: 'grab' }}>
            {card.title}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Board() {
  return (
    <div style={{ display: 'flex', gap: 16, font: '14px system-ui' }}>
      <Column title="To do" initial={[{ id: 'brief', title: 'Write the brief' }, { id: 'copy', title: 'Review the copy' }]} />
      <Column title="Done" initial={[{ id: 'kickoff', title: 'Kick-off call' }]} />
    </div>
  );
}
