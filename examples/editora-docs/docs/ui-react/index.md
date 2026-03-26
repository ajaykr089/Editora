---
title: "@editora/ui-react"
description: React-first UI package for Editora application and editor interfaces.
keywords: [ui-react, react components, editora]
---

# @editora/ui-react

React-first UI package for Editora application and editor interfaces.

## Installation

```bash
npm i @editora/ui-react @editora/ui-core
```

## Quick Start

```tsx
import { ThemeProvider, Button, DialogProvider } from "@editora/ui-react";

export function App() {
  return (
    <ThemeProvider>
      <DialogProvider>
        <Button variant="primary">Save</Button>
      </DialogProvider>
    </ThemeProvider>
  );
}
```

## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| `Button`, `Tooltip`, `Alert`, `Dropdown`, `Input`, `Textarea`, `Field`, `Combobox` | Component exports | Base controls |
| `Badge`, `EmptyState`, `AnimatedNumber`, `Table`, `DataTable`, `Chart`, `Timeline`, `Calendar` | Component exports | Data display controls |
| `ColorPicker`, `DatePicker`, `DateRangePicker`, `TimePicker`, `DateTimePicker`, `DateRangeTimePicker` | Component exports | Date/time and color controls |
| `Gantt`, `Stepper`, `Wizard`, `QuickActions` | Component exports | Workflow controls |
| `NavigationMenu`, `Menubar`, `Dialog`, `Popover`, `Tabs`, `Menu`, `ContextMenu` | Component exports | Nav + overlay components |
| `FloatingToolbar`, `BlockControls`, `CommandPalette`, `SelectionPopup`, `PluginPanel` | Component exports | Editor-specific surfaces |
| `Form`, `useForm`, `useFloating` | Component + hooks | Form and floating behavior |
| `Box`, `Flex`, `Grid`, `Section`, `Container`, `Sidebar`, `Breadcrumb`, `AppHeader`, `Drawer`, `Layout` | Component exports | Layout system |
| `ThemeProvider`, `useTheme` | Provider + hook | Theme control |
| `DialogProvider`, `useDialog`, `AlertDialogProvider`, `useAlertDialog` | Providers/hooks | Dialog state APIs |
| `Icon` | Component export | Icon wrapper |
| `Toast`, `ToastAPI`, `toast`, `toastApi` | Toast exports | Notification APIs |
| `Checkbox`, `RadioGroup`, `Switch`, `Toggle`, `ToggleGroup`, `AspectRatio`, `Avatar`, `Presence`, `Progress`, `Portal`, `ScrollArea`, `Separator`, `Slot`, `Toolbar`, `VisuallyHidden`, `Collapsible`, `Pagination`, `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionPanel`, `DirectionProvider`, `HoverCard`, `Label`, `AlertDialog`, `Select`, `Slider`, `Skeleton` | Component exports | Primitive catalog |

## Best Practices

- Keep provider boundaries explicit and stable.
- Reuse composition patterns across screens for consistency.
- Wrap high-frequency subtrees with memoized adapters where needed.

## Accessibility

Validate aria labels, tab order, and focus return for dialog + menu flows.

## Performance Notes

Prevent broad context churn and avoid recreating large prop objects on every render.
