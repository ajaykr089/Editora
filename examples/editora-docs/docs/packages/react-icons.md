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
| `defineIcon` | Factory export | A component from an icon definition (your own, or one from `@editora/icons/glyphs`), without registering it |
| `createIcon` | Factory export | A component that draws a registered icon by name |
| `IconContext`, `IconProvider`, `useIconContext`, `defaultIconContext` | Context exports | Provider and hook for shared defaults |
| `Icons`, `icons`, `iconNames`, `getIconComponent` | Registry exports | Catalog and dynamic component lookup |
| `export * from './icons'` | Component exports | Named icon components |
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

Each named component carries its own glyph, so a bundler keeps only the icons you import: `<CheckIcon />` alone adds about 2.5 KB gzipped. Looking icons up by name (`<Icon name>`, `createIcon`, `icons`, `getIconComponent`) brings the whole catalog, about 50 KB gzipped, so prefer named components where the icon is known in advance.

```tsx
import { defineIcon } from "@editora/react-icons";

export const BrandIcon = defineIcon({
  name: "brand-mark",
  variants: { outline: { nodes: [{ tag: "path", attrs: { d: "M12 3l8 4.5v9L12 21l-8-4.5v-9z" } }] } },
});
```
