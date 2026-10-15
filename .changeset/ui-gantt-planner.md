---
"@editora/ui-core": patch
"@editora/ui-react": patch
---

`<ui-gantt>` / `Gantt`: a full planner, and fixes for the keyboard and focus bugs a real browser showed.

Fixed:
- The filter field took one character per render, and bars and expanders lost focus after a keyboard edit. Summary bars and `readonly` charts ignored the keyboard. A controlled `tasks` rewrite reset the scroll and the selection, `open: false` was ignored, and `showToolbar={false}` / `showToday={false}` did nothing in React.
- Handlers ran twice after a render that changed nothing; dates with a time or offset moved a task a day with the viewer's time zone (they are now calendar days); on a phone the sticky task list covered the timeline (below 640px only the name column is kept).
- Critical bars stayed blue or green (the inline tone beat the critical rule); they are now drawn in the danger tone.

New:
- **Time header and zoom**: two header rows (month over days or weeks, year over months or quarters), `week-start`, a Today pill, `zoom="fit"` (the whole project scaled to the chart's width), visible progress inside bars, and descriptive bar names with a shared tooltip (with the dates while you drag).
- **Layout**: `fill` and `max-height`, `columns` and `grid-width` with a splitter you can drag or use with the arrow keys (`gridresize`), `labels` and `locale` to translate every word, finger-sized bars and handles on touch screens.
- **Moving around**: the chart opens on today, a Today button, `scrollToDate()`, `scrollToTask()`, `toggleTask()`, `expandAll()` and `collapseAll()`; the task list is a keyboard-navigable treegrid.
- **Editing**: a cancelable `beforetaskchange`, `snap`, scrolling at the edge while dragging, Escape to cancel a drag, rename in place (`taskrename`), `creatable` with `taskcreate`, `auto-summary` and `cascade` for parents, and `linkable` to draw dependencies by dragging and remove them with Delete (`linkcreate`, `linkdelete`).
- **Scheduling**: broken dependencies are drawn red, `schedule="auto"` pushes the tasks that follow one you move, `critical-path` computes the critical path, `non-working-days` and `holidays` shade days behind the rows.
- **Export**: `exportSvg()` returns the whole chart as an SVG string, and the chart prints as a whole.

In `@editora/ui-react` the same options are props and events, `ref` gives the element's methods, and the new types (`GanttLabels`, `GanttColumn`, `GanttElement` and the detail types) are exported.
