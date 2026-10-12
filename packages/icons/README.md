<h1 align="center">@editora/icons</h1>

<p align="center">
  504 SVG icons as plain functions. <code>renderIconSvg('bell')</code> returns the markup: for a page, a server, a
  string template or any framework. Outline, solid and duotone, sizes, weights, colours, RTL and accessible names.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/icons"><img src="https://img.shields.io/npm/v/@editora/icons.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/icons"><img src="https://img.shields.io/npm/dm/@editora/icons.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/icons.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/icons"><img src="https://img.shields.io/npm/types/@editora/icons.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem-storybook.netlify.app/?path=/story/ui-icons-catalog--all-icons">Icon catalog</a> ·
  <a href="https://editora-ecosystem.netlify.app/">Website</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/icons/docs/images/catalog.png" alt="A search box reading Search 504 icons above a grid of icons with their names: abstract-blob, abstract-fractal, accessibility, activity, admin-panel, airplane, alarm, alert-circle and more" width="760">
</p>

## Features

- **<!-- icons:504 -->504 icons** that share one 24 × 24 grid and one line weight, in categories from arrows and files to
  social logos and charts, and **<!-- aliases:1139 -->1139 aliases** for the names you would guess (`tick` and `done` are
  `check`).
- **Plain strings.** `renderIconSvg` returns an `<svg>` string, so it works in the browser, in Node (the server, a build
  script, an email template) and in any framework. `iconToDataUri` gives the same icon for an `<img>` or a CSS background.
- **Outline, solid and duotone**, three weights, any size and colour, rotate, flip and right-to-left mirroring. Strokes
  stay crisp: they are the same width in pixels at every size.
- **Accessible by default.** An icon is hidden from screen readers unless you give it a title or a label.
- **Extensible.** Register your own icons, and they work everywhere the built-in ones do.
- Written in TypeScript, with no dependencies. The whole catalog is about 48 KB gzipped.
- For React, use [`@editora/react-icons`](https://www.npmjs.com/package/@editora/react-icons), which is built on this
  package.

## Install

```bash
npm install @editora/icons
```

## Quick start

A page with no build step loads the module from a CDN:

```html
<style>
  .toolbar { display: flex; gap: 6px; }
  .toolbar button { display: grid; place-items: center; width: 36px; height: 36px; margin: 0; padding: 0; border: 1px solid #d0d7de; border-radius: 8px; background: #fff; color: #24292f; cursor: pointer; }
  .toolbar button:hover { background: #f3f4f6; }
</style>

<div class="toolbar" id="toolbar"></div>

<script type="module">
  import { renderIconSvg } from 'https://cdn.jsdelivr.net/npm/@editora/icons/dist/index.esm.js';

  const actions = { bold: 'Bold', italic: 'Italic', underline: 'Underline', link: 'Insert link', image: 'Insert image', undo: 'Undo' };

  // The button is labelled, so the icon inside it is decorative (the default when it has no title).
  document.getElementById('toolbar').innerHTML = Object.entries(actions)
    .map(([icon, label]) => `<button type="button" aria-label="${label}">${renderIconSvg(icon, { size: 18 })}</button>`)
    .join('');
</script>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/icons/docs/images/toolbar.png" alt="A toolbar of six square buttons holding the bold, italic, underline, link, image and undo icons" width="294">
</p>

With a bundler, `import { renderIconSvg } from '@editora/icons'` does the same. Icons are drawn 15 pixels wide unless you
ask for a size, and they take the text colour of the element they are in (`currentColor`), so they follow the button's
hover and dark-mode colours without any extra work.

## Find an icon

`listIcons()` has every name, `hasIcon(name)` tells you whether one exists and `listIconAliases()` maps each alias to
its icon. A name is matched without regard to case, and spaces and underscores count as dashes: `Chart Line`,
`chart_line` and `chart-line` are the same icon. `renderIconSvg` returns an empty string for a name it does not know, so
a typo draws nothing rather than throwing.

```ts
import { listIconAliases, listIcons, renderIconSvg } from '@editora/icons';

const names = listIcons();

// Every alias points at an icon: 'tick' and 'done' are other names for 'check'.
const aliasesOf = new Map<string, string[]>();
for (const [alias, target] of Object.entries(listIconAliases())) {
  aliasesOf.set(target, [...(aliasesOf.get(target) ?? []), alias]);
}

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .catalog input { box-sizing: border-box; width: 100%; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 8px; font: 15px system-ui, sans-serif; }
    .catalog .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); grid-auto-rows: 76px; gap: 8px; max-height: 328px; margin-top: 12px; overflow: auto; }
    .catalog .cell { display: grid; justify-items: center; align-content: center; gap: 8px; min-width: 0; border-radius: 8px; color: #24292f; background: #f6f8fa; font: 11px ui-monospace, monospace; }
    .catalog .cell span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  </style>
  <div class="catalog">
    <input type="search" placeholder="Search ${names.length} icons" aria-label="Search icons" />
    <div class="grid"></div>
  </div>`;

const grid = root.querySelector('.grid')!;
const show = (query: string) => {
  const q = query.trim().toLowerCase();
  const matches = names.filter((name) => !q || name.includes(q) || (aliasesOf.get(name) ?? []).some((alias) => alias.includes(q)));
  grid.innerHTML = matches
    .map((name) => `<div class="cell" title="${name}">${renderIconSvg(name, { size: 28 })}<span>${name}</span></div>`)
    .join('');
};

root.querySelector('input')!.addEventListener('input', (event) => show((event.target as HTMLInputElement).value));
show('');
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/icons/docs/images/catalog.png" alt="The icon catalog: a search box and a grid of icons, each with its name under it" width="760">
</p>

## Style an icon

```ts
import { renderIconSvg, type IconRenderOptions } from '@editora/icons';

const samples: Array<[label: string, name: string, options: IconRenderOptions]> = [
  ['default', 'bell', {}],
  ['size: 40', 'bell', { size: 40 }],
  ['color', 'bell', { size: 40, color: '#2563eb' }],
  ['iconWeight: thin', 'bell', { size: 40, iconWeight: 'thin' }],
  ['iconWeight: bold', 'bell', { size: 40, iconWeight: 'bold' }],
  ['strokeWidth: 2.5', 'bell', { size: 40, strokeWidth: 2.5 }],
  ['variant: solid', 'bell', { size: 40, variant: 'solid', color: '#2563eb' }],
  ['variant: duotone', 'shield', { size: 40, variant: 'duotone', color: '#2563eb', secondaryColor: '#93c5fd' }],
  ['arrow-right', 'arrow-right', { size: 40 }],
  ['rotate: 90', 'arrow-right', { size: 40, rotate: 90 }],
  ['flip: horizontal', 'arrow-right', { size: 40, flip: 'horizontal' }],
  ['rtl: true', 'arrow-right', { size: 40, rtl: true }],
];

document.getElementById('editor')!.innerHTML = `
  <style>
    .samples { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
    .samples figure { display: grid; grid-template-rows: 40px auto; justify-items: center; align-items: center; gap: 12px; margin: 0; padding: 16px 8px 12px; border: 1px solid #d0d7de; border-radius: 10px; color: #24292f; }
    .samples figcaption { font: 12px ui-monospace, monospace; color: #57606a; }
  </style>
  <div class="samples">
    ${samples.map(([label, name, options]) => `<figure>${renderIconSvg(name, options)}<figcaption>${label}</figcaption></figure>`).join('')}
  </div>`;
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/icons/docs/images/options.png" alt="Twelve bordered cells, each with an icon and the option that produced it: default, size 40, color, thin, bold and 2.5 stroke width bells, a solid bell, a duotone shield, an arrow pointing right, rotated 90 degrees, flipped horizontally and mirrored with rtl" width="760">
</p>

Every option of `renderIconSvg(name, options)` and `iconToDataUri(name, options)`:

| Option | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | `'outline' \| 'solid' \| 'duotone'` | `'outline'` | Falls back to `outline` when the icon has no such variant. |
| `size` | `number \| string` | `15` | Width and height: a number of pixels, or a CSS length such as `'1.5rem'`. Anything else is ignored. |
| `color` | `string` | `'currentColor'` | The icon's colour. |
| `secondaryColor` | `string` | `color` | The second colour of a duotone icon. |
| `iconWeight` | `'thin' \| 'regular' \| 'bold'` | `'regular'` | Stroke width 1.25, 1.5 or 1.75. |
| `strokeWidth` | `number` | `1.5` | Stroke width in pixels. Wins over `iconWeight`; a negative or non-numeric value is ignored. |
| `strokeLinecap` | `'butt' \| 'round' \| 'square'` | `'round'` | The ends of lines. |
| `strokeLinejoin` | `'miter' \| 'round' \| 'bevel'` | `'round'` | The corners of lines. |
| `title` | `string` | none | Adds a `<title>` and makes the icon an image with that name. |
| `ariaLabel` | `string` | none | Makes the icon an image with that name, without a `<title>`. |
| `decorative` | `boolean` | `true` unless there is a `title` or `ariaLabel` | `true` hides the icon from screen readers. |
| `rotate` | `number` | `0` | Degrees, clockwise. |
| `flip` | `'horizontal' \| 'vertical' \| 'both'` | none | Mirrors the icon. |
| `rtl` | `boolean` | `false` | Mirrors the icons that point a direction (<!-- mirrored:12 -->12 of them: arrows, chevrons, carets, reply), and no others. |
| `className`, `style` | `string` | none | Set on the `<svg>`. |
| `attrs` | `Record<string, string \| number \| boolean \| undefined>` | none | More attributes for the `<svg>`, such as `data-*`. A name that could break out of the markup, or that starts with `on`, is dropped; values are escaped. |
| `absoluteStrokeWidth` | `boolean` | none | Does nothing: strokes are already the same width on screen at every size. |

## Variants

Every icon has an outline. Solid and duotone are drawn for few of them: <!-- solid:21 -->21 have a solid variant
(`check`, `x`, `bell`, `heart`, `star`, `home`, `lock`, `trash`, `folder`... ) and <!-- duotone:2 -->2 have a duotone one
(<!-- duotone-names:chart-pie, shield -->`chart-pie` and `shield`). Asking for a variant an icon does not have draws
its outline, and `resolveIcon(name, variant)` tells you which one you got.

## Accessibility

An icon without a title or a label is decorative: `aria-hidden="true"` and `role="presentation"`. That is right for an
icon next to text, or inside a button that has its own label, as in the toolbar above. An icon that is the only thing
saying what a control does needs a name:

```ts
renderIconSvg('bell', { title: 'Notifications' });      // role="img" aria-label="Notifications", plus a <title>
renderIconSvg('bell', { ariaLabel: 'Notifications' });  // the same, without the <title> (no tooltip)
renderIconSvg('bell', { decorative: false });           // role="img" aria-label="bell": the icon's own name
renderIconSvg('bell', { title: 'Notifications', decorative: true }); // hidden, whatever the title
```

## Your own icons

An icon is a name, an optional list of aliases and a list of shapes. Shapes without a stroke or a fill are drawn as an
outline in the icon's colour, so a few paths are enough. Once registered, an icon is found by `renderIconSvg`,
`hasIcon` and `listIcons` like the built-in ones. Registering a name that exists replaces that icon.

```ts
import { hasIcon, iconToDataUri, registerIcon, renderIconSvg, type IconDefinition } from '@editora/icons';

// Nodes without a stroke or a fill are drawn as an outline in the icon's colour, so a few paths are enough.
const invoice: IconDefinition = {
  name: 'invoice',
  aliases: ['bill'],
  viewBox: '0 0 24 24',
  variants: {
    outline: {
      nodes: [
        { tag: 'path', attrs: { d: 'M6 3h12v18l-3-2-3 2-3-2-3 2z' } },
        { tag: 'line', attrs: { x1: 9, y1: 8, x2: 15, y2: 8 } },
        { tag: 'line', attrs: { x1: 9, y1: 12, x2: 15, y2: 12 } },
      ],
    },
  },
};

registerIcon(invoice);
console.log(hasIcon('invoice'), hasIcon('bill')); // true true

// As markup, by its name or by an alias...
const markup = renderIconSvg('bill', { size: 32, color: '#2563eb' });

// ...or as a data URI, for an <img> or a CSS background.
const uri = iconToDataUri('invoice', { size: 32, color: '#16a34a' });

document.getElementById('editor')!.innerHTML = `
  <div style="display: flex; align-items: center; gap: 24px">
    <span id="markup">${markup}</span>
    <img id="image" src="${uri}" width="32" height="32" alt="" />
    <span id="background" style="width: 32px; height: 32px; background: url('${uri}') center / contain no-repeat"></span>
  </div>`;
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/icons/docs/images/custom.png" alt="The custom invoice icon three times: as inline markup in blue, then as an image and as a CSS background, both in green" width="192">
</p>

A definition has `name`, `aliases`, `viewBox` (`'0 0 24 24'` unless you say otherwise), `rtlMirror` (let `rtl` mirror
it), `tags`, `categories` and `variants`, which must have an `outline` and may have a `solid` and a `duotone`. Each
variant is `{ nodes }`, and a node is `{ tag, attrs?, children? }` where `tag` is `path`, `circle`, `ellipse`, `line`,
`polyline`, `polygon`, `rect` or `g`. Attribute names can be camelCase (`strokeWidth`). A node with `tone: 'secondary'`
and a `fill` or `stroke` of `'currentColor'` is drawn in `secondaryColor`, which is how a duotone variant has two
colours. `registerIcons(definitions)` registers a list.

## In the Editora UI components

[`@editora/ui-core`](https://www.npmjs.com/package/@editora/ui-core) draws these icons in `<ui-icon>`, and
[`@editora/ui-react`](https://www.npmjs.com/package/@editora/ui-react) and
[`@editora/react-icons`](https://www.npmjs.com/package/@editora/react-icons) in React. They know every icon already, with
no setup, and accept most of these options as attributes or props.

```html
<script type="importmap">
  {
    "imports": {
      "@editora/ui-core": "https://cdn.jsdelivr.net/npm/@editora/ui-core/dist/index.esm.js",
      "@editora/icons": "https://cdn.jsdelivr.net/npm/@editora/icons/dist/index.esm.js"
    }
  }
</script>
<script type="module">
  import '@editora/ui-core';
</script>

<!-- Every icon of @editora/icons is already known to <ui-icon>: there is nothing to register. -->
<div style="display: flex; align-items: center; gap: 20px">
  <ui-icon name="bell" size="28"></ui-icon>
  <ui-icon name="bell" size="28" icon-variant="solid" color="#2563eb"></ui-icon>
  <ui-icon name="chart-pie" size="28" icon-variant="duotone" color="#2563eb" secondary-color="#93c5fd"></ui-icon>
  <ui-icon name="bell" size="28" icon-weight="bold"></ui-icon>
  <ui-icon name="arrow-right" size="28" rotate="90"></ui-icon>
  <ui-icon name="bell" size="28" label="Notifications"></ui-icon>
</div>
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/icons/docs/images/ui-icon.png" alt="Six icons drawn by ui-icon: a bell, a solid blue bell, a duotone blue pie chart, a bold bell, an arrow rotated to point down and a bell with a label" width="316">
</p>

An icon you register with this package is found by those components too. Do not register the whole catalog with
ui-core yourself (`registerWithEditoraUI(registerIcon)`): its registry wins over the built-in icons, and every
`<ui-icon>` would then draw the plain outline, whatever its `icon-variant` or `icon-weight`.

## API

| Export | What it does |
| --- | --- |
| `renderIconSvg(name, options?)` | The icon as an `<svg>` string, or `''` if there is no such icon. |
| `iconToDataUri(name, options?)` | `data:image/svg+xml;utf8,…` for an `<img>` or `url()`, or `''`. |
| `listIcons()` | Every icon name, sorted, without aliases. |
| `listIconAliases()` | `{ alias: name }` for every alias. |
| `hasIcon(name)` | Whether the name, or an alias, is an icon. |
| `getIcon(name)` | The icon's definition, or `undefined`. |
| `resolveIcon(name, variant?)` | `{ definition, viewBox, variant, glyph }`: the variant that will be drawn, which is `outline` if the one asked for is missing. |
| `registerIcon(definition)`, `registerIcons(definitions)` | Add icons, or replace them. |
| `iconDefinitions`, `iconNameList` | The built-in catalog as data, and its names. |
| `normalizeIconSize(size, fallback?)` | The size `renderIconSvg` would draw: a positive number or CSS length, else the fallback. |
| `registerWithEditoraUI(register)` | Calls `register(name, svg)` once for every icon, with its outline as markup: for an icon store of your own. |

The types are `IconDefinition`, `IconGlyph`, `IconNode`, `IconTag`, `IconAttrValue`, `IconRenderOptions`, `IconVariant`,
`IconWeight` and `ResolvedIcon`.

## Size and where it runs

The catalog is one module: importing anything from the package, even `hasIcon`, brings all 504 icons. `renderIconSvg`
alone is about 138 KB minified and 48 KB gzipped (there is no per-icon import to tree-shake). If you need a handful of icons on a
size-sensitive page, render them once and keep the strings.

Nothing in the package touches the DOM, so it also runs in Node and on the server, and the `<svg>` strings are the same
everywhere. `require('@editora/icons')` works from Node 14. A bare `import` in a Node ES module needs Node 22.12 or
later, because older versions cannot load the package's ES module build: use `require` there, or a bundler, which is
how a Next.js or Vite server build imports it.

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
