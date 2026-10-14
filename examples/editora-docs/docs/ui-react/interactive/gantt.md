---
title: Gantt
description: Timeline-based planning view for project phases, tasks, and dependencies.
sidebar_label: Gantt
---

# Gantt

The `Gantt` component visualizes scheduled work across a timeline and provides an interactive planning workspace for releases, projects, and roadmaps.

## Basic Usage

```tsx live noInline
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

function Example() {
  const [tasks, setTasks] = useState(initialTasks);

  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

render(<Example />);
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
| `tasks` | `GanttTask[]` | Timeline rows. Supports `start`, `end`, `progress`, `baselineStart`, `baselineEnd`, `critical`, `segments` (each part may carry its own `progress`), `type`, `parent`, `assignee`, and `readonly`. Dates are calendar days: `2026-03-02T23:30:00Z` is March 2 in every time zone (the time and offset are ignored), and a `Date` object is read as a local day. |
| `links` | `GanttLink[]` | Dependency links with `source`, `target`, and optional `type`. |
| `zoom` | `'day' \| 'week' \| 'month' \| 'quarter' \| 'year' \| 'fit'` | Timeline scale. `fit` scales the whole project to the width of the chart (between 0.2 and 48px a day) and picks the header unit from the result; it follows the chart when it is resized. |
| `weekStart` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | First day of the week in the time header (0 is Sunday). Defaults to the locale's. |
| `columns` | `GanttColumn[]` | The task list's columns, in order: `'label'` (always first), `'assignee'`, `'dates'`, `'start'`, `'end'`, `'duration'`, `'progress'`. Use `{ key, label, width }` to set a header text and a width in px. Unknown keys are dropped; the default is name, owner, dates, progress. At phone width only the name column is shown. |
| `gridWidth` | `number` | Width of the task list in px (at least the other columns plus 96px for the name). A splitter on its edge resizes it with the mouse, touch or the arrow keys (Shift for bigger steps, Home and End for the extremes). |
| `schedule` | `'warn' \| 'auto' \| 'off'` | How dependencies are enforced. `'warn'` (the default) draws a link whose target starts or ends earlier than the link allows in the danger style, dashed, with "dependency not met" in its name. `'auto'` also pushes the tasks that follow a task that moved, later only and keeping their length, down the whole chain, as one change (`onBeforeTaskChange`'s `affected` lists them). A read-only task is not pushed. `'off'` does neither. Links take a `lag` in days (negative to overlap). |
| `criticalPath` | `boolean` | Marks the critical path from the links instead of (as well as) the `critical` flags: the tasks with no slack on a chain of links that is tight all the way, found with a backward pass over every link type and lag. A task without links is never critical; parents are left out (their children count). A task you flag `critical` stays critical. |
| `nonWorkingDays` | `number[] \| 'weekend'` | Weekdays that are not working days (0 is Sunday): shaded behind the rows, and muted in the day header. `'weekend'` is Saturday and Sunday. Not drawn at month, quarter and year scales, where a day is too narrow. |
| `holidays` | `Array<string \| Date \| { date, label? }>` | Dates that are not working days, shaded in a warmer tint than `nonWorkingDays`; a label names the day in the day header. The chart shows these days, it does not schedule around them: durations are calendar days. |
| `autoSummary` | `boolean` | A parent's dates follow its children (the earliest start to the latest end), and so does its progress when it has none of its own (the children's, weighted by length). The dates and progress you give a parent are then ignored. |
| `cascade` | `boolean` | Moving a parent (drag it, or the arrow keys) moves everything under it by the same number of days; a read-only task stays put. Parent bars become draggable, without resize handles. `onBeforeTaskChange` lists the tasks it moves in `affected`, and `onTaskChange` fires for each. |
| `creatable` | `boolean` | Shows a **+ Add task** button and lets a double-click on empty timeline space ask for a task (`onTaskCreate`). The chart does not add the task: you do, then you can `scrollToTask` it. Off in a `readonly` chart. |
| `snap` | `'day' \| 'week' \| 'month'` | How far a drag snaps: to whole days (the default), to the nearest week start (see `weekStart`) or to the nearest 1st of a month. Arrow keys always move a day. |
| `initialScroll` | `'today' \| 'start'` | Where the chart opens. `'today'` (the default) scrolls today to the middle when it is not on the first screen; `'start'` leaves it at the start. |
| `fill` | `boolean` | The chart fills the height of its container, which needs a height of its own (a fixed height, a flex or grid cell): the toolbar keeps its height and the rows scroll in the rest. |
| `maxHeight` | `number \| string` | Cap on the chart's height when it is not `fill`: a number is px, or a plain CSS length (`'60vh'`, `'30rem'`, `'none'`). Default 620px. |
| `labels` | `Partial<GanttLabels>` | Translations: any subset of the words the chart shows or announces (title, toolbar, column headers, zoom names, empty states, "expand", "assigned to"...). `tasksCount` takes `{shown}` and `{total}`. |
| `locale` | `string` | BCP 47 locale for dates: month names, date formats and the first day of the week. Defaults to the browser's. |
| `sort` | `'none' \| 'start' \| 'end' \| 'label' \| 'progress'` | Sort mode used by the task grid. |
| `barVariant` | `'solid' \| 'soft' \| 'striped' \| 'outline' \| 'glass'` | Visual treatment for task bars. |
| `readonly` | `boolean` | Disables task drag and resize editing. |
| `showToolbar` | `boolean` | Shows or hides built-in zoom, filter, and sort controls. |
| `filterText` | `string` | Controlled filter text. |
| `virtualized` | `boolean` | Set to `false` to force all rows to render. |

## Events

- `onBeforeTaskChange(detail, event)`: fired before a drag, resize or key changes dates, with the new and previous dates and the `source` (`'drag'`, `'resize'`, `'keyboard'`). Call `event.preventDefault()` to refuse it: the bar goes back and `onTaskChange` does not fire.
- `onTaskChange(detail)`: fired after drag or resize with the changed task id and new dates. While a bar is dragged near the left or right edge of the timeline the chart scrolls; Escape cancels the drag.
- `onTaskSelect(detail)`: fired when a task row or bar is selected.
- `onTaskDelete(detail)`: fired from keyboard delete/backspace on the selected task.
- `onLinkSelect(detail)`: fired when a dependency connector is selected.
- `onZoomChange`, `onFilterChange`, `onSortChange`: fired from built-in toolbar controls.
- `onGridResize({ width })`: fired when the task list is resized with its splitter.
- `onTaskRename({ id, label, previousLabel })`: fired when a name is edited in place (double-click it, or F2 on a row or bar); `event.preventDefault()` refuses it. A read-only chart or task cannot be renamed. The chart keeps the new name only until you write `tasks` again.
- `onTaskCreate({ start, end, parent, after })`: fired when the user asks for a task: its dates (a week from today, or from the clicked day) and the neighbour it was asked next to.
- `onTaskToggle({ id, open })`: fired when a branch is opened or closed, by the user or by the ref methods.

## Methods

Pass a `ref` to get the element (typed `GanttElement`) and move around the chart:

- `scrollToDate(date, { behavior, align })`: a `'YYYY-MM-DD'` string, a `Date`, a timestamp or `'today'`; `align` is `'center'` (the default) or `'start'`.
- `scrollToTask(id, { behavior })`: opens the branches above the task and scrolls its row and bar into view. Returns `false` for an unknown or filtered-out task.
- `toggleTask(id, open?)`, `expandAll()`, `collapseAll()`.

The toolbar has a **Today** button that does `scrollToDate('today')` with a smooth scroll (it is off when today is not on the timeline or `showToday` is `false`).

## Live Examples

- CodeSandbox: https://codesandbox.io/p/github/ajaykr089/editora-codesandbox/main
- Example: https://qjr47y-5173.csb.app/gantt
- Storybook: https://editora-ecosystem-storybook.netlify.app/?path=/story/ui-gantt--full-page-workspace
