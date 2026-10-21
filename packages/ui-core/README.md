<h1 align="center">@editora/ui-core</h1>

<p align="center">
  More than a hundred web components for building application UIs: forms, data tables, dialogs, charts, a Gantt chart
  and more. Standard custom elements, so they work in plain HTML, React, Vue, Svelte and Angular, with promise-based
  dialogs, theming and positioning helpers.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/ui-core"><img src="https://img.shields.io/npm/v/@editora/ui-core.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/ui-core"><img src="https://img.shields.io/npm/dm/@editora/ui-core.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/ui-core.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/ui-core"><img src="https://img.shields.io/npm/types/@editora/ui-core.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/">Component catalog</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://codesandbox.io/p/github/ajaykr089/editora-codesandbox/main">CodeSandbox</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-core/docs/images/components.png" alt="A set of components: a labelled text field, buttons, badges and avatars, a warning alert, a switch, a checkbox, a progress bar and a date picker" width="900">
</p>

## Features

- **A broad catalog.** Inputs and forms, pickers, tables, tabs, menus, dialogs, drawers, charts, a calendar and a
  Gantt planner: [the full list](#components).
- **Standard custom elements.** Use them from any framework, or with no framework and no build step.
- **Forms that validate.** `<ui-form>` collects the values of the controls inside it, validates them and reports
  `submit`, `invalid` and `dirty-change`.
- **Promise-based dialogs.** `await dialogs.confirm({...})` instead of wiring open/close state.
- **Themeable** with design tokens, for the whole page or for one element.
- **Positioning helpers** for menus, popovers and tooltips: flip, shift and fit to the viewport.
- Typed, and every component is also available on its own, so you can ship only the ones you use
  ([measured below](#import-only-what-you-use)).

## Install

```bash
npm install @editora/ui-core
```

## Quick start

With a bundler, import the package once to register the elements: `import '@editora/ui-core';`.

With no build step, map the package to a CDN and import it in a module script:

```html
<script type="importmap">
  {
    "imports": {
      "@editora/ui-core": "https://cdn.jsdelivr.net/npm/@editora/ui-core/dist/index.esm.js",
      "@editora/icons": "https://cdn.jsdelivr.net/npm/@editora/icons/dist/index.esm.js"
    }
  }
</script>
<script type="module">
  import '@editora/ui-core';
</script>

<ui-field label="Email" description="Work email" required>
  <ui-input name="email" type="email" placeholder="you@company.com" clearable></ui-input>
</ui-field>

<ui-button variant="primary">Save</ui-button>
```

The examples below assume `@editora/ui-core` resolves, through a bundler or the import map above.

The picture at the top of this page is made of these elements:

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start">
  <div style="display: grid; gap: 16px">
    <ui-field label="Project name" description="Shown in the sidebar">
      <ui-input placeholder="Untitled" clearable></ui-input>
    </ui-field>

    <div style="display: flex; gap: 8px; flex-wrap: wrap">
      <ui-button variant="primary">Save</ui-button>
      <ui-button variant="secondary">Cancel</ui-button>
      <ui-button variant="ghost">Skip</ui-button>
      <ui-button variant="danger">Delete</ui-button>
    </div>

    <div style="display: flex; gap: 8px; align-items: center">
      <ui-badge tone="success" text="Live"></ui-badge>
      <ui-badge tone="warning" text="Review"></ui-badge>
      <ui-badge tone="danger" text="Failed"></ui-badge>
      <ui-avatar initials="AM" size="md"></ui-avatar>
      <ui-avatar initials="JK" size="md"></ui-avatar>
    </div>

    <ui-alert title="Heads up" description="Your trial ends in 3 days." tone="warning"></ui-alert>
  </div>

  <div style="display: grid; gap: 16px">
    <ui-switch checked label="Email notifications" description="A summary every Monday"></ui-switch>
    <ui-checkbox checked>Remember me</ui-checkbox>
    <ui-progress value="64"></ui-progress>
    <ui-date-picker label="Start date" clearable></ui-date-picker>
  </div>
</div>

<script type="module">
  import '@editora/ui-core';
</script>
```

## Import only what you use

`import '@editora/ui-core'` registers every component. Each component also has its own entry, named after its tag
without the `ui-` prefix, and registers just that element:

```ts
import '@editora/ui-core/button';
import '@editora/ui-core/input';
import '@editora/ui-core/date-picker';
```

Bundle sizes, measured with esbuild (minified ES modules):

| Import | Size |
| --- | --- |
| `@editora/ui-core` (everything) | 2.4 MB (493 KB gzipped) |
| `@editora/ui-core/button` | 165 KB (54 KB gzipped) |
| `button`, `input` and `date-picker` together | 296 KB (85 KB gzipped) |

## Forms

`<ui-form>` finds the `name`d controls inside it, so you do not wire up each field:

```html
<ui-form id="profileForm" autosave guard-unsaved>
  <ui-field label="Full name" required>
    <ui-input name="fullName" required></ui-input>
  </ui-field>
  <ui-field label="Email" required>
    <ui-input name="email" type="email" required></ui-input>
  </ui-field>
  <ui-button variant="primary" type="submit">Save</ui-button>
</ui-form>

<script type="module">
  import '@editora/ui-core';
  const form = document.getElementById('profileForm');

  form.addEventListener('submit', (e) => console.log('values', e.detail.values));
  form.addEventListener('invalid', (e) => console.log('errors', e.detail.errors));
  form.addEventListener('dirty-change', (e) => console.log('dirty?', e.detail.dirty));
</script>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-core/docs/images/form.png" alt="The form after pressing Save with both required fields empty: each field is outlined in red with the message Please fill out this field." width="900">
</p>

| Event | `event.detail` |
| --- | --- |
| `submit` | `{ values }`: fired when the form is valid. |
| `invalid` | `{ errors }`: the error message of each invalid field. |
| `dirty-change` | `{ dirty }`: whether the values differ from the starting values. |
| `autosave` | `{ values, dirty }`: with the `autosave` attribute, fired once the values have stopped changing for `autosave-delay` milliseconds (800 by default) and differ from the starting values. Save your draft in the handler. |

A button with `type="submit"` or `type="reset"` inside the form submits or resets it. The form also has `submit()`,
`validate()`, `getValues()` and `reset()` methods. `guard-unsaved` warns before the page is left with unsaved changes.

## Data tables

A table in `<ui-data-table>` gets sorting, selection and paging; a `<ui-pagination>` with a matching id is the pager:

```html
<ui-data-table id="usersTable" sortable selectable page-size="2" pagination-id="usersPager">
  <table>
    <thead>
      <tr>
        <th data-key="id">ID</th>
        <th data-key="name">Name</th>
        <th data-key="role">Role</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>Asha</td><td>Admin</td></tr>
      <tr><td>2</td><td>Marco</td><td>Editor</td></tr>
      <tr><td>3</td><td>Lena</td><td>Viewer</td></tr>
      <tr><td>4</td><td>Tariq</td><td>Editor</td></tr>
    </tbody>
  </table>
</ui-data-table>

<ui-pagination id="usersPager"></ui-pagination>

<script type="module">
  import '@editora/ui-core';
</script>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-core/docs/images/data-table.png" alt="A table with sortable ID, Name and Role columns showing two rows, and a pager that reads Showing 1-2 of 4" width="900">
</p>

For long tables, `virtualize` renders only the rows that are on screen.

## Gantt chart

`<ui-gantt>` is a planning timeline: tasks, summary rows and milestones, dependencies, baselines, critical tasks, drag
and resize, and a toolbar for zoom, filter and sort. Give it `tasks` and `links` as JSON:

```html
<ui-gantt id="releasePlan" zoom="week" sort="start" bar-variant="soft"></ui-gantt>

<script type="module">
  import '@editora/ui-core';

  const gantt = document.getElementById('releasePlan');

  gantt.setAttribute('tasks', JSON.stringify([
    {
      id: 'api',
      label: 'API contracts',
      start: '2026-02-10',
      end: '2026-02-24',
      progress: 62,
      baselineStart: '2026-02-07',
      baselineEnd: '2026-02-21',
      critical: true
    },
    {
      id: 'qa',
      label: 'QA sign-off',
      start: '2026-02-27',
      type: 'milestone',
      tone: 'success'
    }
  ]));

  gantt.setAttribute('links', JSON.stringify([
    { id: 'api-qa', source: 'api', target: 'qa', type: 'e2s' }
  ]));

  gantt.addEventListener('taskchange', (event) => console.log('task changed', event.detail));
  gantt.addEventListener('taskdelete', (event) => console.log('delete task', event.detail.id));
  gantt.addEventListener('linkselect', (event) => console.log('dependency selected', event.detail));
</script>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-core/docs/images/gantt.png" alt="A Gantt chart with a task bar for API contracts, a baseline under it, and an arrow to the QA sign-off milestone" width="900">
</p>

That is the whole setup for a basic chart. The rest of this section builds on it.

### A full planner

This one turns on most of the features at once: a two-level time header, weekends and a holiday shaded, parents that
follow their children, scheduling that pushes the tasks after one you move, the critical path, dependencies you draw
by dragging, and a date the host refuses to let slip. The chart draws what it is given and reports what the user does;
the plan lives in your code, so every edit arrives as an event and you decide whether to keep it.

```html
<ui-gantt
  id="planner"
  zoom="week"
  week-start="1"
  bar-variant="soft"
  columns='["label", "assignee", "start", "end", "progress"]'
  non-working-days
  auto-summary
  cascade
  schedule="auto"
  critical-path
  linkable
  creatable
></ui-gantt>

<script type="module">
  import '@editora/ui-core';

  const planner = document.getElementById('planner');
  const day = (offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date;
  };

  // The chart draws what it is given and reports what the user does; the plan lives here.
  let tasks = [
    { id: 'discovery', label: 'Discovery', type: 'summary' },
    { id: 'research', label: 'User research', parent: 'discovery', start: day(-21), end: day(-12), progress: 100, assignee: 'Mina', baselineStart: day(-21), baselineEnd: day(-13) },
    { id: 'interviews', label: 'Interviews', parent: 'discovery', start: day(-12), end: day(-5), progress: 100, assignee: 'Jonas' },
    { id: 'scope', label: 'Scope signed off', parent: 'discovery', start: day(-5), type: 'milestone', tone: 'success' },
    { id: 'build', label: 'Build', type: 'summary' },
    { id: 'api', label: 'API and data model', parent: 'build', start: day(-4), end: day(10), progress: 70, assignee: 'Priya' },
    {
      id: 'ui',
      label: 'Planner UI',
      parent: 'build',
      start: day(-2),
      end: day(18),
      progress: 45,
      assignee: 'Tomás',
      segments: [{ start: day(-2), end: day(5) }, { start: day(8), end: day(18) }]
    },
    { id: 'integration', label: 'Integration', parent: 'build', start: day(18), end: day(26), progress: 0, assignee: 'Priya' },
    { id: 'launch', label: 'Launch', type: 'summary' },
    { id: 'qa', label: 'QA and fixes', parent: 'launch', start: day(26), end: day(33), assignee: 'Aiko' },
    { id: 'beta', label: 'Beta', parent: 'launch', start: day(33), end: day(40), assignee: 'Aiko' },
    { id: 'release', label: 'Release', parent: 'launch', start: day(40), type: 'milestone', tone: 'danger' },
    { id: 'docs', label: 'Write the docs', start: day(30), end: day(38), progress: 20, assignee: 'Sam' }
  ];
  let links = [
    { id: 'l1', source: 'research', target: 'interviews' },
    { id: 'l2', source: 'interviews', target: 'scope' },
    { id: 'l3', source: 'scope', target: 'api', lag: 1 },
    { id: 'l4', source: 'scope', target: 'ui', type: 's2s', lag: 3 },
    { id: 'l5', source: 'api', target: 'integration' },
    { id: 'l6', source: 'ui', target: 'integration' },
    { id: 'l7', source: 'integration', target: 'qa' },
    { id: 'l8', source: 'qa', target: 'beta' },
    { id: 'l9', source: 'beta', target: 'release' },
    { id: 'l10', source: 'beta', target: 'docs' } // docs are planned before beta ends: drawn red
  ];
  const sync = () => {
    planner.tasks = tasks;
    planner.links = links;
  };
  planner.holidays = [{ date: day(12), label: 'Founders day' }];
  const patch = (id, changes) => {
    tasks = tasks.map((task) => (task.id === id ? { ...task, ...changes } : task));
  };
  sync();

  // Keep the release date: refuse any change that would push it.
  planner.addEventListener('beforetaskchange', (event) => {
    if (event.detail.affected.some((change) => change.id === 'release')) event.preventDefault();
  });
  planner.addEventListener('taskchange', ({ detail }) => {
    patch(detail.id, { start: detail.start, end: detail.end });
    sync();
  });
  planner.addEventListener('taskrename', ({ detail }) => {
    patch(detail.id, { label: detail.label });
    sync();
  });
  planner.addEventListener('taskcreate', ({ detail }) => {
    const id = `task-${tasks.length + 1}`;
    tasks = [...tasks, { id, label: 'New task', start: detail.start, end: detail.end, parent: detail.parent }];
    sync();
    planner.scrollToTask(id);
  });
  planner.addEventListener('linkcreate', ({ detail }) => {
    links = [...links, { id: `l${links.length + 1}`, ...detail }];
    sync();
  });
  planner.addEventListener('linkdelete', ({ detail }) => {
    links = links.filter((link) => link.id !== detail.id);
    sync();
  });
</script>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-core/docs/images/gantt-planner.png" alt="A project planner: three summary rows, red critical-path bars joined by dependency arrows, shaded weekends and a holiday, a Today marker, a red dashed link for a task planned before its predecessor ends, and a tooltip on the Beta bar" width="900">
</p>

The red bars are the critical path (`critical-path`), the red dashed arrow is a dependency that is already broken
(Write the docs is planned before Beta ends), the grey strip under User research is its baseline, and the dots on
Beta are the handles `linkable` adds.

### Timeline and display

- `zoom`: `day`, `week`, `month`, `quarter`, `year` or `fit` (the whole project scaled to the chart's width, re-fitted when it is
  resized). The time header has two rows (month over days or weeks, year over months or quarters), a pill marks today, and the chart
  opens on today when it is off the first screen (`initial-scroll="start"` keeps the start).
- `week-start` (`0` is Sunday) sets the first day of the week; it defaults to the locale's.
- `bar-variant`: `solid`, `soft`, `striped`, `outline` or `glass`. Progress is drawn inside each bar, and a task with `segments` is drawn in parts,
  each with its own progress. `sort`: `none`, `start`, `end`, `label` or `progress`.
- Non-working time: `non-working-days` (the attribute alone means the weekend, or `0,6` / `[1,2]`) and `holidays` (`["2026-12-25", {"date": "2026-12-26", "label": "Boxing Day"}]`)
  shade those days behind the rows (not at month scales and wider, where a day is a few pixels) and mute them in the day header. They are shown, not scheduled
  around: task lengths are calendar days.
- Size: by default the chart grows with its rows up to 620px (`max-height="60vh"` or the `--ui-gantt-max-height` variable change that); add
  `fill` and give the element a height (or a flex/grid cell) and it fills it, with the rows scrolling inside. Below 640px of width only the
  name column is kept. Large task sets (over 240 rows) are virtualized automatically; `virtualized="false"` turns that off.
- Dates are calendar days (`YYYY-MM-DD`). A time or offset after the day (`2026-03-02T23:30:00Z`) is ignored, so a task never moves a
  day with the viewer's time zone; `taskchange` reports plain `YYYY-MM-DD`.
- Translate every word with `labels` (a JSON object with any subset of the label keys, e.g. `{"title": "Planning", "zoomWeek": "semaine"}`) and
  set `locale` (`fr-FR`) for month names, date formats and the first day of the week.

### Task list

- Choose the columns with `columns` (`["label", "assignee", "start", "end", "duration", "progress"]`, or objects with a `label` and a
  `width`) and size the list with `grid-width`; a splitter on its edge resizes it (mouse, touch, or the arrow keys) and fires `gridresize`.
- Parents: opening or closing a branch fires `tasktoggle`. `auto-summary` makes a parent span its children and take their progress (weighted by length)
  when it has none; `cascade` lets you move a parent and everything under it together (`beforetaskchange` lists the tasks it moves in `affected`,
  `taskchange` fires for each).

### Dependencies and scheduling

- A link may carry a `lag` (days) and its `type` says what it ties: `e2s` (the default), `s2s`, `e2e` or `s2e`. A link whose target is too early is
  drawn red and dashed.
- `schedule="auto"` also pushes the tasks that follow a task you move (later only, keeping their length, down the chain, as one change you can
  refuse in `beforetaskchange`); `schedule="off"` turns both off. The pushing counts calendar days.
- `critical-path` computes the critical path from the links (no slack on a chain that is tight all the way) and draws those bars as critical, on top of any
  task you flag `critical`.
- `linkable` shows dots beside each bar: drag one onto another bar and the chart fires `linkcreate` with the source, the target and the type the two ends
  give (`e2s`, `s2s`, `e2e`, `s2e`); click a link to select it and press Delete to get `linkdelete`. As with tasks, your code owns the data.

### Editing

- Dragging: a bar can be dragged, resized from its ends, or moved with the arrow keys (Shift extends the end). The chart scrolls when a drag is held
  near the left or right edge, Escape cancels it, and `snap="week"` or `snap="month"` snaps it to whole weeks or months. `beforetaskchange`
  (cancelable) fires before the dates change, so a host can refuse the change with `event.preventDefault()`; `taskchange` fires after.
- Rename in place: double-click a task's name (or press F2 on a row or a bar). Enter or leaving the field keeps it and fires `taskrename`
  (cancelable), Escape drops it.
- With `creatable` there is a **+ Add task** button, and a double-click on empty timeline space does the same for that
  day: the chart fires `taskcreate` with the dates and the neighbour and your code adds the task. Nothing is written to your data by the chart.
- `readonly` turns all of this off and keeps the browsing.

### Keyboard and accessibility

- Tab enters the task list once (a row) and once more for the bars. On a row, Up/Down, Home/End and PageUp/PageDown move between rows, Right
  opens a branch or steps into it, Left closes it or climbs to the parent, Enter or Space selects. On a bar the same keys move between rows, and
  Left/Right move the bar a day (Shift: extend the end), Delete asks to remove it, and Escape closes the tooltip.
- Each bar is named for assistive technology with its dates, progress, owner and critical flag, and shows the same facts in a tooltip on
  hover or keyboard focus. While you drag a bar, the tooltip shows the dates it would take. Bars and the touch targets of the splitter and the
  link handles grow on touch screens.

### Export and print

`exportSvg()` returns the whole chart (not just the part on screen) as a standalone SVG string, and the chart prints as a whole (no scroll
area, no sticky headers, no controls; use `zoom="fit"` for a wide project).

### Reference

| Attribute | Values |
| --- | --- |
| `zoom` | `day`, `week` (default), `month`, `quarter`, `year`, `fit` |
| `week-start`, `locale`, `labels` | first weekday (`0`-`6`), a locale tag, a JSON object of label overrides |
| `bar-variant`, `sort`, `variant` | bar skin, sort key, `contrast` for a dark surface |
| `columns`, `grid-width` | task list columns and width |
| `fill`, `max-height`, `virtualized` | sizing and row virtualization |
| `non-working-days`, `holidays` | shaded days: weekdays, dates |
| `auto-summary`, `cascade` | parents follow their children, parents move their children |
| `schedule`, `critical-path` | `auto` pushes successors, red critical bars |
| `linkable`, `creatable`, `readonly`, `snap`, `initial-scroll` | editing and scrolling behaviour |
| `filter`, `show-toolbar`, `show-today`, `headless` | toolbar |

| Event | `detail` |
| --- | --- |
| `beforetaskchange` (cancelable) | `{ id, start, end, previousStart, previousEnd, source, affected }`, `affected` lists the other tasks the change moves in the same shape |
| `taskchange` | `{ id, start, end }`, once for each task that moved |
| `taskselect`, `taskdelete` | `{ id }` |
| `tasktoggle` | `{ id, open }` |
| `taskrename` (cancelable) | `{ id, label, previousLabel }` |
| `taskcreate` | `{ start, end, parent, after }` |
| `linkcreate` | `{ source, target, type }` |
| `linkselect`, `linkdelete` | `{ id, source, target, type }` |
| `zoomchange`, `sortchange`, `filterchange`, `gridresize` | `{ zoom }`, `{ sort }`, `{ filter }`, `{ width }` |

Methods: `scrollToDate(date)`, `scrollToTask(id)`, `toggleTask(id, open?)`, `expandAll()`, `collapseAll()` and `exportSvg()`. `tasks`, `links`
and `holidays` are also properties that take arrays (with `Date`s if you like).

## Promise dialogs

The dialog managers open a dialog and give you a promise for the answer:

```html
<ui-button id="remove" variant="danger">Delete record</ui-button>
<ui-button id="publish" variant="secondary">Publish</ui-button>
<pre id="result"></pre>

<script type="module">
  import { createAlertDialogManager, createDialogManager } from '@editora/ui-core';

  const dialogs = createDialogManager();
  const alerts = createAlertDialogManager();
  const result = document.getElementById('result');

  document.getElementById('remove').onclick = async () => {
    const answer = await dialogs.confirm({
      title: 'Delete record',
      description: 'This action cannot be undone.',
      submitText: 'Delete',
      cancelText: 'Cancel',
      mode: 'queue'
    });

    result.textContent = answer.action === 'submit' ? 'Deleted' : 'Kept';
  };

  document.getElementById('publish').onclick = async () => {
    const answer = await alerts.confirm({
      title: 'Publish changes?',
      description: 'You can still unpublish later.',
      confirmText: 'Publish',
      cancelText: 'Not now'
    });

    result.textContent = answer.action === 'confirm' ? 'Published' : 'Not published';
  };
</script>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-core/docs/images/dialog.png" alt="A confirm dialog titled Delete record with the text This action cannot be undone, and Cancel and Delete buttons, over a dimmed page" width="700">
</p>

`createDialogManager()` is for general dialogs and `createAlertDialogManager()` for confirmations that need an answer.
Call `destroy()` on a manager when your app shuts down, not right after opening a dialog.

## Theming

`applyTheme` writes the design tokens as CSS variables on the page, or on one element if you pass it as the second
argument:

```html
<ui-button variant="primary">Save</ui-button>
<ui-badge tone="success" text="Live"></ui-badge>

<script type="module">
  import { applyTheme, defaultTokens } from '@editora/ui-core';

  applyTheme({
    ...defaultTokens,
    colors: {
      ...defaultTokens.colors,
      primary: '#0f766e',
      text: '#0f172a',
      background: '#ffffff'
    },
    radius: '10px'
  });
</script>
```

Apply the theme early, before the first render. To theme one part of the page, call
`applyTheme(tokens, element)`.

### Follow the system light/dark setting

```js
import { applySystemTheme } from '@editora/ui-core';

const stop = applySystemTheme({ accentPalette: 'blue' }); // stop() ends following the system
```

It applies the light or dark theme to match the operating system and switches live when the person changes it. The
mode is also written as `data-ui-mode="light|dark"` and `color-scheme` on the page, so your own CSS can follow it.
`light` and `dark` take token overrides for each mode.

### As a stylesheet (server rendering)

`themeToCss(tokens, ':root')` returns the same variables as CSS text, to put in a `<style>` tag or a `.css` file so the
first paint is themed without JavaScript. `themeToVariables(tokens)` returns them as a `{ name: value }` object.

### Tokens to build on

Every value below follows the accent palette, the gray scale and light/dark mode, so custom components that read them
stay on theme.

| Tokens | Meaning |
| --- | --- |
| `--ui-color-fill`, `-fill-hover`, `-fill-active` | resting, hover and pressed fill of a neutral control |
| `--ui-color-line-subtle`, `-line`, `-line-strong` | borders and separators, from quiet to strong |
| `--ui-color-text-secondary`, `-text-strong` | secondary and primary text |
| `--ui-color-accent-subtle`, `-accent-fill`, `-accent-fill-hover`, `-accent-fill-active` | tinted accent backgrounds |
| `--ui-color-accent-line`, `-accent-solid`, `-accent-solid-hover`, `-accent-text` | accent border, solid fill, solid hover and accent text |
| `--ui-color-surface-elevated`, `--ui-color-info` | raised surface (menus, popovers) and the informational colour |
| `--ui-color-placeholder` | placeholder text (62% of the text colour, 4.5:1 or better on the field) |
| `--ui-color-foreground-on-warning` | text on a solid warning fill: dark when the warning colour is light (amber) |
| `--ui-ring-color`, `--ui-ring-width`, `--ui-ring-offset` | the focus ring |
| `--ui-control-height-{1..4}`, `--ui-control-font-size-{1..4}`, `--ui-control-padding-inline-{1..4}`, `--ui-control-radius-{1..4}` | the control scale: 24, 32, 40 and 48px (see below) |
| `--ui-motion-enter-easing`, `--ui-motion-exit-easing` | easing for things that appear and disappear |

### The default look

Light and dark, with the default amber accent (`radius` is 6px):

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-core/docs/images/look-light.png" alt="Buttons, fields, checkboxes, switches, badges, tabs and a card in the light theme" width="49%">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-core/docs/images/look-dark.png" alt="The same components in the dark theme" width="49%">
</p>

- **Buttons** are flat fills with no shadow. `variant` picks the colour (`primary`, `danger`, `success`, `warning`,
  neutral `secondary`, `ghost`) and `recipe` the style: `solid` (default), `soft`, `surface`, `outline`, `ghost` or
  `classic`. Status fills are a shade deeper than the status colour so white text reads at 4.5:1.
- **Fields** (input, select, textarea, combobox, pickers) share a hairline border that darkens on hover, and a 2px
  focus ring drawn inside it.
- **`ui-field`** is flat: label, control and message with no box. `variant="surface"`, `outline`, `soft`, `contrast` or
  `elevated` draw the box.
- **Tabs** are a line: a hairline under the tabs and a 2px accent line under the selected one. The boxed pill look is
  `variant="segmented"`; `soft`, `outline`, `solid`, `cards` and `indicator` keep working.
- **Cards** have a single hairline border and no shadow. **Badges** are soft tinted labels without a border
  (`variant="solid"` for a filled one).
- **Alerts** are a tinted fill with a hairline in the tone colour and a plain icon; the coloured bar on the leading edge
  is opt-in (`indicator="line"`). **Slider**, **progress** and **meter** are flat tracks (4–6px) with a solid fill; the
  slider thumb is a white circle.
- **Avatars** are a soft tint with initials. **Breadcrumbs** show the current page in bold, with no pill.
  **Pagination** is a row of 32px buttons with a solid accent for the current page, no bar around them.
- **Calendar** days are plain cells; the selected day is solid accent, the range a soft tint.
- **Accordion** and **collapsible** are one hairline box with dividers; the accent bar on an open item is opt-in
  (`indicator="line"` on the accordion). **Stepper** steps have no card: the current one is a solid circle.
- **Toggle** and **toggle group** are outlined buttons that turn a soft accent when pressed (no dot glyph unless you pass
  `icon-on` / `icon-off`). **Toolbar**, **hover card** and **drawer** take the same flat surface as popovers.
- **Pin input** slots are 40px (one control tall), **empty state** and **file upload** use a primary button.

### Control sizes

Buttons and form controls share one scale, so a row of mixed controls lines up:

| `size` | Height | Text |
| --- | --- | --- |
| `sm` (or `1`) | 24px | 12px |
| default (`md`, `2`) | 32px | 14px |
| `lg` (or `3`) | 40px | 16px |

This covers `ui-button`, `ui-input`, `ui-password-field`, `ui-number-field`, `ui-select`, `ui-combobox`,
`ui-multi-select`, `ui-tags-input`, `ui-toggle`, `ui-textarea` and the date and time pickers. `ui-button` also takes
`scale="4"` for 48px. The control radius follows the theme's `radius`.

To change a size for the whole page, set the tokens, for example `:root { --ui-control-height-2: 36px; }`. To
change one control, use `--ui-control-min-height` (buttons) or `--ui-min-height` (inputs) on it. The older
`components.button['height-md']`-style theme values still work if you set them.

The 24px size is small for touch. Buttons inside a small field (clear, show password, the dropdown arrow) stay 24px
tall so they still meet the WCAG 2.2 minimum target size, but prefer the default size on touch screens.

## Overlays

Popovers, menus, dropdowns, selects, comboboxes, tooltips and dialogs share one set of behaviours.

**They animate in and out.** A surface fades and scales in from the side it opens on, and plays a quicker exit before it
is removed, so it no longer disappears with a pop. With `prefers-reduced-motion: reduce` there is no animation. Tune it
with CSS variables on the page: `--ui-overlay-in-duration` (150ms), `--ui-overlay-out-duration` (100ms) and
`--ui-overlay-shift` (4px), plus `--ui-motion-enter-easing` and `--ui-motion-exit-easing`.

**They expose their state for CSS.** The open surface carries `data-state="open"` or `"closed"`, and positioned ones
also `data-side` (`top`, `right`, `bottom`, `left`) and `data-align` (`start`, `center`, `end`), as Radix does:

```css
.ui-menu-surface[data-side="top"][data-state="open"] {
  /* your own rule */
}
```

**Popovers, menus, tooltips, dropdown-style menus and dialogs sit in the browser's top layer**, above every `z-index` on
the page, so a sticky header with `z-index: 9999` can no longer cover them. This uses `popover="manual"` (Chrome 114,
Safari 17, Firefox 125); older browsers keep the previous `z-index` stacking. Dismissal (Escape, click outside) is still
handled by the components.

Not in the top layer: the panels of `ui-select`, `ui-dropdown`, `ui-combobox` and `ui-multi-select`, which open inside
their own field and are clipped like it; `ui-hover-card` and `ui-drawer`. They do have the state attributes and the motion.

## Floating positioning

The positioning engine behind the menus, popovers and tooltips is available on its own, from
`@editora/ui-core/runtime`:

```html
<ui-button id="trigger" variant="secondary">Open</ui-button>
<div id="panel" style="padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);">
  A panel that stays next to its button.
</div>

<script type="module">
  import { createPositioner } from '@editora/ui-core/runtime';

  const trigger = document.getElementById('trigger');
  const panel = document.getElementById('panel');

  const handle = createPositioner({
    anchor: trigger,
    floating: panel,
    placement: 'bottom-start',
    strategy: 'fixed',
    offset: 8,
    flip: true,
    shift: true,
    fitViewport: true
  });

  // later: handle.destroy();
</script>
```

Also exported: `computePositionState()` for one-off coordinates, `autoUpdatePositioner()` for observer-driven updates,
`createVirtualPoint()`, `createVirtualRect()` and `createVirtualRange()` for virtual anchors, and
`detectPositionerOverflow()` for diagnostics. See the
[floating guide](https://github.com/ajaykr089/Editora/blob/main/packages/ui-core/docs/FLOATING_USAGE.md).

## Components

Each component is a custom element named `ui-*`; the standalone entry is the name without the prefix.

**Forms and inputs:**
`ui-button`, `ui-split-button`, `ui-input`, `ui-textarea`, `ui-label`, `ui-description`, `ui-field-error`, `ui-control-group`, `ui-fieldset`, `ui-field`, `ui-form`,
`ui-checkbox`, `ui-radio`, `ui-radio-group`, `ui-switch`, `ui-slider`, `ui-select`, `ui-combobox`,
`ui-date-picker`, `ui-date-range-picker`, `ui-time-picker`, `ui-date-time-picker`, `ui-date-range-time-picker`, `ui-color-picker`

**Navigation and layout:**
`ui-layout`, `ui-sidebar`, `ui-app-header`, `ui-breadcrumb`, `ui-navigation-menu`, `ui-menubar`, `ui-tabs`, `ui-drawer`,
`ui-box`, `ui-flex`, `ui-grid`, `ui-section`, `ui-container`

**Overlays and interaction:**
`ui-dialog`, `ui-alert-dialog`, `ui-popover`, `ui-dropdown`, `ui-menu`, `ui-context-menu`, `ui-tooltip`, `ui-hover-card`,
`ui-command`, `ui-command-palette`, `ui-quick-actions`, `ui-selection-popup`, `ui-plugin-panel`, `ui-floating-toolbar`, `ui-toolbar`,
`ui-portal`, `ui-presence`, `ui-slot`, `ui-visually-hidden`

**Data and display:**
`ui-table`, `ui-data-table`, `ui-pagination`, `ui-empty-state`, `ui-skeleton`, `ui-alert`, `ui-badge`, `ui-transfer-list`,
`ui-chart`, `ui-timeline`, `ui-gantt`, `ui-calendar`, `ui-progress`, `ui-scroll-area`, `ui-separator`,
`ui-accordion`, `ui-collapsible`, `ui-stepper`, `ui-wizard`, `ui-avatar`, `ui-aspect-ratio`, `ui-block-controls`, `ui-icon`

Besides these, the package exports `createSignal`, `computed` and `effect` (small reactive primitives), `ElementBase` (the
base class of the components), the portal, focus and overlay managers, and `showToast`.

## Other frameworks

The elements are standard custom elements, so Vue, Svelte and Angular can use them directly. Vue and Svelte work well
with attributes and events; in Angular, add `CUSTOM_ELEMENTS_SCHEMA` and use `@ViewChild` for array and object values.
Working examples:
[Vue](https://github.com/ajaykr089/Editora/tree/main/examples/ui-core-vue-direct),
[Svelte](https://github.com/ajaykr089/Editora/tree/main/examples/ui-core-svelte-direct) and
[Angular](https://github.com/ajaykr089/Editora/tree/main/examples/ui-core-angular-direct), and the
[guide](https://github.com/ajaykr089/Editora/blob/main/packages/ui-core/docs/FRAMEWORK_DIRECT_USAGE.md). For React,
use [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react).

`@editora/ui-vue`, `@editora/ui-svelte` and `@editora/ui-angular` are deprecated: they never grew past a few stub
components. Use `@editora/ui-core` directly instead.

## Good to know

- Components register when their module is imported, so the package is marked `sideEffects: true`. Import it before the
  first render.
- Events are `CustomEvent`s with a `detail`; they usually bubble and cross shadow boundaries.
- If a component renders as an empty tag, `@editora/ui-core` (or its standalone entry) was not imported before it.
- If the styles look unthemed, apply the tokens early with `applyTheme(...)`.

## The rest of the family

| Package | |
| --- | --- |
| [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react) | These components as React components. |
| [`@editora/ui-sortable`](https://www.npmjs.com/package/@editora/ui-sortable) | Sortable lists and boards. |
| [`@editora/icons`](https://www.npmjs.com/package/@editora/icons) | The icon set the components use. |
| [`@editora/toast`](https://www.npmjs.com/package/@editora/toast) | Toast notifications. |

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
