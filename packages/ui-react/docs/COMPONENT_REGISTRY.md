# @editora/ui-react Component Registry

This document provides a comprehensive overview of all components available in the `@editora/ui-react` package, organized by category with their primary use cases and key features.

## Package Overview

`@editora/ui-react` provides React wrappers for `@editora/ui-core` Web Components, offering React-friendly props, typed callback details, and hooks/providers for enhanced developer experience.

**Package Details:**
- Version: 0.1.5
- Dependencies: `@editora/ui-core`, `@editora/toast`
- Peer Dependencies: `react`, `react-dom`
- License: MIT

**Import Paths:**
- `@editora/ui-react`: compatibility entrypoint for existing usage
- `@editora/ui-react/client`: explicit client entrypoint for interactive components in Next/Remix/RSC apps
- `@editora/ui-react/server`: server-safe subset for RSC/SSR imports

Current `server` subset: `Box`, `Flex`, `Grid`, `Container`, `DirectionProvider`, `Anchor`, `AspectRatio`, `Field`, `Icon`, `Label`, `Section`, `Separator`, `VisuallyHidden`

## Component Categories

### 1. Form and Input Components

Components for building forms, collecting user input, and managing form state.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Form** | Form wrapper with validation and submission handling | `useForm` hook, validation, autosave, guards |
| **Field** | Form field wrapper with label and error handling | Required indicators, error messages, layout |
| **Input** | Text input with validation and formatting | Types, validation, clearable, icons |
| **Textarea** | Multi-line text input | Resize options, validation |
| **PasswordField** | Password input with show/hide toggle | Strength validation, reveal button |
| **Select** | Single-select dropdown | Searchable, clearable, custom options |
| **Combobox** | Searchable dropdown with filtering | Async loading, custom templates |
| **MultiSelect** | Multi-select dropdown | Chip display, search, clearable |
| **Checkbox** | Checkbox input | Indeterminate state, grouping |
| **RadioGroup** | Radio button group | Vertical/horizontal layout |
| **Switch** | Toggle switch | On/off states, labels |
| **Slider** | Range slider input | Min/max, step, marks |
| **NumberField** | Numeric input | Min/max, step, formatting |
| **DateField** | Date input field | Format validation, min/max |
| **TimeField** | Time input field | 12/24 hour format, validation |
| **DatePicker** | Calendar date picker | Range selection, disabled dates |
| **DateRangePicker** | Date range picker | Start/end dates, presets |
| **TimePicker** | Time picker | Hours/minutes, AM/PM |
| **DateTimePicker** | Combined date and time picker | Full datetime selection |
| **DateRangeTimePicker** | Date range with time picker | Complex scheduling scenarios |
| **ColorPicker** | Color selection component | HEX/RGB/HSL, presets, alpha |
| **FileUpload** | File upload with drag & drop | Multiple files, validation, progress |
| **TagsInput** | Tag-based input | Add/remove tags, validation |
| **PinInput** | OTP/PIN input | Auto-focus, validation, masking |
| **InlineEdit** | Inline editing component | Edit/save/cancel, validation |

### 2. Data Display and Management

Components for displaying and managing data collections.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Table** | Basic table component | Sorting, selection, pagination |
| **DataTable** | Advanced data table | Filtering, virtualization, export |
| **Pagination** | Pagination controls | Page navigation, size selection |
| **Chart** | Data visualization | Line, bar, pie charts, customization |
| **Timeline** | Timeline visualization | Events, milestones, vertical/horizontal |
| **Gantt** | Project timeline chart | Tasks, dependencies, progress |
| **Tree** | Hierarchical data display | Expand/collapse, selection, drag-drop |
| **Listbox** | List selection component | Single/multi select, virtualization |
| **TransferList** | Dual-list selection | Move items between lists |
| **Sortable** | Production drag-and-drop workspace | Reordering, multi-list transfer, nesting, cloning, keyboard sorting, persistence |
| **DataTable** | Advanced data grid | Sorting, filtering, grouping, export |

### 3. Overlay and Modal Components

Components for overlays, modals, and contextual information.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Dialog** | Modal dialog with content | Promise API, providers, theming |
| **AlertDialog** | Alert dialog with actions | Confirmation, prompts, alerts |
| **Popover** | Floating content container | Positioning, arrow, interaction |
| **Tooltip** | Hover information display | Placement, delay, interactive |
| **HoverCard** | Enhanced hover information | Rich content, delay, positioning |
| **Dropdown** | Dropdown menu | Trigger, positioning, keyboard nav |
| **Menu** | Menu system | Submenus, keyboard navigation |
| **Menubar** | Horizontal menu bar | Application menus, shortcuts |
| **ContextMenu** | Right-click context menu | Dynamic content, positioning |
| **Drawer** | Slide-out panel | Position, size, backdrop |
| **CommandPalette** | Command interface | Search, actions, keyboard shortcuts |
| **Toast** | Toast notifications | Auto-dismiss, positioning, types |
| **ToastAPI** | Toast management API | Programmatic control, stacking |
| **Presence** | Mount/unmount animations | Transition states, visibility |
| **Portal** | Render to different DOM node | Teleport content, z-index control |

### 4. Navigation and Layout

Components for application structure and navigation.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Layout** | Application layout container | Header, sidebar, content areas |
| **Sidebar** | Side navigation panel | Collapsible, persistent, overlay |
| **AppHeader** | Application header | Branding, navigation, actions |
| **Breadcrumb** | Navigation breadcrumbs | Links, separators, truncation |
| **NavigationMenu** | Complex navigation | Mega menus, dropdowns, icons |
| **Tabs** | Tabbed interface | Vertical/horizontal, content switching |
| **Accordion** | Collapsible sections | Multiple/single expand, icons |
| **Collapsible** | Simple collapse/expand | Content hiding, animations |
| **Stepper** | Step-by-step wizard | Linear/non-linear, validation |
| **Wizard** | Multi-step form wizard | Navigation, progress, validation |
| **PanelGroup** | Resizable panel layout | Splitter, orientation, sizes |
| **Container** | Content container | Max-width, padding, responsive |
| **Section** | Content section wrapper | Styling, spacing, theming |
| **Box** | Layout primitive | Flex, grid, spacing, sizing |
| **Flex** | Flexbox layout | Direction, wrap, alignment |
| **Grid** | CSS Grid layout | Columns, rows, gaps, areas |
| **PlacementGrid** | Explicit placement grid | Row-major ordering, exact coordinates, keyboard navigation, draggable swaps |
| **MasonryGrid** | Masonry-style card layout | Responsive columns, column width, packed vertical flow |
| **Separator** | Visual separator | Horizontal/vertical, styling |
| **VisuallyHidden** | Screen reader content | Accessibility, hidden content |

### 5. Interactive and Utility Components

Components for user interaction and utility functions.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Button** | Clickable button | Variants, sizes, loading, icons |
| **SplitButton** | Button with dropdown | Primary action, additional options |
| **Badge** | Status indicator | Colors, variants, positioning |
| **Breadcrumb** | Navigation breadcrumb | Hierarchical navigation, collapse, keyboard support |
| **Alert** | Alert messages | Types, dismissible, actions |
| **EmptyState** | Empty content display | Illustrations, actions, messaging |
| **Skeleton** | Loading placeholder | Animation, shapes, sizing |
| **Progress** | Progress indicator | Determinate/indeterminate, labels |
| **Meter** | Meter/bar indicator | Value ranges, colors, labels |
| **SpinningText** | Circular animated text | Speed, direction, center slot, reduced-motion support |
| **NumberTicker** | Animated numeric counter | Count up/down, odometer mode, viewport trigger, formatting, pause controls |
| **IconCloud** | Interactive 3D icon cloud | Sphere projection, pointer tilt, center slot, pause controls |
| **Avatar** | User/profile image | Fallbacks, sizes, status |
| **Icon** | Icon component | SVG, custom, sizing, colors |
| **AspectRatio** | Aspect ratio container | Responsive, content fitting |
| **Label** | Form labels | Required indicators, styling |
| **Description** | Field descriptions | Help text, validation messages |
| **FieldError** | Field error display | Validation errors, styling |
| **ControlGroup** | Grouped controls | Layout, spacing, theming |
| **Fieldset** | Form fieldset | Legend, grouping, styling |

### 6. Providers and Hooks

React providers and hooks for state management and functionality.

| Component/Hook | Description | Key Features |
|----------------|-------------|--------------|
| **ThemeProvider** | Theme context provider | Token management, persistence |
| **useTheme** | Theme hook | Current tokens, setters |
| **DialogProvider** | Dialog management | Promise API, stacking |
| **useDialog** | Dialog hook | Open/close, configuration |
| **AlertDialogProvider** | Alert dialog management | Prompts, confirms, alerts |
| **useAlertDialog** | Alert dialog hook | Promise-based interactions |
| **useForm** | Form management hook | Validation, submission, state |
| **useFloating** | Floating element hook | Positioning, interactions |
| **DirectionProvider** | RTL support | Direction context, overrides |

### 7. Advanced Components

Specialized components for complex use cases.

| Component | Description | Key Features |
|-----------|-------------|--------------|
| **Command** | Command interface | Actions, shortcuts, search |
| **QuickActions** | Quick action panel | Floating, keyboard shortcuts |
| **FloatingToolbar** | Floating toolbar | Positioning, actions, context |
| **BlockControls** | Block-level controls | Positioning, actions, context |
| **SelectionPopup** | Selection context menu | Positioning, actions, context |
| **PluginPanel** | Plugin interface | Integration, communication |
| **PluginPanel** | Plugin interface | Integration, communication |
| **PluginPanel** | Plugin interface | Integration, communication |

## Component Architecture

### Wrapper Pattern
All components follow a consistent wrapper pattern:
- Forward refs to underlying web components
- Convert React props to web component attributes
- Handle event listeners and callbacks
- Provide TypeScript type safety

### Event Handling
- Typed event detail objects
- React-friendly callback signatures
- Automatic event listener cleanup
- Consistent error handling

### Styling and Theming
- CSS custom properties integration
- Theme token support
- Variant and size system
- Responsive design support

### Accessibility
- ARIA attributes handling
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Usage Patterns

### Basic Usage
```tsx
import { Button, Input, Form } from '@editora/ui-react';

function BasicExample() {
  return (
    <Form>
      <Input name="email" type="email" required />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### Advanced Patterns
```tsx
import { useForm, useDialog } from '@editora/ui-react';

function AdvancedExample() {
  const { ref, submit, isDirty } = useForm();
  const dialog = useDialog();

  const handleSubmit = async (values) => {
    const confirmed = await dialog.confirm({
      title: 'Save changes?',
      description: 'This will update your profile.'
    });
    
    if (confirmed) {
      // Save logic
    }
  };

  return (
    <Form ref={ref} onSubmit={handleSubmit}>
      {/* Form content */}
      <Button onClick={() => submit()} disabled={!isDirty()}>
        Save
      </Button>
    </Form>
  );
}
```

### MasonryGrid Usage
```tsx
import { Card, MasonryGrid } from '@editora/ui-react';

function MasonryGridExample() {
  return (
    <MasonryGrid columns={{ initial: 1, md: 2, lg: 3 }} gap="lg">
      <Card style={{ padding: 20, minHeight: 140 }}>Uneven-height card</Card>
      <Card style={{ padding: 20, minHeight: 280 }}>Gallery tile</Card>
      <Card style={{ padding: 20, minHeight: 180 }}>Dashboard module</Card>
      <Card style={{ padding: 20, minHeight: 320 }}>Tall narrative panel</Card>
    </MasonryGrid>
  );
}
```

Recommended use cases:
- uneven-height cards
- gallery-style layouts
- dashboard and content walls
- visually packed columns

### SpinningText Usage
```tsx
import { SpinningText } from '@editora/ui-react';

function SpinningTextExample() {
  return (
    <SpinningText
      text="Editora launch systems editorial motion"
      repeat={2}
      speed={4}
      variant="glass"
      tone="brand"
      size="xl"
      pauseOnHover
    >
      <SpinningText.Center>ET</SpinningText.Center>
    </SpinningText>
  );
}
```

Recommended use cases:
- hero seals and launch badges
- trust marks and verification medallions
- brand loops and editorial motion accents
- center-slot icon or image treatments

### NumberTicker Usage
```tsx
import { NumberTicker } from '@editora/ui-react';

function NumberTickerExample() {
  return (
    <NumberTicker
      value={128420}
      from={120000}
      duration={1400}
      formatStyle="currency"
      currency="USD"
      animation="odometer"
      stagger={20}
      size="xl"
      tone="brand"
    />
  );
}
```

Recommended use cases:
- KPI cards and dashboard metrics
- growth deltas and percentage summaries
- financial counters and revenue blocks
- compact usage totals and operational stats
- hero stats with odometer-style digit motion
- long pages that should animate only when the metric enters view

### IconCloud Usage
```tsx
import { IconCloud } from '@editora/ui-react';

function IconCloudExample() {
  return (
    <IconCloud radius={124} perspective={940} speed={1} interactive autoFit pauseOnHover>
      <IconCloud.Center>Core</IconCloud.Center>
      <IconCloud.Item clickable aria-label="Search">S</IconCloud.Item>
      <IconCloud.Item clickable aria-label="Trust">T</IconCloud.Item>
      <IconCloud.Item clickable aria-label="Metrics">M</IconCloud.Item>
    </IconCloud>
  );
}
```

Recommended use cases:
- integration and product ecosystems
- spatial launchers and navigable icon clusters
- interactive hero compositions
- animated tag clouds with a center focal point

## Migration and Compatibility

### From Other Libraries
- Props mapping guide available
- Event handling differences documented
- Styling migration tools provided

### Version Compatibility
- Semantic versioning
- Breaking change documentation
- Migration guides for major versions

This registry serves as the foundation for detailed component documentation, providing an overview of the entire component ecosystem available in `@editora/ui-react`.
