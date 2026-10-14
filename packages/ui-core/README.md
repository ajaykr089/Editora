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

- `zoom`: `day`, `week`, `month`, `quarter`, `year` or `fit` (the whole project scaled to the chart's width, re-fitted when it is
  resized). `sort`: `none`, `start`, `end`, `label` or `progress`.
- The time header has two rows (month over days or weeks, year over months or quarters). `week-start` (`0` is Sunday)
  sets the first day of the week; it defaults to the locale's.
- `bar-variant`: `solid`, `soft`, `striped`, `outline` or `glass`.
- Dependency types: `e2s`, `s2s`, `e2e` and `s2e`.
- Each bar is named for assistive technology with its dates, progress, owner and critical flag, and shows the same facts in a tooltip on
  hover or keyboard focus (Escape dismisses it). While you drag a bar, the tooltip shows the dates it would take.
- Also: `readonly`, `show-toolbar`, `show-today`, `filter`, and `virtualized="false"` for small layouts (large task sets are
  virtualized automatically).

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
