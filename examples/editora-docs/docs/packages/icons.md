---
title: "@editora/icons"
description: Framework-agnostic icon package usage and rendering guidance for @editora/icons.
keywords: [editora, icons, svg, icon system, theming]
---

# @editora/icons

Framework-agnostic icon registry + rendering package.

## Installation

```bash
npm i @editora/icons
```

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `iconDefinitions`, `iconNameList` | Data exports | Built-in icon metadata catalog |
| `getIcon`, `hasIcon`, `listIcons`, `listIconAliases`, `resolveIcon` | Registry functions | Query and resolve icons/aliases |
| `registerIcon`, `registerIcons` | Registry functions | Register custom icon definitions |
| `renderIconSvg`, `iconToDataUri` | Render functions | SVG string and data-URI generation |
| `registerWithEditoraUI(registerFn)` | Integration helper | Push icon set into UI-core registries |
| `IconAttrValue`, `IconDefinition`, `IconGlyph`, `IconNode`, `IconRenderOptions`, `IconTag`, `IconVariant`, `ResolvedIcon` | Type exports | Icon typing for authoring and rendering |

## Usage Example

```ts
import { renderIconSvg } from "@editora/icons";

const svg = renderIconSvg("check", {
  variant: "outline",
  size: 16,
  color: "currentColor",
  strokeWidth: 1.5,
});
```

## Best Practices

- Use `currentColor` for theme-aware icon rendering.
- Register custom icons once during app bootstrap.
- Keep icon names stable across versions.

## Accessibility

Ensure icon-only controls include text alternatives via button labels or aria labels.

## Performance Notes

Prefer static imports and avoid repeated runtime registration on frequent renders.

The package root holds the whole catalog (504 icons, about 48 KB gzipped). To ship only the icons you use, import them one by one from `@editora/icons/glyphs` and draw them with `renderIconDefinition` from `@editora/icons/renderer`:

```ts
import { checkIcon } from "@editora/icons/glyphs";
import { renderIconDefinition } from "@editora/icons/renderer";

const svg = renderIconDefinition(checkIcon, { size: 16 });
```

With the UI components, pass them to `addIcons` from `@editora/ui-core/add-icons` before they first render; `<ui-icon>` then draws them without fetching the catalog:

```ts
import { addIcons } from "@editora/ui-core/add-icons";
import { checkIcon, searchIcon } from "@editora/icons/glyphs";

addIcons(checkIcon, searchIcon);
```
