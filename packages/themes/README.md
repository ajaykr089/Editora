<h1 align="center">@editora/themes</h1>

<p align="center">
  Light, dark and acme themes for the Editora editors, the helpers to switch between them, and a recipe for your own.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@editora/themes"><img src="https://img.shields.io/npm/v/@editora/themes.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@editora/themes"><img src="https://img.shields.io/npm/dm/@editora/themes.svg" alt="npm downloads"></a>
  <a href="https://github.com/ajaykr089/Editora/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@editora/themes.svg" alt="license"></a>
  <a href="https://www.npmjs.com/package/@editora/themes"><img src="https://img.shields.io/npm/types/@editora/themes.svg" alt="TypeScript types included"></a>
</p>

<p align="center">
  <a href="https://editora-ecosystem.netlify.app/">Website</a> ·
  <a href="https://editora-ecosystem-storybook.netlify.app/">Storybook</a> ·
  <a href="https://github.com/ajaykr089/Editora">GitHub</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/themes/docs/images/themes.png" alt="Three editors, one under each theme: light, dark, and acme with a pale blue toolbar" width="900">
</p>

## Features

- **Three themes**: `light`, `dark` and `acme`, plain CSS files you import.
- **Scoped, not global.** A theme applies to everything inside an element that carries it, so two editors on one page
  can use different themes.
- **One set of themes for React and the web component.** React uses `data-theme="..."`; `<editora-editor>` uses
  `theme="..."` and adds a matching class.
- **Helpers** to switch the whole page between light and dark.
- **A recipe for your own theme**, tested in both renderers.
- The same `--rte-*` design tokens also theme [`@editora/markdown-editor`](https://www.npmjs.com/package/@editora/markdown-editor).

## Install

```bash
npm install @editora/themes
```

## Use a theme

### React

Import the theme files you need, then put `data-theme` on any element around the editor:

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin, LinkPlugin, ListPlugin, UnderlinePlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/themes/themes/acme.css';
import '@editora/plugins/styles.css';

const plugins = [BoldPlugin(), ItalicPlugin(), UnderlinePlugin(), ListPlugin(), LinkPlugin(), HistoryPlugin()];
const text = (name: string) => `<p>The <strong>${name}</strong> theme, with a toolbar, text and a <a href="#">link</a>.</p>`;

// Put data-theme on any element: everything inside it follows that theme.
export default function ThemeGallery() {
  return (
    <>
      <div data-theme="light">
        <EditoraEditor defaultValue={text('light')} plugins={plugins} content={{ minHeight: 70 }} />
      </div>
      <div data-theme="dark">
        <EditoraEditor defaultValue={text('dark')} plugins={plugins} content={{ minHeight: 70 }} />
      </div>
      <div data-theme="acme">
        <EditoraEditor defaultValue={text('acme')} plugins={plugins} content={{ minHeight: 70 }} />
      </div>
    </>
  );
}
```

| Theme | File | Scope |
| --- | --- | --- |
| `light` | `@editora/themes/themes/default.css` | The default; also the base the other two sit on, so always import it. |
| `dark` | `@editora/themes/themes/dark.css` | `data-theme="dark"` or `.editora-theme-dark` |
| `acme` | `@editora/themes/themes/acme.css` | `data-theme="acme"` or `.editora-theme-acme` |

### Web component

`<editora-editor>` has a `theme` attribute. Its own stylesheet already contains the light and dark themes; load
`acme.css` as well to use acme:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/themes/src/themes/acme.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>

<editora-editor
  theme="acme"
  plugins="bold italic underline history"
  toolbar="undo redo | bold italic underline"
  height="240"
>
  <p>This editor uses the acme theme.</p>
</editora-editor>
```

Set the attribute again to switch: `editor.setAttribute('theme', 'dark')`. The element adds the class
`editora-theme-<name>` to itself, which is why a theme scope lists both a `data-theme` selector and a class.

## Switch the page theme

The helpers set `data-theme` on `<html>` (and toggle a `dark` class), so every editor on the page follows:

```tsx
import { useState } from 'react';
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin } from '@editora/plugins/lite';
import { getCurrentTheme, toggleTheme } from '@editora/themes';

import '@editora/themes/themes/default.css';
import '@editora/themes/themes/dark.css';
import '@editora/plugins/styles.css';

const plugins = [BoldPlugin(), ItalicPlugin(), HistoryPlugin()];

// toggleTheme() switches the whole page between light and dark and returns the new theme.
export default function ThemeToggle() {
  const [theme, setTheme] = useState(getCurrentTheme());

  return (
    <>
      <button onClick={() => setTheme(toggleTheme())}>Theme: {theme}</button>
      <EditoraEditor defaultValue="<p>This editor follows the page theme.</p>" plugins={plugins} />
    </>
  );
}
```

| Helper | |
| --- | --- |
| `setGlobalTheme(name)` | Sets the theme of the whole page (`light`, `dark` or `acme`). |
| `getCurrentTheme()` | The page theme; `light` when none is set. |
| `toggleTheme()` | Switches between light and dark, and returns the new theme. |
| `isDarkTheme()` / `isLightTheme()` | Whether the page theme is dark or light. |
| `applyTheme(element, name)` | Sets the theme of one element and everything inside it. |

`themes` (the three names) and the `ThemeName` type are exported too.

## Make your own theme

A theme is a stylesheet whose rules are scoped to a name. The built-in themes read a set of `--rte-*` design tokens,
but the tokens only set **text, border and shadow colours**; backgrounds, hover and active states are set by rules, so
a theme sets both. This one is a complete theme in 40 lines:

```css
/* The scope: React uses data-theme, the web component adds a class named after its theme attribute. */
:is([data-theme="my-brand"], .editora-theme-my-brand) {
  --rte-color-primary: #4f46e5;
  --rte-color-text-primary: #1e1b4b;
  --rte-color-text-secondary: #3730a3;
  --rte-color-border: #c7d2fe;
  --rte-color-border-focus: #4f46e5;
}

/* Tokens set the text and the borders. Backgrounds are set by the rules below. */
:is([data-theme="my-brand"], .editora-theme-my-brand) :is(.rte-editor, .editora-editor) {
  background: #fafaff;
  border-color: var(--rte-color-border);
  color: var(--rte-color-text-primary);
}

:is([data-theme="my-brand"], .editora-theme-my-brand) :is(.rte-toolbar, .editora-toolbar) {
  background: #eef2ff;
  border-color: var(--rte-color-border);
}

:is([data-theme="my-brand"], .editora-theme-my-brand) :is(.rte-toolbar-button, .editora-toolbar-button) {
  background: #ffffff;
  border-color: var(--rte-color-border);
  color: var(--rte-color-text-secondary);
}

:is([data-theme="my-brand"], .editora-theme-my-brand) :is(.rte-toolbar-button, .editora-toolbar-button):hover {
  background: #e0e7ff;
}

:is([data-theme="my-brand"], .editora-theme-my-brand)
  :is(.rte-toolbar-button, .editora-toolbar-button):is(:active, [data-active="true"], .active) {
  background: var(--rte-color-primary);
  border-color: var(--rte-color-primary);
  color: #ffffff;
}

:is([data-theme="my-brand"], .editora-theme-my-brand) :is(.rte-content, .editora-content) {
  background: #ffffff;
  color: var(--rte-color-text-primary);
}
```

Each rule lists a React class (`.rte-*`) and a web component class (`.editora-*`), so one file themes both. Import it
after `default.css` and switch it on:

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin, LinkPlugin, ListPlugin } from '@editora/plugins/lite';

import '@editora/themes/themes/default.css';
import '@editora/plugins/styles.css';
import './my-brand.css';

const plugins = [BoldPlugin(), ItalicPlugin(), ListPlugin(), LinkPlugin(), HistoryPlugin()];

export default function BrandedEditor() {
  return (
    <div data-theme="my-brand">
      <EditoraEditor
        defaultValue="<h2>Our own look</h2><p>Select <strong>this text</strong> and the buttons show the brand colour.</p>"
        plugins={plugins}
      />
    </div>
  );
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/ajaykr089/Editora/main/packages/themes/docs/images/custom-theme.png" alt="An editor in a custom indigo theme: a pale indigo toolbar with the Bold button filled in the brand colour, above a heading and a paragraph" width="900">
</p>

For the web component, load the same file and use the name: `<editora-editor theme="my-brand" ...>`.

To restyle every part (dropdowns, dialogs, the status bar), copy
[`acme.css`](https://github.com/ajaykr089/Editora/blob/main/packages/themes/src/themes/acme.css) as the starting point,
rename its scope and change the values: it is the smallest complete theme and about 200 lines.

## Change a built-in theme

In React, load your rules after the theme and scope them the same way. The tokens change text and borders; use a rule
for the rest. Save this as `dark-brand.css`:

```css
@import "@editora/themes/themes/default.css";
@import "@editora/themes/themes/dark.css";

:is([data-theme="dark"], .editora-theme-dark) {
  --rte-color-border: #22d3ee;
}

:is([data-theme="dark"], .editora-theme-dark) .rte-toolbar-button {
  border-radius: 8px;
}
```

and import it instead of the theme files:

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, HistoryPlugin, ItalicPlugin } from '@editora/plugins/lite';

import '@editora/plugins/styles.css';
import './dark-brand.css'; // the file above: it imports default.css and dark.css, then changes them

export default function DarkBrand() {
  return (
    <div data-theme="dark">
      <EditoraEditor defaultValue="<p>The dark theme, with a cyan border.</p>" plugins={[BoldPlugin(), ItalicPlugin(), HistoryPlugin()]} />
    </div>
  );
}
```

Keep your selectors scoped to the theme, so they do not leak into other editors on the page. The web component's dark
theme comes from its own stylesheet, not from this package, so these rules do not change it.

## Check a theme

Look at these in every theme you add or change: toolbar buttons (normal, hover, active, disabled), dropdowns and
inputs, the editing area and its placeholder, the status bar and floating toolbar, dialogs and plugin panels, and two
editors with different themes on one page.

## The rest of the family

| Package | |
| --- | --- |
| [`@editora/react`](https://www.npmjs.com/package/@editora/react) | The editor as a React component. |
| [`@editora/core`](https://www.npmjs.com/package/@editora/core) | The `<editora-editor>` web component. |
| [`@editora/plugins`](https://www.npmjs.com/package/@editora/plugins) | More than fifty plugins. |

## License

MIT © [Ajay Kumar](https://github.com/ajaykr089)
