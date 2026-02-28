# @editora/react-icons

React icon components and theming context for `@editora/icons`.

`@editora/react-icons` gives you:
- a generic `<Icon name="...">` renderer,
- named React icon components (e.g. `CheckIcon`, `ChartLineIcon`),
- shared defaults via `IconProvider`,
- type-safe icon names via `IconName`.

<div align="center">
  <img src="../../images/icon-catalog.png" alt="Icon Catalog" width="600" style="max-width: 100%;" height="auto">
</div>
## Installation

```bash
npm install @editora/react-icons @editora/icons
```

Peer dependencies:
- `react` `^16.8 || ^17 || ^18 || ^19`

## Quick Start

```tsx
import { IconProvider, Icon, CheckIcon, ChartLineIcon } from '@editora/react-icons';

export function Example() {
  return (
    <IconProvider
      value={{
        variant: 'outline',
        size: 18,
        color: 'var(--ui-fg)',
        strokeWidth: 1.5
      }}
    >
      <CheckIcon ariaLabel="Saved" />
      <ChartLineIcon variant="duotone" secondaryColor="var(--ui-muted)" />
      <Icon name="command" title="Command palette" />
    </IconProvider>
  );
}
```

## Exported API

### Core components
- `Icon`
- `IconProvider`
- `IconContext`
- `useIconContext()`
- `defaultIconContext`

### Lookup and helpers
- `icons` / `Icons` map (`Record<IconName, IconComponent>`)
- `iconNames` (`IconName[]`)
- `getIconComponent(name)`
- `createIcon(name, displayName?)`

### Named icons
All generated named exports from `src/icons.tsx`, for example:
- `CheckIcon`, `XIcon`, `SearchIcon`, `ChartBarIcon`, `CalendarIcon`, `SettingsIcon`, `CommandIcon`, and many more.

### Type exports
- `IconName`
- `IconProps`
- `NamedIconProps`
- `IconContextValue`
- `IconComponent`
- `IconFlip`
- `IconBaseProps`

## `Icon` Props

`Icon` accepts standard SVG props plus icon-specific props:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `IconName \| string` | required | Icon key from `@editora/icons`. |
| `variant` | `'outline' \| 'solid' \| 'duotone'` | `'outline'` | Glyph variant. |
| `size` | `number \| string` | `15` | Sets `width` and `height`. |
| `color` | `string` | `'currentColor'` | Primary icon color. |
| `secondaryColor` | `string` | `color` | Used by duotone secondary paths. |
| `strokeWidth` | `number` | `1.5` | Stroke thickness for stroked paths. |
| `absoluteStrokeWidth` | `boolean` | `false` | Keeps visual stroke thickness stable across icon sizes. |
| `strokeLinecap` | `'butt' \| 'round' \| 'square'` | `'round'` | Applied when stroke exists. |
| `strokeLinejoin` | `'miter' \| 'round' \| 'bevel'` | `'round'` | Applied when stroke exists. |
| `decorative` | `boolean` | inferred | If `true`, icon is hidden from AT. |
| `title` | `string` | `undefined` | Adds `<title>` and accessible name fallback. |
| `ariaLabel` | `string` | `undefined` | Explicit accessible label. |
| `rotate` | `number` | `0` | Degrees around icon center. |
| `flip` | `'horizontal' \| 'vertical' \| 'both'` | `undefined` | Geometric flip transform. |
| `rtl` | `boolean` | `false` | Mirrors icons marked `rtlMirror` in RTL contexts. |

If an icon name cannot be resolved, `Icon` returns `null`.

## `IconProvider` (Shared Defaults)

`IconProvider` merges with parent context, so nested providers work as expected.

```tsx
import { IconProvider, SearchIcon, SettingsIcon } from '@editora/react-icons';

export function HeaderActions() {
  return (
    <IconProvider value={{ size: 16, color: 'var(--color-fg-muted)' }}>
      <SearchIcon ariaLabel="Search" />
      <IconProvider value={{ color: 'var(--color-primary)' }}>
        <SettingsIcon ariaLabel="Settings" />
      </IconProvider>
    </IconProvider>
  );
}
```

Default context values:
- `variant: 'outline'`
- `size: 15`
- `color: 'currentColor'`
- `secondaryColor: 'currentColor'`
- `strokeWidth: 1.5`
- `strokeLinecap: 'round'`
- `strokeLinejoin: 'round'`

## Usage Patterns

### 1) Named icon imports (best tree-shaking)

```tsx
import { CheckIcon, AlertTriangleIcon } from '@editora/react-icons';

export function Status({ ok }: { ok: boolean }) {
  return ok ? <CheckIcon ariaLabel="Healthy" /> : <AlertTriangleIcon ariaLabel="Warning" />;
}
```

### 2) Dynamic icon rendering from string names

```tsx
import { Icon, type IconName } from '@editora/react-icons';

type Item = { label: string; icon: IconName };

const items: Item[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Orders', icon: 'order' },
  { label: 'Reports', icon: 'report' }
];

export function Sidebar() {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.label}>
          <Icon name={item.icon} aria-hidden size={16} />
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
```

### 3) Runtime lookup for plugin-like UIs

```tsx
import { getIconComponent, type IconName } from '@editora/react-icons';

export function PluginIcon({ name }: { name: IconName }) {
  const Comp = getIconComponent(name);
  return <Comp size={18} aria-hidden />;
}
```

### 4) Create custom named wrappers

```tsx
import { createIcon } from '@editora/react-icons';

export const BillingIcon = createIcon('invoice', 'BillingIcon');
```

## Accessibility

- For decorative icons, use `aria-hidden` or leave `title`/`ariaLabel` unset (decorative mode is inferred).
- For meaningful icons, provide `ariaLabel` or `title`.
- Icons render with `role="img"` when semantic and `role="presentation"` when decorative.

Examples:

```tsx
<CheckIcon aria-hidden />
<CheckIcon ariaLabel="Saved successfully" />
<Icon name="alert-circle" title="Validation error" />
```

## Theming

The library is `currentColor`-first. Prefer CSS tokens/classes instead of hardcoded colors.

```tsx
<IconProvider value={{ color: 'var(--ui-fg)', secondaryColor: 'var(--ui-fg-muted)' }}>
  <Icon name="chart-pie" variant="duotone" />
</IconProvider>
```

## Performance Notes

- Prefer named imports for static icon usage.
- Use dynamic `Icon name="..."` when icon names are data-driven.
- `@editora/react-icons` has `"sideEffects": false` for better tree-shaking.

## Development

```bash
cd packages/react-icons
npm run build
```

Build notes:
- `build` and `build:tsc` run `@editora/icons` type build first.

## Troubleshooting

- Missing icon output:
  - Verify icon name exists in `iconNames`.
  - Check spelling for dynamic names from API/CMS data.
- Icon appears but not semantic to screen readers:
  - Provide `ariaLabel` or `title` for meaningful usage.
- Stroke thickness looks inconsistent across sizes:
  - Try `absoluteStrokeWidth`.
