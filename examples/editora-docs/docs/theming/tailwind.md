---
title: "Tailwind CSS"
description: "Use Editora's theme tokens as Tailwind colours, radius and fonts, and style component parts and states with Tailwind classes."
keywords: [tailwind, tailwindcss, tokens, theming, parts]
---

# Tailwind CSS

`@editora/ui-core` (0.8.0 and later) ships Tailwind support, so markup you style with Tailwind and Editora's components share one theme. Change the theme (`ThemeProvider`, `applyTheme`, dark mode) and both follow.

## Setup

**Tailwind v4.** In your CSS, after Tailwind:

```css
@import "tailwindcss";
@import "@editora/ui-core/tailwind.css";
```

**Tailwind v3.** Add the preset in `tailwind.config.js`:

```js
const { editoraPreset } = require('@editora/ui-core/tailwind');

module.exports = {
  presets: [editoraPreset],
  content: ['./src/**/*.{ts,tsx,html}'],
};
```

## What you get

| Tailwind | Reads |
| --- | --- |
| `bg-ui-surface`, `text-ui-text`, `border-ui-border`, `bg-ui-primary`, `text-ui-muted`, `text-ui-danger-text`, `bg-ui-chart-1` … | the `--ui-color-*` and `--ui-chart-*` tokens (all 39 colours: surfaces, text, lines, fills, primary, accent, status colours and their text variants, focus ring, chart palette) |
| `rounded-ui`, `rounded-ui-control`, `rounded-ui-control-sm` | `--ui-radius`, `--ui-control-radius-*` |
| `font-ui`, `font-ui-heading`, `font-ui-mono` | `--ui-font-family*` |
| `shadow-ui-sm`, `shadow-ui-md`, `shadow-ui-lg` | `--ui-shadow-*` |

In Tailwind v4, opacity modifiers work on them too (`bg-ui-primary/10`, made with `color-mix()`). Tailwind v3 cannot apply an opacity modifier to a CSS variable colour; use `bg-ui-accent-subtle` or a `color-mix()` arbitrary value instead.

```tsx
<aside className="rounded-ui border border-ui-border bg-ui-surface p-4 text-ui-text shadow-ui-sm">
  <h2 className="font-ui-heading text-ui-text-strong">Billing</h2>
  <p className="text-sm text-ui-muted">Your plan renews on 1 March.</p>
</aside>
```

## Styling the components

Editora's components draw their insides in a shadow root, which utility classes cannot reach. A class on a component styles its outer box (`className="w-full mt-4"` works as on any element). For the inside there are two ways:

**Parts.** Each component exposes named parts (listed on its API page, for example `button` on `Button`). Tailwind v3 with the preset: `part-[button]:rounded-full`. Tailwind v4: an arbitrary variant, `[&::part(button)]:rounded-full`.

```tsx
<Button className="part-[button]:rounded-full part-[button]:px-6">Save</Button>
```

**Custom properties.** Most looks are custom properties on the component (`--ui-btn-radius`, `--ui-input-border-color`, `--ui-chart-1` …), which an arbitrary property sets: `[--ui-btn-radius:9999px]`.

**States.** Variants that match the attributes the components set: `ui-open:`, `ui-closed:`, `ui-disabled:`, `ui-invalid:`, `ui-checked:`, `ui-selected:`, `ui-loading:`.

```tsx
<Dialog className="ui-open:shadow-ui-lg">…</Dialog>
```

## Owning the code

To change a component beyond its parts and properties, copy its source into your project with `npx @editora/cli add button --copy` (see the [CLI](../reference/cli)).
