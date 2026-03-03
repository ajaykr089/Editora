# @editora/version-diff

`@editora/version-diff` compares baseline and current editor content in an accessible diff dialog.

## Features

- Native framework-agnostic implementation (no React dependency)
- Works in React (Vite/CRA) and web components without modifications
- Inline and side-by-side diff views
- Word-level and line-level modes
- Optional whitespace normalization
- Keyboard shortcuts: `Ctrl/Cmd + Alt + D` (fallback: `F8`)
- Accessible dialog (`role=dialog`, focus trap, `Esc` to close, tab navigation)
- Light/dark theme support
- Multi-instance safe baseline storage

## Install

```bash
npm install @editora/version-diff
```

## Usage (React)

```ts
import { EditoraEditor } from '@editora/react';
import { VersionDiffPlugin, BoldPlugin, HistoryPlugin } from '@editora/plugins';

const plugins = [
  BoldPlugin(),
  HistoryPlugin(),
  VersionDiffPlugin({
    mode: 'word',
    ignoreWhitespace: true,
  }),
];

<EditoraEditor plugins={plugins} />;
```

## Usage (Web Component)

```html
<editora-editor id="editor"></editora-editor>
<script>
  const editor = document.getElementById('editor');
  editor.setConfig({
    plugins: 'bold history versionDiff',
    toolbar: { items: 'bold undo redo | versionDiff' },
    pluginConfig: {
      versionDiff: {
        mode: 'line',
        ignoreWhitespace: false,
      },
    },
  });
</script>
```

Aliases accepted: `versionDiff`, `version-diff`, `versiondiff`.

## Commands

- `openVersionDiff` - opens the diff dialog
- `setVersionDiffBaseline` - set baseline HTML for the active editor

Example baseline set command:

```ts
(window as any).executeEditorCommand?.('setVersionDiffBaseline', {
  html: '<h2>Baseline Version</h2><p>Original content</p>',
});
```

## Keyboard Shortcuts

- `Ctrl/Cmd + Alt + D` - open version diff dialog
- `F8` - open version diff dialog (fallback when modifier combo is blocked)
- `Esc` (inside dialog) - close dialog
- `Tab` / `Shift+Tab` - focus navigation inside dialog
- `ArrowLeft` / `ArrowRight` on tab buttons - switch diff view tabs

## Advanced Usage

### Dynamic Baseline from API or storage

```ts
VersionDiffPlugin({
  async getBaselineHtml({ editorRoot }) {
    const documentId = editorRoot.getAttribute('data-doc-id');
    const res = await fetch(`/api/docs/${documentId}/baseline`);
    if (!res.ok) return '';
    const json = await res.json();
    return json.html || '';
  },
});
```

### Pre-seeded baseline

```ts
VersionDiffPlugin({
  baselineHtml: '<h1>Approved Version</h1><p>...</p>',
  mode: 'line',
  ignoreWhitespace: true,
});
```

### Large document tuning

```ts
VersionDiffPlugin({
  maxTokens: 1500,
  maxMatrixSize: 1200000,
});
```

## Edge Cases Covered

- Baseline defaults to initial editor content when available (`data-initial-content`) and falls back to current HTML.
- For very large token sets, plugin automatically uses a fast fallback compare path.
- Closing/reopening dialogs across multiple editors remains isolated and does not leak focus or state.
- Read-only editors are ignored by keyboard shortcut trigger.
