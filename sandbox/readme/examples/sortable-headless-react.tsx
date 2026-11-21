import { useState } from 'react';
import { useSortable } from '@editora/ui-sortable/headless/react';

type Task = { id: string; title: string };

const card = { padding: '10px 14px', margin: '6px 0', border: '1px solid #d0d7de', borderRadius: 8, background: '#fff', cursor: 'grab' };

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'brief', title: 'Write the brief' },
    { id: 'copy', title: 'Review the copy' },
    { id: 'ship', title: 'Ship it' }
  ]);
  // Your markup and your state: after a drop, onChange gets the reordered array.
  const { ref } = useSortable({ items: tasks, onChange: setTasks });

  return (
    <ul ref={ref} aria-label="Tasks" style={{ listStyle: 'none', padding: 0, width: 280 }}>
      {tasks.map((task) => (
        <li key={task.id} style={card}>
          {task.title}
        </li>
      ))}
    </ul>
  );
}
