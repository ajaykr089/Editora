---
title: "@editora/ui-core"
description: UI primitives, dialogs, and shared interaction utilities provided by @editora/ui-core.
keywords: [editora, ui-core, primitives, dialogs, components]
---

# @editora/ui-core

Framework-agnostic Web Components and utilities for the Editora UI ecosystem.

## Installation

```bash
npm i @editora/ui-core
```

```ts
import "@editora/ui-core";
```

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `showToast` | Function export | Toast helper from UI-core layer |
| `createDialogManager`, `createAlertDialogManager` | Function exports | Promise-based dialog manager APIs |
| `signal` package exports (`export * from './signal'`) | State exports | Reactive signal/computed/effect utilities |
| `ElementBase` exports (`export * from './ElementBase'`) | Base class exports | Shared custom-element base primitives |
| `export * from './theme'` | Theme exports | Token + theme utility contracts |
| `export * from './portal'` | Portal exports | Portal management utilities |
| `export * from './focusManager'` | Focus exports | Focus orchestration utilities |
| `export * from './overlayManager'` | Overlay exports | Overlay stacking/lifecycle helpers |
| `export * from './plugin'` | Plugin exports | UI plugin integration APIs |
| `export * from './icons'` | Icon exports | UI icon registry helpers |
| `UIButton`, `UITooltip`, `UIDropdown`, `UIInput`, `UIForm`, `UIPopover`, `UITabs`, `UIMenu`, `UIIcon`, `UIToast`, `UILabel` | Component class exports | Core controls |
| `UIPagination`, `UIHoverCard`, `UICollapsible`, `UIDirectionProvider`, `UIAccordion`, `UICheckbox`, `UIRadioGroup`, `UISwitch`, `UISlider`, `UISelect`, `UIToggle`, `UIToggleGroup` | Component class exports | Inputs + interaction controls |
| `UIAlertDialog`, `UIAspectRatio`, `UIAvatar`, `UIBadge`, `UITable`, `UINavigationMenu`, `UIMenubar`, `UIContextMenu` | Component class exports | Data/navigation primitives |
| `UIPresence`, `UIProgress`, `UIMarquee`, `UIAnimatedText`, `UIAnimatedBeam`, `UIDock`, `UIOrbiter`, `UIScrollArea`, `UISeparator`, `UISlot`, `UIToolbar`, `UIPortal`, `UIVisuallyHidden` | Component class exports | Accessibility/layout utilities |

## Component Docs

- [Dock](/docs/ui-core/dock) - MacOS-style launcher and command shelf with magnification and roving focus
- [Marquee](/docs/ui-core/marquee) - Infinite scrolling rail for text, cards, media, and vertical feeds
- [AnimatedText](/docs/ui-core/animated-text) - Text-first animation primitive for hero copy, status callouts, and narrative UI
- [AnimatedBeam](/docs/ui-core/animated-beam) - Animated integration-diagram beams between nodes and hubs
- [Orbiter](/docs/ui-core/orbiter) - Multi-ring orbital motion around a central focal point
| `UIBox`, `UIFlex`, `UIGrid`, `UISection`, `UIContainer`, `UIBreadcrumb`, `UISidebar`, `UIAppHeader`, `UIDrawer`, `UIDialog`, `UILayout` | Component class exports | Layout and shell components |
| `UIBlockControls`, `UIPluginPanel`, `UIFloatingToolbar`, `UISelectionPopup`, `UICommandPalette` | Component class exports | Editor-oriented controls |
| `UITextarea`, `UIField`, `UICombobox`, `UIAlert`, `UISkeleton`, `UIEmptyState`, `UIDataTable`, `UIChart`, `UITimeline`, `UICalendar`, `UIOdometer` | Component class exports | Form/data presentation |
| `UIColorPicker`, `UIDatePicker`, `UIDateRangePicker`, `UITimePicker`, `UIDateTimePicker`, `UIDateRangeTimePicker`, `UIGantt`, `UIStepper`, `UIWizard`, `UIQuickActions` | Component class exports | Advanced input + workflow components |
| `UIAlertDialog*` and `UIDialog*` detail/template types | Type exports | Dialog event/detail typing |

## Best Practices

- Import UI core once at app bootstrap to register custom elements.
- Keep dialog manager instances at application scope.
- Use token/theme exports for consistent component theming.

## Accessibility

Validate semantic roles, focus traps, and keyboard interactions for dialog/overlay components.

## Performance Notes

Avoid repeated global registration and minimize unnecessary portal churn in overlay-heavy screens.
