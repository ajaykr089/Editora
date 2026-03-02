---
title: Examples Cookbook
description: Practical integration patterns for web components and framework wrappers.
keywords: [editora, documentation]
---

# Examples Cookbook

Practical integration patterns for web components and framework wrappers.

## Bundle strategy

### Core bundle (lighter)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent-core.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent-core.min.css" />
```

### Full bundle (extended plugin surface)

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@editora/core/dist/webcomponent.min.css" />
```

## Web component example

```html
<editora-editor
  plugins="bold italic underline history"
  toolbar-items="bold italic underline | undo redo"
  height="320"
  autosave='{"enabled":true,"intervalMs":3000,"storageKey":"example-doc"}'
  security='{"sanitizeOnPaste":true,"sanitizeOnInput":true}'
  accessibility='{"enableARIA":true,"keyboardNavigation":true}'
  performance='{"debounceInputMs":120,"viewportOnlyScan":true}'
></editora-editor>
```

## React example

```tsx
import { EditoraEditor } from "@editora/react";
import { BoldPlugin, ItalicPlugin, HeadingPlugin, HistoryPlugin } from "@editora/plugins";
import "@editora/plugins/styles.css";
import "@editora/themes/themes/default.css";

function MyEditor() {
  const [content, setContent] = useState("<p>Start writing...</p>");

  return (
    <EditoraEditor
      value={content}
      onChange={setContent}
      plugins={[BoldPlugin(), ItalicPlugin(), HeadingPlugin(), HistoryPlugin()]}
    />
  );
}
```

## Framework patterns

- Vue/Angular/Svelte can consume the web component directly
- React can use web component integration or `@editora/react`

## Runtime controls examples

- Autosave: interval + storage key
- Security: sanitize on paste/input
- Accessibility: ARIA + keyboard support
- Performance: debounce + viewport-only scanning

## Event handling pattern

- Subscribe to content changes to sync state
- Capture focus/blur for UI transitions
- Track selection changes when context-aware toolbars are enabled

## API Surface

| Surface | Type | Notes |
| --- | --- | --- |
| `@editora/core/dist/webcomponent-core.js` | Bundle entry | Lightweight web component runtime path |
| `@editora/core/dist/webcomponent.js` | Bundle entry | Full-feature web component runtime path |
| `<editora-editor ...>` | Web component API | Declarative setup and runtime config updates |
| `EditoraEditor` + plugin factories | React API | Component-driven integration pattern |
| Runtime config blocks (`autosave/security/accessibility/performance`) | Operational API | Cross-integration behavior tuning |

## Config Matrix

| Scenario | Recommended Config |
| --- | --- |
| Lightweight docs editor | Core bundle + essential plugins |
| Full authoring suite | Full bundle + advanced plugins |
| Large documents | Debounced updates + viewport scan tuning |

## Validation Checklist

- Bundles resolve and load expected features
- Runtime config values apply at startup and update time
- Event handlers receive expected editor updates
- Multi-instance behavior remains isolated
