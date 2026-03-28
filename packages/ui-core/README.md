# @editora/ui-core

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Production-oriented Web Components for Editora UI.

`@editora/ui-core` is the framework-agnostic layer. It ships:
- Custom elements (`<ui-button>`, `<ui-data-table>`, `<ui-date-picker>`, etc.)
- Imperative managers for Promise-based dialogs
- Theming/token utilities
- Overlay, focus, portal, and plugin helpers

## Installation

```bash
npm install @editora/ui-core
```

## Quick Start (Vanilla / Any Framework)

Import once at app bootstrap to register all custom elements.

```ts
import '@editora/ui-core';
```

Then use components directly:

```html
<ui-field label="Email" hint="Work email">
  <ui-input name="email" type="email" placeholder="you@company.com" required></ui-input>
</ui-field>

<ui-button variant="primary">Save</ui-button>
```

## Standalone Component Imports

If you only want a specific custom element instead of registering the full catalog, import its standalone subpath:

```ts
import '@editora/ui-core/button';
import '@editora/ui-core/input';
import '@editora/ui-core/date-picker';
```

That registers only those elements and keeps the rest of the catalog out of the import path. The dedicated sortable entry remains:

```ts
import '@editora/ui-core/sortable';
```

The standalone wrappers live in `src/standalone` and are checked into the package. The build reads from that folder directly, so there is no generator step in the normal build or publish flow.

## Framework Direct Usage

`@editora/ui-core` can be used directly in Vue, Svelte, and Angular because the package ships standards-based custom elements.

- Vue and Svelte work well directly for attribute/event-driven components, and can also handle richer elements like `ui-sortable` through refs.
- Angular also works directly, but you should add `CUSTOM_ELEMENTS_SCHEMA` and use `@ViewChild` for array or object-valued properties.
- Production wrappers are optional DX improvements, not a requirement for using `ui-core`.

Examples:

- Vue direct example: [`examples/ui-core-vue-direct`](/Users/etelligens/Documents/Rich-Text-Editor/examples/ui-core-vue-direct)
- Svelte direct example: [`examples/ui-core-svelte-direct`](/Users/etelligens/Documents/Rich-Text-Editor/examples/ui-core-svelte-direct)
- Angular direct example: [`examples/ui-core-angular-direct`](/Users/etelligens/Documents/Rich-Text-Editor/examples/ui-core-angular-direct)

More guidance lives in [`docs/FRAMEWORK_DIRECT_USAGE.md`](/Users/etelligens/Documents/Rich-Text-Editor/packages/ui-core/docs/FRAMEWORK_DIRECT_USAGE.md).

## What You Get

### Core utilities
- `createSignal`, `computed`, `effect`
- `ElementBase`
- `applyTheme`, `defaultTokens`
- `showPortalFor`, `autoUpdatePosition`, portal helpers
- focus/overlay managers
- `showToast`

### Dialog managers (Promise API)
- `createDialogManager`, `DialogManager`
- `createAlertDialogManager`, `AlertDialogManager`

## Component Catalog

### Primitives and forms
- `ui-button`, `ui-split-button`, `ui-input`, `ui-textarea`, `ui-label`, `ui-description`, `ui-field-error`, `ui-control-group`, `ui-fieldset`, `ui-field`, `ui-form`, `ui-pin-input`, `ui-otp-input`, `ui-inline-edit`
- `ui-checkbox`, `ui-radio-group`, `ui-switch`, `ui-slider`, `ui-select`, `ui-combobox`
- `ui-date-picker`, `ui-date-range-picker`, `ui-time-picker`, `ui-date-time-picker`, `ui-date-range-time-picker`
- `ui-color-picker`

### Navigation and layout
- `ui-layout`, `ui-sidebar`, `ui-app-header`, `ui-breadcrumb`, `ui-navigation-menu`, `ui-menubar`, `ui-tabs`
- `ui-box`, `ui-flex`, `ui-grid`, `ui-section`, `ui-container`
- `ui-drawer`

### Overlays and interactions
- `ui-dialog`, `ui-alert-dialog`, `ui-popover`, `ui-dropdown`, `ui-menu`, `ui-context-menu`, `ui-tooltip`, `ui-hover-card`
- `ui-command`, `ui-command-palette`, `ui-quick-actions`, `ui-selection-popup`, `ui-plugin-panel`, `ui-floating-toolbar`, `ui-toolbar`
- `ui-portal`, `ui-presence`, `ui-slot`, `ui-visually-hidden`

### Data and display
- `ui-table`, `ui-data-table`, `ui-pagination`, `ui-empty-state`, `ui-skeleton`, `ui-alert`, `ui-badge`, `ui-transfer-list`
- `ui-chart`, `ui-timeline`, `ui-gantt`, `ui-calendar`, `ui-progress`, `ui-scroll-area`, `ui-separator`
- `ui-accordion`, `ui-collapsible`, `ui-stepper`, `ui-wizard`, `ui-avatar`, `ui-aspect-ratio`, `ui-block-controls`, `ui-icon`

## Usage Patterns

### 1. Attributes + events

```html
<ui-date-picker id="start" name="startDate" clearable></ui-date-picker>
<script type="module">
  import '@editora/ui-core';

  const picker = document.getElementById('start');
  picker.addEventListener('change', (e) => {
    console.log('new date', e.detail.value);
  });
</script>
```

### 2. Form validation and submit

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

### 3. Data table + pagination

```html
<ui-data-table id="usersTable" sortable selectable page-size="10" pagination-id="usersPager">
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
    </tbody>
  </table>
</ui-data-table>

<ui-pagination id="usersPager"></ui-pagination>
```

### 4. Promise dialog manager

```ts
import '@editora/ui-core';
import { createDialogManager } from '@editora/ui-core';

const dialogs = createDialogManager();

const result = await dialogs.confirm({
  title: 'Delete record',
  description: 'This action cannot be undone.',
  submitText: 'Delete',
  cancelText: 'Cancel',
  mode: 'queue'
});

if (result.action === 'submit') {
  // perform delete
}
```

### 5. Promise alert dialog manager

```ts
import '@editora/ui-core';
import { createAlertDialogManager } from '@editora/ui-core';

const alerts = createAlertDialogManager();

const confirm = await alerts.confirm({
  title: 'Publish changes?',
  description: 'You can still unpublish later.',
  confirmText: 'Publish',
  cancelText: 'Not now'
});

if (confirm.action === 'confirm') {
  // publish
}
```

## Theming

Use `applyTheme` with token overrides:

```ts
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
```

## Docs

- `docs/FRAMEWORK_DIRECT_USAGE.md` for Vue, Svelte, and Angular direct-use guidance
- `docs/ATTRIBUTE_RENDER_MATRIX.md` for component render strategy coverage
- `docs/PRIMITIVE_GAP_MATRIX.md` for the missing primitive roadmap
- `docs/PRIMITIVE_IMPLEMENTATION_PLAN.md` for proposed APIs and rollout order

## Developer Notes

- This package is `sideEffects: true` because component registration happens via module import.
- Use one global import (`import '@editora/ui-core'`) in app entry.
- Events are dispatched as `CustomEvent` with `detail`, usually `bubbles: true` and `composed: true`.
- For best performance, keep long tables virtualized (`ui-data-table[virtualize]`) and avoid unnecessary DOM churn in cell renderers.

## Development

```bash
cd packages/ui-core
npm run build:tsc
npm test
```

Full `npm run build` also runs Vite bundle output.

## Troubleshooting

- Components not rendering:
  - Ensure `@editora/ui-core` is imported before first render.
- Styles look unthemed:
  - Apply tokens early in bootstrap with `applyTheme(...)`.
- Dialog promises never resolving:
  - Ensure you call `destroy()` on manager during app teardown only, not immediately after open.
