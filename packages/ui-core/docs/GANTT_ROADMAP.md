# ui-gantt roadmap

Findings from a real-browser audit of `ui-gantt` (Chromium via Playwright, a probe page that mounts the
element with a 10-task project, a 10,000-task one, and edge-case data) and the plan that follows from it.
Sizes assume one developer who knows the component: **S** is under a day, **M** one to three days, **L**
about a week.

## Already fixed

| Problem | Fix |
| --- | --- |
| The filter box took one character (the render dropped focus) | toolbar controls get focus back after a render |
| Keyboard editing worked once, then focus fell to `<body>` | bars and expand buttons get focus back too |
| Arrow keys were dead on summary bars and in read-only charts | the key handler is bound to every bar |
| A host that rewrites `tasks` after each edit reset the scroll and left a dangling selection | scroll resets only for a different set of tasks |
| `open: false` was parsed and ignored | a branch starts collapsed the first time it is seen |
| React `showToolbar={false}` / `showToday={false}` did nothing | the wrapper writes `"false"` |
| No bar was reachable at phone width (the sticky 376px grid covered the viewport) | a container query shrinks the grid to the task name column |
| Every handler ran twice after a render that changed nothing (one arrow press moved a task two days; found in the live browser pane, whose width is fractional) | listeners are bound only when the tree was replaced; the resize observer ignores sub-pixel differences |

Each is one commit with regression tests in `src/__tests__/ui-gantt.interaction.test.ts` (and
`ui-react/src/__tests__/Gantt.test.tsx`).

## Phase A: polish (about a week)

Visible quality, no new concepts. Most of it is in `createTicks` and the bar CSS.

| # | Item | What and why | Size |
| --- | --- | --- | --- |
| A1 | ~~Two-level time header~~ **done** | Top band (month/year) over a bottom row (day number and weekday letter, week start, month, quarter), cells on real calendar boundaries, today highlighted, a `week-start` attribute. Also lines the body grid up with the header columns (no more grey wash at month and wider). | M |
| A2 | ~~Day-zoom label collisions~~ **done** | Solved by the same header: the day row only needs a number and a weekday letter. | S |
| A3 | ~~Visible progress~~ **done** | A solid darker fill with a light edge on every bar (soft, outline and glass tuned, summary bars included), per-part fills on split bars (a part's own `progress`, else the task's shared in order), split bars follow the bar variant, `data-progress` and a `complete` class. | S |
| A4 | ~~Zoom range~~ **done** | A `fit` zoom (toolbar button, `zoom="fit"`): the whole project scaled to the width beside the task grid, clamped to 0.2-48px a day, re-fitted when the host resizes and once the scrollbar width is known, with the header unit chosen from the scale. Fixed zooms keep their scales and the 680px floor on purpose; with A5 the track already fills a wide host. | M |
| A5 | ~~Timeline fills the frame~~ **done** | The timeline track is `minmax(data width, 1fr)`, the header cells and unit lines are drawn out to the host's edge, and a `ResizeObserver` keeps up with width changes. Grid lines that overshoot a scrollbar are clipped (`overflow-x: clip`). | S |
| A6 | ~~Today label~~ **done** | The "Today" label is a pill at the bottom of the sticky header, centred on the line and clamped inside the track; the body keeps only the line. No pill at the day scale, where today's column is already highlighted and a pill would cover its date. The line now also shows in the stretch added to fill a wide host. | S |
| A7 | ~~Bar names and tooltips~~ **done** | A bar's accessible name is now "label, kind, dates, progress, assigned to, critical". One shared tooltip (outside the bars, which clip) opens on hover after 150ms and at once on keyboard focus, repeats those facts, is dismissed with Escape, never opens on touch, and flips below the bar under the sticky header. While a bar is dragged it shows the dates the bar would take: the old `.drag-tip` was inside the bar and clipped, so the dates were never visible. The words ("to", "complete", "assigned to"...) are in one `TEXT` object, ready for B8. | S |
| A8 | ~~Touch targets~~ **done** | On coarse pointers (`@media (pointer: coarse)`) task bars grow from 18 to 24px tall, centred on the same line so links and baselines still meet them, and the resize handles from 14 to 24px wide (at most 35% of a very short bar, so it keeps a middle to grab) and always show their grip, since a touch screen has no hover. Mouse layouts are unchanged. | S |
| A9 | ~~Date semantics~~ **done** | A task date is a calendar day: a time, `T` part or offset after `YYYY-MM-DD` is ignored, so `2026-03-02T23:30:00Z` is March 2 in every time zone instead of the viewer's local day (March 3 east of Greenwich). Events still report plain `YYYY-MM-DD`. Other date strings (`March 2, 2026`) and `Date` objects are still read as local days. | S |
| A10 | ~~`aria-colcount` in compact mode~~ **done** | `aria-colcount` is the number of columns shown: the configured ones, or 1 when the host is narrow enough for the compact layout (width unknown: all of them). | S |
| A11 | ~~Scroll to today~~ **done** | The chart opens on today when it is off the first screen (`initial-scroll="start"` keeps the start; not in `fit`), a Today toolbar button scrolls back smoothly (honouring reduced motion; disabled when today is off the timeline), and `scrollToDate()` does it for any date. | S |

## Phase B: interaction (about two weeks)

| # | Item | What and why | Size |
| --- | --- | --- | --- |
| B1 | ~~Cancelable changes~~ **done** | A cancelable `beforetaskchange` {id, start, end, previousStart, previousEnd, source, affected} fires before every change from a drag, a resize or a key; refusing it puts the bar back and fires nothing else. `taskchange` is unchanged. Drag, resize and keyboard share one path, so scheduling can add the tasks it moves to `affected`. | S |
| B2 | ~~Imperative API~~ **done** | `scrollToDate`, `scrollToTask` (opens the branches above, scrolls the row and bar into view), `toggleTask`, `expandAll`, `collapseAll`, a `tasktoggle` event, and `tasks` / `links` as array properties (Dates become plain days; a property set before the element upgrades is kept). React: a typed `GanttElement` ref, `onTaskToggle`, `initialScroll`. | M |
| B3 | ~~Grid keyboard (treegrid)~~ **done** | Task rows are focusable (one roving tab stop, `aria-selected` on the selected row): Up/Down, Home/End, PageUp/PageDown between rows (from a bar too), Right opens a branch or steps into it, Left closes it or climbs to the parent, Enter/Space selects; keys on the expand button stay its own. The tab stop moves to a rendered row when the selected task is outside the window, focus waits for a row that is not rendered yet, and an instant scroll is recorded at once so the render that follows does not undo it. | M |
| B4 | ~~Drag niceties~~ **done** | The chart scrolls while a drag is held near the left or right edge (faster nearer it, counted as movement), `snap="week"` / `"month"` snap the dragged edge to the nearest boundary, Escape cancels a drag, and a cancelled pointer is no longer a drop (it used to commit). A drop where the bar started reports nothing. Scroll re-renders are held back during a drag so the bar is not replaced under the pointer. | M |
| B5 | ~~Inline create and rename~~ **done** | Rename in place: double-click a name or F2 on a row or bar gives a text field (Enter or blur keeps it, Escape drops it; empty or unchanged says nothing) and a cancelable `taskrename`; the chart keeps the new name as a local override until the host writes `tasks`. `creatable` adds a **+ Add task** button and a double-click on empty timeline space; both fire `taskcreate` {start, end (a week later), parent, after} and the host owns the data. Read-only charts and tasks cannot be renamed. | M |
| B6 | ~~Columns and splitter~~ **done** | `columns` (keys or `{key, label, width}`: name, assignee, dates, start, end, duration, progress; the name column is always first), `grid-width`, and a splitter on the list's edge (mouse, touch, arrow keys, Home/End) that fires `gridresize`. The grid template is one CSS variable, so the narrow-host rule still wins. `aria-colcount` now counts the columns actually shown (A10). | M |
| B7 | ~~Height and sizing~~ **done** | `fill` makes the chart fill its container's height (flex column: the toolbar keeps its height, the rows scroll in the rest) and `max-height` sets the cap for the auto-height case; the host's height changes re-render only when `fill` is on or the rows are windowed by it. React: `fill`, `maxHeight`. | S |
| B8 | ~~i18n~~ **done** | `labels` (a JSON object with any subset of 33 keys: title, count template, toolbar, sort options, zoom names, column headers, empty states, expand/collapse, today, and the words in bar names and tooltips) and `locale` (month names, date formats, the week's first day). React: `labels`, `locale`, `GanttLabels`. | M |

## Phase C: scheduling (two to three weeks)

This is what separates a timeline from a planning tool. It is the riskiest phase: do it behind opt-in
attributes so existing charts behave as today.

| # | Item | What and why | Size |
| --- | --- | --- | --- |
| C1 | ~~Summary roll-up and cascade~~ **done** | `auto-summary`: a parent's dates and, when it has none, its progress (children's, weighted by length) follow its children, up through parents of parents. `cascade`: a parent can be moved (drag or keys, no resize) and takes everything under it by the same days; a read-only task stays put; the extra tasks are in `beforetaskchange`'s `affected` and each fires `taskchange`. Pure logic in `components/gantt-schedule.ts`. | M |
| C2 | ~~Dependency scheduling~~ **done** | Links take a `lag` (days, may be negative). A link whose target starts or ends earlier than its type and lag allow is drawn dashed in the danger colour (own arrowhead, "dependency not met" in its name); `schedule="off"` turns that off. `schedule="auto"` pushes the tasks that follow a task that moves, later only, keeping their length and a read-only task alone, down the whole chain (and the children of a pushed parent with `cascade`), as one `beforetaskchange` whose `affected` lists them. Logic in `gantt-schedule.ts`. | L |
| C3 | Draw links by dragging | A connector dot on bar hover, a `linkcreate` event, and `linkdelete` on the selected link (Delete key). A selected link is highlighted. Today a link can only be clicked. | L |
| C4 | ~~Critical path~~ **done** | `critical-path` computes it from the links: a backward pass (every link type and lag) gives each task its slack, and a task is critical when it has none, has links, and either nothing precedes it or something that does is tight against it. Parents are left out, cycles are skipped, and a `critical: true` you set stays. | M |
| C5 | Non-working time | Shade weekends, `non-working-days` (e.g. `0,6`) and a `holidays` list; optionally skip them when C2 schedules. | M |
| C6 | Print and export | A print stylesheet and an `exportSvg()` of the timeline. Low priority. | M |

Not planned for now: sub-day (hour) granularity, resource/workload views, multi-select and undo/redo (a host
can build undo from `taskchange`).

## Order and totals

A1-A9 are done; next A10-A11, then B1-B2, B4, B3, B7, B5, B6, B8, and phase C last.
That is roughly five to six weeks in total, and each item above is its own commit. The estimate is a
guess from reading the code, not a measurement: C2 and C3 are the ones most likely to run over.

## How to verify each item

- Unit: add a case to `ui-gantt.interaction.test.ts` that fails before the change (the existing cases show how:
  mount, drive the shadow root, `flush`). jsdom has no layout, no container queries and no `CSS.escape`.
- Real browser, for anything about layout, scroll, focus or touch: serve the repo root with
  `python3 -m http.server 5191`, put a probe page in `examples/web/` (untracked, delete it afterwards) that imports
  `/packages/ui-core/dist/gantt.esm.js`, rebuild with `npx vite build` in `packages/ui-core`, and drive it with
  the Playwright in `e2e-local/`. Check 390, 600, 768 and 1365px, light and dark, and the 10,000-task case
  (about 380ms to mount, about 520 bars in the DOM at a time).
- Stories: every new attribute gets a story in `.storybook/stories/Gantt.stories.tsx` and a row in
  `examples/editora-docs/docs/ui-react/interactive/gantt.md`.
