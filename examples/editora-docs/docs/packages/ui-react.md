---
title: "@editora/ui-react"
description: React-focused UI layer for Editora applications using @editora/ui-react.
keywords: [editora, ui-react, react components, provider, ui]
---

# @editora/ui-react

React wrapper layer for `@editora/ui-core` components and utilities.

## Runtime Entry Points

`@editora/ui-react` remains the compatibility entry and is client-oriented.

- `@editora/ui-react`: existing broad entrypoint, safe for current consumers
- `@editora/ui-react/client`: explicit client entry for Next/Remix/RSC apps
- `@editora/ui-react/server`: server-safe subset for RSC/SSR imports

The current server-safe subset is intentionally small and only includes components that do not rely on effects or imperative DOM syncing: `Box`, `Flex`, `Grid`, `Container`, `DirectionProvider`, `Anchor`, `AspectRatio`, `CodeBlock`, `CodeSnippet`, `Field`, `Icon`, `Kbd`, `Label`, `MetricCard`, `Section`, `Separator`, `Shortcut`, `Stat`, and `VisuallyHidden`.

## Installation

```bash
npm i @editora/ui-react @editora/ui-core
```

## Showcase App

For an end-to-end example that uses this package in a realistic admin product, see:

- [`Hospital Management Showcase`](/docs/examples/hospital-management-showcase)

That app is the recommended advanced reference for how `@editora/ui-react` surfaces compose in a routed application with data tables, drawers, dialogs, calendars, date pickers, progress states, and record-level workflows.

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `Button`, `Tooltip`, `Alert`, `Dropdown`, `Input`, `Textarea`, `Field`, `Combobox` | Component exports | Base form/interaction components |
| `Badge`, `EmptyState`, `AnimatedNumber`, `Table`, `DataTable`, `FiltersBar`, `DataViewToolbar`, `Chart`, `Timeline`, `Calendar`, `Carousel`, `Stat`, `MetricCard`, `PageHeader`, `PageToolbar`, `RecordHeader`, `CodeBlock`, `CodeSnippet`, `CopyButton` | Component exports | Data display, motion, metric, docs, list-page, and page-shell utility components |
| `ColorPicker`, `DatePicker`, `DateRangePicker`, `TimePicker`, `DateTimePicker`, `DateRangeTimePicker` | Component exports | Date/time and color controls |
| `Gantt`, `Stepper`, `Wizard`, `QuickActions` | Component exports | Workflow components |
| `NavigationMenu`, `Menubar`, `ContextMenu`, `Menu`, `Tabs`, `Popover`, `Dialog` | Component exports | Navigation and overlay components |
| `FloatingToolbar`, `BlockControls`, `CommandPalette`, `SelectionPopup`, `PluginPanel` | Component exports | Editor-oriented UI components |
| `Form` | Component export | Form wrapper component |
| `useForm`, `useFloating` | Hook exports | Form and floating-position hooks |
| `Box`, `Flex`, `Grid`, `Section`, `Container`, `Sidebar`, `Breadcrumb`, `AppHeader`, `Drawer`, `Layout`, `Kbd`, `Shortcut` | Component exports | Layout system and keyboard hint surfaces |
| `ThemeProvider`, `useTheme` | Theme exports | Theme provider + hook |
| `DialogProvider`, `useDialog`, `AlertDialogProvider`, `useAlertDialog` | Provider/hooks | Dialog state orchestration |
| `Icon` | Component export | Icon renderer wrapper |
| `Toast`, `ToastAPI`, `toast`, `toastApi` | Toast exports | Toast component + APIs |
| `Checkbox`, `RadioGroup`, `Switch`, `Toggle`, `ToggleGroup`, `AspectRatio`, `Avatar`, `Presence`, `Progress`, `Portal`, `ScrollArea`, `Separator`, `Slot`, `Toolbar`, `VisuallyHidden`, `Collapsible`, `Pagination`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`, `DirectionProvider`, `HoverCard`, `Label`, `AlertDialog`, `Select`, `Slider`, `Skeleton` | Component exports | Full primitive/component catalog |

## Best Practices

- Mount providers at app-shell level.
- Keep provider order consistent across routes/layouts.
- Co-locate component examples with domain pages for discoverability.
- In Next/Remix/RSC apps, prefer `@editora/ui-react/client` for interactive wrappers and `@editora/ui-react/server` for server-safe layout primitives.

## Accessibility

Validate keyboard navigation and screen-reader labels for all composed controls.

## Performance Notes

Memoize heavy composite views and avoid broad context updates in high-frequency interaction zones.
