# Theming

Editora supports a token-driven theming model across editor content and plugin UI.

## Built-in themes

- `editora-theme-default`
- `editora-theme-dark`
- `editora-theme-acme`

## Apply theme

### Web component

```html
<editora-editor theme="dark"></editora-editor>
```

### React

```tsx
import { EditoraEditor } from '@editora/react';
import { BoldPlugin, ItalicPlugin } from '@editora/plugins';

<div className="editora-theme-dark">
  <EditoraEditor
    plugins={[BoldPlugin(), ItalicPlugin()]}
    placeholder="Start writing..."
  />
</div>
```

## Custom theme workflow

1. Start from default theme tokens
2. Override semantic variables first:
   - surfaces/backgrounds
   - text/foreground
   - borders/dividers
   - accent/interactive states
3. Validate plugin UI surfaces:
   - color pickers
   - dialogs
   - comments/spell-check sidebars
   - floating toolbar
4. Validate table/code readability in dark mode

## API Surface

- Theme scope selectors (class/data-attribute scope)
- CSS token overrides for editor/plugin surfaces
- Theme selection via runtime props/attributes

## Config Matrix

| Integration | Config | Purpose |
| --- | --- | --- |
| Web component | `theme="..."` | Per-editor theme selection |
| React | scoped class/data-theme | App/tree-level theme scope |
| CSS token layer | `--rte-*` variables | Fine-grained visual customization |

## Validation Checklist

- Icon contrast is readable
- Disabled states are distinguishable
- Hover/focus states are visible
- Scrollable panels remain legible
- Multi-instance pages can run mixed themes safely
