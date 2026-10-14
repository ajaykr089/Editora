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

Each is one commit with regression tests in `src/__tests__/ui-gantt.interaction.test.ts` (and
`ui-react/src/__tests__/Gantt.test.tsx`).

## Phase A: polish (about a week)

Visible quality, no new concepts. Most of it is in `createTicks` and the bar CSS.

| # | Item | What and why | Size |
| --- | --- | --- | --- |
| A1 | Two-level time header | Week zoom prints only the month name ("Oct Oct Oct Oct"), so weeks cannot be told apart. Draw a top band (month/year) over a bottom row (day number for `day`/`week`). `month` zoom steps 30 days and labels the month, so labels drift and repeat: step by real calendar boundaries. | M |
| A2 | Day-zoom label collisions | At 36px per day "Oct 10Oct 11" overlap. With A1 the bottom row only needs the day number and a weekday letter. | S (with A1) |
| A3 | Visible progress | `.progress` is a 22%-black fade at 0.3 opacity, which is nearly invisible, and it is hidden on split bars. Draw a solid darker fill with a crisp edge; honour `segments[].progress` (already in the type). | S |
| A4 | Zoom range | `month`, `quarter` and `year` give the same width for any project under a few months (the `max(680, …)` clamp). Derive the clamp from the container, and add a `fit` zoom that fits the whole range. | M |
| A5 | Timeline fills the frame | Grid lines stop at the end of the data, leaving a blank strip on wide hosts. Extend the range to at least the container width. | S |
| A6 | Today label | It overlaps summary bars. Move it to a pill in the header and keep only the line in the body. | S |
| A7 | Bar names and tooltips | A bar's accessible name is the label only. Add dates and progress to the `aria-label`, and a hover/focus tooltip with the same text. | S |
| A8 | Touch targets | Resize handles are 14x18px. Keep the look, grow the hit area to 24px with padding on a pseudo-element. | S |
| A9 | Date semantics | An ISO datetime such as `2026-03-02T23:30:00Z` shifts a day in some time zones. Define tasks as local dates: read the date part and ignore the time, and document it. | S |
| A10 | `aria-colcount` in compact mode | The compact layout hides three cells per row; keep `aria-colcount` equal to the columns that exist. | S |
| A11 | Scroll to today | Open at today (or at the start if today is outside the range) and add a "Today" toolbar button plus `scrollToDate()`. See B2. | S |

## Phase B: interaction (about two weeks)

| # | Item | What and why | Size |
| --- | --- | --- | --- |
| B1 | Cancelable changes | `taskchange` fires after the component has already moved the bar, so a host cannot reject a drag. Add a cancelable `beforetaskchange`; when it is prevented, drop the override and re-render. Keep `taskchange` as it is. | S |
| B2 | Imperative API | `scrollToDate(date \| 'today')`, `scrollToTask(id)`, `expandAll()`, `collapseAll()`, plus a `taskToggle` event so a host can persist expand state. Accept `tasks` and `links` as properties (arrays), not only JSON attributes. | M |
| B3 | Grid keyboard (treegrid) | Row-level roving focus in the grid, ArrowLeft/Right to collapse and expand, Home/End to jump. Today only bars are focusable. | M |
| B4 | Drag niceties | Auto-scroll when dragging near the edge; optional snapping (`snap="week"` at coarse zoom); Escape cancels a drag. | M |
| B5 | Inline create and rename | Double-click a grid cell to rename (`taskrename`), a "+" row or double-click an empty timeline row to add (`taskcreate`). The component stays uncontrolled-friendly: it emits, the host owns the data. | M |
| B6 | Columns and splitter | `columns` attribute (which fields, widths), a draggable splitter between grid and timeline, and a user-set grid width that wins over the compact breakpoint. | M |
| B7 | `height` and sizing | `height="100%"` on the host does not constrain it (only `--ui-gantt-max-height` does). Make the host height drive the viewport and document both. | S |
| B8 | i18n | Hard-coded English: "Project schedule", "Filter tasks", sort labels, headers, "No tasks in this range", the expand/collapse labels. Add a `labels` JSON attribute (same shape as `translations` elsewhere in the library) and a `locale` for dates. | M |

## Phase C: scheduling (two to three weeks)

This is what separates a timeline from a planning tool. It is the riskiest phase: do it behind opt-in
attributes so existing charts behave as today.

| # | Item | What and why | Size |
| --- | --- | --- | --- |
| C1 | Summary roll-up and cascade | `auto-summary`: a summary's dates follow its children. `cascade`: moving a summary moves its children by the same offset. | M |
| C2 | Dependency scheduling | `schedule="auto"`: moving a task pushes its successors so every link holds, with `lag` (days) on a link. Without it, mark violated links (successor starts before the constraint allows) in the danger tone. | L |
| C3 | Draw links by dragging | A connector dot on bar hover, a `linkcreate` event, and `linkdelete` on the selected link (Delete key). A selected link is highlighted. Today a link can only be clicked. | L |
| C4 | Critical path | Compute it from the links instead of trusting `critical: true`, and keep the flag as an override. | M |
| C5 | Non-working time | Shade weekends, `non-working-days` (e.g. `0,6`) and a `holidays` list; optionally skip them when C2 schedules. | M |
| C6 | Print and export | A print stylesheet and an `exportSvg()` of the timeline. Low priority. | M |

Not planned for now: sub-day (hour) granularity, resource/workload views, multi-select and undo/redo (a host
can build undo from `taskchange`).

## Order and totals

A1-A5 first (they change how every chart looks), then A6-A11, B1-B2, B4, B3, B7, B5, B6, B8, and phase C last.
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
