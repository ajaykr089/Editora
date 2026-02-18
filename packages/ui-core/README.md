# @editora/ui-core

Lightweight core for Editora UI: web components, tiny reactivity primitives, and small primitives.

This package provides:
- `createSignal`, `effect`, `computed` (minimal)
- `ElementBase` base class for simple web components
- a small `ui-button` primitive

Button notes:
- Animations are opt-in. Set the `animation` attribute (`scale`, `pulse`, or `none`) on `ui-button` or via the React wrapper prop `animation` to enable hover/press effects. The default is no animation.

Sizing & customization:
- Use CSS variables to adjust button dimensions and styling without changing component code.
  - `--ui-min-height` — sets the button's minimum height (default 36px).
  - `--ui-width` — optionally set a fixed width (default `auto`).
  - `--ui-padding` — already available to change inner spacing.
  - `--ui-radius` — controls border-radius (set to `0` to remove rounded corners).
  - `--ui-border` — controls the secondary button border (set to `none` to remove border).

Examples:
- Remove border radius + border (web component):
  ```html
  <ui-button style="--ui-radius:0; --ui-border:none">Flat</ui-button>
  ```
- React wrapper (remove border and set height):
  ```tsx
  <Button style={{ '--ui-radius': '0', '--ui-border': 'none', '--ui-min-height': '44px' } as React.CSSProperties}>Flat</Button>
  ```

Advanced — full-style overrides
- Use `::part(button)` when you need to target the inner native button inside the Shadow DOM without switching to `headless`.
- Use `headless` for full CSS control and custom markup when you want to manage every style yourself.

Override example — `::part(button)` (recommended)

You can fully override the button's inner styles from your global stylesheet (or CSS module) using the exported `part="button"`.

```css
/* global stylesheet or CSS module (React: :global or similar) */
ui-button::part(button) {
  /* reset base styles (optional) */
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  /* layout */
  padding: 12px 20px;
  min-height: 48px;           /* override default height */
  width: 220px;              /* fixed width (or use max-width) */

  /* visual */
  background: linear-gradient(90deg,#7c3aed,#ec4899);
  color: #fff;
  border-radius: 0;          /* remove rounded corners */
  border: none;              /* remove border */
  box-shadow: none;
}

/* Variant-specific override (optional) */
ui-button[variant="secondary"]::part(button) {
  background: transparent;
  border: 2px dashed #ccc; /* custom border for secondary */
}
```

React example (global CSS or CSS-in-JS):

```tsx
// global.css
// ui-button::part(button) { ... }

// In React
<Button>Default</Button>
<Button style={{ '--ui-min-height': '56px' } as React.CSSProperties}>Taller</Button>
```

Notes
- `::part(button)` is the safest way to style the internal button while keeping the component API intact (it respects Shadow DOM encapsulation).
- If you want to remove *all* built-in styles, use `headless` and supply your own styles/markup.
- Prefer CSS variables (`--ui-padding`, `--ui-min-height`, `--ui-border`, `--ui-radius`) for small, theme-friendly tweaks.

Usage (browser):

1. Import the built bundle or TypeScript module into your app.
2. Use `<ui-button>` directly in HTML.

Build (development):

Install dev deps in package root and run build:

```
cd packages/ui-core
npm install
npm run build
```

This creates `dist/index.esm.js` and `dist/index.cjs.js` bundles.
