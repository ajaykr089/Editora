---
title: "@editora/react-icons"
description: React icon components and provider strategy for Editora apps.
keywords: [react-icons, react, icons]
---

# @editora/react-icons

React icon components and provider strategy for Editora apps.

## AI Guides

- [React Icons AI Usage](./ai-usage)
- [React Icons Prompt Pack](./editora-prompts)

## Installation

```bash
npm i @editora/react-icons
```

## Quick Start

```tsx
import { Icon, IconProvider, CheckIcon } from "@editora/react-icons";

export function Demo() {
  return (
    <IconProvider value={{ size: 18, variant: "outline" }}>
      <CheckIcon ariaLabel="Success" />
      <Icon name="x" ariaLabel="Close" />
    </IconProvider>
  );
}
```

## Usage

Use named icon components for static UI and `<Icon name="..." />` for dynamic rendering.

## Examples

- Component-level icon props
- Provider default overrides
- Dynamic icon rendering from server-driven names

## API Reference

| Surface | Type | Notes |
| --- | --- | --- |
| `Icon` | Component export | Generic renderer by icon name |
| `createIcon(name, displayName?)` | Factory export | Creates React icon components |
| `IconProvider`, `IconContext`, `useIconContext`, `defaultIconContext` | Context exports | Provider + context utilities |
| `Icons`, `icons`, `iconNames`, `getIconComponent` | Registry exports | Programmatic icon component access |
| `export * from './icons'` | Component exports | All generated named icon components |
| `IconBaseProps`, `IconProps`, `NamedIconProps`, `IconContextValue`, `IconName` | Type exports | Typed prop/context contracts |

## Best Practices

- Prefer named imports for static icon usage.
- Use provider defaults to keep icon styling consistent.
- Validate icon contrast across theme modes.

## Accessibility

For icon-only buttons, set `aria-label` on the button or icon component.

## Performance Notes

Avoid creating icon components in render loops; use static imports or memoized `getIconComponent` lookups.
