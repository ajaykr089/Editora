---
title: Gantt
description: Timeline-based planning view for project phases, tasks, and dependencies.
sidebar_label: Gantt
---

# Gantt

The `Gantt` component visualizes scheduled work across a timeline and provides an interactive planning workspace for releases, projects, and roadmaps.

## Basic Usage

```tsx
import { Gantt, type GanttLink, type GanttTask } from '@editora/ui-react';
import { useState } from 'react';

const initialTasks: GanttTask[] = [
  {
    id: 'foundation',
    label: 'Foundation build',
    start: '2026-02-01',
    end: '2026-02-18',
    progress: 68,
    baselineStart: '2026-01-29',
    baselineEnd: '2026-02-14',
    critical: true
  },
  {
    id: 'docs',
    label: 'Documentation pass',
    start: '2026-02-12',
    end: '2026-02-26',
    progress: 35,
    segments: [
      { start: '2026-02-12', end: '2026-02-17' },
      { start: '2026-02-22', end: '2026-02-26' }
    ]
  },
  {
    id: 'launch',
    label: 'Launch milestone',
    start: '2026-02-28',
    type: 'milestone',
    tone: 'success'
  }
];

const links: GanttLink[] = [
  { id: 'foundation-docs', source: 'foundation', target: 'docs', type: 'e2s' },
  { id: 'docs-launch', source: 'docs', target: 'launch', type: 'e2s' }
];

export function Example() {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <Gantt
      tasks={tasks}
      links={links}
      zoom="week"
      sort="start"
      barVariant="soft"
      onTaskChange={({ id, start, end }) => {
        setTasks((items) => items.map((task) => (
          task.id === id ? { ...task, start: start ?? task.start, end: end ?? task.end } : task
        )));
      }}
      onTaskDelete={({ id }) => setTasks((items) => items.filter((task) => task.id !== id))}
      onLinkSelect={(detail) => console.log('dependency selected', detail)}
    />
  );
}
```

## What It Supports

- Task types: standard tasks, summaries, milestones, parent/child hierarchy, assignees, tones, and progress.
- Planning markers: baselines, critical tasks, and split task segments.
- Dependencies: `e2s`, `s2s`, `e2e`, and `s2e` link types with routed connectors, arrowheads, and `onLinkSelect`.
- Interaction: drag and resize tasks, keyboard selection, delete events, zoom, filter, sort, and readonly mode.
- Scale: row virtualization is enabled automatically for large schedules; use the Storybook `LargeDataset10000` example for a 10,000-task scenario.
- Bar designs: `solid`, `soft`, `striped`, `outline`, and `glass`.

## Props

| Prop | Type | Description |
| --- | --- | --- |
| `tasks` | `GanttTask[]` | Timeline rows. Supports `start`, `end`, `progress`, `baselineStart`, `baselineEnd`, `critical`, `segments`, `type`, `parent`, `assignee`, and `readonly`. |
| `links` | `GanttLink[]` | Dependency links with `source`, `target`, and optional `type`. |
| `zoom` | `'day' \| 'week' \| 'month' \| 'quarter' \| 'year'` | Timeline scale. |
| `sort` | `'none' \| 'start' \| 'end' \| 'label' \| 'progress'` | Sort mode used by the task grid. |
| `barVariant` | `'solid' \| 'soft' \| 'striped' \| 'outline' \| 'glass'` | Visual treatment for task bars. |
| `readonly` | `boolean` | Disables task drag and resize editing. |
| `showToolbar` | `boolean` | Shows or hides built-in zoom, filter, and sort controls. |
| `filterText` | `string` | Controlled filter text. |
| `virtualized` | `boolean` | Set to `false` to force all rows to render. |

## Events

- `onTaskChange(detail)`: fired after drag or resize with the changed task id and new dates.
- `onTaskSelect(detail)`: fired when a task row or bar is selected.
- `onTaskDelete(detail)`: fired from keyboard delete/backspace on the selected task.
- `onLinkSelect(detail)`: fired when a dependency connector is selected.
- `onZoomChange`, `onFilterChange`, `onSortChange`: fired from built-in toolbar controls.

## Live Examples

- CodeSandbox: https://qjr47y-5173.csb.app/gantt
- Storybook: https://editora-ecosystem-storybook.netlify.app/?path=/story/ui-gantt--full-page-workspace
