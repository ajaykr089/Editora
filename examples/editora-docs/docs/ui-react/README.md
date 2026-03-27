---
title: UI React
description: React wrappers for @editora/ui-core Web Components with enhanced developer experience.
sidebar_label: Overview
slug: /ui-react/overview
---

# UI React

React wrappers for `@editora/ui-core` Web Components, providing React-friendly props, typed callback details, and hooks/providers for enhanced developer experience.

## Quick Start

```bash
npm install @editora/ui-react @editora/ui-core
```

```tsx
import { Button, Input, ThemeProvider } from '@editora/ui-react';

export function App() {
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

## Key Features

- **React-Friendly Props**: Convert web component attributes to React props
- **Typed Events**: TypeScript interfaces for event callbacks
- **Hooks & Providers**: State management and context providers
- **Form Integration**: Built-in form validation and submission handling
- **Theme Support**: Seamless integration with theme system
- **Accessibility**: Enhanced ARIA attributes and keyboard navigation

## Component Categories

### Form & Input Components
- [Form](./form-inputs/form) - Form wrapper with validation
- [Field](./form-inputs/field) - Form field wrapper
- [Input](./form-inputs/input) - Text input with validation
- [Textarea](./form-inputs/textarea) - Multi-line text input
- [Select](./form-inputs/select) - Dropdown selection
- [Checkbox](./form-inputs/checkbox) - Checkbox input
- [RadioGroup](./form-inputs/radio-group) - Radio button group
- [Switch](./form-inputs/switch) - Toggle switch
- [Slider](./form-inputs/slider) - Range slider
- [DatePicker](./form-inputs/date-picker) - Calendar date picker
- [ColorPicker](./form-inputs/color-picker) - Color selection

### Data Display
- [AnimatedNumber](./interactive/animated-number) - Animated numeric display with multiple visual variants
- [Table](./interactive/table) - Basic table component
- [DataTable](./interactive/data-table) - Advanced data table
- [Chart](./interactive/chart) - Data visualization
- [Timeline](./interactive/timeline) - Timeline visualization
- [Tree](./interactive/tree) - Hierarchical data display
- [Marquee](./interactive/marquee) - Infinite scrolling content rail
- [AnimatedText](./interactive/animated-text) - Text-first animation for headlines, callouts, and hero copy
- [AnimatedBeam](./interactive/animated-beam) - Integration and orchestration diagram with animated beam paths
- [Dock](./interactive/dock) - MacOS-style magnifying launcher and command shelf
- [Orbiter](./interactive/orbiter) - Multi-ring orbital motion around a central focal point

### Overlay & Modal
- [Dialog](./interactive/dialog) - Modal dialog
- [Tooltip](./interactive/tooltip) - Hover information
- [Popover](./interactive/popover) - Floating content
- [Toast](./interactive/toast) - Toast notifications

### Navigation & Layout
- [Layout](./interactive/layout) - Application layout
- [Sidebar](./interactive/sidebar) - Side navigation
- [Tabs](./interactive/tabs) - Tabbed interface
- [Breadcrumb](./interactive/breadcrumb) - Navigation breadcrumbs

### Interactive Components
- [Button](./interactive/button) - Clickable button
- [Menu](./interactive/menu) - Menu system
- [Dropdown](./interactive/dropdown) - Dropdown menu
- [CommandPalette](./interactive/command-palette) - Command interface

## Providers & Hooks

### Theme Management
```tsx
import { ThemeProvider, useTheme } from '@editora/ui-react';

function App() {
  return (
    <ThemeProvider tokens={{ colors: { primary: '#0f766e' } }}>
      <MyComponent />
    </ThemeProvider>
  );
}

function MyComponent() {
  const { tokens, setTokens } = useTheme();
  // Use theme tokens
}
```

### Form Management
```tsx
import { Form, useForm } from '@editora/ui-react';

function MyForm() {
  const { ref, submit, isDirty, getValues } = useForm();

  return (
    <Form ref={ref} onSubmit={(values) => console.log(values)}>
      {/* Form fields */}
      <button onClick={() => submit()} disabled={!isDirty()}>
        Save
      </button>
    </Form>
  );
}
```

### Dialog Management
```tsx
import { DialogProvider, useDialog } from '@editora/ui-react';

function MyComponent() {
  const dialog = useDialog();

  const handleClick = async () => {
    const result = await dialog.confirm({
      title: 'Are you sure?',
      description: 'This action cannot be undone.'
    });
    
    if (result) {
      // Proceed with action
    }
  };

  return <button onClick={handleClick}>Delete</button>;
}
```

## Documentation Structure

### Component Documentation
Each component includes:
- **Props Reference**: Complete TypeScript prop interfaces
- **Usage Examples**: Basic and advanced usage patterns
- **Best Practices**: Guidelines for optimal usage
- **Accessibility**: ARIA attributes and keyboard navigation
- **Styling**: CSS custom properties and theming options

### Examples
- [Comprehensive Examples](./EXAMPLES.md) - Real-world usage patterns
- [Component Registry](./COMPONENT_REGISTRY.md) - Machine-readable component information
- [Live Playground](/docs/examples/live-examples) - Interactive examples

### Integration Guides
- Form integration with validation
- Theme system integration
- State management integration
- TypeScript integration
- Accessibility best practices

## Styling & Theming

All components support the Editora design system with:

- **CSS Custom Properties**: Full theming support
- **Variant System**: Multiple visual variants
- **Size Options**: Consistent sizing across components
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Built-in dark theme support

## Accessibility

Components include:
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support

## Migration Guide

For users migrating from other UI libraries:

- [Examples](./EXAMPLES.md) - Real-world usage patterns
- [Component Registry](./COMPONENT_REGISTRY.md) - Machine-readable component inventory
- [UI React Overview](/docs/ui-react) - Canonical getting started guide

## Examples

Explore interactive examples in our [Live Playground](/docs/examples/live-examples).

## Quick Links

- [Component Registry](./COMPONENT_REGISTRY.md) - Complete component reference
- [Examples](./EXAMPLES.md) - Real-world usage patterns
- [Form Components](./form-inputs/form) - Form building blocks
- [Interactive Components](./interactive/button) - User interaction elements
- [Providers & Hooks](./providers-hooks/theme-provider) - State management
