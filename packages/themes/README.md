# @editora/themes

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Themes and design tokens for Editora editor UIs (React wrapper + Web Component).

## Installation

```bash
npm install @editora/themes
```

## Built-in Themes

- `default` (`@editora/themes/themes/default.css`)
- `dark` (`@editora/themes/themes/dark.css`)
- `acme` (`@editora/themes/themes/acme.css`)

## Quick Start

### React

```tsx
import { EditoraEditor } from "@editora/react";
import { BoldPlugin, ItalicPlugin } from "@editora/plugins";

import "@editora/themes/themes/default.css";
import "@editora/themes/themes/acme.css";

export default function App() {
  return (
    <div data-theme="acme">
      <EditoraEditor plugins={[BoldPlugin(), ItalicPlugin()]} />
    </div>
  );
}
```

Use `data-theme="light"`, `data-theme="dark"`, or `data-theme="acme"` on a wrapper.

### Web Component

```html
<link rel="stylesheet" href="/node_modules/@editora/core/dist/webcomponent.min.css" />
<link rel="stylesheet" href="/node_modules/@editora/themes/themes/acme.css" />
<script type="module" src="/node_modules/@editora/core/dist/webcomponent.js"></script>

<editora-editor
  theme="acme"
  plugins="bold italic underline history"
  toolbar-items="undo redo | bold italic underline"
  height="320"
></editora-editor>
```

Use `theme="light"`, `theme="dark"`, or `theme="acme"` on `<editora-editor>`.

## Create A Custom Theme From Scratch

### 1) Start from base theme

Create `my-theme.css` and load `default.css` first:

```css
@import "@editora/themes/themes/default.css";
```

### 2) Scope your theme

Choose one scope that works for both React and Web Component:

```css
:is([data-theme="my-brand"], .editora-theme-my-brand) {
  /* tokens */
}
```

### 3) Override design tokens

Use the real token names used by Editora (`--rte-*`):

```css
:is([data-theme="my-brand"], .editora-theme-my-brand) {
  --rte-color-primary: #1d4ed8;
  --rte-color-primary-hover: #1e40af;
  --rte-color-text-primary: #0f172a;
  --rte-color-text-secondary: #334155;
  --rte-color-text-muted: #64748b;
  --rte-color-bg-primary: #ffffff;
  --rte-color-bg-secondary: #f8fafc;
  --rte-color-bg-tertiary: #e2e8f0;
  --rte-color-border: #cbd5e1;
  --rte-color-border-light: #dbe3ee;
  --rte-color-border-focus: #1d4ed8;
  --rte-shadow: 0 6px 16px rgba(15, 23, 42, 0.1);
  --rte-shadow-lg: 0 16px 28px rgba(15, 23, 42, 0.16);
}
```

### 4) Add component overrides

Tokens handle most styling, but buttons/dropdowns/content usually need explicit overrides:

```css
:is([data-theme="my-brand"], .editora-theme-my-brand) :is(.rte-toolbar, .editora-toolbar) {
  background: #f4f8ff;
  border-color: var(--rte-color-border);
}

:is([data-theme="my-brand"], .editora-theme-my-brand) :is(.rte-toolbar-button, .editora-toolbar-button) {
  background: #ffffff;
  border-color: var(--rte-color-border);
  color: var(--rte-color-text-secondary);
}

:is([data-theme="my-brand"], .editora-theme-my-brand) :is(.rte-content, .editora-content) {
  background: #ffffff;
  color: var(--rte-color-text-primary);
}
```

### 5) Load and activate the theme

- React: import CSS + set wrapper `data-theme="my-brand"`.
- Web Component: include CSS + set `theme="my-brand"` on `<editora-editor>`.

## Modify An Existing Theme

### Option A: Extend dark theme

```css
@import "@editora/themes/themes/default.css";
@import "@editora/themes/themes/dark.css";

:is([data-theme="dark"], .editora-theme-dark) {
  --rte-color-primary: #22d3ee;
  --rte-color-primary-hover: #06b6d4;
}

:is([data-theme="dark"], .editora-theme-dark) .rte-toolbar-button {
  border-radius: 8px;
}
```

### Option B: Extend acme theme

```css
@import "@editora/themes/themes/default.css";
@import "@editora/themes/themes/acme.css";

:is([data-theme="acme"], .editora-theme-acme) {
  --rte-color-primary: #7c3aed;
  --rte-color-primary-hover: #6d28d9;
}
```

### Safe override strategy

1. Keep selectors scoped (`[data-theme="..."]` / `.editora-theme-...`).
2. Prefer token overrides first, component selectors second.
3. Override both React and Web Component class names where needed:
   - React classes: `.rte-*`
   - Web Component classes: `.editora-*`

## New `acme` Theme Notes

`acme.css` is intentionally shared across both renderers:

- React support via `[data-theme="acme"]`
- Web Component support via `.editora-theme-acme` (set automatically from `theme="acme"`)

## Verification Checklist

After adding/changing a theme, verify:

1. Toolbar buttons (normal/hover/active/disabled)
2. Dropdown menus and inputs (including font-size input placeholder)
3. Editor content colors + placeholder visibility
4. Status bar + floating toolbar
5. Dialogs and plugin overlays in both light/dark/custom scopes
6. Multi-instance behavior with different themes on the same page

## License

MIT
