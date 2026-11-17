---
title: "@editora/react-icons"
description: React icon components, provider usage, and performance guidance for @editora/react-icons.
keywords: [editora, react-icons, react, provider, icons]
---

# @editora/react-icons

React icon component layer for the Editora icon catalog.

## Installation

```bash
npm i @editora/react-icons @editora/icons
```

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `Icon` | Component export | Dynamic icon renderer by name |
| `createIcon` | Factory export | Build icon components programmatically |
| `IconContext`, `IconProvider`, `useIconContext`, `defaultIconContext` | Context exports | Provider and hook for shared defaults |
| `Icons`, `icons`, `iconNames`, `getIconComponent` | Registry exports | Catalog and dynamic component lookup |
| `export * from './icons'` | Component exports | Named icon components |
| `searchIcons`, `listIconCategories` | Search exports | Ranked icon search and categories, re-exported from `@editora/icons` |
| `IconBaseProps`, `IconComponent`, `IconContextValue`, `IconFlip`, `IconProps`, `NamedIconProps`, `IconName` | Type exports | Component + context typing |

## Usage Example

```tsx
import { IconProvider, Icon, CheckIcon } from "@editora/react-icons";

export function ToolbarStatus() {
  return (
    <IconProvider value={{ size: 18, variant: "outline" }}>
      <CheckIcon ariaLabel="Success" />
      <Icon name="x" ariaLabel="Close" />
    </IconProvider>
  );
}
```

## Best Practices

- Use named components for static icon usage.
- Use `Icon` + `name` for dynamic icon selection.
- Apply provider defaults at layout/app-shell level.

## Accessibility

Provide labels for icon-only actions (`aria-label` or visible text).

## Performance Notes

Avoid creating component factories in render paths; use static imports or memoized lookup.
