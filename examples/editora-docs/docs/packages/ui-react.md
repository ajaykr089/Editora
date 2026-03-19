---
title: "@editora/ui-react"
description: React-focused UI layer for Editora applications using @editora/ui-react.
keywords: [editora, ui-react, react components, provider, ui]
---

# @editora/ui-react

React wrapper layer for `@editora/ui-core` components and utilities.

## Installation

```bash
npm i @editora/ui-react @editora/ui-core
```

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `Button`, `Tooltip`, `Alert`, `Dropdown`, `Input`, `Textarea`, `Field`, `Combobox` | Component exports | Base form/interaction components |
| `Badge`, `EmptyState`, `Table`, `DataTable`, `Chart`, `Timeline`, `Calendar`, `Marquee`, `AnimatedText`, `Dock`, `Orbiter` | Component exports | Data display, launcher, and motion components |
| `ColorPicker`, `DatePicker`, `DateRangePicker`, `TimePicker`, `DateTimePicker`, `DateRangeTimePicker` | Component exports | Date/time and color controls |
| `Gantt`, `Stepper`, `Wizard`, `QuickActions` | Component exports | Workflow components |
| `NavigationMenu`, `Menubar`, `ContextMenu`, `Menu`, `Tabs`, `Popover`, `Dialog` | Component exports | Navigation and overlay components |
| `FloatingToolbar`, `BlockControls`, `CommandPalette`, `SelectionPopup`, `PluginPanel` | Component exports | Editor-oriented UI components |
| `Form` | Component export | Form wrapper component |
| `useForm`, `useFloating` | Hook exports | Form and floating-position hooks |
| `Box`, `Flex`, `Grid`, `Section`, `Container`, `Sidebar`, `Breadcrumb`, `AppHeader`, `Drawer`, `Layout` | Component exports | Layout system |
| `ThemeProvider`, `useTheme` | Theme exports | Theme provider + hook |
| `DialogProvider`, `useDialog`, `AlertDialogProvider`, `useAlertDialog` | Provider/hooks | Dialog state orchestration |
| `Icon` | Component export | Icon renderer wrapper |
| `Toast`, `ToastAPI`, `toast`, `toastApi` | Toast exports | Toast component + APIs |
| `Checkbox`, `RadioGroup`, `Switch`, `Toggle`, `ToggleGroup`, `AspectRatio`, `Avatar`, `Presence`, `Progress`, `Portal`, `ScrollArea`, `Separator`, `Slot`, `Toolbar`, `VisuallyHidden`, `Collapsible`, `Pagination`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`, `DirectionProvider`, `HoverCard`, `Label`, `AlertDialog`, `Select`, `Slider`, `Skeleton` | Component exports | Full primitive/component catalog |

## Best Practices

- Mount providers at app-shell level.
- Keep provider order consistent across routes/layouts.
- Co-locate component examples with domain pages for discoverability.

## Accessibility

Validate keyboard navigation and screen-reader labels for all composed controls.

## Performance Notes

Memoize heavy composite views and avoid broad context updates in high-frequency interaction zones.
