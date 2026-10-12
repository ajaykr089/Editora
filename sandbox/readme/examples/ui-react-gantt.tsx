import { Gantt, type GanttLink, type GanttTask } from '@editora/ui-react';
import { useState } from 'react';

const initialTasks: GanttTask[] = [
  {
    id: 'foundation',
    label: 'Foundation',
    start: '2026-02-01',
    end: '2026-02-18',
    progress: 68,
    baselineStart: '2026-01-29',
    baselineEnd: '2026-02-14',
    critical: true
  },
  {
    id: 'handoff',
    label: 'Handoff milestone',
    start: '2026-02-20',
    type: 'milestone',
    tone: 'success'
  }
];

const links: GanttLink[] = [
  { id: 'foundation-handoff', source: 'foundation', target: 'handoff', type: 'e2s' }
];

export default function PlanningDemo() {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <Gantt
      tasks={tasks}
      links={links}
      zoom="week"
      sort="start"
      barVariant="soft"
      onTaskChange={({ id, start, end }) => {
        setTasks((items) => items.map((task) => task.id === id ? { ...task, start: start ?? task.start, end: end ?? task.end } : task));
      }}
      onTaskDelete={({ id }) => setTasks((items) => items.filter((task) => task.id !== id))}
      onLinkSelect={(detail) => console.log('dependency selected', detail)}
    />
  );
}
