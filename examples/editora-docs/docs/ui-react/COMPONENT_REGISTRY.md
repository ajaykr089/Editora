---
title: Component Registry
description: Machine-readable registry of all UI React components with their APIs and usage patterns.
sidebar_label: Component Registry
---

# UI React Component Registry

This machine-readable registry provides comprehensive information about all components in the `@editora/ui-react` package, designed for AI assistants, developer tools, and documentation systems.

## Registry Format

Each component entry includes:
- **Component ID**: Unique identifier
- **Package**: Source package
- **Framework**: Target framework
- **Name**: Component name
- **React Export**: Export name from package
- **Source**: Source file location
- **Docs Path**: Documentation URL path
- **Storybook Path**: Storybook URL path
- **Wrapper For**: Underlying web component (if applicable)
- **Props**: Complete prop interface
- **Usage**: Common usage patterns
- **Examples**: Code examples

## Component Catalog

### Form & Input Components

#### Form
```json
{
  "id": "ui-react:Form",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "Form",
  "reactExport": "Form",
  "source": "packages/ui-react/src/components/Form.tsx",
  "docsPath": "/docs/ui-react/form-inputs/form",
  "storybookPath": "/story/ui-form--playground",
  "wrapperFor": "ui-form",
  "props": {
    "autosave": "boolean",
    "guardUnsaved": "boolean",
    "onSubmit": "(values: Record<string, any>) => void | Promise<void>",
    "onInvalid": "(errors: Record<string, string>) => void",
    "onDirtyChange": "(isDirty: boolean) => void",
    "onReset": "() => void",
    "onValidate": "(isValid: boolean) => void",
    "validateOnBlur": "boolean",
    "validateOnChange": "boolean",
    "resetOnSubmit": "boolean",
    "preventDefault": "boolean",
    "noValidate": "boolean",
    "method": "'GET' | 'POST'",
    "action": "string",
    "encType": "string",
    "target": "string",
    "autoComplete": "'on' | 'off'"
  },
  "usage": "Form wrapper with validation and submission handling",
  "examples": [
    "Basic form with validation",
    "Multi-step form wizard",
    "Async validation form",
    "Conditional fields form"
  ]
}
```

#### Input
```json
{
  "id": "ui-react:Input",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "Input",
  "reactExport": "Input",
  "source": "packages/ui-react/src/components/Input.tsx",
  "docsPath": "/docs/ui-react/form-inputs/input",
  "storybookPath": "/story/ui-input--playground",
  "wrapperFor": "ui-input",
  "props": {
    "name": "string",
    "type": "'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'",
    "value": "string | number",
    "defaultValue": "string | number",
    "placeholder": "string",
    "required": "boolean",
    "disabled": "boolean",
    "readOnly": "boolean",
    "autoFocus": "boolean",
    "autoComplete": "string",
    "pattern": "string",
    "minLength": "number",
    "maxLength": "number",
    "min": "number",
    "max": "number",
    "step": "number",
    "size": "'sm' | 'md' | 'lg'",
    "variant": "'default' | 'filled' | 'outlined'",
    "clearable": "boolean",
    "startIcon": "React.ReactNode",
    "endIcon": "React.ReactNode",
    "prefix": "string",
    "suffix": "string",
    "formatter": "(value: string) => string",
    "parser": "(value: string) => string",
    "onChange": "(value: string) => void",
    "onBlur": "(value: string) => void",
    "onFocus": "(value: string) => void",
    "onClear": "() => void"
  },
  "usage": "Text input with validation and formatting",
  "examples": [
    "Basic text input",
    "Email input with validation",
    "Password input with strength meter",
    "Number input with constraints",
    "Search input with clearable",
    "Currency input with formatting"
  ]
}
```

#### Button
```json
{
  "id": "ui-react:Button",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "Button",
  "reactExport": "Button",
  "source": "packages/ui-react/src/components/Button.tsx",
  "docsPath": "/docs/ui-react/interactive/button",
  "storybookPath": "/story/ui-button--playground",
  "wrapperFor": "ui-button",
  "props": {
    "variant": "'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning'",
    "size": "'sm' | 'md' | 'lg'",
    "icon": "string",
    "startIcon": "React.ReactNode",
    "endIcon": "React.ReactNode",
    "loading": "boolean",
    "loadingLabel": "string",
    "state": "'idle' | 'loading' | 'error' | 'success'",
    "tone": "'neutral' | 'info' | 'success' | 'warning' | 'danger'",
    "block": "boolean",
    "headless": "boolean",
    "disabled": "boolean",
    "animation": "'scale' | 'pulse' | 'none'",
    "theme": "'default' | 'dark' | 'brand'",
    "type": "'button' | 'submit' | 'reset'",
    "ariaLabel": "string",
    "onClick": "(event: React.MouseEvent<HTMLElement>) => void"
  },
  "usage": "Clickable button with multiple variants and states",
  "examples": [
    "Primary action button",
    "Secondary action button",
    "Danger action button",
    "Loading state button",
    "Icon button",
    "Block button"
  ]
}
```

### Data Display Components

#### Table
```json
{
  "id": "ui-react:Table",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "Table",
  "reactExport": "Table",
  "source": "packages/ui-react/src/components/Table.tsx",
  "docsPath": "/docs/ui-react/data-display/table",
  "storybookPath": "/story/ui-table--playground",
  "wrapperFor": "ui-table",
  "props": {
    "sortable": "boolean",
    "selectable": "boolean",
    "resizableColumns": "boolean",
    "draggableColumns": "boolean",
    "page": "number",
    "pageSize": "number",
    "paginationId": "string",
    "onPageChange": "(detail: { page: number }) => void",
    "onSortChange": "(detail: { key: string; direction: 'asc' | 'desc' }) => void",
    "onRowSelect": "(detail: { indices: number[] }) => void"
  },
  "usage": "Basic table component with sorting and selection",
  "examples": [
    "Sortable table",
    "Selectable table",
    "Resizable columns table",
    "Paginated table"
  ]
}
```

#### Chart
```json
{
  "id": "ui-react:Chart",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "Chart",
  "reactExport": "Chart",
  "source": "packages/ui-react/src/components/Chart.tsx",
  "docsPath": "/docs/ui-react/data-display/chart",
  "storybookPath": "/story/ui-chart--playground",
  "wrapperFor": "ui-chart",
  "props": {
    "type": "'line' | 'bar' | 'pie' | 'area' | 'scatter'",
    "data": "any",
    "options": "any",
    "width": "string | number",
    "height": "string | number",
    "responsive": "boolean",
    "onDataPointClick": "(point: any) => void"
  },
  "usage": "Data visualization with multiple chart types",
  "examples": [
    "Line chart",
    "Bar chart",
    "Pie chart",
    "Area chart",
    "Interactive chart"
  ]
}
```

### Overlay & Modal Components

#### Dialog
```json
{
  "id": "ui-react:Dialog",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "Dialog",
  "reactExport": "Dialog",
  "source": "packages/ui-react/src/components/Dialog.tsx",
  "docsPath": "/docs/ui-react/overlay-modal/dialog",
  "storybookPath": "/story/ui-dialog--playground",
  "wrapperFor": "ui-dialog",
  "props": {
    "open": "boolean",
    "title": "string",
    "description": "string",
    "closable": "boolean",
    "dismissible": "boolean",
    "closeOnOverlay": "boolean",
    "closeOnEsc": "boolean",
    "lockWhileLoading": "boolean",
    "roleType": "'dialog' | 'alertdialog'",
    "size": "'sm' | 'md' | 'lg' | '1' | '2' | '3'",
    "state": "'idle' | 'loading' | 'error' | 'success'",
    "initialFocus": "string",
    "submitText": "string",
    "cancelText": "string",
    "loadingText": "string",
    "dialogId": "string",
    "config": "UIDialogTemplateOptions",
    "headless": "boolean",
    "onOpen": "() => void",
    "onClose": "() => void",
    "onRequestClose": "(detail: { reason: UIDialogRequestCloseReason }) => void",
    "onDialogOpen": "(detail: UIDialogOpenDetail) => void",
    "onDialogSubmit": "(detail: UIDialogSubmitDetail) => void",
    "onDialogCancel": "(detail: UIDialogCancelDetail) => void",
    "onDialogDismiss": "(detail: UIDialogDismissDetail) => void",
    "onDialogClose": "(detail: UIDialogCloseDetail) => void"
  },
  "usage": "Modal dialog with promise API and providers",
  "examples": [
    "Basic dialog",
    "Confirmation dialog",
    "Form dialog",
    "Loading dialog",
    "Promise-based dialog"
  ]
}
```

#### Tooltip
```json
{
  "id": "ui-react:Tooltip",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "Tooltip",
  "reactExport": "Tooltip",
  "source": "packages/ui-react/src/components/Tooltip.tsx",
  "docsPath": "/docs/ui-react/overlay-modal/tooltip",
  "storybookPath": "/story/ui-tooltip--playground",
  "wrapperFor": "ui-tooltip",
  "props": {
    "text": "string",
    "placement": "'top' | 'right' | 'bottom' | 'left'",
    "open": "boolean",
    "disabled": "boolean",
    "headless": "boolean",
    "variant": "'default' | 'soft' | 'contrast' | 'minimal'",
    "size": "'sm' | 'md' | 'lg'",
    "tone": "'default' | 'success' | 'warning' | 'danger'",
    "delay": "number",
    "closeDelay": "number",
    "trigger": "'hover' | 'focus' | 'click' | 'manual'",
    "offset": "number",
    "interactive": "boolean",
    "arrow": "boolean",
    "onOpen": "() => void",
    "onClose": "() => void",
    "onOpenChange": "(open: boolean) => void"
  },
  "usage": "Hover information display with positioning",
  "examples": [
    "Basic tooltip",
    "Interactive tooltip",
    "Positioned tooltip",
    "Delayed tooltip"
  ]
}
```

### Navigation & Layout Components

#### Layout
```json
{
  "id": "ui-react:Layout",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "Layout",
  "reactExport": "Layout",
  "source": "packages/ui-react/src/components/Layout.tsx",
  "docsPath": "/docs/ui-react/navigation-layout/layout",
  "storybookPath": "/story/ui-layout--playground",
  "wrapperFor": "ui-layout",
  "props": {
    "header": "React.ReactNode",
    "sidebar": "React.ReactNode",
    "content": "React.ReactNode",
    "footer": "React.ReactNode",
    "sidebarCollapsed": "boolean",
    "onSidebarToggle": "() => void"
  },
  "usage": "Application layout container with header, sidebar, and content",
  "examples": [
    "Basic layout",
    "Sidebar layout",
    "Header layout",
    "Complex layout"
  ]
}
```

#### Tabs
```json
{
  "id": "ui-react:Tabs",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "Tabs",
  "reactExport": "Tabs",
  "source": "packages/ui-react/src/components/Tabs.tsx",
  "docsPath": "/docs/ui-react/navigation-layout/tabs",
  "storybookPath": "/story/ui-tabs--playground",
  "wrapperFor": "ui-tabs",
  "props": {
    "value": "string",
    "defaultValue": "string",
    "orientation": "'horizontal' | 'vertical'",
    "activationMode": "'automatic' | 'manual'",
    "onValueChange": "(value: string) => void"
  },
  "usage": "Tabbed interface for content switching",
  "examples": [
    "Horizontal tabs",
    "Vertical tabs",
    "Automatic activation tabs",
    "Manual activation tabs"
  ]
}
```

### Providers & Hooks

#### ThemeProvider
```json
{
  "id": "ui-react:ThemeProvider",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "ThemeProvider",
  "reactExport": "ThemeProvider",
  "source": "packages/ui-react/src/components/ThemeProvider.tsx",
  "docsPath": "/docs/ui-react/providers-hooks/theme-provider",
  "storybookPath": "/story/ui-theme-provider--playground",
  "wrapperFor": null,
  "props": {
    "tokens": "Partial<ThemeTokens>",
    "storageKey": "string | null",
    "children": "React.ReactNode"
  },
  "usage": "Theme context provider with token management and persistence",
  "examples": [
    "Basic theme provider",
    "Custom theme tokens",
    "Theme persistence",
    "Dynamic theme switching"
  ]
}
```

#### useForm Hook
```json
{
  "id": "ui-react:useForm",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "useForm",
  "reactExport": "useForm",
  "source": "packages/ui-react/src/hooks/useForm.ts",
  "docsPath": "/docs/ui-react/providers-hooks/use-form",
  "storybookPath": null,
  "wrapperFor": null,
  "props": {},
  "usage": "Form management hook with validation and state",
  "examples": [
    "Basic form management",
    "Validation with useForm",
    "Async form submission",
    "Multi-step forms"
  ],
  "returns": {
    "ref": "React.RefObject<HTMLElement>",
    "submit": "() => Promise<void>",
    "validate": "() => Promise<boolean>",
    "getValues": "() => Record<string, any>",
    "reset": "() => void",
    "isDirty": "() => boolean"
  }
}
```

#### useTheme Hook
```json
{
  "id": "ui-react:useTheme",
  "package": "@editora/ui-react",
  "framework": "react",
  "name": "useTheme",
  "reactExport": "useTheme",
  "source": "packages/ui-react/src/hooks/useTheme.ts",
  "docsPath": "/docs/ui-react/providers-hooks/use-theme",
  "storybookPath": null,
  "wrapperFor": null,
  "props": {},
  "usage": "Theme hook for accessing and updating theme tokens",
  "examples": [
    "Accessing theme tokens",
    "Updating theme tokens",
    "Theme-aware components",
    "Dynamic theming"
  ],
  "returns": {
    "tokens": "ThemeTokens",
    "setTokens": "(updater: ThemeUpdater) => void"
  }
}
```

## Usage Patterns

### AI Assistant Integration

For AI assistants generating code:

```typescript
// Required imports for runnable code
import { Button, Input, Form, ThemeProvider } from '@editora/ui-react';

// Example component generation
function ExampleComponent() {
  return (
    <ThemeProvider tokens={{ colors: { primary: '#0f766e' } }}>
      <Form onSubmit={(values) => console.log(values)}>
        <Input name="email" type="email" required />
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </Form>
    </ThemeProvider>
  );
}
```

### Component Discovery

Components are organized by category for easy discovery:

- **Form & Input**: Form, Field, Input, Select, Checkbox, RadioGroup, etc.
- **Data Display**: Table, Chart, Timeline, Tree, etc.
- **Overlay & Modal**: Dialog, Tooltip, Popover, Toast, etc.
- **Navigation & Layout**: Layout, Sidebar, Tabs, Breadcrumb, etc.
- **Interactive**: Button, Menu, Dropdown, CommandPalette, etc.
- **Providers & Hooks**: ThemeProvider, useForm, useTheme, etc.

### Props Reference

Each component includes complete TypeScript prop interfaces for type safety and IDE support.

### Examples

Every component includes multiple usage examples covering:
- Basic usage
- Advanced patterns
- Integration with other components
- Common use cases

## Machine Readable Format

This registry is designed for:
- AI code generation tools
- Documentation generators
- Component discovery systems
- IDE extensions
- Developer tooling

The JSON format allows for easy parsing and integration with various tools and systems.