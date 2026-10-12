<h1 align="center">@editora/ui-react</h1>

<p align="center">
  React components for building application UIs: forms, data tables, dialogs, pickers, charts and a Gantt planner. Typed
  props, typed event details, and hooks for forms, dialogs, themes and floating layers. Built on
  <a href="https://www.npmjs.com/package/@editora/ui-core"><code>@editora/ui-core</code></a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/ui-react"><img src="https://img.shields.io/npm/v/@editora/ui-react.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/ui-react"><img src="https://img.shields.io/npm/dm/@editora/ui-react.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/ui-react.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/ui-react"><img src="https://img.shields.io/npm/types/@editora/ui-react.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/">Component catalog</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://codesandbox.io/p/github/ajaykr089/editora-codesandbox/main">CodeSandbox</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-react/docs/images/components.png" alt="A set of React components: a labelled text field, buttons, badges and avatars, a warning alert, a switch, a checkbox, a progress bar and a date picker" width="900">
</p>

## Features

- **A broad catalog**: inputs and forms, pickers, tables, tabs, menus, dialogs, drawers, charts, a calendar and a Gantt
  planner. [The full list](#components).
- **Typed props and events.** Callbacks receive a typed `detail`, not a raw DOM event.
- **Forms that validate**: `<Form>` collects the values of the controls inside it, and `useForm()` drives it.
- **Promise dialogs**: `await dialog.confirm({...})`, with providers that work in React `StrictMode`.
- **Theming** with design tokens, persisted if you want.
- **Floating layers**: hooks for popovers, menus and tooltips with flip, shift and focus management.
- Wrappers for [`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core), so the components are standard
  custom elements underneath.

## Install

```bash
npm install @editora/ui-react
```

`@editora/ui-core` comes with the package. It is tested with React 18 and 19 (the peer range is React 16.8 to 20). These components register custom elements, so
they run in the browser only: see [Server rendering](#server-rendering).

## Quick start

```tsx
import { Button, Input, ThemeProvider } from '@editora/ui-react';

export default function App() {
  return (
    <ThemeProvider>
      <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
        <Input name="title" label="Title" placeholder="Untitled" clearable />
        <Button variant="primary">Save</Button>
      </div>
    </ThemeProvider>
  );
}
```

The picture at the top of this page is made of these components:

```tsx
import { Alert, Avatar, Badge, Button, Checkbox, DatePicker, Input, Progress, Switch } from '@editora/ui-react';

export default function Gallery() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <Input label="Project name" description="Shown in the sidebar" placeholder="Untitled" clearable />

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button variant="primary">Save</Button>
          <Button variant="secondary">Cancel</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="danger">Delete</Button>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge tone="success" text="Live" />
          <Badge tone="warning" text="Review" />
          <Badge tone="danger" text="Failed" />
          <Avatar initials="AM" />
          <Avatar initials="JK" />
        </div>

        <Alert title="Heads up" description="Your trial ends in 3 days." tone="warning" />
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        <Switch checked label="Email notifications" description="A summary every Monday" />
        <Checkbox checked>Remember me</Checkbox>
        <Progress value={64} />
        <DatePicker label="Start date" clearable />
      </div>
    </div>
  );
}
```

## Import from the package or from one component

Importing from the package root is the simplest, and it is the heaviest: every wrapper and every component's custom
element is in the bundle, and the bundler cannot drop the ones you do not use. Each component also has its own entry:

```tsx
// Everything from the package root: the simplest, and the heaviest.
import { Button, Input } from '@editora/ui-react';
// One component per entry: a lighter first load.
import ButtonOnly from '@editora/ui-react/Button';
import InputOnly from '@editora/ui-react/Input';

export default function Imports() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 360 }}>
      <Input label="From the root" />
      <InputOnly label="From its own entry" />
      <Button>Root</Button>
      <ButtonOnly>Own entry</ButtonOnly>
    </div>
  );
}
```

Measured with esbuild, minified, with code splitting, importing a `Button`:

| Import | Loaded up front | Loaded later |
| --- | --- | --- |
| `import { Button } from '@editora/ui-react'` | 1 MB gzipped | |
| `import Button from '@editora/ui-react/Button'` | 54 KB gzipped | 456 KB gzipped |

A one-component import keeps the first load small. It still pulls in the rest of `@editora/ui-core` in the background
(the second column), because every wrapper registers the whole catalog once, without blocking the first render.

## Forms

`<Form>` finds the `name`d controls inside it. `useForm()` gives you its methods; `onDirtyChange` tells you when the
values differ from the starting ones:

```tsx
import { useState } from 'react';
import { Form, Field, Input, Button, useForm } from '@editora/ui-react';

export default function ProfileForm() {
  const { ref, submit, validate, getValues, reset } = useForm();
  const [dirty, setDirty] = useState(false);

  return (
    <Form
      ref={ref}
      autosave
      guardUnsaved
      onSubmit={(values) => console.log('submit', values)}
      onInvalid={(errors) => console.log('invalid', errors)}
      onDirtyChange={(isDirty) => setDirty(isDirty)}
      style={{ display: 'grid', gap: 12, maxWidth: 520 }}
    >
      <Field label="Full name" required>
        <Input name="fullName" required />
      </Field>

      <Field label="Email" required>
        <Input name="email" type="email" required />
      </Field>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="secondary" onClick={() => validate()}>Validate</Button>
        <Button variant="secondary" onClick={() => console.log(getValues())}>Values</Button>
        <Button variant="secondary" onClick={() => reset()}>Reset</Button>
        <Button onClick={() => submit()} disabled={!dirty}>Submit</Button>
      </div>
    </Form>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-react/docs/images/form.png" alt="The form after pressing Validate with both required fields empty: each field shows the message Please fill out this field." width="900">
</p>

`useForm()` returns `ref`, `submit()`, `validate()`, `getValues()`, `reset(values?)`, `isDirty()` and `markClean()`.
`autosave` reports the values through `onAutosave` after they stop changing, and `guardUnsaved` warns before the page is
left with unsaved changes.

## Promise dialogs

Wrap your app in the providers, then `await` the answer from anywhere inside:

```tsx
import { DialogProvider, useDialog, AlertDialogProvider, useAlertDialog, Button } from '@editora/ui-react';

function Actions() {
  const dialog = useDialog();
  const alerts = useAlertDialog();

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        onClick={async () => {
          const res = await dialog.confirm({
            title: 'Archive project?',
            description: 'You can restore it later.',
            submitText: 'Archive'
          });
          console.log(res);
        }}
      >
        Confirm
      </Button>

      <Button
        variant="secondary"
        onClick={async () => {
          const res = await alerts.prompt({
            title: 'Rename',
            input: { required: true, placeholder: 'New name' }
          });
          console.log(res);
        }}
      >
        Prompt
      </Button>
    </div>
  );
}

export default function DialogExample() {
  return (
    <DialogProvider>
      <AlertDialogProvider>
        <Actions />
      </AlertDialogProvider>
    </DialogProvider>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-react/docs/images/dialog.png" alt="A confirm dialog titled Archive project? with the text You can restore it later, and Cancel and Archive buttons, over a dimmed page" width="700">
</p>

`useDialog()` has `open()` and `confirm()`. `useAlertDialog()` is for confirmations and prompts that need an answer.
Both resolve with an object whose `action` says what the user did. The providers work in `StrictMode`.

## Data tables

`DataTable` gives a table sorting, selection, column resizing and paging. Link a `Pagination` to it with
`paginationId`:

```tsx
import { DataTable, Pagination } from '@editora/ui-react';
import { useState } from 'react';

export default function UsersTable() {
  const [page, setPage] = useState(1);

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <DataTable
        sortable
        selectable
        resizableColumns
        draggableColumns
        page={page}
        pageSize={2}
        paginationId="users-pager"
        onPageChange={(d) => setPage(d.page)}
        onSortChange={(d) => console.log('sort', d)}
        onRowSelect={(d) => console.log('rows', d.indices)}
      >
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
      </DataTable>

      <Pagination id="users-pager" page={page} />
    </div>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-react/docs/images/data-table.png" alt="A table with sortable ID, Name and Role columns showing two rows, and a pager with two pages that reads Showing 1-2 of 4" width="900">
</p>

## Pickers

```tsx
import { DatePicker, DateRangePicker, DateTimePicker, ColorPicker } from '@editora/ui-react';

export default function PickersDemo() {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
      <DatePicker label="Start date" clearable onValueChange={(v) => console.log(v)} />
      <DateRangePicker label="Window" closeOnSelect />
      <DateTimePicker label="Publish at" />
      <ColorPicker mode="popover" format="hex" alpha presets={['#2563eb', '#16a34a', '#dc2626']} />
    </div>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-react/docs/images/pickers.png" alt="A date picker, a date range picker, a date and time picker and a colour picker" width="900">
</p>

## Theming

`ThemeProvider` applies the design tokens of `@editora/ui-core` as CSS variables. With `storageKey` it remembers the
theme in `localStorage`:

```tsx
import { Button, ThemeProvider } from '@editora/ui-react';

export default function Themed() {
  return (
    <ThemeProvider
      tokens={{
        colors: { primary: '#0f766e', text: '#0f172a', background: '#ffffff' },
        radius: '10px'
      }}
      storageKey="my-app.theme"
    >
      <Button variant="primary">Save</Button>
    </ThemeProvider>
  );
}
```

## Gantt planner

`Gantt` is a planning timeline: tasks, summary rows and milestones, dependencies, baselines, critical tasks, drag and
resize, keyboard selection and a toolbar for zoom, filter and sort.

```tsx
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
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/ui-react/docs/images/gantt.png" alt="A Gantt chart with a task bar for Foundation, a baseline under it, and an arrow to the Handoff milestone" width="900">
</p>

- Dependency types: `e2s`, `s2s`, `e2e` and `s2e`. Bar designs: `solid`, `soft`, `striped`, `outline` and `glass`.
- Also in the data: baselines, critical tasks, milestones, parent and child summaries, assignees, progress and split
  segments. Row virtualization turns on for large task sets; pass `virtualized={false}` for small custom layouts.
- The types `GanttTask`, `GanttLink`, `GanttTaskChangeDetail` and `GanttLinkSelectDetail` are exported.

## Floating layers

`useFloating()` positions a layer next to its anchor; `useInteractions()` combines the interaction hooks. This is the
layer the menus, popovers and tooltips are built on:

```tsx
import {
  FloatingArrow,
  FloatingFocusManager,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions
} from '@editora/ui-react';

export default function Example() {
  const floating = useFloating({
    placement: 'bottom-start',
    offset: 10,
    flip: true,
    shift: true,
    fitViewport: true,
    strategy: 'fixed'
  });

  const interactions = useInteractions([
    useClick(floating.context),
    useDismiss(floating.context)
  ]);

  return (
    <>
      <button ref={floating.referenceRef} {...interactions.getReferenceProps()}>
        Open
      </button>

      {floating.open ? (
        <FloatingPortal>
          <FloatingFocusManager context={floating.context}>
            <div
              ref={floating.floatingRef}
              {...interactions.getFloatingProps({
                style: {
                  position: 'fixed',
                  top: floating.coords.top,
                  left: floating.coords.left
                }
              })}
            >
              <FloatingArrow context={floating.context} fill="#fff" stroke="#111827" />
              Floating content
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      ) : null}
    </>
  );
}
```

More hooks: `useHover`, `useFocus`, `useRole`, `useListNavigation` and `useTypeahead`. More helpers: `FloatingOverlay`,
`FloatingTree`, `FloatingList` and `FloatingDelayGroup`. For the same engine without React, see `createPositioner` in
[`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core#floating-positioning).

## Components

**Forms and inputs:**
`Form`, `Field`, `Label`, `Input`, `Textarea`, `Select`, `Combobox`,
`Checkbox`, `Radio`, `RadioGroup`, `Switch`, `Slider`,
`DatePicker`, `DateRangePicker`, `TimePicker`, `DateTimePicker`, `DateRangeTimePicker`, `ColorPicker`

**Data and display:**
`Table`, `DataTable`, `Pagination`, `Calendar`, `Chart`, `Timeline`, `Gantt`,
`Badge`, `Alert`, `Skeleton`, `EmptyState`, `Progress`, `Avatar`, `AspectRatio`

**Overlays and interaction:**
`Tooltip`, `HoverCard`, `Popover`, `Dropdown`, `Menu`, `Menubar`, `ContextMenu`,
`Dialog`, `AlertDialog`, `Drawer`, `Portal`, `Presence`,
`CommandPalette`, `QuickActions`, `Toolbar`, `FloatingToolbar`, `BlockControls`, `SelectionPopup`, `PluginPanel`

**Navigation and layout:**
`Layout`, `Sidebar`, `AppHeader`, `Breadcrumb`, `NavigationMenu`, `Tabs`,
`Box`, `Flex`, `Grid`, `Section`, `Container`, `Separator`, `Slot`, `VisuallyHidden`,
`Accordion`, `Collapsible`, `Stepper`, `Wizard`, `DirectionProvider`

**Providers and hooks:**
`DialogProvider`, `useDialog`, `AlertDialogProvider`, `useAlertDialog`, `ThemeProvider`, `useTheme`, `useForm`, `useFloating`

## Server rendering

These components register custom elements when they are imported, so the package cannot be imported on the server:
importing it in Node throws `HTMLElement is not defined`. Load them in the browser only. In Next.js that means
importing them from client-only code, for example with `next/dynamic` and `ssr: false`, as described for
[`@editora/react`](https://www.npmjs.com/package/@editora/react#nextjs-and-server-rendering). The dialog providers
create their host element on the client, in an effect, and clean it up when they unmount.

## Troubleshooting

- **A component renders as an empty tag, or React warns that a tag is not registered.** Import the wrapper from the
  package root or from its own entry (`@editora/ui-react/Button`); both register the element.
- **A callback does not fire as expected.** Use the typed `detail` that wrapper callbacks receive, such as
  `onPageChange={(d) => d.page}`, instead of parsing the DOM event.

## The rest of the family

| Package | |
| --- | --- |
| [`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core) | The web components these wrap, for any framework. |
| [`@editora/ui-sortable`](https://www.npmjs.com/package/@editora/ui-sortable) | Sortable lists and boards, with a React wrapper. |
| [`@editora/toast`](https://www.npmjs.com/package/@editora/toast) | Toast notifications. |
| [`@editora/react`](https://www.npmjs.com/package/@editora/react) | The Editora rich text editor for React. |

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
