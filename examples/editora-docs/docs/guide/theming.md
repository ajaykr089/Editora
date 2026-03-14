---
title: "Theming"
description: Token-driven theming guide for default, dark, and custom Editora visual systems.
keywords: [editora, documentation, theming]
---

# Theming

Token-driven theming guide for default, dark, and custom Editora visual systems.

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

| Surface | Type | Notes |
| --- | --- | --- |
| Theme scope selectors | Styling API | Class/data-attribute scoping for per-editor or app-level themes |
| `theme=\"...\"` (web component) | Declarative API | Per-instance theme selection |
| Scoped wrapper class (React/app shell) | Integration API | Per-tree theme selection in framework layouts |
| CSS token overrides (`--rte-*`) | Customization API | Semantic color/spacing/interaction adjustments |
| `@editora/themes` utilities | Runtime API | Programmatic theme set/toggle/apply helpers |

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
