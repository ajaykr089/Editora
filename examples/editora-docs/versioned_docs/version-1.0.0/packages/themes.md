# @editora/themes

Theme package for consistent editor and plugin UI styling.

## Built-in themes

- `default`
- `dark`
- `acme`

## Usage

```ts
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css"; // optional override
import "@editora/themes/themes/acme.css"; // optional override
```

Load `default.css` first, then optional override themes.
If using `@editora/plugins`, also import `@editora/plugins/styles.css` for plugin UI surfaces.

## Surfaces covered

- Toolbar, dropdowns, and grouped controls
- Content area typography and backgrounds
- Statusbar and floating toolbar
- Dialogs, overlays, and side panels
- Plugin-specific UI surfaces (pickers, comments, spell-check)

## Custom theme workflow

1. Start from default tokens
2. Override semantic colors and spacing first
3. Validate icons and text contrast in dark mode
4. Validate multi-instance behavior when themes differ per editor
5. Verify scrollable sidebars/dialogs and focus states

## API Surface

- Theme CSS bundles (`default`, `dark`, `acme`)
- Shared token stylesheet (`index.css`)

## Config Matrix

| Scope | Config | Purpose |
| --- | --- | --- |
| Web component | `theme="..."` | Per-editor theme selection |
| React/app shell | theme class or `data-theme` scope | Per-tree theme selection |
| CSS variables | token overrides | Custom brand/theme control |

## Validation Checklist

- Toolbar/statusbar/dialog visual parity across themes
- Icon contrast is readable in dark mode
- Placeholder/content text contrast is accessible
- Multi-instance pages can mix themes without style leakage
