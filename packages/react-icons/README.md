<h1 align="center">@editora/react-icons</h1>

<p align="center">
  The Editora icons as React components. <code>&lt;SearchIcon /&gt;</code> for every icon, <code>&lt;Icon name="…" /&gt;</code>
  for names that come from data, and an <code>IconProvider</code> to set size, colour and weight once.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/react-icons"><img src="https://img.shields.io/npm/v/@editora/react-icons.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/react-icons"><img src="https://img.shields.io/npm/dm/@editora/react-icons.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/react-icons.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/react-icons"><img src="https://img.shields.io/npm/types/@editora/react-icons.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem-storybook.netlify.app/?path=/story/ui-icons-catalog--all-icons">Icon catalog</a> ·
  <a href="https://editora-ecosystem.netlify.app/">Website</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/react-icons/docs/images/quick-start.png" alt="Three square icon buttons holding a search icon, a solid blue bell and a settings icon, the line Changes saved with a green check mark, and a duotone blue shield and pie chart" width="340">
</p>

## Features

- **A component for every icon**: <!-- components:507 -->507 of them (`CheckIcon`, `ChartLineIcon`, `SettingsIcon`...),
  from [`@editora/icons`](https://www.npmjs.com/package/@editora/icons), and `<Icon name="…">` for any name.
- **Typed names.** `IconName` is the union of every name, so a typo in a menu configuration is a compile error.
- **One place for the defaults.** An `IconProvider` sets the size, colour, weight and variant of everything inside it,
  and providers nest.
- **Accessible by default.** An icon is hidden from screen readers unless you give it a title or a label.
- **Inline SVG** that follows `currentColor`, so icons take the colour of the text, in light and dark themes alike.
  They render to markup on the server too.
- Outline for every icon, solid for <!-- solid:21 -->21 of them and duotone for <!-- duotone:2 -->2, three weights, rotate, flip and right-to-left mirroring.
- Written in TypeScript. Components forward their `ref` to the `<svg>` and accept any SVG prop.

## Install

```bash
npm install @editora/react-icons
```

It needs React 16.8 or later, up to React 20. [`@editora/icons`](https://www.npmjs.com/package/@editora/icons), which holds the
icon drawings, is installed with it.

## Quick start

```tsx
import { BellIcon, CheckIcon, ChartPieIcon, Icon, IconProvider, SearchIcon, SettingsIcon } from '@editora/react-icons';

const button = { display: 'grid', placeItems: 'center', width: 36, height: 36, padding: 0, border: '1px solid #d0d7de', borderRadius: 8, background: '#fff', color: '#24292f' };

export default function App() {
  return (
    <IconProvider value={{ size: 18 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {/* A labelled button: the icon in it is decorative, so it needs no name of its own. */}
        <button type="button" aria-label="Search" style={button}>
          <SearchIcon />
        </button>
        <button type="button" aria-label="Notifications" style={button}>
          <BellIcon variant="solid" color="#2563eb" />
        </button>
        <button type="button" aria-label="Settings" style={button}>
          <SettingsIcon />
        </button>
      </div>

      {/* An icon that stands alone gets a name. */}
      <p style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a7f37' }}>
        <CheckIcon ariaLabel="Success" /> Changes saved
      </p>

      {/* Any icon by name, and the duotone variant of the few icons that have one. */}
      <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="shield" variant="duotone" color="#2563eb" secondaryColor="#93c5fd" title="Protected" />
        <ChartPieIcon variant="duotone" color="#2563eb" secondaryColor="#93c5fd" size={24} />
      </p>
    </IconProvider>
  );
}
```

An icon next to text, or inside a button that has its own label, is decorative: it is hidden from screen readers and
needs no name. An icon that stands alone needs one, with `title` (also a tooltip) or `ariaLabel`. Icons are 15 pixels
wide unless the provider or a `size` says otherwise.

## Props

`Icon` and every named component take these props, and any SVG attribute or event handler (`className`, `style`,
`onClick`, `data-*`, `aria-*`). `Icon` also takes `name`, which is required; the named components have their name built
in.

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `IconName \| string` | required | The icon. A name that does not exist renders nothing. |
| `variant` | `'outline' \| 'solid' \| 'duotone'` | `'outline'` | An icon without the variant you ask for is drawn as an outline. |
| `size` | `number \| string` | `15` | Width and height: pixels, or a CSS length such as `'1.5rem'`. |
| `color` | `string` | `'currentColor'` | The icon's colour. |
| `secondaryColor` | `string` | `color` | The second colour of a duotone icon. |
| `iconWeight` | `'thin' \| 'regular' \| 'bold'` | `'regular'` | Stroke width 1.25, 1.5 or 1.75. |
| `strokeWidth` | `number` | `1.5` | Stroke width in pixels. Wins over `iconWeight`. |
| `strokeLinecap`, `strokeLinejoin` | `'butt' \| 'round' \| 'square'`, `'miter' \| 'round' \| 'bevel'` | `'round'` | The ends and the corners of lines. |
| `title` | `string` | none | Adds a `<title>` and names the icon. |
| `ariaLabel` | `string` | none | Names the icon (the `aria-label` attribute does the same). |
| `decorative` | `boolean` | `true` unless it has a name | `true` hides the icon from screen readers. |
| `rotate` | `number` | `0` | Degrees, clockwise. |
| `flip` | `'horizontal' \| 'vertical' \| 'both'` | none | Mirrors the icon. |
| `rtl` | `boolean` | `false` | Mirrors the icons that point a direction (arrows, chevrons, carets). |
| `absoluteStrokeWidth` | `boolean` | none | Does nothing: strokes are the same width on screen at every size. |

Strokes are drawn in screen pixels, so a 1.5 stroke is 1.5 pixels at 12 and at 48. When several settings give a stroke
width, the first of these wins: the `strokeWidth` prop, the `iconWeight` prop, the provider's `strokeWidth`, the
provider's `iconWeight`, and 1.5.

## Set the defaults once

`IconProvider` gives everything inside it a `variant`, `size`, `color`, `secondaryColor`, `iconWeight`, `strokeWidth`,
`strokeLinecap`, `strokeLinejoin`, `decorative`, `className` or `rtl`. A provider inside another one changes what it
sets and keeps the rest, and a prop on an icon beats them all. `useIconContext()` reads the values that are in force.

```tsx
import { BellIcon, HeartIcon, IconProvider, StarIcon, useIconContext } from '@editora/react-icons';

// Reads what the nearest IconProvider decided, as an icon would.
function Readout() {
  const { size, color, iconWeight } = useIconContext();
  return <code style={{ font: '12px ui-monospace, monospace', color: '#57606a' }}>size {String(size)}, {color}, weight {iconWeight ?? 'regular'}</code>;
}

const row = { display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' };

export default function App() {
  return (
    <>
      <IconProvider value={{ size: 28, color: '#24292f' }}>
        <div style={row}>
          <BellIcon /> <StarIcon /> <HeartIcon />
          <Readout />
        </div>

        {/* A nested provider changes what it sets and keeps the rest. */}
        <IconProvider value={{ color: '#2563eb', iconWeight: 'bold' }}>
          <div style={row}>
            <BellIcon /> <StarIcon /> <HeartIcon />
            <Readout />
          </div>
        </IconProvider>
      </IconProvider>

      {/* A prop beats the provider. */}
      <IconProvider value={{ size: 28, color: '#24292f' }}>
        <div style={row}>
          <BellIcon /> <StarIcon color="#d97706" size={40} /> <HeartIcon variant="solid" color="#dc2626" />
        </div>
      </IconProvider>
    </>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/react-icons/docs/images/provider.png" alt="Three rows of icons: a bell, a star and a heart in dark grey at size 28; the same three in blue and a bolder weight from a nested provider, each followed by the values it read; and a grey bell, a larger orange star and a solid red heart whose props beat the provider" width="392">
</p>

## Names from data, and your own icons

Name an icon with a string where the name comes from data. `IconName` makes that string a checked one, and
`getIconComponent(name)` gives you the component when you need one. For an icon of your own, register it with
[`@editora/icons`](https://www.npmjs.com/package/@editora/icons#your-own-icons) and use it as `<Icon name="brand-mark" />`,
or wrap it with `createIcon(name, displayName?)` to get a component like the built-in ones. Install `@editora/icons`
yourself for that, so that your code can import it under pnpm and other strict layouts.

```tsx
import { registerIcon } from '@editora/icons';
import { createIcon, getIconComponent, Icon, type IconName } from '@editora/react-icons';

// Your own icon: register it once, and give it a component if you like.
registerIcon({
  name: 'brand-mark',
  variants: {
    outline: {
      nodes: [
        { tag: 'path', attrs: { d: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z' } },
        { tag: 'path', attrs: { d: 'M12 8v8M8.5 10l7 4' } },
      ],
    },
  },
});
export const BrandIcon = createIcon('brand-mark', 'BrandIcon');

// Names that come from data are typed: a typo is a compile error.
type Item = { label: string; icon: IconName };

const items: Item[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Orders', icon: 'order' },
  { label: 'Reports', icon: 'report' },
  { label: 'Settings', icon: 'settings' },
];

// A component looked up by name, for a UI whose icons are configured elsewhere.
function PluginIcon({ name }: { name: IconName }) {
  const Component = getIconComponent(name);
  return <Component size={16} />;
}

export default function App() {
  return (
    <nav style={{ width: 220, font: '14px system-ui, sans-serif', color: '#24292f' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', fontWeight: 600 }}>
        <BrandIcon size={20} color="#2563eb" title="Brand" /> Acme
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item) => (
          <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
            <Icon name={item.icon} size={16} />
            {item.label}
          </li>
        ))}
        <li style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
          <PluginIcon name="command" />
          Command palette
        </li>
      </ul>
    </nav>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/react-icons/docs/images/dynamic.png" alt="A navigation menu with a blue custom brand icon and the name Acme, then Dashboard, Orders, Reports, Settings and Command palette, each with an icon" width="230">
</p>

## API

| Export | What it is |
| --- | --- |
| `Icon` | The component for any name. |
| `CheckIcon`, `SearchIcon`, … | A component for every icon, named after it in PascalCase (`chart-line` is `ChartLineIcon`). |
| `IconProvider`, `IconContext`, `useIconContext()` | Shared defaults, and a way to read them. |
| `defaultIconContext` | The built-in defaults: outline, 15 pixels, `currentColor`, a 1.5 stroke with round caps and joins. |
| `icons` (also `Icons`), `iconNames` | The map from name to component, and the list of names. |
| `getIconComponent(name)` | The component of a built-in icon, by name. |
| `createIcon(name, displayName?)` | A component for any icon, including one you registered. |

The types are `IconName`, `IconProps`, `NamedIconProps`, `IconContextValue`, `IconComponent`, `IconFlip`,
`IconBaseProps` and `IconWeight`.

## Size, servers and Next.js

Every icon component and the whole catalog are one module, so importing one icon costs the same as importing them all:
about 164 KB minified and 57 KB gzipped, without React. Named imports are not smaller than `<Icon name="…">`. If a
page needs a handful of icons and every kilobyte counts, render them with
[`@editora/icons`](https://www.npmjs.com/package/@editora/icons) and keep the strings.

The components are plain, and render to markup on the server. They use React
context, and the package carries no `'use client'` directive, so in the Next.js App Router use them from a Client
Component, a file that starts with `'use client'`.

If you use [`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react), its `Icon` draws the same icons as the
`<ui-icon>` web component instead.

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
