---
title: "@editora/ui-core"
description: UI primitives and foundational components for Editora integrations.
keywords: [ui-core, components, primitives]
---

# @editora/ui-core

UI primitives and foundational components for Editora integrations.

## Installation

```bash
npm i @editora/ui-core
```

```ts
import "@editora/ui-core";
```

## Quick Start

```ts
import { createDialogManager, showToast } from "@editora/ui-core";

const dialogs = createDialogManager();
await dialogs.alert({ title: "Saved", description: "Document changes were persisted." });
showToast({ message: "Saved", level: "success" });
```

## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| `showToast` | Function export | Notification utility |
| `createDialogManager`, `createAlertDialogManager` | Function exports | Promise-based dialog utilities |
| `export * from './signal'` | Module re-export | Reactive state primitives |
| `export * from './ElementBase'` | Module re-export | Base custom-element utilities |
| `export * from './theme'`, `./portal`, `./focusManager`, `./overlayManager`, `./plugin`, `./icons` | Module re-exports | Shared runtime utilities |
| `UIButton`, `UITooltip`, `UIDropdown`, `UIInput`, `UIForm`, `UIPopover`, `UITabs`, `UIMenu`, `UIIcon`, `UIToast`, `UILabel` | Class exports | Core controls |
| `UIPagination`, `UIHoverCard`, `UICollapsible`, `UIDirectionProvider`, `UIAccordion`, `UICheckbox`, `UIRadioGroup`, `UISwitch`, `UISlider`, `UISelect`, `UIToggle`, `UIToggleGroup` | Class exports | Interaction controls |
| `UIAlertDialog`, `UIAspectRatio`, `UIAvatar`, `UIBadge`, `UITable`, `UINavigationMenu`, `UIMenubar`, `UIContextMenu` | Class exports | Navigation/data primitives |
| `UIPresence`, `UIProgress`, `UIScrollArea`, `UISeparator`, `UISlot`, `UIToolbar`, `UIPortal`, `UIVisuallyHidden` | Class exports | Utility primitives |
| `UIBox`, `UIFlex`, `UIGrid`, `UISection`, `UIContainer`, `UIBreadcrumb`, `UISidebar`, `UIAppHeader`, `UIDrawer`, `UIDialog`, `UILayout` | Class exports | Layout system |
| `UIBlockControls`, `UIPluginPanel`, `UIFloatingToolbar`, `UISelectionPopup`, `UICommandPalette` | Class exports | Editor-oriented controls |
| `UITextarea`, `UIField`, `UICombobox`, `UIAlert`, `UISkeleton`, `UIEmptyState`, `UIDataTable`, `UIChart`, `UITimeline`, `UICalendar`, `UIOdometer` | Class exports | Form/data components |
| `UIColorPicker`, `UIDatePicker`, `UIDateRangePicker`, `UITimePicker`, `UIDateTimePicker`, `UIDateRangeTimePicker`, `UIGantt`, `UIStepper`, `UIWizard`, `UIQuickActions` | Class exports | Advanced input/workflow components |
| Dialog type contracts (`UIAlertDialog*`, `UIDialog*`) | Type exports | Typed dialog payload/event details |

## Best Practices

- Register once during app startup.
- Keep dialog manager instances shared at app shell level.
- Use theme tokens for all brand customizations.

## Accessibility

Check keyboard focus, escape handling, and role semantics for all overlay components.

## Performance Notes

Avoid repetitive global registrations and keep portal-driven overlays lightweight.
