# Editora Component Inventory

This file is the canonical human-readable inventory for the design-system surface area.

Use it to answer two different questions:

- Which entries are actual reusable components or providers?
- Which entries are docs, showcase, or storybook surfaces and should stay out of the component count?

## Canonical Inventory Rules

- Count only reusable exports from the published packages.
- Treat providers and APIs as library surfaces, but do not confuse them with story/demo routes.
- Do not count Storybook showcase pages as components.
- When a React entry does not wrap a `ui-*` element, catalog it as a React composite or React utility.

## Published UI Components

### Foundation and Layout

- `AspectRatio`
- `Box`
- `Card`
- `Container`
- `Flex`
- `Grid`
- `Layout`
- `MasonryGrid`
- `Panel`
- `PanelGroup`
- `PlacementGrid`
- `Section`
- `Separator`
- `Splitter`

### Navigation and Shell

- `Anchor`
- `AppHeader`
- `Accordion`
- `Breadcrumb`
- `NavigationMenu`
- `PageHeader`
- `PageToolbar`
- `RecordHeader`
- `Sidebar`
- `Tabs`

### Inputs and Form Building

- `Calendar`
- `Checkbox`
- `ColorPicker`
- `Combobox`
- `ControlGroup`
- `DateField`
- `DatePicker`
- `DateRangePicker`
- `DateRangeTimePicker`
- `DateTimePicker`
- `Description`
- `Field`
- `FieldError`
- `Fieldset`
- `FileUpload`
- `FiltersBar`
- `Form`
- `Input`
- `InlineEdit`
- `Label`
- `MultiSelect`
- `NumberField`
- `PasswordField`
- `PinInput`
- `RadioGroup`
- `Rating`
- `Select`
- `Slider`
- `SplitButton`
- `Stepper`
- `Switch`
- `TagsInput`
- `Textarea`
- `TimeField`
- `TimePicker`
- `TransferList`
- `Wizard`

### Data Display and Workflow

- `Chart`
- `Carousel`
- `CodeBlock`
- `CodeSnippet`
- `CopyButton`
- `DataTable`
- `DataViewToolbar`
- `EmptyState`
- `Gantt`
- `MetricCard`
- `Pagination`
- `Progress`
- `Skeleton`
- `Sortable`
- `Stat`
- `Table`
- `Timeline`
- `Tree`
- `TreeItem`

### Overlay, Menu, and Command

- `Alert`
- `AlertDialog`
- `BlockControls`
- `Collapsible`
- `Command`
- `CommandPalette`
- `ContextMenu`
- `Dialog`
- `Dock`
- `Drawer`
- `Dropdown`
- `FloatingToolbar`
- `HoverCard`
- `Menu`
- `Menubar`
- `PluginPanel`
- `Popover`
- `QuickActions`
- `SelectionPopup`
- `Toast`
- `Toolbar`
- `Tooltip`

### Visual, Motion, and Status

- `AnimatedBeam`
- `AnimatedList`
- `AnimatedNumber`
- `AnimatedText`
- `Avatar`
- `Badge`
- `Icon`
- `IconCloud`
- `Marquee`
- `Meter`
- `NumberTicker`
- `Odometer`
- `Orbiter`
- `Presence`
- `SpinningText`
- `Toggle`
- `ToggleGroup`

### Primitives and Utilities

- `Collection`
- `DirectionProvider`
- `DismissableLayer`
- `FocusScope`
- `Listbox`
- `Kbd`
- `Portal`
- `Positioner`
- `RovingFocusGroup`
- `ScrollArea`
- `Shortcut`
- `Slot`
- `VisuallyHidden`

## Published Providers and APIs

- `AlertDialogProvider`
- `DialogProvider`
- `ThemeProvider`
- `ToastAPI`

## Naming Normalization

- `DateTimeField` is not a canonical standalone export. Use `DateField`, `TimeField`, or `DateTimePicker`.
- `AlertDialogPromise` maps to `AlertDialogProvider` and `useAlertDialog`.
- `DialogPromise` maps to `DialogProvider` and `useDialog`.

## Storybook and Docs Surfaces, Not Components

- `Button Matrices`
- `Date Time Pickers`
- `Icons Catalog`
- `Layout Showcase`
- `Primitive Wrappers`
- `Reporting Dashboard`
- `Theming`

## Inventory Maintenance Notes

- Regenerate `components.json` after adding or removing component files.
- Keep React composites like `FiltersBar` and `PageHeader` marked as composites instead of pretending they wrap missing `ui-*` elements.
- Add new example-only patterns here only after they graduate into package exports.
