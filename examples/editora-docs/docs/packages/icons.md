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
| `searchIcons(query, { category?, limit? })`, `listIconCategories()` | Search functions | Ranked search by name, alias, tag and category; categories with counts for picker filters |
| `registerIcon`, `registerIcons` | Registry functions | Register custom icon definitions |
| `renderIconSvg`, `iconToDataUri` | Render functions | SVG string and data-URI generation |
| `renderIconDefinition`, `getRegisteredIcon` | Render functions (also in `@editora/icons/renderer`) | Draw a definition without the catalog; look up an icon registered by name |
| `checkIcon`, `chevronDownIcon`, … (`@editora/icons/glyphs`) | Per-icon exports | One definition per built-in icon, for tree shaking |
| `registerWithEditoraUI(registerFn)` | Integration helper | Push icon set into UI-core registries |
| `IconName`, `IconAttrValue`, `IconDefinition`, `IconGlyph`, `IconNode`, `IconRenderOptions`, `IconTag`, `IconVariant`, `ResolvedIcon` | Type exports | Icon typing for authoring and rendering; `IconName` is every built-in name |

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

To build an icon picker, search instead of filtering names yourself. Results come best first and say what matched:

```ts
import { listIconCategories, searchIcons } from "@editora/icons";

searchIcons("bin");                         // [{ name: "trash", matchedBy: "tag", matched: "bin", score: 105 }]
searchIcons("arrow", { category: "arrows", limit: 10 });
listIconCategories();                        // [{ name: "abstract", count: 6 }, ...]
```

Names autocomplete, and `IconName` catches a typo in names you keep in your own data:

```ts
import type { IconName } from "@editora/icons";

const menu: Array<{ label: string; icon: IconName }> = [
  { label: "Orders", icon: "order" },
  { label: "Settings", icon: "settings" },
];
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
